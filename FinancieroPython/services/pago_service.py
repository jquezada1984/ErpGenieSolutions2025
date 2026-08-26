"""Cobros cliente y pagos a proveedor: aplican facturas y mueven banco al validar."""
from __future__ import annotations

from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, List
from uuid import uuid4

from marshmallow import ValidationError
from sqlalchemy import text
from utils.db import db
from models.pago import Pago
from models.pago_factura import PagoFactura
from schemas.pago_schema import CrearPagoSchema
from services.rabbit_publisher import publish_pago_registrado

TIPO_COBRO = 'COBRO'
TIPO_PAGO_PROVEEDOR = 'PAGO_PROVEEDOR'


def _money(v: Any) -> Decimal:
    return Decimal(str(v or 0)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


def _scalar(sql, params):
    return db.session.execute(text(sql), params).scalar()


def _siguiente_numero(id_empresa: str, prefijo: str, fecha) -> str:
    count = _scalar(
        """SELECT COUNT(*) FROM pago
           WHERE id_empresa = CAST(:e AS uuid)
             AND tipo_pago = :t
             AND EXTRACT(YEAR FROM fecha_pago) = :y""",
        {'e': id_empresa, 't': TIPO_COBRO if prefijo == 'COB' else TIPO_PAGO_PROVEEDOR, 'y': fecha.year},
    ) or 0
    return f'{prefijo}-{fecha.year}-{str(int(count) + 1).zfill(6)}'


def _pendiente_factura(id_factura: str, excluir_pago: str | None = None) -> Decimal:
    extra = ''
    params: Dict[str, Any] = {'f': id_factura}
    if excluir_pago:
        extra = ' AND p.id_pago <> CAST(:p AS uuid)'
        params['p'] = excluir_pago
    total = _scalar(
        'SELECT COALESCE(total_factura, 0) FROM factura WHERE id_factura = CAST(:f AS uuid)',
        {'f': id_factura},
    ) or 0
    aplicado = _scalar(
        f"""SELECT COALESCE(SUM(pf.monto_aplicado), 0)
            FROM pago_factura pf
            INNER JOIN pago p ON p.id_pago = pf.id_pago
            WHERE pf.id_factura = CAST(:f AS uuid)
              AND p.estado = 'VALIDADA'
              {extra}""",
        params,
    ) or 0
    return _money(total) - _money(aplicado)


def _pago_out(pago: Pago) -> Dict[str, Any]:
    apps = PagoFactura.query.filter_by(id_pago=pago.id_pago).all()
    return {
        'id_pago': pago.id_pago,
        'numero_pago': pago.numero_pago,
        'tipo_pago': pago.tipo_pago,
        'id_tercero': pago.id_tercero,
        'id_cuenta_bancaria': pago.id_cuenta_bancaria,
        'id_moneda': pago.id_moneda,
        'fecha_pago': str(pago.fecha_pago) if pago.fecha_pago else None,
        'monto': float(pago.monto),
        'concepto': pago.concepto,
        'estado': pago.estado,
        'id_asiento_contable': pago.id_asiento_contable,
        'aplicaciones': [
            {
                'id_pago_factura': a.id_pago_factura,
                'id_factura': a.id_factura,
                'monto_aplicado': float(a.monto_aplicado),
            }
            for a in apps
        ],
    }


def _validar_aplicaciones(
    id_empresa: str,
    id_tercero: str,
    aplicaciones: List[dict],
    es_cobro: bool,
    excluir_pago: str | None = None,
) -> Decimal:
    if not aplicaciones:
        raise ValidationError({'aplicaciones': ['Debe aplicar al menos una factura']})
    total = Decimal('0.00')
    vistos = set()
    rol_sql = 't.cliente = true' if es_cobro else 't.proveedor = true'
    for i, app in enumerate(aplicaciones, start=1):
        id_fac = str(app['id_factura'])
        if id_fac in vistos:
            raise ValidationError({'aplicaciones': [f'Factura duplicada en línea {i}']})
        vistos.add(id_fac)
        monto = _money(app['monto_aplicado'])
        if monto <= 0:
            raise ValidationError({'aplicaciones': [f'Línea {i}: monto debe ser > 0']})
        fac = db.session.execute(
            text(
                f"""SELECT f.id_factura, f.estado, f.id_tercero
                    FROM factura f
                    INNER JOIN tercero t ON t.id_tercero = f.id_tercero
                    WHERE f.id_factura = CAST(:f AS uuid)
                      AND f.id_empresa = CAST(:e AS uuid)
                      AND {rol_sql}"""
            ),
            {'f': id_fac, 'e': id_empresa},
        ).mappings().first()
        if not fac:
            raise ValidationError({'aplicaciones': [f'Línea {i}: factura no encontrada']})
        if str(fac['id_tercero']) != str(id_tercero):
            raise ValidationError({'aplicaciones': [f'Línea {i}: la factura no es del tercero']})
        if fac['estado'] != 'VALIDADA':
            raise ValidationError({'aplicaciones': [f'Línea {i}: solo facturas VALIDADA']})
        pendiente = _pendiente_factura(id_fac, excluir_pago)
        if monto > pendiente:
            raise ValidationError(
                {'aplicaciones': [f'Línea {i}: monto {monto} supera pendiente {pendiente}']}
            )
        total += monto
    return total


def crear_pago(id_empresa: str, payload: dict, es_cobro: bool = True) -> dict:
    data = CrearPagoSchema().load(payload or {})
    tipo = TIPO_COBRO if es_cobro else TIPO_PAGO_PROVEEDOR
    rol = 'cliente' if es_cobro else 'proveedor'
    row = db.session.execute(
        text(
            f"""SELECT 1 FROM tercero
                WHERE id_tercero = CAST(:t AS uuid) AND id_empresa = CAST(:e AS uuid)
                  AND {rol} = true"""
        ),
        {'t': str(data['id_tercero']), 'e': id_empresa},
    ).fetchone()
    if not row:
        raise ValidationError({'id_tercero': [f'Tercero no es {rol} de la empresa']})

    cta = db.session.execute(
        text(
            """SELECT 1 FROM cuenta_bancaria
               WHERE id_cuenta_bancaria = CAST(:c AS uuid)
                 AND id_empresa = CAST(:e AS uuid) AND estado = true"""
        ),
        {'c': str(data['id_cuenta_bancaria']), 'e': id_empresa},
    ).fetchone()
    if not cta:
        raise ValidationError({'id_cuenta_bancaria': ['Cuenta bancaria inválida']})

    mon = db.session.execute(
        text('SELECT 1 FROM moneda WHERE id_moneda = CAST(:id AS uuid)'),
        {'id': str(data['id_moneda'])},
    ).fetchone()
    if not mon:
        raise ValidationError({'id_moneda': ['Moneda inválida']})

    total = _validar_aplicaciones(
        id_empresa, str(data['id_tercero']), data['aplicaciones'], es_cobro
    )
    prefijo = 'COB' if es_cobro else 'PAG'
    pago = Pago(
        id_empresa=id_empresa,
        numero_pago=_siguiente_numero(id_empresa, prefijo, data['fecha_pago']),
        tipo_pago=tipo,
        id_tercero=str(data['id_tercero']),
        id_cuenta_bancaria=str(data['id_cuenta_bancaria']),
        fecha_pago=data['fecha_pago'],
        monto=total,
        id_moneda=str(data['id_moneda']),
        tipo_cambio=_money(data.get('tipo_cambio') or 1),
        concepto=(data.get('concepto') or '').strip() or None,
        estado='BORRADOR',
    )
    db.session.add(pago)
    db.session.flush()
    for app in data['aplicaciones']:
        db.session.add(
            PagoFactura(
                id_pago=pago.id_pago,
                id_factura=str(app['id_factura']),
                monto_aplicado=_money(app['monto_aplicado']),
            )
        )
    db.session.commit()
    return _pago_out(pago)


def _get_pago(id_empresa: str, id_pago: str, es_cobro: bool) -> Pago:
    tipo = TIPO_COBRO if es_cobro else TIPO_PAGO_PROVEEDOR
    pago = Pago.query.filter_by(
        id_pago=id_pago, id_empresa=id_empresa, tipo_pago=tipo
    ).first()
    if not pago:
        raise ValidationError({'id_pago': ['Pago no encontrado']})
    return pago


def _crear_movimiento_banco(pago: Pago, es_cobro: bool) -> None:
    cuenta = db.session.execute(
        text(
            """SELECT id_cuenta_bancaria, saldo_actual
               FROM cuenta_bancaria
               WHERE id_cuenta_bancaria = CAST(:c AS uuid) FOR UPDATE"""
        ),
        {'c': pago.id_cuenta_bancaria},
    ).mappings().first()
    if not cuenta:
        raise ValidationError({'id_cuenta_bancaria': ['Cuenta bancaria no encontrada']})
    saldo_ant = _money(cuenta['saldo_actual'] or 0)
    monto = _money(pago.monto)
    delta = monto if es_cobro else -monto
    saldo_nuevo = saldo_ant + delta
    tipo_mov = 'INGRESO' if es_cobro else 'EGRESO'
    db.session.execute(
        text(
            """INSERT INTO movimiento_bancario
               (id_movimiento_bancario, id_empresa, id_cuenta_bancaria, fecha_movimiento,
                numero_documento, concepto, tipo_movimiento, monto, saldo_anterior, saldo_nuevo,
                conciliado)
               VALUES (:id, CAST(:e AS uuid), CAST(:c AS uuid), :fec, :doc, :con, :tipo,
                       :monto, :sa, :sn, false)"""
        ),
        {
            'id': str(uuid4()),
            'e': pago.id_empresa,
            'c': pago.id_cuenta_bancaria,
            'fec': pago.fecha_pago,
            'doc': pago.numero_pago,
            'con': pago.concepto or f'{tipo_mov} {pago.numero_pago}',
            'tipo': tipo_mov,
            'monto': float(monto),
            'sa': float(saldo_ant),
            'sn': float(saldo_nuevo),
        },
    )
    db.session.execute(
        text(
            """UPDATE cuenta_bancaria SET saldo_actual = :s, updated_at = now()
               WHERE id_cuenta_bancaria = CAST(:c AS uuid)"""
        ),
        {'s': float(saldo_nuevo), 'c': pago.id_cuenta_bancaria},
    )


def _reversar_movimiento_banco(pago: Pago, es_cobro: bool) -> None:
    orig = db.session.execute(
        text(
            """SELECT id_movimiento_bancario, monto, concepto, numero_documento
               FROM movimiento_bancario
               WHERE id_empresa = CAST(:e AS uuid)
                 AND numero_documento = :doc
                 AND id_movimiento_reversado IS NULL
                 AND tipo_movimiento IN ('INGRESO', 'EGRESO')
               ORDER BY created_at DESC LIMIT 1"""
        ),
        {'e': pago.id_empresa, 'doc': pago.numero_pago},
    ).mappings().first()
    if not orig:
        return
    ya = db.session.execute(
        text(
            """SELECT 1 FROM movimiento_bancario
               WHERE id_movimiento_reversado = CAST(:id AS uuid)"""
        ),
        {'id': orig['id_movimiento_bancario']},
    ).fetchone()
    if ya:
        return
    cuenta = db.session.execute(
        text(
            """SELECT id_cuenta_bancaria, saldo_actual FROM cuenta_bancaria
               WHERE id_cuenta_bancaria = CAST(:c AS uuid) FOR UPDATE"""
        ),
        {'c': pago.id_cuenta_bancaria},
    ).mappings().first()
    if not cuenta:
        return
    saldo_ant = _money(cuenta['saldo_actual'] or 0)
    monto = _money(orig['monto'])
    delta = -monto if es_cobro else monto
    saldo_nuevo = saldo_ant + delta
    db.session.execute(
        text(
            """INSERT INTO movimiento_bancario
               (id_movimiento_bancario, id_empresa, id_cuenta_bancaria, fecha_movimiento,
                numero_documento, concepto, tipo_movimiento, monto, saldo_anterior, saldo_nuevo,
                conciliado, id_movimiento_reversado)
               VALUES (:id, CAST(:e AS uuid), CAST(:c AS uuid), CURRENT_DATE, :doc, :con, 'reversa',
                       :monto, :sa, :sn, false, CAST(:rev AS uuid))"""
        ),
        {
            'id': str(uuid4()),
            'e': pago.id_empresa,
            'c': pago.id_cuenta_bancaria,
            'doc': pago.numero_pago,
            'con': f'Reversa: {orig.get("concepto") or pago.numero_pago}',
            'monto': float(-monto if es_cobro else monto),
            'sa': float(saldo_ant),
            'sn': float(saldo_nuevo),
            'rev': orig['id_movimiento_bancario'],
        },
    )
    db.session.execute(
        text(
            """UPDATE cuenta_bancaria SET saldo_actual = :s, updated_at = now()
               WHERE id_cuenta_bancaria = CAST(:c AS uuid)"""
        ),
        {'s': float(saldo_nuevo), 'c': pago.id_cuenta_bancaria},
    )


def validar_pago(id_empresa: str, id_pago: str, es_cobro: bool = True) -> dict:
    pago = _get_pago(id_empresa, id_pago, es_cobro)
    if pago.estado != 'BORRADOR':
        raise ValidationError({'estado': ['Solo se pueden validar pagos en BORRADOR']})
    apps = PagoFactura.query.filter_by(id_pago=id_pago).all()
    aplicaciones = [{'id_factura': a.id_factura, 'monto_aplicado': a.monto_aplicado} for a in apps]
    total = _validar_aplicaciones(id_empresa, pago.id_tercero, aplicaciones, es_cobro, id_pago)
    pago.monto = total
    _crear_movimiento_banco(pago, es_cobro)
    pago.estado = 'VALIDADA'
    pago.updated_at = datetime.utcnow()
    db.session.commit()
    publish_pago_registrado(
        id_empresa,
        pago.id_pago,
        str(pago.fecha_pago),
        'cobro' if es_cobro else 'pago_proveedor',
        pago.numero_pago,
    )
    return _pago_out(pago)


def anular_pago(id_empresa: str, id_pago: str, es_cobro: bool = True) -> dict:
    pago = _get_pago(id_empresa, id_pago, es_cobro)
    if pago.estado == 'ANULADA':
        raise ValidationError({'estado': ['El pago ya está anulado']})
    if pago.id_asiento_contable:
        raise ValidationError(
            {'estado': ['No se puede anular: ya tiene asiento contable. Reverse el asiento primero.']}
        )
    if pago.estado == 'VALIDADA':
        _reversar_movimiento_banco(pago, es_cobro)
    pago.estado = 'ANULADA'
    pago.updated_at = datetime.utcnow()
    db.session.commit()
    return _pago_out(pago)

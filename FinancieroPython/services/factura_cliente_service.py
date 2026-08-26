from __future__ import annotations

from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, List, Optional

from marshmallow import ValidationError
from sqlalchemy import text
from utils.db import db
from models.factura import Factura
from models.factura_linea import FacturaLinea
from schemas.factura_cliente_schema import CrearFacturaClienteBorradorSchema, ReemplazarLineasSchema
from services.rabbit_publisher import publish_factura_validada, publish_mail_send


def _money(v: Any) -> Decimal:
    return Decimal(str(v or 0)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


def _qty(v: Any) -> Decimal:
    return Decimal(str(v or 0)).quantize(Decimal('0.001'), rounding=ROUND_HALF_UP)


def _scalar_one(session, sql, params):
    return session.execute(text(sql), params).fetchone()


def _validar_catalogos(session, id_empresa: str, data: dict, es_proveedor: bool = False) -> None:
    rol = 'proveedor' if es_proveedor else 'cliente'
    row = _scalar_one(
        session,
        f"""SELECT 1 FROM tercero
            WHERE id_tercero = CAST(:t AS uuid) AND id_empresa = CAST(:e AS uuid)
              AND {rol} = true""",
        {'t': str(data['id_tercero']), 'e': id_empresa},
    )
    if not row:
        raise ValidationError({'id_tercero': [f'Tercero no existe o no es {rol} de la empresa.']})

    if data.get('id_condicion_pago'):
        r = _scalar_one(
            session,
            'SELECT 1 FROM condicion_pago_catalogo WHERE id_condicion_pago = CAST(:id AS uuid)',
            {'id': str(data['id_condicion_pago'])},
        )
        if not r:
            raise ValidationError({'id_condicion_pago': ['Condición de pago inválida.']})

    if data.get('id_forma_pago'):
        r = _scalar_one(
            session,
            'SELECT 1 FROM forma_pago_catalogo WHERE id_forma_pago = CAST(:id AS uuid)',
            {'id': str(data['id_forma_pago'])},
        )
        if not r:
            raise ValidationError({'id_forma_pago': ['Forma de pago inválida.']})

    if data.get('id_cuenta_bancaria'):
        r = _scalar_one(
            session,
            'SELECT 1 FROM cuenta_bancaria WHERE id_cuenta_bancaria = CAST(:c AS uuid) AND id_empresa = CAST(:e AS uuid)',
            {'c': str(data['id_cuenta_bancaria']), 'e': id_empresa},
        )
        if not r:
            raise ValidationError({'id_cuenta_bancaria': ['Cuenta bancaria inválida para la empresa.']})

    if data.get('id_moneda'):
        r = _scalar_one(
            session,
            'SELECT 1 FROM moneda WHERE id_moneda = CAST(:id AS uuid)',
            {'id': str(data['id_moneda'])},
        )
        if not r:
            raise ValidationError({'id_moneda': ['Divisa inválida.']})


def _calc_linea(lin: dict, orden: int) -> dict:
    cantidad = _qty(lin['cantidad'])
    precio = _money(lin['precio_unitario'])
    desc_pct = _money(lin.get('descuento_porcentaje') or 0)
    desc_val = _money(lin.get('descuento_valor') or 0)
    if cantidad <= 0:
        raise ValidationError({'lineas': [f'Línea {orden}: cantidad debe ser > 0']})
    if precio < 0:
        raise ValidationError({'lineas': [f'Línea {orden}: precio inválido']})
    bruto = (cantidad * precio).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    descuento = desc_val
    if desc_pct > 0:
        descuento = (bruto * desc_pct / Decimal('100')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    subtotal = (bruto - descuento).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    if subtotal < 0:
        raise ValidationError({'lineas': [f'Línea {orden}: subtotal negativo']})
    tasa = _money(lin.get('tasa_iva') or 0)
    if tasa < 0:
        tasa = Decimal('0.00')
    iva = (subtotal * tasa / Decimal('100')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    return {
        'id_item': str(lin['id_item']) if lin.get('id_item') else None,
        'descripcion': lin['descripcion'].strip(),
        'cantidad': cantidad,
        'precio_unitario': precio,
        'descuento_porcentaje': desc_pct,
        'descuento_valor': descuento,
        'subtotal': subtotal,
        'iva': iva,
        'id_cuenta_contable': str(lin['id_cuenta_contable']) if lin.get('id_cuenta_contable') else None,
        'orden': int(lin.get('orden') or orden),
    }


def _recalcular_totales(factura: Factura, total_iva: Optional[Decimal] = None) -> None:
    lineas = (
        FacturaLinea.query.filter_by(id_factura=factura.id_factura)
        .order_by(FacturaLinea.orden)
        .all()
    )
    subtotal = sum((_money(l.subtotal) for l in lineas), Decimal('0.00'))
    factura.subtotal = subtotal
    factura.total_descuentos = sum((_money(l.descuento_valor) for l in lineas), Decimal('0.00'))
    if total_iva is not None:
        factura.total_impuestos = _money(total_iva)
    else:
        factura.total_impuestos = _money(factura.total_impuestos or 0)
    factura.total_factura = subtotal + _money(factura.total_impuestos)


def _insertar_lineas(session, id_factura: str, lineas_in: List[dict]) -> Decimal:
    total_iva = Decimal('0.00')
    for i, raw in enumerate(lineas_in, start=1):
        calc = _calc_linea(raw, i)
        total_iva += calc['iva']
        session.add(
            FacturaLinea(
                id_factura=id_factura,
                id_item=calc['id_item'],
                descripcion=calc['descripcion'],
                cantidad=calc['cantidad'],
                precio_unitario=calc['precio_unitario'],
                descuento_porcentaje=calc['descuento_porcentaje'],
                descuento_valor=calc['descuento_valor'],
                subtotal=calc['subtotal'],
                id_cuenta_contable=calc['id_cuenta_contable'],
                orden=calc['orden'],
            )
        )
    return total_iva


def _factura_out(factura: Factura) -> Dict[str, Any]:
    lineas = (
        FacturaLinea.query.filter_by(id_factura=factura.id_factura)
        .order_by(FacturaLinea.orden)
        .all()
    )
    return {
        'id_factura': factura.id_factura,
        'estado': factura.estado,
        'numero_factura': factura.numero_factura,
        'tipo_factura': factura.tipo_factura,
        'id_tercero': factura.id_tercero,
        'fecha_factura': str(factura.fecha_factura) if factura.fecha_factura else None,
        'fecha_vencimiento': str(factura.fecha_vencimiento) if factura.fecha_vencimiento else None,
        'subtotal': float(factura.subtotal) if factura.subtotal is not None else None,
        'total_impuestos': float(factura.total_impuestos or 0),
        'total_descuentos': float(factura.total_descuentos or 0),
        'total_factura': float(factura.total_factura) if factura.total_factura is not None else None,
        'lineas': [
            {
                'id_factura_linea': l.id_factura_linea,
                'id_item': l.id_item,
                'descripcion': l.descripcion,
                'cantidad': float(l.cantidad),
                'precio_unitario': float(l.precio_unitario),
                'descuento_porcentaje': float(l.descuento_porcentaje or 0),
                'descuento_valor': float(l.descuento_valor or 0),
                'subtotal': float(l.subtotal),
                'id_cuenta_contable': l.id_cuenta_contable,
                'orden': l.orden,
            }
            for l in lineas
        ],
    }


def crear_factura_borrador(id_empresa: str, payload: dict, es_proveedor: bool = False) -> dict:
    schema = CrearFacturaClienteBorradorSchema()
    data = schema.load(payload)
    session = db.session
    _validar_catalogos(session, id_empresa, data, es_proveedor=es_proveedor)

    categorias = data.get('categorias') or []
    if not isinstance(categorias, list):
        categorias = []

    factura = Factura(
        id_empresa=id_empresa,
        numero_factura=None,
        tipo_factura=data['tipo_factura'],
        id_tercero=str(data['id_tercero']),
        fecha_factura=data['fecha_factura'],
        fecha_vencimiento=data.get('fecha_vencimiento'),
        subtotal=None,
        total_impuestos=0,
        total_descuentos=0,
        total_factura=None,
        estado='BORRADOR',
        id_condicion_pago=str(data['id_condicion_pago']) if data.get('id_condicion_pago') else None,
        id_forma_pago=str(data['id_forma_pago']) if data.get('id_forma_pago') else None,
        id_cuenta_bancaria=str(data['id_cuenta_bancaria']) if data.get('id_cuenta_bancaria') else None,
        origen=data.get('origen'),
        id_proyecto=str(data['id_proyecto']) if data.get('id_proyecto') else None,
        categorias=categorias,
        plantilla_documento=data.get('plantilla_documento') or 'crabe',
        id_moneda=str(data['id_moneda']) if data.get('id_moneda') else None,
        nota_publica=data.get('nota_publica'),
        nota_privada=data.get('nota_privada'),
    )
    session.add(factura)
    session.flush()

    lineas = data.get('lineas') or []
    if lineas:
        total_iva = _insertar_lineas(session, factura.id_factura, lineas)
        _recalcular_totales(factura, total_iva)

    session.commit()
    return _factura_out(factura)


def crear_factura_cliente_borrador(id_empresa: str, payload: dict) -> dict:
    return crear_factura_borrador(id_empresa, payload, es_proveedor=False)


def _get_borrador(id_empresa: str, id_factura: str) -> Factura:
    factura = Factura.query.filter_by(id_factura=id_factura, id_empresa=id_empresa).first()
    if not factura:
        raise ValidationError({'id_factura': ['Factura no encontrada']})
    return factura


def _assert_rol_factura(factura: Factura, es_proveedor: bool) -> None:
    rol = 'proveedor' if es_proveedor else 'cliente'
    row = db.session.execute(
        text(
            f"""SELECT 1 FROM tercero
                WHERE id_tercero = CAST(:t AS uuid) AND {rol} = true"""
        ),
        {'t': factura.id_tercero},
    ).fetchone()
    if not row:
        raise ValidationError({'id_factura': [f'La factura no corresponde a un {rol}']})


def reemplazar_lineas(id_empresa: str, id_factura: str, payload: dict) -> dict:
    data = ReemplazarLineasSchema().load(payload or {})
    factura = _get_borrador(id_empresa, id_factura)
    if factura.estado != 'BORRADOR':
        raise ValidationError({'estado': ['Solo se pueden editar líneas en BORRADOR']})

    FacturaLinea.query.filter_by(id_factura=id_factura).delete()
    total_iva = _insertar_lineas(db.session, id_factura, data['lineas'])
    _recalcular_totales(factura, total_iva)
    factura.updated_at = datetime.utcnow()
    db.session.commit()
    return _factura_out(factura)


def _siguiente_numero(id_empresa: str, fecha, es_proveedor: bool = False) -> str:
    prefijo = 'FP' if es_proveedor else 'FC'
    count = db.session.execute(
        text(
            """SELECT COUNT(*) FROM factura
               WHERE id_empresa = CAST(:e AS uuid)
                 AND EXTRACT(YEAR FROM fecha_factura) = :y
                 AND numero_factura IS NOT NULL
                 AND numero_factura LIKE :pref"""
        ),
        {'e': id_empresa, 'y': fecha.year, 'pref': f'{prefijo}-%'},
    ).scalar() or 0
    return f'{prefijo}-{fecha.year}-{str(int(count) + 1).zfill(6)}'


def validar_factura(id_empresa: str, id_factura: str, es_proveedor: bool = False) -> dict:
    factura = _get_borrador(id_empresa, id_factura)
    _assert_rol_factura(factura, es_proveedor)
    if factura.estado != 'BORRADOR':
        raise ValidationError({'estado': ['Solo se pueden validar facturas en BORRADOR']})

    n_lineas = FacturaLinea.query.filter_by(id_factura=id_factura).count()
    if n_lineas < 1:
        raise ValidationError({'lineas': ['La factura debe tener al menos una línea']})

    _recalcular_totales(factura)
    if not factura.numero_factura:
        factura.numero_factura = _siguiente_numero(id_empresa, factura.fecha_factura, es_proveedor)
    factura.estado = 'VALIDADA'
    factura.updated_at = datetime.utcnow()
    db.session.commit()

    publish_factura_validada(
        id_empresa,
        factura.id_factura,
        str(factura.fecha_factura),
        factura.fecha_factura.year,
        tipo='proveedor' if es_proveedor else 'cliente',
    )
    return _factura_out(factura)


def anular_factura(id_empresa: str, id_factura: str, es_proveedor: bool = False) -> dict:
    factura = _get_borrador(id_empresa, id_factura)
    _assert_rol_factura(factura, es_proveedor)
    if factura.estado == 'ANULADA':
        raise ValidationError({'estado': ['La factura ya está anulada']})

    transferidas = db.session.execute(
        text(
            """SELECT COUNT(*) FROM factura_linea
               WHERE id_factura = CAST(:f AS uuid) AND transferido = true"""
        ),
        {'f': id_factura},
    ).scalar() or 0
    if int(transferidas) > 0:
        raise ValidationError(
            {'estado': ['No se puede anular: líneas ya transferidas a contabilidad. Reverse el asiento primero.']}
        )

    cobros = db.session.execute(
        text(
            """SELECT COUNT(*) FROM pago_factura pf
               INNER JOIN pago p ON p.id_pago = pf.id_pago
               WHERE pf.id_factura = CAST(:f AS uuid) AND p.estado = 'VALIDADA'"""
        ),
        {'f': id_factura},
    ).scalar() or 0
    if int(cobros) > 0:
        raise ValidationError(
            {'estado': ['No se puede anular: tiene cobros/pagos validados. Anule los pagos primero.']}
        )

    factura.estado = 'ANULADA'
    factura.updated_at = datetime.utcnow()
    db.session.commit()
    return _factura_out(factura)


def encolar_correo_factura(id_empresa: str, id_factura: str, payload: dict, es_proveedor: bool = False) -> dict:
    factura = _get_borrador(id_empresa, id_factura)
    _assert_rol_factura(factura, es_proveedor)
    if factura.estado != 'VALIDADA':
        raise ValidationError({'estado': ['Solo se envía correo de facturas VALIDADA']})
    row = db.session.execute(
        text(
            """SELECT t.correo, t.nombre FROM tercero t
               WHERE t.id_tercero = CAST(:t AS uuid)"""
        ),
        {'t': factura.id_tercero},
    ).mappings().first()
    extras = payload.get('destinatarios') or payload.get('to') or []
    if isinstance(extras, str):
        extras = [extras]
    to = [e for e in extras if e]
    correo_tercero = (row or {}).get('correo')
    if correo_tercero and correo_tercero not in to:
        to.insert(0, correo_tercero)
    if not to:
        raise ValidationError({'destinatarios': ['Indique un correo o cargue el del tercero']})
    numero = factura.numero_factura or id_factura
    nombre = (row or {}).get('nombre') or ''
    tipo_adj = 'factura_proveedor' if es_proveedor else 'factura_cliente'
    html = payload.get('html') or (
        f'<p>Estimado/a {nombre},</p><p>Adjuntamos la factura <strong>{numero}</strong>.</p>'
    )
    ok = publish_mail_send(
        id_empresa,
        to,
        payload.get('asunto') or f'Factura {numero}',
        html=html,
        adjuntos=[{'tipo': tipo_adj, 'id_documento': id_factura}],
    )
    return {'enqueued': ok, 'to': to, 'id_factura': id_factura}

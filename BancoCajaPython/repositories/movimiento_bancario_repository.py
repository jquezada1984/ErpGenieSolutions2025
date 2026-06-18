from decimal import Decimal
from typing import Any, Dict, Optional

from utils.db import db
from models.cuenta_bancaria import CuentaBancaria
from models.movimiento_bancario import MovimientoBancario


def _uuid_str(value) -> Optional[str]:
    if value is None:
        return None
    return str(value)


def create_movimiento_bancario(
    payload: Dict[str, Any],
    id_empresa: str,
    user_id: Optional[str],
    scope_acceso: str = 'EMPRESA',
) -> MovimientoBancario:
    q = CuentaBancaria.query.filter_by(
        id_cuenta_bancaria=str(payload['id_cuenta_bancaria']),
        estado=True,
    )
    if scope_acceso != 'GLOBAL':
        q = q.filter_by(id_empresa=id_empresa)
    cuenta = q.first()
    if not cuenta:
        raise ValueError('Cuenta bancaria no encontrada o inactiva')

    importe = Decimal(str(payload['importe']))
    if importe == 0:
        raise ValueError('El importe no puede ser cero')

    mov = MovimientoBancario(
        id_cuenta_bancaria=str(payload['id_cuenta_bancaria']),
        id_empresa=cuenta.id_empresa,
        fecha_operacion=payload['fecha_operacion'],
        fecha_valor=payload.get('fecha_valor'),
        importe=importe,
        concepto=(payload.get('concepto') or '').strip() or None,
        referencia=(payload.get('referencia') or '').strip() or None,
        id_tercero=_uuid_str(payload.get('id_tercero')),
        conciliado=bool(payload.get('conciliado', False)),
        created_by=user_id,
        updated_by=user_id,
    )
    cuenta.saldo_actual = Decimal(str(cuenta.saldo_actual or 0)) + importe
    cuenta.updated_by = user_id
    db.session.add(mov)
    db.session.commit()
    return mov


def update_movimiento_bancario(
    id_movimiento: str,
    id_empresa: str,
    payload: Dict[str, Any],
    user_id: Optional[str],
    scope_acceso: str = 'EMPRESA',
) -> Optional[MovimientoBancario]:
    q = MovimientoBancario.query.filter_by(
        id_movimiento_bancario=id_movimiento,
        estado=True,
    )
    if scope_acceso != 'GLOBAL':
        q = q.filter_by(id_empresa=id_empresa)
    mov = q.first()
    if not mov:
        return None

    for key in ('fecha_operacion', 'fecha_valor', 'concepto', 'referencia', 'conciliado'):
        if key in payload:
            val = payload[key]
            if key in ('concepto', 'referencia') and val is not None:
                val = str(val).strip() or None
            setattr(mov, key, val)
    if 'id_tercero' in payload:
        mov.id_tercero = _uuid_str(payload['id_tercero'])

    mov.updated_by = user_id
    db.session.commit()
    return mov


def delete_movimiento_bancario(
    id_movimiento: str,
    id_empresa: str,
    user_id: Optional[str],
    scope_acceso: str = 'EMPRESA',
) -> bool:
    q = MovimientoBancario.query.filter_by(
        id_movimiento_bancario=id_movimiento,
        estado=True,
    )
    if scope_acceso != 'GLOBAL':
        q = q.filter_by(id_empresa=id_empresa)
    mov = q.first()
    if not mov:
        return False

    cuenta = CuentaBancaria.query.filter_by(
        id_cuenta_bancaria=mov.id_cuenta_bancaria,
    ).first()
    if cuenta:
        cuenta.saldo_actual = Decimal(str(cuenta.saldo_actual or 0)) - Decimal(str(mov.importe))
        cuenta.updated_by = user_id

    mov.estado = False
    mov.updated_by = user_id
    db.session.commit()
    return True

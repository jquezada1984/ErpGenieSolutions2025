from datetime import date
from decimal import Decimal
from typing import Any, Dict, Optional

from sqlalchemy.sql import func

from utils.db import db
from models.cuenta_bancaria import CuentaBancaria
from models.movimiento_bancario import MovimientoBancario
from repositories.movimiento_helpers import (
    crear_linea_movimiento,
    movimiento_fue_reversado,
)


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

    monto = Decimal(str(payload['monto']))
    if monto == 0:
        raise ValueError('El monto no puede ser cero')

    tipo = payload.get('tipo_movimiento')
    if not tipo:
        tipo = 'ingreso' if monto > 0 else 'egreso'

    mov = crear_linea_movimiento(
        cuenta=cuenta,
        id_empresa=cuenta.id_empresa,
        fecha_movimiento=payload['fecha_movimiento'],
        monto=monto,
        tipo_movimiento=tipo,
        concepto=(payload.get('concepto') or '').strip() or None,
        numero_documento=(payload.get('numero_documento') or '').strip() or None,
    )
    if payload.get('conciliado'):
        mov.conciliado = True
    cuenta.updated_by = user_id
    db.session.commit()
    return mov


def update_movimiento_bancario(
    id_movimiento: str,
    id_empresa: str,
    payload: Dict[str, Any],
    user_id: Optional[str],
    scope_acceso: str = 'EMPRESA',
) -> Optional[MovimientoBancario]:
    q = MovimientoBancario.query.filter_by(id_movimiento_bancario=id_movimiento)
    if scope_acceso != 'GLOBAL':
        q = q.filter_by(id_empresa=id_empresa)
    mov = q.first()
    if not mov:
        return None
    if mov.id_movimiento_reversado:
        raise ValueError('No se puede editar una línea de reversa')
    if movimiento_fue_reversado(mov.id_movimiento_bancario):
        raise ValueError('No se puede editar un movimiento ya reversado')

    for key in ('fecha_movimiento', 'concepto', 'numero_documento', 'conciliado'):
        if key in payload:
            val = payload[key]
            if key in ('concepto', 'numero_documento') and val is not None:
                val = str(val).strip() or None
            setattr(mov, key, val)

    db.session.commit()
    return mov


def delete_movimiento_bancario(
    id_movimiento: str,
    id_empresa: str,
    user_id: Optional[str],
    scope_acceso: str = 'EMPRESA',
    fecha_reversa: Optional[date] = None,
) -> bool:
    q = MovimientoBancario.query.filter_by(id_movimiento_bancario=id_movimiento)
    if scope_acceso != 'GLOBAL':
        q = q.filter_by(id_empresa=id_empresa)
    mov = q.first()
    if not mov:
        return False

    if mov.id_transferencia_bancaria:
        raise ValueError(
            'Este movimiento pertenece a una transferencia; anule la transferencia asociada',
        )
    if mov.id_movimiento_reversado:
        raise ValueError('Esta línea es una reversa y no se anula individualmente')
    if movimiento_fue_reversado(mov.id_movimiento_bancario):
        raise ValueError('El movimiento ya fue reversado')

    cuenta = CuentaBancaria.query.filter_by(
        id_cuenta_bancaria=mov.id_cuenta_bancaria,
    ).first()
    if not cuenta:
        raise ValueError('Cuenta bancaria no encontrada')

    fecha_rev = fecha_reversa or date.today()
    crear_linea_movimiento(
        cuenta=cuenta,
        id_empresa=mov.id_empresa,
        fecha_movimiento=fecha_rev,
        monto=-Decimal(str(mov.monto)),
        tipo_movimiento='reversa',
        concepto=f'Reversa: {mov.concepto or ""}'.strip() or 'Reversa de movimiento',
        numero_documento=mov.numero_documento,
        id_movimiento_reversado=mov.id_movimiento_bancario,
    )
    cuenta.updated_by = user_id
    db.session.commit()
    return True

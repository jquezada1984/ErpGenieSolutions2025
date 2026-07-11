from datetime import date, datetime
from decimal import Decimal
from typing import Any, Dict, Optional, Tuple

from utils.db import db
from models.cuenta_bancaria import CuentaBancaria
from models.movimiento_bancario import MovimientoBancario
from models.transferencia_bancaria import TransferenciaBancaria
from repositories.movimiento_helpers import (
    crear_linea_movimiento,
    movimiento_fue_reversado,
)
from schemas.transferencia_bancaria_schema import TIPOS_PAGO_TRANSFERENCIA


def _get_cuenta_activa(
    id_cuenta: str,
    id_empresa: str,
    scope_acceso: str,
) -> Optional[CuentaBancaria]:
    q = CuentaBancaria.query.filter_by(
        id_cuenta_bancaria=str(id_cuenta),
        estado=True,
    )
    if scope_acceso != 'GLOBAL':
        q = q.filter_by(id_empresa=id_empresa)
    return q.first()


def _resolver_tipo_pago(
    payload: Dict[str, Any],
    cuenta_origen: CuentaBancaria,
    cuenta_destino: CuentaBancaria,
) -> str:
    """Como Dolibarr: si hay caja/efectivo, forzar tipo Efectivo (LIQ)."""
    if (
        cuenta_origen.tipo_cuenta == 'caja_efectivo'
        or cuenta_destino.tipo_cuenta == 'caja_efectivo'
    ):
        return 'efectivo'
    tipo = (payload.get('tipo_movimiento') or 'transferencia_bancaria').strip()
    if tipo not in TIPOS_PAGO_TRANSFERENCIA:
        raise ValueError('Tipo de pago no válido')
    return tipo


def create_transferencia_bancaria(
    payload: Dict[str, Any],
    id_empresa: str,
    user_id: Optional[str],
    scope_acceso: str = 'EMPRESA',
) -> Tuple[TransferenciaBancaria, MovimientoBancario, MovimientoBancario]:
    id_origen = str(payload['id_cuenta_origen'])
    id_destino = str(payload['id_cuenta_destino'])
    if id_origen == id_destino:
        raise ValueError('La cuenta origen y destino deben ser distintas')

    cuenta_origen = _get_cuenta_activa(id_origen, id_empresa, scope_acceso)
    cuenta_destino = _get_cuenta_activa(id_destino, id_empresa, scope_acceso)
    if not cuenta_origen:
        raise ValueError('Cuenta origen no encontrada o inactiva')
    if not cuenta_destino:
        raise ValueError('Cuenta destino no encontrada o inactiva')

    if cuenta_origen.id_empresa != cuenta_destino.id_empresa:
        raise ValueError('Ambas cuentas deben pertenecer a la misma empresa')
    if cuenta_origen.id_moneda != cuenta_destino.id_moneda:
        raise ValueError('Ambas cuentas deben usar la misma moneda')

    monto = Decimal(str(payload['monto']))
    if monto <= 0:
        raise ValueError('El monto debe ser mayor que cero')

    saldo_origen = Decimal(str(cuenta_origen.saldo_actual or 0))
    if saldo_origen < monto:
        raise ValueError('Saldo insuficiente en la cuenta origen')

    id_empresa_mov = str(cuenta_origen.id_empresa)
    fecha_mov = payload['fecha_movimiento']
    concepto_usuario = str(payload['concepto']).strip()
    numero_documento = (payload.get('numero_documento') or '').strip() or None
    tipo_cabecera = _resolver_tipo_pago(payload, cuenta_origen, cuenta_destino)
    concepto_salida = concepto_usuario
    concepto_entrada = concepto_usuario
    uid = str(user_id) if user_id else None

    transf = TransferenciaBancaria(
        id_empresa=id_empresa_mov,
        id_cuenta_origen=id_origen,
        id_cuenta_destino=id_destino,
        monto=monto,
        fecha_movimiento=fecha_mov,
        numero_documento=numero_documento,
        concepto=concepto_usuario,
        tipo_movimiento=tipo_cabecera,
        created_by=uid,
        updated_by=uid,
    )
    db.session.add(transf)
    db.session.flush()

    id_transf = str(transf.id_transferencia_bancaria)
    mov_salida = crear_linea_movimiento(
        cuenta=cuenta_origen,
        id_empresa=id_empresa_mov,
        fecha_movimiento=fecha_mov,
        monto=-monto,
        tipo_movimiento='transferencia_salida',
        concepto=concepto_salida,
        numero_documento=numero_documento,
        id_transferencia_bancaria=id_transf,
    )
    mov_entrada = crear_linea_movimiento(
        cuenta=cuenta_destino,
        id_empresa=id_empresa_mov,
        fecha_movimiento=fecha_mov,
        monto=monto,
        tipo_movimiento='transferencia_entrada',
        concepto=concepto_entrada,
        numero_documento=numero_documento,
        id_transferencia_bancaria=id_transf,
    )
    cuenta_origen.updated_by = uid
    cuenta_destino.updated_by = uid

    db.session.commit()
    return transf, mov_salida, mov_entrada


def delete_transferencia_bancaria(
    id_transferencia: str,
    id_empresa: str,
    user_id: Optional[str],
    scope_acceso: str = 'EMPRESA',
    fecha_reversa: Optional[date] = None,
) -> bool:
    q = TransferenciaBancaria.query.filter_by(
        id_transferencia_bancaria=id_transferencia,
        estado=True,
    )
    if scope_acceso != 'GLOBAL':
        q = q.filter_by(id_empresa=id_empresa)
    transf = q.first()
    if not transf:
        return False

    movs = MovimientoBancario.query.filter_by(
        id_transferencia_bancaria=id_transferencia,
        id_movimiento_reversado=None,
    ).all()
    if len(movs) != 2:
        raise ValueError('La transferencia no tiene el par de movimientos esperado')

    fecha_rev = fecha_reversa or date.today()
    for mov in movs:
        if movimiento_fue_reversado(mov.id_movimiento_bancario):
            raise ValueError('La transferencia ya tiene movimientos reversados')
        cuenta = CuentaBancaria.query.filter_by(
            id_cuenta_bancaria=mov.id_cuenta_bancaria,
        ).first()
        if not cuenta:
            raise ValueError('Cuenta bancaria no encontrada')
        crear_linea_movimiento(
            cuenta=cuenta,
            id_empresa=mov.id_empresa,
            fecha_movimiento=fecha_rev,
            monto=-Decimal(str(mov.monto)),
            tipo_movimiento='reversa',
            concepto=f'Reversa transferencia: {mov.concepto or ""}'.strip(),
            numero_documento=mov.numero_documento,
            id_movimiento_reversado=mov.id_movimiento_bancario,
        )
        cuenta.updated_by = user_id

    transf.estado = False
    transf.updated_by = user_id
    transf.updated_at = datetime.utcnow()
    db.session.commit()
    return True

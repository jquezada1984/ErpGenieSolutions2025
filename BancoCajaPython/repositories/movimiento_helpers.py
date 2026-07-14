from datetime import date
from decimal import Decimal
from typing import Optional

from utils.db import db
from models.cuenta_bancaria import CuentaBancaria
from models.movimiento_bancario import MovimientoBancario


def movimiento_fue_reversado(id_movimiento: str) -> bool:
    return (
        db.session.query(MovimientoBancario.id_movimiento_bancario)
        .filter_by(id_movimiento_reversado=str(id_movimiento))
        .first()
        is not None
    )


def crear_linea_movimiento(
    cuenta: CuentaBancaria,
    id_empresa: str,
    fecha_movimiento: date,
    monto: Decimal,
    tipo_movimiento: str,
    concepto: Optional[str] = None,
    numero_documento: Optional[str] = None,
    id_transferencia_bancaria: Optional[str] = None,
    id_movimiento_reversado: Optional[str] = None,
) -> MovimientoBancario:
    saldo_anterior = Decimal(str(cuenta.saldo_actual or 0))
    saldo_nuevo = saldo_anterior + monto
    mov = MovimientoBancario(
        id_cuenta_bancaria=str(cuenta.id_cuenta_bancaria),
        id_empresa=str(id_empresa),
        fecha_movimiento=fecha_movimiento,
        numero_documento=numero_documento,
        concepto=concepto,
        tipo_movimiento=tipo_movimiento,
        monto=monto,
        saldo_anterior=saldo_anterior,
        saldo_nuevo=saldo_nuevo,
        id_transferencia_bancaria=str(id_transferencia_bancaria) if id_transferencia_bancaria else None,
        id_movimiento_reversado=str(id_movimiento_reversado) if id_movimiento_reversado else None,
    )
    cuenta.saldo_actual = saldo_nuevo
    db.session.add(mov)
    return mov

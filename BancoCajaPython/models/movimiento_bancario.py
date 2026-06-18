from sqlalchemy.sql import func
import uuid

from utils.db import db


class MovimientoBancario(db.Model):
    __tablename__ = 'movimiento_bancario'

    id_movimiento_bancario = db.Column(
        db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()),
    )
    id_cuenta_bancaria = db.Column(
        db.String(36), db.ForeignKey('cuenta_bancaria.id_cuenta_bancaria'), nullable=False,
    )
    id_empresa = db.Column(db.String(36), nullable=False)
    fecha_operacion = db.Column(db.Date, nullable=False)
    fecha_valor = db.Column(db.Date)
    importe = db.Column(db.Numeric(15, 2), nullable=False)
    concepto = db.Column(db.String(500))
    referencia = db.Column(db.String(100))
    id_tercero = db.Column(db.String(36))
    conciliado = db.Column(db.Boolean, default=False, nullable=False)
    estado = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now())
    created_by = db.Column(db.String(36))
    updated_by = db.Column(db.String(36))

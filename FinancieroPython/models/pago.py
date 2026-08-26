import uuid
from sqlalchemy.sql import func
from utils.db import db


class Pago(db.Model):
    __tablename__ = 'pago'

    id_pago = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    id_empresa = db.Column(db.String(36), nullable=False)
    numero_pago = db.Column(db.String(50), nullable=False)
    tipo_pago = db.Column(db.String(20), nullable=False)
    id_tercero = db.Column(db.String(36), nullable=False)
    id_cuenta_bancaria = db.Column(db.String(36), nullable=True)
    fecha_pago = db.Column(db.Date, nullable=False)
    monto = db.Column(db.Numeric(15, 2), nullable=False)
    id_moneda = db.Column(db.String(36), nullable=False)
    tipo_cambio = db.Column(db.Numeric(10, 4), nullable=True, default=1)
    concepto = db.Column(db.Text, nullable=True)
    estado = db.Column(db.String(20), nullable=True, default='BORRADOR')
    id_asiento_contable = db.Column(db.String(36), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

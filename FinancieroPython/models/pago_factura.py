import uuid
from sqlalchemy.sql import func
from utils.db import db


class PagoFactura(db.Model):
    __tablename__ = 'pago_factura'

    id_pago_factura = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    id_pago = db.Column(db.String(36), nullable=False)
    id_factura = db.Column(db.String(36), nullable=False)
    monto_aplicado = db.Column(db.Numeric(15, 2), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())

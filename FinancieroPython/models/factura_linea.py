import uuid
from sqlalchemy.sql import func
from utils.db import db


class FacturaLinea(db.Model):
    __tablename__ = 'factura_linea'

    id_factura_linea = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    id_factura = db.Column(db.String(36), nullable=False)
    id_item = db.Column(db.String(36), nullable=True)
    descripcion = db.Column(db.String(500), nullable=False)
    cantidad = db.Column(db.Numeric(10, 3), nullable=False)
    precio_unitario = db.Column(db.Numeric(15, 2), nullable=False)
    descuento_porcentaje = db.Column(db.Numeric(5, 2), nullable=True, default=0)
    descuento_valor = db.Column(db.Numeric(15, 2), nullable=True, default=0)
    subtotal = db.Column(db.Numeric(15, 2), nullable=False)
    id_cuenta_contable = db.Column(db.String(36), nullable=True)
    orden = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())

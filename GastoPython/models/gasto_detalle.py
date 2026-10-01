import uuid

from sqlalchemy.sql import func

from utils.db import db
from models.pg_uuid import PGUUID


class GastoDetalle(db.Model):
    __tablename__ = 'gasto_detalle'

    id_gasto_detalle = db.Column(
        PGUUID, primary_key=True, default=lambda: str(uuid.uuid4()),
    )
    id_gasto = db.Column(
        PGUUID, db.ForeignKey('gasto.id_gasto', ondelete='CASCADE'), nullable=False,
    )
    id_item = db.Column(PGUUID, nullable=True)
    impuesto_id = db.Column(db.Integer, nullable=True)
    descripcion = db.Column(db.Text, nullable=False)
    cantidad = db.Column(db.Numeric(15, 4), nullable=False, default=1)
    precio_unitario = db.Column(db.Numeric(15, 4), nullable=False, default=0)
    descuento = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    subtotal = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    valor_impuesto = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    total = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    orden = db.Column(db.Integer, nullable=False, default=1)
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False,
    )

    gasto = db.relationship('Gasto', back_populates='detalles')

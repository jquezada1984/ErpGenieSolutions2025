import uuid

from sqlalchemy.sql import func

from utils.db import db
from models.pg_uuid import PGUUID


class Gasto(db.Model):
    __tablename__ = 'gasto'

    id_gasto = db.Column(
        PGUUID, primary_key=True, default=lambda: str(uuid.uuid4()),
    )
    id_empresa = db.Column(PGUUID, nullable=False)
    numero_gasto = db.Column(db.String(50), nullable=False)
    id_tercero = db.Column(PGUUID, nullable=True)
    id_categoria_gasto = db.Column(
        PGUUID, db.ForeignKey('categoria_gasto.id_categoria_gasto'), nullable=False,
    )
    tipo_documento = db.Column(db.String(50))
    numero_documento = db.Column(db.String(100))
    fecha_gasto = db.Column(db.Date, nullable=False)
    fecha_vencimiento = db.Column(db.Date)
    concepto = db.Column(db.Text, nullable=False)
    observacion = db.Column(db.Text)
    subtotal = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    descuento = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    impuesto = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    total = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    estado_gasto = db.Column(db.String(20), nullable=False, default='BORRADOR')
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_by = db.Column(PGUUID)
    updated_by = db.Column(PGUUID)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False,
    )

    detalles = db.relationship(
        'GastoDetalle',
        back_populates='gasto',
        cascade='all, delete-orphan',
        order_by='GastoDetalle.orden',
    )

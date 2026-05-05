import uuid
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ARRAY
from utils.db import db


class Factura(db.Model):
    __tablename__ = 'factura'

    id_factura = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    id_empresa = db.Column(db.String(36), nullable=False)
    numero_factura = db.Column(db.String(50), nullable=True)
    tipo_factura = db.Column(db.String(20), nullable=False, default='estandar')
    id_tercero = db.Column(db.String(36), nullable=False)
    fecha_factura = db.Column(db.Date, nullable=False)
    fecha_vencimiento = db.Column(db.Date, nullable=True)
    subtotal = db.Column(db.Numeric(15, 2), nullable=True)
    total_impuestos = db.Column(db.Numeric(15, 2), nullable=True, default=0)
    total_descuentos = db.Column(db.Numeric(15, 2), nullable=True, default=0)
    total_factura = db.Column(db.Numeric(15, 2), nullable=True)
    estado = db.Column(db.String(20), nullable=True, default='BORRADOR')
    id_asiento_contable = db.Column(db.String(36), nullable=True)
    id_condicion_pago = db.Column(db.String(36), nullable=True)
    id_forma_pago = db.Column(db.String(36), nullable=True)
    id_cuenta_bancaria = db.Column(db.String(36), nullable=True)
    origen = db.Column(db.String(100), nullable=True)
    id_proyecto = db.Column(db.String(36), nullable=True)
    categorias = db.Column(ARRAY(db.String()), nullable=False, default=list)
    plantilla_documento = db.Column(db.String(50), nullable=False, default='crabe')
    id_moneda = db.Column(db.String(36), nullable=True)
    nota_publica = db.Column(db.Text, nullable=True)
    nota_privada = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

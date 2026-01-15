from utils.db import db
from sqlalchemy.sql import func

class CuentaIva(db.Model):
    __tablename__ = 'cuenta_iva'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    empresa_id = db.Column(db.Integer, nullable=False)
    tipo_iva = db.Column(db.String(50), nullable=False)  # VENTA_19, VENTA_5, COMPRA_19, COMPRA_5, RETENCION, etc.
    porcentaje = db.Column(db.Numeric(5, 2), nullable=False)
    cuenta_contable_id = db.Column(db.Integer, nullable=False)
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

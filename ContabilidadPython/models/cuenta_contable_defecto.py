from utils.db import db
from sqlalchemy.sql import func

class CuentaContableDefecto(db.Model):
    __tablename__ = 'cuenta_contable_defecto'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    empresa_id = db.Column(db.Integer, nullable=False)
    tipo_operacion = db.Column(db.String(50), nullable=False)  # VENTA, COMPRA, PAGO, COBRO, IVA_VENTA, IVA_COMPRA, etc.
    cuenta_contable_id = db.Column(db.Integer, nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

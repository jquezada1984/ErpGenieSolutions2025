from utils.db import db
from sqlalchemy.sql import func

class DiarioContable(db.Model):
    __tablename__ = 'diario_contable'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    empresa_id = db.Column(db.Integer, nullable=False)
    codigo = db.Column(db.String(20), nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    tipo_diario = db.Column(db.String(50), nullable=False)  # VENTAS, COMPRAS, BANCO, EGRESOS, INGRESOS, CIERRE
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

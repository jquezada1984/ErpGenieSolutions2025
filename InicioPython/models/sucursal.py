from utils.db import db
from sqlalchemy.sql import func
import uuid

class Sucursal(db.Model):
    __tablename__ = 'sucursal'
    id_sucursal = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_empresa = db.Column(db.String(36), db.ForeignKey('empresa.id_empresa', ondelete='RESTRICT'), nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    direccion = db.Column(db.String(255))
    telefono = db.Column(db.String(20))
    codigo_establecimiento = db.Column(db.String(50))
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
    
    # Relación con Empresa
    empresa = db.relationship('Empresa', backref='sucursales') 
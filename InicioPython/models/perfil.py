from utils.db import db
from sqlalchemy.sql import func
import uuid

class Perfil(db.Model):
    __tablename__ = 'perfil'
    
    id_perfil = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = db.Column(db.String(50), nullable=False, unique=True)
    descripcion = db.Column(db.Text, nullable=True)
    estado = db.Column(db.Boolean, default=True, nullable=False)
    id_empresa = db.Column(db.String(36), db.ForeignKey('empresa.id_empresa', ondelete='RESTRICT'), nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
    
    # Relación con Empresa
    empresa = db.relationship('Empresa', backref=db.backref('perfiles', lazy='dynamic', cascade='all, delete-orphan'))
    
    def __repr__(self):
        return f"<Perfil(id_perfil={self.id_perfil}, nombre='{self.nombre}', empresa='{self.id_empresa}')>"
    
    def to_dict(self):
        """Convertir el modelo a diccionario"""
        return {
            'id_perfil': str(self.id_perfil),
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'estado': self.estado,
            'id_empresa': str(self.id_empresa),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'empresa': {
                'id_empresa': str(self.empresa.id_empresa),
                'nombre': self.empresa.nombre,
                'ruc': self.empresa.ruc,
                'estado': self.empresa.estado
            } if self.empresa else None
        } 
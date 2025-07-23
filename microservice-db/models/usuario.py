from utils.db import db
from sqlalchemy.sql import func
import uuid

class Usuario(db.Model):
    __tablename__ = 'usuario'
    id_usuario = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_empresa = db.Column(db.String(36), db.ForeignKey('empresa.id_empresa', ondelete='RESTRICT'), nullable=False)
    id_perfil = db.Column(db.String(36), db.ForeignKey('perfil.id_perfil', ondelete='RESTRICT'), nullable=False)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    nombre_completo = db.Column(db.String(100))
    email = db.Column(db.String(128))
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now()) 
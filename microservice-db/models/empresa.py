from utils.db import db
from sqlalchemy.sql import func
import uuid

class Empresa(db.Model):
    __tablename__ = 'empresa'
    id_empresa = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = db.Column(db.String(100), nullable=False)
    ruc = db.Column(db.String(13), nullable=False, unique=True)
    direccion = db.Column(db.String(255), nullable=False)
    telefono = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(128), nullable=False, unique=True)
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now()) 
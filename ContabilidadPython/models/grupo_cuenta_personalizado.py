import uuid
from sqlalchemy.sql import func
from utils.db import db


class GrupoCuentaPersonalizado(db.Model):
    __tablename__ = 'grupo_cuenta_personalizado'

    id_grupo_cuenta_personalizado = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_empresa = db.Column(db.String(36), nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    codigo = db.Column(db.String(20), nullable=True)
    etiqueta = db.Column(db.String(100), nullable=True)
    comentario = db.Column(db.Text, nullable=True)
    calculado = db.Column(db.Boolean, nullable=False, default=False)
    formula = db.Column(db.Text, nullable=True)
    posicion = db.Column(db.Integer, nullable=False, default=0)
    id_pais = db.Column(db.String(36), nullable=True)
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())


class CuentaGrupoPersonalizado(db.Model):
    __tablename__ = 'cuenta_grupo_personalizado'

    id_cuenta_grupo_personalizado = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_grupo_cuenta_personalizado = db.Column(db.String(36), nullable=False)
    id_cuenta_contable = db.Column(db.String(36), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())

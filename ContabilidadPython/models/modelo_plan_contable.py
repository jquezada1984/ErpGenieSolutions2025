import uuid
from sqlalchemy.sql import func
from utils.db import db


class ModeloPlanContable(db.Model):
    __tablename__ = 'modelo_plan_contable'

    id_modelo_plan_contable = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    codigo = db.Column(db.String(20), nullable=False, unique=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    id_pais = db.Column(db.String(36), nullable=True)
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

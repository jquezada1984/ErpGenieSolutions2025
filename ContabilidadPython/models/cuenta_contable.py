import uuid
from sqlalchemy.sql import func
from utils.db import db


class CuentaContable(db.Model):
    __tablename__ = 'cuenta_contable'

    id_cuenta_contable = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_plan_contable = db.Column(db.String(36), nullable=False)
    codigo = db.Column(db.String(50), nullable=False)
    nombre = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    tipo_cuenta = db.Column(db.String(50), nullable=False)
    nivel = db.Column(db.Integer, nullable=False, default=1)
    id_cuenta_padre = db.Column(db.String(36), nullable=True)
    permite_movimientos = db.Column(db.Boolean, nullable=False, default=True)
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

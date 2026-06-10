import uuid
from sqlalchemy.sql import func
from utils.db import db


class CuentaContableDefecto(db.Model):
    __tablename__ = 'cuenta_contable_defecto'

    id_cuenta_contable_defecto = db.Column(
        db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()),
    )
    id_empresa = db.Column(db.String(36), nullable=False)
    tipo_operacion = db.Column(db.String(50), nullable=False)
    id_cuenta_contable = db.Column(db.String(36), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

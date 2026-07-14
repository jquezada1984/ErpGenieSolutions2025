from utils.db import db
from sqlalchemy.sql import func
import uuid


class Inventario(db.Model):
    __tablename__ = "inventario"
    __table_args__ = {"schema": "public"}

    id_inventario = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_empresa = db.Column(db.String(36), nullable=False)
    inventario_ref = db.Column(db.String(100), nullable=False)
    etiqueta = db.Column(db.String(255), nullable=False)
    id_almacen = db.Column(db.String(36), nullable=False)
    estado_inventario = db.Column(db.String(30), nullable=False, default="ABIERTO")
    fecha_inicio = db.Column(db.DateTime, nullable=False, server_default=func.now())
    fecha_cierre = db.Column(db.DateTime, nullable=True)
    observacion = db.Column(db.Text, nullable=True)
    created_by = db.Column(db.String(36), nullable=True)
    updated_by = db.Column(db.String(36), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
    estado = db.Column(db.Boolean, nullable=False, default=True)

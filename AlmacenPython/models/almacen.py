from utils.db import db
from sqlalchemy.sql import func
import uuid


class Almacen(db.Model):
    """Mapeo de public.almacen (tabla existente). No crea ni altera la BD."""

    __tablename__ = "almacen"
    __table_args__ = {"schema": "public"}

    id_almacen = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_empresa = db.Column(db.String(36), nullable=True)
    almacen_ref = db.Column(db.String(50), nullable=True)
    nombre = db.Column(db.String(150), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    direccion = db.Column(db.Text, nullable=True)
    codigo_postal = db.Column(db.String(20), nullable=True)
    poblacion = db.Column(db.String(100), nullable=True)
    id_pais = db.Column(db.String(36), nullable=True)
    id_provincia = db.Column(db.String(36), nullable=True)
    telefono = db.Column(db.String(50), nullable=True)
    fax = db.Column(db.String(50), nullable=True)
    created_by = db.Column(db.String(36), nullable=True)
    updated_by = db.Column(db.String(36), nullable=True)
    created_at = db.Column(db.DateTime, nullable=True, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=True, server_default=func.now(), onupdate=func.now())
    estado = db.Column(db.Boolean, nullable=True, default=True)

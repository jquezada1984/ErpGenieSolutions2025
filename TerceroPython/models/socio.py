from utils.db import db
from sqlalchemy.sql import func
import uuid

# Import de referencia para asegurar registro de modelo relacionado
from .rol_socio import RolSocio


class Socio(db.Model):
    __tablename__ = 'socio'

    id_socio = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_rol_socio = db.Column(db.String(36), db.ForeignKey('rol_socio.id_rol_socio'), nullable=True)
    fecha_inicio = db.Column(db.Date, nullable=True)
    fecha_fin = db.Column(db.Date, nullable=True)
    estado = db.Column(db.Boolean, nullable=False, default=True)

    created_by = db.Column(db.String(36), nullable=True)
    updated_by = db.Column(db.String(36), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

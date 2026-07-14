from utils.db import db
import uuid


class RolSocio(db.Model):
    __tablename__ = 'rol_socio'

    id_rol_socio = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = db.Column(db.String(150), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    estado = db.Column(db.Boolean, nullable=False, default=True)

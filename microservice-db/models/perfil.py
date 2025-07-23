from utils.db import db
import uuid

class Perfil(db.Model):
    __tablename__ = 'perfil'
    id_perfil = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = db.Column(db.String(50), nullable=False, unique=True)
    descripcion = db.Column(db.Text)
    estado = db.Column(db.Boolean, nullable=False, default=True)
    id_empresa = db.Column(db.String(36), db.ForeignKey('empresa.id_empresa', ondelete='RESTRICT'), nullable=False) 
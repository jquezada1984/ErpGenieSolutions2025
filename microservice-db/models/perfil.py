from utils.db import db

class Perfil(db.Model):
    __tablename__ = 'perfil'
    id_perfil = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False, unique=True)
    descripcion = db.Column(db.Text)
    estado = db.Column(db.Boolean, nullable=False, default=True) 
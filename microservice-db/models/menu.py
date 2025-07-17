from utils.db import db

class Menu(db.Model):
    __tablename__ = 'menu'
    id_menu = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    ruta = db.Column(db.String(255))
    icono = db.Column(db.String(100))
    orden = db.Column(db.Integer, nullable=False, default=0)
    parent_id = db.Column(db.Integer, db.ForeignKey('menu.id_menu', ondelete='SET NULL'))
    estado = db.Column(db.Boolean, nullable=False, default=True) 
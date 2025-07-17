from utils.db import db

class PerfilMenu(db.Model):
    __tablename__ = 'perfil_menu'
    id_perfil = db.Column(db.Integer, db.ForeignKey('perfil.id_perfil', ondelete='CASCADE'), primary_key=True)
    id_menu = db.Column(db.Integer, db.ForeignKey('menu.id_menu', ondelete='CASCADE'), primary_key=True) 
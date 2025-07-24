from utils.db import db
 
class PerfilMenu(db.Model):
    __tablename__ = 'perfil_menu'
    id_perfil = db.Column(db.String(36), db.ForeignKey('perfil.id_perfil', ondelete='CASCADE'), primary_key=True)
    id_menu = db.Column(db.String(36), db.ForeignKey('menu_item.id_item', ondelete='CASCADE'), primary_key=True) 
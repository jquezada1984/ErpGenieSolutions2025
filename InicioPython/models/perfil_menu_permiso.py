from utils.db import db

class PerfilMenuPermiso(db.Model):
    __tablename__ = 'perfil_menu_permiso'
    id_perfil = db.Column(db.String(36), db.ForeignKey('perfil.id_perfil', ondelete='CASCADE'), primary_key=True)
    id_menu = db.Column(db.String(36), db.ForeignKey('menu_item.id_item', ondelete='CASCADE'), primary_key=True)
    can_visualizar = db.Column(db.Boolean, nullable=False, default=False)
    can_insertar = db.Column(db.Boolean, nullable=False, default=False)
    can_actualizar = db.Column(db.Boolean, nullable=False, default=False)
    can_eliminar = db.Column(db.Boolean, nullable=False, default=False) 
from utils.db import db
 
class UsuarioSucursal(db.Model):
    __tablename__ = 'usuario_sucursal'
    id_usuario = db.Column(db.String(36), db.ForeignKey('usuario.id_usuario', ondelete='CASCADE'), primary_key=True)
    id_sucursal = db.Column(db.String(36), db.ForeignKey('sucursal.id_sucursal', ondelete='CASCADE'), primary_key=True) 
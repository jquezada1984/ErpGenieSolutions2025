from utils.db import db
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid

class MenuSeccion(db.Model):
    __tablename__ = 'menu_seccion'
    id_seccion = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nombre = db.Column(db.String(100), nullable=False, unique=True)
    orden = db.Column(db.Integer, nullable=False, default=0)
    icono = db.Column(db.String(100), nullable=True)

class MenuItem(db.Model):
    __tablename__ = 'menu_item'
    id_item = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_seccion = db.Column(UUID(as_uuid=True), db.ForeignKey('menu_seccion.id_seccion', ondelete='CASCADE'), nullable=False)
    parent_id = db.Column(UUID(as_uuid=True), db.ForeignKey('menu_item.id_item', ondelete='CASCADE'), nullable=True)
    etiqueta = db.Column(db.String(100), nullable=False)
    icono = db.Column(db.String(100), nullable=True)
    ruta = db.Column(db.String(255), nullable=True)
    es_clickable = db.Column(db.Boolean, nullable=False, default=True)
    orden = db.Column(db.Integer, nullable=False, default=0)
    muestra_badge = db.Column(db.Boolean, nullable=False, default=False)
    badge_text = db.Column(db.String(20), nullable=True)
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_by = db.Column(db.String(36), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_by = db.Column(db.String(36), nullable=True)
    updated_at = db.Column(db.DateTime, nullable=True)
    
    # Relaciones
    seccion = db.relationship('MenuSeccion', backref='items')
    parent = db.relationship('MenuItem', remote_side=[id_item], backref='children') 
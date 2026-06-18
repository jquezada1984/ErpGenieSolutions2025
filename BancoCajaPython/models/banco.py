from sqlalchemy.sql import func
import uuid

from utils.db import db


class Banco(db.Model):
    __tablename__ = 'banco'

    id_banco = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = db.Column(db.String(150), nullable=False)
    codigo = db.Column(db.String(30))
    swift = db.Column(db.String(20))
    web = db.Column(db.String(200))
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_by = db.Column(db.String(36))
    updated_by = db.Column(db.String(36))
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now())

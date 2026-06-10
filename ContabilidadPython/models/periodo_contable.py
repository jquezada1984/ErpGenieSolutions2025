import uuid
from sqlalchemy.sql import func
from utils.db import db


class PeriodoContable(db.Model):
    __tablename__ = 'periodo_contable'

    id_periodo_contable = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_empresa = db.Column(db.String(36), nullable=False)
    anio = db.Column('año', db.Integer, nullable=False)
    mes = db.Column(db.Integer, nullable=False)
    etiqueta = db.Column(db.String(100), nullable=True)
    fecha_inicio = db.Column(db.Date, nullable=False)
    fecha_fin = db.Column(db.Date, nullable=False)
    estado = db.Column(db.String(20), nullable=False, default='ABIERTO')
    fecha_cierre = db.Column(db.DateTime, nullable=True)
    id_usuario_cierre = db.Column(db.String(36), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

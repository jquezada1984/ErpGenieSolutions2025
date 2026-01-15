from utils.db import db
from sqlalchemy.sql import func

class PeriodoContable(db.Model):
    __tablename__ = 'periodo_contable'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    empresa_id = db.Column(db.Integer, nullable=False)
    año = db.Column(db.Integer, nullable=False)
    mes = db.Column(db.Integer, nullable=False)
    fecha_inicio = db.Column(db.Date, nullable=False)
    fecha_fin = db.Column(db.Date, nullable=False)
    estado = db.Column(db.String(20), nullable=False, default='ABIERTO')  # ABIERTO, CERRADO, BLOQUEADO
    fecha_cierre = db.Column(db.DateTime, nullable=True)
    usuario_cierre_id = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

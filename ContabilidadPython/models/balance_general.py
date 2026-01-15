from utils.db import db
from sqlalchemy.sql import func

class BalanceGeneral(db.Model):
    __tablename__ = 'balance_general'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fecha_corte = db.Column(db.Date, nullable=False)
    empresa_id = db.Column(db.Integer, nullable=False)
    total_activos = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    total_pasivos = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    total_patrimonio = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    estado = db.Column(db.String(20), nullable=False, default='BORRADOR')  # BORRADOR, APROBADO
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

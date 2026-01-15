from utils.db import db
from sqlalchemy.sql import func

class LibroMayor(db.Model):
    __tablename__ = 'libro_mayor'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    empresa_id = db.Column(db.Integer, nullable=False)
    cuenta_contable_id = db.Column(db.Integer, nullable=False)
    periodo_contable_id = db.Column(db.Integer, nullable=False)
    saldo_inicial = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    total_debe = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    total_haber = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    saldo_final = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

from utils.db import db
from sqlalchemy.sql import func

class CuentaBancaria(db.Model):
    __tablename__ = 'cuenta_bancaria'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    empresa_id = db.Column(db.Integer, nullable=False)
    banco_id = db.Column(db.Integer, nullable=False)
    numero_cuenta = db.Column(db.String(50), nullable=False)
    tipo_cuenta = db.Column(db.String(20), nullable=False)  # CORRIENTE, AHORROS, FIDUCIA
    moneda_id = db.Column(db.Integer, nullable=False)
    cuenta_contable_id = db.Column(db.Integer, nullable=True)
    saldo_inicial = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    saldo_actual = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

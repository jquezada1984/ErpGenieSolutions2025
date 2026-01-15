from utils.db import db
from sqlalchemy.sql import func

class MovimientoContable(db.Model):
    __tablename__ = 'movimiento_contable'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    asiento_contable_id = db.Column(db.Integer, db.ForeignKey('asiento_contable.id', ondelete='CASCADE'), nullable=False)
    cuenta_contable_id = db.Column(db.Integer, db.ForeignKey('cuenta_contable.id'), nullable=False)
    debe = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    haber = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    concepto = db.Column(db.String(500))
    documento_referencia = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    cuenta_contable = db.relationship('CuentaContable', backref='movimientos')

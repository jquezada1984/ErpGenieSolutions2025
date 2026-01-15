from utils.db import db
from sqlalchemy.sql import func

class CuentaContable(db.Model):
    __tablename__ = 'cuenta_contable'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    plan_contable_id = db.Column(db.Integer, nullable=True)
    codigo = db.Column(db.String(20), nullable=False)
    nombre = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.String(500))
    tipo = db.Column(db.String(20), nullable=False)  # ACTIVO, PASIVO, PATRIMONIO, INGRESO, GASTO, COSTO
    naturaleza = db.Column(db.String(20), nullable=False)  # DEUDORA, ACREEDORA
    nivel = db.Column(db.Integer, nullable=False, default=1)
    cuenta_padre_id = db.Column(db.Integer, db.ForeignKey('cuenta_contable.id'), nullable=True)
    permite_movimientos = db.Column(db.Boolean, nullable=False, default=True)
    activa = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    cuenta_padre = db.relationship('CuentaContable', remote_side=[id], backref='cuentas_hijas')

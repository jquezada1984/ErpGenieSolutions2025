from utils.db import db
from sqlalchemy.sql import func

class AsientoContable(db.Model):
    __tablename__ = 'asiento_contable'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    numero = db.Column(db.String(20), nullable=False, unique=True)
    fecha = db.Column(db.Date, nullable=False)
    concepto = db.Column(db.String(500), nullable=False)
    total_debe = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    total_haber = db.Column(db.Numeric(15, 2), nullable=False, default=0)
    estado = db.Column(db.String(20), nullable=False, default='BORRADOR')  # BORRADOR, APROBADO, ANULADO
    usuario_id = db.Column(db.Integer, nullable=True)
    empresa_id = db.Column(db.Integer, nullable=True)
    diario_contable_id = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    movimientos = db.relationship('MovimientoContable', backref='asiento_contable', cascade='all, delete-orphan')

import uuid
from sqlalchemy.sql import func
from utils.db import db

TIPOS_DIARIO_VALIDOS = {
    'OPERACIONES_VARIAS',
    'VENTAS',
    'COMPRAS',
    'BANCO',
    'GASTOS',
    'INVENTARIO',
    'GANANCIAS_RETENIDAS',
}


class DiarioContable(db.Model):
    __tablename__ = 'diario_contable'

    id_diario_contable = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_empresa = db.Column(db.String(36), nullable=False)
    codigo = db.Column(db.String(20), nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    tipo_diario = db.Column(db.String(50), nullable=False)
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

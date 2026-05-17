"""Modelos para diccionarios / catálogos administrables."""
import uuid
from utils.db import db


class CondicionPagoCatalogo(db.Model):
    __tablename__ = 'condicion_pago_catalogo'

    id_condicion_pago = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    codigo = db.Column(db.String(32), nullable=False, unique=True)
    etiqueta = db.Column(db.String(100), nullable=False)
    etiqueta_documento = db.Column(db.String(255))
    porcentaje_deposito = db.Column(db.Numeric(5, 2), default=0)
    numero_dias = db.Column(db.Integer, default=0)
    tipo_fin_mes = db.Column(db.String(20), default='ninguno')
    decalaje_dias = db.Column(db.Integer)
    orden = db.Column(db.Integer, default=0)
    activo = db.Column(db.Boolean, nullable=False, default=True)


class FormaPagoCatalogo(db.Model):
    __tablename__ = 'forma_pago_catalogo'

    id_forma_pago = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    codigo = db.Column(db.String(16), nullable=False, unique=True)
    etiqueta = db.Column(db.String(100), nullable=False)
    tipo_uso = db.Column(db.String(30), nullable=False, default='cliente_proveedor')
    orden = db.Column(db.Integer, default=0)
    activo = db.Column(db.Boolean, nullable=False, default=True)


class FormatoPapelCatalogo(db.Model):
    __tablename__ = 'formato_papel_catalogo'

    id_formato_papel = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    codigo = db.Column(db.String(32), nullable=False, unique=True)
    etiqueta = db.Column(db.String(100), nullable=False)
    largo = db.Column(db.Numeric(10, 2), nullable=False)
    alto = db.Column(db.Numeric(10, 2), nullable=False)
    unidad_medida = db.Column(db.String(10), nullable=False, default='mm')
    orden = db.Column(db.Integer, default=0)
    activo = db.Column(db.Boolean, nullable=False, default=True)

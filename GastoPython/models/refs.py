"""Modelos de solo lectura para validar FKs multiempresa (tablas existentes)."""
from utils.db import db
from models.pg_uuid import PGUUID


class TerceroRef(db.Model):
    __tablename__ = 'tercero'
    __table_args__ = {'extend_existing': True}

    id_tercero = db.Column(PGUUID, primary_key=True)
    id_empresa = db.Column(PGUUID, nullable=False)


class ItemRef(db.Model):
    __tablename__ = 'item'
    __table_args__ = {'extend_existing': True}

    id_item = db.Column(PGUUID, primary_key=True)
    id_empresa = db.Column(PGUUID, nullable=False)


class ImpuestoRef(db.Model):
    __tablename__ = 'impuestos'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String)
    tasa = db.Column(db.Numeric(5, 2), nullable=False)

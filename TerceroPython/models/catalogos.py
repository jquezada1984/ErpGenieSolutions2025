"""
Modelos stub para tablas de catálogo y referencias.
Estos modelos solo se usan para que SQLAlchemy reconozca las tablas
y pueda crear las foreign keys correctamente.
No se usan directamente en el código, solo para referencias.
"""
from utils.db import db

class CondicionPagoCatalogo(db.Model):
    """Modelo stub para condicion_pago_catalogo"""
    __tablename__ = 'condicion_pago_catalogo'
    id_condicion_pago = db.Column(db.String(36), primary_key=True)

class FormaPagoCatalogo(db.Model):
    """Modelo stub para forma_pago_catalogo"""
    __tablename__ = 'forma_pago_catalogo'
    id_forma_pago = db.Column(db.String(36), primary_key=True)

class TipoTerceroCatalogo(db.Model):
    """Modelo stub para tipo_tercero_catalogo"""
    __tablename__ = 'tipo_tercero_catalogo'
    id_tipo_tercero = db.Column(db.String(36), primary_key=True)

class TipoEntidadComercial(db.Model):
    """Modelo stub para tipo_entidad_comercial"""
    __tablename__ = 'tipo_entidad_comercial'
    id_tipo_entidad = db.Column(db.SmallInteger, primary_key=True)

class IncotermCatalogo(db.Model):
    """Modelo stub para incoterm_catalogo"""
    __tablename__ = 'incoterm_catalogo'
    id_incoterm = db.Column(db.String(36), primary_key=True)

class Pais(db.Model):
    """Modelo stub para pais"""
    __tablename__ = 'pais'
    id_pais = db.Column(db.String(36), primary_key=True)

class Empresa(db.Model):
    """Modelo stub para empresa"""
    __tablename__ = 'empresa'
    id_empresa = db.Column(db.String(36), primary_key=True)

class Provincia(db.Model):
    """Modelo stub para provincia (FK desde tercero.id_provincia)"""
    __tablename__ = 'provincia'
    id_provincia = db.Column(db.String(36), primary_key=True)
    nombre = db.Column(db.String(100))

from utils.db import db
from sqlalchemy.sql import func
import uuid
from .usuario import Usuario

class Pais(db.Model):
    __tablename__ = 'pais'
    id_pais = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = db.Column(db.String(100), nullable=False, unique=True)
    codigo_iso = db.Column(db.String(2), nullable=False, unique=True)
    icono = db.Column(db.Text, nullable=False, default='')

class Moneda(db.Model):
    __tablename__ = 'moneda'
    id_moneda = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    codigo = db.Column(db.String(3), nullable=False, unique=True)
    nombre = db.Column(db.String(50), nullable=False)

class Provincia(db.Model):
    __tablename__ = 'provincia'
    id_provincia = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = db.Column(db.String(100), nullable=False)
    id_pais = db.Column(db.String(36), db.ForeignKey('pais.id_pais'), nullable=False)

class TipoEntidadComercial(db.Model):
    __tablename__ = 'tipo_entidad_comercial'
    id_tipo_entidad = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False, unique=True)
    descripcion = db.Column(db.Text)

class SocialNetwork(db.Model):
    __tablename__ = 'social_network'
    id_red_social = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = db.Column(db.String(50), nullable=False, unique=True)
    icono = db.Column(db.String(10), nullable=False)
    orden = db.Column(db.Integer, nullable=False, default=0)

class Empresa(db.Model):
    __tablename__ = 'empresa'
    id_empresa = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre = db.Column(db.String(100), nullable=False)
    ruc = db.Column(db.String(13), nullable=False, unique=True)
    direccion = db.Column(db.String(255))
    telefono = db.Column(db.String(20))
    email = db.Column(db.String(128), unique=True)
    estado = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
    
    # Nuevos campos
    id_moneda = db.Column(db.String(36), db.ForeignKey('moneda.id_moneda'))
    id_pais = db.Column(db.String(36), db.ForeignKey('pais.id_pais'))
    codigo_postal = db.Column(db.String(20))
    poblacion = db.Column(db.String(100))
    movil = db.Column(db.String(20))
    fax = db.Column(db.String(20))
    web = db.Column(db.String(255))
    logo = db.Column(db.LargeBinary)
    logotipo_cuadrado = db.Column(db.LargeBinary)
    nota = db.Column(db.Text)
    sujeto_iva = db.Column(db.Boolean, nullable=False, default=True)
    id_provincia = db.Column(db.String(36), db.ForeignKey('provincia.id_provincia'))
    fiscal_year_start_month = db.Column(db.Integer, nullable=False, default=1)
    fiscal_year_start_day = db.Column(db.Integer, nullable=False, default=1)
    
    # Relaciones
    moneda = db.relationship('Moneda', backref='empresas')
    pais = db.relationship('Pais', backref='empresas')
    provincia = db.relationship('Provincia', backref='empresas')

class EmpresaIdentificacion(db.Model):
    __tablename__ = 'empresa_identificacion'
    id_identificacion = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_empresa = db.Column(db.String(36), db.ForeignKey('empresa.id_empresa', ondelete='CASCADE'), nullable=False, unique=True)
    administradores = db.Column(db.String(255))
    delegado_datos = db.Column(db.String(255))
    capital = db.Column(db.Numeric(14, 2))
    id_tipo_entidad = db.Column(db.Integer, db.ForeignKey('tipo_entidad_comercial.id_tipo_entidad'))
    objeto_empresa = db.Column(db.Text)
    cif_intra = db.Column(db.String(64))
    id_profesional1 = db.Column(db.String(100))
    id_profesional2 = db.Column(db.String(100))
    id_profesional3 = db.Column(db.String(100))
    id_profesional4 = db.Column(db.String(100))
    id_profesional5 = db.Column(db.String(100))
    id_profesional6 = db.Column(db.String(100))
    id_profesional7 = db.Column(db.String(100))
    id_profesional8 = db.Column(db.String(100))
    id_profesional9 = db.Column(db.String(100))
    id_profesional10 = db.Column(db.String(100))
    created_by = db.Column(db.String(36), db.ForeignKey('usuario.id_usuario'), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_by = db.Column(db.String(36), db.ForeignKey('usuario.id_usuario'), nullable=True)
    updated_at = db.Column(db.DateTime, nullable=True)
    
    # Relaciones
    empresa = db.relationship('Empresa', backref='identificacion')
    tipo_entidad = db.relationship('TipoEntidadComercial')

class EmpresaRedSocial(db.Model):
    __tablename__ = 'empresa_red_social'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_empresa = db.Column(db.String(36), db.ForeignKey('empresa.id_empresa', ondelete='CASCADE'), nullable=False)
    id_red_social = db.Column(db.String(36), db.ForeignKey('social_network.id_red_social'), nullable=False)
    identificador = db.Column(db.String(100))
    url = db.Column(db.String(255))
    es_principal = db.Column(db.Boolean, nullable=False, default=False)
    created_by = db.Column(db.String(36), db.ForeignKey('usuario.id_usuario'), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_by = db.Column(db.String(36), db.ForeignKey('usuario.id_usuario'), nullable=True)
    updated_at = db.Column(db.DateTime, nullable=True)
    
    # Relaciones
    empresa = db.relationship('Empresa', backref='redes_sociales')
    red_social = db.relationship('SocialNetwork')

class EmpresaHorarioApertura(db.Model):
    __tablename__ = 'empresa_horario_apertura'
    id_horario = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_empresa = db.Column(db.String(36), db.ForeignKey('empresa.id_empresa', ondelete='CASCADE'), nullable=False)
    dia = db.Column(db.Integer, nullable=False)
    valor = db.Column(db.String(50))
    created_by = db.Column(db.String(36), db.ForeignKey('usuario.id_usuario'), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_by = db.Column(db.String(36), db.ForeignKey('usuario.id_usuario'), nullable=True)
    updated_at = db.Column(db.DateTime, nullable=True)
    
    # Relaciones - simplificar para evitar problemas
    empresa = db.relationship('Empresa', backref=db.backref('horarios_apertura', lazy='dynamic', cascade='all, delete-orphan'))
    
    # Constraint único
    __table_args__ = (db.UniqueConstraint('id_empresa', 'dia', name='uq_empresa_dia'),) 
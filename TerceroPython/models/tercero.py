from utils.db import db
from sqlalchemy.sql import func
import uuid

# Importar modelos de catálogo y referencias para que SQLAlchemy los reconozca
from .catalogos import (
    CondicionPagoCatalogo, 
    FormaPagoCatalogo, 
    TipoTerceroCatalogo, 
    TipoEntidadComercial,
    Pais,
    Empresa
)

class Tercero(db.Model):
    __tablename__ = 'tercero'

    id_tercero = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_empresa = db.Column(db.String(36), db.ForeignKey('empresa.id_empresa'), nullable=False)

    # Roles
    cliente_potencial = db.Column(db.Boolean, nullable=False, default=False)
    cliente           = db.Column(db.Boolean, nullable=False, default=False)
    proveedor         = db.Column(db.Boolean, nullable=False, default=False)

    # General
    nombre                 = db.Column(db.String(150), nullable=False)
    apodo                  = db.Column(db.String(150))
    codigo_cliente         = db.Column(db.String(30))  # usa unique parcial en BD si lo prefieres
    estado                 = db.Column(db.Boolean, nullable=False, default=True)

    # Ubicación
    direccion     = db.Column(db.Text)
    poblacion     = db.Column(db.String(100))
    codigo_postal = db.Column(db.String(20))
    id_pais       = db.Column(db.String(36), db.ForeignKey('pais.id_pais'))
    provincia     = db.Column(db.String(100))

    # Contacto
    telefono = db.Column(db.String(30))
    movil    = db.Column(db.String(30))
    fax      = db.Column(db.String(30))
    web      = db.Column(db.String(200))
    correo   = db.Column(db.String(150))
    logo     = db.Column(db.Text)

    # Identificaciones
    id_profesional_1 = db.Column(db.String(50))
    id_profesional_2 = db.Column(db.String(50))
    cif_intra        = db.Column(db.String(50))

    # Comercial
    sujeto_iva             = db.Column(db.Boolean, nullable=False, default=True)
    id_tipo_tercero        = db.Column(db.String(36), db.ForeignKey('tipo_tercero_catalogo.id_tipo_tercero'), nullable=True)
    id_tipo_entidad        = db.Column(db.SmallInteger, db.ForeignKey('tipo_entidad_comercial.id_tipo_entidad'), nullable=True)
    capital                = db.Column(db.Numeric(18, 2), default=0)
    id_condicion_pago      = db.Column(db.String(36), db.ForeignKey('condicion_pago_catalogo.id_condicion_pago'), nullable=True)
    id_forma_pago          = db.Column(db.String(36), db.ForeignKey('forma_pago_catalogo.id_forma_pago'), nullable=True)

    # Organización
    sede_central = db.Column(db.String(36), db.ForeignKey('tercero.id_tercero'), nullable=True)
    asignado_a   = db.Column(db.String(36), db.ForeignKey('tercero.id_tercero'), nullable=True)  # Sin foreign key - campo simple

    # Auditoría
    creado_por     = db.Column(db.String(36), nullable=True)  # Sin foreign key - campo simple
    modificado_por = db.Column(db.String(36), nullable=True)  # Sin foreign key - campo simple
    created_at     = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at     = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

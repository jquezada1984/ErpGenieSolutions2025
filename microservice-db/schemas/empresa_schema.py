from marshmallow import Schema, fields, validate, validates, ValidationError
from datetime import datetime

class PaisSchema(Schema):
    id_pais = fields.Str(dump_only=True)
    nombre = fields.Str(required=True, validate=validate.Length(max=100))
    codigo_iso = fields.Str(required=True, validate=validate.Length(equal=2))
    icono = fields.Str(load_default='')

class MonedaSchema(Schema):
    id_moneda = fields.Str(dump_only=True)
    codigo = fields.Str(required=True, validate=validate.Length(max=3))
    nombre = fields.Str(required=True, validate=validate.Length(max=50))

class ProvinciaSchema(Schema):
    id_provincia = fields.Str(dump_only=True)
    nombre = fields.Str(required=True, validate=validate.Length(max=100))
    id_pais = fields.Str(required=True)

class TipoEntidadComercialSchema(Schema):
    id_tipo_entidad = fields.Int(dump_only=True)
    nombre = fields.Str(required=True, validate=validate.Length(max=100))
    descripcion = fields.Str()

class SocialNetworkSchema(Schema):
    id_red_social = fields.Str(dump_only=True)
    nombre = fields.Str(required=True, validate=validate.Length(max=50))
    icono = fields.Str(required=True, validate=validate.Length(max=10))
    orden = fields.Int(load_default=0)

class EmpresaIdentificacionSchema(Schema):
    id_identificacion = fields.Str(dump_only=True)
    id_empresa = fields.Str(required=True)
    administradores = fields.Str(validate=validate.Length(max=255))
    delegado_datos = fields.Str(validate=validate.Length(max=255))
    capital = fields.Decimal(places=2)
    id_tipo_entidad = fields.Int()
    objeto_empresa = fields.Str()
    cif_intra = fields.Str(validate=validate.Length(max=64))
    id_profesional1 = fields.Str(validate=validate.Length(max=100))
    id_profesional2 = fields.Str(validate=validate.Length(max=100))
    id_profesional3 = fields.Str(validate=validate.Length(max=100))
    id_profesional4 = fields.Str(validate=validate.Length(max=100))
    id_profesional5 = fields.Str(validate=validate.Length(max=100))
    id_profesional6 = fields.Str(validate=validate.Length(max=100))
    id_profesional7 = fields.Str(validate=validate.Length(max=100))
    id_profesional8 = fields.Str(validate=validate.Length(max=100))
    id_profesional9 = fields.Str(validate=validate.Length(max=100))
    id_profesional10 = fields.Str(validate=validate.Length(max=100))
    created_by = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    updated_by = fields.Str()
    updated_at = fields.DateTime(dump_only=True)

class EmpresaRedSocialSchema(Schema):
    id = fields.Str(dump_only=True)
    id_empresa = fields.Str(required=True)
    id_red_social = fields.Str(required=True)
    identificador = fields.Str(validate=validate.Length(max=100))
    url = fields.Str(validate=validate.Length(max=255))
    es_principal = fields.Bool(load_default=False)
    created_by = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    updated_by = fields.Str()
    updated_at = fields.DateTime(dump_only=True)

class EmpresaHorarioAperturaSchema(Schema):
    id_horario = fields.Str(dump_only=True)
    id_empresa = fields.Str(required=True)
    dia = fields.Int(required=True, validate=validate.Range(min=1, max=7))
    valor = fields.Str(validate=validate.Length(max=50))
    created_by = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    updated_by = fields.Str()
    updated_at = fields.DateTime(dump_only=True)

class EmpresaSchema(Schema):
    id_empresa = fields.Str(dump_only=True)
    nombre = fields.Str(required=True, validate=validate.Length(max=100))
    ruc = fields.Str(required=True, validate=validate.Length(max=13))
    direccion = fields.Str(validate=validate.Length(max=255))
    telefono = fields.Str(validate=validate.Length(max=20))
    email = fields.Email(validate=validate.Length(max=128))
    estado = fields.Bool(load_default=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    
    # Nuevos campos
    id_moneda = fields.Str()
    id_pais = fields.Str()
    codigo_postal = fields.Str(validate=validate.Length(max=20))
    poblacion = fields.Str(validate=validate.Length(max=100))
    movil = fields.Str(validate=validate.Length(max=20))
    fax = fields.Str(validate=validate.Length(max=20))
    web = fields.Str(validate=validate.Length(max=255))
    logo = fields.Raw()
    logotipo_cuadrado = fields.Raw()
    nota = fields.Str()
    sujeto_iva = fields.Bool(load_default=True)
    id_provincia = fields.Str()
    fiscal_year_start_month = fields.Int(load_default=1, validate=validate.Range(min=1, max=12))
    fiscal_year_start_day = fields.Int(load_default=1, validate=validate.Range(min=1, max=31))
    
    # Relaciones
    moneda = fields.Nested(MonedaSchema, dump_only=True)
    pais = fields.Nested(PaisSchema, dump_only=True)
    provincia = fields.Nested(ProvinciaSchema, dump_only=True)
    identificacion = fields.Nested(EmpresaIdentificacionSchema, dump_only=True)
    redes_sociales = fields.Nested(EmpresaRedSocialSchema, many=True, dump_only=True)
    horarios_apertura = fields.Nested(EmpresaHorarioAperturaSchema, many=True, dump_only=True)

    @validates('fiscal_year_start_month')
    def validate_fiscal_year_start_month(self, value):
        if value < 1 or value > 12:
            raise ValidationError('El mes debe estar entre 1 y 12')

    @validates('fiscal_year_start_day')
    def validate_fiscal_year_start_day(self, value):
        if value < 1 or value > 31:
            raise ValidationError('El día debe estar entre 1 y 31')

# Esquemas para operaciones específicas
class EmpresaCreateSchema(EmpresaSchema):
    """Esquema para crear empresa (sin campos de solo lectura)"""
    pass

class EmpresaUpdateSchema(EmpresaSchema):
    """Esquema para actualizar empresa (todos los campos opcionales)"""
    nombre = fields.Str(validate=validate.Length(max=100))
    ruc = fields.Str(validate=validate.Length(max=13))
    email = fields.Email(validate=validate.Length(max=128))

# Esquemas para las entidades relacionadas
class PaisCreateSchema(PaisSchema):
    pass

class MonedaCreateSchema(MonedaSchema):
    pass

class ProvinciaCreateSchema(ProvinciaSchema):
    pass

class TipoEntidadComercialCreateSchema(TipoEntidadComercialSchema):
    pass

class SocialNetworkCreateSchema(SocialNetworkSchema):
    pass 
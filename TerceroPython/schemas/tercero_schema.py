from marshmallow import Schema, fields, validates, validates_schema, ValidationError, INCLUDE

class TerceroCreateSchema(Schema):
    class Meta:
        unknown = INCLUDE

    # Roles
    cliente_potencial = fields.Bool(load_default=False)
    cliente           = fields.Bool(load_default=False)
    proveedor         = fields.Bool(load_default=False)

    # General
    nombre                 = fields.Str(required=True)
    apodo                  = fields.Str(allow_none=True)
    codigo_cliente         = fields.Str(allow_none=True)
    estado                 = fields.Bool(load_default=True)
    sujeto_iva             = fields.Bool(load_default=True)
    id_tipo_tercero        = fields.UUID(allow_none=True)
    tipo_entidad_comercial = fields.Str(allow_none=True)

    # Ubicación/Contacto
    direccion     = fields.Str(allow_none=True)
    poblacion     = fields.Str(allow_none=True)
    codigo_postal = fields.Str(allow_none=True)
    id_pais       = fields.UUID(allow_none=True)
    provincia     = fields.Str(allow_none=True)
    id_provincia  = fields.UUID(allow_none=True)
    telefono      = fields.Str(allow_none=True)
    movil         = fields.Str(allow_none=True)
    fax           = fields.Str(allow_none=True)
    web           = fields.Str(allow_none=True)
    correo        = fields.Email(allow_none=True)
    logo          = fields.Str(allow_none=True)

    # Comercial/Org
    id_condicion_pago = fields.UUID(allow_none=True)
    id_forma_pago     = fields.UUID(allow_none=True)
    capital           = fields.Decimal(places=2, allow_none=True)
    id_profesional_1  = fields.Str(allow_none=True)
    id_profesional_2  = fields.Str(allow_none=True)
    cif_intra         = fields.Str(allow_none=True)
    sede_central      = fields.UUID(allow_none=True)
    asignado_a        = fields.UUID(allow_none=True)

    @validates('capital')
    def validate_capital(self, value):
        if value is not None and float(value) < 0:
            raise ValidationError('El capital no puede ser negativo.')

    @validates_schema
    def validate_roles(self, data, **kwargs):
        if not (data.get('cliente_potencial') or data.get('cliente') or data.get('proveedor')):
            raise ValidationError('Seleccione al menos un rol: cliente potencial, cliente o proveedor.')

class TerceroUpdateSchema(Schema):
    class Meta:
        unknown = INCLUDE

    cliente_potencial = fields.Bool()
    cliente           = fields.Bool()
    proveedor         = fields.Bool()

    nombre                 = fields.Str()
    apodo                  = fields.Str(allow_none=True)
    codigo_cliente         = fields.Str(allow_none=True)
    estado                 = fields.Bool()
    sujeto_iva             = fields.Bool()
    id_tipo_tercero        = fields.UUID(allow_none=True)
    tipo_entidad_comercial = fields.Str(allow_none=True)

    direccion     = fields.Str(allow_none=True)
    poblacion     = fields.Str(allow_none=True)
    codigo_postal = fields.Str(allow_none=True)
    id_pais       = fields.UUID(allow_none=True)
    provincia     = fields.Str(allow_none=True)
    telefono      = fields.Str(allow_none=True)
    movil         = fields.Str(allow_none=True)
    fax           = fields.Str(allow_none=True)
    web           = fields.Str(allow_none=True)
    correo        = fields.Email(allow_none=True)
    logo          = fields.Str(allow_none=True)

    id_condicion_pago = fields.UUID(allow_none=True)
    id_forma_pago     = fields.UUID(allow_none=True)
    capital           = fields.Decimal(places=2, allow_none=True)
    id_profesional_1  = fields.Str(allow_none=True)
    id_profesional_2  = fields.Str(allow_none=True)
    cif_intra         = fields.Str(allow_none=True)
    sede_central      = fields.UUID(allow_none=True)
    asignado_a        = fields.UUID(allow_none=True)

class TerceroOutSchema(Schema):
    id_tercero = fields.UUID()
    id_empresa = fields.UUID()

    cliente_potencial = fields.Bool()
    cliente           = fields.Bool()
    proveedor         = fields.Bool()

    nombre                 = fields.Str()
    apodo                  = fields.Str(allow_none=True)
    codigo_cliente         = fields.Str(allow_none=True)
    estado                 = fields.Bool()
    sujeto_iva             = fields.Bool()
    id_tipo_tercero        = fields.UUID(allow_none=True)
    tipo_entidad_comercial = fields.Str(allow_none=True)

    direccion     = fields.Str(allow_none=True)
    poblacion     = fields.Str(allow_none=True)
    codigo_postal = fields.Str(allow_none=True)
    id_pais       = fields.UUID(allow_none=True)
    id_provincia  = fields.UUID(allow_none=True)
    telefono      = fields.Str(allow_none=True)
    movil         = fields.Str(allow_none=True)
    fax           = fields.Str(allow_none=True)
    web           = fields.Str(allow_none=True)
    correo        = fields.Str(allow_none=True)
    logo          = fields.Str(allow_none=True)

    id_condicion_pago = fields.UUID(allow_none=True)
    id_forma_pago     = fields.UUID(allow_none=True)
    capital           = fields.Decimal(places=2, allow_none=True)
    id_profesional_1  = fields.Str(allow_none=True)
    id_profesional_2  = fields.Str(allow_none=True)
    cif_intra         = fields.Str(allow_none=True)
    sede_central      = fields.UUID(allow_none=True)
    asignado_a        = fields.UUID(allow_none=True)

    created_by     = fields.UUID(allow_none=True)
    updated_by = fields.UUID(allow_none=True)
    created_at     = fields.DateTime()
    updated_at     = fields.DateTime()

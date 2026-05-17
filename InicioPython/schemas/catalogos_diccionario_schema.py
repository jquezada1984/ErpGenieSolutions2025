from marshmallow import Schema, fields, validate, EXCLUDE


class CondicionPagoSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id_condicion_pago = fields.UUID(dump_only=True)
    codigo = fields.Str(required=True, validate=validate.Length(max=32))
    etiqueta = fields.Str(required=True, validate=validate.Length(max=100))
    etiqueta_documento = fields.Str(allow_none=True, validate=validate.Length(max=255))
    porcentaje_deposito = fields.Decimal(as_string=True, load_default=0)
    numero_dias = fields.Int(load_default=0)
    tipo_fin_mes = fields.Str(load_default='ninguno', validate=validate.OneOf(['ninguno', 'fin_mes']))
    decalaje_dias = fields.Int(allow_none=True)
    orden = fields.Int(load_default=0)
    activo = fields.Bool(load_default=True)


class FormaPagoSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id_forma_pago = fields.UUID(dump_only=True)
    codigo = fields.Str(required=True, validate=validate.Length(max=16))
    etiqueta = fields.Str(required=True, validate=validate.Length(max=100))
    tipo_uso = fields.Str(
        required=True,
        validate=validate.OneOf(['cliente_proveedor', 'solo_cliente', 'solo_proveedor']),
    )
    orden = fields.Int(load_default=0)
    activo = fields.Bool(load_default=True)


class MonedaDiccionarioSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id_moneda = fields.UUID(dump_only=True)
    codigo = fields.Str(required=True, validate=validate.Length(max=3))
    nombre = fields.Str(required=True, validate=validate.Length(max=50))
    simbolo_unicode = fields.Str(allow_none=True, validate=validate.Length(max=10))
    activo = fields.Bool(load_default=True)


class TipoEntidadLegalSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id_tipo_entidad = fields.Int(dump_only=True)
    nombre = fields.Str(required=True, validate=validate.Length(max=100))
    descripcion = fields.Str(allow_none=True)
    activo = fields.Bool(load_default=True)


class FormatoPapelSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id_formato_papel = fields.UUID(dump_only=True)
    codigo = fields.Str(required=True, validate=validate.Length(max=32))
    etiqueta = fields.Str(required=True, validate=validate.Length(max=100))
    largo = fields.Decimal(as_string=True, required=True)
    alto = fields.Decimal(as_string=True, required=True)
    unidad_medida = fields.Str(load_default='mm', validate=validate.Length(max=10))
    orden = fields.Int(load_default=0)
    activo = fields.Bool(load_default=True)


class ActivoPatchSchema(Schema):
    activo = fields.Bool(required=True)

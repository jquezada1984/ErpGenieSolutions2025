from marshmallow import Schema, fields, validate

class ConfiguracionContabilidadSchema(Schema):
    id = fields.Int(dump_only=True)
    empresa_id = fields.Int(required=True)
    moneda_base_id = fields.Int(required=True)
    formato_cuenta = fields.Str(validate=validate.Length(max=20), load_default='XXXX-XXXX-XXXX')
    separador_cuenta = fields.Str(validate=validate.Length(max=5), load_default='-')
    longitud_nivel = fields.Int(load_default=4)
    usar_centavos = fields.Bool(load_default=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class ConfiguracionContabilidadCreateSchema(Schema):
    empresa_id = fields.Int(required=True)
    moneda_base_id = fields.Int(required=True)
    formato_cuenta = fields.Str(validate=validate.Length(max=20), load_default='XXXX-XXXX-XXXX')
    separador_cuenta = fields.Str(validate=validate.Length(max=5), load_default='-')
    longitud_nivel = fields.Int(load_default=4)
    usar_centavos = fields.Bool(load_default=True)

class ConfiguracionContabilidadUpdateSchema(Schema):
    moneda_base_id = fields.Int()
    formato_cuenta = fields.Str(validate=validate.Length(max=20))
    separador_cuenta = fields.Str(validate=validate.Length(max=5))
    longitud_nivel = fields.Int()
    usar_centavos = fields.Bool()

from marshmallow import Schema, fields, validate

class DiarioContableSchema(Schema):
    id = fields.Int(dump_only=True)
    empresa_id = fields.Int(required=True)
    codigo = fields.Str(required=True, validate=validate.Length(max=20))
    nombre = fields.Str(required=True, validate=validate.Length(max=100))
    descripcion = fields.Str(validate=validate.Length(max=500), allow_none=True)
    tipo_diario = fields.Str(required=True, validate=validate.OneOf(['VENTAS', 'COMPRAS', 'BANCO', 'EGRESOS', 'INGRESOS', 'CIERRE']))
    estado = fields.Bool(load_default=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class DiarioContableCreateSchema(Schema):
    empresa_id = fields.Int(required=True)
    codigo = fields.Str(required=True, validate=validate.Length(max=20))
    nombre = fields.Str(required=True, validate=validate.Length(max=100))
    descripcion = fields.Str(validate=validate.Length(max=500), allow_none=True)
    tipo_diario = fields.Str(required=True, validate=validate.OneOf(['VENTAS', 'COMPRAS', 'BANCO', 'EGRESOS', 'INGRESOS', 'CIERRE']))
    estado = fields.Bool(load_default=True)

class DiarioContableUpdateSchema(Schema):
    codigo = fields.Str(validate=validate.Length(max=20))
    nombre = fields.Str(validate=validate.Length(max=100))
    descripcion = fields.Str(validate=validate.Length(max=500), allow_none=True)
    tipo_diario = fields.Str(validate=validate.OneOf(['VENTAS', 'COMPRAS', 'BANCO', 'EGRESOS', 'INGRESOS', 'CIERRE']))
    estado = fields.Bool()

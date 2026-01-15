from marshmallow import Schema, fields, validate

class ModeloPlanContableSchema(Schema):
    id = fields.Int(dump_only=True)
    nombre = fields.Str(required=True, validate=validate.Length(max=100))
    descripcion = fields.Str(validate=validate.Length(max=500), allow_none=True)
    codigo = fields.Str(required=True, validate=validate.Length(max=20))
    estado = fields.Bool(load_default=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class ModeloPlanContableCreateSchema(Schema):
    nombre = fields.Str(required=True, validate=validate.Length(max=100))
    descripcion = fields.Str(validate=validate.Length(max=500), allow_none=True)
    codigo = fields.Str(required=True, validate=validate.Length(max=20))
    estado = fields.Bool(load_default=True)

class ModeloPlanContableUpdateSchema(Schema):
    nombre = fields.Str(validate=validate.Length(max=100))
    descripcion = fields.Str(validate=validate.Length(max=500), allow_none=True)
    codigo = fields.Str(validate=validate.Length(max=20))
    estado = fields.Bool()

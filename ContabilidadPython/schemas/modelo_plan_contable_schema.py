from marshmallow import Schema, fields, validate


class ModeloPlanContableCrearSchema(Schema):
    codigo = fields.Str(required=True, validate=validate.Length(min=1, max=20))
    nombre = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    descripcion = fields.Str(allow_none=True)
    id_pais = fields.UUID(required=True)


class ModeloPlanContableActualizarSchema(Schema):
    codigo = fields.Str(validate=validate.Length(min=1, max=20))
    nombre = fields.Str(validate=validate.Length(min=1, max=100))
    descripcion = fields.Str(allow_none=True)
    id_pais = fields.UUID()


class ModeloPlanContableOutSchema(Schema):
    id_modelo_plan_contable = fields.Str()
    codigo = fields.Str()
    nombre = fields.Str()
    descripcion = fields.Str(allow_none=True)
    id_pais = fields.Str(allow_none=True)
    estado = fields.Bool()

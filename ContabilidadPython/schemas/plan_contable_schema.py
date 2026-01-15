from marshmallow import Schema, fields, validate

class PlanContableSchema(Schema):
    id = fields.Int(dump_only=True)
    empresa_id = fields.Int(required=True)
    modelo_plan_contable_id = fields.Int(allow_none=True)
    nombre = fields.Str(required=True, validate=validate.Length(max=100))
    descripcion = fields.Str(validate=validate.Length(max=500), allow_none=True)
    estado = fields.Bool(load_default=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class PlanContableCreateSchema(Schema):
    empresa_id = fields.Int(required=True)
    modelo_plan_contable_id = fields.Int(allow_none=True)
    nombre = fields.Str(required=True, validate=validate.Length(max=100))
    descripcion = fields.Str(validate=validate.Length(max=500), allow_none=True)
    estado = fields.Bool(load_default=True)

class PlanContableUpdateSchema(Schema):
    modelo_plan_contable_id = fields.Int(allow_none=True)
    nombre = fields.Str(validate=validate.Length(max=100))
    descripcion = fields.Str(validate=validate.Length(max=500), allow_none=True)
    estado = fields.Bool()

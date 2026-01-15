from marshmallow import Schema, fields, validate

class CuentaContableDefectoSchema(Schema):
    id = fields.Int(dump_only=True)
    empresa_id = fields.Int(required=True)
    tipo_operacion = fields.Str(required=True, validate=validate.Length(max=50))
    cuenta_contable_id = fields.Int(required=True)
    descripcion = fields.Str(validate=validate.Length(max=500), allow_none=True)
    estado = fields.Bool(load_default=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class CuentaContableDefectoCreateSchema(Schema):
    empresa_id = fields.Int(required=True)
    tipo_operacion = fields.Str(required=True, validate=validate.Length(max=50))
    cuenta_contable_id = fields.Int(required=True)
    descripcion = fields.Str(validate=validate.Length(max=500), allow_none=True)
    estado = fields.Bool(load_default=True)

class CuentaContableDefectoUpdateSchema(Schema):
    tipo_operacion = fields.Str(validate=validate.Length(max=50))
    cuenta_contable_id = fields.Int()
    descripcion = fields.Str(validate=validate.Length(max=500), allow_none=True)
    estado = fields.Bool()

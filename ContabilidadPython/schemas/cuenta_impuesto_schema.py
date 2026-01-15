from marshmallow import Schema, fields, validate

class CuentaImpuestoSchema(Schema):
    id = fields.Int(dump_only=True)
    empresa_id = fields.Int(required=True)
    tipo_impuesto = fields.Str(required=True, validate=validate.Length(max=50))
    porcentaje = fields.Decimal(places=2, required=True)
    cuenta_contable_id = fields.Int(required=True)
    estado = fields.Bool(load_default=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class CuentaImpuestoCreateSchema(Schema):
    empresa_id = fields.Int(required=True)
    tipo_impuesto = fields.Str(required=True, validate=validate.Length(max=50))
    porcentaje = fields.Decimal(places=2, required=True)
    cuenta_contable_id = fields.Int(required=True)
    estado = fields.Bool(load_default=True)

class CuentaImpuestoUpdateSchema(Schema):
    tipo_impuesto = fields.Str(validate=validate.Length(max=50))
    porcentaje = fields.Decimal(places=2)
    cuenta_contable_id = fields.Int()
    estado = fields.Bool()

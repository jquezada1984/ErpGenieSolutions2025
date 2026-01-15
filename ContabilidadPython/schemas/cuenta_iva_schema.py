from marshmallow import Schema, fields, validate

class CuentaIvaSchema(Schema):
    id = fields.Int(dump_only=True)
    empresa_id = fields.Int(required=True)
    tipo_iva = fields.Str(required=True, validate=validate.Length(max=50))
    porcentaje = fields.Decimal(places=2, required=True)
    cuenta_contable_id = fields.Int(required=True)
    estado = fields.Bool(load_default=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class CuentaIvaCreateSchema(Schema):
    empresa_id = fields.Int(required=True)
    tipo_iva = fields.Str(required=True, validate=validate.Length(max=50))
    porcentaje = fields.Decimal(places=2, required=True)
    cuenta_contable_id = fields.Int(required=True)
    estado = fields.Bool(load_default=True)

class CuentaIvaUpdateSchema(Schema):
    tipo_iva = fields.Str(validate=validate.Length(max=50))
    porcentaje = fields.Decimal(places=2)
    cuenta_contable_id = fields.Int()
    estado = fields.Bool()

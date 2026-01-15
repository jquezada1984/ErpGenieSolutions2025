from marshmallow import Schema, fields, validate

class MovimientoContableSchema(Schema):
    id = fields.Int(dump_only=True)
    asiento_contable_id = fields.Int(required=True)
    cuenta_contable_id = fields.Int(required=True)
    debe = fields.Decimal(places=2, required=True, load_default=0)
    haber = fields.Decimal(places=2, required=True, load_default=0)
    concepto = fields.Str(validate=validate.Length(max=500), allow_none=True)
    documento_referencia = fields.Str(validate=validate.Length(max=100), allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class MovimientoContableCreateSchema(Schema):
    asiento_contable_id = fields.Int(required=True)
    cuenta_contable_id = fields.Int(required=True)
    debe = fields.Decimal(places=2, required=True, load_default=0)
    haber = fields.Decimal(places=2, required=True, load_default=0)
    concepto = fields.Str(validate=validate.Length(max=500), allow_none=True)
    documento_referencia = fields.Str(validate=validate.Length(max=100), allow_none=True)

class MovimientoContableUpdateSchema(Schema):
    asiento_contable_id = fields.Int()
    cuenta_contable_id = fields.Int()
    debe = fields.Decimal(places=2)
    haber = fields.Decimal(places=2)
    concepto = fields.Str(validate=validate.Length(max=500), allow_none=True)
    documento_referencia = fields.Str(validate=validate.Length(max=100), allow_none=True)

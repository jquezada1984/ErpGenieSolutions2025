from marshmallow import Schema, fields, validate

class CuentaBancariaSchema(Schema):
    id = fields.Int(dump_only=True)
    empresa_id = fields.Int(required=True)
    banco_id = fields.Int(required=True)
    numero_cuenta = fields.Str(required=True, validate=validate.Length(max=50))
    tipo_cuenta = fields.Str(required=True, validate=validate.OneOf(['CORRIENTE', 'AHORROS', 'FIDUCIA']))
    moneda_id = fields.Int(required=True)
    cuenta_contable_id = fields.Int(allow_none=True)
    saldo_inicial = fields.Decimal(places=2, load_default=0)
    saldo_actual = fields.Decimal(places=2, load_default=0)
    estado = fields.Bool(load_default=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class CuentaBancariaCreateSchema(Schema):
    empresa_id = fields.Int(required=True)
    banco_id = fields.Int(required=True)
    numero_cuenta = fields.Str(required=True, validate=validate.Length(max=50))
    tipo_cuenta = fields.Str(required=True, validate=validate.OneOf(['CORRIENTE', 'AHORROS', 'FIDUCIA']))
    moneda_id = fields.Int(required=True)
    cuenta_contable_id = fields.Int(allow_none=True)
    saldo_inicial = fields.Decimal(places=2, load_default=0)
    saldo_actual = fields.Decimal(places=2, load_default=0)
    estado = fields.Bool(load_default=True)

class CuentaBancariaUpdateSchema(Schema):
    banco_id = fields.Int()
    numero_cuenta = fields.Str(validate=validate.Length(max=50))
    tipo_cuenta = fields.Str(validate=validate.OneOf(['CORRIENTE', 'AHORROS', 'FIDUCIA']))
    moneda_id = fields.Int()
    cuenta_contable_id = fields.Int(allow_none=True)
    saldo_inicial = fields.Decimal(places=2)
    saldo_actual = fields.Decimal(places=2)
    estado = fields.Bool()

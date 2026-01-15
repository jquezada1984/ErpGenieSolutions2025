from marshmallow import Schema, fields

class LibroMayorSchema(Schema):
    id = fields.Int(dump_only=True)
    empresa_id = fields.Int(required=True)
    cuenta_contable_id = fields.Int(required=True)
    periodo_contable_id = fields.Int(required=True)
    saldo_inicial = fields.Decimal(places=2, required=True, load_default=0)
    total_debe = fields.Decimal(places=2, required=True, load_default=0)
    total_haber = fields.Decimal(places=2, required=True, load_default=0)
    saldo_final = fields.Decimal(places=2, required=True, load_default=0)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class LibroMayorCreateSchema(Schema):
    empresa_id = fields.Int(required=True)
    cuenta_contable_id = fields.Int(required=True)
    periodo_contable_id = fields.Int(required=True)
    saldo_inicial = fields.Decimal(places=2, required=True, load_default=0)
    total_debe = fields.Decimal(places=2, required=True, load_default=0)
    total_haber = fields.Decimal(places=2, required=True, load_default=0)
    saldo_final = fields.Decimal(places=2, required=True, load_default=0)

class LibroMayorUpdateSchema(Schema):
    saldo_inicial = fields.Decimal(places=2)
    total_debe = fields.Decimal(places=2)
    total_haber = fields.Decimal(places=2)
    saldo_final = fields.Decimal(places=2)

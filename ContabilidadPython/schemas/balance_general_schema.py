from marshmallow import Schema, fields, validate
from datetime import datetime

class BalanceGeneralSchema(Schema):
    id = fields.Int(dump_only=True)
    fecha_corte = fields.Date(required=True)
    empresa_id = fields.Int(required=True)
    total_activos = fields.Decimal(places=2, load_default=0)
    total_pasivos = fields.Decimal(places=2, load_default=0)
    total_patrimonio = fields.Decimal(places=2, load_default=0)
    estado = fields.Str(validate=validate.OneOf(['BORRADOR', 'APROBADO']), load_default='BORRADOR')
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class BalanceGeneralCreateSchema(Schema):
    fecha_corte = fields.Date(required=True)
    empresa_id = fields.Int(required=True)
    total_activos = fields.Decimal(places=2, load_default=0)
    total_pasivos = fields.Decimal(places=2, load_default=0)
    total_patrimonio = fields.Decimal(places=2, load_default=0)
    estado = fields.Str(validate=validate.OneOf(['BORRADOR', 'APROBADO']), load_default='BORRADOR')

class BalanceGeneralUpdateSchema(Schema):
    fecha_corte = fields.Date()
    empresa_id = fields.Int()
    total_activos = fields.Decimal(places=2)
    total_pasivos = fields.Decimal(places=2)
    total_patrimonio = fields.Decimal(places=2)
    estado = fields.Str(validate=validate.OneOf(['BORRADOR', 'APROBADO']))

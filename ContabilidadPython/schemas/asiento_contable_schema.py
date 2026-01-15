from marshmallow import Schema, fields, validate, validates, ValidationError
from datetime import datetime

class AsientoContableSchema(Schema):
    id = fields.Int(dump_only=True)
    numero = fields.Str(required=True, validate=validate.Length(max=20))
    fecha = fields.Date(required=True)
    concepto = fields.Str(required=True, validate=validate.Length(max=500))
    total_debe = fields.Decimal(places=2, load_default=0)
    total_haber = fields.Decimal(places=2, load_default=0)
    estado = fields.Str(validate=validate.OneOf(['BORRADOR', 'APROBADO', 'ANULADO']), load_default='BORRADOR')
    usuario_id = fields.Int(allow_none=True)
    empresa_id = fields.Int(allow_none=True)
    diario_contable_id = fields.Int(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class AsientoContableCreateSchema(Schema):
    numero = fields.Str(required=True, validate=validate.Length(max=20))
    fecha = fields.Date(required=True)
    concepto = fields.Str(required=True, validate=validate.Length(max=500))
    total_debe = fields.Decimal(places=2, load_default=0)
    total_haber = fields.Decimal(places=2, load_default=0)
    estado = fields.Str(validate=validate.OneOf(['BORRADOR', 'APROBADO', 'ANULADO']), load_default='BORRADOR')
    usuario_id = fields.Int(allow_none=True)
    empresa_id = fields.Int(allow_none=True)
    diario_contable_id = fields.Int(allow_none=True)

class AsientoContableUpdateSchema(Schema):
    numero = fields.Str(validate=validate.Length(max=20))
    fecha = fields.Date()
    concepto = fields.Str(validate=validate.Length(max=500))
    total_debe = fields.Decimal(places=2)
    total_haber = fields.Decimal(places=2)
    estado = fields.Str(validate=validate.OneOf(['BORRADOR', 'APROBADO', 'ANULADO']))
    usuario_id = fields.Int(allow_none=True)
    empresa_id = fields.Int(allow_none=True)

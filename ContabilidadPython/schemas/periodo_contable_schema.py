from marshmallow import Schema, fields, validate
from datetime import datetime

class PeriodoContableSchema(Schema):
    id = fields.Int(dump_only=True)
    empresa_id = fields.Int(required=True)
    año = fields.Int(required=True)
    mes = fields.Int(required=True, validate=validate.Range(min=1, max=12))
    fecha_inicio = fields.Date(required=True)
    fecha_fin = fields.Date(required=True)
    estado = fields.Str(validate=validate.OneOf(['ABIERTO', 'CERRADO', 'BLOQUEADO']), load_default='ABIERTO')
    fecha_cierre = fields.DateTime(allow_none=True)
    usuario_cierre_id = fields.Int(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class PeriodoContableCreateSchema(Schema):
    empresa_id = fields.Int(required=True)
    año = fields.Int(required=True)
    mes = fields.Int(required=True, validate=validate.Range(min=1, max=12))
    fecha_inicio = fields.Date(required=True)
    fecha_fin = fields.Date(required=True)
    estado = fields.Str(validate=validate.OneOf(['ABIERTO', 'CERRADO', 'BLOQUEADO']), load_default='ABIERTO')

class PeriodoContableUpdateSchema(Schema):
    año = fields.Int(validate=validate.Range(min=2000, max=2100))
    mes = fields.Int(validate=validate.Range(min=1, max=12))
    fecha_inicio = fields.Date()
    fecha_fin = fields.Date()
    estado = fields.Str(validate=validate.OneOf(['ABIERTO', 'CERRADO', 'BLOQUEADO']))

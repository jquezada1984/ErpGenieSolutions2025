from marshmallow import Schema, fields, validate


class PeriodoContableCrearSchema(Schema):
    etiqueta = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    fecha_inicio = fields.Date(required=True)
    fecha_fin = fields.Date(required=True)
    anio = fields.Int(required=False)
    mes = fields.Int(required=False, validate=validate.Range(min=1, max=12))


class PeriodoContableOutSchema(Schema):
    id_periodo_contable = fields.Str()
    id_empresa = fields.Str()
    anio = fields.Int()
    mes = fields.Int()
    etiqueta = fields.Str(allow_none=True)
    fecha_inicio = fields.Date()
    fecha_fin = fields.Date()
    estado = fields.Str()
    fecha_cierre = fields.DateTime(allow_none=True)
    id_usuario_cierre = fields.Str(allow_none=True)

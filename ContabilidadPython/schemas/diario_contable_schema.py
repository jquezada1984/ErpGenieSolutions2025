from marshmallow import Schema, fields, validate
from models.diario_contable import TIPOS_DIARIO_VALIDOS


class DiarioContableCrearSchema(Schema):
    codigo = fields.Str(required=True, validate=validate.Length(min=1, max=20))
    nombre = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    descripcion = fields.Str(allow_none=True)
    tipo_diario = fields.Str(
        required=True,
        validate=validate.OneOf(sorted(TIPOS_DIARIO_VALIDOS)),
    )


class DiarioContableActualizarSchema(Schema):
    codigo = fields.Str(validate=validate.Length(min=1, max=20))
    nombre = fields.Str(validate=validate.Length(min=1, max=100))
    descripcion = fields.Str(allow_none=True)
    tipo_diario = fields.Str(validate=validate.OneOf(sorted(TIPOS_DIARIO_VALIDOS)))


class DiarioContableOutSchema(Schema):
    id_diario_contable = fields.Str()
    id_empresa = fields.Str()
    codigo = fields.Str()
    nombre = fields.Str()
    descripcion = fields.Str(allow_none=True)
    tipo_diario = fields.Str()
    estado = fields.Bool()

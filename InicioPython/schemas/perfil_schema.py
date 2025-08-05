from marshmallow import Schema, fields, validate

class EmpresaBasicSchema(Schema):
    """Schema básico para información de empresa en perfiles"""
    id_empresa = fields.Str(required=True)
    nombre = fields.Str(required=True)
    ruc = fields.Str(required=True)
    estado = fields.Bool(required=True)

class PerfilSchema(Schema):
    """Schema para serialización de perfiles"""
    id_perfil = fields.Str(dump_only=True)
    nombre = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    descripcion = fields.Str(allow_none=True)
    estado = fields.Bool()
    id_empresa = fields.Str(required=True)
    empresa = fields.Nested(EmpresaBasicSchema, dump_only=True)

class PerfilCreateSchema(Schema):
    """Schema para crear perfiles"""
    nombre = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    descripcion = fields.Str(allow_none=True)
    id_empresa = fields.Str(required=True)

class PerfilUpdateSchema(Schema):
    """Schema para actualizar perfiles"""
    nombre = fields.Str(validate=validate.Length(min=1, max=50))
    descripcion = fields.Str(allow_none=True)
    estado = fields.Bool() 
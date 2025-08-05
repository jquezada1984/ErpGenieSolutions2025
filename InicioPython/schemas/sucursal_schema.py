from marshmallow import Schema, fields, validate

class SucursalSchema(Schema):
    """Schema para serialización de sucursales"""
    id_sucursal = fields.Str(dump_only=True)
    id_empresa = fields.Str(required=True)
    nombre = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    direccion = fields.Str(allow_none=True)
    telefono = fields.Str(allow_none=True)
    codigo_establecimiento = fields.Str(allow_none=True)
    estado = fields.Bool()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class SucursalCreateSchema(Schema):
    """Schema para crear sucursales"""
    id_empresa = fields.Str(required=True)
    nombre = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    direccion = fields.Str(allow_none=True)
    telefono = fields.Str(allow_none=True)
    codigo_establecimiento = fields.Str(allow_none=True)

class SucursalUpdateSchema(Schema):
    """Schema para actualizar sucursales"""
    nombre = fields.Str(validate=validate.Length(min=1, max=100))
    direccion = fields.Str(allow_none=True)
    telefono = fields.Str(allow_none=True)
    codigo_establecimiento = fields.Str(allow_none=True)
    estado = fields.Bool() 
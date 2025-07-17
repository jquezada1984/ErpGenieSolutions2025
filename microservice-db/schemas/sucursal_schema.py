from marshmallow import Schema, fields

class SucursalSchema(Schema):
    id_sucursal = fields.Int(dump_only=True)
    id_empresa = fields.Int(required=True)
    nombre = fields.Str(required=True)
    direccion = fields.Str()
    telefono = fields.Str()
    estado = fields.Bool()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True) 
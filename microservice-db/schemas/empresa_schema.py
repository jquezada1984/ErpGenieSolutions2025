from marshmallow import Schema, fields

class EmpresaSchema(Schema):
    id_empresa = fields.Str(dump_only=True)
    nombre = fields.Str(required=True)
    ruc = fields.Str(required=True)
    direccion = fields.Str(required=True)
    telefono = fields.Str(required=True)
    email = fields.Str(required=True)
    estado = fields.Bool()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True) 
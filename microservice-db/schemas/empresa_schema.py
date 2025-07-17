from marshmallow import Schema, fields

class EmpresaSchema(Schema):
    id_empresa = fields.Int(dump_only=True)
    nombre = fields.Str(required=True)
    ruc = fields.Str(required=True)
    direccion = fields.Str()
    telefono = fields.Str()
    email = fields.Str()
    estado = fields.Bool()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True) 
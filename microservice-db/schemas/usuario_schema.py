from marshmallow import Schema, fields

class UsuarioSchema(Schema):
    id_usuario = fields.Int(dump_only=True)
    id_empresa = fields.Int(required=True)
    id_perfil = fields.Int(required=True)
    username = fields.Str(required=True)
    password_hash = fields.Str(required=True)
    nombre_completo = fields.Str()
    email = fields.Str()
    estado = fields.Bool()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True) 
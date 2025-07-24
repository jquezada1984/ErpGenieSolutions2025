from marshmallow import Schema, fields

class UsuarioSchema(Schema):
    id_usuario = fields.Str(dump_only=True)
    id_empresa = fields.Str(required=True)
    id_perfil = fields.Str(required=True)
    username = fields.Str(required=True)
    password_hash = fields.Str(required=True)
    nombre_completo = fields.Str()
    email = fields.Str()
    estado = fields.Bool()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True) 
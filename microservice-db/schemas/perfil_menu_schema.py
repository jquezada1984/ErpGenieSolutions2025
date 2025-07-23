from marshmallow import Schema, fields
 
class PerfilMenuSchema(Schema):
    id_perfil = fields.Str(required=True)
    id_menu = fields.Str(required=True) 
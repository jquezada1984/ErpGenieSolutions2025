from marshmallow import Schema, fields
 
class PerfilMenuSchema(Schema):
    id_perfil = fields.Int(required=True)
    id_menu = fields.Int(required=True) 
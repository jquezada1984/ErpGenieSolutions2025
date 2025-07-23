from marshmallow import Schema, fields
 
class UsuarioSucursalSchema(Schema):
    id_usuario = fields.Str(required=True)
    id_sucursal = fields.Str(required=True) 
from marshmallow import Schema, fields

class UsuarioSucursalSchema(Schema):
    id_usuario = fields.Int(required=True)
    id_sucursal = fields.Int(required=True) 
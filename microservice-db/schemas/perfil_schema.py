from marshmallow import Schema, fields
 
class PerfilSchema(Schema):
    id_perfil = fields.Int(dump_only=True)
    nombre = fields.Str(required=True)
    descripcion = fields.Str()
    estado = fields.Bool() 
from marshmallow import Schema, fields

class MenuSchema(Schema):
    id_menu = fields.Int(dump_only=True)
    nombre = fields.Str(required=True)
    ruta = fields.Str()
    icono = fields.Str()
    orden = fields.Int()
    parent_id = fields.Int(allow_none=True)
    estado = fields.Bool() 
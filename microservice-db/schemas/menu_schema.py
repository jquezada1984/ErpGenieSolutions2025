from marshmallow import Schema, fields

class MenuSeccionSchema(Schema):
    id_seccion = fields.Str(dump_only=True)
    nombre = fields.Str(required=True)
    orden = fields.Int()

class MenuItemSchema(Schema):
    id_item = fields.Str(dump_only=True)
    id_seccion = fields.Str(required=True)
    parent_id = fields.Str()
    etiqueta = fields.Str(required=True)
    icono = fields.Str()
    ruta = fields.Str()
    es_clickable = fields.Bool()
    orden = fields.Int()
    muestra_badge = fields.Bool()
    badge_text = fields.Str()
    estado = fields.Bool()
    created_by = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    updated_by = fields.Str()
    updated_at = fields.DateTime() 
from marshmallow import Schema, fields

class PerfilMenuPermisoSchema(Schema):
    id_perfil = fields.Str(required=True)
    id_menu = fields.Str(required=True)
    can_visualizar = fields.Bool()
    can_insertar = fields.Bool()
    can_actualizar = fields.Bool()
    can_eliminar = fields.Bool() 
from marshmallow import Schema, fields, validate


class InventarioCreateSchema(Schema):
    id_empresa = fields.UUID(required=True)
    inventario_ref = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    etiqueta = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    id_almacen = fields.UUID(required=True)
    observacion = fields.Str(allow_none=True, load_default=None)


class InventarioEstadoUpdateSchema(Schema):
    id_inventario = fields.UUID(required=True)
    estado = fields.Bool(required=True)

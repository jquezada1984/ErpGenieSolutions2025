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


class InventarioUpdateSchema(Schema):
    """Actualización de cabecera inventario (PUT). id_inventario va en la URL."""

    id_empresa = fields.UUID(required=True)
    inventario_ref = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    etiqueta = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    id_almacen = fields.UUID(required=True)
    estado_inventario = fields.Str(required=False, allow_none=True)
    fecha_inicio = fields.DateTime(required=False, allow_none=True)
    fecha_cierre = fields.DateTime(required=False, allow_none=True)
    observacion = fields.Str(allow_none=True, load_default=None)

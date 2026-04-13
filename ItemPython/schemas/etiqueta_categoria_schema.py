"""Validación de alta de filas en public.item_etiqueta_categoria."""
from marshmallow import Schema, fields, INCLUDE


class EtiquetaCategoriaCreateSchema(Schema):
    class Meta:
        unknown = INCLUDE

    id_empresa = fields.UUID(load_default=None, allow_none=True)
    ref = fields.Str(required=True)
    nombre = fields.Str(allow_none=True, load_default=None)
    descripcion = fields.Str(allow_none=True, load_default=None)
    color = fields.Str(allow_none=True, load_default=None)
    posicion = fields.Int(allow_none=True, load_default=1)
    estado = fields.Bool(load_default=True)


class EtiquetaCategoriaUpdateSchema(Schema):
    """Campos editables de public.item_etiqueta_categoria (el id va en la URL)."""

    class Meta:
        unknown = INCLUDE

    ref = fields.Str(required=True)
    nombre = fields.Str(allow_none=True, load_default=None)
    descripcion = fields.Str(allow_none=True, load_default=None)
    color = fields.Str(allow_none=True, load_default=None)
    posicion = fields.Int(allow_none=True, load_default=0)
    estado = fields.Bool(load_default=True)


class EtiquetaCategoriaEstadoSchema(Schema):
    """Solo cambio parcial de estado (activo/inactivo); id_etiqueta_categoria va en la URL."""

    class Meta:
        unknown = INCLUDE

    id_empresa = fields.UUID(load_default=None, allow_none=True)
    estado = fields.Bool(required=True)

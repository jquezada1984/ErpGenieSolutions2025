from marshmallow import Schema, fields, validate


class AlmacenCreateSchema(Schema):
    """Validación de alta de almacén (POST)."""

    id_empresa = fields.UUID(required=True)
    almacen_ref = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    nombre = fields.Str(required=True, validate=validate.Length(min=1, max=150))
    descripcion = fields.Str(allow_none=True, load_default=None)
    direccion = fields.Str(allow_none=True, load_default=None)
    codigo_postal = fields.Str(allow_none=True, load_default=None, validate=validate.Length(max=20))
    poblacion = fields.Str(allow_none=True, load_default=None, validate=validate.Length(max=100))
    id_pais = fields.UUID(required=False, allow_none=True)
    id_provincia = fields.UUID(required=False, allow_none=True)
    telefono = fields.Str(allow_none=True, load_default=None, validate=validate.Length(max=50))
    fax = fields.Str(allow_none=True, load_default=None, validate=validate.Length(max=50))
    estado = fields.Bool(required=False, load_default=True)


class AlmacenUpdateSchema(Schema):
    """Actualización de cabecera almacén (PUT). id_almacen va en la URL.
    No incluye `estado` (toggle exclusivo vía Nest actualizarEstadoAlmacen).
    """

    id_empresa = fields.UUID(required=True)
    almacen_ref = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    nombre = fields.Str(required=True, validate=validate.Length(min=1, max=150))
    descripcion = fields.Str(allow_none=True, load_default=None)
    direccion = fields.Str(allow_none=True, load_default=None)
    codigo_postal = fields.Str(allow_none=True, load_default=None, validate=validate.Length(max=20))
    poblacion = fields.Str(allow_none=True, load_default=None, validate=validate.Length(max=100))
    id_pais = fields.UUID(required=False, allow_none=True)
    id_provincia = fields.UUID(required=False, allow_none=True)
    telefono = fields.Str(allow_none=True, load_default=None, validate=validate.Length(max=50))
    fax = fields.Str(allow_none=True, load_default=None, validate=validate.Length(max=50))

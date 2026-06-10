from marshmallow import Schema, fields, validate

TIPOS_CUENTA = ['ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'GASTO', 'COSTO', 'ORDEN', 'RESULTADO']


class CuentaContableCrearSchema(Schema):
    id_plan_contable = fields.UUID(required=True)
    codigo = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    nombre = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    descripcion = fields.Str(allow_none=True)
    tipo_cuenta = fields.Str(required=True, validate=validate.OneOf(TIPOS_CUENTA))
    id_cuenta_padre = fields.UUID(allow_none=True)
    permite_movimientos = fields.Bool(missing=True)


class CuentaContableActualizarSchema(Schema):
    nombre = fields.Str(validate=validate.Length(min=1, max=200))
    descripcion = fields.Str(allow_none=True)
    tipo_cuenta = fields.Str(validate=validate.OneOf(TIPOS_CUENTA))


class CuentaContableOutSchema(Schema):
    id_cuenta_contable = fields.Str()
    id_plan_contable = fields.Str()
    codigo = fields.Str()
    nombre = fields.Str()
    descripcion = fields.Str(allow_none=True)
    tipo_cuenta = fields.Str()
    nivel = fields.Int()
    id_cuenta_padre = fields.Str(allow_none=True)
    permite_movimientos = fields.Bool()
    estado = fields.Bool()

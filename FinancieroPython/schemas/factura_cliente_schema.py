from marshmallow import Schema, fields, validate


class CrearFacturaClienteBorradorSchema(Schema):
    id_tercero = fields.UUID(required=True)
    tipo_factura = fields.String(
        load_default='estandar',
        validate=validate.OneOf(
            ['estandar', 'anticipo', 'rectificativa', 'abono', 'plantilla']
        ),
    )
    fecha_factura = fields.Date(required=True)
    fecha_vencimiento = fields.Date(load_default=None, allow_none=True)
    id_condicion_pago = fields.UUID(load_default=None, allow_none=True)
    id_forma_pago = fields.UUID(load_default=None, allow_none=True)
    id_cuenta_bancaria = fields.UUID(load_default=None, allow_none=True)
    origen = fields.String(load_default=None, allow_none=True, validate=validate.Length(max=100))
    id_proyecto = fields.UUID(load_default=None, allow_none=True)
    categorias = fields.List(fields.String(), load_default=list)
    plantilla_documento = fields.String(load_default='crabe', validate=validate.Length(max=50))
    id_moneda = fields.UUID(load_default=None, allow_none=True)
    nota_publica = fields.String(load_default=None, allow_none=True)
    nota_privada = fields.String(load_default=None, allow_none=True)

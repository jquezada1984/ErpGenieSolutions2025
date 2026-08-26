from marshmallow import Schema, fields, validate


class FacturaLineaInputSchema(Schema):
    id_item = fields.UUID(load_default=None, allow_none=True)
    descripcion = fields.String(required=True, validate=validate.Length(min=1, max=500))
    cantidad = fields.Decimal(required=True, as_string=False)
    precio_unitario = fields.Decimal(required=True, as_string=False)
    descuento_porcentaje = fields.Decimal(load_default=0, as_string=False)
    descuento_valor = fields.Decimal(load_default=0, as_string=False)
    tasa_iva = fields.Decimal(load_default=0, as_string=False)
    id_cuenta_contable = fields.UUID(load_default=None, allow_none=True)
    orden = fields.Integer(load_default=None, allow_none=True)


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
    lineas = fields.List(fields.Nested(FacturaLineaInputSchema), load_default=list)


class ReemplazarLineasSchema(Schema):
    lineas = fields.List(fields.Nested(FacturaLineaInputSchema), required=True)

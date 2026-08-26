from marshmallow import Schema, fields, validate


class PagoAplicacionSchema(Schema):
    id_factura = fields.UUID(required=True)
    monto_aplicado = fields.Decimal(required=True, as_string=False)


class CrearPagoSchema(Schema):
    id_tercero = fields.UUID(required=True)
    id_cuenta_bancaria = fields.UUID(required=True)
    id_moneda = fields.UUID(required=True)
    fecha_pago = fields.Date(required=True)
    concepto = fields.String(load_default=None, allow_none=True)
    tipo_cambio = fields.Decimal(load_default=1, as_string=False)
    aplicaciones = fields.List(fields.Nested(PagoAplicacionSchema), required=True)

from decimal import Decimal

from marshmallow import Schema, ValidationError, fields, validates


class StockSalidaSchema(Schema):
    """Contrato HTTP interno de SALIDA DE STOCK v1 (salida libre)."""

    id_empresa = fields.UUID(required=True)
    id_item = fields.UUID(required=True)
    id_almacen = fields.UUID(required=True)
    id_origen = fields.UUID(required=True)
    cantidad = fields.Decimal(required=True, as_string=False)
    fecha_movimiento = fields.Date(required=True)
    referencia = fields.Str(allow_none=True, load_default=None)
    concepto = fields.Str(allow_none=True, load_default=None)

    @validates("cantidad")
    def validar_cantidad(self, value: Decimal, **kwargs) -> None:
        if value <= 0:
            raise ValidationError("cantidad debe ser mayor que cero")
        if value.as_tuple().exponent < -2:
            raise ValidationError("cantidad admite máximo 2 decimales")

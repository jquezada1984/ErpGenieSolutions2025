from decimal import Decimal

from marshmallow import Schema, ValidationError, fields, validates

TIPOS_AJUSTE = frozenset({"POSITIVO", "NEGATIVO"})


class StockAjusteSchema(Schema):
    """Contrato HTTP interno de AJUSTE DE STOCK v1 (delta)."""

    id_empresa = fields.UUID(required=True)
    id_item = fields.UUID(required=True)
    id_almacen = fields.UUID(required=True)
    id_origen = fields.UUID(required=True)
    tipo_ajuste = fields.Str(required=True)
    cantidad = fields.Decimal(required=True, as_string=False)
    fecha_movimiento = fields.Date(required=True)
    referencia = fields.Str(allow_none=True, load_default=None)
    concepto = fields.Str(allow_none=True, load_default=None)

    @validates("tipo_ajuste")
    def validar_tipo_ajuste(self, value: str, **kwargs) -> None:
        tipo = str(value).strip() if value is not None else ""
        if tipo not in TIPOS_AJUSTE:
            raise ValidationError("tipo_ajuste debe ser POSITIVO o NEGATIVO")

    @validates("cantidad")
    def validar_cantidad(self, value: Decimal, **kwargs) -> None:
        if value <= 0:
            raise ValidationError("cantidad debe ser mayor que cero")
        if value.as_tuple().exponent < -2:
            raise ValidationError("cantidad admite máximo 2 decimales")

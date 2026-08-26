from decimal import Decimal

from marshmallow import Schema, ValidationError, fields, validates, validates_schema

TIPOS_AJUSTE = frozenset({"POSITIVO", "NEGATIVO"})


class StockCambioMasivoDetalleSchema(Schema):
    """Línea de cambio masivo: un producto, un sentido, una cantidad."""

    id_item = fields.UUID(required=True)
    tipo_ajuste = fields.Str(required=True)
    cantidad = fields.Decimal(required=True, as_string=False)

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


class StockCambioMasivoSchema(Schema):
    """Contrato HTTP interno de CAMBIO MASIVO DE STOCK v1 (lote atómico)."""

    id_empresa = fields.UUID(required=True)
    id_almacen = fields.UUID(required=True)
    id_origen = fields.UUID(required=True)
    fecha_movimiento = fields.Date(required=True)
    referencia = fields.Str(allow_none=True, load_default=None)
    concepto = fields.Str(allow_none=True, load_default=None)
    detalles = fields.Nested(
        StockCambioMasivoDetalleSchema, many=True, required=True
    )

    @validates_schema
    def validar_detalles_lote(self, data, **kwargs) -> None:
        detalles = data.get("detalles") or []
        if len(detalles) < 1:
            raise ValidationError(
                "detalles debe contener al menos un elemento",
                field_name="detalles",
            )
        ids = [str(d["id_item"]) for d in detalles]
        if len(ids) != len(set(ids)):
            raise ValidationError(
                "detalles no puede contener id_item repetidos",
                field_name="detalles",
            )

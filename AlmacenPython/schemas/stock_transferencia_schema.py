from decimal import Decimal

from marshmallow import Schema, ValidationError, fields, validates, validates_schema


class StockTransferenciaSchema(Schema):
    """Contrato HTTP interno de TRANSFERENCIA DE STOCK v1 (inmediata, un producto)."""

    id_empresa = fields.UUID(required=True)
    id_item = fields.UUID(required=True)
    id_almacen_origen = fields.UUID(required=True)
    id_almacen_destino = fields.UUID(required=True)
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

    @validates_schema
    def validar_almacenes_distintos(self, data, **kwargs) -> None:
        origen = str(data.get("id_almacen_origen", ""))
        destino = str(data.get("id_almacen_destino", ""))
        if origen and destino and origen == destino:
            raise ValidationError(
                "id_almacen_origen e id_almacen_destino deben ser distintos",
                field_name="id_almacen_destino",
            )

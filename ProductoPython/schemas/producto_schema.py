from decimal import Decimal, InvalidOperation
from marshmallow import Schema, fields, validate, validates_schema, ValidationError


def _to_decimal(value, field_name: str) -> Decimal | None:
    if value is None:
        return None
    try:
        return value if isinstance(value, Decimal) else Decimal(str(value))
    except (InvalidOperation, ValueError, TypeError):
        raise ValidationError(f"{field_name} debe ser numérico.")


def _non_negative(value, field_name: str):
    dec = _to_decimal(value, field_name)
    if dec is None:
        return
    if dec < 0:
        raise ValidationError(f"{field_name} no puede ser negativo.")


class ProductoCreateSchema(Schema):
    id_empresa = fields.UUID(required=True)

    producto_ref = fields.Str(required=True, validate=validate.Length(min=1, max=100))

    etiqueta = fields.Str(validate=validate.Length(max=100), allow_none=True)
    estado_venta = fields.Str(validate=validate.Length(max=50), allow_none=True)
    estado_compra = fields.Str(validate=validate.Length(max=50), allow_none=True)
    estado = fields.Bool(allow_none=True, load_default=True)
    descripcion = fields.Str(allow_none=True)
    url_publica = fields.Str(allow_none=True)
    naturaleza = fields.Str(validate=validate.Length(max=50), allow_none=True)

    peso = fields.Decimal(as_string=True, allow_none=True)
    longitud = fields.Decimal(as_string=True, allow_none=True)
    anchura = fields.Decimal(as_string=True, allow_none=True)
    altura = fields.Decimal(as_string=True, allow_none=True)
    unidad_longitud = fields.Str(validate=validate.Length(max=10), allow_none=True)

    superficie = fields.Decimal(as_string=True, allow_none=True)
    unidad_superficie = fields.Str(validate=validate.Length(max=10), allow_none=True)

    volumen = fields.Decimal(as_string=True, allow_none=True)
    unidad_volumen = fields.Str(validate=validate.Length(max=10), allow_none=True)

    nomenclatura_aduanera = fields.Str(validate=validate.Length(max=50), allow_none=True)
    pais_origen = fields.Str(validate=validate.Length(max=100), allow_none=True)
    provincia_origen = fields.Str(validate=validate.Length(max=100), allow_none=True)

    nota_interna = fields.Str(allow_none=True)

    precio_venta = fields.Decimal(as_string=True, allow_none=True)
    precio_minimo = fields.Decimal(as_string=True, allow_none=True)

    impuesto_id = fields.Int(allow_none=True, validate=validate.Range(min=1))

    contabilidad_venta = fields.Str(validate=validate.Length(max=20), allow_none=True)
    contabilidad_exportacion = fields.Str(validate=validate.Length(max=20), allow_none=True)
    contabilidad_compra = fields.Str(validate=validate.Length(max=20), allow_none=True)
    contabilidad_importacion = fields.Str(validate=validate.Length(max=20), allow_none=True)

    @validates_schema
    def validate_numbers(self, data, **kwargs):
        for field_name in (
            "peso",
            "longitud",
            "anchura",
            "altura",
            "superficie",
            "volumen",
            "precio_venta",
            "precio_minimo",
        ):
            _non_negative(data.get(field_name), field_name)

        pv = data.get("precio_venta")
        pm = data.get("precio_minimo")

        if pv is not None and pm is not None:
            pv_dec = _to_decimal(pv, "precio_venta")
            pm_dec = _to_decimal(pm, "precio_minimo")
            if pm_dec > pv_dec:
                raise ValidationError(
                    {"precio_minimo": ["precio_minimo no puede ser mayor que precio_venta."]}
                )


class ProductoUpdateSchema(ProductoCreateSchema):
    producto_ref = fields.Str(required=False, validate=validate.Length(min=1, max=100))


class ProductoOutSchema(Schema):
    id_producto = fields.UUID()
    id_empresa = fields.UUID()

    producto_ref = fields.Str()
    etiqueta = fields.Str(allow_none=True)
    estado_venta = fields.Str(allow_none=True)
    estado_compra = fields.Str(allow_none=True)
    estado = fields.Bool(allow_none=True)
    descripcion = fields.Str(allow_none=True)
    url_publica = fields.Str(allow_none=True)
    naturaleza = fields.Str(allow_none=True)

    peso = fields.Decimal(as_string=True, allow_none=True)
    longitud = fields.Decimal(as_string=True, allow_none=True)
    anchura = fields.Decimal(as_string=True, allow_none=True)
    altura = fields.Decimal(as_string=True, allow_none=True)
    unidad_longitud = fields.Str(allow_none=True)

    superficie = fields.Decimal(as_string=True, allow_none=True)
    unidad_superficie = fields.Str(allow_none=True)

    volumen = fields.Decimal(as_string=True, allow_none=True)
    unidad_volumen = fields.Str(allow_none=True)

    nomenclatura_aduanera = fields.Str(allow_none=True)
    pais_origen = fields.Str(allow_none=True)
    provincia_origen = fields.Str(allow_none=True)

    nota_interna = fields.Str(allow_none=True)
    precio_venta = fields.Decimal(as_string=True, allow_none=True)
    precio_minimo = fields.Decimal(as_string=True, allow_none=True)

    impuesto_id = fields.Int(allow_none=True)

    contabilidad_venta = fields.Str(allow_none=True)
    contabilidad_exportacion = fields.Str(allow_none=True)
    contabilidad_compra = fields.Str(allow_none=True)
    contabilidad_importacion = fields.Str(allow_none=True)

    created_at = fields.DateTime()
    updated_at = fields.DateTime()

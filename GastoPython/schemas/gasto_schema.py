from decimal import Decimal

from marshmallow import Schema, fields, validates, validates_schema, ValidationError, EXCLUDE


class GastoDetalleLineSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id_item = fields.UUID(allow_none=True)
    impuesto_id = fields.Integer(allow_none=True)
    descripcion = fields.Str(required=True)
    cantidad = fields.Decimal(required=True, places=4)
    precio_unitario = fields.Decimal(required=True, places=4)
    descuento = fields.Decimal(load_default=Decimal('0'), places=2)
    orden = fields.Integer(load_default=1)

    # Totales del front se ignoran (backend es fuente de verdad)
    subtotal = fields.Decimal(allow_none=True, load_only=True)
    valor_impuesto = fields.Decimal(allow_none=True, load_only=True)
    total = fields.Decimal(allow_none=True, load_only=True)

    @validates('descripcion')
    def descripcion_ok(self, value):
        if not value or not str(value).strip():
            raise ValidationError('descripcion es obligatoria')

    @validates('cantidad')
    def cantidad_ok(self, value):
        if value is None or Decimal(str(value)) <= 0:
            raise ValidationError('cantidad debe ser mayor que cero')

    @validates('precio_unitario')
    def precio_ok(self, value):
        if value is None or Decimal(str(value)) < 0:
            raise ValidationError('precio_unitario no puede ser negativo')

    @validates('descuento')
    def descuento_ok(self, value):
        if value is not None and Decimal(str(value)) < 0:
            raise ValidationError('descuento no puede ser negativo')

    @validates('orden')
    def orden_ok(self, value):
        if value is not None and int(value) <= 0:
            raise ValidationError('orden debe ser mayor que cero')


class GastoCreateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id_empresa = fields.UUID(allow_none=True)  # solo GLOBAL vía resolve; no es verdad EMPRESA
    id_tercero = fields.UUID(allow_none=True)
    id_categoria_gasto = fields.UUID(required=True)
    tipo_documento = fields.Str(allow_none=True)
    numero_documento = fields.Str(allow_none=True)
    fecha_gasto = fields.Date(required=True)
    fecha_vencimiento = fields.Date(allow_none=True)
    concepto = fields.Str(required=True)
    observacion = fields.Str(allow_none=True)
    detalles = fields.Nested(GastoDetalleLineSchema, many=True, required=True)

    # Totales cabecera del front: ignorados
    subtotal = fields.Decimal(allow_none=True, load_only=True)
    descuento = fields.Decimal(allow_none=True, load_only=True)
    impuesto = fields.Decimal(allow_none=True, load_only=True)
    total = fields.Decimal(allow_none=True, load_only=True)
    numero_gasto = fields.Str(allow_none=True, load_only=True)
    estado_gasto = fields.Str(allow_none=True, load_only=True)

    @validates('concepto')
    def concepto_ok(self, value):
        if not value or not str(value).strip():
            raise ValidationError('concepto es obligatorio')

    @validates('detalles')
    def detalles_ok(self, value):
        if not value or len(value) < 1:
            raise ValidationError('detalles debe tener al menos una línea')

    @validates_schema
    def fechas_ok(self, data, **kwargs):
        fv = data.get('fecha_vencimiento')
        fg = data.get('fecha_gasto')
        if fv is not None and fg is not None and fv < fg:
            raise ValidationError(
                {'fecha_vencimiento': ['fecha_vencimiento debe ser >= fecha_gasto']},
            )


class GastoUpdateSchema(GastoCreateSchema):
    """Misma forma que create; numero_gasto / estado_gasto no se aceptan del cliente."""
    pass


class GastoDetalleOutSchema(Schema):
    id_gasto_detalle = fields.UUID(dump_only=True)
    id_gasto = fields.UUID()
    id_item = fields.UUID(allow_none=True)
    impuesto_id = fields.Integer(allow_none=True)
    descripcion = fields.Str()
    cantidad = fields.Decimal(as_string=True)
    precio_unitario = fields.Decimal(as_string=True)
    descuento = fields.Decimal(as_string=True)
    subtotal = fields.Decimal(as_string=True)
    valor_impuesto = fields.Decimal(as_string=True)
    total = fields.Decimal(as_string=True)
    orden = fields.Integer()
    estado = fields.Bool()


class GastoOutSchema(Schema):
    id_gasto = fields.UUID(dump_only=True)
    id_empresa = fields.UUID()
    numero_gasto = fields.Str()
    id_tercero = fields.UUID(allow_none=True)
    id_categoria_gasto = fields.UUID()
    tipo_documento = fields.Str(allow_none=True)
    numero_documento = fields.Str(allow_none=True)
    fecha_gasto = fields.Date()
    fecha_vencimiento = fields.Date(allow_none=True)
    concepto = fields.Str()
    observacion = fields.Str(allow_none=True)
    subtotal = fields.Decimal(as_string=True)
    descuento = fields.Decimal(as_string=True)
    impuesto = fields.Decimal(as_string=True)
    total = fields.Decimal(as_string=True)
    estado_gasto = fields.Str()
    estado = fields.Bool()
    created_by = fields.UUID(allow_none=True)
    updated_by = fields.UUID(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    detalles = fields.Nested(GastoDetalleOutSchema, many=True)

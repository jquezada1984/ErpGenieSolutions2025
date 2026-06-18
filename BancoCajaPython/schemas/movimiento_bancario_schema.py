from marshmallow import Schema, fields, validates, ValidationError
from decimal import Decimal


class MovimientoBancarioCreateSchema(Schema):
    id_cuenta_bancaria = fields.UUID(required=True)
    fecha_operacion = fields.Date(required=True)
    fecha_valor = fields.Date(allow_none=True)
    importe = fields.Decimal(required=True, places=2)
    concepto = fields.Str(allow_none=True)
    referencia = fields.Str(allow_none=True)
    id_tercero = fields.UUID(allow_none=True)
    conciliado = fields.Bool(load_default=False)

    @validates('importe')
    def importe_no_cero(self, value):
        if value is None or Decimal(str(value)) == 0:
            raise ValidationError('El importe no puede ser cero')


class MovimientoBancarioUpdateSchema(Schema):
    fecha_operacion = fields.Date()
    fecha_valor = fields.Date(allow_none=True)
    concepto = fields.Str(allow_none=True)
    referencia = fields.Str(allow_none=True)
    id_tercero = fields.UUID(allow_none=True)
    conciliado = fields.Bool()


class MovimientoBancarioOutSchema(Schema):
    id_movimiento_bancario = fields.UUID(dump_only=True)
    id_cuenta_bancaria = fields.UUID()
    id_empresa = fields.UUID()
    fecha_operacion = fields.Date()
    fecha_valor = fields.Date(allow_none=True)
    importe = fields.Decimal(places=2)
    concepto = fields.Str(allow_none=True)
    referencia = fields.Str(allow_none=True)
    id_tercero = fields.UUID(allow_none=True)
    conciliado = fields.Bool()
    estado = fields.Bool()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

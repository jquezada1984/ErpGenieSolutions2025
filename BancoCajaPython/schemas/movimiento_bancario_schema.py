from decimal import Decimal

from marshmallow import Schema, fields, validates, ValidationError


class MovimientoBancarioCreateSchema(Schema):
    id_cuenta_bancaria = fields.UUID(required=True)
    fecha_movimiento = fields.Date(required=True)
    monto = fields.Decimal(required=True, places=2)
    concepto = fields.Str(allow_none=True)
    numero_documento = fields.Str(allow_none=True)
    tipo_movimiento = fields.Str(allow_none=True)
    conciliado = fields.Bool(load_default=False)

    @validates('monto')
    def monto_no_cero(self, value):
        if value is None or Decimal(str(value)) == 0:
            raise ValidationError('El monto no puede ser cero')


class MovimientoBancarioUpdateSchema(Schema):
    fecha_movimiento = fields.Date()
    concepto = fields.Str(allow_none=True)
    numero_documento = fields.Str(allow_none=True)
    conciliado = fields.Bool()


class MovimientoBancarioOutSchema(Schema):
    id_movimiento_bancario = fields.UUID(dump_only=True)
    id_cuenta_bancaria = fields.UUID()
    id_empresa = fields.UUID()
    fecha_movimiento = fields.Date()
    numero_documento = fields.Str(allow_none=True)
    concepto = fields.Str(allow_none=True)
    tipo_movimiento = fields.Str(allow_none=True)
    monto = fields.Decimal(places=2)
    saldo_anterior = fields.Decimal(places=2)
    saldo_nuevo = fields.Decimal(places=2)
    conciliado = fields.Bool()
    id_transferencia_bancaria = fields.UUID(allow_none=True)
    id_movimiento_reversado = fields.UUID(allow_none=True)
    created_at = fields.DateTime(dump_only=True)

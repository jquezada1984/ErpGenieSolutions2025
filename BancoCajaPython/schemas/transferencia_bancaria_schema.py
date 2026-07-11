from decimal import Decimal

from marshmallow import Schema, fields, validates, ValidationError, INCLUDE

TIPOS_PAGO_TRANSFERENCIA = frozenset({
    'cheque',
    'domiciliacion',
    'efectivo',
    'tarjeta',
    'transferencia_bancaria',
})


class TransferenciaBancariaCreateSchema(Schema):
    class Meta:
        unknown = INCLUDE

    id_empresa = fields.UUID(allow_none=True)
    id_cuenta_origen = fields.UUID(required=True)
    id_cuenta_destino = fields.UUID(required=True)
    monto = fields.Decimal(required=True, places=2)
    fecha_movimiento = fields.Date(required=True)
    concepto = fields.Str(required=True)
    numero_documento = fields.Str(allow_none=True)
    tipo_movimiento = fields.Str(load_default='transferencia_bancaria')

    @validates('monto')
    def monto_positivo(self, value):
        if value is None or Decimal(str(value)) <= 0:
            raise ValidationError('El monto debe ser mayor que cero')

    @validates('concepto')
    def concepto_obligatorio(self, value):
        if not value or not str(value).strip():
            raise ValidationError('La descripción es obligatoria')

    @validates('tipo_movimiento')
    def tipo_pago_valido(self, value):
        if value and value not in TIPOS_PAGO_TRANSFERENCIA:
            raise ValidationError('Tipo de pago no válido')


class TransferenciaBancariaOutSchema(Schema):
    id_transferencia_bancaria = fields.UUID(dump_only=True)
    id_empresa = fields.UUID()
    id_cuenta_origen = fields.UUID()
    id_cuenta_destino = fields.UUID()
    monto = fields.Decimal(places=2)
    fecha_movimiento = fields.Date()
    concepto = fields.Str(allow_none=True)
    numero_documento = fields.Str(allow_none=True)
    tipo_movimiento = fields.Str()
    estado = fields.Bool()
    id_movimiento_salida = fields.UUID(dump_only=True)
    id_movimiento_entrada = fields.UUID(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

from marshmallow import Schema, fields, validates, ValidationError, INCLUDE, pre_load

from models.cuenta_bancaria import TIPOS_CUENTA_VALIDOS


def _normalize_legacy_keys(data):
    if not isinstance(data, dict):
        return data
    out = dict(data)
    if 'fecha_saldo_inic' in out and 'fecha_saldo_inicial' not in out:
        out['fecha_saldo_inicial'] = out.pop('fecha_saldo_inic')
    if 'saldo_minimo_au' in out and 'saldo_minimo_autorizado' not in out:
        out['saldo_minimo_autorizado'] = out.pop('saldo_minimo_au')
    if 'saldo_minimo_de' in out and 'saldo_minimo_deseado' not in out:
        out['saldo_minimo_deseado'] = out.pop('saldo_minimo_de')
    return out


class CuentaBancariaCreateSchema(Schema):
    class Meta:
        unknown = INCLUDE

    id_banco = fields.UUID(required=True)
    numero_cuenta = fields.Str(required=True)
    tipo_cuenta = fields.Str(required=True)
    id_moneda = fields.UUID(required=True)
    id_cuenta_contable = fields.UUID(allow_none=True)
    saldo_inicial = fields.Decimal(places=2, load_default=0)
    saldo_actual = fields.Decimal(places=2, allow_none=True)
    estado = fields.Bool(load_default=True)
    id_tercero = fields.UUID(allow_none=True)
    referencia = fields.Str(allow_none=True)
    etiqueta_cuenta = fields.Str(allow_none=True)
    estado_cuenta = fields.Str(load_default='abierta')
    id_pais = fields.UUID(allow_none=True)
    id_provincia = fields.UUID(allow_none=True)
    direccion_banco = fields.Str(allow_none=True)
    web = fields.Str(allow_none=True)
    comentario = fields.Str(allow_none=True)
    comentario_html = fields.Str(allow_none=True)
    fecha_saldo_inicial = fields.Date(allow_none=True)
    saldo_minimo_autorizado = fields.Decimal(places=2, load_default=0)
    saldo_minimo_deseado = fields.Decimal(places=2, load_default=0)
    iban = fields.Str(allow_none=True)
    bic_swift = fields.Str(allow_none=True)
    codigo_contable = fields.Str(allow_none=True)

    @pre_load
    def normalize_keys(self, data, **kwargs):
        return _normalize_legacy_keys(data)

    @validates('tipo_cuenta')
    def validate_tipo_cuenta(self, value):
        if value not in TIPOS_CUENTA_VALIDOS:
            raise ValidationError(
                f'tipo_cuenta debe ser uno de: {", ".join(TIPOS_CUENTA_VALIDOS)}'
            )


class CuentaBancariaUpdateSchema(Schema):
    class Meta:
        unknown = INCLUDE

    id_banco = fields.UUID(allow_none=True)
    numero_cuenta = fields.Str(allow_none=True)
    tipo_cuenta = fields.Str(allow_none=True)
    id_moneda = fields.UUID(allow_none=True)
    id_cuenta_contable = fields.UUID(allow_none=True)
    saldo_inicial = fields.Decimal(places=2, allow_none=True)
    saldo_actual = fields.Decimal(places=2, allow_none=True)
    estado = fields.Bool(allow_none=True)
    id_tercero = fields.UUID(allow_none=True)
    referencia = fields.Str(allow_none=True)
    etiqueta_cuenta = fields.Str(allow_none=True)
    estado_cuenta = fields.Str(allow_none=True)
    id_pais = fields.UUID(allow_none=True)
    id_provincia = fields.UUID(allow_none=True)
    direccion_banco = fields.Str(allow_none=True)
    web = fields.Str(allow_none=True)
    comentario = fields.Str(allow_none=True)
    comentario_html = fields.Str(allow_none=True)
    fecha_saldo_inicial = fields.Date(allow_none=True)
    saldo_minimo_autorizado = fields.Decimal(places=2, allow_none=True)
    saldo_minimo_deseado = fields.Decimal(places=2, allow_none=True)
    iban = fields.Str(allow_none=True)
    bic_swift = fields.Str(allow_none=True)
    codigo_contable = fields.Str(allow_none=True)

    @pre_load
    def normalize_keys(self, data, **kwargs):
        return _normalize_legacy_keys(data)

    @validates('tipo_cuenta')
    def validate_tipo_cuenta(self, value):
        if value is not None and value not in TIPOS_CUENTA_VALIDOS:
            raise ValidationError(
                f'tipo_cuenta debe ser uno de: {", ".join(TIPOS_CUENTA_VALIDOS)}'
            )


class CuentaBancariaOutSchema(Schema):
    id_cuenta_bancaria = fields.Str()
    id_empresa = fields.Str()
    id_banco = fields.Str()
    numero_cuenta = fields.Str()
    tipo_cuenta = fields.Str()
    id_moneda = fields.Str()
    id_cuenta_contable = fields.Str()
    saldo_inicial = fields.Decimal(places=2)
    saldo_actual = fields.Decimal(places=2)
    estado = fields.Bool()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    created_by = fields.Str()
    updated_by = fields.Str()
    id_tercero = fields.Str()
    referencia = fields.Str()
    etiqueta_cuenta = fields.Str()
    estado_cuenta = fields.Str()
    id_pais = fields.Str()
    id_provincia = fields.Str()
    direccion_banco = fields.Str()
    web = fields.Str()
    comentario = fields.Str()
    comentario_html = fields.Str()
    fecha_saldo_inicial = fields.Date()
    saldo_minimo_autorizado = fields.Decimal(places=2)
    saldo_minimo_deseado = fields.Decimal(places=2)
    iban = fields.Str()
    bic_swift = fields.Str()
    codigo_contable = fields.Str()

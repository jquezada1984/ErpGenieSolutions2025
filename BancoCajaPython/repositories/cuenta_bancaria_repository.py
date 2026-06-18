from typing import Any, Dict, Optional
from decimal import Decimal

from utils.db import db
from models.banco import Banco
from models.cuenta_bancaria import CuentaBancaria


def _uuid_str(value) -> Optional[str]:
    if value is None:
        return None
    return str(value)


def create_cuenta_bancaria(
    payload: Dict[str, Any],
    id_empresa: str,
    user_id: Optional[str],
) -> CuentaBancaria:
    banco = Banco.query.filter_by(id_banco=str(payload['id_banco'])).first()
    if not banco:
        raise ValueError('Banco no encontrado')

    saldo_inicial = payload.get('saldo_inicial') or Decimal('0')
    saldo_actual = payload.get('saldo_actual')
    if saldo_actual is None:
        saldo_actual = saldo_inicial

    bic = payload.get('bic_swift') or banco.swift

    cuenta = CuentaBancaria(
        id_empresa=id_empresa,
        id_banco=str(payload['id_banco']),
        numero_cuenta=(payload.get('numero_cuenta') or '').strip(),
        tipo_cuenta=payload['tipo_cuenta'],
        id_moneda=str(payload['id_moneda']),
        id_cuenta_contable=_uuid_str(payload.get('id_cuenta_contable')),
        saldo_inicial=saldo_inicial,
        saldo_actual=saldo_actual,
        estado=bool(payload.get('estado', True)),
        created_by=user_id,
        updated_by=user_id,
        id_tercero=_uuid_str(payload.get('id_tercero')),
        referencia=payload.get('referencia'),
        etiqueta_cuenta=payload.get('etiqueta_cuenta'),
        estado_cuenta=payload.get('estado_cuenta') or 'abierta',
        id_pais=_uuid_str(payload.get('id_pais')),
        id_provincia=_uuid_str(payload.get('id_provincia')),
        direccion_banco=payload.get('direccion_banco'),
        web=payload.get('web'),
        comentario=payload.get('comentario'),
        comentario_html=payload.get('comentario_html'),
        fecha_saldo_inicial=payload.get('fecha_saldo_inicial') or payload.get('fecha_saldo_inic'),
        saldo_minimo_autorizado=payload.get('saldo_minimo_autorizado')
        or payload.get('saldo_minimo_au')
        or Decimal('0'),
        saldo_minimo_deseado=payload.get('saldo_minimo_deseado')
        or payload.get('saldo_minimo_de')
        or Decimal('0'),
        iban=payload.get('iban'),
        bic_swift=bic,
        codigo_contable=payload.get('codigo_contable'),
    )
    db.session.add(cuenta)
    db.session.commit()
    return cuenta


def update_cuenta_bancaria(
    id_cuenta: str,
    id_empresa: str,
    payload: Dict[str, Any],
    user_id: Optional[str],
    scope_acceso: str = 'EMPRESA',
) -> Optional[CuentaBancaria]:
    q = CuentaBancaria.query.filter_by(id_cuenta_bancaria=id_cuenta)
    if scope_acceso != 'GLOBAL':
        q = q.filter_by(id_empresa=id_empresa)
    cuenta = q.first()
    if not cuenta:
        return None

    scalar_fields = (
        'id_banco', 'numero_cuenta', 'tipo_cuenta', 'id_moneda', 'id_cuenta_contable',
        'saldo_inicial', 'saldo_actual', 'estado', 'id_tercero', 'referencia',
        'etiqueta_cuenta', 'estado_cuenta', 'id_pais', 'id_provincia',
        'direccion_banco', 'web', 'comentario', 'comentario_html', 'fecha_saldo_inicial',
        'saldo_minimo_autorizado', 'saldo_minimo_deseado', 'iban', 'bic_swift', 'codigo_contable',
    )
    uuid_fields = {'id_banco', 'id_moneda', 'id_cuenta_contable', 'id_tercero', 'id_pais', 'id_provincia'}

    # Alias API legacy → columnas BD
    if 'fecha_saldo_inic' in payload and 'fecha_saldo_inicial' not in payload:
        payload['fecha_saldo_inicial'] = payload['fecha_saldo_inic']
    if 'saldo_minimo_au' in payload and 'saldo_minimo_autorizado' not in payload:
        payload['saldo_minimo_autorizado'] = payload['saldo_minimo_au']
    if 'saldo_minimo_de' in payload and 'saldo_minimo_deseado' not in payload:
        payload['saldo_minimo_deseado'] = payload['saldo_minimo_de']

    for key in scalar_fields:
        if key in payload:
            val = payload[key]
            if key in uuid_fields and val is not None:
                val = str(val)
            setattr(cuenta, key, val)

    if 'id_banco' in payload and 'bic_swift' not in payload:
        banco = Banco.query.filter_by(id_banco=str(payload['id_banco'])).first()
        if banco and banco.swift:
            cuenta.bic_swift = banco.swift

    cuenta.updated_by = user_id
    db.session.commit()
    return cuenta


def delete_cuenta_bancaria(
    id_cuenta: str,
    id_empresa: str,
    user_id: Optional[str],
    scope_acceso: str = 'EMPRESA',
) -> bool:
    q = CuentaBancaria.query.filter_by(id_cuenta_bancaria=id_cuenta)
    if scope_acceso != 'GLOBAL':
        q = q.filter_by(id_empresa=id_empresa)
    cuenta = q.first()
    if not cuenta:
        return False
    cuenta.estado = False
    cuenta.updated_by = user_id
    db.session.commit()
    return True

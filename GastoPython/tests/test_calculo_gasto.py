"""Tests unitarios de cálculo (sin BD). Casos A-parcial, descuento, impuesto."""
from decimal import Decimal

import pytest

from services.calculo_gasto import (
    calcular_linea,
    calcular_cabecera,
    calcular_lineas_y_cabecera,
)


def test_linea_sin_impuesto():
    ln = calcular_linea('2', '10.00', '0', '0')
    assert ln['subtotal'] == Decimal('20.00')
    assert ln['descuento'] == Decimal('0.00')
    assert ln['valor_impuesto'] == Decimal('0.00')
    assert ln['total'] == Decimal('20.00')


def test_linea_con_iva_12():
    ln = calcular_linea('1', '100.00', '0', '12')
    assert ln['subtotal'] == Decimal('100.00')
    assert ln['valor_impuesto'] == Decimal('12.00')
    assert ln['total'] == Decimal('112.00')


def test_linea_con_descuento():
    ln = calcular_linea('1', '100.00', '10', '12')
    assert ln['subtotal'] == Decimal('100.00')
    assert ln['descuento'] == Decimal('10.00')
    assert ln['valor_impuesto'] == Decimal('10.80')  # 90 * 12%
    assert ln['total'] == Decimal('100.80')


def test_descuento_mayor_que_subtotal_falla():
    with pytest.raises(ValueError):
        calcular_linea('1', '10', '11', '0')


def test_cabecera_multiples_lineas():
    lineas = [
        calcular_linea('1', '100', '0', '12'),
        calcular_linea('2', '50', '5', '0'),
    ]
    # L1: sub 100, desc 0, imp 12, tot 112
    # L2: sub 100, desc 5, imp 0, tot 95
    cab = calcular_cabecera(lineas)
    assert cab['subtotal'] == Decimal('200.00')
    assert cab['descuento'] == Decimal('5.00')
    assert cab['impuesto'] == Decimal('12.00')
    assert cab['total'] == Decimal('207.00')  # 200 - 5 + 12


def test_impuesto_id_invalido_en_batch():
    with pytest.raises(ValueError, match='impuesto_id'):
        calcular_lineas_y_cabecera(
            [{'cantidad': 1, 'precio_unitario': 10, 'descuento': 0, 'impuesto_id': 99, 'descripcion': 'x'}],
            {},  # sin tasa para 99
        )


def test_resolve_empresa_import():
    from utils.context import resolve_id_empresa

    assert resolve_id_empresa('aaa', {'id_empresa': 'bbb'}, 'EMPRESA') == 'aaa'
    with pytest.raises(ValueError):
        resolve_id_empresa(None, {'id_empresa': 'bbb'}, 'EMPRESA')
    assert resolve_id_empresa(None, {'id_empresa': 'bbb'}, 'GLOBAL') == 'bbb'
    with pytest.raises(ValueError):
        resolve_id_empresa(None, {}, 'GLOBAL')

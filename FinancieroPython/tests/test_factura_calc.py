"""Tests de cálculo de línea / totales factura (sin BD)."""
from __future__ import annotations

from decimal import Decimal
from types import SimpleNamespace

import pytest
from marshmallow import ValidationError

from services.factura_calc import calc_linea, money, recalcular_totales_from_lineas


def test_calc_linea_basica_con_iva():
    out = calc_linea(
        {
            'descripcion': 'Producto A',
            'cantidad': 2,
            'precio_unitario': 100,
            'tasa_iva': 19,
        },
        1,
    )
    assert out['subtotal'] == Decimal('200.00')
    assert out['iva'] == Decimal('38.00')
    assert out['descuento_valor'] == Decimal('0.00')
    assert out['orden'] == 1


def test_calc_linea_descuento_porcentaje():
    out = calc_linea(
        {
            'descripcion': 'Prod',
            'cantidad': 1,
            'precio_unitario': 100,
            'descuento_porcentaje': 10,
            'tasa_iva': 19,
        },
        1,
    )
    assert out['subtotal'] == Decimal('90.00')
    assert out['descuento_valor'] == Decimal('10.00')
    assert out['iva'] == Decimal('17.10')


def test_calc_linea_cantidad_invalida():
    with pytest.raises(ValidationError):
        calc_linea({'descripcion': 'x', 'cantidad': 0, 'precio_unitario': 10}, 1)


def test_calc_linea_precio_invalido():
    with pytest.raises(ValidationError):
        calc_linea({'descripcion': 'x', 'cantidad': 1, 'precio_unitario': -1}, 1)


def test_calc_linea_subtotal_negativo():
    with pytest.raises(ValidationError):
        calc_linea(
            {
                'descripcion': 'x',
                'cantidad': 1,
                'precio_unitario': 10,
                'descuento_valor': 50,
            },
            1,
        )


def test_calc_linea_tasa_negativa_se_trata_como_cero():
    out = calc_linea(
        {
            'descripcion': 'x',
            'cantidad': 1,
            'precio_unitario': 100,
            'tasa_iva': -5,
        },
        1,
    )
    assert out['iva'] == Decimal('0.00')


def test_recalcular_totales_from_lineas():
    lineas = [
        SimpleNamespace(subtotal=Decimal('100.00'), descuento_valor=Decimal('5.00')),
        SimpleNamespace(subtotal=Decimal('50.00'), descuento_valor=Decimal('0')),
    ]
    totals = recalcular_totales_from_lineas(lineas, total_iva=Decimal('28.50'))
    assert totals['subtotal'] == Decimal('150.00')
    assert totals['total_descuentos'] == Decimal('5.00')
    assert totals['total_impuestos'] == Decimal('28.50')
    assert totals['total_factura'] == Decimal('178.50')


def test_recalcular_usa_impuestos_actuales_si_no_hay_total_iva():
    lineas = [SimpleNamespace(subtotal='10', descuento_valor='0')]
    totals = recalcular_totales_from_lineas(lineas, total_impuestos_actual=2)
    assert totals['total_impuestos'] == money(2)
    assert totals['total_factura'] == Decimal('12.00')

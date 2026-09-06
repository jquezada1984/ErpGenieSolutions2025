"""Cálculo puro de líneas y totales de factura (sin ORM / BD)."""
from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, List, Optional, Protocol

from marshmallow import ValidationError


def money(v: Any) -> Decimal:
    return Decimal(str(v or 0)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


def qty(v: Any) -> Decimal:
    return Decimal(str(v or 0)).quantize(Decimal('0.001'), rounding=ROUND_HALF_UP)


def calc_linea(lin: dict, orden: int) -> dict:
    cantidad = qty(lin['cantidad'])
    precio = money(lin['precio_unitario'])
    desc_pct = money(lin.get('descuento_porcentaje') or 0)
    desc_val = money(lin.get('descuento_valor') or 0)
    if cantidad <= 0:
        raise ValidationError({'lineas': [f'Línea {orden}: cantidad debe ser > 0']})
    if precio < 0:
        raise ValidationError({'lineas': [f'Línea {orden}: precio inválido']})
    bruto = (cantidad * precio).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    descuento = desc_val
    if desc_pct > 0:
        descuento = (bruto * desc_pct / Decimal('100')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    subtotal = (bruto - descuento).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    if subtotal < 0:
        raise ValidationError({'lineas': [f'Línea {orden}: subtotal negativo']})
    tasa = money(lin.get('tasa_iva') or 0)
    if tasa < 0:
        tasa = Decimal('0.00')
    iva = (subtotal * tasa / Decimal('100')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    return {
        'id_item': str(lin['id_item']) if lin.get('id_item') else None,
        'descripcion': lin['descripcion'].strip(),
        'cantidad': cantidad,
        'precio_unitario': precio,
        'descuento_porcentaje': desc_pct,
        'descuento_valor': descuento,
        'subtotal': subtotal,
        'iva': iva,
        'id_cuenta_contable': str(lin['id_cuenta_contable']) if lin.get('id_cuenta_contable') else None,
        'orden': int(lin.get('orden') or orden),
    }


class _LineaTotales(Protocol):
    subtotal: Any
    descuento_valor: Any


def recalcular_totales_from_lineas(
    lineas: List[_LineaTotales],
    total_iva: Optional[Decimal] = None,
    total_impuestos_actual: Any = 0,
) -> Dict[str, Decimal]:
    """Devuelve subtotal, total_descuentos, total_impuestos y total_factura."""
    subtotal = sum((money(l.subtotal) for l in lineas), Decimal('0.00'))
    total_descuentos = sum((money(l.descuento_valor) for l in lineas), Decimal('0.00'))
    if total_iva is not None:
        total_impuestos = money(total_iva)
    else:
        total_impuestos = money(total_impuestos_actual or 0)
    total_factura = subtotal + money(total_impuestos)
    return {
        'subtotal': subtotal,
        'total_descuentos': total_descuentos,
        'total_impuestos': total_impuestos,
        'total_factura': total_factura,
    }

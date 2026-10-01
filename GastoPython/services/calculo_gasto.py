"""Cálculo monetario de gastos — Decimal, redondeo HALF_UP a 2 decimales en dinero.

Política de precisión (fase actual, no cambiar sin decisión explícita):
- `cantidad` y `precio_unitario` pueden llegar/almacenarse con hasta 4 decimales
  (NUMERIC(15,4) en gasto_detalle).
- Los importes monetarios derivados (subtotal, descuento, valor_impuesto, total
  de línea y cabecera) se redondean siempre a 2 decimales con ROUND_HALF_UP.
- No utilizar float para dinero; solo decimal.Decimal.
"""
from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, List, Tuple

MONEY = Decimal('0.01')
ZERO = Decimal('0')


def _d(value) -> Decimal:
    if value is None:
        return ZERO
    if isinstance(value, Decimal):
        return value
    return Decimal(str(value))


def money(value) -> Decimal:
    """Redondea a 2 decimales (importe monetario)."""
    return _d(value).quantize(MONEY, rounding=ROUND_HALF_UP)


def calcular_linea(
    cantidad,
    precio_unitario,
    descuento,
    tasa_porcentaje,
) -> Dict[str, Decimal]:
    """
    Por línea:
      importe_bruto = cantidad * precio_unitario  → se guarda en subtotal (money 2dp)
      base          = importe_bruto - descuento
      valor_impuesto = base * tasa / 100   (tasa=12 ⇒ 12%, no 0.12)
      total         = base + valor_impuesto
    """
    qty = _d(cantidad)
    precio = _d(precio_unitario)
    desc = money(descuento)
    tasa = _d(tasa_porcentaje)

    # Producto puede usar 4dp de qty/precio; el importe monetario se fija a 2dp
    importe_bruto = money(qty * precio)
    if desc > importe_bruto:
        raise ValueError('descuento de línea no puede superar subtotal (cantidad × precio)')

    base = money(importe_bruto - desc)
    valor_impuesto = money(base * tasa / Decimal('100'))
    total = money(base + valor_impuesto)

    return {
        'subtotal': importe_bruto,
        'descuento': desc,
        'valor_impuesto': valor_impuesto,
        'total': total,
    }


def calcular_cabecera(lineas: List[Dict[str, Decimal]]) -> Dict[str, Decimal]:
    """
    Cabecera:
      subtotal  = Σ importe_bruto (subtotal línea)
      descuento = Σ descuento línea
      impuesto  = Σ valor_impuesto
      total     = subtotal - descuento + impuesto
    """
    subtotal = money(sum((ln['subtotal'] for ln in lineas), ZERO))
    descuento = money(sum((ln['descuento'] for ln in lineas), ZERO))
    impuesto = money(sum((ln['valor_impuesto'] for ln in lineas), ZERO))

    if descuento > subtotal:
        raise ValueError('descuento de cabecera no puede superar subtotal')

    total = money(subtotal - descuento + impuesto)
    if any(v < ZERO for v in (subtotal, descuento, impuesto, total)):
        raise ValueError('totales monetarios no pueden ser negativos')

    return {
        'subtotal': subtotal,
        'descuento': descuento,
        'impuesto': impuesto,
        'total': total,
    }


def calcular_lineas_y_cabecera(
    detalles_input: List[Dict[str, Any]],
    tasas_por_impuesto_id: Dict[int, Decimal],
) -> Tuple[List[Dict[str, Any]], Dict[str, Decimal]]:
    """
    detalles_input: dicts con cantidad, precio_unitario, descuento, impuesto_id, ...
    tasas_por_impuesto_id: map impuesto_id -> tasa %
    """
    calculadas: List[Dict[str, Any]] = []
    montos: List[Dict[str, Decimal]] = []

    for idx, raw in enumerate(detalles_input):
        impuesto_id = raw.get('impuesto_id')
        if impuesto_id is None:
            tasa = ZERO
        else:
            tasa = tasas_por_impuesto_id.get(int(impuesto_id))
            if tasa is None:
                raise ValueError(f'impuesto_id inválido en línea {idx + 1}')

        montos_ln = calcular_linea(
            raw.get('cantidad'),
            raw.get('precio_unitario'),
            raw.get('descuento', ZERO),
            tasa,
        )
        montos.append(montos_ln)
        calculadas.append({**raw, **montos_ln})

    cabecera = calcular_cabecera(montos)
    return calculadas, cabecera

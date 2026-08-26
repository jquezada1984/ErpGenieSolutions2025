"""Acceso transaccional del único writer STOCK INICIAL v1."""

from __future__ import annotations

from typing import Any, Dict, Optional

from sqlalchemy import text

from utils.db import db


ITEM_POR_EMPRESA_SQL = text(
    """
    SELECT
      id_item::text AS id_item,
      id_empresa::text AS id_empresa,
      estado,
      inventariable,
      precio_compra
    FROM public.item
    WHERE id_item = CAST(:id_item AS uuid)
      AND id_empresa = CAST(:id_empresa AS uuid)
    """
)

ALMACEN_ACTIVO_POR_EMPRESA_SQL = text(
    """
    SELECT
      id_almacen::text AS id_almacen,
      id_empresa::text AS id_empresa,
      estado
    FROM public.almacen
    WHERE id_almacen = CAST(:id_almacen AS uuid)
      AND id_empresa = CAST(:id_empresa AS uuid)
    """
)

MOVIMIENTO_POR_IDEMPOTENCIA_SQL = text(
    """
    SELECT
      id_movimiento_inventario::text AS id_movimiento_inventario,
      id_empresa::text AS id_empresa,
      id_item::text AS id_item,
      id_almacen::text AS id_almacen,
      tipo_movimiento,
      cantidad,
      costo_unitario,
      costo_total,
      fecha_movimiento,
      referencia,
      concepto,
      modulo_origen,
      id_origen::text AS id_origen,
      estado
    FROM public.movimiento_inventario
    WHERE id_empresa = CAST(:id_empresa AS uuid)
      AND modulo_origen = 'STOCK_INICIAL'
      AND tipo_movimiento = 'INICIAL'
      AND id_origen = CAST(:id_origen AS uuid)
    """
)

STOCK_POR_ITEM_ALMACEN_SQL = text(
    """
    SELECT
      id_stock_producto_almacen::text AS id_stock_producto_almacen,
      id_empresa::text AS id_empresa,
      id_item::text AS id_item,
      id_almacen::text AS id_almacen,
      stock_fisico,
      stock_reservado,
      stock_virtual,
      stock_disponible,
      estado
    FROM public.stock_item_almacen
    WHERE id_item = CAST(:id_item AS uuid)
      AND id_almacen = CAST(:id_almacen AS uuid)
    """
)

INSERT_MOVIMIENTO_SQL = text(
    """
    INSERT INTO public.movimiento_inventario (
      id_empresa,
      id_item,
      tipo_movimiento,
      cantidad,
      costo_unitario,
      costo_total,
      fecha_movimiento,
      referencia,
      concepto,
      id_almacen,
      modulo_origen,
      id_origen,
      updated_by
    ) VALUES (
      CAST(:id_empresa AS uuid),
      CAST(:id_item AS uuid),
      'INICIAL',
      :cantidad,
      :costo_unitario,
      :costo_total,
      :fecha_movimiento,
      :referencia,
      :concepto,
      CAST(:id_almacen AS uuid),
      'STOCK_INICIAL',
      CAST(:id_origen AS uuid),
      CAST(:updated_by AS uuid)
    )
    RETURNING
      id_movimiento_inventario::text AS id_movimiento_inventario,
      id_empresa::text AS id_empresa,
      id_item::text AS id_item,
      id_almacen::text AS id_almacen,
      tipo_movimiento,
      cantidad,
      costo_unitario,
      costo_total,
      fecha_movimiento,
      referencia,
      concepto,
      modulo_origen,
      id_origen::text AS id_origen,
      estado
    """
)

INSERT_STOCK_SQL = text(
    """
    INSERT INTO public.stock_item_almacen (
      id_empresa,
      id_item,
      id_almacen,
      stock_fisico,
      stock_reservado,
      stock_virtual,
      stock_disponible,
      created_by,
      updated_by
    ) VALUES (
      CAST(:id_empresa AS uuid),
      CAST(:id_item AS uuid),
      CAST(:id_almacen AS uuid),
      :stock_fisico,
      :stock_reservado,
      :stock_virtual,
      :stock_fisico,
      CAST(:created_by AS uuid),
      CAST(:updated_by AS uuid)
    )
    RETURNING
      id_stock_producto_almacen::text AS id_stock_producto_almacen,
      id_empresa::text AS id_empresa,
      id_item::text AS id_item,
      id_almacen::text AS id_almacen,
      stock_fisico,
      stock_reservado,
      stock_virtual,
      stock_disponible,
      estado
    """
)


def _one(statement: Any, params: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    row = db.session.execute(statement, params).mappings().first()
    return dict(row) if row else None


def buscar_item_por_empresa(id_item: str, id_empresa: str) -> Optional[Dict[str, Any]]:
    return _one(ITEM_POR_EMPRESA_SQL, {"id_item": id_item, "id_empresa": id_empresa})


def buscar_almacen_por_empresa(id_almacen: str, id_empresa: str) -> Optional[Dict[str, Any]]:
    return _one(
        ALMACEN_ACTIVO_POR_EMPRESA_SQL,
        {"id_almacen": id_almacen, "id_empresa": id_empresa},
    )


def buscar_movimiento_por_idempotencia(
    id_empresa: str, id_origen: str
) -> Optional[Dict[str, Any]]:
    return _one(
        MOVIMIENTO_POR_IDEMPOTENCIA_SQL,
        {"id_empresa": id_empresa, "id_origen": id_origen},
    )


def buscar_stock_por_item_almacen(
    id_item: str, id_almacen: str
) -> Optional[Dict[str, Any]]:
    return _one(
        STOCK_POR_ITEM_ALMACEN_SQL,
        {"id_item": id_item, "id_almacen": id_almacen},
    )


def insertar_movimiento_stock_inicial(row: Dict[str, Any]) -> Dict[str, Any]:
    """Inserta sin commit; el service controla la unidad de trabajo completa."""
    result = _one(INSERT_MOVIMIENTO_SQL, row)
    if result is None:
        raise RuntimeError("No se obtuvo el movimiento de stock inicial insertado")
    return result


def insertar_stock_inicial(row: Dict[str, Any]) -> Dict[str, Any]:
    """Inserta sin commit; el service controla la unidad de trabajo completa."""
    result = _one(INSERT_STOCK_SQL, row)
    if result is None:
        raise RuntimeError("No se obtuvo el saldo inicial insertado")
    return result

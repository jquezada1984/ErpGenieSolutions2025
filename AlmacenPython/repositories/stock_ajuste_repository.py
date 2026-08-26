"""Acceso transaccional del writer AJUSTE DE STOCK v1 (delta)."""

from __future__ import annotations

from typing import Any, Dict, Optional

from sqlalchemy import text

from utils.db import db


MOVIMIENTO_AJUSTE_POR_IDEMPOTENCIA_SQL = text(
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
      AND modulo_origen = 'AJUSTE_STOCK'
      AND id_origen = CAST(:id_origen AS uuid)
    """
)

STOCK_AJUSTE_FOR_UPDATE_SQL = text(
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
    WHERE id_empresa = CAST(:id_empresa AS uuid)
      AND id_item = CAST(:id_item AS uuid)
      AND id_almacen = CAST(:id_almacen AS uuid)
    FOR UPDATE
    """
)

UPDATE_STOCK_AJUSTE_POSITIVO_SQL = text(
    """
    UPDATE public.stock_item_almacen
    SET
      stock_fisico = stock_fisico + :cantidad,
      stock_disponible = stock_disponible + :cantidad,
      updated_by = CAST(:updated_by AS uuid),
      updated_at = now()
    WHERE id_empresa = CAST(:id_empresa AS uuid)
      AND id_item = CAST(:id_item AS uuid)
      AND id_almacen = CAST(:id_almacen AS uuid)
    RETURNING
      id_stock_producto_almacen::text AS id_stock_producto_almacen,
      id_empresa::text AS id_empresa,
      id_item::text AS id_item,
      id_almacen::text AS id_almacen,
      stock_fisico,
      stock_reservado,
      stock_virtual,
      stock_disponible,
      estado,
      created_by::text AS created_by,
      updated_by::text AS updated_by,
      created_at,
      updated_at
    """
)

UPDATE_STOCK_AJUSTE_NEGATIVO_SQL = text(
    """
    UPDATE public.stock_item_almacen
    SET
      stock_fisico = stock_fisico - :cantidad,
      stock_disponible = stock_disponible - :cantidad,
      updated_by = CAST(:updated_by AS uuid),
      updated_at = now()
    WHERE id_empresa = CAST(:id_empresa AS uuid)
      AND id_item = CAST(:id_item AS uuid)
      AND id_almacen = CAST(:id_almacen AS uuid)
      AND stock_disponible >= :cantidad
    RETURNING
      id_stock_producto_almacen::text AS id_stock_producto_almacen,
      id_empresa::text AS id_empresa,
      id_item::text AS id_item,
      id_almacen::text AS id_almacen,
      stock_fisico,
      stock_reservado,
      stock_virtual,
      stock_disponible,
      estado,
      created_by::text AS created_by,
      updated_by::text AS updated_by,
      created_at,
      updated_at
    """
)

INSERT_MOVIMIENTO_AJUSTE_SQL = text(
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
      :tipo_movimiento,
      :cantidad,
      :costo_unitario,
      :costo_total,
      :fecha_movimiento,
      :referencia,
      :concepto,
      CAST(:id_almacen AS uuid),
      'AJUSTE_STOCK',
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


def _one(statement: Any, params: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    row = db.session.execute(statement, params).mappings().first()
    return dict(row) if row else None


def buscar_movimiento_ajuste_por_idempotencia(
    id_empresa: str, id_origen: str
) -> Optional[Dict[str, Any]]:
    return _one(
        MOVIMIENTO_AJUSTE_POR_IDEMPOTENCIA_SQL,
        {"id_empresa": id_empresa, "id_origen": id_origen},
    )


def bloquear_stock_ajuste(
    id_empresa: str, id_item: str, id_almacen: str
) -> Optional[Dict[str, Any]]:
    return _one(
        STOCK_AJUSTE_FOR_UPDATE_SQL,
        {
            "id_empresa": id_empresa,
            "id_item": id_item,
            "id_almacen": id_almacen,
        },
    )


def actualizar_stock_ajuste_positivo(row: Dict[str, Any]) -> Dict[str, Any]:
    result = _one(UPDATE_STOCK_AJUSTE_POSITIVO_SQL, row)
    if result is None:
        raise RuntimeError("No se obtuvo el saldo actualizado por AJUSTE POSITIVO")
    return result


def actualizar_stock_ajuste_negativo(row: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """UPDATE condicionado; None = disponible insuficiente."""
    return _one(UPDATE_STOCK_AJUSTE_NEGATIVO_SQL, row)


def insertar_movimiento_ajuste(row: Dict[str, Any]) -> Dict[str, Any]:
    result = _one(INSERT_MOVIMIENTO_AJUSTE_SQL, row)
    if result is None:
        raise RuntimeError("No se obtuvo el movimiento de ajuste insertado")
    return result

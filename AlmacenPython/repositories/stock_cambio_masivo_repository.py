"""Acceso transaccional del writer CAMBIO MASIVO DE STOCK v1."""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Sequence

from sqlalchemy import bindparam, text

from utils.db import db


CABECERA_POR_IDEMPOTENCIA_SQL = text(
    """
    SELECT
      id_cambio_masivo_stock::text AS id_cambio_masivo_stock,
      id_empresa::text AS id_empresa,
      id_almacen::text AS id_almacen,
      id_origen::text AS id_origen,
      fecha_movimiento,
      referencia,
      concepto,
      estado_operacion,
      estado
    FROM public.cambio_masivo_stock
    WHERE id_empresa = CAST(:id_empresa AS uuid)
      AND id_origen = CAST(:id_origen AS uuid)
    """
)

DETALLES_POR_CABECERA_SQL = text(
    """
    SELECT
      id_cambio_masivo_stock_detalle::text AS id_cambio_masivo_stock_detalle,
      id_cambio_masivo_stock::text AS id_cambio_masivo_stock,
      id_item::text AS id_item,
      tipo_ajuste,
      cantidad,
      estado
    FROM public.cambio_masivo_stock_detalle
    WHERE id_cambio_masivo_stock = CAST(:id_cambio_masivo_stock AS uuid)
    ORDER BY id_item
    """
)

RESOLVER_STOCKS_LOTE_SQL = text(
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
      AND id_almacen = CAST(:id_almacen AS uuid)
      AND id_item IN :id_items
    """
).bindparams(bindparam("id_items", expanding=True))

BLOQUEAR_STOCKS_POR_IDS_SQL = text(
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
    WHERE id_stock_producto_almacen IN :ids
    ORDER BY id_stock_producto_almacen
    FOR UPDATE
    """
).bindparams(bindparam("ids", expanding=True))

UPDATE_STOCK_CAMBIO_MASIVO_POSITIVO_SQL = text(
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

UPDATE_STOCK_CAMBIO_MASIVO_NEGATIVO_SQL = text(
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

INSERT_CABECERA_SQL = text(
    """
    INSERT INTO public.cambio_masivo_stock (
      id_empresa,
      id_almacen,
      id_origen,
      fecha_movimiento,
      referencia,
      concepto,
      estado_operacion,
      estado,
      created_by,
      updated_by
    ) VALUES (
      CAST(:id_empresa AS uuid),
      CAST(:id_almacen AS uuid),
      CAST(:id_origen AS uuid),
      :fecha_movimiento,
      :referencia,
      :concepto,
      'COMPLETADA',
      true,
      CAST(:created_by AS uuid),
      CAST(:updated_by AS uuid)
    )
    RETURNING
      id_cambio_masivo_stock::text AS id_cambio_masivo_stock,
      id_empresa::text AS id_empresa,
      id_almacen::text AS id_almacen,
      id_origen::text AS id_origen,
      fecha_movimiento,
      referencia,
      concepto,
      estado_operacion,
      estado,
      created_by::text AS created_by,
      updated_by::text AS updated_by,
      created_at,
      updated_at
    """
)

INSERT_DETALLE_SQL = text(
    """
    INSERT INTO public.cambio_masivo_stock_detalle (
      id_cambio_masivo_stock,
      id_item,
      tipo_ajuste,
      cantidad,
      estado,
      created_by,
      updated_by
    ) VALUES (
      CAST(:id_cambio_masivo_stock AS uuid),
      CAST(:id_item AS uuid),
      :tipo_ajuste,
      :cantidad,
      true,
      CAST(:created_by AS uuid),
      CAST(:updated_by AS uuid)
    )
    RETURNING
      id_cambio_masivo_stock_detalle::text AS id_cambio_masivo_stock_detalle,
      id_cambio_masivo_stock::text AS id_cambio_masivo_stock,
      id_item::text AS id_item,
      tipo_ajuste,
      cantidad,
      estado,
      created_by::text AS created_by,
      updated_by::text AS updated_by,
      created_at,
      updated_at
    """
)

INSERT_MOVIMIENTO_CAMBIO_MASIVO_SQL = text(
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
      'CAMBIO_MASIVO_STOCK',
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


def _many(statement: Any, params: Dict[str, Any]) -> List[Dict[str, Any]]:
    rows = db.session.execute(statement, params).mappings().all()
    return [dict(row) for row in rows]


def buscar_cabecera_por_idempotencia(
    id_empresa: str, id_origen: str
) -> Optional[Dict[str, Any]]:
    return _one(
        CABECERA_POR_IDEMPOTENCIA_SQL,
        {"id_empresa": id_empresa, "id_origen": id_origen},
    )


def buscar_detalles_por_cabecera(
    id_cambio_masivo_stock: str,
) -> List[Dict[str, Any]]:
    return _many(
        DETALLES_POR_CABECERA_SQL,
        {"id_cambio_masivo_stock": id_cambio_masivo_stock},
    )


def resolver_stocks_lote(
    id_empresa: str, id_almacen: str, id_items: Sequence[str]
) -> List[Dict[str, Any]]:
    if not id_items:
        return []
    return _many(
        RESOLVER_STOCKS_LOTE_SQL,
        {
            "id_empresa": id_empresa,
            "id_almacen": id_almacen,
            "id_items": list(id_items),
        },
    )


def bloquear_stocks_por_ids(ids: Sequence[str]) -> List[Dict[str, Any]]:
    if not ids:
        return []
    return _many(
        BLOQUEAR_STOCKS_POR_IDS_SQL,
        {"ids": list(ids)},
    )


def actualizar_stock_cambio_masivo_positivo(row: Dict[str, Any]) -> Dict[str, Any]:
    result = _one(UPDATE_STOCK_CAMBIO_MASIVO_POSITIVO_SQL, row)
    if result is None:
        raise RuntimeError("No se obtuvo el saldo actualizado por CAMBIO MASIVO POSITIVO")
    return result


def actualizar_stock_cambio_masivo_negativo(
    row: Dict[str, Any],
) -> Optional[Dict[str, Any]]:
    """UPDATE condicionado; None = disponible insuficiente."""
    return _one(UPDATE_STOCK_CAMBIO_MASIVO_NEGATIVO_SQL, row)


def insertar_cabecera_cambio_masivo(row: Dict[str, Any]) -> Dict[str, Any]:
    result = _one(INSERT_CABECERA_SQL, row)
    if result is None:
        raise RuntimeError("No se obtuvo la cabecera de cambio masivo insertada")
    return result


def insertar_detalle_cambio_masivo(row: Dict[str, Any]) -> Dict[str, Any]:
    result = _one(INSERT_DETALLE_SQL, row)
    if result is None:
        raise RuntimeError("No se obtuvo el detalle de cambio masivo insertado")
    return result


def insertar_movimiento_cambio_masivo(row: Dict[str, Any]) -> Dict[str, Any]:
    result = _one(INSERT_MOVIMIENTO_CAMBIO_MASIVO_SQL, row)
    if result is None:
        raise RuntimeError("No se obtuvo el movimiento de cambio masivo insertado")
    return result

"""Acceso transaccional del writer TRANSFERENCIA DE STOCK v1 (inmediata)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from sqlalchemy import text

from utils.db import db


MOVIMIENTOS_TRANSFERENCIA_POR_IDEMPOTENCIA_SQL = text(
    """
    SELECT
      id_movimiento_inventario::text AS id_movimiento_inventario,
      id_empresa::text AS id_empresa,
      id_item::text AS id_item,
      id_almacen::text AS id_almacen,
      id_almacen_destino::text AS id_almacen_destino,
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
      AND modulo_origen = 'TRANSFERENCIA_STOCK'
      AND id_origen = CAST(:id_origen AS uuid)
    ORDER BY tipo_movimiento
    """
)

STOCK_PAR_TRANSFERENCIA_FOR_UPDATE_SQL = text(
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
      AND id_almacen IN (
        CAST(:id_almacen_origen AS uuid),
        CAST(:id_almacen_destino AS uuid)
      )
    ORDER BY id_stock_producto_almacen
    FOR UPDATE
    """
)

UPDATE_STOCK_TRANSFERENCIA_ORIGEN_SQL = text(
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

UPDATE_STOCK_TRANSFERENCIA_DESTINO_SQL = text(
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

INSERT_TRANSFERENCIA_STOCK_SQL = text(
    """
    INSERT INTO public.transferencia_stock (
      id_empresa,
      transferencia_ref,
      id_almacen_origen,
      id_almacen_destino,
      estado_transferencia,
      fecha_transferencia,
      observacion,
      created_by,
      updated_by,
      estado
    ) VALUES (
      CAST(:id_empresa AS uuid),
      :transferencia_ref,
      CAST(:id_almacen_origen AS uuid),
      CAST(:id_almacen_destino AS uuid),
      'COMPLETADA',
      CAST(:fecha_transferencia AS timestamp),
      :observacion,
      CAST(:created_by AS uuid),
      CAST(:updated_by AS uuid),
      true
    )
    RETURNING
      id_transferencia_stock::text AS id_transferencia_stock,
      id_empresa::text AS id_empresa,
      transferencia_ref,
      id_almacen_origen::text AS id_almacen_origen,
      id_almacen_destino::text AS id_almacen_destino,
      estado_transferencia,
      fecha_transferencia,
      observacion,
      created_by::text AS created_by,
      updated_by::text AS updated_by,
      created_at,
      updated_at,
      estado
    """
)

INSERT_TRANSFERENCIA_DETALLE_SQL = text(
    """
    INSERT INTO public.transferencia_stock_detalle (
      id_transferencia_stock,
      id_item,
      id_lote_serie,
      cantidad,
      created_by,
      updated_by,
      estado
    ) VALUES (
      CAST(:id_transferencia_stock AS uuid),
      CAST(:id_item AS uuid),
      NULL,
      :cantidad,
      CAST(:created_by AS uuid),
      CAST(:updated_by AS uuid),
      true
    )
    RETURNING
      id_transferencia_stock_detalle::text AS id_transferencia_stock_detalle,
      id_transferencia_stock::text AS id_transferencia_stock,
      id_item::text AS id_item,
      cantidad,
      created_by::text AS created_by,
      updated_by::text AS updated_by,
      created_at,
      updated_at,
      estado
    """
)

INSERT_MOVIMIENTO_TRANSFERENCIA_SQL = text(
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
      id_almacen_destino,
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
      CAST(:id_almacen_destino AS uuid),
      'TRANSFERENCIA_STOCK',
      CAST(:id_origen AS uuid),
      CAST(:updated_by AS uuid)
    )
    RETURNING
      id_movimiento_inventario::text AS id_movimiento_inventario,
      id_empresa::text AS id_empresa,
      id_item::text AS id_item,
      id_almacen::text AS id_almacen,
      id_almacen_destino::text AS id_almacen_destino,
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

TRANSFERENCIA_POR_REFERENCIA_SQL = text(
    """
    SELECT
      id_transferencia_stock::text AS id_transferencia_stock,
      id_empresa::text AS id_empresa,
      transferencia_ref,
      id_almacen_origen::text AS id_almacen_origen,
      id_almacen_destino::text AS id_almacen_destino,
      estado_transferencia,
      fecha_transferencia,
      observacion,
      created_by::text AS created_by,
      updated_by::text AS updated_by,
      created_at,
      updated_at,
      estado
    FROM public.transferencia_stock
    WHERE id_empresa = CAST(:id_empresa AS uuid)
      AND transferencia_ref = :transferencia_ref
      AND id_almacen_origen = CAST(:id_almacen_origen AS uuid)
      AND id_almacen_destino = CAST(:id_almacen_destino AS uuid)
    ORDER BY created_at DESC
    LIMIT 1
    """
)

DETALLE_POR_TRANSFERENCIA_SQL = text(
    """
    SELECT
      id_transferencia_stock_detalle::text AS id_transferencia_stock_detalle,
      id_transferencia_stock::text AS id_transferencia_stock,
      id_item::text AS id_item,
      cantidad,
      created_by::text AS created_by,
      updated_by::text AS updated_by,
      created_at,
      updated_at,
      estado
    FROM public.transferencia_stock_detalle
    WHERE id_transferencia_stock = CAST(:id_transferencia_stock AS uuid)
    ORDER BY created_at
    LIMIT 1
    """
)


def _one(statement: Any, params: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    row = db.session.execute(statement, params).mappings().first()
    return dict(row) if row else None


def _many(statement: Any, params: Dict[str, Any]) -> List[Dict[str, Any]]:
    rows = db.session.execute(statement, params).mappings().all()
    return [dict(row) for row in rows]


def buscar_movimientos_transferencia_por_idempotencia(
    id_empresa: str, id_origen: str
) -> List[Dict[str, Any]]:
    return _many(
        MOVIMIENTOS_TRANSFERENCIA_POR_IDEMPOTENCIA_SQL,
        {"id_empresa": id_empresa, "id_origen": id_origen},
    )


def bloquear_stock_par_transferencia(
    id_empresa: str,
    id_item: str,
    id_almacen_origen: str,
    id_almacen_destino: str,
) -> List[Dict[str, Any]]:
    return _many(
        STOCK_PAR_TRANSFERENCIA_FOR_UPDATE_SQL,
        {
            "id_empresa": id_empresa,
            "id_item": id_item,
            "id_almacen_origen": id_almacen_origen,
            "id_almacen_destino": id_almacen_destino,
        },
    )


def actualizar_stock_transferencia_origen(row: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    return _one(UPDATE_STOCK_TRANSFERENCIA_ORIGEN_SQL, row)


def actualizar_stock_transferencia_destino(row: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    result = _one(UPDATE_STOCK_TRANSFERENCIA_DESTINO_SQL, row)
    if result is None:
        raise RuntimeError("No se obtuvo el saldo destino actualizado por TRANSFERENCIA")
    return result


def insertar_transferencia_stock(row: Dict[str, Any]) -> Dict[str, Any]:
    result = _one(INSERT_TRANSFERENCIA_STOCK_SQL, row)
    if result is None:
        raise RuntimeError("No se obtuvo la cabecera de transferencia insertada")
    return result


def insertar_transferencia_detalle(row: Dict[str, Any]) -> Dict[str, Any]:
    result = _one(INSERT_TRANSFERENCIA_DETALLE_SQL, row)
    if result is None:
        raise RuntimeError("No se obtuvo el detalle de transferencia insertado")
    return result


def insertar_movimiento_transferencia(row: Dict[str, Any]) -> Dict[str, Any]:
    result = _one(INSERT_MOVIMIENTO_TRANSFERENCIA_SQL, row)
    if result is None:
        raise RuntimeError("No se obtuvo el movimiento de transferencia insertado")
    return result


def buscar_transferencia_por_referencia(
    id_empresa: str,
    transferencia_ref: str,
    id_almacen_origen: str,
    id_almacen_destino: str,
) -> Optional[Dict[str, Any]]:
    return _one(
        TRANSFERENCIA_POR_REFERENCIA_SQL,
        {
            "id_empresa": id_empresa,
            "transferencia_ref": transferencia_ref,
            "id_almacen_origen": id_almacen_origen,
            "id_almacen_destino": id_almacen_destino,
        },
    )


def buscar_detalle_por_transferencia(id_transferencia_stock: str) -> Optional[Dict[str, Any]]:
    return _one(
        DETALLE_POR_TRANSFERENCIA_SQL,
        {"id_transferencia_stock": id_transferencia_stock},
    )

"""Invocación de stored procedures / funciones sp_* (sin SQL ad-hoc de negocio)."""
from __future__ import annotations

import json
from typing import Any, Dict, Optional

from sqlalchemy import text

from utils.db import db


def _exec_select_json(sql: str, params: Dict[str, Any]) -> Any:
    bind: Dict[str, Any] = {}
    for k, v in params.items():
        if isinstance(v, (dict, list)):
            bind[k] = json.dumps(v, default=str)
        else:
            bind[k] = v
    try:
        row = db.session.execute(text(sql), bind).fetchone()
        db.session.commit()
        if not row:
            return None
        val = row[0]
        if val is None:
            return None
        if isinstance(val, (dict, list)):
            return val
        if isinstance(val, str):
            try:
                return json.loads(val)
            except json.JSONDecodeError:
                return val
        # psycopg2 puede devolver dict vía adaptador jsonb
        try:
            return dict(val)
        except Exception:
            return val
    except Exception:
        db.session.rollback()
        raise


def sp_almacen_crear(p: Dict[str, Any]) -> Any:
    return _exec_select_json(
        """
        SELECT sp_almacen_crear(
          CAST(:p_id_empresa AS uuid),
          :p_almacen_ref,
          :p_nombre,
          :p_descripcion,
          :p_direccion,
          :p_codigo_postal,
          :p_poblacion,
          CAST(:p_id_pais AS uuid),
          CAST(:p_id_provincia AS uuid),
          :p_telefono,
          :p_fax,
          CAST(:p_user_id AS uuid)
        ) AS result
        """,
        p,
    )


def sp_almacen_actualizar(p: Dict[str, Any]) -> Any:
    return _exec_select_json(
        """
        SELECT sp_almacen_actualizar(
          CAST(:p_id_empresa AS uuid),
          CAST(:p_id_almacen AS uuid),
          :p_almacen_ref,
          :p_nombre,
          :p_descripcion,
          :p_direccion,
          :p_codigo_postal,
          :p_poblacion,
          CAST(:p_id_pais AS uuid),
          CAST(:p_id_provincia AS uuid),
          :p_telefono,
          :p_fax,
          CAST(:p_estado AS boolean),
          CAST(:p_user_id AS uuid)
        ) AS result
        """,
        p,
    )


def sp_stock_saldo_upsert(p: Dict[str, Any]) -> Any:
    return _exec_select_json(
        """
        SELECT sp_stock_saldo_upsert(
          CAST(:p_id_empresa AS uuid),
          CAST(:p_id_item AS uuid),
          CAST(:p_id_almacen AS uuid),
          CAST(:p_stock_fisico AS numeric),
          CAST(:p_stock_reservado AS numeric),
          CAST(:p_stock_alerta AS numeric),
          CAST(:p_stock_deseado AS numeric),
          CAST(:p_user_id AS uuid)
        ) AS result
        """,
        p,
    )


def sp_movimiento_inventario_crear(p: Dict[str, Any]) -> Any:
    return _exec_select_json(
        """
        SELECT sp_movimiento_inventario_crear(
          CAST(:p_id_empresa AS uuid),
          CAST(:p_id_item AS uuid),
          CAST(:p_id_almacen AS uuid),
          :p_tipo_movimiento,
          CAST(:p_cantidad AS numeric),
          CAST(:p_costo_unitario AS numeric),
          CAST(:p_fecha_movimiento AS date),
          :p_referencia,
          :p_concepto,
          :p_modulo_origen,
          CAST(:p_id_origen AS uuid),
          CAST(:p_id_almacen_destino AS uuid),
          CAST(:p_id_lote_serie AS uuid),
          CAST(:p_user_id AS uuid),
          CAST(:p_permitir_negativo AS boolean)
        ) AS result
        """,
        p,
    )


def sp_transferencia_stock_crear(p: Dict[str, Any]) -> Any:
    return _exec_select_json(
        """
        SELECT sp_transferencia_stock_crear(
          CAST(:p_id_empresa AS uuid),
          :p_transferencia_ref,
          CAST(:p_id_almacen_origen AS uuid),
          CAST(:p_id_almacen_destino AS uuid),
          CAST(:p_fecha_transferencia AS timestamp),
          :p_observacion,
          CAST(:p_lineas AS jsonb),
          CAST(:p_user_id AS uuid)
        ) AS result
        """,
        p,
    )


def sp_transferencia_stock_completar(p: Dict[str, Any]) -> Any:
    return _exec_select_json(
        """
        SELECT sp_transferencia_stock_completar(
          CAST(:p_id_empresa AS uuid),
          CAST(:p_id_transferencia_stock AS uuid),
          CAST(:p_user_id AS uuid),
          CAST(:p_costo_unitario AS numeric)
        ) AS result
        """,
        p,
    )


def sp_cambio_masivo_crear(p: Dict[str, Any]) -> Any:
    return _exec_select_json(
        """
        SELECT sp_cambio_masivo_crear(
          CAST(:p_id_empresa AS uuid),
          CAST(:p_id_almacen AS uuid),
          CAST(:p_fecha_movimiento AS date),
          :p_referencia,
          :p_concepto,
          CAST(:p_lineas AS jsonb),
          CAST(:p_id_origen AS uuid),
          CAST(:p_user_id AS uuid)
        ) AS result
        """,
        p,
    )


def sp_cambio_masivo_completar(p: Dict[str, Any]) -> Any:
    return _exec_select_json(
        """
        SELECT sp_cambio_masivo_completar(
          CAST(:p_id_empresa AS uuid),
          CAST(:p_id_cambio_masivo_stock AS uuid),
          CAST(:p_user_id AS uuid)
        ) AS result
        """,
        p,
    )


def sp_inventario_cerrar(p: Dict[str, Any]) -> Any:
    return _exec_select_json(
        """
        SELECT sp_inventario_cerrar(
          CAST(:p_id_empresa AS uuid),
          CAST(:p_id_inventario AS uuid),
          CAST(:p_lineas AS jsonb),
          CAST(:p_user_id AS uuid)
        ) AS result
        """,
        p,
    )


def sp_lote_serie_upsert(p: Dict[str, Any]) -> Any:
    return _exec_select_json(
        """
        SELECT sp_lote_serie_upsert(
          CAST(:p_id_empresa AS uuid),
          CAST(:p_id_item AS uuid),
          CAST(:p_id_almacen AS uuid),
          :p_codigo_lote_serie,
          CAST(:p_fecha_limite_venta AS date),
          CAST(:p_fecha_caducidad AS date),
          CAST(:p_cantidad_actual AS numeric),
          :p_observacion,
          CAST(:p_user_id AS uuid),
          CAST(:p_id_lote_serie AS uuid)
        ) AS result
        """,
        p,
    )


def sp_stock_a_fecha(p: Dict[str, Any]) -> Any:
    return _exec_select_json(
        """
        SELECT sp_stock_a_fecha(
          CAST(:p_id_empresa AS uuid),
          CAST(:p_fecha AS date),
          CAST(:p_id_almacen AS uuid),
          CAST(:p_id_item AS uuid)
        ) AS result
        """,
        p,
    )


def sp_stock_reposicion(p: Dict[str, Any]) -> Any:
    return _exec_select_json(
        """
        SELECT sp_stock_reposicion(
          CAST(:p_id_empresa AS uuid),
          CAST(:p_id_almacen AS uuid)
        ) AS result
        """,
        p,
    )


def sp_stock_valoracion_pmp(p: Dict[str, Any]) -> Any:
    return _exec_select_json(
        """
        SELECT sp_stock_valoracion_pmp(
          CAST(:p_id_empresa AS uuid),
          CAST(:p_id_almacen AS uuid)
        ) AS result
        """,
        p,
    )


def empty_to_none(val: Optional[str]) -> Optional[str]:
    if val is None:
        return None
    s = str(val).strip()
    return s or None

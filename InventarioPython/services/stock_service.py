"""Servicios de escritura Kardex / Almacenes (solo SP)."""
from __future__ import annotations

from typing import Any, Dict, List, Optional

from utils import sp as sp_repo


def _uid(user_id: Optional[str]) -> Optional[str]:
    return sp_repo.empty_to_none(user_id)


def crear_almacen(body: Dict[str, Any], id_empresa: str, user_id: Optional[str]) -> Dict[str, Any]:
    data = sp_repo.sp_almacen_crear(
        {
            "p_id_empresa": id_empresa,
            "p_almacen_ref": (body.get("almacen_ref") or "").strip(),
            "p_nombre": (body.get("nombre") or "").strip(),
            "p_descripcion": body.get("descripcion"),
            "p_direccion": body.get("direccion"),
            "p_codigo_postal": body.get("codigo_postal"),
            "p_poblacion": body.get("poblacion"),
            "p_id_pais": sp_repo.empty_to_none(body.get("id_pais")),
            "p_id_provincia": sp_repo.empty_to_none(body.get("id_provincia")),
            "p_telefono": body.get("telefono"),
            "p_fax": body.get("fax"),
            "p_user_id": _uid(user_id),
        }
    )
    return {"success": True, "data": data}


def actualizar_almacen(
    id_almacen: str, body: Dict[str, Any], id_empresa: str, user_id: Optional[str]
) -> Dict[str, Any]:
    data = sp_repo.sp_almacen_actualizar(
        {
            "p_id_empresa": id_empresa,
            "p_id_almacen": id_almacen,
            "p_almacen_ref": body.get("almacen_ref"),
            "p_nombre": body.get("nombre"),
            "p_descripcion": body.get("descripcion"),
            "p_direccion": body.get("direccion"),
            "p_codigo_postal": body.get("codigo_postal"),
            "p_poblacion": body.get("poblacion"),
            "p_id_pais": sp_repo.empty_to_none(body.get("id_pais")),
            "p_id_provincia": sp_repo.empty_to_none(body.get("id_provincia")),
            "p_telefono": body.get("telefono"),
            "p_fax": body.get("fax"),
            "p_estado": body.get("estado"),
            "p_user_id": _uid(user_id),
        }
    )
    return {"success": True, "data": data}


def upsert_saldo(body: Dict[str, Any], id_empresa: str, user_id: Optional[str]) -> Dict[str, Any]:
    data = sp_repo.sp_stock_saldo_upsert(
        {
            "p_id_empresa": id_empresa,
            "p_id_item": body.get("id_item"),
            "p_id_almacen": body.get("id_almacen"),
            "p_stock_fisico": body.get("stock_fisico"),
            "p_stock_reservado": body.get("stock_reservado"),
            "p_stock_alerta": body.get("stock_alerta"),
            "p_stock_deseado": body.get("stock_deseado"),
            "p_user_id": _uid(user_id),
        }
    )
    return {"success": True, "data": data}


def crear_movimiento(body: Dict[str, Any], id_empresa: str, user_id: Optional[str]) -> Dict[str, Any]:
    data = sp_repo.sp_movimiento_inventario_crear(
        {
            "p_id_empresa": id_empresa,
            "p_id_item": body.get("id_item"),
            "p_id_almacen": body.get("id_almacen"),
            "p_tipo_movimiento": body.get("tipo_movimiento"),
            "p_cantidad": body.get("cantidad"),
            "p_costo_unitario": body.get("costo_unitario") or 0,
            "p_fecha_movimiento": body.get("fecha_movimiento"),
            "p_referencia": body.get("referencia"),
            "p_concepto": body.get("concepto"),
            "p_modulo_origen": body.get("modulo_origen"),
            "p_id_origen": sp_repo.empty_to_none(body.get("id_origen")),
            "p_id_almacen_destino": sp_repo.empty_to_none(body.get("id_almacen_destino")),
            "p_id_lote_serie": sp_repo.empty_to_none(body.get("id_lote_serie")),
            "p_user_id": _uid(user_id),
            "p_permitir_negativo": bool(body.get("permitir_negativo") or False),
        }
    )
    return {"success": True, "data": data}


def crear_transferencia(body: Dict[str, Any], id_empresa: str, user_id: Optional[str]) -> Dict[str, Any]:
    lineas: List[Dict[str, Any]] = body.get("lineas") or body.get("detalles") or []
    data = sp_repo.sp_transferencia_stock_crear(
        {
            "p_id_empresa": id_empresa,
            "p_transferencia_ref": (body.get("transferencia_ref") or "").strip(),
            "p_id_almacen_origen": body.get("id_almacen_origen"),
            "p_id_almacen_destino": body.get("id_almacen_destino"),
            "p_fecha_transferencia": body.get("fecha_transferencia"),
            "p_observacion": body.get("observacion"),
            "p_lineas": lineas,
            "p_user_id": _uid(user_id),
        }
    )
    return {"success": True, "data": data}


def completar_transferencia(
    id_transferencia: str, body: Dict[str, Any], id_empresa: str, user_id: Optional[str]
) -> Dict[str, Any]:
    data = sp_repo.sp_transferencia_stock_completar(
        {
            "p_id_empresa": id_empresa,
            "p_id_transferencia_stock": id_transferencia,
            "p_user_id": _uid(user_id),
            "p_costo_unitario": body.get("costo_unitario") or 0,
        }
    )
    return {"success": True, "data": data}


def crear_cambio_masivo(body: Dict[str, Any], id_empresa: str, user_id: Optional[str]) -> Dict[str, Any]:
    lineas: List[Dict[str, Any]] = body.get("lineas") or body.get("detalles") or []
    data = sp_repo.sp_cambio_masivo_crear(
        {
            "p_id_empresa": id_empresa,
            "p_id_almacen": body.get("id_almacen"),
            "p_fecha_movimiento": body.get("fecha_movimiento"),
            "p_referencia": body.get("referencia"),
            "p_concepto": body.get("concepto"),
            "p_lineas": lineas,
            "p_id_origen": sp_repo.empty_to_none(body.get("id_origen")),
            "p_user_id": _uid(user_id),
        }
    )
    return {"success": True, "data": data}


def completar_cambio_masivo(
    id_cambio: str, id_empresa: str, user_id: Optional[str]
) -> Dict[str, Any]:
    data = sp_repo.sp_cambio_masivo_completar(
        {
            "p_id_empresa": id_empresa,
            "p_id_cambio_masivo_stock": id_cambio,
            "p_user_id": _uid(user_id),
        }
    )
    try:
        from services.rabbit_publisher import publish_ajuste_inventario

        movs = (data or {}).get("movimientos") or []
        if movs:
            publish_ajuste_inventario(
                id_empresa=id_empresa,
                id_origen=id_cambio,
                movimientos=movs,
                modulo_origen="CAMBIO_MASIVO_STOCK",
                id_cambio_masivo_stock=id_cambio,
            )
    except Exception as exc:
        import logging

        logging.getLogger(__name__).exception("Rabbit cambio masivo: %s", exc)
    return {"success": True, "data": data}


def cerrar_inventario(
    id_inventario: str, body: Dict[str, Any], id_empresa: str, user_id: Optional[str]
) -> Dict[str, Any]:
    lineas = body.get("lineas") or body.get("detalles")
    data = sp_repo.sp_inventario_cerrar(
        {
            "p_id_empresa": id_empresa,
            "p_id_inventario": id_inventario,
            "p_lineas": lineas,
            "p_user_id": _uid(user_id),
        }
    )
    try:
        from services.rabbit_publisher import publish_ajuste_inventario

        movs = (data or {}).get("movimientos") or []
        if movs:
            publish_ajuste_inventario(
                id_empresa=id_empresa,
                id_origen=id_inventario,
                movimientos=movs,
                modulo_origen="AJUSTE_STOCK",
                id_inventario=id_inventario,
            )
    except Exception as exc:
        import logging

        logging.getLogger(__name__).exception("Rabbit cierre inventario: %s", exc)
    return {"success": True, "data": data}


def upsert_lote(body: Dict[str, Any], id_empresa: str, user_id: Optional[str]) -> Dict[str, Any]:
    data = sp_repo.sp_lote_serie_upsert(
        {
            "p_id_empresa": id_empresa,
            "p_id_item": body.get("id_item"),
            "p_id_almacen": body.get("id_almacen"),
            "p_codigo_lote_serie": (body.get("codigo_lote_serie") or "").strip(),
            "p_fecha_limite_venta": body.get("fecha_limite_venta"),
            "p_fecha_caducidad": body.get("fecha_caducidad"),
            "p_cantidad_actual": body.get("cantidad_actual") or 0,
            "p_observacion": body.get("observacion"),
            "p_user_id": _uid(user_id),
            "p_id_lote_serie": sp_repo.empty_to_none(body.get("id_lote_serie")),
        }
    )
    return {"success": True, "data": data}


def stock_a_fecha(body: Dict[str, Any], id_empresa: str) -> Dict[str, Any]:
    data = sp_repo.sp_stock_a_fecha(
        {
            "p_id_empresa": id_empresa,
            "p_fecha": body.get("fecha"),
            "p_id_almacen": sp_repo.empty_to_none(body.get("id_almacen")),
            "p_id_item": sp_repo.empty_to_none(body.get("id_item")),
        }
    )
    return {"success": True, "data": data or []}


def stock_reposicion(body: Dict[str, Any], id_empresa: str) -> Dict[str, Any]:
    data = sp_repo.sp_stock_reposicion(
        {
            "p_id_empresa": id_empresa,
            "p_id_almacen": sp_repo.empty_to_none(body.get("id_almacen")),
        }
    )
    return {"success": True, "data": data or []}


def stock_valoracion_pmp(body: Dict[str, Any], id_empresa: str) -> Dict[str, Any]:
    data = sp_repo.sp_stock_valoracion_pmp(
        {
            "p_id_empresa": id_empresa,
            "p_id_almacen": sp_repo.empty_to_none(body.get("id_almacen")),
        }
    )
    return {"success": True, "data": data or []}

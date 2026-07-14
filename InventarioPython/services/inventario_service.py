from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from marshmallow import ValidationError

from schemas.inventario_schema import (
    InventarioCreateSchema,
    InventarioEstadoUpdateSchema,
    InventarioUpdateSchema,
)
from repositories.inventario_repository import (
    create_inventario_row,
    find_inventario_by_id,
    find_inventario_by_ref_empresa,
    find_otro_inventario_misma_ref,
    update_estado_inventario,
    update_inventario_row,
)


def _uuid_or_none(value: Optional[str]) -> Optional[str]:
    if not value or not str(value).strip():
        return None
    s = str(value).strip()
    try:
        uuid.UUID(s)
        return s
    except ValueError:
        return None


def servicio_crear_inventario(
    raw: Dict[str, Any],
    *,
    id_empresa: str,
    user_id: Optional[str],
) -> Dict[str, Any]:
    if not id_empresa or not str(id_empresa).strip():
        raise ValidationError({"id_empresa": ["Empresa obligatoria"]})
    try:
        uuid.UUID(str(id_empresa).strip())
    except ValueError as e:
        raise ValidationError({"id_empresa": ["id_empresa debe ser UUID"]}) from e

    body = dict(raw or {})
    body["id_empresa"] = str(id_empresa).strip()
    data = InventarioCreateSchema().load(body)

    inventario_ref = str(data.get("inventario_ref") or "").strip()
    etiqueta = str(data.get("etiqueta") or "").strip()
    id_almacen = str(data.get("id_almacen") or "").strip()
    observacion_raw = data.get("observacion")
    observacion = str(observacion_raw).strip() if observacion_raw is not None else None
    if observacion == "":
        observacion = None

    dup = find_inventario_by_ref_empresa(str(id_empresa).strip(), inventario_ref)
    if dup is not None:
        raise ValueError("inventario_ref_duplicado")

    now = datetime.now(timezone.utc)
    row: Dict[str, Any] = {
        "id_empresa": str(id_empresa).strip(),
        "inventario_ref": inventario_ref,
        "etiqueta": etiqueta,
        "id_almacen": id_almacen,
        "estado_inventario": "ABIERTO",
        "fecha_inicio": now,
        "fecha_cierre": None,
        "observacion": observacion,
        "created_by": _uuid_or_none(user_id),
        "updated_by": _uuid_or_none(user_id),
        "created_at": now,
        "updated_at": now,
        "estado": True,
    }

    created = create_inventario_row(row)
    return {
        "success": True,
        "message": "Inventario creado correctamente",
        "data": created,
    }


def _validar_estado_inventario(val: Optional[str]) -> Optional[str]:
    if val is None or not str(val).strip():
        return None
    ev = str(val).strip().upper()
    if ev not in ("ABIERTO", "BORRADOR", "CERRADO"):
        raise ValidationError({"estado_inventario": ["Debe ser ABIERTO, BORRADOR o CERRADO"]})
    return ev


def servicio_actualizar_inventario(
    id_inventario: str,
    raw: Dict[str, Any],
    *,
    user_id: Optional[str],
) -> Dict[str, Any]:
    id_inv = str(id_inventario or "").strip()
    if not id_inv:
        raise ValidationError({"id_inventario": ["id_inventario es obligatorio"]})
    try:
        uuid.UUID(id_inv)
    except ValueError as e:
        raise ValidationError({"id_inventario": ["id_inventario debe ser UUID"]}) from e

    entity = find_inventario_by_id(id_inv)
    if entity is None:
        raise LookupError("inventario_no_encontrado")

    data = InventarioUpdateSchema().load(raw or {})

    id_empresa = str(data["id_empresa"]).strip()
    inventario_ref = str(data["inventario_ref"]).strip()
    etiqueta = str(data["etiqueta"]).strip()
    id_almacen = str(data["id_almacen"]).strip()

    dup = find_otro_inventario_misma_ref(id_empresa, inventario_ref, id_inv)
    if dup is not None:
        raise ValueError("inventario_ref_duplicado")

    entity.id_empresa = id_empresa
    entity.inventario_ref = inventario_ref
    entity.etiqueta = etiqueta
    entity.id_almacen = id_almacen

    if "estado_inventario" in data and data.get("estado_inventario") is not None:
        nuevo_est = _validar_estado_inventario(data.get("estado_inventario"))
        if nuevo_est:
            entity.estado_inventario = nuevo_est

    if "fecha_inicio" in data and data.get("fecha_inicio") is not None:
        entity.fecha_inicio = data["fecha_inicio"]
    if "fecha_cierre" in data:
        entity.fecha_cierre = data.get("fecha_cierre")

    observacion_raw = data.get("observacion")
    if observacion_raw is not None:
        s = str(observacion_raw).strip() if observacion_raw else ""
        entity.observacion = None if s == "" else s

    now = datetime.now(timezone.utc)
    entity.updated_by = _uuid_or_none(user_id)
    entity.updated_at = now

    out = update_inventario_row(entity)
    return {
        "success": True,
        "message": "Inventario actualizado correctamente",
        "data": out,
    }


def servicio_actualizar_estado_inventario(
    raw: Dict[str, Any],
    *,
    user_id: Optional[str],
) -> Dict[str, Any]:
    data = InventarioEstadoUpdateSchema().load(raw or {})
    id_inventario = str(data["id_inventario"]).strip()
    estado = bool(data["estado"])

    updated = update_estado_inventario(id_inventario=id_inventario, estado=estado, user_id=_uuid_or_none(user_id))
    if not updated:
        raise LookupError("inventario_no_encontrado")

    return {
        "success": True,
        "message": "Estado de inventario actualizado correctamente",
        "data": {
            "id_inventario": id_inventario,
            "estado": estado,
        },
    }

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from marshmallow import ValidationError

from schemas.inventario_schema import InventarioCreateSchema
from repositories.inventario_repository import (
    create_inventario_row,
    find_inventario_by_ref_empresa,
)
from services.item_service import _uuid_or_none


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

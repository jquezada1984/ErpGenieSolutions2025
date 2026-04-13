"""Alta y listado de catálogo item_etiqueta_categoria (sin detalle ítem)."""
from __future__ import annotations

from typing import Any, Dict, List, Optional

from marshmallow import ValidationError

from schemas.etiqueta_categoria_schema import (
    EtiquetaCategoriaCreateSchema,
    EtiquetaCategoriaEstadoSchema,
    EtiquetaCategoriaUpdateSchema,
)
from repositories.etiqueta_categoria_repository import (
    insert_etiqueta_categoria,
    list_etiquetas_categoria_by_empresa,
    update_etiqueta_categoria,
    update_etiqueta_categoria_estado,
)
from services.item_service import _uuid_or_none


def servicio_listar_etiqueta_categoria(id_empresa: str) -> List[Dict[str, Any]]:
    if not id_empresa or not str(id_empresa).strip():
        return []
    return list_etiquetas_categoria_by_empresa(str(id_empresa).strip())


def servicio_crear_etiqueta_categoria(
    raw: Dict[str, Any],
    *,
    id_empresa: str,
    user_id: Optional[str],
) -> Dict[str, Any]:
    schema = EtiquetaCategoriaCreateSchema()
    data = schema.load(raw or {})
    ref = (data.get("ref") or "").strip()
    if not ref:
        raise ValidationError({"ref": ["La referencia es obligatoria"]})

    nombre = (data.get("nombre") or "").strip() or ref
    descripcion = (data.get("descripcion") or "").strip() or None
    color = (data.get("color") or "").strip() or "#0d6efd"
    posicion = data.get("posicion")
    if posicion is None:
        posicion = 1
    try:
        posicion = int(posicion)
    except (TypeError, ValueError):
        raise ValidationError({"posicion": ["Debe ser un entero"]}) from None

    estado = data.get("estado")
    if estado is None:
        estado = True

    row: Dict[str, Any] = {
        "id_empresa": id_empresa,
        "ref": ref,
        "nombre": nombre,
        "descripcion": descripcion,
        "color": color,
        "posicion": posicion,
        "estado": bool(estado),
        "created_by": _uuid_or_none(user_id),
        "updated_by": _uuid_or_none(user_id),
    }
    new_id = insert_etiqueta_categoria(row)
    return {"success": True, "id_etiqueta_categoria": new_id}


def servicio_actualizar_etiqueta_categoria(
    raw: Dict[str, Any],
    *,
    id_etiqueta_categoria: str,
    id_empresa: str,
    user_id: Optional[str],
) -> Dict[str, Any]:
    schema = EtiquetaCategoriaUpdateSchema()
    data = schema.load(raw or {})
    ref = (data.get("ref") or "").strip()
    if not ref:
        raise ValidationError({"ref": ["La referencia es obligatoria"]})

    nombre = (data.get("nombre") or "").strip() or ref
    descripcion = (data.get("descripcion") or "").strip() or None
    color = (data.get("color") or "").strip() or "#0d6efd"
    posicion = data.get("posicion")
    if posicion is None:
        posicion = 0
    try:
        posicion = int(posicion)
    except (TypeError, ValueError):
        raise ValidationError({"posicion": ["Debe ser un entero"]}) from None

    estado = data.get("estado")
    if estado is None:
        estado = True

    row: Dict[str, Any] = {
        "id_etiqueta_categoria": str(id_etiqueta_categoria).strip(),
        "id_empresa": id_empresa,
        "ref": ref,
        "nombre": nombre,
        "descripcion": descripcion,
        "color": color,
        "posicion": posicion,
        "estado": bool(estado),
        "updated_by": _uuid_or_none(user_id),
    }
    n = update_etiqueta_categoria(row)
    if n == 0:
        raise LookupError("Etiqueta/categoría no encontrada o sin permiso para actualizarla")
    return {"success": True}


def servicio_cambiar_estado_etiqueta_categoria(
    raw: Dict[str, Any],
    *,
    id_etiqueta_categoria: str,
    id_empresa: str,
    user_id: Optional[str],
) -> Dict[str, Any]:
    schema = EtiquetaCategoriaEstadoSchema()
    data = schema.load(raw or {})
    estado = data.get("estado")

    row: Dict[str, Any] = {
        "id_etiqueta_categoria": str(id_etiqueta_categoria).strip(),
        "id_empresa": id_empresa,
        "estado": bool(estado),
        "updated_by": _uuid_or_none(user_id),
    }
    n = update_etiqueta_categoria_estado(row)
    if n == 0:
        raise LookupError("Etiqueta/categoría no encontrada o sin permiso para actualizar el estado")
    return {"success": True, "message": "El estado se actualizó correctamente."}

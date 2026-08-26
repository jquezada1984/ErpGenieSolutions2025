"""Service de almacén — CREATE + UPDATE cabecera (sin toggle estado)."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from marshmallow import ValidationError

from schemas.almacen_schema import AlmacenCreateSchema, AlmacenUpdateSchema
from repositories.almacen_repository import (
    create_almacen_row,
    find_almacen_by_id_and_empresa,
    find_almacen_by_ref_empresa,
    find_otro_almacen_misma_ref,
    update_almacen_row,
)


def _uuid_or_none(value: Optional[str]) -> Optional[str]:
    if not value or not str(value).strip():
        return None
    s = str(value).strip()
    try:
        uuid.UUID(s)
    except ValueError:
        return None
    return s


def _str_or_none(value: Any) -> Optional[str]:
    if value is None:
        return None
    s = str(value).strip()
    return s if s else None


def _id_empresa_contexto_valido(id_empresa_contexto: Optional[str]) -> str:
    if not id_empresa_contexto or not str(id_empresa_contexto).strip():
        raise ValidationError({"X-Company-Id": ["Header obligatorio"]})
    try:
        return str(uuid.UUID(str(id_empresa_contexto).strip()))
    except ValueError as exc:
        raise ValidationError({"X-Company-Id": ["Debe ser UUID válido"]}) from exc


def _validar_body_id_empresa_coincide(raw: Dict[str, Any], id_empresa_header: str) -> None:
    if raw.get("id_empresa") is not None:
        body_empresa = str(raw["id_empresa"]).strip()
        if body_empresa != id_empresa_header:
            raise ValidationError({"id_empresa": ["No coincide con X-Company-Id"]})


def servicio_crear_almacen(
    raw: Dict[str, Any],
    *,
    id_empresa_contexto: Optional[str],
    user_id: Optional[str],
) -> Dict[str, Any]:
    id_empresa_header = _id_empresa_contexto_valido(id_empresa_contexto)
    raw_body = dict(raw or {})
    _validar_body_id_empresa_coincide(raw_body, id_empresa_header)

    body = dict(raw_body)
    body["id_empresa"] = id_empresa_header
    data = AlmacenCreateSchema().load(body)

    almacen_ref = str(data.get("almacen_ref") or "").strip()
    nombre = str(data.get("nombre") or "").strip()

    dup = find_almacen_by_ref_empresa(id_empresa_header, almacen_ref)
    if dup is not None:
        raise ValueError("almacen_ref_duplicado")

    now = datetime.now(timezone.utc)
    row: Dict[str, Any] = {
        "id_empresa": id_empresa_header,
        "almacen_ref": almacen_ref,
        "nombre": nombre,
        "descripcion": _str_or_none(data.get("descripcion")),
        "direccion": _str_or_none(data.get("direccion")),
        "codigo_postal": _str_or_none(data.get("codigo_postal")),
        "poblacion": _str_or_none(data.get("poblacion")),
        "id_pais": _uuid_or_none(str(data["id_pais"]) if data.get("id_pais") is not None else None),
        "id_provincia": _uuid_or_none(
            str(data["id_provincia"]) if data.get("id_provincia") is not None else None
        ),
        "telefono": _str_or_none(data.get("telefono")),
        "fax": _str_or_none(data.get("fax")),
        "estado": bool(data.get("estado")) if data.get("estado") is not None else True,
        "created_by": _uuid_or_none(user_id),
        "updated_by": _uuid_or_none(user_id),
        "created_at": now,
        "updated_at": now,
    }

    created = create_almacen_row(row)
    return {
        "success": True,
        "message": "Almacén creado correctamente",
        "data": created,
    }


def servicio_actualizar_almacen(
    id_almacen: str,
    raw: Dict[str, Any],
    *,
    id_empresa_contexto: Optional[str],
    user_id: Optional[str],
) -> Dict[str, Any]:
    """PUT cabecera. Localiza por id_almacen + id_empresa del contexto (X-Company-Id)."""
    id_alm = str(id_almacen or "").strip()
    if not id_alm:
        raise ValidationError({"id_almacen": ["id_almacen es obligatorio"]})
    try:
        uuid.UUID(id_alm)
    except ValueError as e:
        raise ValidationError({"id_almacen": ["id_almacen debe ser UUID"]}) from e

    id_empresa_header = _id_empresa_contexto_valido(id_empresa_contexto)
    raw_body = dict(raw or {})
    _validar_body_id_empresa_coincide(raw_body, id_empresa_header)

    entity = find_almacen_by_id_and_empresa(id_alm, id_empresa_header)
    if entity is None:
        raise LookupError("almacen_no_encontrado")

    body = dict(raw_body)
    body["id_empresa"] = id_empresa_header
    data = AlmacenUpdateSchema().load(body)

    almacen_ref = str(data["almacen_ref"]).strip()
    nombre = str(data["nombre"]).strip()

    dup = find_otro_almacen_misma_ref(id_empresa_header, almacen_ref, id_alm)
    if dup is not None:
        raise ValueError("almacen_ref_duplicado")

    entity.almacen_ref = almacen_ref
    entity.nombre = nombre
    entity.descripcion = _str_or_none(data.get("descripcion"))
    entity.direccion = _str_or_none(data.get("direccion"))
    entity.codigo_postal = _str_or_none(data.get("codigo_postal"))
    entity.poblacion = _str_or_none(data.get("poblacion"))
    entity.id_pais = _uuid_or_none(
        str(data["id_pais"]) if data.get("id_pais") is not None else None
    )
    entity.id_provincia = _uuid_or_none(
        str(data["id_provincia"]) if data.get("id_provincia") is not None else None
    )
    entity.telefono = _str_or_none(data.get("telefono"))
    entity.fax = _str_or_none(data.get("fax"))
    # estado NO se toca aquí

    now = datetime.now(timezone.utc)
    entity.updated_by = _uuid_or_none(user_id)
    entity.updated_at = now

    out = update_almacen_row(entity)
    return {
        "success": True,
        "message": "Almacén actualizado correctamente",
        "data": out,
    }

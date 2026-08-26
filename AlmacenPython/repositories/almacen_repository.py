"""Repository de almacén — CREATE + UPDATE cabecera (+ lookups)."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Optional

from utils.db import db
from models.almacen import Almacen


def find_almacen_by_ref_empresa(id_empresa: str, almacen_ref: str) -> Optional[Almacen]:
    return (
        Almacen.query.filter_by(
            id_empresa=str(id_empresa).strip(),
            almacen_ref=str(almacen_ref).strip(),
        )
        .order_by(Almacen.created_at.desc())
        .first()
    )


def find_almacen_by_id(id_almacen: str) -> Optional[Almacen]:
    return Almacen.query.filter_by(id_almacen=str(id_almacen).strip()).first()


def find_almacen_by_id_and_empresa(
    id_almacen: str, id_empresa: str
) -> Optional[Almacen]:
    return Almacen.query.filter_by(
        id_almacen=str(id_almacen).strip(),
        id_empresa=str(id_empresa).strip(),
    ).first()


def find_otro_almacen_misma_ref(
    id_empresa: str, almacen_ref: str, excluir_id_almacen: str
) -> Optional[Almacen]:
    return (
        Almacen.query.filter(
            Almacen.id_empresa == str(id_empresa).strip(),
            Almacen.almacen_ref == str(almacen_ref).strip(),
            Almacen.id_almacen != str(excluir_id_almacen).strip(),
        )
        .first()
    )


def _entity_to_dict(entity: Almacen) -> Dict[str, Any]:
    return {
        "id_almacen": str(entity.id_almacen),
        "id_empresa": str(entity.id_empresa) if entity.id_empresa else None,
        "almacen_ref": entity.almacen_ref,
        "nombre": entity.nombre,
        "descripcion": entity.descripcion,
        "direccion": entity.direccion,
        "codigo_postal": entity.codigo_postal,
        "poblacion": entity.poblacion,
        "id_pais": str(entity.id_pais) if entity.id_pais else None,
        "id_provincia": str(entity.id_provincia) if entity.id_provincia else None,
        "telefono": entity.telefono,
        "fax": entity.fax,
        "estado": bool(entity.estado) if entity.estado is not None else True,
        "created_by": str(entity.created_by) if entity.created_by else None,
        "updated_by": str(entity.updated_by) if entity.updated_by else None,
        "created_at": entity.created_at.isoformat() if entity.created_at else None,
        "updated_at": entity.updated_at.isoformat() if entity.updated_at else None,
    }


def create_almacen_row(row: Dict[str, Any]) -> Dict[str, Any]:
    now = datetime.now(timezone.utc)
    try:
        entity = Almacen(
            id_almacen=row.get("id_almacen"),
            id_empresa=row.get("id_empresa"),
            almacen_ref=row.get("almacen_ref"),
            nombre=row.get("nombre"),
            descripcion=row.get("descripcion"),
            direccion=row.get("direccion"),
            codigo_postal=row.get("codigo_postal"),
            poblacion=row.get("poblacion"),
            id_pais=row.get("id_pais"),
            id_provincia=row.get("id_provincia"),
            telefono=row.get("telefono"),
            fax=row.get("fax"),
            created_by=row.get("created_by"),
            updated_by=row.get("updated_by"),
            created_at=row.get("created_at") or now,
            updated_at=row.get("updated_at") or now,
            estado=row.get("estado") if row.get("estado") is not None else True,
        )
        db.session.add(entity)
        db.session.commit()
        return _entity_to_dict(entity)
    except Exception:
        db.session.rollback()
        raise


def update_almacen_row(entity: Almacen) -> Dict[str, Any]:
    """Persiste cambios ya asignados en `entity` (commit)."""
    try:
        db.session.commit()
        return _entity_to_dict(entity)
    except Exception:
        db.session.rollback()
        raise

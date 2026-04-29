from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Optional

from utils.db import db
from models.inventario import Inventario


def find_inventario_by_ref_empresa(id_empresa: str, inventario_ref: str) -> Optional[Inventario]:
    return (
        Inventario.query.filter_by(
            id_empresa=str(id_empresa).strip(),
            inventario_ref=str(inventario_ref).strip(),
        )
        .order_by(Inventario.created_at.desc())
        .first()
    )


def create_inventario_row(row: Dict[str, Any]) -> Dict[str, Any]:
    now = datetime.now(timezone.utc)
    try:
        entity = Inventario(
            id_inventario=row.get("id_inventario"),
            id_empresa=row.get("id_empresa"),
            inventario_ref=row.get("inventario_ref"),
            etiqueta=row.get("etiqueta"),
            id_almacen=row.get("id_almacen"),
            estado_inventario=row.get("estado_inventario"),
            fecha_inicio=row.get("fecha_inicio") or now,
            fecha_cierre=row.get("fecha_cierre"),
            observacion=row.get("observacion"),
            created_by=row.get("created_by"),
            updated_by=row.get("updated_by"),
            created_at=row.get("created_at") or now,
            updated_at=row.get("updated_at") or now,
            estado=row.get("estado") if row.get("estado") is not None else True,
        )
        db.session.add(entity)
        db.session.commit()
        return {
            "id_inventario": str(entity.id_inventario),
            "id_empresa": str(entity.id_empresa),
            "inventario_ref": entity.inventario_ref,
            "etiqueta": entity.etiqueta,
            "id_almacen": str(entity.id_almacen),
            "estado_inventario": entity.estado_inventario,
            "fecha_inicio": entity.fecha_inicio.isoformat() if entity.fecha_inicio else None,
            "fecha_cierre": entity.fecha_cierre.isoformat() if entity.fecha_cierre else None,
            "observacion": entity.observacion,
            "estado": bool(entity.estado),
        }
    except Exception:
        db.session.rollback()
        raise


def update_estado_inventario(id_inventario: str, estado: bool, user_id: Optional[str]) -> bool:
    entity = Inventario.query.filter_by(id_inventario=str(id_inventario).strip()).first()
    if not entity:
        return False

    entity.estado = bool(estado)
    entity.updated_at = datetime.now(timezone.utc)
    entity.updated_by = user_id if user_id else entity.updated_by

    try:
        db.session.commit()
        return True
    except Exception:
        db.session.rollback()
        raise

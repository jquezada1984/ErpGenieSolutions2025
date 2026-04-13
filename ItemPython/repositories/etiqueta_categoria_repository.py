"""Lectura/escritura en public.item_etiqueta_categoria (SQL parametrizado)."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from utils.db import db

LIST_SQL = text(
    """
    SELECT
        id_etiqueta_categoria::text AS id_etiqueta_categoria,
        id_empresa::text AS id_empresa,
        ref,
        nombre,
        descripcion,
        color,
        posicion,
        estado
    FROM public.item_etiqueta_categoria
    WHERE id_empresa = CAST(:id_empresa AS uuid)
    ORDER BY posicion NULLS LAST, nombre NULLS LAST, ref
    """
)

UPDATE_SQL = text(
    """
    UPDATE public.item_etiqueta_categoria SET
        ref = :ref,
        nombre = :nombre,
        descripcion = :descripcion,
        color = :color,
        posicion = :posicion,
        estado = :estado,
        updated_at = :updated_at,
        updated_by = :updated_by
    WHERE id_etiqueta_categoria = CAST(:id_etiqueta_categoria AS uuid)
      AND id_empresa = CAST(:id_empresa AS uuid)
    """
)

UPDATE_ESTADO_SQL = text(
    """
    UPDATE public.item_etiqueta_categoria SET
        estado = :estado,
        updated_at = :updated_at,
        updated_by = :updated_by
    WHERE id_etiqueta_categoria = CAST(:id_etiqueta_categoria AS uuid)
      AND id_empresa = CAST(:id_empresa AS uuid)
    """
)

INSERT_SQL = text(
    """
    INSERT INTO public.item_etiqueta_categoria (
        id_etiqueta_categoria,
        id_empresa,
        ref,
        nombre,
        descripcion,
        color,
        posicion,
        estado,
        created_at,
        updated_at,
        created_by,
        updated_by
    ) VALUES (
        CAST(:id_etiqueta_categoria AS uuid),
        CAST(:id_empresa AS uuid),
        :ref,
        :nombre,
        :descripcion,
        :color,
        :posicion,
        :estado,
        :created_at,
        :updated_at,
        :created_by,
        :updated_by
    )
    """
)


def list_etiquetas_categoria_by_empresa(id_empresa: str) -> List[Dict[str, Any]]:
    try:
        rows = db.session.execute(LIST_SQL, {"id_empresa": id_empresa}).mappings().all()
        out: List[Dict[str, Any]] = []
        for r in rows:
            d = dict(r)
            if d.get("estado") is not None:
                d["estado"] = bool(d["estado"])
            out.append(d)
        return out
    except SQLAlchemyError:
        raise


def insert_etiqueta_categoria(row: Dict[str, Any]) -> str:
    eid = str(row.get("id_etiqueta_categoria") or uuid.uuid4())
    now = row.get("created_at") or datetime.now(timezone.utc)
    params = {
        "id_etiqueta_categoria": eid,
        "id_empresa": row["id_empresa"],
        "ref": row["ref"],
        "nombre": row.get("nombre"),
        "descripcion": row.get("descripcion"),
        "color": row.get("color"),
        "posicion": row.get("posicion") if row.get("posicion") is not None else 1,
        "estado": row.get("estado") if row.get("estado") is not None else True,
        "created_at": now,
        "updated_at": now,
        "created_by": row.get("created_by"),
        "updated_by": row.get("updated_by"),
    }
    try:
        db.session.execute(INSERT_SQL, params)
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise
    return eid


def update_etiqueta_categoria(row: Dict[str, Any]) -> int:
    """Actualiza por id_etiqueta_categoria + id_empresa. No toca created_at ni created_by."""
    now = row.get("updated_at") or datetime.now(timezone.utc)
    params = {
        "id_etiqueta_categoria": row["id_etiqueta_categoria"],
        "id_empresa": row["id_empresa"],
        "ref": row["ref"],
        "nombre": row.get("nombre"),
        "descripcion": row.get("descripcion"),
        "color": row.get("color"),
        "posicion": row.get("posicion") if row.get("posicion") is not None else 0,
        "estado": row.get("estado") if row.get("estado") is not None else True,
        "updated_at": now,
        "updated_by": row.get("updated_by"),
    }
    try:
        result = db.session.execute(UPDATE_SQL, params)
        db.session.commit()
        return int(result.rowcount or 0)
    except Exception:
        db.session.rollback()
        raise


def update_etiqueta_categoria_estado(row: Dict[str, Any]) -> int:
    """Solo estado, updated_at y updated_by. No toca ref, nombre, descripcion, color, posicion ni auditoría de alta."""
    now = row.get("updated_at") or datetime.now(timezone.utc)
    params = {
        "id_etiqueta_categoria": row["id_etiqueta_categoria"],
        "id_empresa": row["id_empresa"],
        "estado": row.get("estado") if row.get("estado") is not None else True,
        "updated_at": now,
        "updated_by": row.get("updated_by"),
    }
    try:
        result = db.session.execute(UPDATE_ESTADO_SQL, params)
        db.session.commit()
        return int(result.rowcount or 0)
    except Exception:
        db.session.rollback()
        raise

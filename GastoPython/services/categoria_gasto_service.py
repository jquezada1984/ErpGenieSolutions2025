from typing import Any, Dict, Optional

from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from utils.db import db
from schemas.categoria_gasto_schema import (
    CategoriaGastoCreateSchema,
    CategoriaGastoUpdateSchema,
    CategoriaGastoOutSchema,
)
from repositories import categoria_gasto_repository as repo


out_schema = CategoriaGastoOutSchema()


def crear_categoria(
    data: Dict[str, Any],
    id_empresa: str,
) -> Dict[str, Any]:
    payload = CategoriaGastoCreateSchema().load(data or {})
    try:
        cat = repo.create_categoria(payload, id_empresa=id_empresa, commit=True)
        return out_schema.dump(cat)
    except IntegrityError:
        db.session.rollback()
        raise


def actualizar_categoria(
    id_categoria_gasto: str,
    data: Dict[str, Any],
    id_empresa: str,
) -> Optional[Dict[str, Any]]:
    cat = repo.get_by_id_empresa(id_categoria_gasto, id_empresa)
    if not cat:
        return None
    payload = CategoriaGastoUpdateSchema().load(data or {})
    if not payload:
        raise ValidationError({'': ['No hay campos para actualizar']})
    try:
        cat = repo.update_categoria(cat, payload, commit=True)
        return out_schema.dump(cat)
    except IntegrityError:
        db.session.rollback()
        raise


def toggle_estado_categoria(
    id_categoria_gasto: str,
    id_empresa: str,
) -> Optional[Dict[str, Any]]:
    cat = repo.get_by_id_empresa(id_categoria_gasto, id_empresa)
    if not cat:
        return None
    cat = repo.toggle_estado(cat, commit=True)
    return out_schema.dump(cat)

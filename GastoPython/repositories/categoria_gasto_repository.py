from typing import Any, Dict, Optional

from utils.db import db
from models.categoria_gasto import CategoriaGasto


def get_by_id_empresa(
    id_categoria_gasto: str,
    id_empresa: str,
) -> Optional[CategoriaGasto]:
    return CategoriaGasto.query.filter_by(
        id_categoria_gasto=str(id_categoria_gasto),
        id_empresa=str(id_empresa),
    ).first()


def create_categoria(
    payload: Dict[str, Any],
    id_empresa: str,
    commit: bool = True,
) -> CategoriaGasto:
    cat = CategoriaGasto(
        id_empresa=str(id_empresa),
        codigo=str(payload['codigo']).strip(),
        nombre=str(payload['nombre']).strip(),
        descripcion=(payload.get('descripcion') or None),
        estado=bool(payload.get('estado', True)),
    )
    if cat.descripcion is not None:
        cat.descripcion = str(cat.descripcion).strip() or None
    db.session.add(cat)
    if commit:
        db.session.commit()
    return cat


def update_categoria(
    cat: CategoriaGasto,
    payload: Dict[str, Any],
    commit: bool = True,
) -> CategoriaGasto:
    if 'codigo' in payload and payload['codigo'] is not None:
        cat.codigo = str(payload['codigo']).strip()
    if 'nombre' in payload and payload['nombre'] is not None:
        cat.nombre = str(payload['nombre']).strip()
    if 'descripcion' in payload:
        desc = payload['descripcion']
        cat.descripcion = (str(desc).strip() if desc is not None else None) or None
    if 'estado' in payload and payload['estado'] is not None:
        cat.estado = bool(payload['estado'])
    if commit:
        db.session.commit()
    return cat


def toggle_estado(cat: CategoriaGasto, commit: bool = True) -> CategoriaGasto:
    cat.estado = not bool(cat.estado)
    if commit:
        db.session.commit()
    return cat

from typing import Any, Dict, List, Optional

from models.socio import Socio
from models.socio_tercero import SocioTercero
from models.tercero import Tercero
from utils.db import db
from repositories.socio_repository import (
    create_socio as repo_create_socio,
    get_socio_by_id as repo_get_socio_by_id,
    list_socios as repo_list_socios,
    update_socio as repo_update_socio,
    soft_delete_socio as repo_soft_delete_socio,
    create_socio_tercero as repo_create_socio_tercero,
    list_socios_terceros as repo_list_socios_terceros,
    list_roles_socio_activos as repo_list_roles_socio_activos,
)


def _socio_to_dict(socio: Socio) -> Dict[str, Any]:
    return {
        "id_socio": socio.id_socio,
        "id_rol_socio": socio.id_rol_socio,
        "fecha_inicio": socio.fecha_inicio.isoformat() if socio.fecha_inicio else None,
        "fecha_fin": socio.fecha_fin.isoformat() if socio.fecha_fin else None,
        "estado": socio.estado,
        "created_by": socio.created_by,
        "updated_by": socio.updated_by,
        "created_at": socio.created_at.isoformat() if socio.created_at else None,
        "updated_at": socio.updated_at.isoformat() if socio.updated_at else None,
    }


def _socio_tercero_to_dict(vinculo: SocioTercero) -> Dict[str, Any]:
    return {
        "id": vinculo.id,
        "id_socio": vinculo.id_socio,
        "id_tercero": vinculo.id_tercero,
    }


def create_socio(
    data: Dict[str, Any],
    user_id: Optional[str],
    id_empresa: Optional[str],
    scope_acceso: str,
) -> Dict[str, Any]:
    _ = scope_acceso
    terceros = data.get("terceros")
    if not isinstance(terceros, list):
        raise ValueError("terceros debe ser un array")
    if len(terceros) == 0:
        raise ValueError("terceros no puede estar vacío")
    if not id_empresa:
        raise ValueError("id_empresa es obligatorio para validar terceros")

    terceros_ids = [str(t).strip() for t in terceros if str(t).strip()]
    if len(terceros_ids) == 0:
        raise ValueError("terceros no puede estar vacío")

    terceros_existentes = Tercero.query.filter(
        Tercero.id_tercero.in_(terceros_ids),
        Tercero.id_empresa == id_empresa,
    ).all()

    ids_existentes = {str(t.id_tercero) for t in terceros_existentes}
    if any(id_tercero not in ids_existentes for id_tercero in terceros_ids):
        raise ValueError("Uno o más terceros no existen o no pertenecen a la empresa")

    payload_socio = {k: v for k, v in data.items() if k != "terceros"}

    try:
        socio = repo_create_socio(payload_socio, user_id, commit=False)
        db.session.flush()

        for id_tercero in terceros_ids:
            repo_create_socio_tercero(id_socio=socio.id_socio, id_tercero=id_tercero, commit=False)

        db.session.commit()
        return _socio_to_dict(socio)
    except Exception:
        db.session.rollback()
        raise


def get_socio_by_id(id_socio: str) -> Optional[Dict[str, Any]]:
    socio = repo_get_socio_by_id(id_socio)
    if not socio:
        return None
    return _socio_to_dict(socio)


def list_socios(solo_activos: bool = False) -> List[Dict[str, Any]]:
    socios = repo_list_socios(solo_activos=solo_activos)
    return [_socio_to_dict(socio) for socio in socios]


def update_socio(id_socio: str, data: Dict[str, Any], user_id: Optional[str]) -> Optional[Dict[str, Any]]:
    socio = repo_update_socio(id_socio, data, user_id)
    if not socio:
        return None
    return _socio_to_dict(socio)


def soft_delete_socio(id_socio: str, user_id: Optional[str]) -> bool:
    return repo_soft_delete_socio(id_socio, user_id)


def toggle_estado_socio(id_socio: str, user_id: Optional[str]) -> Optional[Dict[str, Any]]:
    socio = repo_get_socio_by_id(id_socio)
    if not socio:
        return None

    payload = {"estado": not bool(socio.estado)}
    actualizado = repo_update_socio(id_socio, payload, user_id)
    if not actualizado:
        return None
    return _socio_to_dict(actualizado)


def create_socio_tercero(data: Dict[str, Any]) -> Dict[str, Any]:
    id_socio = data.get("id_socio")
    id_tercero = data.get("id_tercero")
    if not id_socio:
        raise ValueError("id_socio es obligatorio")
    if not id_tercero:
        raise ValueError("id_tercero es obligatorio")
    vinculo = repo_create_socio_tercero(id_socio=id_socio, id_tercero=id_tercero)
    return _socio_tercero_to_dict(vinculo)


def list_socios_terceros(id_socio: str) -> List[Dict[str, Any]]:
    vinculos = repo_list_socios_terceros(id_socio)
    return [_socio_tercero_to_dict(vinculo) for vinculo in vinculos]


def list_roles_socio_activos() -> List[Dict[str, str]]:
    roles = repo_list_roles_socio_activos()
    return [
        {
            "id_rol_socio": rol.id_rol_socio,
            "nombre": rol.nombre,
        }
        for rol in roles
    ]

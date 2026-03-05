from typing import Any, Dict, List, Optional

from repositories.contacto_repository import (
    create_contacto as repo_create_contacto,
    get_contactos_by_tercero as repo_get_contactos_by_tercero,
    get_contacto_by_id as repo_get_contacto_by_id,
    update_contacto as repo_update_contacto,
    toggle_estado_contacto as repo_toggle_estado,
)
from models.contacto import Contacto


def _contacto_to_dict(c: Contacto) -> Dict[str, Any]:
    return {
        "id_contacto": c.id_contacto,
        "id_tercero": c.id_tercero,
        "apellidos_etiqueta": c.apellidos_etiqueta,
        "nombre": c.nombre,
        "titulo_cortesia": c.titulo_cortesia,
        "puesto_trabajo": c.puesto_trabajo,
        "direccion": c.direccion,
        "codigo_postal": c.codigo_postal,
        "poblacion": c.poblacion,
        "id_pais": c.id_pais,
        "id_provincia": c.id_provincia,
        "telefono_trabajo": c.telefono_trabajo,
        "telefono_particular": c.telefono_particular,
        "movil": c.movil,
        "fax": c.fax,
        "correo": c.correo,
        "visibilidad": c.visibilidad,
        "fecha_nacimiento": c.fecha_nacimiento.isoformat() if c.fecha_nacimiento else None,
        "alerta_cumpleanos": c.alerta_cumpleanos,
        "estado": c.estado,
        "created_at": c.created_at.isoformat() if c.created_at else None,
        "updated_at": c.updated_at.isoformat() if c.updated_at else None,
    }


def create_contacto(data: Dict[str, Any]) -> Dict[str, Any]:
    id_tercero = data.get("id_tercero")
    if not id_tercero:
        raise ValueError("id_tercero es obligatorio")
    contacto = repo_create_contacto(data, id_tercero)
    return _contacto_to_dict(contacto)


def get_contactos_by_tercero(id_tercero: str, solo_activos: bool = True) -> List[Dict[str, Any]]:
    contactos = repo_get_contactos_by_tercero(id_tercero, solo_activos=solo_activos)
    return [_contacto_to_dict(c) for c in contactos]


def get_contacto_by_id(id_contacto: str) -> Optional[Dict[str, Any]]:
    contacto = repo_get_contacto_by_id(id_contacto)
    if not contacto:
        return None
    return _contacto_to_dict(contacto)


def update_contacto(id_contacto: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    contacto = repo_update_contacto(id_contacto, data)
    if not contacto:
        return None
    return _contacto_to_dict(contacto)


def toggle_estado(id_contacto: str) -> Optional[Dict[str, Any]]:
    contacto = repo_toggle_estado(id_contacto)
    if not contacto:
        return None
    return _contacto_to_dict(contacto)

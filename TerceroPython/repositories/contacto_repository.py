from typing import Optional, Dict, Any, List
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from utils.db import db
from models.contacto import Contacto


def _parse_date(value):
    if value is None:
        return None
    if hasattr(value, 'year'):
        return value
    if isinstance(value, str):
        try:
            return datetime.strptime(value[:10], '%Y-%m-%d').date()
        except (ValueError, TypeError):
            return None
    return None


def create_contacto(payload: Dict[str, Any], id_tercero: str) -> Contacto:
    contacto = Contacto(
        id_tercero=id_tercero,
        apellidos_etiqueta=payload.get("apellidos_etiqueta"),
        nombre=payload.get("nombre"),
        titulo_cortesia=payload.get("titulo_cortesia"),
        puesto_trabajo=payload.get("puesto_trabajo"),
        direccion=payload.get("direccion"),
        codigo_postal=payload.get("codigo_postal"),
        poblacion=payload.get("poblacion"),
        id_pais=payload.get("id_pais"),
        id_provincia=payload.get("id_provincia"),
        telefono_trabajo=payload.get("telefono_trabajo"),
        telefono_particular=payload.get("telefono_particular"),
        movil=payload.get("movil"),
        fax=payload.get("fax"),
        correo=payload.get("correo"),
        visibilidad=payload.get("visibilidad"),
        fecha_nacimiento=_parse_date(payload.get("fecha_nacimiento")),
        alerta_cumpleanos=bool(payload.get("alerta_cumpleanos", False)),
        estado=bool(payload.get("estado", True)),
    )
    db.session.add(contacto)
    try:
        print('[CONTACTO] Repository: antes de db.session.commit()', {'id_tercero': id_tercero})
        db.session.commit()
        print('[CONTACTO] Repository: después de db.session.commit()', {'id_contacto': contacto.id_contacto})
    except IntegrityError as e:
        db.session.rollback()
        print('[CONTACTO] Repository: IntegrityError, rollback', str(e))
        raise
    return contacto


def get_contactos_by_tercero(id_tercero: str, solo_activos: bool = True) -> List[Contacto]:
    q = Contacto.query.filter_by(id_tercero=id_tercero)
    if solo_activos:
        q = q.filter_by(estado=True)
    return q.order_by(Contacto.created_at.desc()).all()


def get_contacto_by_id(id_contacto: str) -> Optional[Contacto]:
    return Contacto.query.filter_by(id_contacto=id_contacto).first()


def update_contacto(id_contacto: str, payload: Dict[str, Any]) -> Optional[Contacto]:
    contacto = get_contacto_by_id(id_contacto)
    if not contacto:
        return None
    updatable = {
        "apellidos_etiqueta", "nombre", "titulo_cortesia", "puesto_trabajo",
        "direccion", "codigo_postal", "poblacion", "id_pais", "id_provincia",
        "telefono_trabajo", "telefono_particular", "movil", "fax", "correo",
        "visibilidad", "fecha_nacimiento", "alerta_cumpleanos", "estado",
    }
    for k, v in payload.items():
        if k in updatable:
            if k == "fecha_nacimiento":
                v = _parse_date(v)
            elif isinstance(v, str):
                v = v.strip()
            setattr(contacto, k, v)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise
    return contacto


def toggle_estado_contacto(id_contacto: str) -> Optional[Contacto]:
    contacto = get_contacto_by_id(id_contacto)
    if not contacto:
        return None
    contacto.estado = not contacto.estado
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise
    return contacto

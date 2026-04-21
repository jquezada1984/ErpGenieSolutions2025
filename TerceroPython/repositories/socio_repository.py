from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy.exc import IntegrityError

from utils.db import db
from models.socio import Socio
from models.socio_tercero import SocioTercero
from models.rol_socio import RolSocio


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


def create_socio(payload: Dict[str, Any], user_id: Optional[str], commit: bool = True) -> Socio:
    socio = Socio(
        id_rol_socio=payload.get("id_rol_socio"),
        fecha_inicio=_parse_date(payload.get("fecha_inicio")),
        fecha_fin=_parse_date(payload.get("fecha_fin")),
        estado=bool(payload.get("estado", True)),
        created_by=user_id,
        updated_by=user_id,
    )
    db.session.add(socio)
    if commit:
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            raise
    return socio


def get_socio_by_id(id_socio: str) -> Optional[Socio]:
    return Socio.query.filter_by(id_socio=id_socio).first()


def list_socios(solo_activos: bool = False) -> List[Socio]:
    q = Socio.query
    if solo_activos:
        q = q.filter_by(estado=True)
    return q.order_by(Socio.created_at.desc()).all()


def update_socio(id_socio: str, payload: Dict[str, Any], user_id: Optional[str]) -> Optional[Socio]:
    socio = get_socio_by_id(id_socio)
    if not socio:
        return None

    updatable = {"id_rol_socio", "fecha_inicio", "fecha_fin", "estado"}
    for key, value in payload.items():
        if key in updatable:
            if key in {"fecha_inicio", "fecha_fin"}:
                value = _parse_date(value)
            elif isinstance(value, str):
                value = value.strip()
            setattr(socio, key, value)

    socio.updated_by = user_id
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise
    return socio


def soft_delete_socio(id_socio: str, user_id: Optional[str]) -> bool:
    socio = get_socio_by_id(id_socio)
    if not socio:
        return False
    socio.estado = False
    socio.updated_by = user_id
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise
    return True


def create_socio_tercero(id_socio: str, id_tercero: str, commit: bool = True) -> SocioTercero:
    vinculo = SocioTercero(
        id_socio=id_socio,
        id_tercero=id_tercero,
    )
    db.session.add(vinculo)
    if commit:
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            raise
    return vinculo


def list_socios_terceros(id_socio: str) -> List[SocioTercero]:
    return SocioTercero.query.filter_by(id_socio=id_socio).all()


def list_roles_socio_activos() -> List[RolSocio]:
    return (
        RolSocio.query
        .filter_by(estado=True)
        .order_by(RolSocio.nombre.asc())
        .all()
    )

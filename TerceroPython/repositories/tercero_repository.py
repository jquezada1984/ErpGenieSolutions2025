from typing import Optional, Dict, Any
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from utils.db import db
from models.tercero import Tercero
from models.media import Media

def create_tercero(payload: Dict[str, Any], id_empresa: str, user_id: Optional[str]) -> Tercero:
    tercero = Tercero(
        id_empresa=id_empresa,
        # roles
        cliente_potencial=bool(payload.get("cliente_potencial", False)),
        cliente=bool(payload.get("cliente", False)),
        proveedor=bool(payload.get("proveedor", False)),
        # general
        nombre=(payload.get("nombre") or "").strip(),
        apodo=payload.get("apodo"),
        codigo_cliente=payload.get("codigo_cliente"),
        estado=bool(payload.get("estado", True)),
        sujeto_iva=bool(payload.get("sujeto_iva", True)),
        id_tipo_tercero=payload.get("id_tipo_tercero"),
        id_tipo_entidad=payload.get("id_tipo_entidad"),
        # ubicación/contacto
        direccion=payload.get("direccion"),
        poblacion=payload.get("poblacion"),
        codigo_postal=payload.get("codigo_postal"),
        id_pais=payload.get("id_pais"),
        id_provincia=payload.get("id_provincia"),
        telefono=payload.get("telefono"),
        movil=payload.get("movil"),
        fax=payload.get("fax"),
        web=payload.get("web"),
        correo=payload.get("correo"),
        logo=payload.get("logo"),
        # comercial/org
        id_condicion_pago=payload.get("id_condicion_pago"),
        id_forma_pago=payload.get("id_forma_pago"),
        capital=payload.get("capital"),
        id_profesional_1=payload.get("id_profesional_1"),
        id_profesional_2=payload.get("id_profesional_2"),
        cif_intra=payload.get("cif_intra"),
        sede_central=payload.get("sede_central"),
        asignado_a=payload.get("asignado_a"),
        # auditoría
        creado_por=user_id,
        modificado_por=user_id,
    )
    db.session.add(tercero)
    db.session.flush()
    if payload.get("logo"):
        media = Media(
            module="tercero",
            module_id=tercero.id_tercero,
            url=payload.get("logo"),
            updated_at=None
        )
        db.session.add(media)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise
    return tercero

def update_tercero(
    id_tercero: str,
    id_empresa: str,
    payload: Dict[str, Any],
    user_id: Optional[str],
    scope_acceso: str = "EMPRESA",
) -> Optional[Tercero]:
    if scope_acceso == "GLOBAL":
        tercero = Tercero.query.filter_by(id_tercero=id_tercero).first()
    else:
        tercero = Tercero.query.filter_by(id_tercero=id_tercero, id_empresa=id_empresa).first()
    if not tercero:
        return None
    updatable = {
        "cliente_potencial","cliente","proveedor",
        "nombre","apodo","codigo_cliente","estado","sujeto_iva",
        "id_tipo_tercero","id_tipo_entidad",
        "direccion","poblacion","codigo_postal","id_pais","provincia","id_provincia",
        "telefono","movil","fax","web","correo","logo",
        "id_condicion_pago","id_forma_pago","capital",
        "id_profesional_1","id_profesional_2","cif_intra",
        "sede_central","asignado_a",
    }
    for k,v in payload.items():
        if k in updatable:
            if isinstance(v,str): v=v.strip()
            setattr(tercero,k,v)
    tercero.modificado_por = user_id

    if "logo" in payload:
        existing_media = Media.query.filter_by(
            module="tercero",
            module_id=tercero.id_tercero
        ).first()
        if existing_media:
            existing_media.url = payload.get("logo")
            existing_media.updated_at = datetime.utcnow()
        else:
            new_media = Media(
                module="tercero",
                module_id=tercero.id_tercero,
                url=payload.get("logo")
            )
            db.session.add(new_media)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise
    return tercero

def soft_delete_tercero(
    id_tercero: str,
    id_empresa: str,
    user_id: Optional[str],
    scope_acceso: str = "EMPRESA",
) -> bool:
    if scope_acceso == "GLOBAL":
        tercero = Tercero.query.filter_by(id_tercero=id_tercero).first()
    else:
        tercero = Tercero.query.filter_by(id_tercero=id_tercero, id_empresa=id_empresa).first()
    if not tercero:
        return False
    tercero.estado = False
    tercero.modificado_por = user_id
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise
    return True

def exists_codigo_cliente(id_empresa: str, codigo_cliente: str, exclude_id: Optional[str] = None) -> bool:
    if not codigo_cliente:
        return False
    q = Tercero.query.filter(
        Tercero.id_empresa == id_empresa,
        db.func.lower(Tercero.codigo_cliente) == codigo_cliente.lower()
    )
    if exclude_id:
        q = q.filter(Tercero.id_tercero != exclude_id)
    return db.session.query(q.exists()).scalar()

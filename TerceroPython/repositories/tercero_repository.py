from typing import Optional, Dict, Any
import os
import requests
from sqlalchemy.exc import IntegrityError
from utils.db import db
from models.tercero import Tercero

def get_or_create_directorio(nombre, empresa_id):
    try:
        base_url = os.environ.get("MEDIA_SERVICE_BASE_URL", "http://erp-media-service:3010")

        headers = {
            "Content-Type": "application/json",
            "X-Company-Id": str(empresa_id)
        }

        # 1. Buscar directorios existentes
        response = requests.get(
            f"{base_url}/directorio?module=tercero",
            headers=headers,
            timeout=10
        )

        if response.status_code == 200:
            data = response.json()

            directorios = data.get("data") if isinstance(data, dict) else data

            for d in directorios:
                if d.get("nombre") == nombre:
                    return d.get("id_directorio_documento")

        # 2. Si no existe, crearlo
        create_resp = requests.post(
            f"{base_url}/directorio",
            json={
                "nombre": nombre,
                "modulo": "tercero",
                "tipo_directorio": "OBJETO",
            },
            headers=headers,
            timeout=10
        )

        if create_resp.status_code in (200, 201):
            data = create_resp.json()
            return data.get("id_directorio_documento")

    except Exception as e:
        print("ERROR get_or_create_directorio:", str(e))

    return None

def create_tercero(payload: Dict[str, Any], id_empresa: str, user_id: Optional[str]) -> Tercero:
    print("🔥 PAYLOAD RAW:", payload)
    print("ENTRO AL CREATE REAL")
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
        codigo_proveedor=payload.get("codigo_proveedor"),
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
        # comercial/org
        id_condicion_pago=payload.get("id_condicion_pago"),
        id_forma_pago=payload.get("id_forma_pago"),
        id_tamano_empresa=payload.get("id_tamano_empresa"),
        capital=payload.get("capital"),
        id_profesional_1=payload.get("id_profesional_1"),
        id_profesional_2=payload.get("id_profesional_2"),
        cif_intra=payload.get("cif_intra"),
        sede_central=payload.get("sede_central"),
        asignado_a=payload.get("asignado_a"),
        # auditoría
        created_by=user_id,
        updated_by=user_id,
    )
    db.session.add(tercero)
    db.session.flush()
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise

    print("PAYLOAD COMPLETO:", payload)
    print("TIPO DE PAYLOAD:", type(payload))
    print("CLAVES DEL PAYLOAD:", payload.keys())
    logo_url = payload.get("logo")
    directorio_id = get_or_create_directorio("logo_tercero", str(tercero.id_empresa))
    print("LOGO EXTRAIDO:", logo_url)
    print("ENTRA AL IF?", bool(logo_url))
    if logo_url:

        try:
            print("🚀 LLAMANDO A MEDIA SERVICE CON:", {
                "module": "tercero",
                "module_id": str(tercero.id_tercero),
                "url": logo_url,
            })
            response = requests.post(
                "http://erp-media-service:3010/media/metadata",
                json={
                    "module": "tercero",
                    "module_id": str(tercero.id_tercero),
                    "url": logo_url,
                    "filename": None,
                    "mimetype": None,
                    "size": None,
                    "tipo": "imagen",
                    "es_principal": True,
                    "estado_archivo": "ACTIVO",
                    "id_directorio_documento": directorio_id,
                    "id_empresa": str(tercero.id_empresa) if tercero.id_empresa else None,
                },
                timeout=5,
            )
            print("MEDIA STATUS:", response.status_code)
            print("MEDIA RESPONSE:", response.text)

        except Exception as e:
            print("ERROR MEDIA:", str(e))

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
        "nombre","apodo","codigo_cliente","codigo_proveedor","estado","sujeto_iva",
        "id_tipo_tercero","id_tipo_entidad",
        "direccion","poblacion","codigo_postal","id_pais","provincia","id_provincia",
        "telefono","movil","fax","web","correo",
        "id_condicion_pago","id_forma_pago","id_tamano_empresa","capital",
        "id_profesional_1","id_profesional_2","cif_intra",
        "sede_central","asignado_a",
    }
    for k,v in payload.items():
        if k in updatable:
            if isinstance(v,str): v=v.strip()
            setattr(tercero,k,v)
    tercero.updated_by = user_id

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise

    print("PAYLOAD COMPLETO:", payload)
    logo_url = payload.get("logo")
    directorio_id = get_or_create_directorio("logo_tercero", str(tercero.id_empresa))
    print("LOGO URL:", logo_url)
    if logo_url:
        try:
            response = requests.post(
                "http://erp-media-service:3010/media/metadata",
                json={
                    "module": "tercero",
                    "module_id": str(tercero.id_tercero),
                    "url": logo_url,
                    "filename": None,
                    "mimetype": None,
                    "size": None,
                    "tipo": "imagen",
                    "es_principal": True,
                    "estado_archivo": "ACTIVO",
                    "id_directorio_documento": directorio_id,
                    "id_empresa": str(tercero.id_empresa) if tercero.id_empresa else None,
                },
                timeout=5,
            )
            print("MEDIA STATUS:", response.status_code)
            print("MEDIA RESPONSE:", response.text)
        except Exception as e:
            print("ERROR MEDIA:", str(e))

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
    tercero.updated_by = user_id
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


def exists_codigo_proveedor(id_empresa: str, codigo_proveedor: str, exclude_id: Optional[str] = None) -> bool:
    if not codigo_proveedor:
        return False
    q = Tercero.query.filter(
        Tercero.id_empresa == id_empresa,
        db.func.lower(Tercero.codigo_proveedor) == codigo_proveedor.lower()
    )
    if exclude_id:
        q = q.filter(Tercero.id_tercero != exclude_id)
    return db.session.query(q.exists()).scalar()

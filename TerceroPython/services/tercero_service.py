from typing import Any, Dict, Optional
from datetime import datetime
from uuid import UUID
from marshmallow import ValidationError

from schemas.tercero_schema import (
    TerceroCreateSchema, TerceroUpdateSchema, TerceroOutSchema
)
from repositories.tercero_repository import (
    create_tercero, update_tercero as repo_update_tercero,
    soft_delete_tercero as repo_soft_delete_tercero,
    exists_codigo_cliente,
    exists_codigo_proveedor,
)

def _safe_uuid(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    try:
        UUID(str(value)); return str(value)
    except Exception:
        return str(value)

def _gen_codigo_cliente(id_empresa: str, when: Optional[datetime]=None) -> str:
    dt = when or datetime.utcnow()
    yymm = dt.strftime("%y%m")
    # búsqueda simple no concurrente
    for n in range(1, 100000):
        candidate = f"CU{yymm}-{n:05d}"
        if not exists_codigo_cliente(id_empresa, candidate):
            return candidate
    return f"CU{yymm}-99999"


def _gen_codigo_proveedor(id_empresa: str, when: Optional[datetime]=None) -> str:
    dt = when or datetime.utcnow()
    yymm = dt.strftime("%y%m")
    for n in range(1, 100000):
        candidate = f"SU{yymm}-{n:05d}"
        if not exists_codigo_proveedor(id_empresa, candidate):
            return candidate
    return f"SU{yymm}-99999"


def servicio_crear_tercero(payload: Dict[str, Any], id_empresa: str, user_id: Optional[str]) -> Dict[str, Any]:
    data = TerceroCreateSchema().load(payload)

    # normalizaciones UUID
    for k in ("id_pais","id_tipo_tercero","id_condicion_pago","id_forma_pago","id_tamano_empresa","sede_central","asignado_a"):
        data[k] = _safe_uuid(data.get(k))

    # autogenerar código si viene vacío
    if not data.get("codigo_cliente"):
        data["codigo_cliente"] = _gen_codigo_cliente(id_empresa)

    # unicidad
    if exists_codigo_cliente(id_empresa, data["codigo_cliente"]):
        raise ValidationError({"codigo_cliente":["Ya existe para esta empresa."]})

    # autogenerar código proveedor si es proveedor y viene vacío
    if data.get("proveedor") and not data.get("codigo_proveedor"):
        data["codigo_proveedor"] = _gen_codigo_proveedor(id_empresa)
    if data.get("codigo_proveedor") and exists_codigo_proveedor(id_empresa, data["codigo_proveedor"]):
        raise ValidationError({"codigo_proveedor":["Ya existe para esta empresa."]})

    tercero = create_tercero(data, id_empresa=id_empresa, user_id=user_id)
    return TerceroOutSchema().dump(tercero)

def servicio_actualizar_tercero(
    id_tercero: str,
    id_empresa: str,
    payload: Dict[str, Any],
    user_id: Optional[str],
    scope_acceso: str = "EMPRESA",
) -> Optional[Dict[str, Any]]:
    data = TerceroUpdateSchema().load(payload)
    for k in ("id_pais","id_tipo_tercero","id_condicion_pago","id_forma_pago","id_tamano_empresa","sede_central","asignado_a"):
        if k in data:
            data[k] = _safe_uuid(data.get(k))
    if "codigo_cliente" in data and data["codigo_cliente"]:
        if exists_codigo_cliente(id_empresa, data["codigo_cliente"], exclude_id=id_tercero):
            raise ValidationError({"codigo_cliente":["Ya existe para esta empresa."]})
    if "codigo_proveedor" in data and data["codigo_proveedor"]:
        if exists_codigo_proveedor(id_empresa, data["codigo_proveedor"], exclude_id=id_tercero):
            raise ValidationError({"codigo_proveedor":["Ya existe para esta empresa."]})
    tercero = repo_update_tercero(id_tercero, id_empresa, data, user_id, scope_acceso=scope_acceso)
    if not tercero:
        return None
    return TerceroOutSchema().dump(tercero)

def servicio_eliminar_tercero(
    id_tercero: str,
    id_empresa: str,
    user_id: Optional[str],
    scope_acceso: str = "EMPRESA",
) -> bool:
    return repo_soft_delete_tercero(id_tercero, id_empresa, user_id, scope_acceso=scope_acceso)

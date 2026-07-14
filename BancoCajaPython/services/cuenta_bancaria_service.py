from typing import Any, Dict, Optional
from uuid import UUID

from marshmallow import ValidationError

from schemas.cuenta_bancaria_schema import (
    CuentaBancariaCreateSchema,
    CuentaBancariaUpdateSchema,
    CuentaBancariaOutSchema,
)
from repositories.cuenta_bancaria_repository import (
    create_cuenta_bancaria,
    update_cuenta_bancaria,
    delete_cuenta_bancaria,
)


def _safe_uuid(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    try:
        UUID(str(value))
        return str(value)
    except Exception:
        return str(value)


def servicio_crear_cuenta(
    payload: Dict[str, Any],
    id_empresa: str,
    user_id: Optional[str],
) -> Dict[str, Any]:
    data = CuentaBancariaCreateSchema().load(payload)
    for k in ('id_banco', 'id_moneda', 'id_cuenta_contable', 'id_tercero', 'id_pais', 'id_provincia'):
        if k in data and data[k] is not None:
            data[k] = _safe_uuid(data[k])
    try:
        cuenta = create_cuenta_bancaria(data, id_empresa=id_empresa, user_id=user_id)
    except ValueError as e:
        raise ValidationError({'id_banco': [str(e)]})
    return CuentaBancariaOutSchema().dump(cuenta)


def servicio_actualizar_cuenta(
    id_cuenta: str,
    id_empresa: str,
    payload: Dict[str, Any],
    user_id: Optional[str],
    scope_acceso: str = 'EMPRESA',
) -> Optional[Dict[str, Any]]:
    data = CuentaBancariaUpdateSchema().load(payload, partial=True)
    for k in ('id_banco', 'id_moneda', 'id_cuenta_contable', 'id_tercero', 'id_pais', 'id_provincia'):
        if k in data and data[k] is not None:
            data[k] = _safe_uuid(data[k])
    cuenta = update_cuenta_bancaria(
        id_cuenta, id_empresa, data, user_id, scope_acceso=scope_acceso,
    )
    if not cuenta:
        return None
    return CuentaBancariaOutSchema().dump(cuenta)


def servicio_eliminar_cuenta(
    id_cuenta: str,
    id_empresa: str,
    user_id: Optional[str],
    scope_acceso: str = 'EMPRESA',
) -> bool:
    return delete_cuenta_bancaria(
        id_cuenta, id_empresa, user_id, scope_acceso=scope_acceso,
    )

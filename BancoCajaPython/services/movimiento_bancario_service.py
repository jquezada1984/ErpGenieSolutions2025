from typing import Any, Dict, Optional
from uuid import UUID

from marshmallow import ValidationError

from schemas.movimiento_bancario_schema import (
    MovimientoBancarioCreateSchema,
    MovimientoBancarioUpdateSchema,
    MovimientoBancarioOutSchema,
)
from repositories.movimiento_bancario_repository import (
    create_movimiento_bancario,
    update_movimiento_bancario,
    delete_movimiento_bancario,
)


def _safe_uuid(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    try:
        UUID(str(value))
        return str(value)
    except Exception:
        return str(value)


def servicio_crear_movimiento(
    payload: Dict[str, Any],
    id_empresa: str,
    user_id: Optional[str],
    scope_acceso: str = 'EMPRESA',
) -> Dict[str, Any]:
    data = MovimientoBancarioCreateSchema().load(payload)
    if 'id_tercero' in data and data['id_tercero'] is not None:
        data['id_tercero'] = _safe_uuid(data['id_tercero'])
    try:
        mov = create_movimiento_bancario(
            data, id_empresa=id_empresa, user_id=user_id, scope_acceso=scope_acceso,
        )
    except ValueError as e:
        raise ValidationError({'id_cuenta_bancaria': [str(e)]})
    return MovimientoBancarioOutSchema().dump(mov)


def servicio_actualizar_movimiento(
    id_movimiento: str,
    id_empresa: str,
    payload: Dict[str, Any],
    user_id: Optional[str],
    scope_acceso: str = 'EMPRESA',
) -> Optional[Dict[str, Any]]:
    data = MovimientoBancarioUpdateSchema().load(payload, partial=True)
    if 'id_tercero' in data and data['id_tercero'] is not None:
        data['id_tercero'] = _safe_uuid(data['id_tercero'])
    mov = update_movimiento_bancario(
        id_movimiento, id_empresa, data, user_id, scope_acceso=scope_acceso,
    )
    if not mov:
        return None
    return MovimientoBancarioOutSchema().dump(mov)


def servicio_eliminar_movimiento(
    id_movimiento: str,
    id_empresa: str,
    user_id: Optional[str],
    scope_acceso: str = 'EMPRESA',
) -> bool:
    return delete_movimiento_bancario(
        id_movimiento, id_empresa, user_id, scope_acceso=scope_acceso,
    )

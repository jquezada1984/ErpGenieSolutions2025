from typing import Any, Dict, Optional

from schemas.banco_schema import BancoCreateSchema, BancoUpdateSchema, BancoOutSchema
from repositories.banco_repository import create_banco, update_banco, delete_banco


def servicio_crear_banco(payload: Dict[str, Any], user_id: Optional[str]) -> Dict[str, Any]:
    data = BancoCreateSchema().load(payload)
    banco = create_banco(data, user_id)
    return BancoOutSchema().dump(banco)


def servicio_actualizar_banco(
    id_banco: str,
    payload: Dict[str, Any],
    user_id: Optional[str],
) -> Optional[Dict[str, Any]]:
    data = BancoUpdateSchema().load(payload)
    banco = update_banco(id_banco, data, user_id)
    if not banco:
        return None
    return BancoOutSchema().dump(banco)


def servicio_eliminar_banco(id_banco: str) -> bool:
    return delete_banco(id_banco)

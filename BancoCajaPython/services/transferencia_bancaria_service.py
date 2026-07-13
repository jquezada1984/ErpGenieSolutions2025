from typing import Any, Dict, Optional

from marshmallow import ValidationError

from schemas.transferencia_bancaria_schema import (
    TransferenciaBancariaCreateSchema,
    TransferenciaBancariaOutSchema,
)
from repositories.transferencia_bancaria_repository import (
    create_transferencia_bancaria,
    delete_transferencia_bancaria,
)


def servicio_crear_transferencia(
    payload: Dict[str, Any],
    id_empresa: str,
    user_id: Optional[str],
    scope_acceso: str = 'EMPRESA',
) -> Dict[str, Any]:
    data = TransferenciaBancariaCreateSchema().load(payload)
    try:
        transf, mov_salida, mov_entrada = create_transferencia_bancaria(
            data, id_empresa=id_empresa, user_id=user_id, scope_acceso=scope_acceso,
        )
    except ValueError as e:
        raise ValidationError({'_schema': [str(e)]})
    out = TransferenciaBancariaOutSchema().dump(transf)
    out['id_movimiento_salida'] = mov_salida.id_movimiento_bancario
    out['id_movimiento_entrada'] = mov_entrada.id_movimiento_bancario
    return out


def servicio_eliminar_transferencia(
    id_transferencia: str,
    id_empresa: str,
    user_id: Optional[str],
    scope_acceso: str = 'EMPRESA',
) -> bool:
    try:
        return delete_transferencia_bancaria(
            id_transferencia, id_empresa, user_id, scope_acceso=scope_acceso,
        )
    except ValueError as e:
        raise ValidationError({'_schema': [str(e)]})

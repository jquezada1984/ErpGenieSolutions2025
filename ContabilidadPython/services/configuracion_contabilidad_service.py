from typing import Dict, Any
from schemas.configuracion_contabilidad_schema import (
    ConfiguracionContabilidadUpsertSchema,
    ConfiguracionContabilidadOutSchema,
)
from repositories.configuracion_contabilidad_repository import upsert_por_empresa


def actualizar_configuracion_contabilidad(id_empresa: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    data = ConfiguracionContabilidadUpsertSchema().load(payload or {})
    row = upsert_por_empresa(id_empresa=id_empresa, payload=data)
    return ConfiguracionContabilidadOutSchema().dump(row)

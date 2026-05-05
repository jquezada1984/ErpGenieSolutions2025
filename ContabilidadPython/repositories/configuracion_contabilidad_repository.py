from datetime import datetime
from typing import Dict, Any, Optional
from utils.db import db
from models.configuracion_contabilidad import ConfiguracionContabilidad


UPDATABLE_FIELDS = {
    'id_moneda_base',
    'formato_cuenta',
    'separador_cuenta',
    'longitud_nivel',
    'usar_centavos',
    'metodo_contable',
    'desactivar_transacciones_directas',
    'lista_combinada_subsidiaria',
    'gestion_cero_final',
    'longitud_cuentas_generales',
    'longitud_subcuentas_terceros',
    'periodo_por_defecto',
    'fecha_excluir_antes',
    'etiqueta_operacion_defecto',
    'deshabilitar_transferencia_ventas',
    'deshabilitar_transferencia_compras',
    'deshabilitar_informes_gastos',
    'deshabilitar_activos_fijos',
    'deshabilitar_descuentos',
    'usar_fecha_fin_periodo_informe_gastos',
    'solo_lineas_conciliadas_extracto',
    'numeracion_modelo',
    'mascara_helium',
    'coincidencia_contable',
    'iva_revertido_compras',
    'tab_libro_auxiliar_terceros',
    'prefijo_exportacion',
    'formato_exportacion',
    'formato_archivo',
    'separador_columnas',
    'tipo_retorno_carro',
    'formato_fecha_exportacion',
}


def obtener_por_empresa(id_empresa: str) -> Optional[ConfiguracionContabilidad]:
    return ConfiguracionContabilidad.query.filter_by(id_empresa=id_empresa).first()


def upsert_por_empresa(id_empresa: str, payload: Dict[str, Any]) -> ConfiguracionContabilidad:
    row = obtener_por_empresa(id_empresa)
    if row is None:
        row = ConfiguracionContabilidad(id_empresa=id_empresa)
        db.session.add(row)

    for key, value in payload.items():
        if key in UPDATABLE_FIELDS:
            setattr(row, key, value)

    row.updated_at = datetime.utcnow()
    db.session.commit()
    return row

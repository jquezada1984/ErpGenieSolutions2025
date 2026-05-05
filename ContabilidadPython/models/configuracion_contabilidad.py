import uuid
from sqlalchemy.sql import func
from utils.db import db


class ConfiguracionContabilidad(db.Model):
    __tablename__ = 'configuracion_contabilidad'

    id_configuracion_contabilidad = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    id_empresa = db.Column(db.String(36), nullable=False, unique=True)
    id_moneda_base = db.Column(db.String(36), nullable=True)
    formato_cuenta = db.Column(db.String(20), nullable=True, default='XXXX-XXXX-XXXX')
    separador_cuenta = db.Column(db.String(5), nullable=True, default='-')
    longitud_nivel = db.Column(db.Integer, nullable=True, default=4)
    usar_centavos = db.Column(db.Boolean, nullable=True, default=True)

    metodo_contable = db.Column(db.String(20), nullable=False, default='acumulacion')
    desactivar_transacciones_directas = db.Column(db.Boolean, nullable=False, default=False)
    lista_combinada_subsidiaria = db.Column(db.Boolean, nullable=False, default=False)
    gestion_cero_final = db.Column(db.Boolean, nullable=False, default=False)
    longitud_cuentas_generales = db.Column(db.Integer, nullable=True)
    longitud_subcuentas_terceros = db.Column(db.Integer, nullable=True)
    periodo_por_defecto = db.Column(db.String(20), nullable=False, default='mes_anterior')
    fecha_excluir_antes = db.Column(db.Date, nullable=True)
    etiqueta_operacion_defecto = db.Column(db.String(40), nullable=False, default='tercero_apunte_desc')
    deshabilitar_transferencia_ventas = db.Column(db.Boolean, nullable=False, default=False)
    deshabilitar_transferencia_compras = db.Column(db.Boolean, nullable=False, default=False)
    deshabilitar_informes_gastos = db.Column(db.Boolean, nullable=False, default=False)
    deshabilitar_activos_fijos = db.Column(db.Boolean, nullable=False, default=False)
    deshabilitar_descuentos = db.Column(db.Boolean, nullable=False, default=False)
    usar_fecha_fin_periodo_informe_gastos = db.Column(db.Boolean, nullable=False, default=False)
    solo_lineas_conciliadas_extracto = db.Column(db.Boolean, nullable=False, default=False)
    numeracion_modelo = db.Column(db.String(20), nullable=False, default='neon')
    mascara_helium = db.Column(db.String(255), nullable=True)
    coincidencia_contable = db.Column(db.Boolean, nullable=False, default=False)
    iva_revertido_compras = db.Column(db.Boolean, nullable=False, default=False)
    tab_libro_auxiliar_terceros = db.Column(db.Boolean, nullable=False, default=False)
    prefijo_exportacion = db.Column(db.String(50), nullable=True)
    formato_exportacion = db.Column(db.String(40), nullable=False, default='csv_configurable')
    formato_archivo = db.Column(db.String(10), nullable=False, default='csv')
    separador_columnas = db.Column(db.String(5), nullable=False, default=',')
    tipo_retorno_carro = db.Column(db.String(10), nullable=False, default='unix')
    formato_fecha_exportacion = db.Column(db.String(20), nullable=False, default='%Y-%m-%d')

    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

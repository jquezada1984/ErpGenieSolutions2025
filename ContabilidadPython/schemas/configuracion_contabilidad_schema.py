from marshmallow import Schema, fields, validate, INCLUDE


class ConfiguracionContabilidadUpsertSchema(Schema):
    class Meta:
        unknown = INCLUDE

    id_moneda_base = fields.UUID(allow_none=True)
    formato_cuenta = fields.Str(allow_none=True)
    separador_cuenta = fields.Str(allow_none=True)
    longitud_nivel = fields.Int(allow_none=True)
    usar_centavos = fields.Bool(allow_none=True)

    metodo_contable = fields.Str(
        validate=validate.OneOf(['acumulacion', 'caja']),
        allow_none=True,
    )
    desactivar_transacciones_directas = fields.Bool(allow_none=True)
    lista_combinada_subsidiaria = fields.Bool(allow_none=True)
    gestion_cero_final = fields.Bool(allow_none=True)
    longitud_cuentas_generales = fields.Int(allow_none=True)
    longitud_subcuentas_terceros = fields.Int(allow_none=True)
    periodo_por_defecto = fields.Str(allow_none=True)
    fecha_excluir_antes = fields.Date(allow_none=True)
    etiqueta_operacion_defecto = fields.Str(allow_none=True)
    deshabilitar_transferencia_ventas = fields.Bool(allow_none=True)
    deshabilitar_transferencia_compras = fields.Bool(allow_none=True)
    deshabilitar_informes_gastos = fields.Bool(allow_none=True)
    deshabilitar_activos_fijos = fields.Bool(allow_none=True)
    deshabilitar_descuentos = fields.Bool(allow_none=True)
    usar_fecha_fin_periodo_informe_gastos = fields.Bool(allow_none=True)
    solo_lineas_conciliadas_extracto = fields.Bool(allow_none=True)
    numeracion_modelo = fields.Str(
        validate=validate.OneOf(['neon', 'argon', 'helium']),
        allow_none=True,
    )
    mascara_helium = fields.Str(allow_none=True)
    coincidencia_contable = fields.Bool(allow_none=True)
    iva_revertido_compras = fields.Bool(allow_none=True)
    tab_libro_auxiliar_terceros = fields.Bool(allow_none=True)
    prefijo_exportacion = fields.Str(allow_none=True)
    formato_exportacion = fields.Str(allow_none=True)
    formato_archivo = fields.Str(allow_none=True)
    separador_columnas = fields.Str(allow_none=True)
    tipo_retorno_carro = fields.Str(allow_none=True)
    formato_fecha_exportacion = fields.Str(allow_none=True)


class ConfiguracionContabilidadOutSchema(Schema):
    id_configuracion_contabilidad = fields.Str()
    id_empresa = fields.Str()
    id_moneda_base = fields.Str(allow_none=True)
    formato_cuenta = fields.Str(allow_none=True)
    separador_cuenta = fields.Str(allow_none=True)
    longitud_nivel = fields.Int(allow_none=True)
    usar_centavos = fields.Bool(allow_none=True)
    metodo_contable = fields.Str(allow_none=True)
    desactivar_transacciones_directas = fields.Bool(allow_none=True)
    lista_combinada_subsidiaria = fields.Bool(allow_none=True)
    gestion_cero_final = fields.Bool(allow_none=True)
    longitud_cuentas_generales = fields.Int(allow_none=True)
    longitud_subcuentas_terceros = fields.Int(allow_none=True)
    periodo_por_defecto = fields.Str(allow_none=True)
    fecha_excluir_antes = fields.Date(allow_none=True)
    etiqueta_operacion_defecto = fields.Str(allow_none=True)
    deshabilitar_transferencia_ventas = fields.Bool(allow_none=True)
    deshabilitar_transferencia_compras = fields.Bool(allow_none=True)
    deshabilitar_informes_gastos = fields.Bool(allow_none=True)
    deshabilitar_activos_fijos = fields.Bool(allow_none=True)
    deshabilitar_descuentos = fields.Bool(allow_none=True)
    usar_fecha_fin_periodo_informe_gastos = fields.Bool(allow_none=True)
    solo_lineas_conciliadas_extracto = fields.Bool(allow_none=True)
    numeracion_modelo = fields.Str(allow_none=True)
    mascara_helium = fields.Str(allow_none=True)
    coincidencia_contable = fields.Bool(allow_none=True)
    iva_revertido_compras = fields.Bool(allow_none=True)
    tab_libro_auxiliar_terceros = fields.Bool(allow_none=True)
    prefijo_exportacion = fields.Str(allow_none=True)
    formato_exportacion = fields.Str(allow_none=True)
    formato_archivo = fields.Str(allow_none=True)
    separador_columnas = fields.Str(allow_none=True)
    tipo_retorno_carro = fields.Str(allow_none=True)
    formato_fecha_exportacion = fields.Str(allow_none=True)
    created_at = fields.DateTime(allow_none=True)
    updated_at = fields.DateTime(allow_none=True)

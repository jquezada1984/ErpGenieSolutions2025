BEGIN;

ALTER TABLE public.configuracion_contabilidad
  ADD COLUMN IF NOT EXISTS metodo_contable character varying(20) NOT NULL DEFAULT 'acumulacion',
  ADD COLUMN IF NOT EXISTS desactivar_transacciones_directas boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS lista_combinada_subsidiaria boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS gestion_cero_final boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS longitud_cuentas_generales integer,
  ADD COLUMN IF NOT EXISTS longitud_subcuentas_terceros integer,
  ADD COLUMN IF NOT EXISTS periodo_por_defecto character varying(20) NOT NULL DEFAULT 'mes_anterior',
  ADD COLUMN IF NOT EXISTS fecha_excluir_antes date,
  ADD COLUMN IF NOT EXISTS etiqueta_operacion_defecto character varying(40) NOT NULL DEFAULT 'tercero_apunte_desc',
  ADD COLUMN IF NOT EXISTS deshabilitar_transferencia_ventas boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS deshabilitar_transferencia_compras boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS deshabilitar_informes_gastos boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS deshabilitar_activos_fijos boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS deshabilitar_descuentos boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS usar_fecha_fin_periodo_informe_gastos boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS solo_lineas_conciliadas_extracto boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS numeracion_modelo character varying(20) NOT NULL DEFAULT 'neon',
  ADD COLUMN IF NOT EXISTS mascara_helium character varying(255),
  ADD COLUMN IF NOT EXISTS coincidencia_contable boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS iva_revertido_compras boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS tab_libro_auxiliar_terceros boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS prefijo_exportacion character varying(50),
  ADD COLUMN IF NOT EXISTS formato_exportacion character varying(40) NOT NULL DEFAULT 'csv_configurable',
  ADD COLUMN IF NOT EXISTS formato_archivo character varying(10) NOT NULL DEFAULT 'csv',
  ADD COLUMN IF NOT EXISTS separador_columnas character varying(5) NOT NULL DEFAULT ',',
  ADD COLUMN IF NOT EXISTS tipo_retorno_carro character varying(10) NOT NULL DEFAULT 'unix',
  ADD COLUMN IF NOT EXISTS formato_fecha_exportacion character varying(20) NOT NULL DEFAULT '%Y-%m-%d';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'configuracion_contabilidad_metodo_contable_chk'
  ) THEN
    ALTER TABLE public.configuracion_contabilidad
      ADD CONSTRAINT configuracion_contabilidad_metodo_contable_chk
      CHECK (metodo_contable IN ('acumulacion', 'caja'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'configuracion_contabilidad_numeracion_modelo_chk'
  ) THEN
    ALTER TABLE public.configuracion_contabilidad
      ADD CONSTRAINT configuracion_contabilidad_numeracion_modelo_chk
      CHECK (numeracion_modelo IN ('neon', 'argon', 'helium'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'configuracion_contabilidad_id_empresa_unique'
  ) THEN
    ALTER TABLE public.configuracion_contabilidad
      ADD CONSTRAINT configuracion_contabilidad_id_empresa_unique UNIQUE (id_empresa);
  END IF;
END $$;

COMMIT;

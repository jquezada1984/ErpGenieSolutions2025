-- =====================================================
--=====================================================
-- TABLAS PARA EMPRESA
-- =====================================================
-- Table: public.empresa

-- DROP TABLE IF EXISTS public.empresa;



CREATE TABLE IF NOT EXISTS public.empresa
(
    id_empresa uuid NOT NULL DEFAULT gen_random_uuid(),
    nombre character varying(100) COLLATE pg_catalog."default" NOT NULL,
    ruc character varying(13) COLLATE pg_catalog."default" NOT NULL,
    direccion character varying(255) COLLATE pg_catalog."default",
    telefono character varying(20) COLLATE pg_catalog."default",
    email character varying(128) COLLATE pg_catalog."default",
    estado boolean NOT NULL DEFAULT true,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    id_moneda uuid,
    id_pais uuid,
    codigo_postal character varying(20) COLLATE pg_catalog."default",
    poblacion character varying(100) COLLATE pg_catalog."default",
    movil character varying(20) COLLATE pg_catalog."default",
    fax character varying(20) COLLATE pg_catalog."default",
    web character varying(255) COLLATE pg_catalog."default",
    logo bytea,
    logotipo_cuadrado bytea,
    nota text COLLATE pg_catalog."default",
    sujeto_iva boolean NOT NULL DEFAULT true,
    id_provincia uuid,
    fiscal_year_start_month smallint NOT NULL DEFAULT 1,
    fiscal_year_start_day smallint NOT NULL DEFAULT 1,
    CONSTRAINT empresa_pkey PRIMARY KEY (id_empresa),
    CONSTRAINT empresa_ruc_key UNIQUE (ruc),
    CONSTRAINT empresa_id_moneda_fkey FOREIGN KEY (id_moneda)
        REFERENCES public.moneda (id_moneda) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT empresa_id_pais_fkey FOREIGN KEY (id_pais)
        REFERENCES public.pais (id_pais) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT empresa_id_provincia_fkey FOREIGN KEY (id_provincia)
        REFERENCES public.provincia (id_provincia) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT empresa_fiscal_year_start_day_check CHECK (fiscal_year_start_day >= 1 AND fiscal_year_start_day <= 31),
    CONSTRAINT empresa_fiscal_year_start_month_check CHECK (fiscal_year_start_month >= 1 AND fiscal_year_start_month <= 12)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.empresa
    OWNER to postgres;

GRANT ALL ON TABLE public.empresa TO anon;

GRANT ALL ON TABLE public.empresa TO authenticated;

GRANT ALL ON TABLE public.empresa TO postgres;

GRANT ALL ON TABLE public.empresa TO service_role;


-- =====================================================
-- ESQUEMA DE BASE DE DATOS PARA MÓDULO DE CONTABILIDAD
-- ACTUALIZADO CON FORMATO CONSISTENTE (UUID, estructura real)
-- =====================================================

-- Table: public.empresa_horario_apertura

-- DROP TABLE IF EXISTS public.empresa_horario_apertura;

CREATE TABLE IF NOT EXISTS public.empresa_horario_apertura
(
    id_horario uuid NOT NULL DEFAULT gen_random_uuid(),
    id_empresa uuid NOT NULL,
    dia smallint NOT NULL,
    valor character varying(50) COLLATE pg_catalog."default",
    created_by uuid,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_by uuid,
    updated_at timestamp without time zone,
    CONSTRAINT empresa_horario_apertura_pkey PRIMARY KEY (id_horario),
    CONSTRAINT uq_empresa_dia UNIQUE (id_empresa, dia),
    CONSTRAINT empresa_horario_apertura_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT empresa_horario_apertura_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT empresa_horario_apertura_updated_by_fkey FOREIGN KEY (updated_by)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT empresa_horario_apertura_dia_check CHECK (dia >= 1 AND dia <= 7)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.empresa_horario_apertura
    OWNER to postgres;

GRANT ALL ON TABLE public.empresa_horario_apertura TO anon;

GRANT ALL ON TABLE public.empresa_horario_apertura TO authenticated;

GRANT ALL ON TABLE public.empresa_horario_apertura TO postgres;

GRANT ALL ON TABLE public.empresa_horario_apertura TO service_role;



-- =====================================================


-- Table: public.empresa_identificacion

-- DROP TABLE IF EXISTS public.empresa_identificacion;

CREATE TABLE IF NOT EXISTS public.empresa_identificacion
(
    id_identificacion uuid NOT NULL DEFAULT gen_random_uuid(),
    id_empresa uuid NOT NULL,
    administradores character varying(255) COLLATE pg_catalog."default",
    delegado_datos character varying(255) COLLATE pg_catalog."default",
    capital numeric(14,2),
    id_tipo_entidad smallint,
    objeto_empresa text COLLATE pg_catalog."default",
    cif_intra character varying(64) COLLATE pg_catalog."default",
    id_profesional1 character varying(100) COLLATE pg_catalog."default",
    id_profesional2 character varying(100) COLLATE pg_catalog."default",
    id_profesional3 character varying(100) COLLATE pg_catalog."default",
    id_profesional4 character varying(100) COLLATE pg_catalog."default",
    id_profesional5 character varying(100) COLLATE pg_catalog."default",
    id_profesional6 character varying(100) COLLATE pg_catalog."default",
    id_profesional7 character varying(100) COLLATE pg_catalog."default",
    id_profesional8 character varying(100) COLLATE pg_catalog."default",
    id_profesional9 character varying(100) COLLATE pg_catalog."default",
    id_profesional10 character varying(100) COLLATE pg_catalog."default",
    created_by uuid,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_by uuid,
    updated_at timestamp without time zone,
    CONSTRAINT empresa_identificacion_pkey PRIMARY KEY (id_identificacion),
    CONSTRAINT empresa_identificacion_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT empresa_identificacion_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT empresa_identificacion_id_tipo_entidad_fkey FOREIGN KEY (id_tipo_entidad)
        REFERENCES public.tipo_entidad_comercial (id_tipo_entidad) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT empresa_identificacion_updated_by_fkey FOREIGN KEY (updated_by)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.empresa_identificacion
    OWNER to postgres;

GRANT ALL ON TABLE public.empresa_identificacion TO anon;

GRANT ALL ON TABLE public.empresa_identificacion TO authenticated;

GRANT ALL ON TABLE public.empresa_identificacion TO postgres;

GRANT ALL ON TABLE public.empresa_identificacion TO service_role;
-- =====================================================

-- Table: public.empresa_red_social

-- DROP TABLE IF EXISTS public.empresa_red_social;

CREATE TABLE IF NOT EXISTS public.empresa_red_social
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    id_empresa uuid NOT NULL,
    id_red_social uuid NOT NULL,
    identificador character varying(100) COLLATE pg_catalog."default",
    url character varying(255) COLLATE pg_catalog."default",
    es_principal boolean NOT NULL DEFAULT false,
    created_by uuid,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_by uuid,
    updated_at timestamp without time zone,
    CONSTRAINT empresa_red_social_pkey PRIMARY KEY (id),
    CONSTRAINT empresa_red_social_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT empresa_red_social_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT empresa_red_social_id_red_social_fkey FOREIGN KEY (id_red_social)
        REFERENCES public.social_network (id_red_social) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT empresa_red_social_updated_by_fkey FOREIGN KEY (updated_by)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.empresa_red_social
    OWNER to postgres;

GRANT ALL ON TABLE public.empresa_red_social TO anon;

GRANT ALL ON TABLE public.empresa_red_social TO authenticated;

GRANT ALL ON TABLE public.empresa_red_social TO postgres;

GRANT ALL ON TABLE public.empresa_red_social TO service_role;
-- Index: idx_ers_empresa

-- DROP INDEX IF EXISTS public.idx_ers_empresa;

CREATE INDEX IF NOT EXISTS idx_ers_empresa
    ON public.empresa_red_social USING btree
    (id_empresa ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: idx_ers_red_social

-- DROP INDEX IF EXISTS public.idx_ers_red_social;

CREATE INDEX IF NOT EXISTS idx_ers_red_social
    ON public.empresa_red_social USING btree
    (id_red_social ASC NULLS LAST)
    TABLESPACE pg_default;



-- Index: uk_empresa_identificacion_empresa

-- DROP INDEX IF EXISTS public.uk_empresa_identificacion_empresa;

CREATE UNIQUE INDEX IF NOT EXISTS uk_empresa_identificacion_empresa
    ON public.empresa_identificacion USING btree
    (id_empresa ASC NULLS LAST)
    TABLESPACE pg_default;

-- =====================================================
-- ESQUEMA DE BASE DE DATOS PARA MÓDULO DE CONTABILIDAD
-- ACTUALIZADO CON FORMATO CONSISTENTE (UUID, estructura real)
-- =====================================================

-- =====================================================
-- TABLAS PARA CONDICIONES DE PAGO
-- =====================================================
CREATE TABLE IF NOT EXISTS public.condicion_pago_catalogo
(
    id_condicion_pago uuid NOT NULL DEFAULT gen_random_uuid(),
    descripcion character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT condicion_pago_catalogo_pkey PRIMARY KEY (id_condicion_pago),
    CONSTRAINT condicion_pago_catalogo_descripcion_key UNIQUE (descripcion)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.condicion_pago_catalogo
    OWNER to postgres;

GRANT ALL ON TABLE public.condicion_pago_catalogo TO anon;

GRANT ALL ON TABLE public.condicion_pago_catalogo TO authenticated;

GRANT ALL ON TABLE public.condicion_pago_catalogo TO postgres;

GRANT ALL ON TABLE public.condicion_pago_catalogo TO service_role;

------------------------------

-- Table: public.forma_pago_catalogo

-- DROP TABLE IF EXISTS public.forma_pago_catalogo;

CREATE TABLE IF NOT EXISTS public.forma_pago_catalogo
(
    id_forma_pago uuid NOT NULL DEFAULT gen_random_uuid(),
    descripcion character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT forma_pago_catalogo_pkey PRIMARY KEY (id_forma_pago),
    CONSTRAINT forma_pago_catalogo_descripcion_key UNIQUE (descripcion)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.forma_pago_catalogo
    OWNER to postgres;

GRANT ALL ON TABLE public.forma_pago_catalogo TO anon;

GRANT ALL ON TABLE public.forma_pago_catalogo TO authenticated;

GRANT ALL ON TABLE public.forma_pago_catalogo TO postgres;

GRANT ALL ON TABLE public.forma_pago_catalogo TO service_role;
--------------------------

-- Table: public.forma_pago_catalogo

-- DROP TABLE IF EXISTS public.forma_pago_catalogo;

CREATE TABLE IF NOT EXISTS public.forma_pago_catalogo
(
    id_forma_pago uuid NOT NULL DEFAULT gen_random_uuid(),
    descripcion character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT forma_pago_catalogo_pkey PRIMARY KEY (id_forma_pago),
    CONSTRAINT forma_pago_catalogo_descripcion_key UNIQUE (descripcion)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.forma_pago_catalogo
    OWNER to postgres;

GRANT ALL ON TABLE public.forma_pago_catalogo TO anon;

GRANT ALL ON TABLE public.forma_pago_catalogo TO authenticated;

GRANT ALL ON TABLE public.forma_pago_catalogo TO postgres;

GRANT ALL ON TABLE public.forma_pago_catalogo TO service_role;

--------------------------------





-------------------------------

-- =====================================================
-- ESQUEMA DE BASE DE DATOS PARA MÓDULO DE CONTABILIDAD
-- ACTUALIZADO CON FORMATO CONSISTENTE (UUID, estructura real)
-- =====================================================

-- Tabla para configuración general de contabilidad
CREATE TABLE IF NOT EXISTS public.configuracion_contabilidad (
    id_configuracion_contabilidad UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    id_moneda_base UUID NOT NULL,
    formato_cuenta VARCHAR(20) DEFAULT 'XXXX-XXXX-XXXX',
    separador_cuenta VARCHAR(5) DEFAULT '-',
    longitud_nivel INTEGER DEFAULT 4,
    usar_centavos BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT configuracion_contabilidad_pkey PRIMARY KEY (id_configuracion_contabilidad),
    CONSTRAINT configuracion_contabilidad_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT configuracion_contabilidad_id_moneda_base_fkey FOREIGN KEY (id_moneda_base)
        REFERENCES public.moneda (id_moneda) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
);

-- Tabla para diarios contables
CREATE TABLE IF NOT EXISTS public.diario_contable (
    id_diario_contable UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo_diario VARCHAR(50) NOT NULL, -- 'VENTAS', 'COMPRAS', 'BANCO', 'EGRESOS', 'INGRESOS', 'CIERRE'
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT diario_contable_pkey PRIMARY KEY (id_diario_contable),
    CONSTRAINT diario_contable_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT diario_contable_codigo_unique UNIQUE (id_empresa, codigo)
);

-- Tabla para modelos de planes contables
CREATE TABLE IF NOT EXISTS public.modelo_plan_contable (
    id_modelo_plan_contable UUID NOT NULL DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    codigo VARCHAR(20) NOT NULL,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT modelo_plan_contable_pkey PRIMARY KEY (id_modelo_plan_contable),
    CONSTRAINT modelo_plan_contable_codigo_key UNIQUE (codigo)
);

-- Tabla para el plan contable
CREATE TABLE IF NOT EXISTS public.plan_contable (
    id_plan_contable UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    id_modelo_plan_contable UUID,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT plan_contable_pkey PRIMARY KEY (id_plan_contable),
    CONSTRAINT plan_contable_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT plan_contable_id_modelo_plan_contable_fkey FOREIGN KEY (id_modelo_plan_contable)
        REFERENCES public.modelo_plan_contable (id_modelo_plan_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
);

-- Tabla para cuentas contables individuales
CREATE TABLE IF NOT EXISTS public.cuenta_contable (
    id_cuenta_contable UUID NOT NULL DEFAULT gen_random_uuid(),
    id_plan_contable UUID NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo_cuenta VARCHAR(50) NOT NULL, -- 'ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'GASTO', 'COSTO'
    nivel INTEGER NOT NULL DEFAULT 1,
    id_cuenta_padre UUID,
    permite_movimientos BOOLEAN DEFAULT true,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT cuenta_contable_pkey PRIMARY KEY (id_cuenta_contable),
    CONSTRAINT cuenta_contable_id_plan_contable_fkey FOREIGN KEY (id_plan_contable)
        REFERENCES public.plan_contable (id_plan_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cuenta_contable_id_cuenta_padre_fkey FOREIGN KEY (id_cuenta_padre)
        REFERENCES public.cuenta_contable (id_cuenta_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT cuenta_contable_codigo_unique UNIQUE (id_plan_contable, codigo)
);

-- Tabla para períodos contables
CREATE TABLE IF NOT EXISTS public.periodo_contable (
    id_periodo_contable UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    año INTEGER NOT NULL,
    mes INTEGER NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'ABIERTO', -- 'ABIERTO', 'CERRADO', 'BLOQUEADO'
    fecha_cierre TIMESTAMP WITHOUT TIME ZONE,
    id_usuario_cierre UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT periodo_contable_pkey PRIMARY KEY (id_periodo_contable),
    CONSTRAINT periodo_contable_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT periodo_contable_id_usuario_cierre_fkey FOREIGN KEY (id_usuario_cierre)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT periodo_contable_unique UNIQUE (id_empresa, año, mes)
);

-- Tabla para cuentas contables por defecto
CREATE TABLE IF NOT EXISTS public.cuenta_contable_defecto (
    id_cuenta_contable_defecto UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    tipo_operacion VARCHAR(50) NOT NULL, -- 'VENTA', 'COMPRA', 'PAGO', 'COBRO', 'IVA_VENTA', 'IVA_COMPRA', etc.
    id_cuenta_contable UUID NOT NULL,
    descripcion TEXT,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT cuenta_contable_defecto_pkey PRIMARY KEY (id_cuenta_contable_defecto),
    CONSTRAINT cuenta_contable_defecto_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cuenta_contable_defecto_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable)
        REFERENCES public.cuenta_contable (id_cuenta_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cuenta_contable_defecto_unique UNIQUE (id_empresa, tipo_operacion)
);

-- Tabla para cuentas bancarias
CREATE TABLE IF NOT EXISTS public.cuenta_bancaria (
    id_cuenta_bancaria UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    id_banco UUID NOT NULL,
    numero_cuenta VARCHAR(50) NOT NULL,
    tipo_cuenta VARCHAR(20) NOT NULL, -- 'CORRIENTE', 'AHORROS', 'FIDUCIA'
    id_moneda UUID NOT NULL,
    id_cuenta_contable UUID,
    saldo_inicial DECIMAL(15,2) DEFAULT 0,
    saldo_actual DECIMAL(15,2) DEFAULT 0,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT cuenta_bancaria_pkey PRIMARY KEY (id_cuenta_bancaria),
    CONSTRAINT cuenta_bancaria_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cuenta_bancaria_id_banco_fkey FOREIGN KEY (id_banco)
        REFERENCES public.tercero (id_tercero) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cuenta_bancaria_id_moneda_fkey FOREIGN KEY (id_moneda)
        REFERENCES public.moneda (id_moneda) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cuenta_bancaria_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable)
        REFERENCES public.cuenta_contable (id_cuenta_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT cuenta_bancaria_unique UNIQUE (id_empresa, id_banco, numero_cuenta)
);

-- Tabla para cuentas de IVA
CREATE TABLE IF NOT EXISTS public.cuenta_iva (
    id_cuenta_iva UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    tipo_iva VARCHAR(50) NOT NULL, -- 'VENTA_19', 'VENTA_5', 'COMPRA_19', 'COMPRA_5', 'RETENCION', etc.
    porcentaje DECIMAL(5,2) NOT NULL,
    id_cuenta_contable UUID NOT NULL,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT cuenta_iva_pkey PRIMARY KEY (id_cuenta_iva),
    CONSTRAINT cuenta_iva_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cuenta_iva_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable)
        REFERENCES public.cuenta_contable (id_cuenta_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cuenta_iva_unique UNIQUE (id_empresa, tipo_iva, porcentaje)
);

-- Tabla para cuentas de impuestos
CREATE TABLE IF NOT EXISTS public.cuenta_impuesto (
    id_cuenta_impuesto UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    tipo_impuesto VARCHAR(50) NOT NULL, -- 'RENTA', 'INDUSTRIA_COMERCIO', 'RETENCION', etc.
    porcentaje DECIMAL(5,2) NOT NULL,
    id_cuenta_contable UUID NOT NULL,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT cuenta_impuesto_pkey PRIMARY KEY (id_cuenta_impuesto),
    CONSTRAINT cuenta_impuesto_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cuenta_impuesto_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable)
        REFERENCES public.cuenta_contable (id_cuenta_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cuenta_impuesto_unique UNIQUE (id_empresa, tipo_impuesto, porcentaje)
);

-- Tabla para cuentas contables de productos
CREATE TABLE IF NOT EXISTS public.cuenta_contable_producto (
    id_cuenta_contable_producto UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    tipo_producto VARCHAR(50) NOT NULL, -- 'INVENTARIO', 'COSTO_VENTA', 'INGRESO_VENTA', 'DEVOLUCION'
    id_cuenta_contable UUID NOT NULL,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT cuenta_contable_producto_pkey PRIMARY KEY (id_cuenta_contable_producto),
    CONSTRAINT cuenta_contable_producto_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cuenta_contable_producto_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable)
        REFERENCES public.cuenta_contable (id_cuenta_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cuenta_contable_producto_unique UNIQUE (id_empresa, tipo_producto)
);

-- Tabla para cerrar cuentas
CREATE TABLE IF NOT EXISTS public.cierre_cuenta (
    id_cierre_cuenta UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    id_periodo_contable UUID NOT NULL,
    id_cuenta_contable UUID NOT NULL,
    saldo_debe DECIMAL(15,2) DEFAULT 0,
    saldo_haber DECIMAL(15,2) DEFAULT 0,
    saldo_final DECIMAL(15,2) DEFAULT 0,
    fecha_cierre TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    id_usuario_cierre UUID,
    CONSTRAINT cierre_cuenta_pkey PRIMARY KEY (id_cierre_cuenta),
    CONSTRAINT cierre_cuenta_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cierre_cuenta_id_periodo_contable_fkey FOREIGN KEY (id_periodo_contable)
        REFERENCES public.periodo_contable (id_periodo_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cierre_cuenta_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable)
        REFERENCES public.cuenta_contable (id_cuenta_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cierre_cuenta_id_usuario_cierre_fkey FOREIGN KEY (id_usuario_cierre)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT cierre_cuenta_unique UNIQUE (id_periodo_contable, id_cuenta_contable)
);

-- Tabla para grupos personalizados de cuentas
CREATE TABLE IF NOT EXISTS public.grupo_cuenta_personalizado (
    id_grupo_cuenta_personalizado UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT grupo_cuenta_personalizado_pkey PRIMARY KEY (id_grupo_cuenta_personalizado),
    CONSTRAINT grupo_cuenta_personalizado_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT grupo_cuenta_personalizado_unique UNIQUE (id_empresa, nombre)
);

-- Tabla para relacionar cuentas con grupos personalizados
CREATE TABLE IF NOT EXISTS public.cuenta_grupo_personalizado (
    id_cuenta_grupo_personalizado UUID NOT NULL DEFAULT gen_random_uuid(),
    id_grupo_cuenta_personalizado UUID NOT NULL,
    id_cuenta_contable UUID NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT cuenta_grupo_personalizado_pkey PRIMARY KEY (id_cuenta_grupo_personalizado),
    CONSTRAINT cuenta_grupo_personalizado_id_grupo_fkey FOREIGN KEY (id_grupo_cuenta_personalizado)
        REFERENCES public.grupo_cuenta_personalizado (id_grupo_cuenta_personalizado) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cuenta_grupo_personalizado_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable)
        REFERENCES public.cuenta_contable (id_cuenta_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cuenta_grupo_personalizado_unique UNIQUE (id_grupo_cuenta_personalizado, id_cuenta_contable)
);

-- Tabla para asientos contables
CREATE TABLE IF NOT EXISTS public.asiento_contable (
    id_asiento_contable UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    id_diario_contable UUID NOT NULL,
    numero_asiento VARCHAR(50) NOT NULL,
    fecha_asiento DATE NOT NULL,
    concepto TEXT NOT NULL,
    referencia VARCHAR(100),
    total_debe DECIMAL(15,2) NOT NULL,
    total_haber DECIMAL(15,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'BORRADOR', -- 'BORRADOR', 'APROBADO', 'ANULADO'
    id_usuario_creacion UUID,
    id_usuario_aprobacion UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    fecha_aprobacion TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT asiento_contable_pkey PRIMARY KEY (id_asiento_contable),
    CONSTRAINT asiento_contable_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT asiento_contable_id_diario_contable_fkey FOREIGN KEY (id_diario_contable)
        REFERENCES public.diario_contable (id_diario_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT asiento_contable_id_usuario_creacion_fkey FOREIGN KEY (id_usuario_creacion)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT asiento_contable_id_usuario_aprobacion_fkey FOREIGN KEY (id_usuario_aprobacion)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT asiento_contable_numero_unique UNIQUE (id_empresa, numero_asiento)
);

-- Tabla para movimientos contables (detalle de asientos)
CREATE TABLE IF NOT EXISTS public.movimiento_contable (
    id_movimiento_contable UUID NOT NULL DEFAULT gen_random_uuid(),
    id_asiento_contable UUID NOT NULL,
    id_cuenta_contable UUID NOT NULL,
    concepto TEXT NOT NULL,
    debe DECIMAL(15,2) DEFAULT 0,
    haber DECIMAL(15,2) DEFAULT 0,
    orden INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT movimiento_contable_pkey PRIMARY KEY (id_movimiento_contable),
    CONSTRAINT movimiento_contable_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable)
        REFERENCES public.asiento_contable (id_asiento_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT movimiento_contable_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable)
        REFERENCES public.cuenta_contable (id_cuenta_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
);

-- Tabla para libro mayor
CREATE TABLE IF NOT EXISTS public.libro_mayor (
    id_libro_mayor UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    id_cuenta_contable UUID NOT NULL,
    id_periodo_contable UUID NOT NULL,
    saldo_inicial DECIMAL(15,2) DEFAULT 0,
    total_debe DECIMAL(15,2) DEFAULT 0,
    total_haber DECIMAL(15,2) DEFAULT 0,
    saldo_final DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT libro_mayor_pkey PRIMARY KEY (id_libro_mayor),
    CONSTRAINT libro_mayor_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT libro_mayor_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable)
        REFERENCES public.cuenta_contable (id_cuenta_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT libro_mayor_id_periodo_contable_fkey FOREIGN KEY (id_periodo_contable)
        REFERENCES public.periodo_contable (id_periodo_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT libro_mayor_unique UNIQUE (id_cuenta_contable, id_periodo_contable)
);

-- Tabla para saldos de cuentas
CREATE TABLE IF NOT EXISTS public.saldo_cuenta (
    id_saldo_cuenta UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    id_cuenta_contable UUID NOT NULL,
    id_periodo_contable UUID NOT NULL,
    saldo_debe DECIMAL(15,2) DEFAULT 0,
    saldo_haber DECIMAL(15,2) DEFAULT 0,
    saldo_final DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT saldo_cuenta_pkey PRIMARY KEY (id_saldo_cuenta),
    CONSTRAINT saldo_cuenta_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT saldo_cuenta_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable)
        REFERENCES public.cuenta_contable (id_cuenta_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT saldo_cuenta_id_periodo_contable_fkey FOREIGN KEY (id_periodo_contable)
        REFERENCES public.periodo_contable (id_periodo_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT saldo_cuenta_unique UNIQUE (id_cuenta_contable, id_periodo_contable)
);

-- Tabla para documentos de origen
CREATE TABLE IF NOT EXISTS public.documento_origen (
    id_documento_origen UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    tipo_documento VARCHAR(50) NOT NULL, -- 'FACTURA_VENTA', 'FACTURA_COMPRA', 'RECIBO_PAGO', etc.
    numero_documento VARCHAR(100) NOT NULL,
    fecha_documento DATE NOT NULL,
    id_tercero UUID,
    valor_total DECIMAL(15,2) NOT NULL,
    estado_contabilizacion VARCHAR(20) DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'CONTABILIZADO', 'ERROR'
    id_asiento_contable UUID,
    fecha_contabilizacion TIMESTAMP WITHOUT TIME ZONE,
    id_usuario_contabilizacion UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT documento_origen_pkey PRIMARY KEY (id_documento_origen),
    CONSTRAINT documento_origen_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT documento_origen_id_tercero_fkey FOREIGN KEY (id_tercero)
        REFERENCES public.tercero (id_tercero) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT documento_origen_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable)
        REFERENCES public.asiento_contable (id_asiento_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT documento_origen_id_usuario_contabilizacion_fkey FOREIGN KEY (id_usuario_contabilizacion)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT documento_origen_unique UNIQUE (id_empresa, tipo_documento, numero_documento)
);

-- Tabla para informes contables
CREATE TABLE IF NOT EXISTS public.informe_contable (
    id_informe_contable UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tipo_informe VARCHAR(50) NOT NULL, -- 'BALANCE_GENERAL', 'ESTADO_RESULTADOS', 'FLUJO_CAJA', etc.
    configuracion JSONB,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT informe_contable_pkey PRIMARY KEY (id_informe_contable),
    CONSTRAINT informe_contable_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT informe_contable_unique UNIQUE (id_empresa, nombre)
);

-- =====================================================
-- TABLAS ADICIONALES PARA FUNCIONALIDADES DE DOLIBARR
-- =====================================================

-- Tabla para facturas (integrada con contabilidad)
CREATE TABLE IF NOT EXISTS public.factura (
    id_factura UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    numero_factura VARCHAR(50) NOT NULL,
    tipo_factura VARCHAR(20) NOT NULL, -- 'VENTA', 'COMPRA', 'PROFORMA'
    id_tercero UUID NOT NULL,
    fecha_factura DATE NOT NULL,
    fecha_vencimiento DATE,
    subtotal DECIMAL(15,2) NOT NULL,
    total_impuestos DECIMAL(15,2) DEFAULT 0,
    total_descuentos DECIMAL(15,2) DEFAULT 0,
    total_factura DECIMAL(15,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'BORRADOR', -- 'BORRADOR', 'EMITIDA', 'PAGADA', 'ANULADA'
    id_asiento_contable UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT factura_pkey PRIMARY KEY (id_factura),
    CONSTRAINT factura_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT factura_id_tercero_fkey FOREIGN KEY (id_tercero)
        REFERENCES public.tercero (id_tercero) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT factura_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable)
        REFERENCES public.asiento_contable (id_asiento_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT factura_numero_unique UNIQUE (id_empresa, numero_factura)
);

-- Tabla para líneas de factura
CREATE TABLE IF NOT EXISTS public.factura_linea (
    id_factura_linea UUID NOT NULL DEFAULT gen_random_uuid(),
    id_factura UUID NOT NULL,
    id_producto UUID,
    descripcion VARCHAR(500) NOT NULL,
    cantidad DECIMAL(10,3) NOT NULL,
    precio_unitario DECIMAL(15,2) NOT NULL,
    descuento_porcentaje DECIMAL(5,2) DEFAULT 0,
    descuento_valor DECIMAL(15,2) DEFAULT 0,
    subtotal DECIMAL(15,2) NOT NULL,
    id_cuenta_contable UUID,
    orden INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT factura_linea_pkey PRIMARY KEY (id_factura_linea),
    CONSTRAINT factura_linea_id_factura_fkey FOREIGN KEY (id_factura)
        REFERENCES public.factura (id_factura) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT factura_linea_id_producto_fkey FOREIGN KEY (id_producto)
        REFERENCES public.producto (id_producto) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT factura_linea_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable)
        REFERENCES public.cuenta_contable (id_cuenta_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
);

-- =====================================================
-- TABLAS PARA SISTEMA DE COTIZACIONES, PREFACTURAS Y FACTURAS
-- =====================================================

-- Tabla para cotizaciones
CREATE TABLE IF NOT EXISTS public.cotizacion (
    id_cotizacion UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    numero_cotizacion VARCHAR(50) NOT NULL,
    id_tercero UUID NOT NULL,
    fecha_cotizacion DATE NOT NULL,
    fecha_vencimiento DATE,
    subtotal DECIMAL(15,2) NOT NULL,
    total_impuestos DECIMAL(15,2) DEFAULT 0,
    total_descuentos DECIMAL(15,2) DEFAULT 0,
    total_cotizacion DECIMAL(15,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'BORRADOR', -- 'BORRADOR', 'ENVIADA', 'ACEPTADA', 'RECHAZADA', 'VENCIDA'
    observaciones TEXT,
    id_usuario_creacion UUID,
    id_usuario_aprobacion UUID,
    fecha_aprobacion TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT cotizacion_pkey PRIMARY KEY (id_cotizacion),
    CONSTRAINT cotizacion_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cotizacion_id_tercero_fkey FOREIGN KEY (id_tercero)
        REFERENCES public.tercero (id_tercero) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cotizacion_id_usuario_creacion_fkey FOREIGN KEY (id_usuario_creacion)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT cotizacion_id_usuario_aprobacion_fkey FOREIGN KEY (id_usuario_aprobacion)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT cotizacion_numero_unique UNIQUE (id_empresa, numero_cotizacion)
);

-- Tabla para líneas de cotización
CREATE TABLE IF NOT EXISTS public.cotizacion_linea (
    id_cotizacion_linea UUID NOT NULL DEFAULT gen_random_uuid(),
    id_cotizacion UUID NOT NULL,
    id_producto UUID,
    descripcion VARCHAR(500) NOT NULL,
    cantidad DECIMAL(10,3) NOT NULL,
    precio_unitario DECIMAL(15,2) NOT NULL,
    descuento_porcentaje DECIMAL(5,2) DEFAULT 0,
    descuento_valor DECIMAL(15,2) DEFAULT 0,
    subtotal DECIMAL(15,2) NOT NULL,
    orden INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT cotizacion_linea_pkey PRIMARY KEY (id_cotizacion_linea),
    CONSTRAINT cotizacion_linea_id_cotizacion_fkey FOREIGN KEY (id_cotizacion)
        REFERENCES public.cotizacion (id_cotizacion) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cotizacion_linea_id_producto_fkey FOREIGN KEY (id_producto)
        REFERENCES public.producto (id_producto) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
);

-- Tabla para prefacturas
CREATE TABLE IF NOT EXISTS public.prefactura (
    id_prefactura UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    numero_prefactura VARCHAR(50) NOT NULL,
    id_cotizacion UUID NOT NULL,
    id_tercero UUID NOT NULL,
    fecha_prefactura DATE NOT NULL,
    fecha_vencimiento DATE,
    subtotal DECIMAL(15,2) NOT NULL,
    total_impuestos DECIMAL(15,2) DEFAULT 0,
    total_descuentos DECIMAL(15,2) DEFAULT 0,
    total_prefactura DECIMAL(15,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'BORRADOR', -- 'BORRADOR', 'ENVIADA', 'APROBADA', 'CONVERTIDA', 'ANULADA'
    observaciones TEXT,
    id_factura UUID, -- Si se convierte en factura
    id_usuario_creacion UUID,
    id_usuario_aprobacion UUID,
    fecha_aprobacion TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT prefactura_pkey PRIMARY KEY (id_prefactura),
    CONSTRAINT prefactura_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT prefactura_id_cotizacion_fkey FOREIGN KEY (id_cotizacion)
        REFERENCES public.cotizacion (id_cotizacion) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT prefactura_id_tercero_fkey FOREIGN KEY (id_tercero)
        REFERENCES public.tercero (id_tercero) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT prefactura_id_factura_fkey FOREIGN KEY (id_factura)
        REFERENCES public.factura (id_factura) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT prefactura_id_usuario_creacion_fkey FOREIGN KEY (id_usuario_creacion)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT prefactura_id_usuario_aprobacion_fkey FOREIGN KEY (id_usuario_aprobacion)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT prefactura_numero_unique UNIQUE (id_empresa, numero_prefactura)
);

-- Tabla para líneas de prefactura
CREATE TABLE IF NOT EXISTS public.prefactura_linea (
    id_prefactura_linea UUID NOT NULL DEFAULT gen_random_uuid(),
    id_prefactura UUID NOT NULL,
    id_cotizacion_linea UUID NOT NULL, -- Referencia a la línea de cotización original
    id_producto UUID,
    descripcion VARCHAR(500) NOT NULL,
    cantidad DECIMAL(10,3) NOT NULL,
    precio_unitario DECIMAL(15,2) NOT NULL,
    descuento_porcentaje DECIMAL(5,2) DEFAULT 0,
    descuento_valor DECIMAL(15,2) DEFAULT 0,
    subtotal DECIMAL(15,2) NOT NULL,
    orden INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT prefactura_linea_pkey PRIMARY KEY (id_prefactura_linea),
    CONSTRAINT prefactura_linea_id_prefactura_fkey FOREIGN KEY (id_prefactura)
        REFERENCES public.prefactura (id_prefactura) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT prefactura_linea_id_cotizacion_linea_fkey FOREIGN KEY (id_cotizacion_linea)
        REFERENCES public.cotizacion_linea (id_cotizacion_linea) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT prefactura_linea_id_producto_fkey FOREIGN KEY (id_producto)
        REFERENCES public.producto (id_producto) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
);

-- Tabla para relacionar cotizaciones con prefacturas
CREATE TABLE IF NOT EXISTS public.cotizacion_prefactura (
    id_cotizacion_prefactura UUID NOT NULL DEFAULT gen_random_uuid(),
    id_cotizacion UUID NOT NULL,
    id_prefactura UUID NOT NULL,
    porcentaje_utilizado DECIMAL(5,2) DEFAULT 100, -- Porcentaje de la cotización utilizado en esta prefactura
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT cotizacion_prefactura_pkey PRIMARY KEY (id_cotizacion_prefactura),
    CONSTRAINT cotizacion_prefactura_id_cotizacion_fkey FOREIGN KEY (id_cotizacion)
        REFERENCES public.cotizacion (id_cotizacion) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cotizacion_prefactura_id_prefactura_fkey FOREIGN KEY (id_prefactura)
        REFERENCES public.prefactura (id_prefactura) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cotizacion_prefactura_unique UNIQUE (id_cotizacion, id_prefactura)
);

-- Tabla para relacionar prefacturas con facturas
CREATE TABLE IF NOT EXISTS public.prefactura_factura (
    id_prefactura_factura UUID NOT NULL DEFAULT gen_random_uuid(),
    id_prefactura UUID NOT NULL,
    id_factura UUID NOT NULL,
    porcentaje_utilizado DECIMAL(5,2) DEFAULT 100, -- Porcentaje de la prefactura utilizado en esta factura
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT prefactura_factura_pkey PRIMARY KEY (id_prefactura_factura),
    CONSTRAINT prefactura_factura_id_prefactura_fkey FOREIGN KEY (id_prefactura)
        REFERENCES public.prefactura (id_prefactura) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT prefactura_factura_id_factura_fkey FOREIGN KEY (id_factura)
        REFERENCES public.factura (id_factura) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT prefactura_factura_unique UNIQUE (id_prefactura, id_factura)
);

-- Tabla para historial de conversiones
CREATE TABLE IF NOT EXISTS public.historial_conversion (
    id_historial_conversion UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    tipo_origen VARCHAR(20) NOT NULL, -- 'COTIZACION', 'PREFACTURA'
    id_documento_origen UUID NOT NULL,
    tipo_destino VARCHAR(20) NOT NULL, -- 'PREFACTURA', 'FACTURA'
    id_documento_destino UUID NOT NULL,
    fecha_conversion TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    id_usuario_conversion UUID,
    observaciones TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT historial_conversion_pkey PRIMARY KEY (id_historial_conversion),
    CONSTRAINT historial_conversion_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT historial_conversion_id_usuario_conversion_fkey FOREIGN KEY (id_usuario_conversion)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
);

-- Tabla para pagos
CREATE TABLE IF NOT EXISTS public.pago (
    id_pago UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    numero_pago VARCHAR(50) NOT NULL,
    tipo_pago VARCHAR(20) NOT NULL, -- 'COBRO', 'PAGO'
    id_tercero UUID NOT NULL,
    id_cuenta_bancaria UUID,
    fecha_pago DATE NOT NULL,
    monto DECIMAL(15,2) NOT NULL,
    id_moneda UUID NOT NULL,
    tipo_cambio DECIMAL(10,4) DEFAULT 1,
    concepto TEXT,
    estado VARCHAR(20) DEFAULT 'BORRADOR', -- 'BORRADOR', 'APROBADO', 'ANULADO'
    id_asiento_contable UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT pago_pkey PRIMARY KEY (id_pago),
    CONSTRAINT pago_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT pago_id_tercero_fkey FOREIGN KEY (id_tercero)
        REFERENCES public.tercero (id_tercero) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT pago_id_cuenta_bancaria_fkey FOREIGN KEY (id_cuenta_bancaria)
        REFERENCES public.cuenta_bancaria (id_cuenta_bancaria) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT pago_id_moneda_fkey FOREIGN KEY (id_moneda)
        REFERENCES public.moneda (id_moneda) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT pago_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable)
        REFERENCES public.asiento_contable (id_asiento_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT pago_numero_unique UNIQUE (id_empresa, numero_pago)
);

-- Tabla para relacionar pagos con facturas
CREATE TABLE IF NOT EXISTS public.pago_factura (
    id_pago_factura UUID NOT NULL DEFAULT gen_random_uuid(),
    id_pago UUID NOT NULL,
    id_factura UUID NOT NULL,
    monto_aplicado DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT pago_factura_pkey PRIMARY KEY (id_pago_factura),
    CONSTRAINT pago_factura_id_pago_fkey FOREIGN KEY (id_pago)
        REFERENCES public.pago (id_pago) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT pago_factura_id_factura_fkey FOREIGN KEY (id_factura)
        REFERENCES public.factura (id_factura) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT pago_factura_unique UNIQUE (id_pago, id_factura)
);

-- Tabla para conciliación bancaria
CREATE TABLE IF NOT EXISTS public.conciliacion_bancaria (
    id_conciliacion_bancaria UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    id_cuenta_bancaria UUID NOT NULL,
    id_periodo_contable UUID NOT NULL,
    saldo_libro DECIMAL(15,2) NOT NULL,
    saldo_banco DECIMAL(15,2) NOT NULL,
    diferencia DECIMAL(15,2) DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'CONCILIADO', 'CERRADO'
    fecha_conciliacion DATE,
    id_usuario_conciliacion UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT conciliacion_bancaria_pkey PRIMARY KEY (id_conciliacion_bancaria),
    CONSTRAINT conciliacion_bancaria_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT conciliacion_bancaria_id_cuenta_bancaria_fkey FOREIGN KEY (id_cuenta_bancaria)
        REFERENCES public.cuenta_bancaria (id_cuenta_bancaria) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT conciliacion_bancaria_id_periodo_contable_fkey FOREIGN KEY (id_periodo_contable)
        REFERENCES public.periodo_contable (id_periodo_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT conciliacion_bancaria_id_usuario_conciliacion_fkey FOREIGN KEY (id_usuario_conciliacion)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT conciliacion_bancaria_unique UNIQUE (id_cuenta_bancaria, id_periodo_contable)
);

-- Tabla para movimientos bancarios
CREATE TABLE IF NOT EXISTS public.movimiento_bancario (
    id_movimiento_bancario UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    id_cuenta_bancaria UUID NOT NULL,
    fecha_movimiento DATE NOT NULL,
    numero_documento VARCHAR(100),
    concepto TEXT NOT NULL,
    tipo_movimiento VARCHAR(20) NOT NULL, -- 'DEBITO', 'CREDITO'
    monto DECIMAL(15,2) NOT NULL,
    saldo_anterior DECIMAL(15,2) NOT NULL,
    saldo_nuevo DECIMAL(15,2) NOT NULL,
    conciliado BOOLEAN DEFAULT false,
    id_conciliacion_bancaria UUID,
    id_asiento_contable UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT movimiento_bancario_pkey PRIMARY KEY (id_movimiento_bancario),
    CONSTRAINT movimiento_bancario_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT movimiento_bancario_id_cuenta_bancaria_fkey FOREIGN KEY (id_cuenta_bancaria)
        REFERENCES public.cuenta_bancaria (id_cuenta_bancaria) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT movimiento_bancario_id_conciliacion_bancaria_fkey FOREIGN KEY (id_conciliacion_bancaria)
        REFERENCES public.conciliacion_bancaria (id_conciliacion_bancaria) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT movimiento_bancario_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable)
        REFERENCES public.asiento_contable (id_asiento_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
);

-- Tabla para inventario (movimientos de stock)
CREATE TABLE IF NOT EXISTS public.movimiento_inventario (
    id_movimiento_inventario UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    id_producto UUID NOT NULL,
    tipo_movimiento VARCHAR(20) NOT NULL, -- 'ENTRADA', 'SALIDA', 'AJUSTE', 'TRANSFERENCIA'
    cantidad DECIMAL(10,3) NOT NULL,
    costo_unitario DECIMAL(15,2) NOT NULL,
    costo_total DECIMAL(15,2) NOT NULL,
    fecha_movimiento DATE NOT NULL,
    referencia VARCHAR(100),
    concepto TEXT,
    id_asiento_contable UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT movimiento_inventario_pkey PRIMARY KEY (id_movimiento_inventario),
    CONSTRAINT movimiento_inventario_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT movimiento_inventario_id_producto_fkey FOREIGN KEY (id_producto)
        REFERENCES public.producto (id_producto) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT movimiento_inventario_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable)
        REFERENCES public.asiento_contable (id_asiento_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
);

-- Tabla para presupuestos
CREATE TABLE IF NOT EXISTS public.presupuesto (
    id_presupuesto UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    numero_presupuesto VARCHAR(50) NOT NULL,
    id_tercero UUID NOT NULL,
    fecha_presupuesto DATE NOT NULL,
    fecha_vencimiento DATE,
    subtotal DECIMAL(15,2) NOT NULL,
    total_impuestos DECIMAL(15,2) DEFAULT 0,
    total_descuentos DECIMAL(15,2) DEFAULT 0,
    total_presupuesto DECIMAL(15,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'BORRADOR', -- 'BORRADOR', 'ENVIADO', 'ACEPTADO', 'RECHAZADO', 'CONVERTIDO'
    id_factura UUID, -- Si se convierte en factura
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT presupuesto_pkey PRIMARY KEY (id_presupuesto),
    CONSTRAINT presupuesto_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT presupuesto_id_tercero_fkey FOREIGN KEY (id_tercero)
        REFERENCES public.tercero (id_tercero) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT presupuesto_id_factura_fkey FOREIGN KEY (id_factura)
        REFERENCES public.factura (id_factura) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT presupuesto_numero_unique UNIQUE (id_empresa, numero_presupuesto)
);

-- Tabla para líneas de presupuesto
CREATE TABLE IF NOT EXISTS public.presupuesto_linea (
    id_presupuesto_linea UUID NOT NULL DEFAULT gen_random_uuid(),
    id_presupuesto UUID NOT NULL,
    id_producto UUID,
    descripcion VARCHAR(500) NOT NULL,
    cantidad DECIMAL(10,3) NOT NULL,
    precio_unitario DECIMAL(15,2) NOT NULL,
    descuento_porcentaje DECIMAL(5,2) DEFAULT 0,
    descuento_valor DECIMAL(15,2) DEFAULT 0,
    subtotal DECIMAL(15,2) NOT NULL,
    orden INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT presupuesto_linea_pkey PRIMARY KEY (id_presupuesto_linea),
    CONSTRAINT presupuesto_linea_id_presupuesto_fkey FOREIGN KEY (id_presupuesto)
        REFERENCES public.presupuesto (id_presupuesto) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT presupuesto_linea_id_producto_fkey FOREIGN KEY (id_producto)
        REFERENCES public.producto (id_producto) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
);

-- Tabla para notas de crédito
CREATE TABLE IF NOT EXISTS public.nota_credito (
    id_nota_credito UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    numero_nota VARCHAR(50) NOT NULL,
    tipo_nota VARCHAR(20) NOT NULL, -- 'CREDITO_VENTA', 'CREDITO_COMPRA'
    id_tercero UUID NOT NULL,
    id_factura UUID NOT NULL, -- Factura original
    fecha_nota DATE NOT NULL,
    motivo TEXT NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    total_impuestos DECIMAL(15,2) DEFAULT 0,
    total_descuentos DECIMAL(15,2) DEFAULT 0,
    total_nota DECIMAL(15,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'BORRADOR', -- 'BORRADOR', 'EMITIDA', 'APLICADA', 'ANULADA'
    id_asiento_contable UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT nota_credito_pkey PRIMARY KEY (id_nota_credito),
    CONSTRAINT nota_credito_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT nota_credito_id_tercero_fkey FOREIGN KEY (id_tercero)
        REFERENCES public.tercero (id_tercero) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT nota_credito_id_factura_fkey FOREIGN KEY (id_factura)
        REFERENCES public.factura (id_factura) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT nota_credito_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable)
        REFERENCES public.asiento_contable (id_asiento_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT nota_credito_numero_unique UNIQUE (id_empresa, numero_nota)
);

-- Tabla para líneas de nota de crédito
CREATE TABLE IF NOT EXISTS public.nota_credito_linea (
    id_nota_credito_linea UUID NOT NULL DEFAULT gen_random_uuid(),
    id_nota_credito UUID NOT NULL,
    id_producto UUID,
    descripcion VARCHAR(500) NOT NULL,
    cantidad DECIMAL(10,3) NOT NULL,
    precio_unitario DECIMAL(15,2) NOT NULL,
    descuento_porcentaje DECIMAL(5,2) DEFAULT 0,
    descuento_valor DECIMAL(15,2) DEFAULT 0,
    subtotal DECIMAL(15,2) NOT NULL,
    orden INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT nota_credito_linea_pkey PRIMARY KEY (id_nota_credito_linea),
    CONSTRAINT nota_credito_linea_id_nota_credito_fkey FOREIGN KEY (id_nota_credito)
        REFERENCES public.nota_credito (id_nota_credito) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT nota_credito_linea_id_producto_fkey FOREIGN KEY (id_producto)
        REFERENCES public.producto (id_producto) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
);

-- Tabla para retenciones
CREATE TABLE IF NOT EXISTS public.retencion (
    id_retencion UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    tipo_retencion VARCHAR(50) NOT NULL, -- 'RENTA', 'IVA', 'INDUSTRIA_COMERCIO', 'CREE'
    porcentaje DECIMAL(5,2) NOT NULL,
    base_retencion DECIMAL(15,2) NOT NULL,
    valor_retencion DECIMAL(15,2) NOT NULL,
    id_tercero UUID NOT NULL,
    id_documento_origen UUID, -- Puede ser factura, pago, etc.
    tipo_documento_origen VARCHAR(50) NOT NULL,
    fecha_retencion DATE NOT NULL,
    numero_certificado VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'APLICADA', 'ANULADA'
    id_asiento_contable UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT retencion_pkey PRIMARY KEY (id_retencion),
    CONSTRAINT retencion_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT retencion_id_tercero_fkey FOREIGN KEY (id_tercero)
        REFERENCES public.tercero (id_tercero) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT retencion_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable)
        REFERENCES public.asiento_contable (id_asiento_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
);

-- Tabla para centros de costo
CREATE TABLE IF NOT EXISTS public.centro_costo (
    id_centro_costo UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT centro_costo_pkey PRIMARY KEY (id_centro_costo),
    CONSTRAINT centro_costo_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT centro_costo_codigo_unique UNIQUE (id_empresa, codigo)
);

-- Tabla para relacionar movimientos con centros de costo
CREATE TABLE IF NOT EXISTS public.movimiento_centro_costo (
    id_movimiento_centro_costo UUID NOT NULL DEFAULT gen_random_uuid(),
    id_movimiento_contable UUID NOT NULL,
    id_centro_costo UUID NOT NULL,
    porcentaje DECIMAL(5,2) DEFAULT 100,
    monto DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT movimiento_centro_costo_pkey PRIMARY KEY (id_movimiento_centro_costo),
    CONSTRAINT movimiento_centro_costo_id_movimiento_contable_fkey FOREIGN KEY (id_movimiento_contable)
        REFERENCES public.movimiento_contable (id_movimiento_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT movimiento_centro_costo_id_centro_costo_fkey FOREIGN KEY (id_centro_costo)
        REFERENCES public.centro_costo (id_centro_costo) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
);

-- Tabla para tipos de cambio
CREATE TABLE IF NOT EXISTS public.tipo_cambio (
    id_tipo_cambio UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    id_moneda_origen UUID NOT NULL,
    id_moneda_destino UUID NOT NULL,
    fecha_cambio DATE NOT NULL,
    tasa_cambio DECIMAL(10,4) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT tipo_cambio_pkey PRIMARY KEY (id_tipo_cambio),
    CONSTRAINT tipo_cambio_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT tipo_cambio_id_moneda_origen_fkey FOREIGN KEY (id_moneda_origen)
        REFERENCES public.moneda (id_moneda) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT tipo_cambio_id_moneda_destino_fkey FOREIGN KEY (id_moneda_destino)
        REFERENCES public.moneda (id_moneda) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT tipo_cambio_unique UNIQUE (id_empresa, id_moneda_origen, id_moneda_destino, fecha_cambio)
);

-- Tabla para cierres contables
CREATE TABLE IF NOT EXISTS public.cierre_contable (
    id_cierre_contable UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    id_periodo_contable UUID NOT NULL,
    tipo_cierre VARCHAR(20) NOT NULL, -- 'MENSUAL', 'ANUAL', 'ESPECIAL'
    fecha_cierre TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    id_usuario_cierre UUID NOT NULL,
    observaciones TEXT,
    estado VARCHAR(20) DEFAULT 'PROCESANDO', -- 'PROCESANDO', 'COMPLETADO', 'ERROR'
    CONSTRAINT cierre_contable_pkey PRIMARY KEY (id_cierre_contable),
    CONSTRAINT cierre_contable_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cierre_contable_id_periodo_contable_fkey FOREIGN KEY (id_periodo_contable)
        REFERENCES public.periodo_contable (id_periodo_contable) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT cierre_contable_id_usuario_cierre_fkey FOREIGN KEY (id_usuario_cierre)
        REFERENCES public.usuario (id_usuario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
);


-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_cuenta_contable_codigo ON public.cuenta_contable(codigo);
CREATE INDEX IF NOT EXISTS idx_cuenta_contable_plan ON public.cuenta_contable(id_plan_contable);
CREATE INDEX IF NOT EXISTS idx_asiento_contable_fecha ON public.asiento_contable(fecha_asiento);
CREATE INDEX IF NOT EXISTS idx_asiento_contable_empresa ON public.asiento_contable(id_empresa);
CREATE INDEX IF NOT EXISTS idx_movimiento_contable_asiento ON public.movimiento_contable(id_asiento_contable);
CREATE INDEX IF NOT EXISTS idx_periodo_contable_empresa ON public.periodo_contable(id_empresa);
CREATE INDEX IF NOT EXISTS idx_documento_origen_empresa ON public.documento_origen(id_empresa);

-- Índices para las nuevas tablas
CREATE INDEX IF NOT EXISTS idx_factura_empresa ON public.factura(id_empresa);
CREATE INDEX IF NOT EXISTS idx_factura_tercero ON public.factura(id_tercero);
CREATE INDEX IF NOT EXISTS idx_factura_fecha ON public.factura(fecha_factura);
CREATE INDEX IF NOT EXISTS idx_factura_estado ON public.factura(estado);
CREATE INDEX IF NOT EXISTS idx_pago_empresa ON public.pago(id_empresa);
CREATE INDEX IF NOT EXISTS idx_pago_tercero ON public.pago(id_tercero);
CREATE INDEX IF NOT EXISTS idx_pago_fecha ON public.pago(fecha_pago);
CREATE INDEX IF NOT EXISTS idx_movimiento_bancario_cuenta ON public.movimiento_bancario(id_cuenta_bancaria);
CREATE INDEX IF NOT EXISTS idx_movimiento_bancario_fecha ON public.movimiento_bancario(fecha_movimiento);
CREATE INDEX IF NOT EXISTS idx_movimiento_inventario_producto ON public.movimiento_inventario(id_producto);
CREATE INDEX IF NOT EXISTS idx_movimiento_inventario_fecha ON public.movimiento_inventario(fecha_movimiento);
CREATE INDEX IF NOT EXISTS idx_presupuesto_empresa ON public.presupuesto(id_empresa);
CREATE INDEX IF NOT EXISTS idx_presupuesto_tercero ON public.presupuesto(id_tercero);
CREATE INDEX IF NOT EXISTS idx_nota_credito_empresa ON public.nota_credito(id_empresa);
CREATE INDEX IF NOT EXISTS idx_nota_credito_factura ON public.nota_credito(id_factura);
CREATE INDEX IF NOT EXISTS idx_retencion_empresa ON public.retencion(id_empresa);
CREATE INDEX IF NOT EXISTS idx_retencion_tercero ON public.retencion(id_tercero);
CREATE INDEX IF NOT EXISTS idx_centro_costo_empresa ON public.centro_costo(id_empresa);
CREATE INDEX IF NOT EXISTS idx_tipo_cambio_fecha ON public.tipo_cambio(fecha_cambio);
CREATE INDEX IF NOT EXISTS idx_cierre_contable_periodo ON public.cierre_contable(id_periodo_contable);

-- Índices para las tablas de cotizaciones, prefacturas y facturas
CREATE INDEX IF NOT EXISTS idx_cotizacion_empresa ON public.cotizacion(id_empresa);
CREATE INDEX IF NOT EXISTS idx_cotizacion_tercero ON public.cotizacion(id_tercero);
CREATE INDEX IF NOT EXISTS idx_cotizacion_fecha ON public.cotizacion(fecha_cotizacion);
CREATE INDEX IF NOT EXISTS idx_cotizacion_estado ON public.cotizacion(estado);
CREATE INDEX IF NOT EXISTS idx_cotizacion_linea_cotizacion ON public.cotizacion_linea(id_cotizacion);
CREATE INDEX IF NOT EXISTS idx_cotizacion_linea_producto ON public.cotizacion_linea(id_producto);
CREATE INDEX IF NOT EXISTS idx_prefactura_empresa ON public.prefactura(id_empresa);
CREATE INDEX IF NOT EXISTS idx_prefactura_tercero ON public.prefactura(id_tercero);
CREATE INDEX IF NOT EXISTS idx_prefactura_cotizacion ON public.prefactura(id_cotizacion);
CREATE INDEX IF NOT EXISTS idx_prefactura_fecha ON public.prefactura(fecha_prefactura);
CREATE INDEX IF NOT EXISTS idx_prefactura_estado ON public.prefactura(estado);
CREATE INDEX IF NOT EXISTS idx_prefactura_linea_prefactura ON public.prefactura_linea(id_prefactura);
CREATE INDEX IF NOT EXISTS idx_prefactura_linea_cotizacion_linea ON public.prefactura_linea(id_cotizacion_linea);
CREATE INDEX IF NOT EXISTS idx_cotizacion_prefactura_cotizacion ON public.cotizacion_prefactura(id_cotizacion);
CREATE INDEX IF NOT EXISTS idx_cotizacion_prefactura_prefactura ON public.cotizacion_prefactura(id_prefactura);
CREATE INDEX IF NOT EXISTS idx_prefactura_factura_prefactura ON public.prefactura_factura(id_prefactura);
CREATE INDEX IF NOT EXISTS idx_prefactura_factura_factura ON public.prefactura_factura(id_factura);
CREATE INDEX IF NOT EXISTS idx_historial_conversion_empresa ON public.historial_conversion(id_empresa);
CREATE INDEX IF NOT EXISTS idx_historial_conversion_origen ON public.historial_conversion(tipo_origen, id_documento_origen);
CREATE INDEX IF NOT EXISTS idx_historial_conversion_destino ON public.historial_conversion(tipo_destino, id_documento_destino);


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

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar modelos de plan contable básicos
INSERT INTO public.modelo_plan_contable (nombre, descripcion, codigo) VALUES
('Plan Contable General', 'Plan contable estándar para empresas generales', 'PCG'),
('Plan Contable PYMES', 'Plan contable simplificado para pequeñas y medianas empresas', 'PCPYMES'),
('Plan Contable Comercial', 'Plan contable especializado para empresas comerciales', 'PCC')
ON CONFLICT (codigo) DO NOTHING;

-- Insertar diarios contables básicos (solo si existe una empresa)
INSERT INTO public.diario_contable (id_empresa, codigo, nombre, descripcion, tipo_diario) 
SELECT 
    id_empresa, -- Usar el UUID real de la empresa
    'VEN',
    'Diario de Ventas',
    'Registro de todas las operaciones de venta',
    'VENTAS'
FROM public.empresa 
WHERE estado = true
LIMIT 1
ON CONFLICT (id_empresa, codigo) DO NOTHING;

INSERT INTO public.diario_contable (id_empresa, codigo, nombre, descripcion, tipo_diario) 
SELECT 
    id_empresa, -- Usar el UUID real de la empresa
    'COM',
    'Diario de Compras',
    'Registro de todas las operaciones de compra',
    'COMPRAS'
FROM public.empresa 
WHERE estado = true
LIMIT 1
ON CONFLICT (id_empresa, codigo) DO NOTHING;

INSERT INTO public.diario_contable (id_empresa, codigo, nombre, descripcion, tipo_diario) 
SELECT 
    id_empresa, -- Usar el UUID real de la empresa
    'BAN',
    'Diario Financiero',
    'Registro de todas las operaciones bancarias',
    'BANCO'
FROM public.empresa 
WHERE estado = true
LIMIT 1
ON CONFLICT (id_empresa, codigo) DO NOTHING;

INSERT INTO public.diario_contable (id_empresa, codigo, nombre, descripcion, tipo_diario) 
SELECT 
    id_empresa, -- Usar el UUID real de la empresa
    'EGR',
    'Diario de Egresos',
    'Registro de todos los egresos y gastos',
    'EGRESOS'
FROM public.empresa 
WHERE estado = true
LIMIT 1
ON CONFLICT (id_empresa, codigo) DO NOTHING;

INSERT INTO public.diario_contable (id_empresa, codigo, nombre, descripcion, tipo_diario) 
SELECT 
    id_empresa, -- Usar el UUID real de la empresa
    'ING',
    'Diario de Ingresos',
    'Registro de todos los ingresos',
    'INGRESOS'
FROM public.empresa 
WHERE estado = true
LIMIT 1
ON CONFLICT (id_empresa, codigo) DO NOTHING;

INSERT INTO public.diario_contable (id_empresa, codigo, nombre, descripcion, tipo_diario) 
SELECT 
    id_empresa, -- Usar el UUID real de la empresa
    'CIE',
    'Diario de Cierre',
    'Registro de asientos de cierre contable',
    'CIERRE'
FROM public.empresa 
WHERE estado = true
LIMIT 1
ON CONFLICT (id_empresa, codigo) DO NOTHING;

-- Insertar centros de costo básicos
INSERT INTO public.centro_costo (id_empresa, codigo, nombre, descripcion) 
SELECT 
    id_empresa, -- Usar el UUID real de la empresa
    'ADMIN',
    'Administración',
    'Centro de costo para gastos administrativos'
FROM public.empresa 
WHERE estado = true
LIMIT 1
ON CONFLICT (id_empresa, codigo) DO NOTHING;

INSERT INTO public.centro_costo (id_empresa, codigo, nombre, descripcion) 
SELECT 
    id_empresa, -- Usar el UUID real de la empresa
    'VENTAS',
    'Ventas',
    'Centro de costo para gastos de ventas'
FROM public.empresa 
WHERE estado = true
LIMIT 1
ON CONFLICT (id_empresa, codigo) DO NOTHING;

INSERT INTO public.centro_costo (id_empresa, codigo, nombre, descripcion) 
SELECT 
    id_empresa, -- Usar el UUID real de la empresa
    'PROD',
    'Producción',
    'Centro de costo para gastos de producción'
FROM public.empresa 
WHERE estado = true
LIMIT 1
ON CONFLICT (id_empresa, codigo) DO NOTHING;

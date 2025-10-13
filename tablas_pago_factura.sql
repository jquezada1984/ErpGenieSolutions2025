-- =====================================================
-- TABLAS PARA PAGOS Y FACTURAS
-- =====================================================

-- Tabla para terceros (clientes/proveedores) si no existe
CREATE TABLE IF NOT EXISTS public.tercero (
    id_tercero UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    tipo_tercero VARCHAR(20) NOT NULL, -- 'CLIENTE', 'PROVEEDOR', 'AMBOS'
    tipo_documento VARCHAR(10) NOT NULL, -- 'CC', 'NIT', 'CE', 'TI', 'PP'
    numero_documento VARCHAR(20) NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    nombre_comercial VARCHAR(200),
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(128),
    celular VARCHAR(20),
    id_pais UUID,
    id_provincia UUID,
    id_ciudad UUID,
    codigo_postal VARCHAR(20),
    regimen_fiscal VARCHAR(50), -- 'RESPONSABLE_IVA', 'NO_RESPONSABLE_IVA', 'SIMPLIFICADO'
    sujeto_retencion BOOLEAN DEFAULT false,
    porcentaje_retencion DECIMAL(5,2) DEFAULT 0,
    limite_credito DECIMAL(15,2) DEFAULT 0,
    dias_credito INTEGER DEFAULT 0,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT tercero_pkey PRIMARY KEY (id_tercero),
    CONSTRAINT tercero_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT tercero_id_pais_fkey FOREIGN KEY (id_pais)
        REFERENCES public.pais (id_pais) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT tercero_id_provincia_fkey FOREIGN KEY (id_provincia)
        REFERENCES public.provincia (id_provincia) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL,
    CONSTRAINT tercero_documento_unique UNIQUE (id_empresa, tipo_documento, numero_documento)
);

-- Tabla para productos/servicios si no existe
CREATE TABLE IF NOT EXISTS public.producto (
    id_producto UUID NOT NULL DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo_producto VARCHAR(20) NOT NULL, -- 'PRODUCTO', 'SERVICIO'
    categoria VARCHAR(100),
    unidad_medida VARCHAR(20) DEFAULT 'UNIDAD', -- 'UNIDAD', 'KILO', 'LITRO', 'METRO', etc.
    precio_venta DECIMAL(15,2) DEFAULT 0,
    precio_compra DECIMAL(15,2) DEFAULT 0,
    costo_promedio DECIMAL(15,2) DEFAULT 0,
    stock_minimo DECIMAL(10,3) DEFAULT 0,
    stock_actual DECIMAL(10,3) DEFAULT 0,
    maneja_inventario BOOLEAN DEFAULT true,
    sujeto_iva BOOLEAN DEFAULT true,
    porcentaje_iva DECIMAL(5,2) DEFAULT 19.00,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT producto_pkey PRIMARY KEY (id_producto),
    CONSTRAINT producto_id_empresa_fkey FOREIGN KEY (id_empresa)
        REFERENCES public.empresa (id_empresa) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT producto_codigo_unique UNIQUE (id_empresa, codigo)
);

-- Tabla para facturas
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
    observaciones TEXT,
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
    porcentaje_iva DECIMAL(5,2) DEFAULT 19.00,
    valor_iva DECIMAL(15,2) DEFAULT 0,
    total_linea DECIMAL(15,2) NOT NULL,
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
    metodo_pago VARCHAR(50), -- 'EFECTIVO', 'TRANSFERENCIA', 'CHEQUE', 'TARJETA'
    numero_cheque VARCHAR(50),
    banco_cheque VARCHAR(100),
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
    porcentaje_iva DECIMAL(5,2) DEFAULT 19.00,
    valor_iva DECIMAL(15,2) DEFAULT 0,
    total_linea DECIMAL(15,2) NOT NULL,
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
    observaciones TEXT,
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
    porcentaje_iva DECIMAL(5,2) DEFAULT 19.00,
    valor_iva DECIMAL(15,2) DEFAULT 0,
    total_linea DECIMAL(15,2) NOT NULL,
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

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para terceros
CREATE INDEX IF NOT EXISTS idx_tercero_empresa ON public.tercero(id_empresa);
CREATE INDEX IF NOT EXISTS idx_tercero_documento ON public.tercero(tipo_documento, numero_documento);
CREATE INDEX IF NOT EXISTS idx_tercero_tipo ON public.tercero(tipo_tercero);
CREATE INDEX IF NOT EXISTS idx_tercero_estado ON public.tercero(estado);

-- Índices para productos
CREATE INDEX IF NOT EXISTS idx_producto_empresa ON public.producto(id_empresa);
CREATE INDEX IF NOT EXISTS idx_producto_codigo ON public.producto(codigo);
CREATE INDEX IF NOT EXISTS idx_producto_tipo ON public.producto(tipo_producto);
CREATE INDEX IF NOT EXISTS idx_producto_estado ON public.producto(estado);

-- Índices para facturas
CREATE INDEX IF NOT EXISTS idx_factura_empresa ON public.factura(id_empresa);
CREATE INDEX IF NOT EXISTS idx_factura_tercero ON public.factura(id_tercero);
CREATE INDEX IF NOT EXISTS idx_factura_fecha ON public.factura(fecha_factura);
CREATE INDEX IF NOT EXISTS idx_factura_estado ON public.factura(estado);
CREATE INDEX IF NOT EXISTS idx_factura_tipo ON public.factura(tipo_factura);

-- Índices para líneas de factura
CREATE INDEX IF NOT EXISTS idx_factura_linea_factura ON public.factura_linea(id_factura);
CREATE INDEX IF NOT EXISTS idx_factura_linea_producto ON public.factura_linea(id_producto);

-- Índices para pagos
CREATE INDEX IF NOT EXISTS idx_pago_empresa ON public.pago(id_empresa);
CREATE INDEX IF NOT EXISTS idx_pago_tercero ON public.pago(id_tercero);
CREATE INDEX IF NOT EXISTS idx_pago_fecha ON public.pago(fecha_pago);
CREATE INDEX IF NOT EXISTS idx_pago_estado ON public.pago(estado);
CREATE INDEX IF NOT EXISTS idx_pago_tipo ON public.pago(tipo_pago);

-- Índices para pago_factura
CREATE INDEX IF NOT EXISTS idx_pago_factura_pago ON public.pago_factura(id_pago);
CREATE INDEX IF NOT EXISTS idx_pago_factura_factura ON public.pago_factura(id_factura);

-- Índices para notas de crédito
CREATE INDEX IF NOT EXISTS idx_nota_credito_empresa ON public.nota_credito(id_empresa);
CREATE INDEX IF NOT EXISTS idx_nota_credito_tercero ON public.nota_credito(id_tercero);
CREATE INDEX IF NOT EXISTS idx_nota_credito_factura ON public.nota_credito(id_factura);
CREATE INDEX IF NOT EXISTS idx_nota_credito_fecha ON public.nota_credito(fecha_nota);

-- Índices para presupuestos
CREATE INDEX IF NOT EXISTS idx_presupuesto_empresa ON public.presupuesto(id_empresa);
CREATE INDEX IF NOT EXISTS idx_presupuesto_tercero ON public.presupuesto(id_tercero);
CREATE INDEX IF NOT EXISTS idx_presupuesto_fecha ON public.presupuesto(fecha_presupuesto);
CREATE INDEX IF NOT EXISTS idx_presupuesto_estado ON public.presupuesto(estado);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar algunos productos básicos de ejemplo
INSERT INTO public.producto (id_empresa, codigo, nombre, descripcion, tipo_producto, precio_venta, precio_compra, maneja_inventario, sujeto_iva, porcentaje_iva)
SELECT 
    id_empresa,
    'PROD001',
    'Producto Genérico',
    'Producto de ejemplo para pruebas',
    'PRODUCTO',
    10000.00,
    8000.00,
    true,
    true,
    19.00
FROM public.empresa 
WHERE estado = true
LIMIT 1
ON CONFLICT (id_empresa, codigo) DO NOTHING;

INSERT INTO public.producto (id_empresa, codigo, nombre, descripcion, tipo_producto, precio_venta, precio_compra, maneja_inventario, sujeto_iva, porcentaje_iva)
SELECT 
    id_empresa,
    'SERV001',
    'Servicio Genérico',
    'Servicio de ejemplo para pruebas',
    'SERVICIO',
    50000.00,
    0.00,
    false,
    true,
    19.00
FROM public.empresa 
WHERE estado = true
LIMIT 1
ON CONFLICT (id_empresa, codigo) DO NOTHING;

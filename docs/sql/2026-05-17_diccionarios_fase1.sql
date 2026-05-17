-- Diccionarios fase 1: condiciones de pago, modos de pago, monedas, tipo entidad legal, formatos de papel
-- Sin DELETE físico: campo activo en todos los catálogos

-- ========== condicion_pago_catalogo ==========
ALTER TABLE public.condicion_pago_catalogo
  ADD COLUMN IF NOT EXISTS codigo character varying(32),
  ADD COLUMN IF NOT EXISTS etiqueta character varying(100),
  ADD COLUMN IF NOT EXISTS etiqueta_documento character varying(255),
  ADD COLUMN IF NOT EXISTS porcentaje_deposito numeric(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS numero_dias integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tipo_fin_mes character varying(20) DEFAULT 'ninguno',
  ADD COLUMN IF NOT EXISTS decalaje_dias integer,
  ADD COLUMN IF NOT EXISTS orden integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS activo boolean DEFAULT true;

UPDATE public.condicion_pago_catalogo
SET etiqueta = descripcion,
    codigo = UPPER(LEFT(REPLACE(descripcion, ' ', '_'), 32))
WHERE etiqueta IS NULL AND descripcion IS NOT NULL;

UPDATE public.condicion_pago_catalogo SET activo = true WHERE activo IS NULL;
UPDATE public.condicion_pago_catalogo SET codigo = 'COND_' || LEFT(id_condicion_pago::text, 8) WHERE codigo IS NULL OR codigo = '';

ALTER TABLE public.condicion_pago_catalogo ALTER COLUMN codigo SET NOT NULL;
ALTER TABLE public.condicion_pago_catalogo ALTER COLUMN etiqueta SET NOT NULL;
ALTER TABLE public.condicion_pago_catalogo ALTER COLUMN activo SET NOT NULL;
ALTER TABLE public.condicion_pago_catalogo ALTER COLUMN activo SET DEFAULT true;

ALTER TABLE public.condicion_pago_catalogo DROP CONSTRAINT IF EXISTS condicion_pago_catalogo_descripcion_key;
ALTER TABLE public.condicion_pago_catalogo DROP COLUMN IF EXISTS descripcion;

CREATE UNIQUE INDEX IF NOT EXISTS condicion_pago_catalogo_codigo_key ON public.condicion_pago_catalogo (codigo);

-- ========== forma_pago_catalogo (modos de pago) ==========
ALTER TABLE public.forma_pago_catalogo
  ADD COLUMN IF NOT EXISTS codigo character varying(16),
  ADD COLUMN IF NOT EXISTS etiqueta character varying(100),
  ADD COLUMN IF NOT EXISTS tipo_uso character varying(30) DEFAULT 'cliente_proveedor',
  ADD COLUMN IF NOT EXISTS orden integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS activo boolean DEFAULT true;

UPDATE public.forma_pago_catalogo SET etiqueta = descripcion WHERE etiqueta IS NULL AND descripcion IS NOT NULL;

UPDATE public.forma_pago_catalogo SET codigo = 'LIQ', tipo_uso = 'cliente_proveedor', activo = true WHERE LOWER(descripcion) = 'efectivo' OR etiqueta ILIKE 'efectivo';
UPDATE public.forma_pago_catalogo SET codigo = 'CHQ', tipo_uso = 'cliente_proveedor', activo = true WHERE LOWER(descripcion) = 'cheque' OR etiqueta ILIKE 'cheque';
UPDATE public.forma_pago_catalogo SET codigo = 'CB', tipo_uso = 'cliente_proveedor', activo = true WHERE descripcion ILIKE '%credito%' OR etiqueta ILIKE '%credito%';
UPDATE public.forma_pago_catalogo SET codigo = 'TARJ_DEB', tipo_uso = 'cliente_proveedor', activo = true WHERE descripcion ILIKE '%debito%' OR etiqueta ILIKE '%debito%';

UPDATE public.forma_pago_catalogo
SET codigo = UPPER(LEFT(REPLACE(COALESCE(etiqueta, 'FP'), ' ', '_'), 16)),
    tipo_uso = COALESCE(tipo_uso, 'cliente_proveedor'),
    activo = COALESCE(activo, true)
WHERE codigo IS NULL OR codigo = '';

ALTER TABLE public.forma_pago_catalogo DROP CONSTRAINT IF EXISTS forma_pago_catalogo_descripcion_key;
ALTER TABLE public.forma_pago_catalogo DROP COLUMN IF EXISTS descripcion;

ALTER TABLE public.forma_pago_catalogo ALTER COLUMN codigo SET NOT NULL;
ALTER TABLE public.forma_pago_catalogo ALTER COLUMN etiqueta SET NOT NULL;
ALTER TABLE public.forma_pago_catalogo ALTER COLUMN tipo_uso SET NOT NULL;
ALTER TABLE public.forma_pago_catalogo ALTER COLUMN activo SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS forma_pago_catalogo_codigo_key ON public.forma_pago_catalogo (codigo);

-- ========== moneda ==========
ALTER TABLE public.moneda
  ADD COLUMN IF NOT EXISTS simbolo_unicode character varying(10),
  ADD COLUMN IF NOT EXISTS activo boolean DEFAULT true;

UPDATE public.moneda SET activo = true WHERE activo IS NULL;
UPDATE public.moneda SET simbolo_unicode = '$' WHERE codigo IN ('USD', 'MXN', 'ARS', 'COP', 'CLP') AND simbolo_unicode IS NULL;
UPDATE public.moneda SET simbolo_unicode = '€' WHERE codigo = 'EUR' AND simbolo_unicode IS NULL;
UPDATE public.moneda SET simbolo_unicode = 'S/' WHERE codigo = 'PEN' AND simbolo_unicode IS NULL;
UPDATE public.moneda SET simbolo_unicode = 'R$' WHERE codigo = 'BRL' AND simbolo_unicode IS NULL;

ALTER TABLE public.moneda ALTER COLUMN activo SET NOT NULL;
ALTER TABLE public.moneda ALTER COLUMN activo SET DEFAULT true;

-- ========== tipo_entidad_comercial ==========
ALTER TABLE public.tipo_entidad_comercial
  ADD COLUMN IF NOT EXISTS activo boolean DEFAULT true;

UPDATE public.tipo_entidad_comercial SET activo = true WHERE activo IS NULL;
ALTER TABLE public.tipo_entidad_comercial ALTER COLUMN activo SET NOT NULL;
ALTER TABLE public.tipo_entidad_comercial ALTER COLUMN activo SET DEFAULT true;

-- ========== formato_papel_catalogo (nueva) ==========
CREATE TABLE IF NOT EXISTS public.formato_papel_catalogo (
    id_formato_papel uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo character varying(32) NOT NULL,
    etiqueta character varying(100) NOT NULL,
    largo numeric(10,2) NOT NULL,
    alto numeric(10,2) NOT NULL,
    unidad_medida character varying(10) DEFAULT 'mm'::character varying NOT NULL,
    orden integer DEFAULT 0,
    activo boolean DEFAULT true NOT NULL,
    CONSTRAINT formato_papel_catalogo_pkey PRIMARY KEY (id_formato_papel),
    CONSTRAINT formato_papel_catalogo_codigo_key UNIQUE (codigo)
);

INSERT INTO public.formato_papel_catalogo (codigo, etiqueta, largo, alto, unidad_medida, orden, activo)
SELECT 'EUA4', 'Formato A4', 210.00, 297.00, 'mm', 1, true
WHERE NOT EXISTS (SELECT 1 FROM public.formato_papel_catalogo WHERE codigo = 'EUA4');

INSERT INTO public.formato_papel_catalogo (codigo, etiqueta, largo, alto, unidad_medida, orden, activo)
SELECT 'USLetter', 'Formato carta EE. UU.', 216.00, 279.00, 'mm', 2, true
WHERE NOT EXISTS (SELECT 1 FROM public.formato_papel_catalogo WHERE codigo = 'USLetter');

INSERT INTO public.formato_papel_catalogo (codigo, etiqueta, largo, alto, unidad_medida, orden, activo)
SELECT 'USLegal', 'Formato legal EE. UU.', 216.00, 356.00, 'mm', 3, true
WHERE NOT EXISTS (SELECT 1 FROM public.formato_papel_catalogo WHERE codigo = 'USLegal');

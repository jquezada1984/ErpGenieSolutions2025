-- =====================================================
-- Diccionarios por empresa (idempotente, respeta FK tercero)
-- =====================================================

-- ---------- condicion_pago_catalogo ----------
ALTER TABLE public.condicion_pago_catalogo
  ADD COLUMN IF NOT EXISTS id_empresa uuid;

ALTER TABLE public.condicion_pago_catalogo
  DROP CONSTRAINT IF EXISTS condicion_pago_catalogo_codigo_key;
DROP INDEX IF EXISTS public.condicion_pago_catalogo_codigo_key;

UPDATE public.condicion_pago_catalogo c
SET id_empresa = t.id_empresa
FROM (
  SELECT DISTINCT ON (id_condicion_pago) id_condicion_pago, id_empresa
  FROM public.tercero
  WHERE id_condicion_pago IS NOT NULL AND id_empresa IS NOT NULL
  ORDER BY id_condicion_pago, id_empresa
) t
WHERE c.id_condicion_pago = t.id_condicion_pago
  AND c.id_empresa IS NULL;

UPDATE public.condicion_pago_catalogo
SET id_empresa = (SELECT id_empresa FROM public.empresa WHERE COALESCE(estado, true) = true ORDER BY id_empresa LIMIT 1)
WHERE id_empresa IS NULL;

INSERT INTO public.condicion_pago_catalogo (
  id_condicion_pago, codigo, etiqueta, etiqueta_documento,
  porcentaje_deposito, numero_dias, tipo_fin_mes, decalaje_dias,
  orden, activo, id_empresa
)
SELECT gen_random_uuid(), s.codigo, s.etiqueta, s.etiqueta_documento,
       s.porcentaje_deposito, s.numero_dias, s.tipo_fin_mes, s.decalaje_dias,
       s.orden, s.activo, e.id_empresa
FROM public.empresa e
CROSS JOIN LATERAL (
  SELECT DISTINCT ON (codigo) *
  FROM public.condicion_pago_catalogo
  WHERE id_empresa IS NOT NULL
  ORDER BY codigo
) s
WHERE COALESCE(e.estado, true) = true
  AND NOT EXISTS (
    SELECT 1 FROM public.condicion_pago_catalogo x
    WHERE x.id_empresa = e.id_empresa AND x.codigo = s.codigo
  );

ALTER TABLE public.condicion_pago_catalogo
  ALTER COLUMN id_empresa SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS condicion_pago_catalogo_empresa_codigo_key
  ON public.condicion_pago_catalogo (id_empresa, codigo);

-- ---------- forma_pago_catalogo ----------
ALTER TABLE public.forma_pago_catalogo
  ADD COLUMN IF NOT EXISTS id_empresa uuid;

ALTER TABLE public.forma_pago_catalogo
  DROP CONSTRAINT IF EXISTS forma_pago_catalogo_codigo_key;
DROP INDEX IF EXISTS public.forma_pago_catalogo_codigo_key;

UPDATE public.forma_pago_catalogo f
SET id_empresa = t.id_empresa
FROM (
  SELECT DISTINCT ON (id_forma_pago) id_forma_pago, id_empresa
  FROM public.tercero
  WHERE id_forma_pago IS NOT NULL AND id_empresa IS NOT NULL
  ORDER BY id_forma_pago, id_empresa
) t
WHERE f.id_forma_pago = t.id_forma_pago
  AND f.id_empresa IS NULL;

UPDATE public.forma_pago_catalogo
SET id_empresa = (SELECT id_empresa FROM public.empresa WHERE COALESCE(estado, true) = true ORDER BY id_empresa LIMIT 1)
WHERE id_empresa IS NULL;

INSERT INTO public.forma_pago_catalogo (
  id_forma_pago, codigo, etiqueta, tipo_uso, orden, activo, id_empresa
)
SELECT gen_random_uuid(), s.codigo, s.etiqueta, s.tipo_uso, s.orden, s.activo, e.id_empresa
FROM public.empresa e
CROSS JOIN LATERAL (
  SELECT DISTINCT ON (codigo) *
  FROM public.forma_pago_catalogo
  WHERE id_empresa IS NOT NULL
  ORDER BY codigo
) s
WHERE COALESCE(e.estado, true) = true
  AND NOT EXISTS (
    SELECT 1 FROM public.forma_pago_catalogo x
    WHERE x.id_empresa = e.id_empresa AND x.codigo = s.codigo
  );

ALTER TABLE public.forma_pago_catalogo
  ALTER COLUMN id_empresa SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS forma_pago_catalogo_empresa_codigo_key
  ON public.forma_pago_catalogo (id_empresa, codigo);

-- ---------- formato_papel_catalogo ----------
ALTER TABLE public.formato_papel_catalogo
  ADD COLUMN IF NOT EXISTS id_empresa uuid;

ALTER TABLE public.formato_papel_catalogo
  DROP CONSTRAINT IF EXISTS formato_papel_catalogo_codigo_key;
DROP INDEX IF EXISTS public.formato_papel_catalogo_codigo_key;

UPDATE public.formato_papel_catalogo
SET id_empresa = (SELECT id_empresa FROM public.empresa WHERE COALESCE(estado, true) = true ORDER BY id_empresa LIMIT 1)
WHERE id_empresa IS NULL;

UPDATE public.formato_papel_catalogo
SET id_empresa = 'a0000000-0000-4000-8000-000000000001'
WHERE id_empresa IS NULL;

INSERT INTO public.formato_papel_catalogo (
  id_formato_papel, codigo, etiqueta, largo, alto, unidad_medida, orden, activo, id_empresa
)
SELECT gen_random_uuid(), s.codigo, s.etiqueta, s.largo, s.alto, s.unidad_medida, s.orden, s.activo, e.id_empresa
FROM public.empresa e
CROSS JOIN LATERAL (
  SELECT DISTINCT ON (codigo) *
  FROM public.formato_papel_catalogo
  WHERE id_empresa IS NOT NULL
  ORDER BY codigo
) s
WHERE COALESCE(e.estado, true) = true
  AND NOT EXISTS (
    SELECT 1 FROM public.formato_papel_catalogo x
    WHERE x.id_empresa = e.id_empresa AND x.codigo = s.codigo
  );

ALTER TABLE public.formato_papel_catalogo
  ALTER COLUMN id_empresa SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS formato_papel_catalogo_empresa_codigo_key
  ON public.formato_papel_catalogo (id_empresa, codigo);

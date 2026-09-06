-- Fase 0: impuestos por empresa (id_empresa + codigo + activo)
-- Idempotente. Copia tasas globales actuales a cada empresa y remapea item.impuesto_id.

-- 1) Columnas nuevas
ALTER TABLE public.impuestos
  ADD COLUMN IF NOT EXISTS id_empresa uuid,
  ADD COLUMN IF NOT EXISTS codigo varchar(32),
  ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true;

-- 2) Códigos en filas globales legacy (id_empresa IS NULL)
UPDATE public.impuestos
SET codigo = CASE
  WHEN tasa = 0 THEN 'IVA_0'
  WHEN tasa = 12 THEN 'IVA_12'
  WHEN tasa = 15 THEN 'IVA_15'
  ELSE 'IVA_' || replace(trim(both from to_char(tasa, 'FM9990D00')), '.', '_')
END
WHERE codigo IS NULL;

-- 3) Copiar tasas globales a cada empresa (si aún no tiene ese código)
INSERT INTO public.impuestos (nombre, tasa, id_empresa, codigo, activo, creado_en, actualizado_en)
SELECT g.nombre, g.tasa, e.id_empresa, g.codigo, true, NOW(), NOW()
FROM public.empresa e
CROSS JOIN public.impuestos g
WHERE g.id_empresa IS NULL
  AND g.codigo IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.impuestos x
    WHERE x.id_empresa = e.id_empresa AND x.codigo = g.codigo
  );

-- 4) Remapear item.impuesto_id → tasa de la misma empresa
UPDATE public.item i
SET impuesto_id = n.id
FROM public.impuestos old, public.impuestos n
WHERE i.impuesto_id = old.id
  AND old.id_empresa IS NULL
  AND n.id_empresa = i.id_empresa
  AND n.codigo = COALESCE(
    old.codigo,
    CASE
      WHEN old.tasa = 0 THEN 'IVA_0'
      ELSE 'IVA_' || replace(trim(both from to_char(old.tasa, 'FM9990D00')), '.', '_')
    END
  )
  AND n.id IS DISTINCT FROM old.id;

-- 4b) Remapear gasto_detalle.impuesto_id vía gasto.id_empresa
UPDATE public.gasto_detalle gd
SET impuesto_id = n.id
FROM public.gasto g, public.impuestos old, public.impuestos n
WHERE gd.id_gasto = g.id_gasto
  AND gd.impuesto_id = old.id
  AND old.id_empresa IS NULL
  AND n.id_empresa = g.id_empresa
  AND n.codigo = COALESCE(
    old.codigo,
    CASE
      WHEN old.tasa = 0 THEN 'IVA_0'
      ELSE 'IVA_' || replace(trim(both from to_char(old.tasa, 'FM9990D00')), '.', '_')
    END
  )
  AND n.id IS DISTINCT FROM old.id;

-- 5) Eliminar filas globales legacy (ya copiadas)
DELETE FROM public.impuestos WHERE id_empresa IS NULL;

-- 6) NOT NULL + unique + FK
ALTER TABLE public.impuestos
  ALTER COLUMN id_empresa SET NOT NULL,
  ALTER COLUMN codigo SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'impuestos_id_empresa_fkey'
  ) THEN
    ALTER TABLE public.impuestos
      ADD CONSTRAINT impuestos_id_empresa_fkey
      FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'impuestos_id_empresa_codigo_key'
  ) THEN
    ALTER TABLE public.impuestos
      ADD CONSTRAINT impuestos_id_empresa_codigo_key UNIQUE (id_empresa, codigo);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_impuestos_empresa_activo
  ON public.impuestos (id_empresa, activo);

-- 7) Seed faltante IVA_0 / IVA_15 para empresas sin ellos (Ecuador)
INSERT INTO public.impuestos (nombre, tasa, id_empresa, codigo, activo, creado_en, actualizado_en)
SELECT 'IVA 0%', 0, e.id_empresa, 'IVA_0', true, NOW(), NOW()
FROM public.empresa e
WHERE NOT EXISTS (
  SELECT 1 FROM public.impuestos x WHERE x.id_empresa = e.id_empresa AND x.codigo = 'IVA_0'
);

INSERT INTO public.impuestos (nombre, tasa, id_empresa, codigo, activo, creado_en, actualizado_en)
SELECT 'IVA 15%', 15, e.id_empresa, 'IVA_15', true, NOW(), NOW()
FROM public.empresa e
WHERE NOT EXISTS (
  SELECT 1 FROM public.impuestos x WHERE x.id_empresa = e.id_empresa AND x.codigo = 'IVA_15'
);

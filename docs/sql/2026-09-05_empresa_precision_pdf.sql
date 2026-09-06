-- Fase 1: precisión y parámetros PDF por empresa
ALTER TABLE public.empresa
  ADD COLUMN IF NOT EXISTS decimales_precio smallint NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS decimales_cantidad smallint NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS decimales_total smallint NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS pdf_mostrar_ruc boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS pdf_pie_texto text,
  ADD COLUMN IF NOT EXISTS id_formato_papel uuid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'empresa_decimales_precio_check'
  ) THEN
    ALTER TABLE public.empresa
      ADD CONSTRAINT empresa_decimales_precio_check CHECK (decimales_precio BETWEEN 0 AND 6),
      ADD CONSTRAINT empresa_decimales_cantidad_check CHECK (decimales_cantidad BETWEEN 0 AND 6),
      ADD CONSTRAINT empresa_decimales_total_check CHECK (decimales_total BETWEEN 0 AND 6);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'empresa_id_formato_papel_fkey'
  ) THEN
    ALTER TABLE public.empresa
      ADD CONSTRAINT empresa_id_formato_papel_fkey
      FOREIGN KEY (id_formato_papel) REFERENCES public.formato_papel_catalogo(id_formato_papel);
  END IF;
EXCEPTION
  WHEN undefined_table THEN
    NULL; -- catálogo aún no existe en algún entorno
END $$;

COMMENT ON COLUMN public.empresa.decimales_precio IS 'Decimales precio unitario en documentos';
COMMENT ON COLUMN public.empresa.decimales_cantidad IS 'Decimales cantidad';
COMMENT ON COLUMN public.empresa.decimales_total IS 'Decimales totales / IVA / moneda';
COMMENT ON COLUMN public.empresa.pdf_mostrar_ruc IS 'Mostrar RUC en cabecera PDF';
COMMENT ON COLUMN public.empresa.pdf_pie_texto IS 'Texto de pie en PDF (vacío = marca Genie)';
COMMENT ON COLUMN public.empresa.id_formato_papel IS 'Formato papel preferido (catálogo por empresa)';

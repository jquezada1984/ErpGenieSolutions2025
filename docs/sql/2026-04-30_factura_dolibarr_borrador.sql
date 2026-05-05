-- Extensión factura (cabecera tipo Dolibarr) + borradores sin número.
-- Ejecutar manualmente en PostgreSQL (no se ejecuta desde el código).

BEGIN;

-- Permitir borrador sin número y totales opcionales hasta validación
ALTER TABLE public.factura
  ALTER COLUMN numero_factura DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS id_condicion_pago uuid,
  ADD COLUMN IF NOT EXISTS id_forma_pago uuid,
  ADD COLUMN IF NOT EXISTS id_cuenta_bancaria uuid,
  ADD COLUMN IF NOT EXISTS origen character varying(100),
  ADD COLUMN IF NOT EXISTS id_proyecto uuid,
  ADD COLUMN IF NOT EXISTS categorias text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS plantilla_documento character varying(50) NOT NULL DEFAULT 'crabe',
  ADD COLUMN IF NOT EXISTS id_moneda uuid,
  ADD COLUMN IF NOT EXISTS nota_publica text,
  ADD COLUMN IF NOT EXISTS nota_privada text;

ALTER TABLE public.factura
  ALTER COLUMN subtotal DROP NOT NULL,
  ALTER COLUMN total_factura DROP NOT NULL;

ALTER TABLE public.factura
  ALTER COLUMN tipo_factura SET DEFAULT 'estandar';

-- Unicidad de número solo cuando está asignado (borradores con NULL permitidos)
ALTER TABLE public.factura DROP CONSTRAINT IF EXISTS factura_numero_unique;

DROP INDEX IF EXISTS public.factura_numero_unique_idx;

CREATE UNIQUE INDEX factura_numero_unique_idx
  ON public.factura (id_empresa, numero_factura)
  WHERE numero_factura IS NOT NULL;

-- FKs (idempotentes)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'factura_id_condicion_pago_fkey'
  ) THEN
    ALTER TABLE public.factura
      ADD CONSTRAINT factura_id_condicion_pago_fkey
      FOREIGN KEY (id_condicion_pago) REFERENCES public.condicion_pago_catalogo(id_condicion_pago);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'factura_id_forma_pago_fkey'
  ) THEN
    ALTER TABLE public.factura
      ADD CONSTRAINT factura_id_forma_pago_fkey
      FOREIGN KEY (id_forma_pago) REFERENCES public.forma_pago_catalogo(id_forma_pago);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'factura_id_cuenta_bancaria_fkey'
  ) THEN
    ALTER TABLE public.factura
      ADD CONSTRAINT factura_id_cuenta_bancaria_fkey
      FOREIGN KEY (id_cuenta_bancaria) REFERENCES public.cuenta_bancaria(id_cuenta_bancaria);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'factura_id_moneda_fkey'
  ) THEN
    ALTER TABLE public.factura
      ADD CONSTRAINT factura_id_moneda_fkey
      FOREIGN KEY (id_moneda) REFERENCES public.moneda(id_moneda);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'factura_tipo_factura_chk'
  ) THEN
    ALTER TABLE public.factura
      ADD CONSTRAINT factura_tipo_factura_chk
      CHECK (tipo_factura IN ('estandar', 'anticipo', 'rectificativa', 'abono', 'plantilla'));
  END IF;
END $$;

COMMIT;

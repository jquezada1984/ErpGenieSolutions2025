-- Fase 2-3: transferencia facturas a contabilidad

ALTER TABLE public.factura_linea
  ADD COLUMN IF NOT EXISTS tasa_iva numeric(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS id_cuenta_sugerida uuid REFERENCES public.cuenta_contable(id_cuenta_contable),
  ADD COLUMN IF NOT EXISTS vinculado boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS transferido boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS id_asiento_contable uuid REFERENCES public.asiento_contable(id_asiento_contable);

UPDATE public.factura_linea
SET vinculado = true
WHERE id_cuenta_contable IS NOT NULL AND (vinculado IS NULL OR vinculado = false);

CREATE INDEX IF NOT EXISTS idx_factura_linea_vinculado ON public.factura_linea(vinculado, transferido);
CREATE INDEX IF NOT EXISTS idx_factura_linea_cuenta ON public.factura_linea(id_cuenta_contable);

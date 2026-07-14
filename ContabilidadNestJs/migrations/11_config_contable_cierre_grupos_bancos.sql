-- Fase 1: cierre ejercicio, grupos informes, diario bancario

ALTER TABLE public.configuracion_contabilidad
  ADD COLUMN IF NOT EXISTS id_cuenta_resultado_ganancia uuid REFERENCES public.cuenta_contable(id_cuenta_contable),
  ADD COLUMN IF NOT EXISTS id_cuenta_resultado_perdida uuid REFERENCES public.cuenta_contable(id_cuenta_contable),
  ADD COLUMN IF NOT EXISTS id_diario_cierre uuid REFERENCES public.diario_contable(id_diario_contable),
  ADD COLUMN IF NOT EXISTS grupos_cuenta_balance text,
  ADD COLUMN IF NOT EXISTS grupos_cuenta_resultado text;

ALTER TABLE public.grupo_cuenta_personalizado
  ADD COLUMN IF NOT EXISTS codigo varchar(20),
  ADD COLUMN IF NOT EXISTS etiqueta varchar(100),
  ADD COLUMN IF NOT EXISTS comentario text,
  ADD COLUMN IF NOT EXISTS calculado boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS formula text,
  ADD COLUMN IF NOT EXISTS posicion integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS id_pais uuid;

ALTER TABLE public.cuenta_bancaria
  ADD COLUMN IF NOT EXISTS id_diario_contable uuid REFERENCES public.diario_contable(id_diario_contable);

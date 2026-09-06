-- Fase 2: preferencias de configuración por empresa + seguridad de instancia

CREATE TABLE IF NOT EXISTS public.empresa_config (
  id_empresa uuid PRIMARY KEY REFERENCES public.empresa(id_empresa) ON DELETE CASCADE,
  paneles jsonb NOT NULL DEFAULT '[]'::jsonb,
  alertas jsonb NOT NULL DEFAULT '{}'::jsonb,
  emails jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

COMMENT ON TABLE public.empresa_config IS 'Preferencias UI/config por empresa (paneles, alertas, emails)';

CREATE TABLE IF NOT EXISTS public.instancia_config (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  seguridad jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

INSERT INTO public.instancia_config (id, seguridad)
VALUES (1, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.sp_empresa_config_obtener(p_id_empresa uuid)
RETURNS TABLE (
  id_empresa uuid,
  paneles jsonb,
  alertas jsonb,
  emails jsonb,
  updated_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.empresa_config c WHERE c.id_empresa = p_id_empresa) THEN
    RETURN QUERY
    SELECT c.id_empresa, c.paneles, c.alertas, c.emails, c.updated_at
    FROM public.empresa_config c
    WHERE c.id_empresa = p_id_empresa;
  ELSE
    RETURN QUERY
    SELECT p_id_empresa, '[]'::jsonb, '{}'::jsonb, '{}'::jsonb, NULL::timestamptz;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.sp_empresa_config_guardar(
  p_id_empresa uuid,
  p_paneles jsonb DEFAULT NULL,
  p_alertas jsonb DEFAULT NULL,
  p_emails jsonb DEFAULT NULL,
  p_updated_by uuid DEFAULT NULL
)
RETURNS TABLE (
  id_empresa uuid,
  paneles jsonb,
  alertas jsonb,
  emails jsonb,
  updated_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.empresa_config AS ec (id_empresa, paneles, alertas, emails, updated_by, updated_at)
  VALUES (
    p_id_empresa,
    COALESCE(p_paneles, '[]'::jsonb),
    COALESCE(p_alertas, '{}'::jsonb),
    COALESCE(p_emails, '{}'::jsonb),
    p_updated_by,
    now()
  )
  ON CONFLICT (id_empresa) DO UPDATE SET
    paneles = COALESCE(p_paneles, ec.paneles),
    alertas = COALESCE(p_alertas, ec.alertas),
    emails = COALESCE(p_emails, ec.emails),
    updated_by = COALESCE(p_updated_by, ec.updated_by),
    updated_at = now();

  RETURN QUERY
  SELECT c.id_empresa, c.paneles, c.alertas, c.emails, c.updated_at
  FROM public.empresa_config c
  WHERE c.id_empresa = p_id_empresa;
END;
$$;

CREATE OR REPLACE FUNCTION public.sp_instancia_config_obtener()
RETURNS TABLE (seguridad jsonb, updated_at timestamptz)
LANGUAGE sql
AS $$
  SELECT c.seguridad, c.updated_at FROM public.instancia_config c WHERE c.id = 1;
$$;

CREATE OR REPLACE FUNCTION public.sp_instancia_config_guardar_seguridad(
  p_seguridad jsonb,
  p_updated_by uuid DEFAULT NULL
)
RETURNS TABLE (seguridad jsonb, updated_at timestamptz)
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.instancia_config AS ic (id, seguridad, updated_by, updated_at)
  VALUES (1, COALESCE(p_seguridad, '{}'::jsonb), p_updated_by, now())
  ON CONFLICT (id) DO UPDATE SET
    seguridad = COALESCE(p_seguridad, ic.seguridad),
    updated_by = COALESCE(p_updated_by, ic.updated_by),
    updated_at = now();

  RETURN QUERY SELECT c.seguridad, c.updated_at FROM public.instancia_config c WHERE c.id = 1;
END;
$$;

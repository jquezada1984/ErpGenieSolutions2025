-- ============================================================
-- 01_gasto_secuencia.sql
-- Numeración segura de gastos: GAS-YYYY-###### por empresa/año
--
-- VERSIONADO de infraestructura YA aplicada en PostgreSQL.
-- Ejecutar UNA VEZ solo si el entorno aún no tiene estos objetos.
-- No recrear ni eliminar objetos existentes en producción.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.gasto_secuencia (
  id_empresa     UUID    NOT NULL,
  anio           INTEGER NOT NULL CHECK (anio > 0),
  ultimo_numero  INTEGER NOT NULL DEFAULT 0 CHECK (ultimo_numero >= 0),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pk_gasto_secuencia PRIMARY KEY (id_empresa, anio),
  CONSTRAINT fk_gasto_secuencia_empresa
    FOREIGN KEY (id_empresa) REFERENCES public.empresa (id_empresa)
);

COMMENT ON TABLE public.gasto_secuencia IS
  'Contador transaccional de numero_gasto por empresa y año calendario (fuente: fecha_gasto).';

CREATE OR REPLACE FUNCTION public.obtener_siguiente_numero_gasto(
  p_id_empresa UUID,
  p_fecha      DATE
)
RETURNS VARCHAR
LANGUAGE plpgsql
AS $$
DECLARE
  v_anio       INTEGER;
  v_siguiente  INTEGER;
BEGIN
  IF p_id_empresa IS NULL THEN
    RAISE EXCEPTION 'id_empresa es obligatorio para numerar gasto';
  END IF;

  IF p_fecha IS NULL THEN
    RAISE EXCEPTION 'fecha es obligatoria para numerar gasto';
  END IF;

  v_anio := EXTRACT(YEAR FROM p_fecha)::INTEGER;

  IF v_anio <= 0 THEN
    RAISE EXCEPTION 'año inválido derivado de fecha_gasto: %', p_fecha;
  END IF;

  -- UPSERT atómico: crea fila (empresa, año) o incrementa bajo row lock de la TX
  INSERT INTO public.gasto_secuencia AS s (id_empresa, anio, ultimo_numero, updated_at)
  VALUES (p_id_empresa, v_anio, 1, now())
  ON CONFLICT (id_empresa, anio)
  DO UPDATE
    SET ultimo_numero = s.ultimo_numero + 1,
        updated_at    = now()
  RETURNING s.ultimo_numero
  INTO v_siguiente;

  -- Formato: GAS-2026-000001
  RETURN format('GAS-%s-%s', v_anio, lpad(v_siguiente::text, 6, '0'));
END;
$$;

COMMENT ON FUNCTION public.obtener_siguiente_numero_gasto(UUID, DATE) IS
  'Devuelve el siguiente numero_gasto (GAS-YYYY-######) por empresa y año de p_fecha (= fecha_gasto). Debe llamarse dentro de la misma transacción del INSERT en gasto + gasto_detalle.';

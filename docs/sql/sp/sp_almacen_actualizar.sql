-- Actualiza almacén por id + empresa.
CREATE OR REPLACE FUNCTION sp_almacen_actualizar(
  p_id_empresa uuid,
  p_id_almacen uuid,
  p_almacen_ref varchar DEFAULT NULL,
  p_nombre varchar DEFAULT NULL,
  p_descripcion text DEFAULT NULL,
  p_direccion text DEFAULT NULL,
  p_codigo_postal varchar DEFAULT NULL,
  p_poblacion varchar DEFAULT NULL,
  p_id_pais uuid DEFAULT NULL,
  p_id_provincia uuid DEFAULT NULL,
  p_telefono varchar DEFAULT NULL,
  p_fax varchar DEFAULT NULL,
  p_estado boolean DEFAULT NULL,
  p_user_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_row public.almacen%ROWTYPE;
BEGIN
  UPDATE public.almacen a
  SET
    almacen_ref = COALESCE(NULLIF(TRIM(p_almacen_ref), ''), a.almacen_ref),
    nombre = COALESCE(NULLIF(TRIM(p_nombre), ''), a.nombre),
    descripcion = COALESCE(p_descripcion, a.descripcion),
    direccion = COALESCE(p_direccion, a.direccion),
    codigo_postal = COALESCE(p_codigo_postal, a.codigo_postal),
    poblacion = COALESCE(p_poblacion, a.poblacion),
    id_pais = COALESCE(p_id_pais, a.id_pais),
    id_provincia = COALESCE(p_id_provincia, a.id_provincia),
    telefono = COALESCE(p_telefono, a.telefono),
    fax = COALESCE(p_fax, a.fax),
    estado = COALESCE(p_estado, a.estado),
    updated_by = COALESCE(p_user_id, a.updated_by),
    updated_at = now()
  WHERE a.id_almacen = p_id_almacen
    AND a.id_empresa = p_id_empresa
  RETURNING * INTO v_row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'almacen no encontrado';
  END IF;

  RETURN to_jsonb(v_row);
END;
$$;

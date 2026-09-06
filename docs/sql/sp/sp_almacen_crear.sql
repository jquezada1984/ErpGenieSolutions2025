-- Crea almacén. Retorna jsonb con la fila creada.
CREATE OR REPLACE FUNCTION sp_almacen_crear(
  p_id_empresa uuid,
  p_almacen_ref varchar,
  p_nombre varchar,
  p_descripcion text DEFAULT NULL,
  p_direccion text DEFAULT NULL,
  p_codigo_postal varchar DEFAULT NULL,
  p_poblacion varchar DEFAULT NULL,
  p_id_pais uuid DEFAULT NULL,
  p_id_provincia uuid DEFAULT NULL,
  p_telefono varchar DEFAULT NULL,
  p_fax varchar DEFAULT NULL,
  p_user_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_id uuid := gen_random_uuid();
  v_row public.almacen%ROWTYPE;
BEGIN
  IF p_id_empresa IS NULL THEN
    RAISE EXCEPTION 'id_empresa requerido';
  END IF;
  IF NULLIF(TRIM(p_almacen_ref), '') IS NULL THEN
    RAISE EXCEPTION 'almacen_ref requerido';
  END IF;
  IF NULLIF(TRIM(p_nombre), '') IS NULL THEN
    RAISE EXCEPTION 'nombre requerido';
  END IF;

  INSERT INTO public.almacen (
    id_almacen, id_empresa, almacen_ref, nombre, descripcion, direccion,
    codigo_postal, poblacion, id_pais, id_provincia, telefono, fax,
    created_by, updated_by, created_at, updated_at, estado
  ) VALUES (
    v_id, p_id_empresa, TRIM(p_almacen_ref), TRIM(p_nombre), p_descripcion, p_direccion,
    p_codigo_postal, p_poblacion, p_id_pais, p_id_provincia, p_telefono, p_fax,
    p_user_id, p_user_id, now(), now(), true
  )
  RETURNING * INTO v_row;

  RETURN to_jsonb(v_row);
END;
$$;

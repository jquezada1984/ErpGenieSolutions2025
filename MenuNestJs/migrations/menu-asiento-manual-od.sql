-- Menú: asiento manual + registro OD (operaciones varias)
-- Idempotente.

DO $$
DECLARE
  v_menu_padre uuid;
  v_transf uuid;
  v_registro uuid;
  v_empresa uuid := '47394bb3-717f-43dd-aebd-46a4acf93b36'; -- menú global típico; ajustar si aplica
BEGIN
  SELECT id_menu INTO v_menu_padre
  FROM menu
  WHERE ruta = '/contabilidad/asientos'
  LIMIT 1;

  IF v_menu_padre IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM menu WHERE ruta = '/contabilidad/asientos/nuevo'
  ) THEN
    INSERT INTO menu (
      id_menu, id_empresa, id_menu_padre, nombre, icono, ruta,
      es_hoja, orden, externo, activo, created_at
    ) VALUES (
      gen_random_uuid(),
      (SELECT id_empresa FROM menu WHERE id_menu = v_menu_padre),
      v_menu_padre,
      'Nuevo asiento',
      'bi bi-plus-circle',
      '/contabilidad/asientos/nuevo',
      true,
      1,
      false,
      true,
      now()
    );
  END IF;

  SELECT id_menu INTO v_registro
  FROM menu
  WHERE ruta = '/contabilidad/transferencia/registro'
  LIMIT 1;

  IF v_registro IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM menu WHERE ruta = '/contabilidad/transferencia/registro/varios'
  ) THEN
    INSERT INTO menu (
      id_menu, id_empresa, id_menu_padre, nombre, icono, ruta,
      es_hoja, orden, externo, activo, created_at
    ) VALUES (
      gen_random_uuid(),
      (SELECT id_empresa FROM menu WHERE id_menu = v_registro),
      v_registro,
      'Operaciones varias (OD)',
      'fas fa-exchange-alt',
      '/contabilidad/transferencia/registro/varios',
      true,
      4,
      false,
      true,
      now()
    );
  END IF;
END $$;

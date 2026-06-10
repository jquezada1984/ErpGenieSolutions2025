-- Modelo plan contable: país asociado (filtro UI)
ALTER TABLE modelo_plan_contable
  ADD COLUMN IF NOT EXISTS id_pais uuid REFERENCES pais(id_pais);

-- Empresa plantilla del sistema (catálogo global de cuentas EC-SUPERCIAS)
INSERT INTO empresa (id_empresa, nombre, ruc, estado, id_pais)
VALUES (
  'a0000000-0000-4000-8000-000000000001',
  'SISTEMA - Plantilla contable',
  'PLANTILLA0000',
  false,
  'd4882144-caf7-46e8-8f72-4378a29a7ff7'
)
ON CONFLICT (id_empresa) DO NOTHING;

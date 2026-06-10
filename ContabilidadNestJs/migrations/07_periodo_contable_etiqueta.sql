-- Periodo contable: columna etiqueta para la UI
ALTER TABLE periodo_contable
  ADD COLUMN IF NOT EXISTS etiqueta VARCHAR(100);

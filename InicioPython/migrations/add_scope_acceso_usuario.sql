-- Añade alcance multiempresa al usuario (coherente con docs/BaseDatos.sql)
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS scope_acceso VARCHAR(20) NOT NULL DEFAULT 'EMPRESA';

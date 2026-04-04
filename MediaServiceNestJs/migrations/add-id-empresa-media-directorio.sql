-- Multiempresa: columnas opcionales id_empresa (PostgreSQL UUID)
-- Ejecutar manualmente o vía pipeline de despliegue.

ALTER TABLE media ADD COLUMN IF NOT EXISTS id_empresa UUID NULL;
ALTER TABLE directorio_documento ADD COLUMN IF NOT EXISTS id_empresa UUID NULL;

-- Si en el futuro existe tabla empresa con PK id_empresa, descomentar:
-- ALTER TABLE media
--   ADD CONSTRAINT fk_media_id_empresa FOREIGN KEY (id_empresa) REFERENCES empresa (id_empresa);
-- ALTER TABLE directorio_documento
--   ADD CONSTRAINT fk_directorio_documento_id_empresa FOREIGN KEY (id_empresa) REFERENCES empresa (id_empresa);

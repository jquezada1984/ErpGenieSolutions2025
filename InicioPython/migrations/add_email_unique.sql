-- Migración para agregar restricción única al campo email
-- Ejecutar este script en la base de datos para agregar la restricción

-- Agregar restricción única al campo email
ALTER TABLE empresa ADD CONSTRAINT uk_empresa_email UNIQUE (email);

-- Verificar que la restricción se agregó correctamente
-- SELECT constraint_name, constraint_type 
-- FROM information_schema.table_constraints 
-- WHERE table_name = 'empresa' AND constraint_type = 'UNIQUE'; 
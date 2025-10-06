-- Migración para agregar la columna parent_id a la tabla menu_item
-- Esta migración permite crear la estructura jerárquica del menú

-- Verificar si la columna parent_id ya existe
DO $$
BEGIN
    -- Agregar la columna parent_id si no existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'menu_item' 
        AND column_name = 'parent_id'
    ) THEN
        ALTER TABLE menu_item 
        ADD COLUMN parent_id UUID NULL;
        
        -- Agregar comentario a la columna
        COMMENT ON COLUMN menu_item.parent_id IS 'ID del item padre para crear estructura jerárquica del menú';
        
        -- Crear índice para mejorar el rendimiento de las consultas jerárquicas
        CREATE INDEX idx_menu_item_parent_id ON menu_item(parent_id);
        
        RAISE NOTICE 'Columna parent_id agregada exitosamente a la tabla menu_item';
    ELSE
        RAISE NOTICE 'La columna parent_id ya existe en la tabla menu_item';
    END IF;
END $$;

-- Verificar la estructura de la tabla
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'menu_item' 
ORDER BY ordinal_position;

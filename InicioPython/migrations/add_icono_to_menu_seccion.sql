-- Agregar campo icono a la tabla menu_seccion
ALTER TABLE public.menu_seccion 
ADD COLUMN IF NOT EXISTS icono character varying(100);

-- Comentario para el campo
COMMENT ON COLUMN public.menu_seccion.icono IS 'Icono de la sección del menú (ej: bi bi-list-ul)'; 
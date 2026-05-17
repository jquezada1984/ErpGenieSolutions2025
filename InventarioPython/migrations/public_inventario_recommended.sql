-- Referencia recomendada para public.inventario (PostgreSQL).
-- NO ejecutar automáticamente: revisar contra la base ya desplegada y ajustar migraciones formales si aplica.

CREATE TABLE IF NOT EXISTS public.inventario (
    id_inventario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_empresa UUID NOT NULL,
    inventario_ref VARCHAR(100) NOT NULL,
    etiqueta VARCHAR(255) NOT NULL,
    id_almacen UUID NOT NULL,
    estado_inventario VARCHAR(30) NOT NULL DEFAULT 'ABIERTO',
    fecha_inicio TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    fecha_cierre TIMESTAMP WITHOUT TIME ZONE,
    observacion TEXT,
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    estado BOOLEAN NOT NULL DEFAULT true
);

-- Unicidad (id_empresa, inventario_ref): validar si ya existe en producción; la app también valida duplicados en InventarioPython.

COMMENT ON COLUMN public.inventario.estado IS 'Activo/inactivo cabecera (UI switch).';
COMMENT ON COLUMN public.inventario.estado_inventario IS 'Estado de negocio: ABIERTO, BORRADOR, CERRADO.';

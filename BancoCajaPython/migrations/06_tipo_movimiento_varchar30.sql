-- Ampliar tipo_movimiento: 'transferencia_bancaria' (22) y 'transferencia_entrada' (21)
-- no caben en varchar(20). Ejecutar en pgAdmin/Supabase.

ALTER TABLE public.transferencia_bancaria
    ALTER COLUMN tipo_movimiento TYPE character varying(30);

ALTER TABLE public.movimiento_bancario
    ALTER COLUMN tipo_movimiento TYPE character varying(30);

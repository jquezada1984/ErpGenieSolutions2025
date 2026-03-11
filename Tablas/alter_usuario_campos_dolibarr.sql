-- Script para ampliar public.usuario con campos tipo Dolibarr (formulario Nuevo Usuario).
-- Ejecutar sobre la base de datos después de tener creada la tabla usuario.
-- Si alguna columna ya existe, comentar o omitir la línea correspondiente.

-- Bloque 1: Datos de usuario (Nuevo Usuario - primera sección)
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS titulo_cortesia character varying(20);
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS apellidos character varying(100);
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS nombre character varying(100);
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS administrador_sistema boolean DEFAULT false;
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS sexo character varying(1); -- 'M','F','O' o NULL
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS es_empleado boolean DEFAULT false;
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS id_supervisor uuid REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS id_validador_gastos uuid REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS id_validador_dias_libres uuid REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS usuario_externo boolean DEFAULT false;
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS fecha_validez_desde date;
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS fecha_validez_hasta date;

-- Bloque 2: Contacto y ubicación
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS direccion character varying(255);
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS codigo_postal character varying(20);
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS poblacion character varying(100);
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS id_pais uuid REFERENCES public.pais(id_pais) ON DELETE SET NULL;
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS id_provincia uuid REFERENCES public.provincia(id_provincia) ON DELETE SET NULL;
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS telefono_trabajo character varying(30);
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS movil character varying(30);
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS fax character varying(30);

-- Bloque 3: Administrativo / personalización
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS codigo_contable character varying(50);
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS color character varying(20);
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS etiquetas_categorias character varying(255);
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS idioma_default character varying(10);

-- Bloque 4: Firma y notas (texto/HTML)
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS firma text;
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS nota_publica text;
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS nota_privada text;

-- Bloque 5: Empleo / laboral
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS puesto_trabajo character varying(100);
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS tasa_hora numeric(12,2);
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS tasa_dia numeric(12,2);
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS salario numeric(14,2);
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS horas_semana numeric(5,2);
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS fecha_empleo_desde date;
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS fecha_empleo_hasta date;
ALTER TABLE public.usuario ADD COLUMN IF NOT EXISTS fecha_nacimiento date;

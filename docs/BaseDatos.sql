--
-- PostgreSQL database dump
--
-- *** DESACTUALIZADO (2026-08): la BD viva tiene tablas/columnas no presentes aquí,
-- especialmente cambio_masivo_stock, cambio_masivo_stock_detalle y almacen.id_provincia.
-- Ver docs/sql/almacenes_v1_schema_ref.sql y docs/planes/PLAN_KARDEX_STOCK_MULTIEMPRESA.md
--

\restrict BTEYt4MfUyaawkJPoaqDZ5MecMOObXVGPVUU1wP2n005rLdlJt4afdOCJHGCyhW

-- Dumped from database version 17.4
-- Dumped by pg_dump version 18.2

-- Started on 2026-04-26 18:42:14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 16 (class 2615 OID 16492)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- TOC entry 12 (class 2615 OID 16388)
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- TOC entry 15 (class 2615 OID 16622)
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- TOC entry 14 (class 2615 OID 16611)
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- TOC entry 10 (class 2615 OID 16386)
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- TOC entry 8 (class 2615 OID 16603)
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- TOC entry 17 (class 2615 OID 16540)
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- TOC entry 13 (class 2615 OID 16651)
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- TOC entry 4 (class 3079 OID 16389)
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- TOC entry 5780 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- TOC entry 2 (class 3079 OID 16441)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- TOC entry 5781 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 5 (class 3079 OID 16652)
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- TOC entry 5782 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- TOC entry 3 (class 3079 OID 16430)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- TOC entry 5783 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 1194 (class 1247 OID 16780)
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- TOC entry 1220 (class 1247 OID 16921)
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- TOC entry 1191 (class 1247 OID 16774)
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- TOC entry 1188 (class 1247 OID 16769)
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1383 (class 1247 OID 94200)
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- TOC entry 1395 (class 1247 OID 94273)
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1304 (class 1247 OID 78671)
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1386 (class 1247 OID 94210)
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1226 (class 1247 OID 16963)
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1526 (class 1247 OID 106324)
-- Name: estado_cuenta_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_cuenta_enum AS ENUM (
    'abierta',
    'cerrada'
);


ALTER TYPE public.estado_cuenta_enum OWNER TO postgres;

--
-- TOC entry 1523 (class 1247 OID 106312)
-- Name: tipo_cuenta_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_cuenta_enum AS ENUM (
    'corriente',
    'ahorros',
    'caja',
    'tarjeta_credito',
    'otro'
);


ALTER TYPE public.tipo_cuenta_enum OWNER TO postgres;

--
-- TOC entry 1280 (class 1247 OID 17135)
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- TOC entry 1235 (class 1247 OID 17010)
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- TOC entry 1238 (class 1247 OID 17025)
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- TOC entry 1286 (class 1247 OID 17176)
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- TOC entry 1283 (class 1247 OID 17147)
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- TOC entry 1452 (class 1247 OID 53236)
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- TOC entry 469 (class 1255 OID 16538)
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- TOC entry 5784 (class 0 OID 0)
-- Dependencies: 469
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- TOC entry 481 (class 1255 OID 16751)
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- TOC entry 468 (class 1255 OID 16537)
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- TOC entry 5787 (class 0 OID 0)
-- Dependencies: 468
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- TOC entry 467 (class 1255 OID 16536)
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- TOC entry 5789 (class 0 OID 0)
-- Dependencies: 467
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- TOC entry 470 (class 1255 OID 16595)
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- TOC entry 5805 (class 0 OID 0)
-- Dependencies: 470
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- TOC entry 474 (class 1255 OID 16616)
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- TOC entry 5807 (class 0 OID 0)
-- Dependencies: 474
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- TOC entry 471 (class 1255 OID 16597)
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- TOC entry 5809 (class 0 OID 0)
-- Dependencies: 471
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- TOC entry 472 (class 1255 OID 16607)
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- TOC entry 473 (class 1255 OID 16608)
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- TOC entry 475 (class 1255 OID 16618)
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- TOC entry 5838 (class 0 OID 0)
-- Dependencies: 475
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- TOC entry 525 (class 1255 OID 240639)
-- Name: graphql(text, text, jsonb, jsonb); Type: FUNCTION; Schema: graphql_public; Owner: supabase_admin
--

CREATE FUNCTION graphql_public.graphql("operationName" text DEFAULT NULL::text, query text DEFAULT NULL::text, variables jsonb DEFAULT NULL::jsonb, extensions jsonb DEFAULT NULL::jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;


ALTER FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) OWNER TO supabase_admin;

--
-- TOC entry 417 (class 1255 OID 16387)
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- TOC entry 514 (class 1255 OID 216439)
-- Name: balance_comprobacion(uuid, date, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.balance_comprobacion(p_empresa_id uuid, p_fecha_desde date, p_fecha_hasta date) RETURNS TABLE(cuenta_id uuid, codigo character varying, nombre character varying, tipo character varying, naturaleza character varying, total_debe numeric, total_haber numeric, saldo numeric)
    LANGUAGE sql STABLE
    AS $$
  SELECT
    c.id_cuenta_contable AS cuenta_id,
    c.codigo,
    c.nombre,
    c.tipo_cuenta AS tipo,
    CASE
      WHEN c.tipo_cuenta IN ('ACTIVO', 'GASTO', 'COSTO') THEN 'DEUDORA'
      ELSE 'ACREEDORA'
    END AS naturaleza,
    COALESCE(SUM(m.debe), 0)::NUMERIC(15,2)   AS total_debe,
    COALESCE(SUM(m.haber), 0)::NUMERIC(15,2)  AS total_haber,
    CASE
      WHEN c.tipo_cuenta IN ('ACTIVO', 'GASTO', 'COSTO') THEN (COALESCE(SUM(m.debe), 0) - COALESCE(SUM(m.haber), 0))::NUMERIC(15,2)
      ELSE (COALESCE(SUM(m.haber), 0) - COALESCE(SUM(m.debe), 0))::NUMERIC(15,2)
    END AS saldo
  FROM public.cuenta_contable c
  INNER JOIN public.movimiento_contable m ON m.id_cuenta_contable = c.id_cuenta_contable
  INNER JOIN public.asiento_contable a    ON a.id_asiento_contable = m.id_asiento_contable
  WHERE a.id_empresa = p_empresa_id
    AND a.estado = 'APROBADO'
    AND a.fecha_asiento >= p_fecha_desde
    AND a.fecha_asiento <= p_fecha_hasta
  GROUP BY c.id_cuenta_contable, c.codigo, c.nombre, c.tipo_cuenta
  ORDER BY c.codigo;
$$;


ALTER FUNCTION public.balance_comprobacion(p_empresa_id uuid, p_fecha_desde date, p_fecha_hasta date) OWNER TO postgres;

--
-- TOC entry 5852 (class 0 OID 0)
-- Dependencies: 514
-- Name: FUNCTION balance_comprobacion(p_empresa_id uuid, p_fecha_desde date, p_fecha_hasta date); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.balance_comprobacion(p_empresa_id uuid, p_fecha_desde date, p_fecha_hasta date) IS 'Balance de comprobación por empresa y rango de fechas (solo asientos APROBADO)';


--
-- TOC entry 517 (class 1255 OID 216443)
-- Name: balance_general_saldos(uuid, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.balance_general_saldos(p_empresa_id uuid, p_fecha_corte date) RETURNS TABLE(tipo_cuenta character varying, saldo numeric)
    LANGUAGE sql STABLE
    AS $$
  WITH movimientos_aprobados AS (
    SELECT
      c.tipo_cuenta,
      m.debe,
      m.haber
    FROM public.movimiento_contable m
    INNER JOIN public.asiento_contable a ON a.id_asiento_contable = m.id_asiento_contable
    INNER JOIN public.cuenta_contable c ON c.id_cuenta_contable = m.id_cuenta_contable
    WHERE a.id_empresa = p_empresa_id
      AND a.estado = 'APROBADO'
      AND a.fecha_asiento <= p_fecha_corte
  ),
  por_tipo AS (
    SELECT
      tipo_cuenta,
      CASE
        WHEN tipo_cuenta = 'ACTIVO'     THEN SUM(debe - haber)
        WHEN tipo_cuenta IN ('PASIVO','PATRIMONIO') THEN SUM(haber - debe)
        ELSE 0
      END AS saldo
    FROM movimientos_aprobados
    WHERE tipo_cuenta IN ('ACTIVO','PASIVO','PATRIMONIO')
    GROUP BY tipo_cuenta
  )
  SELECT tipo_cuenta::VARCHAR(50), saldo::NUMERIC(15,2) FROM por_tipo
  ORDER BY tipo_cuenta;
$$;


ALTER FUNCTION public.balance_general_saldos(p_empresa_id uuid, p_fecha_corte date) OWNER TO postgres;

--
-- TOC entry 5854 (class 0 OID 0)
-- Dependencies: 517
-- Name: FUNCTION balance_general_saldos(p_empresa_id uuid, p_fecha_corte date); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.balance_general_saldos(p_empresa_id uuid, p_fecha_corte date) IS 'Saldos por tipo de cuenta para Balance General a fecha de corte (solo asientos APROBADO)';


--
-- TOC entry 516 (class 1255 OID 216441)
-- Name: estado_resultados(integer, date, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.estado_resultados(p_empresa_id integer, p_fecha_desde date, p_fecha_hasta date) RETURNS TABLE(tipo_cuenta character varying, total numeric, resultado numeric)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
  v_ingresos NUMERIC(15,2) := 0;
  v_gastos   NUMERIC(15,2) := 0;
BEGIN
  -- Ingresos: cuentas tipo INGRESO -> (credit - debit)
  SELECT COALESCE(SUM(m.haber - m.debe), 0) INTO v_ingresos
  FROM movimiento_contable m
  INNER JOIN asiento_contable a ON a.id = m.asiento_contable_id
  INNER JOIN cuenta_contable c ON c.id = m.cuenta_contable_id
  WHERE a.empresa_id = p_empresa_id
    AND a.estado = 'APROBADO'
    AND a.fecha >= p_fecha_desde
    AND a.fecha <= p_fecha_hasta
    AND c.tipo = 'INGRESO';

  -- Gastos: cuentas tipo GASTO -> (debit - credit)
  SELECT COALESCE(SUM(m.debe - m.haber), 0) INTO v_gastos
  FROM movimiento_contable m
  INNER JOIN asiento_contable a ON a.id = m.asiento_contable_id
  INNER JOIN cuenta_contable c ON c.id = m.cuenta_contable_id
  WHERE a.empresa_id = p_empresa_id
    AND a.estado = 'APROBADO'
    AND a.fecha >= p_fecha_desde
    AND a.fecha <= p_fecha_hasta
    AND c.tipo = 'GASTO';

  tipo_cuenta := 'INGRESO';
  total       := v_ingresos;
  resultado   := NULL;
  RETURN NEXT;

  tipo_cuenta := 'GASTO';
  total       := v_gastos;
  resultado   := NULL;
  RETURN NEXT;

  tipo_cuenta := 'RESULTADO';
  total       := v_ingresos - v_gastos;
  resultado   := v_ingresos - v_gastos;
  RETURN NEXT;
END;
$$;


ALTER FUNCTION public.estado_resultados(p_empresa_id integer, p_fecha_desde date, p_fecha_hasta date) OWNER TO postgres;

--
-- TOC entry 5856 (class 0 OID 0)
-- Dependencies: 516
-- Name: FUNCTION estado_resultados(p_empresa_id integer, p_fecha_desde date, p_fecha_hasta date); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.estado_resultados(p_empresa_id integer, p_fecha_desde date, p_fecha_hasta date) IS 'Estado de resultados: ingresos, gastos y resultado del periodo (solo asientos APROBADO)';


--
-- TOC entry 515 (class 1255 OID 216440)
-- Name: libro_mayor(integer, integer, date, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.libro_mayor(p_empresa_id integer, p_cuenta_id integer, p_fecha_desde date, p_fecha_hasta date) RETURNS TABLE(asiento_id integer, numero character varying, fecha date, concepto character varying, debe numeric, haber numeric, saldo_acum numeric)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
  v_naturaleza VARCHAR(15);
  v_saldo      NUMERIC(15,2) := 0;
  r            RECORD;
BEGIN
  SELECT c.naturaleza INTO v_naturaleza
  FROM cuenta_contable c
  WHERE c.id = p_cuenta_id;

  IF v_naturaleza IS NULL THEN
    RETURN;
  END IF;

  FOR r IN
    SELECT
      a.id AS asiento_id,
      a.numero,
      a.fecha,
      a.concepto,
      m.debe,
      m.haber
    FROM movimiento_contable m
    INNER JOIN asiento_contable a ON a.id = m.asiento_contable_id
    WHERE m.cuenta_contable_id = p_cuenta_id
      AND a.empresa_id = p_empresa_id
      AND a.estado = 'APROBADO'
      AND a.fecha >= p_fecha_desde
      AND a.fecha <= p_fecha_hasta
    ORDER BY a.fecha ASC, a.numero ASC
  LOOP
    IF v_naturaleza = 'DEUDORA' THEN
      v_saldo := v_saldo + (r.debe - r.haber);
    ELSE
      v_saldo := v_saldo + (r.haber - r.debe);
    END IF;

    asiento_id := r.asiento_id;
    numero     := r.numero;
    fecha      := r.fecha;
    concepto   := r.concepto;
    debe       := r.debe;
    haber      := r.haber;
    saldo_acum := v_saldo;
    RETURN NEXT;
  END LOOP;
END;
$$;


ALTER FUNCTION public.libro_mayor(p_empresa_id integer, p_cuenta_id integer, p_fecha_desde date, p_fecha_hasta date) OWNER TO postgres;

--
-- TOC entry 5858 (class 0 OID 0)
-- Dependencies: 515
-- Name: FUNCTION libro_mayor(p_empresa_id integer, p_cuenta_id integer, p_fecha_desde date, p_fecha_hasta date); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.libro_mayor(p_empresa_id integer, p_cuenta_id integer, p_fecha_desde date, p_fecha_hasta date) IS 'Libro mayor por cuenta: movimientos con saldo acumulado (solo asientos APROBADO)';


--
-- TOC entry 513 (class 1255 OID 216436)
-- Name: obtener_siguiente_numero_asiento(integer, character varying, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.obtener_siguiente_numero_asiento(p_empresa_id integer, p_prefijo character varying DEFAULT 'GEN'::character varying, p_fecha date DEFAULT CURRENT_DATE) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_anio     INTEGER := EXTRACT(YEAR FROM p_fecha)::INTEGER;
  v_mes      INTEGER := EXTRACT(MONTH FROM p_fecha)::INTEGER;
  v_next     INTEGER;
  v_numero   VARCHAR(30);
BEGIN
  -- Bloqueo de fila para evitar race conditions
  INSERT INTO secuencia_asiento (empresa_id, prefijo_diario, anio, mes, valor_actual, updated_at)
  VALUES (p_empresa_id, UPPER(TRIM(p_prefijo)), v_anio, v_mes, 1, CURRENT_TIMESTAMP)
  ON CONFLICT (empresa_id, prefijo_diario, anio, mes)
  DO UPDATE SET
    valor_actual = secuencia_asiento.valor_actual + 1,
    updated_at   = CURRENT_TIMESTAMP
  RETURNING valor_actual INTO v_next;

  v_numero := UPPER(TRIM(p_prefijo)) || '-' || v_anio::TEXT || '-' ||
              LPAD(v_mes::TEXT, 2, '0') || '-' ||
              LPAD(v_next::TEXT, 6, '0');

  RETURN v_numero;
END;
$$;


ALTER FUNCTION public.obtener_siguiente_numero_asiento(p_empresa_id integer, p_prefijo character varying, p_fecha date) OWNER TO postgres;

--
-- TOC entry 5860 (class 0 OID 0)
-- Dependencies: 513
-- Name: FUNCTION obtener_siguiente_numero_asiento(p_empresa_id integer, p_prefijo character varying, p_fecha date); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.obtener_siguiente_numero_asiento(p_empresa_id integer, p_prefijo character varying, p_fecha date) IS 'Genera número único de asiento por empresa/diario/periodo con bloqueo transaccional';


--
-- TOC entry 512 (class 1255 OID 208605)
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

--
-- TOC entry 510 (class 1255 OID 106395)
-- Name: trg_heredar_empresa_movimiento(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trg_heredar_empresa_movimiento() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.id_empresa IS NULL THEN
    SELECT id_empresa
      INTO NEW.id_empresa
      FROM cuenta_financiera
     WHERE id_cuenta_financiera = NEW.id_cuenta_financiera;
  END IF;
  RETURN NEW;
END$$;


ALTER FUNCTION public.trg_heredar_empresa_movimiento() OWNER TO postgres;

--
-- TOC entry 511 (class 1255 OID 106397)
-- Name: trg_insertar_saldo_inicial(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trg_insertar_saldo_inicial() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF COALESCE(NEW.saldo_inicial, 0) <> 0 THEN
    INSERT INTO movimiento_cuenta (id_movimiento_cuenta, id_empresa, id_cuenta_financiera, fecha_movimiento, descripcion, importe)
    VALUES (gen_random_uuid(), NEW.id_empresa, NEW.id_cuenta_financiera,
            COALESCE(NEW.fecha_inicial, CURRENT_DATE),
            'Saldo inicial', NEW.saldo_inicial);
  END IF;
  RETURN NEW;
END$$;


ALTER FUNCTION public.trg_insertar_saldo_inicial() OWNER TO postgres;

--
-- TOC entry 509 (class 1255 OID 106375)
-- Name: trg_touch_actualizado_en(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trg_touch_actualizado_en() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.actualizado_en := NOW();
  RETURN NEW;
END$$;


ALTER FUNCTION public.trg_touch_actualizado_en() OWNER TO postgres;

--
-- TOC entry 495 (class 1255 OID 17169)
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_
        -- Filter by action early - only get subscriptions interested in this action
        -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
        and (subs.action_filter = '*' or subs.action_filter = action::text);

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- TOC entry 500 (class 1255 OID 17248)
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- TOC entry 497 (class 1255 OID 17181)
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- TOC entry 493 (class 1255 OID 17131)
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- TOC entry 492 (class 1255 OID 17126)
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- TOC entry 496 (class 1255 OID 17177)
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- TOC entry 524 (class 1255 OID 238331)
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS TABLE(wal jsonb, is_rls_enabled boolean, subscription_ids uuid[], errors text[], slot_changes_count bigint)
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
  WITH pub AS (
    SELECT
      concat_ws(
        ',',
        CASE WHEN bool_or(pubinsert) THEN 'insert' ELSE NULL END,
        CASE WHEN bool_or(pubupdate) THEN 'update' ELSE NULL END,
        CASE WHEN bool_or(pubdelete) THEN 'delete' ELSE NULL END
      ) AS w2j_actions,
      coalesce(
        string_agg(
          realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
          ','
        ) filter (WHERE ppt.tablename IS NOT NULL AND ppt.tablename NOT LIKE '% %'),
        ''
      ) AS w2j_add_tables
    FROM pg_publication pp
    LEFT JOIN pg_publication_tables ppt ON pp.pubname = ppt.pubname
    WHERE pp.pubname = publication
    GROUP BY pp.pubname
    LIMIT 1
  ),
  -- MATERIALIZED ensures pg_logical_slot_get_changes is called exactly once
  w2j AS MATERIALIZED (
    SELECT x.*, pub.w2j_add_tables
    FROM pub,
         pg_logical_slot_get_changes(
           slot_name, null, max_changes,
           'include-pk', 'true',
           'include-transaction', 'false',
           'include-timestamp', 'true',
           'include-type-oids', 'true',
           'format-version', '2',
           'actions', pub.w2j_actions,
           'add-tables', pub.w2j_add_tables
         ) x
  ),
  -- Count raw slot entries before apply_rls/subscription filter
  slot_count AS (
    SELECT count(*)::bigint AS cnt
    FROM w2j
    WHERE w2j.w2j_add_tables <> ''
  ),
  -- Apply RLS and filter as before
  rls_filtered AS (
    SELECT xyz.wal, xyz.is_rls_enabled, xyz.subscription_ids, xyz.errors
    FROM w2j,
         realtime.apply_rls(
           wal := w2j.data::jsonb,
           max_record_bytes := max_record_bytes
         ) xyz(wal, is_rls_enabled, subscription_ids, errors)
    WHERE w2j.w2j_add_tables <> ''
      AND xyz.subscription_ids[1] IS NOT NULL
  )
  -- Real rows with slot count attached
  SELECT rf.wal, rf.is_rls_enabled, rf.subscription_ids, rf.errors, sc.cnt
  FROM rls_filtered rf, slot_count sc

  UNION ALL

  -- Sentinel row: always returned when no real rows exist so Elixir can
  -- always read slot_changes_count. Identified by wal IS NULL.
  SELECT null, null, null, null, sc.cnt
  FROM slot_count sc
  WHERE NOT EXISTS (SELECT 1 FROM rls_filtered)
$$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- TOC entry 491 (class 1255 OID 17125)
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- TOC entry 499 (class 1255 OID 17247)
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- TOC entry 490 (class 1255 OID 17123)
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- TOC entry 494 (class 1255 OID 17158)
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- TOC entry 498 (class 1255 OID 17241)
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- TOC entry 523 (class 1255 OID 238330)
-- Name: allow_any_operation(text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_any_operation(expected_operations text[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT CASE
      WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
      ELSE raw_operation
    END AS current_operation
    FROM current_operation
  )
  SELECT EXISTS (
    SELECT 1
    FROM normalized n
    CROSS JOIN LATERAL unnest(expected_operations) AS expected_operation
    WHERE expected_operation IS NOT NULL
      AND expected_operation <> ''
      AND n.current_operation = CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END
  );
$$;


ALTER FUNCTION storage.allow_any_operation(expected_operations text[]) OWNER TO supabase_storage_admin;

--
-- TOC entry 522 (class 1255 OID 238329)
-- Name: allow_only_operation(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_only_operation(expected_operation text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT
      CASE
        WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
        ELSE raw_operation
      END AS current_operation,
      CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END AS requested_operation
    FROM current_operation
  )
  SELECT CASE
    WHEN requested_operation IS NULL OR requested_operation = '' THEN FALSE
    ELSE COALESCE(current_operation = requested_operation, FALSE)
  END
  FROM normalized;
$$;


ALTER FUNCTION storage.allow_only_operation(expected_operation text) OWNER TO supabase_storage_admin;

--
-- TOC entry 487 (class 1255 OID 17067)
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- TOC entry 508 (class 1255 OID 84218)
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


ALTER FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- TOC entry 506 (class 1255 OID 53233)
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- TOC entry 484 (class 1255 OID 17041)
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 483 (class 1255 OID 17040)
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 482 (class 1255 OID 17039)
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 518 (class 1255 OID 231533)
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


ALTER FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) OWNER TO supabase_storage_admin;

--
-- TOC entry 501 (class 1255 OID 53196)
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 502 (class 1255 OID 53212)
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION storage.get_prefix(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 503 (class 1255 OID 53213)
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION storage.get_prefixes(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 505 (class 1255 OID 53231)
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- TOC entry 488 (class 1255 OID 17106)
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- TOC entry 519 (class 1255 OID 231534)
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text) OWNER TO supabase_storage_admin;

--
-- TOC entry 489 (class 1255 OID 17122)
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- TOC entry 521 (class 1255 OID 231539)
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.protect_delete() OWNER TO supabase_storage_admin;

--
-- TOC entry 485 (class 1255 OID 17056)
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- TOC entry 520 (class 1255 OID 231537)
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) OWNER TO supabase_storage_admin;

--
-- TOC entry 504 (class 1255 OID 53229)
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- TOC entry 507 (class 1255 OID 84216)
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- TOC entry 486 (class 1255 OID 17057)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 257 (class 1259 OID 16523)
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- TOC entry 5881 (class 0 OID 0)
-- Dependencies: 257
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- TOC entry 368 (class 1259 OID 211933)
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


ALTER TABLE auth.custom_oauth_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 273 (class 1259 OID 16925)
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- TOC entry 5884 (class 0 OID 0)
-- Dependencies: 273
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- TOC entry 264 (class 1259 OID 16723)
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- TOC entry 5886 (class 0 OID 0)
-- Dependencies: 264
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- TOC entry 5887 (class 0 OID 0)
-- Dependencies: 264
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- TOC entry 256 (class 1259 OID 16516)
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- TOC entry 5889 (class 0 OID 0)
-- Dependencies: 256
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- TOC entry 268 (class 1259 OID 16812)
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- TOC entry 5891 (class 0 OID 0)
-- Dependencies: 268
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- TOC entry 267 (class 1259 OID 16800)
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- TOC entry 5893 (class 0 OID 0)
-- Dependencies: 267
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- TOC entry 266 (class 1259 OID 16787)
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- TOC entry 5895 (class 0 OID 0)
-- Dependencies: 266
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- TOC entry 5896 (class 0 OID 0)
-- Dependencies: 266
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- TOC entry 327 (class 1259 OID 94213)
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- TOC entry 365 (class 1259 OID 144205)
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- TOC entry 5899 (class 0 OID 0)
-- Dependencies: 365
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- TOC entry 315 (class 1259 OID 78675)
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- TOC entry 328 (class 1259 OID 94246)
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- TOC entry 274 (class 1259 OID 16975)
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- TOC entry 255 (class 1259 OID 16505)
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- TOC entry 5904 (class 0 OID 0)
-- Dependencies: 255
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- TOC entry 254 (class 1259 OID 16504)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- TOC entry 5906 (class 0 OID 0)
-- Dependencies: 254
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- TOC entry 271 (class 1259 OID 16854)
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 5908 (class 0 OID 0)
-- Dependencies: 271
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- TOC entry 272 (class 1259 OID 16872)
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- TOC entry 5910 (class 0 OID 0)
-- Dependencies: 272
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- TOC entry 258 (class 1259 OID 16531)
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- TOC entry 5912 (class 0 OID 0)
-- Dependencies: 258
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- TOC entry 265 (class 1259 OID 16753)
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- TOC entry 5914 (class 0 OID 0)
-- Dependencies: 265
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- TOC entry 5915 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- TOC entry 5916 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- TOC entry 5917 (class 0 OID 0)
-- Dependencies: 265
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- TOC entry 270 (class 1259 OID 16839)
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- TOC entry 5919 (class 0 OID 0)
-- Dependencies: 270
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- TOC entry 269 (class 1259 OID 16830)
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 5921 (class 0 OID 0)
-- Dependencies: 269
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- TOC entry 5922 (class 0 OID 0)
-- Dependencies: 269
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- TOC entry 253 (class 1259 OID 16493)
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- TOC entry 5924 (class 0 OID 0)
-- Dependencies: 253
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- TOC entry 5925 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- TOC entry 399 (class 1259 OID 232677)
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


ALTER TABLE auth.webauthn_challenges OWNER TO supabase_auth_admin;

--
-- TOC entry 398 (class 1259 OID 232654)
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


ALTER TABLE auth.webauthn_credentials OWNER TO supabase_auth_admin;

--
-- TOC entry 375 (class 1259 OID 220931)
-- Name: almacen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.almacen (
    id_almacen uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    almacen_ref character varying(100) NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text,
    direccion text,
    codigo_postal character varying(20),
    poblacion character varying(200),
    id_pais uuid,
    telefono character varying(30),
    fax character varying(30),
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    estado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.almacen OWNER TO postgres;

--
-- TOC entry 332 (class 1259 OID 98859)
-- Name: asiento_contable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asiento_contable (
    id_asiento_contable uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_diario_contable uuid NOT NULL,
    numero_asiento character varying(50) NOT NULL,
    fecha_asiento date NOT NULL,
    concepto text NOT NULL,
    referencia character varying(100),
    total_debe numeric(15,2) NOT NULL,
    total_haber numeric(15,2) NOT NULL,
    estado character varying(20) DEFAULT 'BORRADOR'::character varying,
    id_usuario_creacion uuid,
    id_usuario_aprobacion uuid,
    created_at timestamp without time zone DEFAULT now(),
    fecha_aprobacion timestamp without time zone,
    updated_at timestamp without time zone DEFAULT now(),
    reversed_entry_id uuid
);


ALTER TABLE public.asiento_contable OWNER TO postgres;

--
-- TOC entry 5932 (class 0 OID 0)
-- Dependencies: 332
-- Name: COLUMN asiento_contable.reversed_entry_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.asiento_contable.reversed_entry_id IS 'ID del asiento reverso que invirtió este asiento (solo cuando estado = REVERSED)';


--
-- TOC entry 394 (class 1259 OID 228127)
-- Name: banco; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.banco (
    id_banco uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre character varying(150) NOT NULL,
    codigo character varying(30),
    swift character varying(20),
    web character varying(200),
    estado boolean DEFAULT true NOT NULL,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.banco OWNER TO postgres;

--
-- TOC entry 386 (class 1259 OID 222344)
-- Name: categoria_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoria_item (
    id_categoria_item uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    codigo character varying(50),
    nombre character varying(100) NOT NULL,
    descripcion text,
    id_categoria_padre uuid,
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.categoria_item OWNER TO postgres;

--
-- TOC entry 357 (class 1259 OID 99533)
-- Name: centro_costo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.centro_costo (
    id_centro_costo uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.centro_costo OWNER TO postgres;

--
-- TOC entry 360 (class 1259 OID 99593)
-- Name: cierre_contable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cierre_contable (
    id_cierre_contable uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_periodo_contable uuid NOT NULL,
    tipo_cierre character varying(20) NOT NULL,
    fecha_cierre timestamp without time zone DEFAULT now(),
    id_usuario_cierre uuid NOT NULL,
    observaciones text,
    estado character varying(20) DEFAULT 'PROCESANDO'::character varying
);


ALTER TABLE public.cierre_contable OWNER TO postgres;

--
-- TOC entry 329 (class 1259 OID 98790)
-- Name: cierre_cuenta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cierre_cuenta (
    id_cierre_cuenta uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_periodo_contable uuid NOT NULL,
    id_cuenta_contable uuid NOT NULL,
    saldo_debe numeric(15,2) DEFAULT 0,
    saldo_haber numeric(15,2) DEFAULT 0,
    saldo_final numeric(15,2) DEFAULT 0,
    fecha_cierre timestamp without time zone DEFAULT now(),
    id_usuario_cierre uuid
);


ALTER TABLE public.cierre_cuenta OWNER TO postgres;

--
-- TOC entry 372 (class 1259 OID 219784)
-- Name: ciudad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ciudad (
    id_ciudad uuid DEFAULT gen_random_uuid() NOT NULL,
    id_provincia uuid NOT NULL,
    nombre character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ciudad OWNER TO postgres;

--
-- TOC entry 349 (class 1259 OID 99318)
-- Name: conciliacion_bancaria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conciliacion_bancaria (
    id_conciliacion_bancaria uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_cuenta_bancaria uuid NOT NULL,
    id_periodo_contable uuid NOT NULL,
    saldo_libro numeric(15,2) NOT NULL,
    saldo_banco numeric(15,2) NOT NULL,
    diferencia numeric(15,2) DEFAULT 0,
    estado character varying(20) DEFAULT 'PENDIENTE'::character varying,
    fecha_conciliacion date,
    id_usuario_conciliacion uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.conciliacion_bancaria OWNER TO postgres;

--
-- TOC entry 303 (class 1259 OID 22065)
-- Name: condicion_pago_catalogo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.condicion_pago_catalogo (
    id_condicion_pago uuid DEFAULT gen_random_uuid() NOT NULL,
    descripcion character varying(100) NOT NULL
);


ALTER TABLE public.condicion_pago_catalogo OWNER TO postgres;

--
-- TOC entry 316 (class 1259 OID 93112)
-- Name: configuracion_contabilidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuracion_contabilidad (
    id_configuracion_contabilidad uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_moneda_base uuid,
    formato_cuenta character varying(20) DEFAULT 'XXXX-XXXX-XXXX'::character varying,
    separador_cuenta character varying(5) DEFAULT '-'::character varying,
    longitud_nivel integer DEFAULT 4,
    usar_centavos boolean DEFAULT true,
    metodo_contable character varying(20) DEFAULT 'acumulacion'::character varying NOT NULL,
    desactivar_transacciones_directas boolean DEFAULT false NOT NULL,
    lista_combinada_subsidiaria boolean DEFAULT false NOT NULL,
    gestion_cero_final boolean DEFAULT false NOT NULL,
    longitud_cuentas_generales integer,
    longitud_subcuentas_terceros integer,
    periodo_por_defecto character varying(20) DEFAULT 'mes_anterior'::character varying NOT NULL,
    fecha_excluir_antes date,
    etiqueta_operacion_defecto character varying(40) DEFAULT 'tercero_apunte_desc'::character varying NOT NULL,
    deshabilitar_transferencia_ventas boolean DEFAULT false NOT NULL,
    deshabilitar_transferencia_compras boolean DEFAULT false NOT NULL,
    deshabilitar_informes_gastos boolean DEFAULT false NOT NULL,
    deshabilitar_activos_fijos boolean DEFAULT false NOT NULL,
    deshabilitar_descuentos boolean DEFAULT false NOT NULL,
    usar_fecha_fin_periodo_informe_gastos boolean DEFAULT false NOT NULL,
    solo_lineas_conciliadas_extracto boolean DEFAULT false NOT NULL,
    numeracion_modelo character varying(20) DEFAULT 'neon'::character varying NOT NULL,
    mascara_helium character varying(255),
    coincidencia_contable boolean DEFAULT false NOT NULL,
    iva_revertido_compras boolean DEFAULT false NOT NULL,
    tab_libro_auxiliar_terceros boolean DEFAULT false NOT NULL,
    prefijo_exportacion character varying(50),
    formato_exportacion character varying(40) DEFAULT 'csv_configurable'::character varying NOT NULL,
    formato_archivo character varying(10) DEFAULT 'csv'::character varying NOT NULL,
    separador_columnas character varying(5) DEFAULT ','::character varying NOT NULL,
    tipo_retorno_carro character varying(10) DEFAULT 'unix'::character varying NOT NULL,
    formato_fecha_exportacion character varying(20) DEFAULT '%Y-%m-%d'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.configuracion_contabilidad OWNER TO postgres;

--
-- TOC entry 300 (class 1259 OID 18651)
-- Name: contable_externo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contable_externo (
    id_contable uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    razon_social character varying(150) NOT NULL,
    direccion character varying(255),
    codigo_postal character varying(20),
    poblacion character varying(100),
    id_pais uuid,
    id_provincia uuid,
    telefono character varying(20),
    fax character varying(20),
    correo character varying(128),
    web character varying(255),
    codigo_contable character varying(50),
    nota text,
    created_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    updated_at timestamp without time zone
);


ALTER TABLE public.contable_externo OWNER TO postgres;

--
-- TOC entry 366 (class 1259 OID 207464)
-- Name: contacto_direccion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacto_direccion (
    id_contacto uuid DEFAULT gen_random_uuid() NOT NULL,
    id_tercero uuid NOT NULL,
    apellidos_etiqueta character varying(150) NOT NULL,
    nombre character varying(150),
    titulo_cortesia character varying(50),
    puesto_trabajo character varying(150),
    direccion text,
    codigo_postal character varying(20),
    poblacion character varying(150),
    id_pais uuid,
    telefono_trabajo character varying(50),
    telefono_particular character varying(50),
    movil character varying(50),
    fax character varying(50),
    correo character varying(150),
    visibilidad character varying(50) DEFAULT 'Compartido'::character varying,
    fecha_nacimiento date,
    alerta_cumpleanos boolean DEFAULT false,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    id_provincia uuid,
    creado_por uuid,
    modificado_por uuid
);


ALTER TABLE public.contacto_direccion OWNER TO postgres;

--
-- TOC entry 340 (class 1259 OID 99073)
-- Name: cotizacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cotizacion (
    id_cotizacion uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    numero_cotizacion character varying(50) NOT NULL,
    id_tercero uuid NOT NULL,
    fecha_cotizacion date NOT NULL,
    fecha_vencimiento date,
    subtotal numeric(15,2) NOT NULL,
    total_impuestos numeric(15,2) DEFAULT 0,
    total_descuentos numeric(15,2) DEFAULT 0,
    total_cotizacion numeric(15,2) NOT NULL,
    estado character varying(20) DEFAULT 'BORRADOR'::character varying,
    observaciones text,
    id_usuario_creacion uuid,
    id_usuario_aprobacion uuid,
    fecha_aprobacion timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cotizacion OWNER TO postgres;

--
-- TOC entry 341 (class 1259 OID 99108)
-- Name: cotizacion_linea; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cotizacion_linea (
    id_cotizacion_linea uuid DEFAULT gen_random_uuid() NOT NULL,
    id_cotizacion uuid NOT NULL,
    id_item uuid,
    descripcion character varying(500) NOT NULL,
    cantidad numeric(10,3) NOT NULL,
    precio_unitario numeric(15,2) NOT NULL,
    descuento_porcentaje numeric(5,2) DEFAULT 0,
    descuento_valor numeric(15,2) DEFAULT 0,
    subtotal numeric(15,2) NOT NULL,
    orden integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cotizacion_linea OWNER TO postgres;

--
-- TOC entry 344 (class 1259 OID 99200)
-- Name: cotizacion_prefactura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cotizacion_prefactura (
    id_cotizacion_prefactura uuid DEFAULT gen_random_uuid() NOT NULL,
    id_cotizacion uuid NOT NULL,
    id_prefactura uuid NOT NULL,
    porcentaje_utilizado numeric(5,2) DEFAULT 100,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cotizacion_prefactura OWNER TO postgres;

--
-- TOC entry 323 (class 1259 OID 93269)
-- Name: cuenta_bancaria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuenta_bancaria (
    id_cuenta_bancaria uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_banco uuid NOT NULL,
    numero_cuenta character varying(50) NOT NULL,
    tipo_cuenta character varying(20) NOT NULL,
    id_moneda uuid NOT NULL,
    id_cuenta_contable uuid,
    saldo_inicial numeric(15,2) DEFAULT 0,
    saldo_actual numeric(15,2) DEFAULT 0,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    id_tercero uuid,
    referencia character varying(50),
    etiqueta_cuenta character varying(255),
    estado_cuenta character varying(20) DEFAULT 'abierta'::character varying,
    id_pais uuid,
    id_provincia uuid,
    direccion_banco text,
    web character varying(500),
    comentario text,
    comentario_html text,
    fecha_saldo_inicial date,
    saldo_minimo_autorizado numeric(15,2) DEFAULT 0,
    saldo_minimo_deseado numeric(15,2) DEFAULT 0,
    iban character varying(50),
    bic_swift character varying(20),
    codigo_contable character varying(50)
);


ALTER TABLE public.cuenta_bancaria OWNER TO postgres;

--
-- TOC entry 320 (class 1259 OID 93200)
-- Name: cuenta_contable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuenta_contable (
    id_cuenta_contable uuid DEFAULT gen_random_uuid() NOT NULL,
    id_plan_contable uuid NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(200) NOT NULL,
    descripcion text,
    tipo_cuenta character varying(50) NOT NULL,
    nivel integer DEFAULT 1 NOT NULL,
    id_cuenta_padre uuid,
    permite_movimientos boolean DEFAULT true,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cuenta_contable OWNER TO postgres;

--
-- TOC entry 322 (class 1259 OID 93246)
-- Name: cuenta_contable_defecto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuenta_contable_defecto (
    id_cuenta_contable_defecto uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    tipo_operacion character varying(50) NOT NULL,
    id_cuenta_contable uuid NOT NULL,
    descripcion text,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cuenta_contable_defecto OWNER TO postgres;

--
-- TOC entry 326 (class 1259 OID 93344)
-- Name: cuenta_contable_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuenta_contable_item (
    id_cuenta_contable_item uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_cuenta_contable uuid NOT NULL,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    id_item uuid,
    id_tipo_movimiento_contable uuid,
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.cuenta_contable_item OWNER TO postgres;

--
-- TOC entry 331 (class 1259 OID 98840)
-- Name: cuenta_grupo_personalizado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuenta_grupo_personalizado (
    id_cuenta_grupo_personalizado uuid DEFAULT gen_random_uuid() NOT NULL,
    id_grupo_cuenta_personalizado uuid NOT NULL,
    id_cuenta_contable uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cuenta_grupo_personalizado OWNER TO postgres;

--
-- TOC entry 325 (class 1259 OID 93323)
-- Name: cuenta_impuesto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuenta_impuesto (
    id_cuenta_impuesto uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    tipo_impuesto character varying(50) NOT NULL,
    porcentaje numeric(5,2) NOT NULL,
    id_cuenta_contable uuid NOT NULL,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cuenta_impuesto OWNER TO postgres;

--
-- TOC entry 324 (class 1259 OID 93302)
-- Name: cuenta_iva; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuenta_iva (
    id_cuenta_iva uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    tipo_iva character varying(50) NOT NULL,
    porcentaje numeric(5,2) NOT NULL,
    id_cuenta_contable uuid NOT NULL,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cuenta_iva OWNER TO postgres;

--
-- TOC entry 317 (class 1259 OID 93148)
-- Name: diario_contable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diario_contable (
    id_diario_contable uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    tipo_diario character varying(50) NOT NULL,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.diario_contable OWNER TO postgres;

--
-- TOC entry 395 (class 1259 OID 228152)
-- Name: directorio_documento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directorio_documento (
    id_directorio_documento uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text,
    id_directorio_padre uuid,
    modulo character varying(50),
    orden integer DEFAULT 0,
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    created_by uuid,
    updated_by uuid,
    id_empresa uuid,
    tipo_directorio character varying(20) DEFAULT 'MANUAL'::character varying
);


ALTER TABLE public.directorio_documento OWNER TO postgres;

--
-- TOC entry 336 (class 1259 OID 98970)
-- Name: documento_origen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documento_origen (
    id_documento_origen uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    tipo_documento character varying(50) NOT NULL,
    numero_documento character varying(100) NOT NULL,
    fecha_documento date NOT NULL,
    id_tercero uuid,
    valor_total numeric(15,2) NOT NULL,
    estado_contabilizacion character varying(20) DEFAULT 'PENDIENTE'::character varying,
    id_asiento_contable uuid,
    fecha_contabilizacion timestamp without time zone,
    id_usuario_contabilizacion uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.documento_origen OWNER TO postgres;

--
-- TOC entry 391 (class 1259 OID 222483)
-- Name: duracion_unidad_catalogo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.duracion_unidad_catalogo (
    id_duration_unit uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    orden integer,
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.duracion_unidad_catalogo OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 17267)
-- Name: empresa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresa (
    id_empresa uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre character varying(100) NOT NULL,
    ruc character varying(13) NOT NULL,
    direccion character varying(255),
    telefono character varying(20),
    email character varying(128),
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    id_moneda uuid,
    id_pais uuid,
    codigo_postal character varying(20),
    poblacion character varying(100),
    movil character varying(20),
    fax character varying(20),
    web character varying(255),
    logo bytea,
    logotipo_cuadrado bytea,
    nota text,
    sujeto_iva boolean DEFAULT true NOT NULL,
    id_provincia uuid,
    fiscal_year_start_month smallint DEFAULT 1 NOT NULL,
    fiscal_year_start_day smallint DEFAULT 1 NOT NULL,
    created_by uuid,
    updated_by uuid,
    CONSTRAINT empresa_fiscal_year_start_day_check CHECK (((fiscal_year_start_day >= 1) AND (fiscal_year_start_day <= 31))),
    CONSTRAINT empresa_fiscal_year_start_month_check CHECK (((fiscal_year_start_month >= 1) AND (fiscal_year_start_month <= 12)))
);


ALTER TABLE public.empresa OWNER TO postgres;

--
-- TOC entry 301 (class 1259 OID 18686)
-- Name: empresa_horario_apertura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresa_horario_apertura (
    id_horario uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    dia smallint NOT NULL,
    valor character varying(50),
    created_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    updated_at timestamp without time zone,
    CONSTRAINT empresa_horario_apertura_dia_check CHECK (((dia >= 1) AND (dia <= 7)))
);


ALTER TABLE public.empresa_horario_apertura OWNER TO postgres;

--
-- TOC entry 297 (class 1259 OID 18578)
-- Name: empresa_identificacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresa_identificacion (
    id_identificacion uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    administradores character varying(255),
    delegado_datos character varying(255),
    capital numeric(14,2),
    id_tipo_entidad smallint,
    objeto_empresa text,
    cif_intra character varying(64),
    id_profesional1 character varying(100),
    id_profesional2 character varying(100),
    id_profesional3 character varying(100),
    id_profesional4 character varying(100),
    id_profesional5 character varying(100),
    id_profesional6 character varying(100),
    id_profesional7 character varying(100),
    id_profesional8 character varying(100),
    id_profesional9 character varying(100),
    id_profesional10 character varying(100),
    created_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    updated_at timestamp without time zone
);


ALTER TABLE public.empresa_identificacion OWNER TO postgres;

--
-- TOC entry 299 (class 1259 OID 18621)
-- Name: empresa_red_social; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresa_red_social (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_red_social uuid NOT NULL,
    identificador character varying(100),
    url character varying(255),
    es_principal boolean DEFAULT false NOT NULL,
    created_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    updated_at timestamp without time zone
);


ALTER TABLE public.empresa_red_social OWNER TO postgres;

--
-- TOC entry 291 (class 1259 OID 18510)
-- Name: entidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.entidad (
    id integer NOT NULL,
    nombre character varying(120) NOT NULL
);


ALTER TABLE public.entidad OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 18509)
-- Name: entidad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.entidad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.entidad_id_seq OWNER TO postgres;

--
-- TOC entry 5964 (class 0 OID 0)
-- Dependencies: 290
-- Name: entidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.entidad_id_seq OWNED BY public.entidad.id;


--
-- TOC entry 382 (class 1259 OID 221096)
-- Name: envio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.envio (
    id_envio uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    envio_ref character varying(100) NOT NULL,
    id_tercero uuid NOT NULL,
    ref_cliente character varying(100),
    poblacion character varying(200),
    fecha_prevista_entrega date,
    fecha_envio date,
    metodo_envio character varying(100),
    numero_seguimiento character varying(100),
    estado_envio character varying(30) DEFAULT 'BORRADOR'::character varying NOT NULL,
    facturado boolean DEFAULT false NOT NULL,
    modulo_origen character varying(50),
    id_origen uuid,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    estado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.envio OWNER TO postgres;

--
-- TOC entry 383 (class 1259 OID 221114)
-- Name: envio_detalle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.envio_detalle (
    id_envio_detalle uuid DEFAULT gen_random_uuid() NOT NULL,
    id_envio uuid NOT NULL,
    id_item uuid NOT NULL,
    id_lote_serie uuid,
    cantidad numeric(12,2) NOT NULL,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    estado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.envio_detalle OWNER TO postgres;

--
-- TOC entry 388 (class 1259 OID 222418)
-- Name: estado_compra_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_compra_item (
    id_estado_compra uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    orden integer,
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.estado_compra_item OWNER TO postgres;

--
-- TOC entry 387 (class 1259 OID 222403)
-- Name: estado_venta_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_venta_item (
    id_estado_venta uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    orden integer,
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.estado_venta_item OWNER TO postgres;

--
-- TOC entry 338 (class 1259 OID 99019)
-- Name: factura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.factura (
    id_factura uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    numero_factura character varying(50),
    tipo_factura character varying(20) DEFAULT 'estandar'::character varying NOT NULL,
    id_tercero uuid NOT NULL,
    fecha_factura date NOT NULL,
    fecha_vencimiento date,
    subtotal numeric(15,2),
    total_impuestos numeric(15,2) DEFAULT 0,
    total_descuentos numeric(15,2) DEFAULT 0,
    total_factura numeric(15,2),
    estado character varying(20) DEFAULT 'BORRADOR'::character varying,
    id_asiento_contable uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    id_condicion_pago uuid,
    id_forma_pago uuid,
    id_cuenta_bancaria uuid,
    origen character varying(100),
    id_proyecto uuid,
    categorias text[] DEFAULT '{}'::text[] NOT NULL,
    plantilla_documento character varying(50) DEFAULT 'crabe'::character varying NOT NULL,
    id_moneda uuid,
    nota_publica text,
    nota_privada text,
    CONSTRAINT factura_tipo_factura_chk CHECK ((tipo_factura)::text = ANY ((ARRAY['estandar'::character varying, 'anticipo'::character varying, 'rectificativa'::character varying, 'abono'::character varying, 'plantilla'::character varying])::text[]))
);


ALTER TABLE public.factura OWNER TO postgres;

--
-- TOC entry 339 (class 1259 OID 99047)
-- Name: factura_linea; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.factura_linea (
    id_factura_linea uuid DEFAULT gen_random_uuid() NOT NULL,
    id_factura uuid NOT NULL,
    id_item uuid,
    descripcion character varying(500) NOT NULL,
    cantidad numeric(10,3) NOT NULL,
    precio_unitario numeric(15,2) NOT NULL,
    descuento_porcentaje numeric(5,2) DEFAULT 0,
    descuento_valor numeric(15,2) DEFAULT 0,
    subtotal numeric(15,2) NOT NULL,
    id_cuenta_contable uuid,
    orden integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.factura_linea OWNER TO postgres;

--
-- TOC entry 304 (class 1259 OID 22112)
-- Name: forma_pago_catalogo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forma_pago_catalogo (
    id_forma_pago uuid DEFAULT gen_random_uuid() NOT NULL,
    descripcion character varying(100) NOT NULL
);


ALTER TABLE public.forma_pago_catalogo OWNER TO postgres;

--
-- TOC entry 330 (class 1259 OID 98822)
-- Name: grupo_cuenta_personalizado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grupo_cuenta_personalizado (
    id_grupo_cuenta_personalizado uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.grupo_cuenta_personalizado OWNER TO postgres;

--
-- TOC entry 346 (class 1259 OID 99240)
-- Name: historial_conversion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_conversion (
    id_historial_conversion uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    tipo_origen character varying(20) NOT NULL,
    id_documento_origen uuid NOT NULL,
    tipo_destino character varying(20) NOT NULL,
    id_documento_destino uuid NOT NULL,
    fecha_conversion timestamp without time zone DEFAULT now(),
    id_usuario_conversion uuid,
    observaciones text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.historial_conversion OWNER TO postgres;

--
-- TOC entry 308 (class 1259 OID 24389)
-- Name: impuestos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.impuestos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    tasa numeric(5,2) NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.impuestos OWNER TO postgres;

--
-- TOC entry 307 (class 1259 OID 24388)
-- Name: impuestos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.impuestos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.impuestos_id_seq OWNER TO postgres;

--
-- TOC entry 5976 (class 0 OID 0)
-- Dependencies: 307
-- Name: impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.impuestos_id_seq OWNED BY public.impuestos.id;


--
-- TOC entry 305 (class 1259 OID 22120)
-- Name: incoterm_catalogo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.incoterm_catalogo (
    id_incoterm uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo character varying(10) NOT NULL,
    descripcion character varying(100)
);


ALTER TABLE public.incoterm_catalogo OWNER TO postgres;

--
-- TOC entry 337 (class 1259 OID 99001)
-- Name: informe_contable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.informe_contable (
    id_informe_contable uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    nombre character varying(100) NOT NULL,
    tipo_informe character varying(50) NOT NULL,
    configuracion jsonb,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.informe_contable OWNER TO postgres;

--
-- TOC entry 378 (class 1259 OID 221001)
-- Name: inventario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventario (
    id_inventario uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    inventario_ref character varying(100) NOT NULL,
    etiqueta character varying(150) NOT NULL,
    id_almacen uuid NOT NULL,
    estado_inventario character varying(30) DEFAULT 'BORRADOR'::character varying NOT NULL,
    fecha_inicio timestamp without time zone,
    fecha_cierre timestamp without time zone,
    observacion text,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    estado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.inventario OWNER TO postgres;

--
-- TOC entry 379 (class 1259 OID 221018)
-- Name: inventario_detalle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventario_detalle (
    id_inventario_detalle uuid DEFAULT gen_random_uuid() NOT NULL,
    id_inventario uuid NOT NULL,
    id_item uuid NOT NULL,
    id_lote_serie uuid,
    stock_sistema numeric(12,2) DEFAULT 0 NOT NULL,
    stock_contado numeric(12,2) DEFAULT 0 NOT NULL,
    diferencia numeric(12,2) DEFAULT 0 NOT NULL,
    observacion text,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    estado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.inventario_detalle OWNER TO postgres;

--
-- TOC entry 367 (class 1259 OID 208587)
-- Name: item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item (
    id_item uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    producto_ref character varying(100) NOT NULL,
    etiqueta character varying(100),
    estado boolean DEFAULT true NOT NULL,
    descripcion text,
    url_publica text,
    peso numeric(10,2),
    longitud numeric(10,2),
    anchura numeric(10,2),
    altura numeric(10,2),
    superficie numeric(10,2),
    volumen numeric(10,2),
    nomenclatura_aduanera character varying(50),
    nota_interna text,
    precio_venta numeric(12,2),
    precio_minimo numeric(12,2),
    impuesto_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inventariable boolean DEFAULT true NOT NULL,
    duration_value numeric(10,2),
    mandatory_periods boolean DEFAULT false,
    created_by uuid,
    updated_by uuid,
    id_pais uuid,
    id_provincia uuid,
    poblacion character varying(50),
    id_unidad_medida uuid,
    id_unidad_peso uuid,
    id_unidad_longitud uuid,
    id_unidad_superficie uuid,
    id_unidad_volumen uuid,
    codigo_barras character varying(100),
    precio_compra numeric(12,2),
    stock_minimo_alerta numeric(12,2),
    stock_deseado numeric(12,2),
    id_almacen_defecto uuid,
    id_categoria_item uuid,
    id_estado_venta uuid NOT NULL,
    id_estado_compra uuid,
    id_tipo_control_caducidad uuid,
    id_tipo_item uuid,
    id_duration_unit uuid,
    id_tipo_control_inventario uuid,
    id_naturaleza_item uuid NOT NULL,
    id_cuenta_venta uuid,
    id_cuenta_venta_intracomunitaria uuid,
    id_cuenta_venta_exportacion uuid,
    id_cuenta_compra uuid,
    id_cuenta_compra_intracomunitaria uuid,
    id_cuenta_compra_importacion uuid,
    id_tipo_comportamiento uuid,
    CONSTRAINT chk_item_precio_compra CHECK (((precio_compra IS NULL) OR (precio_compra >= (0)::numeric))),
    CONSTRAINT chk_item_stock_deseado CHECK (((stock_deseado IS NULL) OR (stock_deseado >= (0)::numeric))),
    CONSTRAINT chk_item_stock_logico CHECK (((stock_minimo_alerta IS NULL) OR (stock_deseado IS NULL) OR (stock_minimo_alerta <= stock_deseado))),
    CONSTRAINT chk_item_stock_minimo_alerta CHECK (((stock_minimo_alerta IS NULL) OR (stock_minimo_alerta >= (0)::numeric)))
);


ALTER TABLE public.item OWNER TO postgres;

--
-- TOC entry 396 (class 1259 OID 230393)
-- Name: item_etiqueta_categoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_etiqueta_categoria (
    id_etiqueta_categoria uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    ref character varying(100),
    nombre character varying(150) NOT NULL,
    descripcion text,
    color character varying(20),
    posicion integer DEFAULT 1,
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by uuid,
    updated_by uuid,
    id_tipo_item uuid
);


ALTER TABLE public.item_etiqueta_categoria OWNER TO postgres;

--
-- TOC entry 397 (class 1259 OID 230406)
-- Name: item_etiqueta_categoria_det; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_etiqueta_categoria_det (
    id_item_etiqueta_categoria uuid DEFAULT gen_random_uuid() NOT NULL,
    id_item uuid NOT NULL,
    id_etiqueta_categoria uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.item_etiqueta_categoria_det OWNER TO postgres;

--
-- TOC entry 377 (class 1259 OID 220967)
-- Name: item_lote_serie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_lote_serie (
    id_lote_serie uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_item uuid NOT NULL,
    id_almacen uuid NOT NULL,
    codigo_lote_serie character varying(150) NOT NULL,
    fecha_limite_venta date,
    fecha_caducidad date,
    cantidad_actual numeric(12,2) DEFAULT 0 NOT NULL,
    observacion text,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    estado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.item_lote_serie OWNER TO postgres;

--
-- TOC entry 334 (class 1259 OID 98913)
-- Name: libro_mayor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.libro_mayor (
    id_libro_mayor uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_cuenta_contable uuid NOT NULL,
    id_periodo_contable uuid NOT NULL,
    saldo_inicial numeric(15,2) DEFAULT 0,
    total_debe numeric(15,2) DEFAULT 0,
    total_haber numeric(15,2) DEFAULT 0,
    saldo_final numeric(15,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.libro_mayor OWNER TO postgres;

--
-- TOC entry 369 (class 1259 OID 213080)
-- Name: media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media (
    id_media uuid DEFAULT gen_random_uuid() NOT NULL,
    module character varying(50) NOT NULL,
    module_id uuid NOT NULL,
    url character varying(500) NOT NULL,
    filename character varying(255),
    mimetype character varying(100),
    size integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    tipo character varying(50) DEFAULT 'general'::character varying,
    es_principal boolean DEFAULT true,
    estado_archivo character varying(20) DEFAULT 'activo'::character varying,
    id_directorio_documento uuid,
    estado boolean DEFAULT true NOT NULL,
    id_empresa uuid
);


ALTER TABLE public.media OWNER TO postgres;

--
-- TOC entry 289 (class 1259 OID 17379)
-- Name: menu_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_item (
    id_item uuid DEFAULT gen_random_uuid() NOT NULL,
    id_seccion uuid NOT NULL,
    parent_id uuid,
    etiqueta character varying(100) NOT NULL,
    icono character varying(100),
    ruta character varying(255),
    es_clickable boolean DEFAULT true NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    muestra_badge boolean DEFAULT false NOT NULL,
    badge_text character varying(20),
    estado boolean DEFAULT true NOT NULL,
    created_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    updated_at timestamp without time zone
);


ALTER TABLE public.menu_item OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 17370)
-- Name: menu_seccion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_seccion (
    id_seccion uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre character varying(100) NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    icono character varying(100),
    estado boolean DEFAULT true
);


ALTER TABLE public.menu_seccion OWNER TO postgres;

--
-- TOC entry 312 (class 1259 OID 32167)
-- Name: miembros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.miembros (
    id integer NOT NULL,
    tipo_miembro_id integer,
    naturaleza character varying(20),
    empresa character varying(150),
    titulo_cortesia character varying(20),
    apellidos character varying(100),
    nombres character varying(100),
    sexo character varying(10),
    correo character varying(150),
    web character varying(200),
    direccion text,
    codigo_postal character varying(20),
    poblacion character varying(100),
    pais character varying(100),
    provincia character varying(100),
    telefono_trabajo character varying(20),
    telefono_particular character varying(20),
    movil character varying(20),
    fecha_nacimiento date,
    membresia_publica boolean DEFAULT false,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.miembros OWNER TO postgres;

--
-- TOC entry 311 (class 1259 OID 32166)
-- Name: miembros_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.miembros_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.miembros_id_seq OWNER TO postgres;

--
-- TOC entry 5991 (class 0 OID 0)
-- Dependencies: 311
-- Name: miembros_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.miembros_id_seq OWNED BY public.miembros.id;


--
-- TOC entry 318 (class 1259 OID 93166)
-- Name: modelo_plan_contable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modelo_plan_contable (
    id_modelo_plan_contable uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    codigo character varying(20) NOT NULL,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.modelo_plan_contable OWNER TO postgres;

--
-- TOC entry 292 (class 1259 OID 18517)
-- Name: moneda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.moneda (
    id_moneda uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo character varying(3) NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.moneda OWNER TO postgres;

--
-- TOC entry 350 (class 1259 OID 99350)
-- Name: movimiento_bancario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movimiento_bancario (
    id_movimiento_bancario uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_cuenta_bancaria uuid NOT NULL,
    fecha_movimiento date NOT NULL,
    numero_documento character varying(100),
    concepto text NOT NULL,
    tipo_movimiento character varying(20) NOT NULL,
    monto numeric(15,2) NOT NULL,
    saldo_anterior numeric(15,2) NOT NULL,
    saldo_nuevo numeric(15,2) NOT NULL,
    conciliado boolean DEFAULT false,
    id_conciliacion_bancaria uuid,
    id_asiento_contable uuid,
    created_at timestamp without time zone DEFAULT now(),
    id_movimiento_reversado uuid
);


ALTER TABLE public.movimiento_bancario OWNER TO postgres;

--
-- TOC entry 358 (class 1259 OID 99551)
-- Name: movimiento_centro_costo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movimiento_centro_costo (
    id_movimiento_centro_costo uuid DEFAULT gen_random_uuid() NOT NULL,
    id_movimiento_contable uuid NOT NULL,
    id_centro_costo uuid NOT NULL,
    porcentaje numeric(5,2) DEFAULT 100,
    monto numeric(15,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.movimiento_centro_costo OWNER TO postgres;

--
-- TOC entry 333 (class 1259 OID 98892)
-- Name: movimiento_contable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movimiento_contable (
    id_movimiento_contable uuid DEFAULT gen_random_uuid() NOT NULL,
    id_asiento_contable uuid NOT NULL,
    id_cuenta_contable uuid NOT NULL,
    concepto text NOT NULL,
    debe numeric(15,2) DEFAULT 0,
    haber numeric(15,2) DEFAULT 0,
    orden integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.movimiento_contable OWNER TO postgres;

--
-- TOC entry 362 (class 1259 OID 106377)
-- Name: movimiento_cuenta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movimiento_cuenta (
    id_movimiento_cuenta uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_cuenta_financiera uuid NOT NULL,
    fecha_movimiento date NOT NULL,
    descripcion character varying(240) NOT NULL,
    importe numeric(18,2) NOT NULL,
    creado_en timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.movimiento_cuenta OWNER TO postgres;

--
-- TOC entry 351 (class 1259 OID 99380)
-- Name: movimiento_inventario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movimiento_inventario (
    id_movimiento_inventario uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_item uuid NOT NULL,
    tipo_movimiento character varying(20) NOT NULL,
    cantidad numeric(10,3) NOT NULL,
    costo_unitario numeric(15,2) NOT NULL,
    costo_total numeric(15,2) NOT NULL,
    fecha_movimiento date NOT NULL,
    referencia character varying(100),
    concepto text,
    id_asiento_contable uuid,
    created_at timestamp without time zone DEFAULT now(),
    id_almacen uuid,
    id_lote_serie uuid,
    modulo_origen character varying(50),
    id_origen uuid,
    updated_by uuid,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    estado boolean DEFAULT true NOT NULL,
    id_almacen_destino uuid
);


ALTER TABLE public.movimiento_inventario OWNER TO postgres;

--
-- TOC entry 401 (class 1259 OID 237141)
-- Name: naturaleza_item_catalogo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.naturaleza_item_catalogo (
    id_naturaleza_item uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    orden integer DEFAULT 1 NOT NULL,
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.naturaleza_item_catalogo OWNER TO postgres;

--
-- TOC entry 354 (class 1259 OID 99453)
-- Name: nota_credito; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nota_credito (
    id_nota_credito uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    numero_nota character varying(50) NOT NULL,
    tipo_nota character varying(20) NOT NULL,
    id_tercero uuid NOT NULL,
    id_factura uuid NOT NULL,
    fecha_nota date NOT NULL,
    motivo text NOT NULL,
    subtotal numeric(15,2) NOT NULL,
    total_impuestos numeric(15,2) DEFAULT 0,
    total_descuentos numeric(15,2) DEFAULT 0,
    total_nota numeric(15,2) NOT NULL,
    estado character varying(20) DEFAULT 'BORRADOR'::character varying,
    id_asiento_contable uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.nota_credito OWNER TO postgres;

--
-- TOC entry 355 (class 1259 OID 99488)
-- Name: nota_credito_linea; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nota_credito_linea (
    id_nota_credito_linea uuid DEFAULT gen_random_uuid() NOT NULL,
    id_nota_credito uuid NOT NULL,
    id_item uuid,
    descripcion character varying(500) NOT NULL,
    cantidad numeric(10,3) NOT NULL,
    precio_unitario numeric(15,2) NOT NULL,
    descuento_porcentaje numeric(5,2) DEFAULT 0,
    descuento_valor numeric(15,2) DEFAULT 0,
    subtotal numeric(15,2) NOT NULL,
    orden integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.nota_credito_linea OWNER TO postgres;

--
-- TOC entry 347 (class 1259 OID 99260)
-- Name: pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pago (
    id_pago uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    numero_pago character varying(50) NOT NULL,
    tipo_pago character varying(20) NOT NULL,
    id_tercero uuid NOT NULL,
    id_cuenta_bancaria uuid,
    fecha_pago date NOT NULL,
    monto numeric(15,2) NOT NULL,
    id_moneda uuid NOT NULL,
    tipo_cambio numeric(10,4) DEFAULT 1,
    concepto text,
    estado character varying(20) DEFAULT 'BORRADOR'::character varying,
    id_asiento_contable uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pago OWNER TO postgres;

--
-- TOC entry 348 (class 1259 OID 99299)
-- Name: pago_factura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pago_factura (
    id_pago_factura uuid DEFAULT gen_random_uuid() NOT NULL,
    id_pago uuid NOT NULL,
    id_factura uuid NOT NULL,
    monto_aplicado numeric(15,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.pago_factura OWNER TO postgres;

--
-- TOC entry 293 (class 1259 OID 18525)
-- Name: pais; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pais (
    id_pais uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre character varying(100) NOT NULL,
    codigo_iso character(2) NOT NULL,
    icono text DEFAULT ''::text NOT NULL
);


ALTER TABLE public.pais OWNER TO postgres;

--
-- TOC entry 286 (class 1259 OID 17331)
-- Name: perfil; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfil (
    id_perfil uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    estado boolean DEFAULT true NOT NULL,
    id_empresa uuid NOT NULL
);


ALTER TABLE public.perfil OWNER TO postgres;

--
-- TOC entry 313 (class 1259 OID 46549)
-- Name: perfil_menu_permiso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfil_menu_permiso (
    id_perfil uuid NOT NULL,
    id_item uuid NOT NULL,
    permitido boolean DEFAULT true NOT NULL
);


ALTER TABLE public.perfil_menu_permiso OWNER TO postgres;

--
-- TOC entry 321 (class 1259 OID 93225)
-- Name: periodo_contable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.periodo_contable (
    id_periodo_contable uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    "año" integer NOT NULL,
    mes integer NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    estado character varying(20) DEFAULT 'ABIERTO'::character varying,
    fecha_cierre timestamp without time zone,
    id_usuario_cierre uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.periodo_contable OWNER TO postgres;

--
-- TOC entry 319 (class 1259 OID 93179)
-- Name: plan_contable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plan_contable (
    id_plan_contable uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_modelo_plan_contable uuid,
    nombre character varying(100) NOT NULL,
    descripcion text,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.plan_contable OWNER TO postgres;

--
-- TOC entry 342 (class 1259 OID 99129)
-- Name: prefactura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prefactura (
    id_prefactura uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    numero_prefactura character varying(50) NOT NULL,
    id_cotizacion uuid NOT NULL,
    id_tercero uuid NOT NULL,
    fecha_prefactura date NOT NULL,
    fecha_vencimiento date,
    subtotal numeric(15,2) NOT NULL,
    total_impuestos numeric(15,2) DEFAULT 0,
    total_descuentos numeric(15,2) DEFAULT 0,
    total_prefactura numeric(15,2) NOT NULL,
    estado character varying(20) DEFAULT 'BORRADOR'::character varying,
    observaciones text,
    id_factura uuid,
    id_usuario_creacion uuid,
    id_usuario_aprobacion uuid,
    fecha_aprobacion timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.prefactura OWNER TO postgres;

--
-- TOC entry 345 (class 1259 OID 99220)
-- Name: prefactura_factura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prefactura_factura (
    id_prefactura_factura uuid DEFAULT gen_random_uuid() NOT NULL,
    id_prefactura uuid NOT NULL,
    id_factura uuid NOT NULL,
    porcentaje_utilizado numeric(5,2) DEFAULT 100,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.prefactura_factura OWNER TO postgres;

--
-- TOC entry 343 (class 1259 OID 99174)
-- Name: prefactura_linea; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prefactura_linea (
    id_prefactura_linea uuid DEFAULT gen_random_uuid() NOT NULL,
    id_prefactura uuid NOT NULL,
    id_cotizacion_linea uuid NOT NULL,
    id_item uuid,
    descripcion character varying(500) NOT NULL,
    cantidad numeric(10,3) NOT NULL,
    precio_unitario numeric(15,2) NOT NULL,
    descuento_porcentaje numeric(5,2) DEFAULT 0,
    descuento_valor numeric(15,2) DEFAULT 0,
    subtotal numeric(15,2) NOT NULL,
    orden integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.prefactura_linea OWNER TO postgres;

--
-- TOC entry 352 (class 1259 OID 99404)
-- Name: presupuesto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.presupuesto (
    id_presupuesto uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    numero_presupuesto character varying(50) NOT NULL,
    id_tercero uuid NOT NULL,
    fecha_presupuesto date NOT NULL,
    fecha_vencimiento date,
    subtotal numeric(15,2) NOT NULL,
    total_impuestos numeric(15,2) DEFAULT 0,
    total_descuentos numeric(15,2) DEFAULT 0,
    total_presupuesto numeric(15,2) NOT NULL,
    estado character varying(20) DEFAULT 'BORRADOR'::character varying,
    id_factura uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.presupuesto OWNER TO postgres;

--
-- TOC entry 353 (class 1259 OID 99432)
-- Name: presupuesto_linea; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.presupuesto_linea (
    id_presupuesto_linea uuid DEFAULT gen_random_uuid() NOT NULL,
    id_presupuesto uuid NOT NULL,
    id_item uuid,
    descripcion character varying(500) NOT NULL,
    cantidad numeric(10,3) NOT NULL,
    precio_unitario numeric(15,2) NOT NULL,
    descuento_porcentaje numeric(5,2) DEFAULT 0,
    descuento_valor numeric(15,2) DEFAULT 0,
    subtotal numeric(15,2) NOT NULL,
    orden integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.presupuesto_linea OWNER TO postgres;

--
-- TOC entry 294 (class 1259 OID 18549)
-- Name: provincia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provincia (
    id_provincia uuid DEFAULT gen_random_uuid() NOT NULL,
    id_pais uuid NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.provincia OWNER TO postgres;

--
-- TOC entry 384 (class 1259 OID 221138)
-- Name: recepcion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recepcion (
    id_recepcion uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    recepcion_ref character varying(100) NOT NULL,
    id_tercero uuid NOT NULL,
    ref_proveedor character varying(100),
    poblacion character varying(200),
    codigo_postal character varying(20),
    fecha_prevista_entrega date,
    fecha_recepcion date,
    estado_recepcion character varying(30) DEFAULT 'BORRADOR'::character varying NOT NULL,
    facturado boolean DEFAULT false NOT NULL,
    modulo_origen character varying(50),
    id_origen uuid,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    estado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.recepcion OWNER TO postgres;

--
-- TOC entry 385 (class 1259 OID 221156)
-- Name: recepcion_detalle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recepcion_detalle (
    id_recepcion_detalle uuid DEFAULT gen_random_uuid() NOT NULL,
    id_recepcion uuid NOT NULL,
    id_item uuid NOT NULL,
    id_almacen uuid NOT NULL,
    id_lote_serie uuid,
    cantidad numeric(12,2) NOT NULL,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    estado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.recepcion_detalle OWNER TO postgres;

--
-- TOC entry 356 (class 1259 OID 99509)
-- Name: retencion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.retencion (
    id_retencion uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    tipo_retencion character varying(50) NOT NULL,
    porcentaje numeric(5,2) NOT NULL,
    base_retencion numeric(15,2) NOT NULL,
    valor_retencion numeric(15,2) NOT NULL,
    id_tercero uuid NOT NULL,
    id_documento_origen uuid,
    tipo_documento_origen character varying(50) NOT NULL,
    fecha_retencion date NOT NULL,
    numero_certificado character varying(50),
    estado character varying(20) DEFAULT 'PENDIENTE'::character varying,
    id_asiento_contable uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.retencion OWNER TO postgres;

--
-- TOC entry 403 (class 1259 OID 240554)
-- Name: rol_socio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol_socio (
    id_rol_socio uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.rol_socio OWNER TO postgres;

--
-- TOC entry 335 (class 1259 OID 98942)
-- Name: saldo_cuenta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.saldo_cuenta (
    id_saldo_cuenta uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_cuenta_contable uuid NOT NULL,
    id_periodo_contable uuid NOT NULL,
    saldo_debe numeric(15,2) DEFAULT 0,
    saldo_haber numeric(15,2) DEFAULT 0,
    saldo_final numeric(15,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.saldo_cuenta OWNER TO postgres;

--
-- TOC entry 371 (class 1259 OID 216424)
-- Name: secuencia_asiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.secuencia_asiento (
    id integer NOT NULL,
    empresa_id integer NOT NULL,
    prefijo_diario character varying(20) DEFAULT 'GEN'::character varying NOT NULL,
    anio integer NOT NULL,
    mes integer NOT NULL,
    valor_actual integer DEFAULT 0 NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.secuencia_asiento OWNER TO postgres;

--
-- TOC entry 6021 (class 0 OID 0)
-- Dependencies: 371
-- Name: TABLE secuencia_asiento; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.secuencia_asiento IS 'Secuencia para numeración de asientos por empresa, diario (prefijo) y periodo (año/mes)';


--
-- TOC entry 370 (class 1259 OID 216423)
-- Name: secuencia_asiento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.secuencia_asiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.secuencia_asiento_id_seq OWNER TO postgres;

--
-- TOC entry 6023 (class 0 OID 0)
-- Dependencies: 370
-- Name: secuencia_asiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.secuencia_asiento_id_seq OWNED BY public.secuencia_asiento.id;


--
-- TOC entry 298 (class 1259 OID 18612)
-- Name: social_network; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.social_network (
    id_red_social uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre character varying(50) NOT NULL,
    icono character varying(10) NOT NULL,
    orden smallint DEFAULT 0 NOT NULL
);


ALTER TABLE public.social_network OWNER TO postgres;

--
-- TOC entry 404 (class 1259 OID 240565)
-- Name: socio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.socio (
    id_socio uuid DEFAULT gen_random_uuid() NOT NULL,
    id_rol_socio uuid,
    fecha_inicio date,
    fecha_fin date,
    estado boolean DEFAULT true NOT NULL,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_fechas_socio CHECK (((fecha_fin IS NULL) OR (fecha_inicio IS NULL) OR (fecha_fin >= fecha_inicio)))
);


ALTER TABLE public.socio OWNER TO postgres;

--
-- TOC entry 405 (class 1259 OID 240579)
-- Name: socio_tercero; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.socio_tercero (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    id_socio uuid NOT NULL,
    id_tercero uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.socio_tercero OWNER TO postgres;

--
-- TOC entry 376 (class 1259 OID 220942)
-- Name: stock_item_almacen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_item_almacen (
    id_stock_producto_almacen uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_item uuid NOT NULL,
    id_almacen uuid NOT NULL,
    stock_fisico numeric(12,2) DEFAULT 0 NOT NULL,
    stock_reservado numeric(12,2) DEFAULT 0 NOT NULL,
    stock_virtual numeric(12,2) DEFAULT 0 NOT NULL,
    stock_disponible numeric(12,2) DEFAULT 0 NOT NULL,
    stock_alerta numeric(12,2),
    stock_deseado numeric(12,2),
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    estado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.stock_item_almacen OWNER TO postgres;

--
-- TOC entry 285 (class 1259 OID 17280)
-- Name: sucursal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sucursal (
    id_sucursal uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    nombre character varying(100) NOT NULL,
    direccion character varying(255),
    telefono character varying(20),
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    codigo_establecimiento character(3) DEFAULT '001'::bpchar NOT NULL,
    CONSTRAINT sucursal_codigo_establecimiento_check CHECK ((codigo_establecimiento ~ '^[0-9]{3}$'::text))
);


ALTER TABLE public.sucursal OWNER TO postgres;

--
-- TOC entry 393 (class 1259 OID 223680)
-- Name: tamano_empresa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tamano_empresa (
    id_tamano_empresa uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo character varying(10) NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(150),
    orden smallint DEFAULT 0 NOT NULL,
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);


ALTER TABLE public.tamano_empresa OWNER TO postgres;

--
-- TOC entry 306 (class 1259 OID 22128)
-- Name: tercero; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tercero (
    id_tercero uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    cliente_potencial boolean DEFAULT false,
    cliente boolean DEFAULT false,
    proveedor boolean DEFAULT false,
    nombre character varying(150) NOT NULL,
    apodo character varying(150),
    codigo_cliente character varying(20),
    direccion text,
    poblacion character varying(100),
    codigo_postal character varying(20),
    id_pais uuid,
    telefono character varying(20),
    movil character varying(20),
    fax character varying(20),
    correo character varying(150),
    web character varying(150),
    id_profesional_1 character varying(50),
    id_profesional_2 character varying(50),
    cif_intra character varying(50),
    sujeto_iva boolean DEFAULT true,
    capital numeric(18,2),
    id_condicion_pago uuid,
    id_forma_pago uuid,
    sede_central uuid,
    asignado_a uuid,
    id_tipo_tercero uuid,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado boolean DEFAULT true NOT NULL,
    id_tipo_entidad smallint,
    id_provincia uuid,
    codigo_proveedor character varying(20),
    id_tamano_empresa uuid
);


ALTER TABLE public.tercero OWNER TO postgres;

--
-- TOC entry 359 (class 1259 OID 99569)
-- Name: tipo_cambio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_cambio (
    id_tipo_cambio uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_moneda_origen uuid NOT NULL,
    id_moneda_destino uuid NOT NULL,
    fecha_cambio date NOT NULL,
    tasa_cambio numeric(10,4) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.tipo_cambio OWNER TO postgres;

--
-- TOC entry 402 (class 1259 OID 238301)
-- Name: tipo_comportamiento_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_comportamiento_item (
    id_tipo_comportamiento uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    orden integer,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.tipo_comportamiento_item OWNER TO postgres;

--
-- TOC entry 389 (class 1259 OID 222443)
-- Name: tipo_control_caducidad_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_control_caducidad_item (
    id_tipo_control_caducidad uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    orden integer,
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.tipo_control_caducidad_item OWNER TO postgres;

--
-- TOC entry 400 (class 1259 OID 237122)
-- Name: tipo_control_inventario_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_control_inventario_item (
    id_tipo_control_inventario uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    orden integer DEFAULT 1 NOT NULL,
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.tipo_control_inventario_item OWNER TO postgres;

--
-- TOC entry 296 (class 1259 OID 18568)
-- Name: tipo_entidad_comercial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_entidad_comercial (
    id_tipo_entidad smallint NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text
);


ALTER TABLE public.tipo_entidad_comercial OWNER TO postgres;

--
-- TOC entry 295 (class 1259 OID 18567)
-- Name: tipo_entidad_comercial_id_tipo_entidad_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipo_entidad_comercial_id_tipo_entidad_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_entidad_comercial_id_tipo_entidad_seq OWNER TO postgres;

--
-- TOC entry 6037 (class 0 OID 0)
-- Dependencies: 295
-- Name: tipo_entidad_comercial_id_tipo_entidad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_entidad_comercial_id_tipo_entidad_seq OWNED BY public.tipo_entidad_comercial.id_tipo_entidad;


--
-- TOC entry 390 (class 1259 OID 222463)
-- Name: tipo_item_catalogo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_item_catalogo (
    id_tipo_item uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    orden integer,
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.tipo_item_catalogo OWNER TO postgres;

--
-- TOC entry 392 (class 1259 OID 222503)
-- Name: tipo_movimiento_contable_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_movimiento_contable_item (
    id_tipo_movimiento_contable uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    orden integer,
    estado boolean DEFAULT true NOT NULL,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tipo_movimiento_contable_item OWNER TO postgres;

--
-- TOC entry 302 (class 1259 OID 22057)
-- Name: tipo_tercero_catalogo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_tercero_catalogo (
    id_tipo_tercero uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.tipo_tercero_catalogo OWNER TO postgres;

--
-- TOC entry 373 (class 1259 OID 219803)
-- Name: tipo_unidad_medida; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_unidad_medida (
    id_tipo_unidad uuid NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    activo boolean DEFAULT true
);


ALTER TABLE public.tipo_unidad_medida OWNER TO postgres;

--
-- TOC entry 310 (class 1259 OID 32151)
-- Name: tipos_miembro; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipos_miembro (
    id integer NOT NULL,
    etiqueta character varying(100) NOT NULL,
    estado character varying(20) DEFAULT 'Activo'::character varying,
    naturaleza character varying(100),
    sujeto_cotizacion boolean DEFAULT true,
    importe numeric(10,2) DEFAULT 0.00,
    cualquier_importe boolean DEFAULT false,
    voto_autorizado boolean DEFAULT true,
    duracion integer DEFAULT 0,
    descripcion text,
    email_bienvenida text,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tipos_miembro OWNER TO postgres;

--
-- TOC entry 309 (class 1259 OID 32150)
-- Name: tipos_miembro_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipos_miembro_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipos_miembro_id_seq OWNER TO postgres;

--
-- TOC entry 6044 (class 0 OID 0)
-- Dependencies: 309
-- Name: tipos_miembro_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipos_miembro_id_seq OWNED BY public.tipos_miembro.id;


--
-- TOC entry 361 (class 1259 OID 106298)
-- Name: titular_cuenta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.titular_cuenta (
    id_titular_cuenta uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre_completo character varying(160) NOT NULL,
    direccion character varying(240),
    codigo_postal character varying(24),
    ciudad character varying(120),
    id_pais uuid
);


ALTER TABLE public.titular_cuenta OWNER TO postgres;

--
-- TOC entry 380 (class 1259 OID 221048)
-- Name: transferencia_stock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transferencia_stock (
    id_transferencia_stock uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    transferencia_ref character varying(100) NOT NULL,
    id_almacen_origen uuid NOT NULL,
    id_almacen_destino uuid NOT NULL,
    estado_transferencia character varying(30) DEFAULT 'BORRADOR'::character varying NOT NULL,
    fecha_transferencia timestamp without time zone DEFAULT now() NOT NULL,
    observacion text,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    estado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.transferencia_stock OWNER TO postgres;

--
-- TOC entry 381 (class 1259 OID 221072)
-- Name: transferencia_stock_detalle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transferencia_stock_detalle (
    id_transferencia_stock_detalle uuid DEFAULT gen_random_uuid() NOT NULL,
    id_transferencia_stock uuid NOT NULL,
    id_item uuid NOT NULL,
    id_lote_serie uuid,
    cantidad numeric(12,2) NOT NULL,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    estado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.transferencia_stock_detalle OWNER TO postgres;

--
-- TOC entry 374 (class 1259 OID 219813)
-- Name: unidad_medida; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unidad_medida (
    id_unidad uuid DEFAULT gen_random_uuid() NOT NULL,
    id_tipo_unidad uuid NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(100) NOT NULL,
    simbolo character varying(20) NOT NULL,
    descripcion text,
    activo boolean DEFAULT true
);


ALTER TABLE public.unidad_medida OWNER TO postgres;

--
-- TOC entry 287 (class 1259 OID 17347)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id_usuario uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_perfil uuid NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    nombre_completo character varying(100),
    email character varying(128),
    estado boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    scope_acceso character varying(20) DEFAULT 'EMPRESA'::character varying NOT NULL,
    titulo_cortesia character varying(20),
    apellidos character varying(100),
    nombre character varying(100),
    sexo character varying(1),
    es_empleado boolean DEFAULT false,
    id_supervisor uuid,
    id_validador_gastos uuid,
    id_validador_dias_libres uuid,
    usuario_externo boolean DEFAULT false,
    fecha_validez_desde date,
    fecha_validez_hasta date,
    direccion character varying(255),
    codigo_postal character varying(20),
    poblacion character varying(100),
    id_pais uuid,
    id_provincia uuid,
    telefono_trabajo character varying(30),
    movil character varying(30),
    fax character varying(30),
    codigo_contable character varying(50),
    color character varying(20),
    etiquetas_categorias character varying(255),
    idioma_default character varying(10),
    firma text,
    nota_publica text,
    nota_privada text,
    puesto_trabajo character varying(100),
    tasa_hora numeric(12,2),
    tasa_dia numeric(12,2),
    salario numeric(14,2),
    horas_semana numeric(5,2),
    fecha_empleo_desde date,
    fecha_empleo_hasta date,
    fecha_nacimiento date,
    CONSTRAINT usuario_scope_acceso_check CHECK (((scope_acceso)::text = ANY ((ARRAY['EMPRESA'::character varying, 'GLOBAL'::character varying])::text[])))
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 283 (class 1259 OID 17251)
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- TOC entry 275 (class 1259 OID 17000)
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- TOC entry 278 (class 1259 OID 17027)
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- TOC entry 277 (class 1259 OID 17026)
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 259 (class 1259 OID 16544)
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- TOC entry 6055 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 314 (class 1259 OID 53242)
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- TOC entry 363 (class 1259 OID 119631)
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

--
-- TOC entry 261 (class 1259 OID 16586)
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- TOC entry 260 (class 1259 OID 16559)
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- TOC entry 6059 (class 0 OID 0)
-- Dependencies: 260
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 279 (class 1259 OID 17071)
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb,
    metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- TOC entry 280 (class 1259 OID 17085)
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- TOC entry 364 (class 1259 OID 119641)
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- TOC entry 4021 (class 2604 OID 16508)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 4087 (class 2604 OID 18513)
-- Name: entidad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entidad ALTER COLUMN id SET DEFAULT nextval('public.entidad_id_seq'::regclass);


--
-- TOC entry 4116 (class 2604 OID 24392)
-- Name: impuestos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.impuestos ALTER COLUMN id SET DEFAULT nextval('public.impuestos_id_seq'::regclass);


--
-- TOC entry 4127 (class 2604 OID 32170)
-- Name: miembros id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.miembros ALTER COLUMN id SET DEFAULT nextval('public.miembros_id_seq'::regclass);


--
-- TOC entry 4369 (class 2604 OID 216427)
-- Name: secuencia_asiento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secuencia_asiento ALTER COLUMN id SET DEFAULT nextval('public.secuencia_asiento_id_seq'::regclass);


--
-- TOC entry 4092 (class 2604 OID 18571)
-- Name: tipo_entidad_comercial id_tipo_entidad; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_entidad_comercial ALTER COLUMN id_tipo_entidad SET DEFAULT nextval('public.tipo_entidad_comercial_id_tipo_entidad_seq'::regclass);


--
-- TOC entry 4119 (class 2604 OID 32154)
-- Name: tipos_miembro id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_miembro ALTER COLUMN id SET DEFAULT nextval('public.tipos_miembro_id_seq'::regclass);


--
-- TOC entry 5626 (class 0 OID 16523)
-- Dependencies: 257
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	4ff41a9a-f7d5-4ed0-90ca-fa986ea0b6c0	{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"xgranda@outlook.com","user_id":"a4c5c2f3-b7b2-4204-83bb-80a703bd67e8"}}	2025-07-26 04:18:40.212048+00	
00000000-0000-0000-0000-000000000000	1a979a4c-ff2f-4b0c-b77f-13a32680e293	{"action":"user_signedup","actor_id":"a4c5c2f3-b7b2-4204-83bb-80a703bd67e8","actor_username":"xgranda@outlook.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-26 04:25:22.346977+00	
00000000-0000-0000-0000-000000000000	1bd703ab-76e9-4cad-8b85-00bc7e675566	{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"senaidatixilema@hotmail.com","user_id":"ce1f7469-483f-4225-a98b-3f3ecf1f15dd"}}	2025-07-26 15:58:35.600236+00	
00000000-0000-0000-0000-000000000000	1543194a-3541-40e4-b55a-26c58a01d3dc	{"action":"user_signedup","actor_id":"ce1f7469-483f-4225-a98b-3f3ecf1f15dd","actor_username":"senaidatixilema@hotmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-26 16:03:04.852404+00	
00000000-0000-0000-0000-000000000000	8bd7aec3-b561-42b4-9c7b-b2476addfaea	{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ccalvasarangoc@outlook.com","user_id":"56921ed1-8f42-452e-a173-827cb169a50a"}}	2025-07-31 02:42:13.718158+00	
00000000-0000-0000-0000-000000000000	99b2574f-3ad1-4d6c-bcb0-b8f4c635b68e	{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ccalvasarango@gmail.com","user_id":"d99f8545-e3bb-40ab-b0a0-412120940fc5"}}	2025-07-31 02:42:55.057388+00	
00000000-0000-0000-0000-000000000000	08d2177f-f0e1-4755-9d30-0b42df3d934e	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ccalvasarango@gmail.com","user_id":"d99f8545-e3bb-40ab-b0a0-412120940fc5","user_phone":""}}	2025-07-31 02:43:08.715571+00	
00000000-0000-0000-0000-000000000000	0abf9fae-0c35-4454-a194-8164c4a13ef4	{"action":"user_signedup","actor_id":"56921ed1-8f42-452e-a173-827cb169a50a","actor_username":"ccalvasarangoc@outlook.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-31 02:43:44.218995+00	
\.


--
-- TOC entry 5731 (class 0 OID 211933)
-- Dependencies: 368
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5640 (class 0 OID 16925)
-- Dependencies: 273
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- TOC entry 5631 (class 0 OID 16723)
-- Dependencies: 264
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
a4c5c2f3-b7b2-4204-83bb-80a703bd67e8	a4c5c2f3-b7b2-4204-83bb-80a703bd67e8	{"sub": "a4c5c2f3-b7b2-4204-83bb-80a703bd67e8", "email": "xgranda@outlook.com", "email_verified": true, "phone_verified": false}	email	2025-07-26 04:18:40.202709+00	2025-07-26 04:18:40.203912+00	2025-07-26 04:18:40.203912+00	67079629-d910-4e78-9010-d491b41de981
ce1f7469-483f-4225-a98b-3f3ecf1f15dd	ce1f7469-483f-4225-a98b-3f3ecf1f15dd	{"sub": "ce1f7469-483f-4225-a98b-3f3ecf1f15dd", "email": "senaidatixilema@hotmail.com", "email_verified": true, "phone_verified": false}	email	2025-07-26 15:58:35.59462+00	2025-07-26 15:58:35.594674+00	2025-07-26 15:58:35.594674+00	b7f8affb-f592-44c3-97ce-2a603fd1274a
56921ed1-8f42-452e-a173-827cb169a50a	56921ed1-8f42-452e-a173-827cb169a50a	{"sub": "56921ed1-8f42-452e-a173-827cb169a50a", "email": "ccalvasarangoc@outlook.com", "email_verified": true, "phone_verified": false}	email	2025-07-31 02:42:13.71237+00	2025-07-31 02:42:13.712425+00	2025-07-31 02:42:13.712425+00	6e99f017-1e8f-467f-a11f-1c1264a0b612
\.


--
-- TOC entry 5625 (class 0 OID 16516)
-- Dependencies: 256
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5635 (class 0 OID 16812)
-- Dependencies: 268
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
c866524b-f409-4aa3-87c0-cdcb60bf62ce	2025-07-26 04:25:22.376895+00	2025-07-26 04:25:22.376895+00	otp	f3558b81-71a3-40cc-9a2c-d09269819c13
b2db29ec-170c-483c-85cc-36ba510e5dc4	2025-07-26 16:03:04.866065+00	2025-07-26 16:03:04.866065+00	otp	02894d3f-5d38-413c-98af-5ed1e1c9f5ee
622a77d3-1349-4968-8b65-4b82d7ac4385	2025-07-31 02:43:44.249809+00	2025-07-31 02:43:44.249809+00	otp	9b4d653a-4b53-4b20-a020-a953985b4f2b
\.


--
-- TOC entry 5634 (class 0 OID 16800)
-- Dependencies: 267
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- TOC entry 5633 (class 0 OID 16787)
-- Dependencies: 266
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- TOC entry 5690 (class 0 OID 94213)
-- Dependencies: 327
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- TOC entry 5728 (class 0 OID 144205)
-- Dependencies: 365
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- TOC entry 5678 (class 0 OID 78675)
-- Dependencies: 315
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- TOC entry 5691 (class 0 OID 94246)
-- Dependencies: 328
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- TOC entry 5641 (class 0 OID 16975)
-- Dependencies: 274
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5624 (class 0 OID 16505)
-- Dependencies: 255
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	1	jep7xduphjdl	a4c5c2f3-b7b2-4204-83bb-80a703bd67e8	f	2025-07-26 04:25:22.35898+00	2025-07-26 04:25:22.35898+00	\N	c866524b-f409-4aa3-87c0-cdcb60bf62ce
00000000-0000-0000-0000-000000000000	2	7w2tklus4lss	ce1f7469-483f-4225-a98b-3f3ecf1f15dd	f	2025-07-26 16:03:04.859828+00	2025-07-26 16:03:04.859828+00	\N	b2db29ec-170c-483c-85cc-36ba510e5dc4
00000000-0000-0000-0000-000000000000	3	gk2nwfzetzhp	56921ed1-8f42-452e-a173-827cb169a50a	f	2025-07-31 02:43:44.229544+00	2025-07-31 02:43:44.229544+00	\N	622a77d3-1349-4968-8b65-4b82d7ac4385
\.


--
-- TOC entry 5638 (class 0 OID 16854)
-- Dependencies: 271
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- TOC entry 5639 (class 0 OID 16872)
-- Dependencies: 272
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- TOC entry 5627 (class 0 OID 16531)
-- Dependencies: 258
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
20260302000000
\.


--
-- TOC entry 5632 (class 0 OID 16753)
-- Dependencies: 265
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
c866524b-f409-4aa3-87c0-cdcb60bf62ce	a4c5c2f3-b7b2-4204-83bb-80a703bd67e8	2025-07-26 04:25:22.353987+00	2025-07-26 04:25:22.353987+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	157.100.198.87	\N	\N	\N	\N	\N
b2db29ec-170c-483c-85cc-36ba510e5dc4	ce1f7469-483f-4225-a98b-3f3ecf1f15dd	2025-07-26 16:03:04.857623+00	2025-07-26 16:03:04.857623+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36	186.66.71.86	\N	\N	\N	\N	\N
622a77d3-1349-4968-8b65-4b82d7ac4385	56921ed1-8f42-452e-a173-827cb169a50a	2025-07-31 02:43:44.224619+00	2025-07-31 02:43:44.224619+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36	45.161.33.167	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5637 (class 0 OID 16839)
-- Dependencies: 270
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5636 (class 0 OID 16830)
-- Dependencies: 269
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- TOC entry 5622 (class 0 OID 16493)
-- Dependencies: 253
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	56921ed1-8f42-452e-a173-827cb169a50a	authenticated	authenticated	ccalvasarangoc@outlook.com	$2a$10$EZ08ERoTdpWciTduORDyAudcLCU9x6sdcwUVOedrFnjDXxbKz3OBu	2025-07-31 02:43:44.220278+00	2025-07-31 02:42:13.733227+00		\N		\N			\N	2025-07-31 02:43:44.224513+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-07-31 02:42:13.696238+00	2025-07-31 02:43:44.249349+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	a4c5c2f3-b7b2-4204-83bb-80a703bd67e8	authenticated	authenticated	xgranda@outlook.com	$2a$10$qBc1dCV9CJoF.cDXnpK14OmDNEV0h/HcmRWsYDvggcPXgbB8tcfj.	2025-07-26 04:25:22.347817+00	2025-07-26 04:18:40.231784+00		\N		\N			\N	2025-07-26 04:25:22.353853+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-07-26 04:18:40.174081+00	2025-07-26 04:25:22.376397+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	ce1f7469-483f-4225-a98b-3f3ecf1f15dd	authenticated	authenticated	senaidatixilema@hotmail.com	$2a$10$v/LdCMhxJDLT45TEdVzwO..NnvJyg/mX2supB8ivCh1q6UMXX2aIi	2025-07-26 16:03:04.853215+00	2025-07-26 15:58:35.61746+00		\N		\N			\N	2025-07-26 16:03:04.857547+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-07-26 15:58:35.580187+00	2025-07-26 16:03:04.865594+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- TOC entry 5762 (class 0 OID 232677)
-- Dependencies: 399
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_challenges (id, user_id, challenge_type, session_data, created_at, expires_at) FROM stdin;
\.


--
-- TOC entry 5761 (class 0 OID 232654)
-- Dependencies: 398
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_credentials (id, user_id, credential_id, public_key, attestation_type, aaguid, sign_count, transports, backup_eligible, backed_up, friendly_name, created_at, updated_at, last_used_at) FROM stdin;
\.


--
-- TOC entry 5738 (class 0 OID 220931)
-- Dependencies: 375
-- Data for Name: almacen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.almacen (id_almacen, id_empresa, almacen_ref, nombre, descripcion, direccion, codigo_postal, poblacion, id_pais, telefono, fax, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
dd04ca48-b2e6-4ac3-a5e3-04bcc7d6038d	0459fe04-163b-4b89-b98a-0f1179b7224c	ALM-001	Almacén principal	Almacén principal de la empresa	Matriz	0000	Ciudad principal	\N	\N	\N	\N	\N	2026-03-08 18:58:28.471694	2026-03-08 18:58:28.471694	t
0c924077-1e60-42a5-a714-3576e3e85871	0459fe04-163b-4b89-b98a-0f1179b7224c	ALM-002	Almacén secundario	Almacén auxiliar de productos	Sucursal	0000	Ciudad secundaria	\N	\N	\N	\N	\N	2026-03-08 18:58:28.471694	2026-03-08 18:58:28.471694	t
1f68e097-0453-4880-b589-b7e3718bebfd	0459fe04-163b-4b89-b98a-0f1179b7224c	ALM-003	Almacén tránsito	Almacén para movimientos temporales	Centro logístico	0000	Centro de distribución	\N	\N	\N	\N	\N	2026-03-08 18:58:28.471694	2026-03-08 18:58:28.471694	t
\.


--
-- TOC entry 5695 (class 0 OID 98859)
-- Dependencies: 332
-- Data for Name: asiento_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asiento_contable (id_asiento_contable, id_empresa, id_diario_contable, numero_asiento, fecha_asiento, concepto, referencia, total_debe, total_haber, estado, id_usuario_creacion, id_usuario_aprobacion, created_at, fecha_aprobacion, updated_at, reversed_entry_id) FROM stdin;
\.


--
-- TOC entry 5757 (class 0 OID 228127)
-- Dependencies: 394
-- Data for Name: banco; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.banco (id_banco, nombre, codigo, swift, web, estado, created_by, updated_by, created_at, updated_at) FROM stdin;
d6e3470f-8887-4e70-a9a1-5cbc5c7da591	Banco de Loja	BDL	\N	\N	t	\N	\N	2026-04-19 18:42:21.543619	2026-04-19 18:42:21.543619
87d8015d-1b25-43b5-ade8-e30c12bf0f30	Banco de Guayaquil	BG	\N	\N	t	\N	\N	2026-04-19 18:42:21.543619	2026-04-19 18:42:21.543619
51bdb79b-22d1-4e36-8b8d-a7206e9c8bbd	Banco del Pacífico	BP	\N	\N	t	\N	\N	2026-04-19 18:42:21.543619	2026-04-19 18:42:21.543619
\.


--
-- TOC entry 5749 (class 0 OID 222344)
-- Dependencies: 386
-- Data for Name: categoria_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria_item (id_categoria_item, id_empresa, codigo, nombre, descripcion, id_categoria_padre, estado, created_at, updated_at, created_by, updated_by) FROM stdin;
876ca004-81ac-4834-80a2-3f0ebb665a82	0459fe04-163b-4b89-b98a-0f1179b7224c	PROD-GEN	Productos generales	Categoría general de productos	\N	t	2026-03-08 18:36:11.215699	2026-03-08 18:36:11.215699	\N	\N
75d9da17-6584-4227-b9db-6f7acf4a5bea	0459fe04-163b-4b89-b98a-0f1179b7224c	SERV-GEN	Servicios generales	Categoría general de servicios	\N	t	2026-03-08 18:36:11.215699	2026-03-08 18:36:11.215699	\N	\N
c15dd8ba-693a-402d-a3e5-91ae53e28fcb	0459fe04-163b-4b89-b98a-0f1179b7224c	CONS	Consumibles	Productos consumibles	\N	t	2026-03-08 18:36:11.215699	2026-03-08 18:36:11.215699	\N	\N
dddf3951-cc86-472c-b795-e037473d4a2c	0459fe04-163b-4b89-b98a-0f1179b7224c	MANT	Mantenimiento	Servicios de mantenimiento	\N	t	2026-03-08 18:36:11.215699	2026-03-08 18:36:11.215699	\N	\N
\.


--
-- TOC entry 5720 (class 0 OID 99533)
-- Dependencies: 357
-- Data for Name: centro_costo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.centro_costo (id_centro_costo, id_empresa, codigo, nombre, descripcion, estado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5723 (class 0 OID 99593)
-- Dependencies: 360
-- Data for Name: cierre_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cierre_contable (id_cierre_contable, id_empresa, id_periodo_contable, tipo_cierre, fecha_cierre, id_usuario_cierre, observaciones, estado) FROM stdin;
\.


--
-- TOC entry 5692 (class 0 OID 98790)
-- Dependencies: 329
-- Data for Name: cierre_cuenta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cierre_cuenta (id_cierre_cuenta, id_empresa, id_periodo_contable, id_cuenta_contable, saldo_debe, saldo_haber, saldo_final, fecha_cierre, id_usuario_cierre) FROM stdin;
\.


--
-- TOC entry 5735 (class 0 OID 219784)
-- Dependencies: 372
-- Data for Name: ciudad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ciudad (id_ciudad, id_provincia, nombre, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5712 (class 0 OID 99318)
-- Dependencies: 349
-- Data for Name: conciliacion_bancaria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conciliacion_bancaria (id_conciliacion_bancaria, id_empresa, id_cuenta_bancaria, id_periodo_contable, saldo_libro, saldo_banco, diferencia, estado, fecha_conciliacion, id_usuario_conciliacion, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5666 (class 0 OID 22065)
-- Dependencies: 303
-- Data for Name: condicion_pago_catalogo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.condicion_pago_catalogo (id_condicion_pago, descripcion) FROM stdin;
31cf451e-a589-484e-b33d-3bd7d20ec98a	condicio1
464a061b-594d-4883-9d8e-55e735f0ad07	condicion2
bb5b50be-202f-4e23-a992-c5534c7df39b	condicion3
\.


--
-- TOC entry 5679 (class 0 OID 93112)
-- Dependencies: 316
-- Data for Name: configuracion_contabilidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configuracion_contabilidad (id_configuracion_contabilidad, id_empresa, id_moneda_base, formato_cuenta, separador_cuenta, longitud_nivel, usar_centavos, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5663 (class 0 OID 18651)
-- Dependencies: 300
-- Data for Name: contable_externo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contable_externo (id_contable, id_empresa, razon_social, direccion, codigo_postal, poblacion, id_pais, id_provincia, telefono, fax, correo, web, codigo_contable, nota, created_by, created_at, updated_by, updated_at) FROM stdin;
\.


--
-- TOC entry 5729 (class 0 OID 207464)
-- Dependencies: 366
-- Data for Name: contacto_direccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacto_direccion (id_contacto, id_tercero, apellidos_etiqueta, nombre, titulo_cortesia, puesto_trabajo, direccion, codigo_postal, poblacion, id_pais, telefono_trabajo, telefono_particular, movil, fax, correo, visibilidad, fecha_nacimiento, alerta_cumpleanos, estado, created_at, updated_at, id_provincia, creado_por, modificado_por) FROM stdin;
3e93f165-9130-4abd-94e7-a12913b19cc4	ebc4e287-1762-485c-8836-63f1ad8f84a1	ContactoCliaKA	ContactoCliaKA	laravito	\N	45 y la lsd	45678	guayquil	d4882144-caf7-46e8-8f72-4378a29a7ff7	2244806	216344	1113336678	\N	ddd@mail.com	publico	2026-04-15	f	t	2026-04-15 17:12:19.674847	\N	e79fa3a5-fd6d-4310-a878-93d48740d9bd	\N	\N
e60f1ebc-663f-4d53-8d16-0dde1e5e6af6	ebc4e287-1762-485c-8836-63f1ad8f84a1	negrisKK	negrisKK	negritas	empleado	19 y la cccfer	4370	guayaquil	d4882144-caf7-46e8-8f72-4378a29a7ff7	2241202	1117789	4567912537	8941	cxXXc@mail.com	publico	2026-04-15	f	t	2026-04-15 17:15:21.900481	2026-04-15 17:38:40.32293	a5cdcac2-b3e1-4a24-b4a1-3244ee3d00a6	\N	\N
3656efad-f9b3-46fc-9554-f081aa2c98b9	ebc4e287-1762-485c-8836-63f1ad8f84a1	caritoBB	caritoBB	todologa	administraora	25 y la atarzana	1242	guayaquil	d4882144-caf7-46e8-8f72-4378a29a7ff7	126809	376143	0973618409	1112	ka@mail.com	publico	2026-04-15	f	t	2026-04-15 17:41:33.752852	\N	a5cdcac2-b3e1-4a24-b4a1-3244ee3d00a6	\N	\N
33813c49-b762-49f9-92e4-33b9848c36b1	c1eebef1-965a-4820-8c5a-ca8adcd62b62	surfaceJJ	surfaceJJ	ingenieroIA	prohramador	30 y la erk	2743	quito	d4882144-caf7-46e8-8f72-4378a29a7ff7	9753065	4632190	0921547832	4521	hh@mail.com	publico	2026-04-15	f	t	2026-04-15 18:13:40.749755	\N	e79fa3a5-fd6d-4310-a878-93d48740d9bd	\N	\N
a51f9fe5-fe3a-41cb-b8fb-2d859ffa06ec	c1eebef1-965a-4820-8c5a-ca8adcd62b62	viaje	viaje	nada	nadax	17 y cuenca	538	guayaquil	d4882144-caf7-46e8-8f72-4378a29a7ff7	8736456	8887776	0988888765	9111	yy@mail.com	publico	2026-04-13	f	t	2026-04-15 18:16:03.619619	\N	a5cdcac2-b3e1-4a24-b4a1-3244ee3d00a6	\N	\N
1e296699-6af3-420a-9840-0244ba7925e2	6353efce-b194-493e-9187-89474f6bb7c2	santy	santy	arquitecto	arquitecto	atarazana2	90372	guayaquil	d4882144-caf7-46e8-8f72-4378a29a7ff7	9999999	888888	0999999998	3321	santy@mail.com	privado	2025-07-08	f	t	2026-04-15 18:47:16.793467	2026-04-15 18:48:06.138999	a5cdcac2-b3e1-4a24-b4a1-3244ee3d00a6	\N	\N
961b04db-99c0-4786-84db-e9ac3dc67cf0	6353efce-b194-493e-9187-89474f6bb7c2	gimmysegundo	gimmysegundo	doctor	sirujano	ceibos	8465	quito	d4882144-caf7-46e8-8f72-4378a29a7ff7	7776665	2221114	5559998294	4561	gs@mail.com	publico	2026-04-01	f	t	2026-04-15 18:50:31.030421	\N	e79fa3a5-fd6d-4310-a878-93d48740d9bd	\N	\N
\.


--
-- TOC entry 5703 (class 0 OID 99073)
-- Dependencies: 340
-- Data for Name: cotizacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cotizacion (id_cotizacion, id_empresa, numero_cotizacion, id_tercero, fecha_cotizacion, fecha_vencimiento, subtotal, total_impuestos, total_descuentos, total_cotizacion, estado, observaciones, id_usuario_creacion, id_usuario_aprobacion, fecha_aprobacion, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5704 (class 0 OID 99108)
-- Dependencies: 341
-- Data for Name: cotizacion_linea; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cotizacion_linea (id_cotizacion_linea, id_cotizacion, id_item, descripcion, cantidad, precio_unitario, descuento_porcentaje, descuento_valor, subtotal, orden, created_at) FROM stdin;
\.


--
-- TOC entry 5707 (class 0 OID 99200)
-- Dependencies: 344
-- Data for Name: cotizacion_prefactura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cotizacion_prefactura (id_cotizacion_prefactura, id_cotizacion, id_prefactura, porcentaje_utilizado, created_at) FROM stdin;
\.


--
-- TOC entry 5686 (class 0 OID 93269)
-- Dependencies: 323
-- Data for Name: cuenta_bancaria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta_bancaria (id_cuenta_bancaria, id_empresa, id_banco, numero_cuenta, tipo_cuenta, id_moneda, id_cuenta_contable, saldo_inicial, saldo_actual, estado, created_at, updated_at, created_by, updated_by, id_tercero, referencia, etiqueta_cuenta, estado_cuenta, id_pais, id_provincia, direccion_banco, web, comentario, comentario_html, fecha_saldo_inicial, saldo_minimo_autorizado, saldo_minimo_deseado, iban, bic_swift, codigo_contable) FROM stdin;
d9a81375-0d6b-4f96-b57a-a47a00838c08	45fa1728-15ad-485e-ade6-3c2f058e882f	87d8015d-1b25-43b5-ade8-e30c12bf0f30	232323	corriente	e1adef10-67d8-4194-a782-e85549c4d035	\N	0.07	0.03	t	2026-04-20 02:07:47.98734	2026-04-26 15:43:22.199965	\N	\N	\N	12312	12312	abierta	d4882144-caf7-46e8-8f72-4378a29a7ff7	29ea3fbc-c4d2-4de2-9841-e124bdf4a6c2	QC74+45F\nCalle	2323	2232323	232323	2026-04-20	100.00	100.00	2323	2323	2323
13c8d4ac-8b4f-491a-a43e-00d29e778598	45fa1728-15ad-485e-ade6-3c2f058e882f	87d8015d-1b25-43b5-ade8-e30c12bf0f30	123123123	corriente	e1adef10-67d8-4194-a782-e85549c4d035	01a8fad1-823e-49e2-aff0-f46a95bb5a6c	0.04	0.04	t	2026-04-26 16:25:36.275324	2026-04-26 16:25:36.275324	\N	\N	\N	12312312	1231231	abierta	d4882144-caf7-46e8-8f72-4378a29a7ff7	cda4a524-d603-4610-9e95-83b1ec9a089c	asdfasdfasd	asdfasdfa	ok	\N	2026-04-26	0.03	0.05	123123123	\N	1101
35492e00-cce5-4aae-85d5-dce1fcc5bf52	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	d6e3470f-8887-4e70-a9a1-5cbc5c7da591	1234134132	corriente	e1adef10-67d8-4194-a782-e85549c4d035	01a8fad1-823e-49e2-aff0-f46a95bb5a6c	0.04	0.04	t	2026-04-26 16:27:58.587419	2026-04-26 16:27:58.587419	\N	\N	2d68f336-6cc5-469f-a871-56b9a40aa363	12312312312	123123123	abierta	d4882144-caf7-46e8-8f72-4378a29a7ff7	53bdf39f-3477-4604-8cdb-542cab32fc5e	asdfadsfasd	asdfasdfasd	\N	\N	2026-04-26	0.03	0.04	1341341	\N	1101
\.


--
-- TOC entry 5683 (class 0 OID 93200)
-- Dependencies: 320
-- Data for Name: cuenta_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta_contable (id_cuenta_contable, id_plan_contable, codigo, nombre, descripcion, tipo_cuenta, nivel, id_cuenta_padre, permite_movimientos, estado, created_at, updated_at) FROM stdin;
01a8fad1-823e-49e2-aff0-f46a95bb5a6c	98f6c564-40e9-49a3-9fa0-3c233da86415	1101	Caja General	Caja	ACTIVO	1	\N	t	t	2026-02-14 20:30:14.048437	2026-02-14 20:30:14.048437
8d784118-d7b8-4da4-a003-f3477e6d8462	98f6c564-40e9-49a3-9fa0-3c233da86415	4101	Ventas Nacionales	Ventas	INGRESO	1	\N	t	t	2026-02-14 20:30:14.048437	2026-02-14 20:30:14.048437
9011723f-1483-48a6-a31b-e3559fe2aa52	98f6c564-40e9-49a3-9fa0-3c233da86415	5101	Compras Nacionales	Compras	GASTO	1	\N	t	t	2026-02-14 20:30:14.048437	2026-02-14 20:30:14.048437
d1d6e091-0c50-41ce-9132-9e4d89601088	98f6c564-40e9-49a3-9fa0-3c233da86415	4110	Ventas Nacionales	Cuenta de ventas	RESULTADO	1	\N	t	t	2026-03-09 02:03:00.988401	2026-03-09 02:03:00.988401
36f64c20-9f6f-48d2-8ece-529ac1464c4d	98f6c564-40e9-49a3-9fa0-3c233da86415	5120	Compras Nacionales	Cuenta de compras	RESULTADO	1	\N	t	t	2026-03-09 02:03:00.988401	2026-03-09 02:03:00.988401
c8e89437-e1d6-4624-b73a-ba03c4ad6ced	98f6c564-40e9-49a3-9fa0-3c233da86415	6523	Cuenta Servicio Venta	Cuenta de ventas de servicio	RESULTADO	1	\N	t	t	2026-03-09 02:03:00.988401	2026-03-09 02:03:00.988401
95d8374f-2278-4c6f-bcf3-2e4a71775022	98f6c564-40e9-49a3-9fa0-3c233da86415	8060	Cuenta Servicio Especial	Cuenta especial de ventas/servicios	RESULTADO	1	\N	t	t	2026-03-09 02:03:00.988401	2026-03-09 02:03:00.988401
90a798f9-c0d1-40cd-b0d7-d7e212a6e3ee	98f6c564-40e9-49a3-9fa0-3c233da86415	3110	Ventas Nacionales	Cuenta de ventas nacionales	RESULTADO	1	\N	t	t	2026-03-09 02:14:00.33126	2026-03-09 02:14:00.33126
43d7d645-94a2-4cd3-b90e-953476ab313a	98f6c564-40e9-49a3-9fa0-3c233da86415	2120	Ventas Exportación	Cuenta de ventas por exportación	RESULTADO	1	\N	t	t	2026-03-09 02:14:00.33126	2026-03-09 02:14:00.33126
0edba558-aa70-4896-a594-14839d1ae541	98f6c564-40e9-49a3-9fa0-3c233da86415	7120	Compras Nacionales	Cuenta de compras nacionales	RESULTADO	1	\N	t	t	2026-03-09 02:14:00.33126	2026-03-09 02:14:00.33126
1433df89-316b-41e9-977f-aad9d702c531	98f6c564-40e9-49a3-9fa0-3c233da86415	7080	Compras de Importación	Cuenta de compras de importación	RESULTADO	1	\N	t	t	2026-03-09 02:14:00.33126	2026-03-09 02:14:00.33126
56f6cd01-5f9f-45d2-b581-6a884a782e59	98f6c564-40e9-49a3-9fa0-3c233da86415	8521	Gasto/Compra Especial 6521	Cuenta especial de compra	RESULTADO	1	\N	t	t	2026-03-09 02:14:00.33126	2026-03-09 02:14:00.33126
b13f8dd7-e5f6-4aed-9a6e-4b76082a40ae	98f6c564-40e9-49a3-9fa0-3c233da86415	9523	Servicio/Venta Especial 6523	Cuenta especial de venta o servicio	RESULTADO	1	\N	t	t	2026-03-09 02:14:00.33126	2026-03-09 02:14:00.33126
ac41a4a1-6f97-49d9-816b-f7d72af98c3b	98f6c564-40e9-49a3-9fa0-3c233da86415	9060	Cuenta Especial 8060	Cuenta especial contable	RESULTADO	1	\N	t	t	2026-03-09 02:14:00.33126	2026-03-09 02:14:00.33126
2b2d2069-ef39-4d01-82c8-d1b214578983	98f6c564-40e9-49a3-9fa0-3c233da86415	3610	Ventas Nacionales	Cuenta de ventas nacionales	RESULTADO	1	\N	t	t	2026-03-09 02:30:09.969952	2026-03-09 02:30:09.969952
096ad21e-8a5c-4304-91f0-a64b12deef8a	98f6c564-40e9-49a3-9fa0-3c233da86415	9320	Ventas Exportación	Cuenta de ventas por exportación	RESULTADO	1	\N	t	t	2026-03-09 02:30:09.969952	2026-03-09 02:30:09.969952
5057b14c-c8bb-4a6f-ac89-2124756d0e3a	98f6c564-40e9-49a3-9fa0-3c233da86415	5820	Compras Nacionales	Cuenta de compras nacionales	RESULTADO	1	\N	t	t	2026-03-09 02:30:09.969952	2026-03-09 02:30:09.969952
04c85e4d-e813-4b53-8f53-c221622ba298	98f6c564-40e9-49a3-9fa0-3c233da86415	6980	Compras de Importación	Cuenta de compras de importación	RESULTADO	1	\N	t	t	2026-03-09 02:30:09.969952	2026-03-09 02:30:09.969952
553b2a59-3a6c-4478-9026-37f83ba23d3e	98f6c564-40e9-49a3-9fa0-3c233da86415	6921	Gasto/Compra Especial 6521	Cuenta especial de compra	RESULTADO	1	\N	t	t	2026-03-09 02:30:09.969952	2026-03-09 02:30:09.969952
7529394f-207e-4b0f-9105-c0cccf2f5a0d	98f6c564-40e9-49a3-9fa0-3c233da86415	6723	Servicio/Venta Especial 6523	Cuenta especial de venta o servicio	RESULTADO	1	\N	t	t	2026-03-09 02:30:09.969952	2026-03-09 02:30:09.969952
e9a4d12e-f100-4cff-a5ce-bbe017806b41	98f6c564-40e9-49a3-9fa0-3c233da86415	8360	Cuenta Especial 8060	Cuenta especial contable	RESULTADO	1	\N	t	t	2026-03-09 02:30:09.969952	2026-03-09 02:30:09.969952
2322f3fa-5f7e-4007-98b8-792b96f59546	98f6c564-40e9-49a3-9fa0-3c233da86415	1102	Banco Pinocho	Bancos	ACTIVO	1	\N	t	t	2026-02-14 20:30:14.048437	2026-02-14 20:30:14.048437
\.


--
-- TOC entry 5685 (class 0 OID 93246)
-- Dependencies: 322
-- Data for Name: cuenta_contable_defecto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta_contable_defecto (id_cuenta_contable_defecto, id_empresa, tipo_operacion, id_cuenta_contable, descripcion, estado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5689 (class 0 OID 93344)
-- Dependencies: 326
-- Data for Name: cuenta_contable_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta_contable_item (id_cuenta_contable_item, id_empresa, id_cuenta_contable, estado, created_at, updated_at, id_item, id_tipo_movimiento_contable, created_by, updated_by) FROM stdin;
c19e9c2c-115e-4734-b8f0-c9aede00742a	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	d1d6e091-0c50-41ce-9132-9e4d89601088	t	2026-03-09 02:04:46.685735	2026-03-09 02:04:46.685735	2ff15f14-ba60-4d64-b046-0d6a0d0caf86	c0a4bb5e-66c2-447e-a2aa-fcde03279adc	\N	\N
d58a3b68-61d2-4c34-a576-126c1eeffc0c	0459fe04-163b-4b89-b98a-0f1179b7224c	36f64c20-9f6f-48d2-8ece-529ac1464c4d	t	2026-03-09 02:04:46.685735	2026-03-09 02:04:46.685735	775f0817-d5a9-4b92-ba2a-a9ed83cbc570	c0a4bb5e-66c2-447e-a2aa-fcde03279adc	\N	\N
75564819-4a96-4cdf-b7d5-5174f1499bd3	0459fe04-163b-4b89-b98a-0f1179b7224c	c8e89437-e1d6-4624-b73a-ba03c4ad6ced	t	2026-03-09 02:04:46.685735	2026-03-09 02:04:46.685735	f9bf9017-7065-4f2f-9653-b7fa5f261cf7	c0a4bb5e-66c2-447e-a2aa-fcde03279adc	\N	\N
e70a5a94-c738-462e-abb2-b95f7f447ae2	0459fe04-163b-4b89-b98a-0f1179b7224c	95d8374f-2278-4c6f-bcf3-2e4a71775022	t	2026-03-09 02:04:46.685735	2026-03-09 02:04:46.685735	621a3156-e075-4e08-975e-594c1fcf4ed7	c0a4bb5e-66c2-447e-a2aa-fcde03279adc	\N	\N
6a561b10-5c0b-4242-ad19-efa5ec3dad83	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	36f64c20-9f6f-48d2-8ece-529ac1464c4d	t	2026-03-09 02:15:22.878808	2026-03-09 02:15:22.878808	2ff15f14-ba60-4d64-b046-0d6a0d0caf86	347186f1-4097-4b19-ae35-e2bd93120a6f	\N	\N
34138c7d-4bdf-467a-b799-3abee6798fad	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	36f64c20-9f6f-48d2-8ece-529ac1464c4d	t	2026-03-09 02:16:42.165269	2026-03-09 02:16:42.165269	2ff15f14-ba60-4d64-b046-0d6a0d0caf86	4d5258c3-72cf-4147-b535-3537165a7e2a	\N	\N
\.


--
-- TOC entry 5694 (class 0 OID 98840)
-- Dependencies: 331
-- Data for Name: cuenta_grupo_personalizado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta_grupo_personalizado (id_cuenta_grupo_personalizado, id_grupo_cuenta_personalizado, id_cuenta_contable, created_at) FROM stdin;
\.


--
-- TOC entry 5688 (class 0 OID 93323)
-- Dependencies: 325
-- Data for Name: cuenta_impuesto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta_impuesto (id_cuenta_impuesto, id_empresa, tipo_impuesto, porcentaje, id_cuenta_contable, estado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5687 (class 0 OID 93302)
-- Dependencies: 324
-- Data for Name: cuenta_iva; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta_iva (id_cuenta_iva, id_empresa, tipo_iva, porcentaje, id_cuenta_contable, estado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5680 (class 0 OID 93148)
-- Dependencies: 317
-- Data for Name: diario_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diario_contable (id_diario_contable, id_empresa, codigo, nombre, descripcion, tipo_diario, estado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5758 (class 0 OID 228152)
-- Dependencies: 395
-- Data for Name: directorio_documento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directorio_documento (id_directorio_documento, nombre, descripcion, id_directorio_padre, modulo, orden, estado, created_at, updated_at, created_by, updated_by, id_empresa, tipo_directorio) FROM stdin;
6a900121-df99-4256-806c-e15caeb5a3f6	nueva_carpeta_mismo_nivel	\N	\N	tercero	1	t	2026-04-09 23:15:13.409	\N	\N	\N	0459fe04-163b-4b89-b98a-0f1179b7224c	MANUAL
3c39cb10-1a65-4e38-a5de-92f066f22e22	carpeta_interna_anueva	\N	6a900121-df99-4256-806c-e15caeb5a3f6	tercero	1	t	2026-04-09 23:16:48.557	\N	\N	\N	0459fe04-163b-4b89-b98a-0f1179b7224c	MANUAL
d1fde8c6-1952-46b9-a5ac-9df10e2f6bfd	logo_item	\N	\N	item	1	t	2026-04-09 19:57:48.911878	\N	\N	\N	0459fe04-163b-4b89-b98a-0f1179b7224c	OBJETO
e6a3abc7-06ab-4f30-86c6-80828ff2e7e3	logo_tercero	\N	\N	tercero	1	t	2026-04-08 21:32:33.186	\N	\N	\N	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	OBJETO
fe73615d-8ddf-4509-8677-a8b91f03c435	logo_tercero	\N	\N	tercero	1	t	2026-04-08 21:11:12.47	\N	\N	\N	0459fe04-163b-4b89-b98a-0f1179b7224c	OBJETO
6ef7e123-3f19-4b16-9d9f-cbd241ac5ef3	nuevotestcarpetapadre	\N	\N	tercero	1	t	2026-04-10 17:36:16.018	\N	\N	\N	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	MANUAL
714b0b85-20ab-45de-87ee-d0503750cca4	nuevatestcarpetahija	\N	6ef7e123-3f19-4b16-9d9f-cbd241ac5ef3	tercero	1	t	2026-04-10 17:37:29.908	\N	\N	\N	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	MANUAL
36439716-6706-422f-8fcd-b40bb26fd2cc	segundacarpetahija	\N	6ef7e123-3f19-4b16-9d9f-cbd241ac5ef3	tercero	1	t	2026-04-11 03:21:04.625	\N	\N	\N	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	MANUAL
d062d44c-9e7c-44be-976c-7ffcc55d5af5	hermanodelpadre	\N	\N	tercero	1	t	2026-04-11 03:21:29.742	\N	\N	\N	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	MANUAL
0ddbf944-1b34-40dc-9e42-6ed7cab4dc61	hijosegundacarpeta(nieto)	\N	36439716-6706-422f-8fcd-b40bb26fd2cc	tercero	1	t	2026-04-11 03:22:29.83	\N	\N	\N	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	MANUAL
df6e36a2-8091-4dad-9bc6-f2c35fea86df	segundohermanopadre	\N	\N	tercero	1	t	2026-04-11 20:08:07.888	\N	\N	\N	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	MANUAL
a79a2c91-4aa1-4d95-afbf-05f3539970ee	hijasegundohermano	\N	df6e36a2-8091-4dad-9bc6-f2c35fea86df	tercero	1	t	2026-04-11 22:50:23.72	\N	\N	\N	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	MANUAL
a029fdab-4f54-43f6-a7e9-c29328e165aa	hrmano_carpeta_mismo_nivel	\N	\N	tercero	1	t	2026-04-12 14:39:06.113	\N	\N	\N	0459fe04-163b-4b89-b98a-0f1179b7224c	MANUAL
fa4f1ed3-1704-461e-b61f-2108ce62a31a	tercer_hermano	\N	\N	tercero	1	t	2026-04-13 00:56:24.343	\N	\N	\N	0459fe04-163b-4b89-b98a-0f1179b7224c	MANUAL
a0f41e37-9994-4966-801c-1dfc566f28b1	may	\N	\N	tercero	1	t	2026-04-14 20:34:38.378	\N	\N	\N	0459fe04-163b-4b89-b98a-0f1179b7224c	MANUAL
55cfeb1b-ebc0-4175-8d2b-8d7833f59e10	johan	\N	a0f41e37-9994-4966-801c-1dfc566f28b1	tercero	1	t	2026-04-14 20:34:46.712	\N	\N	\N	0459fe04-163b-4b89-b98a-0f1179b7224c	MANUAL
fa9dc2f0-7b94-483a-935c-a99542ae2bae	hijaxeno	\N	6a900121-df99-4256-806c-e15caeb5a3f6	tercero	1	t	2026-04-22 18:19:07.009	\N	\N	\N	0459fe04-163b-4b89-b98a-0f1179b7224c	MANUAL
\.


--
-- TOC entry 5699 (class 0 OID 98970)
-- Dependencies: 336
-- Data for Name: documento_origen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documento_origen (id_documento_origen, id_empresa, tipo_documento, numero_documento, fecha_documento, id_tercero, valor_total, estado_contabilizacion, id_asiento_contable, fecha_contabilizacion, id_usuario_contabilizacion, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5754 (class 0 OID 222483)
-- Dependencies: 391
-- Data for Name: duracion_unidad_catalogo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.duracion_unidad_catalogo (id_duration_unit, codigo, nombre, descripcion, orden, estado, created_at, updated_at, created_by, updated_by) FROM stdin;
41d77594-f820-4b58-a054-673981553c38	MINUTE	Minuto	Unidad de duración en minutos	1	t	2026-03-08 23:54:49.532841	2026-03-08 23:54:49.532841	\N	\N
dd8ad7dd-6ff1-475b-a77b-e5031653d22d	HOUR	Hora	Unidad de duración en horas	2	t	2026-03-08 23:54:49.532841	2026-03-08 23:54:49.532841	\N	\N
894d54bb-6b68-4299-a1b0-6ac0463ce4f3	DAY	Día	Unidad de duración en días	3	t	2026-03-08 23:54:49.532841	2026-03-08 23:54:49.532841	\N	\N
0d6dd320-b38f-428d-ba83-b6de888bd9b3	WEEK	Semana	Unidad de duración en semanas	4	t	2026-03-08 23:54:49.532841	2026-03-08 23:54:49.532841	\N	\N
c4dfbe5a-484e-4653-882c-185466d9bba6	MONTH	Mes	Unidad de duración en meses	5	t	2026-03-08 23:54:49.532841	2026-03-08 23:54:49.532841	\N	\N
1e43cb4c-b84c-4a38-b870-3a4d209448b3	YEAR	Año	Unidad de duración en años	6	t	2026-03-08 23:54:49.532841	2026-03-08 23:54:49.532841	\N	\N
\.


--
-- TOC entry 5647 (class 0 OID 17267)
-- Dependencies: 284
-- Data for Name: empresa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresa (id_empresa, nombre, ruc, direccion, telefono, email, estado, created_at, updated_at, id_moneda, id_pais, codigo_postal, poblacion, movil, fax, web, logo, logotipo_cuadrado, nota, sujeto_iva, id_provincia, fiscal_year_start_month, fiscal_year_start_day, created_by, updated_by) FROM stdin;
d2600c4c-2ce7-4d01-b6e8-82f028e69d27	Empresa Test	1234567890123	Dirección Test	123456789	test@test.com	t	2025-07-23 14:31:13.643388	2025-07-28 01:45:51.715623	\N	d4882144-caf7-46e8-8f72-4378a29a7ff7	12345	Ciudad Test	123456789	123456789	https://test.com	\N	\N	Nota de prueba	t	a5cdcac2-b3e1-4a24-b4a1-3244ee3d00a6	1	1	\N	\N
45fa1728-15ad-485e-ade6-3c2f058e882f	Empresa Gateway Test	98765432109	Dirección Gateway Test	987654321	gateway@test.com	t	2025-07-27 03:56:24.007727	2025-07-29 03:15:37.924174	\N	\N						\N	\N		t	\N	1	1	\N	\N
9ee03920-5b19-4925-b6cf-444a4415994b	Empresa Test	12345678901	Dirección Test	123456789	test@test.com	t	2025-07-27 03:56:13.635648	2025-07-27 03:56:13.635648	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	1	1	\N	\N
fc59e203-237f-408b-8737-fe54dcf10dc1	Empresa Gateway Test	22222222222	Dirección Gateway	666666666	gateway@test.com	t	2025-07-27 04:01:03.214584	2025-07-27 04:01:03.214584	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	1	1	\N	\N
a5c335e2-064e-47df-8cf2-6a62c987e401	Empresa Test Código Postal	33333333333	Dirección Test	777777777	codigo@test.com	t	2025-07-27 04:05:17.965706	2025-07-27 04:05:44.284759	\N	\N	54321	Nueva Ciudad	888888888	\N	https://www.test.com	\N	\N	\N	t	\N	1	1	\N	\N
31a8bf69-558d-4b00-8fc6-5e2384be09a3	Empresa Test Actualizada	11111111111	Nueva Dirección	555555555	nuevo@test.com	t	2025-07-27 04:00:51.264443	2025-07-27 04:19:38.325243	\N	\N	12345	Ciudad Test	888888888	\N	\N	\N	\N	\N	t	\N	1	1	\N	\N
0459fe04-163b-4b89-b98a-0f1179b7224c	SipDEecom	023456779	MIo	0969853570	john_quezada@hotmail.com	f	2025-07-23 15:02:22.974163	2025-07-27 21:23:10.740415	\N	\N						\N	\N		t	\N	1	1	\N	\N
\.


--
-- TOC entry 5664 (class 0 OID 18686)
-- Dependencies: 301
-- Data for Name: empresa_horario_apertura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresa_horario_apertura (id_horario, id_empresa, dia, valor, created_by, created_at, updated_by, updated_at) FROM stdin;
8cbee026-d1ea-42d0-adb8-3cebdaf41936	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	1	8:00-18:00	\N	2025-07-29 02:36:18.539581	\N	\N
e787a62d-dc90-4cdd-a244-4efeb8add16d	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	2	8:00-18:00	\N	2025-07-29 02:36:18.539581	\N	\N
55b084cc-c6ae-4f45-a36f-2711daf9176c	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	3	8:00-18:00	\N	2025-07-29 02:36:18.539581	\N	\N
6d8d9787-a889-4598-bd7e-7b91cd055284	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	4	8:00-18:00	\N	2025-07-29 02:36:18.539581	\N	\N
fd4c95c4-7662-40d0-9ca0-971f471cb35a	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	5	8:00-18:00	\N	2025-07-29 02:36:18.539581	\N	\N
679e5df0-fc31-4cb6-b2ec-528578d0c1db	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	6	9:00-14:00	\N	2025-07-29 02:36:18.539581	\N	\N
e22916af-5e2a-4aee-b6e7-233ac440818d	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	7	Cerrado	\N	2025-07-29 02:36:18.539581	\N	\N
8f71675d-6248-4cdd-a1fe-8d5208598713	0459fe04-163b-4b89-b98a-0f1179b7224c	1	8:00 - 15:00	\N	2025-07-29 03:10:39.012193	\N	\N
05497900-b4e3-43ff-9152-99b9bbac16e9	0459fe04-163b-4b89-b98a-0f1179b7224c	2	8:00 - 15:00	\N	2025-07-29 03:10:39.012193	\N	\N
a9ed6e53-a788-437d-8446-c152c26d17ff	0459fe04-163b-4b89-b98a-0f1179b7224c	3	8:00 - 15:00	\N	2025-07-29 03:10:39.012193	\N	\N
59b288b0-017d-4bbc-bc58-3863d3dc0291	0459fe04-163b-4b89-b98a-0f1179b7224c	4	8:00 - 15:00	\N	2025-07-29 03:10:39.012193	\N	\N
892baf28-1615-4f76-b50f-ee3e64301d02	0459fe04-163b-4b89-b98a-0f1179b7224c	5	8:00 - 15:00	\N	2025-07-29 03:10:39.012193	\N	\N
29f911a6-fac1-440a-bea5-4673892664b4	0459fe04-163b-4b89-b98a-0f1179b7224c	6		\N	2025-07-29 03:10:39.012193	\N	\N
3478c325-0688-4649-88c5-5f0ce2f61cec	0459fe04-163b-4b89-b98a-0f1179b7224c	7		\N	2025-07-29 03:10:39.012193	\N	\N
4b3d632c-a562-43f6-a4e3-489168f818c6	45fa1728-15ad-485e-ade6-3c2f058e882f	1	8:00 - 15:00	\N	2025-07-29 03:15:37.924174	\N	\N
fc8276a3-d75b-43a8-994a-14dcc91ccbe0	45fa1728-15ad-485e-ade6-3c2f058e882f	2	8:00 - 15:00	\N	2025-07-29 03:15:37.924174	\N	\N
3d10c0ee-9ec4-4a41-b9d7-ff0642f577fa	45fa1728-15ad-485e-ade6-3c2f058e882f	3	8:00 - 15:00	\N	2025-07-29 03:15:37.924174	\N	\N
3f775a8e-3ef9-44d3-9fc5-ff1a10649017	45fa1728-15ad-485e-ade6-3c2f058e882f	4	8:00 - 15:00	\N	2025-07-29 03:15:37.924174	\N	\N
6c0c249c-634f-45cc-828d-51aa38f27119	45fa1728-15ad-485e-ade6-3c2f058e882f	5	8:00 - 15:00	\N	2025-07-29 03:15:37.924174	\N	\N
8acc40fc-1aa4-4dff-b9c3-b25122353157	45fa1728-15ad-485e-ade6-3c2f058e882f	6		\N	2025-07-29 03:15:37.924174	\N	\N
bbd497ea-45ea-4b6c-ad43-d38675957aa6	45fa1728-15ad-485e-ade6-3c2f058e882f	7		\N	2025-07-29 03:15:37.924174	\N	\N
\.


--
-- TOC entry 5660 (class 0 OID 18578)
-- Dependencies: 297
-- Data for Name: empresa_identificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresa_identificacion (id_identificacion, id_empresa, administradores, delegado_datos, capital, id_tipo_entidad, objeto_empresa, cif_intra, id_profesional1, id_profesional2, id_profesional3, id_profesional4, id_profesional5, id_profesional6, id_profesional7, id_profesional8, id_profesional9, id_profesional10, created_by, created_at, updated_by, updated_at) FROM stdin;
8ae16cd4-67ad-4649-98f2-56a70b8fb70f	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	Admin Test	Delegado Test	10000.00	1	Objeto de prueba	CIF123	PROF1	PROF2	PROF3	PROF4	PROF5	PROF6	PROF7	PROF8	PROF9	PROF10	\N	2025-07-27 19:54:55.217658	\N	\N
caf4cc54-6d52-462e-97f0-4b15dacf0a88	0459fe04-163b-4b89-b98a-0f1179b7224c	john	delegado	1.00	1	objeto	CIF	1	2	3	4	5	6	7	8	9	10	\N	2025-07-27 21:23:10.740415	\N	\N
425f81f6-b5aa-4001-b122-ab1ca1149a71	31a8bf69-558d-4b00-8fc6-5e2384be09a3	Juan Pérez	María García	100000.00	1	Desarrollo de software	ES12345678	PROF001	PROF002	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-29 02:18:32.992226	\N	\N
f0b57a08-7267-454d-8692-d1a3ccd3ae51	45fa1728-15ad-485e-ade6-3c2f058e882f			\N	\N													\N	2025-07-29 03:15:37.924174	\N	\N
\.


--
-- TOC entry 5662 (class 0 OID 18621)
-- Dependencies: 299
-- Data for Name: empresa_red_social; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresa_red_social (id, id_empresa, id_red_social, identificador, url, es_principal, created_by, created_at, updated_by, updated_at) FROM stdin;
84e5a061-2333-42f3-9d83-a5126c5a3efa	0459fe04-163b-4b89-b98a-0f1179b7224c	9093b9fd-3126-40a9-9442-dcde643de88d	123456		f	\N	2025-07-29 03:10:39.012193	\N	\N
\.


--
-- TOC entry 5654 (class 0 OID 18510)
-- Dependencies: 291
-- Data for Name: entidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.entidad (id, nombre) FROM stdin;
\.


--
-- TOC entry 5745 (class 0 OID 221096)
-- Dependencies: 382
-- Data for Name: envio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.envio (id_envio, id_empresa, envio_ref, id_tercero, ref_cliente, poblacion, fecha_prevista_entrega, fecha_envio, metodo_envio, numero_seguimiento, estado_envio, facturado, modulo_origen, id_origen, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5746 (class 0 OID 221114)
-- Dependencies: 383
-- Data for Name: envio_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.envio_detalle (id_envio_detalle, id_envio, id_item, id_lote_serie, cantidad, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5751 (class 0 OID 222418)
-- Dependencies: 388
-- Data for Name: estado_compra_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado_compra_item (id_estado_compra, codigo, nombre, descripcion, orden, estado, created_at, updated_at, created_by, updated_by) FROM stdin;
be0053b9-3a29-4991-b5d3-87c96f03fa02	EN_COMPRA	En compra	El item está disponible para compra	1	t	2026-03-08 21:50:08.70354	2026-03-08 21:50:08.70354	\N	\N
1de10d9e-d9cd-4318-b365-eb7811443082	FUERA_COMPRA	Fuera de compra	El item no está disponible para compra	2	t	2026-03-08 21:50:08.70354	2026-03-08 21:50:08.70354	\N	\N
e7dbe683-f4fa-4ec1-ae1c-1ff19d7f4715	DESCONTINUADO	Descontinuado	El item fue retirado de compras	3	t	2026-03-08 21:50:08.70354	2026-03-08 21:50:08.70354	\N	\N
299dd22f-2f09-47f0-8af5-7cc8fab4d9d9	BAJO_SOLICITUD	Bajo solicitud	El item se compra solo bajo solicitud	4	t	2026-03-08 21:50:08.70354	2026-03-08 21:50:08.70354	\N	\N
\.


--
-- TOC entry 5750 (class 0 OID 222403)
-- Dependencies: 387
-- Data for Name: estado_venta_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado_venta_item (id_estado_venta, codigo, nombre, descripcion, orden, estado, created_at, updated_at, created_by, updated_by) FROM stdin;
1557bf60-0db7-4a94-b7cf-396d62ee8070	EN_VENTA	En venta	El item está disponible para la venta	1	t	2026-03-08 21:48:41.447392	2026-03-08 21:48:41.447392	\N	\N
3fe15de1-2402-4b80-b42f-0f719bb391d9	FUERA_VENTA	Fuera de venta	El item no está disponible para la venta	2	t	2026-03-08 21:48:41.447392	2026-03-08 21:48:41.447392	\N	\N
06845e82-3e6d-4989-bd00-83c40910a65a	DESCONTINUADO	Descontinuado	El item fue retirado de la venta	3	t	2026-03-08 21:48:41.447392	2026-03-08 21:48:41.447392	\N	\N
83bd92e4-f09c-4bfa-ab2e-eda74a361579	SOLO_BAJO_PEDIDO	Solo bajo pedido	El item se vende únicamente bajo pedido	4	t	2026-03-08 21:48:41.447392	2026-03-08 21:48:41.447392	\N	\N
\.


--
-- TOC entry 5701 (class 0 OID 99019)
-- Dependencies: 338
-- Data for Name: factura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.factura (id_factura, id_empresa, numero_factura, tipo_factura, id_tercero, fecha_factura, fecha_vencimiento, subtotal, total_impuestos, total_descuentos, total_factura, estado, id_asiento_contable, created_at, updated_at, id_condicion_pago, id_forma_pago, id_cuenta_bancaria, origen, id_proyecto, categorias, plantilla_documento, id_moneda, nota_publica, nota_privada) FROM stdin;
\.


--
-- TOC entry 5702 (class 0 OID 99047)
-- Dependencies: 339
-- Data for Name: factura_linea; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.factura_linea (id_factura_linea, id_factura, id_item, descripcion, cantidad, precio_unitario, descuento_porcentaje, descuento_valor, subtotal, id_cuenta_contable, orden, created_at) FROM stdin;
\.


--
-- TOC entry 5667 (class 0 OID 22112)
-- Dependencies: 304
-- Data for Name: forma_pago_catalogo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.forma_pago_catalogo (id_forma_pago, descripcion) FROM stdin;
9e1fb0b7-833b-4265-9b44-29e88c39f558	efectivo
4bbbfc13-804d-4a8b-9c53-57e0ef29adb5	tarjeta de credito
26d9fbd8-470d-4c58-8c87-acabb4193b93	tarjeta de debito
238af3a1-7fcc-458a-84e8-c8f376ac158d	cheque
\.


--
-- TOC entry 5693 (class 0 OID 98822)
-- Dependencies: 330
-- Data for Name: grupo_cuenta_personalizado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grupo_cuenta_personalizado (id_grupo_cuenta_personalizado, id_empresa, nombre, descripcion, estado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5709 (class 0 OID 99240)
-- Dependencies: 346
-- Data for Name: historial_conversion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_conversion (id_historial_conversion, id_empresa, tipo_origen, id_documento_origen, tipo_destino, id_documento_destino, fecha_conversion, id_usuario_conversion, observaciones, created_at) FROM stdin;
\.


--
-- TOC entry 5671 (class 0 OID 24389)
-- Dependencies: 308
-- Data for Name: impuestos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.impuestos (id, nombre, tasa, creado_en, actualizado_en) FROM stdin;
1	IVA 12%	12.00	2026-02-14 18:50:32.789836	2026-02-14 18:50:32.789836
2	IVA 0%	0.00	2026-02-14 18:50:32.789836	2026-02-14 18:50:32.789836
\.


--
-- TOC entry 5668 (class 0 OID 22120)
-- Dependencies: 305
-- Data for Name: incoterm_catalogo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.incoterm_catalogo (id_incoterm, codigo, descripcion) FROM stdin;
83f47a6d-7ec1-40d8-a683-07810c6f90ce	111	primer inconter
685a2593-0881-45c4-a9d3-a96ef5bcbff0	222	segundo inconter
f023ef6e-5fb6-4913-9efd-f1b5f689df32	333	tercer inconter
\.


--
-- TOC entry 5700 (class 0 OID 99001)
-- Dependencies: 337
-- Data for Name: informe_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.informe_contable (id_informe_contable, id_empresa, nombre, tipo_informe, configuracion, estado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5741 (class 0 OID 221001)
-- Dependencies: 378
-- Data for Name: inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventario (id_inventario, id_empresa, inventario_ref, etiqueta, id_almacen, estado_inventario, fecha_inicio, fecha_cierre, observacion, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
226c776b-bba5-43fb-a408-fd42d3c71ae2	0459fe04-163b-4b89-b98a-0f1179b7224c	INV-2026-01	inventario general bodega principal	dd04ca48-b2e6-4ac3-a5e3-04bcc7d6038d	ABIERTO	2026-04-26 23:39:08.95678	\N	mi primer inventio	674ab9f4-f3a1-4a55-8aff-7065c66b6133	674ab9f4-f3a1-4a55-8aff-7065c66b6133	2026-04-26 23:39:08.95678	2026-04-26 23:39:08.95678	t
\.


--
-- TOC entry 5742 (class 0 OID 221018)
-- Dependencies: 379
-- Data for Name: inventario_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventario_detalle (id_inventario_detalle, id_inventario, id_item, id_lote_serie, stock_sistema, stock_contado, diferencia, observacion, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5730 (class 0 OID 208587)
-- Dependencies: 367
-- Data for Name: item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item (id_item, id_empresa, producto_ref, etiqueta, estado, descripcion, url_publica, peso, longitud, anchura, altura, superficie, volumen, nomenclatura_aduanera, nota_interna, precio_venta, precio_minimo, impuesto_id, created_at, updated_at, inventariable, duration_value, mandatory_periods, created_by, updated_by, id_pais, id_provincia, poblacion, id_unidad_medida, id_unidad_peso, id_unidad_longitud, id_unidad_superficie, id_unidad_volumen, codigo_barras, precio_compra, stock_minimo_alerta, stock_deseado, id_almacen_defecto, id_categoria_item, id_estado_venta, id_estado_compra, id_tipo_control_caducidad, id_tipo_item, id_duration_unit, id_tipo_control_inventario, id_naturaleza_item, id_cuenta_venta, id_cuenta_venta_intracomunitaria, id_cuenta_venta_exportacion, id_cuenta_compra, id_cuenta_compra_intracomunitaria, id_cuenta_compra_importacion, id_tipo_comportamiento) FROM stdin;
fbb48f9b-66be-4bcc-a533-a993cf70dbb3	0459fe04-163b-4b89-b98a-0f1179b7224c	XA001	XAVI2	t	\N	\N	0.00	0.00	0.00	0.00	0.00	0.00	\N	\N	10.00	5.00	1	2026-04-08 23:09:44.752329	2026-04-08 23:09:44.752329	t	\N	f	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	\N	\N	\N	\N	\N	\N	\N	\N	\N	2.00	0.00	0.00	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	\N	f7893727-2d13-4767-b5e1-e36ede53e630	\N	\N	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	9b6bf6c2-92e4-4681-a486-45302d3ce807	\N	\N	\N	\N	\N	\N	\N
e114e708-799e-4f16-b05d-7277b1a5a4d6	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	LC01	lucas1	t	\N	\N	0.00	0.00	0.00	0.00	0.00	0.00	\N	\N	0.00	0.00	\N	2026-04-09 00:12:06.998018	2026-04-09 00:12:06.998018	t	\N	f	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00	0.00	0.00	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	\N	f7893727-2d13-4767-b5e1-e36ede53e630	\N	\N	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	9b6bf6c2-92e4-4681-a486-45302d3ce807	\N	\N	\N	\N	\N	\N	\N
e7b5ea7e-31be-44cc-b849-07469e692c04	0459fe04-163b-4b89-b98a-0f1179b7224c	camporeferenci	camponombre	t	\N	\N	0.00	0.00	0.00	0.00	0.00	0.00	\N	\N	0.00	0.00	\N	2026-04-09 00:16:12.803038	2026-04-09 00:16:12.803038	t	\N	f	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00	0.00	0.00	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	\N	f7893727-2d13-4767-b5e1-e36ede53e630	\N	\N	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	9b6bf6c2-92e4-4681-a486-45302d3ce807	\N	\N	\N	\N	\N	\N	\N
93160cb7-e49c-4d40-9a70-03b6c36bd390	0459fe04-163b-4b89-b98a-0f1179b7224c	pt01	papita	t	\N	\N	0.00	0.00	0.00	0.00	0.00	0.00	\N	\N	0.00	0.00	\N	2026-04-09 00:32:13.648636	2026-04-09 00:32:13.648636	t	\N	f	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00	0.00	0.00	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	\N	f7893727-2d13-4767-b5e1-e36ede53e630	\N	\N	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	9b6bf6c2-92e4-4681-a486-45302d3ce807	\N	\N	\N	\N	\N	\N	\N
4582d0de-5d9c-4941-8f8f-05fcaf189281	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	m01	mm	t	\N	\N	0.00	0.00	0.00	0.00	0.00	0.00	\N	\N	0.00	0.00	\N	2026-04-09 00:34:35.540881	2026-04-09 00:34:35.540881	t	\N	f	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00	0.00	0.00	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	\N	f7893727-2d13-4767-b5e1-e36ede53e630	\N	\N	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	9b6bf6c2-92e4-4681-a486-45302d3ce807	\N	\N	\N	\N	\N	\N	\N
5164aca5-31a1-4f13-95cd-c3cc87347976	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	ui5	papito	t	\N	\N	0.00	0.00	0.00	0.00	0.00	0.00	\N	\N	0.00	0.00	\N	2026-04-09 00:45:51.662477	2026-04-09 00:45:51.662477	t	\N	f	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00	0.00	0.00	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	\N	f7893727-2d13-4767-b5e1-e36ede53e630	\N	\N	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	9b6bf6c2-92e4-4681-a486-45302d3ce807	\N	\N	\N	\N	\N	\N	\N
0840647e-b16f-42df-916d-7d442dd13dd9	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	SERV001	Servicio Prueba	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-02-28 02:27:38.745261	2026-04-07 23:03:38.136084	f	2.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	be0053b9-3a29-4991-b5d3-87c96f03fa02	f7893727-2d13-4767-b5e1-e36ede53e630	75230088-4af9-4e79-97a6-130e905097ec	dd8ad7dd-6ff1-475b-a77b-e5031653d22d	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	0c27081b-6282-4065-8140-3928ae9bda7b	\N	\N	\N	\N	\N	\N	600af782-db6d-4891-a1a3-80b38cf8cbdd
f9bf9017-7065-4f2f-9653-b7fa5f261cf7	0459fe04-163b-4b89-b98a-0f1179b7224c	SRV002	YOYERIA	t	ORO	KKKKKK	\N	\N	\N	\N	\N	\N	\N	PERLAS	30000.00	10000.00	\N	2026-03-01 23:19:05.08115	2026-04-07 23:03:38.136084	f	5.00	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	be0053b9-3a29-4991-b5d3-87c96f03fa02	f7893727-2d13-4767-b5e1-e36ede53e630	75230088-4af9-4e79-97a6-130e905097ec	894d54bb-6b68-4299-a1b0-6ac0463ce4f3	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	0c27081b-6282-4065-8140-3928ae9bda7b	\N	\N	\N	\N	\N	\N	600af782-db6d-4891-a1a3-80b38cf8cbdd
621a3156-e075-4e08-975e-594c1fcf4ed7	0459fe04-163b-4b89-b98a-0f1179b7224c	ZERV003	ZAPATERIA	t	ZAPATOS CUERO	https://www.youtube.com	\N	\N	\N	\N	\N	\N	\N	CAFE TOSTADO	80.00	50.00	1	2026-02-28 03:44:22.528385	2026-04-07 23:03:38.136084	f	1.00	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	be0053b9-3a29-4991-b5d3-87c96f03fa02	f7893727-2d13-4767-b5e1-e36ede53e630	75230088-4af9-4e79-97a6-130e905097ec	894d54bb-6b68-4299-a1b0-6ac0463ce4f3	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	0c27081b-6282-4065-8140-3928ae9bda7b	\N	\N	\N	\N	\N	\N	600af782-db6d-4891-a1a3-80b38cf8cbdd
7a65661c-ee87-428b-ba12-5f15465bf9ff	9ee03920-5b19-4925-b6cf-444a4415994b	SERV-AUD-005	Servicio Auditoria 5	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	25.00	\N	1	2026-04-07 20:29:47.598173	2026-04-07 23:03:38.136084	f	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	be0053b9-3a29-4991-b5d3-87c96f03fa02	f7893727-2d13-4767-b5e1-e36ede53e630	75230088-4af9-4e79-97a6-130e905097ec	\N	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	2f41e1af-4ccf-43c6-857e-56cd041bb27a	\N	\N	\N	\N	\N	\N	600af782-db6d-4891-a1a3-80b38cf8cbdd
f39eda3d-74c0-4acc-b7bd-3da00ef572b5	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	TCO20	Taco de cuero	t	ZAPATOS DE CUERO	https://translate.google.com/	20.00	20.00	20.00	20.00	20.00	20.00	1254	zapatos para dama	50.00	40.00	1	2026-04-06 00:35:24.993424	2026-04-07 23:03:56.254469	t	\N	f	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	d4882144-caf7-46e8-8f72-4378a29a7ff7	29ea3fbc-c4d2-4de2-9841-e124bdf4a6c2	\N	\N	b3741fbe-2580-498f-a363-5168071ef267	90f49ab7-cc83-49c6-99ea-992f1985d3c9	8f6edd45-3828-41b9-bf22-a49be4ca4eb2	fad7dc67-080d-471c-8e25-39910943c081	\N	30.00	20.00	100.00	dd04ca48-b2e6-4ac3-a5e3-04bcc7d6038d	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	be0053b9-3a29-4991-b5d3-87c96f03fa02	f7893727-2d13-4767-b5e1-e36ede53e630	991d248f-b44a-48d4-9a2f-f33529d9cf05	\N	b96439d5-3027-4321-94fc-61ed12719529	9b6bf6c2-92e4-4681-a486-45302d3ce807	90a798f9-c0d1-40cd-b0d7-d7e212a6e3ee	2322f3fa-5f7e-4007-98b8-792b96f59546	43d7d645-94a2-4cd3-b90e-953476ab313a	36f64c20-9f6f-48d2-8ece-529ac1464c4d	90a798f9-c0d1-40cd-b0d7-d7e212a6e3ee	04c85e4d-e813-4b53-8f53-c221622ba298	d19a3f83-5556-4780-b6fb-295758b93967
fdff191e-d30c-4b02-bd87-f585aa493800	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	PANO001	PANAL	t	\N	\N	0.00	0.00	0.00	0.00	0.00	0.00	\N	\N	10.00	8.00	1	2026-04-08 21:46:50.41533	2026-04-08 21:46:50.41533	t	\N	f	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	\N	\N	\N	\N	\N	\N	\N	\N	\N	6.00	20.00	100.00	dd04ca48-b2e6-4ac3-a5e3-04bcc7d6038d	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	\N	\N	\N	\N	\N	9b6bf6c2-92e4-4681-a486-45302d3ce807	\N	\N	\N	\N	\N	\N	\N
3254f61f-c98b-4749-a50a-c459e7f0a3d6	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	macaco	johan	t	\N	\N	0.00	0.00	0.00	0.00	0.00	0.00	\N	\N	100.00	80.00	\N	2026-04-09 00:47:26.846076	2026-04-09 00:47:26.846076	t	\N	f	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	\N	\N	\N	\N	\N	\N	\N	\N	\N	10.00	0.00	0.00	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	\N	f7893727-2d13-4767-b5e1-e36ede53e630	\N	\N	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	9b6bf6c2-92e4-4681-a486-45302d3ce807	\N	\N	\N	\N	\N	\N	\N
7f18ac8f-6097-44ca-8445-e09c19631a99	0459fe04-163b-4b89-b98a-0f1179b7224c	oot	ooo	t	\N	\N	0.00	0.00	0.00	0.00	0.00	0.00	\N	\N	0.00	0.00	\N	2026-04-09 01:05:08.967738	2026-04-09 01:05:08.967738	t	\N	f	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00	0.00	0.00	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	\N	f7893727-2d13-4767-b5e1-e36ede53e630	\N	\N	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	9b6bf6c2-92e4-4681-a486-45302d3ce807	\N	\N	\N	\N	\N	\N	\N
07b90b65-5ebb-431e-a7a9-cab287aecdc3	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	RATON01	RATON	t	\N	\N	0.00	0.00	0.00	0.00	0.00	0.00	\N	\N	0.00	0.00	\N	2026-04-17 01:21:33.728769	2026-04-17 01:21:33.728769	t	\N	f	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00	0.00	0.00	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	be0053b9-3a29-4991-b5d3-87c96f03fa02	f7893727-2d13-4767-b5e1-e36ede53e630	991d248f-b44a-48d4-9a2f-f33529d9cf05	\N	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	2b58c945-e2f4-4019-87ef-727d265e0093	\N	\N	\N	\N	\N	\N	\N
f0f20800-520e-4d30-a88d-21ccc278cbc7	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	Xavi002	Melcocha de sirlanca	t	\N	\N	0.00	0.00	0.00	0.00	0.00	0.00	\N	\N	80.00	40.00	1	2026-04-08 23:07:41.946894	2026-04-13 02:21:24.43775	t	\N	f	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	d4882144-caf7-46e8-8f72-4378a29a7ff7	29ea3fbc-c4d2-4de2-9841-e124bdf4a6c2	\N	\N	\N	\N	\N	\N	\N	20.00	0.00	0.00	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	\N	f7893727-2d13-4767-b5e1-e36ede53e630	\N	\N	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	2b58c945-e2f4-4019-87ef-727d265e0093	\N	\N	\N	\N	\N	\N	\N
775f0817-d5a9-4b92-ba2a-a9ed83cbc570	0459fe04-163b-4b89-b98a-0f1179b7224c	cam002	camisaXAVI	t	algodon	\N	20.00	10.00	10.00	10.00	10.00	20.00	1010	mmm	20.00	20.00	1	2026-02-20 22:58:28.104863	2026-04-18 17:01:13.759732	t	\N	f	\N	674ab9f4-f3a1-4a55-8aff-7065c66b6133	d4882144-caf7-46e8-8f72-4378a29a7ff7	29ea3fbc-c4d2-4de2-9841-e124bdf4a6c2	\N	\N	\N	\N	\N	\N	\N	0.00	0.00	0.00	dd04ca48-b2e6-4ac3-a5e3-04bcc7d6038d	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	be0053b9-3a29-4991-b5d3-87c96f03fa02	f7893727-2d13-4767-b5e1-e36ede53e630	991d248f-b44a-48d4-9a2f-f33529d9cf05	\N	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	0c27081b-6282-4065-8140-3928ae9bda7b	\N	\N	\N	\N	\N	\N	d19a3f83-5556-4780-b6fb-295758b93967
2ff15f14-ba60-4d64-b046-0d6a0d0caf86	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	CAN002	Camisa para perro	f	de algodon	https://chatgpt.com	20.00	10.00	10.00	10.00	10.00	20.00	10120	solo para Xavier	20.00	15.00	1	2026-02-19 00:37:37.779297	2026-04-13 00:12:37.693688	t	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3fe15de1-2402-4b80-b42f-0f719bb391d9	1de10d9e-d9cd-4318-b365-eb7811443082	f7893727-2d13-4767-b5e1-e36ede53e630	991d248f-b44a-48d4-9a2f-f33529d9cf05	\N	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	0c27081b-6282-4065-8140-3928ae9bda7b	\N	\N	\N	\N	\N	\N	d19a3f83-5556-4780-b6fb-295758b93967
824faab3-c958-430d-96d8-73308f3d7cab	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	SERXAVI01	SERXAVI01	t	PROBANDO SERVICIO	https://www.youtube.com/watch?v=jZ6BJW6zWWk	0.00	0.00	0.00	0.00	0.00	0.00	\N	PROBANDO SERVICIO	200.00	100.00	1	2026-04-17 01:13:14.720818	2026-04-17 01:13:14.720818	f	2.00	t	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00	0.00	0.00	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	be0053b9-3a29-4991-b5d3-87c96f03fa02	f7893727-2d13-4767-b5e1-e36ede53e630	75230088-4af9-4e79-97a6-130e905097ec	c4dfbe5a-484e-4653-882c-185466d9bba6	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	2f41e1af-4ccf-43c6-857e-56cd041bb27a	\N	\N	\N	\N	\N	\N	600af782-db6d-4891-a1a3-80b38cf8cbdd
d4d14404-db72-424e-911f-bc8da3c69d86	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	papasElian	elia	t	\N	\N	0.00	0.00	0.00	0.00	0.00	0.00	\N	\N	0.00	0.00	\N	2026-04-09 00:56:06.744119	2026-04-17 18:59:42.352711	t	\N	f	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00	0.00	0.00	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	\N	f7893727-2d13-4767-b5e1-e36ede53e630	991d248f-b44a-48d4-9a2f-f33529d9cf05	\N	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	9b6bf6c2-92e4-4681-a486-45302d3ce807	\N	\N	\N	\N	\N	\N	\N
cd268e2e-220a-411c-9279-003c1fd98b38	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	JOHAN001	JOHAN001	f	\N	\N	0.00	0.00	0.00	0.00	0.00	0.00	\N	\N	10.00	0.00	\N	2026-04-17 01:19:15.410264	2026-04-18 14:12:53.775535	f	\N	f	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00	0.00	0.00	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	be0053b9-3a29-4991-b5d3-87c96f03fa02	f7893727-2d13-4767-b5e1-e36ede53e630	75230088-4af9-4e79-97a6-130e905097ec	\N	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	2f41e1af-4ccf-43c6-857e-56cd041bb27a	\N	\N	\N	\N	\N	\N	600af782-db6d-4891-a1a3-80b38cf8cbdd
469676cd-5944-4d18-9755-fceedb7a4d49	0459fe04-163b-4b89-b98a-0f1179b7224c	TACO001	TACO001	t	ZAPATOS DE CUERO	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00	0.00	\N	2026-03-02 20:54:44.960686	2026-04-18 16:58:53.689448	f	3.00	f	\N	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	be0053b9-3a29-4991-b5d3-87c96f03fa02	f7893727-2d13-4767-b5e1-e36ede53e630	75230088-4af9-4e79-97a6-130e905097ec	dd8ad7dd-6ff1-475b-a77b-e5031653d22d	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	0c27081b-6282-4065-8140-3928ae9bda7b	\N	\N	\N	\N	\N	\N	600af782-db6d-4891-a1a3-80b38cf8cbdd
52a48ecf-f8a0-446f-b2f8-d4c29d1d3560	0459fe04-163b-4b89-b98a-0f1179b7224c	SERVICIOMAY01	SERVICIOMAY01	t	\N	\N	0.00	0.00	0.00	0.00	0.00	0.00	\N	\N	100.00	0.00	\N	2026-04-18 15:58:50.40071	2026-04-18 17:02:39.818643	f	\N	f	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	674ab9f4-f3a1-4a55-8aff-7065c66b6133	\N	\N	\N	\N	\N	\N	\N	\N	\N	0.00	0.00	0.00	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	be0053b9-3a29-4991-b5d3-87c96f03fa02	f7893727-2d13-4767-b5e1-e36ede53e630	75230088-4af9-4e79-97a6-130e905097ec	\N	0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	2f41e1af-4ccf-43c6-857e-56cd041bb27a	\N	\N	\N	\N	\N	\N	600af782-db6d-4891-a1a3-80b38cf8cbdd
\.


--
-- TOC entry 5759 (class 0 OID 230393)
-- Dependencies: 396
-- Data for Name: item_etiqueta_categoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_etiqueta_categoria (id_etiqueta_categoria, id_empresa, ref, nombre, descripcion, color, posicion, estado, created_at, updated_at, created_by, updated_by, id_tipo_item) FROM stdin;
b760be12-aafd-40ec-933f-e7ef4956f355	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	jo1	xavi	xavietiqueta	#0dfdd5	11	t	2026-04-12 15:55:50.771745	2026-04-12 19:01:30.094498	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	\N
707a4fc0-59e5-439e-97f7-9f2691cea7b8	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	mt01	muteee	muteeee	#fd0dd1	10	t	2026-04-12 15:32:55.333063	2026-04-12 21:24:45.857201	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	\N
a802209c-8c44-4de7-9752-2228d3fea2c6	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	CAT-PAN	Panadería	Productos de panadería y pastelería	#c9cf7d	6	t	2026-04-12 02:46:44.719986	2026-04-12 02:46:44.719986	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	991d248f-b44a-48d4-9a2f-f33529d9cf05
ed316b09-31a5-412d-b8be-66cb36323054	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	CAT-PAP	Papelería	Útiles escolares y de oficina	#8ef386	7	t	2026-04-12 02:48:21.750037	2026-04-12 02:48:21.750037	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	991d248f-b44a-48d4-9a2f-f33529d9cf05
e400c505-0e9c-4feb-ac99-43300af04e39	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	CAT-HIG	Higiene	Productos de higiene personal y limpieza	#cf9fd5	8	t	2026-04-12 02:49:28.447251	2026-04-12 02:49:28.447251	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	991d248f-b44a-48d4-9a2f-f33529d9cf05
1c356fed-0c6c-4889-b0fb-bbd38d6e7895	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	PROMO-01	Promoción	Productos incluidos en campañas promocionales	#0a9e59	9	t	2026-04-12 02:50:25.672751	2026-04-12 02:50:25.672751	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	991d248f-b44a-48d4-9a2f-f33529d9cf05
5cfaf063-9a60-4c93-affd-0088e31737e4	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	SEG-DAMA	Dama	Productos dirigidos al segmento femenino	#e40cc7	2	f	2026-04-12 02:23:54.881545	2026-04-12 21:23:08.362081	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	991d248f-b44a-48d4-9a2f-f33529d9cf05
f89a44ad-5f8c-4b1d-bcee-426f87835b6b	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	SEG-CAB	Caballero	Productos dirigidos al segmento masculino	#56c293	3	f	2026-04-12 02:25:07.918002	2026-04-12 21:23:12.692426	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	991d248f-b44a-48d4-9a2f-f33529d9cf05
40dd0a79-84c8-4906-a65c-d475dea8612b	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	SEG-BEBE	Bebé	Productos para recién nacidos y primera infancia	#f9fd0d	4	f	2026-04-12 02:26:00.593628	2026-04-12 21:23:15.44083	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	991d248f-b44a-48d4-9a2f-f33529d9cf05
df20115d-c017-4782-b28e-78afce21b8f1	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	CAT-FARMA	Farmacia	Productos farmacéuticos y de cuidado personal	#ff142c	5	f	2026-04-12 02:45:44.042968	2026-04-12 21:23:17.831375	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	991d248f-b44a-48d4-9a2f-f33529d9cf05
5a26d289-8f20-44f0-8797-56445ef9b8d9	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	SEG-NINO	Niño	Productos dirigidos al segmento infantil	#7b4777	1	t	2026-04-11 01:08:46.356935	2026-04-17 23:51:55.538484	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	991d248f-b44a-48d4-9a2f-f33529d9cf05
d1cc2c6a-91f6-4924-bdf1-0bc533774db2	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	SERV-SOP1	Soporte Tecnico prueba	Servicios de soporte técnico para clientes (remoto o presencial)	#0dfd61	1	t	2026-04-17 22:44:21.611507	2026-04-18 16:59:20.622136	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	75230088-4af9-4e79-97a6-130e905097ec
395133a7-26d1-48b6-a850-bd732d2aabee	0459fe04-163b-4b89-b98a-0f1179b7224c	SEG-NINO	PANAL PARA RECIEN NACIDOS	Productos para recién nacidos y primera infancia	#bdfd0d	1	t	2026-04-18 17:03:42.872733	2026-04-18 17:04:10.656015	674ab9f4-f3a1-4a55-8aff-7065c66b6133	674ab9f4-f3a1-4a55-8aff-7065c66b6133	75230088-4af9-4e79-97a6-130e905097ec
0ca38218-21e3-44ce-833d-abd798090334	0459fe04-163b-4b89-b98a-0f1179b7224c	ROPA	ROPA PARA PITBUL	ROPA DE PERROS	#fd0dc9	1	t	2026-04-18 17:05:25.058645	2026-04-18 17:05:50.352503	674ab9f4-f3a1-4a55-8aff-7065c66b6133	674ab9f4-f3a1-4a55-8aff-7065c66b6133	991d248f-b44a-48d4-9a2f-f33529d9cf05
\.


--
-- TOC entry 5760 (class 0 OID 230406)
-- Dependencies: 397
-- Data for Name: item_etiqueta_categoria_det; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_etiqueta_categoria_det (id_item_etiqueta_categoria, id_item, id_etiqueta_categoria, created_at, updated_at, created_by, updated_by) FROM stdin;
\.


--
-- TOC entry 5740 (class 0 OID 220967)
-- Dependencies: 377
-- Data for Name: item_lote_serie; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_lote_serie (id_lote_serie, id_empresa, id_item, id_almacen, codigo_lote_serie, fecha_limite_venta, fecha_caducidad, cantidad_actual, observacion, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5697 (class 0 OID 98913)
-- Dependencies: 334
-- Data for Name: libro_mayor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.libro_mayor (id_libro_mayor, id_empresa, id_cuenta_contable, id_periodo_contable, saldo_inicial, total_debe, total_haber, saldo_final, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5732 (class 0 OID 213080)
-- Dependencies: 369
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media (id_media, module, module_id, url, filename, mimetype, size, created_at, updated_at, tipo, es_principal, estado_archivo, id_directorio_documento, estado, id_empresa) FROM stdin;
566c5022-f112-4651-8770-26a6e42f8243	tercero	edc9254b-abf1-42a4-a2bd-fa4f0bad4e70	http://localhost:3010/uploads/d2600c4c-2ce7-4d01-b6e8-82f028e69d27/tercero/edc9254b-abf1-42a4-a2bd-fa4f0bad4e70/1775947906855-xvrcfi592c.jpg	1775947906855-xvrcfi592c.jpg	image/jpeg	480938	2026-04-11 22:51:46.911+00	\N	imagen	f	ACTIVO	df6e36a2-8091-4dad-9bc6-f2c35fea86df	t	d2600c4c-2ce7-4d01-b6e8-82f028e69d27
0f2cc62c-fd0d-4b1b-99ca-d7af1a2ffcb9	tercero	b8d6e457-6864-4f15-bda7-aa880a57aeaa	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/b8d6e457-6864-4f15-bda7-aa880a57aeaa/1775682840695-efvw8y8gs48.jpg	\N	\N	\N	2026-04-08 21:14:16.854+00	2026-04-09 20:20:54.53+00	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
bca60ec2-9dcb-46ff-bfdc-fe0c8598bec7	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1776017465191-vpbwca3hhe.jpg	1776017465191-vpbwca3hhe.jpg	image/jpeg	74261	2026-04-12 18:11:05.244+00	\N	imagen	f	ACTIVO	3c39cb10-1a65-4e38-a5de-92f066f22e22	t	0459fe04-163b-4b89-b98a-0f1179b7224c
04980f87-5366-4a3b-9109-bd4096f32ae1	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1776004497433-ob0cpu7v9n.jpg	1776004497433-ob0cpu7v9n.jpg	image/jpeg	27453	2026-04-12 14:34:57.502+00	2026-04-12 14:36:14.806+00	imagen	f	INACTIVO	\N	f	0459fe04-163b-4b89-b98a-0f1179b7224c
9a97c44c-7e2a-482b-931d-4535623eed08	tercero	cc29aab7-9c5e-48ff-983b-c701a04f8f93	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/cc29aab7-9c5e-48ff-983b-c701a04f8f93/1775682655092-ia9dazl3g1m.jpg	\N	\N	\N	2026-04-08 21:11:13.038+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
46397523-7122-43d3-bdbb-fb59e1cbcc87	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1775683371251-mt1drm4vkw.jpg	\N	\N	\N	2026-04-08 21:23:49.823+00	2026-04-12 16:05:44.336+00	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
8a7802dd-a679-4113-b8ee-673a404c47b2	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1776021578966-mtmoa61b0f.jpg	1776021578966-mtmoa61b0f.jpg	image/jpeg	102650	2026-04-12 19:19:39.015+00	\N	imagen	f	ACTIVO	3c39cb10-1a65-4e38-a5de-92f066f22e22	t	0459fe04-163b-4b89-b98a-0f1179b7224c
64d16340-59f0-4a5a-ab46-fef0ca8a23b2	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1776020160302-x1eeuww7ovp.png	1776020160302-x1eeuww7ovp.png	image/png	853752	2026-04-12 18:56:00.356+00	2026-04-12 18:56:08.522+00	imagen	t	ACTIVO	6a900121-df99-4256-806c-e15caeb5a3f6	t	0459fe04-163b-4b89-b98a-0f1179b7224c
a86f5211-615e-41d1-9ae7-b7a59c151852	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1775947138561-d5hblbixp7m.jpg	1775947138561-d5hblbixp7m.jpg	image/jpeg	29077	2026-04-11 22:38:58.612+00	2026-04-12 18:56:10.692+00	imagen	f	ACTIVO	6a900121-df99-4256-806c-e15caeb5a3f6	t	0459fe04-163b-4b89-b98a-0f1179b7224c
c9121153-dc34-4a4e-ac12-a8875f9e5585	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1775683238102-x99h2w9bhf9.png	\N	\N	\N	2026-04-08 21:20:47.762+00	2026-04-12 16:10:51.485+00	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
4da2279f-63b0-4e7d-b0e6-a38b30cfbb8b	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1776021579005-tqtb3oob7ee.jpg	1776021579005-tqtb3oob7ee.jpg	image/jpeg	126992	2026-04-12 19:19:39.056+00	\N	imagen	f	ACTIVO	3c39cb10-1a65-4e38-a5de-92f066f22e22	t	0459fe04-163b-4b89-b98a-0f1179b7224c
7022833d-d215-43ec-a3bf-873f65a12214	tercero	edc9254b-abf1-42a4-a2bd-fa4f0bad4e70	http://localhost:3010/uploads/d2600c4c-2ce7-4d01-b6e8-82f028e69d27/tercero/edc9254b-abf1-42a4-a2bd-fa4f0bad4e70/1775842155934-lw5zaodj0gb.png	\N	\N	\N	2026-04-10 17:29:30.177+00	2026-04-11 20:49:38.247+00	imagen	t	ACTIVO	e6a3abc7-06ab-4f30-86c6-80828ff2e7e3	t	d2600c4c-2ce7-4d01-b6e8-82f028e69d27
ee4a9918-165f-4a1b-b0e9-ce0bdda23bbf	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1775940959020-y8iur810ns.jpg	1775940959020-y8iur810ns.jpg	image/jpeg	135264	2026-04-11 20:55:59.075+00	\N	imagen	f	ACTIVO	6a900121-df99-4256-806c-e15caeb5a3f6	t	0459fe04-163b-4b89-b98a-0f1179b7224c
1aa01b78-ac45-412a-b1e8-17bd77497c02	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1776020209109-4onrd9ocbco.jpg	1776020209109-4onrd9ocbco.jpg	image/jpeg	43880	2026-04-12 18:56:49.161+00	\N	imagen	f	ACTIVO	3c39cb10-1a65-4e38-a5de-92f066f22e22	t	0459fe04-163b-4b89-b98a-0f1179b7224c
abbf60c4-96c7-4daf-a8b9-9620ed1956de	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1776017416754-cooefaqc4wa.jpg	1776017416754-cooefaqc4wa.jpg	image/jpeg	15436	2026-04-12 18:10:16.812+00	2026-04-14 20:24:08.767+00	imagen	f	ACTIVO	a029fdab-4f54-43f6-a7e9-c29328e165aa	t	0459fe04-163b-4b89-b98a-0f1179b7224c
17250cad-5b89-4f83-9913-f427cbf21c53	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1776017416773-fql9isy3pys.jpg	1776017416773-fql9isy3pys.jpg	image/jpeg	440361	2026-04-12 18:10:16.788+00	\N	imagen	f	ACTIVO	a029fdab-4f54-43f6-a7e9-c29328e165aa	t	0459fe04-163b-4b89-b98a-0f1179b7224c
ab2075b2-c954-41bc-baa2-f03af0b791c1	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1776040141724-yngxktsi9xe.jpg	1776040141724-yngxktsi9xe.jpg	image/jpeg	10538	2026-04-13 00:29:01.809+00	\N	imagen	f	ACTIVO	6a900121-df99-4256-806c-e15caeb5a3f6	t	0459fe04-163b-4b89-b98a-0f1179b7224c
6d3442f6-ff7c-4682-a988-b6687f8ef8d5	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1776041793379-uvtwkiyl1yh.jpg	1776041793379-uvtwkiyl1yh.jpg	image/jpeg	69228	2026-04-13 00:56:33.436+00	\N	imagen	f	ACTIVO	fa4f1ed3-1704-461e-b61f-2108ce62a31a	t	0459fe04-163b-4b89-b98a-0f1179b7224c
e73bf453-844f-4816-98d2-a13cbdcf947c	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1776017416766-opfc8zrvybd.jpg	1776017416766-opfc8zrvybd.jpg	image/jpeg	480938	2026-04-12 18:10:16.819+00	2026-04-14 20:23:59.733+00	imagen	t	ACTIVO	a029fdab-4f54-43f6-a7e9-c29328e165aa	t	0459fe04-163b-4b89-b98a-0f1179b7224c
2ceef1ff-7744-416b-9fc9-7f89861b24b1	tercero	b8d6e457-6864-4f15-bda7-aa880a57aeaa	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/b8d6e457-6864-4f15-bda7-aa880a57aeaa/1776130172068-fmw7nj9jnn.pdf	1776130172068-fmw7nj9jnn.pdf	application/pdf	60435	2026-04-14 01:29:32.121+00	\N	documento	f	ACTIVO	6a900121-df99-4256-806c-e15caeb5a3f6	t	0459fe04-163b-4b89-b98a-0f1179b7224c
4b99072a-9dae-43cc-b446-0031db59fffa	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1776177623493-we0o3hy1gk9.png	1776177623493-we0o3hy1gk9.png	image/png	2159557	2026-04-14 14:40:23.592+00	\N	imagen	f	ACTIVO	fa4f1ed3-1704-461e-b61f-2108ce62a31a	t	0459fe04-163b-4b89-b98a-0f1179b7224c
3ebfab20-6422-49d7-9b14-3da90ed8bacf	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1776177787498-jvkbmu0zm9a.png	1776177787498-jvkbmu0zm9a.png	image/png	1973628	2026-04-14 14:43:07.59+00	\N	imagen	f	ACTIVO	fa4f1ed3-1704-461e-b61f-2108ce62a31a	t	0459fe04-163b-4b89-b98a-0f1179b7224c
7ae6c829-cc8a-407b-b76e-af9dfe7ff285	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1776125165219-j229zfc9rr.pdf	1776125165219-j229zfc9rr.pdf	application/pdf	98551	2026-04-14 00:06:05.285+00	2026-04-14 20:23:52.48+00	documento	t	ACEPTADO	a029fdab-4f54-43f6-a7e9-c29328e165aa	t	0459fe04-163b-4b89-b98a-0f1179b7224c
989c18ce-dc18-44b9-b1f1-32336067f1ff	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1776177787561-p4dtj7nyosm.png	1776177787561-p4dtj7nyosm.png	image/png	3167937	2026-04-14 14:43:07.575+00	\N	imagen	f	ACTIVO	fa4f1ed3-1704-461e-b61f-2108ce62a31a	t	0459fe04-163b-4b89-b98a-0f1179b7224c
3af3a20b-071f-4b3f-9bc0-bf128c885445	tercero	606e39fc-229f-40a8-981b-46b6de7f9563	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/606e39fc-229f-40a8-981b-46b6de7f9563/1776179000244-39amcdpot1a.png	1776179000244-39amcdpot1a.png	image/png	2575486	2026-04-14 15:03:20.364+00	\N	imagen	f	ACTIVO	fa4f1ed3-1704-461e-b61f-2108ce62a31a	t	0459fe04-163b-4b89-b98a-0f1179b7224c
541cdeb9-a1dc-4cb6-bb10-f5e8f282c798	tercero	b8d6e457-6864-4f15-bda7-aa880a57aeaa	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/b8d6e457-6864-4f15-bda7-aa880a57aeaa/1776180358442-dccfl3m74fh.png	1776180358442-dccfl3m74fh.png	image/png	3002219	2026-04-14 15:25:58.493+00	\N	imagen	f	ACTIVO	6a900121-df99-4256-806c-e15caeb5a3f6	t	0459fe04-163b-4b89-b98a-0f1179b7224c
9a3e7116-0bf1-4101-b29b-28d466b9b909	tercero	b8d6e457-6864-4f15-bda7-aa880a57aeaa	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/b8d6e457-6864-4f15-bda7-aa880a57aeaa/1776180358403-asgj148lkg.pdf	1776180358403-asgj148lkg.pdf	application/pdf	146700	2026-04-14 15:25:58.449+00	\N	documento	f	ACTIVO	6a900121-df99-4256-806c-e15caeb5a3f6	t	0459fe04-163b-4b89-b98a-0f1179b7224c
1feaf119-b81f-40e6-8c7d-340942657fa4	tercero	b8d6e457-6864-4f15-bda7-aa880a57aeaa	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/b8d6e457-6864-4f15-bda7-aa880a57aeaa/1776180358399-bbf58huyqb6.pdf	1776180358399-bbf58huyqb6.pdf	application/pdf	345620	2026-04-14 15:25:58.452+00	\N	documento	f	ACTIVO	6a900121-df99-4256-806c-e15caeb5a3f6	t	0459fe04-163b-4b89-b98a-0f1179b7224c
470e7b39-b046-4e90-9160-43dd07c99bd3	tercero	b8d6e457-6864-4f15-bda7-aa880a57aeaa	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/b8d6e457-6864-4f15-bda7-aa880a57aeaa/1776182038958-khnvp3nvngs.png	1776182038958-khnvp3nvngs.png	image/png	1791619	2026-04-14 15:53:59.011+00	\N	imagen	f	ACTIVO	6a900121-df99-4256-806c-e15caeb5a3f6	t	0459fe04-163b-4b89-b98a-0f1179b7224c
96b50860-8a0b-4b2c-a213-f8be80e05959	tercero	b8d6e457-6864-4f15-bda7-aa880a57aeaa	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/b8d6e457-6864-4f15-bda7-aa880a57aeaa/1776182038945-w2mjcbbxwn.pdf	1776182038945-w2mjcbbxwn.pdf	application/pdf	345620	2026-04-14 15:53:59.005+00	\N	documento	f	ACTIVO	6a900121-df99-4256-806c-e15caeb5a3f6	t	0459fe04-163b-4b89-b98a-0f1179b7224c
c9e66e69-c8e5-4985-9c5b-517e5ff54873	tercero	0e5ea770-941d-46b1-bc98-904679465874	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/0e5ea770-941d-46b1-bc98-904679465874/1776182820289-7s0nd1wimgg.png	\N	\N	\N	2026-04-14 16:07:36.975+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
05793b31-d32a-45d8-9718-127e81e494ce	tercero	f5e16b37-00cd-437a-a352-1af7eb5602b8	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/f5e16b37-00cd-437a-a352-1af7eb5602b8/1776187112760-6o35g7ja1nm.jpg	\N	\N	\N	2026-04-14 17:19:10.276+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
126e2e43-7f44-4bde-815e-ec428e137bb2	tercero	f5e16b37-00cd-437a-a352-1af7eb5602b8	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/f5e16b37-00cd-437a-a352-1af7eb5602b8/1776198492582-8jt9a8e128.png	1776198492582-8jt9a8e128.png	image/png	2356410	2026-04-14 20:28:12.643+00	\N	imagen	f	ACTIVO	fa4f1ed3-1704-461e-b61f-2108ce62a31a	t	0459fe04-163b-4b89-b98a-0f1179b7224c
c5863b3f-41af-4821-b039-10babb03f6de	tercero	f5e16b37-00cd-437a-a352-1af7eb5602b8	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/f5e16b37-00cd-437a-a352-1af7eb5602b8/1776198492593-4euy09m1708.jpg	1776198492593-4euy09m1708.jpg	image/jpeg	57495	2026-04-14 20:28:12.644+00	\N	imagen	f	ACTIVO	fa4f1ed3-1704-461e-b61f-2108ce62a31a	t	0459fe04-163b-4b89-b98a-0f1179b7224c
cb8f7831-3b74-44bd-895d-3d03fccfa5d7	tercero	f5e16b37-00cd-437a-a352-1af7eb5602b8	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/f5e16b37-00cd-437a-a352-1af7eb5602b8/1776198492620-c01gm7ocuw.png	1776198492620-c01gm7ocuw.png	image/png	2576473	2026-04-14 20:28:12.63+00	\N	imagen	f	ACTIVO	fa4f1ed3-1704-461e-b61f-2108ce62a31a	t	0459fe04-163b-4b89-b98a-0f1179b7224c
f4632c86-d6a1-4bcc-a745-0129ca09969e	tercero	f5e16b37-00cd-437a-a352-1af7eb5602b8	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/f5e16b37-00cd-437a-a352-1af7eb5602b8/1776198492601-8tfx8jdidx4.pdf	1776198492601-8tfx8jdidx4.pdf	application/pdf	928087	2026-04-14 20:28:12.658+00	\N	documento	f	ACTIVO	fa4f1ed3-1704-461e-b61f-2108ce62a31a	t	0459fe04-163b-4b89-b98a-0f1179b7224c
5ad2a0f4-42fb-4813-a2e1-0d55afd900e6	tercero	0e5ea770-941d-46b1-bc98-904679465874	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/0e5ea770-941d-46b1-bc98-904679465874/1776182820289-7s0nd1wimgg.png	\N	\N	\N	2026-04-14 21:10:44.998+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
78cf33a5-1250-4364-8ff3-f58df8ed55bb	tercero	f5e16b37-00cd-437a-a352-1af7eb5602b8	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/f5e16b37-00cd-437a-a352-1af7eb5602b8/1776201152626-ggma9stcl7g.jpg	\N	\N	\N	2026-04-14 21:12:50.612+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
ab16359e-fbde-47d7-a319-e3c80a9c685a	tercero	80a3e5f0-161e-49a3-8efa-8749efa4d30a	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/80a3e5f0-161e-49a3-8efa-8749efa4d30a/1776201480443-k2v2ysdhqvo.png	\N	\N	\N	2026-04-14 21:18:48.217+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
0b29bdff-ebef-4f8c-82ca-9460cd01b477	tercero	0e5ea770-941d-46b1-bc98-904679465874	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/0e5ea770-941d-46b1-bc98-904679465874/1776182820289-7s0nd1wimgg.png	\N	\N	\N	2026-04-14 21:21:42.006+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
f192f464-9ecb-48d2-9c93-b8aa92ec65b6	tercero	e89dc07d-0479-4be5-8d9a-21cf2d5f069c	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/e89dc07d-0479-4be5-8d9a-21cf2d5f069c/1776217201185-9e9mpy71iml.png	\N	\N	\N	2026-04-15 01:41:02.426+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
b6328770-5c60-4bfc-acbe-dc4a8b5fd60f	tercero	d963e036-bb4a-43e3-8ae2-eed3f62c67ea	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/general/global/1776217201185-9e9mpy71iml.png	\N	\N	\N	2026-04-15 01:42:01.251+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
9b08f574-4088-4208-896f-326e96b26db7	tercero	89e049a0-0f6e-4858-b841-91499336892e	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/89e049a0-0f6e-4858-b841-91499336892e/1776221679912-dr3k86bizuu.png	\N	\N	\N	2026-04-15 02:55:15.122+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
879d9d93-4ff8-44f2-909a-f72dbf33fd45	tercero	89e049a0-0f6e-4858-b841-91499336892e	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/89e049a0-0f6e-4858-b841-91499336892e/1776221679912-dr3k86bizuu.png	\N	\N	\N	2026-04-15 02:57:03.002+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
9dfddb7e-364e-459b-8ad1-cba56afb7a08	tercero	89e049a0-0f6e-4858-b841-91499336892e	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/89e049a0-0f6e-4858-b841-91499336892e/1776221679912-dr3k86bizuu.png	\N	\N	\N	2026-04-15 02:57:48.974+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
904b0780-ee89-45b3-986c-cc4da9f26e41	tercero	89e049a0-0f6e-4858-b841-91499336892e	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/89e049a0-0f6e-4858-b841-91499336892e/1776221679912-dr3k86bizuu.png	\N	\N	\N	2026-04-15 03:49:44.872+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
86d3e18b-9a24-440d-858b-21c2c0aaa5c2	tercero	ebc4e287-1762-485c-8836-63f1ad8f84a1	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/ebc4e287-1762-485c-8836-63f1ad8f84a1/1776226225889-jn5jn1h0x7j.jpg	\N	\N	\N	2026-04-15 04:11:01.921+00	2026-04-15 06:06:07.252+00	imagen	f	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
f0b010e0-1b72-4a6f-bc7b-b2c71a969210	tercero	b0c39696-09d8-4f9f-9558-2b6a6cd3f50b	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/b0c39696-09d8-4f9f-9558-2b6a6cd3f50b/1776225167671-7rabnnqbyue.png	\N	\N	\N	2026-04-15 03:53:47.822+00	2026-04-15 05:51:45.613+00	imagen	f	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
817eb24d-1232-4450-9684-49d5dee435a1	tercero	e89dc07d-0479-4be5-8d9a-21cf2d5f069c	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/e89dc07d-0479-4be5-8d9a-21cf2d5f069c/1776217201185-9e9mpy71iml.png	\N	\N	\N	2026-04-15 15:07:43.445+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
ff0e14e5-a567-486d-a4cb-85f7a1fc72a6	tercero	b0c39696-09d8-4f9f-9558-2b6a6cd3f50b	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/b0c39696-09d8-4f9f-9558-2b6a6cd3f50b/1776231363700-9ny0yqy8oi9.png	\N	\N	\N	2026-04-15 15:10:59.754+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
39adb3f3-d3a4-4148-a686-c3d7fcada52f	tercero	b0c39696-09d8-4f9f-9558-2b6a6cd3f50b	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/b0c39696-09d8-4f9f-9558-2b6a6cd3f50b/1776231363700-9ny0yqy8oi9.png	\N	\N	\N	2026-04-15 15:36:51.607+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
f2f82970-879c-41ca-8bd6-14db31d287f5	tercero	e89dc07d-0479-4be5-8d9a-21cf2d5f069c	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/e89dc07d-0479-4be5-8d9a-21cf2d5f069c/1776267767106-zn98flvh7qq.png	\N	\N	\N	2026-04-15 15:42:54.937+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
ccbedcef-02d6-4b7a-9e05-69e011bc0b5e	tercero	b0c39696-09d8-4f9f-9558-2b6a6cd3f50b	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/b0c39696-09d8-4f9f-9558-2b6a6cd3f50b/1776225167671-7rabnnqbyue.png	\N	\N	\N	2026-04-15 04:02:06.244+00	2026-04-15 05:48:14.309+00	imagen	f	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
38585fec-7f9a-487c-9182-f5a96113d8e8	tercero	f5e16b37-00cd-437a-a352-1af7eb5602b8	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/f5e16b37-00cd-437a-a352-1af7eb5602b8/1776268407334-m5ok7zmabp.jpg	\N	\N	\N	2026-04-15 15:53:33.718+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
12f3e573-3507-4547-b5f3-ca3345ef4c8b	tercero	b0c39696-09d8-4f9f-9558-2b6a6cd3f50b	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/b0c39696-09d8-4f9f-9558-2b6a6cd3f50b/1776231363700-9ny0yqy8oi9.png	\N	\N	\N	2026-04-15 05:36:13.541+00	2026-04-15 05:51:47.472+00	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
41e1d13a-fd19-4709-8216-256a80fff00c	tercero	b0c39696-09d8-4f9f-9558-2b6a6cd3f50b	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/b0c39696-09d8-4f9f-9558-2b6a6cd3f50b/1776231503214-2sh3iipd49k.png	\N	\N	\N	2026-04-15 05:38:29.822+00	2026-04-15 05:51:49.946+00	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
b1c8311a-b995-4762-a7c7-5ba26cf74366	tercero	80a3e5f0-161e-49a3-8efa-8749efa4d30a	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/80a3e5f0-161e-49a3-8efa-8749efa4d30a/1776268926753-8gey8tirmls.png	\N	\N	\N	2026-04-15 16:02:12.219+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
b311fce7-e460-473d-a028-4b395f96aa77	tercero	80a3e5f0-161e-49a3-8efa-8749efa4d30a	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/80a3e5f0-161e-49a3-8efa-8749efa4d30a/1776270728388-k0zu79pc5k.png	\N	\N	\N	2026-04-15 16:32:15.118+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
f8848474-73a8-4a7c-88c0-f741248433a0	tercero	ebc4e287-1762-485c-8836-63f1ad8f84a1	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/ebc4e287-1762-485c-8836-63f1ad8f84a1/1776226225889-jn5jn1h0x7j.jpg	\N	\N	\N	2026-04-15 04:12:01.149+00	2026-04-15 06:05:34.521+00	imagen	f	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
e486d89c-5904-4172-8d60-bb5b991e4b80	tercero	ebc4e287-1762-485c-8836-63f1ad8f84a1	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/ebc4e287-1762-485c-8836-63f1ad8f84a1/1776226225889-jn5jn1h0x7j.jpg	\N	\N	\N	2026-04-15 04:18:39.277+00	2026-04-15 06:05:36.531+00	imagen	f	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
1060f0fb-97b2-42b8-9bd1-63111d0f11fa	tercero	c1eebef1-965a-4820-8c5a-ca8adcd62b62	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/c1eebef1-965a-4820-8c5a-ca8adcd62b62/1776272028085-onwuiza6cp.jpg	\N	\N	\N	2026-04-15 16:53:54.253+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
e4fd53af-885d-46c8-9791-1f3846cf9fd7	tercero	ebc4e287-1762-485c-8836-63f1ad8f84a1	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/ebc4e287-1762-485c-8836-63f1ad8f84a1/1776226624460-vx7oocbffvh.jpg	\N	\N	\N	2026-04-15 04:17:13.203+00	2026-04-15 06:06:12.164+00	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
81ec1be4-799b-447f-8f17-84e79ecbd63d	tercero	ebc4e287-1762-485c-8836-63f1ad8f84a1	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/ebc4e287-1762-485c-8836-63f1ad8f84a1/1776226525956-cf2xouxukm.png	\N	\N	\N	2026-04-15 04:15:32.153+00	2026-04-15 06:06:50.391+00	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
45deb830-bea9-4c12-bf07-7506f2b35428	tercero	c1eebef1-965a-4820-8c5a-ca8adcd62b62	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/c1eebef1-965a-4820-8c5a-ca8adcd62b62/1776272157792-hnavb77byka.png	\N	\N	\N	2026-04-15 16:56:04.175+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
b5a520b4-624e-4b9a-851f-da7711b5b950	tercero	6353efce-b194-493e-9187-89474f6bb7c2	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/6353efce-b194-493e-9187-89474f6bb7c2/1776278478215-4ih0h9xxkj.png	\N	\N	\N	2026-04-15 18:41:52.334+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
d5573e50-eeb5-4f34-98a8-f50c0382ecc9	tercero	6353efce-b194-493e-9187-89474f6bb7c2	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/6353efce-b194-493e-9187-89474f6bb7c2/1776278673091-dqy64mr640r.png	\N	\N	\N	2026-04-15 18:44:39.509+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
485d8d66-967d-424e-8037-8dd89fd14eec	tercero	6353efce-b194-493e-9187-89474f6bb7c2	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/6353efce-b194-493e-9187-89474f6bb7c2/1776280895896-3r6cnurh45i.png	1776280895896-3r6cnurh45i.png	image/png	3143323	2026-04-15 19:21:35.986+00	2026-04-15 19:22:07.579+00	imagen	f	EN_PROCESO	a0f41e37-9994-4966-801c-1dfc566f28b1	t	0459fe04-163b-4b89-b98a-0f1179b7224c
b00c4524-5d87-485e-b141-08e54afe261a	tercero	6353efce-b194-493e-9187-89474f6bb7c2	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/6353efce-b194-493e-9187-89474f6bb7c2/1776281012501-gokklylmggd.png	1776281012501-gokklylmggd.png	image/png	2369260	2026-04-15 19:23:32.566+00	\N	imagen	f	ACTIVO	55cfeb1b-ebc0-4175-8d2b-8d7833f59e10	t	0459fe04-163b-4b89-b98a-0f1179b7224c
c8d513ff-5d73-4a3a-86d9-b396218a61ab	tercero	6353efce-b194-493e-9187-89474f6bb7c2	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/6353efce-b194-493e-9187-89474f6bb7c2/1776281012359-uyjsweqbh9g.pdf	1776281012359-uyjsweqbh9g.pdf	application/pdf	304862	2026-04-15 19:23:32.528+00	\N	documento	f	ACTIVO	55cfeb1b-ebc0-4175-8d2b-8d7833f59e10	t	0459fe04-163b-4b89-b98a-0f1179b7224c
63490b06-830b-4042-8bb9-f7e0cfae0037	tercero	6353efce-b194-493e-9187-89474f6bb7c2	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/6353efce-b194-493e-9187-89474f6bb7c2/1776281200321-8hh71k129wv.png	\N	\N	\N	2026-04-15 19:26:46.681+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
49f9a5d8-96a3-432b-8cff-184cef064bce	tercero	402d23b7-7161-4e2b-a532-80bdcb078d6c	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/402d23b7-7161-4e2b-a532-80bdcb078d6c/1776281427573-xk9yi0u8hcd.png	\N	\N	\N	2026-04-15 19:31:00.192+00	\N	imagen	t	ACTIVO	fe73615d-8ddf-4509-8677-a8b91f03c435	t	0459fe04-163b-4b89-b98a-0f1179b7224c
2cbed726-d56e-430d-bfee-03946ec7ad73	tercero	402d23b7-7161-4e2b-a532-80bdcb078d6c	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/402d23b7-7161-4e2b-a532-80bdcb078d6c/1776549722307-d2zkocf59x9.png	1776549722307-d2zkocf59x9.png	image/png	1791619	2026-04-18 22:02:02.411+00	\N	imagen	f	ACTIVO	a0f41e37-9994-4966-801c-1dfc566f28b1	t	0459fe04-163b-4b89-b98a-0f1179b7224c
da177d14-ba96-4a64-b2ae-5b679525266d	tercero	aa75ac23-3dd7-4fe8-878f-a13f8a86fa6a	http://localhost:3010/uploads/d2600c4c-2ce7-4d01-b6e8-82f028e69d27/tercero/aa75ac23-3dd7-4fe8-878f-a13f8a86fa6a/1776872138958-zxg4tizvubj.png	\N	\N	\N	2026-04-22 15:35:58.518+00	\N	imagen	t	ACTIVO	e6a3abc7-06ab-4f30-86c6-80828ff2e7e3	t	d2600c4c-2ce7-4d01-b6e8-82f028e69d27
49b5e51f-2bb6-4d15-92f2-940ecb103457	tercero	2d68f336-6cc5-469f-a871-56b9a40aa363	http://localhost:3010/uploads/d2600c4c-2ce7-4d01-b6e8-82f028e69d27/tercero/2d68f336-6cc5-469f-a871-56b9a40aa363/1776881201402-lf1i74j8jd.png	\N	\N	\N	2026-04-22 18:06:58.858+00	2026-04-22 18:11:20.135+00	imagen	t	EN_PROCESO	e6a3abc7-06ab-4f30-86c6-80828ff2e7e3	t	d2600c4c-2ce7-4d01-b6e8-82f028e69d27
d3b5f996-1744-495b-9d7a-795d8992d868	tercero	402d23b7-7161-4e2b-a532-80bdcb078d6c	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/402d23b7-7161-4e2b-a532-80bdcb078d6c/1776881890448-polxow3kqya.pdf	1776881890448-polxow3kqya.pdf	application/pdf	98551	2026-04-22 18:18:10.504+00	\N	documento	f	ACTIVO	6a900121-df99-4256-806c-e15caeb5a3f6	t	0459fe04-163b-4b89-b98a-0f1179b7224c
aa975929-9910-4f35-864b-61d839352dd9	tercero	402d23b7-7161-4e2b-a532-80bdcb078d6c	http://localhost:3010/uploads/0459fe04-163b-4b89-b98a-0f1179b7224c/tercero/402d23b7-7161-4e2b-a532-80bdcb078d6c/1776881890469-tzayuhrn4d9.png	1776881890469-tzayuhrn4d9.png	image/png	1236900	2026-04-22 18:18:10.524+00	2026-04-22 18:18:45.064+00	imagen	f	ACEPTADO	6a900121-df99-4256-806c-e15caeb5a3f6	t	0459fe04-163b-4b89-b98a-0f1179b7224c
\.


--
-- TOC entry 5652 (class 0 OID 17379)
-- Dependencies: 289
-- Data for Name: menu_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_item (id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, muestra_badge, badge_text, estado, created_by, created_at, updated_by, updated_at) FROM stdin;
4269c173-112e-4592-9bf7-3496a68fd84a	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	\N	Empresa	bi bi-building	\N	f	10	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
96e04604-7f3a-40ee-bf8b-f38cecef88bd	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	4269c173-112e-4592-9bf7-3496a68fd84a	Lista	bi bi-list	/empresas	t	1	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
9a0875dc-169e-415c-9af2-f5ba8771ddc0	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	4269c173-112e-4592-9bf7-3496a68fd84a	Crear	bi bi-plus	/empresas/nueva	t	2	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
36d76733-ce00-4440-9b20-14d1188a609a	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	\N	Sucursal	bi bi-diagram-3	\N	f	20	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
9e584be7-2985-42ef-baaa-34eb0caac15d	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	36d76733-ce00-4440-9b20-14d1188a609a	Lista	bi bi-list	/sucursales	t	1	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
99c59281-5e4a-4c21-8591-9aa8e5f2bad8	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	36d76733-ce00-4440-9b20-14d1188a609a	Crear	bi bi-plus	/sucursales/nueva	t	2	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
4b162e6d-8236-4a66-91e4-a0a5195468e5	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	\N	Menú	bi bi-menu-button-wide	\N	f	30	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
32862719-ca23-49a5-b485-c04ac9c1f32a	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	4b162e6d-8236-4a66-91e4-a0a5195468e5	Lista	bi bi-list	/menus	t	1	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
4f0cfd78-58b5-418f-9471-358d38335c48	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	4b162e6d-8236-4a66-91e4-a0a5195468e5	Crear	bi bi-plus	/menus/nuevo	t	2	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
9c0ed39f-56cd-43b5-8d5b-44c0aa79ddf8	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	\N	Perfil	bi bi-people	\N	f	40	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
875cf7c1-9bb5-4e05-b9da-ed362f8ee0fc	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	9c0ed39f-56cd-43b5-8d5b-44c0aa79ddf8	Lista	bi bi-list	/perfiles	t	1	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
72fb941c-cf9b-4ed0-bca8-e32bdcc21d88	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	9c0ed39f-56cd-43b5-8d5b-44c0aa79ddf8	Crear	bi bi-plus	/perfiles/nuevo	t	2	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
cfa65887-2279-4788-a087-e32eccfdad0b	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	2cb5ced4-0d07-461f-bfbb-261219e7aa2d	Nuevo usuario	bi bi-person-plus	/usuario/nuevo	t	1	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
33517997-969a-4db7-969c-8815f30beb29	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	2cb5ced4-0d07-461f-bfbb-261219e7aa2d	Vista jerárquica	bi bi-people	/usuario/jerarquia	t	3	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
3482cc6f-b16c-416d-96b6-ac4beb47454a	fce9f87f-5787-4520-975e-69ec3ab410f6	\N	Tercero	bi bi-person-vcard	\N	f	10	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
0a955801-d641-46e0-93d9-e2a5b5d75a72	fce9f87f-5787-4520-975e-69ec3ab410f6	\N	Contactos/Direcciones	bi bi-journal	\N	f	20	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
1cde0306-79f4-479e-ad46-63ff83e1ac62	fce9f87f-5787-4520-975e-69ec3ab410f6	0a955801-d641-46e0-93d9-e2a5b5d75a72	Nuevo Contacto/Dirección	bi bi-person-plus	/contacto/nuevo	t	1	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
fe802f5b-6cfc-41d2-a097-cbfb0e835e79	fce9f87f-5787-4520-975e-69ec3ab410f6	0a955801-d641-46e0-93d9-e2a5b5d75a72	Listado	bi bi-list	/contacto/lista	t	2	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
2cb5ced4-0d07-461f-bfbb-261219e7aa2d	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	\N	Usuario	bi bi-person		f	50	f		t	\N	2025-08-09 03:41:22.525923	\N	\N
30b280df-a9d3-4384-b2de-98be0c8ffcc0	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	2cb5ced4-0d07-461f-bfbb-261219e7aa2d	Listado de usuarios	bi bi-list	/usuario	t	2	f		t	\N	2025-08-09 03:41:22.525923	\N	\N
a1b2c3d4-e5f6-4789-a012-345678901234	f47ac10b-58cc-4372-a567-0e02b2c3d479	\N	Facturas a clientes	bi bi-file-earmark-text	\N	f	1	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
b2c3d4e5-f6a7-4890-b123-456789012345	f47ac10b-58cc-4372-a567-0e02b2c3d479	\N	Facturas proveedor	bi bi-file-earmark-text	\N	f	2	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
c3d4e5f6-a7b8-4901-c234-567890123456	f47ac10b-58cc-4372-a567-0e02b2c3d479	\N	Pedidos facturables	bi bi-file-earmark-text	/financiero/pedidos-facturables	t	3	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
d4e5f6a7-b8c9-4012-d345-678901234567	f47ac10b-58cc-4372-a567-0e02b2c3d479	\N	Donaciones	bi bi-file-earmark-text	/financiero/donaciones	t	4	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
e5f6a7b8-c9d0-4123-e456-789012345678	f47ac10b-58cc-4372-a567-0e02b2c3d479	\N	Impuestos | Gastos especi...	bi bi-file-earmark-text	\N	f	5	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
f6a7b8c9-d0e1-4234-f567-890123456789	f47ac10b-58cc-4372-a567-0e02b2c3d479	\N	Salarios	bi bi-wallet2	\N	f	6	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
a7b8c9d0-e1f2-4345-a678-901234567890	f47ac10b-58cc-4372-a567-0e02b2c3d479	\N	Préstamos	bi bi-banknote	\N	f	7	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
b8c9d0e1-f2a3-4456-b789-012345678901	f47ac10b-58cc-4372-a567-0e02b2c3d479	\N	Pagos varios	bi bi-file-earmark-text	\N	f	8	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
c9d0e1f2-a3b4-4567-c890-123456789012	f47ac10b-58cc-4372-a567-0e02b2c3d479	\N	Márgenes	bi bi-calculator	/financiero/margenes	t	9	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
1a2b3c4d-5e6f-4789-a012-345678901234	f47ac10b-58cc-4372-a567-0e02b2c3d479	a1b2c3d4-e5f6-4789-a012-345678901234	Nueva factura	bi bi-plus-circle	/financiero/facturas-clientes/nueva	t	1	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
2b3c4d5e-6f7a-4890-b123-456789012345	f47ac10b-58cc-4372-a567-0e02b2c3d479	a1b2c3d4-e5f6-4789-a012-345678901234	Listado	bi bi-list-ul	/financiero/facturas-clientes/listado	t	2	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
3c4d5e6f-7a8b-4901-c234-567890123456	f47ac10b-58cc-4372-a567-0e02b2c3d479	a1b2c3d4-e5f6-4789-a012-345678901234	Listado de plantillas	bi bi-file-earmark-text	/financiero/facturas-clientes/plantillas	t	3	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
4d5e6f7a-8b9c-4012-d345-678901234567	f47ac10b-58cc-4372-a567-0e02b2c3d479	a1b2c3d4-e5f6-4789-a012-345678901234	Pagos	bi bi-credit-card	/financiero/facturas-clientes/pagos	t	4	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
5e6f7a8b-9c0d-4123-e456-789012345678	f47ac10b-58cc-4372-a567-0e02b2c3d479	a1b2c3d4-e5f6-4789-a012-345678901234	Estadísticas	bi bi-graph-up	/financiero/facturas-clientes/estadisticas	t	5	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
6f7a8b9c-0d1e-4234-f567-890123456789	f47ac10b-58cc-4372-a567-0e02b2c3d479	b2c3d4e5-f6a7-4890-b123-456789012345	Nueva factura	bi bi-plus-circle	/financiero/facturas-proveedor/nueva	t	1	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
7a8b9c0d-1e2f-4345-a678-901234567890	f47ac10b-58cc-4372-a567-0e02b2c3d479	b2c3d4e5-f6a7-4890-b123-456789012345	Listado	bi bi-list-ul	/financiero/facturas-proveedor/listado	t	2	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
8b9c0d1e-2f3a-4456-b789-012345678901	f47ac10b-58cc-4372-a567-0e02b2c3d479	b2c3d4e5-f6a7-4890-b123-456789012345	Listado de plantillas	bi bi-file-earmark-text	/financiero/facturas-proveedor/plantillas	t	3	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
9c0d1e2f-3a4b-4567-c890-123456789012	f47ac10b-58cc-4372-a567-0e02b2c3d479	b2c3d4e5-f6a7-4890-b123-456789012345	Pagos	bi bi-credit-card	/financiero/facturas-proveedor/pagos	t	4	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
0d1e2f3a-4b5c-4678-d901-234567890123	f47ac10b-58cc-4372-a567-0e02b2c3d479	b2c3d4e5-f6a7-4890-b123-456789012345	Estadísticas	bi bi-graph-up	/financiero/facturas-proveedor/estadisticas	t	5	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
1e2f3a4b-5c6d-4789-e012-345678901234	f47ac10b-58cc-4372-a567-0e02b2c3d479	e5f6a7b8-c9d0-4123-e456-789012345678	Impuestos sociales/fiscales	bi bi-file-earmark-text	/financiero/impuestos/sociales-fiscales	t	1	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
2f3a4b5c-6d7e-4890-f123-456789012345	f47ac10b-58cc-4372-a567-0e02b2c3d479	e5f6a7b8-c9d0-4123-e456-789012345678	IGST	bi bi-file-earmark-text	/financiero/impuestos/igst	t	2	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
3a4b5c6d-7e8f-4901-a234-567890123456	f47ac10b-58cc-4372-a567-0e02b2c3d479	e5f6a7b8-c9d0-4123-e456-789012345678	CGST	bi bi-file-earmark-text	/financiero/impuestos/cgst	t	3	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
4b5c6d7e-8f9a-4012-b345-678901234567	f47ac10b-58cc-4372-a567-0e02b2c3d479	e5f6a7b8-c9d0-4123-e456-789012345678	SGST	bi bi-file-earmark-text	/financiero/impuestos/sgst	t	4	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
5c6d7e8f-9a0b-4123-c456-789012345678	f47ac10b-58cc-4372-a567-0e02b2c3d479	f6a7b8c9-d0e1-4234-f567-890123456789	Nuevo	bi bi-plus-circle	/financiero/salarios/nuevo	t	1	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
6d7e8f9a-0b1c-4234-d567-890123456789	f47ac10b-58cc-4372-a567-0e02b2c3d479	f6a7b8c9-d0e1-4234-f567-890123456789	Listado	bi bi-list-ul	/financiero/salarios/listado	t	2	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
7e8f9a0b-1c2d-4345-e678-901234567890	f47ac10b-58cc-4372-a567-0e02b2c3d479	f6a7b8c9-d0e1-4234-f567-890123456789	Pagos	bi bi-credit-card	/financiero/salarios/pagos	t	3	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
8f9a0b1c-2d3e-4456-f789-012345678901	f47ac10b-58cc-4372-a567-0e02b2c3d479	f6a7b8c9-d0e1-4234-f567-890123456789	Estadísticas	bi bi-graph-up	/financiero/salarios/estadisticas	t	4	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
9a0b1c2d-3e4f-4567-a890-123456789012	f47ac10b-58cc-4372-a567-0e02b2c3d479	a7b8c9d0-e1f2-4345-a678-901234567890	Nuevo Préstamo	bi bi-plus-circle	/financiero/prestamos/nuevo	t	1	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
19aa9bec-5940-4f3a-97dc-eca4d1cd3fcb	fce9f87f-5787-4520-975e-69ec3ab410f6	3482cc6f-b16c-416d-96b6-ac4beb47454a	Nuevo tercero	bi bi-person-plus	/terceros/nuevo	t	1	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
ed1a3169-f31f-4474-a464-6819ee7efc55	fce9f87f-5787-4520-975e-69ec3ab410f6	3482cc6f-b16c-416d-96b6-ac4beb47454a	Listado	bi bi-list	/terceros	t	2	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
0b1c2d3e-4f5a-4678-b901-234567890123	f47ac10b-58cc-4372-a567-0e02b2c3d479	b8c9d0e1-f2a3-4456-b789-012345678901	Nuevo	bi bi-plus-circle	/financiero/pagos-varios/nuevo	t	1	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
1c2d3e4f-5a6b-4789-c012-345678901234	f47ac10b-58cc-4372-a567-0e02b2c3d479	b8c9d0e1-f2a3-4456-b789-012345678901	Listado	bi bi-list-ul	/financiero/pagos-varios/listado	t	2	f	\N	t	\N	2025-11-02 16:35:20.33346	\N	2025-11-02 16:35:20.33346
1f3e2639-695e-4f31-aa9a-196c9b4d66c5	47394bb3-717f-43dd-aebd-46a4acf93b36	\N	Transferencia en contabilidad	fas fa-exchange-alt	/contabilidad/transferencia	f	2	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
6c172e97-eb8f-4b84-ae5b-52c07a318036	47394bb3-717f-43dd-aebd-46a4acf93b36	\N	Contabilidad	fas fa-book	/contabilidad	f	3	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
c2e44066-dba7-4130-9336-8e8852200285	47394bb3-717f-43dd-aebd-46a4acf93b36	7210dcb8-99cf-449a-a263-c5e43043fee2	General	fas fa-sliders-h	/contabilidad/configuracion/general	t	1	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
48b8c5d4-0924-4c3e-9bfc-ba9c17ec38b9	47394bb3-717f-43dd-aebd-46a4acf93b36	7210dcb8-99cf-449a-a263-c5e43043fee2	Diarios contables	fas fa-journal-whills	/contabilidad/configuracion/diarios	t	2	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
b600dc21-712b-4b77-a351-1f735b04bf74	47394bb3-717f-43dd-aebd-46a4acf93b36	7210dcb8-99cf-449a-a263-c5e43043fee2	Modelos de planes contables	fas fa-layer-group	/contabilidad/configuracion/modelos-planes	t	3	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
c0366ada-b7f2-4055-bd11-12e5472236d9	47394bb3-717f-43dd-aebd-46a4acf93b36	7210dcb8-99cf-449a-a263-c5e43043fee2	Plan contable	fas fa-sitemap	/contabilidad/configuracion/plan-contable	t	4	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
3879f6d6-09a6-49d1-b7a6-3773f917af63	47394bb3-717f-43dd-aebd-46a4acf93b36	7210dcb8-99cf-449a-a263-c5e43043fee2	Plan de cuentas individuales	fas fa-list-alt	/contabilidad/configuracion/cuentas-individuales	t	5	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
a950f4b3-1f27-4207-b8b2-14f7a51cf77e	47394bb3-717f-43dd-aebd-46a4acf93b36	7210dcb8-99cf-449a-a263-c5e43043fee2	Periodo contable	fas fa-calendar-alt	/contabilidad/configuracion/periodo	t	6	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
9ec098de-73e2-4a19-8561-21477a00b51e	47394bb3-717f-43dd-aebd-46a4acf93b36	7210dcb8-99cf-449a-a263-c5e43043fee2	Cuentas contables por defecto	fas fa-cogs	/contabilidad/configuracion/cuentas-defecto	t	7	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
7160c8d3-608d-4a68-81df-97db79e2fcc8	47394bb3-717f-43dd-aebd-46a4acf93b36	7210dcb8-99cf-449a-a263-c5e43043fee2	Cuentas Bancarias	fas fa-university	/contabilidad/configuracion/cuentas-bancarias	t	8	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
256c925b-047f-4e22-9ad6-9ab6d793a6dd	47394bb3-717f-43dd-aebd-46a4acf93b36	7210dcb8-99cf-449a-a263-c5e43043fee2	Cuentas de IVA	fas fa-percentage	/contabilidad/configuracion/cuentas-iva	t	9	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
a2b55cd2-1b16-40a9-b865-f712024f416b	47394bb3-717f-43dd-aebd-46a4acf93b36	7210dcb8-99cf-449a-a263-c5e43043fee2	Cuentas de impuestos	fas fa-receipt	/contabilidad/configuracion/cuentas-impuestos	t	10	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
fa134b10-2361-4947-a63a-3fce0c83e3c8	47394bb3-717f-43dd-aebd-46a4acf93b36	7210dcb8-99cf-449a-a263-c5e43043fee2	Cuentas contables de productos	fas fa-box	/contabilidad/configuracion/cuentas-productos	t	11	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
7fb39208-14be-49fe-8604-94822ddc6e69	47394bb3-717f-43dd-aebd-46a4acf93b36	7210dcb8-99cf-449a-a263-c5e43043fee2	Cerrar cuentas	fas fa-lock	/contabilidad/configuracion/cerrar-cuentas	t	12	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
85857b4d-4803-4e29-bb77-572762a75784	47394bb3-717f-43dd-aebd-46a4acf93b36	7210dcb8-99cf-449a-a263-c5e43043fee2	Grupo personalizado de cuentas	fas fa-layer-group	/contabilidad/configuracion/grupos-personalizados	t	13	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
635bdea0-6e7c-42c8-9458-2b36b6db95a9	47394bb3-717f-43dd-aebd-46a4acf93b36	1f3e2639-695e-4f31-aa9a-196c9b4d66c5	Contabilizar facturas a clientes	fas fa-file-invoice	/contabilidad/transferencia/facturas-clientes	t	1	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
23b3b5c5-7839-437d-b1bd-bad101a1d58a	47394bb3-717f-43dd-aebd-46a4acf93b36	1f3e2639-695e-4f31-aa9a-196c9b4d66c5	Contabilizar facturas de proveedores	fas fa-file-invoice-dollar	/contabilidad/transferencia/facturas-proveedores	t	2	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
2ca11b3c-01cb-4889-a52d-f1531d847987	47394bb3-717f-43dd-aebd-46a4acf93b36	1f3e2639-695e-4f31-aa9a-196c9b4d66c5	Registro en contabilidad	fas fa-book-open	/contabilidad/transferencia/registro	f	3	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
cbc77553-869e-4cb4-922d-4fcaceec4c09	47394bb3-717f-43dd-aebd-46a4acf93b36	2ca11b3c-01cb-4889-a52d-f1531d847987	Ventas (Diario de ventas - vent...)	fas fa-shopping-cart	/contabilidad/transferencia/registro/ventas	t	1	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
7cb096d5-a81e-4a73-bcf9-ca46b97200d5	47394bb3-717f-43dd-aebd-46a4acf93b36	2ca11b3c-01cb-4889-a52d-f1531d847987	Compras (Diario de compras - ...)	fas fa-shopping-bag	/contabilidad/transferencia/registro/compras	t	2	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
f129bae2-2dee-4ed8-ad4f-0a44a79e9208	47394bb3-717f-43dd-aebd-46a4acf93b36	2ca11b3c-01cb-4889-a52d-f1531d847987	Banco (Diario financiero)	fas fa-university	/contabilidad/transferencia/registro/banco	t	3	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
b235549c-598a-4978-99c2-d54b407574c2	47394bb3-717f-43dd-aebd-46a4acf93b36	1f3e2639-695e-4f31-aa9a-196c9b4d66c5	Exportar documentos de origen	fas fa-download	/contabilidad/transferencia/exportar-documentos	t	4	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
ff19c13e-8044-443f-9ba5-d3b1133972a2	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	2cb5ced4-0d07-461f-bfbb-261219e7aa2d	Lista		/usuario	f	51	f		t	\N	2026-03-11 04:03:25.159785	\N	\N
7210dcb8-99cf-449a-a263-c5e43043fee2	47394bb3-717f-43dd-aebd-46a4acf93b36	\N	Configuración	bi bi-sitemap	/contabilidad/configuracion	f	1	f		t	\N	2025-11-02 16:35:57.726766	\N	2026-01-27 03:12:20.683856
0f59572e-70bc-4d62-b620-548d48b1bc2c	47394bb3-717f-43dd-aebd-46a4acf93b36	6c172e97-eb8f-4b84-ae5b-52c07a318036	Asientos Contables	bi bi-journal-text	/contabilidad/asientos	t	0	f	\N	t	\N	2026-01-27 03:51:10.888517	\N	2026-01-27 03:51:10.888517
b4386f81-5805-47a0-b399-c529064fd985	47394bb3-717f-43dd-aebd-46a4acf93b36	6c172e97-eb8f-4b84-ae5b-52c07a318036	Libro Mayor	fas fa-book	/contabilidad/libro-mayor	t	2	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
21d1b917-dfa0-4f55-9ce6-646da9a48015	47394bb3-717f-43dd-aebd-46a4acf93b36	6c172e97-eb8f-4b84-ae5b-52c07a318036	Diarios	fas fa-journal-whills	/contabilidad/diarios	t	3	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
4a6658ae-fd4f-4243-a2f4-26a74a8e78a6	47394bb3-717f-43dd-aebd-46a4acf93b36	6c172e97-eb8f-4b84-ae5b-52c07a318036	Saldo de la cuenta	fas fa-balance-scale	/contabilidad/saldo-cuenta	t	4	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
d20eb542-4e86-4791-9012-d5a2b27083a1	47394bb3-717f-43dd-aebd-46a4acf93b36	6c172e97-eb8f-4b84-ae5b-52c07a318036	Exportar contabilidad	fas fa-file-export	/contabilidad/exportar	t	5	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
93c7b03b-aa74-42fc-9fa3-5ca59a6b0d63	47394bb3-717f-43dd-aebd-46a4acf93b36	6c172e97-eb8f-4b84-ae5b-52c07a318036	Cerrar	fas fa-lock	/contabilidad/cerrar	t	6	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
e4f5f708-ac28-499c-a88c-691f9a66772c	47394bb3-717f-43dd-aebd-46a4acf93b36	6c172e97-eb8f-4b84-ae5b-52c07a318036	Informes	fas fa-chart-bar	/contabilidad/informes	t	7	f	\N	t	\N	2025-11-02 16:35:57.726766	\N	\N
\.


--
-- TOC entry 5651 (class 0 OID 17370)
-- Dependencies: 288
-- Data for Name: menu_seccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_seccion (id_seccion, nombre, orden, icono, estado) FROM stdin;
29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	Inicio	1	bi bi-house	t
065855e9-6c56-427d-bb22-793718cc304e	Servicios	3	bi bi-tools	t
aebecbe6-d2d2-4c94-ab33-85e1b2987b57	Proyectos	4	bi bi-kanban	t
71a29d15-5be0-493b-bb0d-a1139c1b5537	Comercial	5	bi bi-cart	t
68bbbeb9-439c-43ab-8aa2-b328861b0360	Financiera	6	bi bi-currency-dollar	t
62794eff-cd42-46e3-bad3-3a6d832fbfc9	Bancos/Cajas	7	bi bi-bank	t
47394bb3-717f-43dd-aebd-46a4acf93b36	Contabilidad	8	bi bi-calculator	t
9769a54b-5f1b-4c0d-a723-ceae463a9fc8	RRHH	9	bi bi-person-badge	t
b1f77832-4b91-47f2-a0f9-7ba1e7b56ee0	Documentos	10	bi bi-file-text	t
fea75fce-4727-4992-8715-07d77a9e7c61	Agenda	11	bi bi-calendar	t
be980031-d7a4-4671-b4f3-fcb27b5f3366	Tickets	12	bi bi-ticket	t
9a94a5f4-f935-415c-8664-f9ca71e561a4	Utilidades	13	bi bi-wrench	t
f47ac10b-58cc-4372-a567-0e02b2c3d479	Financiero	8	bi bi-currency-dollar	t
fce9f87f-5787-4520-975e-69ec3ab410f6	Terceros	2	bi bi-people	t
\.


--
-- TOC entry 5675 (class 0 OID 32167)
-- Dependencies: 312
-- Data for Name: miembros; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.miembros (id, tipo_miembro_id, naturaleza, empresa, titulo_cortesia, apellidos, nombres, sexo, correo, web, direccion, codigo_postal, poblacion, pais, provincia, telefono_trabajo, telefono_particular, movil, fecha_nacimiento, membresia_publica, creado_en) FROM stdin;
\.


--
-- TOC entry 5681 (class 0 OID 93166)
-- Dependencies: 318
-- Data for Name: modelo_plan_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modelo_plan_contable (id_modelo_plan_contable, nombre, descripcion, codigo, estado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5655 (class 0 OID 18517)
-- Dependencies: 292
-- Data for Name: moneda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.moneda (id_moneda, codigo, nombre) FROM stdin;
0a88e7fe-0510-4453-b009-f2d107453ce8	EUR	Euro
e1adef10-67d8-4194-a782-e85549c4d035	USD	Dólar Estadounidense
9a07fd01-6517-4cc6-83e3-72d6e70dc7c1	MXN	Peso Mexicano
b1a1d96b-6134-43df-a20c-d31ddc4a7ae3	ARS	Peso Argentino
53bb656e-c91d-463b-a27d-634cc8199be0	COP	Peso Colombiano
f03ad056-2c41-42e1-87a3-c4561b1dde4e	CLP	Peso Chileno
9ef47d4a-7ba8-4fb0-8c40-b1d31cd17df6	PEN	Sol Peruano
d6c2f5f2-2535-4d42-93cd-8de22cd23d1f	BRL	Real Brasileño
1842d3e1-de07-44be-84c9-e304ab401919	VES	Bolívar Venezolano
\.


--
-- TOC entry 5713 (class 0 OID 99350)
-- Dependencies: 350
-- Data for Name: movimiento_bancario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimiento_bancario (id_movimiento_bancario, id_empresa, id_cuenta_bancaria, fecha_movimiento, numero_documento, concepto, tipo_movimiento, monto, saldo_anterior, saldo_nuevo, conciliado, id_conciliacion_bancaria, id_asiento_contable, created_at, id_movimiento_reversado) FROM stdin;
\.


--
-- TOC entry 5721 (class 0 OID 99551)
-- Dependencies: 358
-- Data for Name: movimiento_centro_costo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimiento_centro_costo (id_movimiento_centro_costo, id_movimiento_contable, id_centro_costo, porcentaje, monto, created_at) FROM stdin;
\.


--
-- TOC entry 5696 (class 0 OID 98892)
-- Dependencies: 333
-- Data for Name: movimiento_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimiento_contable (id_movimiento_contable, id_asiento_contable, id_cuenta_contable, concepto, debe, haber, orden, created_at) FROM stdin;
\.


--
-- TOC entry 5725 (class 0 OID 106377)
-- Dependencies: 362
-- Data for Name: movimiento_cuenta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimiento_cuenta (id_movimiento_cuenta, id_empresa, id_cuenta_financiera, fecha_movimiento, descripcion, importe, creado_en) FROM stdin;
\.


--
-- TOC entry 5714 (class 0 OID 99380)
-- Dependencies: 351
-- Data for Name: movimiento_inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimiento_inventario (id_movimiento_inventario, id_empresa, id_item, tipo_movimiento, cantidad, costo_unitario, costo_total, fecha_movimiento, referencia, concepto, id_asiento_contable, created_at, id_almacen, id_lote_serie, modulo_origen, id_origen, updated_by, updated_at, estado, id_almacen_destino) FROM stdin;
\.


--
-- TOC entry 5764 (class 0 OID 237141)
-- Dependencies: 401
-- Data for Name: naturaleza_item_catalogo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.naturaleza_item_catalogo (id_naturaleza_item, codigo, nombre, descripcion, orden, estado, created_at, updated_at, created_by, updated_by) FROM stdin;
2f41e1af-4ccf-43c6-857e-56cd041bb27a	MATERIA_PRIMA	Materia prima	Item usado como insumo o materia prima	1	t	2026-03-31 22:25:59.501614	2026-03-31 22:25:59.501614	\N	\N
9b6bf6c2-92e4-4681-a486-45302d3ce807	PRODUCTO_TERMINADO	Producto terminado	Item listo para venta o distribución	2	t	2026-03-31 22:25:59.501614	2026-03-31 22:25:59.501614	\N	\N
c3f6d0b8-93cd-41d4-80dd-f9f78b134663	SERVICIO	Servicio	Item correspondiente a servicio	3	t	2026-03-31 22:25:59.501614	2026-03-31 22:25:59.501614	\N	\N
2b58c945-e2f4-4019-87ef-727d265e0093	CONSUMIBLE	Consumible	Item de uso interno o consumo operativo	4	t	2026-03-31 22:25:59.501614	2026-03-31 22:25:59.501614	\N	\N
93ea8ffa-225b-4243-aac1-9f312e439ba8	ACTIVO	Activo	Item clasificado como activo	5	t	2026-03-31 22:25:59.501614	2026-03-31 22:25:59.501614	\N	\N
0c27081b-6282-4065-8140-3928ae9bda7b	OTRO	Otro	Naturaleza no contemplada en categorías estándar	6	t	2026-03-31 22:25:59.501614	2026-03-31 22:25:59.501614	\N	\N
\.


--
-- TOC entry 5717 (class 0 OID 99453)
-- Dependencies: 354
-- Data for Name: nota_credito; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nota_credito (id_nota_credito, id_empresa, numero_nota, tipo_nota, id_tercero, id_factura, fecha_nota, motivo, subtotal, total_impuestos, total_descuentos, total_nota, estado, id_asiento_contable, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5718 (class 0 OID 99488)
-- Dependencies: 355
-- Data for Name: nota_credito_linea; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nota_credito_linea (id_nota_credito_linea, id_nota_credito, id_item, descripcion, cantidad, precio_unitario, descuento_porcentaje, descuento_valor, subtotal, orden, created_at) FROM stdin;
\.


--
-- TOC entry 5710 (class 0 OID 99260)
-- Dependencies: 347
-- Data for Name: pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pago (id_pago, id_empresa, numero_pago, tipo_pago, id_tercero, id_cuenta_bancaria, fecha_pago, monto, id_moneda, tipo_cambio, concepto, estado, id_asiento_contable, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5711 (class 0 OID 99299)
-- Dependencies: 348
-- Data for Name: pago_factura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pago_factura (id_pago_factura, id_pago, id_factura, monto_aplicado, created_at) FROM stdin;
\.


--
-- TOC entry 5656 (class 0 OID 18525)
-- Dependencies: 293
-- Data for Name: pais; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pais (id_pais, nombre, codigo_iso, icono) FROM stdin;
6e5e954a-b204-4867-b5c9-7394131de6a5	Argentina	AR	🇦🇷
04d8b769-aef5-48dd-acc3-7b3aee73772f	Bolivia	BO	🇧🇴
2c15d931-1b3b-4168-9117-60d7a1190ca6	Brasil	BR	🇧🇷
0f7f7f73-7f7f-40c1-a5f4-c980c6479f6e	Chile	CL	🇨🇱
f4ba6b7e-31ad-4c77-b10b-898b26af42da	Colombia	CO	🇨🇴
7653c16e-0a9f-4d72-a9a8-191d851ab132	Costa Rica	CR	🇨🇷
cd04f713-5ad1-4cbf-944c-b02e30d66693	Cuba	CU	🇨🇺
d4882144-caf7-46e8-8f72-4378a29a7ff7	Ecuador	EC	🇪🇨
a174e9c7-c895-4544-af5c-68a44d5c0ea3	El Salvador	SV	🇸🇻
5673c2fb-f478-4822-842d-3c6539250a00	Guatemala	GT	🇬🇹
a9a63de7-3b67-4245-8204-7c12c372f842	Honduras	HN	🇭🇳
f358998f-43ee-4a51-a1b1-37efdf94dbe1	México	MX	🇲🇽
bf2d1f67-30ed-41f0-9d75-6a57c5134abc	Nicaragua	NI	🇳🇮
0d3ddf6c-eb05-4eef-a5c7-2bc1df4a1240	Panamá	PA	🇵🇦
1930cc1e-9fea-4f06-a74d-1613bd760597	Paraguay	PY	🇵🇾
7959dfe7-adc5-4102-8ab4-88ae2c00eea5	Perú	PE	🇵🇪
d2cc448d-7750-47c6-aa51-ff5de6163c28	República Dominicana	DO	🇩🇴
fff6e950-8f52-4ec0-ae3c-bb4cbc7d0562	Uruguay	UY	🇺🇾
222d2fd1-0134-4c8f-9c04-7ce73cb7ebf6	Venezuela	VE	🇻🇪
a833bad6-6187-4a9b-95f8-791e9f8f3e1a	España	ES	🇪🇸
b8885141-965e-4e20-9ba8-54bf8734f9ea	Estados Unidos	US	🇺🇸
8c592191-b013-4cef-8f3a-a9e6b60fa996	Narnia	NA	NA
\.


--
-- TOC entry 5649 (class 0 OID 17331)
-- Dependencies: 286
-- Data for Name: perfil; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.perfil (id_perfil, nombre, descripcion, estado, id_empresa) FROM stdin;
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	admin	Informacion principal	t	d2600c4c-2ce7-4d01-b6e8-82f028e69d27
f01b40e3-758f-4883-b834-09a5328a06b1	identidad	Identidad	t	d2600c4c-2ce7-4d01-b6e8-82f028e69d27
f9aa29e1-0839-4e4f-9857-af401aad55b8	identidad 3	identidad 12	t	d2600c4c-2ce7-4d01-b6e8-82f028e69d27
33dcb3d5-b912-4d65-9687-f8108a2f13f4	identidad	identidad	t	fc59e203-237f-408b-8737-fe54dcf10dc1
9d23e1c4-06ef-4388-88c5-4cf406a03539	empresa	pcalzado	t	0459fe04-163b-4b89-b98a-0f1179b7224c
\.


--
-- TOC entry 5676 (class 0 OID 46549)
-- Dependencies: 313
-- Data for Name: perfil_menu_permiso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.perfil_menu_permiso (id_perfil, id_item, permitido) FROM stdin;
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	4269c173-112e-4592-9bf7-3496a68fd84a	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	96e04604-7f3a-40ee-bf8b-f38cecef88bd	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	9a0875dc-169e-415c-9af2-f5ba8771ddc0	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	36d76733-ce00-4440-9b20-14d1188a609a	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	9e584be7-2985-42ef-baaa-34eb0caac15d	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	99c59281-5e4a-4c21-8591-9aa8e5f2bad8	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	4b162e6d-8236-4a66-91e4-a0a5195468e5	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	32862719-ca23-49a5-b485-c04ac9c1f32a	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	4f0cfd78-58b5-418f-9471-358d38335c48	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	9c0ed39f-56cd-43b5-8d5b-44c0aa79ddf8	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	875cf7c1-9bb5-4e05-b9da-ed362f8ee0fc	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	72fb941c-cf9b-4ed0-bca8-e32bdcc21d88	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	2cb5ced4-0d07-461f-bfbb-261219e7aa2d	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	cfa65887-2279-4788-a087-e32eccfdad0b	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	30b280df-a9d3-4384-b2de-98be0c8ffcc0	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	33517997-969a-4db7-969c-8815f30beb29	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	3482cc6f-b16c-416d-96b6-ac4beb47454a	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	19aa9bec-5940-4f3a-97dc-eca4d1cd3fcb	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	ed1a3169-f31f-4474-a464-6819ee7efc55	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	0a955801-d641-46e0-93d9-e2a5b5d75a72	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	1cde0306-79f4-479e-ad46-63ff83e1ac62	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	fe802f5b-6cfc-41d2-a097-cbfb0e835e79	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	6f7a8b9c-0d1e-4234-f567-890123456789	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	9a0b1c2d-3e4f-4567-a890-123456789012	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	3a4b5c6d-7e8f-4901-a234-567890123456	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	1e2f3a4b-5c6d-4789-e012-345678901234	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	c3d4e5f6-a7b8-4901-c234-567890123456	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	4b5c6d7e-8f9a-4012-b345-678901234567	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	d4e5f6a7-b8c9-4012-d345-678901234567	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	4d5e6f7a-8b9c-4012-d345-678901234567	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	8f9a0b1c-2d3e-4456-f789-012345678901	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	0d1e2f3a-4b5c-4678-d901-234567890123	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	9c0d1e2f-3a4b-4567-c890-123456789012	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	e5f6a7b8-c9d0-4123-e456-789012345678	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	0b1c2d3e-4f5a-4678-b901-234567890123	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	a1b2c3d4-e5f6-4789-a012-345678901234	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	5e6f7a8b-9c0d-4123-e456-789012345678	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	f6a7b8c9-d0e1-4234-f567-890123456789	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	a7b8c9d0-e1f2-4345-a678-901234567890	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	b8c9d0e1-f2a3-4456-b789-012345678901	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	c9d0e1f2-a3b4-4567-c890-123456789012	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	1a2b3c4d-5e6f-4789-a012-345678901234	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	2b3c4d5e-6f7a-4890-b123-456789012345	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	5c6d7e8f-9a0b-4123-c456-789012345678	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	b2c3d4e5-f6a7-4890-b123-456789012345	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	2f3a4b5c-6d7e-4890-f123-456789012345	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	7a8b9c0d-1e2f-4345-a678-901234567890	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	6d7e8f9a-0b1c-4234-d567-890123456789	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	8b9c0d1e-2f3a-4456-b789-012345678901	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	1c2d3e4f-5a6b-4789-c012-345678901234	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	7e8f9a0b-1c2d-4345-e678-901234567890	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	3c4d5e6f-7a8b-4901-c234-567890123456	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	1f3e2639-695e-4f31-aa9a-196c9b4d66c5	t
f01b40e3-758f-4883-b834-09a5328a06b1	1f3e2639-695e-4f31-aa9a-196c9b4d66c5	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	1f3e2639-695e-4f31-aa9a-196c9b4d66c5	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	1f3e2639-695e-4f31-aa9a-196c9b4d66c5	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	6c172e97-eb8f-4b84-ae5b-52c07a318036	t
f01b40e3-758f-4883-b834-09a5328a06b1	6c172e97-eb8f-4b84-ae5b-52c07a318036	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	6c172e97-eb8f-4b84-ae5b-52c07a318036	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	6c172e97-eb8f-4b84-ae5b-52c07a318036	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	c2e44066-dba7-4130-9336-8e8852200285	t
f01b40e3-758f-4883-b834-09a5328a06b1	c2e44066-dba7-4130-9336-8e8852200285	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	c2e44066-dba7-4130-9336-8e8852200285	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	c2e44066-dba7-4130-9336-8e8852200285	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	48b8c5d4-0924-4c3e-9bfc-ba9c17ec38b9	t
f01b40e3-758f-4883-b834-09a5328a06b1	48b8c5d4-0924-4c3e-9bfc-ba9c17ec38b9	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	48b8c5d4-0924-4c3e-9bfc-ba9c17ec38b9	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	48b8c5d4-0924-4c3e-9bfc-ba9c17ec38b9	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	b600dc21-712b-4b77-a351-1f735b04bf74	t
f01b40e3-758f-4883-b834-09a5328a06b1	b600dc21-712b-4b77-a351-1f735b04bf74	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	b600dc21-712b-4b77-a351-1f735b04bf74	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	b600dc21-712b-4b77-a351-1f735b04bf74	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	c0366ada-b7f2-4055-bd11-12e5472236d9	t
f01b40e3-758f-4883-b834-09a5328a06b1	c0366ada-b7f2-4055-bd11-12e5472236d9	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	c0366ada-b7f2-4055-bd11-12e5472236d9	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	c0366ada-b7f2-4055-bd11-12e5472236d9	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	3879f6d6-09a6-49d1-b7a6-3773f917af63	t
f01b40e3-758f-4883-b834-09a5328a06b1	3879f6d6-09a6-49d1-b7a6-3773f917af63	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	3879f6d6-09a6-49d1-b7a6-3773f917af63	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	3879f6d6-09a6-49d1-b7a6-3773f917af63	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	a950f4b3-1f27-4207-b8b2-14f7a51cf77e	t
f01b40e3-758f-4883-b834-09a5328a06b1	a950f4b3-1f27-4207-b8b2-14f7a51cf77e	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	a950f4b3-1f27-4207-b8b2-14f7a51cf77e	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	a950f4b3-1f27-4207-b8b2-14f7a51cf77e	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	9ec098de-73e2-4a19-8561-21477a00b51e	t
f01b40e3-758f-4883-b834-09a5328a06b1	9ec098de-73e2-4a19-8561-21477a00b51e	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	9ec098de-73e2-4a19-8561-21477a00b51e	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	9ec098de-73e2-4a19-8561-21477a00b51e	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	7160c8d3-608d-4a68-81df-97db79e2fcc8	t
f01b40e3-758f-4883-b834-09a5328a06b1	7160c8d3-608d-4a68-81df-97db79e2fcc8	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	7160c8d3-608d-4a68-81df-97db79e2fcc8	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	7160c8d3-608d-4a68-81df-97db79e2fcc8	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	256c925b-047f-4e22-9ad6-9ab6d793a6dd	t
f01b40e3-758f-4883-b834-09a5328a06b1	256c925b-047f-4e22-9ad6-9ab6d793a6dd	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	256c925b-047f-4e22-9ad6-9ab6d793a6dd	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	256c925b-047f-4e22-9ad6-9ab6d793a6dd	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	a2b55cd2-1b16-40a9-b865-f712024f416b	t
f01b40e3-758f-4883-b834-09a5328a06b1	a2b55cd2-1b16-40a9-b865-f712024f416b	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	a2b55cd2-1b16-40a9-b865-f712024f416b	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	a2b55cd2-1b16-40a9-b865-f712024f416b	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	fa134b10-2361-4947-a63a-3fce0c83e3c8	t
f01b40e3-758f-4883-b834-09a5328a06b1	fa134b10-2361-4947-a63a-3fce0c83e3c8	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	fa134b10-2361-4947-a63a-3fce0c83e3c8	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	fa134b10-2361-4947-a63a-3fce0c83e3c8	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	7fb39208-14be-49fe-8604-94822ddc6e69	t
f01b40e3-758f-4883-b834-09a5328a06b1	7fb39208-14be-49fe-8604-94822ddc6e69	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	7fb39208-14be-49fe-8604-94822ddc6e69	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	7fb39208-14be-49fe-8604-94822ddc6e69	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	85857b4d-4803-4e29-bb77-572762a75784	t
f01b40e3-758f-4883-b834-09a5328a06b1	85857b4d-4803-4e29-bb77-572762a75784	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	85857b4d-4803-4e29-bb77-572762a75784	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	85857b4d-4803-4e29-bb77-572762a75784	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	635bdea0-6e7c-42c8-9458-2b36b6db95a9	t
f01b40e3-758f-4883-b834-09a5328a06b1	635bdea0-6e7c-42c8-9458-2b36b6db95a9	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	635bdea0-6e7c-42c8-9458-2b36b6db95a9	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	635bdea0-6e7c-42c8-9458-2b36b6db95a9	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	23b3b5c5-7839-437d-b1bd-bad101a1d58a	t
f01b40e3-758f-4883-b834-09a5328a06b1	23b3b5c5-7839-437d-b1bd-bad101a1d58a	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	23b3b5c5-7839-437d-b1bd-bad101a1d58a	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	23b3b5c5-7839-437d-b1bd-bad101a1d58a	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	2ca11b3c-01cb-4889-a52d-f1531d847987	t
f01b40e3-758f-4883-b834-09a5328a06b1	2ca11b3c-01cb-4889-a52d-f1531d847987	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	2ca11b3c-01cb-4889-a52d-f1531d847987	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	2ca11b3c-01cb-4889-a52d-f1531d847987	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	cbc77553-869e-4cb4-922d-4fcaceec4c09	t
f01b40e3-758f-4883-b834-09a5328a06b1	cbc77553-869e-4cb4-922d-4fcaceec4c09	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	cbc77553-869e-4cb4-922d-4fcaceec4c09	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	cbc77553-869e-4cb4-922d-4fcaceec4c09	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	7cb096d5-a81e-4a73-bcf9-ca46b97200d5	t
f01b40e3-758f-4883-b834-09a5328a06b1	7cb096d5-a81e-4a73-bcf9-ca46b97200d5	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	7cb096d5-a81e-4a73-bcf9-ca46b97200d5	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	7cb096d5-a81e-4a73-bcf9-ca46b97200d5	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	f129bae2-2dee-4ed8-ad4f-0a44a79e9208	t
f01b40e3-758f-4883-b834-09a5328a06b1	f129bae2-2dee-4ed8-ad4f-0a44a79e9208	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	f129bae2-2dee-4ed8-ad4f-0a44a79e9208	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	f129bae2-2dee-4ed8-ad4f-0a44a79e9208	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	b235549c-598a-4978-99c2-d54b407574c2	t
f01b40e3-758f-4883-b834-09a5328a06b1	b235549c-598a-4978-99c2-d54b407574c2	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	b235549c-598a-4978-99c2-d54b407574c2	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	b235549c-598a-4978-99c2-d54b407574c2	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	7210dcb8-99cf-449a-a263-c5e43043fee2	t
f01b40e3-758f-4883-b834-09a5328a06b1	7210dcb8-99cf-449a-a263-c5e43043fee2	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	7210dcb8-99cf-449a-a263-c5e43043fee2	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	7210dcb8-99cf-449a-a263-c5e43043fee2	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	0f59572e-70bc-4d62-b620-548d48b1bc2c	t
f01b40e3-758f-4883-b834-09a5328a06b1	0f59572e-70bc-4d62-b620-548d48b1bc2c	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	0f59572e-70bc-4d62-b620-548d48b1bc2c	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	0f59572e-70bc-4d62-b620-548d48b1bc2c	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	b4386f81-5805-47a0-b399-c529064fd985	t
f01b40e3-758f-4883-b834-09a5328a06b1	b4386f81-5805-47a0-b399-c529064fd985	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	b4386f81-5805-47a0-b399-c529064fd985	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	b4386f81-5805-47a0-b399-c529064fd985	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	21d1b917-dfa0-4f55-9ce6-646da9a48015	t
f01b40e3-758f-4883-b834-09a5328a06b1	21d1b917-dfa0-4f55-9ce6-646da9a48015	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	21d1b917-dfa0-4f55-9ce6-646da9a48015	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	21d1b917-dfa0-4f55-9ce6-646da9a48015	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	4a6658ae-fd4f-4243-a2f4-26a74a8e78a6	t
f01b40e3-758f-4883-b834-09a5328a06b1	4a6658ae-fd4f-4243-a2f4-26a74a8e78a6	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	4a6658ae-fd4f-4243-a2f4-26a74a8e78a6	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	4a6658ae-fd4f-4243-a2f4-26a74a8e78a6	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	d20eb542-4e86-4791-9012-d5a2b27083a1	t
f01b40e3-758f-4883-b834-09a5328a06b1	d20eb542-4e86-4791-9012-d5a2b27083a1	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	d20eb542-4e86-4791-9012-d5a2b27083a1	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	d20eb542-4e86-4791-9012-d5a2b27083a1	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	93c7b03b-aa74-42fc-9fa3-5ca59a6b0d63	t
f01b40e3-758f-4883-b834-09a5328a06b1	93c7b03b-aa74-42fc-9fa3-5ca59a6b0d63	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	93c7b03b-aa74-42fc-9fa3-5ca59a6b0d63	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	93c7b03b-aa74-42fc-9fa3-5ca59a6b0d63	t
19a7e082-266e-4865-a7c5-abe4ca9cbeb7	e4f5f708-ac28-499c-a88c-691f9a66772c	t
f01b40e3-758f-4883-b834-09a5328a06b1	e4f5f708-ac28-499c-a88c-691f9a66772c	t
f9aa29e1-0839-4e4f-9857-af401aad55b8	e4f5f708-ac28-499c-a88c-691f9a66772c	t
33dcb3d5-b912-4d65-9687-f8108a2f13f4	e4f5f708-ac28-499c-a88c-691f9a66772c	t
\.


--
-- TOC entry 5684 (class 0 OID 93225)
-- Dependencies: 321
-- Data for Name: periodo_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.periodo_contable (id_periodo_contable, id_empresa, "año", mes, fecha_inicio, fecha_fin, estado, fecha_cierre, id_usuario_cierre, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5682 (class 0 OID 93179)
-- Dependencies: 319
-- Data for Name: plan_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_contable (id_plan_contable, id_empresa, id_modelo_plan_contable, nombre, descripcion, estado, created_at, updated_at) FROM stdin;
98f6c564-40e9-49a3-9fa0-3c233da86415	fc59e203-237f-408b-8737-fe54dcf10dc1	\N	Plan General	Plan contable inicial	t	2026-02-14 20:28:19.192443	2026-02-14 20:28:19.192443
\.


--
-- TOC entry 5705 (class 0 OID 99129)
-- Dependencies: 342
-- Data for Name: prefactura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prefactura (id_prefactura, id_empresa, numero_prefactura, id_cotizacion, id_tercero, fecha_prefactura, fecha_vencimiento, subtotal, total_impuestos, total_descuentos, total_prefactura, estado, observaciones, id_factura, id_usuario_creacion, id_usuario_aprobacion, fecha_aprobacion, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5708 (class 0 OID 99220)
-- Dependencies: 345
-- Data for Name: prefactura_factura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prefactura_factura (id_prefactura_factura, id_prefactura, id_factura, porcentaje_utilizado, created_at) FROM stdin;
\.


--
-- TOC entry 5706 (class 0 OID 99174)
-- Dependencies: 343
-- Data for Name: prefactura_linea; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prefactura_linea (id_prefactura_linea, id_prefactura, id_cotizacion_linea, id_item, descripcion, cantidad, precio_unitario, descuento_porcentaje, descuento_valor, subtotal, orden, created_at) FROM stdin;
\.


--
-- TOC entry 5715 (class 0 OID 99404)
-- Dependencies: 352
-- Data for Name: presupuesto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.presupuesto (id_presupuesto, id_empresa, numero_presupuesto, id_tercero, fecha_presupuesto, fecha_vencimiento, subtotal, total_impuestos, total_descuentos, total_presupuesto, estado, id_factura, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5716 (class 0 OID 99432)
-- Dependencies: 353
-- Data for Name: presupuesto_linea; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.presupuesto_linea (id_presupuesto_linea, id_presupuesto, id_item, descripcion, cantidad, precio_unitario, descuento_porcentaje, descuento_valor, subtotal, orden, created_at) FROM stdin;
\.


--
-- TOC entry 5657 (class 0 OID 18549)
-- Dependencies: 294
-- Data for Name: provincia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.provincia (id_provincia, id_pais, nombre) FROM stdin;
398f17a5-72a4-4252-a499-6c8f3d28e477	d4882144-caf7-46e8-8f72-4378a29a7ff7	Azuay
29ea3fbc-c4d2-4de2-9841-e124bdf4a6c2	d4882144-caf7-46e8-8f72-4378a29a7ff7	Bolívar
53bdf39f-3477-4604-8cdb-542cab32fc5e	d4882144-caf7-46e8-8f72-4378a29a7ff7	Cañar
9bf50026-6a5b-4681-a4b3-a8920b9d5e6e	d4882144-caf7-46e8-8f72-4378a29a7ff7	Carchi
e79fa3a5-fd6d-4310-a878-93d48740d9bd	d4882144-caf7-46e8-8f72-4378a29a7ff7	Chimborazo
f4b324c8-692c-40df-9d0f-f4f461f0d089	d4882144-caf7-46e8-8f72-4378a29a7ff7	Cotopaxi
93f88cf4-97d0-4176-befc-e543c498cf56	d4882144-caf7-46e8-8f72-4378a29a7ff7	El Oro
8f872ac4-3310-418a-a547-1f7bd0ae5c68	d4882144-caf7-46e8-8f72-4378a29a7ff7	Esmeraldas
417bb591-0d0c-4cc0-b46d-34707a6c0e76	d4882144-caf7-46e8-8f72-4378a29a7ff7	Galápagos
a5cdcac2-b3e1-4a24-b4a1-3244ee3d00a6	d4882144-caf7-46e8-8f72-4378a29a7ff7	Guayas
ee3b256f-1c8c-49a5-af08-6a7e7f5c89d1	d4882144-caf7-46e8-8f72-4378a29a7ff7	Imbabura
cda4a524-d603-4610-9e95-83b1ec9a089c	d4882144-caf7-46e8-8f72-4378a29a7ff7	Loja
7f1bae07-89b4-4c2d-bccf-250a6aa6be9c	d4882144-caf7-46e8-8f72-4378a29a7ff7	Los Ríos
74ff3271-d09e-4e23-9914-ba02df52b5aa	d4882144-caf7-46e8-8f72-4378a29a7ff7	Manabí
8d30a2f3-863c-47e6-b143-5fc24f21e633	d4882144-caf7-46e8-8f72-4378a29a7ff7	Morona-Santiago
b327ea41-b26a-4021-8fd7-c81d2b725390	d4882144-caf7-46e8-8f72-4378a29a7ff7	Napo
ea6e3298-8dde-4e2a-add1-dc0bb51dcd92	d4882144-caf7-46e8-8f72-4378a29a7ff7	Orellana
4a8e0b7b-4879-4f14-bab8-4a52982a4935	d4882144-caf7-46e8-8f72-4378a29a7ff7	Pastaza
6ba10a47-2a4c-4b40-82ef-3858753878ab	d4882144-caf7-46e8-8f72-4378a29a7ff7	Pichincha
eb36ed5d-5646-4ed1-ae6c-5465f0893d1b	d4882144-caf7-46e8-8f72-4378a29a7ff7	Santa Elena
50c816ae-b795-4284-8eaa-be47dde3aa5a	d4882144-caf7-46e8-8f72-4378a29a7ff7	Santo Domingo de los Tsáchilas
f20ddbd1-d574-4cd4-8cfa-912470b41672	d4882144-caf7-46e8-8f72-4378a29a7ff7	Sucumbíos
4c54ca96-7938-42c4-b69a-4c4143a9769a	d4882144-caf7-46e8-8f72-4378a29a7ff7	Tungurahua
0c360f82-39c7-40b4-a482-8858411f6258	d4882144-caf7-46e8-8f72-4378a29a7ff7	Zamora Chinchipe
a52aceee-1942-44da-a914-f2887f606292	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Madrid
82dfc0dc-ec06-442b-92a6-b4d36b7987d4	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Barcelona
53ff5c44-3aac-4b78-89f3-bcadc3b3f6e2	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Valencia
69fa5cb3-ea1a-4d99-8509-e28b82a7316e	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Sevilla
37190c0a-b082-4937-95e1-20fb4047c905	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Zaragoza
061cbf08-d299-45e2-9fc0-26ac8e881645	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Málaga
df5d0429-cb6a-4244-99fc-720d9d25e8d9	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Murcia
6bab7758-4e1a-4511-bafe-896af8696993	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Palma
465bcb73-bca6-4e8c-86b1-ef838465d6b1	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Las Palmas
820904ff-4fd2-480d-89c4-59846c6b2b2a	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Bilbao
96072a04-3089-4aa0-afb1-3f6c678637c8	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Alicante
c3d65036-3ca1-4eb3-ac96-ada42fca652d	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Córdoba
beab11fa-1009-4554-9846-ef459c5b3a21	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Valladolid
a5599211-30d1-40dd-a574-3f2b6ee54e5e	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Vigo
a26eca8e-b946-4c18-91a5-c6a4ed8cc53e	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Gijón
c1c0718d-f28f-4fdb-8cf3-76d85e88341a	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	L'Hospitalet de Llobregat
7b61e8d6-8bfa-4c6a-ada5-02d6a470cfb9	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	A Coruña
b00cf5e9-2dad-435d-b5e4-0b22244a4cf8	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Vitoria-Gasteiz
6609525e-cd4f-4dce-afdb-d61997e2e6a5	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Granada
ac7cf2d5-4779-448c-8ed1-736d1d43a22b	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Elche
d29921e5-a5d8-4d59-9c79-935492a7ad2e	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Tarrasa
f8e905b9-c1c1-46cd-b1fd-7fa9868a41ac	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Badalona
f96e23bc-56e5-4fee-933b-9da664810153	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Oviedo
0edcb0bc-12b6-4080-ba76-120ab154b05f	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Cartagena
5f78cefc-a683-486f-b47a-62536f99e131	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Jerez de la Frontera
72e403cd-e058-428e-920b-a9e367b2196d	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Sabadell
5939aa1b-a931-4610-87b7-e4378d95a887	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Móstoles
076992c1-3d20-4d8b-88eb-eb3069d43477	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Alcalá de Henares
be3cf0f8-4222-40fb-88f1-397a6e6806f1	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Pamplona
417a8547-7568-4d78-a299-1b912d3458f3	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Fuenlabrada
f653eb18-9edb-4ef8-be48-af8a0ee517d0	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Almería
f20dac1d-9d2c-4f40-820a-e2d757c3f51e	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	San Sebastián
53f7a112-a04c-4176-928a-6edc78b1d3d2	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Leganés
7f72e3d2-7c1d-4f71-89f4-fd0d737c09e4	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Santander
be9a2a80-0ffe-4716-842b-ed7f58d459d4	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Castellón de la Plana
2d6a2f26-8d7d-40db-8ce8-d5bc3d19e611	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Burgos
7326139e-d7cd-4361-9a1e-e4c707602267	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Albacete
94379e08-054a-4da2-b8f0-a0ebabdec7b9	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Alcorcón
dcd97644-cca1-41f4-be5d-8aa3224c9bdd	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Getafe
dc8eca63-ac88-4a55-a499-defcec2f0420	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Salamanca
2543f4b4-3080-4000-92c1-27cb61908aa0	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Logroño
c443525b-3b4e-4652-9c18-c37ae83553d2	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Huelva
fc4ff74e-1c99-44ba-a3fe-5e5e131186a1	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Marbella
1c472c9d-4dcd-4721-9341-9f65c3f37fa1	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Lleida
59108579-0dc5-4930-8a45-e33d246ccfeb	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Tarragona
3d321e1e-bd36-4b8a-93e6-c75d162683fd	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	León
6f2787e9-b1d9-4b14-8d88-b332c418d03d	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Cádiz
48b8abff-f204-4917-95c0-01bc19e0fb55	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Jaén
e77778a7-dc99-4131-bd4e-5bcf32a5ab98	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Girona
07389be0-3182-4ba4-b678-10a807d7ed78	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Lugo
cc2259c5-30cd-4695-8dab-2240277b0863	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Cáceres
403c510b-4383-4bc0-ac28-5ec3674e36fe	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Toledo
ac97ae42-45df-45fc-ae73-60d6646c9c1a	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Ceuta
378f7c77-e4c0-498d-895e-5a2cabe171f5	a833bad6-6187-4a9b-95f8-791e9f8f3e1a	Melilla
\.


--
-- TOC entry 5747 (class 0 OID 221138)
-- Dependencies: 384
-- Data for Name: recepcion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recepcion (id_recepcion, id_empresa, recepcion_ref, id_tercero, ref_proveedor, poblacion, codigo_postal, fecha_prevista_entrega, fecha_recepcion, estado_recepcion, facturado, modulo_origen, id_origen, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5748 (class 0 OID 221156)
-- Dependencies: 385
-- Data for Name: recepcion_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recepcion_detalle (id_recepcion_detalle, id_recepcion, id_item, id_almacen, id_lote_serie, cantidad, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5719 (class 0 OID 99509)
-- Dependencies: 356
-- Data for Name: retencion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.retencion (id_retencion, id_empresa, tipo_retencion, porcentaje, base_retencion, valor_retencion, id_tercero, id_documento_origen, tipo_documento_origen, fecha_retencion, numero_certificado, estado, id_asiento_contable, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5766 (class 0 OID 240554)
-- Dependencies: 403
-- Data for Name: rol_socio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol_socio (id_rol_socio, nombre, descripcion, estado, created_at, updated_at) FROM stdin;
c111c540-c674-46a6-bf90-9d322e3bf0ec	acreedor	acrede	t	2026-04-20 21:09:13.046794	2026-04-20 21:09:13.046794
def10326-da01-465a-a334-f23c9a19011e	accionista	tine parte en	t	2026-04-20 21:09:58.777146	2026-04-20 21:09:58.777146
de39ad15-3f8c-4d97-9623-c688e2cfaa64	colaborador	colabora	t	2026-04-20 21:33:59.483098	2026-04-20 21:33:59.483098
\.


--
-- TOC entry 5698 (class 0 OID 98942)
-- Dependencies: 335
-- Data for Name: saldo_cuenta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.saldo_cuenta (id_saldo_cuenta, id_empresa, id_cuenta_contable, id_periodo_contable, saldo_debe, saldo_haber, saldo_final, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5734 (class 0 OID 216424)
-- Dependencies: 371
-- Data for Name: secuencia_asiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.secuencia_asiento (id, empresa_id, prefijo_diario, anio, mes, valor_actual, updated_at) FROM stdin;
\.


--
-- TOC entry 5661 (class 0 OID 18612)
-- Dependencies: 298
-- Data for Name: social_network; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.social_network (id_red_social, nombre, icono, orden) FROM stdin;
9093b9fd-3126-40a9-9442-dcde643de88d	Facebook	📘	1
6f5b5be2-9df2-430d-9471-21f0b6085324	Twitter	🐦	2
4fae1e3a-333b-4d68-9ce1-f43c115ef0c7	Instagram	📷	3
d8e622c8-eda4-44a8-8a81-46cd163e4802	LinkedIn	💼	4
9440b9f8-4f0c-4a73-a98e-d89ece54f801	YouTube	📺	5
4c88db94-2f97-4745-9a20-754c43bc2db4	TikTok	🎵	6
80514641-0047-4351-97d0-e2b300c94b52	WhatsApp	💬	7
3940b19e-522b-437e-8e5e-2ec672a12fb1	Telegram	📡	8
a32669ca-fbf7-40c4-927f-2d4c27b749b0	Discord	🎮	9
5309947e-4cbf-495e-b47d-4fb4501d1735	Twitch	🎥	10
\.


--
-- TOC entry 5767 (class 0 OID 240565)
-- Dependencies: 404
-- Data for Name: socio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.socio (id_socio, id_rol_socio, fecha_inicio, fecha_fin, estado, created_by, updated_by, created_at, updated_at) FROM stdin;
dd617d97-6025-4f54-99f2-d5aa5ccb0ef2	de39ad15-3f8c-4d97-9623-c688e2cfaa64	2026-04-23	2026-04-27	t	674ab9f4-f3a1-4a55-8aff-7065c66b6133	674ab9f4-f3a1-4a55-8aff-7065c66b6133	2026-04-22 15:57:20.909747	2026-04-22 15:57:40.523563
78d1a390-f470-4fb4-9173-20107f0748f3	c111c540-c674-46a6-bf90-9d322e3bf0ec	2026-04-24	2026-04-29	t	674ab9f4-f3a1-4a55-8aff-7065c66b6133	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-04-22 15:32:10.421049	2026-04-23 23:22:56.959819
28b337c0-688e-4981-a779-fe8929904ba6	de39ad15-3f8c-4d97-9623-c688e2cfaa64	2026-04-24	2026-04-27	t	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-04-22 15:33:19.269642	2026-04-23 23:26:13.473894
e9f8f5d8-cc50-4084-b8cf-d8cba83dfb8d	c111c540-c674-46a6-bf90-9d322e3bf0ec	2026-04-23	2026-04-24	t	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-04-23 23:28:07.197307	2026-04-23 23:28:07.197307
d5282d57-9d5d-4e4a-b3d0-2687707a6c61	def10326-da01-465a-a334-f23c9a19011e	2026-04-23	2026-04-28	t	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	674ab9f4-f3a1-4a55-8aff-7065c66b6133	2026-04-23 23:29:07.518329	2026-04-23 23:30:13.680523
11d9d3f2-6b5e-4b12-99e9-00cb27b07530	def10326-da01-465a-a334-f23c9a19011e	2026-04-24	2026-04-27	t	674ab9f4-f3a1-4a55-8aff-7065c66b6133	674ab9f4-f3a1-4a55-8aff-7065c66b6133	2026-04-23 23:30:43.220065	2026-04-23 23:30:43.220065
\.


--
-- TOC entry 5768 (class 0 OID 240579)
-- Dependencies: 405
-- Data for Name: socio_tercero; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.socio_tercero (id, id_socio, id_tercero, created_at, updated_at) FROM stdin;
11546d5a-3b90-4c24-8b18-9179b1c5e20b	dd617d97-6025-4f54-99f2-d5aa5ccb0ef2	c1eebef1-965a-4820-8c5a-ca8adcd62b62	2026-04-22 15:57:40.523563	2026-04-22 15:57:40.523563
a45f970d-725f-46ae-a664-ccd3f3c9c0ab	dd617d97-6025-4f54-99f2-d5aa5ccb0ef2	cc29aab7-9c5e-48ff-983b-c701a04f8f93	2026-04-22 15:57:40.523563	2026-04-22 15:57:40.523563
c25372b9-3d10-47b5-9f9a-2df7f7c5fd86	78d1a390-f470-4fb4-9173-20107f0748f3	b8d6e457-6864-4f15-bda7-aa880a57aeaa	2026-04-23 23:22:56.959819	2026-04-23 23:22:56.959819
6888202e-80b7-42fc-b630-ad3b3143bfb6	78d1a390-f470-4fb4-9173-20107f0748f3	890e25c5-991f-4cbc-8150-a997d2640613	2026-04-23 23:22:56.959819	2026-04-23 23:22:56.959819
f1bdb0a7-a073-49cf-82fe-516380eb642a	78d1a390-f470-4fb4-9173-20107f0748f3	402d23b7-7161-4e2b-a532-80bdcb078d6c	2026-04-23 23:22:56.959819	2026-04-23 23:22:56.959819
6daebcc8-0b04-465c-8f6d-73c288bec3ef	28b337c0-688e-4981-a779-fe8929904ba6	edc9254b-abf1-42a4-a2bd-fa4f0bad4e70	2026-04-23 23:26:13.473894	2026-04-23 23:26:13.473894
879f79df-ca96-4651-8a0e-59f031abddc1	28b337c0-688e-4981-a779-fe8929904ba6	aa75ac23-3dd7-4fe8-878f-a13f8a86fa6a	2026-04-23 23:26:13.473894	2026-04-23 23:26:13.473894
d8047bbd-8718-4400-aa79-7d46989ce480	e9f8f5d8-cc50-4084-b8cf-d8cba83dfb8d	2d68f336-6cc5-469f-a871-56b9a40aa363	2026-04-23 23:28:07.197307	2026-04-23 23:28:07.197307
e8ac9a7a-a9bb-4d5f-a1eb-b5d06f125888	d5282d57-9d5d-4e4a-b3d0-2687707a6c61	606e39fc-229f-40a8-981b-46b6de7f9563	2026-04-23 23:30:13.680523	2026-04-23 23:30:13.680523
4507dcd0-4b84-403a-826d-657b9b8d9f73	d5282d57-9d5d-4e4a-b3d0-2687707a6c61	6353efce-b194-493e-9187-89474f6bb7c2	2026-04-23 23:30:13.680523	2026-04-23 23:30:13.680523
8c701a29-3b7f-4278-af3e-b83f17e2a7a5	11d9d3f2-6b5e-4b12-99e9-00cb27b07530	80a3e5f0-161e-49a3-8efa-8749efa4d30a	2026-04-23 23:30:43.220065	2026-04-23 23:30:43.220065
ef1111ed-dd4e-42ea-ab56-1da59435ea05	11d9d3f2-6b5e-4b12-99e9-00cb27b07530	ebc4e287-1762-485c-8836-63f1ad8f84a1	2026-04-23 23:30:43.220065	2026-04-23 23:30:43.220065
\.


--
-- TOC entry 5739 (class 0 OID 220942)
-- Dependencies: 376
-- Data for Name: stock_item_almacen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_item_almacen (id_stock_producto_almacen, id_empresa, id_item, id_almacen, stock_fisico, stock_reservado, stock_virtual, stock_disponible, stock_alerta, stock_deseado, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5648 (class 0 OID 17280)
-- Dependencies: 285
-- Data for Name: sucursal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sucursal (id_sucursal, id_empresa, nombre, direccion, telefono, estado, created_at, updated_at, codigo_establecimiento) FROM stdin;
da0b18f1-2993-44d3-88fd-fd4de3f27c21	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	Secundaria	Maria de Olvide	042860053	t	2025-08-03 19:55:37.016034	2025-08-03 20:03:26.451279	001
8746bb38-b585-45ec-988f-521dc3f39879	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	Pruebas	Pruebas	0422	t	2025-08-03 20:03:46.012201	2025-08-03 20:03:46.012201	001
83f36679-29fc-4650-a2a2-c6b32d35ce53	31a8bf69-558d-4b00-8fc6-5e2384be09a3	Actualizada1	ACtualizad	999999	t	2025-08-05 02:50:59.385925	2025-08-05 03:17:17.841891	001
4d8a0e43-a2c7-4df1-bede-c325c6d054cc	45fa1728-15ad-485e-ade6-3c2f058e882f	Genie Solutions123	Gate2	280555	t	2025-08-03 20:27:13.709254	2025-08-05 03:17:30.544523	001
\.


--
-- TOC entry 5756 (class 0 OID 223680)
-- Dependencies: 393
-- Data for Name: tamano_empresa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tamano_empresa (id_tamano_empresa, codigo, nombre, descripcion, orden, estado, created_at, updated_at) FROM stdin;
89f79630-2a4c-4fae-83a0-ae55933781e6	S1	1 - 5 empleados	Microempresa	1	t	2026-03-09 20:00:11.300573	\N
56eb21c7-c1e1-4895-a7b5-653fb6e3a851	S2	6 - 10 empleados	Empresa pequeña	2	t	2026-03-09 20:00:11.300573	\N
f63afc77-5866-4ac2-b47f-c99fcf7a9a56	S3	11 - 50 empleados	Empresa pequeña	3	t	2026-03-09 20:00:11.300573	\N
9eb206c2-650f-404d-b857-b5e926c413ef	M1	51 - 100 empleados	Empresa mediana	4	t	2026-03-09 20:00:11.300573	\N
ad0b00ff-8cee-40dd-b635-9e2b584ee468	M2	101 - 500 empleados	Empresa mediana	5	t	2026-03-09 20:00:11.300573	\N
b463a557-547c-4277-b054-df0eddf66eed	L1	Más de 500 empleados	Empresa grande	6	t	2026-03-09 20:00:11.300573	\N
\.


--
-- TOC entry 5669 (class 0 OID 22128)
-- Dependencies: 306
-- Data for Name: tercero; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tercero (id_tercero, id_empresa, cliente_potencial, cliente, proveedor, nombre, apodo, codigo_cliente, direccion, poblacion, codigo_postal, id_pais, telefono, movil, fax, correo, web, id_profesional_1, id_profesional_2, cif_intra, sujeto_iva, capital, id_condicion_pago, id_forma_pago, sede_central, asignado_a, id_tipo_tercero, created_by, updated_by, created_at, updated_at, estado, id_tipo_entidad, id_provincia, codigo_proveedor, id_tamano_empresa) FROM stdin;
606e39fc-229f-40a8-981b-46b6de7f9563	0459fe04-163b-4b89-b98a-0f1179b7224c	f	t	f	sipeComTerceroC	sipeComTerceroC	CU2604-00003	\N	\N	3333	d4882144-caf7-46e8-8f72-4378a29a7ff7	\N	\N	\N	\N	\N	\N	\N	\N	t	670.05	31cf451e-a589-484e-b33d-3bd7d20ec98a	238af3a1-7fcc-458a-84e8-c8f376ac158d	\N	\N	4e8b0eef-0a8e-4534-a066-318bdd065a14	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-04-08 21:17:51.091246	2026-04-08 21:23:47.370023	t	3	a5cdcac2-b3e1-4a24-b4a1-3244ee3d00a6	\N	56eb21c7-c1e1-4895-a7b5-653fb6e3a851
89e049a0-0f6e-4858-b841-91499336892e	0459fe04-163b-4b89-b98a-0f1179b7224c	f	t	f	sipeComTerceroNX	sipeComTerceroNX	CU2604-00010	45 y la entrada	Guayaquil	090104	d4882144-caf7-46e8-8f72-4378a29a7ff7	3456901	5643107341	61426	nanybank2@mail.com	www.nanybank2.com	7413	6140	971	t	200.01	bb5b50be-202f-4e23-a992-c5534c7df39b	4bbbfc13-804d-4a8b-9c53-57e0ef29adb5	\N	\N	4e8b0eef-0a8e-4534-a066-318bdd065a14	674ab9f4-f3a1-4a55-8aff-7065c66b6133	674ab9f4-f3a1-4a55-8aff-7065c66b6133	2026-04-15 02:55:07.42585	2026-04-15 03:49:43.402963	t	5	8f872ac4-3310-418a-a547-1f7bd0ae5c68	\N	89f79630-2a4c-4fae-83a0-ae55933781e6
cc29aab7-9c5e-48ff-983b-c701a04f8f93	0459fe04-163b-4b89-b98a-0f1179b7224c	f	t	f	sipeComTerceroA	sipeComTerceroA	CU2604-00001	\N	\N	1111	d4882144-caf7-46e8-8f72-4378a29a7ff7	\N	\N	\N	\N	\N	\N	\N	\N	t	670.04	31cf451e-a589-484e-b33d-3bd7d20ec98a	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	\N	4e8b0eef-0a8e-4534-a066-318bdd065a14	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-04-08 21:11:09.933473	2026-04-08 21:11:09.933473	t	3	a5cdcac2-b3e1-4a24-b4a1-3244ee3d00a6	\N	56eb21c7-c1e1-4895-a7b5-653fb6e3a851
b8d6e457-6864-4f15-bda7-aa880a57aeaa	0459fe04-163b-4b89-b98a-0f1179b7224c	f	t	f	sipeComTerceroB	sipeComTerceroB	CU2604-00002	\N	\N	2222	d4882144-caf7-46e8-8f72-4378a29a7ff7	\N	\N	\N	\N	\N	\N	\N	\N	t	650.03	31cf451e-a589-484e-b33d-3bd7d20ec98a	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	\N	4e8b0eef-0a8e-4534-a066-318bdd065a14	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-04-08 21:14:14.249386	2026-04-08 21:14:14.249386	t	3	a5cdcac2-b3e1-4a24-b4a1-3244ee3d00a6	\N	89f79630-2a4c-4fae-83a0-ae55933781e6
edc9254b-abf1-42a4-a2bd-fa4f0bad4e70	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	f	t	f	testTerceroA	testTerceroA	CU2604-00001	\N	\N	7640	d4882144-caf7-46e8-8f72-4378a29a7ff7	\N	\N	\N	\N	\N	\N	\N	\N	t	670.02	31cf451e-a589-484e-b33d-3bd7d20ec98a	238af3a1-7fcc-458a-84e8-c8f376ac158d	\N	\N	4e8b0eef-0a8e-4534-a066-318bdd065a14	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-04-10 17:29:29.352041	2026-04-10 17:29:29.352041	t	3	a5cdcac2-b3e1-4a24-b4a1-3244ee3d00a6	\N	89f79630-2a4c-4fae-83a0-ae55933781e6
2d68f336-6cc5-469f-a871-56b9a40aa363	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	f	f	t	testTerWww	testTerWww	CU2604-00003	\N	\N	\N	d4882144-caf7-46e8-8f72-4378a29a7ff7	\N	\N	\N	\N	\N	\N	\N	\N	t	560.02	464a061b-594d-4883-9d8e-55e735f0ad07	238af3a1-7fcc-458a-84e8-c8f376ac158d	\N	\N	4e8b0eef-0a8e-4534-a066-318bdd065a14	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-04-22 18:06:57.446296	2026-04-22 18:10:15.083285	t	5	a5cdcac2-b3e1-4a24-b4a1-3244ee3d00a6	SU2604-00001	f63afc77-5866-4ac2-b47f-c99fcf7a9a56
0e5ea770-941d-46b1-bc98-904679465874	0459fe04-163b-4b89-b98a-0f1179b7224c	f	t	f	sipeComTerceroX21	sipeComTerceroX21	CU2604-00004	23 y la xxx	guayaquil	1254	d4882144-caf7-46e8-8f72-4378a29a7ff7	1234567	0922524906	8941	seneca@mail.com	www.seneca.com	111	222	915	t	560.04	31cf451e-a589-484e-b33d-3bd7d20ec98a	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	\N	4e8b0eef-0a8e-4534-a066-318bdd065a14	674ab9f4-f3a1-4a55-8aff-7065c66b6133	674ab9f4-f3a1-4a55-8aff-7065c66b6133	2026-04-14 16:07:34.913194	2026-04-14 21:21:41.3282	t	3	a5cdcac2-b3e1-4a24-b4a1-3244ee3d00a6	\N	f63afc77-5866-4ac2-b47f-c99fcf7a9a56
d963e036-bb4a-43e3-8ae2-eed3f62c67ea	0459fe04-163b-4b89-b98a-0f1179b7224c	f	t	f	sipeComTerceroZ	sipeComTerceroZ	CU2604-00009	24 y la wqe \n	Guayaquil	09089	d4882144-caf7-46e8-8f72-4378a29a7ff7	3216725	0971252754	6611	xaxax@mail.com	www.xaxax.com	555166	66621	7091	t	800.03	464a061b-594d-4883-9d8e-55e735f0ad07	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	\N	9f7ee663-d785-4bb2-90f0-f1ebccb7e180	674ab9f4-f3a1-4a55-8aff-7065c66b6133	674ab9f4-f3a1-4a55-8aff-7065c66b6133	2026-04-15 01:41:53.319243	2026-04-15 01:41:53.319243	t	3	f4b324c8-692c-40df-9d0f-f4f461f0d089	\N	9eb206c2-650f-404d-b857-b5e926c413ef
890e25c5-991f-4cbc-8150-a997d2640613	0459fe04-163b-4b89-b98a-0f1179b7224c	f	t	f	sipeClienteA	sipeClienteA	CU2604-00007	27  y uuu	Guayaquil	090104	d4882144-caf7-46e8-8f72-4378a29a7ff7	5432657	098712345	345	iii@mail.com	www.iii.com	4581	11325	99023	t	450.02	31cf451e-a589-484e-b33d-3bd7d20ec98a	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	\N	ab5f5dac-d03c-42b1-92bb-97131765f213	674ab9f4-f3a1-4a55-8aff-7065c66b6133	674ab9f4-f3a1-4a55-8aff-7065c66b6133	2026-04-14 21:24:48.79453	2026-04-15 02:12:29.486044	t	4	53bdf39f-3477-4604-8cdb-542cab32fc5e	\N	f63afc77-5866-4ac2-b47f-c99fcf7a9a56
6353efce-b194-493e-9187-89474f6bb7c2	0459fe04-163b-4b89-b98a-0f1179b7224c	f	t	f	nanicienta	nanicienta	CU2604-00014	la atarazana	guayaquil	1010	d4882144-caf7-46e8-8f72-4378a29a7ff7	1110091	0999991117	90291	nn@mail.com	www.nn.com	267	8093	9980	t	780.01	464a061b-594d-4883-9d8e-55e735f0ad07	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	890e25c5-991f-4cbc-8150-a997d2640613	4e8b0eef-0a8e-4534-a066-318bdd065a14	674ab9f4-f3a1-4a55-8aff-7065c66b6133	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-04-15 18:41:48.005933	2026-04-15 19:26:44.657566	t	3	a5cdcac2-b3e1-4a24-b4a1-3244ee3d00a6	\N	89f79630-2a4c-4fae-83a0-ae55933781e6
f5e16b37-00cd-437a-a352-1af7eb5602b8	0459fe04-163b-4b89-b98a-0f1179b7224c	f	f	t	sipeComProveedorA2	sipeComProveedorA2	CU2604-00005	45 y lacvj	machala	6781	d4882144-caf7-46e8-8f72-4378a29a7ff7	456712	\N	667	aut@mail.com	www.aut.com	653	628	732	t	230.01	31cf451e-a589-484e-b33d-3bd7d20ec98a	26d9fbd8-470d-4c58-8c87-acabb4193b93	\N	\N	4e8b0eef-0a8e-4534-a066-318bdd065a14	674ab9f4-f3a1-4a55-8aff-7065c66b6133	674ab9f4-f3a1-4a55-8aff-7065c66b6133	2026-04-14 17:19:05.08307	2026-04-15 15:53:31.784503	t	3	93f88cf4-97d0-4176-befc-e543c498cf56	SU2604-00001	89f79630-2a4c-4fae-83a0-ae55933781e6
ebc4e287-1762-485c-8836-63f1ad8f84a1	0459fe04-163b-4b89-b98a-0f1179b7224c	f	t	f	sipeComTerceroKira	sipeComTerceroKira	CU2604-00012	17 y la MMM	guayaquil	5470	d4882144-caf7-46e8-8f72-4378a29a7ff7	9862741	1110009977	9021	kira@outlook.com	www.kira.com	2103	8074	1134	t	40.02	31cf451e-a589-484e-b33d-3bd7d20ec98a	238af3a1-7fcc-458a-84e8-c8f376ac158d	\N	\N	4e8b0eef-0a8e-4534-a066-318bdd065a14	674ab9f4-f3a1-4a55-8aff-7065c66b6133	674ab9f4-f3a1-4a55-8aff-7065c66b6133	2026-04-15 04:10:59.232143	2026-04-15 04:18:38.315951	t	3	a5cdcac2-b3e1-4a24-b4a1-3244ee3d00a6	\N	56eb21c7-c1e1-4895-a7b5-653fb6e3a851
b0c39696-09d8-4f9f-9558-2b6a6cd3f50b	0459fe04-163b-4b89-b98a-0f1179b7224c	f	f	t	sipeComTerceroL	sipeComTerceroL	CU2604-00011	45 y la novena	Guayaquil	090142	d4882144-caf7-46e8-8f72-4378a29a7ff7	\N	\N	1114	lll@mail.com	www.lll.com	3091	1143	6671	t	600.01	31cf451e-a589-484e-b33d-3bd7d20ec98a	26d9fbd8-470d-4c58-8c87-acabb4193b93	\N	890e25c5-991f-4cbc-8150-a997d2640613	4e8b0eef-0a8e-4534-a066-318bdd065a14	674ab9f4-f3a1-4a55-8aff-7065c66b6133	674ab9f4-f3a1-4a55-8aff-7065c66b6133	2026-04-15 03:53:44.561262	2026-04-15 15:36:49.831787	t	5	b327ea41-b26a-4021-8fd7-c81d2b725390	SU2604-00002	9eb206c2-650f-404d-b857-b5e926c413ef
402d23b7-7161-4e2b-a532-80bdcb078d6c	0459fe04-163b-4b89-b98a-0f1179b7224c	f	f	t	ucrania	ucrania	CU2604-00015	43 y la oceania	guayaquil	3461	d4882144-caf7-46e8-8f72-4378a29a7ff7	220022	0927724906	5660	josetorrez@mail.com	jo@mail.com	167	920	639	t	500.04	\N	\N	\N	\N	4e8b0eef-0a8e-4534-a066-318bdd065a14	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-04-15 19:30:55.064679	2026-04-15 19:30:55.064679	t	3	a5cdcac2-b3e1-4a24-b4a1-3244ee3d00a6	SU2604-00003	b463a557-547c-4277-b054-df0eddf66eed
c1eebef1-965a-4820-8c5a-ca8adcd62b62	0459fe04-163b-4b89-b98a-0f1179b7224c	t	f	f	sipeComCliPontB	sipeComCliPontB	CU2604-00013	32 y la elevadaxy	guayaquil	9620	d4882144-caf7-46e8-8f72-4378a29a7ff7	1114441111	1230935121	6609	chi@mail.com	www.chi.com	\N	\N	\N	t	100.03	31cf451e-a589-484e-b33d-3bd7d20ec98a	238af3a1-7fcc-458a-84e8-c8f376ac158d	\N	\N	4e8b0eef-0a8e-4534-a066-318bdd065a14	674ab9f4-f3a1-4a55-8aff-7065c66b6133	674ab9f4-f3a1-4a55-8aff-7065c66b6133	2026-04-15 16:41:26.193413	2026-04-15 16:56:02.39712	t	3	e79fa3a5-fd6d-4310-a878-93d48740d9bd	\N	56eb21c7-c1e1-4895-a7b5-653fb6e3a851
e89dc07d-0479-4be5-8d9a-21cf2d5f069c	0459fe04-163b-4b89-b98a-0f1179b7224c	f	t	f	sipeComTerceroZ	sipeComTerceroZ	CU2604-00008	24 y la wqe	Guayaquil	09089	d4882144-caf7-46e8-8f72-4378a29a7ff7	3216725	0971252754	6611	xaxax@mail.com	www.xaxax.com	555166	66621	7091	t	800.03	464a061b-594d-4883-9d8e-55e735f0ad07	4bbbfc13-804d-4a8b-9c53-57e0ef29adb5	\N	\N	9f7ee663-d785-4bb2-90f0-f1ebccb7e180	674ab9f4-f3a1-4a55-8aff-7065c66b6133	674ab9f4-f3a1-4a55-8aff-7065c66b6133	2026-04-15 01:40:54.805902	2026-04-15 15:42:53.115093	t	3	f4b324c8-692c-40df-9d0f-f4f461f0d089	\N	9eb206c2-650f-404d-b857-b5e926c413ef
80a3e5f0-161e-49a3-8efa-8749efa4d30a	0459fe04-163b-4b89-b98a-0f1179b7224c	t	f	f	sipeComTerceroG33	sipeComTerceroG33	CU2604-00006	27 y julio jaramillo	Guayaquil	090104	d4882144-caf7-46e8-8f72-4378a29a7ff7	1234566	807654326	6675	mona2@mail.com	www.mona2.com	51234	65789	451	t	60.02	31cf451e-a589-484e-b33d-3bd7d20ec98a	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	\N	84fe28ca-953e-433c-ad96-0d5a5bcb5b6a	674ab9f4-f3a1-4a55-8aff-7065c66b6133	674ab9f4-f3a1-4a55-8aff-7065c66b6133	2026-04-14 21:18:46.808056	2026-04-15 16:34:45.58636	t	3	e79fa3a5-fd6d-4310-a878-93d48740d9bd	\N	ad0b00ff-8cee-40dd-b635-9e2b584ee468
aa75ac23-3dd7-4fe8-878f-a13f8a86fa6a	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	f	t	f	testXX2	testXX2	CU2604-00002	12 y la triada	guayaquil	6780	d4882144-caf7-46e8-8f72-4378a29a7ff7	6752150	0598761357	652	cxv@mail.com	www.cxv.com	664	321	873	t	560.01	31cf451e-a589-484e-b33d-3bd7d20ec98a	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	\N	4e8b0eef-0a8e-4534-a066-318bdd065a14	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-04-22 15:35:57.613071	2026-04-22 15:35:57.613071	t	3	9bf50026-6a5b-4681-a4b3-a8920b9d5e6e	\N	56eb21c7-c1e1-4895-a7b5-653fb6e3a851
\.


--
-- TOC entry 5722 (class 0 OID 99569)
-- Dependencies: 359
-- Data for Name: tipo_cambio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_cambio (id_tipo_cambio, id_empresa, id_moneda_origen, id_moneda_destino, fecha_cambio, tasa_cambio, created_at) FROM stdin;
\.


--
-- TOC entry 5765 (class 0 OID 238301)
-- Dependencies: 402
-- Data for Name: tipo_comportamiento_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_comportamiento_item (id_tipo_comportamiento, codigo, nombre, descripcion, orden, estado, created_at, updated_at, created_by, updated_by) FROM stdin;
600af782-db6d-4891-a1a3-80b38cf8cbdd	SERVICIO	Servicio	Actividad o prestación no física, sin inventario	1	t	2026-04-07 21:53:26.95428	2026-04-07 21:53:26.95428	\N	\N
d19a3f83-5556-4780-b6fb-295758b93967	SIMPLE	Producto simple	Producto físico simple sin control logístico avanzado	2	t	2026-04-07 21:53:26.95428	2026-04-07 21:53:26.95428	\N	\N
b9902489-b34d-4000-8bc9-b07bb5f8defd	INVENTARIABLE	Producto inventariable	Producto con control de stock e inventario	3	t	2026-04-07 21:53:26.95428	2026-04-07 21:53:26.95428	\N	\N
191eb5ca-8828-48f5-aa3e-906fb3e9978d	PERECIBLE	Producto perecible	Producto con control de caducidad o vencimiento	4	t	2026-04-07 21:53:26.95428	2026-04-07 21:53:26.95428	\N	\N
733b7371-ff35-49ee-8b59-fd3d41becf62	COMBO	Combo o paquete	Conjunto de productos o servicios comercializados como una unidad	5	t	2026-04-07 21:53:26.95428	2026-04-07 21:53:26.95428	\N	\N
457f9c53-1541-4aa6-8841-23a2d0781a36	INSUMO	Materia prima / insumo	Producto base usado para producción o transformación	6	t	2026-04-07 21:53:26.95428	2026-04-07 21:53:26.95428	\N	\N
\.


--
-- TOC entry 5752 (class 0 OID 222443)
-- Dependencies: 389
-- Data for Name: tipo_control_caducidad_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_control_caducidad_item (id_tipo_control_caducidad, codigo, nombre, descripcion, orden, estado, created_at, updated_at, created_by, updated_by) FROM stdin;
f7893727-2d13-4767-b5e1-e36ede53e630	NINGUNA	Ninguna	El item no requiere control de fechas	1	t	2026-03-08 23:08:52.098848	2026-03-08 23:08:52.098848	\N	\N
82bbdeaa-ae76-4f52-b03c-b7a503c2454a	FECHA_LIMITE_VENTA	Fecha límite de venta	El item requiere fecha límite de venta	2	t	2026-03-08 23:08:52.098848	2026-03-08 23:08:52.098848	\N	\N
d6f8b499-db4c-47cb-a8a7-7a9b5ff40323	FECHA_CADUCIDAD	Fecha de caducidad	El item requiere fecha de caducidad	3	t	2026-03-08 23:08:52.098848	2026-03-08 23:08:52.098848	\N	\N
05db11a4-9a7e-405b-aaf5-528b366a451f	AMBAS	Ambas	El item requiere fecha límite de venta y fecha de caducidad	4	t	2026-03-08 23:08:52.098848	2026-03-08 23:08:52.098848	\N	\N
\.


--
-- TOC entry 5763 (class 0 OID 237122)
-- Dependencies: 400
-- Data for Name: tipo_control_inventario_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_control_inventario_item (id_tipo_control_inventario, codigo, nombre, descripcion, orden, estado, created_at, updated_at, created_by, updated_by) FROM stdin;
0e00cbe7-72a2-46fa-a1ed-8320cc62bc58	SIN_CONTROL	Sin control	El item no usa lote ni número de serie	1	t	2026-03-31 21:38:43.434003	2026-03-31 21:38:43.434003	\N	\N
b96439d5-3027-4321-94fc-61ed12719529	LOTE	Por lote	El item requiere manejo por lote	2	t	2026-03-31 21:38:43.434003	2026-03-31 21:38:43.434003	\N	\N
1adf0297-d1cc-42a7-8236-c9d80212af3c	SERIE	Por número de serie	El item requiere número de serie único	3	t	2026-03-31 21:38:43.434003	2026-03-31 21:38:43.434003	\N	\N
\.


--
-- TOC entry 5659 (class 0 OID 18568)
-- Dependencies: 296
-- Data for Name: tipo_entidad_comercial; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_entidad_comercial (id_tipo_entidad, nombre, descripcion) FROM stdin;
1	Sociedad Anónima	Sociedad mercantil con responsabilidad limitada
2	Sociedad Limitada	Sociedad de responsabilidad limitada
3	Autónomo	Persona física que ejerce una actividad económica
4	Sociedad Cooperativa	Sociedad cooperativa
5	Asociación	Entidad sin ánimo de lucro
6	Fundación	Entidad sin ánimo de lucro de carácter fundacional
7	Sociedad Civil	Sociedad civil
8	Comunidad de Bienes	Comunidad de bienes
\.


--
-- TOC entry 5753 (class 0 OID 222463)
-- Dependencies: 390
-- Data for Name: tipo_item_catalogo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_item_catalogo (id_tipo_item, codigo, nombre, descripcion, orden, estado, created_at, updated_at, created_by, updated_by) FROM stdin;
991d248f-b44a-48d4-9a2f-f33529d9cf05	PRODUCT	Producto	Ítem físico o inventariable	1	t	2026-03-08 23:40:32.5291	2026-03-08 23:40:32.5291	\N	\N
75230088-4af9-4e79-97a6-130e905097ec	SERVICE	Servicio	Ítem de tipo servicio	2	t	2026-03-08 23:40:32.5291	2026-03-08 23:40:32.5291	\N	\N
\.


--
-- TOC entry 5755 (class 0 OID 222503)
-- Dependencies: 392
-- Data for Name: tipo_movimiento_contable_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_movimiento_contable_item (id_tipo_movimiento_contable, codigo, nombre, descripcion, orden, estado, created_by, updated_by, created_at, updated_at) FROM stdin;
c0a4bb5e-66c2-447e-a2aa-fcde03279adc	VENTA	Venta	Cuenta contable usada para venta del item	1	t	\N	\N	2026-03-09 01:01:38.37485	2026-03-09 01:01:38.37485
347186f1-4097-4b19-ae35-e2bd93120a6f	COMPRA	Compra	Cuenta contable usada para compra del item	2	t	\N	\N	2026-03-09 01:01:38.37485	2026-03-09 01:01:38.37485
b6df30ba-754f-4648-b7b9-0531c051c3be	EXPORTACION	Exportación	Cuenta contable usada para exportación del item	3	t	\N	\N	2026-03-09 01:01:38.37485	2026-03-09 01:01:38.37485
4d5258c3-72cf-4147-b535-3537165a7e2a	IMPORTACION	Importación	Cuenta contable usada para importación del item	4	t	\N	\N	2026-03-09 01:01:38.37485	2026-03-09 01:01:38.37485
\.


--
-- TOC entry 5665 (class 0 OID 22057)
-- Dependencies: 302
-- Data for Name: tipo_tercero_catalogo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_tercero_catalogo (id_tipo_tercero, nombre) FROM stdin;
84fe28ca-953e-433c-ad96-0d5a5bcb5b6a	CLIENTE
ab5f5dac-d03c-42b1-92bb-97131765f213	REPRESENTANTE
c75e1baf-6337-4a86-b1bd-5c00717ada3e	VENDEDOR
70d37072-cd30-4784-a395-42fc56f5e8be	ASEGURADORA
d01d3e83-46b1-4700-bf8a-261c48a03e72	ENTIDAD_FINANCIERA
5ffc59e5-9c1b-45d5-a068-ea96fe7a6b5b	PERSONA_JURIDICA
fc373170-f6ae-4061-bd18-76ac8ed624dd	PERSONA_NATURAL
f2431a00-5aba-48e5-a19a-c66845505655	BANCO
504af3f8-f1b6-44e5-86b3-7186bf32a552	EMPLEADO
4e8b0eef-0a8e-4534-a066-318bdd065a14	EMPRESA
9f7ee663-d785-4bb2-90f0-f1ebccb7e180	RESPONSABLE
\.


--
-- TOC entry 5736 (class 0 OID 219803)
-- Dependencies: 373
-- Data for Name: tipo_unidad_medida; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_unidad_medida (id_tipo_unidad, codigo, nombre, descripcion, activo) FROM stdin;
9abe23fa-5ffd-460a-b0b8-1f84e1288485	PESO	Peso	\N	t
e1fb958d-4a3e-497f-8338-78a3b498bc66	LONGITUD	Longitud	\N	t
6a91c90b-d021-42dc-9b05-ce0759bbffdd	SUPERFICIE	Superficie	\N	t
eeee0ff5-1abb-43a4-b435-b8d3dcba4f56	VOLUMEN	Volumen	\N	t
\.


--
-- TOC entry 5673 (class 0 OID 32151)
-- Dependencies: 310
-- Data for Name: tipos_miembro; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipos_miembro (id, etiqueta, estado, naturaleza, sujeto_cotizacion, importe, cualquier_importe, voto_autorizado, duracion, descripcion, email_bienvenida, creado_en) FROM stdin;
\.


--
-- TOC entry 5724 (class 0 OID 106298)
-- Dependencies: 361
-- Data for Name: titular_cuenta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titular_cuenta (id_titular_cuenta, nombre_completo, direccion, codigo_postal, ciudad, id_pais) FROM stdin;
\.


--
-- TOC entry 5743 (class 0 OID 221048)
-- Dependencies: 380
-- Data for Name: transferencia_stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transferencia_stock (id_transferencia_stock, id_empresa, transferencia_ref, id_almacen_origen, id_almacen_destino, estado_transferencia, fecha_transferencia, observacion, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5744 (class 0 OID 221072)
-- Dependencies: 381
-- Data for Name: transferencia_stock_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transferencia_stock_detalle (id_transferencia_stock_detalle, id_transferencia_stock, id_item, id_lote_serie, cantidad, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5737 (class 0 OID 219813)
-- Dependencies: 374
-- Data for Name: unidad_medida; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unidad_medida (id_unidad, id_tipo_unidad, codigo, nombre, simbolo, descripcion, activo) FROM stdin;
b3741fbe-2580-498f-a363-5168071ef267	9abe23fa-5ffd-460a-b0b8-1f84e1288485	KG	Kilogramo	kg	\N	t
9933402f-bcce-4f49-b0f4-e9bf1287c46d	9abe23fa-5ffd-460a-b0b8-1f84e1288485	G	Gramo	g	\N	t
5709f6da-f5d2-44b7-baf2-b986f8bd4e3b	e1fb958d-4a3e-497f-8338-78a3b498bc66	MM	Milímetro	mm	\N	t
90f49ab7-cc83-49c6-99ea-992f1985d3c9	e1fb958d-4a3e-497f-8338-78a3b498bc66	CM	Centímetro	cm	\N	t
052c9a48-5db5-444c-9d75-2f41545cd066	e1fb958d-4a3e-497f-8338-78a3b498bc66	M	Metro	m	\N	t
fad7dc67-080d-471c-8e25-39910943c081	eeee0ff5-1abb-43a4-b435-b8d3dcba4f56	CM3	Centímetro cúbico	cm³	\N	t
10f11425-6b59-4932-99c3-e2a0a2178bdf	e1fb958d-4a3e-497f-8338-78a3b498bc66	DM	Decímetro	dm	\N	t
05b9801e-150b-4ef2-bcd3-830eb48dd060	e1fb958d-4a3e-497f-8338-78a3b498bc66	KM	Kilómetro	km	\N	t
06cedbd1-3d5c-4dd6-8cfc-a38a17eb8dce	9abe23fa-5ffd-460a-b0b8-1f84e1288485	MG	Miligramo	mg	\N	t
4630bc04-9526-4c19-b2ac-9ccd27d021f7	9abe23fa-5ffd-460a-b0b8-1f84e1288485	LB	Libra	lb	\N	t
ebde591e-19ee-43f0-a56e-ef0c02b39677	9abe23fa-5ffd-460a-b0b8-1f84e1288485	TON	Tonelada	t	\N	t
8f6edd45-3828-41b9-bf22-a49be4ca4eb2	6a91c90b-d021-42dc-9b05-ce0759bbffdd	CM2	Centímetro cuadrado	cm²	\N	t
6d6a06e3-aa57-49fe-9df5-95dad1f61abd	6a91c90b-d021-42dc-9b05-ce0759bbffdd	M2	Metro cuadrado	m²	\N	t
ea719eee-93e1-47a6-ab6c-37e0a7890d62	6a91c90b-d021-42dc-9b05-ce0759bbffdd	KM2	Kilómetro cuadrado	km²	\N	t
3e16e92e-b953-44f3-858b-d11b7c49b5df	6a91c90b-d021-42dc-9b05-ce0759bbffdd	HA	Hectárea	ha	\N	t
4818329d-7c33-4664-b6f3-fbb2b0fde6fc	eeee0ff5-1abb-43a4-b435-b8d3dcba4f56	ML	Mililitro	ml	\N	t
04fba3fa-e5f4-4ac2-8465-0bb8546d5345	eeee0ff5-1abb-43a4-b435-b8d3dcba4f56	L	Litro	l	\N	t
72afab62-77a3-49d1-b838-6e2d3b19dd62	eeee0ff5-1abb-43a4-b435-b8d3dcba4f56	M3	Metro cúbico	m³	\N	t
\.


--
-- TOC entry 5650 (class 0 OID 17347)
-- Dependencies: 287
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id_usuario, id_empresa, id_perfil, username, password_hash, nombre_completo, email, estado, created_at, updated_at, scope_acceso, titulo_cortesia, apellidos, nombre, sexo, es_empleado, id_supervisor, id_validador_gastos, id_validador_dias_libres, usuario_externo, fecha_validez_desde, fecha_validez_hasta, direccion, codigo_postal, poblacion, id_pais, id_provincia, telefono_trabajo, movil, fax, codigo_contable, color, etiquetas_categorias, idioma_default, firma, nota_publica, nota_privada, puesto_trabajo, tasa_hora, tasa_dia, salario, horas_semana, fecha_empleo_desde, fecha_empleo_hasta, fecha_nacimiento) FROM stdin;
674ab9f4-f3a1-4a55-8aff-7065c66b6133	0459fe04-163b-4b89-b98a-0f1179b7224c	9d23e1c4-06ef-4388-88c5-4cf406a03539	empresa@hotmail.com	$2b$12$rAWp.WzDAxLHJoIstg7Sz.PjpZGBH3u4UQY0psoDC8YE6i2J3j2ky	Xavi Granda	empresa@hotmail.com	t	2026-04-02 00:55:03.84048	2026-04-05 12:16:32.819	EMPRESA	\N	\N	\N	\N	f	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	19a7e082-266e-4865-a7c5-abe4ca9cbeb7	john_quezada@hotmail.com	$2b$12$rAWp.WzDAxLHJoIstg7Sz.PjpZGBH3u4UQY0psoDC8YE6i2J3j2ky	John Quezada	john_quezada@hotmail.com	t	2025-07-23 14:35:00.454842	2025-07-23 14:35:00.454842	GLOBAL	\N	\N	\N	\N	f	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5642 (class 0 OID 17000)
-- Dependencies: 275
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-07-22 23:04:10
20211116045059	2025-07-22 23:04:16
20211116050929	2025-07-22 23:04:19
20211116051442	2025-07-22 23:04:23
20211116212300	2025-07-22 23:04:27
20211116213355	2025-07-22 23:04:30
20211116213934	2025-07-22 23:04:33
20211116214523	2025-07-22 23:04:38
20211122062447	2025-07-22 23:04:41
20211124070109	2025-07-22 23:04:44
20211202204204	2025-07-22 23:04:48
20211202204605	2025-07-22 23:04:51
20211210212804	2025-07-22 23:05:01
20211228014915	2025-07-22 23:05:05
20220107221237	2025-07-22 23:05:08
20220228202821	2025-07-22 23:05:11
20220312004840	2025-07-22 23:05:14
20220603231003	2025-07-22 23:05:20
20220603232444	2025-07-22 23:05:23
20220615214548	2025-07-22 23:05:27
20220712093339	2025-07-22 23:05:30
20220908172859	2025-07-22 23:05:34
20220916233421	2025-07-22 23:05:37
20230119133233	2025-07-22 23:05:40
20230128025114	2025-07-22 23:05:45
20230128025212	2025-07-22 23:05:48
20230227211149	2025-07-22 23:05:52
20230228184745	2025-07-22 23:05:55
20230308225145	2025-07-22 23:05:58
20230328144023	2025-07-22 23:06:02
20231018144023	2025-07-22 23:06:06
20231204144023	2025-07-22 23:06:11
20231204144024	2025-07-22 23:06:14
20231204144025	2025-07-22 23:06:18
20240108234812	2025-07-22 23:06:21
20240109165339	2025-07-22 23:06:24
20240227174441	2025-07-22 23:06:30
20240311171622	2025-07-22 23:06:35
20240321100241	2025-07-22 23:06:42
20240401105812	2025-07-22 23:06:51
20240418121054	2025-07-22 23:06:55
20240523004032	2025-07-22 23:07:07
20240618124746	2025-07-22 23:07:11
20240801235015	2025-07-22 23:07:14
20240805133720	2025-07-22 23:07:17
20240827160934	2025-07-22 23:07:21
20240919163303	2025-07-22 23:07:26
20240919163305	2025-07-22 23:07:29
20241019105805	2025-07-22 23:07:32
20241030150047	2025-07-22 23:07:45
20241108114728	2025-07-22 23:07:49
20241121104152	2025-07-22 23:07:52
20241130184212	2025-07-22 23:07:57
20241220035512	2025-07-22 23:08:00
20241220123912	2025-07-22 23:08:03
20241224161212	2025-07-22 23:08:06
20250107150512	2025-07-22 23:08:10
20250110162412	2025-07-22 23:08:13
20250123174212	2025-07-22 23:08:16
20250128220012	2025-07-22 23:08:20
20250506224012	2025-07-22 23:08:23
20250523164012	2025-07-22 23:08:26
20250714121412	2025-07-22 23:08:29
20250905041441	2025-09-27 23:37:17
20251103001201	2025-11-19 03:11:31
20251120212548	2026-03-19 20:12:24
20251120215549	2026-03-19 20:12:26
20260218120000	2026-03-19 20:12:27
20260326120000	2026-04-10 22:41:38
\.


--
-- TOC entry 5644 (class 0 OID 17027)
-- Dependencies: 278
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter) FROM stdin;
\.


--
-- TOC entry 5628 (class 0 OID 16544)
-- Dependencies: 259
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- TOC entry 5677 (class 0 OID 53242)
-- Dependencies: 314
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- TOC entry 5726 (class 0 OID 119631)
-- Dependencies: 363
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5630 (class 0 OID 16586)
-- Dependencies: 261
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-07-22 23:04:12.499223
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-07-22 23:04:12.506797
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-07-22 23:04:12.528843
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-07-22 23:04:12.539839
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-07-22 23:04:12.548122
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-07-22 23:04:12.562527
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-07-22 23:04:12.568898
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-07-22 23:04:12.588493
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-07-22 23:04:12.597356
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-07-22 23:04:12.603501
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-07-22 23:04:12.610028
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-07-22 23:04:12.628827
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-07-22 23:04:12.635323
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-07-22 23:04:12.641959
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-07-22 23:04:12.648679
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-07-22 23:04:12.657396
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-07-22 23:04:12.663915
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-07-22 23:04:12.674449
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-07-22 23:04:12.689118
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-07-22 23:04:12.700314
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-07-22 23:04:12.706668
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-07-22 23:04:12.712954
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-08-26 14:49:05.499277
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2025-11-19 03:01:41.310343
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2025-11-19 03:01:41.35094
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2025-11-19 03:01:41.451976
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2025-11-19 03:01:41.462674
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-01-06 04:05:06.106064
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2025-07-22 23:04:12.512757
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2025-07-22 23:04:12.555474
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2025-07-22 23:04:12.575137
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2025-07-22 23:04:12.581533
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2025-08-26 14:49:02.793453
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2025-08-26 14:49:03.054092
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2025-08-26 14:49:03.230975
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2025-08-26 14:49:03.304913
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2025-08-26 14:49:03.315199
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2025-08-26 14:49:03.335489
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2025-08-26 14:49:04.198843
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2025-08-26 14:49:04.301955
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2025-08-26 14:49:04.309136
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2025-08-26 14:49:04.6003
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2025-08-26 14:49:05.092779
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2025-08-26 14:49:05.995564
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2025-10-04 16:40:40.018309
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2025-10-04 16:40:40.067161
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2025-10-04 16:40:40.093997
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2025-10-04 16:40:40.102481
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2025-10-04 16:40:40.113352
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2025-11-19 03:01:41.486791
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-03-19 20:12:23.260543
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-03-19 20:12:23.347338
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-03-19 20:12:23.349874
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-03-19 20:12:23.577939
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-03-19 20:12:23.582589
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-03-19 20:12:23.585107
56	fix-optimized-search-function	cb58526ebc23048049fd5bf2fd148d18b04a2073	2026-03-19 20:12:23.601031
57	s3-multipart-uploads-metadata	f127886e00d1b374fadbc7c6b31e09336aad5287	2026-04-10 22:41:37.954426
58	operation-ergonomics	00ca5d483b3fe0d522133d9002ccc5df98365120	2026-04-10 22:41:37.981428
\.


--
-- TOC entry 5629 (class 0 OID 16559)
-- Dependencies: 260
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- TOC entry 5645 (class 0 OID 17071)
-- Dependencies: 279
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata, metadata) FROM stdin;
\.


--
-- TOC entry 5646 (class 0 OID 17085)
-- Dependencies: 280
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- TOC entry 5727 (class 0 OID 119641)
-- Dependencies: 364
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4011 (class 0 OID 16656)
-- Dependencies: 262
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 6066 (class 0 OID 0)
-- Dependencies: 254
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 3, true);


--
-- TOC entry 6067 (class 0 OID 0)
-- Dependencies: 290
-- Name: entidad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.entidad_id_seq', 1, false);


--
-- TOC entry 6068 (class 0 OID 0)
-- Dependencies: 307
-- Name: impuestos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.impuestos_id_seq', 2, true);


--
-- TOC entry 6069 (class 0 OID 0)
-- Dependencies: 311
-- Name: miembros_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.miembros_id_seq', 1, false);


--
-- TOC entry 6070 (class 0 OID 0)
-- Dependencies: 370
-- Name: secuencia_asiento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.secuencia_asiento_id_seq', 1, false);


--
-- TOC entry 6071 (class 0 OID 0)
-- Dependencies: 295
-- Name: tipo_entidad_comercial_id_tipo_entidad_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_entidad_comercial_id_tipo_entidad_seq', 8, true);


--
-- TOC entry 6072 (class 0 OID 0)
-- Dependencies: 309
-- Name: tipos_miembro_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipos_miembro_id_seq', 1, false);


--
-- TOC entry 6073 (class 0 OID 0)
-- Dependencies: 277
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- TOC entry 4646 (class 2606 OID 16825)
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- TOC entry 4602 (class 2606 OID 16529)
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 5036 (class 2606 OID 211970)
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- TOC entry 5038 (class 2606 OID 211968)
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4669 (class 2606 OID 16931)
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- TOC entry 4624 (class 2606 OID 16949)
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- TOC entry 4626 (class 2606 OID 16959)
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- TOC entry 4600 (class 2606 OID 16522)
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- TOC entry 4648 (class 2606 OID 16818)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- TOC entry 4644 (class 2606 OID 16806)
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 4636 (class 2606 OID 16999)
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- TOC entry 4638 (class 2606 OID 16793)
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- TOC entry 4834 (class 2606 OID 94234)
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- TOC entry 4836 (class 2606 OID 94232)
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- TOC entry 4838 (class 2606 OID 94230)
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- TOC entry 5008 (class 2606 OID 144211)
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- TOC entry 4786 (class 2606 OID 78686)
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- TOC entry 4842 (class 2606 OID 94256)
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- TOC entry 4844 (class 2606 OID 94258)
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- TOC entry 4673 (class 2606 OID 16984)
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4594 (class 2606 OID 16512)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4597 (class 2606 OID 16736)
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- TOC entry 4658 (class 2606 OID 16865)
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- TOC entry 4660 (class 2606 OID 16863)
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4665 (class 2606 OID 16879)
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- TOC entry 4605 (class 2606 OID 16535)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4631 (class 2606 OID 16757)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4655 (class 2606 OID 16846)
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- TOC entry 4650 (class 2606 OID 16837)
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4587 (class 2606 OID 16919)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 4589 (class 2606 OID 16499)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5167 (class 2606 OID 232686)
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 5163 (class 2606 OID 232669)
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- TOC entry 5063 (class 2606 OID 220941)
-- Name: almacen almacen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.almacen
    ADD CONSTRAINT almacen_pkey PRIMARY KEY (id_almacen);


--
-- TOC entry 4859 (class 2606 OID 98871)
-- Name: asiento_contable asiento_contable_numero_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento_contable
    ADD CONSTRAINT asiento_contable_numero_unique UNIQUE (id_empresa, numero_asiento);


--
-- TOC entry 4861 (class 2606 OID 98869)
-- Name: asiento_contable asiento_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento_contable
    ADD CONSTRAINT asiento_contable_pkey PRIMARY KEY (id_asiento_contable);


--
-- TOC entry 5144 (class 2606 OID 228135)
-- Name: banco banco_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banco
    ADD CONSTRAINT banco_pkey PRIMARY KEY (id_banco);


--
-- TOC entry 5100 (class 2606 OID 222354)
-- Name: categoria_item categoria_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_item
    ADD CONSTRAINT categoria_item_pkey PRIMARY KEY (id_categoria_item);


--
-- TOC entry 4982 (class 2606 OID 99545)
-- Name: centro_costo centro_costo_codigo_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.centro_costo
    ADD CONSTRAINT centro_costo_codigo_unique UNIQUE (id_empresa, codigo);


--
-- TOC entry 4984 (class 2606 OID 99543)
-- Name: centro_costo centro_costo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.centro_costo
    ADD CONSTRAINT centro_costo_pkey PRIMARY KEY (id_centro_costo);


--
-- TOC entry 4994 (class 2606 OID 99602)
-- Name: cierre_contable cierre_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_contable
    ADD CONSTRAINT cierre_contable_pkey PRIMARY KEY (id_cierre_contable);


--
-- TOC entry 4847 (class 2606 OID 98799)
-- Name: cierre_cuenta cierre_cuenta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_cuenta
    ADD CONSTRAINT cierre_cuenta_pkey PRIMARY KEY (id_cierre_cuenta);


--
-- TOC entry 4849 (class 2606 OID 98801)
-- Name: cierre_cuenta cierre_cuenta_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_cuenta
    ADD CONSTRAINT cierre_cuenta_unique UNIQUE (id_periodo_contable, id_cuenta_contable);


--
-- TOC entry 5053 (class 2606 OID 219791)
-- Name: ciudad ciudad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudad
    ADD CONSTRAINT ciudad_pkey PRIMARY KEY (id_ciudad);


--
-- TOC entry 4948 (class 2606 OID 99327)
-- Name: conciliacion_bancaria conciliacion_bancaria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conciliacion_bancaria
    ADD CONSTRAINT conciliacion_bancaria_pkey PRIMARY KEY (id_conciliacion_bancaria);


--
-- TOC entry 4950 (class 2606 OID 99329)
-- Name: conciliacion_bancaria conciliacion_bancaria_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conciliacion_bancaria
    ADD CONSTRAINT conciliacion_bancaria_unique UNIQUE (id_cuenta_bancaria, id_periodo_contable);


--
-- TOC entry 4759 (class 2606 OID 22072)
-- Name: condicion_pago_catalogo condicion_pago_catalogo_descripcion_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condicion_pago_catalogo
    ADD CONSTRAINT condicion_pago_catalogo_descripcion_key UNIQUE (descripcion);


--
-- TOC entry 4761 (class 2606 OID 22070)
-- Name: condicion_pago_catalogo condicion_pago_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condicion_pago_catalogo
    ADD CONSTRAINT condicion_pago_catalogo_pkey PRIMARY KEY (id_condicion_pago);


--
-- TOC entry 4788 (class 2606 OID 93123)
-- Name: configuracion_contabilidad configuracion_contabilidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_contabilidad
    ADD CONSTRAINT configuracion_contabilidad_pkey PRIMARY KEY (id_configuracion_contabilidad);


--
-- Name: configuracion_contabilidad configuracion_contabilidad_id_empresa_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_contabilidad
    ADD CONSTRAINT configuracion_contabilidad_id_empresa_unique UNIQUE (id_empresa);


--
-- Name: configuracion_contabilidad configuracion_contabilidad_metodo_contable_chk; Type: CHECK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_contabilidad
    ADD CONSTRAINT configuracion_contabilidad_metodo_contable_chk CHECK (((metodo_contable)::text = ANY ((ARRAY['acumulacion'::character varying, 'caja'::character varying])::text[])));


--
-- Name: configuracion_contabilidad configuracion_contabilidad_numeracion_modelo_chk; Type: CHECK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_contabilidad
    ADD CONSTRAINT configuracion_contabilidad_numeracion_modelo_chk CHECK (((numeracion_modelo)::text = ANY ((ARRAY['neon'::character varying, 'argon'::character varying, 'helium'::character varying])::text[])));


--
-- TOC entry 4748 (class 2606 OID 18659)
-- Name: contable_externo contable_externo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contable_externo
    ADD CONSTRAINT contable_externo_pkey PRIMARY KEY (id_contable);


--
-- TOC entry 5010 (class 2606 OID 207475)
-- Name: contacto_direccion contacto_direccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacto_direccion
    ADD CONSTRAINT contacto_direccion_pkey PRIMARY KEY (id_contacto);


--
-- TOC entry 4903 (class 2606 OID 99118)
-- Name: cotizacion_linea cotizacion_linea_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_linea
    ADD CONSTRAINT cotizacion_linea_pkey PRIMARY KEY (id_cotizacion_linea);


--
-- TOC entry 4895 (class 2606 OID 99087)
-- Name: cotizacion cotizacion_numero_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_numero_unique UNIQUE (id_empresa, numero_cotizacion);


--
-- TOC entry 4897 (class 2606 OID 99085)
-- Name: cotizacion cotizacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_pkey PRIMARY KEY (id_cotizacion);


--
-- TOC entry 4920 (class 2606 OID 99207)
-- Name: cotizacion_prefactura cotizacion_prefactura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_prefactura
    ADD CONSTRAINT cotizacion_prefactura_pkey PRIMARY KEY (id_cotizacion_prefactura);


--
-- TOC entry 4922 (class 2606 OID 99209)
-- Name: cotizacion_prefactura cotizacion_prefactura_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_prefactura
    ADD CONSTRAINT cotizacion_prefactura_unique UNIQUE (id_cotizacion, id_prefactura);


--
-- TOC entry 4815 (class 2606 OID 93279)
-- Name: cuenta_bancaria cuenta_bancaria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_bancaria
    ADD CONSTRAINT cuenta_bancaria_pkey PRIMARY KEY (id_cuenta_bancaria);


--
-- TOC entry 4817 (class 2606 OID 93281)
-- Name: cuenta_bancaria cuenta_bancaria_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_bancaria
    ADD CONSTRAINT cuenta_bancaria_unique UNIQUE (id_empresa, id_banco, numero_cuenta);


--
-- TOC entry 4800 (class 2606 OID 93214)
-- Name: cuenta_contable cuenta_contable_codigo_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable
    ADD CONSTRAINT cuenta_contable_codigo_unique UNIQUE (id_plan_contable, codigo);


--
-- TOC entry 4811 (class 2606 OID 93256)
-- Name: cuenta_contable_defecto cuenta_contable_defecto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_defecto
    ADD CONSTRAINT cuenta_contable_defecto_pkey PRIMARY KEY (id_cuenta_contable_defecto);


--
-- TOC entry 4813 (class 2606 OID 93258)
-- Name: cuenta_contable_defecto cuenta_contable_defecto_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_defecto
    ADD CONSTRAINT cuenta_contable_defecto_unique UNIQUE (id_empresa, tipo_operacion);


--
-- TOC entry 4827 (class 2606 OID 93352)
-- Name: cuenta_contable_item cuenta_contable_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_item
    ADD CONSTRAINT cuenta_contable_item_pkey PRIMARY KEY (id_cuenta_contable_item);


--
-- TOC entry 4802 (class 2606 OID 93212)
-- Name: cuenta_contable cuenta_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable
    ADD CONSTRAINT cuenta_contable_pkey PRIMARY KEY (id_cuenta_contable);


--
-- TOC entry 4855 (class 2606 OID 98846)
-- Name: cuenta_grupo_personalizado cuenta_grupo_personalizado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_grupo_personalizado
    ADD CONSTRAINT cuenta_grupo_personalizado_pkey PRIMARY KEY (id_cuenta_grupo_personalizado);


--
-- TOC entry 4857 (class 2606 OID 98848)
-- Name: cuenta_grupo_personalizado cuenta_grupo_personalizado_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_grupo_personalizado
    ADD CONSTRAINT cuenta_grupo_personalizado_unique UNIQUE (id_grupo_cuenta_personalizado, id_cuenta_contable);


--
-- TOC entry 4823 (class 2606 OID 93331)
-- Name: cuenta_impuesto cuenta_impuesto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_impuesto
    ADD CONSTRAINT cuenta_impuesto_pkey PRIMARY KEY (id_cuenta_impuesto);


--
-- TOC entry 4825 (class 2606 OID 93333)
-- Name: cuenta_impuesto cuenta_impuesto_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_impuesto
    ADD CONSTRAINT cuenta_impuesto_unique UNIQUE (id_empresa, tipo_impuesto, porcentaje);


--
-- TOC entry 4819 (class 2606 OID 93310)
-- Name: cuenta_iva cuenta_iva_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_iva
    ADD CONSTRAINT cuenta_iva_pkey PRIMARY KEY (id_cuenta_iva);


--
-- TOC entry 4821 (class 2606 OID 93312)
-- Name: cuenta_iva cuenta_iva_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_iva
    ADD CONSTRAINT cuenta_iva_unique UNIQUE (id_empresa, tipo_iva, porcentaje);


--
-- TOC entry 4790 (class 2606 OID 93160)
-- Name: diario_contable diario_contable_codigo_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diario_contable
    ADD CONSTRAINT diario_contable_codigo_unique UNIQUE (id_empresa, codigo);


--
-- TOC entry 4792 (class 2606 OID 93158)
-- Name: diario_contable diario_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diario_contable
    ADD CONSTRAINT diario_contable_pkey PRIMARY KEY (id_diario_contable);


--
-- TOC entry 5146 (class 2606 OID 228162)
-- Name: directorio_documento directorio_documento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directorio_documento
    ADD CONSTRAINT directorio_documento_pkey PRIMARY KEY (id_directorio_documento);


--
-- TOC entry 4876 (class 2606 OID 98978)
-- Name: documento_origen documento_origen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_origen
    ADD CONSTRAINT documento_origen_pkey PRIMARY KEY (id_documento_origen);


--
-- TOC entry 4878 (class 2606 OID 98980)
-- Name: documento_origen documento_origen_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_origen
    ADD CONSTRAINT documento_origen_unique UNIQUE (id_empresa, tipo_documento, numero_documento);


--
-- TOC entry 5128 (class 2606 OID 222493)
-- Name: duracion_unidad_catalogo duracion_unidad_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.duracion_unidad_catalogo
    ADD CONSTRAINT duracion_unidad_catalogo_pkey PRIMARY KEY (id_duration_unit);


--
-- TOC entry 4751 (class 2606 OID 18693)
-- Name: empresa_horario_apertura empresa_horario_apertura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_horario_apertura
    ADD CONSTRAINT empresa_horario_apertura_pkey PRIMARY KEY (id_horario);


--
-- TOC entry 4737 (class 2606 OID 18586)
-- Name: empresa_identificacion empresa_identificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_identificacion
    ADD CONSTRAINT empresa_identificacion_pkey PRIMARY KEY (id_identificacion);


--
-- TOC entry 4692 (class 2606 OID 17277)
-- Name: empresa empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_pkey PRIMARY KEY (id_empresa);


--
-- TOC entry 4744 (class 2606 OID 18628)
-- Name: empresa_red_social empresa_red_social_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_red_social
    ADD CONSTRAINT empresa_red_social_pkey PRIMARY KEY (id);


--
-- TOC entry 4694 (class 2606 OID 17279)
-- Name: empresa empresa_ruc_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_ruc_key UNIQUE (ruc);


--
-- TOC entry 4717 (class 2606 OID 18515)
-- Name: entidad entidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entidad
    ADD CONSTRAINT entidad_pkey PRIMARY KEY (id);


--
-- TOC entry 5093 (class 2606 OID 221122)
-- Name: envio_detalle envio_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.envio_detalle
    ADD CONSTRAINT envio_detalle_pkey PRIMARY KEY (id_envio_detalle);


--
-- TOC entry 5090 (class 2606 OID 221108)
-- Name: envio envio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.envio
    ADD CONSTRAINT envio_pkey PRIMARY KEY (id_envio);


--
-- TOC entry 5110 (class 2606 OID 222428)
-- Name: estado_compra_item estado_compra_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_compra_item
    ADD CONSTRAINT estado_compra_item_pkey PRIMARY KEY (id_estado_compra);


--
-- TOC entry 5104 (class 2606 OID 222413)
-- Name: estado_venta_item estado_venta_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_venta_item
    ADD CONSTRAINT estado_venta_item_pkey PRIMARY KEY (id_estado_venta);


--
-- TOC entry 4893 (class 2606 OID 99057)
-- Name: factura_linea factura_linea_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura_linea
    ADD CONSTRAINT factura_linea_pkey PRIMARY KEY (id_factura_linea);


--
-- TOC entry 4885 (class 1259 OID 99031)
-- Name: factura factura_numero_unique_idx; Type: INDEX; Schema: public; Owner: postgres
-- Note: UNIQUE parcial (solo cuando numero_factura IS NOT NULL) para permitir borradores sin número.
--

CREATE UNIQUE INDEX factura_numero_unique_idx ON public.factura USING btree (id_empresa, numero_factura) WHERE (numero_factura IS NOT NULL);


--
-- TOC entry 4887 (class 2606 OID 99029)
-- Name: factura factura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_pkey PRIMARY KEY (id_factura);


--
-- TOC entry 4763 (class 2606 OID 22119)
-- Name: forma_pago_catalogo forma_pago_catalogo_descripcion_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forma_pago_catalogo
    ADD CONSTRAINT forma_pago_catalogo_descripcion_key UNIQUE (descripcion);


--
-- TOC entry 4765 (class 2606 OID 22117)
-- Name: forma_pago_catalogo forma_pago_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forma_pago_catalogo
    ADD CONSTRAINT forma_pago_catalogo_pkey PRIMARY KEY (id_forma_pago);


--
-- TOC entry 4851 (class 2606 OID 98832)
-- Name: grupo_cuenta_personalizado grupo_cuenta_personalizado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grupo_cuenta_personalizado
    ADD CONSTRAINT grupo_cuenta_personalizado_pkey PRIMARY KEY (id_grupo_cuenta_personalizado);


--
-- TOC entry 4853 (class 2606 OID 98834)
-- Name: grupo_cuenta_personalizado grupo_cuenta_personalizado_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grupo_cuenta_personalizado
    ADD CONSTRAINT grupo_cuenta_personalizado_unique UNIQUE (id_empresa, nombre);


--
-- TOC entry 4932 (class 2606 OID 99249)
-- Name: historial_conversion historial_conversion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_conversion
    ADD CONSTRAINT historial_conversion_pkey PRIMARY KEY (id_historial_conversion);


--
-- TOC entry 4774 (class 2606 OID 24396)
-- Name: impuestos impuestos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.impuestos
    ADD CONSTRAINT impuestos_pkey PRIMARY KEY (id);


--
-- TOC entry 4767 (class 2606 OID 22127)
-- Name: incoterm_catalogo incoterm_catalogo_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incoterm_catalogo
    ADD CONSTRAINT incoterm_catalogo_codigo_key UNIQUE (codigo);


--
-- TOC entry 4769 (class 2606 OID 22125)
-- Name: incoterm_catalogo incoterm_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incoterm_catalogo
    ADD CONSTRAINT incoterm_catalogo_pkey PRIMARY KEY (id_incoterm);


--
-- TOC entry 4881 (class 2606 OID 99011)
-- Name: informe_contable informe_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.informe_contable
    ADD CONSTRAINT informe_contable_pkey PRIMARY KEY (id_informe_contable);


--
-- TOC entry 4883 (class 2606 OID 99013)
-- Name: informe_contable informe_contable_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.informe_contable
    ADD CONSTRAINT informe_contable_unique UNIQUE (id_empresa, nombre);


--
-- TOC entry 5084 (class 2606 OID 221031)
-- Name: inventario_detalle inventario_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_detalle
    ADD CONSTRAINT inventario_detalle_pkey PRIMARY KEY (id_inventario_detalle);


--
-- TOC entry 5081 (class 2606 OID 221012)
-- Name: inventario inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_pkey PRIMARY KEY (id_inventario);


--
-- TOC entry 5158 (class 2606 OID 230413)
-- Name: item_etiqueta_categoria_det item_etiqueta_categoria_det_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_etiqueta_categoria_det
    ADD CONSTRAINT item_etiqueta_categoria_det_pkey PRIMARY KEY (id_item_etiqueta_categoria);


--
-- TOC entry 5156 (class 2606 OID 230404)
-- Name: item_etiqueta_categoria item_etiqueta_categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_etiqueta_categoria
    ADD CONSTRAINT item_etiqueta_categoria_pkey PRIMARY KEY (id_etiqueta_categoria);


--
-- TOC entry 5076 (class 2606 OID 220978)
-- Name: item_lote_serie item_lote_serie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_lote_serie
    ADD CONSTRAINT item_lote_serie_pkey PRIMARY KEY (id_lote_serie);


--
-- TOC entry 5024 (class 2606 OID 208597)
-- Name: item item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_pkey PRIMARY KEY (id_item);


--
-- TOC entry 4868 (class 2606 OID 98924)
-- Name: libro_mayor libro_mayor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.libro_mayor
    ADD CONSTRAINT libro_mayor_pkey PRIMARY KEY (id_libro_mayor);


--
-- TOC entry 4870 (class 2606 OID 98926)
-- Name: libro_mayor libro_mayor_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.libro_mayor
    ADD CONSTRAINT libro_mayor_unique UNIQUE (id_cuenta_contable, id_periodo_contable);


--
-- TOC entry 5046 (class 2606 OID 213088)
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id_media);


--
-- TOC entry 4715 (class 2606 OID 17391)
-- Name: menu_item menu_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item
    ADD CONSTRAINT menu_item_pkey PRIMARY KEY (id_item);


--
-- TOC entry 4706 (class 2606 OID 17378)
-- Name: menu_seccion menu_seccion_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_seccion
    ADD CONSTRAINT menu_seccion_nombre_key UNIQUE (nombre);


--
-- TOC entry 4708 (class 2606 OID 17376)
-- Name: menu_seccion menu_seccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_seccion
    ADD CONSTRAINT menu_seccion_pkey PRIMARY KEY (id_seccion);


--
-- TOC entry 4778 (class 2606 OID 32176)
-- Name: miembros miembros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.miembros
    ADD CONSTRAINT miembros_pkey PRIMARY KEY (id);


--
-- TOC entry 4794 (class 2606 OID 93178)
-- Name: modelo_plan_contable modelo_plan_contable_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modelo_plan_contable
    ADD CONSTRAINT modelo_plan_contable_codigo_key UNIQUE (codigo);


--
-- TOC entry 4796 (class 2606 OID 93176)
-- Name: modelo_plan_contable modelo_plan_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modelo_plan_contable
    ADD CONSTRAINT modelo_plan_contable_pkey PRIMARY KEY (id_modelo_plan_contable);


--
-- TOC entry 4719 (class 2606 OID 18524)
-- Name: moneda moneda_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moneda
    ADD CONSTRAINT moneda_codigo_key UNIQUE (codigo);


--
-- TOC entry 4721 (class 2606 OID 18522)
-- Name: moneda moneda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moneda
    ADD CONSTRAINT moneda_pkey PRIMARY KEY (id_moneda);


--
-- TOC entry 4955 (class 2606 OID 99359)
-- Name: movimiento_bancario movimiento_bancario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_bancario
    ADD CONSTRAINT movimiento_bancario_pkey PRIMARY KEY (id_movimiento_bancario);


--
-- TOC entry 4987 (class 2606 OID 99558)
-- Name: movimiento_centro_costo movimiento_centro_costo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_centro_costo
    ADD CONSTRAINT movimiento_centro_costo_pkey PRIMARY KEY (id_movimiento_centro_costo);


--
-- TOC entry 4866 (class 2606 OID 98902)
-- Name: movimiento_contable movimiento_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_contable
    ADD CONSTRAINT movimiento_contable_pkey PRIMARY KEY (id_movimiento_contable);


--
-- TOC entry 5000 (class 2606 OID 106383)
-- Name: movimiento_cuenta movimiento_cuenta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_cuenta
    ADD CONSTRAINT movimiento_cuenta_pkey PRIMARY KEY (id_movimiento_cuenta);


--
-- TOC entry 4960 (class 2606 OID 99388)
-- Name: movimiento_inventario movimiento_inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_pkey PRIMARY KEY (id_movimiento_inventario);


--
-- TOC entry 5174 (class 2606 OID 237152)
-- Name: naturaleza_item_catalogo naturaleza_item_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.naturaleza_item_catalogo
    ADD CONSTRAINT naturaleza_item_catalogo_pkey PRIMARY KEY (id_naturaleza_item);


--
-- TOC entry 4976 (class 2606 OID 99498)
-- Name: nota_credito_linea nota_credito_linea_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_credito_linea
    ADD CONSTRAINT nota_credito_linea_pkey PRIMARY KEY (id_nota_credito_linea);


--
-- TOC entry 4972 (class 2606 OID 99467)
-- Name: nota_credito nota_credito_numero_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_credito
    ADD CONSTRAINT nota_credito_numero_unique UNIQUE (id_empresa, numero_nota);


--
-- TOC entry 4974 (class 2606 OID 99465)
-- Name: nota_credito nota_credito_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_credito
    ADD CONSTRAINT nota_credito_pkey PRIMARY KEY (id_nota_credito);


--
-- TOC entry 4944 (class 2606 OID 99305)
-- Name: pago_factura pago_factura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago_factura
    ADD CONSTRAINT pago_factura_pkey PRIMARY KEY (id_pago_factura);


--
-- TOC entry 4946 (class 2606 OID 99307)
-- Name: pago_factura pago_factura_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago_factura
    ADD CONSTRAINT pago_factura_unique UNIQUE (id_pago, id_factura);


--
-- TOC entry 4940 (class 2606 OID 99273)
-- Name: pago pago_numero_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_numero_unique UNIQUE (id_empresa, numero_pago);


--
-- TOC entry 4942 (class 2606 OID 99271)
-- Name: pago pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (id_pago);


--
-- TOC entry 4723 (class 2606 OID 18534)
-- Name: pais pais_codigo_iso_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pais
    ADD CONSTRAINT pais_codigo_iso_key UNIQUE (codigo_iso);


--
-- TOC entry 4725 (class 2606 OID 18532)
-- Name: pais pais_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pais
    ADD CONSTRAINT pais_nombre_key UNIQUE (nombre);


--
-- TOC entry 4727 (class 2606 OID 18530)
-- Name: pais pais_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pais
    ADD CONSTRAINT pais_pkey PRIMARY KEY (id_pais);


--
-- TOC entry 4698 (class 2606 OID 32183)
-- Name: perfil perfil_empresa_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil
    ADD CONSTRAINT perfil_empresa_nombre_key UNIQUE (id_empresa, nombre);


--
-- TOC entry 4780 (class 2606 OID 46554)
-- Name: perfil_menu_permiso perfil_menu_permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_menu_permiso
    ADD CONSTRAINT perfil_menu_permiso_pkey PRIMARY KEY (id_perfil, id_item);


--
-- TOC entry 4700 (class 2606 OID 17339)
-- Name: perfil perfil_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil
    ADD CONSTRAINT perfil_pkey PRIMARY KEY (id_perfil);


--
-- TOC entry 4807 (class 2606 OID 93233)
-- Name: periodo_contable periodo_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.periodo_contable
    ADD CONSTRAINT periodo_contable_pkey PRIMARY KEY (id_periodo_contable);


--
-- TOC entry 4809 (class 2606 OID 93235)
-- Name: periodo_contable periodo_contable_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.periodo_contable
    ADD CONSTRAINT periodo_contable_unique UNIQUE (id_empresa, "año", mes);


--
-- TOC entry 4798 (class 2606 OID 93189)
-- Name: plan_contable plan_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_contable
    ADD CONSTRAINT plan_contable_pkey PRIMARY KEY (id_plan_contable);


--
-- TOC entry 4928 (class 2606 OID 99227)
-- Name: prefactura_factura prefactura_factura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura_factura
    ADD CONSTRAINT prefactura_factura_pkey PRIMARY KEY (id_prefactura_factura);


--
-- TOC entry 4930 (class 2606 OID 99229)
-- Name: prefactura_factura prefactura_factura_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura_factura
    ADD CONSTRAINT prefactura_factura_unique UNIQUE (id_prefactura, id_factura);


--
-- TOC entry 4918 (class 2606 OID 99184)
-- Name: prefactura_linea prefactura_linea_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura_linea
    ADD CONSTRAINT prefactura_linea_pkey PRIMARY KEY (id_prefactura_linea);


--
-- TOC entry 4912 (class 2606 OID 99143)
-- Name: prefactura prefactura_numero_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura
    ADD CONSTRAINT prefactura_numero_unique UNIQUE (id_empresa, numero_prefactura);


--
-- TOC entry 4914 (class 2606 OID 99141)
-- Name: prefactura prefactura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura
    ADD CONSTRAINT prefactura_pkey PRIMARY KEY (id_prefactura);


--
-- TOC entry 4968 (class 2606 OID 99442)
-- Name: presupuesto_linea presupuesto_linea_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presupuesto_linea
    ADD CONSTRAINT presupuesto_linea_pkey PRIMARY KEY (id_presupuesto_linea);


--
-- TOC entry 4964 (class 2606 OID 99416)
-- Name: presupuesto presupuesto_numero_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presupuesto
    ADD CONSTRAINT presupuesto_numero_unique UNIQUE (id_empresa, numero_presupuesto);


--
-- TOC entry 4966 (class 2606 OID 99414)
-- Name: presupuesto presupuesto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presupuesto
    ADD CONSTRAINT presupuesto_pkey PRIMARY KEY (id_presupuesto);


--
-- TOC entry 4729 (class 2606 OID 18554)
-- Name: provincia provincia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincia
    ADD CONSTRAINT provincia_pkey PRIMARY KEY (id_provincia);


--
-- TOC entry 5098 (class 2606 OID 221164)
-- Name: recepcion_detalle recepcion_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcion_detalle
    ADD CONSTRAINT recepcion_detalle_pkey PRIMARY KEY (id_recepcion_detalle);


--
-- TOC entry 5096 (class 2606 OID 221150)
-- Name: recepcion recepcion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcion
    ADD CONSTRAINT recepcion_pkey PRIMARY KEY (id_recepcion);


--
-- TOC entry 4980 (class 2606 OID 99517)
-- Name: retencion retencion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.retencion
    ADD CONSTRAINT retencion_pkey PRIMARY KEY (id_retencion);


--
-- TOC entry 5182 (class 2606 OID 240564)
-- Name: rol_socio rol_socio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_socio
    ADD CONSTRAINT rol_socio_pkey PRIMARY KEY (id_rol_socio);


--
-- TOC entry 4872 (class 2606 OID 98952)
-- Name: saldo_cuenta saldo_cuenta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saldo_cuenta
    ADD CONSTRAINT saldo_cuenta_pkey PRIMARY KEY (id_saldo_cuenta);


--
-- TOC entry 4874 (class 2606 OID 98954)
-- Name: saldo_cuenta saldo_cuenta_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saldo_cuenta
    ADD CONSTRAINT saldo_cuenta_unique UNIQUE (id_cuenta_contable, id_periodo_contable);


--
-- TOC entry 5049 (class 2606 OID 216434)
-- Name: secuencia_asiento secuencia_asiento_empresa_id_prefijo_diario_anio_mes_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secuencia_asiento
    ADD CONSTRAINT secuencia_asiento_empresa_id_prefijo_diario_anio_mes_key UNIQUE (empresa_id, prefijo_diario, anio, mes);


--
-- TOC entry 5051 (class 2606 OID 216432)
-- Name: secuencia_asiento secuencia_asiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secuencia_asiento
    ADD CONSTRAINT secuencia_asiento_pkey PRIMARY KEY (id);


--
-- TOC entry 4740 (class 2606 OID 18620)
-- Name: social_network social_network_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_network
    ADD CONSTRAINT social_network_nombre_key UNIQUE (nombre);


--
-- TOC entry 4742 (class 2606 OID 18618)
-- Name: social_network social_network_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_network
    ADD CONSTRAINT social_network_pkey PRIMARY KEY (id_red_social);


--
-- TOC entry 5186 (class 2606 OID 240573)
-- Name: socio socio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.socio
    ADD CONSTRAINT socio_pkey PRIMARY KEY (id_socio);


--
-- TOC entry 5190 (class 2606 OID 240586)
-- Name: socio_tercero socio_tercero_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.socio_tercero
    ADD CONSTRAINT socio_tercero_pkey PRIMARY KEY (id);


--
-- TOC entry 5070 (class 2606 OID 220954)
-- Name: stock_item_almacen stock_item_almacen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_item_almacen
    ADD CONSTRAINT stock_item_almacen_pkey PRIMARY KEY (id_stock_producto_almacen);


--
-- TOC entry 4696 (class 2606 OID 17288)
-- Name: sucursal sucursal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursal
    ADD CONSTRAINT sucursal_pkey PRIMARY KEY (id_sucursal);


--
-- TOC entry 5140 (class 2606 OID 223688)
-- Name: tamano_empresa tamano_empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tamano_empresa
    ADD CONSTRAINT tamano_empresa_pkey PRIMARY KEY (id_tamano_empresa);


--
-- TOC entry 4772 (class 2606 OID 22142)
-- Name: tercero tercero_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT tercero_pkey PRIMARY KEY (id_tercero);


--
-- TOC entry 4990 (class 2606 OID 99575)
-- Name: tipo_cambio tipo_cambio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_cambio
    ADD CONSTRAINT tipo_cambio_pkey PRIMARY KEY (id_tipo_cambio);


--
-- TOC entry 4992 (class 2606 OID 99577)
-- Name: tipo_cambio tipo_cambio_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_cambio
    ADD CONSTRAINT tipo_cambio_unique UNIQUE (id_empresa, id_moneda_origen, id_moneda_destino, fecha_cambio);


--
-- TOC entry 5178 (class 2606 OID 238311)
-- Name: tipo_comportamiento_item tipo_comportamiento_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_comportamiento_item
    ADD CONSTRAINT tipo_comportamiento_item_pkey PRIMARY KEY (id_tipo_comportamiento);


--
-- TOC entry 5116 (class 2606 OID 222453)
-- Name: tipo_control_caducidad_item tipo_control_caducidad_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_control_caducidad_item
    ADD CONSTRAINT tipo_control_caducidad_item_pkey PRIMARY KEY (id_tipo_control_caducidad);


--
-- TOC entry 5170 (class 2606 OID 237133)
-- Name: tipo_control_inventario_item tipo_control_inventario_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_control_inventario_item
    ADD CONSTRAINT tipo_control_inventario_item_pkey PRIMARY KEY (id_tipo_control_inventario);


--
-- TOC entry 4733 (class 2606 OID 18577)
-- Name: tipo_entidad_comercial tipo_entidad_comercial_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_entidad_comercial
    ADD CONSTRAINT tipo_entidad_comercial_nombre_key UNIQUE (nombre);


--
-- TOC entry 4735 (class 2606 OID 18575)
-- Name: tipo_entidad_comercial tipo_entidad_comercial_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_entidad_comercial
    ADD CONSTRAINT tipo_entidad_comercial_pkey PRIMARY KEY (id_tipo_entidad);


--
-- TOC entry 5122 (class 2606 OID 222473)
-- Name: tipo_item_catalogo tipo_item_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_item_catalogo
    ADD CONSTRAINT tipo_item_catalogo_pkey PRIMARY KEY (id_tipo_item);


--
-- TOC entry 5134 (class 2606 OID 222513)
-- Name: tipo_movimiento_contable_item tipo_movimiento_contable_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_movimiento_contable_item
    ADD CONSTRAINT tipo_movimiento_contable_item_pkey PRIMARY KEY (id_tipo_movimiento_contable);


--
-- TOC entry 4755 (class 2606 OID 22064)
-- Name: tipo_tercero_catalogo tipo_tercero_catalogo_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_tercero_catalogo
    ADD CONSTRAINT tipo_tercero_catalogo_nombre_key UNIQUE (nombre);


--
-- TOC entry 4757 (class 2606 OID 22062)
-- Name: tipo_tercero_catalogo tipo_tercero_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_tercero_catalogo
    ADD CONSTRAINT tipo_tercero_catalogo_pkey PRIMARY KEY (id_tipo_tercero);


--
-- TOC entry 5055 (class 2606 OID 219812)
-- Name: tipo_unidad_medida tipo_unidad_medida_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_unidad_medida
    ADD CONSTRAINT tipo_unidad_medida_codigo_key UNIQUE (codigo);


--
-- TOC entry 5057 (class 2606 OID 219810)
-- Name: tipo_unidad_medida tipo_unidad_medida_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_unidad_medida
    ADD CONSTRAINT tipo_unidad_medida_pkey PRIMARY KEY (id_tipo_unidad);


--
-- TOC entry 4776 (class 2606 OID 32165)
-- Name: tipos_miembro tipos_miembro_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_miembro
    ADD CONSTRAINT tipos_miembro_pkey PRIMARY KEY (id);


--
-- TOC entry 4997 (class 2606 OID 106305)
-- Name: titular_cuenta titular_cuenta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titular_cuenta
    ADD CONSTRAINT titular_cuenta_pkey PRIMARY KEY (id_titular_cuenta);


--
-- TOC entry 5088 (class 2606 OID 221080)
-- Name: transferencia_stock_detalle transferencia_stock_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencia_stock_detalle
    ADD CONSTRAINT transferencia_stock_detalle_pkey PRIMARY KEY (id_transferencia_stock_detalle);


--
-- TOC entry 5086 (class 2606 OID 221060)
-- Name: transferencia_stock transferencia_stock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencia_stock
    ADD CONSTRAINT transferencia_stock_pkey PRIMARY KEY (id_transferencia_stock);


--
-- TOC entry 4731 (class 2606 OID 18556)
-- Name: provincia uix_provincia_pais_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincia
    ADD CONSTRAINT uix_provincia_pais_nombre UNIQUE (id_pais, nombre);


--
-- TOC entry 5059 (class 2606 OID 219822)
-- Name: unidad_medida unidad_medida_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unidad_medida
    ADD CONSTRAINT unidad_medida_codigo_key UNIQUE (codigo);


--
-- TOC entry 5061 (class 2606 OID 219820)
-- Name: unidad_medida unidad_medida_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unidad_medida
    ADD CONSTRAINT unidad_medida_pkey PRIMARY KEY (id_unidad);


--
-- TOC entry 5066 (class 2606 OID 222395)
-- Name: almacen uq_almacen_empresa_ref; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.almacen
    ADD CONSTRAINT uq_almacen_empresa_ref UNIQUE (id_empresa, almacen_ref);


--
-- TOC entry 5102 (class 2606 OID 222366)
-- Name: categoria_item uq_categoria_item_empresa_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_item
    ADD CONSTRAINT uq_categoria_item_empresa_nombre UNIQUE (id_empresa, nombre);


--
-- TOC entry 4831 (class 2606 OID 222570)
-- Name: cuenta_contable_item uq_cuenta_contable_item; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_item
    ADD CONSTRAINT uq_cuenta_contable_item UNIQUE (id_item, id_empresa, id_tipo_movimiento_contable);


--
-- TOC entry 5152 (class 2606 OID 240546)
-- Name: directorio_documento uq_directorio_nombre_empresa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directorio_documento
    ADD CONSTRAINT uq_directorio_nombre_empresa UNIQUE (nombre, id_empresa);


--
-- TOC entry 5130 (class 2606 OID 222495)
-- Name: duracion_unidad_catalogo uq_duracion_unidad_catalogo_codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.duracion_unidad_catalogo
    ADD CONSTRAINT uq_duracion_unidad_catalogo_codigo UNIQUE (codigo);


--
-- TOC entry 5132 (class 2606 OID 222497)
-- Name: duracion_unidad_catalogo uq_duracion_unidad_catalogo_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.duracion_unidad_catalogo
    ADD CONSTRAINT uq_duracion_unidad_catalogo_nombre UNIQUE (nombre);


--
-- TOC entry 4753 (class 2606 OID 18695)
-- Name: empresa_horario_apertura uq_empresa_dia; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_horario_apertura
    ADD CONSTRAINT uq_empresa_dia UNIQUE (id_empresa, dia);


--
-- TOC entry 5112 (class 2606 OID 222430)
-- Name: estado_compra_item uq_estado_compra_item_codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_compra_item
    ADD CONSTRAINT uq_estado_compra_item_codigo UNIQUE (codigo);


--
-- TOC entry 5114 (class 2606 OID 222432)
-- Name: estado_compra_item uq_estado_compra_item_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_compra_item
    ADD CONSTRAINT uq_estado_compra_item_nombre UNIQUE (nombre);


--
-- TOC entry 5106 (class 2606 OID 222415)
-- Name: estado_venta_item uq_estado_venta_item_codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_venta_item
    ADD CONSTRAINT uq_estado_venta_item_codigo UNIQUE (codigo);


--
-- TOC entry 5108 (class 2606 OID 222417)
-- Name: estado_venta_item uq_estado_venta_item_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_venta_item
    ADD CONSTRAINT uq_estado_venta_item_nombre UNIQUE (nombre);


--
-- TOC entry 5026 (class 2606 OID 223697)
-- Name: item uq_item_codigo_barras; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT uq_item_codigo_barras UNIQUE (codigo_barras);


--
-- TOC entry 5160 (class 2606 OID 230415)
-- Name: item_etiqueta_categoria_det uq_item_etiqueta; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_etiqueta_categoria_det
    ADD CONSTRAINT uq_item_etiqueta UNIQUE (id_item, id_etiqueta_categoria);


--
-- TOC entry 5029 (class 2606 OID 222573)
-- Name: item uq_item_producto_empresa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT uq_item_producto_empresa UNIQUE (id_empresa, producto_ref);


--
-- TOC entry 5031 (class 2606 OID 223699)
-- Name: item uq_item_producto_ref; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT uq_item_producto_ref UNIQUE (producto_ref);


--
-- TOC entry 5078 (class 2606 OID 222397)
-- Name: item_lote_serie uq_lote_item; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_lote_serie
    ADD CONSTRAINT uq_lote_item UNIQUE (id_empresa, id_item, id_almacen, codigo_lote_serie);


--
-- TOC entry 5176 (class 2606 OID 237154)
-- Name: naturaleza_item_catalogo uq_naturaleza_item_catalogo_codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.naturaleza_item_catalogo
    ADD CONSTRAINT uq_naturaleza_item_catalogo_codigo UNIQUE (codigo);


--
-- TOC entry 5192 (class 2606 OID 240588)
-- Name: socio_tercero uq_socio_tercero_id_tercero; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.socio_tercero
    ADD CONSTRAINT uq_socio_tercero_id_tercero UNIQUE (id_tercero);


--
-- TOC entry 5072 (class 2606 OID 220956)
-- Name: stock_item_almacen uq_stock_item_almacen; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_item_almacen
    ADD CONSTRAINT uq_stock_item_almacen UNIQUE (id_item, id_almacen);


--
-- TOC entry 5142 (class 2606 OID 223695)
-- Name: tamano_empresa uq_tamano_empresa_codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tamano_empresa
    ADD CONSTRAINT uq_tamano_empresa_codigo UNIQUE (codigo);


--
-- TOC entry 5180 (class 2606 OID 238313)
-- Name: tipo_comportamiento_item uq_tipo_comportamiento_item_codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_comportamiento_item
    ADD CONSTRAINT uq_tipo_comportamiento_item_codigo UNIQUE (codigo);


--
-- TOC entry 5118 (class 2606 OID 222455)
-- Name: tipo_control_caducidad_item uq_tipo_control_caducidad_item_codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_control_caducidad_item
    ADD CONSTRAINT uq_tipo_control_caducidad_item_codigo UNIQUE (codigo);


--
-- TOC entry 5120 (class 2606 OID 222457)
-- Name: tipo_control_caducidad_item uq_tipo_control_caducidad_item_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_control_caducidad_item
    ADD CONSTRAINT uq_tipo_control_caducidad_item_nombre UNIQUE (nombre);


--
-- TOC entry 5172 (class 2606 OID 237135)
-- Name: tipo_control_inventario_item uq_tipo_control_inventario_item_codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_control_inventario_item
    ADD CONSTRAINT uq_tipo_control_inventario_item_codigo UNIQUE (codigo);


--
-- TOC entry 5124 (class 2606 OID 222475)
-- Name: tipo_item_catalogo uq_tipo_item_catalogo_codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_item_catalogo
    ADD CONSTRAINT uq_tipo_item_catalogo_codigo UNIQUE (codigo);


--
-- TOC entry 5126 (class 2606 OID 222477)
-- Name: tipo_item_catalogo uq_tipo_item_catalogo_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_item_catalogo
    ADD CONSTRAINT uq_tipo_item_catalogo_nombre UNIQUE (nombre);


--
-- TOC entry 5136 (class 2606 OID 222515)
-- Name: tipo_movimiento_contable_item uq_tipo_movimiento_contable_item_codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_movimiento_contable_item
    ADD CONSTRAINT uq_tipo_movimiento_contable_item_codigo UNIQUE (codigo);


--
-- TOC entry 5138 (class 2606 OID 222517)
-- Name: tipo_movimiento_contable_item uq_tipo_movimiento_contable_item_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_movimiento_contable_item
    ADD CONSTRAINT uq_tipo_movimiento_contable_item_nombre UNIQUE (nombre);


--
-- TOC entry 4702 (class 2606 OID 17357)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4704 (class 2606 OID 17359)
-- Name: usuario usuario_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_username_key UNIQUE (username);


--
-- TOC entry 4690 (class 2606 OID 17265)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4681 (class 2606 OID 17035)
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- TOC entry 4678 (class 2606 OID 17004)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4782 (class 2606 OID 119664)
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- TOC entry 4608 (class 2606 OID 16552)
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- TOC entry 5002 (class 2606 OID 119640)
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- TOC entry 4616 (class 2606 OID 16593)
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- TOC entry 4618 (class 2606 OID 16591)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4614 (class 2606 OID 16569)
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- TOC entry 4687 (class 2606 OID 17094)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- TOC entry 4685 (class 2606 OID 17079)
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- TOC entry 5005 (class 2606 OID 119650)
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- TOC entry 4603 (class 1259 OID 16530)
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- TOC entry 4577 (class 1259 OID 16746)
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 5032 (class 1259 OID 211974)
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- TOC entry 5033 (class 1259 OID 211973)
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- TOC entry 5034 (class 1259 OID 211971)
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- TOC entry 5039 (class 1259 OID 211972)
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- TOC entry 4578 (class 1259 OID 16748)
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4579 (class 1259 OID 16749)
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4634 (class 1259 OID 16827)
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- TOC entry 4667 (class 1259 OID 16935)
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- TOC entry 4622 (class 1259 OID 16915)
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- TOC entry 6074 (class 0 OID 0)
-- Dependencies: 4622
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- TOC entry 4627 (class 1259 OID 16743)
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- TOC entry 4670 (class 1259 OID 16932)
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- TOC entry 5006 (class 1259 OID 144212)
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- TOC entry 4671 (class 1259 OID 16933)
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- TOC entry 4642 (class 1259 OID 16938)
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- TOC entry 4639 (class 1259 OID 16799)
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- TOC entry 4640 (class 1259 OID 16944)
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- TOC entry 4832 (class 1259 OID 94245)
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- TOC entry 4784 (class 1259 OID 78690)
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- TOC entry 4839 (class 1259 OID 94271)
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- TOC entry 4840 (class 1259 OID 94269)
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- TOC entry 4845 (class 1259 OID 94270)
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- TOC entry 4674 (class 1259 OID 16991)
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- TOC entry 4675 (class 1259 OID 16990)
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- TOC entry 4676 (class 1259 OID 16992)
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- TOC entry 4580 (class 1259 OID 16750)
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4581 (class 1259 OID 16747)
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4590 (class 1259 OID 16513)
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- TOC entry 4591 (class 1259 OID 16514)
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- TOC entry 4592 (class 1259 OID 16742)
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- TOC entry 4595 (class 1259 OID 16829)
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- TOC entry 4598 (class 1259 OID 16934)
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- TOC entry 4661 (class 1259 OID 16871)
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- TOC entry 4662 (class 1259 OID 16936)
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- TOC entry 4663 (class 1259 OID 16886)
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- TOC entry 4666 (class 1259 OID 16885)
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- TOC entry 4628 (class 1259 OID 16937)
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- TOC entry 4629 (class 1259 OID 94283)
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- TOC entry 4632 (class 1259 OID 16828)
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- TOC entry 4653 (class 1259 OID 16853)
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- TOC entry 4656 (class 1259 OID 16852)
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- TOC entry 4651 (class 1259 OID 16838)
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- TOC entry 4652 (class 1259 OID 78669)
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- TOC entry 4641 (class 1259 OID 16997)
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- TOC entry 4633 (class 1259 OID 16826)
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- TOC entry 4582 (class 1259 OID 16906)
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- TOC entry 6075 (class 0 OID 0)
-- Dependencies: 4582
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- TOC entry 4583 (class 1259 OID 16744)
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- TOC entry 4584 (class 1259 OID 16503)
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- TOC entry 4585 (class 1259 OID 16961)
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- TOC entry 5165 (class 1259 OID 232693)
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- TOC entry 5168 (class 1259 OID 232692)
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- TOC entry 5161 (class 1259 OID 232675)
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- TOC entry 5164 (class 1259 OID 232676)
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- TOC entry 5064 (class 1259 OID 222393)
-- Name: idx_almacen_id_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_almacen_id_empresa ON public.almacen USING btree (id_empresa);


--
-- TOC entry 4862 (class 1259 OID 99621)
-- Name: idx_asiento_contable_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_asiento_contable_empresa ON public.asiento_contable USING btree (id_empresa);


--
-- TOC entry 4863 (class 1259 OID 99620)
-- Name: idx_asiento_contable_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_asiento_contable_fecha ON public.asiento_contable USING btree (fecha_asiento);


--
-- TOC entry 4985 (class 1259 OID 99642)
-- Name: idx_centro_costo_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_centro_costo_empresa ON public.centro_costo USING btree (id_empresa);


--
-- TOC entry 4995 (class 1259 OID 99644)
-- Name: idx_cierre_contable_periodo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cierre_contable_periodo ON public.cierre_contable USING btree (id_periodo_contable);


--
-- TOC entry 5011 (class 1259 OID 218668)
-- Name: idx_contacto_direccion_id_provincia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contacto_direccion_id_provincia ON public.contacto_direccion USING btree (id_provincia);


--
-- TOC entry 4898 (class 1259 OID 99645)
-- Name: idx_cotizacion_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_empresa ON public.cotizacion USING btree (id_empresa);


--
-- TOC entry 4899 (class 1259 OID 99648)
-- Name: idx_cotizacion_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_estado ON public.cotizacion USING btree (estado);


--
-- TOC entry 4900 (class 1259 OID 99647)
-- Name: idx_cotizacion_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_fecha ON public.cotizacion USING btree (fecha_cotizacion);


--
-- TOC entry 4904 (class 1259 OID 99649)
-- Name: idx_cotizacion_linea_cotizacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_linea_cotizacion ON public.cotizacion_linea USING btree (id_cotizacion);


--
-- TOC entry 4905 (class 1259 OID 99650)
-- Name: idx_cotizacion_linea_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_linea_item ON public.cotizacion_linea USING btree (id_item);


--
-- TOC entry 4923 (class 1259 OID 99658)
-- Name: idx_cotizacion_prefactura_cotizacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_prefactura_cotizacion ON public.cotizacion_prefactura USING btree (id_cotizacion);


--
-- TOC entry 4924 (class 1259 OID 99659)
-- Name: idx_cotizacion_prefactura_prefactura; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_prefactura_prefactura ON public.cotizacion_prefactura USING btree (id_prefactura);


--
-- TOC entry 4901 (class 1259 OID 99646)
-- Name: idx_cotizacion_tercero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_tercero ON public.cotizacion USING btree (id_tercero);


--
-- TOC entry 4803 (class 1259 OID 99618)
-- Name: idx_cuenta_contable_codigo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cuenta_contable_codigo ON public.cuenta_contable USING btree (codigo);


--
-- TOC entry 4828 (class 1259 OID 221210)
-- Name: idx_cuenta_contable_item_id_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cuenta_contable_item_id_item ON public.cuenta_contable_item USING btree (id_item);


--
-- TOC entry 4829 (class 1259 OID 222540)
-- Name: idx_cuenta_contable_item_tipo_mov; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cuenta_contable_item_tipo_mov ON public.cuenta_contable_item USING btree (id_tipo_movimiento_contable);


--
-- TOC entry 4804 (class 1259 OID 99619)
-- Name: idx_cuenta_contable_plan; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cuenta_contable_plan ON public.cuenta_contable USING btree (id_plan_contable);


--
-- TOC entry 5147 (class 1259 OID 228170)
-- Name: idx_directorio_documento_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_directorio_documento_estado ON public.directorio_documento USING btree (estado);


--
-- TOC entry 5148 (class 1259 OID 228169)
-- Name: idx_directorio_documento_modulo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_directorio_documento_modulo ON public.directorio_documento USING btree (modulo);


--
-- TOC entry 5149 (class 1259 OID 228171)
-- Name: idx_directorio_documento_orden; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_directorio_documento_orden ON public.directorio_documento USING btree (orden);


--
-- TOC entry 5150 (class 1259 OID 228168)
-- Name: idx_directorio_documento_padre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_directorio_documento_padre ON public.directorio_documento USING btree (id_directorio_padre);


--
-- TOC entry 4879 (class 1259 OID 99624)
-- Name: idx_documento_origen_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documento_origen_empresa ON public.documento_origen USING btree (id_empresa);


--
-- TOC entry 5091 (class 1259 OID 221193)
-- Name: idx_envio_tercero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_envio_tercero ON public.envio USING btree (id_tercero);


--
-- TOC entry 4745 (class 1259 OID 18649)
-- Name: idx_ers_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ers_empresa ON public.empresa_red_social USING btree (id_empresa);


--
-- TOC entry 4746 (class 1259 OID 18650)
-- Name: idx_ers_red_social; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ers_red_social ON public.empresa_red_social USING btree (id_red_social);


--
-- TOC entry 4888 (class 1259 OID 99625)
-- Name: idx_factura_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_factura_empresa ON public.factura USING btree (id_empresa);


--
-- TOC entry 4889 (class 1259 OID 99628)
-- Name: idx_factura_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_factura_estado ON public.factura USING btree (estado);


--
-- TOC entry 4890 (class 1259 OID 99627)
-- Name: idx_factura_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_factura_fecha ON public.factura USING btree (fecha_factura);


--
-- TOC entry 4891 (class 1259 OID 99626)
-- Name: idx_factura_tercero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_factura_tercero ON public.factura USING btree (id_tercero);


--
-- TOC entry 4933 (class 1259 OID 99664)
-- Name: idx_historial_conversion_destino; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_conversion_destino ON public.historial_conversion USING btree (tipo_destino, id_documento_destino);


--
-- TOC entry 4934 (class 1259 OID 99662)
-- Name: idx_historial_conversion_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_conversion_empresa ON public.historial_conversion USING btree (id_empresa);


--
-- TOC entry 4935 (class 1259 OID 99663)
-- Name: idx_historial_conversion_origen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_conversion_origen ON public.historial_conversion USING btree (tipo_origen, id_documento_origen);


--
-- TOC entry 5079 (class 1259 OID 221191)
-- Name: idx_inventario_almacen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventario_almacen ON public.inventario USING btree (id_almacen);


--
-- TOC entry 5082 (class 1259 OID 221192)
-- Name: idx_inventario_detalle_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventario_detalle_item ON public.inventario_detalle USING btree (id_item);


--
-- TOC entry 5012 (class 1259 OID 222385)
-- Name: idx_item_almacen_defecto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_almacen_defecto ON public.item USING btree (id_almacen_defecto);


--
-- TOC entry 5013 (class 1259 OID 222384)
-- Name: idx_item_categoria; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_categoria ON public.item USING btree (id_categoria_item);


--
-- TOC entry 5014 (class 1259 OID 222386)
-- Name: idx_item_codigo_barras; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_codigo_barras ON public.item USING btree (codigo_barras);


--
-- TOC entry 5153 (class 1259 OID 240552)
-- Name: idx_item_etiqueta_categoria_empresa_tipo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_etiqueta_categoria_empresa_tipo ON public.item_etiqueta_categoria USING btree (id_empresa, id_tipo_item);


--
-- TOC entry 5154 (class 1259 OID 240553)
-- Name: idx_item_etiqueta_categoria_tipo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_etiqueta_categoria_tipo ON public.item_etiqueta_categoria USING btree (id_tipo_item);


--
-- TOC entry 5015 (class 1259 OID 208603)
-- Name: idx_item_id_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_id_empresa ON public.item USING btree (id_empresa);


--
-- TOC entry 5016 (class 1259 OID 221238)
-- Name: idx_item_id_unidad_longitud; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_id_unidad_longitud ON public.item USING btree (id_unidad_longitud);


--
-- TOC entry 5017 (class 1259 OID 221236)
-- Name: idx_item_id_unidad_medida; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_id_unidad_medida ON public.item USING btree (id_unidad_medida);


--
-- TOC entry 5018 (class 1259 OID 221237)
-- Name: idx_item_id_unidad_peso; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_id_unidad_peso ON public.item USING btree (id_unidad_peso);


--
-- TOC entry 5019 (class 1259 OID 221239)
-- Name: idx_item_id_unidad_superficie; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_id_unidad_superficie ON public.item USING btree (id_unidad_superficie);


--
-- TOC entry 5020 (class 1259 OID 221240)
-- Name: idx_item_id_unidad_volumen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_id_unidad_volumen ON public.item USING btree (id_unidad_volumen);


--
-- TOC entry 5073 (class 1259 OID 221189)
-- Name: idx_item_lote_almacen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_lote_almacen ON public.item_lote_serie USING btree (id_almacen);


--
-- TOC entry 5021 (class 1259 OID 208604)
-- Name: idx_item_producto_ref; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_producto_ref ON public.item USING btree (producto_ref);


--
-- TOC entry 5022 (class 1259 OID 238319)
-- Name: idx_item_tipo_comportamiento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_tipo_comportamiento ON public.item USING btree (id_tipo_comportamiento);


--
-- TOC entry 5074 (class 1259 OID 221188)
-- Name: idx_lote_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lote_item ON public.item_lote_serie USING btree (id_item);


--
-- TOC entry 5040 (class 1259 OID 228180)
-- Name: idx_media_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_estado ON public.media USING btree (estado);


--
-- TOC entry 5041 (class 1259 OID 228178)
-- Name: idx_media_id_directorio_documento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_id_directorio_documento ON public.media USING btree (id_directorio_documento);


--
-- TOC entry 5042 (class 1259 OID 213089)
-- Name: idx_media_module; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_module ON public.media USING btree (module);


--
-- TOC entry 5043 (class 1259 OID 213090)
-- Name: idx_media_module_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_module_id ON public.media USING btree (module_id);


--
-- TOC entry 5044 (class 1259 OID 213091)
-- Name: idx_media_module_module_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_module_module_id ON public.media USING btree (module, module_id);


--
-- TOC entry 4709 (class 1259 OID 85337)
-- Name: idx_menu_item_created_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_menu_item_created_by ON public.menu_item USING btree (created_by);


--
-- TOC entry 4710 (class 1259 OID 85335)
-- Name: idx_menu_item_es_clickable; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_menu_item_es_clickable ON public.menu_item USING btree (es_clickable);


--
-- TOC entry 4711 (class 1259 OID 85336)
-- Name: idx_menu_item_muestra_badge; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_menu_item_muestra_badge ON public.menu_item USING btree (muestra_badge);


--
-- TOC entry 4712 (class 1259 OID 17402)
-- Name: idx_menu_item_parent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_menu_item_parent ON public.menu_item USING btree (parent_id);


--
-- TOC entry 4713 (class 1259 OID 17403)
-- Name: idx_menu_item_seccion_orden; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_menu_item_seccion_orden ON public.menu_item USING btree (id_seccion, orden);


--
-- TOC entry 4998 (class 1259 OID 106394)
-- Name: idx_mov_empresa_cuenta_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mov_empresa_cuenta_fecha ON public.movimiento_cuenta USING btree (id_empresa, id_cuenta_financiera, fecha_movimiento);


--
-- TOC entry 4951 (class 1259 OID 99632)
-- Name: idx_movimiento_bancario_cuenta; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_bancario_cuenta ON public.movimiento_bancario USING btree (id_cuenta_bancaria);


--
-- TOC entry 4952 (class 1259 OID 99633)
-- Name: idx_movimiento_bancario_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_bancario_fecha ON public.movimiento_bancario USING btree (fecha_movimiento);


--
-- TOC entry 4953 (class 1259 OID 228151)
-- Name: idx_movimiento_bancario_reversado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_bancario_reversado ON public.movimiento_bancario USING btree (id_movimiento_reversado);


--
-- TOC entry 4864 (class 1259 OID 99622)
-- Name: idx_movimiento_contable_asiento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_contable_asiento ON public.movimiento_contable USING btree (id_asiento_contable);


--
-- TOC entry 4956 (class 1259 OID 221190)
-- Name: idx_movimiento_inventario_almacen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_inventario_almacen ON public.movimiento_inventario USING btree (id_almacen);


--
-- TOC entry 4957 (class 1259 OID 99635)
-- Name: idx_movimiento_inventario_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_inventario_fecha ON public.movimiento_inventario USING btree (fecha_movimiento);


--
-- TOC entry 4958 (class 1259 OID 99634)
-- Name: idx_movimiento_inventario_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_inventario_item ON public.movimiento_inventario USING btree (id_item);


--
-- TOC entry 4969 (class 1259 OID 99638)
-- Name: idx_nota_credito_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nota_credito_empresa ON public.nota_credito USING btree (id_empresa);


--
-- TOC entry 4970 (class 1259 OID 99639)
-- Name: idx_nota_credito_factura; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nota_credito_factura ON public.nota_credito USING btree (id_factura);


--
-- TOC entry 4936 (class 1259 OID 99629)
-- Name: idx_pago_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pago_empresa ON public.pago USING btree (id_empresa);


--
-- TOC entry 4937 (class 1259 OID 99631)
-- Name: idx_pago_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pago_fecha ON public.pago USING btree (fecha_pago);


--
-- TOC entry 4938 (class 1259 OID 99630)
-- Name: idx_pago_tercero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pago_tercero ON public.pago USING btree (id_tercero);


--
-- TOC entry 4805 (class 1259 OID 99623)
-- Name: idx_periodo_contable_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_periodo_contable_empresa ON public.periodo_contable USING btree (id_empresa);


--
-- TOC entry 4906 (class 1259 OID 99653)
-- Name: idx_prefactura_cotizacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_cotizacion ON public.prefactura USING btree (id_cotizacion);


--
-- TOC entry 4907 (class 1259 OID 99651)
-- Name: idx_prefactura_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_empresa ON public.prefactura USING btree (id_empresa);


--
-- TOC entry 4908 (class 1259 OID 99655)
-- Name: idx_prefactura_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_estado ON public.prefactura USING btree (estado);


--
-- TOC entry 4925 (class 1259 OID 99661)
-- Name: idx_prefactura_factura_factura; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_factura_factura ON public.prefactura_factura USING btree (id_factura);


--
-- TOC entry 4926 (class 1259 OID 99660)
-- Name: idx_prefactura_factura_prefactura; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_factura_prefactura ON public.prefactura_factura USING btree (id_prefactura);


--
-- TOC entry 4909 (class 1259 OID 99654)
-- Name: idx_prefactura_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_fecha ON public.prefactura USING btree (fecha_prefactura);


--
-- TOC entry 4915 (class 1259 OID 99657)
-- Name: idx_prefactura_linea_cotizacion_linea; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_linea_cotizacion_linea ON public.prefactura_linea USING btree (id_cotizacion_linea);


--
-- TOC entry 4916 (class 1259 OID 99656)
-- Name: idx_prefactura_linea_prefactura; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_linea_prefactura ON public.prefactura_linea USING btree (id_prefactura);


--
-- TOC entry 4910 (class 1259 OID 99652)
-- Name: idx_prefactura_tercero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_tercero ON public.prefactura USING btree (id_tercero);


--
-- TOC entry 4961 (class 1259 OID 99636)
-- Name: idx_presupuesto_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_presupuesto_empresa ON public.presupuesto USING btree (id_empresa);


--
-- TOC entry 4962 (class 1259 OID 99637)
-- Name: idx_presupuesto_tercero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_presupuesto_tercero ON public.presupuesto USING btree (id_tercero);


--
-- TOC entry 5094 (class 1259 OID 221194)
-- Name: idx_recepcion_tercero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recepcion_tercero ON public.recepcion USING btree (id_tercero);


--
-- TOC entry 4977 (class 1259 OID 99640)
-- Name: idx_retencion_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_retencion_empresa ON public.retencion USING btree (id_empresa);


--
-- TOC entry 4978 (class 1259 OID 99641)
-- Name: idx_retencion_tercero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_retencion_tercero ON public.retencion USING btree (id_tercero);


--
-- TOC entry 5047 (class 1259 OID 216435)
-- Name: idx_secuencia_asiento_empresa_prefijo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_secuencia_asiento_empresa_prefijo ON public.secuencia_asiento USING btree (empresa_id, prefijo_diario, anio, mes);


--
-- TOC entry 5183 (class 1259 OID 240599)
-- Name: idx_socio_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_socio_estado ON public.socio USING btree (estado);


--
-- TOC entry 5184 (class 1259 OID 240600)
-- Name: idx_socio_rol; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_socio_rol ON public.socio USING btree (id_rol_socio);


--
-- TOC entry 5187 (class 1259 OID 240601)
-- Name: idx_socio_tercero_socio; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_socio_tercero_socio ON public.socio_tercero USING btree (id_socio);


--
-- TOC entry 5188 (class 1259 OID 240603)
-- Name: idx_socio_tercero_tercero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_socio_tercero_tercero ON public.socio_tercero USING btree (id_tercero);


--
-- TOC entry 5067 (class 1259 OID 221187)
-- Name: idx_stock_item_almacen_almacen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_item_almacen_almacen ON public.stock_item_almacen USING btree (id_almacen);


--
-- TOC entry 5068 (class 1259 OID 221186)
-- Name: idx_stock_item_almacen_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_item_almacen_item ON public.stock_item_almacen USING btree (id_item);


--
-- TOC entry 4770 (class 1259 OID 218662)
-- Name: idx_tercero_id_provincia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tercero_id_provincia ON public.tercero USING btree (id_provincia);


--
-- TOC entry 4988 (class 1259 OID 99643)
-- Name: idx_tipo_cambio_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tipo_cambio_fecha ON public.tipo_cambio USING btree (fecha_cambio);


--
-- TOC entry 4749 (class 1259 OID 18685)
-- Name: uk_contable_externo_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uk_contable_externo_empresa ON public.contable_externo USING btree (id_empresa);


--
-- TOC entry 4738 (class 1259 OID 18607)
-- Name: uk_empresa_identificacion_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uk_empresa_identificacion_empresa ON public.empresa_identificacion USING btree (id_empresa);


--
-- TOC entry 5027 (class 1259 OID 222387)
-- Name: uq_item_empresa_codigo_barras; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_item_empresa_codigo_barras ON public.item USING btree (id_empresa, codigo_barras) WHERE (codigo_barras IS NOT NULL);


--
-- TOC entry 4679 (class 1259 OID 17266)
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- TOC entry 4688 (class 1259 OID 78668)
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- TOC entry 4682 (class 1259 OID 231545)
-- Name: subscription_subscription_id_entity_filters_action_filter_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_key ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter);


--
-- TOC entry 4606 (class 1259 OID 16558)
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- TOC entry 4609 (class 1259 OID 16580)
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- TOC entry 4783 (class 1259 OID 119665)
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- TOC entry 4683 (class 1259 OID 17105)
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- TOC entry 4610 (class 1259 OID 17070)
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- TOC entry 4611 (class 1259 OID 231538)
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- TOC entry 4612 (class 1259 OID 16581)
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- TOC entry 5003 (class 1259 OID 119656)
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- TOC entry 5446 (class 2620 OID 106396)
-- Name: movimiento_cuenta tg_heredar_empresa_movimiento; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_heredar_empresa_movimiento BEFORE INSERT ON public.movimiento_cuenta FOR EACH ROW EXECUTE FUNCTION public.trg_heredar_empresa_movimiento();


--
-- TOC entry 5447 (class 2620 OID 208606)
-- Name: item trg_producto_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_producto_updated_at BEFORE UPDATE ON public.item FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5445 (class 2620 OID 17124)
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- TOC entry 5441 (class 2620 OID 53234)
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- TOC entry 5442 (class 2620 OID 231540)
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- TOC entry 5443 (class 2620 OID 231541)
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- TOC entry 5444 (class 2620 OID 17058)
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- TOC entry 5195 (class 2606 OID 16730)
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5200 (class 2606 OID 16819)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 5199 (class 2606 OID 16807)
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- TOC entry 5198 (class 2606 OID 16794)
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5276 (class 2606 OID 94235)
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- TOC entry 5277 (class 2606 OID 94240)
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5278 (class 2606 OID 94264)
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- TOC entry 5279 (class 2606 OID 94259)
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5205 (class 2606 OID 16985)
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5193 (class 2606 OID 16763)
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 5202 (class 2606 OID 16866)
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 5203 (class 2606 OID 16939)
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- TOC entry 5204 (class 2606 OID 16880)
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 5196 (class 2606 OID 94278)
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- TOC entry 5197 (class 2606 OID 16758)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5201 (class 2606 OID 16847)
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 5437 (class 2606 OID 232687)
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5436 (class 2606 OID 232670)
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5287 (class 2606 OID 98877)
-- Name: asiento_contable asiento_contable_id_diario_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento_contable
    ADD CONSTRAINT asiento_contable_id_diario_contable_fkey FOREIGN KEY (id_diario_contable) REFERENCES public.diario_contable(id_diario_contable) ON DELETE RESTRICT;


--
-- TOC entry 5288 (class 2606 OID 98872)
-- Name: asiento_contable asiento_contable_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento_contable
    ADD CONSTRAINT asiento_contable_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5289 (class 2606 OID 98887)
-- Name: asiento_contable asiento_contable_id_usuario_aprobacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento_contable
    ADD CONSTRAINT asiento_contable_id_usuario_aprobacion_fkey FOREIGN KEY (id_usuario_aprobacion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5290 (class 2606 OID 98882)
-- Name: asiento_contable asiento_contable_id_usuario_creacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento_contable
    ADD CONSTRAINT asiento_contable_id_usuario_creacion_fkey FOREIGN KEY (id_usuario_creacion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5291 (class 2606 OID 216418)
-- Name: asiento_contable asiento_contable_reversed_entry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento_contable
    ADD CONSTRAINT asiento_contable_reversed_entry_id_fkey FOREIGN KEY (reversed_entry_id) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE SET NULL;


--
-- TOC entry 5363 (class 2606 OID 99546)
-- Name: centro_costo centro_costo_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.centro_costo
    ADD CONSTRAINT centro_costo_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5369 (class 2606 OID 99603)
-- Name: cierre_contable cierre_contable_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_contable
    ADD CONSTRAINT cierre_contable_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5370 (class 2606 OID 99608)
-- Name: cierre_contable cierre_contable_id_periodo_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_contable
    ADD CONSTRAINT cierre_contable_id_periodo_contable_fkey FOREIGN KEY (id_periodo_contable) REFERENCES public.periodo_contable(id_periodo_contable) ON DELETE RESTRICT;


--
-- TOC entry 5371 (class 2606 OID 99613)
-- Name: cierre_contable cierre_contable_id_usuario_cierre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_contable
    ADD CONSTRAINT cierre_contable_id_usuario_cierre_fkey FOREIGN KEY (id_usuario_cierre) REFERENCES public.usuario(id_usuario) ON DELETE RESTRICT;


--
-- TOC entry 5280 (class 2606 OID 98812)
-- Name: cierre_cuenta cierre_cuenta_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_cuenta
    ADD CONSTRAINT cierre_cuenta_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE RESTRICT;


--
-- TOC entry 5281 (class 2606 OID 98802)
-- Name: cierre_cuenta cierre_cuenta_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_cuenta
    ADD CONSTRAINT cierre_cuenta_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5282 (class 2606 OID 98807)
-- Name: cierre_cuenta cierre_cuenta_id_periodo_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_cuenta
    ADD CONSTRAINT cierre_cuenta_id_periodo_contable_fkey FOREIGN KEY (id_periodo_contable) REFERENCES public.periodo_contable(id_periodo_contable) ON DELETE RESTRICT;


--
-- TOC entry 5283 (class 2606 OID 98817)
-- Name: cierre_cuenta cierre_cuenta_id_usuario_cierre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_cuenta
    ADD CONSTRAINT cierre_cuenta_id_usuario_cierre_fkey FOREIGN KEY (id_usuario_cierre) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5336 (class 2606 OID 99335)
-- Name: conciliacion_bancaria conciliacion_bancaria_id_cuenta_bancaria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conciliacion_bancaria
    ADD CONSTRAINT conciliacion_bancaria_id_cuenta_bancaria_fkey FOREIGN KEY (id_cuenta_bancaria) REFERENCES public.cuenta_bancaria(id_cuenta_bancaria) ON DELETE RESTRICT;


--
-- TOC entry 5337 (class 2606 OID 99330)
-- Name: conciliacion_bancaria conciliacion_bancaria_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conciliacion_bancaria
    ADD CONSTRAINT conciliacion_bancaria_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5338 (class 2606 OID 99340)
-- Name: conciliacion_bancaria conciliacion_bancaria_id_periodo_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conciliacion_bancaria
    ADD CONSTRAINT conciliacion_bancaria_id_periodo_contable_fkey FOREIGN KEY (id_periodo_contable) REFERENCES public.periodo_contable(id_periodo_contable) ON DELETE RESTRICT;


--
-- TOC entry 5339 (class 2606 OID 99345)
-- Name: conciliacion_bancaria conciliacion_bancaria_id_usuario_conciliacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conciliacion_bancaria
    ADD CONSTRAINT conciliacion_bancaria_id_usuario_conciliacion_fkey FOREIGN KEY (id_usuario_conciliacion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5252 (class 2606 OID 93124)
-- Name: configuracion_contabilidad configuracion_contabilidad_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_contabilidad
    ADD CONSTRAINT configuracion_contabilidad_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5253 (class 2606 OID 93129)
-- Name: configuracion_contabilidad configuracion_contabilidad_id_moneda_base_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_contabilidad
    ADD CONSTRAINT configuracion_contabilidad_id_moneda_base_fkey FOREIGN KEY (id_moneda_base) REFERENCES public.moneda(id_moneda) ON DELETE RESTRICT;


--
-- TOC entry 5232 (class 2606 OID 18675)
-- Name: contable_externo contable_externo_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contable_externo
    ADD CONSTRAINT contable_externo_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5233 (class 2606 OID 18660)
-- Name: contable_externo contable_externo_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contable_externo
    ADD CONSTRAINT contable_externo_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE CASCADE;


--
-- TOC entry 5234 (class 2606 OID 18665)
-- Name: contable_externo contable_externo_id_pais_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contable_externo
    ADD CONSTRAINT contable_externo_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES public.pais(id_pais) ON DELETE SET NULL;


--
-- TOC entry 5235 (class 2606 OID 18670)
-- Name: contable_externo contable_externo_id_provincia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contable_externo
    ADD CONSTRAINT contable_externo_id_provincia_fkey FOREIGN KEY (id_provincia) REFERENCES public.provincia(id_provincia) ON DELETE SET NULL;


--
-- TOC entry 5236 (class 2606 OID 18680)
-- Name: contable_externo contable_externo_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contable_externo
    ADD CONSTRAINT contable_externo_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5310 (class 2606 OID 99088)
-- Name: cotizacion cotizacion_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5311 (class 2606 OID 99093)
-- Name: cotizacion cotizacion_id_tercero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_id_tercero_fkey FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE RESTRICT;


--
-- TOC entry 5312 (class 2606 OID 99103)
-- Name: cotizacion cotizacion_id_usuario_aprobacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_id_usuario_aprobacion_fkey FOREIGN KEY (id_usuario_aprobacion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5313 (class 2606 OID 99098)
-- Name: cotizacion cotizacion_id_usuario_creacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_id_usuario_creacion_fkey FOREIGN KEY (id_usuario_creacion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5314 (class 2606 OID 99119)
-- Name: cotizacion_linea cotizacion_linea_id_cotizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_linea
    ADD CONSTRAINT cotizacion_linea_id_cotizacion_fkey FOREIGN KEY (id_cotizacion) REFERENCES public.cotizacion(id_cotizacion) ON DELETE RESTRICT;


--
-- TOC entry 5323 (class 2606 OID 99210)
-- Name: cotizacion_prefactura cotizacion_prefactura_id_cotizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_prefactura
    ADD CONSTRAINT cotizacion_prefactura_id_cotizacion_fkey FOREIGN KEY (id_cotizacion) REFERENCES public.cotizacion(id_cotizacion) ON DELETE RESTRICT;


--
-- TOC entry 5324 (class 2606 OID 99215)
-- Name: cotizacion_prefactura cotizacion_prefactura_id_prefactura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_prefactura
    ADD CONSTRAINT cotizacion_prefactura_id_prefactura_fkey FOREIGN KEY (id_prefactura) REFERENCES public.prefactura(id_prefactura) ON DELETE RESTRICT;


--
-- TOC entry 5263 (class 2606 OID 93297)
-- Name: cuenta_bancaria cuenta_bancaria_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_bancaria
    ADD CONSTRAINT cuenta_bancaria_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE SET NULL;


--
-- TOC entry 5264 (class 2606 OID 93282)
-- Name: cuenta_bancaria cuenta_bancaria_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_bancaria
    ADD CONSTRAINT cuenta_bancaria_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5265 (class 2606 OID 93292)
-- Name: cuenta_bancaria cuenta_bancaria_id_moneda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_bancaria
    ADD CONSTRAINT cuenta_bancaria_id_moneda_fkey FOREIGN KEY (id_moneda) REFERENCES public.moneda(id_moneda) ON DELETE RESTRICT;


--
-- TOC entry 5261 (class 2606 OID 93264)
-- Name: cuenta_contable_defecto cuenta_contable_defecto_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_defecto
    ADD CONSTRAINT cuenta_contable_defecto_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE RESTRICT;


--
-- TOC entry 5262 (class 2606 OID 93259)
-- Name: cuenta_contable_defecto cuenta_contable_defecto_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_defecto
    ADD CONSTRAINT cuenta_contable_defecto_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5257 (class 2606 OID 93220)
-- Name: cuenta_contable cuenta_contable_id_cuenta_padre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable
    ADD CONSTRAINT cuenta_contable_id_cuenta_padre_fkey FOREIGN KEY (id_cuenta_padre) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE SET NULL;


--
-- TOC entry 5258 (class 2606 OID 93215)
-- Name: cuenta_contable cuenta_contable_id_plan_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable
    ADD CONSTRAINT cuenta_contable_id_plan_contable_fkey FOREIGN KEY (id_plan_contable) REFERENCES public.plan_contable(id_plan_contable) ON DELETE RESTRICT;


--
-- TOC entry 5285 (class 2606 OID 98854)
-- Name: cuenta_grupo_personalizado cuenta_grupo_personalizado_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_grupo_personalizado
    ADD CONSTRAINT cuenta_grupo_personalizado_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE RESTRICT;


--
-- TOC entry 5286 (class 2606 OID 98849)
-- Name: cuenta_grupo_personalizado cuenta_grupo_personalizado_id_grupo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_grupo_personalizado
    ADD CONSTRAINT cuenta_grupo_personalizado_id_grupo_fkey FOREIGN KEY (id_grupo_cuenta_personalizado) REFERENCES public.grupo_cuenta_personalizado(id_grupo_cuenta_personalizado) ON DELETE RESTRICT;


--
-- TOC entry 5270 (class 2606 OID 93339)
-- Name: cuenta_impuesto cuenta_impuesto_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_impuesto
    ADD CONSTRAINT cuenta_impuesto_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE RESTRICT;


--
-- TOC entry 5271 (class 2606 OID 93334)
-- Name: cuenta_impuesto cuenta_impuesto_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_impuesto
    ADD CONSTRAINT cuenta_impuesto_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5268 (class 2606 OID 93318)
-- Name: cuenta_iva cuenta_iva_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_iva
    ADD CONSTRAINT cuenta_iva_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE RESTRICT;


--
-- TOC entry 5269 (class 2606 OID 93313)
-- Name: cuenta_iva cuenta_iva_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_iva
    ADD CONSTRAINT cuenta_iva_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5254 (class 2606 OID 93161)
-- Name: diario_contable diario_contable_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diario_contable
    ADD CONSTRAINT diario_contable_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5300 (class 2606 OID 98991)
-- Name: documento_origen documento_origen_id_asiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_origen
    ADD CONSTRAINT documento_origen_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE SET NULL;


--
-- TOC entry 5301 (class 2606 OID 98981)
-- Name: documento_origen documento_origen_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_origen
    ADD CONSTRAINT documento_origen_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5302 (class 2606 OID 98986)
-- Name: documento_origen documento_origen_id_tercero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_origen
    ADD CONSTRAINT documento_origen_id_tercero_fkey FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE SET NULL;


--
-- TOC entry 5303 (class 2606 OID 98996)
-- Name: documento_origen documento_origen_id_usuario_contabilizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_origen
    ADD CONSTRAINT documento_origen_id_usuario_contabilizacion_fkey FOREIGN KEY (id_usuario_contabilizacion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5237 (class 2606 OID 18701)
-- Name: empresa_horario_apertura empresa_horario_apertura_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_horario_apertura
    ADD CONSTRAINT empresa_horario_apertura_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5238 (class 2606 OID 18696)
-- Name: empresa_horario_apertura empresa_horario_apertura_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_horario_apertura
    ADD CONSTRAINT empresa_horario_apertura_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE CASCADE;


--
-- TOC entry 5239 (class 2606 OID 18706)
-- Name: empresa_horario_apertura empresa_horario_apertura_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_horario_apertura
    ADD CONSTRAINT empresa_horario_apertura_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5209 (class 2606 OID 18536)
-- Name: empresa empresa_id_moneda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_id_moneda_fkey FOREIGN KEY (id_moneda) REFERENCES public.moneda(id_moneda) ON DELETE RESTRICT;


--
-- TOC entry 5210 (class 2606 OID 18541)
-- Name: empresa empresa_id_pais_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES public.pais(id_pais) ON DELETE RESTRICT;


--
-- TOC entry 5211 (class 2606 OID 18562)
-- Name: empresa empresa_id_provincia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_id_provincia_fkey FOREIGN KEY (id_provincia) REFERENCES public.provincia(id_provincia) ON DELETE SET NULL;


--
-- TOC entry 5224 (class 2606 OID 18597)
-- Name: empresa_identificacion empresa_identificacion_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_identificacion
    ADD CONSTRAINT empresa_identificacion_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5225 (class 2606 OID 18587)
-- Name: empresa_identificacion empresa_identificacion_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_identificacion
    ADD CONSTRAINT empresa_identificacion_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE CASCADE;


--
-- TOC entry 5226 (class 2606 OID 18592)
-- Name: empresa_identificacion empresa_identificacion_id_tipo_entidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_identificacion
    ADD CONSTRAINT empresa_identificacion_id_tipo_entidad_fkey FOREIGN KEY (id_tipo_entidad) REFERENCES public.tipo_entidad_comercial(id_tipo_entidad);


--
-- TOC entry 5227 (class 2606 OID 18602)
-- Name: empresa_identificacion empresa_identificacion_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_identificacion
    ADD CONSTRAINT empresa_identificacion_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5228 (class 2606 OID 18639)
-- Name: empresa_red_social empresa_red_social_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_red_social
    ADD CONSTRAINT empresa_red_social_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5229 (class 2606 OID 18629)
-- Name: empresa_red_social empresa_red_social_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_red_social
    ADD CONSTRAINT empresa_red_social_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE CASCADE;


--
-- TOC entry 5230 (class 2606 OID 18634)
-- Name: empresa_red_social empresa_red_social_id_red_social_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_red_social
    ADD CONSTRAINT empresa_red_social_id_red_social_fkey FOREIGN KEY (id_red_social) REFERENCES public.social_network(id_red_social) ON DELETE RESTRICT;


--
-- TOC entry 5231 (class 2606 OID 18644)
-- Name: empresa_red_social empresa_red_social_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_red_social
    ADD CONSTRAINT empresa_red_social_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5305 (class 2606 OID 99042)
-- Name: factura factura_id_asiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE SET NULL;


--
-- TOC entry 5306 (class 2606 OID 99032)
-- Name: factura factura_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5307 (class 2606 OID 99037)
-- Name: factura factura_id_tercero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_id_tercero_fkey FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE RESTRICT;


--
-- Name: factura factura_id_condicion_pago_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_id_condicion_pago_fkey FOREIGN KEY (id_condicion_pago) REFERENCES public.condicion_pago_catalogo(id_condicion_pago) ON DELETE SET NULL;


--
-- Name: factura factura_id_forma_pago_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_id_forma_pago_fkey FOREIGN KEY (id_forma_pago) REFERENCES public.forma_pago_catalogo(id_forma_pago) ON DELETE SET NULL;


--
-- Name: factura factura_id_cuenta_bancaria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_id_cuenta_bancaria_fkey FOREIGN KEY (id_cuenta_bancaria) REFERENCES public.cuenta_bancaria(id_cuenta_bancaria) ON DELETE SET NULL;


--
-- Name: factura factura_id_moneda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_id_moneda_fkey FOREIGN KEY (id_moneda) REFERENCES public.moneda(id_moneda) ON DELETE SET NULL;


--
-- TOC entry 5308 (class 2606 OID 99068)
-- Name: factura_linea factura_linea_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura_linea
    ADD CONSTRAINT factura_linea_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE SET NULL;


--
-- TOC entry 5309 (class 2606 OID 99058)
-- Name: factura_linea factura_linea_id_factura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura_linea
    ADD CONSTRAINT factura_linea_id_factura_fkey FOREIGN KEY (id_factura) REFERENCES public.factura(id_factura) ON DELETE RESTRICT;


--
-- TOC entry 5406 (class 2606 OID 222388)
-- Name: almacen fk_almacen_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.almacen
    ADD CONSTRAINT fk_almacen_empresa FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5240 (class 2606 OID 195295)
-- Name: tercero fk_asignado_a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT fk_asignado_a FOREIGN KEY (asignado_a) REFERENCES public.tercero(id_tercero);


--
-- TOC entry 5429 (class 2606 OID 222355)
-- Name: categoria_item fk_categoria_item_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_item
    ADD CONSTRAINT fk_categoria_item_empresa FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa);


--
-- TOC entry 5430 (class 2606 OID 222360)
-- Name: categoria_item fk_categoria_item_padre; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_item
    ADD CONSTRAINT fk_categoria_item_padre FOREIGN KEY (id_categoria_padre) REFERENCES public.categoria_item(id_categoria_item);


--
-- TOC entry 5404 (class 2606 OID 219792)
-- Name: ciudad fk_ciudad_provincia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudad
    ADD CONSTRAINT fk_ciudad_provincia FOREIGN KEY (id_provincia) REFERENCES public.provincia(id_provincia) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5241 (class 2606 OID 22158)
-- Name: tercero fk_condicion_pago; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT fk_condicion_pago FOREIGN KEY (id_condicion_pago) REFERENCES public.condicion_pago_catalogo(id_condicion_pago);


--
-- TOC entry 5375 (class 2606 OID 218663)
-- Name: contacto_direccion fk_contacto_direccion_provincia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacto_direccion
    ADD CONSTRAINT fk_contacto_direccion_provincia FOREIGN KEY (id_provincia) REFERENCES public.provincia(id_provincia) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5376 (class 2606 OID 207476)
-- Name: contacto_direccion fk_contacto_tercero; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacto_direccion
    ADD CONSTRAINT fk_contacto_tercero FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE CASCADE;


--
-- TOC entry 5266 (class 2606 OID 228136)
-- Name: cuenta_bancaria fk_cuenta_bancaria_banco; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_bancaria
    ADD CONSTRAINT fk_cuenta_bancaria_banco FOREIGN KEY (id_banco) REFERENCES public.banco(id_banco) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5267 (class 2606 OID 228141)
-- Name: cuenta_bancaria fk_cuenta_bancaria_tercero; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_bancaria
    ADD CONSTRAINT fk_cuenta_bancaria_tercero FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5272 (class 2606 OID 222528)
-- Name: cuenta_contable_item fk_cuenta_contable_item_cuenta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_item
    ADD CONSTRAINT fk_cuenta_contable_item_cuenta FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable);


--
-- TOC entry 5273 (class 2606 OID 222523)
-- Name: cuenta_contable_item fk_cuenta_contable_item_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_item
    ADD CONSTRAINT fk_cuenta_contable_item_empresa FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa);


--
-- TOC entry 5274 (class 2606 OID 222518)
-- Name: cuenta_contable_item fk_cuenta_contable_item_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_item
    ADD CONSTRAINT fk_cuenta_contable_item_item FOREIGN KEY (id_item) REFERENCES public.item(id_item);


--
-- TOC entry 5275 (class 2606 OID 222535)
-- Name: cuenta_contable_item fk_cuenta_contable_item_tipo_movimiento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_item
    ADD CONSTRAINT fk_cuenta_contable_item_tipo_movimiento FOREIGN KEY (id_tipo_movimiento_contable) REFERENCES public.tipo_movimiento_contable_item(id_tipo_movimiento_contable);


--
-- TOC entry 5431 (class 2606 OID 228163)
-- Name: directorio_documento fk_directorio_documento_padre; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directorio_documento
    ADD CONSTRAINT fk_directorio_documento_padre FOREIGN KEY (id_directorio_padre) REFERENCES public.directorio_documento(id_directorio_documento);


--
-- TOC entry 5432 (class 2606 OID 236011)
-- Name: directorio_documento fk_directorio_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directorio_documento
    ADD CONSTRAINT fk_directorio_empresa FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa);


--
-- TOC entry 5242 (class 2606 OID 22143)
-- Name: tercero fk_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT fk_empresa FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa);


--
-- TOC entry 5421 (class 2606 OID 221123)
-- Name: envio_detalle fk_envio_detalle_envio; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.envio_detalle
    ADD CONSTRAINT fk_envio_detalle_envio FOREIGN KEY (id_envio) REFERENCES public.envio(id_envio);


--
-- TOC entry 5422 (class 2606 OID 221128)
-- Name: envio_detalle fk_envio_detalle_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.envio_detalle
    ADD CONSTRAINT fk_envio_detalle_item FOREIGN KEY (id_item) REFERENCES public.item(id_item);


--
-- TOC entry 5423 (class 2606 OID 221133)
-- Name: envio_detalle fk_envio_detalle_lote; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.envio_detalle
    ADD CONSTRAINT fk_envio_detalle_lote FOREIGN KEY (id_lote_serie) REFERENCES public.item_lote_serie(id_lote_serie);


--
-- TOC entry 5420 (class 2606 OID 221109)
-- Name: envio fk_envio_tercero; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.envio
    ADD CONSTRAINT fk_envio_tercero FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero);


--
-- TOC entry 5243 (class 2606 OID 22163)
-- Name: tercero fk_forma_pago; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT fk_forma_pago FOREIGN KEY (id_forma_pago) REFERENCES public.forma_pago_catalogo(id_forma_pago);


--
-- TOC entry 5411 (class 2606 OID 221013)
-- Name: inventario fk_inventario_almacen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT fk_inventario_almacen FOREIGN KEY (id_almacen) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5412 (class 2606 OID 221032)
-- Name: inventario_detalle fk_inventario_detalle_inventario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_detalle
    ADD CONSTRAINT fk_inventario_detalle_inventario FOREIGN KEY (id_inventario) REFERENCES public.inventario(id_inventario);


--
-- TOC entry 5413 (class 2606 OID 221037)
-- Name: inventario_detalle fk_inventario_detalle_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_detalle
    ADD CONSTRAINT fk_inventario_detalle_item FOREIGN KEY (id_item) REFERENCES public.item(id_item);


--
-- TOC entry 5414 (class 2606 OID 221042)
-- Name: inventario_detalle fk_inventario_detalle_lote; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_detalle
    ADD CONSTRAINT fk_inventario_detalle_lote FOREIGN KEY (id_lote_serie) REFERENCES public.item_lote_serie(id_lote_serie);


--
-- TOC entry 5377 (class 2606 OID 222379)
-- Name: item fk_item_almacen_defecto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_almacen_defecto FOREIGN KEY (id_almacen_defecto) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5378 (class 2606 OID 222374)
-- Name: item fk_item_categoria; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_categoria FOREIGN KEY (id_categoria_item) REFERENCES public.categoria_item(id_categoria_item);


--
-- TOC entry 5379 (class 2606 OID 237176)
-- Name: item fk_item_cuenta_compra; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_cuenta_compra FOREIGN KEY (id_cuenta_compra) REFERENCES public.cuenta_contable(id_cuenta_contable);


--
-- TOC entry 5380 (class 2606 OID 237186)
-- Name: item fk_item_cuenta_compra_importacion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_cuenta_compra_importacion FOREIGN KEY (id_cuenta_compra_importacion) REFERENCES public.cuenta_contable(id_cuenta_contable);


--
-- TOC entry 5381 (class 2606 OID 237181)
-- Name: item fk_item_cuenta_compra_intracomunitaria; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_cuenta_compra_intracomunitaria FOREIGN KEY (id_cuenta_compra_intracomunitaria) REFERENCES public.cuenta_contable(id_cuenta_contable);


--
-- TOC entry 5382 (class 2606 OID 237161)
-- Name: item fk_item_cuenta_venta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_cuenta_venta FOREIGN KEY (id_cuenta_venta) REFERENCES public.cuenta_contable(id_cuenta_contable);


--
-- TOC entry 5383 (class 2606 OID 237171)
-- Name: item fk_item_cuenta_venta_exportacion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_cuenta_venta_exportacion FOREIGN KEY (id_cuenta_venta_exportacion) REFERENCES public.cuenta_contable(id_cuenta_contable);


--
-- TOC entry 5384 (class 2606 OID 237166)
-- Name: item fk_item_cuenta_venta_intracomunitaria; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_cuenta_venta_intracomunitaria FOREIGN KEY (id_cuenta_venta_intracomunitaria) REFERENCES public.cuenta_contable(id_cuenta_contable);


--
-- TOC entry 5385 (class 2606 OID 222498)
-- Name: item fk_item_duration_unit; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_duration_unit FOREIGN KEY (id_duration_unit) REFERENCES public.duracion_unidad_catalogo(id_duration_unit);


--
-- TOC entry 5386 (class 2606 OID 208607)
-- Name: item fk_item_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_empresa FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE CASCADE;


--
-- TOC entry 5387 (class 2606 OID 222438)
-- Name: item fk_item_estado_compra; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_estado_compra FOREIGN KEY (id_estado_compra) REFERENCES public.estado_compra_item(id_estado_compra);


--
-- TOC entry 5388 (class 2606 OID 222433)
-- Name: item fk_item_estado_venta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_estado_venta FOREIGN KEY (id_estado_venta) REFERENCES public.estado_venta_item(id_estado_venta);


--
-- TOC entry 5433 (class 2606 OID 240547)
-- Name: item_etiqueta_categoria fk_item_etiqueta_categoria_tipo_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_etiqueta_categoria
    ADD CONSTRAINT fk_item_etiqueta_categoria_tipo_item FOREIGN KEY (id_tipo_item) REFERENCES public.tipo_item_catalogo(id_tipo_item);


--
-- TOC entry 5434 (class 2606 OID 230421)
-- Name: item_etiqueta_categoria_det fk_item_etq_categoria; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_etiqueta_categoria_det
    ADD CONSTRAINT fk_item_etq_categoria FOREIGN KEY (id_etiqueta_categoria) REFERENCES public.item_etiqueta_categoria(id_etiqueta_categoria);


--
-- TOC entry 5435 (class 2606 OID 230416)
-- Name: item_etiqueta_categoria_det fk_item_etq_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_etiqueta_categoria_det
    ADD CONSTRAINT fk_item_etq_item FOREIGN KEY (id_item) REFERENCES public.item(id_item);


--
-- TOC entry 5389 (class 2606 OID 208598)
-- Name: item fk_item_impuesto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_impuesto FOREIGN KEY (impuesto_id) REFERENCES public.impuestos(id) ON DELETE SET NULL;


--
-- TOC entry 5390 (class 2606 OID 237155)
-- Name: item fk_item_naturaleza; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_naturaleza FOREIGN KEY (id_naturaleza_item) REFERENCES public.naturaleza_item_catalogo(id_naturaleza_item);


--
-- TOC entry 5391 (class 2606 OID 219774)
-- Name: item fk_item_pais; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_pais FOREIGN KEY (id_pais) REFERENCES public.pais(id_pais) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5392 (class 2606 OID 219779)
-- Name: item fk_item_provincia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_provincia FOREIGN KEY (id_provincia) REFERENCES public.provincia(id_provincia) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5393 (class 2606 OID 238314)
-- Name: item fk_item_tipo_comportamiento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_tipo_comportamiento FOREIGN KEY (id_tipo_comportamiento) REFERENCES public.tipo_comportamiento_item(id_tipo_comportamiento);


--
-- TOC entry 5394 (class 2606 OID 222458)
-- Name: item fk_item_tipo_control_caducidad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_tipo_control_caducidad FOREIGN KEY (id_tipo_control_caducidad) REFERENCES public.tipo_control_caducidad_item(id_tipo_control_caducidad);


--
-- TOC entry 5395 (class 2606 OID 237136)
-- Name: item fk_item_tipo_control_inventario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_tipo_control_inventario FOREIGN KEY (id_tipo_control_inventario) REFERENCES public.tipo_control_inventario_item(id_tipo_control_inventario);


--
-- TOC entry 5396 (class 2606 OID 222478)
-- Name: item fk_item_tipo_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_tipo_item FOREIGN KEY (id_tipo_item) REFERENCES public.tipo_item_catalogo(id_tipo_item);


--
-- TOC entry 5397 (class 2606 OID 221221)
-- Name: item fk_item_unidad_longitud; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_unidad_longitud FOREIGN KEY (id_unidad_longitud) REFERENCES public.unidad_medida(id_unidad) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5398 (class 2606 OID 221211)
-- Name: item fk_item_unidad_medida; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_unidad_medida FOREIGN KEY (id_unidad_medida) REFERENCES public.unidad_medida(id_unidad) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5399 (class 2606 OID 221216)
-- Name: item fk_item_unidad_peso; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_unidad_peso FOREIGN KEY (id_unidad_peso) REFERENCES public.unidad_medida(id_unidad) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5400 (class 2606 OID 221226)
-- Name: item fk_item_unidad_superficie; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_unidad_superficie FOREIGN KEY (id_unidad_superficie) REFERENCES public.unidad_medida(id_unidad) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5401 (class 2606 OID 221231)
-- Name: item fk_item_unidad_volumen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_unidad_volumen FOREIGN KEY (id_unidad_volumen) REFERENCES public.unidad_medida(id_unidad) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5409 (class 2606 OID 220984)
-- Name: item_lote_serie fk_lote_almacen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_lote_serie
    ADD CONSTRAINT fk_lote_almacen FOREIGN KEY (id_almacen) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5410 (class 2606 OID 220979)
-- Name: item_lote_serie fk_lote_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_lote_serie
    ADD CONSTRAINT fk_lote_item FOREIGN KEY (id_item) REFERENCES public.item(id_item);


--
-- TOC entry 5402 (class 2606 OID 228172)
-- Name: media fk_media_directorio_documento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT fk_media_directorio_documento FOREIGN KEY (id_directorio_documento) REFERENCES public.directorio_documento(id_directorio_documento);


--
-- TOC entry 5403 (class 2606 OID 236006)
-- Name: media fk_media_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT fk_media_empresa FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa);


--
-- TOC entry 5345 (class 2606 OID 222398)
-- Name: movimiento_inventario fk_movimiento_almacen_destino; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT fk_movimiento_almacen_destino FOREIGN KEY (id_almacen_destino) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5340 (class 2606 OID 228146)
-- Name: movimiento_bancario fk_movimiento_bancario_reverso; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_bancario
    ADD CONSTRAINT fk_movimiento_bancario_reverso FOREIGN KEY (id_movimiento_reversado) REFERENCES public.movimiento_bancario(id_movimiento_bancario);


--
-- TOC entry 5346 (class 2606 OID 220991)
-- Name: movimiento_inventario fk_movimiento_inventario_almacen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT fk_movimiento_inventario_almacen FOREIGN KEY (id_almacen) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5347 (class 2606 OID 221200)
-- Name: movimiento_inventario fk_movimiento_inventario_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT fk_movimiento_inventario_item FOREIGN KEY (id_item) REFERENCES public.item(id_item) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5348 (class 2606 OID 220996)
-- Name: movimiento_inventario fk_movimiento_inventario_lote; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT fk_movimiento_inventario_lote FOREIGN KEY (id_lote_serie) REFERENCES public.item_lote_serie(id_lote_serie);


--
-- TOC entry 5244 (class 2606 OID 22153)
-- Name: tercero fk_pais; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT fk_pais FOREIGN KEY (id_pais) REFERENCES public.pais(id_pais);


--
-- TOC entry 5213 (class 2606 OID 17342)
-- Name: perfil fk_perfil_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil
    ADD CONSTRAINT fk_perfil_empresa FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5425 (class 2606 OID 221175)
-- Name: recepcion_detalle fk_recepcion_detalle_almacen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcion_detalle
    ADD CONSTRAINT fk_recepcion_detalle_almacen FOREIGN KEY (id_almacen) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5426 (class 2606 OID 221170)
-- Name: recepcion_detalle fk_recepcion_detalle_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcion_detalle
    ADD CONSTRAINT fk_recepcion_detalle_item FOREIGN KEY (id_item) REFERENCES public.item(id_item);


--
-- TOC entry 5427 (class 2606 OID 221180)
-- Name: recepcion_detalle fk_recepcion_detalle_lote; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcion_detalle
    ADD CONSTRAINT fk_recepcion_detalle_lote FOREIGN KEY (id_lote_serie) REFERENCES public.item_lote_serie(id_lote_serie);


--
-- TOC entry 5428 (class 2606 OID 221165)
-- Name: recepcion_detalle fk_recepcion_detalle_recepcion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcion_detalle
    ADD CONSTRAINT fk_recepcion_detalle_recepcion FOREIGN KEY (id_recepcion) REFERENCES public.recepcion(id_recepcion);


--
-- TOC entry 5424 (class 2606 OID 221151)
-- Name: recepcion fk_recepcion_tercero; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcion
    ADD CONSTRAINT fk_recepcion_tercero FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero);


--
-- TOC entry 5245 (class 2606 OID 22148)
-- Name: tercero fk_sede_central; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT fk_sede_central FOREIGN KEY (sede_central) REFERENCES public.tercero(id_tercero);


--
-- TOC entry 5438 (class 2606 OID 240574)
-- Name: socio fk_socio_rol; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.socio
    ADD CONSTRAINT fk_socio_rol FOREIGN KEY (id_rol_socio) REFERENCES public.rol_socio(id_rol_socio);


--
-- TOC entry 5439 (class 2606 OID 240589)
-- Name: socio_tercero fk_socio_tercero_socio; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.socio_tercero
    ADD CONSTRAINT fk_socio_tercero_socio FOREIGN KEY (id_socio) REFERENCES public.socio(id_socio) ON DELETE CASCADE;


--
-- TOC entry 5440 (class 2606 OID 240594)
-- Name: socio_tercero fk_socio_tercero_tercero; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.socio_tercero
    ADD CONSTRAINT fk_socio_tercero_tercero FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero);


--
-- TOC entry 5407 (class 2606 OID 220962)
-- Name: stock_item_almacen fk_stock_almacen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_item_almacen
    ADD CONSTRAINT fk_stock_almacen FOREIGN KEY (id_almacen) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5408 (class 2606 OID 220957)
-- Name: stock_item_almacen fk_stock_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_item_almacen
    ADD CONSTRAINT fk_stock_item FOREIGN KEY (id_item) REFERENCES public.item(id_item);


--
-- TOC entry 5246 (class 2606 OID 223689)
-- Name: tercero fk_tercero_tamano_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT fk_tercero_tamano_empresa FOREIGN KEY (id_tamano_empresa) REFERENCES public.tamano_empresa(id_tamano_empresa);


--
-- TOC entry 5247 (class 2606 OID 217550)
-- Name: tercero fk_tercero_tipo_entidad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT fk_tercero_tipo_entidad FOREIGN KEY (id_tipo_entidad) REFERENCES public.tipo_entidad_comercial(id_tipo_entidad) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5249 (class 2606 OID 32177)
-- Name: miembros fk_tipo_miembro; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.miembros
    ADD CONSTRAINT fk_tipo_miembro FOREIGN KEY (tipo_miembro_id) REFERENCES public.tipos_miembro(id);


--
-- TOC entry 5248 (class 2606 OID 22173)
-- Name: tercero fk_tipo_tercero; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT fk_tipo_tercero FOREIGN KEY (id_tipo_tercero) REFERENCES public.tipo_tercero_catalogo(id_tipo_tercero);


--
-- TOC entry 5417 (class 2606 OID 221086)
-- Name: transferencia_stock_detalle fk_transfer_detalle_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencia_stock_detalle
    ADD CONSTRAINT fk_transfer_detalle_item FOREIGN KEY (id_item) REFERENCES public.item(id_item);


--
-- TOC entry 5418 (class 2606 OID 221091)
-- Name: transferencia_stock_detalle fk_transfer_detalle_lote; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencia_stock_detalle
    ADD CONSTRAINT fk_transfer_detalle_lote FOREIGN KEY (id_lote_serie) REFERENCES public.item_lote_serie(id_lote_serie);


--
-- TOC entry 5419 (class 2606 OID 221081)
-- Name: transferencia_stock_detalle fk_transfer_detalle_transfer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencia_stock_detalle
    ADD CONSTRAINT fk_transfer_detalle_transfer FOREIGN KEY (id_transferencia_stock) REFERENCES public.transferencia_stock(id_transferencia_stock);


--
-- TOC entry 5415 (class 2606 OID 221066)
-- Name: transferencia_stock fk_transferencia_almacen_destino; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencia_stock
    ADD CONSTRAINT fk_transferencia_almacen_destino FOREIGN KEY (id_almacen_destino) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5416 (class 2606 OID 221061)
-- Name: transferencia_stock fk_transferencia_almacen_origen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencia_stock
    ADD CONSTRAINT fk_transferencia_almacen_origen FOREIGN KEY (id_almacen_origen) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5405 (class 2606 OID 219823)
-- Name: unidad_medida fk_unidad_tipo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unidad_medida
    ADD CONSTRAINT fk_unidad_tipo FOREIGN KEY (id_tipo_unidad) REFERENCES public.tipo_unidad_medida(id_tipo_unidad);


--
-- TOC entry 5284 (class 2606 OID 98835)
-- Name: grupo_cuenta_personalizado grupo_cuenta_personalizado_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grupo_cuenta_personalizado
    ADD CONSTRAINT grupo_cuenta_personalizado_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5327 (class 2606 OID 99250)
-- Name: historial_conversion historial_conversion_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_conversion
    ADD CONSTRAINT historial_conversion_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5328 (class 2606 OID 99255)
-- Name: historial_conversion historial_conversion_id_usuario_conversion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_conversion
    ADD CONSTRAINT historial_conversion_id_usuario_conversion_fkey FOREIGN KEY (id_usuario_conversion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5304 (class 2606 OID 99014)
-- Name: informe_contable informe_contable_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.informe_contable
    ADD CONSTRAINT informe_contable_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5294 (class 2606 OID 98932)
-- Name: libro_mayor libro_mayor_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.libro_mayor
    ADD CONSTRAINT libro_mayor_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE RESTRICT;


--
-- TOC entry 5295 (class 2606 OID 98927)
-- Name: libro_mayor libro_mayor_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.libro_mayor
    ADD CONSTRAINT libro_mayor_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5296 (class 2606 OID 98937)
-- Name: libro_mayor libro_mayor_id_periodo_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.libro_mayor
    ADD CONSTRAINT libro_mayor_id_periodo_contable_fkey FOREIGN KEY (id_periodo_contable) REFERENCES public.periodo_contable(id_periodo_contable) ON DELETE RESTRICT;


--
-- TOC entry 5221 (class 2606 OID 17392)
-- Name: menu_item menu_item_id_seccion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item
    ADD CONSTRAINT menu_item_id_seccion_fkey FOREIGN KEY (id_seccion) REFERENCES public.menu_seccion(id_seccion) ON DELETE CASCADE;


--
-- TOC entry 5222 (class 2606 OID 17397)
-- Name: menu_item menu_item_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item
    ADD CONSTRAINT menu_item_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.menu_item(id_item) ON DELETE CASCADE;


--
-- TOC entry 5341 (class 2606 OID 99375)
-- Name: movimiento_bancario movimiento_bancario_id_asiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_bancario
    ADD CONSTRAINT movimiento_bancario_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE SET NULL;


--
-- TOC entry 5342 (class 2606 OID 99370)
-- Name: movimiento_bancario movimiento_bancario_id_conciliacion_bancaria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_bancario
    ADD CONSTRAINT movimiento_bancario_id_conciliacion_bancaria_fkey FOREIGN KEY (id_conciliacion_bancaria) REFERENCES public.conciliacion_bancaria(id_conciliacion_bancaria) ON DELETE SET NULL;


--
-- TOC entry 5343 (class 2606 OID 99365)
-- Name: movimiento_bancario movimiento_bancario_id_cuenta_bancaria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_bancario
    ADD CONSTRAINT movimiento_bancario_id_cuenta_bancaria_fkey FOREIGN KEY (id_cuenta_bancaria) REFERENCES public.cuenta_bancaria(id_cuenta_bancaria) ON DELETE RESTRICT;


--
-- TOC entry 5344 (class 2606 OID 99360)
-- Name: movimiento_bancario movimiento_bancario_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_bancario
    ADD CONSTRAINT movimiento_bancario_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5364 (class 2606 OID 99564)
-- Name: movimiento_centro_costo movimiento_centro_costo_id_centro_costo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_centro_costo
    ADD CONSTRAINT movimiento_centro_costo_id_centro_costo_fkey FOREIGN KEY (id_centro_costo) REFERENCES public.centro_costo(id_centro_costo) ON DELETE RESTRICT;


--
-- TOC entry 5365 (class 2606 OID 99559)
-- Name: movimiento_centro_costo movimiento_centro_costo_id_movimiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_centro_costo
    ADD CONSTRAINT movimiento_centro_costo_id_movimiento_contable_fkey FOREIGN KEY (id_movimiento_contable) REFERENCES public.movimiento_contable(id_movimiento_contable) ON DELETE RESTRICT;


--
-- TOC entry 5292 (class 2606 OID 98903)
-- Name: movimiento_contable movimiento_contable_id_asiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_contable
    ADD CONSTRAINT movimiento_contable_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE RESTRICT;


--
-- TOC entry 5293 (class 2606 OID 98908)
-- Name: movimiento_contable movimiento_contable_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_contable
    ADD CONSTRAINT movimiento_contable_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE RESTRICT;


--
-- TOC entry 5373 (class 2606 OID 106384)
-- Name: movimiento_cuenta movimiento_cuenta_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_cuenta
    ADD CONSTRAINT movimiento_cuenta_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa);


--
-- TOC entry 5349 (class 2606 OID 99399)
-- Name: movimiento_inventario movimiento_inventario_id_asiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE SET NULL;


--
-- TOC entry 5350 (class 2606 OID 99389)
-- Name: movimiento_inventario movimiento_inventario_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5355 (class 2606 OID 99483)
-- Name: nota_credito nota_credito_id_asiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_credito
    ADD CONSTRAINT nota_credito_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE SET NULL;


--
-- TOC entry 5356 (class 2606 OID 99468)
-- Name: nota_credito nota_credito_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_credito
    ADD CONSTRAINT nota_credito_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5357 (class 2606 OID 99478)
-- Name: nota_credito nota_credito_id_factura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_credito
    ADD CONSTRAINT nota_credito_id_factura_fkey FOREIGN KEY (id_factura) REFERENCES public.factura(id_factura) ON DELETE RESTRICT;


--
-- TOC entry 5358 (class 2606 OID 99473)
-- Name: nota_credito nota_credito_id_tercero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_credito
    ADD CONSTRAINT nota_credito_id_tercero_fkey FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE RESTRICT;


--
-- TOC entry 5359 (class 2606 OID 99499)
-- Name: nota_credito_linea nota_credito_linea_id_nota_credito_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_credito_linea
    ADD CONSTRAINT nota_credito_linea_id_nota_credito_fkey FOREIGN KEY (id_nota_credito) REFERENCES public.nota_credito(id_nota_credito) ON DELETE RESTRICT;


--
-- TOC entry 5334 (class 2606 OID 99313)
-- Name: pago_factura pago_factura_id_factura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago_factura
    ADD CONSTRAINT pago_factura_id_factura_fkey FOREIGN KEY (id_factura) REFERENCES public.factura(id_factura) ON DELETE RESTRICT;


--
-- TOC entry 5335 (class 2606 OID 99308)
-- Name: pago_factura pago_factura_id_pago_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago_factura
    ADD CONSTRAINT pago_factura_id_pago_fkey FOREIGN KEY (id_pago) REFERENCES public.pago(id_pago) ON DELETE RESTRICT;


--
-- TOC entry 5329 (class 2606 OID 99294)
-- Name: pago pago_id_asiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE SET NULL;


--
-- TOC entry 5330 (class 2606 OID 99284)
-- Name: pago pago_id_cuenta_bancaria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_cuenta_bancaria_fkey FOREIGN KEY (id_cuenta_bancaria) REFERENCES public.cuenta_bancaria(id_cuenta_bancaria) ON DELETE SET NULL;


--
-- TOC entry 5331 (class 2606 OID 99274)
-- Name: pago pago_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5332 (class 2606 OID 99289)
-- Name: pago pago_id_moneda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_moneda_fkey FOREIGN KEY (id_moneda) REFERENCES public.moneda(id_moneda) ON DELETE RESTRICT;


--
-- TOC entry 5333 (class 2606 OID 99279)
-- Name: pago pago_id_tercero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_tercero_fkey FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE RESTRICT;


--
-- TOC entry 5250 (class 2606 OID 46560)
-- Name: perfil_menu_permiso perfil_menu_permiso_id_item_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_menu_permiso
    ADD CONSTRAINT perfil_menu_permiso_id_item_fkey FOREIGN KEY (id_item) REFERENCES public.menu_item(id_item);


--
-- TOC entry 5251 (class 2606 OID 46555)
-- Name: perfil_menu_permiso perfil_menu_permiso_id_perfil_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_menu_permiso
    ADD CONSTRAINT perfil_menu_permiso_id_perfil_fkey FOREIGN KEY (id_perfil) REFERENCES public.perfil(id_perfil);


--
-- TOC entry 5259 (class 2606 OID 93236)
-- Name: periodo_contable periodo_contable_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.periodo_contable
    ADD CONSTRAINT periodo_contable_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5260 (class 2606 OID 93241)
-- Name: periodo_contable periodo_contable_id_usuario_cierre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.periodo_contable
    ADD CONSTRAINT periodo_contable_id_usuario_cierre_fkey FOREIGN KEY (id_usuario_cierre) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5255 (class 2606 OID 93190)
-- Name: plan_contable plan_contable_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_contable
    ADD CONSTRAINT plan_contable_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5256 (class 2606 OID 93195)
-- Name: plan_contable plan_contable_id_modelo_plan_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_contable
    ADD CONSTRAINT plan_contable_id_modelo_plan_contable_fkey FOREIGN KEY (id_modelo_plan_contable) REFERENCES public.modelo_plan_contable(id_modelo_plan_contable) ON DELETE SET NULL;


--
-- TOC entry 5325 (class 2606 OID 99235)
-- Name: prefactura_factura prefactura_factura_id_factura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura_factura
    ADD CONSTRAINT prefactura_factura_id_factura_fkey FOREIGN KEY (id_factura) REFERENCES public.factura(id_factura) ON DELETE RESTRICT;


--
-- TOC entry 5326 (class 2606 OID 99230)
-- Name: prefactura_factura prefactura_factura_id_prefactura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura_factura
    ADD CONSTRAINT prefactura_factura_id_prefactura_fkey FOREIGN KEY (id_prefactura) REFERENCES public.prefactura(id_prefactura) ON DELETE RESTRICT;


--
-- TOC entry 5315 (class 2606 OID 99149)
-- Name: prefactura prefactura_id_cotizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura
    ADD CONSTRAINT prefactura_id_cotizacion_fkey FOREIGN KEY (id_cotizacion) REFERENCES public.cotizacion(id_cotizacion) ON DELETE RESTRICT;


--
-- TOC entry 5316 (class 2606 OID 99144)
-- Name: prefactura prefactura_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura
    ADD CONSTRAINT prefactura_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5317 (class 2606 OID 99159)
-- Name: prefactura prefactura_id_factura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura
    ADD CONSTRAINT prefactura_id_factura_fkey FOREIGN KEY (id_factura) REFERENCES public.factura(id_factura) ON DELETE SET NULL;


--
-- TOC entry 5318 (class 2606 OID 99154)
-- Name: prefactura prefactura_id_tercero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura
    ADD CONSTRAINT prefactura_id_tercero_fkey FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE RESTRICT;


--
-- TOC entry 5319 (class 2606 OID 99169)
-- Name: prefactura prefactura_id_usuario_aprobacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura
    ADD CONSTRAINT prefactura_id_usuario_aprobacion_fkey FOREIGN KEY (id_usuario_aprobacion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5320 (class 2606 OID 99164)
-- Name: prefactura prefactura_id_usuario_creacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura
    ADD CONSTRAINT prefactura_id_usuario_creacion_fkey FOREIGN KEY (id_usuario_creacion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5321 (class 2606 OID 99190)
-- Name: prefactura_linea prefactura_linea_id_cotizacion_linea_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura_linea
    ADD CONSTRAINT prefactura_linea_id_cotizacion_linea_fkey FOREIGN KEY (id_cotizacion_linea) REFERENCES public.cotizacion_linea(id_cotizacion_linea) ON DELETE RESTRICT;


--
-- TOC entry 5322 (class 2606 OID 99185)
-- Name: prefactura_linea prefactura_linea_id_prefactura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura_linea
    ADD CONSTRAINT prefactura_linea_id_prefactura_fkey FOREIGN KEY (id_prefactura) REFERENCES public.prefactura(id_prefactura) ON DELETE RESTRICT;


--
-- TOC entry 5351 (class 2606 OID 99417)
-- Name: presupuesto presupuesto_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presupuesto
    ADD CONSTRAINT presupuesto_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5352 (class 2606 OID 99427)
-- Name: presupuesto presupuesto_id_factura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presupuesto
    ADD CONSTRAINT presupuesto_id_factura_fkey FOREIGN KEY (id_factura) REFERENCES public.factura(id_factura) ON DELETE SET NULL;


--
-- TOC entry 5353 (class 2606 OID 99422)
-- Name: presupuesto presupuesto_id_tercero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presupuesto
    ADD CONSTRAINT presupuesto_id_tercero_fkey FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE RESTRICT;


--
-- TOC entry 5354 (class 2606 OID 99443)
-- Name: presupuesto_linea presupuesto_linea_id_presupuesto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presupuesto_linea
    ADD CONSTRAINT presupuesto_linea_id_presupuesto_fkey FOREIGN KEY (id_presupuesto) REFERENCES public.presupuesto(id_presupuesto) ON DELETE RESTRICT;


--
-- TOC entry 5223 (class 2606 OID 18557)
-- Name: provincia provincia_id_pais_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincia
    ADD CONSTRAINT provincia_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES public.pais(id_pais) ON DELETE RESTRICT;


--
-- TOC entry 5360 (class 2606 OID 99528)
-- Name: retencion retencion_id_asiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.retencion
    ADD CONSTRAINT retencion_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE SET NULL;


--
-- TOC entry 5361 (class 2606 OID 99518)
-- Name: retencion retencion_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.retencion
    ADD CONSTRAINT retencion_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5362 (class 2606 OID 99523)
-- Name: retencion retencion_id_tercero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.retencion
    ADD CONSTRAINT retencion_id_tercero_fkey FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE RESTRICT;


--
-- TOC entry 5297 (class 2606 OID 98960)
-- Name: saldo_cuenta saldo_cuenta_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saldo_cuenta
    ADD CONSTRAINT saldo_cuenta_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE RESTRICT;


--
-- TOC entry 5298 (class 2606 OID 98955)
-- Name: saldo_cuenta saldo_cuenta_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saldo_cuenta
    ADD CONSTRAINT saldo_cuenta_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5299 (class 2606 OID 98965)
-- Name: saldo_cuenta saldo_cuenta_id_periodo_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saldo_cuenta
    ADD CONSTRAINT saldo_cuenta_id_periodo_contable_fkey FOREIGN KEY (id_periodo_contable) REFERENCES public.periodo_contable(id_periodo_contable) ON DELETE RESTRICT;


--
-- TOC entry 5212 (class 2606 OID 17289)
-- Name: sucursal sucursal_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursal
    ADD CONSTRAINT sucursal_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5366 (class 2606 OID 99578)
-- Name: tipo_cambio tipo_cambio_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_cambio
    ADD CONSTRAINT tipo_cambio_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5367 (class 2606 OID 99588)
-- Name: tipo_cambio tipo_cambio_id_moneda_destino_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_cambio
    ADD CONSTRAINT tipo_cambio_id_moneda_destino_fkey FOREIGN KEY (id_moneda_destino) REFERENCES public.moneda(id_moneda) ON DELETE RESTRICT;


--
-- TOC entry 5368 (class 2606 OID 99583)
-- Name: tipo_cambio tipo_cambio_id_moneda_origen_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_cambio
    ADD CONSTRAINT tipo_cambio_id_moneda_origen_fkey FOREIGN KEY (id_moneda_origen) REFERENCES public.moneda(id_moneda) ON DELETE RESTRICT;


--
-- TOC entry 5372 (class 2606 OID 106306)
-- Name: titular_cuenta titular_cuenta_id_pais_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titular_cuenta
    ADD CONSTRAINT titular_cuenta_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES public.pais(id_pais);


--
-- TOC entry 5214 (class 2606 OID 17360)
-- Name: usuario usuario_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5215 (class 2606 OID 222559)
-- Name: usuario usuario_id_pais_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES public.pais(id_pais) ON DELETE SET NULL;


--
-- TOC entry 5216 (class 2606 OID 17365)
-- Name: usuario usuario_id_perfil_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_perfil_fkey FOREIGN KEY (id_perfil) REFERENCES public.perfil(id_perfil) ON DELETE RESTRICT;


--
-- TOC entry 5217 (class 2606 OID 222564)
-- Name: usuario usuario_id_provincia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_provincia_fkey FOREIGN KEY (id_provincia) REFERENCES public.provincia(id_provincia) ON DELETE SET NULL;


--
-- TOC entry 5218 (class 2606 OID 222543)
-- Name: usuario usuario_id_supervisor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_supervisor_fkey FOREIGN KEY (id_supervisor) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5219 (class 2606 OID 222553)
-- Name: usuario usuario_id_validador_dias_libres_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_validador_dias_libres_fkey FOREIGN KEY (id_validador_dias_libres) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5220 (class 2606 OID 222548)
-- Name: usuario usuario_id_validador_gastos_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_validador_gastos_fkey FOREIGN KEY (id_validador_gastos) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5194 (class 2606 OID 16570)
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 5206 (class 2606 OID 17080)
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 5207 (class 2606 OID 17100)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 5208 (class 2606 OID 17095)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- TOC entry 5374 (class 2606 OID 119651)
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- TOC entry 5599 (class 0 OID 16523)
-- Dependencies: 257
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5613 (class 0 OID 16925)
-- Dependencies: 273
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5604 (class 0 OID 16723)
-- Dependencies: 264
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5598 (class 0 OID 16516)
-- Dependencies: 256
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5608 (class 0 OID 16812)
-- Dependencies: 268
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5607 (class 0 OID 16800)
-- Dependencies: 267
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5606 (class 0 OID 16787)
-- Dependencies: 266
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5614 (class 0 OID 16975)
-- Dependencies: 274
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5597 (class 0 OID 16505)
-- Dependencies: 255
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5611 (class 0 OID 16854)
-- Dependencies: 271
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5612 (class 0 OID 16872)
-- Dependencies: 272
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5600 (class 0 OID 16531)
-- Dependencies: 258
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5605 (class 0 OID 16753)
-- Dependencies: 265
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5610 (class 0 OID 16839)
-- Dependencies: 270
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5609 (class 0 OID 16830)
-- Dependencies: 269
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5596 (class 0 OID 16493)
-- Dependencies: 253
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5617 (class 0 OID 17251)
-- Dependencies: 283
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5601 (class 0 OID 16544)
-- Dependencies: 259
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5618 (class 0 OID 53242)
-- Dependencies: 314
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5619 (class 0 OID 119631)
-- Dependencies: 363
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5603 (class 0 OID 16586)
-- Dependencies: 261
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5602 (class 0 OID 16559)
-- Dependencies: 260
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5615 (class 0 OID 17071)
-- Dependencies: 279
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5616 (class 0 OID 17085)
-- Dependencies: 280
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5620 (class 0 OID 119641)
-- Dependencies: 364
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5621 (class 6104 OID 16426)
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- TOC entry 5774 (class 0 OID 0)
-- Dependencies: 16
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- TOC entry 5775 (class 0 OID 0)
-- Dependencies: 12
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- TOC entry 5776 (class 0 OID 0)
-- Dependencies: 35
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- TOC entry 5777 (class 0 OID 0)
-- Dependencies: 8
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- TOC entry 5778 (class 0 OID 0)
-- Dependencies: 17
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- TOC entry 5779 (class 0 OID 0)
-- Dependencies: 13
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- TOC entry 5785 (class 0 OID 0)
-- Dependencies: 469
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- TOC entry 5786 (class 0 OID 0)
-- Dependencies: 481
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- TOC entry 5788 (class 0 OID 0)
-- Dependencies: 468
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- TOC entry 5790 (class 0 OID 0)
-- Dependencies: 467
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- TOC entry 5791 (class 0 OID 0)
-- Dependencies: 463
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- TOC entry 5792 (class 0 OID 0)
-- Dependencies: 464
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- TOC entry 5793 (class 0 OID 0)
-- Dependencies: 435
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- TOC entry 5794 (class 0 OID 0)
-- Dependencies: 465
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- TOC entry 5795 (class 0 OID 0)
-- Dependencies: 439
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5796 (class 0 OID 0)
-- Dependencies: 441
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5797 (class 0 OID 0)
-- Dependencies: 432
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- TOC entry 5798 (class 0 OID 0)
-- Dependencies: 431
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- TOC entry 5799 (class 0 OID 0)
-- Dependencies: 438
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5800 (class 0 OID 0)
-- Dependencies: 440
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5801 (class 0 OID 0)
-- Dependencies: 442
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- TOC entry 5802 (class 0 OID 0)
-- Dependencies: 443
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- TOC entry 5803 (class 0 OID 0)
-- Dependencies: 436
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- TOC entry 5804 (class 0 OID 0)
-- Dependencies: 437
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- TOC entry 5806 (class 0 OID 0)
-- Dependencies: 470
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- TOC entry 5808 (class 0 OID 0)
-- Dependencies: 474
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- TOC entry 5810 (class 0 OID 0)
-- Dependencies: 471
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- TOC entry 5811 (class 0 OID 0)
-- Dependencies: 434
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5812 (class 0 OID 0)
-- Dependencies: 433
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- TOC entry 5813 (class 0 OID 0)
-- Dependencies: 419
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- TOC entry 5814 (class 0 OID 0)
-- Dependencies: 418
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- TOC entry 5815 (class 0 OID 0)
-- Dependencies: 420
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- TOC entry 5816 (class 0 OID 0)
-- Dependencies: 466
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- TOC entry 5817 (class 0 OID 0)
-- Dependencies: 462
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- TOC entry 5818 (class 0 OID 0)
-- Dependencies: 456
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- TOC entry 5819 (class 0 OID 0)
-- Dependencies: 458
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5820 (class 0 OID 0)
-- Dependencies: 460
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- TOC entry 5821 (class 0 OID 0)
-- Dependencies: 457
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- TOC entry 5822 (class 0 OID 0)
-- Dependencies: 459
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5823 (class 0 OID 0)
-- Dependencies: 461
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- TOC entry 5824 (class 0 OID 0)
-- Dependencies: 452
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- TOC entry 5825 (class 0 OID 0)
-- Dependencies: 454
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- TOC entry 5826 (class 0 OID 0)
-- Dependencies: 453
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- TOC entry 5827 (class 0 OID 0)
-- Dependencies: 455
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5828 (class 0 OID 0)
-- Dependencies: 448
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- TOC entry 5829 (class 0 OID 0)
-- Dependencies: 450
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- TOC entry 5830 (class 0 OID 0)
-- Dependencies: 449
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- TOC entry 5831 (class 0 OID 0)
-- Dependencies: 451
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- TOC entry 5832 (class 0 OID 0)
-- Dependencies: 444
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- TOC entry 5833 (class 0 OID 0)
-- Dependencies: 446
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- TOC entry 5834 (class 0 OID 0)
-- Dependencies: 445
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- TOC entry 5835 (class 0 OID 0)
-- Dependencies: 447
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- TOC entry 5836 (class 0 OID 0)
-- Dependencies: 472
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- TOC entry 5837 (class 0 OID 0)
-- Dependencies: 473
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- TOC entry 5839 (class 0 OID 0)
-- Dependencies: 475
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- TOC entry 5840 (class 0 OID 0)
-- Dependencies: 426
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- TOC entry 5841 (class 0 OID 0)
-- Dependencies: 427
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- TOC entry 5842 (class 0 OID 0)
-- Dependencies: 428
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- TOC entry 5843 (class 0 OID 0)
-- Dependencies: 429
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- TOC entry 5844 (class 0 OID 0)
-- Dependencies: 430
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- TOC entry 5845 (class 0 OID 0)
-- Dependencies: 421
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- TOC entry 5846 (class 0 OID 0)
-- Dependencies: 422
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- TOC entry 5847 (class 0 OID 0)
-- Dependencies: 424
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- TOC entry 5848 (class 0 OID 0)
-- Dependencies: 423
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- TOC entry 5849 (class 0 OID 0)
-- Dependencies: 425
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- TOC entry 5850 (class 0 OID 0)
-- Dependencies: 525
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- TOC entry 5851 (class 0 OID 0)
-- Dependencies: 417
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- TOC entry 5853 (class 0 OID 0)
-- Dependencies: 514
-- Name: FUNCTION balance_comprobacion(p_empresa_id uuid, p_fecha_desde date, p_fecha_hasta date); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.balance_comprobacion(p_empresa_id uuid, p_fecha_desde date, p_fecha_hasta date) TO anon;
GRANT ALL ON FUNCTION public.balance_comprobacion(p_empresa_id uuid, p_fecha_desde date, p_fecha_hasta date) TO authenticated;
GRANT ALL ON FUNCTION public.balance_comprobacion(p_empresa_id uuid, p_fecha_desde date, p_fecha_hasta date) TO service_role;


--
-- TOC entry 5855 (class 0 OID 0)
-- Dependencies: 517
-- Name: FUNCTION balance_general_saldos(p_empresa_id uuid, p_fecha_corte date); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.balance_general_saldos(p_empresa_id uuid, p_fecha_corte date) TO anon;
GRANT ALL ON FUNCTION public.balance_general_saldos(p_empresa_id uuid, p_fecha_corte date) TO authenticated;
GRANT ALL ON FUNCTION public.balance_general_saldos(p_empresa_id uuid, p_fecha_corte date) TO service_role;


--
-- TOC entry 5857 (class 0 OID 0)
-- Dependencies: 516
-- Name: FUNCTION estado_resultados(p_empresa_id integer, p_fecha_desde date, p_fecha_hasta date); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.estado_resultados(p_empresa_id integer, p_fecha_desde date, p_fecha_hasta date) TO anon;
GRANT ALL ON FUNCTION public.estado_resultados(p_empresa_id integer, p_fecha_desde date, p_fecha_hasta date) TO authenticated;
GRANT ALL ON FUNCTION public.estado_resultados(p_empresa_id integer, p_fecha_desde date, p_fecha_hasta date) TO service_role;


--
-- TOC entry 5859 (class 0 OID 0)
-- Dependencies: 515
-- Name: FUNCTION libro_mayor(p_empresa_id integer, p_cuenta_id integer, p_fecha_desde date, p_fecha_hasta date); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.libro_mayor(p_empresa_id integer, p_cuenta_id integer, p_fecha_desde date, p_fecha_hasta date) TO anon;
GRANT ALL ON FUNCTION public.libro_mayor(p_empresa_id integer, p_cuenta_id integer, p_fecha_desde date, p_fecha_hasta date) TO authenticated;
GRANT ALL ON FUNCTION public.libro_mayor(p_empresa_id integer, p_cuenta_id integer, p_fecha_desde date, p_fecha_hasta date) TO service_role;


--
-- TOC entry 5861 (class 0 OID 0)
-- Dependencies: 513
-- Name: FUNCTION obtener_siguiente_numero_asiento(p_empresa_id integer, p_prefijo character varying, p_fecha date); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.obtener_siguiente_numero_asiento(p_empresa_id integer, p_prefijo character varying, p_fecha date) TO anon;
GRANT ALL ON FUNCTION public.obtener_siguiente_numero_asiento(p_empresa_id integer, p_prefijo character varying, p_fecha date) TO authenticated;
GRANT ALL ON FUNCTION public.obtener_siguiente_numero_asiento(p_empresa_id integer, p_prefijo character varying, p_fecha date) TO service_role;


--
-- TOC entry 5862 (class 0 OID 0)
-- Dependencies: 512
-- Name: FUNCTION set_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.set_updated_at() TO anon;
GRANT ALL ON FUNCTION public.set_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.set_updated_at() TO service_role;


--
-- TOC entry 5863 (class 0 OID 0)
-- Dependencies: 510
-- Name: FUNCTION trg_heredar_empresa_movimiento(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.trg_heredar_empresa_movimiento() TO anon;
GRANT ALL ON FUNCTION public.trg_heredar_empresa_movimiento() TO authenticated;
GRANT ALL ON FUNCTION public.trg_heredar_empresa_movimiento() TO service_role;


--
-- TOC entry 5864 (class 0 OID 0)
-- Dependencies: 511
-- Name: FUNCTION trg_insertar_saldo_inicial(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.trg_insertar_saldo_inicial() TO anon;
GRANT ALL ON FUNCTION public.trg_insertar_saldo_inicial() TO authenticated;
GRANT ALL ON FUNCTION public.trg_insertar_saldo_inicial() TO service_role;


--
-- TOC entry 5865 (class 0 OID 0)
-- Dependencies: 509
-- Name: FUNCTION trg_touch_actualizado_en(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.trg_touch_actualizado_en() TO anon;
GRANT ALL ON FUNCTION public.trg_touch_actualizado_en() TO authenticated;
GRANT ALL ON FUNCTION public.trg_touch_actualizado_en() TO service_role;


--
-- TOC entry 5866 (class 0 OID 0)
-- Dependencies: 495
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- TOC entry 5867 (class 0 OID 0)
-- Dependencies: 500
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- TOC entry 5868 (class 0 OID 0)
-- Dependencies: 497
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- TOC entry 5869 (class 0 OID 0)
-- Dependencies: 493
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- TOC entry 5870 (class 0 OID 0)
-- Dependencies: 492
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- TOC entry 5871 (class 0 OID 0)
-- Dependencies: 496
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- TOC entry 5872 (class 0 OID 0)
-- Dependencies: 524
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;


--
-- TOC entry 5873 (class 0 OID 0)
-- Dependencies: 491
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- TOC entry 5874 (class 0 OID 0)
-- Dependencies: 499
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- TOC entry 5875 (class 0 OID 0)
-- Dependencies: 490
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- TOC entry 5876 (class 0 OID 0)
-- Dependencies: 494
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- TOC entry 5877 (class 0 OID 0)
-- Dependencies: 498
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- TOC entry 5878 (class 0 OID 0)
-- Dependencies: 477
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- TOC entry 5879 (class 0 OID 0)
-- Dependencies: 479
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- TOC entry 5880 (class 0 OID 0)
-- Dependencies: 480
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- TOC entry 5882 (class 0 OID 0)
-- Dependencies: 257
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- TOC entry 5883 (class 0 OID 0)
-- Dependencies: 368
-- Name: TABLE custom_oauth_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.custom_oauth_providers TO postgres;
GRANT ALL ON TABLE auth.custom_oauth_providers TO dashboard_user;


--
-- TOC entry 5885 (class 0 OID 0)
-- Dependencies: 273
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- TOC entry 5888 (class 0 OID 0)
-- Dependencies: 264
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- TOC entry 5890 (class 0 OID 0)
-- Dependencies: 256
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- TOC entry 5892 (class 0 OID 0)
-- Dependencies: 268
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- TOC entry 5894 (class 0 OID 0)
-- Dependencies: 267
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- TOC entry 5897 (class 0 OID 0)
-- Dependencies: 266
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- TOC entry 5898 (class 0 OID 0)
-- Dependencies: 327
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- TOC entry 5900 (class 0 OID 0)
-- Dependencies: 365
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- TOC entry 5901 (class 0 OID 0)
-- Dependencies: 315
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- TOC entry 5902 (class 0 OID 0)
-- Dependencies: 328
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- TOC entry 5903 (class 0 OID 0)
-- Dependencies: 274
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- TOC entry 5905 (class 0 OID 0)
-- Dependencies: 255
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- TOC entry 5907 (class 0 OID 0)
-- Dependencies: 254
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- TOC entry 5909 (class 0 OID 0)
-- Dependencies: 271
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- TOC entry 5911 (class 0 OID 0)
-- Dependencies: 272
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- TOC entry 5913 (class 0 OID 0)
-- Dependencies: 258
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- TOC entry 5918 (class 0 OID 0)
-- Dependencies: 265
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- TOC entry 5920 (class 0 OID 0)
-- Dependencies: 270
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- TOC entry 5923 (class 0 OID 0)
-- Dependencies: 269
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- TOC entry 5926 (class 0 OID 0)
-- Dependencies: 253
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- TOC entry 5927 (class 0 OID 0)
-- Dependencies: 399
-- Name: TABLE webauthn_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_challenges TO postgres;
GRANT ALL ON TABLE auth.webauthn_challenges TO dashboard_user;


--
-- TOC entry 5928 (class 0 OID 0)
-- Dependencies: 398
-- Name: TABLE webauthn_credentials; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_credentials TO postgres;
GRANT ALL ON TABLE auth.webauthn_credentials TO dashboard_user;


--
-- TOC entry 5929 (class 0 OID 0)
-- Dependencies: 252
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- TOC entry 5930 (class 0 OID 0)
-- Dependencies: 251
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- TOC entry 5931 (class 0 OID 0)
-- Dependencies: 375
-- Name: TABLE almacen; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.almacen TO anon;
GRANT ALL ON TABLE public.almacen TO authenticated;
GRANT ALL ON TABLE public.almacen TO service_role;


--
-- TOC entry 5933 (class 0 OID 0)
-- Dependencies: 332
-- Name: TABLE asiento_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.asiento_contable TO anon;
GRANT ALL ON TABLE public.asiento_contable TO authenticated;
GRANT ALL ON TABLE public.asiento_contable TO service_role;


--
-- TOC entry 5934 (class 0 OID 0)
-- Dependencies: 394
-- Name: TABLE banco; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.banco TO anon;
GRANT ALL ON TABLE public.banco TO authenticated;
GRANT ALL ON TABLE public.banco TO service_role;


--
-- TOC entry 5935 (class 0 OID 0)
-- Dependencies: 386
-- Name: TABLE categoria_item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.categoria_item TO anon;
GRANT ALL ON TABLE public.categoria_item TO authenticated;
GRANT ALL ON TABLE public.categoria_item TO service_role;


--
-- TOC entry 5936 (class 0 OID 0)
-- Dependencies: 357
-- Name: TABLE centro_costo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.centro_costo TO anon;
GRANT ALL ON TABLE public.centro_costo TO authenticated;
GRANT ALL ON TABLE public.centro_costo TO service_role;


--
-- TOC entry 5937 (class 0 OID 0)
-- Dependencies: 360
-- Name: TABLE cierre_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cierre_contable TO anon;
GRANT ALL ON TABLE public.cierre_contable TO authenticated;
GRANT ALL ON TABLE public.cierre_contable TO service_role;


--
-- TOC entry 5938 (class 0 OID 0)
-- Dependencies: 329
-- Name: TABLE cierre_cuenta; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cierre_cuenta TO anon;
GRANT ALL ON TABLE public.cierre_cuenta TO authenticated;
GRANT ALL ON TABLE public.cierre_cuenta TO service_role;


--
-- TOC entry 5939 (class 0 OID 0)
-- Dependencies: 372
-- Name: TABLE ciudad; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ciudad TO anon;
GRANT ALL ON TABLE public.ciudad TO authenticated;
GRANT ALL ON TABLE public.ciudad TO service_role;


--
-- TOC entry 5940 (class 0 OID 0)
-- Dependencies: 349
-- Name: TABLE conciliacion_bancaria; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.conciliacion_bancaria TO anon;
GRANT ALL ON TABLE public.conciliacion_bancaria TO authenticated;
GRANT ALL ON TABLE public.conciliacion_bancaria TO service_role;


--
-- TOC entry 5941 (class 0 OID 0)
-- Dependencies: 303
-- Name: TABLE condicion_pago_catalogo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.condicion_pago_catalogo TO anon;
GRANT ALL ON TABLE public.condicion_pago_catalogo TO authenticated;
GRANT ALL ON TABLE public.condicion_pago_catalogo TO service_role;


--
-- TOC entry 5942 (class 0 OID 0)
-- Dependencies: 316
-- Name: TABLE configuracion_contabilidad; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.configuracion_contabilidad TO anon;
GRANT ALL ON TABLE public.configuracion_contabilidad TO authenticated;
GRANT ALL ON TABLE public.configuracion_contabilidad TO service_role;


--
-- TOC entry 5943 (class 0 OID 0)
-- Dependencies: 300
-- Name: TABLE contable_externo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.contable_externo TO anon;
GRANT ALL ON TABLE public.contable_externo TO authenticated;
GRANT ALL ON TABLE public.contable_externo TO service_role;


--
-- TOC entry 5944 (class 0 OID 0)
-- Dependencies: 366
-- Name: TABLE contacto_direccion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.contacto_direccion TO anon;
GRANT ALL ON TABLE public.contacto_direccion TO authenticated;
GRANT ALL ON TABLE public.contacto_direccion TO service_role;


--
-- TOC entry 5945 (class 0 OID 0)
-- Dependencies: 340
-- Name: TABLE cotizacion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cotizacion TO anon;
GRANT ALL ON TABLE public.cotizacion TO authenticated;
GRANT ALL ON TABLE public.cotizacion TO service_role;


--
-- TOC entry 5946 (class 0 OID 0)
-- Dependencies: 341
-- Name: TABLE cotizacion_linea; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cotizacion_linea TO anon;
GRANT ALL ON TABLE public.cotizacion_linea TO authenticated;
GRANT ALL ON TABLE public.cotizacion_linea TO service_role;


--
-- TOC entry 5947 (class 0 OID 0)
-- Dependencies: 344
-- Name: TABLE cotizacion_prefactura; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cotizacion_prefactura TO anon;
GRANT ALL ON TABLE public.cotizacion_prefactura TO authenticated;
GRANT ALL ON TABLE public.cotizacion_prefactura TO service_role;


--
-- TOC entry 5948 (class 0 OID 0)
-- Dependencies: 323
-- Name: TABLE cuenta_bancaria; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta_bancaria TO anon;
GRANT ALL ON TABLE public.cuenta_bancaria TO authenticated;
GRANT ALL ON TABLE public.cuenta_bancaria TO service_role;


--
-- TOC entry 5949 (class 0 OID 0)
-- Dependencies: 320
-- Name: TABLE cuenta_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta_contable TO anon;
GRANT ALL ON TABLE public.cuenta_contable TO authenticated;
GRANT ALL ON TABLE public.cuenta_contable TO service_role;


--
-- TOC entry 5950 (class 0 OID 0)
-- Dependencies: 322
-- Name: TABLE cuenta_contable_defecto; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta_contable_defecto TO anon;
GRANT ALL ON TABLE public.cuenta_contable_defecto TO authenticated;
GRANT ALL ON TABLE public.cuenta_contable_defecto TO service_role;


--
-- TOC entry 5951 (class 0 OID 0)
-- Dependencies: 326
-- Name: TABLE cuenta_contable_item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta_contable_item TO anon;
GRANT ALL ON TABLE public.cuenta_contable_item TO authenticated;
GRANT ALL ON TABLE public.cuenta_contable_item TO service_role;


--
-- TOC entry 5952 (class 0 OID 0)
-- Dependencies: 331
-- Name: TABLE cuenta_grupo_personalizado; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta_grupo_personalizado TO anon;
GRANT ALL ON TABLE public.cuenta_grupo_personalizado TO authenticated;
GRANT ALL ON TABLE public.cuenta_grupo_personalizado TO service_role;


--
-- TOC entry 5953 (class 0 OID 0)
-- Dependencies: 325
-- Name: TABLE cuenta_impuesto; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta_impuesto TO anon;
GRANT ALL ON TABLE public.cuenta_impuesto TO authenticated;
GRANT ALL ON TABLE public.cuenta_impuesto TO service_role;


--
-- TOC entry 5954 (class 0 OID 0)
-- Dependencies: 324
-- Name: TABLE cuenta_iva; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta_iva TO anon;
GRANT ALL ON TABLE public.cuenta_iva TO authenticated;
GRANT ALL ON TABLE public.cuenta_iva TO service_role;


--
-- TOC entry 5955 (class 0 OID 0)
-- Dependencies: 317
-- Name: TABLE diario_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.diario_contable TO anon;
GRANT ALL ON TABLE public.diario_contable TO authenticated;
GRANT ALL ON TABLE public.diario_contable TO service_role;


--
-- TOC entry 5956 (class 0 OID 0)
-- Dependencies: 395
-- Name: TABLE directorio_documento; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.directorio_documento TO anon;
GRANT ALL ON TABLE public.directorio_documento TO authenticated;
GRANT ALL ON TABLE public.directorio_documento TO service_role;


--
-- TOC entry 5957 (class 0 OID 0)
-- Dependencies: 336
-- Name: TABLE documento_origen; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.documento_origen TO anon;
GRANT ALL ON TABLE public.documento_origen TO authenticated;
GRANT ALL ON TABLE public.documento_origen TO service_role;


--
-- TOC entry 5958 (class 0 OID 0)
-- Dependencies: 391
-- Name: TABLE duracion_unidad_catalogo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.duracion_unidad_catalogo TO anon;
GRANT ALL ON TABLE public.duracion_unidad_catalogo TO authenticated;
GRANT ALL ON TABLE public.duracion_unidad_catalogo TO service_role;


--
-- TOC entry 5959 (class 0 OID 0)
-- Dependencies: 284
-- Name: TABLE empresa; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.empresa TO anon;
GRANT ALL ON TABLE public.empresa TO authenticated;
GRANT ALL ON TABLE public.empresa TO service_role;


--
-- TOC entry 5960 (class 0 OID 0)
-- Dependencies: 301
-- Name: TABLE empresa_horario_apertura; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.empresa_horario_apertura TO anon;
GRANT ALL ON TABLE public.empresa_horario_apertura TO authenticated;
GRANT ALL ON TABLE public.empresa_horario_apertura TO service_role;


--
-- TOC entry 5961 (class 0 OID 0)
-- Dependencies: 297
-- Name: TABLE empresa_identificacion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.empresa_identificacion TO anon;
GRANT ALL ON TABLE public.empresa_identificacion TO authenticated;
GRANT ALL ON TABLE public.empresa_identificacion TO service_role;


--
-- TOC entry 5962 (class 0 OID 0)
-- Dependencies: 299
-- Name: TABLE empresa_red_social; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.empresa_red_social TO anon;
GRANT ALL ON TABLE public.empresa_red_social TO authenticated;
GRANT ALL ON TABLE public.empresa_red_social TO service_role;


--
-- TOC entry 5963 (class 0 OID 0)
-- Dependencies: 291
-- Name: TABLE entidad; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.entidad TO anon;
GRANT ALL ON TABLE public.entidad TO authenticated;
GRANT ALL ON TABLE public.entidad TO service_role;


--
-- TOC entry 5965 (class 0 OID 0)
-- Dependencies: 290
-- Name: SEQUENCE entidad_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.entidad_id_seq TO anon;
GRANT ALL ON SEQUENCE public.entidad_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.entidad_id_seq TO service_role;


--
-- TOC entry 5966 (class 0 OID 0)
-- Dependencies: 382
-- Name: TABLE envio; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.envio TO anon;
GRANT ALL ON TABLE public.envio TO authenticated;
GRANT ALL ON TABLE public.envio TO service_role;


--
-- TOC entry 5967 (class 0 OID 0)
-- Dependencies: 383
-- Name: TABLE envio_detalle; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.envio_detalle TO anon;
GRANT ALL ON TABLE public.envio_detalle TO authenticated;
GRANT ALL ON TABLE public.envio_detalle TO service_role;


--
-- TOC entry 5968 (class 0 OID 0)
-- Dependencies: 388
-- Name: TABLE estado_compra_item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.estado_compra_item TO anon;
GRANT ALL ON TABLE public.estado_compra_item TO authenticated;
GRANT ALL ON TABLE public.estado_compra_item TO service_role;


--
-- TOC entry 5969 (class 0 OID 0)
-- Dependencies: 387
-- Name: TABLE estado_venta_item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.estado_venta_item TO anon;
GRANT ALL ON TABLE public.estado_venta_item TO authenticated;
GRANT ALL ON TABLE public.estado_venta_item TO service_role;


--
-- TOC entry 5970 (class 0 OID 0)
-- Dependencies: 338
-- Name: TABLE factura; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.factura TO anon;
GRANT ALL ON TABLE public.factura TO authenticated;
GRANT ALL ON TABLE public.factura TO service_role;


--
-- TOC entry 5971 (class 0 OID 0)
-- Dependencies: 339
-- Name: TABLE factura_linea; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.factura_linea TO anon;
GRANT ALL ON TABLE public.factura_linea TO authenticated;
GRANT ALL ON TABLE public.factura_linea TO service_role;


--
-- TOC entry 5972 (class 0 OID 0)
-- Dependencies: 304
-- Name: TABLE forma_pago_catalogo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.forma_pago_catalogo TO anon;
GRANT ALL ON TABLE public.forma_pago_catalogo TO authenticated;
GRANT ALL ON TABLE public.forma_pago_catalogo TO service_role;


--
-- TOC entry 5973 (class 0 OID 0)
-- Dependencies: 330
-- Name: TABLE grupo_cuenta_personalizado; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.grupo_cuenta_personalizado TO anon;
GRANT ALL ON TABLE public.grupo_cuenta_personalizado TO authenticated;
GRANT ALL ON TABLE public.grupo_cuenta_personalizado TO service_role;


--
-- TOC entry 5974 (class 0 OID 0)
-- Dependencies: 346
-- Name: TABLE historial_conversion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.historial_conversion TO anon;
GRANT ALL ON TABLE public.historial_conversion TO authenticated;
GRANT ALL ON TABLE public.historial_conversion TO service_role;


--
-- TOC entry 5975 (class 0 OID 0)
-- Dependencies: 308
-- Name: TABLE impuestos; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.impuestos TO anon;
GRANT ALL ON TABLE public.impuestos TO authenticated;
GRANT ALL ON TABLE public.impuestos TO service_role;


--
-- TOC entry 5977 (class 0 OID 0)
-- Dependencies: 307
-- Name: SEQUENCE impuestos_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.impuestos_id_seq TO anon;
GRANT ALL ON SEQUENCE public.impuestos_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.impuestos_id_seq TO service_role;


--
-- TOC entry 5978 (class 0 OID 0)
-- Dependencies: 305
-- Name: TABLE incoterm_catalogo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.incoterm_catalogo TO anon;
GRANT ALL ON TABLE public.incoterm_catalogo TO authenticated;
GRANT ALL ON TABLE public.incoterm_catalogo TO service_role;


--
-- TOC entry 5979 (class 0 OID 0)
-- Dependencies: 337
-- Name: TABLE informe_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.informe_contable TO anon;
GRANT ALL ON TABLE public.informe_contable TO authenticated;
GRANT ALL ON TABLE public.informe_contable TO service_role;


--
-- TOC entry 5980 (class 0 OID 0)
-- Dependencies: 378
-- Name: TABLE inventario; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inventario TO anon;
GRANT ALL ON TABLE public.inventario TO authenticated;
GRANT ALL ON TABLE public.inventario TO service_role;


--
-- TOC entry 5981 (class 0 OID 0)
-- Dependencies: 379
-- Name: TABLE inventario_detalle; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inventario_detalle TO anon;
GRANT ALL ON TABLE public.inventario_detalle TO authenticated;
GRANT ALL ON TABLE public.inventario_detalle TO service_role;


--
-- TOC entry 5982 (class 0 OID 0)
-- Dependencies: 367
-- Name: TABLE item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.item TO anon;
GRANT ALL ON TABLE public.item TO authenticated;
GRANT ALL ON TABLE public.item TO service_role;


--
-- TOC entry 5983 (class 0 OID 0)
-- Dependencies: 396
-- Name: TABLE item_etiqueta_categoria; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.item_etiqueta_categoria TO anon;
GRANT ALL ON TABLE public.item_etiqueta_categoria TO authenticated;
GRANT ALL ON TABLE public.item_etiqueta_categoria TO service_role;


--
-- TOC entry 5984 (class 0 OID 0)
-- Dependencies: 397
-- Name: TABLE item_etiqueta_categoria_det; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.item_etiqueta_categoria_det TO anon;
GRANT ALL ON TABLE public.item_etiqueta_categoria_det TO authenticated;
GRANT ALL ON TABLE public.item_etiqueta_categoria_det TO service_role;


--
-- TOC entry 5985 (class 0 OID 0)
-- Dependencies: 377
-- Name: TABLE item_lote_serie; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.item_lote_serie TO anon;
GRANT ALL ON TABLE public.item_lote_serie TO authenticated;
GRANT ALL ON TABLE public.item_lote_serie TO service_role;


--
-- TOC entry 5986 (class 0 OID 0)
-- Dependencies: 334
-- Name: TABLE libro_mayor; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.libro_mayor TO anon;
GRANT ALL ON TABLE public.libro_mayor TO authenticated;
GRANT ALL ON TABLE public.libro_mayor TO service_role;


--
-- TOC entry 5987 (class 0 OID 0)
-- Dependencies: 369
-- Name: TABLE media; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.media TO anon;
GRANT ALL ON TABLE public.media TO authenticated;
GRANT ALL ON TABLE public.media TO service_role;


--
-- TOC entry 5988 (class 0 OID 0)
-- Dependencies: 289
-- Name: TABLE menu_item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.menu_item TO anon;
GRANT ALL ON TABLE public.menu_item TO authenticated;
GRANT ALL ON TABLE public.menu_item TO service_role;


--
-- TOC entry 5989 (class 0 OID 0)
-- Dependencies: 288
-- Name: TABLE menu_seccion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.menu_seccion TO anon;
GRANT ALL ON TABLE public.menu_seccion TO authenticated;
GRANT ALL ON TABLE public.menu_seccion TO service_role;


--
-- TOC entry 5990 (class 0 OID 0)
-- Dependencies: 312
-- Name: TABLE miembros; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.miembros TO anon;
GRANT ALL ON TABLE public.miembros TO authenticated;
GRANT ALL ON TABLE public.miembros TO service_role;


--
-- TOC entry 5992 (class 0 OID 0)
-- Dependencies: 311
-- Name: SEQUENCE miembros_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.miembros_id_seq TO anon;
GRANT ALL ON SEQUENCE public.miembros_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.miembros_id_seq TO service_role;


--
-- TOC entry 5993 (class 0 OID 0)
-- Dependencies: 318
-- Name: TABLE modelo_plan_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.modelo_plan_contable TO anon;
GRANT ALL ON TABLE public.modelo_plan_contable TO authenticated;
GRANT ALL ON TABLE public.modelo_plan_contable TO service_role;


--
-- TOC entry 5994 (class 0 OID 0)
-- Dependencies: 292
-- Name: TABLE moneda; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.moneda TO anon;
GRANT ALL ON TABLE public.moneda TO authenticated;
GRANT ALL ON TABLE public.moneda TO service_role;


--
-- TOC entry 5995 (class 0 OID 0)
-- Dependencies: 350
-- Name: TABLE movimiento_bancario; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.movimiento_bancario TO anon;
GRANT ALL ON TABLE public.movimiento_bancario TO authenticated;
GRANT ALL ON TABLE public.movimiento_bancario TO service_role;


--
-- TOC entry 5996 (class 0 OID 0)
-- Dependencies: 358
-- Name: TABLE movimiento_centro_costo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.movimiento_centro_costo TO anon;
GRANT ALL ON TABLE public.movimiento_centro_costo TO authenticated;
GRANT ALL ON TABLE public.movimiento_centro_costo TO service_role;


--
-- TOC entry 5997 (class 0 OID 0)
-- Dependencies: 333
-- Name: TABLE movimiento_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.movimiento_contable TO anon;
GRANT ALL ON TABLE public.movimiento_contable TO authenticated;
GRANT ALL ON TABLE public.movimiento_contable TO service_role;


--
-- TOC entry 5998 (class 0 OID 0)
-- Dependencies: 362
-- Name: TABLE movimiento_cuenta; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.movimiento_cuenta TO anon;
GRANT ALL ON TABLE public.movimiento_cuenta TO authenticated;
GRANT ALL ON TABLE public.movimiento_cuenta TO service_role;


--
-- TOC entry 5999 (class 0 OID 0)
-- Dependencies: 351
-- Name: TABLE movimiento_inventario; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.movimiento_inventario TO anon;
GRANT ALL ON TABLE public.movimiento_inventario TO authenticated;
GRANT ALL ON TABLE public.movimiento_inventario TO service_role;


--
-- TOC entry 6000 (class 0 OID 0)
-- Dependencies: 401
-- Name: TABLE naturaleza_item_catalogo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.naturaleza_item_catalogo TO anon;
GRANT ALL ON TABLE public.naturaleza_item_catalogo TO authenticated;
GRANT ALL ON TABLE public.naturaleza_item_catalogo TO service_role;


--
-- TOC entry 6001 (class 0 OID 0)
-- Dependencies: 354
-- Name: TABLE nota_credito; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.nota_credito TO anon;
GRANT ALL ON TABLE public.nota_credito TO authenticated;
GRANT ALL ON TABLE public.nota_credito TO service_role;


--
-- TOC entry 6002 (class 0 OID 0)
-- Dependencies: 355
-- Name: TABLE nota_credito_linea; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.nota_credito_linea TO anon;
GRANT ALL ON TABLE public.nota_credito_linea TO authenticated;
GRANT ALL ON TABLE public.nota_credito_linea TO service_role;


--
-- TOC entry 6003 (class 0 OID 0)
-- Dependencies: 347
-- Name: TABLE pago; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pago TO anon;
GRANT ALL ON TABLE public.pago TO authenticated;
GRANT ALL ON TABLE public.pago TO service_role;


--
-- TOC entry 6004 (class 0 OID 0)
-- Dependencies: 348
-- Name: TABLE pago_factura; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pago_factura TO anon;
GRANT ALL ON TABLE public.pago_factura TO authenticated;
GRANT ALL ON TABLE public.pago_factura TO service_role;


--
-- TOC entry 6005 (class 0 OID 0)
-- Dependencies: 293
-- Name: TABLE pais; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pais TO anon;
GRANT ALL ON TABLE public.pais TO authenticated;
GRANT ALL ON TABLE public.pais TO service_role;


--
-- TOC entry 6006 (class 0 OID 0)
-- Dependencies: 286
-- Name: TABLE perfil; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.perfil TO anon;
GRANT ALL ON TABLE public.perfil TO authenticated;
GRANT ALL ON TABLE public.perfil TO service_role;


--
-- TOC entry 6007 (class 0 OID 0)
-- Dependencies: 313
-- Name: TABLE perfil_menu_permiso; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.perfil_menu_permiso TO anon;
GRANT ALL ON TABLE public.perfil_menu_permiso TO authenticated;
GRANT ALL ON TABLE public.perfil_menu_permiso TO service_role;


--
-- TOC entry 6008 (class 0 OID 0)
-- Dependencies: 321
-- Name: TABLE periodo_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.periodo_contable TO anon;
GRANT ALL ON TABLE public.periodo_contable TO authenticated;
GRANT ALL ON TABLE public.periodo_contable TO service_role;


--
-- TOC entry 6009 (class 0 OID 0)
-- Dependencies: 319
-- Name: TABLE plan_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.plan_contable TO anon;
GRANT ALL ON TABLE public.plan_contable TO authenticated;
GRANT ALL ON TABLE public.plan_contable TO service_role;


--
-- TOC entry 6010 (class 0 OID 0)
-- Dependencies: 342
-- Name: TABLE prefactura; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.prefactura TO anon;
GRANT ALL ON TABLE public.prefactura TO authenticated;
GRANT ALL ON TABLE public.prefactura TO service_role;


--
-- TOC entry 6011 (class 0 OID 0)
-- Dependencies: 345
-- Name: TABLE prefactura_factura; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.prefactura_factura TO anon;
GRANT ALL ON TABLE public.prefactura_factura TO authenticated;
GRANT ALL ON TABLE public.prefactura_factura TO service_role;


--
-- TOC entry 6012 (class 0 OID 0)
-- Dependencies: 343
-- Name: TABLE prefactura_linea; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.prefactura_linea TO anon;
GRANT ALL ON TABLE public.prefactura_linea TO authenticated;
GRANT ALL ON TABLE public.prefactura_linea TO service_role;


--
-- TOC entry 6013 (class 0 OID 0)
-- Dependencies: 352
-- Name: TABLE presupuesto; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.presupuesto TO anon;
GRANT ALL ON TABLE public.presupuesto TO authenticated;
GRANT ALL ON TABLE public.presupuesto TO service_role;


--
-- TOC entry 6014 (class 0 OID 0)
-- Dependencies: 353
-- Name: TABLE presupuesto_linea; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.presupuesto_linea TO anon;
GRANT ALL ON TABLE public.presupuesto_linea TO authenticated;
GRANT ALL ON TABLE public.presupuesto_linea TO service_role;


--
-- TOC entry 6015 (class 0 OID 0)
-- Dependencies: 294
-- Name: TABLE provincia; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.provincia TO anon;
GRANT ALL ON TABLE public.provincia TO authenticated;
GRANT ALL ON TABLE public.provincia TO service_role;


--
-- TOC entry 6016 (class 0 OID 0)
-- Dependencies: 384
-- Name: TABLE recepcion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.recepcion TO anon;
GRANT ALL ON TABLE public.recepcion TO authenticated;
GRANT ALL ON TABLE public.recepcion TO service_role;


--
-- TOC entry 6017 (class 0 OID 0)
-- Dependencies: 385
-- Name: TABLE recepcion_detalle; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.recepcion_detalle TO anon;
GRANT ALL ON TABLE public.recepcion_detalle TO authenticated;
GRANT ALL ON TABLE public.recepcion_detalle TO service_role;


--
-- TOC entry 6018 (class 0 OID 0)
-- Dependencies: 356
-- Name: TABLE retencion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.retencion TO anon;
GRANT ALL ON TABLE public.retencion TO authenticated;
GRANT ALL ON TABLE public.retencion TO service_role;


--
-- TOC entry 6019 (class 0 OID 0)
-- Dependencies: 403
-- Name: TABLE rol_socio; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.rol_socio TO anon;
GRANT ALL ON TABLE public.rol_socio TO authenticated;
GRANT ALL ON TABLE public.rol_socio TO service_role;


--
-- TOC entry 6020 (class 0 OID 0)
-- Dependencies: 335
-- Name: TABLE saldo_cuenta; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.saldo_cuenta TO anon;
GRANT ALL ON TABLE public.saldo_cuenta TO authenticated;
GRANT ALL ON TABLE public.saldo_cuenta TO service_role;


--
-- TOC entry 6022 (class 0 OID 0)
-- Dependencies: 371
-- Name: TABLE secuencia_asiento; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.secuencia_asiento TO anon;
GRANT ALL ON TABLE public.secuencia_asiento TO authenticated;
GRANT ALL ON TABLE public.secuencia_asiento TO service_role;


--
-- TOC entry 6024 (class 0 OID 0)
-- Dependencies: 370
-- Name: SEQUENCE secuencia_asiento_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.secuencia_asiento_id_seq TO anon;
GRANT ALL ON SEQUENCE public.secuencia_asiento_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.secuencia_asiento_id_seq TO service_role;


--
-- TOC entry 6025 (class 0 OID 0)
-- Dependencies: 298
-- Name: TABLE social_network; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.social_network TO anon;
GRANT ALL ON TABLE public.social_network TO authenticated;
GRANT ALL ON TABLE public.social_network TO service_role;


--
-- TOC entry 6026 (class 0 OID 0)
-- Dependencies: 404
-- Name: TABLE socio; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.socio TO anon;
GRANT ALL ON TABLE public.socio TO authenticated;
GRANT ALL ON TABLE public.socio TO service_role;


--
-- TOC entry 6027 (class 0 OID 0)
-- Dependencies: 405
-- Name: TABLE socio_tercero; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.socio_tercero TO anon;
GRANT ALL ON TABLE public.socio_tercero TO authenticated;
GRANT ALL ON TABLE public.socio_tercero TO service_role;


--
-- TOC entry 6028 (class 0 OID 0)
-- Dependencies: 376
-- Name: TABLE stock_item_almacen; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.stock_item_almacen TO anon;
GRANT ALL ON TABLE public.stock_item_almacen TO authenticated;
GRANT ALL ON TABLE public.stock_item_almacen TO service_role;


--
-- TOC entry 6029 (class 0 OID 0)
-- Dependencies: 285
-- Name: TABLE sucursal; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sucursal TO anon;
GRANT ALL ON TABLE public.sucursal TO authenticated;
GRANT ALL ON TABLE public.sucursal TO service_role;


--
-- TOC entry 6030 (class 0 OID 0)
-- Dependencies: 393
-- Name: TABLE tamano_empresa; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tamano_empresa TO anon;
GRANT ALL ON TABLE public.tamano_empresa TO authenticated;
GRANT ALL ON TABLE public.tamano_empresa TO service_role;


--
-- TOC entry 6031 (class 0 OID 0)
-- Dependencies: 306
-- Name: TABLE tercero; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tercero TO anon;
GRANT ALL ON TABLE public.tercero TO authenticated;
GRANT ALL ON TABLE public.tercero TO service_role;


--
-- TOC entry 6032 (class 0 OID 0)
-- Dependencies: 359
-- Name: TABLE tipo_cambio; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipo_cambio TO anon;
GRANT ALL ON TABLE public.tipo_cambio TO authenticated;
GRANT ALL ON TABLE public.tipo_cambio TO service_role;


--
-- TOC entry 6033 (class 0 OID 0)
-- Dependencies: 402
-- Name: TABLE tipo_comportamiento_item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipo_comportamiento_item TO anon;
GRANT ALL ON TABLE public.tipo_comportamiento_item TO authenticated;
GRANT ALL ON TABLE public.tipo_comportamiento_item TO service_role;


--
-- TOC entry 6034 (class 0 OID 0)
-- Dependencies: 389
-- Name: TABLE tipo_control_caducidad_item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipo_control_caducidad_item TO anon;
GRANT ALL ON TABLE public.tipo_control_caducidad_item TO authenticated;
GRANT ALL ON TABLE public.tipo_control_caducidad_item TO service_role;


--
-- TOC entry 6035 (class 0 OID 0)
-- Dependencies: 400
-- Name: TABLE tipo_control_inventario_item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipo_control_inventario_item TO anon;
GRANT ALL ON TABLE public.tipo_control_inventario_item TO authenticated;
GRANT ALL ON TABLE public.tipo_control_inventario_item TO service_role;


--
-- TOC entry 6036 (class 0 OID 0)
-- Dependencies: 296
-- Name: TABLE tipo_entidad_comercial; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipo_entidad_comercial TO anon;
GRANT ALL ON TABLE public.tipo_entidad_comercial TO authenticated;
GRANT ALL ON TABLE public.tipo_entidad_comercial TO service_role;


--
-- TOC entry 6038 (class 0 OID 0)
-- Dependencies: 295
-- Name: SEQUENCE tipo_entidad_comercial_id_tipo_entidad_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tipo_entidad_comercial_id_tipo_entidad_seq TO anon;
GRANT ALL ON SEQUENCE public.tipo_entidad_comercial_id_tipo_entidad_seq TO authenticated;
GRANT ALL ON SEQUENCE public.tipo_entidad_comercial_id_tipo_entidad_seq TO service_role;


--
-- TOC entry 6039 (class 0 OID 0)
-- Dependencies: 390
-- Name: TABLE tipo_item_catalogo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipo_item_catalogo TO anon;
GRANT ALL ON TABLE public.tipo_item_catalogo TO authenticated;
GRANT ALL ON TABLE public.tipo_item_catalogo TO service_role;


--
-- TOC entry 6040 (class 0 OID 0)
-- Dependencies: 392
-- Name: TABLE tipo_movimiento_contable_item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipo_movimiento_contable_item TO anon;
GRANT ALL ON TABLE public.tipo_movimiento_contable_item TO authenticated;
GRANT ALL ON TABLE public.tipo_movimiento_contable_item TO service_role;


--
-- TOC entry 6041 (class 0 OID 0)
-- Dependencies: 302
-- Name: TABLE tipo_tercero_catalogo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipo_tercero_catalogo TO anon;
GRANT ALL ON TABLE public.tipo_tercero_catalogo TO authenticated;
GRANT ALL ON TABLE public.tipo_tercero_catalogo TO service_role;


--
-- TOC entry 6042 (class 0 OID 0)
-- Dependencies: 373
-- Name: TABLE tipo_unidad_medida; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipo_unidad_medida TO anon;
GRANT ALL ON TABLE public.tipo_unidad_medida TO authenticated;
GRANT ALL ON TABLE public.tipo_unidad_medida TO service_role;


--
-- TOC entry 6043 (class 0 OID 0)
-- Dependencies: 310
-- Name: TABLE tipos_miembro; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipos_miembro TO anon;
GRANT ALL ON TABLE public.tipos_miembro TO authenticated;
GRANT ALL ON TABLE public.tipos_miembro TO service_role;


--
-- TOC entry 6045 (class 0 OID 0)
-- Dependencies: 309
-- Name: SEQUENCE tipos_miembro_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tipos_miembro_id_seq TO anon;
GRANT ALL ON SEQUENCE public.tipos_miembro_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.tipos_miembro_id_seq TO service_role;


--
-- TOC entry 6046 (class 0 OID 0)
-- Dependencies: 361
-- Name: TABLE titular_cuenta; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.titular_cuenta TO anon;
GRANT ALL ON TABLE public.titular_cuenta TO authenticated;
GRANT ALL ON TABLE public.titular_cuenta TO service_role;


--
-- TOC entry 6047 (class 0 OID 0)
-- Dependencies: 380
-- Name: TABLE transferencia_stock; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transferencia_stock TO anon;
GRANT ALL ON TABLE public.transferencia_stock TO authenticated;
GRANT ALL ON TABLE public.transferencia_stock TO service_role;


--
-- TOC entry 6048 (class 0 OID 0)
-- Dependencies: 381
-- Name: TABLE transferencia_stock_detalle; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transferencia_stock_detalle TO anon;
GRANT ALL ON TABLE public.transferencia_stock_detalle TO authenticated;
GRANT ALL ON TABLE public.transferencia_stock_detalle TO service_role;


--
-- TOC entry 6049 (class 0 OID 0)
-- Dependencies: 374
-- Name: TABLE unidad_medida; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.unidad_medida TO anon;
GRANT ALL ON TABLE public.unidad_medida TO authenticated;
GRANT ALL ON TABLE public.unidad_medida TO service_role;


--
-- TOC entry 6050 (class 0 OID 0)
-- Dependencies: 287
-- Name: TABLE usuario; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.usuario TO anon;
GRANT ALL ON TABLE public.usuario TO authenticated;
GRANT ALL ON TABLE public.usuario TO service_role;


--
-- TOC entry 6051 (class 0 OID 0)
-- Dependencies: 283
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- TOC entry 6052 (class 0 OID 0)
-- Dependencies: 275
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- TOC entry 6053 (class 0 OID 0)
-- Dependencies: 278
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- TOC entry 6054 (class 0 OID 0)
-- Dependencies: 277
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- TOC entry 6056 (class 0 OID 0)
-- Dependencies: 259
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.buckets FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- TOC entry 6057 (class 0 OID 0)
-- Dependencies: 314
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- TOC entry 6058 (class 0 OID 0)
-- Dependencies: 363
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- TOC entry 6060 (class 0 OID 0)
-- Dependencies: 260
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.objects FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- TOC entry 6061 (class 0 OID 0)
-- Dependencies: 279
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- TOC entry 6062 (class 0 OID 0)
-- Dependencies: 280
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- TOC entry 6063 (class 0 OID 0)
-- Dependencies: 364
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- TOC entry 6064 (class 0 OID 0)
-- Dependencies: 262
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- TOC entry 6065 (class 0 OID 0)
-- Dependencies: 263
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- TOC entry 2826 (class 826 OID 16601)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- TOC entry 2827 (class 826 OID 16602)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- TOC entry 2825 (class 826 OID 16600)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- TOC entry 2836 (class 826 OID 16680)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- TOC entry 2835 (class 826 OID 16679)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- TOC entry 2834 (class 826 OID 16678)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- TOC entry 2839 (class 826 OID 16635)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2838 (class 826 OID 16634)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2837 (class 826 OID 16633)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2831 (class 826 OID 16615)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2833 (class 826 OID 16614)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2832 (class 826 OID 16613)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2818 (class 826 OID 16488)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2819 (class 826 OID 16489)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2817 (class 826 OID 16487)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2821 (class 826 OID 16491)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2816 (class 826 OID 16486)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2820 (class 826 OID 16490)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2829 (class 826 OID 16605)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- TOC entry 2830 (class 826 OID 16606)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- TOC entry 2828 (class 826 OID 16604)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- TOC entry 2824 (class 826 OID 16543)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2823 (class 826 OID 16542)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2822 (class 826 OID 16541)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 4006 (class 3466 OID 16619)
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- TOC entry 4009 (class 3466 OID 16698)
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- TOC entry 4005 (class 3466 OID 16617)
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- TOC entry 4010 (class 3466 OID 16701)
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- TOC entry 4007 (class 3466 OID 16620)
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- TOC entry 4008 (class 3466 OID 16621)
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

-- Completed on 2026-04-26 18:43:15

--
-- PostgreSQL database dump complete
--

\unrestrict BTEYt4MfUyaawkJPoaqDZ5MecMOObXVGPVUU1wP2n005rLdlJt4afdOCJHGCyhW


--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.5

-- Started on 2026-03-08 19:50:12

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
-- TOC entry 17 (class 2615 OID 16492)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- TOC entry 13 (class 2615 OID 16388)
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- TOC entry 16 (class 2615 OID 16622)
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- TOC entry 15 (class 2615 OID 16611)
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- TOC entry 11 (class 2615 OID 16386)
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- TOC entry 9 (class 2615 OID 16603)
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- TOC entry 18 (class 2615 OID 16540)
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- TOC entry 14 (class 2615 OID 16651)
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- TOC entry 6 (class 3079 OID 16687)
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- TOC entry 5608 (class 0 OID 0)
-- Dependencies: 6
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- TOC entry 4 (class 3079 OID 16389)
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- TOC entry 5609 (class 0 OID 0)
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
-- TOC entry 5610 (class 0 OID 0)
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
-- TOC entry 5611 (class 0 OID 0)
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
-- TOC entry 5612 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 1187 (class 1247 OID 16780)
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- TOC entry 1211 (class 1247 OID 16921)
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- TOC entry 1184 (class 1247 OID 16774)
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- TOC entry 1181 (class 1247 OID 16769)
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1359 (class 1247 OID 94200)
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
-- TOC entry 1371 (class 1247 OID 94273)
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1280 (class 1247 OID 78671)
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1362 (class 1247 OID 94210)
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1217 (class 1247 OID 16963)
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
-- TOC entry 1496 (class 1247 OID 106324)
-- Name: estado_cuenta_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_cuenta_enum AS ENUM (
    'abierta',
    'cerrada'
);


ALTER TYPE public.estado_cuenta_enum OWNER TO postgres;

--
-- TOC entry 1493 (class 1247 OID 106312)
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
-- TOC entry 1256 (class 1247 OID 17135)
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
-- TOC entry 1226 (class 1247 OID 17010)
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
-- TOC entry 1229 (class 1247 OID 17025)
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- TOC entry 1262 (class 1247 OID 17176)
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
-- TOC entry 1259 (class 1247 OID 17147)
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
-- TOC entry 1431 (class 1247 OID 53236)
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- TOC entry 456 (class 1255 OID 16538)
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
-- TOC entry 5613 (class 0 OID 0)
-- Dependencies: 456
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- TOC entry 475 (class 1255 OID 16751)
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
-- TOC entry 455 (class 1255 OID 16537)
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
-- TOC entry 5616 (class 0 OID 0)
-- Dependencies: 455
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- TOC entry 454 (class 1255 OID 16536)
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
-- TOC entry 5618 (class 0 OID 0)
-- Dependencies: 454
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- TOC entry 457 (class 1255 OID 16595)
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
-- TOC entry 5634 (class 0 OID 0)
-- Dependencies: 457
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- TOC entry 461 (class 1255 OID 16616)
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
-- TOC entry 5636 (class 0 OID 0)
-- Dependencies: 461
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- TOC entry 458 (class 1255 OID 16597)
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
-- TOC entry 5638 (class 0 OID 0)
-- Dependencies: 458
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- TOC entry 459 (class 1255 OID 16607)
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
-- TOC entry 460 (class 1255 OID 16608)
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
-- TOC entry 462 (class 1255 OID 16618)
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
-- TOC entry 5667 (class 0 OID 0)
-- Dependencies: 462
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- TOC entry 404 (class 1255 OID 16387)
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
-- TOC entry 522 (class 1255 OID 216439)
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
-- TOC entry 5681 (class 0 OID 0)
-- Dependencies: 522
-- Name: FUNCTION balance_comprobacion(p_empresa_id uuid, p_fecha_desde date, p_fecha_hasta date); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.balance_comprobacion(p_empresa_id uuid, p_fecha_desde date, p_fecha_hasta date) IS 'Balance de comprobación por empresa y rango de fechas (solo asientos APROBADO)';


--
-- TOC entry 525 (class 1255 OID 216443)
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
-- TOC entry 5683 (class 0 OID 0)
-- Dependencies: 525
-- Name: FUNCTION balance_general_saldos(p_empresa_id uuid, p_fecha_corte date); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.balance_general_saldos(p_empresa_id uuid, p_fecha_corte date) IS 'Saldos por tipo de cuenta para Balance General a fecha de corte (solo asientos APROBADO)';


--
-- TOC entry 524 (class 1255 OID 216441)
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
-- TOC entry 5685 (class 0 OID 0)
-- Dependencies: 524
-- Name: FUNCTION estado_resultados(p_empresa_id integer, p_fecha_desde date, p_fecha_hasta date); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.estado_resultados(p_empresa_id integer, p_fecha_desde date, p_fecha_hasta date) IS 'Estado de resultados: ingresos, gastos y resultado del periodo (solo asientos APROBADO)';


--
-- TOC entry 523 (class 1255 OID 216440)
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
-- TOC entry 5687 (class 0 OID 0)
-- Dependencies: 523
-- Name: FUNCTION libro_mayor(p_empresa_id integer, p_cuenta_id integer, p_fecha_desde date, p_fecha_hasta date); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.libro_mayor(p_empresa_id integer, p_cuenta_id integer, p_fecha_desde date, p_fecha_hasta date) IS 'Libro mayor por cuenta: movimientos con saldo acumulado (solo asientos APROBADO)';


--
-- TOC entry 521 (class 1255 OID 216436)
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
-- TOC entry 5689 (class 0 OID 0)
-- Dependencies: 521
-- Name: FUNCTION obtener_siguiente_numero_asiento(p_empresa_id integer, p_prefijo character varying, p_fecha date); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.obtener_siguiente_numero_asiento(p_empresa_id integer, p_prefijo character varying, p_fecha date) IS 'Genera número único de asiento por empresa/diario/periodo con bloqueo transaccional';


--
-- TOC entry 520 (class 1255 OID 208605)
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
-- TOC entry 518 (class 1255 OID 106395)
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
-- TOC entry 519 (class 1255 OID 106397)
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
-- TOC entry 517 (class 1255 OID 106375)
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
-- TOC entry 490 (class 1255 OID 17169)
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
        subs.entity = entity_;

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
-- TOC entry 496 (class 1255 OID 17248)
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
-- TOC entry 492 (class 1255 OID 17181)
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
-- TOC entry 488 (class 1255 OID 17131)
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- TOC entry 487 (class 1255 OID 17126)
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
-- TOC entry 491 (class 1255 OID 17177)
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
-- TOC entry 493 (class 1255 OID 17188)
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
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
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- TOC entry 486 (class 1255 OID 17125)
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
-- TOC entry 495 (class 1255 OID 17247)
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
-- TOC entry 485 (class 1255 OID 17123)
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
-- TOC entry 489 (class 1255 OID 17158)
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- TOC entry 494 (class 1255 OID 17241)
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- TOC entry 500 (class 1255 OID 53214)
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


ALTER FUNCTION storage.add_prefixes(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 481 (class 1255 OID 17067)
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
-- TOC entry 512 (class 1255 OID 84218)
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
-- TOC entry 501 (class 1255 OID 53215)
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


ALTER FUNCTION storage.delete_prefix(_bucket_id text, _name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 504 (class 1255 OID 53218)
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


ALTER FUNCTION storage.delete_prefix_hierarchy_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 509 (class 1255 OID 53233)
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
-- TOC entry 478 (class 1255 OID 17041)
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
-- TOC entry 477 (class 1255 OID 17040)
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
-- TOC entry 476 (class 1255 OID 17039)
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
-- TOC entry 497 (class 1255 OID 53196)
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 498 (class 1255 OID 53212)
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
-- TOC entry 499 (class 1255 OID 53213)
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
-- TOC entry 507 (class 1255 OID 53231)
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
-- TOC entry 483 (class 1255 OID 17106)
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
-- TOC entry 482 (class 1255 OID 17069)
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- TOC entry 511 (class 1255 OID 84217)
-- Name: lock_top_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


ALTER FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- TOC entry 513 (class 1255 OID 84219)
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- TOC entry 503 (class 1255 OID 53217)
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_insert_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 514 (class 1255 OID 84220)
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.objects_update_cleanup() OWNER TO supabase_storage_admin;

--
-- TOC entry 516 (class 1255 OID 84225)
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_level_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_level_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 508 (class 1255 OID 53232)
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.objects_update_prefix_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 484 (class 1255 OID 17122)
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
-- TOC entry 515 (class 1255 OID 84221)
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.prefixes_delete_cleanup() OWNER TO supabase_storage_admin;

--
-- TOC entry 502 (class 1255 OID 53216)
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


ALTER FUNCTION storage.prefixes_insert_trigger() OWNER TO supabase_storage_admin;

--
-- TOC entry 479 (class 1255 OID 17056)
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- TOC entry 506 (class 1255 OID 53229)
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
-- TOC entry 505 (class 1255 OID 53228)
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
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
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- TOC entry 510 (class 1255 OID 84216)
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- TOC entry 480 (class 1255 OID 17057)
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
-- TOC entry 254 (class 1259 OID 16523)
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
-- TOC entry 5710 (class 0 OID 0)
-- Dependencies: 254
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- TOC entry 369 (class 1259 OID 211933)
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
-- TOC entry 271 (class 1259 OID 16925)
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
-- TOC entry 5713 (class 0 OID 0)
-- Dependencies: 271
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- TOC entry 262 (class 1259 OID 16723)
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
-- TOC entry 5715 (class 0 OID 0)
-- Dependencies: 262
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- TOC entry 5716 (class 0 OID 0)
-- Dependencies: 262
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- TOC entry 253 (class 1259 OID 16516)
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
-- TOC entry 5718 (class 0 OID 0)
-- Dependencies: 253
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- TOC entry 266 (class 1259 OID 16812)
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
-- TOC entry 5720 (class 0 OID 0)
-- Dependencies: 266
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- TOC entry 265 (class 1259 OID 16800)
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
-- TOC entry 5722 (class 0 OID 0)
-- Dependencies: 265
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- TOC entry 264 (class 1259 OID 16787)
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
-- TOC entry 5724 (class 0 OID 0)
-- Dependencies: 264
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- TOC entry 5725 (class 0 OID 0)
-- Dependencies: 264
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- TOC entry 326 (class 1259 OID 94213)
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
-- TOC entry 366 (class 1259 OID 144205)
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
-- TOC entry 5728 (class 0 OID 0)
-- Dependencies: 366
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- TOC entry 314 (class 1259 OID 78675)
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
-- TOC entry 327 (class 1259 OID 94246)
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
-- TOC entry 272 (class 1259 OID 16975)
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
-- TOC entry 252 (class 1259 OID 16505)
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
-- TOC entry 5733 (class 0 OID 0)
-- Dependencies: 252
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- TOC entry 251 (class 1259 OID 16504)
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
-- TOC entry 5735 (class 0 OID 0)
-- Dependencies: 251
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- TOC entry 269 (class 1259 OID 16854)
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
-- TOC entry 5737 (class 0 OID 0)
-- Dependencies: 269
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- TOC entry 270 (class 1259 OID 16872)
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
-- TOC entry 5739 (class 0 OID 0)
-- Dependencies: 270
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- TOC entry 255 (class 1259 OID 16531)
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- TOC entry 5741 (class 0 OID 0)
-- Dependencies: 255
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- TOC entry 263 (class 1259 OID 16753)
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
-- TOC entry 5743 (class 0 OID 0)
-- Dependencies: 263
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- TOC entry 5744 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- TOC entry 5745 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- TOC entry 5746 (class 0 OID 0)
-- Dependencies: 263
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- TOC entry 268 (class 1259 OID 16839)
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
-- TOC entry 5748 (class 0 OID 0)
-- Dependencies: 268
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- TOC entry 267 (class 1259 OID 16830)
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
-- TOC entry 5750 (class 0 OID 0)
-- Dependencies: 267
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- TOC entry 5751 (class 0 OID 0)
-- Dependencies: 267
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- TOC entry 250 (class 1259 OID 16493)
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
-- TOC entry 5753 (class 0 OID 0)
-- Dependencies: 250
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- TOC entry 5754 (class 0 OID 0)
-- Dependencies: 250
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- TOC entry 376 (class 1259 OID 220931)
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
-- TOC entry 331 (class 1259 OID 98859)
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
-- TOC entry 5759 (class 0 OID 0)
-- Dependencies: 331
-- Name: COLUMN asiento_contable.reversed_entry_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.asiento_contable.reversed_entry_id IS 'ID del asiento reverso que invirtió este asiento (solo cuando estado = REVERSED)';


--
-- TOC entry 387 (class 1259 OID 222344)
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
-- TOC entry 356 (class 1259 OID 99533)
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
-- TOC entry 359 (class 1259 OID 99593)
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
-- TOC entry 328 (class 1259 OID 98790)
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
-- TOC entry 373 (class 1259 OID 219784)
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
-- TOC entry 348 (class 1259 OID 99318)
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
-- TOC entry 301 (class 1259 OID 22065)
-- Name: condicion_pago_catalogo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.condicion_pago_catalogo (
    id_condicion_pago uuid DEFAULT gen_random_uuid() NOT NULL,
    descripcion character varying(100) NOT NULL
);


ALTER TABLE public.condicion_pago_catalogo OWNER TO postgres;

--
-- TOC entry 315 (class 1259 OID 93112)
-- Name: configuracion_contabilidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configuracion_contabilidad (
    id_configuracion_contabilidad uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    id_moneda_base uuid NOT NULL,
    formato_cuenta character varying(20) DEFAULT 'XXXX-XXXX-XXXX'::character varying,
    separador_cuenta character varying(5) DEFAULT '-'::character varying,
    longitud_nivel integer DEFAULT 4,
    usar_centavos boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.configuracion_contabilidad OWNER TO postgres;

--
-- TOC entry 298 (class 1259 OID 18651)
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
-- TOC entry 367 (class 1259 OID 207464)
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
-- TOC entry 339 (class 1259 OID 99073)
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
-- TOC entry 340 (class 1259 OID 99108)
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
-- TOC entry 343 (class 1259 OID 99200)
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
-- TOC entry 322 (class 1259 OID 93269)
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
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cuenta_bancaria OWNER TO postgres;

--
-- TOC entry 319 (class 1259 OID 93200)
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
-- TOC entry 321 (class 1259 OID 93246)
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
-- TOC entry 325 (class 1259 OID 93344)
-- Name: cuenta_contable_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuenta_contable_item (
    id_cuenta_contable_item uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    tipo_movimiento character varying(50) NOT NULL,
    id_cuenta_contable uuid NOT NULL,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    id_item uuid
);


ALTER TABLE public.cuenta_contable_item OWNER TO postgres;

--
-- TOC entry 361 (class 1259 OID 106329)
-- Name: cuenta_financiera; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuenta_financiera (
    id_cuenta_financiera uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    referencia character varying(64) NOT NULL,
    etiqueta_cuenta character varying(160) NOT NULL,
    tipo_cuenta public.tipo_cuenta_enum DEFAULT 'corriente'::public.tipo_cuenta_enum NOT NULL,
    estado_cuenta public.estado_cuenta_enum DEFAULT 'abierta'::public.estado_cuenta_enum NOT NULL,
    id_moneda uuid NOT NULL,
    id_pais_cuenta uuid,
    id_provincia_cuenta uuid,
    nombre_banco character varying(160),
    numero_cuenta_iban character varying(34),
    codigo_bic_swift character varying(11),
    numero_cuenta character varying(64),
    domiciliacion character varying(240),
    web character varying(240),
    comentario text,
    saldo_inicial numeric(18,2) DEFAULT 0.00 NOT NULL,
    fecha_inicial date DEFAULT CURRENT_DATE NOT NULL,
    saldo_minimo_autorizado numeric(18,2),
    saldo_minimo_deseado numeric(18,2),
    id_titular_cuenta uuid,
    codigo_contable character varying(64),
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL,
    estado boolean DEFAULT true NOT NULL,
    id_tercero uuid,
    CONSTRAINT chk_bic_len CHECK (((codigo_bic_swift IS NULL) OR (length((codigo_bic_swift)::text) = ANY (ARRAY[8, 11])))),
    CONSTRAINT chk_iban_len CHECK (((numero_cuenta_iban IS NULL) OR ((length((numero_cuenta_iban)::text) >= 15) AND (length((numero_cuenta_iban)::text) <= 34))))
);


ALTER TABLE public.cuenta_financiera OWNER TO postgres;

--
-- TOC entry 330 (class 1259 OID 98840)
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
-- TOC entry 324 (class 1259 OID 93323)
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
-- TOC entry 323 (class 1259 OID 93302)
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
-- TOC entry 316 (class 1259 OID 93148)
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
-- TOC entry 335 (class 1259 OID 98970)
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
-- TOC entry 392 (class 1259 OID 222483)
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
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.duracion_unidad_catalogo OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 17267)
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
-- TOC entry 299 (class 1259 OID 18686)
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
-- TOC entry 295 (class 1259 OID 18578)
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
-- TOC entry 297 (class 1259 OID 18621)
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
-- TOC entry 289 (class 1259 OID 18510)
-- Name: entidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.entidad (
    id integer NOT NULL,
    nombre character varying(120) NOT NULL
);


ALTER TABLE public.entidad OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 18509)
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
-- TOC entry 5790 (class 0 OID 0)
-- Dependencies: 288
-- Name: entidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.entidad_id_seq OWNED BY public.entidad.id;


--
-- TOC entry 383 (class 1259 OID 221096)
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
-- TOC entry 384 (class 1259 OID 221114)
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
-- TOC entry 389 (class 1259 OID 222418)
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
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.estado_compra_item OWNER TO postgres;

--
-- TOC entry 388 (class 1259 OID 222403)
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
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.estado_venta_item OWNER TO postgres;

--
-- TOC entry 337 (class 1259 OID 99019)
-- Name: factura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.factura (
    id_factura uuid DEFAULT gen_random_uuid() NOT NULL,
    id_empresa uuid NOT NULL,
    numero_factura character varying(50) NOT NULL,
    tipo_factura character varying(20) NOT NULL,
    id_tercero uuid NOT NULL,
    fecha_factura date NOT NULL,
    fecha_vencimiento date,
    subtotal numeric(15,2) NOT NULL,
    total_impuestos numeric(15,2) DEFAULT 0,
    total_descuentos numeric(15,2) DEFAULT 0,
    total_factura numeric(15,2) NOT NULL,
    estado character varying(20) DEFAULT 'BORRADOR'::character varying,
    id_asiento_contable uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.factura OWNER TO postgres;

--
-- TOC entry 338 (class 1259 OID 99047)
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
-- TOC entry 302 (class 1259 OID 22112)
-- Name: forma_pago_catalogo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forma_pago_catalogo (
    id_forma_pago uuid DEFAULT gen_random_uuid() NOT NULL,
    descripcion character varying(100) NOT NULL
);


ALTER TABLE public.forma_pago_catalogo OWNER TO postgres;

--
-- TOC entry 329 (class 1259 OID 98822)
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
-- TOC entry 345 (class 1259 OID 99240)
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
-- TOC entry 306 (class 1259 OID 24389)
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
-- TOC entry 305 (class 1259 OID 24388)
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
-- TOC entry 5802 (class 0 OID 0)
-- Dependencies: 305
-- Name: impuestos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.impuestos_id_seq OWNED BY public.impuestos.id;


--
-- TOC entry 303 (class 1259 OID 22120)
-- Name: incoterm_catalogo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.incoterm_catalogo (
    id_incoterm uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo character varying(10) NOT NULL,
    descripcion character varying(100)
);


ALTER TABLE public.incoterm_catalogo OWNER TO postgres;

--
-- TOC entry 336 (class 1259 OID 99001)
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
-- TOC entry 379 (class 1259 OID 221001)
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
-- TOC entry 380 (class 1259 OID 221018)
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
-- TOC entry 368 (class 1259 OID 208587)
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
    naturaleza character varying(50),
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
    contabilidad_venta character varying(20),
    contabilidad_exportacion character varying(20),
    contabilidad_compra character varying(20),
    contabilidad_importacion character varying(20),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    tipo_item character varying(20) DEFAULT 'PRODUCT'::character varying NOT NULL,
    inventariable boolean DEFAULT true NOT NULL,
    duration_value numeric(10,2),
    mandatory_periods boolean DEFAULT false NOT NULL,
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
    maneja_lotes boolean DEFAULT false NOT NULL,
    maneja_series boolean DEFAULT false NOT NULL,
    stock_minimo_alerta numeric(12,2),
    stock_deseado numeric(12,2),
    id_almacen_defecto uuid,
    id_categoria_item uuid,
    id_estado_venta uuid NOT NULL,
    id_estado_compra uuid NOT NULL,
    id_tipo_control_caducidad uuid NOT NULL,
    id_tipo_item uuid NOT NULL,
    id_duration_unit uuid,
    CONSTRAINT chk_item_precio_compra CHECK (((precio_compra IS NULL) OR (precio_compra >= (0)::numeric))),
    CONSTRAINT chk_item_stock_deseado CHECK (((stock_deseado IS NULL) OR (stock_deseado >= (0)::numeric))),
    CONSTRAINT chk_item_stock_minimo_alerta CHECK (((stock_minimo_alerta IS NULL) OR (stock_minimo_alerta >= (0)::numeric))),
    CONSTRAINT chk_item_tipo_item CHECK (((tipo_item)::text = ANY ((ARRAY['PRODUCT'::character varying, 'SERVICE'::character varying])::text[])))
);


ALTER TABLE public.item OWNER TO postgres;

--
-- TOC entry 378 (class 1259 OID 220967)
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
-- TOC entry 333 (class 1259 OID 98913)
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
-- TOC entry 370 (class 1259 OID 213080)
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
    estado_archivo character varying(20) DEFAULT 'activo'::character varying
);


ALTER TABLE public.media OWNER TO postgres;

--
-- TOC entry 287 (class 1259 OID 17379)
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
-- TOC entry 286 (class 1259 OID 17370)
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
-- TOC entry 310 (class 1259 OID 32167)
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
-- TOC entry 309 (class 1259 OID 32166)
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
-- TOC entry 5815 (class 0 OID 0)
-- Dependencies: 309
-- Name: miembros_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.miembros_id_seq OWNED BY public.miembros.id;


--
-- TOC entry 317 (class 1259 OID 93166)
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
-- TOC entry 290 (class 1259 OID 18517)
-- Name: moneda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.moneda (
    id_moneda uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo character varying(3) NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.moneda OWNER TO postgres;

--
-- TOC entry 349 (class 1259 OID 99350)
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
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.movimiento_bancario OWNER TO postgres;

--
-- TOC entry 357 (class 1259 OID 99551)
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
-- TOC entry 332 (class 1259 OID 98892)
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
-- TOC entry 350 (class 1259 OID 99380)
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
-- TOC entry 353 (class 1259 OID 99453)
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
-- TOC entry 354 (class 1259 OID 99488)
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
-- TOC entry 346 (class 1259 OID 99260)
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
-- TOC entry 347 (class 1259 OID 99299)
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
-- TOC entry 291 (class 1259 OID 18525)
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
-- TOC entry 284 (class 1259 OID 17331)
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
-- TOC entry 311 (class 1259 OID 46549)
-- Name: perfil_menu_permiso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfil_menu_permiso (
    id_perfil uuid NOT NULL,
    id_item uuid NOT NULL,
    permitido boolean DEFAULT true NOT NULL
);


ALTER TABLE public.perfil_menu_permiso OWNER TO postgres;

--
-- TOC entry 320 (class 1259 OID 93225)
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
-- TOC entry 318 (class 1259 OID 93179)
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
-- TOC entry 341 (class 1259 OID 99129)
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
-- TOC entry 344 (class 1259 OID 99220)
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
-- TOC entry 342 (class 1259 OID 99174)
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
-- TOC entry 351 (class 1259 OID 99404)
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
-- TOC entry 352 (class 1259 OID 99432)
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
-- TOC entry 292 (class 1259 OID 18549)
-- Name: provincia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provincia (
    id_provincia uuid DEFAULT gen_random_uuid() NOT NULL,
    id_pais uuid NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.provincia OWNER TO postgres;

--
-- TOC entry 385 (class 1259 OID 221138)
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
-- TOC entry 386 (class 1259 OID 221156)
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
-- TOC entry 355 (class 1259 OID 99509)
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
-- TOC entry 334 (class 1259 OID 98942)
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
-- TOC entry 372 (class 1259 OID 216424)
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
-- TOC entry 5843 (class 0 OID 0)
-- Dependencies: 372
-- Name: TABLE secuencia_asiento; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.secuencia_asiento IS 'Secuencia para numeración de asientos por empresa, diario (prefijo) y periodo (año/mes)';


--
-- TOC entry 371 (class 1259 OID 216423)
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
-- TOC entry 5845 (class 0 OID 0)
-- Dependencies: 371
-- Name: secuencia_asiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.secuencia_asiento_id_seq OWNED BY public.secuencia_asiento.id;


--
-- TOC entry 296 (class 1259 OID 18612)
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
-- TOC entry 377 (class 1259 OID 220942)
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
-- TOC entry 283 (class 1259 OID 17280)
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
-- TOC entry 304 (class 1259 OID 22128)
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
    logo bytea,
    id_tipo_tercero uuid,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado boolean DEFAULT true NOT NULL,
    id_tipo_entidad smallint,
    id_provincia uuid,
    codigo_proveedor character varying(20)
);


ALTER TABLE public.tercero OWNER TO postgres;

--
-- TOC entry 358 (class 1259 OID 99569)
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
-- TOC entry 390 (class 1259 OID 222443)
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
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tipo_control_caducidad_item OWNER TO postgres;

--
-- TOC entry 294 (class 1259 OID 18568)
-- Name: tipo_entidad_comercial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_entidad_comercial (
    id_tipo_entidad smallint NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text
);


ALTER TABLE public.tipo_entidad_comercial OWNER TO postgres;

--
-- TOC entry 293 (class 1259 OID 18567)
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
-- TOC entry 5854 (class 0 OID 0)
-- Dependencies: 293
-- Name: tipo_entidad_comercial_id_tipo_entidad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipo_entidad_comercial_id_tipo_entidad_seq OWNED BY public.tipo_entidad_comercial.id_tipo_entidad;


--
-- TOC entry 391 (class 1259 OID 222463)
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
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tipo_item_catalogo OWNER TO postgres;

--
-- TOC entry 300 (class 1259 OID 22057)
-- Name: tipo_tercero_catalogo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_tercero_catalogo (
    id_tipo_tercero uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.tipo_tercero_catalogo OWNER TO postgres;

--
-- TOC entry 374 (class 1259 OID 219803)
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
-- TOC entry 308 (class 1259 OID 32151)
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
-- TOC entry 307 (class 1259 OID 32150)
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
-- TOC entry 5860 (class 0 OID 0)
-- Dependencies: 307
-- Name: tipos_miembro_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipos_miembro_id_seq OWNED BY public.tipos_miembro.id;


--
-- TOC entry 360 (class 1259 OID 106298)
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
-- TOC entry 381 (class 1259 OID 221048)
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
-- TOC entry 382 (class 1259 OID 221072)
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
-- TOC entry 375 (class 1259 OID 219813)
-- Name: unidad_medida; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unidad_medida (
    id_unidad uuid NOT NULL,
    id_tipo_unidad uuid NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(100) NOT NULL,
    simbolo character varying(20) NOT NULL,
    descripcion text,
    activo boolean DEFAULT true
);


ALTER TABLE public.unidad_medida OWNER TO postgres;

--
-- TOC entry 285 (class 1259 OID 17347)
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
    CONSTRAINT usuario_scope_acceso_check CHECK (((scope_acceso)::text = ANY ((ARRAY['EMPRESA'::character varying, 'GLOBAL'::character varying])::text[])))
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 363 (class 1259 OID 106399)
-- Name: vw_saldos_cuentas; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_saldos_cuentas AS
 SELECT c.id_empresa,
    c.id_cuenta_financiera,
    c.referencia,
    c.etiqueta_cuenta,
    c.id_moneda,
    (COALESCE(sum(m.importe), (0)::numeric))::numeric(18,2) AS saldo_actual
   FROM (public.cuenta_financiera c
     LEFT JOIN public.movimiento_cuenta m ON ((m.id_cuenta_financiera = c.id_cuenta_financiera)))
  GROUP BY c.id_empresa, c.id_cuenta_financiera, c.referencia, c.etiqueta_cuenta, c.id_moneda;


ALTER VIEW public.vw_saldos_cuentas OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 17251)
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
-- TOC entry 273 (class 1259 OID 17000)
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- TOC entry 276 (class 1259 OID 17027)
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- TOC entry 275 (class 1259 OID 17026)
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
-- TOC entry 256 (class 1259 OID 16544)
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
-- TOC entry 5872 (class 0 OID 0)
-- Dependencies: 256
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 313 (class 1259 OID 53242)
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
-- TOC entry 364 (class 1259 OID 119631)
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
-- TOC entry 258 (class 1259 OID 16586)
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
-- TOC entry 257 (class 1259 OID 16559)
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
    user_metadata jsonb,
    level integer
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- TOC entry 5876 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 312 (class 1259 OID 53197)
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE storage.prefixes OWNER TO supabase_storage_admin;

--
-- TOC entry 277 (class 1259 OID 17071)
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
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- TOC entry 278 (class 1259 OID 17085)
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
-- TOC entry 365 (class 1259 OID 119641)
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
-- TOC entry 3990 (class 2604 OID 16508)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 4053 (class 2604 OID 18513)
-- Name: entidad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entidad ALTER COLUMN id SET DEFAULT nextval('public.entidad_id_seq'::regclass);


--
-- TOC entry 4082 (class 2604 OID 24392)
-- Name: impuestos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.impuestos ALTER COLUMN id SET DEFAULT nextval('public.impuestos_id_seq'::regclass);


--
-- TOC entry 4093 (class 2604 OID 32170)
-- Name: miembros id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.miembros ALTER COLUMN id SET DEFAULT nextval('public.miembros_id_seq'::regclass);


--
-- TOC entry 4345 (class 2604 OID 216427)
-- Name: secuencia_asiento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secuencia_asiento ALTER COLUMN id SET DEFAULT nextval('public.secuencia_asiento_id_seq'::regclass);


--
-- TOC entry 4058 (class 2604 OID 18571)
-- Name: tipo_entidad_comercial id_tipo_entidad; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_entidad_comercial ALTER COLUMN id_tipo_entidad SET DEFAULT nextval('public.tipo_entidad_comercial_id_tipo_entidad_seq'::regclass);


--
-- TOC entry 4085 (class 2604 OID 32154)
-- Name: tipos_miembro id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_miembro ALTER COLUMN id SET DEFAULT nextval('public.tipos_miembro_id_seq'::regclass);


--
-- TOC entry 5466 (class 0 OID 16523)
-- Dependencies: 254
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
-- TOC entry 5573 (class 0 OID 211933)
-- Dependencies: 369
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5480 (class 0 OID 16925)
-- Dependencies: 271
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- TOC entry 5471 (class 0 OID 16723)
-- Dependencies: 262
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
a4c5c2f3-b7b2-4204-83bb-80a703bd67e8	a4c5c2f3-b7b2-4204-83bb-80a703bd67e8	{"sub": "a4c5c2f3-b7b2-4204-83bb-80a703bd67e8", "email": "xgranda@outlook.com", "email_verified": true, "phone_verified": false}	email	2025-07-26 04:18:40.202709+00	2025-07-26 04:18:40.203912+00	2025-07-26 04:18:40.203912+00	67079629-d910-4e78-9010-d491b41de981
ce1f7469-483f-4225-a98b-3f3ecf1f15dd	ce1f7469-483f-4225-a98b-3f3ecf1f15dd	{"sub": "ce1f7469-483f-4225-a98b-3f3ecf1f15dd", "email": "senaidatixilema@hotmail.com", "email_verified": true, "phone_verified": false}	email	2025-07-26 15:58:35.59462+00	2025-07-26 15:58:35.594674+00	2025-07-26 15:58:35.594674+00	b7f8affb-f592-44c3-97ce-2a603fd1274a
56921ed1-8f42-452e-a173-827cb169a50a	56921ed1-8f42-452e-a173-827cb169a50a	{"sub": "56921ed1-8f42-452e-a173-827cb169a50a", "email": "ccalvasarangoc@outlook.com", "email_verified": true, "phone_verified": false}	email	2025-07-31 02:42:13.71237+00	2025-07-31 02:42:13.712425+00	2025-07-31 02:42:13.712425+00	6e99f017-1e8f-467f-a11f-1c1264a0b612
\.


--
-- TOC entry 5465 (class 0 OID 16516)
-- Dependencies: 253
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5475 (class 0 OID 16812)
-- Dependencies: 266
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
c866524b-f409-4aa3-87c0-cdcb60bf62ce	2025-07-26 04:25:22.376895+00	2025-07-26 04:25:22.376895+00	otp	f3558b81-71a3-40cc-9a2c-d09269819c13
b2db29ec-170c-483c-85cc-36ba510e5dc4	2025-07-26 16:03:04.866065+00	2025-07-26 16:03:04.866065+00	otp	02894d3f-5d38-413c-98af-5ed1e1c9f5ee
622a77d3-1349-4968-8b65-4b82d7ac4385	2025-07-31 02:43:44.249809+00	2025-07-31 02:43:44.249809+00	otp	9b4d653a-4b53-4b20-a020-a953985b4f2b
\.


--
-- TOC entry 5474 (class 0 OID 16800)
-- Dependencies: 265
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- TOC entry 5473 (class 0 OID 16787)
-- Dependencies: 264
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- TOC entry 5531 (class 0 OID 94213)
-- Dependencies: 326
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- TOC entry 5570 (class 0 OID 144205)
-- Dependencies: 366
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- TOC entry 5519 (class 0 OID 78675)
-- Dependencies: 314
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- TOC entry 5532 (class 0 OID 94246)
-- Dependencies: 327
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- TOC entry 5481 (class 0 OID 16975)
-- Dependencies: 272
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5464 (class 0 OID 16505)
-- Dependencies: 252
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	1	jep7xduphjdl	a4c5c2f3-b7b2-4204-83bb-80a703bd67e8	f	2025-07-26 04:25:22.35898+00	2025-07-26 04:25:22.35898+00	\N	c866524b-f409-4aa3-87c0-cdcb60bf62ce
00000000-0000-0000-0000-000000000000	2	7w2tklus4lss	ce1f7469-483f-4225-a98b-3f3ecf1f15dd	f	2025-07-26 16:03:04.859828+00	2025-07-26 16:03:04.859828+00	\N	b2db29ec-170c-483c-85cc-36ba510e5dc4
00000000-0000-0000-0000-000000000000	3	gk2nwfzetzhp	56921ed1-8f42-452e-a173-827cb169a50a	f	2025-07-31 02:43:44.229544+00	2025-07-31 02:43:44.229544+00	\N	622a77d3-1349-4968-8b65-4b82d7ac4385
\.


--
-- TOC entry 5478 (class 0 OID 16854)
-- Dependencies: 269
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- TOC entry 5479 (class 0 OID 16872)
-- Dependencies: 270
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- TOC entry 5467 (class 0 OID 16531)
-- Dependencies: 255
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
\.


--
-- TOC entry 5472 (class 0 OID 16753)
-- Dependencies: 263
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
c866524b-f409-4aa3-87c0-cdcb60bf62ce	a4c5c2f3-b7b2-4204-83bb-80a703bd67e8	2025-07-26 04:25:22.353987+00	2025-07-26 04:25:22.353987+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0	157.100.198.87	\N	\N	\N	\N	\N
b2db29ec-170c-483c-85cc-36ba510e5dc4	ce1f7469-483f-4225-a98b-3f3ecf1f15dd	2025-07-26 16:03:04.857623+00	2025-07-26 16:03:04.857623+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36	186.66.71.86	\N	\N	\N	\N	\N
622a77d3-1349-4968-8b65-4b82d7ac4385	56921ed1-8f42-452e-a173-827cb169a50a	2025-07-31 02:43:44.224619+00	2025-07-31 02:43:44.224619+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36	45.161.33.167	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5477 (class 0 OID 16839)
-- Dependencies: 268
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5476 (class 0 OID 16830)
-- Dependencies: 267
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- TOC entry 5462 (class 0 OID 16493)
-- Dependencies: 250
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	56921ed1-8f42-452e-a173-827cb169a50a	authenticated	authenticated	ccalvasarangoc@outlook.com	$2a$10$EZ08ERoTdpWciTduORDyAudcLCU9x6sdcwUVOedrFnjDXxbKz3OBu	2025-07-31 02:43:44.220278+00	2025-07-31 02:42:13.733227+00		\N		\N			\N	2025-07-31 02:43:44.224513+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-07-31 02:42:13.696238+00	2025-07-31 02:43:44.249349+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	a4c5c2f3-b7b2-4204-83bb-80a703bd67e8	authenticated	authenticated	xgranda@outlook.com	$2a$10$qBc1dCV9CJoF.cDXnpK14OmDNEV0h/HcmRWsYDvggcPXgbB8tcfj.	2025-07-26 04:25:22.347817+00	2025-07-26 04:18:40.231784+00		\N		\N			\N	2025-07-26 04:25:22.353853+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-07-26 04:18:40.174081+00	2025-07-26 04:25:22.376397+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	ce1f7469-483f-4225-a98b-3f3ecf1f15dd	authenticated	authenticated	senaidatixilema@hotmail.com	$2a$10$v/LdCMhxJDLT45TEdVzwO..NnvJyg/mX2supB8ivCh1q6UMXX2aIi	2025-07-26 16:03:04.853215+00	2025-07-26 15:58:35.61746+00		\N		\N			\N	2025-07-26 16:03:04.857547+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-07-26 15:58:35.580187+00	2025-07-26 16:03:04.865594+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- TOC entry 5580 (class 0 OID 220931)
-- Dependencies: 376
-- Data for Name: almacen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.almacen (id_almacen, id_empresa, almacen_ref, nombre, descripcion, direccion, codigo_postal, poblacion, id_pais, telefono, fax, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
dd04ca48-b2e6-4ac3-a5e3-04bcc7d6038d	0459fe04-163b-4b89-b98a-0f1179b7224c	ALM-001	Almacén principal	Almacén principal de la empresa	Matriz	0000	Ciudad principal	\N	\N	\N	\N	\N	2026-03-08 18:58:28.471694	2026-03-08 18:58:28.471694	t
0c924077-1e60-42a5-a714-3576e3e85871	0459fe04-163b-4b89-b98a-0f1179b7224c	ALM-002	Almacén secundario	Almacén auxiliar de productos	Sucursal	0000	Ciudad secundaria	\N	\N	\N	\N	\N	2026-03-08 18:58:28.471694	2026-03-08 18:58:28.471694	t
1f68e097-0453-4880-b589-b7e3718bebfd	0459fe04-163b-4b89-b98a-0f1179b7224c	ALM-003	Almacén tránsito	Almacén para movimientos temporales	Centro logístico	0000	Centro de distribución	\N	\N	\N	\N	\N	2026-03-08 18:58:28.471694	2026-03-08 18:58:28.471694	t
\.


--
-- TOC entry 5536 (class 0 OID 98859)
-- Dependencies: 331
-- Data for Name: asiento_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asiento_contable (id_asiento_contable, id_empresa, id_diario_contable, numero_asiento, fecha_asiento, concepto, referencia, total_debe, total_haber, estado, id_usuario_creacion, id_usuario_aprobacion, created_at, fecha_aprobacion, updated_at, reversed_entry_id) FROM stdin;
\.


--
-- TOC entry 5591 (class 0 OID 222344)
-- Dependencies: 387
-- Data for Name: categoria_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria_item (id_categoria_item, id_empresa, codigo, nombre, descripcion, id_categoria_padre, estado, created_at, updated_at, created_by, updated_by) FROM stdin;
876ca004-81ac-4834-80a2-3f0ebb665a82	0459fe04-163b-4b89-b98a-0f1179b7224c	PROD-GEN	Productos generales	Categoría general de productos	\N	t	2026-03-08 18:36:11.215699	2026-03-08 18:36:11.215699	\N	\N
75d9da17-6584-4227-b9db-6f7acf4a5bea	0459fe04-163b-4b89-b98a-0f1179b7224c	SERV-GEN	Servicios generales	Categoría general de servicios	\N	t	2026-03-08 18:36:11.215699	2026-03-08 18:36:11.215699	\N	\N
c15dd8ba-693a-402d-a3e5-91ae53e28fcb	0459fe04-163b-4b89-b98a-0f1179b7224c	CONS	Consumibles	Productos consumibles	\N	t	2026-03-08 18:36:11.215699	2026-03-08 18:36:11.215699	\N	\N
dddf3951-cc86-472c-b795-e037473d4a2c	0459fe04-163b-4b89-b98a-0f1179b7224c	MANT	Mantenimiento	Servicios de mantenimiento	\N	t	2026-03-08 18:36:11.215699	2026-03-08 18:36:11.215699	\N	\N
\.


--
-- TOC entry 5561 (class 0 OID 99533)
-- Dependencies: 356
-- Data for Name: centro_costo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.centro_costo (id_centro_costo, id_empresa, codigo, nombre, descripcion, estado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5564 (class 0 OID 99593)
-- Dependencies: 359
-- Data for Name: cierre_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cierre_contable (id_cierre_contable, id_empresa, id_periodo_contable, tipo_cierre, fecha_cierre, id_usuario_cierre, observaciones, estado) FROM stdin;
\.


--
-- TOC entry 5533 (class 0 OID 98790)
-- Dependencies: 328
-- Data for Name: cierre_cuenta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cierre_cuenta (id_cierre_cuenta, id_empresa, id_periodo_contable, id_cuenta_contable, saldo_debe, saldo_haber, saldo_final, fecha_cierre, id_usuario_cierre) FROM stdin;
\.


--
-- TOC entry 5577 (class 0 OID 219784)
-- Dependencies: 373
-- Data for Name: ciudad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ciudad (id_ciudad, id_provincia, nombre, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5553 (class 0 OID 99318)
-- Dependencies: 348
-- Data for Name: conciliacion_bancaria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conciliacion_bancaria (id_conciliacion_bancaria, id_empresa, id_cuenta_bancaria, id_periodo_contable, saldo_libro, saldo_banco, diferencia, estado, fecha_conciliacion, id_usuario_conciliacion, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5506 (class 0 OID 22065)
-- Dependencies: 301
-- Data for Name: condicion_pago_catalogo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.condicion_pago_catalogo (id_condicion_pago, descripcion) FROM stdin;
31cf451e-a589-484e-b33d-3bd7d20ec98a	condicio1
464a061b-594d-4883-9d8e-55e735f0ad07	condicion2
bb5b50be-202f-4e23-a992-c5534c7df39b	condicion3
\.


--
-- TOC entry 5520 (class 0 OID 93112)
-- Dependencies: 315
-- Data for Name: configuracion_contabilidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configuracion_contabilidad (id_configuracion_contabilidad, id_empresa, id_moneda_base, formato_cuenta, separador_cuenta, longitud_nivel, usar_centavos, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5503 (class 0 OID 18651)
-- Dependencies: 298
-- Data for Name: contable_externo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contable_externo (id_contable, id_empresa, razon_social, direccion, codigo_postal, poblacion, id_pais, id_provincia, telefono, fax, correo, web, codigo_contable, nota, created_by, created_at, updated_by, updated_at) FROM stdin;
\.


--
-- TOC entry 5571 (class 0 OID 207464)
-- Dependencies: 367
-- Data for Name: contacto_direccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacto_direccion (id_contacto, id_tercero, apellidos_etiqueta, nombre, titulo_cortesia, puesto_trabajo, direccion, codigo_postal, poblacion, id_pais, telefono_trabajo, telefono_particular, movil, fax, correo, visibilidad, fecha_nacimiento, alerta_cumpleanos, estado, created_at, updated_at, id_provincia, creado_por, modificado_por) FROM stdin;
6c16a892-01a2-4405-a592-f33ec7cdbe0f	c2d9e7ba-38b3-48cf-b216-7764b19ac299	ttto	opi3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	t	2026-03-06 01:05:53.834659	2026-03-06 01:06:09.917354	\N	\N	\N
\.


--
-- TOC entry 5544 (class 0 OID 99073)
-- Dependencies: 339
-- Data for Name: cotizacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cotizacion (id_cotizacion, id_empresa, numero_cotizacion, id_tercero, fecha_cotizacion, fecha_vencimiento, subtotal, total_impuestos, total_descuentos, total_cotizacion, estado, observaciones, id_usuario_creacion, id_usuario_aprobacion, fecha_aprobacion, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5545 (class 0 OID 99108)
-- Dependencies: 340
-- Data for Name: cotizacion_linea; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cotizacion_linea (id_cotizacion_linea, id_cotizacion, id_item, descripcion, cantidad, precio_unitario, descuento_porcentaje, descuento_valor, subtotal, orden, created_at) FROM stdin;
\.


--
-- TOC entry 5548 (class 0 OID 99200)
-- Dependencies: 343
-- Data for Name: cotizacion_prefactura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cotizacion_prefactura (id_cotizacion_prefactura, id_cotizacion, id_prefactura, porcentaje_utilizado, created_at) FROM stdin;
\.


--
-- TOC entry 5527 (class 0 OID 93269)
-- Dependencies: 322
-- Data for Name: cuenta_bancaria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta_bancaria (id_cuenta_bancaria, id_empresa, id_banco, numero_cuenta, tipo_cuenta, id_moneda, id_cuenta_contable, saldo_inicial, saldo_actual, estado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5524 (class 0 OID 93200)
-- Dependencies: 319
-- Data for Name: cuenta_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta_contable (id_cuenta_contable, id_plan_contable, codigo, nombre, descripcion, tipo_cuenta, nivel, id_cuenta_padre, permite_movimientos, estado, created_at, updated_at) FROM stdin;
01a8fad1-823e-49e2-aff0-f46a95bb5a6c	98f6c564-40e9-49a3-9fa0-3c233da86415	1101	Caja General	Caja	ACTIVO	1	\N	t	t	2026-02-14 20:30:14.048437	2026-02-14 20:30:14.048437
2322f3fa-5f7e-4007-98b8-792b96f59546	98f6c564-40e9-49a3-9fa0-3c233da86415	1102	Banco Pichincha	Bancos	ACTIVO	1	\N	t	t	2026-02-14 20:30:14.048437	2026-02-14 20:30:14.048437
8d784118-d7b8-4da4-a003-f3477e6d8462	98f6c564-40e9-49a3-9fa0-3c233da86415	4101	Ventas Nacionales	Ventas	INGRESO	1	\N	t	t	2026-02-14 20:30:14.048437	2026-02-14 20:30:14.048437
9011723f-1483-48a6-a31b-e3559fe2aa52	98f6c564-40e9-49a3-9fa0-3c233da86415	5101	Compras Nacionales	Compras	GASTO	1	\N	t	t	2026-02-14 20:30:14.048437	2026-02-14 20:30:14.048437
\.


--
-- TOC entry 5526 (class 0 OID 93246)
-- Dependencies: 321
-- Data for Name: cuenta_contable_defecto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta_contable_defecto (id_cuenta_contable_defecto, id_empresa, tipo_operacion, id_cuenta_contable, descripcion, estado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5530 (class 0 OID 93344)
-- Dependencies: 325
-- Data for Name: cuenta_contable_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta_contable_item (id_cuenta_contable_item, id_empresa, tipo_movimiento, id_cuenta_contable, estado, created_at, updated_at, id_item) FROM stdin;
\.


--
-- TOC entry 5566 (class 0 OID 106329)
-- Dependencies: 361
-- Data for Name: cuenta_financiera; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta_financiera (id_cuenta_financiera, id_empresa, referencia, etiqueta_cuenta, tipo_cuenta, estado_cuenta, id_moneda, id_pais_cuenta, id_provincia_cuenta, nombre_banco, numero_cuenta_iban, codigo_bic_swift, numero_cuenta, domiciliacion, web, comentario, saldo_inicial, fecha_inicial, saldo_minimo_autorizado, saldo_minimo_deseado, id_titular_cuenta, codigo_contable, creado_en, actualizado_en, estado, id_tercero) FROM stdin;
c9a728c9-3bed-45b8-9b3b-d6b704c1b5ba	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	1	1312	corriente	cerrada	0a88e7fe-0510-4453-b009-f2d107453ce8	6e5e954a-b204-4867-b5c9-7394131de6a5	\N	1	123454323454323	34223423	1	1	1	1	0.00	2026-02-21	\N	\N	\N	1	2026-02-21 17:49:41.897362+00	2026-02-22 19:58:21.81552+00	t	\N
33a40927-89e3-4b11-82fd-0f8085a6864e	45fa1728-15ad-485e-ade6-3c2f058e882f	12312	1231231	ahorros	cerrada	e1adef10-67d8-4194-a782-e85549c4d035	6e5e954a-b204-4867-b5c9-7394131de6a5	\N	\N	12323232323232322	12345676553	1231231231	12312312	12312	12312	0.00	2026-02-21	\N	\N	\N	12312	2026-02-21 23:07:47.767724+00	2026-02-28 01:56:03.356182+00	f	\N
\.


--
-- TOC entry 5535 (class 0 OID 98840)
-- Dependencies: 330
-- Data for Name: cuenta_grupo_personalizado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta_grupo_personalizado (id_cuenta_grupo_personalizado, id_grupo_cuenta_personalizado, id_cuenta_contable, created_at) FROM stdin;
\.


--
-- TOC entry 5529 (class 0 OID 93323)
-- Dependencies: 324
-- Data for Name: cuenta_impuesto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta_impuesto (id_cuenta_impuesto, id_empresa, tipo_impuesto, porcentaje, id_cuenta_contable, estado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5528 (class 0 OID 93302)
-- Dependencies: 323
-- Data for Name: cuenta_iva; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta_iva (id_cuenta_iva, id_empresa, tipo_iva, porcentaje, id_cuenta_contable, estado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5521 (class 0 OID 93148)
-- Dependencies: 316
-- Data for Name: diario_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diario_contable (id_diario_contable, id_empresa, codigo, nombre, descripcion, tipo_diario, estado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5540 (class 0 OID 98970)
-- Dependencies: 335
-- Data for Name: documento_origen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documento_origen (id_documento_origen, id_empresa, tipo_documento, numero_documento, fecha_documento, id_tercero, valor_total, estado_contabilizacion, id_asiento_contable, fecha_contabilizacion, id_usuario_contabilizacion, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5596 (class 0 OID 222483)
-- Dependencies: 392
-- Data for Name: duracion_unidad_catalogo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.duracion_unidad_catalogo (id_duration_unit, codigo, nombre, descripcion, orden, estado, created_at, updated_at) FROM stdin;
41d77594-f820-4b58-a054-673981553c38	MINUTE	Minuto	Unidad de duración en minutos	1	t	2026-03-08 23:54:49.532841	2026-03-08 23:54:49.532841
dd8ad7dd-6ff1-475b-a77b-e5031653d22d	HOUR	Hora	Unidad de duración en horas	2	t	2026-03-08 23:54:49.532841	2026-03-08 23:54:49.532841
894d54bb-6b68-4299-a1b0-6ac0463ce4f3	DAY	Día	Unidad de duración en días	3	t	2026-03-08 23:54:49.532841	2026-03-08 23:54:49.532841
0d6dd320-b38f-428d-ba83-b6de888bd9b3	WEEK	Semana	Unidad de duración en semanas	4	t	2026-03-08 23:54:49.532841	2026-03-08 23:54:49.532841
c4dfbe5a-484e-4653-882c-185466d9bba6	MONTH	Mes	Unidad de duración en meses	5	t	2026-03-08 23:54:49.532841	2026-03-08 23:54:49.532841
1e43cb4c-b84c-4a38-b870-3a4d209448b3	YEAR	Año	Unidad de duración en años	6	t	2026-03-08 23:54:49.532841	2026-03-08 23:54:49.532841
\.


--
-- TOC entry 5487 (class 0 OID 17267)
-- Dependencies: 282
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
-- TOC entry 5504 (class 0 OID 18686)
-- Dependencies: 299
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
-- TOC entry 5500 (class 0 OID 18578)
-- Dependencies: 295
-- Data for Name: empresa_identificacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresa_identificacion (id_identificacion, id_empresa, administradores, delegado_datos, capital, id_tipo_entidad, objeto_empresa, cif_intra, id_profesional1, id_profesional2, id_profesional3, id_profesional4, id_profesional5, id_profesional6, id_profesional7, id_profesional8, id_profesional9, id_profesional10, created_by, created_at, updated_by, updated_at) FROM stdin;
8ae16cd4-67ad-4649-98f2-56a70b8fb70f	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	Admin Test	Delegado Test	10000.00	1	Objeto de prueba	CIF123	PROF1	PROF2	PROF3	PROF4	PROF5	PROF6	PROF7	PROF8	PROF9	PROF10	\N	2025-07-27 19:54:55.217658	\N	\N
caf4cc54-6d52-462e-97f0-4b15dacf0a88	0459fe04-163b-4b89-b98a-0f1179b7224c	john	delegado	1.00	1	objeto	CIF	1	2	3	4	5	6	7	8	9	10	\N	2025-07-27 21:23:10.740415	\N	\N
425f81f6-b5aa-4001-b122-ab1ca1149a71	31a8bf69-558d-4b00-8fc6-5e2384be09a3	Juan Pérez	María García	100000.00	1	Desarrollo de software	ES12345678	PROF001	PROF002	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-29 02:18:32.992226	\N	\N
f0b57a08-7267-454d-8692-d1a3ccd3ae51	45fa1728-15ad-485e-ade6-3c2f058e882f			\N	\N													\N	2025-07-29 03:15:37.924174	\N	\N
\.


--
-- TOC entry 5502 (class 0 OID 18621)
-- Dependencies: 297
-- Data for Name: empresa_red_social; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresa_red_social (id, id_empresa, id_red_social, identificador, url, es_principal, created_by, created_at, updated_by, updated_at) FROM stdin;
84e5a061-2333-42f3-9d83-a5126c5a3efa	0459fe04-163b-4b89-b98a-0f1179b7224c	9093b9fd-3126-40a9-9442-dcde643de88d	123456		f	\N	2025-07-29 03:10:39.012193	\N	\N
\.


--
-- TOC entry 5494 (class 0 OID 18510)
-- Dependencies: 289
-- Data for Name: entidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.entidad (id, nombre) FROM stdin;
\.


--
-- TOC entry 5587 (class 0 OID 221096)
-- Dependencies: 383
-- Data for Name: envio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.envio (id_envio, id_empresa, envio_ref, id_tercero, ref_cliente, poblacion, fecha_prevista_entrega, fecha_envio, metodo_envio, numero_seguimiento, estado_envio, facturado, modulo_origen, id_origen, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5588 (class 0 OID 221114)
-- Dependencies: 384
-- Data for Name: envio_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.envio_detalle (id_envio_detalle, id_envio, id_item, id_lote_serie, cantidad, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5593 (class 0 OID 222418)
-- Dependencies: 389
-- Data for Name: estado_compra_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado_compra_item (id_estado_compra, codigo, nombre, descripcion, orden, estado, created_at, updated_at) FROM stdin;
be0053b9-3a29-4991-b5d3-87c96f03fa02	EN_COMPRA	En compra	El item está disponible para compra	1	t	2026-03-08 21:50:08.70354	2026-03-08 21:50:08.70354
1de10d9e-d9cd-4318-b365-eb7811443082	FUERA_COMPRA	Fuera de compra	El item no está disponible para compra	2	t	2026-03-08 21:50:08.70354	2026-03-08 21:50:08.70354
e7dbe683-f4fa-4ec1-ae1c-1ff19d7f4715	DESCONTINUADO	Descontinuado	El item fue retirado de compras	3	t	2026-03-08 21:50:08.70354	2026-03-08 21:50:08.70354
299dd22f-2f09-47f0-8af5-7cc8fab4d9d9	BAJO_SOLICITUD	Bajo solicitud	El item se compra solo bajo solicitud	4	t	2026-03-08 21:50:08.70354	2026-03-08 21:50:08.70354
\.


--
-- TOC entry 5592 (class 0 OID 222403)
-- Dependencies: 388
-- Data for Name: estado_venta_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado_venta_item (id_estado_venta, codigo, nombre, descripcion, orden, estado, created_at, updated_at) FROM stdin;
1557bf60-0db7-4a94-b7cf-396d62ee8070	EN_VENTA	En venta	El item está disponible para la venta	1	t	2026-03-08 21:48:41.447392	2026-03-08 21:48:41.447392
3fe15de1-2402-4b80-b42f-0f719bb391d9	FUERA_VENTA	Fuera de venta	El item no está disponible para la venta	2	t	2026-03-08 21:48:41.447392	2026-03-08 21:48:41.447392
06845e82-3e6d-4989-bd00-83c40910a65a	DESCONTINUADO	Descontinuado	El item fue retirado de la venta	3	t	2026-03-08 21:48:41.447392	2026-03-08 21:48:41.447392
83bd92e4-f09c-4bfa-ab2e-eda74a361579	SOLO_BAJO_PEDIDO	Solo bajo pedido	El item se vende únicamente bajo pedido	4	t	2026-03-08 21:48:41.447392	2026-03-08 21:48:41.447392
\.


--
-- TOC entry 5542 (class 0 OID 99019)
-- Dependencies: 337
-- Data for Name: factura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.factura (id_factura, id_empresa, numero_factura, tipo_factura, id_tercero, fecha_factura, fecha_vencimiento, subtotal, total_impuestos, total_descuentos, total_factura, estado, id_asiento_contable, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5543 (class 0 OID 99047)
-- Dependencies: 338
-- Data for Name: factura_linea; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.factura_linea (id_factura_linea, id_factura, id_item, descripcion, cantidad, precio_unitario, descuento_porcentaje, descuento_valor, subtotal, id_cuenta_contable, orden, created_at) FROM stdin;
\.


--
-- TOC entry 5507 (class 0 OID 22112)
-- Dependencies: 302
-- Data for Name: forma_pago_catalogo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.forma_pago_catalogo (id_forma_pago, descripcion) FROM stdin;
9e1fb0b7-833b-4265-9b44-29e88c39f558	efectivo
4bbbfc13-804d-4a8b-9c53-57e0ef29adb5	tarjeta de credito
26d9fbd8-470d-4c58-8c87-acabb4193b93	tarjeta de debito
238af3a1-7fcc-458a-84e8-c8f376ac158d	cheque
\.


--
-- TOC entry 5534 (class 0 OID 98822)
-- Dependencies: 329
-- Data for Name: grupo_cuenta_personalizado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grupo_cuenta_personalizado (id_grupo_cuenta_personalizado, id_empresa, nombre, descripcion, estado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5550 (class 0 OID 99240)
-- Dependencies: 345
-- Data for Name: historial_conversion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_conversion (id_historial_conversion, id_empresa, tipo_origen, id_documento_origen, tipo_destino, id_documento_destino, fecha_conversion, id_usuario_conversion, observaciones, created_at) FROM stdin;
\.


--
-- TOC entry 5511 (class 0 OID 24389)
-- Dependencies: 306
-- Data for Name: impuestos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.impuestos (id, nombre, tasa, creado_en, actualizado_en) FROM stdin;
1	IVA 12%	12.00	2026-02-14 18:50:32.789836	2026-02-14 18:50:32.789836
2	IVA 0%	0.00	2026-02-14 18:50:32.789836	2026-02-14 18:50:32.789836
\.


--
-- TOC entry 5508 (class 0 OID 22120)
-- Dependencies: 303
-- Data for Name: incoterm_catalogo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.incoterm_catalogo (id_incoterm, codigo, descripcion) FROM stdin;
83f47a6d-7ec1-40d8-a683-07810c6f90ce	111	primer inconter
685a2593-0881-45c4-a9d3-a96ef5bcbff0	222	segundo inconter
f023ef6e-5fb6-4913-9efd-f1b5f689df32	333	tercer inconter
\.


--
-- TOC entry 5541 (class 0 OID 99001)
-- Dependencies: 336
-- Data for Name: informe_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.informe_contable (id_informe_contable, id_empresa, nombre, tipo_informe, configuracion, estado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5583 (class 0 OID 221001)
-- Dependencies: 379
-- Data for Name: inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventario (id_inventario, id_empresa, inventario_ref, etiqueta, id_almacen, estado_inventario, fecha_inicio, fecha_cierre, observacion, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5584 (class 0 OID 221018)
-- Dependencies: 380
-- Data for Name: inventario_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventario_detalle (id_inventario_detalle, id_inventario, id_item, id_lote_serie, stock_sistema, stock_contado, diferencia, observacion, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5572 (class 0 OID 208587)
-- Dependencies: 368
-- Data for Name: item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item (id_item, id_empresa, producto_ref, etiqueta, estado, descripcion, url_publica, naturaleza, peso, longitud, anchura, altura, superficie, volumen, nomenclatura_aduanera, nota_interna, precio_venta, precio_minimo, impuesto_id, contabilidad_venta, contabilidad_exportacion, contabilidad_compra, contabilidad_importacion, created_at, updated_at, tipo_item, inventariable, duration_value, mandatory_periods, created_by, updated_by, id_pais, id_provincia, poblacion, id_unidad_medida, id_unidad_peso, id_unidad_longitud, id_unidad_superficie, id_unidad_volumen, codigo_barras, precio_compra, maneja_lotes, maneja_series, stock_minimo_alerta, stock_deseado, id_almacen_defecto, id_categoria_item, id_estado_venta, id_estado_compra, id_tipo_control_caducidad, id_tipo_item, id_duration_unit) FROM stdin;
2ff15f14-ba60-4d64-b046-0d6a0d0caf86	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	CAN002	Camisa para perro	t	de algodon	https://chatgpt.com	Producto	20.00	10.00	10.00	10.00	10.00	20.00	10120	solo para Xavier	20.00	15.00	1	4110	4120	5120	5120	2026-02-19 00:37:37.779297	2026-03-08 23:42:42.021829	PRODUCT	t	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	3fe15de1-2402-4b80-b42f-0f719bb391d9	1de10d9e-d9cd-4318-b365-eb7811443082	f7893727-2d13-4767-b5e1-e36ede53e630	991d248f-b44a-48d4-9a2f-f33529d9cf05	\N
775f0817-d5a9-4b92-ba2a-a9ed83cbc570	0459fe04-163b-4b89-b98a-0f1179b7224c	cam002	camisa	t	algodon	\N	\N	20.00	10.00	10.00	10.00	10.00	20.00	1010	mmm	20.00	20.00	1	5120	4120	4120	4120	2026-02-20 22:58:28.104863	2026-03-08 23:42:42.021829	PRODUCT	t	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	dd04ca48-b2e6-4ac3-a5e3-04bcc7d6038d	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	be0053b9-3a29-4991-b5d3-87c96f03fa02	f7893727-2d13-4767-b5e1-e36ede53e630	991d248f-b44a-48d4-9a2f-f33529d9cf05	\N
469676cd-5944-4d18-9755-fceedb7a4d49	0459fe04-163b-4b89-b98a-0f1179b7224c	ZAP002	TACO	t	ZAPATOS DE CUERO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-03-02 20:54:44.960686	2026-03-08 23:56:23.288278	SERVICE	f	3.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	be0053b9-3a29-4991-b5d3-87c96f03fa02	f7893727-2d13-4767-b5e1-e36ede53e630	75230088-4af9-4e79-97a6-130e905097ec	dd8ad7dd-6ff1-475b-a77b-e5031653d22d
0840647e-b16f-42df-916d-7d442dd13dd9	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	SERV001	Servicio Prueba	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-02-28 02:27:38.745261	2026-03-08 23:56:23.288278	SERVICE	f	2.00	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	be0053b9-3a29-4991-b5d3-87c96f03fa02	f7893727-2d13-4767-b5e1-e36ede53e630	75230088-4af9-4e79-97a6-130e905097ec	dd8ad7dd-6ff1-475b-a77b-e5031653d22d
f9bf9017-7065-4f2f-9653-b7fa5f261cf7	0459fe04-163b-4b89-b98a-0f1179b7224c	SRV002	YOYERIA	t	ORO	KKKKKK	\N	\N	\N	\N	\N	\N	\N	\N	PERLAS	30000.00	10000.00	\N	6523	\N	6521	\N	2026-03-01 23:19:05.08115	2026-03-08 23:56:23.288278	SERVICE	f	5.00	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	be0053b9-3a29-4991-b5d3-87c96f03fa02	f7893727-2d13-4767-b5e1-e36ede53e630	75230088-4af9-4e79-97a6-130e905097ec	894d54bb-6b68-4299-a1b0-6ac0463ce4f3
621a3156-e075-4e08-975e-594c1fcf4ed7	0459fe04-163b-4b89-b98a-0f1179b7224c	ZERV003	ZAPATERIA	t	ZAPATOS CUERO	https://www.youtube.com	\N	\N	\N	\N	\N	\N	\N	\N	CAFE TOSTADO	80.00	50.00	1	8060	\N	6080	\N	2026-02-28 03:44:22.528385	2026-03-08 23:56:23.288278	SERVICE	f	1.00	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	1557bf60-0db7-4a94-b7cf-396d62ee8070	be0053b9-3a29-4991-b5d3-87c96f03fa02	f7893727-2d13-4767-b5e1-e36ede53e630	75230088-4af9-4e79-97a6-130e905097ec	894d54bb-6b68-4299-a1b0-6ac0463ce4f3
\.


--
-- TOC entry 5582 (class 0 OID 220967)
-- Dependencies: 378
-- Data for Name: item_lote_serie; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_lote_serie (id_lote_serie, id_empresa, id_item, id_almacen, codigo_lote_serie, fecha_limite_venta, fecha_caducidad, cantidad_actual, observacion, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5538 (class 0 OID 98913)
-- Dependencies: 333
-- Data for Name: libro_mayor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.libro_mayor (id_libro_mayor, id_empresa, id_cuenta_contable, id_periodo_contable, saldo_inicial, total_debe, total_haber, saldo_final, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5574 (class 0 OID 213080)
-- Dependencies: 370
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media (id_media, module, module_id, url, filename, mimetype, size, created_at, updated_at, tipo, es_principal, estado_archivo) FROM stdin;
4e7f8137-b14f-4290-a1f9-02661601dcd9	tercero	b65905c1-2388-4f29-a722-ba41025d7330	http://localhost:3010/uploads/terceros/1772135884265-0j6vioz2qsce.jpg	\N	\N	\N	2026-02-26 19:55:08.48038+00	2026-02-26 19:58:19.143735+00	general	t	activo
6fbb6444-5df4-4555-b11f-f2bec056cf65	tercero	1111b3c4-1528-4e36-988d-a646e35aea81	http://localhost:3010/uploads/terceros/1772155317911-5ukx84n1yle.jpg	\N	\N	\N	2026-02-27 01:17:27.839102+00	2026-02-27 01:22:10.715269+00	general	t	activo
2220414b-c8ed-43db-8973-0d243016f239	tercero	ebdc3f78-3d77-4c20-a52b-8ada94d7eca1	http://localhost:3010/uploads/terceros/1772223385274-9ikuz468gl6.jpg	\N	\N	\N	2026-02-27 20:08:36.679072+00	2026-02-27 20:16:33.888901+00	general	t	activo
fd280ee5-a0b2-4354-be01-57b82737aefe	tercero	7629c279-f629-4912-9ba3-32a3a2e589c0	http://localhost:3010/uploads/terceros/1772382210663-kwclj5fiqd.jpg	\N	\N	\N	2026-03-01 16:23:40.542807+00	2026-03-01 16:26:45.241547+00	general	t	activo
2625f5de-5748-40fa-97b1-6f4c59478ab7	tercero	05d55e9b-b4dd-4dbf-8a8d-535f6c06c6f8	http://localhost:3010/uploads/terceros/1772383907574-un0gj5y7gv.jpg	\N	\N	\N	2026-03-01 16:52:21.704077+00	\N	general	t	activo
f3fdfd28-410f-421c-9ec3-55950088c00b	tercero	cc81ff0e-d01b-4b8d-9961-9af05e40bd01	http://localhost:3010/uploads/terceros/1772385009196-xbjy3clnf5c.jpg	\N	\N	\N	2026-03-01 17:10:21.531999+00	\N	general	t	activo
df6c7db7-38cf-44c6-85a5-edeb5a2669ea	tercero	5115453d-2a0f-41ff-a9cf-ea94449153e8	http://localhost:3010/uploads/terceros/1772389223517-oo9k4g57jqk.jpg	\N	\N	\N	2026-03-01 18:20:31.216934+00	\N	general	t	activo
e04aaaa9-cda0-4bf9-bfa0-fd372db316c1	tercero	13a8a2ab-90ec-4341-8db1-7a3828bed52d	http://localhost:3010/uploads/terceros/1772472297609-4hjghsh3wwp.jpg	\N	\N	\N	2026-03-02 17:25:24.851622+00	\N	general	t	activo
274320ae-ba94-4745-a084-b2e5faa173c2	tercero	72ca6fd5-0bfe-41d0-a295-d57e1a7b2829	http://localhost:3010/uploads/terceros/1772682522615-1fkvduscwkq.jpg	\N	\N	\N	2026-03-05 03:49:30.111019+00	\N	general	t	activo
d9306b07-0931-46be-9ddf-6d4a67dcad96	tercero	2b4fafe9-0fc7-44b4-8b9f-e49d3da18d06	http://localhost:3010/uploads/terceros/1772684288800-0o1auwyrcw.jpg	\N	\N	\N	2026-03-05 04:18:38.262119+00	\N	general	t	activo
a0d095ed-9242-476c-9c43-c556df2c43bf	tercero	a4ebddde-39c7-432d-9ad2-f173b9760561	http://localhost:3010/uploads/terceros/1772737079253-7xytzpnse9o.jpg	\N	\N	\N	2026-03-05 18:59:34.64133+00	\N	general	t	activo
\.


--
-- TOC entry 5492 (class 0 OID 17379)
-- Dependencies: 287
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
30b280df-a9d3-4384-b2de-98be0c8ffcc0	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	2cb5ced4-0d07-461f-bfbb-261219e7aa2d	Listado de usuarios	bi bi-list	/usuario/lista	t	2	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
33517997-969a-4db7-969c-8815f30beb29	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	2cb5ced4-0d07-461f-bfbb-261219e7aa2d	Vista jerárquica	bi bi-people	/usuario/jerarquia	t	3	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
3482cc6f-b16c-416d-96b6-ac4beb47454a	fce9f87f-5787-4520-975e-69ec3ab410f6	\N	Tercero	bi bi-person-vcard	\N	f	10	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
19aa9bec-5940-4f3a-97dc-eca4d1cd3fcb	fce9f87f-5787-4520-975e-69ec3ab410f6	3482cc6f-b16c-416d-96b6-ac4beb47454a	Nuevo tercero	bi bi-person-plus	/tercero/nuevo	t	1	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
ed1a3169-f31f-4474-a464-6819ee7efc55	fce9f87f-5787-4520-975e-69ec3ab410f6	3482cc6f-b16c-416d-96b6-ac4beb47454a	Listado	bi bi-list	/tercero/lista	t	2	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
0a955801-d641-46e0-93d9-e2a5b5d75a72	fce9f87f-5787-4520-975e-69ec3ab410f6	\N	Contactos/Direcciones	bi bi-journal	\N	f	20	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
1cde0306-79f4-479e-ad46-63ff83e1ac62	fce9f87f-5787-4520-975e-69ec3ab410f6	0a955801-d641-46e0-93d9-e2a5b5d75a72	Nuevo Contacto/Dirección	bi bi-person-plus	/contacto/nuevo	t	1	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
fe802f5b-6cfc-41d2-a097-cbfb0e835e79	fce9f87f-5787-4520-975e-69ec3ab410f6	0a955801-d641-46e0-93d9-e2a5b5d75a72	Listado	bi bi-list	/contacto/lista	t	2	f	\N	t	\N	2025-08-09 03:41:22.525923	\N	\N
2cb5ced4-0d07-461f-bfbb-261219e7aa2d	29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1	\N	Usuario	bi bi-person		f	50	f		t	\N	2025-08-09 03:41:22.525923	\N	\N
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
-- TOC entry 5491 (class 0 OID 17370)
-- Dependencies: 286
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
-- TOC entry 5515 (class 0 OID 32167)
-- Dependencies: 310
-- Data for Name: miembros; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.miembros (id, tipo_miembro_id, naturaleza, empresa, titulo_cortesia, apellidos, nombres, sexo, correo, web, direccion, codigo_postal, poblacion, pais, provincia, telefono_trabajo, telefono_particular, movil, fecha_nacimiento, membresia_publica, creado_en) FROM stdin;
\.


--
-- TOC entry 5522 (class 0 OID 93166)
-- Dependencies: 317
-- Data for Name: modelo_plan_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modelo_plan_contable (id_modelo_plan_contable, nombre, descripcion, codigo, estado, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5495 (class 0 OID 18517)
-- Dependencies: 290
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
-- TOC entry 5554 (class 0 OID 99350)
-- Dependencies: 349
-- Data for Name: movimiento_bancario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimiento_bancario (id_movimiento_bancario, id_empresa, id_cuenta_bancaria, fecha_movimiento, numero_documento, concepto, tipo_movimiento, monto, saldo_anterior, saldo_nuevo, conciliado, id_conciliacion_bancaria, id_asiento_contable, created_at) FROM stdin;
\.


--
-- TOC entry 5562 (class 0 OID 99551)
-- Dependencies: 357
-- Data for Name: movimiento_centro_costo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimiento_centro_costo (id_movimiento_centro_costo, id_movimiento_contable, id_centro_costo, porcentaje, monto, created_at) FROM stdin;
\.


--
-- TOC entry 5537 (class 0 OID 98892)
-- Dependencies: 332
-- Data for Name: movimiento_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimiento_contable (id_movimiento_contable, id_asiento_contable, id_cuenta_contable, concepto, debe, haber, orden, created_at) FROM stdin;
\.


--
-- TOC entry 5567 (class 0 OID 106377)
-- Dependencies: 362
-- Data for Name: movimiento_cuenta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimiento_cuenta (id_movimiento_cuenta, id_empresa, id_cuenta_financiera, fecha_movimiento, descripcion, importe, creado_en) FROM stdin;
\.


--
-- TOC entry 5555 (class 0 OID 99380)
-- Dependencies: 350
-- Data for Name: movimiento_inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimiento_inventario (id_movimiento_inventario, id_empresa, id_item, tipo_movimiento, cantidad, costo_unitario, costo_total, fecha_movimiento, referencia, concepto, id_asiento_contable, created_at, id_almacen, id_lote_serie, modulo_origen, id_origen, updated_by, updated_at, estado, id_almacen_destino) FROM stdin;
\.


--
-- TOC entry 5558 (class 0 OID 99453)
-- Dependencies: 353
-- Data for Name: nota_credito; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nota_credito (id_nota_credito, id_empresa, numero_nota, tipo_nota, id_tercero, id_factura, fecha_nota, motivo, subtotal, total_impuestos, total_descuentos, total_nota, estado, id_asiento_contable, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5559 (class 0 OID 99488)
-- Dependencies: 354
-- Data for Name: nota_credito_linea; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nota_credito_linea (id_nota_credito_linea, id_nota_credito, id_item, descripcion, cantidad, precio_unitario, descuento_porcentaje, descuento_valor, subtotal, orden, created_at) FROM stdin;
\.


--
-- TOC entry 5551 (class 0 OID 99260)
-- Dependencies: 346
-- Data for Name: pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pago (id_pago, id_empresa, numero_pago, tipo_pago, id_tercero, id_cuenta_bancaria, fecha_pago, monto, id_moneda, tipo_cambio, concepto, estado, id_asiento_contable, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5552 (class 0 OID 99299)
-- Dependencies: 347
-- Data for Name: pago_factura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pago_factura (id_pago_factura, id_pago, id_factura, monto_aplicado, created_at) FROM stdin;
\.


--
-- TOC entry 5496 (class 0 OID 18525)
-- Dependencies: 291
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
-- TOC entry 5489 (class 0 OID 17331)
-- Dependencies: 284
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
-- TOC entry 5516 (class 0 OID 46549)
-- Dependencies: 311
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
-- TOC entry 5525 (class 0 OID 93225)
-- Dependencies: 320
-- Data for Name: periodo_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.periodo_contable (id_periodo_contable, id_empresa, "año", mes, fecha_inicio, fecha_fin, estado, fecha_cierre, id_usuario_cierre, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5523 (class 0 OID 93179)
-- Dependencies: 318
-- Data for Name: plan_contable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plan_contable (id_plan_contable, id_empresa, id_modelo_plan_contable, nombre, descripcion, estado, created_at, updated_at) FROM stdin;
98f6c564-40e9-49a3-9fa0-3c233da86415	fc59e203-237f-408b-8737-fe54dcf10dc1	\N	Plan General	Plan contable inicial	t	2026-02-14 20:28:19.192443	2026-02-14 20:28:19.192443
\.


--
-- TOC entry 5546 (class 0 OID 99129)
-- Dependencies: 341
-- Data for Name: prefactura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prefactura (id_prefactura, id_empresa, numero_prefactura, id_cotizacion, id_tercero, fecha_prefactura, fecha_vencimiento, subtotal, total_impuestos, total_descuentos, total_prefactura, estado, observaciones, id_factura, id_usuario_creacion, id_usuario_aprobacion, fecha_aprobacion, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5549 (class 0 OID 99220)
-- Dependencies: 344
-- Data for Name: prefactura_factura; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prefactura_factura (id_prefactura_factura, id_prefactura, id_factura, porcentaje_utilizado, created_at) FROM stdin;
\.


--
-- TOC entry 5547 (class 0 OID 99174)
-- Dependencies: 342
-- Data for Name: prefactura_linea; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prefactura_linea (id_prefactura_linea, id_prefactura, id_cotizacion_linea, id_item, descripcion, cantidad, precio_unitario, descuento_porcentaje, descuento_valor, subtotal, orden, created_at) FROM stdin;
\.


--
-- TOC entry 5556 (class 0 OID 99404)
-- Dependencies: 351
-- Data for Name: presupuesto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.presupuesto (id_presupuesto, id_empresa, numero_presupuesto, id_tercero, fecha_presupuesto, fecha_vencimiento, subtotal, total_impuestos, total_descuentos, total_presupuesto, estado, id_factura, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5557 (class 0 OID 99432)
-- Dependencies: 352
-- Data for Name: presupuesto_linea; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.presupuesto_linea (id_presupuesto_linea, id_presupuesto, id_item, descripcion, cantidad, precio_unitario, descuento_porcentaje, descuento_valor, subtotal, orden, created_at) FROM stdin;
\.


--
-- TOC entry 5497 (class 0 OID 18549)
-- Dependencies: 292
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
-- TOC entry 5589 (class 0 OID 221138)
-- Dependencies: 385
-- Data for Name: recepcion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recepcion (id_recepcion, id_empresa, recepcion_ref, id_tercero, ref_proveedor, poblacion, codigo_postal, fecha_prevista_entrega, fecha_recepcion, estado_recepcion, facturado, modulo_origen, id_origen, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5590 (class 0 OID 221156)
-- Dependencies: 386
-- Data for Name: recepcion_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recepcion_detalle (id_recepcion_detalle, id_recepcion, id_item, id_almacen, id_lote_serie, cantidad, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5560 (class 0 OID 99509)
-- Dependencies: 355
-- Data for Name: retencion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.retencion (id_retencion, id_empresa, tipo_retencion, porcentaje, base_retencion, valor_retencion, id_tercero, id_documento_origen, tipo_documento_origen, fecha_retencion, numero_certificado, estado, id_asiento_contable, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5539 (class 0 OID 98942)
-- Dependencies: 334
-- Data for Name: saldo_cuenta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.saldo_cuenta (id_saldo_cuenta, id_empresa, id_cuenta_contable, id_periodo_contable, saldo_debe, saldo_haber, saldo_final, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5576 (class 0 OID 216424)
-- Dependencies: 372
-- Data for Name: secuencia_asiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.secuencia_asiento (id, empresa_id, prefijo_diario, anio, mes, valor_actual, updated_at) FROM stdin;
\.


--
-- TOC entry 5501 (class 0 OID 18612)
-- Dependencies: 296
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
-- TOC entry 5581 (class 0 OID 220942)
-- Dependencies: 377
-- Data for Name: stock_item_almacen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_item_almacen (id_stock_producto_almacen, id_empresa, id_item, id_almacen, stock_fisico, stock_reservado, stock_virtual, stock_disponible, stock_alerta, stock_deseado, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5488 (class 0 OID 17280)
-- Dependencies: 283
-- Data for Name: sucursal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sucursal (id_sucursal, id_empresa, nombre, direccion, telefono, estado, created_at, updated_at, codigo_establecimiento) FROM stdin;
da0b18f1-2993-44d3-88fd-fd4de3f27c21	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	Secundaria	Maria de Olvide	042860053	t	2025-08-03 19:55:37.016034	2025-08-03 20:03:26.451279	001
8746bb38-b585-45ec-988f-521dc3f39879	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	Pruebas	Pruebas	0422	t	2025-08-03 20:03:46.012201	2025-08-03 20:03:46.012201	001
83f36679-29fc-4650-a2a2-c6b32d35ce53	31a8bf69-558d-4b00-8fc6-5e2384be09a3	Actualizada1	ACtualizad	999999	t	2025-08-05 02:50:59.385925	2025-08-05 03:17:17.841891	001
4d8a0e43-a2c7-4df1-bede-c325c6d054cc	45fa1728-15ad-485e-ade6-3c2f058e882f	Genie Solutions123	Gate2	280555	t	2025-08-03 20:27:13.709254	2025-08-05 03:17:30.544523	001
\.


--
-- TOC entry 5509 (class 0 OID 22128)
-- Dependencies: 304
-- Data for Name: tercero; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tercero (id_tercero, id_empresa, cliente_potencial, cliente, proveedor, nombre, apodo, codigo_cliente, direccion, poblacion, codigo_postal, id_pais, telefono, movil, fax, correo, web, id_profesional_1, id_profesional_2, cif_intra, sujeto_iva, capital, id_condicion_pago, id_forma_pago, sede_central, asignado_a, logo, id_tipo_tercero, created_by, updated_by, created_at, updated_at, estado, id_tipo_entidad, id_provincia, codigo_proveedor) FROM stdin;
b633d1ea-9217-4d20-a423-244f47c8d647	0459fe04-163b-4b89-b98a-0f1179b7224c	f	t	f	terceroClienteF	tercliF	CU2603-00004	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	8000.03	464a061b-594d-4883-9d8e-55e735f0ad07	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	\N	\N	4e8b0eef-0a8e-4534-a066-318bdd065a14	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-07 07:49:37.948986	2026-03-07 07:49:37.948986	t	2	\N	\N
a6c6f8a7-eaf7-485e-9ea9-34bfff3fe4ca	0459fe04-163b-4b89-b98a-0f1179b7224c	t	f	f	cliPotencial	cliP	CU2603-00005	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	4000.02	464a061b-594d-4883-9d8e-55e735f0ad07	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	\N	\N	\N	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-07 07:50:27.198097	2026-03-07 07:50:27.198097	t	\N	\N	\N
98e94b5e-fead-44ca-a215-bf7e0ca76788	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	f	t	f	createdby	createdby2	CU2603-00006	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	3900.05	31cf451e-a589-484e-b33d-3bd7d20ec98a	238af3a1-7fcc-458a-84e8-c8f376ac158d	\N	\N	\N	\N	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-07 16:39:19.38466	2026-03-07 16:48:43.526389	t	\N	\N	\N
5b170f8b-db94-49fb-8b9c-5c4538a611a0	0459fe04-163b-4b89-b98a-0f1179b7224c	f	f	t	provCreatedby2	provCreatedby	CU2603-00007	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	4580.03	464a061b-594d-4883-9d8e-55e735f0ad07	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	\N	\N	\N	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-07 16:41:03.655623	2026-03-07 16:49:13.07891	t	\N	\N	\N
871549c2-4cc2-41c0-9af7-4ae3e3c29c32	0459fe04-163b-4b89-b98a-0f1179b7224c	f	f	t	dsfd33	dss	CU2603-00006	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	6770.03	\N	\N	\N	\N	\N	\N	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-07 07:51:28.503149	2026-03-07 16:49:54.523324	t	\N	\N	\N
c2d9e7ba-38b3-48cf-b216-7764b19ac299	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	f	t	f	empresaA2	eA	CU2603-00001	\N	\N	\N	d4882144-caf7-46e8-8f72-4378a29a7ff7	\N	\N	\N	\N	\N	\N	\N	\N	t	3450.03	bb5b50be-202f-4e23-a992-c5534c7df39b	26d9fbd8-470d-4c58-8c87-acabb4193b93	\N	\N	\N	ab5f5dac-d03c-42b1-92bb-97131765f213	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-05 19:03:07.772755	2026-03-07 16:50:20.345122	t	4	9bf50026-6a5b-4681-a4b3-a8920b9d5e6e	\N
51d0f4af-f0c8-4487-b393-708c180e5c75	0459fe04-163b-4b89-b98a-0f1179b7224c	f	f	t	codigoProv	codigoProv	CU2603-00008	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	50.03	31cf451e-a589-484e-b33d-3bd7d20ec98a	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	\N	\N	\N	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-07 17:41:45.484816	2026-03-07 17:41:45.484816	t	\N	\N	SU2603-00001
df4e8c8e-999d-4d55-bbfb-73e9d4aad752	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	f	t	f	codProvc2	codProvc2	CU2603-00007	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	3000.03	31cf451e-a589-484e-b33d-3bd7d20ec98a	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	\N	\N	\N	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-07 17:43:21.357357	2026-03-07 17:43:21.357357	t	\N	\N	\N
94ff2fc3-7478-4c4c-ac9b-23cbb7690265	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	f	t	f	codiProvProv	codiProvProv	CU2603-00008	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	11110.02	31cf451e-a589-484e-b33d-3bd7d20ec98a	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	\N	\N	\N	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-07 17:45:00.865795	2026-03-07 17:45:00.865795	t	\N	\N	\N
49a9ea96-fd20-4385-af16-18306aaee157	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	t	f	f	codCliPotencial45	codCliPotencial45	CU2603-00009	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	8900.02	31cf451e-a589-484e-b33d-3bd7d20ec98a	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	\N	\N	\N	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-07 17:53:53.669051	2026-03-07 17:53:53.669051	t	\N	\N	\N
5a9c09db-f2bd-4181-8506-909b903067a0	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	f	t	f	empreDependeA	\N	CU2603-00002	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	7650.06	31cf451e-a589-484e-b33d-3bd7d20ec98a	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	c2d9e7ba-38b3-48cf-b216-7764b19ac299	\N	84fe28ca-953e-433c-ad96-0d5a5bcb5b6a	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-05 19:03:58.877312	2026-03-05 19:54:59.115221	t	2	\N	\N
d3502695-8ccc-49dc-8726-9b1bae353098	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	t	f	f	terCodCliPoten55	terCodCliPoten55	CU2603-00010	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	567.02	31cf451e-a589-484e-b33d-3bd7d20ec98a	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	\N	\N	\N	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-07 17:55:28.145497	2026-03-07 17:55:28.145497	t	\N	\N	\N
a932f727-71a2-4545-b22e-4a4e5c15dd3e	0459fe04-163b-4b89-b98a-0f1179b7224c	f	t	f	empreDependeB	\N	CU2603-00002	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	0.00	464a061b-594d-4883-9d8e-55e735f0ad07	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	a4ebddde-39c7-432d-9ad2-f173b9760561	\N	84fe28ca-953e-433c-ad96-0d5a5bcb5b6a	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-05 19:01:32.819333	2026-03-05 19:55:07.230643	t	1	\N	\N
f930de27-852e-4b58-a22d-b2a6a42bf70f	0459fe04-163b-4b89-b98a-0f1179b7224c	f	f	t	codProvProve33	codProvProve33	CU2603-00009	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	3450.03	464a061b-594d-4883-9d8e-55e735f0ad07	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	\N	\N	\N	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-07 17:48:10.859622	2026-03-07 18:40:32.271887	t	\N	\N	SU2603-00022
a4ebddde-39c7-432d-9ad2-f173b9760561	0459fe04-163b-4b89-b98a-0f1179b7224c	f	t	f	empresaB	\N	CU2603-00001	la floresta etapa 4	Guayaquil	090104	d4882144-caf7-46e8-8f72-4378a29a7ff7	\N	\N	\N	\N	\N	\N	\N	\N	t	2000.04	31cf451e-a589-484e-b33d-3bd7d20ec98a	238af3a1-7fcc-458a-84e8-c8f376ac158d	\N	\N	\\x687474703a2f2f6c6f63616c686f73743a333031302f75706c6f6164732f7465726365726f732f313737323733373037393235332d377879747a706e7365396f2e6a7067	ab5f5dac-d03c-42b1-92bb-97131765f213	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-05 18:59:34.412592	2026-03-05 19:55:12.605817	t	3	\N	\N
7ae5412c-96b4-4fd2-b9f9-48bf8a0a34d4	0459fe04-163b-4b89-b98a-0f1179b7224c	f	f	t	proveB	proveB	CU2603-00003	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	3000.04	464a061b-594d-4883-9d8e-55e735f0ad07	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	a4ebddde-39c7-432d-9ad2-f173b9760561	\N	f2431a00-5aba-48e5-a19a-c66845505655	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-05 19:56:31.026188	2026-03-05 19:56:48.593341	t	5	\N	\N
b84967c0-740f-4bb1-881c-e64931b15643	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	f	f	t	PorveA	ProveA	CU2603-00003	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	8430.02	464a061b-594d-4883-9d8e-55e735f0ad07	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	c2d9e7ba-38b3-48cf-b216-7764b19ac299	\N	\N	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-05 19:57:39.82023	2026-03-05 19:57:39.82023	t	\N	\N	\N
b95d23f0-4006-4e01-8835-060facf95096	0459fe04-163b-4b89-b98a-0f1179b7224c	f	t	f	TerceroTest	\N	111111	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	23000.03	464a061b-594d-4883-9d8e-55e735f0ad07	9e1fb0b7-833b-4265-9b44-29e88c39f558	\N	\N	\N	\N	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-07 05:06:55.658303	2026-03-07 05:06:55.658303	t	\N	\N	\N
bcd16d87-dde5-43b9-a39b-b965a78efcaa	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	f	f	t	verificar	veri	CU2603-00004	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	7850.04	31cf451e-a589-484e-b33d-3bd7d20ec98a	238af3a1-7fcc-458a-84e8-c8f376ac158d	\N	\N	\N	f2431a00-5aba-48e5-a19a-c66845505655	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-07 07:43:09.724757	2026-03-07 07:43:09.724757	t	2	\N	\N
bebc40ac-e13a-4945-b1bd-396dc5aa6fa3	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	f	f	t	verificar	veri	CU2603-00005	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	7850.04	31cf451e-a589-484e-b33d-3bd7d20ec98a	238af3a1-7fcc-458a-84e8-c8f376ac158d	\N	\N	\N	f2431a00-5aba-48e5-a19a-c66845505655	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	2026-03-07 07:43:28.668904	2026-03-07 07:43:28.668904	t	2	\N	\N
\.


--
-- TOC entry 5563 (class 0 OID 99569)
-- Dependencies: 358
-- Data for Name: tipo_cambio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_cambio (id_tipo_cambio, id_empresa, id_moneda_origen, id_moneda_destino, fecha_cambio, tasa_cambio, created_at) FROM stdin;
\.


--
-- TOC entry 5594 (class 0 OID 222443)
-- Dependencies: 390
-- Data for Name: tipo_control_caducidad_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_control_caducidad_item (id_tipo_control_caducidad, codigo, nombre, descripcion, orden, estado, created_at, updated_at) FROM stdin;
f7893727-2d13-4767-b5e1-e36ede53e630	NINGUNA	Ninguna	El item no requiere control de fechas	1	t	2026-03-08 23:08:52.098848	2026-03-08 23:08:52.098848
82bbdeaa-ae76-4f52-b03c-b7a503c2454a	FECHA_LIMITE_VENTA	Fecha límite de venta	El item requiere fecha límite de venta	2	t	2026-03-08 23:08:52.098848	2026-03-08 23:08:52.098848
d6f8b499-db4c-47cb-a8a7-7a9b5ff40323	FECHA_CADUCIDAD	Fecha de caducidad	El item requiere fecha de caducidad	3	t	2026-03-08 23:08:52.098848	2026-03-08 23:08:52.098848
05db11a4-9a7e-405b-aaf5-528b366a451f	AMBAS	Ambas	El item requiere fecha límite de venta y fecha de caducidad	4	t	2026-03-08 23:08:52.098848	2026-03-08 23:08:52.098848
\.


--
-- TOC entry 5499 (class 0 OID 18568)
-- Dependencies: 294
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
-- TOC entry 5595 (class 0 OID 222463)
-- Dependencies: 391
-- Data for Name: tipo_item_catalogo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_item_catalogo (id_tipo_item, codigo, nombre, descripcion, orden, estado, created_at, updated_at) FROM stdin;
991d248f-b44a-48d4-9a2f-f33529d9cf05	PRODUCT	Producto	Ítem físico o inventariable	1	t	2026-03-08 23:40:32.5291	2026-03-08 23:40:32.5291
75230088-4af9-4e79-97a6-130e905097ec	SERVICE	Servicio	Ítem de tipo servicio	2	t	2026-03-08 23:40:32.5291	2026-03-08 23:40:32.5291
\.


--
-- TOC entry 5505 (class 0 OID 22057)
-- Dependencies: 300
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
-- TOC entry 5578 (class 0 OID 219803)
-- Dependencies: 374
-- Data for Name: tipo_unidad_medida; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipo_unidad_medida (id_tipo_unidad, codigo, nombre, descripcion, activo) FROM stdin;
9abe23fa-5ffd-460a-b0b8-1f84e1288485	PESO	Peso	\N	t
e1fb958d-4a3e-497f-8338-78a3b498bc66	LONGITUD	Longitud	\N	t
6a91c90b-d021-42dc-9b05-ce0759bbffdd	SUPERFICIE	Superficie	\N	t
eeee0ff5-1abb-43a4-b435-b8d3dcba4f56	VOLUMEN	Volumen	\N	t
\.


--
-- TOC entry 5513 (class 0 OID 32151)
-- Dependencies: 308
-- Data for Name: tipos_miembro; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipos_miembro (id, etiqueta, estado, naturaleza, sujeto_cotizacion, importe, cualquier_importe, voto_autorizado, duracion, descripcion, email_bienvenida, creado_en) FROM stdin;
\.


--
-- TOC entry 5565 (class 0 OID 106298)
-- Dependencies: 360
-- Data for Name: titular_cuenta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.titular_cuenta (id_titular_cuenta, nombre_completo, direccion, codigo_postal, ciudad, id_pais) FROM stdin;
\.


--
-- TOC entry 5585 (class 0 OID 221048)
-- Dependencies: 381
-- Data for Name: transferencia_stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transferencia_stock (id_transferencia_stock, id_empresa, transferencia_ref, id_almacen_origen, id_almacen_destino, estado_transferencia, fecha_transferencia, observacion, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5586 (class 0 OID 221072)
-- Dependencies: 382
-- Data for Name: transferencia_stock_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transferencia_stock_detalle (id_transferencia_stock_detalle, id_transferencia_stock, id_item, id_lote_serie, cantidad, created_by, updated_by, created_at, updated_at, estado) FROM stdin;
\.


--
-- TOC entry 5579 (class 0 OID 219813)
-- Dependencies: 375
-- Data for Name: unidad_medida; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unidad_medida (id_unidad, id_tipo_unidad, codigo, nombre, simbolo, descripcion, activo) FROM stdin;
b3741fbe-2580-498f-a363-5168071ef267	9abe23fa-5ffd-460a-b0b8-1f84e1288485	KG	Kilogramo	kg	\N	t
9933402f-bcce-4f49-b0f4-e9bf1287c46d	9abe23fa-5ffd-460a-b0b8-1f84e1288485	G	Gramo	g	\N	t
5709f6da-f5d2-44b7-baf2-b986f8bd4e3b	e1fb958d-4a3e-497f-8338-78a3b498bc66	MM	Milímetro	mm	\N	t
90f49ab7-cc83-49c6-99ea-992f1985d3c9	e1fb958d-4a3e-497f-8338-78a3b498bc66	CM	Centímetro	cm	\N	t
052c9a48-5db5-444c-9d75-2f41545cd066	e1fb958d-4a3e-497f-8338-78a3b498bc66	M	Metro	m	\N	t
\.


--
-- TOC entry 5490 (class 0 OID 17347)
-- Dependencies: 285
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id_usuario, id_empresa, id_perfil, username, password_hash, nombre_completo, email, estado, created_at, updated_at, scope_acceso) FROM stdin;
2c5fcc4f-3a54-4fc3-90b1-ceb49751ed62	d2600c4c-2ce7-4d01-b6e8-82f028e69d27	19a7e082-266e-4865-a7c5-abe4ca9cbeb7	john_quezada@hotmail.com	$2b$12$rAWp.WzDAxLHJoIstg7Sz.PjpZGBH3u4UQY0psoDC8YE6i2J3j2ky	John Quezada	john_quezada@hotmail.com	t	2025-07-23 14:35:00.454842	2025-07-23 14:35:00.454842	GLOBAL
\.


--
-- TOC entry 5482 (class 0 OID 17000)
-- Dependencies: 273
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
\.


--
-- TOC entry 5484 (class 0 OID 17027)
-- Dependencies: 276
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- TOC entry 5468 (class 0 OID 16544)
-- Dependencies: 256
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- TOC entry 5518 (class 0 OID 53242)
-- Dependencies: 313
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- TOC entry 5568 (class 0 OID 119631)
-- Dependencies: 364
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5470 (class 0 OID 16586)
-- Dependencies: 258
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-07-22 23:04:12.499223
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-07-22 23:04:12.506797
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-07-22 23:04:12.512757
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-07-22 23:04:12.528843
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-07-22 23:04:12.539839
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-07-22 23:04:12.548122
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-07-22 23:04:12.555474
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-07-22 23:04:12.562527
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-07-22 23:04:12.568898
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-07-22 23:04:12.575137
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-07-22 23:04:12.581533
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
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-08-26 14:49:02.793453
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-08-26 14:49:03.054092
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-08-26 14:49:03.230975
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-08-26 14:49:03.304913
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-08-26 14:49:03.315199
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-08-26 14:49:03.335489
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-08-26 14:49:04.198843
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-08-26 14:49:04.301955
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-08-26 14:49:04.309136
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-08-26 14:49:04.6003
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-08-26 14:49:05.092779
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-08-26 14:49:05.499277
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-08-26 14:49:05.995564
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2025-10-04 16:40:40.018309
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2025-10-04 16:40:40.067161
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2025-10-04 16:40:40.093997
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2025-10-04 16:40:40.102481
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2025-10-04 16:40:40.113352
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2025-11-19 03:01:41.310343
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2025-11-19 03:01:41.35094
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2025-11-19 03:01:41.451976
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2025-11-19 03:01:41.462674
48	iceberg-catalog-ids	2666dff93346e5d04e0a878416be1d5fec345d6f	2025-11-19 03:01:41.486791
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-01-06 04:05:06.106064
\.


--
-- TOC entry 5469 (class 0 OID 16559)
-- Dependencies: 257
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
\.


--
-- TOC entry 5517 (class 0 OID 53197)
-- Dependencies: 312
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5485 (class 0 OID 17071)
-- Dependencies: 277
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- TOC entry 5486 (class 0 OID 17085)
-- Dependencies: 278
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- TOC entry 5569 (class 0 OID 119641)
-- Dependencies: 365
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3980 (class 0 OID 16656)
-- Dependencies: 259
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5884 (class 0 OID 0)
-- Dependencies: 251
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 3, true);


--
-- TOC entry 5885 (class 0 OID 0)
-- Dependencies: 288
-- Name: entidad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.entidad_id_seq', 1, false);


--
-- TOC entry 5886 (class 0 OID 0)
-- Dependencies: 305
-- Name: impuestos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.impuestos_id_seq', 2, true);


--
-- TOC entry 5887 (class 0 OID 0)
-- Dependencies: 309
-- Name: miembros_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.miembros_id_seq', 1, false);


--
-- TOC entry 5888 (class 0 OID 0)
-- Dependencies: 371
-- Name: secuencia_asiento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.secuencia_asiento_id_seq', 1, false);


--
-- TOC entry 5889 (class 0 OID 0)
-- Dependencies: 293
-- Name: tipo_entidad_comercial_id_tipo_entidad_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipo_entidad_comercial_id_tipo_entidad_seq', 8, true);


--
-- TOC entry 5890 (class 0 OID 0)
-- Dependencies: 307
-- Name: tipos_miembro_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipos_miembro_id_seq', 1, false);


--
-- TOC entry 5891 (class 0 OID 0)
-- Dependencies: 275
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- TOC entry 4561 (class 2606 OID 16825)
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- TOC entry 4515 (class 2606 OID 16529)
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 4953 (class 2606 OID 211970)
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- TOC entry 4955 (class 2606 OID 211968)
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4584 (class 2606 OID 16931)
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- TOC entry 4539 (class 2606 OID 16949)
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- TOC entry 4541 (class 2606 OID 16959)
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- TOC entry 4513 (class 2606 OID 16522)
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- TOC entry 4563 (class 2606 OID 16818)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- TOC entry 4559 (class 2606 OID 16806)
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 4551 (class 2606 OID 16999)
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- TOC entry 4553 (class 2606 OID 16793)
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- TOC entry 4751 (class 2606 OID 94234)
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- TOC entry 4753 (class 2606 OID 94232)
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- TOC entry 4755 (class 2606 OID 94230)
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- TOC entry 4931 (class 2606 OID 144211)
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- TOC entry 4704 (class 2606 OID 78686)
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- TOC entry 4759 (class 2606 OID 94256)
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- TOC entry 4761 (class 2606 OID 94258)
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- TOC entry 4588 (class 2606 OID 16984)
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4507 (class 2606 OID 16512)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4510 (class 2606 OID 16736)
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- TOC entry 4573 (class 2606 OID 16865)
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- TOC entry 4575 (class 2606 OID 16863)
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4580 (class 2606 OID 16879)
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- TOC entry 4518 (class 2606 OID 16535)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4546 (class 2606 OID 16757)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4570 (class 2606 OID 16846)
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- TOC entry 4565 (class 2606 OID 16837)
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4500 (class 2606 OID 16919)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 4502 (class 2606 OID 16499)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4978 (class 2606 OID 220941)
-- Name: almacen almacen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.almacen
    ADD CONSTRAINT almacen_pkey PRIMARY KEY (id_almacen);


--
-- TOC entry 4776 (class 2606 OID 98871)
-- Name: asiento_contable asiento_contable_numero_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento_contable
    ADD CONSTRAINT asiento_contable_numero_unique UNIQUE (id_empresa, numero_asiento);


--
-- TOC entry 4778 (class 2606 OID 98869)
-- Name: asiento_contable asiento_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento_contable
    ADD CONSTRAINT asiento_contable_pkey PRIMARY KEY (id_asiento_contable);


--
-- TOC entry 5015 (class 2606 OID 222354)
-- Name: categoria_item categoria_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_item
    ADD CONSTRAINT categoria_item_pkey PRIMARY KEY (id_categoria_item);


--
-- TOC entry 4898 (class 2606 OID 99545)
-- Name: centro_costo centro_costo_codigo_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.centro_costo
    ADD CONSTRAINT centro_costo_codigo_unique UNIQUE (id_empresa, codigo);


--
-- TOC entry 4900 (class 2606 OID 99543)
-- Name: centro_costo centro_costo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.centro_costo
    ADD CONSTRAINT centro_costo_pkey PRIMARY KEY (id_centro_costo);


--
-- TOC entry 4910 (class 2606 OID 99602)
-- Name: cierre_contable cierre_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_contable
    ADD CONSTRAINT cierre_contable_pkey PRIMARY KEY (id_cierre_contable);


--
-- TOC entry 4764 (class 2606 OID 98799)
-- Name: cierre_cuenta cierre_cuenta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_cuenta
    ADD CONSTRAINT cierre_cuenta_pkey PRIMARY KEY (id_cierre_cuenta);


--
-- TOC entry 4766 (class 2606 OID 98801)
-- Name: cierre_cuenta cierre_cuenta_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_cuenta
    ADD CONSTRAINT cierre_cuenta_unique UNIQUE (id_periodo_contable, id_cuenta_contable);


--
-- TOC entry 4968 (class 2606 OID 219791)
-- Name: ciudad ciudad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudad
    ADD CONSTRAINT ciudad_pkey PRIMARY KEY (id_ciudad);


--
-- TOC entry 4865 (class 2606 OID 99327)
-- Name: conciliacion_bancaria conciliacion_bancaria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conciliacion_bancaria
    ADD CONSTRAINT conciliacion_bancaria_pkey PRIMARY KEY (id_conciliacion_bancaria);


--
-- TOC entry 4867 (class 2606 OID 99329)
-- Name: conciliacion_bancaria conciliacion_bancaria_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conciliacion_bancaria
    ADD CONSTRAINT conciliacion_bancaria_unique UNIQUE (id_cuenta_bancaria, id_periodo_contable);


--
-- TOC entry 4674 (class 2606 OID 22072)
-- Name: condicion_pago_catalogo condicion_pago_catalogo_descripcion_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condicion_pago_catalogo
    ADD CONSTRAINT condicion_pago_catalogo_descripcion_key UNIQUE (descripcion);


--
-- TOC entry 4676 (class 2606 OID 22070)
-- Name: condicion_pago_catalogo condicion_pago_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condicion_pago_catalogo
    ADD CONSTRAINT condicion_pago_catalogo_pkey PRIMARY KEY (id_condicion_pago);


--
-- TOC entry 4706 (class 2606 OID 93123)
-- Name: configuracion_contabilidad configuracion_contabilidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_contabilidad
    ADD CONSTRAINT configuracion_contabilidad_pkey PRIMARY KEY (id_configuracion_contabilidad);


--
-- TOC entry 4663 (class 2606 OID 18659)
-- Name: contable_externo contable_externo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contable_externo
    ADD CONSTRAINT contable_externo_pkey PRIMARY KEY (id_contable);


--
-- TOC entry 4933 (class 2606 OID 207475)
-- Name: contacto_direccion contacto_direccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacto_direccion
    ADD CONSTRAINT contacto_direccion_pkey PRIMARY KEY (id_contacto);


--
-- TOC entry 4820 (class 2606 OID 99118)
-- Name: cotizacion_linea cotizacion_linea_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_linea
    ADD CONSTRAINT cotizacion_linea_pkey PRIMARY KEY (id_cotizacion_linea);


--
-- TOC entry 4812 (class 2606 OID 99087)
-- Name: cotizacion cotizacion_numero_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_numero_unique UNIQUE (id_empresa, numero_cotizacion);


--
-- TOC entry 4814 (class 2606 OID 99085)
-- Name: cotizacion cotizacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_pkey PRIMARY KEY (id_cotizacion);


--
-- TOC entry 4837 (class 2606 OID 99207)
-- Name: cotizacion_prefactura cotizacion_prefactura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_prefactura
    ADD CONSTRAINT cotizacion_prefactura_pkey PRIMARY KEY (id_cotizacion_prefactura);


--
-- TOC entry 4839 (class 2606 OID 99209)
-- Name: cotizacion_prefactura cotizacion_prefactura_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_prefactura
    ADD CONSTRAINT cotizacion_prefactura_unique UNIQUE (id_cotizacion, id_prefactura);


--
-- TOC entry 4733 (class 2606 OID 93279)
-- Name: cuenta_bancaria cuenta_bancaria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_bancaria
    ADD CONSTRAINT cuenta_bancaria_pkey PRIMARY KEY (id_cuenta_bancaria);


--
-- TOC entry 4735 (class 2606 OID 93281)
-- Name: cuenta_bancaria cuenta_bancaria_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_bancaria
    ADD CONSTRAINT cuenta_bancaria_unique UNIQUE (id_empresa, id_banco, numero_cuenta);


--
-- TOC entry 4718 (class 2606 OID 93214)
-- Name: cuenta_contable cuenta_contable_codigo_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable
    ADD CONSTRAINT cuenta_contable_codigo_unique UNIQUE (id_plan_contable, codigo);


--
-- TOC entry 4729 (class 2606 OID 93256)
-- Name: cuenta_contable_defecto cuenta_contable_defecto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_defecto
    ADD CONSTRAINT cuenta_contable_defecto_pkey PRIMARY KEY (id_cuenta_contable_defecto);


--
-- TOC entry 4731 (class 2606 OID 93258)
-- Name: cuenta_contable_defecto cuenta_contable_defecto_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_defecto
    ADD CONSTRAINT cuenta_contable_defecto_unique UNIQUE (id_empresa, tipo_operacion);


--
-- TOC entry 4745 (class 2606 OID 93352)
-- Name: cuenta_contable_item cuenta_contable_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_item
    ADD CONSTRAINT cuenta_contable_item_pkey PRIMARY KEY (id_cuenta_contable_item);


--
-- TOC entry 4747 (class 2606 OID 93354)
-- Name: cuenta_contable_item cuenta_contable_item_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_item
    ADD CONSTRAINT cuenta_contable_item_unique UNIQUE (id_empresa, tipo_movimiento);


--
-- TOC entry 4720 (class 2606 OID 93212)
-- Name: cuenta_contable cuenta_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable
    ADD CONSTRAINT cuenta_contable_pkey PRIMARY KEY (id_cuenta_contable);


--
-- TOC entry 4915 (class 2606 OID 106344)
-- Name: cuenta_financiera cuenta_financiera_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_financiera
    ADD CONSTRAINT cuenta_financiera_pkey PRIMARY KEY (id_cuenta_financiera);


--
-- TOC entry 4772 (class 2606 OID 98846)
-- Name: cuenta_grupo_personalizado cuenta_grupo_personalizado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_grupo_personalizado
    ADD CONSTRAINT cuenta_grupo_personalizado_pkey PRIMARY KEY (id_cuenta_grupo_personalizado);


--
-- TOC entry 4774 (class 2606 OID 98848)
-- Name: cuenta_grupo_personalizado cuenta_grupo_personalizado_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_grupo_personalizado
    ADD CONSTRAINT cuenta_grupo_personalizado_unique UNIQUE (id_grupo_cuenta_personalizado, id_cuenta_contable);


--
-- TOC entry 4741 (class 2606 OID 93331)
-- Name: cuenta_impuesto cuenta_impuesto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_impuesto
    ADD CONSTRAINT cuenta_impuesto_pkey PRIMARY KEY (id_cuenta_impuesto);


--
-- TOC entry 4743 (class 2606 OID 93333)
-- Name: cuenta_impuesto cuenta_impuesto_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_impuesto
    ADD CONSTRAINT cuenta_impuesto_unique UNIQUE (id_empresa, tipo_impuesto, porcentaje);


--
-- TOC entry 4737 (class 2606 OID 93310)
-- Name: cuenta_iva cuenta_iva_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_iva
    ADD CONSTRAINT cuenta_iva_pkey PRIMARY KEY (id_cuenta_iva);


--
-- TOC entry 4739 (class 2606 OID 93312)
-- Name: cuenta_iva cuenta_iva_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_iva
    ADD CONSTRAINT cuenta_iva_unique UNIQUE (id_empresa, tipo_iva, porcentaje);


--
-- TOC entry 4708 (class 2606 OID 93160)
-- Name: diario_contable diario_contable_codigo_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diario_contable
    ADD CONSTRAINT diario_contable_codigo_unique UNIQUE (id_empresa, codigo);


--
-- TOC entry 4710 (class 2606 OID 93158)
-- Name: diario_contable diario_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diario_contable
    ADD CONSTRAINT diario_contable_pkey PRIMARY KEY (id_diario_contable);


--
-- TOC entry 4793 (class 2606 OID 98978)
-- Name: documento_origen documento_origen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_origen
    ADD CONSTRAINT documento_origen_pkey PRIMARY KEY (id_documento_origen);


--
-- TOC entry 4795 (class 2606 OID 98980)
-- Name: documento_origen documento_origen_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_origen
    ADD CONSTRAINT documento_origen_unique UNIQUE (id_empresa, tipo_documento, numero_documento);


--
-- TOC entry 5043 (class 2606 OID 222493)
-- Name: duracion_unidad_catalogo duracion_unidad_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.duracion_unidad_catalogo
    ADD CONSTRAINT duracion_unidad_catalogo_pkey PRIMARY KEY (id_duration_unit);


--
-- TOC entry 4666 (class 2606 OID 18693)
-- Name: empresa_horario_apertura empresa_horario_apertura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_horario_apertura
    ADD CONSTRAINT empresa_horario_apertura_pkey PRIMARY KEY (id_horario);


--
-- TOC entry 4652 (class 2606 OID 18586)
-- Name: empresa_identificacion empresa_identificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_identificacion
    ADD CONSTRAINT empresa_identificacion_pkey PRIMARY KEY (id_identificacion);


--
-- TOC entry 4607 (class 2606 OID 17277)
-- Name: empresa empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_pkey PRIMARY KEY (id_empresa);


--
-- TOC entry 4659 (class 2606 OID 18628)
-- Name: empresa_red_social empresa_red_social_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_red_social
    ADD CONSTRAINT empresa_red_social_pkey PRIMARY KEY (id);


--
-- TOC entry 4609 (class 2606 OID 17279)
-- Name: empresa empresa_ruc_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_ruc_key UNIQUE (ruc);


--
-- TOC entry 4632 (class 2606 OID 18515)
-- Name: entidad entidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entidad
    ADD CONSTRAINT entidad_pkey PRIMARY KEY (id);


--
-- TOC entry 5008 (class 2606 OID 221122)
-- Name: envio_detalle envio_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.envio_detalle
    ADD CONSTRAINT envio_detalle_pkey PRIMARY KEY (id_envio_detalle);


--
-- TOC entry 5005 (class 2606 OID 221108)
-- Name: envio envio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.envio
    ADD CONSTRAINT envio_pkey PRIMARY KEY (id_envio);


--
-- TOC entry 5025 (class 2606 OID 222428)
-- Name: estado_compra_item estado_compra_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_compra_item
    ADD CONSTRAINT estado_compra_item_pkey PRIMARY KEY (id_estado_compra);


--
-- TOC entry 5019 (class 2606 OID 222413)
-- Name: estado_venta_item estado_venta_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_venta_item
    ADD CONSTRAINT estado_venta_item_pkey PRIMARY KEY (id_estado_venta);


--
-- TOC entry 4810 (class 2606 OID 99057)
-- Name: factura_linea factura_linea_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura_linea
    ADD CONSTRAINT factura_linea_pkey PRIMARY KEY (id_factura_linea);


--
-- TOC entry 4802 (class 2606 OID 99031)
-- Name: factura factura_numero_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_numero_unique UNIQUE (id_empresa, numero_factura);


--
-- TOC entry 4804 (class 2606 OID 99029)
-- Name: factura factura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_pkey PRIMARY KEY (id_factura);


--
-- TOC entry 4678 (class 2606 OID 22119)
-- Name: forma_pago_catalogo forma_pago_catalogo_descripcion_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forma_pago_catalogo
    ADD CONSTRAINT forma_pago_catalogo_descripcion_key UNIQUE (descripcion);


--
-- TOC entry 4680 (class 2606 OID 22117)
-- Name: forma_pago_catalogo forma_pago_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forma_pago_catalogo
    ADD CONSTRAINT forma_pago_catalogo_pkey PRIMARY KEY (id_forma_pago);


--
-- TOC entry 4768 (class 2606 OID 98832)
-- Name: grupo_cuenta_personalizado grupo_cuenta_personalizado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grupo_cuenta_personalizado
    ADD CONSTRAINT grupo_cuenta_personalizado_pkey PRIMARY KEY (id_grupo_cuenta_personalizado);


--
-- TOC entry 4770 (class 2606 OID 98834)
-- Name: grupo_cuenta_personalizado grupo_cuenta_personalizado_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grupo_cuenta_personalizado
    ADD CONSTRAINT grupo_cuenta_personalizado_unique UNIQUE (id_empresa, nombre);


--
-- TOC entry 4849 (class 2606 OID 99249)
-- Name: historial_conversion historial_conversion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_conversion
    ADD CONSTRAINT historial_conversion_pkey PRIMARY KEY (id_historial_conversion);


--
-- TOC entry 4689 (class 2606 OID 24396)
-- Name: impuestos impuestos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.impuestos
    ADD CONSTRAINT impuestos_pkey PRIMARY KEY (id);


--
-- TOC entry 4682 (class 2606 OID 22127)
-- Name: incoterm_catalogo incoterm_catalogo_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incoterm_catalogo
    ADD CONSTRAINT incoterm_catalogo_codigo_key UNIQUE (codigo);


--
-- TOC entry 4684 (class 2606 OID 22125)
-- Name: incoterm_catalogo incoterm_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.incoterm_catalogo
    ADD CONSTRAINT incoterm_catalogo_pkey PRIMARY KEY (id_incoterm);


--
-- TOC entry 4798 (class 2606 OID 99011)
-- Name: informe_contable informe_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.informe_contable
    ADD CONSTRAINT informe_contable_pkey PRIMARY KEY (id_informe_contable);


--
-- TOC entry 4800 (class 2606 OID 99013)
-- Name: informe_contable informe_contable_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.informe_contable
    ADD CONSTRAINT informe_contable_unique UNIQUE (id_empresa, nombre);


--
-- TOC entry 4999 (class 2606 OID 221031)
-- Name: inventario_detalle inventario_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_detalle
    ADD CONSTRAINT inventario_detalle_pkey PRIMARY KEY (id_inventario_detalle);


--
-- TOC entry 4996 (class 2606 OID 221012)
-- Name: inventario inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_pkey PRIMARY KEY (id_inventario);


--
-- TOC entry 4991 (class 2606 OID 220978)
-- Name: item_lote_serie item_lote_serie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_lote_serie
    ADD CONSTRAINT item_lote_serie_pkey PRIMARY KEY (id_lote_serie);


--
-- TOC entry 4947 (class 2606 OID 208597)
-- Name: item item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_pkey PRIMARY KEY (id_item);


--
-- TOC entry 4785 (class 2606 OID 98924)
-- Name: libro_mayor libro_mayor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.libro_mayor
    ADD CONSTRAINT libro_mayor_pkey PRIMARY KEY (id_libro_mayor);


--
-- TOC entry 4787 (class 2606 OID 98926)
-- Name: libro_mayor libro_mayor_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.libro_mayor
    ADD CONSTRAINT libro_mayor_unique UNIQUE (id_cuenta_contable, id_periodo_contable);


--
-- TOC entry 4961 (class 2606 OID 213088)
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id_media);


--
-- TOC entry 4630 (class 2606 OID 17391)
-- Name: menu_item menu_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item
    ADD CONSTRAINT menu_item_pkey PRIMARY KEY (id_item);


--
-- TOC entry 4621 (class 2606 OID 17378)
-- Name: menu_seccion menu_seccion_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_seccion
    ADD CONSTRAINT menu_seccion_nombre_key UNIQUE (nombre);


--
-- TOC entry 4623 (class 2606 OID 17376)
-- Name: menu_seccion menu_seccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_seccion
    ADD CONSTRAINT menu_seccion_pkey PRIMARY KEY (id_seccion);


--
-- TOC entry 4693 (class 2606 OID 32176)
-- Name: miembros miembros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.miembros
    ADD CONSTRAINT miembros_pkey PRIMARY KEY (id);


--
-- TOC entry 4712 (class 2606 OID 93178)
-- Name: modelo_plan_contable modelo_plan_contable_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modelo_plan_contable
    ADD CONSTRAINT modelo_plan_contable_codigo_key UNIQUE (codigo);


--
-- TOC entry 4714 (class 2606 OID 93176)
-- Name: modelo_plan_contable modelo_plan_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modelo_plan_contable
    ADD CONSTRAINT modelo_plan_contable_pkey PRIMARY KEY (id_modelo_plan_contable);


--
-- TOC entry 4634 (class 2606 OID 18524)
-- Name: moneda moneda_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moneda
    ADD CONSTRAINT moneda_codigo_key UNIQUE (codigo);


--
-- TOC entry 4636 (class 2606 OID 18522)
-- Name: moneda moneda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moneda
    ADD CONSTRAINT moneda_pkey PRIMARY KEY (id_moneda);


--
-- TOC entry 4871 (class 2606 OID 99359)
-- Name: movimiento_bancario movimiento_bancario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_bancario
    ADD CONSTRAINT movimiento_bancario_pkey PRIMARY KEY (id_movimiento_bancario);


--
-- TOC entry 4903 (class 2606 OID 99558)
-- Name: movimiento_centro_costo movimiento_centro_costo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_centro_costo
    ADD CONSTRAINT movimiento_centro_costo_pkey PRIMARY KEY (id_movimiento_centro_costo);


--
-- TOC entry 4783 (class 2606 OID 98902)
-- Name: movimiento_contable movimiento_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_contable
    ADD CONSTRAINT movimiento_contable_pkey PRIMARY KEY (id_movimiento_contable);


--
-- TOC entry 4923 (class 2606 OID 106383)
-- Name: movimiento_cuenta movimiento_cuenta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_cuenta
    ADD CONSTRAINT movimiento_cuenta_pkey PRIMARY KEY (id_movimiento_cuenta);


--
-- TOC entry 4876 (class 2606 OID 99388)
-- Name: movimiento_inventario movimiento_inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_pkey PRIMARY KEY (id_movimiento_inventario);


--
-- TOC entry 4892 (class 2606 OID 99498)
-- Name: nota_credito_linea nota_credito_linea_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_credito_linea
    ADD CONSTRAINT nota_credito_linea_pkey PRIMARY KEY (id_nota_credito_linea);


--
-- TOC entry 4888 (class 2606 OID 99467)
-- Name: nota_credito nota_credito_numero_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_credito
    ADD CONSTRAINT nota_credito_numero_unique UNIQUE (id_empresa, numero_nota);


--
-- TOC entry 4890 (class 2606 OID 99465)
-- Name: nota_credito nota_credito_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_credito
    ADD CONSTRAINT nota_credito_pkey PRIMARY KEY (id_nota_credito);


--
-- TOC entry 4861 (class 2606 OID 99305)
-- Name: pago_factura pago_factura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago_factura
    ADD CONSTRAINT pago_factura_pkey PRIMARY KEY (id_pago_factura);


--
-- TOC entry 4863 (class 2606 OID 99307)
-- Name: pago_factura pago_factura_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago_factura
    ADD CONSTRAINT pago_factura_unique UNIQUE (id_pago, id_factura);


--
-- TOC entry 4857 (class 2606 OID 99273)
-- Name: pago pago_numero_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_numero_unique UNIQUE (id_empresa, numero_pago);


--
-- TOC entry 4859 (class 2606 OID 99271)
-- Name: pago pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (id_pago);


--
-- TOC entry 4638 (class 2606 OID 18534)
-- Name: pais pais_codigo_iso_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pais
    ADD CONSTRAINT pais_codigo_iso_key UNIQUE (codigo_iso);


--
-- TOC entry 4640 (class 2606 OID 18532)
-- Name: pais pais_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pais
    ADD CONSTRAINT pais_nombre_key UNIQUE (nombre);


--
-- TOC entry 4642 (class 2606 OID 18530)
-- Name: pais pais_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pais
    ADD CONSTRAINT pais_pkey PRIMARY KEY (id_pais);


--
-- TOC entry 4613 (class 2606 OID 32183)
-- Name: perfil perfil_empresa_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil
    ADD CONSTRAINT perfil_empresa_nombre_key UNIQUE (id_empresa, nombre);


--
-- TOC entry 4695 (class 2606 OID 46554)
-- Name: perfil_menu_permiso perfil_menu_permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_menu_permiso
    ADD CONSTRAINT perfil_menu_permiso_pkey PRIMARY KEY (id_perfil, id_item);


--
-- TOC entry 4615 (class 2606 OID 17339)
-- Name: perfil perfil_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil
    ADD CONSTRAINT perfil_pkey PRIMARY KEY (id_perfil);


--
-- TOC entry 4725 (class 2606 OID 93233)
-- Name: periodo_contable periodo_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.periodo_contable
    ADD CONSTRAINT periodo_contable_pkey PRIMARY KEY (id_periodo_contable);


--
-- TOC entry 4727 (class 2606 OID 93235)
-- Name: periodo_contable periodo_contable_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.periodo_contable
    ADD CONSTRAINT periodo_contable_unique UNIQUE (id_empresa, "año", mes);


--
-- TOC entry 4716 (class 2606 OID 93189)
-- Name: plan_contable plan_contable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_contable
    ADD CONSTRAINT plan_contable_pkey PRIMARY KEY (id_plan_contable);


--
-- TOC entry 4845 (class 2606 OID 99227)
-- Name: prefactura_factura prefactura_factura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura_factura
    ADD CONSTRAINT prefactura_factura_pkey PRIMARY KEY (id_prefactura_factura);


--
-- TOC entry 4847 (class 2606 OID 99229)
-- Name: prefactura_factura prefactura_factura_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura_factura
    ADD CONSTRAINT prefactura_factura_unique UNIQUE (id_prefactura, id_factura);


--
-- TOC entry 4835 (class 2606 OID 99184)
-- Name: prefactura_linea prefactura_linea_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura_linea
    ADD CONSTRAINT prefactura_linea_pkey PRIMARY KEY (id_prefactura_linea);


--
-- TOC entry 4829 (class 2606 OID 99143)
-- Name: prefactura prefactura_numero_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura
    ADD CONSTRAINT prefactura_numero_unique UNIQUE (id_empresa, numero_prefactura);


--
-- TOC entry 4831 (class 2606 OID 99141)
-- Name: prefactura prefactura_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura
    ADD CONSTRAINT prefactura_pkey PRIMARY KEY (id_prefactura);


--
-- TOC entry 4884 (class 2606 OID 99442)
-- Name: presupuesto_linea presupuesto_linea_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presupuesto_linea
    ADD CONSTRAINT presupuesto_linea_pkey PRIMARY KEY (id_presupuesto_linea);


--
-- TOC entry 4880 (class 2606 OID 99416)
-- Name: presupuesto presupuesto_numero_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presupuesto
    ADD CONSTRAINT presupuesto_numero_unique UNIQUE (id_empresa, numero_presupuesto);


--
-- TOC entry 4882 (class 2606 OID 99414)
-- Name: presupuesto presupuesto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presupuesto
    ADD CONSTRAINT presupuesto_pkey PRIMARY KEY (id_presupuesto);


--
-- TOC entry 4644 (class 2606 OID 18554)
-- Name: provincia provincia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincia
    ADD CONSTRAINT provincia_pkey PRIMARY KEY (id_provincia);


--
-- TOC entry 5013 (class 2606 OID 221164)
-- Name: recepcion_detalle recepcion_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcion_detalle
    ADD CONSTRAINT recepcion_detalle_pkey PRIMARY KEY (id_recepcion_detalle);


--
-- TOC entry 5011 (class 2606 OID 221150)
-- Name: recepcion recepcion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcion
    ADD CONSTRAINT recepcion_pkey PRIMARY KEY (id_recepcion);


--
-- TOC entry 4896 (class 2606 OID 99517)
-- Name: retencion retencion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.retencion
    ADD CONSTRAINT retencion_pkey PRIMARY KEY (id_retencion);


--
-- TOC entry 4789 (class 2606 OID 98952)
-- Name: saldo_cuenta saldo_cuenta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saldo_cuenta
    ADD CONSTRAINT saldo_cuenta_pkey PRIMARY KEY (id_saldo_cuenta);


--
-- TOC entry 4791 (class 2606 OID 98954)
-- Name: saldo_cuenta saldo_cuenta_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saldo_cuenta
    ADD CONSTRAINT saldo_cuenta_unique UNIQUE (id_cuenta_contable, id_periodo_contable);


--
-- TOC entry 4964 (class 2606 OID 216434)
-- Name: secuencia_asiento secuencia_asiento_empresa_id_prefijo_diario_anio_mes_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secuencia_asiento
    ADD CONSTRAINT secuencia_asiento_empresa_id_prefijo_diario_anio_mes_key UNIQUE (empresa_id, prefijo_diario, anio, mes);


--
-- TOC entry 4966 (class 2606 OID 216432)
-- Name: secuencia_asiento secuencia_asiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secuencia_asiento
    ADD CONSTRAINT secuencia_asiento_pkey PRIMARY KEY (id);


--
-- TOC entry 4655 (class 2606 OID 18620)
-- Name: social_network social_network_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_network
    ADD CONSTRAINT social_network_nombre_key UNIQUE (nombre);


--
-- TOC entry 4657 (class 2606 OID 18618)
-- Name: social_network social_network_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_network
    ADD CONSTRAINT social_network_pkey PRIMARY KEY (id_red_social);


--
-- TOC entry 4985 (class 2606 OID 220954)
-- Name: stock_item_almacen stock_item_almacen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_item_almacen
    ADD CONSTRAINT stock_item_almacen_pkey PRIMARY KEY (id_stock_producto_almacen);


--
-- TOC entry 4611 (class 2606 OID 17288)
-- Name: sucursal sucursal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursal
    ADD CONSTRAINT sucursal_pkey PRIMARY KEY (id_sucursal);


--
-- TOC entry 4687 (class 2606 OID 22142)
-- Name: tercero tercero_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT tercero_pkey PRIMARY KEY (id_tercero);


--
-- TOC entry 4906 (class 2606 OID 99575)
-- Name: tipo_cambio tipo_cambio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_cambio
    ADD CONSTRAINT tipo_cambio_pkey PRIMARY KEY (id_tipo_cambio);


--
-- TOC entry 4908 (class 2606 OID 99577)
-- Name: tipo_cambio tipo_cambio_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_cambio
    ADD CONSTRAINT tipo_cambio_unique UNIQUE (id_empresa, id_moneda_origen, id_moneda_destino, fecha_cambio);


--
-- TOC entry 5031 (class 2606 OID 222453)
-- Name: tipo_control_caducidad_item tipo_control_caducidad_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_control_caducidad_item
    ADD CONSTRAINT tipo_control_caducidad_item_pkey PRIMARY KEY (id_tipo_control_caducidad);


--
-- TOC entry 4648 (class 2606 OID 18577)
-- Name: tipo_entidad_comercial tipo_entidad_comercial_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_entidad_comercial
    ADD CONSTRAINT tipo_entidad_comercial_nombre_key UNIQUE (nombre);


--
-- TOC entry 4650 (class 2606 OID 18575)
-- Name: tipo_entidad_comercial tipo_entidad_comercial_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_entidad_comercial
    ADD CONSTRAINT tipo_entidad_comercial_pkey PRIMARY KEY (id_tipo_entidad);


--
-- TOC entry 5037 (class 2606 OID 222473)
-- Name: tipo_item_catalogo tipo_item_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_item_catalogo
    ADD CONSTRAINT tipo_item_catalogo_pkey PRIMARY KEY (id_tipo_item);


--
-- TOC entry 4670 (class 2606 OID 22064)
-- Name: tipo_tercero_catalogo tipo_tercero_catalogo_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_tercero_catalogo
    ADD CONSTRAINT tipo_tercero_catalogo_nombre_key UNIQUE (nombre);


--
-- TOC entry 4672 (class 2606 OID 22062)
-- Name: tipo_tercero_catalogo tipo_tercero_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_tercero_catalogo
    ADD CONSTRAINT tipo_tercero_catalogo_pkey PRIMARY KEY (id_tipo_tercero);


--
-- TOC entry 4970 (class 2606 OID 219812)
-- Name: tipo_unidad_medida tipo_unidad_medida_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_unidad_medida
    ADD CONSTRAINT tipo_unidad_medida_codigo_key UNIQUE (codigo);


--
-- TOC entry 4972 (class 2606 OID 219810)
-- Name: tipo_unidad_medida tipo_unidad_medida_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_unidad_medida
    ADD CONSTRAINT tipo_unidad_medida_pkey PRIMARY KEY (id_tipo_unidad);


--
-- TOC entry 4691 (class 2606 OID 32165)
-- Name: tipos_miembro tipos_miembro_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_miembro
    ADD CONSTRAINT tipos_miembro_pkey PRIMARY KEY (id);


--
-- TOC entry 4913 (class 2606 OID 106305)
-- Name: titular_cuenta titular_cuenta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titular_cuenta
    ADD CONSTRAINT titular_cuenta_pkey PRIMARY KEY (id_titular_cuenta);


--
-- TOC entry 5003 (class 2606 OID 221080)
-- Name: transferencia_stock_detalle transferencia_stock_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencia_stock_detalle
    ADD CONSTRAINT transferencia_stock_detalle_pkey PRIMARY KEY (id_transferencia_stock_detalle);


--
-- TOC entry 5001 (class 2606 OID 221060)
-- Name: transferencia_stock transferencia_stock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencia_stock
    ADD CONSTRAINT transferencia_stock_pkey PRIMARY KEY (id_transferencia_stock);


--
-- TOC entry 4646 (class 2606 OID 18556)
-- Name: provincia uix_provincia_pais_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincia
    ADD CONSTRAINT uix_provincia_pais_nombre UNIQUE (id_pais, nombre);


--
-- TOC entry 4974 (class 2606 OID 219822)
-- Name: unidad_medida unidad_medida_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unidad_medida
    ADD CONSTRAINT unidad_medida_codigo_key UNIQUE (codigo);


--
-- TOC entry 4976 (class 2606 OID 219820)
-- Name: unidad_medida unidad_medida_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unidad_medida
    ADD CONSTRAINT unidad_medida_pkey PRIMARY KEY (id_unidad);


--
-- TOC entry 4981 (class 2606 OID 222395)
-- Name: almacen uq_almacen_empresa_ref; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.almacen
    ADD CONSTRAINT uq_almacen_empresa_ref UNIQUE (id_empresa, almacen_ref);


--
-- TOC entry 5017 (class 2606 OID 222366)
-- Name: categoria_item uq_categoria_item_empresa_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_item
    ADD CONSTRAINT uq_categoria_item_empresa_nombre UNIQUE (id_empresa, nombre);


--
-- TOC entry 5045 (class 2606 OID 222495)
-- Name: duracion_unidad_catalogo uq_duracion_unidad_catalogo_codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.duracion_unidad_catalogo
    ADD CONSTRAINT uq_duracion_unidad_catalogo_codigo UNIQUE (codigo);


--
-- TOC entry 5047 (class 2606 OID 222497)
-- Name: duracion_unidad_catalogo uq_duracion_unidad_catalogo_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.duracion_unidad_catalogo
    ADD CONSTRAINT uq_duracion_unidad_catalogo_nombre UNIQUE (nombre);


--
-- TOC entry 4668 (class 2606 OID 18695)
-- Name: empresa_horario_apertura uq_empresa_dia; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_horario_apertura
    ADD CONSTRAINT uq_empresa_dia UNIQUE (id_empresa, dia);


--
-- TOC entry 5027 (class 2606 OID 222430)
-- Name: estado_compra_item uq_estado_compra_item_codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_compra_item
    ADD CONSTRAINT uq_estado_compra_item_codigo UNIQUE (codigo);


--
-- TOC entry 5029 (class 2606 OID 222432)
-- Name: estado_compra_item uq_estado_compra_item_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_compra_item
    ADD CONSTRAINT uq_estado_compra_item_nombre UNIQUE (nombre);


--
-- TOC entry 5021 (class 2606 OID 222415)
-- Name: estado_venta_item uq_estado_venta_item_codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_venta_item
    ADD CONSTRAINT uq_estado_venta_item_codigo UNIQUE (codigo);


--
-- TOC entry 5023 (class 2606 OID 222417)
-- Name: estado_venta_item uq_estado_venta_item_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_venta_item
    ADD CONSTRAINT uq_estado_venta_item_nombre UNIQUE (nombre);


--
-- TOC entry 4993 (class 2606 OID 222397)
-- Name: item_lote_serie uq_lote_item; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_lote_serie
    ADD CONSTRAINT uq_lote_item UNIQUE (id_empresa, id_item, id_almacen, codigo_lote_serie);


--
-- TOC entry 4987 (class 2606 OID 220956)
-- Name: stock_item_almacen uq_stock_item_almacen; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_item_almacen
    ADD CONSTRAINT uq_stock_item_almacen UNIQUE (id_item, id_almacen);


--
-- TOC entry 5033 (class 2606 OID 222455)
-- Name: tipo_control_caducidad_item uq_tipo_control_caducidad_item_codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_control_caducidad_item
    ADD CONSTRAINT uq_tipo_control_caducidad_item_codigo UNIQUE (codigo);


--
-- TOC entry 5035 (class 2606 OID 222457)
-- Name: tipo_control_caducidad_item uq_tipo_control_caducidad_item_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_control_caducidad_item
    ADD CONSTRAINT uq_tipo_control_caducidad_item_nombre UNIQUE (nombre);


--
-- TOC entry 5039 (class 2606 OID 222475)
-- Name: tipo_item_catalogo uq_tipo_item_catalogo_codigo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_item_catalogo
    ADD CONSTRAINT uq_tipo_item_catalogo_codigo UNIQUE (codigo);


--
-- TOC entry 5041 (class 2606 OID 222477)
-- Name: tipo_item_catalogo uq_tipo_item_catalogo_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_item_catalogo
    ADD CONSTRAINT uq_tipo_item_catalogo_nombre UNIQUE (nombre);


--
-- TOC entry 4617 (class 2606 OID 17357)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4619 (class 2606 OID 17359)
-- Name: usuario usuario_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_username_key UNIQUE (username);


--
-- TOC entry 4605 (class 2606 OID 17265)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4596 (class 2606 OID 17035)
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- TOC entry 4593 (class 2606 OID 17004)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4700 (class 2606 OID 119664)
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- TOC entry 4521 (class 2606 OID 16552)
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- TOC entry 4925 (class 2606 OID 119640)
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- TOC entry 4531 (class 2606 OID 16593)
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- TOC entry 4533 (class 2606 OID 16591)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4529 (class 2606 OID 16569)
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- TOC entry 4698 (class 2606 OID 53206)
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- TOC entry 4602 (class 2606 OID 17094)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- TOC entry 4600 (class 2606 OID 17079)
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- TOC entry 4928 (class 2606 OID 119650)
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- TOC entry 4516 (class 1259 OID 16530)
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- TOC entry 4490 (class 1259 OID 16746)
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4949 (class 1259 OID 211974)
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- TOC entry 4950 (class 1259 OID 211973)
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- TOC entry 4951 (class 1259 OID 211971)
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- TOC entry 4956 (class 1259 OID 211972)
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- TOC entry 4491 (class 1259 OID 16748)
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4492 (class 1259 OID 16749)
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4549 (class 1259 OID 16827)
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- TOC entry 4582 (class 1259 OID 16935)
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- TOC entry 4537 (class 1259 OID 16915)
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- TOC entry 5892 (class 0 OID 0)
-- Dependencies: 4537
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- TOC entry 4542 (class 1259 OID 16743)
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- TOC entry 4585 (class 1259 OID 16932)
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- TOC entry 4929 (class 1259 OID 144212)
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- TOC entry 4586 (class 1259 OID 16933)
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- TOC entry 4557 (class 1259 OID 16938)
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- TOC entry 4554 (class 1259 OID 16799)
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- TOC entry 4555 (class 1259 OID 16944)
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- TOC entry 4749 (class 1259 OID 94245)
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- TOC entry 4702 (class 1259 OID 78690)
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- TOC entry 4756 (class 1259 OID 94271)
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- TOC entry 4757 (class 1259 OID 94269)
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- TOC entry 4762 (class 1259 OID 94270)
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- TOC entry 4589 (class 1259 OID 16991)
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- TOC entry 4590 (class 1259 OID 16990)
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- TOC entry 4591 (class 1259 OID 16992)
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- TOC entry 4493 (class 1259 OID 16750)
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4494 (class 1259 OID 16747)
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4503 (class 1259 OID 16513)
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- TOC entry 4504 (class 1259 OID 16514)
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- TOC entry 4505 (class 1259 OID 16742)
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- TOC entry 4508 (class 1259 OID 16829)
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- TOC entry 4511 (class 1259 OID 16934)
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- TOC entry 4576 (class 1259 OID 16871)
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- TOC entry 4577 (class 1259 OID 16936)
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- TOC entry 4578 (class 1259 OID 16886)
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- TOC entry 4581 (class 1259 OID 16885)
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- TOC entry 4543 (class 1259 OID 16937)
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- TOC entry 4544 (class 1259 OID 94283)
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- TOC entry 4547 (class 1259 OID 16828)
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- TOC entry 4568 (class 1259 OID 16853)
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- TOC entry 4571 (class 1259 OID 16852)
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- TOC entry 4566 (class 1259 OID 16838)
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- TOC entry 4567 (class 1259 OID 78669)
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- TOC entry 4556 (class 1259 OID 16997)
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- TOC entry 4548 (class 1259 OID 16826)
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- TOC entry 4495 (class 1259 OID 16906)
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- TOC entry 5893 (class 0 OID 0)
-- Dependencies: 4495
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- TOC entry 4496 (class 1259 OID 16744)
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- TOC entry 4497 (class 1259 OID 16503)
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- TOC entry 4498 (class 1259 OID 16961)
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- TOC entry 4979 (class 1259 OID 222393)
-- Name: idx_almacen_id_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_almacen_id_empresa ON public.almacen USING btree (id_empresa);


--
-- TOC entry 4779 (class 1259 OID 99621)
-- Name: idx_asiento_contable_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_asiento_contable_empresa ON public.asiento_contable USING btree (id_empresa);


--
-- TOC entry 4780 (class 1259 OID 99620)
-- Name: idx_asiento_contable_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_asiento_contable_fecha ON public.asiento_contable USING btree (fecha_asiento);


--
-- TOC entry 4901 (class 1259 OID 99642)
-- Name: idx_centro_costo_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_centro_costo_empresa ON public.centro_costo USING btree (id_empresa);


--
-- TOC entry 4911 (class 1259 OID 99644)
-- Name: idx_cierre_contable_periodo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cierre_contable_periodo ON public.cierre_contable USING btree (id_periodo_contable);


--
-- TOC entry 4934 (class 1259 OID 218668)
-- Name: idx_contacto_direccion_id_provincia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contacto_direccion_id_provincia ON public.contacto_direccion USING btree (id_provincia);


--
-- TOC entry 4815 (class 1259 OID 99645)
-- Name: idx_cotizacion_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_empresa ON public.cotizacion USING btree (id_empresa);


--
-- TOC entry 4816 (class 1259 OID 99648)
-- Name: idx_cotizacion_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_estado ON public.cotizacion USING btree (estado);


--
-- TOC entry 4817 (class 1259 OID 99647)
-- Name: idx_cotizacion_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_fecha ON public.cotizacion USING btree (fecha_cotizacion);


--
-- TOC entry 4821 (class 1259 OID 99649)
-- Name: idx_cotizacion_linea_cotizacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_linea_cotizacion ON public.cotizacion_linea USING btree (id_cotizacion);


--
-- TOC entry 4822 (class 1259 OID 99650)
-- Name: idx_cotizacion_linea_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_linea_item ON public.cotizacion_linea USING btree (id_item);


--
-- TOC entry 4840 (class 1259 OID 99658)
-- Name: idx_cotizacion_prefactura_cotizacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_prefactura_cotizacion ON public.cotizacion_prefactura USING btree (id_cotizacion);


--
-- TOC entry 4841 (class 1259 OID 99659)
-- Name: idx_cotizacion_prefactura_prefactura; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_prefactura_prefactura ON public.cotizacion_prefactura USING btree (id_prefactura);


--
-- TOC entry 4818 (class 1259 OID 99646)
-- Name: idx_cotizacion_tercero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cotizacion_tercero ON public.cotizacion USING btree (id_tercero);


--
-- TOC entry 4721 (class 1259 OID 99618)
-- Name: idx_cuenta_contable_codigo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cuenta_contable_codigo ON public.cuenta_contable USING btree (codigo);


--
-- TOC entry 4748 (class 1259 OID 221210)
-- Name: idx_cuenta_contable_item_id_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cuenta_contable_item_id_item ON public.cuenta_contable_item USING btree (id_item);


--
-- TOC entry 4722 (class 1259 OID 99619)
-- Name: idx_cuenta_contable_plan; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cuenta_contable_plan ON public.cuenta_contable USING btree (id_plan_contable);


--
-- TOC entry 4916 (class 1259 OID 106374)
-- Name: idx_cuenta_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cuenta_estado ON public.cuenta_financiera USING btree (estado_cuenta);


--
-- TOC entry 4917 (class 1259 OID 106372)
-- Name: idx_cuenta_moneda; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cuenta_moneda ON public.cuenta_financiera USING btree (id_moneda);


--
-- TOC entry 4918 (class 1259 OID 106373)
-- Name: idx_cuenta_titular; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cuenta_titular ON public.cuenta_financiera USING btree (id_titular_cuenta);


--
-- TOC entry 4796 (class 1259 OID 99624)
-- Name: idx_documento_origen_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documento_origen_empresa ON public.documento_origen USING btree (id_empresa);


--
-- TOC entry 5006 (class 1259 OID 221193)
-- Name: idx_envio_tercero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_envio_tercero ON public.envio USING btree (id_tercero);


--
-- TOC entry 4660 (class 1259 OID 18649)
-- Name: idx_ers_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ers_empresa ON public.empresa_red_social USING btree (id_empresa);


--
-- TOC entry 4661 (class 1259 OID 18650)
-- Name: idx_ers_red_social; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ers_red_social ON public.empresa_red_social USING btree (id_red_social);


--
-- TOC entry 4805 (class 1259 OID 99625)
-- Name: idx_factura_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_factura_empresa ON public.factura USING btree (id_empresa);


--
-- TOC entry 4806 (class 1259 OID 99628)
-- Name: idx_factura_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_factura_estado ON public.factura USING btree (estado);


--
-- TOC entry 4807 (class 1259 OID 99627)
-- Name: idx_factura_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_factura_fecha ON public.factura USING btree (fecha_factura);


--
-- TOC entry 4808 (class 1259 OID 99626)
-- Name: idx_factura_tercero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_factura_tercero ON public.factura USING btree (id_tercero);


--
-- TOC entry 4850 (class 1259 OID 99664)
-- Name: idx_historial_conversion_destino; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_conversion_destino ON public.historial_conversion USING btree (tipo_destino, id_documento_destino);


--
-- TOC entry 4851 (class 1259 OID 99662)
-- Name: idx_historial_conversion_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_conversion_empresa ON public.historial_conversion USING btree (id_empresa);


--
-- TOC entry 4852 (class 1259 OID 99663)
-- Name: idx_historial_conversion_origen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_conversion_origen ON public.historial_conversion USING btree (tipo_origen, id_documento_origen);


--
-- TOC entry 4994 (class 1259 OID 221191)
-- Name: idx_inventario_almacen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventario_almacen ON public.inventario USING btree (id_almacen);


--
-- TOC entry 4997 (class 1259 OID 221192)
-- Name: idx_inventario_detalle_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventario_detalle_item ON public.inventario_detalle USING btree (id_item);


--
-- TOC entry 4935 (class 1259 OID 222385)
-- Name: idx_item_almacen_defecto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_almacen_defecto ON public.item USING btree (id_almacen_defecto);


--
-- TOC entry 4936 (class 1259 OID 222384)
-- Name: idx_item_categoria; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_categoria ON public.item USING btree (id_categoria_item);


--
-- TOC entry 4937 (class 1259 OID 222386)
-- Name: idx_item_codigo_barras; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_codigo_barras ON public.item USING btree (codigo_barras);


--
-- TOC entry 4938 (class 1259 OID 208603)
-- Name: idx_item_id_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_id_empresa ON public.item USING btree (id_empresa);


--
-- TOC entry 4939 (class 1259 OID 221238)
-- Name: idx_item_id_unidad_longitud; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_id_unidad_longitud ON public.item USING btree (id_unidad_longitud);


--
-- TOC entry 4940 (class 1259 OID 221236)
-- Name: idx_item_id_unidad_medida; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_id_unidad_medida ON public.item USING btree (id_unidad_medida);


--
-- TOC entry 4941 (class 1259 OID 221237)
-- Name: idx_item_id_unidad_peso; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_id_unidad_peso ON public.item USING btree (id_unidad_peso);


--
-- TOC entry 4942 (class 1259 OID 221239)
-- Name: idx_item_id_unidad_superficie; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_id_unidad_superficie ON public.item USING btree (id_unidad_superficie);


--
-- TOC entry 4943 (class 1259 OID 221240)
-- Name: idx_item_id_unidad_volumen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_id_unidad_volumen ON public.item USING btree (id_unidad_volumen);


--
-- TOC entry 4988 (class 1259 OID 221189)
-- Name: idx_item_lote_almacen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_lote_almacen ON public.item_lote_serie USING btree (id_almacen);


--
-- TOC entry 4944 (class 1259 OID 208604)
-- Name: idx_item_producto_ref; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_producto_ref ON public.item USING btree (producto_ref);


--
-- TOC entry 4945 (class 1259 OID 215310)
-- Name: idx_item_tipo_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_tipo_item ON public.item USING btree (tipo_item);


--
-- TOC entry 4989 (class 1259 OID 221188)
-- Name: idx_lote_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lote_item ON public.item_lote_serie USING btree (id_item);


--
-- TOC entry 4957 (class 1259 OID 213089)
-- Name: idx_media_module; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_module ON public.media USING btree (module);


--
-- TOC entry 4958 (class 1259 OID 213090)
-- Name: idx_media_module_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_module_id ON public.media USING btree (module_id);


--
-- TOC entry 4959 (class 1259 OID 213091)
-- Name: idx_media_module_module_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_media_module_module_id ON public.media USING btree (module, module_id);


--
-- TOC entry 4624 (class 1259 OID 85337)
-- Name: idx_menu_item_created_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_menu_item_created_by ON public.menu_item USING btree (created_by);


--
-- TOC entry 4625 (class 1259 OID 85335)
-- Name: idx_menu_item_es_clickable; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_menu_item_es_clickable ON public.menu_item USING btree (es_clickable);


--
-- TOC entry 4626 (class 1259 OID 85336)
-- Name: idx_menu_item_muestra_badge; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_menu_item_muestra_badge ON public.menu_item USING btree (muestra_badge);


--
-- TOC entry 4627 (class 1259 OID 17402)
-- Name: idx_menu_item_parent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_menu_item_parent ON public.menu_item USING btree (parent_id);


--
-- TOC entry 4628 (class 1259 OID 17403)
-- Name: idx_menu_item_seccion_orden; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_menu_item_seccion_orden ON public.menu_item USING btree (id_seccion, orden);


--
-- TOC entry 4921 (class 1259 OID 106394)
-- Name: idx_mov_empresa_cuenta_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mov_empresa_cuenta_fecha ON public.movimiento_cuenta USING btree (id_empresa, id_cuenta_financiera, fecha_movimiento);


--
-- TOC entry 4868 (class 1259 OID 99632)
-- Name: idx_movimiento_bancario_cuenta; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_bancario_cuenta ON public.movimiento_bancario USING btree (id_cuenta_bancaria);


--
-- TOC entry 4869 (class 1259 OID 99633)
-- Name: idx_movimiento_bancario_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_bancario_fecha ON public.movimiento_bancario USING btree (fecha_movimiento);


--
-- TOC entry 4781 (class 1259 OID 99622)
-- Name: idx_movimiento_contable_asiento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_contable_asiento ON public.movimiento_contable USING btree (id_asiento_contable);


--
-- TOC entry 4872 (class 1259 OID 221190)
-- Name: idx_movimiento_inventario_almacen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_inventario_almacen ON public.movimiento_inventario USING btree (id_almacen);


--
-- TOC entry 4873 (class 1259 OID 99635)
-- Name: idx_movimiento_inventario_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_inventario_fecha ON public.movimiento_inventario USING btree (fecha_movimiento);


--
-- TOC entry 4874 (class 1259 OID 99634)
-- Name: idx_movimiento_inventario_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movimiento_inventario_item ON public.movimiento_inventario USING btree (id_item);


--
-- TOC entry 4885 (class 1259 OID 99638)
-- Name: idx_nota_credito_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nota_credito_empresa ON public.nota_credito USING btree (id_empresa);


--
-- TOC entry 4886 (class 1259 OID 99639)
-- Name: idx_nota_credito_factura; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nota_credito_factura ON public.nota_credito USING btree (id_factura);


--
-- TOC entry 4853 (class 1259 OID 99629)
-- Name: idx_pago_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pago_empresa ON public.pago USING btree (id_empresa);


--
-- TOC entry 4854 (class 1259 OID 99631)
-- Name: idx_pago_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pago_fecha ON public.pago USING btree (fecha_pago);


--
-- TOC entry 4855 (class 1259 OID 99630)
-- Name: idx_pago_tercero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pago_tercero ON public.pago USING btree (id_tercero);


--
-- TOC entry 4723 (class 1259 OID 99623)
-- Name: idx_periodo_contable_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_periodo_contable_empresa ON public.periodo_contable USING btree (id_empresa);


--
-- TOC entry 4823 (class 1259 OID 99653)
-- Name: idx_prefactura_cotizacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_cotizacion ON public.prefactura USING btree (id_cotizacion);


--
-- TOC entry 4824 (class 1259 OID 99651)
-- Name: idx_prefactura_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_empresa ON public.prefactura USING btree (id_empresa);


--
-- TOC entry 4825 (class 1259 OID 99655)
-- Name: idx_prefactura_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_estado ON public.prefactura USING btree (estado);


--
-- TOC entry 4842 (class 1259 OID 99661)
-- Name: idx_prefactura_factura_factura; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_factura_factura ON public.prefactura_factura USING btree (id_factura);


--
-- TOC entry 4843 (class 1259 OID 99660)
-- Name: idx_prefactura_factura_prefactura; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_factura_prefactura ON public.prefactura_factura USING btree (id_prefactura);


--
-- TOC entry 4826 (class 1259 OID 99654)
-- Name: idx_prefactura_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_fecha ON public.prefactura USING btree (fecha_prefactura);


--
-- TOC entry 4832 (class 1259 OID 99657)
-- Name: idx_prefactura_linea_cotizacion_linea; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_linea_cotizacion_linea ON public.prefactura_linea USING btree (id_cotizacion_linea);


--
-- TOC entry 4833 (class 1259 OID 99656)
-- Name: idx_prefactura_linea_prefactura; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_linea_prefactura ON public.prefactura_linea USING btree (id_prefactura);


--
-- TOC entry 4827 (class 1259 OID 99652)
-- Name: idx_prefactura_tercero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prefactura_tercero ON public.prefactura USING btree (id_tercero);


--
-- TOC entry 4877 (class 1259 OID 99636)
-- Name: idx_presupuesto_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_presupuesto_empresa ON public.presupuesto USING btree (id_empresa);


--
-- TOC entry 4878 (class 1259 OID 99637)
-- Name: idx_presupuesto_tercero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_presupuesto_tercero ON public.presupuesto USING btree (id_tercero);


--
-- TOC entry 5009 (class 1259 OID 221194)
-- Name: idx_recepcion_tercero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recepcion_tercero ON public.recepcion USING btree (id_tercero);


--
-- TOC entry 4893 (class 1259 OID 99640)
-- Name: idx_retencion_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_retencion_empresa ON public.retencion USING btree (id_empresa);


--
-- TOC entry 4894 (class 1259 OID 99641)
-- Name: idx_retencion_tercero; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_retencion_tercero ON public.retencion USING btree (id_tercero);


--
-- TOC entry 4962 (class 1259 OID 216435)
-- Name: idx_secuencia_asiento_empresa_prefijo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_secuencia_asiento_empresa_prefijo ON public.secuencia_asiento USING btree (empresa_id, prefijo_diario, anio, mes);


--
-- TOC entry 4982 (class 1259 OID 221187)
-- Name: idx_stock_item_almacen_almacen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_item_almacen_almacen ON public.stock_item_almacen USING btree (id_almacen);


--
-- TOC entry 4983 (class 1259 OID 221186)
-- Name: idx_stock_item_almacen_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_item_almacen_item ON public.stock_item_almacen USING btree (id_item);


--
-- TOC entry 4685 (class 1259 OID 218662)
-- Name: idx_tercero_id_provincia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tercero_id_provincia ON public.tercero USING btree (id_provincia);


--
-- TOC entry 4904 (class 1259 OID 99643)
-- Name: idx_tipo_cambio_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tipo_cambio_fecha ON public.tipo_cambio USING btree (fecha_cambio);


--
-- TOC entry 4664 (class 1259 OID 18685)
-- Name: uk_contable_externo_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uk_contable_externo_empresa ON public.contable_externo USING btree (id_empresa);


--
-- TOC entry 4653 (class 1259 OID 18607)
-- Name: uk_empresa_identificacion_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uk_empresa_identificacion_empresa ON public.empresa_identificacion USING btree (id_empresa);


--
-- TOC entry 4919 (class 1259 OID 106371)
-- Name: uq_cuenta_iban_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_cuenta_iban_empresa ON public.cuenta_financiera USING btree (id_empresa, numero_cuenta_iban) WHERE (numero_cuenta_iban IS NOT NULL);


--
-- TOC entry 4920 (class 1259 OID 106370)
-- Name: uq_cuenta_ref_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_cuenta_ref_empresa ON public.cuenta_financiera USING btree (id_empresa, referencia);


--
-- TOC entry 4948 (class 1259 OID 222387)
-- Name: uq_item_empresa_codigo_barras; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_item_empresa_codigo_barras ON public.item USING btree (id_empresa, codigo_barras) WHERE (codigo_barras IS NOT NULL);


--
-- TOC entry 4594 (class 1259 OID 17266)
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- TOC entry 4603 (class 1259 OID 78668)
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- TOC entry 4597 (class 1259 OID 17168)
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- TOC entry 4519 (class 1259 OID 16558)
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- TOC entry 4522 (class 1259 OID 16580)
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- TOC entry 4701 (class 1259 OID 119665)
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- TOC entry 4598 (class 1259 OID 17105)
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- TOC entry 4523 (class 1259 OID 53224)
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- TOC entry 4524 (class 1259 OID 17070)
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- TOC entry 4525 (class 1259 OID 53226)
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- TOC entry 4696 (class 1259 OID 53227)
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- TOC entry 4526 (class 1259 OID 16581)
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- TOC entry 4527 (class 1259 OID 53225)
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- TOC entry 4926 (class 1259 OID 119656)
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- TOC entry 5282 (class 2620 OID 106398)
-- Name: cuenta_financiera tg_cuenta_saldo_inicial; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_cuenta_saldo_inicial AFTER INSERT ON public.cuenta_financiera FOR EACH ROW EXECUTE FUNCTION public.trg_insertar_saldo_inicial();


--
-- TOC entry 5283 (class 2620 OID 106376)
-- Name: cuenta_financiera tg_cuenta_touch; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_cuenta_touch BEFORE UPDATE ON public.cuenta_financiera FOR EACH ROW EXECUTE FUNCTION public.trg_touch_actualizado_en();


--
-- TOC entry 5284 (class 2620 OID 106396)
-- Name: movimiento_cuenta tg_heredar_empresa_movimiento; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_heredar_empresa_movimiento BEFORE INSERT ON public.movimiento_cuenta FOR EACH ROW EXECUTE FUNCTION public.trg_heredar_empresa_movimiento();


--
-- TOC entry 5285 (class 2620 OID 208606)
-- Name: item trg_producto_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_producto_updated_at BEFORE UPDATE ON public.item FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 5279 (class 2620 OID 17124)
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- TOC entry 5274 (class 2620 OID 53234)
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- TOC entry 5275 (class 2620 OID 84228)
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- TOC entry 5276 (class 2620 OID 53220)
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- TOC entry 5277 (class 2620 OID 84227)
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- TOC entry 5280 (class 2620 OID 53230)
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- TOC entry 5281 (class 2620 OID 84229)
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- TOC entry 5278 (class 2620 OID 17058)
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- TOC entry 5050 (class 2606 OID 16730)
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5055 (class 2606 OID 16819)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 5054 (class 2606 OID 16807)
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- TOC entry 5053 (class 2606 OID 16794)
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5124 (class 2606 OID 94235)
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- TOC entry 5125 (class 2606 OID 94240)
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5126 (class 2606 OID 94264)
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- TOC entry 5127 (class 2606 OID 94259)
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5060 (class 2606 OID 16985)
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5048 (class 2606 OID 16763)
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 5057 (class 2606 OID 16866)
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 5058 (class 2606 OID 16939)
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- TOC entry 5059 (class 2606 OID 16880)
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 5051 (class 2606 OID 94278)
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- TOC entry 5052 (class 2606 OID 16758)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 5056 (class 2606 OID 16847)
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 5135 (class 2606 OID 98877)
-- Name: asiento_contable asiento_contable_id_diario_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento_contable
    ADD CONSTRAINT asiento_contable_id_diario_contable_fkey FOREIGN KEY (id_diario_contable) REFERENCES public.diario_contable(id_diario_contable) ON DELETE RESTRICT;


--
-- TOC entry 5136 (class 2606 OID 98872)
-- Name: asiento_contable asiento_contable_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento_contable
    ADD CONSTRAINT asiento_contable_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5137 (class 2606 OID 98887)
-- Name: asiento_contable asiento_contable_id_usuario_aprobacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento_contable
    ADD CONSTRAINT asiento_contable_id_usuario_aprobacion_fkey FOREIGN KEY (id_usuario_aprobacion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5138 (class 2606 OID 98882)
-- Name: asiento_contable asiento_contable_id_usuario_creacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento_contable
    ADD CONSTRAINT asiento_contable_id_usuario_creacion_fkey FOREIGN KEY (id_usuario_creacion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5139 (class 2606 OID 216418)
-- Name: asiento_contable asiento_contable_reversed_entry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asiento_contable
    ADD CONSTRAINT asiento_contable_reversed_entry_id_fkey FOREIGN KEY (reversed_entry_id) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE SET NULL;


--
-- TOC entry 5210 (class 2606 OID 99546)
-- Name: centro_costo centro_costo_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.centro_costo
    ADD CONSTRAINT centro_costo_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5216 (class 2606 OID 99603)
-- Name: cierre_contable cierre_contable_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_contable
    ADD CONSTRAINT cierre_contable_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5217 (class 2606 OID 99608)
-- Name: cierre_contable cierre_contable_id_periodo_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_contable
    ADD CONSTRAINT cierre_contable_id_periodo_contable_fkey FOREIGN KEY (id_periodo_contable) REFERENCES public.periodo_contable(id_periodo_contable) ON DELETE RESTRICT;


--
-- TOC entry 5218 (class 2606 OID 99613)
-- Name: cierre_contable cierre_contable_id_usuario_cierre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_contable
    ADD CONSTRAINT cierre_contable_id_usuario_cierre_fkey FOREIGN KEY (id_usuario_cierre) REFERENCES public.usuario(id_usuario) ON DELETE RESTRICT;


--
-- TOC entry 5128 (class 2606 OID 98812)
-- Name: cierre_cuenta cierre_cuenta_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_cuenta
    ADD CONSTRAINT cierre_cuenta_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE RESTRICT;


--
-- TOC entry 5129 (class 2606 OID 98802)
-- Name: cierre_cuenta cierre_cuenta_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_cuenta
    ADD CONSTRAINT cierre_cuenta_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5130 (class 2606 OID 98807)
-- Name: cierre_cuenta cierre_cuenta_id_periodo_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_cuenta
    ADD CONSTRAINT cierre_cuenta_id_periodo_contable_fkey FOREIGN KEY (id_periodo_contable) REFERENCES public.periodo_contable(id_periodo_contable) ON DELETE RESTRICT;


--
-- TOC entry 5131 (class 2606 OID 98817)
-- Name: cierre_cuenta cierre_cuenta_id_usuario_cierre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cierre_cuenta
    ADD CONSTRAINT cierre_cuenta_id_usuario_cierre_fkey FOREIGN KEY (id_usuario_cierre) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5184 (class 2606 OID 99335)
-- Name: conciliacion_bancaria conciliacion_bancaria_id_cuenta_bancaria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conciliacion_bancaria
    ADD CONSTRAINT conciliacion_bancaria_id_cuenta_bancaria_fkey FOREIGN KEY (id_cuenta_bancaria) REFERENCES public.cuenta_bancaria(id_cuenta_bancaria) ON DELETE RESTRICT;


--
-- TOC entry 5185 (class 2606 OID 99330)
-- Name: conciliacion_bancaria conciliacion_bancaria_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conciliacion_bancaria
    ADD CONSTRAINT conciliacion_bancaria_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5186 (class 2606 OID 99340)
-- Name: conciliacion_bancaria conciliacion_bancaria_id_periodo_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conciliacion_bancaria
    ADD CONSTRAINT conciliacion_bancaria_id_periodo_contable_fkey FOREIGN KEY (id_periodo_contable) REFERENCES public.periodo_contable(id_periodo_contable) ON DELETE RESTRICT;


--
-- TOC entry 5187 (class 2606 OID 99345)
-- Name: conciliacion_bancaria conciliacion_bancaria_id_usuario_conciliacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conciliacion_bancaria
    ADD CONSTRAINT conciliacion_bancaria_id_usuario_conciliacion_fkey FOREIGN KEY (id_usuario_conciliacion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5102 (class 2606 OID 93124)
-- Name: configuracion_contabilidad configuracion_contabilidad_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_contabilidad
    ADD CONSTRAINT configuracion_contabilidad_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5103 (class 2606 OID 93129)
-- Name: configuracion_contabilidad configuracion_contabilidad_id_moneda_base_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configuracion_contabilidad
    ADD CONSTRAINT configuracion_contabilidad_id_moneda_base_fkey FOREIGN KEY (id_moneda_base) REFERENCES public.moneda(id_moneda) ON DELETE RESTRICT;


--
-- TOC entry 5082 (class 2606 OID 18675)
-- Name: contable_externo contable_externo_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contable_externo
    ADD CONSTRAINT contable_externo_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5083 (class 2606 OID 18660)
-- Name: contable_externo contable_externo_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contable_externo
    ADD CONSTRAINT contable_externo_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE CASCADE;


--
-- TOC entry 5084 (class 2606 OID 18665)
-- Name: contable_externo contable_externo_id_pais_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contable_externo
    ADD CONSTRAINT contable_externo_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES public.pais(id_pais) ON DELETE SET NULL;


--
-- TOC entry 5085 (class 2606 OID 18670)
-- Name: contable_externo contable_externo_id_provincia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contable_externo
    ADD CONSTRAINT contable_externo_id_provincia_fkey FOREIGN KEY (id_provincia) REFERENCES public.provincia(id_provincia) ON DELETE SET NULL;


--
-- TOC entry 5086 (class 2606 OID 18680)
-- Name: contable_externo contable_externo_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contable_externo
    ADD CONSTRAINT contable_externo_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5158 (class 2606 OID 99088)
-- Name: cotizacion cotizacion_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5159 (class 2606 OID 99093)
-- Name: cotizacion cotizacion_id_tercero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_id_tercero_fkey FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE RESTRICT;


--
-- TOC entry 5160 (class 2606 OID 99103)
-- Name: cotizacion cotizacion_id_usuario_aprobacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_id_usuario_aprobacion_fkey FOREIGN KEY (id_usuario_aprobacion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5161 (class 2606 OID 99098)
-- Name: cotizacion cotizacion_id_usuario_creacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion
    ADD CONSTRAINT cotizacion_id_usuario_creacion_fkey FOREIGN KEY (id_usuario_creacion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5162 (class 2606 OID 99119)
-- Name: cotizacion_linea cotizacion_linea_id_cotizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_linea
    ADD CONSTRAINT cotizacion_linea_id_cotizacion_fkey FOREIGN KEY (id_cotizacion) REFERENCES public.cotizacion(id_cotizacion) ON DELETE RESTRICT;


--
-- TOC entry 5171 (class 2606 OID 99210)
-- Name: cotizacion_prefactura cotizacion_prefactura_id_cotizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_prefactura
    ADD CONSTRAINT cotizacion_prefactura_id_cotizacion_fkey FOREIGN KEY (id_cotizacion) REFERENCES public.cotizacion(id_cotizacion) ON DELETE RESTRICT;


--
-- TOC entry 5172 (class 2606 OID 99215)
-- Name: cotizacion_prefactura cotizacion_prefactura_id_prefactura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cotizacion_prefactura
    ADD CONSTRAINT cotizacion_prefactura_id_prefactura_fkey FOREIGN KEY (id_prefactura) REFERENCES public.prefactura(id_prefactura) ON DELETE RESTRICT;


--
-- TOC entry 5113 (class 2606 OID 93287)
-- Name: cuenta_bancaria cuenta_bancaria_id_banco_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_bancaria
    ADD CONSTRAINT cuenta_bancaria_id_banco_fkey FOREIGN KEY (id_banco) REFERENCES public.tercero(id_tercero) ON DELETE RESTRICT;


--
-- TOC entry 5114 (class 2606 OID 93297)
-- Name: cuenta_bancaria cuenta_bancaria_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_bancaria
    ADD CONSTRAINT cuenta_bancaria_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE SET NULL;


--
-- TOC entry 5115 (class 2606 OID 93282)
-- Name: cuenta_bancaria cuenta_bancaria_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_bancaria
    ADD CONSTRAINT cuenta_bancaria_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5116 (class 2606 OID 93292)
-- Name: cuenta_bancaria cuenta_bancaria_id_moneda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_bancaria
    ADD CONSTRAINT cuenta_bancaria_id_moneda_fkey FOREIGN KEY (id_moneda) REFERENCES public.moneda(id_moneda) ON DELETE RESTRICT;


--
-- TOC entry 5111 (class 2606 OID 93264)
-- Name: cuenta_contable_defecto cuenta_contable_defecto_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_defecto
    ADD CONSTRAINT cuenta_contable_defecto_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE RESTRICT;


--
-- TOC entry 5112 (class 2606 OID 93259)
-- Name: cuenta_contable_defecto cuenta_contable_defecto_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_defecto
    ADD CONSTRAINT cuenta_contable_defecto_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5107 (class 2606 OID 93220)
-- Name: cuenta_contable cuenta_contable_id_cuenta_padre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable
    ADD CONSTRAINT cuenta_contable_id_cuenta_padre_fkey FOREIGN KEY (id_cuenta_padre) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE SET NULL;


--
-- TOC entry 5108 (class 2606 OID 93215)
-- Name: cuenta_contable cuenta_contable_id_plan_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable
    ADD CONSTRAINT cuenta_contable_id_plan_contable_fkey FOREIGN KEY (id_plan_contable) REFERENCES public.plan_contable(id_plan_contable) ON DELETE RESTRICT;


--
-- TOC entry 5121 (class 2606 OID 93355)
-- Name: cuenta_contable_item cuenta_contable_item_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_item
    ADD CONSTRAINT cuenta_contable_item_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5122 (class 2606 OID 221205)
-- Name: cuenta_contable_item cuenta_contable_item_id_item_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_item
    ADD CONSTRAINT cuenta_contable_item_id_item_fkey FOREIGN KEY (id_item) REFERENCES public.item(id_item) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5123 (class 2606 OID 93360)
-- Name: cuenta_contable_item cuenta_contable_producto_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_contable_item
    ADD CONSTRAINT cuenta_contable_producto_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE RESTRICT;


--
-- TOC entry 5220 (class 2606 OID 106345)
-- Name: cuenta_financiera cuenta_financiera_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_financiera
    ADD CONSTRAINT cuenta_financiera_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa);


--
-- TOC entry 5221 (class 2606 OID 106350)
-- Name: cuenta_financiera cuenta_financiera_id_moneda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_financiera
    ADD CONSTRAINT cuenta_financiera_id_moneda_fkey FOREIGN KEY (id_moneda) REFERENCES public.moneda(id_moneda);


--
-- TOC entry 5222 (class 2606 OID 106355)
-- Name: cuenta_financiera cuenta_financiera_id_pais_cuenta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_financiera
    ADD CONSTRAINT cuenta_financiera_id_pais_cuenta_fkey FOREIGN KEY (id_pais_cuenta) REFERENCES public.pais(id_pais);


--
-- TOC entry 5223 (class 2606 OID 106360)
-- Name: cuenta_financiera cuenta_financiera_id_provincia_cuenta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_financiera
    ADD CONSTRAINT cuenta_financiera_id_provincia_cuenta_fkey FOREIGN KEY (id_provincia_cuenta) REFERENCES public.provincia(id_provincia);


--
-- TOC entry 5224 (class 2606 OID 106365)
-- Name: cuenta_financiera cuenta_financiera_id_titular_cuenta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_financiera
    ADD CONSTRAINT cuenta_financiera_id_titular_cuenta_fkey FOREIGN KEY (id_titular_cuenta) REFERENCES public.titular_cuenta(id_titular_cuenta);


--
-- TOC entry 5133 (class 2606 OID 98854)
-- Name: cuenta_grupo_personalizado cuenta_grupo_personalizado_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_grupo_personalizado
    ADD CONSTRAINT cuenta_grupo_personalizado_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE RESTRICT;


--
-- TOC entry 5134 (class 2606 OID 98849)
-- Name: cuenta_grupo_personalizado cuenta_grupo_personalizado_id_grupo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_grupo_personalizado
    ADD CONSTRAINT cuenta_grupo_personalizado_id_grupo_fkey FOREIGN KEY (id_grupo_cuenta_personalizado) REFERENCES public.grupo_cuenta_personalizado(id_grupo_cuenta_personalizado) ON DELETE RESTRICT;


--
-- TOC entry 5119 (class 2606 OID 93339)
-- Name: cuenta_impuesto cuenta_impuesto_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_impuesto
    ADD CONSTRAINT cuenta_impuesto_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE RESTRICT;


--
-- TOC entry 5120 (class 2606 OID 93334)
-- Name: cuenta_impuesto cuenta_impuesto_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_impuesto
    ADD CONSTRAINT cuenta_impuesto_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5117 (class 2606 OID 93318)
-- Name: cuenta_iva cuenta_iva_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_iva
    ADD CONSTRAINT cuenta_iva_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE RESTRICT;


--
-- TOC entry 5118 (class 2606 OID 93313)
-- Name: cuenta_iva cuenta_iva_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_iva
    ADD CONSTRAINT cuenta_iva_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5104 (class 2606 OID 93161)
-- Name: diario_contable diario_contable_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diario_contable
    ADD CONSTRAINT diario_contable_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5148 (class 2606 OID 98991)
-- Name: documento_origen documento_origen_id_asiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_origen
    ADD CONSTRAINT documento_origen_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE SET NULL;


--
-- TOC entry 5149 (class 2606 OID 98981)
-- Name: documento_origen documento_origen_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_origen
    ADD CONSTRAINT documento_origen_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5150 (class 2606 OID 98986)
-- Name: documento_origen documento_origen_id_tercero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_origen
    ADD CONSTRAINT documento_origen_id_tercero_fkey FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE SET NULL;


--
-- TOC entry 5151 (class 2606 OID 98996)
-- Name: documento_origen documento_origen_id_usuario_contabilizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documento_origen
    ADD CONSTRAINT documento_origen_id_usuario_contabilizacion_fkey FOREIGN KEY (id_usuario_contabilizacion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5087 (class 2606 OID 18701)
-- Name: empresa_horario_apertura empresa_horario_apertura_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_horario_apertura
    ADD CONSTRAINT empresa_horario_apertura_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5088 (class 2606 OID 18696)
-- Name: empresa_horario_apertura empresa_horario_apertura_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_horario_apertura
    ADD CONSTRAINT empresa_horario_apertura_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE CASCADE;


--
-- TOC entry 5089 (class 2606 OID 18706)
-- Name: empresa_horario_apertura empresa_horario_apertura_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_horario_apertura
    ADD CONSTRAINT empresa_horario_apertura_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5064 (class 2606 OID 18536)
-- Name: empresa empresa_id_moneda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_id_moneda_fkey FOREIGN KEY (id_moneda) REFERENCES public.moneda(id_moneda) ON DELETE RESTRICT;


--
-- TOC entry 5065 (class 2606 OID 18541)
-- Name: empresa empresa_id_pais_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES public.pais(id_pais) ON DELETE RESTRICT;


--
-- TOC entry 5066 (class 2606 OID 18562)
-- Name: empresa empresa_id_provincia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_id_provincia_fkey FOREIGN KEY (id_provincia) REFERENCES public.provincia(id_provincia) ON DELETE SET NULL;


--
-- TOC entry 5074 (class 2606 OID 18597)
-- Name: empresa_identificacion empresa_identificacion_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_identificacion
    ADD CONSTRAINT empresa_identificacion_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5075 (class 2606 OID 18587)
-- Name: empresa_identificacion empresa_identificacion_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_identificacion
    ADD CONSTRAINT empresa_identificacion_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE CASCADE;


--
-- TOC entry 5076 (class 2606 OID 18592)
-- Name: empresa_identificacion empresa_identificacion_id_tipo_entidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_identificacion
    ADD CONSTRAINT empresa_identificacion_id_tipo_entidad_fkey FOREIGN KEY (id_tipo_entidad) REFERENCES public.tipo_entidad_comercial(id_tipo_entidad);


--
-- TOC entry 5077 (class 2606 OID 18602)
-- Name: empresa_identificacion empresa_identificacion_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_identificacion
    ADD CONSTRAINT empresa_identificacion_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5078 (class 2606 OID 18639)
-- Name: empresa_red_social empresa_red_social_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_red_social
    ADD CONSTRAINT empresa_red_social_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5079 (class 2606 OID 18629)
-- Name: empresa_red_social empresa_red_social_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_red_social
    ADD CONSTRAINT empresa_red_social_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE CASCADE;


--
-- TOC entry 5080 (class 2606 OID 18634)
-- Name: empresa_red_social empresa_red_social_id_red_social_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_red_social
    ADD CONSTRAINT empresa_red_social_id_red_social_fkey FOREIGN KEY (id_red_social) REFERENCES public.social_network(id_red_social) ON DELETE RESTRICT;


--
-- TOC entry 5081 (class 2606 OID 18644)
-- Name: empresa_red_social empresa_red_social_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_red_social
    ADD CONSTRAINT empresa_red_social_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5153 (class 2606 OID 99042)
-- Name: factura factura_id_asiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE SET NULL;


--
-- TOC entry 5154 (class 2606 OID 99032)
-- Name: factura factura_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5155 (class 2606 OID 99037)
-- Name: factura factura_id_tercero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT factura_id_tercero_fkey FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE RESTRICT;


--
-- TOC entry 5156 (class 2606 OID 99068)
-- Name: factura_linea factura_linea_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura_linea
    ADD CONSTRAINT factura_linea_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE SET NULL;


--
-- TOC entry 5157 (class 2606 OID 99058)
-- Name: factura_linea factura_linea_id_factura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.factura_linea
    ADD CONSTRAINT factura_linea_id_factura_fkey FOREIGN KEY (id_factura) REFERENCES public.factura(id_factura) ON DELETE RESTRICT;


--
-- TOC entry 5249 (class 2606 OID 222388)
-- Name: almacen fk_almacen_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.almacen
    ADD CONSTRAINT fk_almacen_empresa FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5090 (class 2606 OID 195295)
-- Name: tercero fk_asignado_a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT fk_asignado_a FOREIGN KEY (asignado_a) REFERENCES public.tercero(id_tercero);


--
-- TOC entry 5272 (class 2606 OID 222355)
-- Name: categoria_item fk_categoria_item_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_item
    ADD CONSTRAINT fk_categoria_item_empresa FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa);


--
-- TOC entry 5273 (class 2606 OID 222360)
-- Name: categoria_item fk_categoria_item_padre; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_item
    ADD CONSTRAINT fk_categoria_item_padre FOREIGN KEY (id_categoria_padre) REFERENCES public.categoria_item(id_categoria_item);


--
-- TOC entry 5247 (class 2606 OID 219792)
-- Name: ciudad fk_ciudad_provincia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudad
    ADD CONSTRAINT fk_ciudad_provincia FOREIGN KEY (id_provincia) REFERENCES public.provincia(id_provincia) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5091 (class 2606 OID 22158)
-- Name: tercero fk_condicion_pago; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT fk_condicion_pago FOREIGN KEY (id_condicion_pago) REFERENCES public.condicion_pago_catalogo(id_condicion_pago);


--
-- TOC entry 5229 (class 2606 OID 218663)
-- Name: contacto_direccion fk_contacto_direccion_provincia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacto_direccion
    ADD CONSTRAINT fk_contacto_direccion_provincia FOREIGN KEY (id_provincia) REFERENCES public.provincia(id_provincia) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5230 (class 2606 OID 207476)
-- Name: contacto_direccion fk_contacto_tercero; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacto_direccion
    ADD CONSTRAINT fk_contacto_tercero FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE CASCADE;


--
-- TOC entry 5225 (class 2606 OID 210823)
-- Name: cuenta_financiera fk_cuenta_tercero; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_financiera
    ADD CONSTRAINT fk_cuenta_tercero FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5092 (class 2606 OID 22143)
-- Name: tercero fk_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT fk_empresa FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa);


--
-- TOC entry 5264 (class 2606 OID 221123)
-- Name: envio_detalle fk_envio_detalle_envio; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.envio_detalle
    ADD CONSTRAINT fk_envio_detalle_envio FOREIGN KEY (id_envio) REFERENCES public.envio(id_envio);


--
-- TOC entry 5265 (class 2606 OID 221128)
-- Name: envio_detalle fk_envio_detalle_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.envio_detalle
    ADD CONSTRAINT fk_envio_detalle_item FOREIGN KEY (id_item) REFERENCES public.item(id_item);


--
-- TOC entry 5266 (class 2606 OID 221133)
-- Name: envio_detalle fk_envio_detalle_lote; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.envio_detalle
    ADD CONSTRAINT fk_envio_detalle_lote FOREIGN KEY (id_lote_serie) REFERENCES public.item_lote_serie(id_lote_serie);


--
-- TOC entry 5263 (class 2606 OID 221109)
-- Name: envio fk_envio_tercero; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.envio
    ADD CONSTRAINT fk_envio_tercero FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero);


--
-- TOC entry 5093 (class 2606 OID 22163)
-- Name: tercero fk_forma_pago; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT fk_forma_pago FOREIGN KEY (id_forma_pago) REFERENCES public.forma_pago_catalogo(id_forma_pago);


--
-- TOC entry 5254 (class 2606 OID 221013)
-- Name: inventario fk_inventario_almacen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT fk_inventario_almacen FOREIGN KEY (id_almacen) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5255 (class 2606 OID 221032)
-- Name: inventario_detalle fk_inventario_detalle_inventario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_detalle
    ADD CONSTRAINT fk_inventario_detalle_inventario FOREIGN KEY (id_inventario) REFERENCES public.inventario(id_inventario);


--
-- TOC entry 5256 (class 2606 OID 221037)
-- Name: inventario_detalle fk_inventario_detalle_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_detalle
    ADD CONSTRAINT fk_inventario_detalle_item FOREIGN KEY (id_item) REFERENCES public.item(id_item);


--
-- TOC entry 5257 (class 2606 OID 221042)
-- Name: inventario_detalle fk_inventario_detalle_lote; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario_detalle
    ADD CONSTRAINT fk_inventario_detalle_lote FOREIGN KEY (id_lote_serie) REFERENCES public.item_lote_serie(id_lote_serie);


--
-- TOC entry 5231 (class 2606 OID 222379)
-- Name: item fk_item_almacen_defecto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_almacen_defecto FOREIGN KEY (id_almacen_defecto) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5232 (class 2606 OID 222374)
-- Name: item fk_item_categoria; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_categoria FOREIGN KEY (id_categoria_item) REFERENCES public.categoria_item(id_categoria_item);


--
-- TOC entry 5233 (class 2606 OID 222498)
-- Name: item fk_item_duration_unit; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_duration_unit FOREIGN KEY (id_duration_unit) REFERENCES public.duracion_unidad_catalogo(id_duration_unit);


--
-- TOC entry 5234 (class 2606 OID 208607)
-- Name: item fk_item_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_empresa FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE CASCADE;


--
-- TOC entry 5235 (class 2606 OID 222438)
-- Name: item fk_item_estado_compra; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_estado_compra FOREIGN KEY (id_estado_compra) REFERENCES public.estado_compra_item(id_estado_compra);


--
-- TOC entry 5236 (class 2606 OID 222433)
-- Name: item fk_item_estado_venta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_estado_venta FOREIGN KEY (id_estado_venta) REFERENCES public.estado_venta_item(id_estado_venta);


--
-- TOC entry 5237 (class 2606 OID 208598)
-- Name: item fk_item_impuesto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_impuesto FOREIGN KEY (impuesto_id) REFERENCES public.impuestos(id) ON DELETE SET NULL;


--
-- TOC entry 5238 (class 2606 OID 219774)
-- Name: item fk_item_pais; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_pais FOREIGN KEY (id_pais) REFERENCES public.pais(id_pais) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5239 (class 2606 OID 219779)
-- Name: item fk_item_provincia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_provincia FOREIGN KEY (id_provincia) REFERENCES public.provincia(id_provincia) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5240 (class 2606 OID 222458)
-- Name: item fk_item_tipo_control_caducidad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_tipo_control_caducidad FOREIGN KEY (id_tipo_control_caducidad) REFERENCES public.tipo_control_caducidad_item(id_tipo_control_caducidad);


--
-- TOC entry 5241 (class 2606 OID 222478)
-- Name: item fk_item_tipo_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_tipo_item FOREIGN KEY (id_tipo_item) REFERENCES public.tipo_item_catalogo(id_tipo_item);


--
-- TOC entry 5242 (class 2606 OID 221221)
-- Name: item fk_item_unidad_longitud; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_unidad_longitud FOREIGN KEY (id_unidad_longitud) REFERENCES public.unidad_medida(id_unidad) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5243 (class 2606 OID 221211)
-- Name: item fk_item_unidad_medida; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_unidad_medida FOREIGN KEY (id_unidad_medida) REFERENCES public.unidad_medida(id_unidad) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5244 (class 2606 OID 221216)
-- Name: item fk_item_unidad_peso; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_unidad_peso FOREIGN KEY (id_unidad_peso) REFERENCES public.unidad_medida(id_unidad) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5245 (class 2606 OID 221226)
-- Name: item fk_item_unidad_superficie; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_unidad_superficie FOREIGN KEY (id_unidad_superficie) REFERENCES public.unidad_medida(id_unidad) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5246 (class 2606 OID 221231)
-- Name: item fk_item_unidad_volumen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT fk_item_unidad_volumen FOREIGN KEY (id_unidad_volumen) REFERENCES public.unidad_medida(id_unidad) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5252 (class 2606 OID 220984)
-- Name: item_lote_serie fk_lote_almacen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_lote_serie
    ADD CONSTRAINT fk_lote_almacen FOREIGN KEY (id_almacen) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5253 (class 2606 OID 220979)
-- Name: item_lote_serie fk_lote_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_lote_serie
    ADD CONSTRAINT fk_lote_item FOREIGN KEY (id_item) REFERENCES public.item(id_item);


--
-- TOC entry 5192 (class 2606 OID 222398)
-- Name: movimiento_inventario fk_movimiento_almacen_destino; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT fk_movimiento_almacen_destino FOREIGN KEY (id_almacen_destino) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5193 (class 2606 OID 220991)
-- Name: movimiento_inventario fk_movimiento_inventario_almacen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT fk_movimiento_inventario_almacen FOREIGN KEY (id_almacen) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5194 (class 2606 OID 221200)
-- Name: movimiento_inventario fk_movimiento_inventario_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT fk_movimiento_inventario_item FOREIGN KEY (id_item) REFERENCES public.item(id_item) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5195 (class 2606 OID 220996)
-- Name: movimiento_inventario fk_movimiento_inventario_lote; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT fk_movimiento_inventario_lote FOREIGN KEY (id_lote_serie) REFERENCES public.item_lote_serie(id_lote_serie);


--
-- TOC entry 5094 (class 2606 OID 22153)
-- Name: tercero fk_pais; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT fk_pais FOREIGN KEY (id_pais) REFERENCES public.pais(id_pais);


--
-- TOC entry 5068 (class 2606 OID 17342)
-- Name: perfil fk_perfil_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil
    ADD CONSTRAINT fk_perfil_empresa FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5268 (class 2606 OID 221175)
-- Name: recepcion_detalle fk_recepcion_detalle_almacen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcion_detalle
    ADD CONSTRAINT fk_recepcion_detalle_almacen FOREIGN KEY (id_almacen) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5269 (class 2606 OID 221170)
-- Name: recepcion_detalle fk_recepcion_detalle_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcion_detalle
    ADD CONSTRAINT fk_recepcion_detalle_item FOREIGN KEY (id_item) REFERENCES public.item(id_item);


--
-- TOC entry 5270 (class 2606 OID 221180)
-- Name: recepcion_detalle fk_recepcion_detalle_lote; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcion_detalle
    ADD CONSTRAINT fk_recepcion_detalle_lote FOREIGN KEY (id_lote_serie) REFERENCES public.item_lote_serie(id_lote_serie);


--
-- TOC entry 5271 (class 2606 OID 221165)
-- Name: recepcion_detalle fk_recepcion_detalle_recepcion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcion_detalle
    ADD CONSTRAINT fk_recepcion_detalle_recepcion FOREIGN KEY (id_recepcion) REFERENCES public.recepcion(id_recepcion);


--
-- TOC entry 5267 (class 2606 OID 221151)
-- Name: recepcion fk_recepcion_tercero; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recepcion
    ADD CONSTRAINT fk_recepcion_tercero FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero);


--
-- TOC entry 5095 (class 2606 OID 22148)
-- Name: tercero fk_sede_central; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT fk_sede_central FOREIGN KEY (sede_central) REFERENCES public.tercero(id_tercero);


--
-- TOC entry 5250 (class 2606 OID 220962)
-- Name: stock_item_almacen fk_stock_almacen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_item_almacen
    ADD CONSTRAINT fk_stock_almacen FOREIGN KEY (id_almacen) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5251 (class 2606 OID 220957)
-- Name: stock_item_almacen fk_stock_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_item_almacen
    ADD CONSTRAINT fk_stock_item FOREIGN KEY (id_item) REFERENCES public.item(id_item);


--
-- TOC entry 5096 (class 2606 OID 217550)
-- Name: tercero fk_tercero_tipo_entidad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT fk_tercero_tipo_entidad FOREIGN KEY (id_tipo_entidad) REFERENCES public.tipo_entidad_comercial(id_tipo_entidad) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5098 (class 2606 OID 32177)
-- Name: miembros fk_tipo_miembro; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.miembros
    ADD CONSTRAINT fk_tipo_miembro FOREIGN KEY (tipo_miembro_id) REFERENCES public.tipos_miembro(id);


--
-- TOC entry 5097 (class 2606 OID 22173)
-- Name: tercero fk_tipo_tercero; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tercero
    ADD CONSTRAINT fk_tipo_tercero FOREIGN KEY (id_tipo_tercero) REFERENCES public.tipo_tercero_catalogo(id_tipo_tercero);


--
-- TOC entry 5260 (class 2606 OID 221086)
-- Name: transferencia_stock_detalle fk_transfer_detalle_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencia_stock_detalle
    ADD CONSTRAINT fk_transfer_detalle_item FOREIGN KEY (id_item) REFERENCES public.item(id_item);


--
-- TOC entry 5261 (class 2606 OID 221091)
-- Name: transferencia_stock_detalle fk_transfer_detalle_lote; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencia_stock_detalle
    ADD CONSTRAINT fk_transfer_detalle_lote FOREIGN KEY (id_lote_serie) REFERENCES public.item_lote_serie(id_lote_serie);


--
-- TOC entry 5262 (class 2606 OID 221081)
-- Name: transferencia_stock_detalle fk_transfer_detalle_transfer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencia_stock_detalle
    ADD CONSTRAINT fk_transfer_detalle_transfer FOREIGN KEY (id_transferencia_stock) REFERENCES public.transferencia_stock(id_transferencia_stock);


--
-- TOC entry 5258 (class 2606 OID 221066)
-- Name: transferencia_stock fk_transferencia_almacen_destino; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencia_stock
    ADD CONSTRAINT fk_transferencia_almacen_destino FOREIGN KEY (id_almacen_destino) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5259 (class 2606 OID 221061)
-- Name: transferencia_stock fk_transferencia_almacen_origen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencia_stock
    ADD CONSTRAINT fk_transferencia_almacen_origen FOREIGN KEY (id_almacen_origen) REFERENCES public.almacen(id_almacen);


--
-- TOC entry 5248 (class 2606 OID 219823)
-- Name: unidad_medida fk_unidad_tipo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unidad_medida
    ADD CONSTRAINT fk_unidad_tipo FOREIGN KEY (id_tipo_unidad) REFERENCES public.tipo_unidad_medida(id_tipo_unidad);


--
-- TOC entry 5132 (class 2606 OID 98835)
-- Name: grupo_cuenta_personalizado grupo_cuenta_personalizado_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grupo_cuenta_personalizado
    ADD CONSTRAINT grupo_cuenta_personalizado_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5175 (class 2606 OID 99250)
-- Name: historial_conversion historial_conversion_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_conversion
    ADD CONSTRAINT historial_conversion_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5176 (class 2606 OID 99255)
-- Name: historial_conversion historial_conversion_id_usuario_conversion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_conversion
    ADD CONSTRAINT historial_conversion_id_usuario_conversion_fkey FOREIGN KEY (id_usuario_conversion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5152 (class 2606 OID 99014)
-- Name: informe_contable informe_contable_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.informe_contable
    ADD CONSTRAINT informe_contable_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5142 (class 2606 OID 98932)
-- Name: libro_mayor libro_mayor_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.libro_mayor
    ADD CONSTRAINT libro_mayor_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE RESTRICT;


--
-- TOC entry 5143 (class 2606 OID 98927)
-- Name: libro_mayor libro_mayor_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.libro_mayor
    ADD CONSTRAINT libro_mayor_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5144 (class 2606 OID 98937)
-- Name: libro_mayor libro_mayor_id_periodo_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.libro_mayor
    ADD CONSTRAINT libro_mayor_id_periodo_contable_fkey FOREIGN KEY (id_periodo_contable) REFERENCES public.periodo_contable(id_periodo_contable) ON DELETE RESTRICT;


--
-- TOC entry 5071 (class 2606 OID 17392)
-- Name: menu_item menu_item_id_seccion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item
    ADD CONSTRAINT menu_item_id_seccion_fkey FOREIGN KEY (id_seccion) REFERENCES public.menu_seccion(id_seccion) ON DELETE CASCADE;


--
-- TOC entry 5072 (class 2606 OID 17397)
-- Name: menu_item menu_item_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item
    ADD CONSTRAINT menu_item_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.menu_item(id_item) ON DELETE CASCADE;


--
-- TOC entry 5188 (class 2606 OID 99375)
-- Name: movimiento_bancario movimiento_bancario_id_asiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_bancario
    ADD CONSTRAINT movimiento_bancario_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE SET NULL;


--
-- TOC entry 5189 (class 2606 OID 99370)
-- Name: movimiento_bancario movimiento_bancario_id_conciliacion_bancaria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_bancario
    ADD CONSTRAINT movimiento_bancario_id_conciliacion_bancaria_fkey FOREIGN KEY (id_conciliacion_bancaria) REFERENCES public.conciliacion_bancaria(id_conciliacion_bancaria) ON DELETE SET NULL;


--
-- TOC entry 5190 (class 2606 OID 99365)
-- Name: movimiento_bancario movimiento_bancario_id_cuenta_bancaria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_bancario
    ADD CONSTRAINT movimiento_bancario_id_cuenta_bancaria_fkey FOREIGN KEY (id_cuenta_bancaria) REFERENCES public.cuenta_bancaria(id_cuenta_bancaria) ON DELETE RESTRICT;


--
-- TOC entry 5191 (class 2606 OID 99360)
-- Name: movimiento_bancario movimiento_bancario_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_bancario
    ADD CONSTRAINT movimiento_bancario_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5211 (class 2606 OID 99564)
-- Name: movimiento_centro_costo movimiento_centro_costo_id_centro_costo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_centro_costo
    ADD CONSTRAINT movimiento_centro_costo_id_centro_costo_fkey FOREIGN KEY (id_centro_costo) REFERENCES public.centro_costo(id_centro_costo) ON DELETE RESTRICT;


--
-- TOC entry 5212 (class 2606 OID 99559)
-- Name: movimiento_centro_costo movimiento_centro_costo_id_movimiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_centro_costo
    ADD CONSTRAINT movimiento_centro_costo_id_movimiento_contable_fkey FOREIGN KEY (id_movimiento_contable) REFERENCES public.movimiento_contable(id_movimiento_contable) ON DELETE RESTRICT;


--
-- TOC entry 5140 (class 2606 OID 98903)
-- Name: movimiento_contable movimiento_contable_id_asiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_contable
    ADD CONSTRAINT movimiento_contable_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE RESTRICT;


--
-- TOC entry 5141 (class 2606 OID 98908)
-- Name: movimiento_contable movimiento_contable_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_contable
    ADD CONSTRAINT movimiento_contable_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE RESTRICT;


--
-- TOC entry 5226 (class 2606 OID 106389)
-- Name: movimiento_cuenta movimiento_cuenta_id_cuenta_financiera_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_cuenta
    ADD CONSTRAINT movimiento_cuenta_id_cuenta_financiera_fkey FOREIGN KEY (id_cuenta_financiera) REFERENCES public.cuenta_financiera(id_cuenta_financiera) ON DELETE CASCADE;


--
-- TOC entry 5227 (class 2606 OID 106384)
-- Name: movimiento_cuenta movimiento_cuenta_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_cuenta
    ADD CONSTRAINT movimiento_cuenta_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa);


--
-- TOC entry 5196 (class 2606 OID 99399)
-- Name: movimiento_inventario movimiento_inventario_id_asiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE SET NULL;


--
-- TOC entry 5197 (class 2606 OID 99389)
-- Name: movimiento_inventario movimiento_inventario_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5202 (class 2606 OID 99483)
-- Name: nota_credito nota_credito_id_asiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_credito
    ADD CONSTRAINT nota_credito_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE SET NULL;


--
-- TOC entry 5203 (class 2606 OID 99468)
-- Name: nota_credito nota_credito_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_credito
    ADD CONSTRAINT nota_credito_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5204 (class 2606 OID 99478)
-- Name: nota_credito nota_credito_id_factura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_credito
    ADD CONSTRAINT nota_credito_id_factura_fkey FOREIGN KEY (id_factura) REFERENCES public.factura(id_factura) ON DELETE RESTRICT;


--
-- TOC entry 5205 (class 2606 OID 99473)
-- Name: nota_credito nota_credito_id_tercero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_credito
    ADD CONSTRAINT nota_credito_id_tercero_fkey FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE RESTRICT;


--
-- TOC entry 5206 (class 2606 OID 99499)
-- Name: nota_credito_linea nota_credito_linea_id_nota_credito_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_credito_linea
    ADD CONSTRAINT nota_credito_linea_id_nota_credito_fkey FOREIGN KEY (id_nota_credito) REFERENCES public.nota_credito(id_nota_credito) ON DELETE RESTRICT;


--
-- TOC entry 5182 (class 2606 OID 99313)
-- Name: pago_factura pago_factura_id_factura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago_factura
    ADD CONSTRAINT pago_factura_id_factura_fkey FOREIGN KEY (id_factura) REFERENCES public.factura(id_factura) ON DELETE RESTRICT;


--
-- TOC entry 5183 (class 2606 OID 99308)
-- Name: pago_factura pago_factura_id_pago_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago_factura
    ADD CONSTRAINT pago_factura_id_pago_fkey FOREIGN KEY (id_pago) REFERENCES public.pago(id_pago) ON DELETE RESTRICT;


--
-- TOC entry 5177 (class 2606 OID 99294)
-- Name: pago pago_id_asiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE SET NULL;


--
-- TOC entry 5178 (class 2606 OID 99284)
-- Name: pago pago_id_cuenta_bancaria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_cuenta_bancaria_fkey FOREIGN KEY (id_cuenta_bancaria) REFERENCES public.cuenta_bancaria(id_cuenta_bancaria) ON DELETE SET NULL;


--
-- TOC entry 5179 (class 2606 OID 99274)
-- Name: pago pago_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5180 (class 2606 OID 99289)
-- Name: pago pago_id_moneda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_moneda_fkey FOREIGN KEY (id_moneda) REFERENCES public.moneda(id_moneda) ON DELETE RESTRICT;


--
-- TOC entry 5181 (class 2606 OID 99279)
-- Name: pago pago_id_tercero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_tercero_fkey FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE RESTRICT;


--
-- TOC entry 5099 (class 2606 OID 46560)
-- Name: perfil_menu_permiso perfil_menu_permiso_id_item_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_menu_permiso
    ADD CONSTRAINT perfil_menu_permiso_id_item_fkey FOREIGN KEY (id_item) REFERENCES public.menu_item(id_item);


--
-- TOC entry 5100 (class 2606 OID 46555)
-- Name: perfil_menu_permiso perfil_menu_permiso_id_perfil_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_menu_permiso
    ADD CONSTRAINT perfil_menu_permiso_id_perfil_fkey FOREIGN KEY (id_perfil) REFERENCES public.perfil(id_perfil);


--
-- TOC entry 5109 (class 2606 OID 93236)
-- Name: periodo_contable periodo_contable_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.periodo_contable
    ADD CONSTRAINT periodo_contable_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5110 (class 2606 OID 93241)
-- Name: periodo_contable periodo_contable_id_usuario_cierre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.periodo_contable
    ADD CONSTRAINT periodo_contable_id_usuario_cierre_fkey FOREIGN KEY (id_usuario_cierre) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5105 (class 2606 OID 93190)
-- Name: plan_contable plan_contable_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_contable
    ADD CONSTRAINT plan_contable_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5106 (class 2606 OID 93195)
-- Name: plan_contable plan_contable_id_modelo_plan_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plan_contable
    ADD CONSTRAINT plan_contable_id_modelo_plan_contable_fkey FOREIGN KEY (id_modelo_plan_contable) REFERENCES public.modelo_plan_contable(id_modelo_plan_contable) ON DELETE SET NULL;


--
-- TOC entry 5173 (class 2606 OID 99235)
-- Name: prefactura_factura prefactura_factura_id_factura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura_factura
    ADD CONSTRAINT prefactura_factura_id_factura_fkey FOREIGN KEY (id_factura) REFERENCES public.factura(id_factura) ON DELETE RESTRICT;


--
-- TOC entry 5174 (class 2606 OID 99230)
-- Name: prefactura_factura prefactura_factura_id_prefactura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura_factura
    ADD CONSTRAINT prefactura_factura_id_prefactura_fkey FOREIGN KEY (id_prefactura) REFERENCES public.prefactura(id_prefactura) ON DELETE RESTRICT;


--
-- TOC entry 5163 (class 2606 OID 99149)
-- Name: prefactura prefactura_id_cotizacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura
    ADD CONSTRAINT prefactura_id_cotizacion_fkey FOREIGN KEY (id_cotizacion) REFERENCES public.cotizacion(id_cotizacion) ON DELETE RESTRICT;


--
-- TOC entry 5164 (class 2606 OID 99144)
-- Name: prefactura prefactura_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura
    ADD CONSTRAINT prefactura_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5165 (class 2606 OID 99159)
-- Name: prefactura prefactura_id_factura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura
    ADD CONSTRAINT prefactura_id_factura_fkey FOREIGN KEY (id_factura) REFERENCES public.factura(id_factura) ON DELETE SET NULL;


--
-- TOC entry 5166 (class 2606 OID 99154)
-- Name: prefactura prefactura_id_tercero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura
    ADD CONSTRAINT prefactura_id_tercero_fkey FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE RESTRICT;


--
-- TOC entry 5167 (class 2606 OID 99169)
-- Name: prefactura prefactura_id_usuario_aprobacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura
    ADD CONSTRAINT prefactura_id_usuario_aprobacion_fkey FOREIGN KEY (id_usuario_aprobacion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5168 (class 2606 OID 99164)
-- Name: prefactura prefactura_id_usuario_creacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura
    ADD CONSTRAINT prefactura_id_usuario_creacion_fkey FOREIGN KEY (id_usuario_creacion) REFERENCES public.usuario(id_usuario) ON DELETE SET NULL;


--
-- TOC entry 5169 (class 2606 OID 99190)
-- Name: prefactura_linea prefactura_linea_id_cotizacion_linea_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura_linea
    ADD CONSTRAINT prefactura_linea_id_cotizacion_linea_fkey FOREIGN KEY (id_cotizacion_linea) REFERENCES public.cotizacion_linea(id_cotizacion_linea) ON DELETE RESTRICT;


--
-- TOC entry 5170 (class 2606 OID 99185)
-- Name: prefactura_linea prefactura_linea_id_prefactura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefactura_linea
    ADD CONSTRAINT prefactura_linea_id_prefactura_fkey FOREIGN KEY (id_prefactura) REFERENCES public.prefactura(id_prefactura) ON DELETE RESTRICT;


--
-- TOC entry 5198 (class 2606 OID 99417)
-- Name: presupuesto presupuesto_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presupuesto
    ADD CONSTRAINT presupuesto_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5199 (class 2606 OID 99427)
-- Name: presupuesto presupuesto_id_factura_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presupuesto
    ADD CONSTRAINT presupuesto_id_factura_fkey FOREIGN KEY (id_factura) REFERENCES public.factura(id_factura) ON DELETE SET NULL;


--
-- TOC entry 5200 (class 2606 OID 99422)
-- Name: presupuesto presupuesto_id_tercero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presupuesto
    ADD CONSTRAINT presupuesto_id_tercero_fkey FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE RESTRICT;


--
-- TOC entry 5201 (class 2606 OID 99443)
-- Name: presupuesto_linea presupuesto_linea_id_presupuesto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presupuesto_linea
    ADD CONSTRAINT presupuesto_linea_id_presupuesto_fkey FOREIGN KEY (id_presupuesto) REFERENCES public.presupuesto(id_presupuesto) ON DELETE RESTRICT;


--
-- TOC entry 5073 (class 2606 OID 18557)
-- Name: provincia provincia_id_pais_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincia
    ADD CONSTRAINT provincia_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES public.pais(id_pais) ON DELETE RESTRICT;


--
-- TOC entry 5207 (class 2606 OID 99528)
-- Name: retencion retencion_id_asiento_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.retencion
    ADD CONSTRAINT retencion_id_asiento_contable_fkey FOREIGN KEY (id_asiento_contable) REFERENCES public.asiento_contable(id_asiento_contable) ON DELETE SET NULL;


--
-- TOC entry 5208 (class 2606 OID 99518)
-- Name: retencion retencion_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.retencion
    ADD CONSTRAINT retencion_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5209 (class 2606 OID 99523)
-- Name: retencion retencion_id_tercero_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.retencion
    ADD CONSTRAINT retencion_id_tercero_fkey FOREIGN KEY (id_tercero) REFERENCES public.tercero(id_tercero) ON DELETE RESTRICT;


--
-- TOC entry 5145 (class 2606 OID 98960)
-- Name: saldo_cuenta saldo_cuenta_id_cuenta_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saldo_cuenta
    ADD CONSTRAINT saldo_cuenta_id_cuenta_contable_fkey FOREIGN KEY (id_cuenta_contable) REFERENCES public.cuenta_contable(id_cuenta_contable) ON DELETE RESTRICT;


--
-- TOC entry 5146 (class 2606 OID 98955)
-- Name: saldo_cuenta saldo_cuenta_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saldo_cuenta
    ADD CONSTRAINT saldo_cuenta_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5147 (class 2606 OID 98965)
-- Name: saldo_cuenta saldo_cuenta_id_periodo_contable_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saldo_cuenta
    ADD CONSTRAINT saldo_cuenta_id_periodo_contable_fkey FOREIGN KEY (id_periodo_contable) REFERENCES public.periodo_contable(id_periodo_contable) ON DELETE RESTRICT;


--
-- TOC entry 5067 (class 2606 OID 17289)
-- Name: sucursal sucursal_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursal
    ADD CONSTRAINT sucursal_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5213 (class 2606 OID 99578)
-- Name: tipo_cambio tipo_cambio_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_cambio
    ADD CONSTRAINT tipo_cambio_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5214 (class 2606 OID 99588)
-- Name: tipo_cambio tipo_cambio_id_moneda_destino_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_cambio
    ADD CONSTRAINT tipo_cambio_id_moneda_destino_fkey FOREIGN KEY (id_moneda_destino) REFERENCES public.moneda(id_moneda) ON DELETE RESTRICT;


--
-- TOC entry 5215 (class 2606 OID 99583)
-- Name: tipo_cambio tipo_cambio_id_moneda_origen_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_cambio
    ADD CONSTRAINT tipo_cambio_id_moneda_origen_fkey FOREIGN KEY (id_moneda_origen) REFERENCES public.moneda(id_moneda) ON DELETE RESTRICT;


--
-- TOC entry 5219 (class 2606 OID 106306)
-- Name: titular_cuenta titular_cuenta_id_pais_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.titular_cuenta
    ADD CONSTRAINT titular_cuenta_id_pais_fkey FOREIGN KEY (id_pais) REFERENCES public.pais(id_pais);


--
-- TOC entry 5069 (class 2606 OID 17360)
-- Name: usuario usuario_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON DELETE RESTRICT;


--
-- TOC entry 5070 (class 2606 OID 17365)
-- Name: usuario usuario_id_perfil_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_perfil_fkey FOREIGN KEY (id_perfil) REFERENCES public.perfil(id_perfil) ON DELETE RESTRICT;


--
-- TOC entry 5049 (class 2606 OID 16570)
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 5101 (class 2606 OID 53207)
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 5061 (class 2606 OID 17080)
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 5062 (class 2606 OID 17100)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 5063 (class 2606 OID 17095)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- TOC entry 5228 (class 2606 OID 119651)
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- TOC entry 5438 (class 0 OID 16523)
-- Dependencies: 254
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5452 (class 0 OID 16925)
-- Dependencies: 271
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5443 (class 0 OID 16723)
-- Dependencies: 262
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5437 (class 0 OID 16516)
-- Dependencies: 253
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5447 (class 0 OID 16812)
-- Dependencies: 266
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5446 (class 0 OID 16800)
-- Dependencies: 265
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5445 (class 0 OID 16787)
-- Dependencies: 264
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5453 (class 0 OID 16975)
-- Dependencies: 272
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5436 (class 0 OID 16505)
-- Dependencies: 252
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5450 (class 0 OID 16854)
-- Dependencies: 269
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5451 (class 0 OID 16872)
-- Dependencies: 270
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5439 (class 0 OID 16531)
-- Dependencies: 255
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5444 (class 0 OID 16753)
-- Dependencies: 263
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5449 (class 0 OID 16839)
-- Dependencies: 268
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5448 (class 0 OID 16830)
-- Dependencies: 267
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5435 (class 0 OID 16493)
-- Dependencies: 250
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5456 (class 0 OID 17251)
-- Dependencies: 281
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5440 (class 0 OID 16544)
-- Dependencies: 256
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5458 (class 0 OID 53242)
-- Dependencies: 313
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5459 (class 0 OID 119631)
-- Dependencies: 364
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5442 (class 0 OID 16586)
-- Dependencies: 258
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5441 (class 0 OID 16559)
-- Dependencies: 257
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5457 (class 0 OID 53197)
-- Dependencies: 312
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5454 (class 0 OID 17071)
-- Dependencies: 277
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5455 (class 0 OID 17085)
-- Dependencies: 278
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5460 (class 0 OID 119641)
-- Dependencies: 365
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 5461 (class 6104 OID 16426)
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- TOC entry 5602 (class 0 OID 0)
-- Dependencies: 17
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- TOC entry 5603 (class 0 OID 0)
-- Dependencies: 13
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- TOC entry 5604 (class 0 OID 0)
-- Dependencies: 32
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- TOC entry 5605 (class 0 OID 0)
-- Dependencies: 9
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- TOC entry 5606 (class 0 OID 0)
-- Dependencies: 18
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- TOC entry 5607 (class 0 OID 0)
-- Dependencies: 14
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- TOC entry 5614 (class 0 OID 0)
-- Dependencies: 456
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- TOC entry 5615 (class 0 OID 0)
-- Dependencies: 475
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- TOC entry 5617 (class 0 OID 0)
-- Dependencies: 455
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- TOC entry 5619 (class 0 OID 0)
-- Dependencies: 454
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- TOC entry 5620 (class 0 OID 0)
-- Dependencies: 450
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- TOC entry 5621 (class 0 OID 0)
-- Dependencies: 451
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- TOC entry 5622 (class 0 OID 0)
-- Dependencies: 422
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- TOC entry 5623 (class 0 OID 0)
-- Dependencies: 452
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- TOC entry 5624 (class 0 OID 0)
-- Dependencies: 426
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5625 (class 0 OID 0)
-- Dependencies: 428
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5626 (class 0 OID 0)
-- Dependencies: 419
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- TOC entry 5627 (class 0 OID 0)
-- Dependencies: 418
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- TOC entry 5628 (class 0 OID 0)
-- Dependencies: 425
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5629 (class 0 OID 0)
-- Dependencies: 427
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5630 (class 0 OID 0)
-- Dependencies: 429
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- TOC entry 5631 (class 0 OID 0)
-- Dependencies: 430
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- TOC entry 5632 (class 0 OID 0)
-- Dependencies: 423
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- TOC entry 5633 (class 0 OID 0)
-- Dependencies: 424
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- TOC entry 5635 (class 0 OID 0)
-- Dependencies: 457
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- TOC entry 5637 (class 0 OID 0)
-- Dependencies: 461
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- TOC entry 5639 (class 0 OID 0)
-- Dependencies: 458
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- TOC entry 5640 (class 0 OID 0)
-- Dependencies: 421
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5641 (class 0 OID 0)
-- Dependencies: 420
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- TOC entry 5642 (class 0 OID 0)
-- Dependencies: 406
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- TOC entry 5643 (class 0 OID 0)
-- Dependencies: 405
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- TOC entry 5644 (class 0 OID 0)
-- Dependencies: 407
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- TOC entry 5645 (class 0 OID 0)
-- Dependencies: 453
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- TOC entry 5646 (class 0 OID 0)
-- Dependencies: 449
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- TOC entry 5647 (class 0 OID 0)
-- Dependencies: 443
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- TOC entry 5648 (class 0 OID 0)
-- Dependencies: 445
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5649 (class 0 OID 0)
-- Dependencies: 447
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- TOC entry 5650 (class 0 OID 0)
-- Dependencies: 444
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- TOC entry 5651 (class 0 OID 0)
-- Dependencies: 446
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5652 (class 0 OID 0)
-- Dependencies: 448
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- TOC entry 5653 (class 0 OID 0)
-- Dependencies: 439
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- TOC entry 5654 (class 0 OID 0)
-- Dependencies: 441
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- TOC entry 5655 (class 0 OID 0)
-- Dependencies: 440
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- TOC entry 5656 (class 0 OID 0)
-- Dependencies: 442
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 5657 (class 0 OID 0)
-- Dependencies: 435
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- TOC entry 5658 (class 0 OID 0)
-- Dependencies: 437
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- TOC entry 5659 (class 0 OID 0)
-- Dependencies: 436
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- TOC entry 5660 (class 0 OID 0)
-- Dependencies: 438
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- TOC entry 5661 (class 0 OID 0)
-- Dependencies: 431
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- TOC entry 5662 (class 0 OID 0)
-- Dependencies: 433
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- TOC entry 5663 (class 0 OID 0)
-- Dependencies: 432
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- TOC entry 5664 (class 0 OID 0)
-- Dependencies: 434
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- TOC entry 5665 (class 0 OID 0)
-- Dependencies: 459
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- TOC entry 5666 (class 0 OID 0)
-- Dependencies: 460
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- TOC entry 5668 (class 0 OID 0)
-- Dependencies: 462
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- TOC entry 5669 (class 0 OID 0)
-- Dependencies: 413
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- TOC entry 5670 (class 0 OID 0)
-- Dependencies: 414
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- TOC entry 5671 (class 0 OID 0)
-- Dependencies: 415
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- TOC entry 5672 (class 0 OID 0)
-- Dependencies: 416
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- TOC entry 5673 (class 0 OID 0)
-- Dependencies: 417
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- TOC entry 5674 (class 0 OID 0)
-- Dependencies: 408
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- TOC entry 5675 (class 0 OID 0)
-- Dependencies: 409
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- TOC entry 5676 (class 0 OID 0)
-- Dependencies: 411
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- TOC entry 5677 (class 0 OID 0)
-- Dependencies: 410
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- TOC entry 5678 (class 0 OID 0)
-- Dependencies: 412
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- TOC entry 5679 (class 0 OID 0)
-- Dependencies: 474
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- TOC entry 5680 (class 0 OID 0)
-- Dependencies: 404
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- TOC entry 5682 (class 0 OID 0)
-- Dependencies: 522
-- Name: FUNCTION balance_comprobacion(p_empresa_id uuid, p_fecha_desde date, p_fecha_hasta date); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.balance_comprobacion(p_empresa_id uuid, p_fecha_desde date, p_fecha_hasta date) TO anon;
GRANT ALL ON FUNCTION public.balance_comprobacion(p_empresa_id uuid, p_fecha_desde date, p_fecha_hasta date) TO authenticated;
GRANT ALL ON FUNCTION public.balance_comprobacion(p_empresa_id uuid, p_fecha_desde date, p_fecha_hasta date) TO service_role;


--
-- TOC entry 5684 (class 0 OID 0)
-- Dependencies: 525
-- Name: FUNCTION balance_general_saldos(p_empresa_id uuid, p_fecha_corte date); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.balance_general_saldos(p_empresa_id uuid, p_fecha_corte date) TO anon;
GRANT ALL ON FUNCTION public.balance_general_saldos(p_empresa_id uuid, p_fecha_corte date) TO authenticated;
GRANT ALL ON FUNCTION public.balance_general_saldos(p_empresa_id uuid, p_fecha_corte date) TO service_role;


--
-- TOC entry 5686 (class 0 OID 0)
-- Dependencies: 524
-- Name: FUNCTION estado_resultados(p_empresa_id integer, p_fecha_desde date, p_fecha_hasta date); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.estado_resultados(p_empresa_id integer, p_fecha_desde date, p_fecha_hasta date) TO anon;
GRANT ALL ON FUNCTION public.estado_resultados(p_empresa_id integer, p_fecha_desde date, p_fecha_hasta date) TO authenticated;
GRANT ALL ON FUNCTION public.estado_resultados(p_empresa_id integer, p_fecha_desde date, p_fecha_hasta date) TO service_role;


--
-- TOC entry 5688 (class 0 OID 0)
-- Dependencies: 523
-- Name: FUNCTION libro_mayor(p_empresa_id integer, p_cuenta_id integer, p_fecha_desde date, p_fecha_hasta date); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.libro_mayor(p_empresa_id integer, p_cuenta_id integer, p_fecha_desde date, p_fecha_hasta date) TO anon;
GRANT ALL ON FUNCTION public.libro_mayor(p_empresa_id integer, p_cuenta_id integer, p_fecha_desde date, p_fecha_hasta date) TO authenticated;
GRANT ALL ON FUNCTION public.libro_mayor(p_empresa_id integer, p_cuenta_id integer, p_fecha_desde date, p_fecha_hasta date) TO service_role;


--
-- TOC entry 5690 (class 0 OID 0)
-- Dependencies: 521
-- Name: FUNCTION obtener_siguiente_numero_asiento(p_empresa_id integer, p_prefijo character varying, p_fecha date); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.obtener_siguiente_numero_asiento(p_empresa_id integer, p_prefijo character varying, p_fecha date) TO anon;
GRANT ALL ON FUNCTION public.obtener_siguiente_numero_asiento(p_empresa_id integer, p_prefijo character varying, p_fecha date) TO authenticated;
GRANT ALL ON FUNCTION public.obtener_siguiente_numero_asiento(p_empresa_id integer, p_prefijo character varying, p_fecha date) TO service_role;


--
-- TOC entry 5691 (class 0 OID 0)
-- Dependencies: 520
-- Name: FUNCTION set_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.set_updated_at() TO anon;
GRANT ALL ON FUNCTION public.set_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.set_updated_at() TO service_role;


--
-- TOC entry 5692 (class 0 OID 0)
-- Dependencies: 518
-- Name: FUNCTION trg_heredar_empresa_movimiento(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.trg_heredar_empresa_movimiento() TO anon;
GRANT ALL ON FUNCTION public.trg_heredar_empresa_movimiento() TO authenticated;
GRANT ALL ON FUNCTION public.trg_heredar_empresa_movimiento() TO service_role;


--
-- TOC entry 5693 (class 0 OID 0)
-- Dependencies: 519
-- Name: FUNCTION trg_insertar_saldo_inicial(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.trg_insertar_saldo_inicial() TO anon;
GRANT ALL ON FUNCTION public.trg_insertar_saldo_inicial() TO authenticated;
GRANT ALL ON FUNCTION public.trg_insertar_saldo_inicial() TO service_role;


--
-- TOC entry 5694 (class 0 OID 0)
-- Dependencies: 517
-- Name: FUNCTION trg_touch_actualizado_en(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.trg_touch_actualizado_en() TO anon;
GRANT ALL ON FUNCTION public.trg_touch_actualizado_en() TO authenticated;
GRANT ALL ON FUNCTION public.trg_touch_actualizado_en() TO service_role;


--
-- TOC entry 5695 (class 0 OID 0)
-- Dependencies: 490
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- TOC entry 5696 (class 0 OID 0)
-- Dependencies: 496
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- TOC entry 5697 (class 0 OID 0)
-- Dependencies: 492
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- TOC entry 5698 (class 0 OID 0)
-- Dependencies: 488
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- TOC entry 5699 (class 0 OID 0)
-- Dependencies: 487
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- TOC entry 5700 (class 0 OID 0)
-- Dependencies: 491
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- TOC entry 5701 (class 0 OID 0)
-- Dependencies: 493
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- TOC entry 5702 (class 0 OID 0)
-- Dependencies: 486
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- TOC entry 5703 (class 0 OID 0)
-- Dependencies: 495
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- TOC entry 5704 (class 0 OID 0)
-- Dependencies: 485
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- TOC entry 5705 (class 0 OID 0)
-- Dependencies: 489
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- TOC entry 5706 (class 0 OID 0)
-- Dependencies: 494
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- TOC entry 5707 (class 0 OID 0)
-- Dependencies: 464
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- TOC entry 5708 (class 0 OID 0)
-- Dependencies: 466
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- TOC entry 5709 (class 0 OID 0)
-- Dependencies: 467
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- TOC entry 5711 (class 0 OID 0)
-- Dependencies: 254
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- TOC entry 5712 (class 0 OID 0)
-- Dependencies: 369
-- Name: TABLE custom_oauth_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.custom_oauth_providers TO postgres;
GRANT ALL ON TABLE auth.custom_oauth_providers TO dashboard_user;


--
-- TOC entry 5714 (class 0 OID 0)
-- Dependencies: 271
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- TOC entry 5717 (class 0 OID 0)
-- Dependencies: 262
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- TOC entry 5719 (class 0 OID 0)
-- Dependencies: 253
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- TOC entry 5721 (class 0 OID 0)
-- Dependencies: 266
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- TOC entry 5723 (class 0 OID 0)
-- Dependencies: 265
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- TOC entry 5726 (class 0 OID 0)
-- Dependencies: 264
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- TOC entry 5727 (class 0 OID 0)
-- Dependencies: 326
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- TOC entry 5729 (class 0 OID 0)
-- Dependencies: 366
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- TOC entry 5730 (class 0 OID 0)
-- Dependencies: 314
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- TOC entry 5731 (class 0 OID 0)
-- Dependencies: 327
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- TOC entry 5732 (class 0 OID 0)
-- Dependencies: 272
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- TOC entry 5734 (class 0 OID 0)
-- Dependencies: 252
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- TOC entry 5736 (class 0 OID 0)
-- Dependencies: 251
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- TOC entry 5738 (class 0 OID 0)
-- Dependencies: 269
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- TOC entry 5740 (class 0 OID 0)
-- Dependencies: 270
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- TOC entry 5742 (class 0 OID 0)
-- Dependencies: 255
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- TOC entry 5747 (class 0 OID 0)
-- Dependencies: 263
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- TOC entry 5749 (class 0 OID 0)
-- Dependencies: 268
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- TOC entry 5752 (class 0 OID 0)
-- Dependencies: 267
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- TOC entry 5755 (class 0 OID 0)
-- Dependencies: 250
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- TOC entry 5756 (class 0 OID 0)
-- Dependencies: 249
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- TOC entry 5757 (class 0 OID 0)
-- Dependencies: 248
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- TOC entry 5758 (class 0 OID 0)
-- Dependencies: 376
-- Name: TABLE almacen; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.almacen TO anon;
GRANT ALL ON TABLE public.almacen TO authenticated;
GRANT ALL ON TABLE public.almacen TO service_role;


--
-- TOC entry 5760 (class 0 OID 0)
-- Dependencies: 331
-- Name: TABLE asiento_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.asiento_contable TO anon;
GRANT ALL ON TABLE public.asiento_contable TO authenticated;
GRANT ALL ON TABLE public.asiento_contable TO service_role;


--
-- TOC entry 5761 (class 0 OID 0)
-- Dependencies: 387
-- Name: TABLE categoria_item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.categoria_item TO anon;
GRANT ALL ON TABLE public.categoria_item TO authenticated;
GRANT ALL ON TABLE public.categoria_item TO service_role;


--
-- TOC entry 5762 (class 0 OID 0)
-- Dependencies: 356
-- Name: TABLE centro_costo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.centro_costo TO anon;
GRANT ALL ON TABLE public.centro_costo TO authenticated;
GRANT ALL ON TABLE public.centro_costo TO service_role;


--
-- TOC entry 5763 (class 0 OID 0)
-- Dependencies: 359
-- Name: TABLE cierre_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cierre_contable TO anon;
GRANT ALL ON TABLE public.cierre_contable TO authenticated;
GRANT ALL ON TABLE public.cierre_contable TO service_role;


--
-- TOC entry 5764 (class 0 OID 0)
-- Dependencies: 328
-- Name: TABLE cierre_cuenta; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cierre_cuenta TO anon;
GRANT ALL ON TABLE public.cierre_cuenta TO authenticated;
GRANT ALL ON TABLE public.cierre_cuenta TO service_role;


--
-- TOC entry 5765 (class 0 OID 0)
-- Dependencies: 373
-- Name: TABLE ciudad; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ciudad TO anon;
GRANT ALL ON TABLE public.ciudad TO authenticated;
GRANT ALL ON TABLE public.ciudad TO service_role;


--
-- TOC entry 5766 (class 0 OID 0)
-- Dependencies: 348
-- Name: TABLE conciliacion_bancaria; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.conciliacion_bancaria TO anon;
GRANT ALL ON TABLE public.conciliacion_bancaria TO authenticated;
GRANT ALL ON TABLE public.conciliacion_bancaria TO service_role;


--
-- TOC entry 5767 (class 0 OID 0)
-- Dependencies: 301
-- Name: TABLE condicion_pago_catalogo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.condicion_pago_catalogo TO anon;
GRANT ALL ON TABLE public.condicion_pago_catalogo TO authenticated;
GRANT ALL ON TABLE public.condicion_pago_catalogo TO service_role;


--
-- TOC entry 5768 (class 0 OID 0)
-- Dependencies: 315
-- Name: TABLE configuracion_contabilidad; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.configuracion_contabilidad TO anon;
GRANT ALL ON TABLE public.configuracion_contabilidad TO authenticated;
GRANT ALL ON TABLE public.configuracion_contabilidad TO service_role;


--
-- TOC entry 5769 (class 0 OID 0)
-- Dependencies: 298
-- Name: TABLE contable_externo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.contable_externo TO anon;
GRANT ALL ON TABLE public.contable_externo TO authenticated;
GRANT ALL ON TABLE public.contable_externo TO service_role;


--
-- TOC entry 5770 (class 0 OID 0)
-- Dependencies: 367
-- Name: TABLE contacto_direccion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.contacto_direccion TO anon;
GRANT ALL ON TABLE public.contacto_direccion TO authenticated;
GRANT ALL ON TABLE public.contacto_direccion TO service_role;


--
-- TOC entry 5771 (class 0 OID 0)
-- Dependencies: 339
-- Name: TABLE cotizacion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cotizacion TO anon;
GRANT ALL ON TABLE public.cotizacion TO authenticated;
GRANT ALL ON TABLE public.cotizacion TO service_role;


--
-- TOC entry 5772 (class 0 OID 0)
-- Dependencies: 340
-- Name: TABLE cotizacion_linea; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cotizacion_linea TO anon;
GRANT ALL ON TABLE public.cotizacion_linea TO authenticated;
GRANT ALL ON TABLE public.cotizacion_linea TO service_role;


--
-- TOC entry 5773 (class 0 OID 0)
-- Dependencies: 343
-- Name: TABLE cotizacion_prefactura; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cotizacion_prefactura TO anon;
GRANT ALL ON TABLE public.cotizacion_prefactura TO authenticated;
GRANT ALL ON TABLE public.cotizacion_prefactura TO service_role;


--
-- TOC entry 5774 (class 0 OID 0)
-- Dependencies: 322
-- Name: TABLE cuenta_bancaria; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta_bancaria TO anon;
GRANT ALL ON TABLE public.cuenta_bancaria TO authenticated;
GRANT ALL ON TABLE public.cuenta_bancaria TO service_role;


--
-- TOC entry 5775 (class 0 OID 0)
-- Dependencies: 319
-- Name: TABLE cuenta_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta_contable TO anon;
GRANT ALL ON TABLE public.cuenta_contable TO authenticated;
GRANT ALL ON TABLE public.cuenta_contable TO service_role;


--
-- TOC entry 5776 (class 0 OID 0)
-- Dependencies: 321
-- Name: TABLE cuenta_contable_defecto; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta_contable_defecto TO anon;
GRANT ALL ON TABLE public.cuenta_contable_defecto TO authenticated;
GRANT ALL ON TABLE public.cuenta_contable_defecto TO service_role;


--
-- TOC entry 5777 (class 0 OID 0)
-- Dependencies: 325
-- Name: TABLE cuenta_contable_item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta_contable_item TO anon;
GRANT ALL ON TABLE public.cuenta_contable_item TO authenticated;
GRANT ALL ON TABLE public.cuenta_contable_item TO service_role;


--
-- TOC entry 5778 (class 0 OID 0)
-- Dependencies: 361
-- Name: TABLE cuenta_financiera; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta_financiera TO anon;
GRANT ALL ON TABLE public.cuenta_financiera TO authenticated;
GRANT ALL ON TABLE public.cuenta_financiera TO service_role;


--
-- TOC entry 5779 (class 0 OID 0)
-- Dependencies: 330
-- Name: TABLE cuenta_grupo_personalizado; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta_grupo_personalizado TO anon;
GRANT ALL ON TABLE public.cuenta_grupo_personalizado TO authenticated;
GRANT ALL ON TABLE public.cuenta_grupo_personalizado TO service_role;


--
-- TOC entry 5780 (class 0 OID 0)
-- Dependencies: 324
-- Name: TABLE cuenta_impuesto; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta_impuesto TO anon;
GRANT ALL ON TABLE public.cuenta_impuesto TO authenticated;
GRANT ALL ON TABLE public.cuenta_impuesto TO service_role;


--
-- TOC entry 5781 (class 0 OID 0)
-- Dependencies: 323
-- Name: TABLE cuenta_iva; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta_iva TO anon;
GRANT ALL ON TABLE public.cuenta_iva TO authenticated;
GRANT ALL ON TABLE public.cuenta_iva TO service_role;


--
-- TOC entry 5782 (class 0 OID 0)
-- Dependencies: 316
-- Name: TABLE diario_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.diario_contable TO anon;
GRANT ALL ON TABLE public.diario_contable TO authenticated;
GRANT ALL ON TABLE public.diario_contable TO service_role;


--
-- TOC entry 5783 (class 0 OID 0)
-- Dependencies: 335
-- Name: TABLE documento_origen; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.documento_origen TO anon;
GRANT ALL ON TABLE public.documento_origen TO authenticated;
GRANT ALL ON TABLE public.documento_origen TO service_role;


--
-- TOC entry 5784 (class 0 OID 0)
-- Dependencies: 392
-- Name: TABLE duracion_unidad_catalogo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.duracion_unidad_catalogo TO anon;
GRANT ALL ON TABLE public.duracion_unidad_catalogo TO authenticated;
GRANT ALL ON TABLE public.duracion_unidad_catalogo TO service_role;


--
-- TOC entry 5785 (class 0 OID 0)
-- Dependencies: 282
-- Name: TABLE empresa; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.empresa TO anon;
GRANT ALL ON TABLE public.empresa TO authenticated;
GRANT ALL ON TABLE public.empresa TO service_role;


--
-- TOC entry 5786 (class 0 OID 0)
-- Dependencies: 299
-- Name: TABLE empresa_horario_apertura; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.empresa_horario_apertura TO anon;
GRANT ALL ON TABLE public.empresa_horario_apertura TO authenticated;
GRANT ALL ON TABLE public.empresa_horario_apertura TO service_role;


--
-- TOC entry 5787 (class 0 OID 0)
-- Dependencies: 295
-- Name: TABLE empresa_identificacion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.empresa_identificacion TO anon;
GRANT ALL ON TABLE public.empresa_identificacion TO authenticated;
GRANT ALL ON TABLE public.empresa_identificacion TO service_role;


--
-- TOC entry 5788 (class 0 OID 0)
-- Dependencies: 297
-- Name: TABLE empresa_red_social; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.empresa_red_social TO anon;
GRANT ALL ON TABLE public.empresa_red_social TO authenticated;
GRANT ALL ON TABLE public.empresa_red_social TO service_role;


--
-- TOC entry 5789 (class 0 OID 0)
-- Dependencies: 289
-- Name: TABLE entidad; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.entidad TO anon;
GRANT ALL ON TABLE public.entidad TO authenticated;
GRANT ALL ON TABLE public.entidad TO service_role;


--
-- TOC entry 5791 (class 0 OID 0)
-- Dependencies: 288
-- Name: SEQUENCE entidad_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.entidad_id_seq TO anon;
GRANT ALL ON SEQUENCE public.entidad_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.entidad_id_seq TO service_role;


--
-- TOC entry 5792 (class 0 OID 0)
-- Dependencies: 383
-- Name: TABLE envio; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.envio TO anon;
GRANT ALL ON TABLE public.envio TO authenticated;
GRANT ALL ON TABLE public.envio TO service_role;


--
-- TOC entry 5793 (class 0 OID 0)
-- Dependencies: 384
-- Name: TABLE envio_detalle; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.envio_detalle TO anon;
GRANT ALL ON TABLE public.envio_detalle TO authenticated;
GRANT ALL ON TABLE public.envio_detalle TO service_role;


--
-- TOC entry 5794 (class 0 OID 0)
-- Dependencies: 389
-- Name: TABLE estado_compra_item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.estado_compra_item TO anon;
GRANT ALL ON TABLE public.estado_compra_item TO authenticated;
GRANT ALL ON TABLE public.estado_compra_item TO service_role;


--
-- TOC entry 5795 (class 0 OID 0)
-- Dependencies: 388
-- Name: TABLE estado_venta_item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.estado_venta_item TO anon;
GRANT ALL ON TABLE public.estado_venta_item TO authenticated;
GRANT ALL ON TABLE public.estado_venta_item TO service_role;


--
-- TOC entry 5796 (class 0 OID 0)
-- Dependencies: 337
-- Name: TABLE factura; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.factura TO anon;
GRANT ALL ON TABLE public.factura TO authenticated;
GRANT ALL ON TABLE public.factura TO service_role;


--
-- TOC entry 5797 (class 0 OID 0)
-- Dependencies: 338
-- Name: TABLE factura_linea; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.factura_linea TO anon;
GRANT ALL ON TABLE public.factura_linea TO authenticated;
GRANT ALL ON TABLE public.factura_linea TO service_role;


--
-- TOC entry 5798 (class 0 OID 0)
-- Dependencies: 302
-- Name: TABLE forma_pago_catalogo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.forma_pago_catalogo TO anon;
GRANT ALL ON TABLE public.forma_pago_catalogo TO authenticated;
GRANT ALL ON TABLE public.forma_pago_catalogo TO service_role;


--
-- TOC entry 5799 (class 0 OID 0)
-- Dependencies: 329
-- Name: TABLE grupo_cuenta_personalizado; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.grupo_cuenta_personalizado TO anon;
GRANT ALL ON TABLE public.grupo_cuenta_personalizado TO authenticated;
GRANT ALL ON TABLE public.grupo_cuenta_personalizado TO service_role;


--
-- TOC entry 5800 (class 0 OID 0)
-- Dependencies: 345
-- Name: TABLE historial_conversion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.historial_conversion TO anon;
GRANT ALL ON TABLE public.historial_conversion TO authenticated;
GRANT ALL ON TABLE public.historial_conversion TO service_role;


--
-- TOC entry 5801 (class 0 OID 0)
-- Dependencies: 306
-- Name: TABLE impuestos; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.impuestos TO anon;
GRANT ALL ON TABLE public.impuestos TO authenticated;
GRANT ALL ON TABLE public.impuestos TO service_role;


--
-- TOC entry 5803 (class 0 OID 0)
-- Dependencies: 305
-- Name: SEQUENCE impuestos_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.impuestos_id_seq TO anon;
GRANT ALL ON SEQUENCE public.impuestos_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.impuestos_id_seq TO service_role;


--
-- TOC entry 5804 (class 0 OID 0)
-- Dependencies: 303
-- Name: TABLE incoterm_catalogo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.incoterm_catalogo TO anon;
GRANT ALL ON TABLE public.incoterm_catalogo TO authenticated;
GRANT ALL ON TABLE public.incoterm_catalogo TO service_role;


--
-- TOC entry 5805 (class 0 OID 0)
-- Dependencies: 336
-- Name: TABLE informe_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.informe_contable TO anon;
GRANT ALL ON TABLE public.informe_contable TO authenticated;
GRANT ALL ON TABLE public.informe_contable TO service_role;


--
-- TOC entry 5806 (class 0 OID 0)
-- Dependencies: 379
-- Name: TABLE inventario; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inventario TO anon;
GRANT ALL ON TABLE public.inventario TO authenticated;
GRANT ALL ON TABLE public.inventario TO service_role;


--
-- TOC entry 5807 (class 0 OID 0)
-- Dependencies: 380
-- Name: TABLE inventario_detalle; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inventario_detalle TO anon;
GRANT ALL ON TABLE public.inventario_detalle TO authenticated;
GRANT ALL ON TABLE public.inventario_detalle TO service_role;


--
-- TOC entry 5808 (class 0 OID 0)
-- Dependencies: 368
-- Name: TABLE item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.item TO anon;
GRANT ALL ON TABLE public.item TO authenticated;
GRANT ALL ON TABLE public.item TO service_role;


--
-- TOC entry 5809 (class 0 OID 0)
-- Dependencies: 378
-- Name: TABLE item_lote_serie; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.item_lote_serie TO anon;
GRANT ALL ON TABLE public.item_lote_serie TO authenticated;
GRANT ALL ON TABLE public.item_lote_serie TO service_role;


--
-- TOC entry 5810 (class 0 OID 0)
-- Dependencies: 333
-- Name: TABLE libro_mayor; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.libro_mayor TO anon;
GRANT ALL ON TABLE public.libro_mayor TO authenticated;
GRANT ALL ON TABLE public.libro_mayor TO service_role;


--
-- TOC entry 5811 (class 0 OID 0)
-- Dependencies: 370
-- Name: TABLE media; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.media TO anon;
GRANT ALL ON TABLE public.media TO authenticated;
GRANT ALL ON TABLE public.media TO service_role;


--
-- TOC entry 5812 (class 0 OID 0)
-- Dependencies: 287
-- Name: TABLE menu_item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.menu_item TO anon;
GRANT ALL ON TABLE public.menu_item TO authenticated;
GRANT ALL ON TABLE public.menu_item TO service_role;


--
-- TOC entry 5813 (class 0 OID 0)
-- Dependencies: 286
-- Name: TABLE menu_seccion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.menu_seccion TO anon;
GRANT ALL ON TABLE public.menu_seccion TO authenticated;
GRANT ALL ON TABLE public.menu_seccion TO service_role;


--
-- TOC entry 5814 (class 0 OID 0)
-- Dependencies: 310
-- Name: TABLE miembros; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.miembros TO anon;
GRANT ALL ON TABLE public.miembros TO authenticated;
GRANT ALL ON TABLE public.miembros TO service_role;


--
-- TOC entry 5816 (class 0 OID 0)
-- Dependencies: 309
-- Name: SEQUENCE miembros_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.miembros_id_seq TO anon;
GRANT ALL ON SEQUENCE public.miembros_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.miembros_id_seq TO service_role;


--
-- TOC entry 5817 (class 0 OID 0)
-- Dependencies: 317
-- Name: TABLE modelo_plan_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.modelo_plan_contable TO anon;
GRANT ALL ON TABLE public.modelo_plan_contable TO authenticated;
GRANT ALL ON TABLE public.modelo_plan_contable TO service_role;


--
-- TOC entry 5818 (class 0 OID 0)
-- Dependencies: 290
-- Name: TABLE moneda; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.moneda TO anon;
GRANT ALL ON TABLE public.moneda TO authenticated;
GRANT ALL ON TABLE public.moneda TO service_role;


--
-- TOC entry 5819 (class 0 OID 0)
-- Dependencies: 349
-- Name: TABLE movimiento_bancario; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.movimiento_bancario TO anon;
GRANT ALL ON TABLE public.movimiento_bancario TO authenticated;
GRANT ALL ON TABLE public.movimiento_bancario TO service_role;


--
-- TOC entry 5820 (class 0 OID 0)
-- Dependencies: 357
-- Name: TABLE movimiento_centro_costo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.movimiento_centro_costo TO anon;
GRANT ALL ON TABLE public.movimiento_centro_costo TO authenticated;
GRANT ALL ON TABLE public.movimiento_centro_costo TO service_role;


--
-- TOC entry 5821 (class 0 OID 0)
-- Dependencies: 332
-- Name: TABLE movimiento_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.movimiento_contable TO anon;
GRANT ALL ON TABLE public.movimiento_contable TO authenticated;
GRANT ALL ON TABLE public.movimiento_contable TO service_role;


--
-- TOC entry 5822 (class 0 OID 0)
-- Dependencies: 362
-- Name: TABLE movimiento_cuenta; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.movimiento_cuenta TO anon;
GRANT ALL ON TABLE public.movimiento_cuenta TO authenticated;
GRANT ALL ON TABLE public.movimiento_cuenta TO service_role;


--
-- TOC entry 5823 (class 0 OID 0)
-- Dependencies: 350
-- Name: TABLE movimiento_inventario; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.movimiento_inventario TO anon;
GRANT ALL ON TABLE public.movimiento_inventario TO authenticated;
GRANT ALL ON TABLE public.movimiento_inventario TO service_role;


--
-- TOC entry 5824 (class 0 OID 0)
-- Dependencies: 353
-- Name: TABLE nota_credito; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.nota_credito TO anon;
GRANT ALL ON TABLE public.nota_credito TO authenticated;
GRANT ALL ON TABLE public.nota_credito TO service_role;


--
-- TOC entry 5825 (class 0 OID 0)
-- Dependencies: 354
-- Name: TABLE nota_credito_linea; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.nota_credito_linea TO anon;
GRANT ALL ON TABLE public.nota_credito_linea TO authenticated;
GRANT ALL ON TABLE public.nota_credito_linea TO service_role;


--
-- TOC entry 5826 (class 0 OID 0)
-- Dependencies: 346
-- Name: TABLE pago; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pago TO anon;
GRANT ALL ON TABLE public.pago TO authenticated;
GRANT ALL ON TABLE public.pago TO service_role;


--
-- TOC entry 5827 (class 0 OID 0)
-- Dependencies: 347
-- Name: TABLE pago_factura; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pago_factura TO anon;
GRANT ALL ON TABLE public.pago_factura TO authenticated;
GRANT ALL ON TABLE public.pago_factura TO service_role;


--
-- TOC entry 5828 (class 0 OID 0)
-- Dependencies: 291
-- Name: TABLE pais; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pais TO anon;
GRANT ALL ON TABLE public.pais TO authenticated;
GRANT ALL ON TABLE public.pais TO service_role;


--
-- TOC entry 5829 (class 0 OID 0)
-- Dependencies: 284
-- Name: TABLE perfil; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.perfil TO anon;
GRANT ALL ON TABLE public.perfil TO authenticated;
GRANT ALL ON TABLE public.perfil TO service_role;


--
-- TOC entry 5830 (class 0 OID 0)
-- Dependencies: 311
-- Name: TABLE perfil_menu_permiso; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.perfil_menu_permiso TO anon;
GRANT ALL ON TABLE public.perfil_menu_permiso TO authenticated;
GRANT ALL ON TABLE public.perfil_menu_permiso TO service_role;


--
-- TOC entry 5831 (class 0 OID 0)
-- Dependencies: 320
-- Name: TABLE periodo_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.periodo_contable TO anon;
GRANT ALL ON TABLE public.periodo_contable TO authenticated;
GRANT ALL ON TABLE public.periodo_contable TO service_role;


--
-- TOC entry 5832 (class 0 OID 0)
-- Dependencies: 318
-- Name: TABLE plan_contable; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.plan_contable TO anon;
GRANT ALL ON TABLE public.plan_contable TO authenticated;
GRANT ALL ON TABLE public.plan_contable TO service_role;


--
-- TOC entry 5833 (class 0 OID 0)
-- Dependencies: 341
-- Name: TABLE prefactura; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.prefactura TO anon;
GRANT ALL ON TABLE public.prefactura TO authenticated;
GRANT ALL ON TABLE public.prefactura TO service_role;


--
-- TOC entry 5834 (class 0 OID 0)
-- Dependencies: 344
-- Name: TABLE prefactura_factura; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.prefactura_factura TO anon;
GRANT ALL ON TABLE public.prefactura_factura TO authenticated;
GRANT ALL ON TABLE public.prefactura_factura TO service_role;


--
-- TOC entry 5835 (class 0 OID 0)
-- Dependencies: 342
-- Name: TABLE prefactura_linea; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.prefactura_linea TO anon;
GRANT ALL ON TABLE public.prefactura_linea TO authenticated;
GRANT ALL ON TABLE public.prefactura_linea TO service_role;


--
-- TOC entry 5836 (class 0 OID 0)
-- Dependencies: 351
-- Name: TABLE presupuesto; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.presupuesto TO anon;
GRANT ALL ON TABLE public.presupuesto TO authenticated;
GRANT ALL ON TABLE public.presupuesto TO service_role;


--
-- TOC entry 5837 (class 0 OID 0)
-- Dependencies: 352
-- Name: TABLE presupuesto_linea; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.presupuesto_linea TO anon;
GRANT ALL ON TABLE public.presupuesto_linea TO authenticated;
GRANT ALL ON TABLE public.presupuesto_linea TO service_role;


--
-- TOC entry 5838 (class 0 OID 0)
-- Dependencies: 292
-- Name: TABLE provincia; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.provincia TO anon;
GRANT ALL ON TABLE public.provincia TO authenticated;
GRANT ALL ON TABLE public.provincia TO service_role;


--
-- TOC entry 5839 (class 0 OID 0)
-- Dependencies: 385
-- Name: TABLE recepcion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.recepcion TO anon;
GRANT ALL ON TABLE public.recepcion TO authenticated;
GRANT ALL ON TABLE public.recepcion TO service_role;


--
-- TOC entry 5840 (class 0 OID 0)
-- Dependencies: 386
-- Name: TABLE recepcion_detalle; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.recepcion_detalle TO anon;
GRANT ALL ON TABLE public.recepcion_detalle TO authenticated;
GRANT ALL ON TABLE public.recepcion_detalle TO service_role;


--
-- TOC entry 5841 (class 0 OID 0)
-- Dependencies: 355
-- Name: TABLE retencion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.retencion TO anon;
GRANT ALL ON TABLE public.retencion TO authenticated;
GRANT ALL ON TABLE public.retencion TO service_role;


--
-- TOC entry 5842 (class 0 OID 0)
-- Dependencies: 334
-- Name: TABLE saldo_cuenta; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.saldo_cuenta TO anon;
GRANT ALL ON TABLE public.saldo_cuenta TO authenticated;
GRANT ALL ON TABLE public.saldo_cuenta TO service_role;


--
-- TOC entry 5844 (class 0 OID 0)
-- Dependencies: 372
-- Name: TABLE secuencia_asiento; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.secuencia_asiento TO anon;
GRANT ALL ON TABLE public.secuencia_asiento TO authenticated;
GRANT ALL ON TABLE public.secuencia_asiento TO service_role;


--
-- TOC entry 5846 (class 0 OID 0)
-- Dependencies: 371
-- Name: SEQUENCE secuencia_asiento_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.secuencia_asiento_id_seq TO anon;
GRANT ALL ON SEQUENCE public.secuencia_asiento_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.secuencia_asiento_id_seq TO service_role;


--
-- TOC entry 5847 (class 0 OID 0)
-- Dependencies: 296
-- Name: TABLE social_network; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.social_network TO anon;
GRANT ALL ON TABLE public.social_network TO authenticated;
GRANT ALL ON TABLE public.social_network TO service_role;


--
-- TOC entry 5848 (class 0 OID 0)
-- Dependencies: 377
-- Name: TABLE stock_item_almacen; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.stock_item_almacen TO anon;
GRANT ALL ON TABLE public.stock_item_almacen TO authenticated;
GRANT ALL ON TABLE public.stock_item_almacen TO service_role;


--
-- TOC entry 5849 (class 0 OID 0)
-- Dependencies: 283
-- Name: TABLE sucursal; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sucursal TO anon;
GRANT ALL ON TABLE public.sucursal TO authenticated;
GRANT ALL ON TABLE public.sucursal TO service_role;


--
-- TOC entry 5850 (class 0 OID 0)
-- Dependencies: 304
-- Name: TABLE tercero; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tercero TO anon;
GRANT ALL ON TABLE public.tercero TO authenticated;
GRANT ALL ON TABLE public.tercero TO service_role;


--
-- TOC entry 5851 (class 0 OID 0)
-- Dependencies: 358
-- Name: TABLE tipo_cambio; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipo_cambio TO anon;
GRANT ALL ON TABLE public.tipo_cambio TO authenticated;
GRANT ALL ON TABLE public.tipo_cambio TO service_role;


--
-- TOC entry 5852 (class 0 OID 0)
-- Dependencies: 390
-- Name: TABLE tipo_control_caducidad_item; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipo_control_caducidad_item TO anon;
GRANT ALL ON TABLE public.tipo_control_caducidad_item TO authenticated;
GRANT ALL ON TABLE public.tipo_control_caducidad_item TO service_role;


--
-- TOC entry 5853 (class 0 OID 0)
-- Dependencies: 294
-- Name: TABLE tipo_entidad_comercial; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipo_entidad_comercial TO anon;
GRANT ALL ON TABLE public.tipo_entidad_comercial TO authenticated;
GRANT ALL ON TABLE public.tipo_entidad_comercial TO service_role;


--
-- TOC entry 5855 (class 0 OID 0)
-- Dependencies: 293
-- Name: SEQUENCE tipo_entidad_comercial_id_tipo_entidad_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tipo_entidad_comercial_id_tipo_entidad_seq TO anon;
GRANT ALL ON SEQUENCE public.tipo_entidad_comercial_id_tipo_entidad_seq TO authenticated;
GRANT ALL ON SEQUENCE public.tipo_entidad_comercial_id_tipo_entidad_seq TO service_role;


--
-- TOC entry 5856 (class 0 OID 0)
-- Dependencies: 391
-- Name: TABLE tipo_item_catalogo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipo_item_catalogo TO anon;
GRANT ALL ON TABLE public.tipo_item_catalogo TO authenticated;
GRANT ALL ON TABLE public.tipo_item_catalogo TO service_role;


--
-- TOC entry 5857 (class 0 OID 0)
-- Dependencies: 300
-- Name: TABLE tipo_tercero_catalogo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipo_tercero_catalogo TO anon;
GRANT ALL ON TABLE public.tipo_tercero_catalogo TO authenticated;
GRANT ALL ON TABLE public.tipo_tercero_catalogo TO service_role;


--
-- TOC entry 5858 (class 0 OID 0)
-- Dependencies: 374
-- Name: TABLE tipo_unidad_medida; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipo_unidad_medida TO anon;
GRANT ALL ON TABLE public.tipo_unidad_medida TO authenticated;
GRANT ALL ON TABLE public.tipo_unidad_medida TO service_role;


--
-- TOC entry 5859 (class 0 OID 0)
-- Dependencies: 308
-- Name: TABLE tipos_miembro; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tipos_miembro TO anon;
GRANT ALL ON TABLE public.tipos_miembro TO authenticated;
GRANT ALL ON TABLE public.tipos_miembro TO service_role;


--
-- TOC entry 5861 (class 0 OID 0)
-- Dependencies: 307
-- Name: SEQUENCE tipos_miembro_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tipos_miembro_id_seq TO anon;
GRANT ALL ON SEQUENCE public.tipos_miembro_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.tipos_miembro_id_seq TO service_role;


--
-- TOC entry 5862 (class 0 OID 0)
-- Dependencies: 360
-- Name: TABLE titular_cuenta; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.titular_cuenta TO anon;
GRANT ALL ON TABLE public.titular_cuenta TO authenticated;
GRANT ALL ON TABLE public.titular_cuenta TO service_role;


--
-- TOC entry 5863 (class 0 OID 0)
-- Dependencies: 381
-- Name: TABLE transferencia_stock; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transferencia_stock TO anon;
GRANT ALL ON TABLE public.transferencia_stock TO authenticated;
GRANT ALL ON TABLE public.transferencia_stock TO service_role;


--
-- TOC entry 5864 (class 0 OID 0)
-- Dependencies: 382
-- Name: TABLE transferencia_stock_detalle; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transferencia_stock_detalle TO anon;
GRANT ALL ON TABLE public.transferencia_stock_detalle TO authenticated;
GRANT ALL ON TABLE public.transferencia_stock_detalle TO service_role;


--
-- TOC entry 5865 (class 0 OID 0)
-- Dependencies: 375
-- Name: TABLE unidad_medida; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.unidad_medida TO anon;
GRANT ALL ON TABLE public.unidad_medida TO authenticated;
GRANT ALL ON TABLE public.unidad_medida TO service_role;


--
-- TOC entry 5866 (class 0 OID 0)
-- Dependencies: 285
-- Name: TABLE usuario; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.usuario TO anon;
GRANT ALL ON TABLE public.usuario TO authenticated;
GRANT ALL ON TABLE public.usuario TO service_role;


--
-- TOC entry 5867 (class 0 OID 0)
-- Dependencies: 363
-- Name: TABLE vw_saldos_cuentas; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.vw_saldos_cuentas TO anon;
GRANT ALL ON TABLE public.vw_saldos_cuentas TO authenticated;
GRANT ALL ON TABLE public.vw_saldos_cuentas TO service_role;


--
-- TOC entry 5868 (class 0 OID 0)
-- Dependencies: 281
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- TOC entry 5869 (class 0 OID 0)
-- Dependencies: 273
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- TOC entry 5870 (class 0 OID 0)
-- Dependencies: 276
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- TOC entry 5871 (class 0 OID 0)
-- Dependencies: 275
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- TOC entry 5873 (class 0 OID 0)
-- Dependencies: 256
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.buckets FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- TOC entry 5874 (class 0 OID 0)
-- Dependencies: 313
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- TOC entry 5875 (class 0 OID 0)
-- Dependencies: 364
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- TOC entry 5877 (class 0 OID 0)
-- Dependencies: 257
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.objects FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- TOC entry 5878 (class 0 OID 0)
-- Dependencies: 312
-- Name: TABLE prefixes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.prefixes TO service_role;
GRANT ALL ON TABLE storage.prefixes TO authenticated;
GRANT ALL ON TABLE storage.prefixes TO anon;


--
-- TOC entry 5879 (class 0 OID 0)
-- Dependencies: 277
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- TOC entry 5880 (class 0 OID 0)
-- Dependencies: 278
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- TOC entry 5881 (class 0 OID 0)
-- Dependencies: 365
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- TOC entry 5882 (class 0 OID 0)
-- Dependencies: 259
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- TOC entry 5883 (class 0 OID 0)
-- Dependencies: 260
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- TOC entry 2793 (class 826 OID 16601)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- TOC entry 2794 (class 826 OID 16602)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- TOC entry 2792 (class 826 OID 16600)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- TOC entry 2803 (class 826 OID 16680)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- TOC entry 2802 (class 826 OID 16679)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- TOC entry 2801 (class 826 OID 16678)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- TOC entry 2806 (class 826 OID 16635)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2805 (class 826 OID 16634)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2804 (class 826 OID 16633)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2798 (class 826 OID 16615)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2800 (class 826 OID 16614)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2799 (class 826 OID 16613)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2785 (class 826 OID 16488)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2786 (class 826 OID 16489)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2784 (class 826 OID 16487)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2788 (class 826 OID 16491)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2783 (class 826 OID 16486)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2787 (class 826 OID 16490)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2796 (class 826 OID 16605)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- TOC entry 2797 (class 826 OID 16606)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- TOC entry 2795 (class 826 OID 16604)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- TOC entry 2791 (class 826 OID 16543)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2790 (class 826 OID 16542)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2789 (class 826 OID 16541)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 3973 (class 3466 OID 16619)
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- TOC entry 3978 (class 3466 OID 16698)
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- TOC entry 3972 (class 3466 OID 16617)
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- TOC entry 3979 (class 3466 OID 16701)
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- TOC entry 3974 (class 3466 OID 16620)
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- TOC entry 3975 (class 3466 OID 16621)
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

-- Completed on 2026-03-08 19:51:11

--
-- PostgreSQL database dump complete
--


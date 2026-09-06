"""
Integración SP kardex contra Postgres de test.

Requiere DATABASE_URL_TEST (nunca DATABASE_URL de prod/Supabase).
Sin esa variable: skip (CI verde).
"""
from __future__ import annotations

import os

import pytest

pytestmark = pytest.mark.integration

_DB_URL = (os.environ.get('DATABASE_URL_TEST') or '').strip()


def _has_test_db() -> bool:
    return bool(_DB_URL) and 'supabase' not in _DB_URL.lower()


@pytest.fixture(scope='module')
def pg_conn():
    if not _has_test_db():
        pytest.skip('DATABASE_URL_TEST no configurada (BD test dedicada)')
    try:
        import psycopg2
    except ImportError:
        pytest.skip('psycopg2 no instalado')
    conn = psycopg2.connect(_DB_URL)
    try:
        yield conn
    finally:
        conn.close()


def test_sp_almacen_crear_existe(pg_conn):
    """Contrato: función/SP sp_almacen_crear debe existir en el esquema público."""
    with pg_conn.cursor() as cur:
        cur.execute(
            """
            SELECT 1
            FROM pg_proc p
            JOIN pg_namespace n ON n.oid = p.pronamespace
            WHERE n.nspname = 'public' AND p.proname = 'sp_almacen_crear'
            LIMIT 1
            """
        )
        row = cur.fetchone()
    assert row is not None, 'Falta sp_almacen_crear en BD test; aplicar docs/sql/sp/'


def test_sp_stock_saldo_upsert_existe(pg_conn):
    with pg_conn.cursor() as cur:
        cur.execute(
            """
            SELECT 1
            FROM pg_proc p
            JOIN pg_namespace n ON n.oid = p.pronamespace
            WHERE n.nspname = 'public' AND p.proname = 'sp_stock_saldo_upsert'
            LIMIT 1
            """
        )
        row = cur.fetchone()
    assert row is not None, 'Falta sp_stock_saldo_upsert en BD test'


def test_sp_movimiento_inventario_crear_existe(pg_conn):
    with pg_conn.cursor() as cur:
        cur.execute(
            """
            SELECT 1
            FROM pg_proc p
            JOIN pg_namespace n ON n.oid = p.pronamespace
            WHERE n.nspname = 'public' AND p.proname = 'sp_movimiento_inventario_crear'
            LIMIT 1
            """
        )
        row = cur.fetchone()
    assert row is not None, 'Falta sp_movimiento_inventario_crear en BD test'

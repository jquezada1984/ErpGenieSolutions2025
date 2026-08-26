"""Conexión PostgreSQL (misma DATABASE_URL que el resto del ERP)."""
from __future__ import annotations

import os
from contextlib import contextmanager

import psycopg2
import psycopg2.extras

DATABASE_URL = (os.getenv('DATABASE_URL') or '').strip()


def get_conn():
    if not DATABASE_URL:
        raise RuntimeError('Configure DATABASE_URL')
    return psycopg2.connect(DATABASE_URL)


@contextmanager
def cursor(dict_rows: bool = True):
    conn = get_conn()
    try:
        factory = psycopg2.extras.RealDictCursor if dict_rows else None
        cur = conn.cursor(cursor_factory=factory)
        try:
            yield cur
            conn.commit()
        finally:
            cur.close()
    finally:
        conn.close()

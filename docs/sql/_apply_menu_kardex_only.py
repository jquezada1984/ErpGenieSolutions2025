"""Aplica solo el SQL de menú Kardex/Stock."""
import os
import sys
from pathlib import Path

try:
    from dotenv import load_dotenv
except ImportError:
    import subprocess
    subprocess.check_call(
        [sys.executable, "-m", "pip", "install", "python-dotenv", "psycopg2-binary", "-q"]
    )
    from dotenv import load_dotenv

import psycopg2

ROOT = Path(r"c:\proyectos\ErpGenieSolutions2025")
load_dotenv(ROOT / "InicioNestJs" / ".env")
url = os.getenv("DATABASE_URL")
if not url:
    print("FAIL: DATABASE_URL missing")
    sys.exit(1)

sql_path = ROOT / "docs" / "sql" / "2026-08-31_menu_kardex_stock.sql"
sql = sql_path.read_text(encoding="utf-8")
print(f"Applying {sql_path.name} ...")

conn = psycopg2.connect(url)
conn.autocommit = False
cur = conn.cursor()
try:
    cur.execute(sql)
    conn.commit()
    print("OK: menu SQL applied")
except Exception as e:
    conn.rollback()
    print(f"FAIL: {e}")
    sys.exit(1)
finally:
    cur.close()
    conn.close()

# verify
conn = psycopg2.connect(url)
cur = conn.cursor()
routes = [
    "/items/almacenes",
    "/items/productos/stocks",
    "/items/stock/movimientos",
    "/items/stock/transferencias",
    "/items/stock/cambio-masivo",
]
cur.execute(
    "SELECT ruta, etiqueta FROM public.menu_item WHERE ruta = ANY(%s) ORDER BY ruta",
    (routes,),
)
rows = cur.fetchall()
by = {r[0]: r[1] for r in rows}
print("--- verify ---")
missing = []
for r in routes:
    if r in by:
        print(f"OK: {r} -> {by[r]}")
    else:
        print(f"FAIL: {r}")
        missing.append(r)
cur.close()
conn.close()
sys.exit(1 if missing else 0)

"""Aplica alineación de menú Kardex y verifica rutas."""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import psycopg2

ROOT = Path(r"c:\proyectos\ErpGenieSolutions2025")
load_dotenv(ROOT / "InicioNestJs" / ".env")
url = os.getenv("DATABASE_URL")
sql = (ROOT / "docs" / "sql" / "2026-08-31_menu_kardex_stock_align.sql").read_text(encoding="utf-8")

conn = psycopg2.connect(url)
conn.autocommit = False
cur = conn.cursor()
try:
    cur.execute(sql)
    conn.commit()
    print("OK: align SQL applied")
except Exception as e:
    conn.rollback()
    print(f"FAIL: {e}")
    sys.exit(1)
finally:
    cur.close()
    conn.close()

conn = psycopg2.connect(url)
cur = conn.cursor()
routes = [
    "/items/almacenes",
    "/items/productos/stocks",
    "/items/stock/movimientos",
    "/items/stock/transferencias",
    "/items/stock/cambio-masivo",
    "/items/stock/consultas",
]
cur.execute(
    "SELECT ruta, etiqueta, estado FROM public.menu_item WHERE ruta = ANY(%s) ORDER BY ruta",
    (routes,),
)
by = {r[0]: r for r in cur.fetchall()}
missing = []
for r in routes:
    if r in by and by[r][2]:
        print(f"OK: {r} -> {by[r][1]}")
    else:
        print(f"FAIL: {r}")
        missing.append(r)
cur.close()
conn.close()
sys.exit(1 if missing else 0)

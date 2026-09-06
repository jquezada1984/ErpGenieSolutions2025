"""Follow-up check: SPs + menu routes for Kardex (fases 0–4)."""
from pathlib import Path
import re
import sys

import psycopg2

ROOT = Path(__file__).resolve().parents[2]
env = (ROOT / "InicioNestJs" / ".env").read_text(encoding="utf-8", errors="ignore")
url = re.search(r"DATABASE_URL=(.+)", env).group(1).strip().strip('"').strip("'")

conn = psycopg2.connect(url, sslmode="require")
cur = conn.cursor()

sps = [
    "sp_almacen_crear",
    "sp_almacen_actualizar",
    "sp_stock_saldo_upsert",
    "sp_movimiento_inventario_crear",
    "sp_transferencia_stock_crear",
    "sp_transferencia_stock_completar",
    "sp_cambio_masivo_crear",
    "sp_cambio_masivo_completar",
    "sp_inventario_cerrar",
    "sp_lote_serie_upsert",
    "sp_stock_a_fecha",
    "sp_stock_reposicion",
    "sp_stock_valoracion_pmp",
    "sp_contabilidad_procesar_ajuste_inventario",
]
cur.execute(
    """
    SELECT p.proname
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = ANY(%s)
    ORDER BY 1
    """,
    (sps,),
)
found = {r[0] for r in cur.fetchall()}
print("--- SPs ---")
missing_sps = [s for s in sps if s not in found]
for s in sps:
    print(f"{'OK' if s in found else 'FAIL'}: {s}")

routes = [
    "/items/almacenes",
    "/items/productos/stocks",
    "/items/stock/movimientos",
    "/items/stock/transferencias",
    "/items/stock/cambio-masivo",
    "/items/stock/consultas",
]
print("--- menu routes ---")
cur.execute(
    """
    SELECT ruta, etiqueta, estado
    FROM public.menu_item
    WHERE ruta = ANY(%s)
    ORDER BY ruta
    """,
    (routes,),
)
by_ruta = {r[0]: r for r in cur.fetchall()}
missing_menu = []
for r in routes:
    row = by_ruta.get(r)
    if row and row[2]:
        print(f"OK: {r} -> {row[1]}")
    else:
        print(f"FAIL: {r}")
        missing_menu.append(r)

print("--- summary ---")
print(f"missing_sps={missing_sps}")
print(f"missing_menu={missing_menu}")
cur.close()
conn.close()
sys.exit(1 if missing_sps or missing_menu else 0)

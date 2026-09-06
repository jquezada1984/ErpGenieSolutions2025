"""Aplica FKs + SPs Kardex (+ fase 4 / INV) + menú a la BD viva."""
from pathlib import Path
import re
import sys

import psycopg2

ROOT = Path(__file__).resolve().parents[3]
env = (ROOT / "InicioNestJs" / ".env").read_text(encoding="utf-8", errors="ignore")
m = re.search(r"DATABASE_URL=(.+)", env)
if not m:
    print("DATABASE_URL no encontrada", file=sys.stderr)
    sys.exit(1)
url = m.group(1).strip().strip('"').strip("'")

files = [
    ROOT / "docs" / "sql" / "almacenes_v1_fks_cambio_masivo.sql",
    ROOT / "docs" / "sql" / "sp" / "sp_almacen_crear.sql",
    ROOT / "docs" / "sql" / "sp" / "sp_almacen_actualizar.sql",
    ROOT / "docs" / "sql" / "sp" / "sp_stock_saldo_upsert.sql",
    ROOT / "docs" / "sql" / "sp" / "sp_movimiento_inventario_crear.sql",
    ROOT / "docs" / "sql" / "sp" / "sp_transferencia_stock_crear.sql",
    ROOT / "docs" / "sql" / "sp" / "sp_transferencia_stock_completar.sql",
    ROOT / "docs" / "sql" / "sp" / "sp_cambio_masivo_crear.sql",
    ROOT / "docs" / "sql" / "sp" / "sp_cambio_masivo_completar.sql",
    ROOT / "docs" / "sql" / "sp" / "sp_inventario_cerrar.sql",
    ROOT / "docs" / "sql" / "sp" / "sp_lote_serie_upsert.sql",
    ROOT / "docs" / "sql" / "sp" / "sp_stock_a_fecha.sql",
    ROOT / "docs" / "sql" / "sp" / "sp_stock_reposicion.sql",
    ROOT / "docs" / "sql" / "sp" / "sp_stock_valoracion_pmp.sql",
    ROOT / "docs" / "sql" / "sp" / "sp_contabilidad_procesar_ajuste_inventario.sql",
    ROOT / "docs" / "sql" / "2026-08-31_menu_kardex_stock.sql",
    ROOT / "docs" / "sql" / "2026-08-31_menu_kardex_stock_align.sql",
]

conn = psycopg2.connect(url, sslmode="require")
conn.autocommit = False
cur = conn.cursor()
ok = 0
errors = []
for f in files:
    if not f.exists():
        print(f">>> {f.name}")
        print("    ERROR: archivo no existe")
        errors.append(f.name)
        continue
    sql = f.read_text(encoding="utf-8")
    print(f">>> {f.name}")
    try:
        cur.execute(sql)
        conn.commit()
        ok += 1
        print("    OK")
    except Exception as e:
        conn.rollback()
        errors.append(f"{f.name}: {e}")
        print(f"    ERROR: {e}")

# Verificación
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
print("--- SPs en BD ---")
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
cur.execute(
    "SELECT ruta, etiqueta FROM public.menu_item WHERE ruta = ANY(%s) ORDER BY ruta",
    (routes,),
)
by = {r[0]: r[1] for r in cur.fetchall()}
print("--- menú ---")
for r in routes:
    print(f"{'OK' if r in by else 'FAIL'}: {r}" + (f" -> {by[r]}" if r in by else ""))

cur.close()
conn.close()
print(f"Aplicados {ok}/{len(files)}")
if errors or (set(sps) - found) or any(r not in by for r in routes):
    sys.exit(1)
print("TODO OK")

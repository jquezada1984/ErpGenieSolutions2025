"""Diagnóstico menú Kardex en BD viva."""
from pathlib import Path
import re
import sys

import psycopg2

ROOT = Path(__file__).resolve().parents[2]
env = (ROOT / "InicioNestJs" / ".env").read_text(encoding="utf-8", errors="ignore")
url = re.search(r"DATABASE_URL=(.+)", env).group(1).strip().strip('"').strip("'")
conn = psycopg2.connect(url, sslmode="require")
cur = conn.cursor()

cur.execute(
    """
    SELECT column_name FROM information_schema.columns
    WHERE table_schema='public' AND table_name='menu_item'
    ORDER BY ordinal_position
    """
)
print("cols:", [r[0] for r in cur.fetchall()])

ids = [
    "b1c2d3e4-f5a6-4789-a012-697465000030",
    "b1c2d3e4-f5a6-4789-a012-697465000031",
    "b1c2d3e4-f5a6-4789-a012-697465000032",
    "b1c2d3e4-f5a6-4789-a012-697465000033",
    "b1c2d3e4-f5a6-4789-a012-697465000034",
    "b1c2d3e4-f5a6-4789-a012-697465000035",
    "b1c2d3e4-f5a6-4789-a012-697465000036",
]
cur.execute(
    "SELECT id_item, etiqueta, ruta, parent_id, estado FROM public.menu_item WHERE id_item = ANY(%s::uuid[]) ORDER BY etiqueta",
    (ids,),
)
print("--- by id_item ---")
for r in cur.fetchall():
    print(r)

cur.execute(
    """
    SELECT id_item, etiqueta, ruta, parent_id, estado
    FROM public.menu_item
    WHERE ruta IN (
      '/items/almacenes','/items/productos/stocks','/items/stock/movimientos',
      '/items/stock/transferencias','/items/stock/cambio-masivo','/items/stock/consultas'
    )
    OR etiqueta ILIKE '%Almacenes%' OR etiqueta ILIKE '%Stock%' OR etiqueta ILIKE '%Kardex%'
    ORDER BY ruta nulls last, etiqueta
    """
)
print("--- by ruta/etiqueta ---")
for r in cur.fetchall():
    print(r)

cur.execute("SELECT id_seccion, nombre FROM public.menu_seccion ORDER BY nombre LIMIT 20")
print("--- secciones ---")
for r in cur.fetchall():
    print(r)

cur.close()
conn.close()

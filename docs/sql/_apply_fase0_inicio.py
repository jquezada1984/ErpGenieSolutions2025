"""Aplica migración impuestos por empresa + menú hub config."""
from pathlib import Path
import re
import sys

import psycopg2

ROOT = Path(__file__).resolve().parents[2]
env = (ROOT / "InicioNestJs" / ".env").read_text(encoding="utf-8", errors="ignore")
url = re.search(r"DATABASE_URL=(.+)", env).group(1).strip().strip('"').strip("'")

files = [
    ROOT / "docs" / "sql" / "2026-09-05_impuestos_por_empresa.sql",
    ROOT / "docs" / "sql" / "2026-09-05_menu_config_hub_empresa.sql",
]

conn = psycopg2.connect(url, sslmode="require")
conn.autocommit = False
cur = conn.cursor()
for f in files:
    print(f">>> {f.name}")
    try:
        cur.execute(f.read_text(encoding="utf-8"))
        conn.commit()
        print("    OK")
    except Exception as e:
        conn.rollback()
        print(f"    ERROR: {e}")
        sys.exit(1)

cur.execute(
    """
    SELECT column_name FROM information_schema.columns
    WHERE table_name='impuestos' AND column_name IN ('id_empresa','codigo','activo')
    ORDER BY 1
    """
)
print("cols:", [r[0] for r in cur.fetchall()])
cur.execute("SELECT COUNT(*), COUNT(DISTINCT id_empresa) FROM impuestos")
print("impuestos rows/empresas:", cur.fetchall())
cur.execute(
    """
    SELECT mi.etiqueta, mi.ruta, mi.es_clickable
    FROM menu_item mi
    JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
    WHERE ms.nombre='Inicio' AND (mi.etiqueta='Configuración' OR mi.ruta LIKE '/configuracion%')
    ORDER BY mi.parent_id NULLS FIRST, mi.orden
    """
)
print("menu:")
for r in cur.fetchall():
    print(" ", r)
cur.close()
conn.close()
print("TODO OK")

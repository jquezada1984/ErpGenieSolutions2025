from pathlib import Path
import re
import sys
import psycopg2

ROOT = Path(__file__).resolve().parents[2]
env = (ROOT / "InicioNestJs" / ".env").read_text(encoding="utf-8", errors="ignore")
url = re.search(r"DATABASE_URL=(.+)", env).group(1).strip().strip('"').strip("'")
sql = (ROOT / "docs" / "sql" / "2026-09-05_menu_dashboards_modulos.sql").read_text(encoding="utf-8")
conn = psycopg2.connect(url, sslmode="require")
conn.autocommit = False
cur = conn.cursor()
try:
    cur.execute(sql)
    conn.commit()
    print("OK: menu dashboards")
except Exception as e:
    conn.rollback()
    print("ERROR:", e)
    sys.exit(1)
cur.execute(
    """
    SELECT ruta, etiqueta FROM menu_item
    WHERE ruta LIKE '%/dashboard'
    ORDER BY ruta
    """
)
for r in cur.fetchall():
    print(r)
cur.close()
conn.close()

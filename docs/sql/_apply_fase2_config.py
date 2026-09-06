"""Aplica empresa_config + funciones SP Fase 2."""
from pathlib import Path
import re
import sys
import psycopg2

ROOT = Path(__file__).resolve().parents[2]
env = (ROOT / "InicioNestJs" / ".env").read_text(encoding="utf-8", errors="ignore")
url = re.search(r"DATABASE_URL=(.+)", env).group(1).strip().strip('"').strip("'")
sql = (ROOT / "docs" / "sql" / "2026-09-05_empresa_config.sql").read_text(encoding="utf-8")
conn = psycopg2.connect(url, sslmode="require")
conn.autocommit = False
cur = conn.cursor()
try:
    cur.execute(sql)
    conn.commit()
    print("OK: empresa_config + SP")
except Exception as e:
    conn.rollback()
    print("ERROR:", e)
    sys.exit(1)
cur.execute(
    """
    SELECT proname FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname='public' AND proname LIKE 'sp_%config%'
    ORDER BY 1
    """
)
print("fns:", [r[0] for r in cur.fetchall()])
cur.close()
conn.close()

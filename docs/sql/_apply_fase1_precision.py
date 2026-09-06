"""Aplica SQL Fase 1 precisión/PDF empresa."""
from pathlib import Path
import re
import sys
import psycopg2

ROOT = Path(__file__).resolve().parents[2]
env = (ROOT / "InicioNestJs" / ".env").read_text(encoding="utf-8", errors="ignore")
url = re.search(r"DATABASE_URL=(.+)", env).group(1).strip().strip('"').strip("'")
sql = (ROOT / "docs" / "sql" / "2026-09-05_empresa_precision_pdf.sql").read_text(encoding="utf-8")
conn = psycopg2.connect(url, sslmode="require")
conn.autocommit = False
cur = conn.cursor()
try:
    cur.execute(sql)
    conn.commit()
    print("OK: empresa precision/pdf")
except Exception as e:
    conn.rollback()
    print("ERROR:", e)
    sys.exit(1)
cur.execute(
    """
    SELECT column_name FROM information_schema.columns
    WHERE table_name='empresa' AND column_name LIKE 'decimal%'
       OR (table_name='empresa' AND column_name LIKE 'pdf_%')
       OR (table_name='empresa' AND column_name='id_formato_papel')
    ORDER BY 1
    """
)
print("cols:", [r[0] for r in cur.fetchall()])
cur.close()
conn.close()

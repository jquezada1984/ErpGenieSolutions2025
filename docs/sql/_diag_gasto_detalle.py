from pathlib import Path
import re
import psycopg2

ROOT = Path(r"c:\proyectos\ErpGenieSolutions2025")
env = (ROOT / "InicioNestJs" / ".env").read_text(encoding="utf-8", errors="ignore")
url = re.search(r"DATABASE_URL=(.+)", env).group(1).strip().strip('"').strip("'")
conn = psycopg2.connect(url, sslmode="require")
cur = conn.cursor()
cur.execute(
    """
    SELECT column_name FROM information_schema.columns
    WHERE table_name='gasto_detalle' ORDER BY ordinal_position
    """
)
print("gasto_detalle cols:", [r[0] for r in cur.fetchall()])
cur.execute("SELECT COUNT(*), COUNT(impuesto_id) FROM gasto_detalle")
print("gasto_detalle counts:", cur.fetchall())
cur.close()
conn.close()

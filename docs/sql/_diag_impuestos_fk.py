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
    SELECT tc.table_name, kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND ccu.table_name = 'impuestos'
    ORDER BY 1, 2
    """
)
print("FKs to impuestos:", cur.fetchall())
cur.execute(
    """
    SELECT column_name FROM information_schema.columns
    WHERE table_name='impuestos' ORDER BY ordinal_position
    """
)
print("impuestos cols now:", [r[0] for r in cur.fetchall()])
cur.execute("SELECT id, id_empresa::text, codigo, nombre, tasa FROM impuestos ORDER BY id LIMIT 20")
print("sample:", cur.fetchall())
cur.close()
conn.close()

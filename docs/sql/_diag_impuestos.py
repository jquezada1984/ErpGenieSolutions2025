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
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_schema='public' AND table_name='impuestos'
    ORDER BY ordinal_position
    """
)
print("impuestos cols:", cur.fetchall())
cur.execute("SELECT * FROM impuestos ORDER BY id")
print("impuestos rows:", cur.fetchall())
cur.execute(
    "SELECT COUNT(*) AS n, COUNT(DISTINCT impuesto_id) AS ids FROM item WHERE impuesto_id IS NOT NULL"
)
print("items with impuesto:", cur.fetchall())
cur.execute("SELECT id_empresa::text, nombre FROM empresa LIMIT 8")
print("empresas:", cur.fetchall())
cur.execute(
    """
    SELECT mi.id_item::text, mi.etiqueta, mi.ruta, mi.es_clickable, mi.parent_id::text
    FROM menu_item mi
    JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
    WHERE ms.nombre = 'Inicio' AND (mi.etiqueta ILIKE '%config%' OR mi.ruta ILIKE '/configuracion%')
    ORDER BY mi.parent_id NULLS FIRST, mi.orden
    """
)
print("menu config:", cur.fetchall())
cur.close()
conn.close()

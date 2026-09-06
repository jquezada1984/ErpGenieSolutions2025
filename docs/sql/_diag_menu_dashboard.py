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
    SELECT ms.nombre, mi.etiqueta, mi.ruta, mi.orden, mi.parent_id IS NULL AS es_raiz
    FROM menu_item mi
    JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
    WHERE mi.etiqueta ILIKE %s OR mi.ruta ILIKE %s OR mi.ruta = %s
    ORDER BY ms.nombre, mi.orden NULLS LAST
    """,
    ("%ashboard%", "%dashboard%", "/dashboard"),
)
print("--- dashboards ---")
for r in cur.fetchall():
    print(r)
cur.execute(
    """
    SELECT ms.nombre, mi.etiqueta, mi.ruta, mi.orden
    FROM menu_item mi
    JOIN menu_seccion ms ON ms.id_seccion = mi.id_seccion
    WHERE ms.nombre IN ('Terceros','Producto|Servicio','Financiero','Financiera','Bancos|Cajas','Inicio','Comercial')
      AND mi.parent_id IS NULL
    ORDER BY ms.nombre, mi.orden
    """
)
print("--- roots ---")
for r in cur.fetchall():
    print(r)
cur.close()
conn.close()

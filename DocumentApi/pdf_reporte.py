"""Informe estadístico con gráfico incrustado (totales facturas por mes)."""
from __future__ import annotations

import io

from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader

from charts import series_mes_png
from db import cursor
from pdf_base import PAGE_W, MARGIN, dibujar_cabecera_empresa, nuevo_canvas, pie_pagina


def generar_reporte_estadistico(id_empresa: str) -> bytes:
    with cursor() as cur:
        cur.execute(
            """SELECT to_char(fecha_factura, 'YYYY-MM') AS mes,
                      COALESCE(SUM(total_factura), 0) AS total
               FROM factura
               WHERE id_empresa = %s AND estado = 'VALIDADA'
               GROUP BY 1
               ORDER BY 1 DESC
               LIMIT 12""",
            (id_empresa,),
        )
        rows = cur.fetchall() or []
    puntos = [(r['mes'], float(r['total'] or 0)) for r in reversed(list(rows))]
    png = series_mes_png(puntos, 'Facturas validadas por mes')

    buf = io.BytesIO()
    c = nuevo_canvas(buf)
    y = dibujar_cabecera_empresa(c, id_empresa, 'INFORME')
    c.setFont('Helvetica', 9)
    c.drawString(MARGIN, y, 'Totales de facturas VALIDADA (últimos 12 meses).')
    y -= 12
    img_w = PAGE_W - 2 * MARGIN
    img_h = 70 * mm
    c.drawImage(
        ImageReader(io.BytesIO(png)),
        MARGIN,
        y - img_h,
        width=img_w,
        height=img_h,
        preserveAspectRatio=True,
        mask='auto',
    )
    y = y - img_h - 16
    c.setFont('Helvetica-Bold', 8)
    c.drawString(MARGIN, y, 'Mes')
    c.drawRightString(PAGE_W - MARGIN, y, 'Total')
    y -= 12
    c.setFont('Helvetica', 8)
    for mes, total in puntos:
        c.drawString(MARGIN, y, mes)
        c.drawRightString(PAGE_W - MARGIN, y, f'{total:,.2f}')
        y -= 11
        if y < 25 * mm:
            break
    pie_pagina(c, 1, id_empresa)
    c.save()
    return buf.getvalue()

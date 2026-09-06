"""PDF de cobro / pago proveedor."""
from __future__ import annotations

import io
from typing import Any, Dict

from reportlab.lib.units import mm

from db import get_conn
from pdf_base import PAGE_W, MARGIN, dibujar_cabecera_empresa, nuevo_canvas, pie_pagina


def _money(v) -> str:
    try:
        return f'{float(v or 0):,.2f}'
    except (TypeError, ValueError):
        return '0.00'


def generar_pago_pdf(id_empresa: str, id_pago: str) -> bytes:
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute(
            """SELECT p.id_pago, p.numero_pago, p.tipo_pago, p.fecha_pago, p.monto,
                      p.concepto, p.estado, t.nombre AS tercero_nombre
               FROM pago p
               INNER JOIN tercero t ON t.id_tercero = p.id_tercero
               WHERE p.id_pago = %s AND p.id_empresa = %s LIMIT 1""",
            (id_pago, id_empresa),
        )
        row = cur.fetchone()
        if not row:
            raise ValueError('Pago no encontrado')
        cols = [d[0] for d in cur.description]
        header: Dict[str, Any] = dict(zip(cols, row))
        titulo = 'COBRO' if header.get('tipo_pago') == 'COBRO' else 'PAGO PROVEEDOR'

        buf = io.BytesIO()
        c = nuevo_canvas(buf)
        y = dibujar_cabecera_empresa(c, id_empresa, titulo)
        c.setFont('Helvetica', 10)
        c.drawString(MARGIN, y, f"Nº {header.get('numero_pago')}  ·  {header.get('fecha_pago')}")
        y -= 14
        c.drawString(MARGIN, y, f"{header.get('tercero_nombre')}  ·  {header.get('estado')}")
        y -= 14
        c.setFont('Helvetica-Bold', 12)
        c.drawString(MARGIN, y, f"Monto: {_money(header.get('monto'))}")
        y -= 18
        if header.get('concepto'):
            c.setFont('Helvetica', 9)
            c.drawString(MARGIN, y, str(header['concepto'])[:100])
            y -= 16

        c.setFont('Helvetica-Bold', 8)
        c.drawString(MARGIN, y, 'Factura')
        c.drawRightString(PAGE_W - MARGIN, y, 'Aplicado')
        y -= 12
        cur.execute(
            """SELECT f.numero_factura, pf.monto_aplicado
               FROM pago_factura pf
               INNER JOIN factura f ON f.id_factura = pf.id_factura
               WHERE pf.id_pago = %s""",
            (id_pago,),
        )
        while True:
            app = cur.fetchone()
            if app is None:
                break
            if y < 25 * mm:
                pie_pagina(c, 1, id_empresa)
                c.showPage()
                y = dibujar_cabecera_empresa(c, id_empresa, titulo)
            c.setFont('Helvetica', 8)
            c.drawString(MARGIN, y, str(app[0] or ''))
            c.drawRightString(PAGE_W - MARGIN, y, _money(app[1]))
            y -= 12

        pie_pagina(c, 1, id_empresa)
        c.save()
        return buf.getvalue()
    finally:
        conn.close()

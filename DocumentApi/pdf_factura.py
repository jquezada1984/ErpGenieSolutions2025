"""Factura cliente/proveedor: canvas + cursor SQL (no carga todas las líneas en RAM)."""
from __future__ import annotations

import io
from typing import Any, Dict, Optional

from reportlab.lib.units import mm

from db import get_conn
from pdf_base import PAGE_W, MARGIN, dibujar_cabecera_empresa, nuevo_canvas, pie_pagina


def _money(v) -> str:
    try:
        return f'{float(v or 0):,.2f}'
    except (TypeError, ValueError):
        return '0.00'


def generar_factura_pdf(id_empresa: str, id_factura: str, es_cliente: bool = True) -> bytes:
    rol = 't.cliente = true' if es_cliente else 't.proveedor = true'
    titulo_doc = 'FACTURA' if es_cliente else 'FACTURA PROVEEDOR'
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute(
            f"""SELECT f.id_factura, f.numero_factura, f.fecha_factura, f.fecha_vencimiento,
                      f.estado, f.tipo_factura, f.subtotal, f.total_impuestos,
                      f.total_descuentos, f.total_factura, f.nota_publica,
                      t.nombre AS tercero_nombre, t.cif_intra AS tercero_ruc, t.correo AS tercero_correo
               FROM factura f
               INNER JOIN tercero t ON t.id_tercero = f.id_tercero
               WHERE f.id_factura = %s AND f.id_empresa = %s AND {rol}
               LIMIT 1""",
            (id_factura, id_empresa),
        )
        fac = cur.fetchone()
        if not fac:
            raise ValueError('Factura no encontrada')
        cols = [d[0] for d in cur.description]
        header: Dict[str, Any] = dict(zip(cols, fac))

        buf = io.BytesIO()
        c = nuevo_canvas(buf)
        pagina = 1
        y = _pagina_nueva(c, id_empresa, titulo_doc, header, pagina)

        cur.execute(
            """SELECT orden, descripcion, cantidad, precio_unitario, descuento_valor, subtotal
               FROM factura_linea WHERE id_factura = %s ORDER BY orden""",
            (id_factura,),
        )
        # named-style iterate without fetchall
        col_l = [d[0] for d in cur.description]
        while True:
            row = cur.fetchone()
            if row is None:
                break
            linea = dict(zip(col_l, row))
            if y < MARGIN + 28 * mm:
                pie_pagina(c, pagina, id_empresa)
                c.showPage()
                pagina += 1
                y = _pagina_nueva(c, id_empresa, titulo_doc, header, pagina)
            y = _fila(c, y, linea)

        y -= 8
        c.setFont('Helvetica-Bold', 9)
        tot = _money(header.get('total_factura'))
        c.drawRightString(PAGE_W - MARGIN, y, f"Total: {tot}")
        pie_pagina(c, pagina, id_empresa)
        c.save()
        return buf.getvalue()
    finally:
        conn.close()


def _pagina_nueva(c, id_empresa, titulo, header, pagina: int) -> float:
    y = dibujar_cabecera_empresa(c, id_empresa, titulo)
    num = header.get('numero_factura') or 'BORRADOR'
    c.setFont('Helvetica', 9)
    c.drawString(MARGIN, y, f"Nº {num}  ·  {header.get('fecha_factura')}  ·  {header.get('estado')}")
    y -= 14
    tercero = header.get('tercero_nombre') or ''
    ruc = header.get('tercero_ruc') or ''
    c.drawString(MARGIN, y, f"{tercero}  {('ID ' + ruc) if ruc else ''}")
    y -= 16
    c.setFont('Helvetica-Bold', 8)
    c.drawString(MARGIN, y, '#')
    c.drawString(MARGIN + 12 * mm, y, 'Descripción')
    c.drawRightString(PAGE_W - 55 * mm, y, 'Cant.')
    c.drawRightString(PAGE_W - 32 * mm, y, 'P.unit')
    c.drawRightString(PAGE_W - MARGIN, y, 'Subtotal')
    y -= 4
    c.setStrokeColorRGB(0.8, 0.8, 0.8)
    c.line(MARGIN, y, PAGE_W - MARGIN, y)
    return y - 12


def _fila(c, y: float, linea: dict) -> float:
    c.setFont('Helvetica', 8)
    c.drawString(MARGIN, y, str(linea.get('orden') or ''))
    desc = (linea.get('descripcion') or '')[:70]
    c.drawString(MARGIN + 12 * mm, y, desc)
    c.drawRightString(PAGE_W - 55 * mm, y, _money(linea.get('cantidad')))
    c.drawRightString(PAGE_W - 32 * mm, y, _money(linea.get('precio_unitario')))
    c.drawRightString(PAGE_W - MARGIN, y, _money(linea.get('subtotal')))
    return y - 12

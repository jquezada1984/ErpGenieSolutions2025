"""Ayudas de canvas ReportLab: cabecera con logo, pie, páginas (PDF grandes)."""
from __future__ import annotations

import io
from typing import Callable, Optional

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

from branding import logo_png, logo_size_mm, obtener_empresa

PAGE_W, PAGE_H = A4
MARGIN = 14 * mm


def nuevo_canvas(dest) -> canvas.Canvas:
    return canvas.Canvas(dest, pagesize=A4)


def dibujar_cabecera_empresa(c: canvas.Canvas, id_empresa: str, titulo: str) -> float:
    """Devuelve Y debajo de la cabecera (puntos)."""
    emp = obtener_empresa(id_empresa)
    y_top = PAGE_H - MARGIN
    x = MARGIN
    logo = logo_png(id_empresa)
    logo_w = 0.0
    if logo:
        w_mm, h_mm = logo_size_mm(logo)
        w, h = w_mm * mm, h_mm * mm
        c.drawImage(
            ImageReader(io.BytesIO(logo)),
            x,
            y_top - h,
            width=w,
            height=h,
            mask='auto',
            preserveAspectRatio=True,
        )
        logo_w = w + 6 * mm
    tx = x + logo_w
    c.setFont('Helvetica-Bold', 12)
    c.drawString(tx, y_top - 12, emp.get('nombre') or '')
    c.setFont('Helvetica', 8)
    lineas = [
        f"RUC {emp.get('ruc')}" if emp.get('pdf_mostrar_ruc', True) and emp.get('ruc') else '',
        emp.get('direccion') or '',
        ' · '.join(p for p in (emp.get('telefono'), emp.get('email')) if p),
    ]
    yy = y_top - 24
    for ln in lineas:
        if not ln:
            continue
        c.drawString(tx, yy, ln[:90])
        yy -= 11
    c.setFont('Helvetica-Bold', 14)
    c.drawRightString(PAGE_W - MARGIN, y_top - 14, titulo)
    c.setStrokeColorRGB(0.15, 0.35, 0.75)
    c.setLineWidth(1.2)
    c.line(MARGIN, yy - 6, PAGE_W - MARGIN, yy - 6)
    return yy - 16


def pie_pagina(c: canvas.Canvas, pagina: int, id_empresa: Optional[str] = None) -> None:
    texto = 'ERP Genie Solutions'
    if id_empresa:
        try:
            emp = obtener_empresa(id_empresa)
            custom = (emp.get('pdf_pie_texto') or '').strip()
            if custom:
                texto = custom[:80]
        except Exception:
            pass
    c.setFont('Helvetica', 8)
    c.setFillColorRGB(0.4, 0.4, 0.4)
    c.drawString(MARGIN, 10 * mm, texto)
    c.drawRightString(PAGE_W - MARGIN, 10 * mm, f'Página {pagina}')
    c.setFillColorRGB(0, 0, 0)


def escribir_con_paginas(
    dest,
    id_empresa: str,
    titulo: str,
    cuerpo: Callable[[canvas.Canvas, float], None],
) -> None:
    """cuerpo(c, y_inicio) puede llamar c.showPage(); el pie se aplica en save con pageNumber.

    Para control fino, el generador maneja showPage y vuelve a pintar cabecera.
    """
    c = nuevo_canvas(dest)
    y = dibujar_cabecera_empresa(c, id_empresa, titulo)
    cuerpo(c, y)
    c.save()

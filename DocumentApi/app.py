"""DocumentApi — HTTP PDF (ReportLab). Front solo vía gateway."""
from __future__ import annotations

import logging
import os

from fastapi import FastAPI, Header, HTTPException, Query
from fastapi.responses import Response
from pydantic import BaseModel

from pdf_factura import generar_factura_pdf
from pdf_pago import generar_pago_pdf
from pdf_reporte import generar_reporte_estadistico

logging.basicConfig(level=os.getenv('LOG_LEVEL', 'INFO'))
logger = logging.getLogger('DocumentApi')

app = FastAPI(title='DocumentApi', version='1.0.0')


class GenerarBody(BaseModel):
    tipo: str
    id_documento: str | None = None


def _empresa(x_company_id: str | None) -> str:
    if not x_company_id:
        raise HTTPException(400, 'Falta X-Company-Id')
    return x_company_id


def _pdf(nombre: str, data: bytes) -> Response:
    return Response(
        content=data,
        media_type='application/pdf',
        headers={'Content-Disposition': f'inline; filename="{nombre}"'},
    )


def _generar(tipo: str, id_empresa: str, id_documento: str | None) -> tuple[bytes, str]:
    t = (tipo or '').strip().lower()
    try:
        if t == 'factura_cliente':
            if not id_documento:
                raise ValueError('Falta id_documento')
            return generar_factura_pdf(id_empresa, id_documento, True), f'factura-{id_documento}.pdf'
        if t == 'factura_proveedor':
            if not id_documento:
                raise ValueError('Falta id_documento')
            return generar_factura_pdf(id_empresa, id_documento, False), f'factura-prov-{id_documento}.pdf'
        if t in ('pago', 'cobro', 'pago_proveedor'):
            if not id_documento:
                raise ValueError('Falta id_documento')
            return generar_pago_pdf(id_empresa, id_documento), f'pago-{id_documento}.pdf'
        if t == 'reporte_estadistico':
            return generar_reporte_estadistico(id_empresa), 'reporte-estadistico.pdf'
        raise ValueError(f'Tipo no soportado: {tipo}')
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    except Exception as exc:
        logger.exception('Error generando PDF %s', t)
        raise HTTPException(500, str(exc)) from exc


@app.get('/health')
def health():
    return {'status': 'ok', 'service': 'document-api'}


@app.post('/api/documentos/generar')
def generar(body: GenerarBody, x_company_id: str | None = Header(default=None)):
    id_empresa = _empresa(x_company_id)
    data, nombre = _generar(body.tipo, id_empresa, body.id_documento)
    return _pdf(nombre, data)


@app.get('/api/documentos/factura-cliente/{id_factura}')
def factura_cliente(id_factura: str, x_company_id: str | None = Header(default=None)):
    data, nombre = _generar('factura_cliente', _empresa(x_company_id), id_factura)
    return _pdf(nombre, data)


@app.get('/api/documentos/factura-proveedor/{id_factura}')
def factura_proveedor(id_factura: str, x_company_id: str | None = Header(default=None)):
    data, nombre = _generar('factura_proveedor', _empresa(x_company_id), id_factura)
    return _pdf(nombre, data)


@app.get('/api/documentos/pago/{id_pago}')
def pago(id_pago: str, x_company_id: str | None = Header(default=None)):
    data, nombre = _generar('pago', _empresa(x_company_id), id_pago)
    return _pdf(nombre, data)


@app.get('/api/documentos/reporte-estadistico')
def reporte(x_company_id: str | None = Header(default=None), _q: str | None = Query(default=None)):
    data, nombre = _generar('reporte_estadistico', _empresa(x_company_id), None)
    return _pdf(nombre, data)

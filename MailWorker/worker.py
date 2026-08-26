"""
MailWorker — consume mail.send, pide PDF a DocumentApi y envía SMTP.

Cola: erp.mail
Binding: mail.# → exchange erp.events
"""
from __future__ import annotations

import json
import logging
import os
import sys
import time

import pika
import requests

import smtp_sender
from rabbit_conn import amqp_params

logging.basicConfig(
    level=os.getenv('LOG_LEVEL', 'INFO'),
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
)
logger = logging.getLogger('MailWorker')

RABBITMQ_URL = os.getenv('RABBITMQ_URL', 'amqp://erp:erp@rabbitmq:5672/')
EXCHANGE = os.getenv('RABBITMQ_EXCHANGE', 'erp.events')
QUEUE = os.getenv('RABBITMQ_QUEUE', 'erp.mail')
ROUTING_KEY = os.getenv('RABBITMQ_ROUTING_KEY', 'mail.#')
DOCUMENT_API = (os.getenv('DOCUMENT_API_BASE_URL') or 'http://document-api:5010').rstrip('/')
PREFETCH = int(os.getenv('RABBITMQ_PREFETCH', '2'))


def _pdf(tipo: str, id_empresa: str, id_documento: str | None) -> tuple[str, bytes]:
    headers = {'X-Company-Id': str(id_empresa)}
    if tipo == 'reporte_estadistico':
        url = f'{DOCUMENT_API}/api/documentos/reporte-estadistico'
        res = requests.get(url, headers=headers, timeout=120)
        nombre = 'reporte-estadistico.pdf'
    else:
        url = f'{DOCUMENT_API}/api/documentos/generar'
        res = requests.post(
            url,
            json={'tipo': tipo, 'id_documento': id_documento},
            headers={**headers, 'Content-Type': 'application/json'},
            timeout=180,
        )
        nombre = f'{tipo}-{id_documento or "doc"}.pdf'
    if res.status_code >= 400:
        raise RuntimeError(f'DocumentApi {res.status_code}: {res.text[:500]}')
    ctype = res.headers.get('Content-Type') or ''
    if 'pdf' not in ctype and not res.content.startswith(b'%PDF'):
        raise RuntimeError(f'DocumentApi no devolvió PDF ({ctype})')
    disp = res.headers.get('Content-Disposition') or ''
    if 'filename=' in disp:
        nombre = disp.split('filename=')[-1].strip().strip('"')
    return nombre, res.content


def procesar_evento(payload: dict) -> None:
    event = payload.get('event') or ''
    if event and not event.endswith('send') and event != 'mail.send':
        logger.warning('Evento ignorado: %s', event)
        return
    id_empresa = payload.get('id_empresa')
    if not id_empresa:
        raise ValueError('Evento sin id_empresa')
    to = payload.get('to') or payload.get('destinatarios') or []
    if isinstance(to, str):
        to = [to]
    cc = payload.get('cc') or []
    if isinstance(cc, str):
        cc = [cc]
    asunto = payload.get('subject') or payload.get('asunto') or '(sin asunto)'
    html = payload.get('html') or payload.get('cuerpo_html')
    texto = payload.get('text') or payload.get('cuerpo_texto')
    adjuntos_meta = payload.get('adjuntos') or []
    files = []
    for adj in adjuntos_meta:
        tipo = (adj.get('tipo') or '').strip()
        id_doc = adj.get('id_documento')
        if not tipo:
            continue
        nombre, blob = _pdf(tipo, id_empresa, id_doc)
        files.append((nombre, blob, 'application/pdf'))
        logger.info('Adjunto %s (%s bytes)', nombre, len(blob))
    smtp_sender.enviar(to, asunto, html, texto, files, cc=cc)


def main() -> None:
    logger.info('MailWorker arrancando cola=%s routing=%s docs=%s', QUEUE, ROUTING_KEY, DOCUMENT_API)
    while True:
        try:
            params = amqp_params(RABBITMQ_URL)
            logger.info('Conectando AMQP IPv4 %s:%s', params.host, params.port)
            connection = pika.BlockingConnection(params)
            channel = connection.channel()
            channel.exchange_declare(exchange=EXCHANGE, exchange_type='topic', durable=True)
            channel.queue_declare(queue=QUEUE, durable=True)
            channel.queue_bind(queue=QUEUE, exchange=EXCHANGE, routing_key=ROUTING_KEY)
            channel.basic_qos(prefetch_count=PREFETCH)

            def _on_message(ch, method, _properties, body):
                try:
                    payload = json.loads(body.decode('utf-8'))
                    procesar_evento(payload)
                    ch.basic_ack(delivery_tag=method.delivery_tag)
                except Exception:
                    logger.exception('Error procesando mensaje; se descarta (sin requeue)')
                    ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

            channel.basic_consume(queue=QUEUE, on_message_callback=_on_message)
            logger.info('Esperando mail.send…')
            channel.start_consuming()
        except pika.exceptions.AMQPConnectionError as exc:
            logger.warning('Rabbit no disponible (%s); reintento 5s', exc)
            time.sleep(5)
        except KeyboardInterrupt:
            sys.exit(0)


if __name__ == '__main__':
    main()

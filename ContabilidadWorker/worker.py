"""
ContabilidadWorker — consume eventos RabbitMQ y contabiliza facturas, pagos y ajustes de inventario.

Cola: erp.accounting
Bindings: financiero.# , inventario.# → exchange erp.events
"""
from __future__ import annotations

import json
import logging
import os
import sys
import time

import pika
import requests

from rabbit_conn import amqp_params

logging.basicConfig(
    level=os.getenv('LOG_LEVEL', 'INFO'),
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
)
logger = logging.getLogger('ContabilidadWorker')

RABBITMQ_URL = os.getenv('RABBITMQ_URL', 'amqp://erp:erp@rabbitmq:5672/')
EXCHANGE = os.getenv('RABBITMQ_EXCHANGE', 'erp.events')
QUEUE = os.getenv('RABBITMQ_QUEUE', 'erp.accounting')
ROUTING_KEY = os.getenv('RABBITMQ_ROUTING_KEY', 'financiero.#')
ROUTING_INVENTARIO = os.getenv('RABBITMQ_ROUTING_INVENTARIO', 'inventario.#')
CONTABILIDAD_PY_BASE_URL = (
    os.getenv('CONTABILIDAD_PY_BASE_URL') or 'http://contabilidad-python-service:5002'
).rstrip('/')
PREFETCH = int(os.getenv('RABBITMQ_PREFETCH', '2'))


def _post(path: str, id_empresa: str, body: dict) -> dict:
    url = f'{CONTABILIDAD_PY_BASE_URL}{path}'
    headers = {
        'Content-Type': 'application/json',
        'X-Company-Id': str(id_empresa),
    }
    res = requests.post(url, json=body, headers=headers, timeout=120)
    if res.status_code >= 400:
        raise RuntimeError(f'ContabilidadPython {res.status_code}: {res.text}')
    return res.json() if res.content else {}


def procesar_evento(payload: dict) -> None:
    event = payload.get('event') or ''
    id_empresa = payload.get('id_empresa')
    if not id_empresa:
        raise ValueError('Evento sin id_empresa')

    if event.endswith('ajuste.registrado') or event.startswith('inventario.'):
        id_origen = (
            payload.get('id_origen')
            or payload.get('id_inventario')
            or payload.get('id_cambio_masivo_stock')
        )
        if not id_origen:
            raise ValueError('Evento ajuste inventario sin id_origen')
        logger.info('Procesando ajuste inventario origen=%s empresa %s', id_origen, id_empresa)
        data = _post(
            '/api/transferencia-contable/procesar-ajuste-inventario',
            id_empresa,
            {
                'id_origen': id_origen,
                'id_inventario': payload.get('id_inventario'),
                'id_cambio_masivo_stock': payload.get('id_cambio_masivo_stock'),
                'modulo_origen': payload.get('modulo_origen'),
                'movimientos': payload.get('movimientos') or [],
            },
        )
        logger.info('OK ajuste inventario %s → %s', id_origen, data)
        return

    es_pago = event.endswith('pago.registrado') or (
        bool(payload.get('id_pago')) and not event.endswith('factura.validada')
    )
    if es_pago:
        id_pago = payload.get('id_pago')
        if not id_pago:
            raise ValueError('Evento pago sin id_pago')
        logger.info('Procesando pago %s empresa %s', id_pago, id_empresa)
        data = _post(
            '/api/transferencia-contable/procesar-pago',
            id_empresa,
            {'id_pago': id_pago},
        )
        logger.info('OK pago %s → %s', id_pago, data)
        return

    if event.endswith('factura.validada') or payload.get('id_factura'):
        id_factura = payload.get('id_factura')
        if not id_factura:
            raise ValueError('Evento factura sin id_factura')
        tipo = (payload.get('tipo') or 'cliente').lower()
        logger.info('Procesando factura %s tipo=%s empresa %s', id_factura, tipo, id_empresa)
        data = _post(
            '/api/transferencia-contable/procesar-factura',
            id_empresa,
            {'id_factura': id_factura, 'tipo': tipo},
        )
        logger.info('OK factura %s → %s', id_factura, data)
        return

    logger.warning('Evento ignorado: %s', event)


def on_message(channel, method, properties, body):  # noqa: ARG001
    try:
        payload = json.loads(body.decode('utf-8'))
        procesar_evento(payload)
        channel.basic_ack(delivery_tag=method.delivery_tag)
    except Exception:
        logger.exception('Error procesando mensaje; requeue=False')
        channel.basic_nack(delivery_tag=method.delivery_tag, requeue=False)


def connect_and_consume() -> None:  # pragma: no cover — bucle AMQP I/O
    params = amqp_params(RABBITMQ_URL)
    logger.info('Conectando AMQP IPv4 %s:%s', params.host, params.port)
    connection = pika.BlockingConnection(params)
    channel = connection.channel()
    channel.exchange_declare(exchange=EXCHANGE, exchange_type='topic', durable=True)
    channel.queue_declare(queue=QUEUE, durable=True)
    channel.queue_bind(queue=QUEUE, exchange=EXCHANGE, routing_key=ROUTING_KEY)
    channel.queue_bind(queue=QUEUE, exchange=EXCHANGE, routing_key=ROUTING_INVENTARIO)
    channel.basic_qos(prefetch_count=PREFETCH)
    channel.basic_consume(queue=QUEUE, on_message_callback=on_message)
    logger.info(
        'Escuchando %s (exchange=%s routing=%s + %s) → %s',
        QUEUE,
        EXCHANGE,
        ROUTING_KEY,
        ROUTING_INVENTARIO,
        CONTABILIDAD_PY_BASE_URL,
    )
    channel.start_consuming()


def main() -> int:  # pragma: no cover — reconexión AMQP
    backoff = 2
    while True:
        try:
            connect_and_consume()
            logger.warning('La conexión AMQP se cerró; reconectando en %ss', backoff)
        except KeyboardInterrupt:
            logger.info('Detenido')
            return 0
        except pika.exceptions.AMQPConnectionError as exc:
            logger.warning('RabbitMQ aún no acepta AMQP (%s); reintento en %ss', exc, backoff)
        except Exception:
            logger.exception('Conexión fallida; reintento en %ss', backoff)
        time.sleep(backoff)
        backoff = min(backoff * 2, 30)


if __name__ == '__main__':  # pragma: no cover
    sys.exit(main())

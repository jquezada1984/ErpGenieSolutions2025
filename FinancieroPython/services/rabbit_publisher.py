"""Publicación de eventos a RabbitMQ (opcional si RABBITMQ_URL no está configurada)."""
from __future__ import annotations

import json
import logging
import os
from typing import Any, Dict

logger = logging.getLogger(__name__)

EXCHANGE = os.getenv('RABBITMQ_EXCHANGE', 'erp.events')
ROUTING_FACTURA_VALIDADA = 'financiero.factura.validada'
ROUTING_PAGO_REGISTRADO = 'financiero.pago.registrado'
ROUTING_MAIL_SEND = 'mail.send'


def publish_event(routing_key: str, payload: Dict[str, Any]) -> bool:
    url = (os.getenv('RABBITMQ_URL') or '').strip()
    if not url:
        logger.info('RabbitMQ no configurado; evento %s omitido (sync fallback posible en worker).', routing_key)
        return False
    try:
        import pika
    except ImportError:
        logger.warning('pika no instalado; no se publica %s', routing_key)
        return False

    try:
        params = pika.URLParameters(url)
        connection = pika.BlockingConnection(params)
        channel = connection.channel()
        channel.exchange_declare(exchange=EXCHANGE, exchange_type='topic', durable=True)
        body = json.dumps(payload, default=str).encode('utf-8')
        channel.basic_publish(
            exchange=EXCHANGE,
            routing_key=routing_key,
            body=body,
            properties=pika.BasicProperties(
                content_type='application/json',
                delivery_mode=2,
            ),
        )
        connection.close()
        logger.info('Evento publicado %s', routing_key)
        return True
    except Exception as exc:
        logger.exception('Error publicando %s: %s', routing_key, exc)
        return False


def publish_factura_validada(
    id_empresa: str,
    id_factura: str,
    fecha_factura: str,
    anio: int,
    tipo: str = 'cliente',
) -> bool:
    return publish_event(
        ROUTING_FACTURA_VALIDADA,
        {
            'event': ROUTING_FACTURA_VALIDADA,
            'id_empresa': id_empresa,
            'id_factura': id_factura,
            'fecha_factura': fecha_factura,
            'anio': anio,
            'tipo': tipo,
        },
    )


def publish_pago_registrado(
    id_empresa: str,
    id_pago: str,
    fecha_pago: str,
    tipo: str,
    numero_pago: str,
) -> bool:
    return publish_event(
        ROUTING_PAGO_REGISTRADO,
        {
            'event': ROUTING_PAGO_REGISTRADO,
            'id_empresa': id_empresa,
            'id_pago': id_pago,
            'fecha_pago': fecha_pago,
            'tipo': tipo,
            'numero_pago': numero_pago,
        },
    )


def publish_mail_send(
    id_empresa: str,
    to: list,
    subject: str,
    html: str | None = None,
    text: str | None = None,
    adjuntos: list | None = None,
    cc: list | None = None,
) -> bool:
    return publish_event(
        ROUTING_MAIL_SEND,
        {
            'event': ROUTING_MAIL_SEND,
            'id_empresa': id_empresa,
            'to': to,
            'cc': cc or [],
            'subject': subject,
            'html': html,
            'text': text,
            'adjuntos': adjuntos or [],
        },
    )

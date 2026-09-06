"""Publicación de eventos inventario → RabbitMQ."""
from __future__ import annotations

import json
import logging
import os
from typing import Any, Dict, List

logger = logging.getLogger(__name__)

EXCHANGE = os.getenv("RABBITMQ_EXCHANGE", "erp.events")
ROUTING_AJUSTE = "inventario.ajuste.registrado"


def publish_event(routing_key: str, payload: Dict[str, Any]) -> bool:
    url = (os.getenv("RABBITMQ_URL") or "").strip()
    if not url:
        logger.info("RabbitMQ no configurado; evento %s omitido", routing_key)
        return False
    try:
        import pika
    except ImportError:
        logger.warning("pika no instalado; no se publica %s", routing_key)
        return False
    try:
        params = pika.URLParameters(url)
        connection = pika.BlockingConnection(params)
        channel = connection.channel()
        channel.exchange_declare(exchange=EXCHANGE, exchange_type="topic", durable=True)
        body = json.dumps(payload, default=str).encode("utf-8")
        channel.basic_publish(
            exchange=EXCHANGE,
            routing_key=routing_key,
            body=body,
            properties=pika.BasicProperties(content_type="application/json", delivery_mode=2),
        )
        connection.close()
        logger.info("Evento publicado %s", routing_key)
        return True
    except Exception as exc:
        logger.exception("Error publicando %s: %s", routing_key, exc)
        return False


def publish_ajuste_inventario(
    id_empresa: str,
    id_origen: str,
    movimientos: List[Dict[str, Any]],
    *,
    modulo_origen: str | None = None,
    id_inventario: str | None = None,
    id_cambio_masivo_stock: str | None = None,
) -> bool:
    return publish_event(
        ROUTING_AJUSTE,
        {
            "event": ROUTING_AJUSTE,
            "id_empresa": id_empresa,
            "id_origen": id_origen,
            "id_inventario": id_inventario,
            "id_cambio_masivo_stock": id_cambio_masivo_stock,
            "modulo_origen": modulo_origen,
            "movimientos": movimientos,
        },
    )

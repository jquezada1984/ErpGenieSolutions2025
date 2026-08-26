"""Conexión AMQP: IPv4 (Docker IPv6 2001:db8:: suele rechazar) y timeouts."""
from __future__ import annotations

import socket

import pika


def amqp_params(url: str) -> pika.URLParameters:
    params = pika.URLParameters(url)
    params.connection_attempts = 1
    params.retry_delay = 2
    params.socket_timeout = 8
    params.blocked_connection_timeout = 30
    host = params.host
    try:
        infos = socket.getaddrinfo(host, int(params.port or 5672), socket.AF_INET, socket.SOCK_STREAM)
        if infos:
            params.host = infos[0][4][0]
    except OSError:
        pass
    return params

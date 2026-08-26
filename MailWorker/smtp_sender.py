"""Envío SMTP. Si SMTP_HOST está vacío, el worker registra el correo y no falla la cola (dev)."""
from __future__ import annotations

import logging
import os
import smtplib
from email.message import EmailMessage
from typing import Iterable, Sequence, Tuple

logger = logging.getLogger('MailWorker.smtp')

Attachment = Tuple[str, bytes, str]  # filename, content, mime


def enviar(
    destinatarios: Sequence[str],
    asunto: str,
    html: str | None,
    texto: str | None,
    adjuntos: Iterable[Attachment],
    cc: Sequence[str] | None = None,
) -> None:
    host = (os.getenv('SMTP_HOST') or '').strip()
    to_list = [t for t in destinatarios if t]
    if not to_list:
        raise ValueError('Sin destinatarios')

    msg = EmailMessage()
    msg['Subject'] = asunto or '(sin asunto)'
    from_addr = os.getenv('SMTP_FROM') or os.getenv('SMTP_USER') or 'noreply@localhost'
    from_name = os.getenv('SMTP_FROM_NAME') or 'ERP Genie'
    msg['From'] = f'{from_name} <{from_addr}>'
    msg['To'] = ', '.join(to_list)
    if cc:
        msg['Cc'] = ', '.join(cc)

    body_txt = texto or (html or '')
    msg.set_content(body_txt)
    if html:
        msg.add_alternative(html, subtype='html')

    for nombre, contenido, mime in adjuntos:
        main, _, sub = (mime or 'application/pdf').partition('/')
        msg.add_attachment(
            contenido,
            maintype=main or 'application',
            subtype=sub or 'pdf',
            filename=nombre,
        )

    if not host:
        logger.warning(
            'SMTP_HOST no configurado; correo omitido (asunto=%s, to=%s, adjuntos=%s)',
            asunto,
            to_list,
            [a[0] for a in adjuntos],
        )
        return

    port = int(os.getenv('SMTP_PORT') or '587')
    user = (os.getenv('SMTP_USER') or '').strip()
    password = os.getenv('SMTP_PASSWORD') or ''
    use_tls = (os.getenv('SMTP_TLS') or 'true').lower() in ('1', 'true', 'yes')
    use_ssl = (os.getenv('SMTP_SSL') or '').lower() in ('1', 'true', 'yes')

    if use_ssl:
        smtp: smtplib.SMTP = smtplib.SMTP_SSL(host, port, timeout=60)
    else:
        smtp = smtplib.SMTP(host, port, timeout=60)
        smtp.ehlo()
        if use_tls:
            smtp.starttls()
            smtp.ehlo()
    try:
        if user:
            smtp.login(user, password)
        smtp.send_message(msg)
        logger.info('Correo enviado a %s asunto=%s', to_list, asunto)
    finally:
        smtp.quit()

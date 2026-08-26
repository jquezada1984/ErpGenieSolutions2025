# MailWorker — ERP Genie

Worker Python que **consume RabbitMQ** (`mail.send`), pide los PDF a **DocumentApi** y envía por **SMTP**.

No genera documentos. No usa SQL Server ni Crystal (eso era el ejemplo médico).

```
Financiero / gateway
  → Rabbit mail.send
  → MailWorker
       → DocumentApi (PDF + logo empresa + gráficos si aplica)
       → SMTP + adjuntos
```

Cola `erp.mail`, binding `mail.#` al exchange `erp.events`.

## Payload `mail.send`

```json
{
  "event": "mail.send",
  "id_empresa": "uuid",
  "to": ["cliente@correo.com"],
  "subject": "Factura FC-2026-000001",
  "html": "<p>Adjunto su factura.</p>",
  "adjuntos": [{ "tipo": "factura_cliente", "id_documento": "uuid-factura" }]
}
```

`tipo` de adjunto: los mismos de DocumentApi (`factura_cliente`, `factura_proveedor`, `pago`, `reporte_estadistico`).

## SMTP (env)

| Variable | Dev |
|----------|-----|
| `SMTP_HOST` | vacío = no envía (solo log) |
| `SMTP_PORT` | 587 |
| `SMTP_TLS` | true |
| `SMTP_SSL` | false |
| `SMTP_USER` / `SMTP_PASSWORD` | |
| `SMTP_FROM` / `SMTP_FROM_NAME` | |

Ver [docs/ARQUITECTURA_RABBIT_WORKERS.md](../docs/ARQUITECTURA_RABBIT_WORKERS.md) y [DocumentApi/README.md](../DocumentApi/README.md).

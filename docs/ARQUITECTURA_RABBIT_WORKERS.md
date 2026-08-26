# Arquitectura RabbitMQ y Workers

## Objetivo

Desacoplar operaciones lentas (contabilización, correo, generación de PDFs) de la respuesta HTTP al usuario.

## Componentes (dev)

| Servicio | Compose | Función |
|----------|---------|---------|
| `rabbitmq` | `docker-compose.dev.yml` | AMQP 5672, Management UI http://localhost:15672 (erp/erp) |
| `contabilidad-worker` | idem | Contabiliza facturas y pagos validados |
| `document-api` | :5010 | Genera PDF (ReportLab) |
| `mail-worker` | idem | Consume `mail.send` → DocumentApi → SMTP |
| FinancieroPython | publica eventos | `RABBITMQ_URL` |

## Exchange y colas

| Recurso | Valor |
|---------|-------|
| Exchange | `erp.events` (topic, durable) |
| Binding | `financiero.#` → cola `erp.accounting` |
| Binding | `mail.#` → cola `erp.mail` |

### Evento `financiero.factura.validada`

```json
{
  "event": "financiero.factura.validada",
  "id_empresa": "uuid",
  "id_factura": "uuid",
  "fecha_factura": "2026-08-20",
  "anio": 2026,
  "tipo": "cliente"
}
```

`tipo`: `cliente` (diario VT) o `proveedor` (diario AC).

Worker → `POST ContabilidadPython/api/transferencia-contable/procesar-factura` con header `X-Company-Id`.

### Evento `financiero.pago.registrado`

```json
{
  "event": "financiero.pago.registrado",
  "id_empresa": "uuid",
  "id_pago": "uuid",
  "fecha_pago": "2026-08-22",
  "tipo": "cobro",
  "numero_pago": "COB-2026-000001"
}
```

`tipo`: `cobro` o `pago_proveedor`. El movimiento de banco ya se creó al validar (INGRESO/EGRESO, `numero_documento` = número de pago).

Worker → `POST .../procesar-pago` → diario BQ por `numero_documento`.

### Evento `mail.send`

```json
{
  "event": "mail.send",
  "id_empresa": "uuid",
  "to": ["cliente@correo.com"],
  "subject": "Factura FC-2026-000001",
  "html": "<p>Adjunto.</p>",
  "adjuntos": [{ "tipo": "factura_cliente", "id_documento": "uuid" }]
}
```

MailWorker pide el PDF a DocumentApi y envía SMTP. Si `SMTP_HOST` está vacío, solo registra en log (dev).

La UI descarga PDF en sincrónico vía gateway → DocumentApi (`GET /api/documentos/factura-cliente/:id`). No hace falta un worker `document.generate`.

## Local sin Docker

```bash
# Terminal ContabilidadWorker
cd ContabilidadWorker
pip install -r requirements.txt
set RABBITMQ_URL=amqp://erp:erp@localhost:5672/
set CONTABILIDAD_PY_BASE_URL=http://localhost:5002
python worker.py
```

En FinancieroPython: `RABBITMQ_URL` igual; si vacío, validar no falla (solo no publica).

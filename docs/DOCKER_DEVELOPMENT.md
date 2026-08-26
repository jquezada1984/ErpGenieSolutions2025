# Desarrollo con Docker

Stack de desarrollo con hot reload. Scripts en la raíz del repo (Windows):

| Script | Acción |
|--------|--------|
| `docker-dev-up.bat` | `up -d --build` |
| `docker-dev-down.bat` | `down` |
| `docker-dev-restart.bat` | `down` + `up -d` |

```bash
docker compose -f docker-compose.dev.yml up -d --build
docker compose -f docker-compose.dev.yml logs -f
docker compose -f docker-compose.dev.yml down
```

## Puertos (host)

| Servicio | Puerto | Notas |
|----------|--------|-------|
| frontReact | 3000 | Vite |
| gateway-api | 3002 | Único punto de entrada REST + GraphQL |
| InicioNestJs | 3001 | Auth, empresas, catálogos globales |
| MenuNestJs | 3003 | Menú y permisos |
| TerceroPython | 3004 | REST terceros |
| ContabilidadNestJs | 3005 | GraphQL contabilidad |
| TerceroNestJs | 3006 | GraphQL terceros (interno 3001) |
| FinancieroNestJs | 3007 | GraphQL financiero |
| MediaServiceNestJs | 3008* | Ver `docker-compose` |
| ItemNestJs | 3011 | GraphQL items |
| ItemPython | 3012* | REST items |
| InventarioNestJs | 3013 | GraphQL inventarios |
| InventarioPython | 3014 | REST inventarios |
| BancoCajaPython | 3015 | REST banco/cajas |
| BancoCajaNestJs | 3016 | GraphQL banco/cajas |
| InicioPython | 5000 | REST inicio |
| FinancieroPython | 5001 | REST financiero |
| ContabilidadPython | 5002 | REST contabilidad |
| DocumentApi | 5010 | PDF (ReportLab) |
| RabbitMQ | 5672 / 15672 | AMQP + Management UI (erp/erp) |
| ContabilidadWorker | — | Consumer facturas y pagos → asientos |
| MailWorker | — | Consumer mail.send → SMTP |

\* Confirmar en `docker-compose.yml` / `docker-compose.dev.yml` si el mapeo cambia.

## Hot reload

- Frontend: Vite HMR
- NestJS: `nest start --watch` (SIGINT/SIGTERM al reiniciar el contenedor es normal)
- Gateway: nodemon
- Python: Flask debug / reloader
- ContabilidadWorker: reiniciar contenedor tras cambios (`docker compose ... restart contabilidad-worker`)

Variables típicas: `DATABASE_URL`, `JWT_SECRET_KEY`, `CORS_ORIGINS`, `VITE_GATEWAY_URL=http://localhost:3002`, `RABBITMQ_URL=amqp://erp:erp@rabbitmq:5672/`.

Workers y colas: [ARQUITECTURA_RABBIT_WORKERS.md](./ARQUITECTURA_RABBIT_WORKERS.md).

Índice de docs: [README.md](./README.md).

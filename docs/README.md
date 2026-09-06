# Documentación — ErpGenieSolutions2025

Índice de la documentación vigente del monorepo. Todo lo demás que hubiera en `docs/` (auditorías puntuales, planes superseded, inventarios desactualizados) se eliminó; la fuente de verdad es este índice.

## Empezar aquí

| Documento | Contenido |
|-----------|-----------|
| [ARQUITECTURA_ERP_GENIE_SOLUTIONS_2025.md](./ARQUITECTURA_ERP_GENIE_SOLUTIONS_2025.md) | Arquitectura completa: gateway, microservicios, front, puertos |
| [DOCKER_DEVELOPMENT.md](./DOCKER_DEVELOPMENT.md) | Desarrollo con Docker Compose (hot reload) |
| [README del repo](../README.md) | Instalación y scripts `docker-dev-*.bat` |

## Módulos y dominio

| Documento | Contenido |
|-----------|-----------|
| [arquitectura/MODULO_TERCEROS_PLANTILLA.md](./arquitectura/MODULO_TERCEROS_PLANTILLA.md) | Plantilla del patrón Python REST + NestJS GraphQL |
| [MODULO_TERCEROS_TECNICO.md](./MODULO_TERCEROS_TECNICO.md) | Detalle técnico del módulo Terceros |
| [TERCEROS_POR_BASE_DE_DATOS.md](./TERCEROS_POR_BASE_DE_DATOS.md) | Menú Terceros cargado desde BD |
| [MODULO_CONTABILIDAD.md](./MODULO_CONTABILIDAD.md) | Estado actual del módulo Contabilidad |
| [MODULO_FINANCIERO.md](./MODULO_FINANCIERO.md) | Facturas cliente/proveedor, cobros, pagos y enlace a contabilidad |
| [DOCUMENTOS_Y_MAIL.md](./DOCUMENTOS_Y_MAIL.md) | DocumentApi (PDF) + MailWorker (SMTP / Rabbit) |
| [MODULO_BANCO_CAJAS.md](./MODULO_BANCO_CAJAS.md) | Estado actual Banco / Cajas |
| [ARQUITECTURA_RABBIT_WORKERS.md](./ARQUITECTURA_RABBIT_WORKERS.md) | RabbitMQ, ContabilidadWorker, eventos async |
| [MENU_Y_PERMISOS.md](./MENU_Y_PERMISOS.md) | Menú superior/lateral y permisos por perfil |
| [GRAPHQL_PERMISOS_MENU.md](./GRAPHQL_PERMISOS_MENU.md) | Queries GraphQL de menú y permisos |
| [CONEXION_LOGIN.md](./CONEXION_LOGIN.md) | Flujo de login / JWT |
| [TESTING.md](./TESTING.md) | Unitarios P0, coverage gate, Nest Inicio/Tercero, E2E Playwright (smoke + configuración) |

## Planes activos

| Documento | Estado |
|-----------|--------|
| [planes/PLAN_CONTABILIDAD_COMPLETO.md](./planes/PLAN_CONTABILIDAD_COMPLETO.md) | Plan maestro Contabilidad (Fases 1–5) |
| [planes/PLAN_INICIO_CONFIGURACION_MULTIEMPRESA.md](./planes/PLAN_INICIO_CONFIGURACION_MULTIEMPRESA.md) | Inicio / Configuración vs Dolibarr (hub, IVA, dashboard) |
| [planes/PLAN_CONFIG_GLOBAL_DICCIONARIOS.md](./planes/PLAN_CONFIG_GLOBAL_DICCIONARIOS.md) | Supercedido: diccionarios por empresa (gran parte ya hecha) |
| [planes/PLAN_KARDEX_STOCK_MULTIEMPRESA.md](./planes/PLAN_KARDEX_STOCK_MULTIEMPRESA.md) | Kardex / almacenes / transferencias / INV Rabbit |

## Datos y SQL

| Recurso | Uso |
|---------|-----|
| [BaseDatos.sql](./BaseDatos.sql) | Dump/esquema de referencia PostgreSQL |
| [sql/](./sql/) | Scripts SQL puntuales (menús, diccionarios, factura, config contable) |
| [sql/sp/](./sql/sp/) | Stored procedures (Python/C# no usan SQL ad-hoc) |
| [ACCESO_BD_SOLO_SP.md](./ACCESO_BD_SOLO_SP.md) | Convención: solo SP desde Python y C# |
| [seeds/](./seeds/) | Semillas (p. ej. plan de cuentas Excel) |

Las migraciones de microservicio viven junto al código, por ejemplo:

- `ContabilidadNestJs/migrations/`
- `MenuNestJs/migrations/`
- `BancoCajaPython/migrations/`

## Convención

- El front **solo** habla con el gateway (`VITE_GATEWAY_URL`, puerto **3002**).
- Lectura habitual: NestJS GraphQL.
- Escritura habitual: Python REST vía `/api/...` en el gateway.
- **Python y C#/.NET**: no queries SQL en código; solo stored procedures ([ACCESO_BD_SOLO_SP.md](./ACCESO_BD_SOLO_SP.md)).
- Documentación operativa del día a día: actualizar este índice y los docs de módulo; no acumular “auditorías” sueltas.

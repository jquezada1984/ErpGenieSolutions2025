# Pruebas — ERP Genie

Suite unitaria P0 + integración (scope/SP/pago) + Nest GraphQL por dominio + E2E Playwright. **Sin umbral de coverage global**; gate **80 % solo en paths P0**.

## Cómo correr (recomendado: Docker, sin Node en el host)

Requisito: **Docker Desktop**. No hace falta `npm`/`node` instalados en Windows.

```powershell
cd c:\proyectos\ErpGenieSolutions2025

# Solo unitarios P0 + Nest + pytest
.\scripts\test-docker.ps1 unit

# E2E (stack erp-frontend-dev + gateway arriba)
.\scripts\test-docker.ps1 smoke
.\scripts\test-docker.ps1 config
.\scripts\test-docker.ps1 e2e

# Todo
.\scripts\test-docker.ps1 all
```

En Git Bash / WSL: `./scripts/test-docker.sh unit|smoke|config|e2e|all`.

### E2E — prerrequisitos

1. Stack de desarrollo:

```powershell
docker compose -f docker-compose.dev.yml up -d
```

2. Credenciales QA en `frontReact/.env.e2e` (no commit):

```powershell
copy frontReact\.env.e2e.example frontReact\.env.e2e
# Editar E2E_USER_EMAIL / E2E_USER_PASSWORD
```

3. El script Playwright usa `E2E_BASE_URL=http://host.docker.internal:3000` y lee `.env.e2e` del volumen.

---

## Cómo correr (host, si tienes Node/Python)

### gateway-api (Jest)

```bash
cd gateway-api
npm install
npm test
npm run test:coverage   # fail-under 80 solo requestContext + scopeAuth
```

### frontReact (Vitest)

```bash
cd frontReact
npm install
npm test
npm run test:coverage   # fail-under 80 solo scopeAcceso.ts
```

### FinancieroPython (pytest)

```bash
cd FinancieroPython
pip install -r requirements.txt -r requirements-dev.txt
pytest
pytest --cov=services.factura_calc --cov-report=term-missing --cov-fail-under=80
```

### ContabilidadWorker (pytest)

```bash
cd ContabilidadWorker
pip install -r requirements.txt -r requirements-dev.txt
pytest
pytest --cov=worker --cov-report=term-missing --cov-fail-under=80
# El bucle AMQP (`connect_and_consume` / `main`) está marcado pragma: no cover.
```

### InventarioPython (pytest)

```bash
cd InventarioPython
pip install -r requirements-dev.txt sqlalchemy Flask-SQLAlchemy
# (opcional) pip install -r requirements.txt  — stack completo del servicio
pytest
pytest --cov=services.stock_service --cov=utils.sp --cov-report=term-missing --cov-fail-under=80
```

Los unitarios mockean las funciones `sp_*`; no requieren Postgres ni Rabbit.

### Nest GraphQL (lectura / filtro empresa)

```bash
cd InicioNestJs && npm install --legacy-peer-deps && npm test -- --testPathPatterns="impuesto|auth.service"
cd TerceroNestJs && npm install --legacy-peer-deps && npm test -- --testPathPatterns="tercero.(service|resolver).spec"
cd ItemNestJs && npm install --legacy-peer-deps && npm test -- --testPathPatterns="items\\.(service|resolver)\\.spec"
cd InventarioNestJs && npm install --legacy-peer-deps && npm test -- --testPathPatterns="inventario\\.(service|resolver)\\.spec"
cd FinancieroNestJs && npm install --legacy-peer-deps --ignore-scripts && npx jest --testPathPatterns="financiero"
cd ContabilidadNestJs && npm install --legacy-peer-deps --ignore-scripts && npx jest --testPathPatterns="diario-contable"
cd BancoCajaNestJs && npm install --legacy-peer-deps && npm test -- --testPathPatterns="cuenta-bancaria"
cd MenuNestJs && npm install --legacy-peer-deps && npm test -- --testPathPatterns="autorizacion"
```

### InicioPython / gateway strip scope

```bash
cd InicioPython && pip install -r requirements-dev.txt && pytest
cd gateway-api && npm test   # incluye routes/usuarios.scope
```

### FinancieroPython — pendiente de pago

```bash
cd FinancieroPython
pip install -r requirements.txt -r requirements-dev.txt
pytest tests/test_pago_pendiente.py
```

## E2E Playwright (Sprint S3)

Specs en `frontReact/e2e/`:

| Spec | Tag | Qué cubre |
|------|-----|-----------|
| `smoke-login-dashboard.spec.ts` | `@smoke` | Login → `/dashboard` |
| `smoke-factura-listado.spec.ts` | `@smoke` | Abre listado facturas cliente (sin crear) |
| `configuracion.spec.ts` | `@config` | Hub, empresa, IVA, paneles, alertas, emails, seguridad |

### Prerrequisitos

1. Front en `http://localhost:3000` (o URL QA) **y** gateway/API alcanzables por ese front.
2. Usuario QA (nunca prod). Copiar env:

```bash
cd frontReact
cp .env.e2e.example .env.e2e
# Editar E2E_USER_EMAIL, E2E_USER_PASSWORD, E2E_SCOPE=GLOBAL|EMPRESA
```

3. Navegador Chromium de Playwright:

```bash
cd frontReact
npm install
npm run test:e2e:install
```

### Comandos

```bash
cd frontReact
npm run test:e2e          # todos los specs
npm run test:e2e:smoke    # solo @smoke
npm run test:e2e:config   # solo @config
npm run test:e2e:ui       # UI mode
```

Sin `E2E_USER_EMAIL` / `E2E_USER_PASSWORD`, los tests se **omiten** (`test.skip`) y el proceso sale en verde — útil en CI sin stack.

Variables:

| Variable | Default | Uso |
|----------|---------|-----|
| `E2E_BASE_URL` | `http://localhost:3000` | Front bajo prueba |
| `E2E_USER_EMAIL` / `E2E_USER_PASSWORD` | — | Obligatorias para ejecutar (no skip) |
| `E2E_SCOPE` | `GLOBAL` | Asserts multiempresa (combo vs barra sesión) |
| `E2E_MUTATE` | `0` | `1` = Grabar/Modificar en paneles/alertas/emails/seguridad |

**No** usar `DATABASE_URL` ni credenciales de Supabase/prod en E2E.

## Paths P0 (gate 80 %)

| Path | Runner |
|------|--------|
| `gateway-api/src/utils/requestContext.js` | Jest (`coverageThreshold`) |
| `gateway-api/src/utils/scopeAuth.js` | Jest |
| `frontReact/src/utils/scopeAcceso.ts` | Vitest (`thresholds`) |
| `FinancieroPython/services/factura_calc.py` | pytest `--cov-fail-under=80` |
| `ContabilidadWorker/worker.py` (`procesar_evento` / `_post` / `on_message`) | pytest `--cov-fail-under=80` |
| `InventarioPython/services/stock_service.py` + `utils/sp.py` | pytest `--cov-fail-under=80` |

El resto del monorepo **no** tiene umbral rígido.

## Integración SP (sin Supabase / prod)

No hay BD de test en CI. **No** usar `DATABASE_URL` de producción ni Supabase para tests destructivos. Usar solo `DATABASE_URL_TEST`.

### Qué sí cubre la suite actual

- Gateway: strip de `scope_acceso` en POST/PUT `/api/usuarios` (`routes/__tests__/usuarios.scope.test.js` + `scopeAuth`).
- InicioPython: `utils/usuario_scope.py` fuerza EMPRESA si el caller no es GLOBAL.
- FinancieroPython: pago no supera pendiente (`tests/test_pago_pendiente.py`, mock DB).
- InventarioPython: contrato/mapeo SP mock (`tests/test_sp_contrato.py`) + marker `integration` (`tests/test_sp_integration.py`).

### Cómo correr integración SP real (opcional, local)

1. Levantar Postgres **dedicado** (Docker local o instancia QA), nunca prod.
2. Aplicar scripts de `docs/sql/sp/` (kardex / almacenes).
3. Exportar solo `DATABASE_URL_TEST`:

```bash
# Windows PowerShell (ejemplo QA local)
$env:DATABASE_URL_TEST = "postgresql://erp:erp@localhost:5432/erp_test"
cd InventarioPython
pip install psycopg2-binary
pytest -m integration
```

Sin `DATABASE_URL_TEST`, `pytest -m integration` hace **skip** (exit 0). CI ejecuta el marker así a propósito.

## CI

| Workflow | Qué hace |
|----------|----------|
| `.github/workflows/test-unit.yml` | Unitarios P0 (fail-under 80) + Nest dominios + InicioPython scope + pago pendiente + integration skip |
| `.github/workflows/test-e2e.yml` | Playwright; **skip** si no hay secrets `E2E_*` (no exige Docker) |

Para habilitar E2E real en GitHub: secrets `E2E_BASE_URL`, `E2E_USER_EMAIL`, `E2E_USER_PASSWORD` (y opcional `E2E_SCOPE`) apuntando a un entorno QA estable.

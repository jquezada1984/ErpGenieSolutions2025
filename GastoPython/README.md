# GastoPython — microservicio de escritura (Flask)

Escritura del módulo Gastos. Diseñado para operar **detrás del Gateway**
en red Docker interna (sin publicar el puerto al host cuando se integre Docker).

NestJS / Gateway / Frontend: **aún no implementados** en esta fase.

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/categoria-gasto` | Crear categoría |
| PUT | `/api/categoria-gasto/:id` | Actualizar categoría |
| PATCH | `/api/categoria-gasto/:id/estado` | Activar/desactivar |
| POST | `/api/gasto` | Crear gasto + detalles (TX) |
| PUT | `/api/gasto/:id` | Actualizar BORRADOR (reemplazo detalles) |
| GET | `/health` | Healthcheck |

### Headers obligatorios (escritura)

| Header | Uso |
|--------|-----|
| `X-Company-Id` | Empresa efectiva (EMPRESA: obligatorio; GLOBAL: o body `id_empresa`) |
| `X-User-Id` | UUID del usuario (auditoría `created_by` / `updated_by`) — **obligatorio** |
| `X-Scope-Acceso` | `EMPRESA` (default) o `GLOBAL` |

No se acepta crear/actualizar gasto con usuario nulo.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL del servicio (runtime) |
| `JWT_SECRET` / `JWT_SECRET_KEY` | Requerido al arrancar (patrón BancoCaja; rutas no usan `@jwt_required`) |
| `CORS_ORIGINS` | Orígenes CORS |
| `PORT` | Default `3018` |
| `DB_SSLMODE` | Default `require` |
| `TEST_DATABASE_URL` | **Solo tests de integración** (nunca usar prod por accidente) |
| `TEST_USER_ID` | UUID usuario válido en BD de testing (opcional; si no, se toma uno de `usuario`) |
| `ALLOW_TEST_ON_DATABASE_URL` | `1` solo si TEST_DATABASE_URL == DATABASE_URL a propósito (staging) |

Copia `env.example` a `.env` para desarrollo local.

## Política transaccional (gasto)

Misma `db.session`:

1. `SELECT obtener_siguiente_numero_gasto(id_empresa, fecha_gasto)`
2. `INSERT gasto`
3. `flush`
4. `INSERT gasto_detalle[]`
5. `COMMIT`

Cualquier excepción → `ROLLBACK` (incluye el contador `gasto_secuencia`).

Los repositories **no** hacen commit en el flujo de create/update de gasto.

## Política `numero_gasto`

- Generado solo por `public.obtener_siguiente_numero_gasto(UUID, DATE)`.
- Año = año de `fecha_gasto`.
- Formato `GAS-YYYY-######`.
- Independiente por empresa y año.
- No usar MAX/COUNT/secuencias dinámicas en Python.

## Totales / redondeo

- Backend calcula totales con `Decimal` + `ROUND_HALF_UP`.
- `cantidad` / `precio_unitario`: hasta 4 decimales.
- Importes monetarios derivados: **2 decimales**.
- No usar `float`.
- Totales enviados por el cliente se ignoran.

## IntegrityError (cliente)

Sin SQL ni detail de PostgreSQL. Mapeo por `pgcode` / nombre de constraint:

- Unique categoría código/nombre → 409 mensajes específicos
- Unique `numero_gasto` → 409 numeración
- FK → **400** (referencia inválida del cliente)
- CHECK → **400**
- Otros → 409 genérico

## Arranque local

```bash
cd GastoPython
python -m venv .venv
# activar venv
pip install -r requirements.txt
# configurar .env
python app.py
```

## Tests unitarios (sin BD)

```bash
cd GastoPython
python -m pytest tests/ -q --ignore=tests/integration
```

## Tests de integración (PostgreSQL de testing)

```bash
# Windows PowerShell
$env:TEST_DATABASE_URL="postgresql://user:pass@host:5432/db_testing"
$env:DB_SSLMODE="require"   # o disable según entorno
# opcional:
$env:TEST_USER_ID="<uuid-usuario-existente>"

cd GastoPython
python -m pytest tests/integration -q
```

Si `TEST_DATABASE_URL` no está definida, los tests de integración hacen **SKIP** automático.
Nunca se usa `DATABASE_URL` productiva de forma automática para tests destructivos.

Los fixtures crean categorías/terceros/items/gastos con UUID propios y los borran en teardown.
Se usan años artificiales (p. ej. 2098/2099) para no interferir con series operativas.

## Seguridad (fase actual)

- Este servicio confía en headers de contexto (mismo patrón que BancoCaja/Tercero).
- El perímetro previsto es el **Gateway** + red Docker interna (puerto 3018 no publicado al host).
- No se añade `@jwt_required` solo en GastoPython (evitar modelo distinto al resto del ERP).

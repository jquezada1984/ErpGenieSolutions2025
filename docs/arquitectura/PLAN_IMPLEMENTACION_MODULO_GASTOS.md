# PLAN DE IMPLEMENTACIÓN — MÓDULO GASTOS

**Fecha:** 2026-07-26  
**Fase:** solo planificación (sin código, sin Docker, sin BD, sin Gateway, sin Frontend).  
**Referencias leídas y contrastadas con código:**

- `docs/auditoria/AUDITORIA_MODULO_TERCEROS_PARA_GASTOS.md`
- `docs/arquitectura/AUDITORIA_SOCIOS_VS_TERCEROS_PARA_GASTOS.md`

**Contrato BD:** DDL de `categoria_gasto`, `gasto`, `gasto_detalle` suministrado por el usuario (tablas ya creadas). No hay models/entities de gasto en el repositorio al momento de este plan.

---

## 1. Resumen ejecutivo

Gastos se implementará como **nuevo dominio CQRS** del Mini ERP:

| Capa | Tecnología | Rol |
|------|------------|-----|
| Front | React + Apollo + RHF + Yup | UI listados/formularios |
| Gateway | Fastify | Única fachada |
| Lectura | **GastoNestJs** (GraphQL + TypeORM) | Listados y detalle |
| Escritura | **GastoPython** (Flask + SQLAlchemy + Marshmallow) | CUD + TX cabecera/detalle + cálculos |
| BD | PostgreSQL (ya existe) | Persistencia |

**Híbrido acordado:** listados/Apollo/CQRS Nest = **Socios**; formularios complejos/media/id_empresa = **Terceros**; TX detalle = **Socios** (`socio`+`socio_tercero`).

**Fuera de v1:** pagos, banco, contabilidad, OCR, documentos Media (solo previsión), workflow avanzado.

**Puertos propuestos (libres hoy en `docker-compose.yml`):** Nest **3017**, Python **3018**.

---

## 2. Arquitectura final propuesta

```
frontReact (:3000)
    │  GraphQL (Apollo mainClient)     REST (axios _apis_/gasto.js)
    ▼
gateway-api (:3002)
    ├─ POST /graphql → operaciones gasto* → GastoNestJs (:3017)
    ├─ GET  /api/gasto*, /api/categoria-gasto* (selects/listas REST opcionales) → Nest o solo GQL
    └─ POST/PUT/PATCH /api/gasto*, /api/categoria-gasto* → GastoPython (:3018)
         │                                      │
         ▼                                      ▼
   GastoNestJs (solo Query)              GastoPython (escritura + Decimal)
         │                                      │
         └──────────── PostgreSQL ──────────────┘
              categoria_gasto | gasto | gasto_detalle
              (+ lectura impuestos, tercero, item)
```

**Prohibido en v1:** mutations GraphQL de escritura; GET de negocio duplicados en Flask sin justificación; `/api/api/...`; dos caminos de la misma mutación.

---

## 3. Decisiones tomadas de Terceros

| Decisión | Evidencia / uso en Gastos |
|----------|---------------------------|
| Columna `id_empresa` en cabecera | DDL `gasto.id_empresa`, `categoria_gasto.id_empresa` |
| Formularios multi-sección / tabs | Nuevo/Editar gasto (General + Detalle [+ Documentos futuro]) |
| Yup en archivo dedicado | `schemas/gastoSchema.ts` |
| Marshmallow en Python | `schemas/gasto_schema.py`, `categoria_gasto_schema.py` |
| SelectEmpresa + GLOBAL/EMPRESA | Listado y formulario |
| Media previsto `module`/`module_id` | Fase futura `module='gasto'` |
| Rutas Listado / Nuevo / Editar | `/gastos`, `/gastos/nuevo`, `/gastos/editar/:id` |
| Catálogos compartidos InicioNestJs | `impuestos`, `empresas`, países si aplica |
| Soft `estado` boolean ≠ estado documento | `estado` vs `estado_gasto` |

---

## 4. Decisiones tomadas de Socios

| Decisión | Evidencia / uso en Gastos |
|----------|---------------------------|
| `useQuery` + `skip` + `cache-and-network` | Listado gastos |
| `context.headers['X-Company-Id']` | GLOBAL selecciona empresa |
| `refetch` tras PATCH estado | Listado |
| Nest **solo Query** | `GastoNestJs` sin create/update mutations |
| Gateway: selects Nest / CUD Python | `routes/gasto.js` + `gastoNestJs.js` + `gastoPython.js` |
| PATCH `/…/estado` | Categoría y gasto |
| TX cabecera + hijos | `gasto` + `gasto_detalle` (como `socio`+`socio_tercero`) |
| `Controller` + `SearchableSelect` + `isDirty` | Formulario |
| Envelope Python `{ success, data/error }` | Respuestas REST gasto (mejor que tercero plano) |

---

## 5. Mejoras respecto a ambos

| Mejora | Evita el defecto de… |
|--------|----------------------|
| `gastos(id_empresa: ID!)` **obligatorio** + header company | Terceros `terceros(id_empresa?)` sin filtro; Socios header-only sin arg documentado |
| `gasto(id_gasto, id_empresa: ID!)` o validación `gasto.id_empresa === company` | Socios `socio(id)` sin revalidar empresa |
| Tras create/update: `navigate` + refetch listado | Socios solo Alert |
| Numeración concurrente segura (función BD o retry UNIQUE) | Terceros `exists`+loop race; Contabilidad tiene función BD (mejor modelo) |
| Cálculos con `Decimal` en backend; ignorar totales del front | Riesgo float |
| Impuesto desde tabla `impuestos.tasa` por `impuesto_id` | Confiar tasa UI |
| UPDATE detalle v1 = **reemplazo total** (como socio_tercero) | Complejidad diff prematura |
| Un solo prefijo REST `/api/gasto` y `/api/categoria-gasto` | Duplicados singular/plural |
| Util `requestContext` en Gateway (no acoplar a `terceroPython.js`) | Bug histórico ítems |

---

## 6. Estructura GastoNestJs

### 6.1 Ubicación y convención

Seguir `ItemNestJs` / `TerceroNestJs`:

```
GastoNestJs/
  Dockerfile
  package.json
  nest-cli.json
  tsconfig.json
  env.example
  src/
    main.ts
    app.module.ts
    schema.gql          # autoSchemaFile (runtime; no fuente de verdad manual)
    modules/
      gasto/
        gasto.module.ts
        gasto.resolver.ts
        gasto.service.ts
        entities/gasto.entity.ts
        entities/gasto-detalle.entity.ts
      categoria-gasto/
        categoria-gasto.module.ts
        categoria-gasto.resolver.ts
        categoria-gasto.service.ts
        entities/categoria-gasto.entity.ts
      health/ (opcional GET /health)
```

### 6.2 Config técnica

| Pieza | Propuesta (alineada a ItemNestJs) |
|-------|-----------------------------------|
| GraphQL | ApolloDriver, `autoSchemaFile`, `sortSchema: true`, playground/introspection según `NODE_ENV` |
| TypeORM | `url: DATABASE_URL`, `synchronize: false`, SSL si supabase |
| Puerto interno | `3017` |
| Healthcheck | Igual patrón BancoCajaNest / TerceroNest (TCP connect) |
| JWT Guards | **No** en v1 (igual dominio actual); seguridad vía Gateway + filtros empresa |

### 6.3 Entities (mapear DDL exacto)

**CategoriaGasto** → `categoria_gasto`  
**Gasto** → `gasto` (OneToMany detalles)  
**GastoDetalle** → `gasto_detalle` (ManyToOne gasto CASCADE)

Relaciones TypeORM: FKs a `empresa`/`tercero`/`item` solo si se registran entities mínimas de referencia **o** columnas UUID sin join (preferible v1: columnas UUID + joins opcionales a stubs, como Item hace con empresa ref).

**No** registrar mutations de escritura.

---

## 7. Queries GraphQL y contratos

### Estrategia multiempresa (decisión recomendada)

**Evidencia:**

- Socios: header `X-Company-Id` obligatorio; sin arg GraphQL (`socio.resolver.ts`).
- Terceros: arg `id_empresa` **opcional** → riesgo listar todo (`tercero.service.findAll`).
- Items: `itemsListado(id_empresa: …)` con variable explícita.

**Recomendación Gastos (única estrategia):**

1. Argumento GraphQL **`id_empresa: ID!` obligatorio** en listados.  
2. Front **siempre** envía el mismo valor en `context.headers['X-Company-Id']` (patrón Socios).  
3. Service: filtrar **siempre** por `id_empresa` del arg; si además hay header y **difieren**, **rechazar 400** (evita spoofing GLOBAL accidental).  
4. Detalle: `gasto(id_gasto: ID!, id_empresa: ID!)` — si el registro existe pero `gasto.id_empresa !== id_empresa` → **NotFound** (no filtrar solo por UUID).

> **Decisión pendiente de aprobación:** ¿preferís header-only puro (Socios) o arg obligatorio (recomendado arriba)? El plan asume **arg obligatorio + coherencia con header**.

### Queries

| Nombre | Args | Headers | Return | Resolver | Service | Filtro multiempresa |
|--------|------|---------|--------|----------|---------|---------------------|
| `categoriasGasto` | `id_empresa: ID!`, `solo_activos: Boolean = true` | `X-Company-Id` coherente | `[CategoriaGasto!]!` | CategoriaGastoResolver | findByEmpresa | `WHERE id_empresa = :id` |
| `categoriaGasto` | `id_categoria_gasto: ID!`, `id_empresa: ID!` | idem | `CategoriaGasto` | idem | findOneSecure | id + empresa |
| `gastos` | `id_empresa: ID!`, filtros opcionales `estado_gasto`, `desde`, `hasta` | idem | `[Gasto!]!` | GastoResolver | findByEmpresa | id_empresa |
| `gasto` | `id_gasto: ID!`, `id_empresa: ID!` | idem | `Gasto` (+ detalles) | GastoResolver | findOneSecure | id + empresa |

**Sin** mutations GraphQL.

---

## 8. Estructura GastoPython

Seguir `TerceroPython` / `ItemPython`:

```
GastoPython/
  app.py
  Dockerfile
  requirements.txt
  config/config.py
  utils/db.py
  api/
    gasto_routes.py
    categoria_gasto_routes.py
  services/
    gasto_service.py
    categoria_gasto_service.py
    calculo_gasto.py      # Decimal puro
  repositories/
    gasto_repository.py
    categoria_gasto_repository.py
  models/
    gasto.py
    gasto_detalle.py
    categoria_gasto.py
    # stubs mínimos: Impuesto, Tercero, Item, Empresa si hacen falta FKs
  schemas/
    gasto_schema.py
    categoria_gasto_schema.py
```

Puerto **3018**. Blueprints bajo `/api`.

---

## 9. Endpoints REST y contratos

Prefijo Gateway: `/api` (igual que socio/item).  
Fuente de verdad empresa/usuario: **headers tras `requestContext` / `ctxHeaders`**, no body.

### 9.1 Categorías

#### `POST /api/categoria-gasto`

| | |
|--|--|
| **Backend** | GastoPython |
| **Headers** | `Authorization`, `X-Company-Id`, `X-User-Id`, `X-Scope-Acceso` |
| **Body** | `{ codigo, nombre, descripcion? }` — **sin** `id_empresa` confiable del cliente |
| **Response 201** | `{ success: true, data: { id_categoria_gasto, … } }` |
| **Errores** | 400 validación / falta company; 409 unique (codigo/nombre); 500 |

#### `PUT /api/categoria-gasto/:id`

| | |
|--|--|
| **Body** | `{ codigo?, nombre?, descripcion? }` |
| **Response 200** | `{ success: true, data: … }` |
| **Errores** | 404 si no existe **o** otra empresa; 409 unique; 400 |

#### `PATCH /api/categoria-gasto/:id/estado`

| | |
|--|--|
| **Body** | vacío o `{ estado?: boolean }` — preferible toggle server-side como socio |
| **Response 200** | `{ success: true, data: … }` |
| **Errores** | 404 cross-company |

### 9.2 Gastos

#### `POST /api/gasto`

| | |
|--|--|
| **Backend** | GastoPython |
| **Headers** | Auth + Company + User + Scope |
| **Body** | Ver §9.3 (sin totales confiables; sin `id_empresa` como verdad) |
| **Response 201** | `{ success: true, data: { id_gasto, numero_gasto, …, detalles: […] } }` |
| **Errores** | 400 validación/negocio; 409 `numero_gasto`; 404 refs inválidas |

#### `PUT /api/gasto/:id`

| | |
|--|--|
| **Reglas** | Solo si `estado_gasto` editable (ver §16); TX reemplazo detalles |
| **Response 200** | `{ success: true, data: … }` |
| **Errores** | 404 cross-company; 409 estado no editable; 400 |

#### `PATCH /api/gasto/:id/estado`

| | |
|--|--|
| **Body** | `{ estado_gasto: "PENDIENTE" \| … }` (**no** confundir con `estado` boolean) |
| **Response 200** | `{ success: true, data: … }` |
| **Errores** | 400 transición inválida; 404 |

### 9.3 Body create/update gasto (conceptual)

```json
{
  "id_tercero": "uuid|null",
  "id_categoria_gasto": "uuid",
  "tipo_documento": "string|null",
  "numero_documento": "string|null",
  "fecha_gasto": "YYYY-MM-DD",
  "fecha_vencimiento": "YYYY-MM-DD|null",
  "concepto": "string",
  "observacion": "string|null",
  "detalles": [
    {
      "id_item": "uuid|null",
      "impuesto_id": 1,
      "descripcion": "string",
      "cantidad": "1.0000",
      "precio_unitario": "10.0000",
      "descuento": "0.00",
      "orden": 1
    }
  ]
}
```

Campos **ignorados/recalculados** en backend: `subtotal`, `descuento` (cabecera), `impuesto`, `total`, `valor_impuesto`, `total` línea, etc.

### 9.4 Endpoints adicionales (solo si imprescindibles)

| Endpoint | Justificación |
|----------|----------------|
| `GET /health` en Python/Nest | Convive con resto de servicios |
| **No** GET `/api/gasto` en Python | Listados vía GraphQL |
| **No** GET detalle REST | Evitar doble camino (salvo emergencia; no en v1) |

---

## 10. Modelos SQLAlchemy

Mapear **exactamente** el DDL usuario (tipos `Numeric`, UUID string/uuid, booleans, timestamps).

- `CategoriaGasto`, `Gasto`, `GastoDetalle`
- Stubs de lectura: `Impuesto` (`impuestos.id`, `tasa`), opcional `Tercero`, `Item` para validar FKs por query
- `synchronize`/create_all: **no** crear tablas

---

## 11. Schemas Marshmallow

- `CategoriaGastoCreateSchema` / `UpdateSchema` / `OutSchema`
- `GastoCreateSchema` / `UpdateSchema` con `Nested(GastoDetalleLineSchema, many=True, required=True, validate=Length(min=1))`
- `GastoEstadoSchema`: `estado_gasto` OneOf(CHECK)
- Usar `fields.Decimal` (como ItemPython), no float
- `unknown=EXCLUDE` para totales enviados por front

---

## 12. Transacciones gasto + detalle

**Patrón Socios** (`socio_service.create_socio`): `commit=False` → flush → hijos → `commit` / `rollback`.

### CREATE

```
BEGIN
  resolver id_empresa, created_by desde headers
  generar numero_gasto
  INSERT gasto (totales=0 provisional o calculados)
  FOR each detalle:
    validar item/impuesto/empresa
    calcular línea Decimal
    INSERT gasto_detalle
  UPDATE gasto SET subtotal, descuento, impuesto, total
COMMIT
```

### UPDATE (v1 recomendada: **opción A — reemplazar todos los detalles**)

```
BEGIN
  lock/load gasto WHERE id AND id_empresa
  validar estado_gasto editable
  UPDATE columnas cabecera
  DELETE FROM gasto_detalle WHERE id_gasto = …   -- ON DELETE CASCADE también ok si se recrean
  INSERT nuevas líneas calculadas
  UPDATE totales cabecera
COMMIT
```

**Por qué A y no B (diff):** Socios ya borra y recrea `socio_tercero`; menos bugs en v1; `orden` se reasigna 1..N.

**Opción B** queda como mejora futura si se necesita conservar `id_gasto_detalle` por auditoría Media.

---

## 13. Cálculo monetario e impuestos

### 13.1 Catálogo real `impuestos`

Evidencia `InicioNestJs/src/entities/impuesto.entity.ts`:

| Campo | Tipo |
|-------|------|
| `id` | integer PK |
| `nombre` | varchar |
| `tasa` | decimal(5,2) — porcentaje |

Front ítems usa GraphQL `{ impuestos { id nombre tasa } }` (`_apis_/gateway.js`). Datos observados históricamente: IVA 0% y 12%.

**No** hay en entity campos de retención/tipo en InicioNestJs.  
→ v1: tratar **toda** fila `impuestos` como tasa % aplicable; si en BD real existen retenciones, **decisión pendiente** (filtrar por nombre/tipo si aparece columna no mapeada).

### 13.2 Fórmulas (backend `Decimal`, redondeo recomendado `ROUND_HALF_UP` a 2 decimales en montos de dinero; cantidad/precio hasta 4 según DDL)

Por línea:

```
importe_bruto = qty * precio_unitario
base         = importe_bruto - descuento_linea
tasa         = impuestos.tasa IF impuesto_id ELSE 0
valor_impuesto = base * tasa / 100
total_linea  = base + valor_impuesto
```

Si `impuesto_id IS NULL` → tasa 0, `valor_impuesto = 0`.  
Si tasa 0% → igual.

Cabecera:

```
subtotal = Σ importe_bruto
descuento = Σ descuento_linea
impuesto = Σ valor_impuesto
total = subtotal - descuento + impuesto
```

Validar CHECKs DDL (`descuento <= subtotal`, etc.) antes de commit.

**Contradicción / nota:** el prompt sugiere `total = subtotal - descuento + impuesto` con `subtotal = Σ importe_bruto`; coherente. No usar `Σ total_linea` solo sin alinear descuentos.

---

## 14. Estrategia `numero_gasto`

### Evidencia en repo

| Mecanismo | Dónde | Concurrente |
|-----------|-------|-------------|
| Loop `exists` + `CU{yymm}-#####` | `TerceroPython/services/tercero_service.py` | **Débil** (race) |
| Función SQL `obtener_siguiente_numero_asiento(...)` | `ContabilidadNestJs` asiento service | **Preferible** |
| Fallback count+1 | mismo servicio si falla función | Débil |

### Propuesta Gastos (requiere aprobación)

**Opción recomendada:** función PostgreSQL `obtener_siguiente_numero_gasto(p_id_empresa uuid, p_fecha date) returns varchar` con secuencia/tabla contador **por empresa y año**, bajo lock (`FOR UPDATE` o `pg_advisory_xact_lock`).

Formato ejemplo (ajustable): `GAS-2026-000001`  
UNIQUE `(id_empresa, numero_gasto)` como red de seguridad + **retry** en IntegrityError (máx N intentos).

**No** usar solo `MAX+1` sin lock.

**Alternativa sin nueva función SQL (si no quieren tocar BD):** insert con número provisional + retry en unique violation (como mejora del patrón tercero). Menos limpio.

> **Decisión pendiente:** ¿crear función SQL de secuencia o solo retry UNIQUE en Python?

---

## 15. Multiempresa y seguridad

### Contexto

| Campo | Fuente de verdad |
|-------|------------------|
| `id_empresa` | Headers tras scope GLOBAL/EMPRESA (`requestContext`) |
| `created_by` / `updated_by` | `X-User-Id` |
| Body `id_empresa` | Ignorar o solo para GLOBAL si coincide con header final |

### Validaciones obligatorias escritura

1. `categoria_gasto.id_empresa === id_empresa` efectiva.  
2. Si `id_tercero`: `tercero.id_empresa === id_empresa` (nullable OK).  
3. Si `id_item`: `item.id_empresa === id_empresa` (Item es multiempresa — evidencia `ItemNestJs` entity).  
4. Update/PATCH: `WHERE id_gasto AND id_empresa`; 0 rows → 404.  
5. GraphQL detalle: ver §7.  
6. EMPRESA: Gateway fuerza company del usuario (no confiar body).  
7. GLOBAL: exigir company efectiva (header/selección); `skip` en UI sin empresa.

### Vulnerabilidades a no repetir

| Hallazgo | Origen |
|----------|--------|
| Listado sin filtro empresa | Terceros `findAll` |
| Detalle por UUID sin empresa | Socios `socio(id)` |
| Auth JWT no validado en microservicio dominio | Nest/Python actuales |
| ctxHeaders no exportado / acoplado | Ítems histórico |

---

## 16. Estados y transiciones

### Conceptos

| Campo | Significado |
|-------|-------------|
| `estado_gasto` | Ciclo documental (BORRADOR…ANULADO) |
| `estado` | Lógico registro (activo/inactivo); soft-hide |

### Transiciones mínimas v1 (propuesta)

```
BORRADOR  → PENDIENTE | ANULADO
PENDIENTE → APROBADO | RECHAZADO | ANULADO
APROBADO  → (sin cambios de datos; solo lectura) | ANULADO?  → DECISIÓN PENDIENTE
RECHAZADO → BORRADOR (reabrir) | ANULADO
ANULADO   → terminal
```

**Edición de cabecera/líneas:** solo `BORRADOR` (y opcionalmente `RECHAZADO` al reabrir).  
`PENDIENTE`/`APROBADO`: solo cambio de estado, no PUT completo.

> **Decisión pendiente:** ¿`APROBADO → ANULADO` permitido en v1 sin asiento/pago?

`PATCH` boolean `estado` de categoría = toggle activo (como socio).  
Gasto: **no** mezclar toggle boolean con `estado_gasto` en el mismo endpoint.

---

## 17. Gateway Fastify

### Archivos a crear (futuro)

| Archivo | Rol |
|---------|-----|
| `gateway-api/src/routes/gasto.js` | REST categoría + gasto |
| `gateway-api/src/services/gastoNestJs.js` | GQL client lectura (si hay REST selects) |
| `gateway-api/src/services/gastoPython.js` | Proxy escritura + `requestContext` |
| `gateway-api/src/routes/graphql.js` | Añadir detección queries gasto* |
| `gateway-api/src/app.js` | `register(routes/gasto, { prefix: '/api' })` |

### Env

```
GASTO_NEST_GQL_URL=http://gasto-nestjs-service:3017
GASTO_PY_BASE_URL=http://gasto-python-service:3018
GASTO_NEST_TIMEOUT=10000
GASTO_PY_TIMEOUT=15000
```

### Routing GraphQL (riesgo documentado)

Hoy: `query.includes('terceros')` etc. — **frágil** (falsos positivos).  
Para Gastos: strings específicos y ordenados **antes** de defaults:

`gastos(`, `gasto(`, `categoriasGasto`, `categoriaGasto`

**No** refactorizar todo el router en esta fase (pedido explícito).

### Headers escritura

Usar `../utils/requestContext.js` (`ctxHeaders` / `getUsuarioScope`) — **no** `require('./terceroPython')`.

---

## 18. Frontend listado

**Plantilla:** `frontReact/src/views/socios/Socios.tsx`

| Aspecto | Diseño |
|---------|--------|
| Query | `gastos(id_empresa: $id_empresa) { id_gasto numero_gasto fecha_gasto concepto total estado_gasto estado tercero{nombre} categoria{nombre} }` |
| Variables | `{ id_empresa }` obligatorio |
| skip | `isGlobal && !empresaSeleccionada` |
| headers | `X-Company-Id: empresa efectiva` |
| fetchPolicy | `cache-and-network` |
| errorPolicy | `all` |
| Columnas | Número, fecha, tercero, categoría, total, estado_gasto, acciones |
| Acciones | Editar (si editable), PATCH estado (select/transiciones), futuro docs |
| Loading/error | Spinner + Alert Apollo |
| Post-estado | `refetch()` |
| Ruta | `/gastos` |

Categorías: listado similar `/gastos/categorias` o subruta.

---

## 19. Frontend formulario y useFieldArray

**Estructura UI (híbrido):**

- Tabs: **General** | **Detalle** | (Documentos futuro)
- RHF + Yup archivo `gastoSchema.ts`
- `useFieldArray({ name: 'detalles' })`
- `Controller` + `SearchableSelect` (Socios)
- `SelectEmpresa` GLOBAL (Terceros)
- `isDirty` deshabilita guardar
- UX calcula totales en cliente; **submit envía inputs crudos**; respuesta muestra totales server

**Reutilizar:**

| Componente | Uso |
|------------|-----|
| `SelectEmpresa` | Empresa |
| `SearchableSelect` | Tercero, categoría, item, impuesto |
| Estilos `ConfiguracionTercero.scss` o nuevo `ConfiguracionGasto.scss` | Layout |
| Patrón tabs NuevoTercero | Contenedor |

**Nuevo:** páginas `Gastos.tsx`, `NuevoGasto.tsx`, `EditarGasto.tsx`, secciones, `_apis_/gasto.js`.

Tras éxito: `navigate('/gastos')` (listado hará network por `cache-and-network` / remount).

---

## 20. Catálogos / selects

| Catálogo | Origen actual en repo | Recomendación Gastos |
|----------|----------------------|----------------------|
| Empresa | GQL `empresas` InicioNestJs | **GraphQL directo** Apollo |
| Tercero | GQL `terceros(id_empresa)` | **GraphQL directo** |
| Impuesto | GQL `impuestos` vía gateway.js / InicioNestJs | **GraphQL directo** |
| Item | GQL `itemsListado(id_empresa)` ItemNestJs | **GraphQL directo** |
| Categoría gasto | Nuevo dominio | **GraphQL** `categoriasGasto(id_empresa)` (mismo Nest) |

Evitar REST facade salvo que se necesite homogeneizar con `_apis_` axios; Socios usa REST→Nest para roles por historia, no por ventaja.

---

## 21. Apollo / cache / refetch

| Caso | Estrategia |
|------|------------|
| Listado | `useQuery` + skip + cache-and-network (Socios) |
| Detalle edición | `useLazyQuery` / `useQuery` `network-only` |
| Tras PATCH estado | `refetch()` del listado |
| Tras POST/PUT | **navigate('/gastos')** (simple, coherente con ERP; evita cache eviction complejo) |
| Alternativa | `client.refetchQueries({ include: ['GetGastos'] })` si se permanece en la misma vista |

No `useMutation` GraphQL de escritura en v1.

---

## 22. Docker, puertos y ENV

### Puertos ocupados (compose actual)

3001–3007, 3010–3016, 5000–5002, 3000, 3002…

### Propuesta

| Servicio compose | Contenedor | Puerto host:container |
|------------------|------------|------------------------|
| `gasto-nestjs-service` | `erp-gasto-nestjs-service` | **3017:3017** |
| `gasto-python-service` | `erp-gasto-python-service` | **3018:3018** |

### ENV Gateway (añadir cuando se implemente)

`GASTO_NEST_GQL_URL`, `GASTO_PY_BASE_URL`, timeouts.

### depends_on

Gateway → gasto-nestjs + gasto-python (+ nestjs para scope).

### Healthcheck Nest

Patrón TCP como `banco-caja-nestjs-service` / `tercero-nestjs-service`.

---

## 23. Media / documentos (fase futura)

- `module = 'gasto'`, `module_id = id_gasto`, `id_empresa` efectiva.
- Flujo: upload → metadata (como Documentos / logo tercero).
- **Limitación actual:** `MediaServiceNestJs` solo **imagen + PDF** (`media.controller.ts`).  
- **XML:** fase futura ampliar MIME allowlist; no tocar Media ahora.
- UI: tercera pestaña o botón listado → `/documentos?module=gasto&module_id=…&empresa_id=…`.

---

## 24. Contabilidad / pagos (fase futura)

Diseño actual **no bloquea** integración:

- No FKs nuevas a asiento/pago en v1.
- `estado_gasto=APROBADO` puede ser gancho futuro para generar `documento_origen` / asiento / pago.
- Totales y `id_tercero` ya disponibles para pagos.
- Evitar acoplar `id_asiento` hasta que exista módulo.

---

## 25. Menú y permisos

Patrón: `MenuNestJs/migrations/menu-terceros.sql` + `permisos-*-para-perfil.sql`.

Propuesta scripts futuros (no ejecutar ahora):

- Sección **Gastos** (orden a definir).
- Ítems: Listado gastos, Nuevo gasto, Categorías.
- Rutas: `/gastos`, `/gastos/nuevo`, `/gastos/editar/:id`, `/gastos/categorias`, …
- Permisos por perfil (admin primero).

---

## 26. Estrategia de pruebas

### Backend

- Create 1 línea / N líneas  
- Rollback si línea inválida  
- Impuesto % correcto / 0% / null  
- Descuento línea y checks DDL  
- Tercero null OK  
- Categoría/tercero/item otra empresa → 400/404  
- Update/PATCH cross-company → 404  
- GraphQL detail cross-company → not found  
- Transición estado inválida → 400  
- Concurrencia `numero_gasto` (2 POST paralelos)

### Frontend

- EMPRESA vs GLOBAL sin/con empresa  
- useFieldArray add/remove  
- Recálculo UX  
- Editar + isDirty  
- Error backend en Alert  
- Refetch/navigate listado  

(Implementación de tests: fase posterior.)

---

## 27. Archivos NUEVOS (eventuales)

```
GastoNestJs/** (microservicio completo)
GastoPython/** (microservicio completo)
gateway-api/src/routes/gasto.js
gateway-api/src/services/gastoNestJs.js
gateway-api/src/services/gastoPython.js
frontReact/src/views/gastos/Gastos.tsx
frontReact/src/views/gastos/NuevoGasto.tsx
frontReact/src/views/gastos/EditarGasto.tsx
frontReact/src/views/gastos/CategoriasGasto.tsx
frontReact/src/views/gastos/schemas/gastoSchema.ts
frontReact/src/views/gastos/schemas/categoriaGastoSchema.ts
frontReact/src/views/gastos/secciones/*
frontReact/src/_apis_/gasto.js
MenuNestJs/migrations/menu-gastos.sql
MenuNestJs/migrations/permisos-gastos-para-perfil.sql
docs/arquitectura/MODULO_GASTOS_*.md (opcional)
```

SQL función numeración (si se aprueba): script en `GastoPython/migrations/` o `docs/sql/` — **solo si se autoriza**; tablas ya existen.

---

## 28. Archivos EXISTENTES a modificar (eventuales)

```
docker-compose.yml
docker-compose.dev.yml (si existe)
gateway-api/src/app.js
gateway-api/src/routes/graphql.js
frontReact/src/routes/Router.tsx
gateway-api env.example / .env.example (si aplica)
```

**No** modificar MediaService, Contabilidad, Terceros, en v1.

---

## 29. Riesgos técnicos

| Riesgo | Mitigación |
|--------|------------|
| Router GraphQL por `includes` | Nombres query inequívocos; orden de reglas |
| Race `numero_gasto` | Función SQL o retry UNIQUE |
| Float en JS | Decimal solo en Python; strings en JSON |
| Impuestos con semántica distinta a IVA | Auditar filas reales BD antes de prod |
| `impuesto_id` INTEGER vs UUID resto | Respetar DDL; no “normalizar” a UUID |
| Detalle sin `id_empresa` propio | Siempre join/validar vía cabecera |
| schema.gql committed obsoleto | Confiar en autoSchema runtime |
| Scope no llegado a Nest | Arg `id_empresa!` + header coherente |

---

## 30. Preguntas / decisiones que necesitan aprobación

1. **Multiempresa GraphQL:** ¿arg `id_empresa: ID!` + header (recomendado) o solo header Socios?  
2. **Numeración:** ¿función SQL dedicada o retry UNIQUE en Python? ¿Formato `GAS-YYYY-######`?  
3. **¿`APROBADO → ANULADO` en v1?**  
4. **¿Reabrir `RECHAZADO → BORRADOR`?**  
5. **UPDATE detalles:** confirmar reemplazo total (A) vs diff (B).  
6. **¿Listado categorías en menú v1 o solo CRUD embebido?**  
7. **¿Puerto 3017/3018 OK?**  
8. **Impuestos:** ¿filtrar solo IVA o todas las filas de `impuestos`?  
9. **¿Crear mutaciones Nest “por simetría”?** → **Recomendación: NO.**

---

## 31. Orden exacto recomendado de implementación

1. Aprobar decisiones §30.  
2. (Opcional) Script SQL `obtener_siguiente_numero_gasto` si se aprueba.  
3. Scaffold **GastoPython** (models/schemas/health) + Docker 3018.  
4. Scaffold **GastoNestJs** (entities/queries) + Docker 3017.  
5. Gateway: `requestContext` + `gastoPython`/`gastoNestJs` + `routes/gasto.js` + reglas `graphql.js` + env compose.  
6. Python: categoría CUD + tests manuales.  
7. Python: gasto create TX + cálculos Decimal + tests.  
8. Python: gasto update replace-detalles + PATCH estado.  
9. Nest: queries list/detail seguras multiempresa.  
10. Front: `_apis_/gasto.js` + listado Gastos (patrón Socios).  
11. Front: formulario Nuevo/Editar + useFieldArray.  
12. Front: categorías UI.  
13. Router + menú/permisos SQL.  
14. Pruebas checklist §26.  
15. (Futuro) Media pestaña documentos.  
16. (Futuro) Contabilidad/pagos.

---

## Contradicciones documentadas

| Tema | Prompt / auditoría | Código real | Resolución en este plan |
|------|-------------------|-------------|-------------------------|
| Listados Apollo | Preferir Socios | Confirmado en `Socios.tsx` | Adoptar Socios |
| Nest escritura | No mutations | Terceros aún tiene mutations | GastoNestJs sin mutations |
| Numeración | Evitar MAX+1 | Tercero loop exists; Contabilidad función SQL | Preferir función SQL + UNIQUE retry |
| Impuesto campo | “porcentaje” | Entity usa **`tasa`** | Usar `tasa` |
| Tablas gasto en repo | Usuario: existen en PG | **No** hay SQL/models en repo | Confiar DDL usuario; no migrar |
| Media XML | Futuro | Solo image/PDF | Documentado fase 2 |

---

**FIN DEL PLAN.**  
No se ha creado código ni modificado el repositorio salvo este documento.

**Archivo:** `docs/arquitectura/PLAN_IMPLEMENTACION_MODULO_GASTOS.md`

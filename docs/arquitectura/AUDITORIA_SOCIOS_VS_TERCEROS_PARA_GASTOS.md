# AUDITORÍA COMPARATIVA: SOCIOS vs TERCEROS (referencia para Gastos)

**Fecha:** 2026-07-26  
**Alcance:** solo lectura del código.  
**Complementa:** `docs/auditoria/AUDITORIA_MODULO_TERCEROS_PARA_GASTOS.md` (no la repite).  
**Objetivo:** decidir qué patrones de **Socios** son más modernos/limpios que Terceros para el futuro módulo **Gastos**.

> **No se modificó código de negocio.** Este archivo es el único artefacto generado.

---

## 1. Resumen ejecutivo

| Veredicto | Detalle |
|-----------|---------|
| Socios es **más limpio en listados Apollo** | `useQuery` + `skip` + `context.headers` + `refetch` vs `useLazyQuery` + estado local + `useEffect` |
| Socios es **más estricto en multiempresa (lectura Nest)** | Query `socios` **exige** `X-Company-Id`; filtra vía join `socio_tercero → tercero.id_empresa` |
| Socios es **más puro en CQRS Nest** | Nest solo lectura; **sin** mutations de escritura (Terceros sí tiene `createTercero`/`updateTercero` en Nest) |
| Socios es **más claro en escritura Python con relaciones** | Transacción atómica cabecera + `socio_tercero` |
| Terceros sigue siendo la plantilla de **formularios grandes multi-tab** | Socios es un formulario simple (1 card); Gastos con líneas/detalle se parece más a Terceros en complejidad UI |
| Híbrido recomendado para Gastos | **Listados/Apollo/multiempresa como Socios** + **formularios/secciones/media como Terceros** + **escritura Flask con transacciones como Socios** |

---

## 2. Frontend Socios

### 2.1 Archivos

| Archivo | Rol |
|---------|-----|
| `frontReact/src/views/socios/Socios.tsx` | Listado |
| `frontReact/src/views/socios/SocioForm.tsx` | Nuevo + Editar (una sola pantalla) |
| `frontReact/src/_apis_/socio.js` | REST selects + escritura |
| `frontReact/src/hooks/useJwtPayload.ts` | scope / id_empresa |
| `frontReact/src/components/SelectEmpresa.tsx` | GLOBAL |
| `frontReact/src/components/SearchableSelect.tsx` | Rol y terceros (multi) |
| `frontReact/src/config/apollo-client.ts` | Cliente Apollo compartido (`mainClient`) |

Rutas (`Router.tsx`): `/socios`, `/socios/nuevo`, `/socios/:id/editar`.

### 2.2 Listado (`Socios.tsx`) — patrón Apollo

```tsx
useQuery(GET_SOCIOS, {
  fetchPolicy: 'cache-and-network',
  errorPolicy: 'all',
  skip: isGlobal && !empresaSeleccionada,
  context: {
    headers: {
      'X-Company-Id': isGlobal ? empresaSeleccionada : empresaToken,
    },
  },
});
```

Características:

- **Declarativo:** no hay `useLazyQuery` + `setState` manual del array.
- **`skip`:** evita disparar query GLOBAL sin empresa.
- **Override de `X-Company-Id` por request** vía `context.headers` (respetado por `authLink`: no pisa si ya viene).
- **`refetchSocios()`** tras `toggleEstadoSocio` (REST) → lista coherente.
- Loading/error nativos de Apollo (`queryLoading`, `queryError`) + `Alert`/`Spinner`.
- Tabla: `react-table` (igual que Terceros).

**Comparado con Terceros (`Terceros.tsx`):**

- Terceros usa `useLazyQuery` + `loadTerceros()` + `useState(terceros)` + varios `useEffect`.
- Filtra empresa con **variable GraphQL** `terceros(id_empresa: $id_empresa)`.
- Tras toggle estado, actualiza estado local o recarga; el patrón es más imperativo.

→ **Para listados Gastos, el patrón Socios es superior** (menos código, menos estados, refetch claro).

### 2.3 Formulario (`SocioForm.tsx`)

| Aspecto | Implementación |
|---------|----------------|
| RHF + Yup | Sí; schema inline; test rango fechas |
| Controles | `Controller` + `SearchableSelect` (mejor integración RHF que sync `watch`/`setValue` de secciones Tercero) |
| Lectura detalle | `useLazyQuery(GET_SOCIO)` `network-only` |
| Select roles | REST `listarRolesSocio` → Gateway → Nest |
| Select terceros | REST `listarTercerosDisponibles` → Gateway → Nest |
| Escritura | REST `crearSocio` / `actualizarSocio` |
| GLOBAL | `SelectEmpresa`; en edición **deshabilitado** (empresa se infiere del socio) |
| UX | `isDirty` deshabilita guardar si no hay cambios; botón Cancelar = `reset` |

**Limitaciones vs Terceros (para Gastos):**

- Tras crear/editar: **no navega** al listado ni hace `refetch` del listado (solo Alert éxito).
- No hay tabs/secciones; OK para entidad simple; Gastos con detalle de líneas necesitará estructura tipo Terceros.
- Mezcla GraphQL (detalle) + REST (catálogos) — válido, pero inconsistente con “todo catálogo por GraphQL”.

### 2.4 ¿Apollo en Socios es “mejor” que en Terceros?

| Criterio | Socios | Terceros |
|----------|--------|----------|
| Listado | `useQuery` declarativo | `useLazyQuery` imperativo |
| Empresa GLOBAL | Header `X-Company-Id` | Variable `$id_empresa` |
| Post-escritura listado | `refetch` en toggle | Manual |
| Formulario | Apollo solo para detalle | Apollo para detalle + muchos catálogos GQL inline |
| Cache | `cache-and-network` | `cache-and-network` (lazy) |

**Conclusión:** sí, el **uso de Apollo en listados de Socios es más moderno y mantenible**. El de Terceros funciona, pero es más verboso y propenso a desync de estado local.

---

## 3. GraphQL — flujo real Socios

### 3.1 Queries usadas por el front

| Query | Dónde | Args / headers | Campos usados |
|-------|-------|----------------|---------------|
| `socios` | `Socios.tsx` | **Header** `X-Company-Id` (obligatorio en Nest) | id, fechas, estado, rol, socioTerceros |
| `socio(id_socio)` | `SocioForm.tsx` | ID; header opcional GLOBAL | detalle + vínculos + empresa del tercero |
| `empresas` | Ambos (GLOBAL) | — → **InicioNestJs** vía Gateway | SelectEmpresa |
| `rolesSocio` | Indirecto REST Gateway | — | vía `_apis_/socio.js` |
| `tercerosDisponiblesParaSocio` | Indirecto REST Gateway | `id_empresa`, `id_socio?` | select multi |

No hay **mutations GraphQL** de socio en el flujo UI.

### 3.2 Flujo completo listado `socios`

```
Socios.tsx
  useQuery(GetSocios)
    → Apollo mainClient (authLink: Bearer + X-Company-Id override)
      → POST gateway :3002/graphql
        → graphql.js detecta "socios" → TERCERO_NEST_GQL_URL
          → TerceroNestJs SocioResolver.socios
            → lee context.req.headers['x-company-id']
            → SocioService.findAllSocios(id_empresa)
              → TypeORM QueryBuilder
                 socio ⋈ rol_socio ⋈ socio_tercero ⋈ tercero
                 WHERE tercero.id_empresa = :id_empresa
              → PostgreSQL
```

### 3.3 Flujo `socio(id)`

```
SocioForm → useLazyQuery(GetSocio)
  → Gateway → TerceroNestJs SocioResolver.socio
    → SocioService.findOneSocio
      → joins rol + socio_tercero + tercero
```

### 3.4 Flujo selects (REST facade → Nest GraphQL)

```
listarRolesSocio()
  GET /api/socio/selects/rol-socio
    → socioNestJs.rolesSocio
      → query rolesSocio { … }
        → SocioService.findRolesSocio (estado=true)

listarTercerosDisponibles({ id_empresa, id_socio })
  GET /api/socio/selects/terceros
    → socioNestJs.tercerosDisponiblesParaSocio
      → query con NOT EXISTS socio_tercero (salvo el socio en edición)
```

---

## 4. Gateway Socios

### 4.1 Archivos

- `gateway-api/src/routes/socio.js`
- `gateway-api/src/services/socioNestJs.js`
- Escritura: `gateway-api/src/services/terceroPython.js` (`crearSocio`, `actualizarSocio`, `toggleEstadoSocio`)
- Enrutado GQL: `gateway-api/src/routes/graphql.js` (`rolesSocio`, `socios`, `socio(`, `tercerosDisponiblesParaSocio`)

### 4.2 Separación lectura / escritura

| Operación | Gateway | Backend |
|-----------|---------|---------|
| GET `/api/socio/selects/rol-socio` | `socioNestJs` | TerceroNestJs |
| GET `/api/socio/selects/terceros` | `socioNestJs` | TerceroNestJs |
| POST `/api/socio` | `terceroPython.crearSocio` | TerceroPython |
| PUT `/api/socio/:id` | `terceroPython.actualizarSocio` | TerceroPython |
| PATCH `/api/socio/:id/estado` | `terceroPython.toggleEstadoSocio` | TerceroPython |
| POST `/graphql` (socios/…) | proxy | TerceroNestJs |

**Más limpio que Terceros contactos:** en Socios la lectura de negocio va a Nest (directo GQL o REST→Nest); la escritura solo Python.  
(Excepción menor: existe endpoint Python `GET /api/socio/selects/rol-socio`, pero el **Gateway no lo usa**; usa Nest.)

### 4.3 Headers

| Header | Lectura Nest (`socioNestJs.ctxHeaders`) | Escritura Python (`terceroPython.ctxHeaders`) |
|--------|------------------------------------------|-----------------------------------------------|
| `Authorization` | Reenvía | No en `ctxHeaders` (sí puede ir en otras rutas; escritura socio usa X-*) |
| `X-Company-Id` | Reenvía tal cual | Resuelve GLOBAL/EMPRESA vía `getUsuarioScope` |
| `X-User-Id` | Reenvía | Reenvía |
| `X-Scope-Acceso` | **No** en socioNestJs | Sí (calculado) |

Python `socio_routes._ctx_headers` exige `X-Company-Id` salvo GLOBAL.

---

## 5. NestJS — módulo `socio`

### 5.1 Estructura

```
TerceroNestJs/src/modules/socio/
  socio.module.ts
  socio.resolver.ts      # solo @Query
  socio.service.ts       # QueryBuilder
  entities/
    socio.entity.ts      # Socio + SocioTercero
    rol-socio.entity.ts
```

### 5.2 Organización Resolver → Service → TypeORM

| Capa | Socios | Terceros (equivalente) |
|------|--------|-------------------------|
| Resolver | Delgado; header company en `socios` | Delgado; args `id_empresa` opcionales |
| Service | QueryBuilder con joins explícitos | `repository.find({ where })` |
| Mutations Nest | **Ninguna** | create/update/remove existen |
| Entities | Relación N:M modelada (`socio_tercero`) | Entidad plana + FKs |

**Sí: el módulo socio está mejor alineado al CQRS del proyecto** (Nest = solo lectura). Terceros “contamina” Nest con escritura que el front no usa como camino principal.

### 5.3 Multiempresa en Nest

- `socios`: **falla** si falta `X-Company-Id`.
- Filtro: `t.id_empresa = :id_empresa` (vía terceros vinculados).
- Implicación: un socio **sin** terceros no aparecería en listados filtrados por empresa (edge case).
- `socio(id)`: **no** revalida empresa del header (se puede cargar por ID cruzado si se conoce el UUID).

---

## 6. Python — Socios

### 6.1 Capas

```
api/socio_routes.py
  → services/socio_service.py
    → repositories/socio_repository.py
      → models/socio.py, socio_tercero.py, rol_socio.py
```

**No hay** Marshmallow schema de socio (validación manual `ValueError`).

### 6.2 Operaciones

| Acción | Comportamiento |
|--------|----------------|
| **Crear** | Valida `terceros[]` no vacío; todos deben existir y `id_empresa` coincidir; TX: insert socio + N `socio_tercero` + commit/rollback |
| **Editar** | Reemplaza vínculos (delete all + insert); exige `id_empresa` en body |
| **Toggle estado** | Invierte `estado`; auditoría `updated_by` |
| **Respuesta** | Envelope `{ success, data }` / `{ success, error }` (más uniforme que tercero plano) |

### 6.3 Transacciones

Punto fuerte vs `create_tercero` simple: **relación cabecera–detalle atómica**. Muy relevante para **gasto + gasto_detalle**.

### 6.4 Debilidades

- Update no re-aplica `scope`/empresa del socio existente con la misma rigurosidad que el listado Nest.
- Soft delete existe en repo pero **no hay ruta** DELETE/soft en routes usadas por el front (solo toggle).
- Sin schema Marshmallow.

---

## 7. Multiempresa — Socios vs Terceros

| Mecanismo | Socios | Terceros |
|-----------|--------|----------|
| Columna `id_empresa` en entidad principal | **No** (se deduce por terceros) | **Sí** en `tercero` |
| Listado Nest | Header **obligatorio** | Arg opcional (sin arg → todas las empresas) |
| Front GLOBAL | Select + skip query + header | Select + variable `$id_empresa` |
| Front EMPRESA | Header = JWT | Variable = JWT |
| Escritura | Valida terceros ∈ empresa | `X-Company-Id` / scope en Flask |
| Aislamiento estricto | Más fuerte en listado | Más débil si alguien llama `terceros` sin `id_empresa` |

**Para Gastos:** preferible columna `id_empresa` en cabecera (como Terceros) **y** exigir filtro (como Socios: nunca listar “todo el mundo”). Combinar ambos.

---

## 8. Apollo — qué aporta en Socios (sección crítica)

### 8.1 Configuración usada

- Cliente: `mainClient` (`apollo-client.ts`).
- Link: `errorLink` + `authLink` + HTTP Gateway `/graphql`.
- `authLink`: Bearer + `X-Company-Id` desde JWT **salvo** override en `context.headers`.
- Cache: `InMemoryCache` default (sin typePolicies específicas de socio).
- Defaults: `errorPolicy: 'all'`.

### 8.2 Aportes concretos en Socios

1. **Declaratividad del listado** (`useQuery` + `skip`).
2. **Override multiempresa por request** (`context.headers['X-Company-Id']`) sin tocar el JWT global.
3. **Loading/error unificados** sin booleans duplicados.
4. **`fetchPolicy: 'cache-and-network'`** → UI rápida + red fresca.
5. **`refetch`** tras mutación REST de estado → puente Apollo↔REST.
6. **Detalle en edición** con `network-only` → evita datos stale.
7. **Integración JWT** automática; GLOBAL solo añade company extra.

### 8.3 Qué NO hace Apollo en Socios

- No hay `useMutation` GraphQL (escrituras REST).
- No hay cache normalizado sofisticado ni `update` de cache tras create.
- Tras crear socio, el listado **no** se invalida automáticamente (hay que volver a entrar o refetch manual).

### 8.4 Reutilizar en Gastos

| Copiar | Mejorar |
|--------|---------|
| `useQuery` + `skip` + header company | Tras create/update: `refetchQueries` o `navigate` + refetch listado |
| `cache-and-network` en listados | Considerar `id_empresa` **también** como variable GQL (documenta el contrato) |
| `network-only` en detalle edición | Opcional: Apollo mutation solo si algún día se unifica escritura (hoy no) |
| `errorPolicy: 'all'` + Alert | Igual |

---

## 9. Tabla comparativa

| ASPECTO | TERCEROS | SOCIOS | RECOMENDACIÓN PARA GASTOS |
|---------|----------|--------|---------------------------|
| **Listados** | LazyQuery + estado local | `useQuery` + skip + refetch | **COPIAR DE SOCIOS** |
| **Formularios** | Multi-tab + secciones | Formulario único + Controller | **COPIAR DE TERCEROS** (complejidad) + **Controller/RHF de SOCIOS** |
| **Apollo** | Imperativo en listados | Declarativo + context headers | **COPIAR DE SOCIOS** |
| **GraphQL** | Args `id_empresa` opcionales | Header obligatorio en `socios` | **MEJORAR**: arg o header, pero **siempre** filtrar |
| **Gateway** | Rutas duplicadas /api/tercero(s); selects mixtos Inicio/Tercero | Separación clara Nest selects / Python write | **COPIAR DE SOCIOS** (claridad) |
| **NestJS** | Mutations escritura presentes | Solo Query | **COPIAR DE SOCIOS** |
| **Flask** | Create simple; Marshmallow | TX cabecera+detalle; envelope success | **COPIAR DE SOCIOS** (TX) + Marshmallow de Terceros |
| **Multiempresa** | Columna `id_empresa` | Join vía N:M | **MEJORAR**: columna en cabecera **y** filtro obligatorio |
| **Estado** | Switch + PUT parcial | Switch + PATCH dedicado | **COPIAR DE SOCIOS** (PATCH `/estado`) |
| **Errores** | Alert + interceptor | Alert + envelope Python | **MEJORAR**: unificar envelope `{success,error}` |
| **Archivos** | Muchas vistas especializadas | 2 archivos (list + form) | **COPIAR DE SOCIOS** si un solo tipo; variantes = Terceros |
| **Selects** | Muchos GQL en secciones | REST→Nest para roles/terceros | **MEJORAR**: preferir GraphQL directo o REST facade, no ambos sin criterio |
| **Relaciones** | FKs planas | N:M `socio_tercero` | **COPIAR DE SOCIOS** para `gasto_detalle` |
| **Post-guardar** | Reset form / navigate según vista | Alert; no refetch listado | **MEJORAR**: navigate + refetch |
| **Mantenibilidad** | Alta superficie (cliente/proveedor/…) | Baja superficie | Socios gana en simplicidad; Terceros en reuso de secciones |

---

## 10. Clasificación de hallazgos para Gastos

### COPIAR DE SOCIOS

1. Listados con `useQuery`, `skip`, `fetchPolicy: 'cache-and-network'`, `context.headers` GLOBAL.  
2. `refetch` tras cambios de estado.  
3. Nest **solo lectura** (sin mutations de escritura).  
4. Gateway: selects Nest / CUD Python, sin ambigüedad.  
5. PATCH de estado dedicado.  
6. Transacciones Python cabecera + líneas.  
7. Formulario con `Controller` + `SearchableSelect` + `isDirty`.  
8. Exigir empresa en listados GLOBAL (nunca query “global sin filtro”).

### COPIAR DE TERCEROS

1. Estructura multi-tab / secciones para formularios complejos.  
2. Yup schema en archivo dedicado.  
3. Marshmallow en Python.  
4. Columna `id_empresa` en la entidad cabecera.  
5. Integración media/documentos (`module` + `module_id`).  
6. Patrón GLOBAL/EMPRESA en `Seccion*Empresa` / SelectEmpresa.  
7. Plantilla de rutas Listado / Nuevo / Editar.  
8. Catálogos vía InicioNestJs cuando sean genéricos (impuestos, etc.).

### MEJORAR (síntesis)

1. **Multiempresa:** `id_empresa` en `gasto` + filtro obligatorio (header **o** arg, documentado).  
2. **Post-guardar:** `navigate('/gastos')` + invalidar/refetch listado Apollo.  
3. **Contrato API:** un prefijo (`/api/gasto`), envelope `{ success, data, error }`.  
4. **Una vía de catálogos:** GraphQL directo **o** REST facade, no mezclar sin razón.  
5. **Detalle líneas:** payload `{ ...cabecera, detalles: [...] }` en una TX (patrón socio_tercero).  
6. **Auth:** decidir si microservicios validan JWT o solo Gateway (hoy ninguno de los dos valida de verdad en dominio).

### NO COPIAR

1. Mutations Nest de escritura “por si acaso” (Terceros).  
2. Listados `terceros` sin `id_empresa` que devuelven todo.  
3. `useLazyQuery` + estado duplicado cuando basta `useQuery`.  
4. Rutas Gateway duplicadas / anidadas (`/api/api/...`).  
5. Schemas muertos (contacto Marshmallow no usado).  
6. Dejar crear/editar sin refrescar listado (Socios hoy).  
7. Entidad de negocio sin `id_empresa` propia si el aislamiento depende solo de joins frágiles.

---

## 11. Patrón definitivo propuesto para Gastos

```
┌─────────────────────────────────────────────────────────────┐
│ FRONT                                                       │
│  Listado: patrón SOCIOS (useQuery + skip + X-Company-Id)    │
│  Formulario: patrón TERCEROS (tabs/secciones) +             │
│              Controller/RHF de SOCIOS                        │
│  Detalle líneas: array en form → body.detalles              │
│  Docs: patrón TERCEROS media (module=gasto)                 │
│  Post-save: navigate + refetch (MEJORAR)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│ GATEWAY (claridad SOCIOS)                                   │
│  GQL gastos* → GastoNestJs                                  │
│  GET selects → Nest / InicioNestJs                          │
│  POST/PUT/PATCH → GastoPython + requestContext headers      │
└──────────────────────────┬──────────────────────────────────┘
           ┌───────────────┴───────────────┐
           ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│ GastoNestJs         │         │ GastoPython         │
│ Solo Query          │         │ Marshmallow         │
│ (como Socio)        │         │ TX gasto+detalle    │
│ Filtro id_empresa   │         │ PATCH /estado       │
│ obligatorio         │         │ (como Socio)        │
└─────────┬───────────┘         └──────────┬──────────┘
          └───────────────┬────────────────┘
                          ▼
                    PostgreSQL
            gasto (id_empresa, …)
            gasto_detalle
            categoria_gasto
```

### Checklist de arranque (sin código aún)

1. Inspeccionar DDL real de `gasto` / `gasto_detalle` / `categoria_gasto`.  
2. Confirmar si `gasto` tiene `id_empresa` (debe tenerlo).  
3. Diseñar queries: `gastos(id_empresa)`, `gasto(id)`, `categoriasGasto`.  
4. Diseñar REST: `POST/PUT /api/gasto`, `PATCH /api/gasto/:id/estado`.  
5. Decidir Apollo listado = copia literal de `Socios.tsx` adaptada.  
6. Decidir formulario = plantilla `NuevoTercero` + líneas dinámicas.  
7. Media: `module='gasto'`, `module_id=id_gasto`.  
8. Menú/permisos: scripts como `menu-terceros.sql`.

---

## 12. Conclusión

**Socios no reemplaza a Terceros como plantilla única**, pero aporta el **mejor patrón de listados Apollo, CQRS Nest puro, multiempresa por header y transacciones con relaciones**.

**Terceros aporta** la **mejor plantilla de formularios complejos, media, Marshmallow y columna `id_empresa`**.

Para **Gastos**, la arquitectura definitiva es el **híbrido** de la sección 11: lo declarativo de Socios + lo estructural de Terceros + mejoras explícitas (refetch post-guardar, filtro obligatorio, TX detalle, sin mutations Nest de escritura).

---

*Fin del documento. Ningún archivo de código de negocio fue modificado.*

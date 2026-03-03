# Auditoría pre-limpieza — Empresa en TerceroNestJs

Objetivo: confirmar si se puede eliminar la query `empresas` (y luego la entidad Empresa) sin romper nada. **Solo reporte; no se modificó nada.**

---

## 1) Referencias encontradas

### 1.1 `@InjectRepository(Empresa)`

| Archivo | Línea |
|---------|--------|
| `TerceroNestJs/src/modules/catalogos/catalogos.resolver.ts` | 24 |
| `InicioNestJs/src/resolvers/empresa.resolver.ts` | 13 |

### 1.2 `empresaRepo` (nombre del campo inyectado)

| Archivo | Línea |
|---------|--------|
| `TerceroNestJs/src/modules/catalogos/catalogos.resolver.ts` | 25 |

*(En InicioNestJs el repositorio se llama `empresaRepository`.)*

### 1.3 Query name: `'empresas'`

| Archivo | Línea | Nota |
|---------|--------|------|
| `TerceroNestJs/src/modules/catalogos/catalogos.resolver.ts` | 95 | `@Query(() => [Empresa], { name: 'empresas' })` |
| `InicioNestJs/src/resolvers/empresa.resolver.ts` | 19 | método `empresas()` (nombre de query en GraphQL) |

### 1.4 `findAllEmpresas`

| Archivo | Línea |
|---------|--------|
| `TerceroNestJs/src/modules/catalogos/catalogos.resolver.ts` | 96, 98, 99, 103, 106 |

*(Solo existe en TerceroNestJs. InicioNestJs usa el método `empresas()`.)*

### 1.5 `"empresas"` dentro de resolvers

| Archivo | Uso |
|---------|-----|
| `TerceroNestJs/src/modules/catalogos/catalogos.resolver.ts` | Query `name: 'empresas'` y lógica `findAllEmpresas` |
| `InicioNestJs/src/resolvers/empresa.resolver.ts` | Método `empresas()` que resuelve la query `empresas` |

---

## 2) ¿Algún resolver/service además de CatalogosResolver expone empresas en TerceroNestJs?

**No.** En TerceroNestJs el único lugar que expone la query `empresas` es:

- `TerceroNestJs/src/modules/catalogos/catalogos.resolver.ts` (método `findAllEmpresas`, query `name: 'empresas'`).

No hay otro resolver ni service en TerceroNestJs que exponga `empresas`. El resto de referencias a Empresa en TerceroNestJs son:

- Entidad y módulo de Empresa (para TypeORM y relación en Tercero).
- Uso de la relación `empresa` en `tercero.service.ts` (carga de relación al listar/obtener terceros).
- Definición de la relación en `tercero.entity.ts` (ManyToOne a Empresa).

---

## 3) Uso de la entidad Empresa en TerceroNestJs

### 3.1 Relación FK en Tercero (ManyToOne)

| Archivo | Uso |
|---------|-----|
| `TerceroNestJs/src/modules/tercero/entities/tercero.entity.ts` | `@ManyToOne(() => Empresa, { nullable: false })`, `@JoinColumn({ name: 'id_empresa' })`, campo `empresa: Empresa` |
| `TerceroNestJs/src/modules/empresa/entities/tercero.entity.ts` | Mismo patrón (entidad Tercero en carpeta empresa) |

### 3.2 Código que depende de Empresa para resolver datos

| Archivo | Uso |
|---------|-----|
| `TerceroNestJs/src/modules/tercero/tercero.service.ts` | `relations: ['empresa', 'tipo_tercero']` al hacer `find()` de terceros. La respuesta GraphQL de Tercero incluye el objeto `empresa` (id_empresa, nombre, etc.) porque se carga la relación. |

**Conclusión 3:** La entidad Empresa en TerceroNestJs no se usa solo como FK “ciega”. Se usa como:

1. **FK en Tercero:** `Tercero` tiene `ManyToOne` a `Empresa` y se expone en el tipo GraphQL `Tercero` el campo `empresa`.
2. **Query independiente:** `CatalogosResolver.findAllEmpresas` (query `empresas`).

Por tanto:

- **Sí se puede eliminar** la query `empresas` y el uso de `empresaRepo` en `CatalogosResolver` (si el front/gateway ya usan InicioNestJs para listar empresas).
- **No se puede eliminar la entidad Empresa** de TerceroNestJs sin romper la relación: el tipo `Tercero` sigue necesitando la entidad Empresa para el campo `empresa` y para las `relations: ['empresa']` en el service. Eliminar la entidad implicaría dejar de cargar/mostrar la empresa en terceros o cambiar a otro origen de datos (por ejemplo, solo id_empresa sin objeto).

---

## 4) Gateway-api: endpoint REST que obtiene empresas vía terceroNestJsService

**Sí existe exactamente uno:**

| Ruta exacta | Método | Archivo | Código que llama a TerceroNestJs |
|-------------|--------|---------|-----------------------------------|
| `/api/tercero/selects/empresas` | GET | `gateway-api/src/routes/tercero.js` | Líneas 91–102: `terceroNestJs.listarEmpresas(request)` |

- Las rutas de `tercero.js` se registran con prefijo `/api` en `gateway-api/src/app.js`, por eso la ruta completa es **GET /api/tercero/selects/empresas**.
- `gateway-api/src/services/terceroNestJs.js` implementa `listarEmpresas(req)` haciendo una petición GraphQL con la query `empresas { id_empresa nombre ruc estado }` al servicio TerceroNestJs (variable `TERCERO_NEST_GQL_URL`).

**No usan terceroNestJs para empresas:**

- **GET /api/empresas** y **GET /api/empresas/:id** están en `gateway-api/src/routes/empresas.js` y usan `nestjsService.getEmpresas()` / `nestjsService.getEmpresa(id)` del archivo `gateway-api/src/services/nestjs.js`, que apunta a **InicioNestJs** (NESTJS_SERVICE_URL), no a TerceroNestJs.

---

## Resumen para la limpieza

| Acción | ¿Seguro? | Nota |
|--------|----------|------|
| Dejar de redirigir la query GraphQL `empresas` a TerceroNestJs (ya hecho en graphql.js) | Sí | El gateway envía `empresas` a InicioNestJs. |
| Eliminar la query `empresas` y `findAllEmpresas` (y `empresaRepo`) de CatalogosResolver en TerceroNestJs | Sí | Siempre que el front no use ya la query contra TerceroNestJs. |
| Cambiar GET /api/tercero/selects/empresas para que use InicioNestJs en lugar de terceroNestJs | Recomendado | Así un solo origen para “listar empresas”. Hoy esa ruta sigue usando TerceroNestJs. |
| Eliminar la entidad Empresa (y el módulo Empresa) de TerceroNestJs | No | Tercero sigue teniendo ManyToOne(Empresa) y el service carga `relations: ['empresa']`. Habría que mantener al menos la entidad (y el módulo) para no romper terceros. |

*Fin del reporte. Solo análisis; no se modificó código.*

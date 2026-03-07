# Auditoría: flujo de `codigo_cliente` y `codigo_proveedor` (lectura → frontend)

**Objetivo:** Entender cómo viaja `codigo_cliente` desde la lectura hasta el frontend para replicar exactamente el mismo patrón con `codigo_proveedor`.  
**Alcance:** Solo análisis. No se ha modificado código.

---

# PARTE 1 — TerceroNestJS

## Resumen

| Campo             | Entity (tercero) | Entity (empresa) | Interface | DTO Create | DTO Update | schema.gql type Tercero | schema.gql inputs |
|------------------|------------------|------------------|-----------|------------|------------|--------------------------|-------------------|
| codigo_cliente   | Sí               | Sí               | Sí        | Sí         | Sí (vía Partial) | Sí                 | Sí (Create + Update) |
| codigo_proveedor | No               | Sí               | Sí        | Sí         | Sí (vía Partial) | No                 | Sí (Create + Update) |

**Conclusión:** En lectura (queries), el tipo GraphQL `Tercero` expone `codigo_cliente` pero **no** `codigo_proveedor`. Los inputs de mutación sí tienen ambos.

---

## 1.1 Entidad principal (módulo tercero)

**Archivo:** `TerceroNestJs/src/modules/tercero/entities/tercero.entity.ts`

| Campo             | Línea | Fragmento | Tipo de uso |
|-------------------|-------|-----------|-------------|
| codigo_cliente    | 106-108 | `@Field({ nullable: true })`<br>`@Column({ type: 'varchar', length: 20, nullable: true })`<br>`codigo_cliente?: string;` | ENTITY (TypeORM + GraphQL) |
| codigo_proveedor  | —     | No existe | — |

Solo está definido `codigo_cliente`. Esta entidad es la que alimenta el tipo GraphQL `Tercero` en las queries.

---

## 1.2 Entidad en módulo empresa

**Archivo:** `TerceroNestJs/src/modules/empresa/entities/tercero.entity.ts`

| Campo             | Línea | Fragmento | Tipo de uso |
|-------------------|-------|-----------|-------------|
| codigo_cliente    | 103-105 | `@Field({ nullable: true })`<br>`@Column({ type: 'varchar', length: 20, nullable: true })`<br>`codigo_cliente?: string;` | ENTITY |
| codigo_proveedor  | 107-109 | `@Field({ nullable: true })`<br>`@Column({ type: 'varchar', length: 20, nullable: true })`<br>`codigo_proveedor?: string;` | ENTITY |

Aquí **sí** existen ambos campos. Esta entidad se usa en el contexto del módulo empresa (relación terceros de una empresa), no como tipo principal de las queries `tercero` / `terceros` / `clientes`.

---

## 1.3 Interfaz

**Archivo:** `TerceroNestJs/src/modules/tercero/interfaces/tercero.interface.ts`

| Campo             | Línea | Fragmento | Tipo de uso |
|-------------------|-------|-----------|-------------|
| codigo_cliente    | 11 | `codigo_cliente?: string;` | INTERFACE |
| codigo_proveedor  | 12 | `codigo_proveedor?: string;` | INTERFACE |

Ambos están en la interfaz TypeScript.

---

## 1.4 DTOs

**Archivo:** `TerceroNestJs/src/modules/tercero/dto/create-tercero.dto.ts`

| Campo             | Línea | Fragmento | Tipo de uso |
|-------------------|-------|-----------|-------------|
| codigo_cliente    | 17 | `@Field({ nullable: true }) @IsString() @IsOptional() codigo_cliente?: string;` | DTO (input create) |
| codigo_proveedor  | 18 | `@Field({ nullable: true }) @IsString() @IsOptional() codigo_proveedor?: string;` | DTO (input create) |

**Archivo:** `TerceroNestJs/src/modules/tercero/dto/update-tercero.dto.ts`  
`UpdateTerceroInput` extiende `PartialType(CreateTerceroInput)`, por tanto incluye `codigo_cliente` y `codigo_proveedor` sin declararlos de nuevo.

---

## 1.5 Schema GraphQL generado

**Archivo:** `TerceroNestJs/src/schema.gql` (generado; no editar a mano si se regenera)

**Tipo `Tercero` (lectura):**

| Campo             | Línea | Fragmento | Uso |
|-------------------|-------|-----------|-----|
| codigo_cliente    | 103 | `codigo_cliente: String` | GraphQL type (query) |
| codigo_proveedor  | —    | No aparece en el tipo `Tercero` | No expuesto en lectura |

**Input `CreateTerceroInput`:**

| Campo             | Línea | Fragmento |
|-------------------|-------|-----------|
| codigo_cliente    | 19 | `codigo_cliente: String` |
| codigo_proveedor  | 21 | `codigo_proveedor: String` |

**Input `UpdateTerceroInput`:**

| Campo             | Línea | Fragmento |
|-------------------|-------|-----------|
| codigo_cliente    | 148 | `codigo_cliente: String` |
| codigo_proveedor  | 150 | `codigo_proveedor: String` |

Los resolvers no referencian estos campos de forma explícita; al estar (o no) en la entidad, el schema los expone o no en el tipo `Tercero`.

---

# PARTE 2 — Gateway

## Resumen

El Gateway no transforma campos; reenvía body a Python (escritura) y ejecuta queries GraphQL contra TerceroNestJS (lectura).  
`codigo_cliente` aparece en esquemas de validación REST y en las queries GraphQL que arma el servicio de terceros.  
`codigo_proveedor` **no** aparece en el Gateway (ni en schemas ni en queries).

---

## 2.1 Esquemas de validación (REST)

**Archivo:** `gateway-api/src/schemas/tercero.js`

| Campo             | Línea | Fragmento | Uso |
|-------------------|-------|-----------|-----|
| codigo_cliente    | 22 | `codigo_cliente: stringOpt,` | Propiedad del body para create/update (validación) |
| codigo_proveedor  | —    | No existe | — |

Solo está definido `codigo_cliente`. El body que se reenvía a Python puede llevar más propiedades (`additionalProperties: true`), pero el esquema explícito no incluye `codigo_proveedor`.

---

## 2.2 Servicio TerceroNestJS (queries GraphQL)

**Archivo:** `gateway-api/src/services/terceroNestJs.js`

| Función            | Línea | Fragmento | Uso |
|--------------------|-------|-----------|-----|
| listarTerceros     | 63   | `codigo_cliente` dentro del query `terceros { ... }` | Campo pedido en la query GraphQL |
| listarClientes     | 96   | `codigo_cliente` dentro del query `clientes { ... }` | Campo pedido en la query GraphQL |
| obtenerTercero     | 114-131 | Query `tercero(id_tercero)` **sin** `codigo_cliente` ni `codigo_proveedor` | Lectura de un tercero por ID; no pide códigos |

En las listas se solicita `codigo_cliente`. En `obtenerTercero` no se pide ni `codigo_cliente` ni `codigo_proveedor`.  
En ningún punto del Gateway se pide `codigo_proveedor` en una query.

---

## 2.3 Rutas

**Archivo:** `gateway-api/src/routes/tercero.js`  
No hay referencias directas a `codigo_cliente` ni `codigo_proveedor`. Las rutas delegan en `terceroPython` (POST/PUT/DELETE) y `terceroNestJs` (GET listas y GET por id).

**Archivo:** `gateway-api/src/routes/graphql.js`  
Reenvía la petición GraphQL al servicio correspondiente (p. ej. TerceroNestJS) sin tocar el contenido; no hay mapeo de campos.

---

# PARTE 3 — Frontend React

## Resumen

- `codigo_cliente` se usa en formularios (Sección General), en `initialForm`/defaultValues, en queries GraphQL de edición y en listados (columna “Identificación”).  
- `codigo_proveedor` **no** aparece en el frontend en ningún archivo.

---

## 3.1 Dónde aparece `codigo_cliente`

### Formularios y sección

| Vista / componente        | ¿Aparece codigo_cliente? | Archivo / sección |
|---------------------------|---------------------------|-------------------|
| NuevoTercero              | Sí (initialForm)          | `NuevoTercero.tsx` – no hay input visible; el valor va en el form y se envía. La sección que dibuja el campo es **SeccionTerceroGeneral**. |
| EditarTercero             | Sí (query + reset)        | `EditarTercero.tsx` – GET_TERCERO incluye `codigo_cliente`; `reset()` lo precarga. |
| NuevoCliente              | Sí (initialForm + input)  | `NuevoCliente.tsx` – initialForm y input en **SeccionTerceroGeneral** (Label "Código cliente"). |
| EditarCliente             | Sí (query + reset)       | `EditarCliente.tsx` – GET_TERCERO y reset. |
| NuevoProveedor            | Sí (initialForm + input)  | `NuevoProveedor.tsx` – initialForm y input "Código cliente" en **SeccionTerceroGeneral**. |
| EditarProveedor           | Sí (query + reset)        | `EditarProveedor.tsx` – GET_TERCERO y reset. |
| NuevoClientePotencial     | Sí (initialForm + input)  | `NuevoClientePotencial.tsx` – initialForm y input "Código cliente" en **SeccionTerceroGeneral**. |
| EditarClientePotencial    | Sí (query + reset)        | `EditarClientePotencial.tsx` – GET_TERCERO y reset. |

El **único lugar donde se renderiza el input** “Código cliente” es **`SeccionTerceroGeneral.tsx`** (Label + Input `codigo_cliente`). Todas las vistas anteriores usan esa sección y comparten el mismo estado/forma de envío (p. ej. por pestaña “General”).

### Detalle por archivo

**`frontReact/src/views/terceros/secciones/SeccionTerceroGeneral.tsx`**

- Líneas 22-23: estado local `f` incluye `codigo_cliente: ''`.
- Líneas 119-120:  
  `<Label for="codigo_cliente">Código cliente</Label>`  
  `<Input id="codigo_cliente" name="codigo_cliente" value={f.codigo_cliente || ''} onChange={chg}/>`

**`frontReact/src/views/terceros/schemas/NuevoTerceroSchema.ts`**

- Línea 10: tipo `codigo_cliente: string`.
- Línea 43: `codigo_cliente: yup.string()`.

**Listados (tablas)**

- `Terceros.tsx`: query con `codigo_cliente`; columna “Identificación” = `tercero.codigo_cliente || tercero.apodo || 'N/A'`.
- `Clientes.tsx`, `Proveedores.tsx`, `ClientesPotenciales.tsx`: mismo patrón (query con `codigo_cliente`, columna “Identificación” con `codigo_cliente || apodo`).

---

## 3.2 Cómo se carga en CREATE

- **initialForm / defaultValues:** En todas las vistas de “nuevo” (NuevoTercero, NuevoCliente, NuevoProveedor, NuevoClientePotencial) hay un objeto inicial con `codigo_cliente: ''`.
- No hay valor por defecto distinto de cadena vacía; si el backend autogenera (p. ej. en TerceroPython), el usuario puede dejarlo vacío y se asigna en backend.
- El campo aparece vacío en el formulario hasta que el usuario escribe o el backend devuelve algo después de guardar.

---

## 3.3 Cómo se carga en EDIT

- **Query:** En EditarTercero, EditarCliente, EditarProveedor y EditarClientePotencial se usa una query `GET_TERCERO` que incluye `codigo_cliente` en el fragmento de `tercero(id_tercero: $id_tercero)`.
- **Precarga:** Con `reset({ ... })` se asigna `codigo_cliente: t.codigo_cliente ?? ''` a partir de `data.tercero` (líneas análogas en cada Editar*).
- Los datos de edición vienen por **GraphQL** (Apollo `useQuery(GET_TERCERO)`), no por la ruta REST GET `/tercero/:id` del Gateway.

---

## 3.4 Referencias a `codigo_proveedor` en frontend

**No hay ninguna referencia** a `codigo_proveedor` en el frontend (views/terceros, _apis_, components, graphql, config, schemas de terceros).  
No existe en formularios, ni en initialForm, ni en queries, ni en columnas de listados.

---

# PARTE 4 — Patrón a replicar y checklist

## A) Ruta completa de `codigo_cliente`

1. **BD (PostgreSQL):** columna `tercero.codigo_cliente`.
2. **TerceroNestJS:** entidad `tercero.entity.ts` (módulo tercero) con `codigo_cliente` → tipo GraphQL `Tercero` con `codigo_cliente: String`.
3. **Gateway:**  
   - Lectura: reenvía queries GraphQL a TerceroNestJS; en `terceroNestJs.js` las queries `terceros` y `clientes` piden `codigo_cliente`.  
   - Escritura: esquema REST `tercero.js` incluye `codigo_cliente`; el body se reenvía a Python.
4. **Frontend:**  
   - Listados: query GraphQL incluye `codigo_cliente`; columna “Identificación” usa `codigo_cliente || apodo`.  
   - Formularios: `SeccionTerceroGeneral` muestra el input “Código cliente”; todas las vistas Nuevo*/Editar* usan esa sección; en edición, `GET_TERCERO` incluye `codigo_cliente` y se precarga con `reset()`.

Resumen: **BD → NestJS (entity → type Tercero) → Gateway (query con el campo) → Frontend (query + SeccionTerceroGeneral + listados).**

---

## B) Qué falta para que `codigo_proveedor` siga el mismo patrón

1. **TerceroNestJS**
   - Añadir `codigo_proveedor` a la entidad **principal** `src/modules/tercero/entities/tercero.entity.ts` (igual que `codigo_cliente`: `@Field`, `@Column`, opcional).  
   - Regenerar o actualizar `schema.gql` para que el tipo `Tercero` tenga `codigo_proveedor: String`.  
   - Interface y DTOs ya tienen `codigo_proveedor`; no hace falta tocarlos para lectura.

2. **Gateway**
   - En `gateway-api/src/schemas/tercero.js`: añadir `codigo_proveedor: stringOpt` en las propiedades del body (create/update).  
   - En `gateway-api/src/services/terceroNestJs.js`:  
     - En las queries de `listarTerceros` y `listarClientes` añadir `codigo_proveedor`.  
     - En la query de `obtenerTercero` añadir `codigo_cliente` y `codigo_proveedor` (hoy no pide ninguno).

3. **Frontend**
   - En `SeccionTerceroGeneral.tsx`: estado `f` con `codigo_proveedor: ''`, y nuevo bloque Label + Input “Código proveedor” (mismo patrón que “Código cliente”).  
   - En `NuevoTerceroSchema` y tipo de formulario: añadir `codigo_proveedor: string` y `codigo_proveedor: yup.string()`.  
   - En todas las vistas Nuevo* (NuevoTercero, NuevoCliente, NuevoProveedor, NuevoClientePotencial): incluir `codigo_proveedor: ''` en `initialForm` / defaultValues.  
   - En todas las vistas Editar* (EditarTercero, EditarCliente, EditarProveedor, EditarClientePotencial): en la query `GET_TERCERO` añadir `codigo_proveedor` y en `reset()` añadir `codigo_proveedor: t.codigo_proveedor ?? ''`.  
   - En listados (Terceros, Clientes, Proveedores, ClientesPotenciales): en la query añadir `codigo_proveedor`; si se quiere una columna “Código proveedor” o usar el valor en “Identificación”, decidir criterio (por ejemplo mostrar `codigo_proveedor` cuando el ítem sea proveedor) e implementarlo igual que con `codigo_cliente`.

---

## C) Lista concreta de archivos a modificar (para mostrar `codigo_proveedor` igual que `codigo_cliente`)

### TerceroNestJS

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `src/modules/tercero/entities/tercero.entity.ts` | Añadir propiedad `codigo_proveedor` con `@Field` y `@Column` (igual que `codigo_cliente`). |
| 2 | `src/schema.gql` | Si se regenera desde entidades, no hace falta editar; si no, añadir `codigo_proveedor: String` al type `Tercero`. |

### Gateway

| # | Archivo | Cambio |
|---|---------|--------|
| 3 | `gateway-api/src/schemas/tercero.js` | Añadir `codigo_proveedor: stringOpt` en `properties`. |
| 4 | `gateway-api/src/services/terceroNestJs.js` | En las queries de `listarTerceros`, `listarClientes` y `obtenerTercero` incluir el campo `codigo_proveedor` (y en `obtenerTercero` también `codigo_cliente` si se desea consistencia). |

### Frontend React

| # | Archivo | Cambio |
|---|---------|--------|
| 5 | `frontReact/src/views/terceros/secciones/SeccionTerceroGeneral.tsx` | Añadir `codigo_proveedor` al estado `f`, y bloque Label + Input “Código proveedor”. |
| 6 | `frontReact/src/views/terceros/schemas/NuevoTerceroSchema.ts` | Añadir `codigo_proveedor` al tipo y al esquema Yup. |
| 7 | `frontReact/src/views/terceros/NuevoTercero.tsx` | Añadir `codigo_proveedor: ''` en `initialForm`. |
| 8 | `frontReact/src/views/terceros/NuevoCliente.tsx` | Añadir `codigo_proveedor: ''` en initialForm. |
| 9 | `frontReact/src/views/terceros/NuevoProveedor.tsx` | Añadir `codigo_proveedor: ''` en initialForm. |
| 10 | `frontReact/src/views/terceros/NuevoClientePotencial.tsx` | Añadir `codigo_proveedor: ''` en initialForm. |
| 11 | `frontReact/src/views/terceros/EditarTercero.tsx` | En GET_TERCERO añadir `codigo_proveedor`; en `reset()` añadir `codigo_proveedor: t.codigo_proveedor ?? ''`. |
| 12 | `frontReact/src/views/terceros/EditarCliente.tsx` | Igual que EditarTercero (query + reset). |
| 13 | `frontReact/src/views/terceros/EditarProveedor.tsx` | Igual (query + reset). |
| 14 | `frontReact/src/views/terceros/EditarClientePotencial.tsx` | Igual (query + reset). |
| 15 | `frontReact/src/views/terceros/Terceros.tsx` | En GET_TERCEROS añadir `codigo_proveedor`; opcional: columna o uso en “Identificación”. |
| 16 | `frontReact/src/views/terceros/Clientes.tsx` | En query de listado añadir `codigo_proveedor`; opcional: columna. |
| 17 | `frontReact/src/views/terceros/Proveedores.tsx` | En query de listado añadir `codigo_proveedor`; opcional: columna “Código proveedor” o en “Identificación”. |
| 18 | `frontReact/src/views/terceros/ClientesPotenciales.tsx` | En query de listado añadir `codigo_proveedor`; opcional: columna. |

---

## Diferencias entre `codigo_cliente` y `codigo_proveedor` hoy

| Aspecto | codigo_cliente | codigo_proveedor |
|---------|----------------|------------------|
| Entity principal (tercero) | Sí | No |
| Entity empresa/tercero | Sí | Sí |
| Interface / DTOs / schema inputs | Sí | Sí |
| schema.gql type Tercero | Sí | No |
| Gateway schema REST | Sí | No |
| Gateway queries GraphQL | Sí (listas); no en obtenerTercero | No |
| Frontend formularios | Sí (SeccionTerceroGeneral + initialForm + query + reset) | No |
| Frontend listados | Sí (query + columna Identificación) | No |

Con los cambios de la lista anterior, `codigo_proveedor` quedará expuesto y mostrado de la misma forma que `codigo_cliente` en lectura y en frontend.

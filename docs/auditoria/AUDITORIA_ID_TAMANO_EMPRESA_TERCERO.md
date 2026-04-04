# Auditoría completa – Campo `id_tamano_empresa` en tercero

**Objetivo:** Analizar por qué el campo `id_tamano_empresa` no se guarda ni se precarga en los formularios de terceros.

**Alcance:** Solo análisis; no se modifica código.

---

## Resumen ejecutivo

El campo **no se guarda** porque:

1. En el **frontend**, el tipo y valores por defecto del formulario no incluyen `id_tamano_empresa`, y en **editar** la query GraphQL y el `reset()` no lo traen.
2. En el **Gateway**, el schema de validación no declara el campo (aunque `additionalProperties: true` permitiría pasarlo).
3. En **TerceroPython**, el modelo SQLAlchemy, los schemas Marshmallow y el repositorio **no** tienen `id_tamano_empresa`, por lo que no se persiste.
4. En **TerceroNestJs**, la entidad y la query del tercero **no** exponen `id_tamano_empresa`, por lo que en editar no se puede precargar.

---

## 1. Frontend

### 1.1 SeccionTerceroComercialOrganizacion.tsx

| Verificación | Estado | Detalle |
|--------------|--------|---------|
| ¿El select guarda en formData.id_tamano_empresa? | Sí | Líneas 214-218: `value={f.id_tamano_empresa \|\| ''}` y `onChange` hace `const u = { ...f, id_tamano_empresa: val ?? '' }; setF(u); onChange(u);`. |
| ¿onChange actualiza correctamente? | Sí | Se llama `onChange(u)` con `u` que incluye `id_tamano_empresa`. |
| ¿Campo en estado inicial del formulario? | Sí (solo en la sección) | Líneas 19-22: estado local `f` incluye `id_tamano_empresa: ''`. |

Conclusión: la sección sí escribe `id_tamano_empresa` en el objeto que pasa al padre vía `onChange`. El padre (NuevoTercero, EditarTercero, etc.) usa `onComercial` que hace `setValue(key, value)` para cada clave; si el tipo del formulario no incluye `id_tamano_empresa`, el valor puede quedar “fuera” del contrato del formulario y no estar garantizado en el submit.

### 1.2 Schema y valores por defecto del formulario

**Archivo:** `frontReact/src/views/terceros/schemas/NuevoTerceroSchema.ts`

| Línea | Fragmento | Problema |
|-------|-----------|----------|
| 3-35 | Interface `NuevoTerceroFormValues` | No incluye `id_tamano_empresa`. |
| 37-92 | `NuevoTerceroSchema` (yup) | No hay campo `id_tamano_empresa`. |

**Cambio sugerido:** Añadir en la interfaz `id_tamano_empresa?: string;` y en el schema yup `id_tamano_empresa: yup.string().optional()` (o similar).

### 1.3 initialForm en los 8 formularios

En todos los que usan `NuevoTerceroFormValues`, `initialForm` no incluye `id_tamano_empresa`:

| Archivo | Líneas (aprox.) | Estado |
|---------|-----------------|--------|
| NuevoTercero.tsx | 18-49 | Falta `id_tamano_empresa: ''` en `initialForm`. |
| EditarTercero.tsx | 29-61 | Falta en `initialForm`. |
| NuevoCliente.tsx | 32-... | Falta en `initialForm`. |
| EditarCliente.tsx | 21-... | Falta en `initialForm`. |
| NuevoProveedor.tsx | 32-... | Falta en `initialForm`. |
| EditarProveedor.tsx | 21-... | Falta en `initialForm`. |
| NuevoClientePotencial.tsx | 32-... | Falta en `initialForm`. |
| EditarClientePotencial.tsx | 21-... | Falta en `initialForm`. |

**Cambio sugerido:** En cada uno, añadir en `initialForm`: `id_tamano_empresa: ''`.

### 1.4 Submit (objeto enviado)

En **NuevoTercero.tsx** (y patrón similar en otros):

- Líneas 90-121: `onSubmitRHF` recibe `values`, construye `cleanedData = { ...values }`, elimina claves con valor `''` o `null`, y envía `cleanedData` a `crearTercero(cleanedData)`.
- Si `id_tamano_empresa` no está en el tipo ni en `defaultValues`, puede no estar en `values` o no ser estable. Si se añade al tipo y a `initialForm`, y la sección ya hace `setValue('id_tamano_empresa', val)`, pasará a formar parte de `values` y de `cleanedData` y se enviará al API.

### 1.5 Editar: precarga

**Archivo:** `frontReact/src/views/terceros/EditarTercero.tsx`

| Línea | Fragmento | Problema |
|------|------------|----------|
| 63-106 | Query `GET_TERCERO` | No solicita el campo `id_tamano_empresa` en el objeto `tercero`. |
| 139-174 | `reset({ ... })` en el `useEffect` cuando llega `data?.tercero` | No se asigna `id_tamano_empresa`. |

Mientras TerceroNestJs no devuelva `id_tamano_empresa`, no hay dato para precargar. Aun así, el formulario de edición debe incluir el campo en `initialForm` y en `reset()` para cuando el backend lo exponga.

**Cambios sugeridos:**

1. En la query `GET_TERCERO`, añadir en el selection set de `tercero`: `id_tamano_empresa`.
2. En el `reset()`, añadir: `id_tamano_empresa: t.id_tamano_empresa ?? ''`.

Los otros editores (EditarCliente, EditarProveedor, EditarClientePotencial) siguen el mismo patrón: usan una query tipo GET_TERCERO y un `reset()` con los campos del tercero. Hay que aplicar el mismo cambio en query y reset en cada uno donde se precargue el tercero.

---

## 2. Gateway

### 2.1 Rutas de escritura

**Archivo:** `gateway-api/src/routes/tercero.js`

- Líneas 109-124: `POST /tercero` → `terceroPython.crearTercero(request.body, request)`.
- Líneas 125-144: `PUT /tercero/:id` → `terceroPython.actualizarTercero(request.params.id, request.body, request)`.

El Gateway reenvía el body tal cual; no filtra campos. Si el frontend envía `id_tamano_empresa`, llegará al servicio Python.

### 2.2 Schema de validación

**Archivo:** `gateway-api/src/schemas/tercero.js`

| Línea | Fragmento | Estado |
|-------|-----------|--------|
| 9-51 | `terceroCreateSchema.properties` | No existe la propiedad `id_tamano_empresa`. |
| 53-58 | `terceroUpdateSchema` | Mismo objeto de propiedades; tampoco tiene `id_tamano_empresa`. |
| 10, 56 | `additionalProperties: true` | Se permiten propiedades adicionales, por lo que el campo no se rechaza. |

**Cambio sugerido (opcional pero recomendable):** En `properties` de ambos schemas, añadir por ejemplo:  
`id_tamano_empresa: { type: 'string', format: 'uuid' }` (o string si no se valida UUID en gateway), para documentar y validar el campo.

---

## 3. TerceroPython (microservicio de escritura)

### 3.1 Modelo SQLAlchemy

**Archivo:** `TerceroPython/models/tercero.py`

La clase `Tercero` no tiene columna `id_tamano_empresa`. Las columnas de la zona “Comercial” (líneas 52-62) son: `sujeto_iva`, `id_tipo_tercero`, `id_tipo_entidad`, `capital`, `id_condicion_pago`, `id_forma_pago`, y en organización `sede_central`, `asignado_a`.

**Cambio necesario:** Añadir en el modelo, por ejemplo después de `id_forma_pago`:

```python
id_tamano_empresa = db.Column(db.String(36), db.ForeignKey('tamano_empresa.id_tamano_empresa'), nullable=True)
```

(Asumiendo que la tabla `tamano_empresa` existe en la misma BD y tiene `id_tamano_empresa` como PK. Si el nombre de tabla o PK es otro, ajustar.)

Además, puede ser necesario una migración (Alembic) o script SQL para añadir la columna `id_tamano_empresa` a la tabla `tercero` en la base de datos.

### 3.2 Schemas Marshmallow

**Archivo:** `TerceroPython/schemas/tercero_schema.py`

| Schema | Líneas | Estado |
|--------|--------|--------|
| TerceroCreateSchema | 3-52 | No tiene campo `id_tamano_empresa`. |
| TerceroUpdateSchema | 55-91 | No tiene campo `id_tamano_empresa`. |
| TerceroOutSchema | 93-133 | No tiene campo `id_tamano_empresa`. |

Con `unknown = INCLUDE`, Marshmallow no rechaza el campo, pero al no estar declarado no se incluye en `data` después de `load()` de forma explícita; para que se use en creación/actualización debe estar en el schema.

**Cambios sugeridos:**

- En **TerceroCreateSchema**: añadir por ejemplo `id_tamano_empresa = fields.UUID(allow_none=True)` (en la zona Comercial/Org).
- En **TerceroUpdateSchema**: igual.
- En **TerceroOutSchema**: añadir `id_tamano_empresa = fields.UUID(allow_none=True)` para devolverlo en respuestas.

### 3.3 Servicio

**Archivo:** `TerceroPython/services/tercero_service.py`

- `servicio_crear_tercero`: usa `TerceroCreateSchema().load(payload)` y luego `create_tercero(data, ...)`. No se hace ninguna asignación explícita de `id_tamano_empresa`; si el schema y el repositorio lo incluyen, se propagará.
- Normalización de UUIDs (líneas 49-50 y 76-79): no incluye `id_tamano_empresa`. Si se añade el campo al schema, conviene añadirlo a esa lista para normalizarlo como UUID.

**Cambio sugerido:** En las listas de claves UUID, incluir `"id_tamano_empresa"`.

### 3.4 Repositorio

**Archivo:** `TerceroPython/repositories/tercero_repository.py`

| Función | Líneas | Estado |
|---------|--------|--------|
| create_tercero | 8-63 | No se pasa `id_tamano_empresa` al constructor de `Tercero(...)`. |
| update_tercero | 65-116 | El set `updatable` (líneas 78-87) no incluye `"id_tamano_empresa"`. |

**Cambios sugeridos:**

- En **create_tercero**: en la llamada a `Tercero(...)`, añadir `id_tamano_empresa=payload.get("id_tamano_empresa")` (o el nombre que use el modelo).
- En **update_tercero**: añadir `"id_tamano_empresa"` al conjunto `updatable`.

### 3.5 Rutas API

**Archivo:** `TerceroPython/api/tercero_routes.py`

Las rutas solo reciben el JSON y lo pasan al servicio; no filtran campos. No requieren cambios si el schema y el repositorio ya manejan `id_tamano_empresa`.

---

## 4. TerceroNestJs (microservicio de lectura)

### 4.1 Entidad

**Archivo:** `TerceroNestJs/src/modules/tercero/entities/tercero.entity.ts`

La entidad GraphQL/TypeORM `Tercero` no tiene la propiedad `id_tamano_empresa` ni la relación con `TamanoEmpresa`. Tiene, por ejemplo, `id_condicion_pago`, `id_forma_pago`, `capital`, etc., pero no tamaño de empresa.

**Cambio necesario:** Añadir en la entidad (y, si aplica, en la tabla en BD):

- Columna: `id_tamano_empresa` (uuid, nullable).
- Opcional: relación `@ManyToOne` con entidad de catálogo TamanoEmpresa si existe en TerceroNestJs, o al menos el campo escalar para exponerlo en GraphQL.

Ejemplo (solo campo escalar):

```ts
@Field({ nullable: true })
@Column({ type: 'uuid', nullable: true })
id_tamano_empresa?: string;
```

Si la tabla `tercero` en la BD que usa TerceroNestJs no tiene la columna, habrá que añadirla (migración o script SQL).

### 4.2 Resolver y queries

**Archivo:** `TerceroNestJs/src/modules/tercero/tercero.resolver.ts`

El resolver no define los campos a mano; los expone la entidad. Si la entidad incluye `id_tamano_empresa`, la query `tercero` y las que devuelven `Tercero` lo devolverán automáticamente.

### 4.3 Uso en el frontend (query GET_TERCERO)

En **EditarTercero.tsx** (y equivalentes en EditarCliente, EditarProveedor, EditarClientePotencial) la query `GET_TERCERO` solicita explícitamente los campos del tipo `tercero`. Aunque la entidad en TerceroNestJs exponga `id_tamano_empresa`, el frontend debe pedirlo en la query.

**Resumen:** En TerceroNestJs solo hace falta añadir el campo (y opcionalmente la relación) en la entidad y asegurar que la tabla en BD tenga la columna. En el frontend, añadir `id_tamano_empresa` en la query y en el `reset()` de los editores.

---

## 5. Tabla resumen: dónde falta `id_tamano_empresa`

| Capa | Archivo | Línea(s) aprox. | Qué falta |
|------|---------|------------------|-----------|
| Frontend | NuevoTerceroSchema.ts | 3-35, 37-92 | Campo en interfaz y en schema yup. |
| Frontend | NuevoTercero.tsx | 18-49 | `id_tamano_empresa: ''` en `initialForm`. |
| Frontend | EditarTercero.tsx | 29-61, 63-106, 139-174 | `initialForm`; en GET_TERCERO el campo `id_tamano_empresa`; en `reset()` asignar `id_tamano_empresa`. |
| Frontend | NuevoCliente.tsx, EditarCliente.tsx, NuevoProveedor.tsx, EditarProveedor.tsx, NuevoClientePotencial.tsx, EditarClientePotencial.tsx | initialForm y, en editores, query + reset | Igual: incluir campo en initialForm y, en edición, en query y reset. |
| Gateway | gateway-api/src/schemas/tercero.js | 14-50, 54-58 | Opcional: añadir `id_tamano_empresa` en `properties` de create y update. |
| TerceroPython | models/tercero.py | 52-62 | Columna `id_tamano_empresa` en el modelo (y en BD si no existe). |
| TerceroPython | schemas/tercero_schema.py | 36-43, 83-91, 120-127 | Campo en TerceroCreateSchema, TerceroUpdateSchema y TerceroOutSchema. |
| TerceroPython | services/tercero_service.py | 49-50, 76-79 | Incluir `id_tamano_empresa` en la normalización UUID. |
| TerceroPython | repositories/tercero_repository.py | 36-42, 78-87 | En create: pasar `id_tamano_empresa`; en update: añadir a `updatable`. |
| TerceroNestJs | modules/tercero/entities/tercero.entity.ts | (zona comercial) | Campo `id_tamano_empresa` (y columna en BD si aplica). |

---

## 6. Orden sugerido de implementación

1. **Base de datos:** Asegurar que la tabla `tercero` tenga la columna `id_tamano_empresa` (UUID, nullable) y, si aplica, FK a `tamano_empresa.id_tamano_empresa`.
2. **TerceroPython:** Modelo → schemas → servicio (lista UUID) → repositorio (create y update). Así el campo se guarda y se devuelve en create/update.
3. **TerceroNestJs:** Entidad (y BD si usa otra instancia) para que la query `tercero` devuelva `id_tamano_empresa`.
4. **Frontend:** Schema (tipo + yup), `initialForm` y submit en todos los formularios; en editores, añadir `id_tamano_empresa` a la query y al `reset()`.
5. **Gateway (opcional):** Incluir `id_tamano_empresa` en los schemas de tercero para documentación y validación.

---

*Informe de auditoría. No se ha modificado código.*

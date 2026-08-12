# Tercero

Servicios: `TerceroNestJs` + `TerceroPython`. Incluye **Contacto** y **Socio** (mismo par de servicios; UI de socios aparte).

```
Pantallas terceros / contactos / socios
  → Apollo → gateway → TerceroNestJs
  → REST → gateway → TerceroPython
```

Env gateway: `TERCERO_NEST_GQL_URL`, `TERCERO_PY_BASE_URL`.

---

## 1. Tercero (maestro)

### Python REST (`api/tercero_routes.py`)

| Método | Path | Acción |
|--------|------|--------|
| POST | `/api/tercero` | Crear |
| PUT/PATCH | `/api/tercero/<id>` | Actualizar |
| DELETE | `/api/tercero/<id>` | Eliminar |

### Nest GraphQL (`tercero.resolver.ts`)

| Operación | Tipo | Notas |
|-----------|------|-------|
| `terceros`, `clientes`, `clientesBusqueda`, `tercero`, `representantesPorEmpresa` | Query | Lectura productiva |
| `tiposTercero`, `incoterms` | Query | Catálogos (`catalogos.resolver`) |
| `createTercero`, `updateTercero`, `removeTercero` | Mutation | Existen; el front usa Python vía gateway |

### Gateway `routes/tercero.js`

| Destino | Rutas |
|---------|--------|
| Nest | GET `/tercero`, `/clientes`, `/tercero/:id`, `/tercero/selects/tipo-tercero` |
| InicioNest (selects) | condicion-pago, forma-pago, paises, empresas |
| Python | POST/PUT/DELETE `/tercero` (y variantes `/terceros`) |

### Front

- API: `_apis_/tercero.js`
- Vistas `views/terceros/`:

| Ruta típica | Pantalla | Flujo |
|-------------|----------|-------|
| Listados terceros/clientes/proveedores/potenciales | `Terceros.tsx`, `Clientes.tsx`, … | GQL listado + filtro empresa (GLOBAL) |
| Nuevo / editar | `NuevoTercero`, `EditarTercero`, variantes cliente/proveedor | GQL detalle; REST crear/actualizar |
| Secciones | `SeccionTerceroGeneral`, `UbicacionContacto`, `ComercialOrganizacion` | Selects GQL/REST |

---

## 2. Contacto

### Python (`api/contacto_routes.py`)

| Método | Path |
|--------|------|
| POST | `/api/contactos` |
| GET | `/api/contactos/tercero/<id_tercero>` |
| GET | `/api/contactos/<id_contacto>` |
| PUT | `/api/contactos/<id_contacto>` |
| PATCH | `/api/contactos/<id_contacto>/estado` |

### Nest

Queries: `contactosByTercero`, `contacto`. Mutations existen; UI suele mezclar GQL listado + REST escritura.

### Gateway `routes/contacto.js`

**Todo el REST de contactos → Python** (lectura y escritura). Listado en UI también vía Apollo → Nest.

### Front

- API: `_apis_/contacto.js`
- Vistas: `views/terceros/contactos/` (`Contactos`, `NuevoContacto`, `EditarContacto`)

---

## 3. Socio (mismo backend Tercero)

### Python (`api/socio_routes.py`)

| Método | Path |
|--------|------|
| POST | `/api/socio` |
| PUT | `/api/socio/<id>` |
| PATCH | `/api/socio/<id>/estado` |
| GET | `/api/socio/selects/rol-socio` (también expuesto vía Nest en gateway) |

### Nest (`modules/socio/`)

Queries: `rolesSocio`, `socios` (requiere `X-Company-Id`), `socio`, `tercerosDisponiblesParaSocio`. Sin mutations de escritura.

### Gateway `routes/socio.js`

| Destino | Rutas |
|---------|--------|
| Nest | GET selects rol-socio, terceros disponibles |
| Python | POST/PUT/PATCH socio |

### Front

- API: `_apis_/socio.js`
- Vistas: `views/socios/Socios.tsx`, `SocioForm.tsx`
- Listado: GQL `socios`; alta/edición: REST; empresas si GLOBAL vía InicioNest.

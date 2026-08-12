# Frontend (`frontReact`)

SPA React. Puerto **3000**. Solo habla con el **gateway** (`VITE_GATEWAY_URL`, default `http://localhost:3002`).

## Canales de datos

| Canal | Cliente | Uso |
|-------|---------|-----|
| GraphQL | Apollo (`config/apollo-client.ts` → `mainClient`) | Listados, detalle, catálogos de lectura, login |
| REST | axios en `_apis_/*.js` | Crear / actualizar / eliminar; algunos selects |

## Estructura relevante

| Ruta | Contenido |
|------|-----------|
| `src/_apis_/` | Clientes REST por dominio |
| `src/views/` | Pantallas por módulo |
| `src/routes/Router.tsx` | Rutas lazy-loaded |
| `src/hooks/` | p. ej. `useJwtPayload`, `useConfigEmpresaScope` |
| `src/utils/scopeAcceso.ts` | `isScopeGlobal` |
| `src/components/` | Selects reutilizables, `ConfigEmpresaBar`, etc. |

## APIs REST (`src/_apis_/`)

| Archivo | Prefijo gateway típico |
|---------|------------------------|
| `gateway.js` | Cliente/base axios |
| `usuario.js` | `/api/usuarios` |
| `empresa.js` | `/api/empresas` |
| `sucursal.js` | `/api/sucursales` |
| `perfil.js` | `/api/perfiles` |
| `catalogos.js` | `/api/catalogos/*` (+ Bearer / `X-Company-Id`) |
| `tercero.js` | `/api/tercero(s)` |
| `contacto.js` | `/api/contactos` |
| `socio.js` | `/api/socio` |
| `item.js` | `/api/item` |
| `inventario.js` | `/api/inventario` |
| `bancoCaja.js` | `/api/banco`, `/cuenta-bancaria`, … |
| `contabilidad.js` | `/api/...` contabilidad |
| `menu.js` | `/api/menu-secciones`, `/menu-items` |
| `media.js` | `/api/media` |
| `directorio.js` | `/api/directorio` |
| `estadoArchivo.js` | `/api/estado-archivo` |
| `account.js` | Mock/template (no producción) |

## Mapa de pantallas (Router)

| Prefijo ruta | Carpeta vistas | Módulo backend |
|--------------|----------------|----------------|
| `/auth/login` | auth | Inicio |
| `/empresas`, `/sucursales`, `/perfiles`, `/usuario` | empresas, sucursales, perfiles, usuarios | Inicio |
| `/configuracion/*` | configuracion + diccionarios financiero | Inicio (catálogos) |
| `/terceros`, `/clientes`, `/proveedores`, contactos | terceros/ | Tercero |
| `/socios` | socios/ | Tercero (socio) |
| `/items/productos`, `/items/servicios` | items/ | Item |
| `/items/inventarios` | items/inventarios/ | Inventario |
| `/banco-cajas/*` | banco-cajas/ | BancoCaja |
| `/contabilidad/*` | contabilidad/ | Contabilidad |
| `/financiero/*` | financiero/ | Financiero |
| `/menus/*` | menus/ | Menu + InicioPython |
| `/documentos` | documentos/ | Media |

## Multiempresa en UI

- JWT: `scope_acceso` (`EMPRESA` | `GLOBAL`) + `id_empresa`.
- `EMPRESA`: sin combo de empresas; datos forzados a su empresa.
- `GLOBAL`: selector (`SelectEmpresa` / `ConfigEmpresaBar` / `useConfigEmpresaScope`).
- Detalle: `.cursor/rules/multiempresa-scope.mdc`.

## Flujo de una pantalla típica

1. Usuario abre ruta → componente en `views/`.
2. Listado: `useQuery` Apollo → gateway `/graphql` → Nest del dominio.
3. Guardar: función en `_apis_` → gateway `/api/...` → Python.
4. Headers de empresa: JWT y/o `sessionStorage` / props `id_empresa`.

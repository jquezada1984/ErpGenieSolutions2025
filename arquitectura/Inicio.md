# Inicio

Servicios: `InicioNestJs` + `InicioPython`. Núcleo: auth, usuarios, empresas, sucursales, perfiles, catálogos/diccionarios.

```
Login / me / catálogos lectura  → GraphQL → InicioNestJs
CRUD usuario/empresa/sucursal/perfil/diccionarios → REST → InicioPython
```

## InicioNestJs (lectura + auth)

Queries / mutations relevantes (no exhaustivo):

| Área | Operaciones |
|------|-------------|
| Auth | `login`, `me`, `validateToken`, `getUserProfile`, `refreshUserPermissions` |
| Usuarios | `usuarios`, `usuario` |
| Empresas | `empresas`, `empresa` |
| Sucursales | `sucursales`, `sucursal`, `sucursalesPorEmpresa` |
| Perfiles | `perfiles`, `perfil`, `perfilesPorEmpresa` |
| Catálogos | `paises`, `provincias`, `monedas`, `formasPago`, `condicionesPago`, `formatosPapel`, `almacenes`, `unidades`, `impuestos`, `tiposItemCatalogo`, … |

Auth también puede exponerse por controller REST Nest; el front de login usa **GraphQL** vía gateway.

## InicioPython (escritura)

Rutas típicas bajo `/api`:

| Recurso | Paths |
|---------|--------|
| Usuario | `POST/PUT /api/usuario` |
| Empresa | `POST/PUT/DELETE /api/empresa` |
| Sucursales | `POST/PUT/DELETE /api/sucursales`, estado |
| Perfiles | CRUD `/api/perfiles` |
| Catálogos diccionario | `/api/catalogos/condicion-pago`, `forma-pago`, `moneda`, `tipo-entidad-legal`, `formato-papel`, … |
| Menú estructura | `/api/menu-secciones`, `/api/menu-items` (también usado desde módulo Menu) |

Catálogos por empresa: filtrado con `X-Company-Id` (`utils/empresa_context.py`). Migración: `docs/sql/2026-08-04_diccionarios_por_empresa.sql`.

## Gateway

| Ruta | Nest vs Python |
|------|----------------|
| `usuarios.js` | POST/PUT → Python; strip `scope_acceso` si JWT ≠ GLOBAL |
| `empresas.js` | GET → Nest; escritura → Python |
| `sucursal.js` | Escritura → Python |
| `perfil.js` | CRUD → Python |
| `catalogos.js` | Proxy a Python (diccionarios) |
| `graphql.js` | Auth + catálogos generales + default → InicioNestJs |

## Front — pantallas

| Ruta | Vista / área | Datos |
|------|--------------|-------|
| `/auth/login` | Login | GQL `login` |
| `/usuario`, nuevo, editar | `views/usuarios/` | GQL listado; REST crear/editar; select alcance solo GLOBAL |
| `/empresas` (+ nueva/editar) | `views/empresas/` | GQL + REST |
| `/sucursales` | `views/sucursales/` | GQL + REST |
| `/perfiles` | perfiles | GQL + REST |
| `/configuracion/diccionarios/*` | diccionarios (también bajo financiero) | `useConfigEmpresaScope` + `_apis_/catalogos.js` |
| `/configuracion/paneles|alertas|seguridad|emails` | `views/configuracion/` | Scope empresa + placeholders/config |

APIs: `usuario.js`, `empresa.js`, `sucursal.js`, `perfil.js`, `catalogos.js`.

## Permisos `scope_acceso`

Ver `Plan/PLAN_SCOPE_ACCESO_USUARIOS.md` y `.cursor/rules/multiempresa-scope.mdc`.

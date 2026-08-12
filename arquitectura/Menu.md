# Menu

Lectura de menú y permisos: **`MenuNestJs`** (solo GraphQL).  
Escritura de estructura (secciones/ítems de menú): **`InicioPython`** vía gateway `routes/menu.js`.

```
Menú lateral / permisos por perfil  → Apollo → MenuNestJs
CRUD estructura menú (admin)       → REST _apis_/menu.js → InicioPython
```

## MenuNestJs — queries

| Query | Uso |
|-------|-----|
| `menuLateralPorPerfil` / `menuLateralOrdenado` | Menú lateral según perfil |
| `menuPrincipalOrdenado`, `submenusOrdenados` | Estructura |
| `opcionesMenuSuperior` | Barra superior |
| `permisosPorPerfil`, `perfilConPermisos` | Permisos |
| `validarAccesoRuta` | Autorización de ruta |
| `modulosDisponibles`, `estadisticasPermisos` | Admin |
| `idSeccionPorNombre` | Utilidad |

Migraciones de menú/permisos: `MenuNestJs/migrations/` (p. ej. banco-cajas, configuración inicio).

## Gateway

- GraphQL: si la query menciona `menu`, `permiso`, `autorizacion`, etc. → MenuNestJs.
- REST `routes/menu.js`: `POST/PUT/DELETE` `/menu-secciones`, `/menu-items` → InicioPython.

## Front

- API escritura: `_apis_/menu.js`
- Lectura: Apollo en layout / guards de ruta
- Vistas admin: `views/menus/` (`/menus`, `/menus/estructura`, nuevo ítem/sección, `EditarItem`, `NuevoItem`, …)

Flujo al entrar al ERP: login → perfil → `menuLateralPorPerfil` → render sidebar → navegación a rutas de `Router.tsx` (que deben coincidir con menú BD).

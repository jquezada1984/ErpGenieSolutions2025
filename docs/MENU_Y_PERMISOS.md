# Menú y permisos

El menú superior y el lateral se definen en PostgreSQL y se filtran por perfil.

## Tablas

- `menu_seccion` — sección de barra (Inicio, Terceros, Contabilidad, …)
- `menu_item` — ítems y subítems (`parent_id`, `ruta`, icono, orden)
- `perfil_menu_permiso` — permiso por perfil e ítem

## Flujo front

1. Login → JWT con `id_perfil`, `id_empresa`, `scope_acceso` (GLOBAL | EMPRESA).
2. `opcionesMenuSuperior` / `menuLateralPorPerfil` → barra superior.
3. Al elegir sección → `menuPrincipalOrdenado` + `submenusOrdenados` (o `cargarMenuLateralOrdenado`).
4. Si no hay datos en BD para una sección, puede haber fallback estático en `SidebarData.tsx`.

## Scripts útiles

| Archivo | Uso |
|---------|-----|
| `MenuNestJs/migrations/menu-terceros.sql` | Sección Terceros |
| `MenuNestJs/migrations/menu-banco-cajas.sql` (+ transferencias) | Banco / Cajas |
| `docs/sql/2026-05-17_menu_*.sql` | Productos, inventarios, diccionarios |
| `docs/sql/2026-05-17_permisos_admin_menus_nuevos.sql` | Permisos admin |

Ver también: [GRAPHQL_PERMISOS_MENU.md](./GRAPHQL_PERMISOS_MENU.md), [TERCEROS_POR_BASE_DE_DATOS.md](./TERCEROS_POR_BASE_DE_DATOS.md).

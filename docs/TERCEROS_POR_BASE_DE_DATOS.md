# Terceros por base de datos

El menú **Terceros** (barra superior y sidebar) puede cargarse desde la base de datos igual que Inicio y Contabilidad. Así se centraliza la definición del menú en BD y se respetan los permisos por perfil.

---

## 1. Flujo en la aplicación

- **Barra superior:** Si el perfil tiene permisos en ítems de la sección "Terceros", "Terceros" aparece en la barra (vía `opcionesMenuSuperior` → `perfil_menu_permiso`).
- **Sidebar:** Al hacer clic en Terceros:
  1. Se obtiene `id_seccion` de "Terceros" desde `menuLateral` (devuelto por `menuLateralPorPerfil`) o, si no viene, con `getIdSeccionPorNombre('Terceros')`.
  2. Se llama `cargarMenuLateralOrdenado(id_seccion)`: se traen ítems raíz (`menuPrincipalOrdenado`) y por cada uno sus hijos (`submenusOrdenados`).
  3. Si el menú cargado corresponde a esa sección (`id_seccion` coincide), se pinta en el sidebar; si no hay datos en BD, se usa el menú estático de `SidebarData.tsx` (terceros).

---

## 2. Cambios en el frontend

**Archivo:** `frontReact/src/layouts/sidebars/vertical/Sidebar.tsx`

- En el `useEffect` que carga el menú lateral, se añadió el respaldo para Terceros:
  - Si `selectedMenu === 'terceros'` y no hay `id_seccion` en `menuLateral`, se llama `getIdSeccionPorNombre('Terceros')` y con ese id se llama `cargarMenuLateralOrdenado(id)`.
- La lógica de "menú dinámico" ya es común: si hay `esMenuDinamicoActual` y hay ítems, se usa el menú de BD (incluye Terceros). El título del sidebar para Terceros viene del mapa `captionPorMenu.terceros = 'Terceros'`.

No hace falta tocar `SidebarData.tsx`: si Terceros no tiene sección/ítems en BD, se seguirá usando el estático como fallback.

---

## 3. Scripts SQL (ejecutar en pgAdmin)

### 3.1 Crear sección e ítems del menú Terceros

**Archivo:** `MenuNestJs/migrations/menu-terceros.sql`

- Crea la sección **Terceros** en `menu_seccion` (si no existe).
- Crea los ítems en `menu_item`:
  - **Raíz (parent_id NULL):** Dashboard, Tercero, Cliente, Cliente Potencial, Contacto/Direccion.
  - **Hijos:** por ejemplo bajo Tercero: "Nuevo tercero" (`/terceros/nuevo`), "Listado tercero" (`/terceros`); bajo Cliente, Cliente Potencial y Contacto/Direccion sus respectivos enlaces (igual que en el menú estático).

Ejecutar **una sola vez**. Si la sección "Terceros" ya existe y tiene ítems, no volver a ejecutar para no duplicar.

### 3.2 Dar permisos a los perfiles

**Archivo:** `MenuNestJs/migrations/permisos-terceros-para-perfil.sql`

- Inserta en `perfil_menu_permiso` un registro por cada ítem de la sección "Terceros" para cada perfil existente (`permitido = true`).
- Así "Terceros" aparece en la barra superior y el sidebar puede cargar el menú desde BD.

Si tu BD no soporta `ON CONFLICT` en esa tabla, usar:

**Archivo:** `MenuNestJs/migrations/permisos-terceros-para-perfil-sin-on-conflict.sql`

---

## 4. Estructura del menú Terceros en BD

Equivalente al menú estático del front:

| Nivel   | Etiqueta                  | Ruta                              | Icono / nota        |
|---------|---------------------------|-----------------------------------|---------------------|
| Raíz    | Dashboard                 | /dashboard                        | fas fa-home         |
| Raíz    | Tercero                   | (sin ruta, tiene hijos)          | fas fa-user-tie     |
| Hijo    | Nuevo tercero             | /terceros/nuevo                   | fas fa-user-plus    |
| Hijo    | Listado tercero           | /terceros                         | fas fa-list         |
| Raíz    | Cliente                   | (sin ruta)                        | fas fa-user-tie     |
| Hijo    | Nuevo cliente            | /clientes/nuevo                   | fas fa-user-plus    |
| Hijo    | Listado cliente           | /clientes                         | fas fa-list         |
| Raíz    | Cliente Potencial         | (sin ruta)                        | fas fa-user-tie     |
| Hijo    | Nuevo cliente potencial   | /clientes_potenciales/nuevo       | fas fa-user-plus    |
| Hijo    | Listado cliente potencial | /clientes_potenciales/lista      | fas fa-list         |
| Raíz    | Contacto/Direccion        | (sin ruta)                        | fas fa-address-book |
| Hijo    | Nuevo contacto/dirección | /contactos_direcciones/nuevo      | fas fa-user-plus    |
| Hijo    | Listado contacto/dirección| /contactos_direcciones/lista      | fas fa-list         |
| Hijo    | Proveedores               | /contactos_direcciones/proveedores | fas fa-list         |
| Hijo    | Otro                      | /contactos_direcciones/otro       | fas fa-list         |

---

## 5. Orden de ejecución recomendado

1. Ejecutar `menu-terceros.sql` (una vez).
2. Ejecutar `permisos-terceros-para-perfil.sql` (o la versión sin ON CONFLICT si aplica).
3. Cerrar sesión y volver a entrar (o recargar la app) para que se recalculen permisos y menú.

Después de esto, Terceros debería mostrarse en la barra (si el perfil tiene permisos) y el sidebar de Terceros debería cargarse desde la BD con la misma estructura que el menú estático.

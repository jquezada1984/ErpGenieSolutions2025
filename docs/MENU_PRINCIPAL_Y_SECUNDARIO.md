# Carga del menú principal y secundario

## Menú principal (barra superior)

**Dónde:** `Header.tsx`

**Flujo:**
1. Al tener usuario autenticado (`user?.id_perfil`), se llama:
   - `cargarOpcionesMenuSuperior(user.id_perfil)` → GraphQL `opcionesMenuSuperior(id_perfil)`
   - `cargarMenuLateral(user.id_perfil)` → GraphQL `menuLateralPorPerfil(id_perfil)`
2. **Backend (MenuNestJs):** `obtenerOpcionesMenuSuperior` usa `perfil_menu_permiso` + `menu_item` + `menu_seccion`: solo devuelve nombres de secciones que tienen al menos un ítem con `permitido = true` para ese perfil.
3. El Header filtra `mainMenuOptions` con esos nombres (mapeando "Contabilidad" → `contabilidad`, etc.) y muestra solo las opciones permitidas.
4. Al hacer clic en una opción se hace `dispatch(setMainMenu(item.key))` → Redux `mainMenu.selected` = `'inicio' | 'terceros' | 'contabilidad' | ...`

**Fuente de datos:** BD (tablas `menu_seccion`, `menu_item`, `perfil_menu_permiso`). Sin permisos para una sección, no aparece en la barra.

---

## Menú secundario (sidebar)

**Dónde:** `Sidebar.tsx` + `usePermissions.ts` + `SidebarData.tsx`

**Flujo:**

1. **Sección actual:** `selectedMenu` viene de Redux (lo que se eligió en la barra).
2. **ID de sección:** `obtenerIdSeccionPorMenu(selectedMenu)`:
   - `inicio` → ID fijo `29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1` (Administración).
   - Resto (contabilidad, terceros, etc.) → `menuLateral.find(s => s.nombre === '...')?.id_seccion` (de `menuLateralPorPerfil`). Si no hay, respaldo por nombre: Contabilidad → `getIdSeccionPorNombre('Contabilidad')`, Terceros → `getIdSeccionPorNombre('Terceros')`.
3. **Carga del menú jerárquico:** si hay `id_seccion`, se llama `cargarMenuLateralOrdenado(id_seccion)`:
   - GraphQL `menuPrincipalOrdenado(id_seccion)` → ítems con `parent_id IS NULL` (raíz).
   - Por cada ítem raíz, GraphQL `submenusOrdenados(parent_id)` → hijos.
   - Se arma un objeto `{ id_seccion, nombre, items }` (cada item con `children`) y se guarda en `menuLateralOrdenado`.
4. **Qué se muestra (Sidebar.tsx):**
   - Si hay **menú dinámico** para la sección actual (`esMenuDinamicoActual`: mismo `id_seccion` y hay items): se pinta con `menuOrdenadoActual.items` y sus `children`. El título usa un mapa por clave (Administración, Contabilidad, etc.).
   - Si no hay dinámico y es **inicio**: fallback estático (solo Empresa).
   - En cualquier otro caso: `getSidebarData(selectedMenu)` → estático en `SidebarData.tsx` (ej. "Próximamente").

**Resumen por sección:**

| Sección       | id_seccion                    | Contenido sidebar                                      |
|---------------|-------------------------------|--------------------------------------------------------|
| Inicio        | Fijo (Administración)         | Dinámico (BD) o fallback estático Empresa             |
| Terceros      | menuLateral o por nombre      | Dinámico (BD) si existe sección/ítems; si no, estático |
| Contabilidad  | menuLateral o por nombre      | Dinámico (BD) si hay datos; si no, "Próximamente"      |
| Otras         | menuLateral                   | Estático "Próximamente" (SidebarData)                  |

---

## Backend (MenuNestJs)

- **opcionesMenuSuperior(id_perfil):** secciones con al menos un ítem permitido para el perfil.
- **menuLateralPorPerfil(id_perfil):** secciones con ítems permitidos (para tener `id_seccion` y listar ítems por sección).
- **idSeccionPorNombre(nombre):** devuelve `id_seccion` de una sección por nombre (respaldo).
- **menuPrincipalOrdenado(id_seccion):** ítems de esa sección con `parent_id IS NULL`, ordenados.
- **submenusOrdenados(parent_id):** ítems con ese `parent_id`, ordenados.

Todo el menú secundario “dinámico” se arma en el frontend: una llamada a ítems principales + N llamadas a submenús (una por ítem raíz).

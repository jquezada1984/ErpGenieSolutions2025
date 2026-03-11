# Revisión: Menú principal y submenú

**Los menús son 100% desde base de datos:** al agregar una nueva sección o ítem en la BD (y dar permisos al perfil), aparece en la barra y en el sidebar sin tocar código.

Resumen del flujo y correcciones aplicadas.

---

## 1. Flujo actual

### Menú principal (barra superior – Header)

1. Con usuario autenticado se llama `cargarOpcionesMenuSuperior(id_perfil)` y `cargarMenuLateral(id_perfil)`.
2. **Backend (MenuNestJs):** `opcionesMenuSuperior` devuelve nombres de secciones con al menos un ítem permitido para el perfil.
3. El Header filtra las opciones con esos nombres y al hacer clic hace `setMainMenu(key)` en Redux (`inicio`, `terceros`, `contabilidad`, etc.).

### Menú secundario (sidebar – Sidebar)

1. **Sección actual:** `selectedMenu` viene de Redux (lo elegido en la barra).
2. **ID de sección:**
   - `inicio` → ID fijo `29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1`.
   - Resto → `menuLateral.find(s => s.nombre === 'Contabilidad'|'Terceros'|...)?.id_seccion`, o respaldo con `getIdSeccionPorNombre('Contabilidad')` / `getIdSeccionPorNombre('Terceros')`.
3. **Carga jerárquica:** `cargarMenuLateralOrdenado(id_seccion)`:
   - Query `menuPrincipalOrdenado(id_seccion)` → ítems con `parent_id IS NULL`.
   - Por cada ítem raíz, query `submenusOrdenados(parent_id)` → hijos.
   - Se arma `{ id_seccion, nombre, items }` (cada ítem con `children`) y se guarda en `menuLateralOrdenado`.
4. **Render:** Si hay menú dinámico para la sección actual se usa `menuOrdenadoActual.items` y sus `children`; si no, fallback estático (Inicio: Empresa; resto: `getSidebarData` → ej. "Próximamente").

---

## 2. Backend (MenuNestJs)

| Query | Uso |
|-------|-----|
| `opcionesMenuSuperior(id_perfil)` | Nombres de secciones visibles en la barra. |
| `menuLateralPorPerfil(id_perfil)` | Secciones con ítems permitidos (para tener `id_seccion` y nombres). |
| `idSeccionPorNombre(nombre)` | Respaldo para obtener `id_seccion` por nombre. |
| `menuPrincipalOrdenado(id_seccion)` | Ítems raíz de la sección (`parent_id IS NULL`), ordenados. |
| `submenusOrdenados(parent_id)` | Hijos de un ítem, ordenados. |

Tablas: `menu_seccion`, `menu_item` (con `parent_id`), `perfil_menu_permiso`.

---

## 3. Correcciones aplicadas

### 3.1 Iconos en NavSubMenu

- **Problema:** El sidebar pasaba el icono como nodo React (ej. `<i className="bi bi-building" />`) y NavSubMenu hacía `<i className={icon} />`, usando el nodo como `className`.
- **Solución:** En NavSubMenu se distingue: si `icon` es string se usa como clase CSS; si es nodo React se renderiza tal cual. Lo mismo para los ítems hijos.

### 3.2 Nombre e icono de la sección en menú ordenado

- **Problema:** Al construir `menuLateralOrdenado` se usaba siempre `nombre: 'Administración'` e `icono: 'bi bi-gear'`.
- **Solución:** Se usa `menuLateral.find(s => s.id_seccion === id_seccion)` para tomar el `nombre` y el `icono` reales de la sección (Contabilidad, Terceros, etc.). Si no está cargada la sección, se usa "Menú" y un icono por defecto.

### 3.3 Ítems con ruta pero sin hijos

- **Problema:** Un ítem de BD con `ruta` y sin hijos se convertía en submenú con `children: []`, mostrando un desplegable vacío.
- **Solución:** En `convertirItemsADatosSidebar`, si el ítem tiene `ruta` y no tiene hijos se devuelve como enlace directo (`href`, `children: undefined`) y el Sidebar lo pinta con `NavItemContainer` en lugar de `NavSubMenu`.

### 3.4 Rutas vacías en submenús

- **Problema:** Si `child.ruta` era null/undefined, `Link to={item.href}` podía generar navegación incorrecta.
- **Solución:** Se usa `href: child.ruta || '#'` en la conversión y `to={item.href || '#'}` en NavSubMenu para evitar `to={undefined}`.

---

## 4. Menú 100% desde BD (implementado)

- **Barra superior (Header):** Las opciones se construyen desde `menuLateral` (query `menuLateralPorPerfil`). Cada sección en `menu_seccion` con al menos un ítem permitido para el perfil aparece como botón. La clave seleccionada es `id_seccion` (UUID). No hay lista fija en código: si en BD se agrega una sección y se asignan permisos, aparece en la barra.
- **Sidebar:** El contenido se obtiene con `menuPrincipalOrdenado(id_seccion)` y `submenusOrdenados(parent_id)`. El título del sidebar es el `nombre` de la sección en BD. No se usa `SidebarData.tsx` ni fallbacks estáticos: todo viene de `menu_item` y `menu_seccion`. Si en BD se agregan ítems o submenús para una sección, se muestran sin cambiar código.
- **Selección por defecto:** Al cargar, se asigna la primera sección de `menuLateral` como seleccionada.

## 5. Recomendaciones

1. **Orden de carga:** El Header ya carga `cargarMenuLateral` al iniciar; así `menuLateral` tiene las secciones cuando se llama a `cargarMenuLateralOrdenado` y el nombre/icono de la sección se resuelve bien.
2. **BD:** Asegurar que los ítems de menú tengan `ruta` cuando deban navegar (ej. `/contabilidad/asientos`) y que existan las rutas en el Router del front.
3. **Permisos:** Solo aparecen secciones con al menos un ítem permitido para el perfil (`perfil_menu_permiso`). Para una nueva sección, crear ítems en `menu_item` y dar permisos en `perfil_menu_permiso`.
4. **Documentación relacionada:** Ver `docs/MENU_PRINCIPAL_Y_SECUNDARIO.md`, `docs/IMPLEMENTACION_MENU_EMPRESA.md`, `docs/IMPLEMENTACION_MENU_ORDENADO.md`.

# Auditoría arquitectónica – Módulo Menús vs plantilla Terceros

**Fecha:** 2025-03-10  
**Referencia:** Plantilla oficial [MODULO_TERCEROS_PLANTILLA.md](../arquitectura/MODULO_TERCEROS_PLANTILLA.md)  
**Módulo auditado:** Menús (secciones e ítems de menú)  
**Alcance:** Solo análisis y diagnóstico. Sin implementación ni cambios.

---

# 1. Resumen ejecutivo

- **Estado general del módulo:** El módulo Menús está operativo de forma parcial: escritura (crear/actualizar/eliminar secciones e ítems) pasa por el Gateway hacia InicioPython; la lectura para administración (secciones, item, itemsPorSeccion) está en **InicioNestJs**, mientras que el Gateway envía las consultas GraphQL que contienen la palabra "menu" a **MenuNestJs**, que **no** expone esas queries. Esto genera riesgo de fallo en pantallas de gestión de menú cuando se usa solo el Gateway. Además, la capa Python no sigue la estructura en capas de la plantilla (falta service/repository), no hay reenvío de headers multiempresa en el Gateway para menú, y el frontend no usa react-hook-form ni schemas Yup ni el patrón GLOBAL/EMPRESA donde aplique.

- **Nivel de alineación con la plantilla Terceros:** **Parcial (bajo–medio).** Se respetan UUID, separación lectura/escritura a alto nivel y uso de GraphQL para lectura y REST para escritura, pero faltan capas en Python, enrutamiento correcto de GraphQL para administración de menú, headers de contexto en escritura, y patrones de frontend (react-hook-form, schemas, secciones, uso consistente de cliente GraphQL).

- **Riesgo general:** **Medio–alto.** Riesgo alto si las pantallas de menú usan solo el Gateway para GraphQL (queries enviadas a MenuNestJs sin resolver `secciones`/`item`/`itemsPorSeccion`). Riesgo medio por deuda técnica: falta de capas en Python, ausencia de headers multiempresa, mutación `updateMenuItem` inexistente, y posibles discrepancias de nombres (ej. `children` vs `subitems`).

---

# 2. Hallazgos correctos

- **Base de datos**
  - Uso de **UUID** como PK en `menu_seccion` (`id_seccion`) y `menu_item` (`id_item`).
  - FKs correctas: `menu_item.id_seccion` → `menu_seccion.id_seccion`, `menu_item.parent_id` → `menu_item.id_item`.
  - `menu_item` tiene campos de auditoría en migraciones y en modelo Python: `created_by`, `created_at`, `updated_by`, `updated_at`, y `estado`.
  - Nombres de columnas coherentes con el resto del sistema (`id_seccion`, `id_item`, `etiqueta`, `ruta`, etc.).

- **Backend Python (InicioPython)**
  - Existen **models** (`models/menu.py`) y **schemas** Marshmallow (`schemas/menu_schema.py`) para MenuSeccion y MenuItem.
  - Validación con schema en serialización; rutas REST para crear/actualizar/eliminar secciones e ítems.
  - Escritura de menú concentrada en un solo backend (InicioPython) y expuesta vía Gateway.

- **Backend NestJS**
  - **InicioNestJs:** Resolvers de menú para **lectura** (secciones, item, itemsPorSeccion) y entidades alineadas con la BD.
  - **MenuNestJs:** Entidades `menu-seccion` y `menu-item` con tipos GraphQL; servicio de autorización/permisos por perfil y menú lateral.

- **Gateway**
  - Rutas de **escritura** para menú registradas: POST/PUT/DELETE `/api/menu-secciones` y `/api/menu-items`, reenviando a `pythonService` (InicioPython).
  - Schemas de validación en el Gateway para body de secciones e ítems (`menu.js` y `schemas/menu.js`).
  - GraphQL del Gateway redirige consultas relacionadas con permisos/menú lateral a MenuNestJs.

- **Frontend**
  - Estructura **views/menus/** con pantallas de listado (Menus), nuevo/editar ítem (NuevoItem, EditarItem), nueva sección (NuevaSeccion), y vista maestro-detalle (MenuMasterDetail).
  - **_apis_/menu.js** centraliza llamadas REST al Gateway para crear/actualizar/eliminar secciones e ítems.
  - Formularios envían **payloads por UUID** (`id_seccion`, `parent_id`, etc.), no textos.
  - Uso de GraphQL (Apollo) para obtener secciones, ítem y ítems por sección en pantallas de administración.
  - Selects dependientes de tipo “sección → ítem padre” con valores por `id_seccion` / `parent_id` (UUID).

- **Consistencia entre capas**
  - Nombres de campos alineados entre BD, Python, NestJS y frontend (`id_seccion`, `id_item`, `etiqueta`, `orden`, `estado`, etc.).

---

# 3. Hallazgos faltantes

- **Base de datos**
  - **menu_seccion:** En scripts SQL y entidad MenuNestJs/InicioNestJs existe campo `estado`; en el **modelo** Python `MenuSeccion` (**InicioPython/models/menu.py**) **no** existe el campo `estado` ni campos de auditoría (`created_by`, `updated_by`, `created_at`, `updated_at`). Si la BD tiene estas columnas, el modelo no las refleja.

- **Backend Python**
  - No existe **repositories/** para menú (patrón: route → service → **repository** → db).
  - No existe **services/** para menú (lógica de negocio en capa service; actualmente está en `api/menu_routes.py`).
  - Flujo actual: route → acceso directo a modelos y `db.session` en las propias rutas; no se cumple el patrón route → service → repository → db.

- **Backend NestJS**
  - **MenuNestJs** no expone queries de administración: **no** hay resolver con `secciones`, `seccion`, `item`, `itemsPorSeccion` ni `items`. Esas queries están solo en **InicioNestJs**. Si el Gateway envía todas las consultas que contienen "menu" a MenuNestJs, las pantallas que piden `secciones`/`item`/`itemsPorSeccion` no tendrían resolver de destino.
  - No se encontró **ninguna** mutación **updateMenuItem** (ni equivalente) en InicioNestJs ni MenuNestJs; el frontend (MenuMasterDetail) usa una mutación `updateMenuItem(id_item, orden)` que **no existe** en backend.

- **Gateway**
  - No hay rutas REST de **lectura** para menú (GET `/api/menu-secciones`, GET `/api/menu-secciones/:id`, GET `/api/menu-items`, etc.). La lectura se asume vía GraphQL; el frontend **_apis_/menu.js** define `obtenerSeccion(id)` por GET, pero el Gateway **no** expone GET para esa ruta, por lo que esa función no puede funcionar contra el Gateway.
  - No se reenvían headers **X-Company-Id**, **X-User-Id**, **X-Scope-Acceso** (ni equivalentes) desde el Gateway hacia InicioPython en las rutas de menú. En Terceros el Gateway usa un servicio específico que construye y reenvía estos headers; en menú se usa `pythonService` sin inyectar el `request` ni headers.

- **Frontend**
  - No existe carpeta **views/menus/schemas/** (validación Yup / tipos de formulario), a diferencia de terceros (schemas en `views/terceros/schemas/` y en contactos).
  - No existe carpeta **views/menus/secciones/** con componentes de sección reutilizables (la plantilla terceros usa `secciones/` para trozos de formulario).
  - Formularios **no** usan **react-hook-form**; usan estado local (`useState`) y `<Form>` de reactstrap.
  - **No** se usa validación **Yup** en vistas de menú.
  - No se usa **useJwtPayload()** ni **SelectEmpresa** en vistas de menú (si el menú fuera por empresa en el futuro, faltaría este patrón).
  - En edición no se usa **reset()** de react-hook-form con datos cargados; se usa `setFormData` con datos de la query.

---

# 4. Hallazgos incorrectos o riesgosos

- **Enrutamiento GraphQL (Gateway):** La función `getTargetService` en **gateway-api/src/routes/graphql.js** envía al **MenuNestJs** cualquier consulta que contenga la cadena `"menu"`. Las pantallas de administración de menú (Menus, NuevoItem, EditarItem, MenuMasterDetail) usan el cliente Apollo por defecto (Gateway). Sus queries tienen nombres como `GetMenuSecciones` o piden campos bajo `secciones`/`item`/`itemsPorSeccion`. Como el texto de la query incluye "menu", el Gateway envía la petición a **MenuNestJs**, que **no** define las queries `secciones`, `item`, `itemsPorSeccion` ni `items`. Consecuencia: **riesgo de que las pantallas de gestión de menú fallen** al cargar datos cuando se usa solo el Gateway (o que dependan de que en runtime se use otro cliente/URL para GraphQL).

- **Duplicidad de responsabilidad de lectura:** La **lectura** de menú para administración (listado de secciones, detalle de ítem, ítems por sección) está en **InicioNestJs** (MenuSeccionResolver, MenuItemResolver). La **lectura** para permisos y menú lateral por perfil está en **MenuNestJs**. No hay un único “servicio de menú” para lectura que coincida con el enrutamiento del Gateway, lo que genera confusión y el posible fallo anterior.

- **Mutation updateMenuItem inexistente:** En **MenuMasterDetail.tsx** se usa la mutación GraphQL `updateMenuItem(id_item, orden)`. Esa mutación **no** aparece en InicioNestJs ni en MenuNestJs. La funcionalidad de reordenar ítems desde esa pantalla no puede funcionar contra el backend actual.

- **Nombre de campo GraphQL children vs subitems:** La query **GetMenuCompleto** en el frontend pide `items { ... children { ... } }`. En **InicioNestJs** la entidad MenuItem expone la relación como **subitems**, no **children**. Si el schema GraphQL solo define `subitems`, la query con `children` puede fallar o no devolver la jerarquía esperada.

- **Modelo Python MenuSeccion desalineado con BD:** Si en la base de datos la tabla `menu_seccion` tiene columnas `estado`, `created_by`, `updated_by`, `created_at`, `updated_at` (como en algunos scripts/migraciones), el modelo **MenuSeccion** en InicioPython no las tiene, lo que genera desalineación y posibles errores si se intentan leer o escribir esos campos desde Python.

- **Gateway schema menuItemUpdateSchema:** El esquema de actualización de ítem en el Gateway **no** incluye `id_seccion` ni `parent_id`. Si la aplicación debe permitir cambiar la sección o el ítem padre al editar un ítem, la validación del Gateway podría rechazar esos campos (según implementación de `additionalProperties` y uso del schema).

- **InicioNestJs también define mutaciones de menú:** InicioNestJs tiene mutaciones GraphQL para crear/actualizar/eliminar secciones e ítems (crearSeccion, actualizarSeccion, eliminarSeccion, crearItem, actualizarItem, eliminarItem). La arquitectura oficial indica que la **escritura** debe ir por REST (Python) vía Gateway. El frontend actual usa REST para escritura de menú, pero la existencia de mutaciones en NestJS puede llevar a usos mixtos o inconsistencias futuras.

---

# 5. Comparación contra la plantilla Terceros

## Base de datos

| Aspecto plantilla Terceros        | Módulo Menús                                                                 |
|-----------------------------------|-------------------------------------------------------------------------------|
| UUID PK/FK                        | Cumple en menu_seccion y menu_item.                                          |
| Catálogos por FK                  | N/A (menú es estructural; no hay catálogos tipo país/provincia).             |
| id_empresa en entidad principal   | No aplica por diseño (menú global); no hay id_empresa en menu_seccion/item.  |
| Auditoría (created_by, updated_by, created_at, updated_at, estado) | menu_item: sí en BD y modelo Python. menu_seccion: en BD/entity existe estado; en modelo Python MenuSeccion no hay estado ni auditoría. |
| Consistencia de nombres          | Cumple (id_seccion, id_item, etiqueta, etc.).                                |

## Flask (Python – escritura)

| Aspecto plantilla Terceros        | Módulo Menús                                                                 |
|-----------------------------------|-------------------------------------------------------------------------------|
| Estructura models / repositories / schemas / services / api | models y schemas y api presentes. **Faltan** repositories y services para menú. |
| Flujo route → service → repository → db | No cumple: la lógica está en api/menu_routes.py directamente con modelos y db.session. |
| Validación con schema             | Cumple (Marshmallow en serialización).                                       |
| Headers multiempresa (X-Company-Id, X-User-Id, X-Scope-Acceso) | No: las rutas de menú no leen ni usan estos headers.                        |

## NestJS (lectura)

| Aspecto plantilla Terceros        | Módulo Menús                                                                 |
|-----------------------------------|-------------------------------------------------------------------------------|
| entities / dto / resolver / service / module | InicioNestJs: entities y resolvers para secciones/items; MenuNestJs: entities y resolver de autorización/permisos. No hay un único “módulo menú” que concentre listado + detalle + catálogos. |
| Listados, detalle, catálogos      | Listado/detalle/items por sección en InicioNestJs. MenuNestJs no expone secciones/item/itemsPorSeccion. |
| Filtros por empresa               | N/A (menú sin id_empresa).                                                   |

## Gateway

| Aspecto plantilla Terceros        | Módulo Menús                                                                 |
|-----------------------------------|-------------------------------------------------------------------------------|
| Rutas lectura → NestJS            | Lectura por GraphQL; no hay GET REST para menú. Enrutamiento GraphQL envía "menu" a MenuNestJs, que no tiene las queries de administración. |
| Rutas escritura → Python         | Cumple: POST/PUT/DELETE menu-secciones y menu-items hacia pythonService.    |
| Reenvío de headers                | No: las rutas de menú no reenvían X-Company-Id, X-User-Id, X-Scope-Acceso al backend Python. |
| Consistencia de nombres de endpoints | Prefijo /api y nombres menu-secciones / menu-items coherentes.              |

## Frontend

| Aspecto plantilla Terceros        | Módulo Menús                                                                 |
|-----------------------------------|-------------------------------------------------------------------------------|
| views/<dominio>/                  | Cumple: views/menus/.                                                        |
| Listado, nuevo, editar            | Cumple: Menus, NuevoItem, EditarItem, NuevaSeccion, MenuMasterDetail.        |
| schemas/ (Yup / tipos)            | No: no existe views/menus/schemas/.                                         |
| secciones/                        | No: no existe views/menus/secciones/.                                       |
| _apis_/                           | Cumple: _apis_/menu.js.                                                     |
| react-hook-form                   | No: formularios con useState y Form (reactstrap).                            |
| Validación Yup                   | No.                                                                         |
| Payloads por UUID                 | Cumple (id_seccion, parent_id, etc.).                                       |
| Selects que devuelven id          | Cumple (sección e ítem padre por UUID).                                     |
| Patrón GLOBAL/EMPRESA             | No usado (menú tratado como global).                                        |
| useJwtPayload()                  | No usado en vistas de menú.                                                 |
| SelectEmpresa                     | No usado.                                                                   |
| reset() en edición                | No aplica react-hook-form; se usa setFormData con datos de la query.        |

---

# 6. Matriz de cumplimiento

| Componente              | Cumple | Parcial | No cumple | Observaciones |
|-------------------------|--------|---------|-----------|----------------|
| Base de datos           | X      |         |           | UUID y FKs correctos; menu_seccion en modelo Python sin estado/auditoría. |
| Flask – estructura      |        | X       |           | models + schemas + api; faltan repositories y services. |
| Flask – flujo           |        |         | X         | Route accede directamente a modelos/db, sin service/repository. |
| Flask – headers         |        |         | X         | No se usan headers multiempresa. |
| NestJS – lectura admin  |        | X       |           | En InicioNestJs; MenuNestJs no expone secciones/item/itemsPorSeccion. |
| NestJS – permisos/menú  | X      |         |           | MenuNestJs para permisos y menú lateral. |
| Gateway – escritura     | X      |         |           | Rutas POST/PUT/DELETE a Python. |
| Gateway – lectura       |        |         | X         | GraphQL “menu” enviado a MenuNestJs sin queries de administración; sin GET REST menú. |
| Gateway – headers       |        |         | X         | No reenvío de X-Company-Id, X-User-Id, X-Scope-Acceso para menú. |
| Frontend – vistas       | X      |         |           | views/menus con listado, nuevo, editar. |
| Frontend – schemas      |        |         | X         | No hay schemas/ ni Yup en menú. |
| Frontend – secciones    |        |         | X         | No hay secciones/. |
| Frontend – formularios  |        |         | X         | No react-hook-form ni Yup. |
| Frontend – _apis_       | X      |         |           | _apis_/menu.js para mutaciones. |
| Consistencia de nombres | X      |         |           | id_seccion, id_item, etiqueta, etc. alineados. |

---

# 7. Prioridad de corrección

## Crítico

- **Enrutamiento GraphQL para administración de menú:** Ajustar el Gateway para que las queries de administración (secciones, item, itemsPorSeccion, items) se envíen al servicio que las implementa (InicioNestJs), o bien implementar esas mismas queries en MenuNestJs y mantener un único punto de lectura de menú. Evitar que consultas que requieren `secciones`/`item`/`itemsPorSeccion` se envíen a MenuNestJs sin que existan allí.
- **Mutation updateMenuItem:** Implementar en el backend (InicioNestJs o MenuNestJs, según decisión de dónde vive la “lectura de administración”) la mutación que el frontend usa para reordenar ítems, o sustituir en el frontend por una llamada REST al Gateway/Python que actualice el orden.
- **Alineación query GetMenuCompleto:** Resolver la discrepancia entre el campo `children` usado en el frontend y el campo `subitems` en la entidad MenuItem (GraphQL); unificar nombre o añadir alias para no romper la vista maestro-detalle.

## Importante

- **Backend Python en capas:** Introducir capa **services** y **repositories** para menú en InicioPython y hacer que las rutas solo reciban request, llamen al servicio y devuelvan respuesta (patrón Terceros).
- **Reenvío de headers en Gateway para menú:** Si en el futuro el menú o las operaciones requieren contexto de empresa/usuario, reenviar X-Company-Id, X-User-Id, X-Scope-Acceso al llamar a InicioPython desde las rutas de menú (por ejemplo usando un cliente que inyecte headers desde el request, como en Terceros).
- **Modelo MenuSeccion (Python):** Añadir en el modelo los campos que existan en BD (`estado`, y si aplica auditoría: created_by, updated_by, created_at, updated_at) para no tener desalineación con la base de datos.
- **GET de menú en Gateway (opcional):** Si se desea que `obtenerSeccion(id)` en _apis_/menu.js funcione contra el Gateway, exponer GET `/api/menu-secciones/:id` (y si aplica listados) que delegue en NestJS o en Python según el estándar elegido para lectura.

## Deseable

- **Frontend: react-hook-form y Yup:** Migrar formularios de menú a react-hook-form con validación Yup y tipos/schemas en views/menus/schemas/ para alineación con la plantilla.
- **Frontend: secciones:** Extraer trozos de formulario a views/menus/secciones/ para reutilización y mantenibilidad.
- **Unificación de escritura:** Valorar desactivar o no usar las mutaciones GraphQL de menú en InicioNestJs para mantener una sola vía de escritura (REST → Gateway → Python).
- **Patrón GLOBAL/EMPRESA y useJwtPayload:** Aplicar solo si el menú pasa a ser por empresa o por contexto de usuario.

---

# 8. Siguiente plan recomendado

1. **Definir dónde vive la “lectura de administración” de menú**  
   Decidir si las queries `secciones`, `item`, `itemsPorSeccion` (y si aplica `items`) deben estar solo en InicioNestJs o solo en MenuNestJs. Si se unifica en MenuNestJs, implementar allí los resolvers y el servicio correspondiente; si se mantienen en InicioNestJs, ajustar el Gateway para que las consultas que necesiten esas queries **no** se envíen a MenuNestJs (por ejemplo discriminando por nombre de query o por fragmentos de query en lugar de solo la palabra "menu").

2. **Corregir enrutamiento GraphQL en el Gateway**  
   Modificar `getTargetService` (o la lógica que enruta por "menu") para que las queries de administración de menú (secciones, item, itemsPorSeccion) vayan al servicio que realmente las implementa, de forma que las pantallas que usan solo el cliente por defecto (Gateway) carguen correctamente.

3. **Implementar updateMenuItem o alternativa**  
   Implementar en el backend elegido la mutación `updateMenuItem(id_item, orden)` (o equivalente) o exponer un endpoint REST de actualización de orden y usar ese endpoint desde MenuMasterDetail en lugar de la mutación GraphQL.

4. **Unificar nombre de campo children/subitems**  
   En el frontend usar el nombre de campo que expone el schema GraphQL (p. ej. `subitems`) en GetMenuCompleto, o en el backend exponer un alias `children` que resuelva a la misma relación que `subitems`.

5. **Añadir capa services y repositories para menú en InicioPython**  
   Crear `repositories/menu_repository.py` y `services/menu_service.py`, mover la lógica actual de `api/menu_routes.py` al servicio y al repositorio, y dejar las rutas solo como thin layer que llama al servicio y devuelve JSON.

6. **Completar modelo MenuSeccion en Python**  
   Añadir en `models/menu.py` los campos que existan en la tabla `menu_seccion` (estado y, si existen, created_by, updated_by, created_at, updated_at) para alineación con la BD.

7. **Opcional: reenvío de headers en Gateway para menú**  
   Si se requiere contexto multiempresa/usuario en escritura de menú, hacer que las rutas de menú en el Gateway pasen el request (o los headers necesarios) al cliente que llama a InicioPython, de forma análoga a terceroPython.js.

8. **Opcional: alinear frontend con plantilla**  
   Introducir views/menus/schemas/ con Yup y tipos, migrar formularios a react-hook-form, y si aporta valor, extraer secciones reutilizables en views/menus/secciones/.

---

*Auditoría realizada sin modificar archivos, sin refactor ni cambios automáticos. Cualquier implementación debe realizarse en una fase posterior.*

# AUDITORÍA CONTROLADA – APLICACIÓN DEL PATRÓN GLOBAL / EMPRESA EN EL MÓDULO ITEM

**Contexto:** ERP con arquitectura de microservicios. Plantilla oficial: módulo Terceros.  
**Objetivo:** Determinar cómo debe aplicarse correctamente el patrón GLOBAL/EMPRESA en el módulo **item** antes de implementar.  
**Restricciones:** Solo análisis y auditoría. No modificar, crear ni borrar archivos. No implementar código.

**Referencia de patrón (Terceros):** scope_acceso, id_empresa, X-Company-Id, X-User-Id, X-Scope-Acceso, useJwtPayload(), SelectEmpresa, usuario GLOBAL vs EMPRESA.

**Arquitectura del módulo item:** Un solo módulo con **ItemPython** (escritura) y **ItemNestJs** (lectura). Subdominios: productos, servicios, almacenes, inventarios, envíos, recepciones, stocks, lotes/series, variantes. No se proponen microservicios separados para producto o servicio.

---

# 1. Resumen ejecutivo

- **Conclusión general:** El módulo item debe aplicar el mismo patrón GLOBAL/EMPRESA que Terceros en todas las capas. Toda entidad operativa del dominio (item/producto/servicio, almacén, movimiento de inventario, stock, lotes/series, cuentas contables del item, etc.) debe estar ligada a `id_empresa` y toda lectura/escritura debe respetar scope (GLOBAL con SelectEmpresa, EMPRESA con id_empresa del JWT). El riesgo de no hacerlo es **crítico**: mezcla de stock entre empresas, visibilidad de productos/almacenes de otras empresas, movimientos y listados sin filtrar.

- **Nivel de criticidad del patrón GLOBAL/EMPRESA en item:** **Crítico.** El dominio item incluye inventario, stock y movimientos; un fallo de aislamiento por empresa puede provocar datos incorrectos, informes erróneos y problemas legales/fiscales. Debe replicarse el patrón de Terceros desde el primer diseño.

- **Recomendación general:** Adoptar reglas arquitectónicas claras (frontend, gateway, ItemPython, ItemNestJs, BD) antes de desarrollar. Reutilizar SelectEmpresa, useJwtPayload y `components/selects/`; en backend, leer siempre X-Company-Id, X-User-Id y X-Scope-Acceso en escritura y validar empresa en detalle por ID en lectura. No confiar solo en el frontend para filtrar por empresa.

---

# 2. Análisis por subdominio del módulo item

Para cada subdominio se indica: si debe filtrar por `id_empresa`, si requiere `scope_acceso`, si usuario GLOBAL debe seleccionar empresa, si usuario EMPRESA queda restringido automáticamente.

| Subdominio | Filtro id_empresa | scope_acceso | GLOBAL: SelectEmpresa | EMPRESA: restricción automática | Observaciones |
|------------|-------------------|--------------|------------------------|----------------------------------|---------------|
| **Productos** | Sí obligatorio | Sí | Sí: listado vacío hasta elegir empresa; formulario puede permitir elegir empresa | Sí: solo su id_empresa | Entidad central; UNIQUE(codigo) por empresa. Ya existe tabla `producto` con id_empresa en esquema actual. |
| **Servicios** | Sí obligatorio | Sí | Igual que productos | Igual que productos | Misma entidad “item” con tipo PRODUCTO/SERVICIO o entidad hermana; mismo criterio multiempresa. |
| **Almacenes** | Sí obligatorio | Sí | SelectEmpresa en listados y formularios | Solo almacenes de su empresa | Almacén pertenece a una empresa; no debe mezclarse entre empresas. |
| **Inventarios** | Sí obligatorio | Sí | Operaciones (ajustes, conteos) por empresa seleccionada o del usuario | Solo su empresa | Inventario es por empresa (y por almacén si aplica). |
| **Envíos** | Sí obligatorio | Sí | Listados y creación por empresa (SelectEmpresa para GLOBAL) | Solo envíos de su empresa | Envío ligado a empresa y normalmente a almacén. |
| **Recepciones** | Sí obligatorio | Sí | Igual que envíos | Solo recepciones de su empresa | Mismo criterio que envíos. |
| **Stock** | Sí obligatorio | Sí | Consultas por empresa (y almacén); GLOBAL elige empresa | Solo stock de su empresa | Stock por item/almacén; almacén ya es por empresa. No debe mostrarse stock de otra empresa. |
| **Lotes / series** | Sí obligatorio | Sí | Por empresa (y producto/almacén); GLOBAL elige empresa | Solo lotes/series de su empresa | Trazabilidad por empresa. |
| **Variantes / atributos** | Sí obligatorio | Sí | Variantes de items de la empresa seleccionada o del usuario | Solo variantes de items de su empresa | Si variantes son por item, heredan empresa del item. |

**Resumen:** Todos los subdominios del módulo item deben ser **multiempresa** con filtro por `id_empresa`, uso de `scope_acceso`, SelectEmpresa para GLOBAL y restricción automática a `id_empresa` del JWT para usuario EMPRESA. No hay subdominios “globales” que mezclen empresas.

---

# 3. Reglas para frontend

- **useJwtPayload():** Usar en todas las pantallas del módulo item que listen datos o permitan crear/editar. Obtener `scope_acceso` e `id_empresa` del payload para decidir si mostrar SelectEmpresa y con qué empresa cargar.
- **SelectEmpresa:** Reutilizar el componente existente (`components/SelectEmpresa.tsx`) en listados de productos, servicios, almacenes, inventarios, envíos, recepciones, stock y en formularios donde un usuario GLOBAL deba elegir empresa. No incrustar selects de empresa ad hoc en formularios.
- **Usuario EMPRESA:** Al montar listados o pantallas de consulta, cargar datos con `id_empresa` del JWT (`payload.id_empresa`) sin mostrar selector de empresa.
- **Usuario GLOBAL:** En listados no cargar datos al entrar; mostrar tabla vacía y mensaje tipo “Seleccione una empresa para ver los productos/almacenes/…”. Mostrar SelectEmpresa; al elegir empresa, llamar a la función de carga con ese `id_empresa`.
- **Formularios:** Incluir `id_empresa` en el payload de creación/actualización cuando corresponda. Para usuario EMPRESA puede enviarse desde el JWT (o el backend puede tomarlo del header); para GLOBAL, enviar la empresa seleccionada (o permitir elegir en el formulario si el negocio lo requiere).
- **Pantallas que deben aplicar el patrón:** Listados (productos, servicios, almacenes, movimientos de inventario, envíos, recepciones, stock, lotes/series); formularios nuevo/edición de item, almacén, movimientos; consultas de stock por almacén. Todas deben respetar GLOBAL vs EMPRESA.
- **Selects de catálogos del módulo item:** Si se necesitan nuevos selects (ej. tipo de item, unidad de medida, almacén), crearlos como componentes en `components/selects/` reutilizando `SearchableSelect`, no incrustar selects directos en formularios. Mantener el patrón de opciones por API/GraphQL y devolver UUID.
- **Cliente API (_apis_):** Crear (o extender) un cliente para el módulo item que en cada petición REST al Gateway añada en headers X-Company-Id y X-User-Id (y si el Gateway lo reenvía, X-Scope-Acceso) desde el token, igual que en `_apis_/tercero.js` y `_apis_/contacto.js`.
- **GraphQL (Apollo):** En queries de listado, pasar siempre la variable `id_empresa` (del usuario EMPRESA o de la empresa seleccionada para GLOBAL). No confiar solo en que “el front no pide otra empresa”; el backend debe validar, pero el front debe enviar el contexto correcto.

---

# 4. Reglas para gateway

- **Rutas REST de escritura del módulo item:** Todas las que llamen a ItemPython (crear/actualizar/eliminar item, almacén, movimientos de inventario, recepciones, envíos, ajustes de stock, lotes/series, etc.) deben usar un servicio análogo a `terceroPython.js`: construir headers de contexto desde el request y reenviarlos a ItemPython. Reenviar en cada petición:
  - **X-Company-Id**
  - **X-User-Id**
  - **X-Scope-Acceso**
- **Construcción de headers:** Replicar la lógica de Terceros: si existe `getUsuarioScope` (query usuario en InicioNestJs), usarla para obtener `id_empresa` y `scope_acceso`; para usuario GLOBAL permitir `body.id_empresa` o header; para EMPRESA fijar X-Company-Id al `id_empresa` del usuario. Inyectar siempre el `request` en las llamadas a ItemPython, no usar un cliente genérico sin contexto.
- **GraphQL:** Para consultas que el Gateway reenvíe a ItemNestJs, reenviar también los headers de contexto (X-Company-Id, X-User-Id, X-Scope-Acceso) desde el request entrante, de modo que ItemNestJs pueda validar o filtrar por empresa incluso si la query no trae variable `id_empresa`. Evitar depender solo de variables GraphQL enviadas por el cliente.
- **Rutas de lectura REST (si existen):** Si el Gateway expone GET para listar productos, almacenes, stock, etc., debe aceptar `id_empresa` (query param o header) y pasarlo a ItemNestJs como variable en la query GraphQL, para no devolver todos los registros sin filtrar (evitar el error actual de listarTerceros/listarClientes sin id_empresa).
- **Prefijo y registro:** Registrar las rutas del módulo item bajo un prefijo coherente (ej. `/api/item` o `/api/productos` según convención del proyecto), manteniendo un solo backend ItemPython e ItemNestJs.

---

# 5. Reglas para ItemPython

- **Lectura de contexto en todas las rutas de escritura:** En cada ruta que modifique datos (create, update, delete), leer desde los headers:
  - **X-Company-Id** (o x-company-id)
  - **X-User-Id** (o x-user-id)
  - **X-Scope-Acceso** (o x-scope-acceso), con valor por defecto `EMPRESA` si no viene.
- **Función central de contexto:** Definir una función equivalente a `_ctx_empresa_user()` (como en TerceroPython `tercero_routes.py`) que devuelva `id_empresa`, `user_id` y `scope_acceso`. Usarla en todas las rutas de escritura.
- **Crear item (producto/servicio):** Exigir X-Company-Id; rechazar con 400 si falta (salvo que el diseño permita otro origen explícito). Pasar `id_empresa` y `user_id` al servicio/repositorio.
- **Actualizar / eliminar (soft delete) item:** Validar según `scope_acceso`: si es EMPRESA, exigir X-Company-Id y que el registro pertenezca a esa empresa; si es GLOBAL, permitir operar sobre cualquier empresa (usando id_empresa del body o del header). Pasar `scope_acceso` al servicio/repositorio para aplicar reglas de pertenencia.
- **Almacenes, movimientos de inventario, envíos, recepciones, lotes/series:** Misma regla: leer headers en la capa de rutas; validar empresa y scope en servicio; en repositorio filtrar o validar por `id_empresa` y, cuando aplique, por `scope_acceso` (GLOBAL puede actuar sobre otra empresa).
- **Capas:** Aplicar la regla en **routes** (leer headers, devolver 400 si falta contexto cuando sea obligatorio), **services** (recibir id_empresa, user_id, scope_acceso y aplicar lógica de negocio y validaciones) y **repositories** (queries con filtro por id_empresa y, en update/delete, comprobar pertenencia salvo scope GLOBAL). Estructura: route → service → repository → db, como en TerceroPython.
- **Cuentas contables del item:** Si ItemPython gestiona relaciones item–cuenta contable (o cuenta_contable_producto), deben recibir id_empresa y validar que la cuenta y el item pertenezcan a la misma empresa.

---

# 6. Reglas para ItemNestJs

- **Queries de listado:** Todas las que devuelvan datos por empresa (productos, servicios, almacenes, stock por almacén, movimientos de inventario, envíos, recepciones, lotes/series) deben recibir **id_empresa** como argumento (obligatorio o opcional según diseño). Cuando **id_empresa** no se envíe (o sea null), no devolver “todo”; para usuario EMPRESA el Gateway o el front debe enviar siempre id_empresa; para GLOBAL, el front envía la empresa seleccionada. Opción más segura: si la query es por empresa, exigir id_empresa y devolver vacío o error si falta.
- **Detalle por ID:** La query que devuelve un item (o almacén, movimiento, etc.) por su UUID **debe** validar pertenencia a la empresa. Opciones: (1) Recibir `id_empresa` como argumento y filtrar en el resolver/service (solo devolver si el registro pertenece a esa empresa), o (2) Recibir contexto por header (X-Company-Id) si el Gateway lo reenvía, y validar que el registro tenga ese id_empresa. No repetir el error de Terceros: `tercero(id_tercero)` sin filtro permite ver datos de otra empresa.
- **Uso de variable GraphQL y headers:** Preferible usar **ambos**: variable `id_empresa` en las queries para listados y detalle, y headers de contexto (si el Gateway los reenvía) para que ItemNestJs pueda rechazar o filtrar cuando el header no coincida con la empresa del recurso. Así no se depende solo del frontend.
- **Catálogos:** Queries de catálogos (unidad de medida, tipo de item, etc.) que sean globales (sin id_empresa) no filtran por empresa; si un catálogo es por empresa, debe recibir id_empresa y filtrar.

---

# 7. Reglas para base de datos

- **Tablas que deben incluir id_empresa obligatoriamente (multiempresa):**
  - **item / producto** (o tabla unificada item con tipo PRODUCTO|SERVICIO): `id_empresa` NOT NULL, FK a empresa. UNIQUE(id_empresa, codigo).
  - **almacen:** `id_empresa` NOT NULL, FK a empresa.
  - **stock_item_almacen** (o equivalente): stock por item y almacén; puede tener id_empresa o heredar de almacén; si se denormaliza, id_empresa obligatorio para consultas seguras.
  - **movimiento_inventario:** `id_empresa` NOT NULL (ya existe en esquema actual), FK a empresa.
  - **item_lote_serie** (lotes/series): `id_empresa` NOT NULL o FK que garantice empresa vía item/almacén; recomendable id_empresa explícito para no mezclar trazabilidad entre empresas.
  - **cuenta_contable_item / cuenta_contable_producto:** `id_empresa` NOT NULL (ya existe en contabilidad_schema como cuenta_contable_producto).
  - **Envíos / recepciones:** Tablas de cabecera y detalle con `id_empresa` NOT NULL.
  - **Variantes/atributos:** Si son tablas propias, deben estar ligadas a item (que ya tiene id_empresa) o tener id_empresa explícito.
- **Catálogos globales:** Tablas que no son por empresa (ej. unidad_medida_catalogo, tipo_producto_catalogo si son compartidos) no llevan id_empresa. Debe documentarse cuáles son catálogos globales.
- **Nunca mezclar registros de varias empresas:** Todas las tablas operativas del dominio item deben permitir filtrar por id_empresa y no devolver filas de otras empresas en consultas sin ese filtro. Índices por id_empresa en tablas grandes para rendimiento.

---

# 8. Riesgos

- **Mezclar stock entre empresas:** Si stock o movimientos de inventario no filtran por id_empresa, se pueden sumar cantidades de varias empresas o aplicar movimientos a la empresa equivocada. Crítico.
- **Ver productos/almacenes de otra empresa:** Listados o detalle por ID sin filtro/validación de empresa permiten ver datos ajenos. Crítico.
- **Editar almacenes o items de otra empresa:** Escritura sin validación de scope e id_empresa puede permitir modificar o eliminar datos de otra empresa. Crítico.
- **Consultar movimientos de otra empresa:** Informes de inventario o trazabilidad incorrectos. Crítico.
- **Listar todo si no llega id_empresa:** Si las queries de ItemNestJs devuelven todos los registros cuando id_empresa es null, un cliente mal configurado o malintencionado podría ver todos los datos. Importante.
- **Confiar solo en el frontend:** Si el backend no valida empresa en detalle por ID y solo confía en que el front envíe id_empresa en listados, un atacante puede pedir recursos por ID y obtener datos de otra empresa. Crítico (ya detectado en Terceros).
- **Gateway sin reenviar headers:** Si las rutas de item en el Gateway usan un cliente genérico sin inyectar request ni headers de contexto, ItemPython no tendrá X-Company-Id/X-User-Id/X-Scope-Acceso. Crítico.

---

# 9. Comparación contra Terceros

| Aspecto | Terceros (referencia) | Item (cómo debe replicarse) |
|---------|------------------------|-----------------------------|
| **Frontend** | useJwtPayload, SelectEmpresa en listados y formulario; EMPRESA carga por id_empresa del JWT; GLOBAL muestra SelectEmpresa y carga al elegir. _apis_ con interceptores X-Company-Id, X-User-Id. | Igual: useJwtPayload y SelectEmpresa en todos los listados y formularios del módulo item. Cliente _apis_ para item con mismos interceptores. Nuevos selects en components/selects/ con SearchableSelect. |
| **Gateway** | Escritura vía terceroPython con ctxHeaders(req) y getUsuarioScope; reenvío X-Company-Id, X-User-Id, X-Scope-Acceso. | Escritura vía itemPython (o equivalente) con misma lógica: ctxHeaders + getUsuarioScope; reenviar los tres headers. GraphQL: reenviar headers a ItemNestJs. |
| **Flask (Python)** | tercero_routes lee _ctx_empresa_user(); create exige X-Company-Id; update/delete usan scope_acceso. route → service → repository. | item_routes (y rutas de almacén, movimientos, etc.) leen mismo patrón; create exige X-Company-Id; update/delete con scope_acceso. route → service → repository. |
| **NestJS** | terceros(id_empresa), clientes(id_empresa); tercero(id_tercero) sin filtro (error conocido). | items(id_empresa) o productos(id_empresa)/servicios(id_empresa); almacenes(id_empresa); etc. **item(id)** debe validar empresa (no repetir error de tercero(id)). |
| **Base de datos** | tercero con id_empresa NOT NULL, UNIQUE por empresa. | item/producto, almacen, movimiento_inventario, etc. con id_empresa NOT NULL y UNIQUE donde corresponda (ej. codigo por empresa). |

---

# 10. Plan recomendado para implementar luego

1. **Base de datos:** Confirmar o crear tablas del módulo item (item/producto, almacen, movimiento_inventario, stock_item_almacen, item_lote_serie, envíos, recepciones, cuenta_contable_item, variantes si aplica) con id_empresa NOT NULL y FKs; índices por id_empresa.
2. **ItemPython:** Estructura route → service → repository; función _ctx_empresa_user(); aplicar en todas las rutas de escritura (item, almacén, movimientos, lotes, etc.) y en services/repositories.
3. **ItemNestJs:** Queries con argumento id_empresa; detalle por ID con validación de empresa (variable o header); no devolver “todo” si id_empresa falta en listados por empresa.
4. **Gateway:** Crear servicio itemPython.js con ctxHeaders y getUsuarioScope; rutas REST de escritura que inyecten request y reenvíen X-Company-Id, X-User-Id, X-Scope-Acceso; en /graphql reenviar headers a ItemNestJs cuando la query sea del módulo item.
5. **Frontend:** views/item (o views/productos, views/almacenes, etc. bajo un módulo item); useJwtPayload y SelectEmpresa en listados y formularios; _apis_/item.js con interceptores de contexto; nuevos selects en components/selects/ usando SearchableSelect.
6. **Pruebas:** Usuario EMPRESA solo ve y edita datos de su empresa; usuario GLOBAL solo ve datos de la empresa seleccionada; detalle por ID no devuelve registros de otra empresa; listados sin id_empresa no devuelven todos los registros.

---

**Nota:** Esta auditoría no implementa ni modifica código. Solo define cómo debe aplicarse el patrón GLOBAL/EMPRESA en el módulo item de forma correcta, segura y consistente con el módulo Terceros.

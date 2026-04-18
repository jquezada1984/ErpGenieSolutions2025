# AUDITORÍA CONTROLADA – MANEJO DE USUARIO GLOBAL / EMPRESA EN EL ERP

**Alcance:** Análisis y diagnóstico del patrón GLOBAL/EMPRESA. Sin implementación ni cambios en código.  
**Referencia:** Módulo Terceros (scope_acceso, id_empresa, X-Company-Id, X-User-Id, X-Scope-Acceso).

---

# 1. Resumen ejecutivo

- **Manejo actual del usuario:**  
  - El JWT (InicioNestJs) incluye `id_empresa`, `scope_acceso`, `sub` (id_usuario).  
  - El patrón GLOBAL/EMPRESA está implementado de forma **completa solo en el módulo Terceros** (frontend + gateway + TerceroPython + TerceroNestJs con variable `id_empresa` en queries).  
  - En el resto de módulos (Empresas, Perfil, Sucursal, Menú, Media, Usuarios) no hay un patrón homogéneo: no se reenvían headers de contexto desde el Gateway o no se usan en backend.

- **Nivel de madurez del patrón GLOBAL/EMPRESA:**  
  **Parcial.** Referencia sólida en Terceros; en el resto es **ausente** o **inconsistente** (headers que se reenvían pero no se usan, o rutas que no reenvían).

- **Riesgo general:**  
  **Medio–alto.** Riesgo de listados sin filtrar por empresa si se usa REST GET `/api/tercero` o GraphQL `terceros` sin `id_empresa`; consulta de detalle de tercero por ID sin validación de empresa en NestJS; y varios módulos que ignoran empresa/contexto.

---

# 2. Hallazgos correctos

- **JWT (InicioNestJs):**  
  El payload incluye `sub`, `id_empresa`, `scope_acceso` (y otros). La query `usuario(id_usuario)` devuelve `id_empresa` y `scope_acceso` (entidad Usuario con esos campos).

- **Frontend – Módulo Terceros:**  
  - Hook **useJwtPayload()** existe (`frontReact/src/hooks/useJwtPayload.ts`), lee token de `localStorage` y devuelve el payload decodificado.  
  - Se usan **scope_acceso** e **id_empresa** en: Terceros, Clientes, Proveedores, ClientesPotenciales, SeccionTerceroComercialOrganizacion.  
  - **SelectEmpresa** existe y se usa en listados (Terceros, Clientes, Proveedores, ClientesPotenciales) y en el formulario de tercero (SeccionTerceroComercialOrganizacion).  
  - Usuario EMPRESA: se carga por `idEmpresaUsuario`; usuario GLOBAL: se muestra SelectEmpresa y se carga al elegir empresa.  
  - **_apis_/tercero.js** y **_apis_/contacto.js**: interceptor de request añade **X-Company-Id** y **X-User-Id** desde el token en las llamadas REST al Gateway.

- **Gateway – Terceros y Contactos:**  
  - Rutas de **escritura** de tercero (POST/PUT/DELETE) y **todas** las rutas de contacto usan **terceroPython** con **ctxHeaders(req)** (y en tercero también con **getUsuarioScope**). Se reenvían **X-Company-Id**, **X-User-Id**, **X-Scope-Acceso** al backend Python.  
  - **terceroPython.js**: lógica GLOBAL vs EMPRESA (GLOBAL permite `body.id_empresa` o header; EMPRESA fija empresa del usuario).  
  - **Media:** la ruta POST `/api/media/upload` reenvía **X-Company-Id** y **X-User-Id** (no X-Scope-Acceso).

- **Backend Python – Terceros:**  
  - **tercero_routes.py** define **_ctx_empresa_user()** y lee **X-Company-Id**, **X-User-Id**, **X-Scope-Acceso**.  
  - Crear exige X-Company-Id; actualizar/eliminar usan **scope_acceso** (GLOBAL puede operar sin id_empresa en header).  
  - Servicios y repositorios reciben **id_empresa** y **scope_acceso** y aplican filtros/reglas (ej. repo actualizar/eliminar con scope GLOBAL).

- **Backend NestJS – TerceroNestJs:**  
  - Queries **terceros(id_empresa)** y **clientes(id_empresa)** con argumento opcional; el servicio filtra por **id_empresa** cuando se recibe.  
  - **representantesPorEmpresa(id_empresa)** obligatorio.

- **Consistencia en Terceros:**  
  Flujo alineado: front (scope + id_empresa + SelectEmpresa) → Gateway (ctxHeaders/getUsuarioScope) → TerceroPython (headers + scope) y TerceroNestJs (variable `id_empresa` en query).

---

# 3. Hallazgos parciales

- **Frontend – Apollo (GraphQL):**  
  - **authLink** en `apollo-client.ts` solo añade **Authorization** (Bearer). **No** añade X-Company-Id ni X-User-Id.  
  - El filtrado por empresa en listados de terceros se hace **solo por variable GraphQL** `id_empresa` enviada por el cliente. Si el cliente no envía o envía `null`, TerceroNestJs devuelve todos (terceros/clientes). Dependencia total del front para no romper multiempresa.

- **Frontend – Usuarios y Empresas:**  
  - Usuarios (NuevoUsuario, EditarUsuario) usan **id_empresa** en formulario (selector de empresa) pero **no** useJwtPayload ni lógica GLOBAL/EMPRESA para el listado (Usuarios.tsx lista todos vía query `usuarios`).  
  - Empresas: listado global por diseño; no aplica filtro por empresa.

- **Gateway – GraphQL:**  
  - **graphql.js** reenvía a TerceroNestJs/InicioNestJs/MenuNestJs solo **Authorization** y body (query, variables). **No** reenvía X-Company-Id ni X-User-Id.  
  - Las variables (p. ej. `id_empresa`) van en el body; TerceroNestJs las recibe. El “contexto empresa” en lectura depende solo de que el front envíe la variable.

- **Gateway – terceroNestJs (servicio):**  
  - **ctxHeaders(req)** envía X-Company-Id y X-User-Id (y Authorization); **no** envía X-Scope-Acceso.  
  - **listarTerceros(req)** y **listarClientes(req)** usan queries **sin** variable `id_empresa` (query fija `terceros { ... }` / `clientes { ... }`), por lo que quien use GET `/api/tercero` o GET `/api/clientes` obtendría **todos** los registros. Las vistas de listado actuales usan Apollo con variables, no estos GET.

- **Gateway – Media:**  
  - Reenvía X-Company-Id y X-User-Id; **no** reenvía X-Scope-Acceso.

- **Backend Python – Contactos (TerceroPython):**  
  - El Gateway reenvía headers (vía terceroPython) a las rutas de contactos, pero **contacto_routes.py** **no** lee X-Company-Id ni X-User-Id ni scope. Los headers llegan pero no se usan para filtrar ni validar.

- **Backend NestJS – TerceroNestJs:**  
  - **tercero(id_tercero)** (detalle) **no** recibe ni filtra por **id_empresa**. Cualquier usuario que conozca un `id_tercero` podría pedir el detalle de un tercero de otra empresa.

- **Clientes potenciales:**  
  - No hay query **clientesPotenciales(id_empresa)** en TerceroNestJs. El front usa **terceros(id_empresa)** y filtra en cliente por `cliente_potencial === true`. Funcional pero sin query específica en backend.

---

# 4. Hallazgos faltantes

- **Frontend:**  
  - **Apollo:** no se envían X-Company-Id ni X-User-Id en las peticiones GraphQL (solo Authorization). No hay estándar único para “contexto empresa” en GraphQL.  
  - **_apis_/media.js:** no añade X-Company-Id ni X-User-Id en el upload (no hay interceptor de contexto).  
  - **_apis_/gateway.js, usuario.js, empresa.js, perfil.js, sucursal.js, menu.js:** no añaden X-Company-Id / X-User-Id en las llamadas (salvo donde ya se indicó en hallazgos correctos/parciales).  
  - Módulos **Empresas, Perfiles, Sucursales, Usuarios, Menús:** no aplican patrón GLOBAL/EMPRESA (useJwtPayload + SelectEmpresa donde corresponda) en listados o formularios.

- **Gateway:**  
  - **Rutas empresas, perfil, sucursal, menú:** usan **pythonService** (o nestjsService) **sin** inyectar `request` ni reenviar X-Company-Id, X-User-Id, X-Scope-Acceso al backend.  
  - **Ruta /graphql:** no reenvía headers de contexto (X-Company-Id, X-User-Id, X-Scope-Acceso) a los servicios NestJS.  
  - **terceroNestJs.listarTerceros / listarClientes:** no aceptan ni pasan `id_empresa` como variable a la query GraphQL (si se usaran estos endpoints REST, no habría filtro por empresa).

- **Backend Python:**  
  - **InicioPython** (empresa, perfil, sucursal, menú): no se ha verificado uso de headers de contexto en las rutas revisadas; en menú ya se documentó que no se reenvían.  
  - **TerceroPython – contactos:** no existe lectura ni uso de X-Company-Id / X-User-Id / scope en rutas ni servicios.

- **Backend NestJS:**  
  - **TerceroNestJs:** no hay validación de “pertenencia a empresa” en la query **tercero(id_tercero)** (no se comprueba id_empresa del tercero frente al usuario).  
  - No hay query **clientesPotenciales(id_empresa)** (opcional; hoy se resuelve en front con filtro sobre terceros).

---

# 5. Comparación por capa

**Frontend**

- **Correcto:** useJwtPayload existe; en Terceros (y secciones) se usan scope_acceso e id_empresa; SelectEmpresa en listados y formulario comercial; tercero.js y contacto.js envían X-Company-Id y X-User-Id en REST.  
- **Parcial:** Apollo no envía headers de contexto; filtrado por empresa en GraphQL depende solo de variables enviadas por el cliente; Usuarios usa id_empresa en formularios pero no patrón GLOBAL/EMPRESA en listado.  
- **Faltante:** Apollo sin X-Company-Id/X-User-Id; media.js sin headers de contexto; resto de _apis_ sin estándar de headers; módulos Empresas, Perfiles, Sucursales, Menús, Usuarios sin patrón GLOBAL/EMPRESA.

**Gateway**

- **Correcto:** Terceros (escritura) y Contactos usan terceroPython con ctxHeaders/getUsuarioScope; Media reenvía X-Company-Id y X-User-Id.  
- **Parcial:** terceroNestJs reenvía X-Company-Id y X-User-Id pero no X-Scope-Acceso; listarTerceros/listarClientes no pasan id_empresa a la query.  
- **Faltante:** Empresas, Perfil, Sucursal, Menú no reenvían headers; /graphql no reenvía headers de contexto.

**Flask (Python)**

- **Correcto:** TerceroPython (tercero_routes) lee y usa X-Company-Id, X-User-Id, X-Scope-Acceso en crear/actualizar/eliminar; servicios/repositorios usan id_empresa y scope_acceso.  
- **Parcial:** Contactos: Gateway reenvía headers pero TerceroPython no los usa.  
- **Faltante:** Uso explícito de headers de contexto en contactos; no verificado en InicioPython para otras rutas.

**NestJS**

- **Correcto:** TerceroNestJs terceros(id_empresa) y clientes(id_empresa) filtran; InicioNestJs JWT y entidad Usuario con id_empresa y scope_acceso; query usuario(id_usuario) para getUsuarioScope.  
- **Parcial:** Filtrado por empresa depende de la variable enviada por el cliente (GraphQL); si no se envía id_empresa, se devuelven todos.  
- **Faltante:** tercero(id_tercero) sin filtro/validación por id_empresa; ningún uso de headers de contexto en resolvers (solo argumentos/variables).

---

# 6. Matriz de cumplimiento

| Componente | Cumple | Parcial | No cumple | Observaciones |
|------------|--------|---------|-----------|----------------|
| JWT (InicioNestJs) | ✓ | | | Payload con id_empresa, scope_acceso. |
| useJwtPayload (front) | ✓ | | | Solo en módulo Terceros (y secciones). |
| SelectEmpresa (front) | ✓ | | | Solo en Terceros (listados + formulario comercial). |
| Front – Apollo headers | | | ✓ | No envía X-Company-Id / X-User-Id. |
| Front – tercero/contacto REST | ✓ | | | Interceptores con X-Company-Id, X-User-Id. |
| Front – media / otros _apis_ | | | ✓ | media sin headers; otros sin patrón. |
| Front – GLOBAL/EMPRESA otros módulos | | | ✓ | Empresas, Perfiles, Sucursales, Usuarios, Menús. |
| Gateway – Terceros/Contactos | ✓ | | | ctxHeaders/getUsuarioScope; reenvío correcto. |
| Gateway – Media | ✓ | | | Reenvía X-Company-Id, X-User-Id (sin X-Scope-Acceso). |
| Gateway – Menú, Empresas, Perfil, Sucursal | | | ✓ | No reenvían headers. |
| Gateway – /graphql | | | ✓ | No reenvía X-Company-Id, X-User-Id, X-Scope-Acceso. |
| Gateway – listarTerceros/listarClientes | | ✓ | | Reenvían headers pero query sin id_empresa. |
| TerceroPython – tercero | ✓ | | | Headers y scope en rutas y capas inferiores. |
| TerceroPython – contactos | | ✓ | | Headers reenviados pero no usados. |
| TerceroNestJs – terceros/clientes | ✓ | ✓ | | Filtran si reciben id_empresa; sin variable = todos. |
| TerceroNestJs – tercero(id) | | | ✓ | Sin filtro por empresa. |
| InicioNestJs – usuario / JWT | ✓ | | | id_empresa y scope_acceso disponibles. |

---

# 7. Riesgos

**Críticos**

- **Listados sin filtrar por empresa:** Si algo o alguien llama `terceros` / `clientes` por GraphQL **sin** variable `id_empresa` (o con `null`), TerceroNestJs devuelve **todos** los terceros/clientes. El control depende solo del front.  
- **GET REST /api/tercero y /api/clientes:** Las implementaciones actuales de listarTerceros/listarClientes en el Gateway no pasan `id_empresa` a la query; si se usan estos endpoints se obtienen todos los registros.  
- **Detalle de tercero sin validación de empresa:** **tercero(id_tercero)** no filtra por id_empresa; un usuario de una empresa podría ver/modificar un tercero de otra si conoce el UUID.

**Importantes**

- **Apollo sin headers de contexto:** Cualquier query/mutation que en el futuro deba filtrar por empresa en el backend no puede apoyarse en headers si solo se usa Apollo contra /graphql.  
- **Contactos (TerceroPython):** Headers reenviados pero no usados; no hay validación ni filtro por empresa en contactos.  
- **Módulos sin patrón GLOBAL/EMPRESA:** Empresas, Perfil, Sucursal, Menú, Usuarios no reenvían o no usan contexto; si se exige multiempresa después, habrá que rehacer flujos.

**Deseables**

- **Media upload sin headers en front:** _apis_/media.js no envía X-Company-Id/X-User-Id; el Gateway sí los reenvía si llegaran.  
- **terceroNestJs sin X-Scope-Acceso:** El servicio en Gateway no envía X-Scope-Acceso (sí lo envía terceroPython para escritura).  
- **Clientes potenciales:** Sin query dedicada en backend (solo filtro en front); menor impacto.

---

# 8. Plan recomendado

Orden sugerido para unificar el manejo GLOBAL/EMPRESA en todo el ERP (solo plan; sin implementación aquí):

1. **Backend NestJS – TerceroNestJs**  
   - Hacer que **tercero(id_tercero)** reciba opcionalmente contexto de empresa (variable o header) y/o validar que el tercero pertenezca a la empresa del usuario cuando el alcance sea EMPRESA.  
   - Opcional: añadir query **clientesPotenciales(id_empresa)** y usarla en front para no filtrar en cliente.

2. **Gateway – GraphQL**  
   - Reenviar X-Company-Id, X-User-Id y (si aplica) X-Scope-Acceso a los servicios NestJS en las llamadas a /graphql, tomándolos del request entrante (o de un middleware que los inyecte desde JWT/headers).  
   - Documentar que los resolvers que deban filtrar por empresa pueden usar esos headers además de variables.

3. **Gateway – Rutas REST**  
   - En **listarTerceros/listarClientes**, aceptar `id_empresa` (query param o header) y pasarlo como variable a la query GraphQL para que los listados REST también respeten empresa.  
   - Extender el patrón “inyección de request + ctxHeaders” a rutas de **Empresas, Perfil, Sucursal, Menú** (y otras que manejen datos por empresa), reenviando X-Company-Id, X-User-Id, X-Scope-Acceso cuando el backend lo soporte.

4. **Frontend – Apollo**  
   - En el link de contexto (setContext o similar), añadir X-Company-Id y X-User-Id (y si se define, X-Scope-Acceso) desde useJwtPayload o desde token decodificado, para todas las peticiones GraphQL que pasen por el Gateway.  
   - Mantener el envío de variable `id_empresa` en queries donde ya exista, como capa adicional.

5. **Frontend – Otros módulos**  
   - En **Usuarios, Perfiles, Sucursales** (y otros que deban ser multiempresa), introducir useJwtPayload, SelectEmpresa donde corresponda y cargar listados filtrados por id_empresa según scope (GLOBAL vs EMPRESA).  
   - **_apis_/media.js:** Añadir interceptor que envíe X-Company-Id y X-User-Id en el upload.  
   - **_apis_/gateway.js, empresa, usuario, perfil, sucursal, menu:** Si esas rutas pasan a depender de empresa/usuario, añadir los mismos headers de contexto de forma uniforme.

6. **Backend Python**  
   - **TerceroPython – contactos:** Leer X-Company-Id (y si aplica X-User-Id / scope) y usarlos para validar que el tercero del contacto pertenezca a la empresa del usuario (y, si se define, para auditoría).  
   - **InicioPython:** Revisar rutas de empresa, perfil, sucursal, menú; donde corresponda, leer headers de contexto y aplicar filtros o reglas por id_empresa/scope.

7. **Estandarización y pruebas**  
   - Documentar en un único lugar el flujo GLOBAL/EMPRESA (headers, variables GraphQL, comportamiento por módulo).  
   - Pruebas: usuario EMPRESA solo ve datos de su empresa; usuario GLOBAL con SelectEmpresa ve solo la empresa elegida; tercero(id) no devuelve terceros de otra empresa para usuario EMPRESA.

---

**Nota:** Esta auditoría es solo análisis y diagnóstico. No se ha implementado ni modificado ningún archivo de código, tal como se solicitó en el encargo original.

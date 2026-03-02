# Informe de uso de catálogos en el proyecto ErpGenieSolutions2025

Análisis por catálogo: módulos, entidades TypeORM, modelos SQLAlchemy, resolvers GraphQL, endpoints REST, servicios, formularios frontend, uso fuera de terceros, duplicación y dependencias cruzadas.

---

## CATÁLOGO: empresa

### Usado en

**Módulos:**
- **InicioNestJs**: entidad principal Empresa, resolvers, servicios (lectura GraphQL). Módulo de inicio/empresas.
- **InicioPython**: modelo Empresa en `models/empresa.py`, rutas REST en `api/empresa_routes.py` (CRUD empresa). Módulo inicio.
- **TerceroNestJs**: entidad Empresa en `modules/empresa/entities/empresa.entity.ts` (solo para FK de Tercero). Catálogo en `CatalogosModule` para query `empresas`. Módulo terceros.
- **TerceroPython**: stub en `models/catalogos.py` (solo `id_empresa` para FK). Repositorio/servicios de tercero reciben `id_empresa` en payload. Módulo terceros.
- **gateway-api**: rutas `/api/empresas` (GET/POST/PUT/DELETE), servicio NestJS para GET y Python para escritura. Módulo gateway.
- **frontReact**: vistas empresas (lista, nueva, editar), sucursales (selector empresa), usuarios (selector empresa), terceros (selector empresa en clientes potenciales). Módulos inicio, sucursales, usuarios, terceros.

**Entidades TypeORM (como FK o entidad):**
- **InicioNestJs**: `Empresa` (entidad principal); `Pais`, `EmpresaHorarioApertura`, `EmpresaIdentificacion`, `EmpresaRedSocial`, `Perfil`, `Sucursal`, `Usuario` tienen `id_empresa` + `@ManyToOne(() => Empresa)`.
- **TerceroNestJs**: `Empresa` en `modules/empresa/entities/empresa.entity.ts`; `Tercero` (en `modules/tercero` y `modules/empresa`) tiene `id_empresa` + `@ManyToOne(() => Empresa)`.

**Modelos SQLAlchemy:**
- **InicioPython**: `Empresa` en `models/empresa.py` (tabla `empresa`, modelo completo).
- **TerceroPython**: `Empresa` stub en `models/catalogos.py` (solo `id_empresa` PK para FK). No hay modelo completo de Empresa en TerceroPython.

**Resolvers GraphQL:**
- **InicioNestJs**: `EmpresaResolver` – queries `empresas`, `empresa(id_empresa)`; resolve field `identificacion` en Empresa.
- **TerceroNestJs**: `CatalogosResolver` – query `empresas` (lista para selects).

**Endpoints REST:**
- **gateway-api** (prefijo `/api`): `GET /empresas`, `GET /empresas/:id`, `POST /empresas`, `PUT /empresas/:id`, `DELETE /empresas/:id`.
- **InicioPython**: `GET/POST /empresa`, `GET/PUT/DELETE /empresa/<id_empresa>` (expuestos vía gateway o directamente según despliegue).

**Servicios:**
- **gateway-api**: `nestjsService.getEmpresas()`, `nestjsService.getEmpresa(id)`, `pythonService.createEmpresa()`, `updateEmpresa()`, `deleteEmpresa()`.
- **TerceroNestJs**: uso implícito vía repositorio de Empresa en `CatalogosResolver` (query empresas).
- **TerceroPython**: `tercero_repository` usa `id_empresa` en create/update/delete y en `exists_codigo_cliente(id_empresa, ...)`.
- **InicioPython**: perfiles por empresa en `perfil_routes` y `perfil_service`.

**Frontend (formularios / vistas):**
- `frontReact/src/views/empresas/` (lista, nueva, editar, secciones SeccionEmpresa, SeccionContable).
- `frontReact/src/views/sucursales/NuevaSucursal.tsx` – selector empresa (GET_EMPRESAS GraphQL).
- `frontReact/src/views/usuarios/EditarUsuario.tsx` – selector empresa (GET_EMPRESAS).
- `frontReact/src/views/terceros/NuevoClientePotencial.tsx` – campo `id_empresa` (obligatorio).
- `frontReact/src/views/terceros/ClientesPotenciales.tsx` – columna empresa en tabla.
- Sidebar: menú Empresa (Lista, Crear) bajo inicio.

### Observaciones

- **Uso fuera de terceros**: Sí. Módulos **inicio** (empresa, perfiles, sucursales, usuarios) y **sucursales** y **usuarios** dependen de empresa.
- **Duplicación de modelos**:  
  - TypeORM: Empresa definida en InicioNestJs y en TerceroNestJs (esta última para FK y query de catálogo; posible duplicación conceptual).  
  - SQLAlchemy: modelo completo solo en InicioPython; TerceroPython tiene solo stub para FK.
- **Dependencias cruzadas**: TerceroNestJs importa entidad Empresa para Tercero y para el catálogo; el gateway alterna NestJS (lectura) y Python (escritura) para empresas. Frontend usa GraphQL (InicioNestJS) para listar empresas en sucursales y usuarios, y en terceros (clientes potenciales) también empresa.

---

## CATÁLOGO: pais

### Usado en

**Módulos:**
- **InicioNestJs**: entidad Pais, PaisResolver, PaisService; Empresa y Provincia referencian pais. Módulo inicio.
- **InicioPython**: modelo `Pais` en `models/empresa.py`; rutas en `api/entidad_routes.py` (GET/POST `/pais`, GET `/pais/<id>`). Módulo inicio.
- **TerceroNestJs**: entidad Pais en `modules/catalogos/entities/pais.entity.ts`; Tercero y Contacto con FK id_pais. Módulo terceros.
- **TerceroPython**: stub `Pais` en `models/catalogos.py`; modelo `Tercero` y `Contacto` con FK a `pais.id_pais`. Módulo terceros.
- **gateway-api**: `GET /api/tercero/selects/paises` (NestJS GraphQL). No expone rutas InicioPython de país.
- **frontReact**: formularios de empresa (SeccionEmpresa, CountrySelect), terceros (Nuevo/Editar Cliente, Proveedor, Tercero, ClientePotencial), contactos (Nuevo/Editar, SeccionContactoDireccion). Módulos inicio y terceros.

**Entidades TypeORM (como FK o entidad):**
- **InicioNestJs**: `Pais` en `entities/pais.entity.ts`; `Empresa` (`id_pais`), `Provincia` (`id_pais`) con `@ManyToOne(() => Pais)`.
- **TerceroNestJs**: `Pais` en `modules/catalogos/entities/pais.entity.ts`; `Tercero` y `Contacto` con `id_pais` y `@ManyToOne(() => Pais)`.

**Modelos SQLAlchemy:**
- **InicioPython**: `Pais` en `models/empresa.py` (tabla `pais`, modelo completo con nombre, codigo_iso, icono).
- **TerceroPython**: `Pais` stub en `models/catalogos.py` (solo `id_pais` PK); `tercero.py` y `contacto.py` con FK a `pais.id_pais`.

**Resolvers GraphQL:**
- **InicioNestJs**: `PaisResolver` – query `paises`.
- **TerceroNestJs**: `CatalogosResolver` – query `paises` (findAllPaises).
- **InicioNestJs**: `EmpresaResolver` hace leftJoinAndSelect de `empresa.pais`; `ProvinciaResolver` – provinciasByPais(idPais).

**Endpoints REST:**
- **gateway-api**: `GET /api/tercero/selects/paises` (delega a TerceroNestJs GraphQL).
- **InicioPython**: `GET /pais`, `GET /pais/<id_pais>`, `POST /pais` en `entidad_routes.py` (no aparecen bajo `/api` en gateway actual).

**Servicios:**
- **InicioNestJs**: `PaisService` (findAll, findOne).
- **gateway-api**: `terceroNestJs.listarPaises(req)` para el select de países.
- **TerceroPython**: `tercero_repository` y `contacto_repository` asignan `id_pais`; `tercero_service` incluye `id_pais` en campos permitidos.

**Frontend (formularios / vistas):**
- `SeccionEmpresa.tsx` (empresas): GET_PAISES GraphQL (InicioNestJS), CountrySelect, provincias por país.
- `NuevaEmpresa.tsx`, `EditarEmpresa.tsx`: id_pais.
- Terceros: `NuevoCliente`, `NuevoProveedor`, `NuevoTercero`, `NuevoClientePotencial`, `EditarCliente`, `EditarProveedor`, `EditarTercero`, `EditarClientePotencial`: campo id_pais (vía `listarPaises()` desde gateway).
- Contactos: `NuevoContacto`, `EditarContacto`, `SeccionContactoDireccion.tsx`: id_pais y CountrySelect.
- API frontend: `_apis_/tercero.js` – `listarPaises()` → GET `/api/tercero/selects/paises`.

### Observaciones

- **Uso fuera de terceros**: Sí. Módulo **inicio** (empresa, provincias) y **terceros** (tercero, contacto).
- **Duplicación de modelos**:  
  - TypeORM: Pais definido en InicioNestJs y en TerceroNestJs (dos entidades, misma tabla `pais`).  
  - SQLAlchemy: Pais completo en InicioPython; TerceroPython tiene stub en catalogos.py. InicioPython y TerceroPython comparten lógicamente la misma tabla pero en proyectos distintos.
- **Dependencias cruzadas**: Frontend empresas usa paises de InicioNestJS (GraphQL); frontend terceros/contactos usa paises vía gateway → TerceroNestJs. No hay un único origen de verdad expuesto por el gateway para “pais” (inicio tiene REST, terceros tiene solo select vía NestJS).

---

## CATÁLOGO: forma_pago_catalogo

### Usado en

**Módulos:**
- **TerceroNestJs**: entidad FormaPago (`@Entity('forma_pago_catalogo')`), CatalogosResolver (query formasPago). Módulo terceros.
- **TerceroPython**: modelo stub `FormaPagoCatalogo` en `models/catalogos.py`; modelo `Tercero` con FK `id_forma_pago` a `forma_pago_catalogo`. Módulo terceros.
- **gateway-api**: `GET /api/tercero/selects/forma-pago` (NestJS GraphQL).
- **frontReact**: formularios de terceros que incluyen sección comercial (forma de pago). Módulo terceros.
- **contabilidad_schema.sql**: definición de tabla `forma_pago_catalogo` (id_forma_pago, descripcion).

**Entidades TypeORM (como FK o entidad):**
- **TerceroNestJs**: `FormaPago` en `modules/catalogos/entities/forma-pago.entity.ts` (tabla `forma_pago_catalogo`); `Tercero` en `modules/tercero` y `modules/empresa` con `id_forma_pago` y `@ManyToOne(() => FormaPago)`.

**Modelos SQLAlchemy:**
- **TerceroPython**: `FormaPagoCatalogo` en `models/catalogos.py` (stub: tabla `forma_pago_catalogo`, PK `id_forma_pago`); `Tercero` en `models/tercero.py` con `db.ForeignKey('forma_pago_catalogo.id_forma_pago')`.

**Resolvers GraphQL:**
- **TerceroNestJs**: `CatalogosResolver` – query `formasPago`.

**Endpoints REST:**
- **gateway-api**: `GET /api/tercero/selects/forma-pago` (terceroNestJs.listarFormasPago).

**Servicios:**
- **gateway-api**: `terceroNestJs.listarFormasPago(req)`.
- **TerceroPython**: `tercero_repository` (id_forma_pago en create/update), `tercero_service` (id_forma_pago en campos permitidos).

**Frontend (formularios / vistas):**
- `SeccionTerceroComercialOrganizacion.tsx`: select id_forma_pago (formasPago desde GraphQL/select).
- `NuevoCliente`, `NuevoProveedor`, `NuevoTercero`, `NuevoClientePotencial`: estado inicial id_forma_pago.
- `EditarCliente`, `EditarProveedor`, `EditarTercero`, `EditarClientePotencial`: id_forma_pago en form y en query de tercero.
- `NuevoTerceroSchema.ts`: id_forma_pago en validación.
- `_apis_/tercero.js`: no hay función dedicada; el select de formas de pago se carga desde la sección que usa el endpoint de catálogo (vía gateway).

### Observaciones

- **Uso fuera de terceros**: No. Solo módulo **terceros** (backend y frontend).
- **Duplicación de modelos**:  
  - TypeORM: existe carpeta `TerceroNestJs/src/catalogos/entities/forma-pago.entity.ts` y `TerceroNestJs/src/modules/catalogos/entities/forma-pago.entity.ts`. El `AppModule` y los entities de Tercero importan desde `modules/catalogos`; la carpeta `src/catalogos` parece duplicado no referenciado.  
  - SQLAlchemy: un solo modelo (stub) en TerceroPython.
- **Dependencias cruzadas**: Ninguna con otros módulos; solo terceros.

---

## CATÁLOGO: condicion_pago_catalogo

### Usado en

**Módulos:**
- **TerceroNestJs**: entidad CondicionPago (`@Entity('condicion_pago_catalogo')`), CatalogosResolver (query condicionesPago). Módulo terceros.
- **TerceroPython**: modelo stub `CondicionPagoCatalogo` en `models/catalogos.py`; modelo `Tercero` con FK `id_condicion_pago`. Módulo terceros.
- **gateway-api**: `GET /api/tercero/selects/condicion-pago` (NestJS GraphQL).
- **frontReact**: formularios terceros, sección comercial. Módulo terceros.
- **contabilidad_schema.sql**: tabla `condicion_pago_catalogo` (id_condicion_pago, descripcion).

**Entidades TypeORM (como FK o entidad):**
- **TerceroNestJs**: `CondicionPago` en `modules/catalogos/entities/condicion-pago.entity.ts`; `Tercero` (tercero y empresa) con `id_condicion_pago` y `@ManyToOne(() => CondicionPago)`.

**Modelos SQLAlchemy:**
- **TerceroPython**: `CondicionPagoCatalogo` en `models/catalogos.py` (stub); `Tercero` con FK a `condicion_pago_catalogo.id_condicion_pago`.

**Resolvers GraphQL:**
- **TerceroNestJs**: `CatalogosResolver` – query `condicionesPago`.

**Endpoints REST:**
- **gateway-api**: `GET /api/tercero/selects/condicion-pago` (terceroNestJs.listarCondicionesPago).

**Servicios:**
- **gateway-api**: `terceroNestJs.listarCondicionesPago(req)`.
- **TerceroPython**: `tercero_repository`, `tercero_service` (id_condicion_pago en create/update y en campos permitidos).

**Frontend (formularios / vistas):**
- `SeccionTerceroComercialOrganizacion.tsx`: select id_condicion_pago (condicionesPago).
- Nuevo/Editar Cliente, Proveedor, Tercero, ClientePotencial: id_condicion_pago en estado y formulario.
- `NuevoTerceroSchema.ts`: id_condicion_pago en validación.

### Observaciones

- **Uso fuera de terceros**: No. Solo módulo **terceros**.
- **Duplicación de modelos**:  
  - TypeORM: igual que forma_pago: existe `src/catalogos/entities/condicion-pago.entity.ts` y `src/modules/catalogos/entities/condicion-pago.entity.ts`; en uso está solo `modules/catalogos`.  
  - SQLAlchemy: un solo stub en TerceroPython.
- **Dependencias cruzadas**: Ninguna fuera de terceros.

---

## CATÁLOGO: tipo_tercero_catalogo

### Usado en

**Módulos:**
- **TerceroNestJs**: entidad TipoTercero (`@Entity('tipo_tercero_catalogo')`), CatalogosResolver (query tiposTercero), TerceroService con relations tipo_tercero. Módulo terceros.
- **TerceroPython**: modelo stub `TipoTerceroCatalogo` en `models/catalogos.py`; modelo `Tercero` con FK `id_tipo_tercero`. Módulo terceros.
- **gateway-api**: `GET /api/tercero/selects/tipo-tercero` (NestJS GraphQL).
- **frontReact**: listados y formularios de terceros (tipo de tercero). Módulo terceros.

**Entidades TypeORM (como FK o entidad):**
- **TerceroNestJs**: `TipoTercero` en `modules/catalogos/entities/tipo-tercero.entity.ts`; `Tercero` (tercero y empresa) con `id_tipo_tercero` y `@ManyToOne(() => TipoTercero)`.

**Modelos SQLAlchemy:**
- **TerceroPython**: `TipoTerceroCatalogo` en `models/catalogos.py` (stub); `Tercero` con FK a `tipo_tercero_catalogo.id_tipo_tercero`.

**Resolvers GraphQL:**
- **TerceroNestJs**: `CatalogosResolver` – query `tiposTercero`; en queries de terceros se pide `tipo_tercero { id_tipo_tercero nombre }`.

**Endpoints REST:**
- **gateway-api**: `GET /api/tercero/selects/tipo-tercero` (terceroNestJs.listarTiposTercero).

**Servicios:**
- **gateway-api**: `terceroNestJs.listarTiposTercero(req)`.
- **TerceroNestJs**: `TerceroService` con `relations: ['empresa', 'tipo_tercero']`.
- **TerceroPython**: `tercero_repository`, `tercero_service` (id_tipo_tercero en create/update y en campos permitidos).

**Frontend (formularios / vistas):**
- `SeccionTerceroGeneral.tsx`: select id_tipo_tercero (tiposTercero).
- `NuevoCliente`, `NuevoProveedor`, `NuevoTercero`, `NuevoClientePotencial`: id_tipo_tercero y select.
- `EditarCliente`, `EditarProveedor`, `EditarTercero`, `EditarClientePotencial`: id_tipo_tercero y tipo_tercero en query.
- Listas: `Clientes.tsx`, `Proveedores.tsx`, `Terceros.tsx`, `ClientesPotenciales.tsx`: columna tipo (tipo_tercero.nombre).
- `NuevoTerceroSchema.ts`: id_tipo_tercero en validación.
- `_apis_/tercero.js`: `listarTiposTercero()` → GET `/api/tercero/selects/tipo-tercero`.

### Observaciones

- **Uso fuera de terceros**: No. Solo módulo **terceros**.
- **Duplicación de modelos**:  
  - TypeORM: misma situación que forma_pago/condicion_pago: entidad en `src/catalogos/entities/tipo-tercero.entity.ts` y en `src/modules/catalogos/entities/tipo-tercero.entity.ts`; en uso solo `modules/catalogos`.  
  - SQLAlchemy: un solo stub en TerceroPython.
- **Dependencias cruzadas**: Ninguna fuera de terceros.

---

## CATÁLOGO: tipo_entidad_comercial

### Usado en

**Módulos:**
- **InicioNestJs**: entidad `TipoEntidadComercial` en `entities/tipo-entidad-comercial.entity.ts`; `EmpresaIdentificacion` con `id_tipo_entidad` y relación tipo_entidad. Módulo inicio.
- **InicioPython**: modelo `TipoEntidadComercial` en `models/empresa.py` (tabla `tipo_entidad_comercial`); rutas en `api/entidad_routes.py` (GET/POST `/tipo-entidad`, GET `/tipo-entidad/<id>`). Módulo inicio.
- **TerceroNestJs**: campo `tipo_entidad_comercial` (string) en entidad Tercero y en DTOs/interfaces; no es FK a tabla tipo_entidad_comercial. Módulo terceros.
- **TerceroPython**: columna `tipo_entidad_comercial = db.Column(db.String(50))` en `Tercero` (texto libre, no FK). Módulo terceros.
- **frontReact**: en **empresas** (SeccionContable) se usa `id_tipo_entidad` con opciones hardcodeadas (Sociedad Anónima, Limitada, etc.); en **terceros** se usa `tipo_entidad_comercial` como select con opciones fijas "Natural" y "Jurídica". Módulos inicio y terceros.
- **contabilidad_schema.sql**: referencia FK a `tipo_entidad_comercial(id_tipo_entidad)`.

**Entidades TypeORM (como FK o entidad):**
- **InicioNestJs**: `TipoEntidadComercial` en `entities/tipo-entidad-comercial.entity.ts`; `EmpresaIdentificacion` con `id_tipo_entidad` y `@ManyToOne(() => TipoEntidadComercial)`.

**Modelos SQLAlchemy:**
- **InicioPython**: `TipoEntidadComercial` en `models/empresa.py` (tabla `tipo_entidad_comercial`, id_tipo_entidad Integer PK, nombre, descripcion); `EmpresaIdentificacion` con FK `id_tipo_entidad` a `tipo_entidad_comercial`.
- **TerceroPython**: en `tercero.py` solo columna string `tipo_entidad_comercial` (sin FK).

**Resolvers GraphQL:**
- **InicioNestJs**: TipoEntidadComercial está en el schema (tipo EmpresaIdentificacion.tipo_entidad); no hay resolver dedicado de listado de tipos; empresa.resolver expone identificacion con id_tipo_entidad.
- **TerceroNestJs**: Tercero tiene campo `tipo_entidad_comercial: String` en schema; no hay query de catálogo de tipo_entidad_comercial.

**Endpoints REST:**
- **InicioPython**: `GET /tipo-entidad`, `GET /tipo-entidad/<id_tipo_entidad>`, `POST /tipo-entidad` en `entidad_routes.py` (no se ve expuesto en gateway en el análisis).
- **gateway-api**: no hay ruta específica para listar tipo_entidad_comercial en el código revisado.

**Servicios:**
- **InicioPython**: rutas entidad usan TipoEntidadComercial.query.
- **TerceroPython**: `tercero_repository` y schemas incluyen `tipo_entidad_comercial` (string).
- **InicioNestJs**: uso vía EmpresaIdentificacion en empresa.resolver.

**Frontend (formularios / vistas):**
- **Empresas**: `SeccionContable.tsx` – select `id_tipo_entidad` con lista fija (Sociedad Anónima, Limitada, Autónomo, etc.); no llama a API de tipo_entidad.
- **Terceros**: `NuevoCliente`, `NuevoProveedor`, `NuevoClientePotencial`, `SeccionTerceroGeneral.tsx`, `EditarCliente`, `EditarProveedor`, `EditarClientePotencial`, `EditarTercero` – campo `tipo_entidad_comercial` con select fijo "Natural" / "Jurídica" (string), no vinculado al catálogo tipo_entidad_comercial de inicio.

### Observaciones

- **Uso fuera de terceros**: Sí. En **inicio** (empresa/identificación) como catálogo real (FK id_tipo_entidad); en **terceros** como texto/valor libre (Natural/Jurídica) sin FK al catálogo.
- **Duplicación / inconsistencia**:  
  - En **inicio**: tipo_entidad_comercial es catálogo (tabla con id_tipo_entidad Integer, usado en EmpresaIdentificacion).  
  - En **terceros**: tipo_entidad_comercial es un string en Tercero (no FK); el frontend usa valores fijos distintos al catálogo de inicio. Hay dos conceptos con el mismo nombre: uno catálogo (inicio) y uno texto libre (terceros).
- **Dependencias cruzadas**: Ninguna entre backend de inicio y terceros para este campo; el gateway no unifica el catálogo tipo_entidad_comercial para el frontend.

---

## Resumen transversal

| Catálogo                 | Módulos (además de terceros) | Duplicación modelos                          | Dependencias cruzadas |
|--------------------------|------------------------------|----------------------------------------------|------------------------|
| empresa                  | Inicio, Sucursales, Usuarios | TypeORM en Inicio y Tercero; Python stub en Tercero | Gateway NestJS+Python; frontend varios orígenes |
| pais                     | Inicio (empresa, provincia)  | TypeORM Inicio + Tercero; Python completo vs stub | Dos orígenes paises (Inicio vs Tercero vía gateway) |
| forma_pago_catalogo      | No                           | TypeORM: dos carpetas catalogos en TerceroNestJs   | No                    |
| condicion_pago_catalogo  | No                           | TypeORM: dos carpetas catalogos en TerceroNestJs   | No                    |
| tipo_tercero_catalogo    | No                           | TypeORM: dos carpetas catalogos en TerceroNestJs   | No                    |
| tipo_entidad_comercial   | Inicio (empresa identificación) | Terceros usa string, no FK al catálogo de inicio   | No; concepto distinto en terceros |

**Duplicación de entidades TypeORM en TerceroNestJs:**  
Existe la carpeta `TerceroNestJs/src/catalogos/` con entidades (tipo-tercero, condicion-pago, forma-pago, pais, incoterm) y la carpeta `TerceroNestJs/src/modules/catalogos/` con las mismas entidades. El `AppModule` y las entidades de Tercero y Empresa importan desde `modules/catalogos`. La carpeta `src/catalogos` parece código duplicado o legado no referenciado.

---

*Informe generado sin modificar código ni proponer cambios. Solo análisis de uso.*

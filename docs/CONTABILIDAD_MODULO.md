# Módulo de Contabilidad

Documentación del módulo de Contabilidad en el ERP: backend Python, backend NestJS y parte frontend.

---

## 1. ContabilidadPython

### Ubicación
`ContabilidadPython/`

### Qué es
Microservicio **Flask** que por ahora solo expone un endpoint de salud. No tiene rutas de negocio ni acceso a base de datos para contabilidad.

### Estructura actual
- **`app.py`**: Crea la app Flask, configura CORS y JWT (clave compartida con el resto del backend), y registra una única ruta:
  - `GET /health` → `{ "status": "ok", "service": "contabilidad-python" }`
- **`requirements.txt`**: Flask, Flask-CORS, Flask-JWT-Extended, etc. (incluye dependencias para ampliar el servicio más adelante).
- **Puerto**: Por defecto **5002** (variable de entorno `PORT`).

### Uso
Sirve como **contenedor del futuro servicio REST de contabilidad** (por ejemplo, reportes, exportaciones o endpoints que se prefieran en Python). El gateway o el front no lo usan aún para lógica de contabilidad; sí puede usarse para health checks en Docker/orquestación.

---

## 2. ContabilidadNestJs

### Ubicación
`ContabilidadNestJs/`

### Qué es
Backend de **contabilidad** con NestJS: API **GraphQL** para cuentas contables, asientos y movimientos. Usa TypeORM y PostgreSQL.

### Arquitectura
- **Entidades (TypeORM)**  
  - `CuentaContable`: plan de cuentas (código, nombre, tipo, naturaleza, cuenta_padre_id).  
  - `AsientoContable`: asientos (numero, fecha, concepto, total_debe, total_haber, estado, empresa_id, usuario_id).  
  - `MovimientoContable`: líneas de cada asiento.  
  - `BalanceGeneral`: balances.
- **Servicios**  
  - `CuentaContableService` / `AsientoContableService`: lógica y acceso a BD (findAll, findOne, create, filtros por fecha o tipo).
- **Resolvers (GraphQL)**  
  - **CuentaContableResolver**:  
    - Queries: `cuentasContables`, `cuentaContable(id)`, `cuentasContablesPorTipo(tipo)`.  
    - Mutation: `crearCuentaContable(codigo, nombre, tipo, naturaleza, ...)`.  
  - **AsientoContableResolver**:  
    - Queries: `asientosContables`, `asientoContable(id)`, `asientosContablesPorFecha(fechaInicio, fechaFin)`.  
    - Mutation: `crearAsientoContable(numero, fecha, concepto, empresaId, usuarioId)`.

### Configuración
- **Puerto**: **3004** (en `main.ts`).
- **GraphQL Playground**: `http://localhost:3004/graphql`.
- **BD**: Misma PostgreSQL del ERP (`DATABASE_URL` o `DB_*`).  
- **TypeORM**: `synchronize: false` (no crea/altera tablas automáticamente; se asume que las tablas ya existen o se crean con migraciones).

### Gateway
El gateway GraphQL actual **no** redirige de forma específica las operaciones de contabilidad (cuentas, asientos) a ContabilidadNestJs; las consultas que no coinciden con auth, terceros o menú suelen ir a InicioNestJs. Para que el front use ContabilidadNestJs a través del gateway habría que añadir en el gateway la detección de queries/mutations de contabilidad (por ejemplo `asientosContables`, `cuentasContables`, `crearAsientoContable`, etc.) y enviarlas al servicio ContabilidadNestJs (puerto 3004).

---

## 3. Frontend (Contabilidad)

### Dónde se integra Contabilidad
- **Barra superior (Header)**  
  - En `Header.tsx`, "Contabilidad" es una opción del menú principal (`mainMenuOptions` con `key: 'contabilidad'`).  
  - Solo se muestra si el perfil tiene permisos: se filtra por `opcionesMenuSuperior` (nombres de secciones que vienen del backend de menú/permisos).  
  - Al hacer clic se dispara `setMainMenu('contabilidad')` (Redux).
- **Sidebar (menú lateral)**  
  - En `Sidebar.tsx`, al tener "Contabilidad" seleccionado se obtiene el `id_seccion` de la sección "Contabilidad" (desde `menuLateral` o con el respaldo `getIdSeccionPorNombre('Contabilidad')`).  
  - Con ese id se carga el menú lateral desde BD (`cargarMenuLateralOrdenado`): ítems raíz y submenús (Configuración, Diarios, Asientos Contables, etc.).  
  - Si no hay datos en BD para esa sección, se usa el menú estático de `SidebarData.tsx`: título "Contabilidad" y un único ítem "Próximamente".
- **SidebarData.tsx**  
  - Define el fallback estático: `contabilidad: [ { caption: "Contabilidad" }, { title: "Próximamente", icon: ... } ]`.

### Rutas y vistas
- En `Router.tsx` **no** hay rutas bajo `/contabilidad` (por ejemplo `/contabilidad/asientos`, `/contabilidad/configuracion`). Las rutas del menú de Contabilidad que vienen de la BD (como `/contabilidad/asientos`, `/contabilidad/configuracion`) pueden estar definidas en `menu_item.ruta`; si el usuario hace clic en el sidebar, la navegación iría a esa ruta solo si existe una ruta en el Router que la atienda.
- **SeccionContable** (`views/empresas/secciones/SeccionContable.tsx`) es una **sección del formulario de Empresa** (datos contables/identificación de la empresa), no es la pantalla del módulo Contabilidad.

### Resumen frontend
| Elemento        | Archivo / Lugar        | Función |
|-----------------|------------------------|--------|
| Opción en barra | `Header.tsx`           | Mostrar "Contabilidad" si el perfil tiene permisos; al clic, `setMainMenu('contabilidad')`. |
| Sidebar         | `Sidebar.tsx`          | Mostrar menú de Contabilidad desde BD (o "Próximamente" si no hay datos). |
| Fallback estático | `SidebarData.tsx`    | `contabilidad`: caption + "Próximamente". |
| Rutas           | `Router.tsx`           | No hay rutas específicas `/contabilidad/...` definidas actualmente. |

Para que las pantallas de Contabilidad (asientos, plan contable, configuración, etc.) funcionen al navegar desde el menú, haría falta definir en el Router las rutas correspondientes (por ejemplo `contabilidad/asientos`, `contabilidad/configuracion`) y las vistas (componentes) que consuman la API de ContabilidadNestJs (directamente o vía gateway una vez configurado).

---

## 4. Esquema de conjunto

```
┌─────────────────────────────────────────────────────────────────┐
│  Frontend (React)                                                │
│  - Header: opción "Contabilidad" (según permisos)               │
│  - Sidebar: menú dinámico desde BD o "Próximamente"             │
│  - Rutas /contabilidad/*: por definir si se usan vistas propias  │
└───────────────────────────┬─────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │ Gateway (GraphQL)│  → hoy no enruta contabilidad
                    │ o llamada directa│     a ContabilidadNestJs
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐  ┌────────────────────┐  ┌─────────────────┐
│ Contabilidad  │  │ ContabilidadNestJs │  │ MenuNestJs      │
│ Python        │  │ (puerto 3004)      │  │ (permisos y     │
│ (puerto 5002) │  │ GraphQL:           │  │  menú lateral   │
│ Solo /health  │  │ - cuentasContables │  │  Contabilidad)   │
└───────────────┘  │ - asientosContables│  └─────────────────┘
                   │ - crear...         │
                   └────────────────────┘
```

---

## 5. Estructura de la base de datos

Las tablas del módulo de Contabilidad y las usadas para el menú de Contabilidad viven en la misma base PostgreSQL del ERP.

### 5.1 Tablas del módulo contable (ContabilidadNestJs)

#### `cuenta_contable`
Plan de cuentas.

| Columna          | Tipo                    | Restricción / Notas |
|------------------|-------------------------|----------------------|
| id               | SERIAL / INT            | PK, autogenerado     |
| codigo           | VARCHAR(20)             | UNIQUE, ej. "1.01.01" |
| nombre           | VARCHAR(200)            |                      |
| descripcion      | VARCHAR(500)            | NULL                 |
| tipo             | ENUM                    | 'ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'GASTO' |
| naturaleza       | ENUM                    | 'DEUDORA', 'ACREEDORA' |
| activa           | BOOLEAN                 | DEFAULT true         |
| cuenta_padre_id  | INT                     | NULL, FK a cuenta_contable.id (jerarquía) |
| created_at       | TIMESTAMP               |                      |
| updated_at       | TIMESTAMP               |                      |

#### `asiento_contable`
Cabecera de asientos contables.

| Columna     | Tipo                    | Restricción / Notas |
|-------------|-------------------------|----------------------|
| id          | SERIAL / INT            | PK                   |
| numero      | VARCHAR(20)             | UNIQUE               |
| fecha       | DATE                    |                      |
| concepto    | VARCHAR(500)            |                      |
| total_debe  | DECIMAL(15,2)           |                      |
| total_haber | DECIMAL(15,2)           |                      |
| estado      | ENUM                    | 'BORRADOR', 'APROBADO', 'ANULADO' |
| usuario_id  | INT                     | NULL                 |
| empresa_id  | INT                     | NULL                 |
| created_at  | TIMESTAMP               |                      |
| updated_at  | TIMESTAMP               |                      |

#### `movimiento_contable`
Líneas (partida doble) de cada asiento.

| Columna             | Tipo           | Restricción / Notas |
|---------------------|----------------|----------------------|
| id                  | SERIAL / INT   | PK                   |
| asiento_contable_id | INT            | FK → asiento_contable.id |
| cuenta_contable_id  | INT            | FK → cuenta_contable.id  |
| debe                | DECIMAL(15,2)  |                      |
| haber               | DECIMAL(15,2)  |                      |
| concepto            | VARCHAR(500)   | NULL                 |
| documento_referencia| VARCHAR        | NULL                 |
| created_at          | TIMESTAMP      |                      |
| updated_at          | TIMESTAMP      |                      |

#### `balance_general`
Balances por fecha de corte.

| Columna        | Tipo           | Restricción / Notas |
|----------------|----------------|----------------------|
| id             | SERIAL / INT   | PK                   |
| fecha_corte    | DATE           |                      |
| empresa_id     | INT            |                      |
| total_activos  | DECIMAL(15,2)  |                      |
| total_pasivos  | DECIMAL(15,2)  |                      |
| total_patrimonio| DECIMAL(15,2) |                      |
| estado         | ENUM           | 'BORRADOR', 'APROBADO' |
| created_at     | TIMESTAMP      |                      |
| updated_at     | TIMESTAMP      |                      |

---

### 5.2 Tablas del menú (visibilidad de Contabilidad)

Usadas por **MenuNestJs** para mostrar la sección "Contabilidad" en la barra y en el sidebar, y para permisos por perfil.

#### `menu_seccion`
Secciones del menú (Inicio, Terceros, Contabilidad, etc.).

| Columna     | Tipo          | Restricción / Notas |
|-------------|---------------|----------------------|
| id_seccion  | UUID          | PK                   |
| nombre      | VARCHAR(100)  | ej. 'Contabilidad'   |
| icono       | VARCHAR(50)   | NULL, ej. 'fas fa-calculator' |
| orden       | INT           | DEFAULT 0            |
| estado      | BOOLEAN       | DEFAULT true         |

#### `menu_item`
Ítems del menú (raíz y submenús). Los de Contabilidad tienen `id_seccion` = id de la sección "Contabilidad".

| Columna     | Tipo          | Restricción / Notas |
|-------------|---------------|----------------------|
| id_item    | UUID          | PK                   |
| id_seccion | UUID          | FK → menu_seccion.id_seccion |
| parent_id  | UUID          | NULL para raíz; FK → menu_item.id_item para hijos |
| etiqueta   | VARCHAR(100)  | ej. 'Asientos Contables' |
| ruta       | VARCHAR(255)  | NULL, ej. '/contabilidad/asientos' |
| icono      | VARCHAR(50)   | NULL                 |
| orden      | INT           | DEFAULT 0            |
| estado     | BOOLEAN       | DEFAULT true         |
| es_clickable| BOOLEAN       | DEFAULT false        |
| muestra_badge | BOOLEAN     | DEFAULT false        |
| badge_text | VARCHAR(50)   | NULL                 |
| created_by | VARCHAR(100)  | NULL                 |
| created_at | TIMESTAMP     | NULL                 |
| updated_by | VARCHAR(100)  | NULL                 |
| updated_at | TIMESTAMP     | NULL                 |

#### `perfil`
Perfiles/roles de usuario (referenciados por permisos de menú).

| Columna    | Tipo         | Notas     |
|------------|--------------|-----------|
| id_perfil  | UUID         | PK        |
| nombre     | VARCHAR      |           |
| estado     | BOOLEAN      |           |

#### `perfil_menu_permiso`
Permisos de menú por perfil. Si no hay fila con `permitido = true` para ítems de Contabilidad, la sección no aparece para ese perfil.

| Columna   | Tipo    | Restricción / Notas |
|-----------|---------|----------------------|
| id_perfil | UUID    | PK, FK → perfil.id_perfil |
| id_item   | UUID    | PK, FK → menu_item.id_item |
| permitido | BOOLEAN | DEFAULT true         |

---

### 5.3 Relaciones (resumen)

- **Contabilidad:** `movimiento_contable` → `asiento_contable`, `cuenta_contable`; `cuenta_contable.cuenta_padre_id` → `cuenta_contable.id`.
- **Menú:** `menu_item.id_seccion` → `menu_seccion.id_seccion`; `menu_item.parent_id` → `menu_item.id_item`; `perfil_menu_permiso` relaciona `perfil` y `menu_item`.

---

## 6. Datos para reportes vs módulo de reportes

- **En este módulo (Contabilidad)** solo se **obtiene la información**: queries GraphQL (`balanceComprobacion`, `libroMayor`, `estadoResultados`, `balanceGeneralSaldos`) y funciones SQL que devuelven los datos ya calculados. No se generan archivos ni documentos aquí.
- **Módulo de reportes (otro servicio)** será el encargado al **100% de generar los documentos** (Excel, PDF, etc.), consumiendo estos datos vía API/GraphQL. Ese módulo orquestará la obtención de datos y la creación de los archivos.

---

## 7. Resumen por componente

| Componente           | Tecnología | API / Contenido actual |
|----------------------|------------|-------------------------|
| ContabilidadPython   | Flask      | Solo `GET /health`. Pensado para ampliar con REST. |
| ContabilidadNestJs   | NestJS + GraphQL + TypeORM | Cuentas contables y asientos (queries y mutations). Puerto 3004. |
| Front Contabilidad   | React      | Barra + sidebar con menú desde BD o "Próximamente". Sin rutas `/contabilidad/*` ni vistas que consuman ContabilidadNestJs en el Router actual. |

---

## 8. Reglas de negocio formalizadas

Documento de referencia: *MÓDULO DE CONTABILIDAD – Reglas de Negocio*. Son independientes de la implementación y deben cumplirse siempre.

### 8.1 Principios contables base

- **Partida doble**: todo asiento debe cumplir `total_debit = total_credit`.
- No se permite **eliminación física** de asientos; solo estados y reversión.
- Toda operación debe ser **trazable** (usuario, fecha, origen).
- Sistema **multiempresa**: ningún registro contable puede existir sin `empresa_id`.

### 8.2 Máquina de estados del asiento

| Estado   | Descripción breve |
|----------|-------------------|
| **DRAFT**   | Editable; no afecta reportes. |
| **POSTED**  | No editable; afecta reportes; puede reversarse. |
| **VOIDED**  | Solo si no fue publicado; no afecta contabilidad. |
| **REVERSED** | Aplicado cuando existe asiento reverso; no modificable. |

Transiciones: `DRAFT → POSTED → REVERSED`; desde DRAFT también `→ VOIDED`.

### 8.3 Reglas de publicación (DRAFT → POSTED)

Deben cumplirse todas:

- Al menos 2 líneas; ninguna con `debit = 0` y `credit = 0`; ninguna con ambos `debit > 0` y `credit > 0`.
- `total_debit = total_credit`.
- Periodo contable en estado **OPEN**.
- Cuentas activas y con `is_postable = true`.

### 8.4 Reglas de reversión

- Solo asientos **POSTED** pueden reversarse.
- Se genera asiento nuevo con débitos/créditos invertidos; original pasa a **REVERSED**; se guarda `reversed_entry_id`.
- No se permite reversar un asiento ya **REVERSED**.

### 8.5 Periodos contables

- **OPEN**: permite creación y publicación de asientos.
- **CLOSED**: no permite creación, publicación ni edición. Al cerrar se valida que no existan asientos DRAFT.

### 8.6 Numeración, cuentas e impuestos

- Numeración **única** por empresa + diario + periodo; no reutilizable; generada en transacción.
- Código de cuenta **único por empresa**; cuentas con movimientos no pueden eliminarse; solo cuentas `is_postable` reciben movimientos; cuentas padre no reciben movimientos directos.
- Todo impuesto debe tener cuenta contable asociada; porcentaje ≥ 0; alcance (SALE, PURCHASE, BOTH).

### 8.7 Contabilización automática (eventos)

- Todo evento debe tener **idempotency_key**; si ya existe → no reprocesar.
- Fallos → registrar en bandeja de eventos (ej. `acc_event_inbox`) con estado FAILED.
- Operaciones en **transacción**; no líneas sin `entry_id` ni asientos sin líneas.

---

## 9. Seguridad y roles

Documento de referencia: *Seguridad – Módulo de Contabilidad*. Modelo **RBAC** (Role-Based Access Control).

### 9.1 Principios

- Segregación de funciones (SoD), mínimo privilegio, trazabilidad, no repudio, multiempresa aislada, protección contra fraude interno.

### 9.2 Roles y permisos (resumen)

| Rol                    | Crear cuenta | Asiento DRAFT / Editar | Publicar | Reversar | Cerrar periodo | Ver reportes |
|------------------------|-------------|-------------------------|----------|----------|----------------|--------------|
| Administrador Contable | ✔           | ✔                        | ✔        | ✔        | ✔              | ✔            |
| Contador               | ✖           | ✔                        | ✔        | ✔        | ✖              | ✔            |
| Auxiliar Contable      | ✖           | ✔                        | ✖        | ✖        | ✖              | ✔            |
| Auditor                | ✖           | ✖                        | ✖        | ✖        | ✖              | ✔ (solo lectura) |
| Supervisor Financiero  | ✖           | ✖                        | ✔*       | ✔        | ✔              | ✔            |

\* Aprobación / doble control si se implementa.

### 9.3 Multiempresa y API

- Todo query debe filtrarse por `empresa_id`; el usuario solo opera sobre empresas asignadas; validación obligatoria en backend.
- Autenticación **JWT** (user_id, roles, empresas autorizadas); cada resolver/endpoint debe validar rol y empresa.

### 9.4 RabbitMQ y auditoría

- Eventos con `empresa_id`; idempotencia con `idempotency_key` y constraint UNIQUE; registrar eventos en bandeja (inbox).
- Auditoría: usuario creador/publicador/reversor, fecha/hora; no edición directa en BD; no eliminación física de asientos.

---

## 10. Alcance funcional y arquitectura objetivo

Documento de referencia: *Documento de Desarrollo*.

### 10.1 Alcance MVP (vendible)

- Plan de cuentas jerárquico y multiempresa.
- **Diarios contables** (ventas, compras, banco, general).
- Asientos manuales y **automáticos** (eventos desde Facturación).
- Validaciones: partida doble, estados (Borrador/Publicado/Anulado), reversión.
- **Periodos contables**: apertura/cierre, bloqueo por periodo.
- Impuestos (EC): IVA 12%/0%, retenciones; mapeo impuesto → cuentas.
- Reportes: Libro Diario, Libro Mayor, Balance de Comprobación, Balance General, Estado de Resultados.

### 10.2 Fuera de alcance (por ahora)

- Consolidación multiempresa avanzada, multi-moneda con revaluaciones, analítica avanzada, IFRS/NIIF automatizada, costeo de inventario automático.

### 10.3 Flujo con RabbitMQ

- **Exchange (topic)**: `erp.events`.
- **Routing keys** (ej.): `billing.invoice.created`, `billing.invoice.authorized`, `billing.invoice.voided`, `billing.creditnote.created`, `billing.creditnote.voided`.
- **Colas**: `acc.entry.create`, `acc.entry.reverse`; DLQ: `acc.entry.create.dlq`, `acc.entry.reverse.dlq`.
- ContabilidadNestJs consume mensajes, valida empresa, periodo, regla e idempotencia, genera asiento y registra referencia a documento origen (`acc_external_ref`).

### 10.4 Contrato de mensaje (ejemplo factura creada)

Incluye: `event_id`, `event_type`, `occurred_at`, `tenant.empresa_id`, `actor.usuario_id`, `document` (tipo, id, número, fecha), `amounts` (subtotal, tax, total), `taxes[]`, `lines[]`, `accounting.journal_code`, `idempotency_key`.

---

## 11. Modelo de datos objetivo (entidades adicionales)

Documentos de referencia: *Documento de Desarrollo*, *Documento de Entidades*. Convenciones: PK UUID, `empresa_id` obligatorio en tablas core, auditoría `created_at/created_by`, `updated_at/updated_by`. No borrar asientos; usar estado y reversión.

Además de las tablas ya descritas en la sección 5, la documentación define:

| Tabla / entidad        | Propósito |
|------------------------|-----------|
| **acc_journal**        | Diarios (VENTAS, COMPRAS, BANCO, GENERAL); numeración por diario. |
| **acc_period**         | Periodos contables (year, month, start_date, end_date, status OPEN/CLOSED). |
| **acc_rule** / **acc_rule_line** | Reglas de contabilización automática (document_type, journal_id, posting_moment; líneas DEBIT/CREDIT por concepto). |
| **acc_tax** / **acc_tax_account_map** | Impuestos y mapeo impuesto → cuenta (direction DEBIT/CREDIT). |
| **acc_cost_center**    | Centros de costo (opcional MVP). |
| **acc_event_inbox**    | Bandeja de eventos RabbitMQ (idempotency_key, status RECEIVED/PROCESSED/FAILED, payload). |
| **acc_external_ref**   | Relación asiento ↔ documento origen (document_type, document_id, document_number). |
| **acc_sequence**      | Secuencia de numeración por empresa + diario + year + month. |

En el modelo objetivo, **acc_entry** incluye: `journal_id`, `period_id`, `status` (DRAFT/POSTED/VOIDED/REVERSED), `source` (MANUAL/AUTO), `external_ref_type/id`, `idempotency_key`, `reversed_entry_id`. **acc_account** incluye `is_postable`, `level`, `parent_id`.

---

## 12. Motor de contabilización automática

Documento de referencia: *Documento del Motor de Contabilización Automática*.

### 12.1 Objetivo

Generar asientos automáticos correctos, idempotentes y trazables desde eventos (facturas, notas de crédito, anulaciones), con integridad matemática y control de periodos.

### 12.2 Principios

- Idempotencia por `idempotency_key`; atomicidad (transacción); debe = haber; trazabilidad con documento origen; asientos automáticos no se editan (se reversan); no publicar en periodo cerrado.

### 12.3 Eventos MVP

- `billing.invoice.created` / `billing.invoice.authorized` → crear asiento.
- `billing.invoice.voided` → reversar asiento.
- `billing.creditnote.created` → crear asiento; `billing.creditnote.voided` → reversar.

### 12.4 Flujo de creación de asiento

1. Consumir evento → validar esquema → registrar en inbox (RECEIVED).
2. Validar idempotencia (si ya PROCESSED → ACK y salir).
3. Resolver regla contable (`acc_rule` + `acc_rule_line`) por empresa, document_type, posting_moment.
4. Validar periodo contable (existe y status OPEN).
5. Construir líneas (conceptos AR, SALES, VAT_SALES, etc.) y montos desde payload.
6. Validar cuadratura (total_debit = total_credit).
7. Generar número (secuencia por empresa + diario + periodo, dentro de transacción).
8. Insertar `acc_entry`, `acc_entry_line`, `acc_external_ref`; marcar inbox PROCESSED; ACK.

### 12.5 Flujo de reversión

- Localizar asiento por `acc_external_ref` (document_type, document_id); comprobar status POSTED y que no esté ya reversado.
- Generar asiento reverso (débitos/créditos invertidos); marcar original REVERSED; guardar `reversed_entry_id`.

### 12.6 Errores y reintentos

- Errores de negocio (RULE_NOT_FOUND, PERIOD_CLOSED, etc.) → marcar FAILED, DLQ o ACK y notificar.
- Errores técnicos (timeout, conexión) → NACK y reintentos (3–5) con backoff.

---

## 13. Fórmulas matemáticas (estados financieros)

Documento de referencia: *Documento Matemático de Estados Financieros*.

### 13.1 Partida doble y saldos

- Por asiento: **Σ(debit) = Σ(credit)**.
- Por cuenta: saldo = Σ(debit) − Σ(credit) (naturaleza deudora) o Σ(credit) − Σ(debit) (acreedora). Solo asientos **POSTED**; DRAFT/VOIDED/REVERSED no afectan resultado neto.

### 13.2 Balance de comprobación

- Por cuenta: TotalDebit, TotalCredit, Saldo = TotalDebit − TotalCredit. Global: Σ TotalDebit = Σ TotalCredit (si no → error contable).

### 13.3 Libro diario y mayor

- **Libro diario**: asientos POSTED ordenados por fecha y número.
- **Libro mayor**: por cuenta; SaldoAcumulado(n) = SaldoAcumulado(n−1) + debit − credit.

### 13.4 Estado de resultados

- IngresosTotales = Σ(credit − debit) cuentas INGRESO; GastosTotales = Σ(debit − credit) GASTO; CostosTotales = Σ(debit − credit) COSTO.
- **Resultado = IngresosTotales − (GastosTotales + CostosTotales)** (utilidad si > 0, pérdida si < 0).

### 13.5 Balance general

- **Activo = Pasivo + Patrimonio**. Saldos por tipo: Activo = Σ(debit − credit); Pasivo y Patrimonio = Σ(credit − debit). Verificación: Σ Activos = Σ Pasivos + Σ Patrimonio.

### 13.6 Cuentas padre y precisión

- Saldo cuenta padre = Σ(saldos hijas), recursivo.
- Asientos REVERSED: saldo neto con su reverso = 0.
- Cálculos con **NUMERIC(15,2)**; no FLOAT.

---

## 14. Lo implementado vs lo que falta

Resumen según código actual y documentación de referencia.

| Área | Implementado | Falta |
|------|--------------|--------|
| **Backend ContabilidadNestJs** | Entidades: cuenta_contable, asiento_contable, movimiento_contable, balance_general. Queries/mutations básicas (crear/listar cuentas y asientos; filtros por fecha). | Diarios (acc_journal), periodos (acc_period), estados POSTED/VOIDED/REVERSED, reversión, reglas de publicación. Tablas: acc_rule, acc_event_inbox, acc_external_ref, acc_tax, acc_sequence. |
| **ContabilidadPython** | GET /health. | (La generación de documentos Excel/PDF/CSV se hará en un **módulo de reportes** dedicado; Contabilidad solo expone los datos.) |
| **Gateway** | — | Enrutar operaciones de contabilidad (asientosContables, cuentasContables, etc.) a ContabilidadNestJs (puerto 3004). |
| **Frontend** | Menú "Contabilidad" en Header y sidebar dinámico por BD (o "Próximamente"). | Rutas `/contabilidad/*` y vistas que consuman GraphQL de ContabilidadNestJs. |
| **Reglas de negocio** | Creación básica de asientos/cuentas. | Partida doble estricta en publicación, máquina de estados, reglas de reversión, periodos OPEN/CLOSED, numeración por diario/periodo, validación is_postable. |
| **Seguridad** | Permisos de menú por perfil (MenuNestJs). | RBAC por operación contable (crear/publicar/reversar/cerrar periodo); filtro obligatorio empresa_id en todos los queries. |
| **Motor automático** | — | Consumidor RabbitMQ, procesamiento de eventos facturación, idempotencia (acc_event_inbox), generación de asientos desde reglas, reversión por anulación. |
| **Datos para reportes** | Queries GraphQL y funciones SQL: balance comprobación, libro mayor, estado resultados, balance general (saldos). Solo **traer información**. | — |
| **Generación de documentos** | — | Un **módulo de reportes** aparte se encargará 100% de generar los documentos (Excel, PDF, etc.) consumiendo los datos que expone Contabilidad. |
| **BD** | Tablas cuenta_contable, asiento_contable, movimiento_contable, balance_general (nombres actuales). | Migraciones a modelo objetivo: acc_journal, acc_period, acc_rule, acc_rule_line, acc_tax, acc_tax_account_map, acc_event_inbox, acc_external_ref, acc_sequence; campos en asiento: journal_id, period_id, status, source, idempotency_key, reversed_entry_id. |

---

## 15. Próximos pasos (después de ejecutar las migraciones)

Una vez ejecutadas las migraciones SQL (01, 04, 05, 06, 07 y opcionalmente 02, 03), lo que sigue es:

### 1. Re-ejecutar funciones 05 y 06 si ya las tenías

Si ejecutaste 05 y 06 antes de las correcciones al esquema real (UUID, `id_asiento_contable`, `id_empresa`, `fecha_asiento`, `tipo_cuenta`), vuelve a ejecutarlas con la versión actualizada de los archivos.

### 2. Alinear ContabilidadNestJs con tu esquema de BD

Las entidades TypeORM del backend siguen usando el esquema antiguo (`id` number, `empresa_id`, `numero`, `fecha`, etc.). Tu BD usa:

- **asiento_contable**: `id_asiento_contable` (UUID), `id_empresa`, `id_diario_contable`, `numero_asiento`, `fecha_asiento`, `estado` (VARCHAR), etc.
- **movimiento_contable**: `id_movimiento_contable`, `id_asiento_contable`, `id_cuenta_contable`, `debe`, `haber`, `concepto`, `orden`.
- **cuenta_contable**: `id_cuenta_contable`, `tipo_cuenta`, `codigo`, `nombre`, etc.

Hay que actualizar entidades, servicios y resolvers para usar estos nombres y tipos (UUID). Así el backend podrá leer/escribir asientos y movimientos correctamente y las queries de reportes recibirán `empresaId`/`cuentaId` como UUID.

### 3. Ajustar ReporteContableService a UUID

Las funciones SQL de reportes ya reciben `UUID` (`empresa_id`, `cuenta_id`). En el servicio NestJS hay que pasar **strings UUID** (no number) cuando se llame a `balance_comprobacion`, `libro_mayor`, `estado_resultados` y `balance_general_saldos`. Los DTOs de GraphQL pueden exponer `cuenta_id` como String (UUID).

### 4. Configurar el gateway GraphQL

En el gateway, definir las reglas para que las operaciones de contabilidad (`asientosContables`, `cuentasContables`, `balanceComprobacion`, `publicarAsiento`, etc.) se enruten al servicio **ContabilidadNestJs** (puerto 3004).

### 5. Frontend: rutas y vistas

Crear en el Router las rutas bajo `/contabilidad/*` (por ejemplo `/contabilidad/asientos`, `/contabilidad/plan-cuentas`, `/contabilidad/reportes`) y los componentes que consuman el GraphQL de Contabilidad (directo o vía gateway). El menú lateral ya puede apuntar a esas rutas si están definidas en `menu_item.ruta`.

### 6. Opcional (más adelante)

- **RBAC**: validar permisos por operación (crear/publicar/reversar asiento, cerrar periodo) y filtrar siempre por `id_empresa` del usuario.
- **Motor automático**: consumidor RabbitMQ, tablas `acc_event_inbox` / `acc_external_ref`, generación de asientos desde facturación.
- **Módulo de reportes**: servicio aparte que consuma los datos de Contabilidad y genere Excel/PDF.

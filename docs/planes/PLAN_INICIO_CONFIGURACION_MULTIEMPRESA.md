# Plan: Inicio y Configuración (Dolibarr → Genie multiempresa)

> **Estado:** Pendiente de ejecución  
> **Creado:** 2026-08-23  
> **Origen:** Comparación Inicio → Configuración de Dolibarr vs ERP Genie (nativo multiempresa)  
> **Sustituye en alcance de Inicio:** [PLAN_CONFIG_GLOBAL_DICCIONARIOS.md](./PLAN_CONFIG_GLOBAL_DICCIONARIOS.md) (gran parte de ese plan ya está hecha: menú bajo Inicio, diccionarios con `id_empresa`)

## Objetivo

Cerrar el hueco de **Inicio / Configuración** respecto a Dolibarr, sin copiar el modelo de una sola empresa. En Genie cada dato de negocio es por `id_empresa` y el JWT lleva `scope_acceso` (`GLOBAL` | `EMPRESA`).

## Principio: no clonar Dolibarr 1:1

En Dolibarr, Inicio → Configuración asume **una organización de la instancia**. El plugin Multi-Company añade un selector; la ficha “Empresa/Organización” sigue siendo “la empresa activa”.

En Genie la multiempresa es nativa:

| `scope_acceso` | Comportamiento obligatorio |
|----------------|----------------------------|
| `EMPRESA` | Sin combo. Todo usa `id_empresa` del JWT. No listar ni editar otras empresas. |
| `GLOBAL` | Combo de empresa. Sin selección: no listar. Con selección: filtrar por esa `id_empresa`. |

**No** crear una “empresa del sistema”. **Sí** un hub de configuración que opera sobre la empresa del contexto.

**No** clonar “Módulos” de Dolibarr (activar/desactivar aplicaciones). En Genie el equivalente es **menú + `perfil_menu_permiso`**. Flags por empresa quedan fuera de la primera entrega.

---

## Gap Inicio / Configuración

Leyenda: **OK** = usable · **Shell** = pantalla sin persistencia · **Hueco** = no existe o no cubre el caso Dolibarr.

| Dolibarr | En Genie hoy | Ámbito | Estado |
|----------|--------------|--------|--------|
| Mi panel de control (Inicio) | `/dashboard` plantilla e-commerce | Por empresa | Hueco |
| Área / dashboard de cada módulo | Solo Contabilidad tiene `/contabilidad`. Terceros menú “Dashboard” → `/dashboard` global. Productos/Financiero/Banco: listados, sin área | Por empresa | Hueco |
| Configuración (hub 2 tarjetas) | Submenú lateral sin landing | — | Hueco |
| Empresa/Organización | `/empresas` listado + ficha (RUC, país, moneda, `sujeto_iva`, logo, identificaciones) | Por empresa; listado solo tiene sentido GLOBAL | Parcial |
| Módulos | Menú y permisos (`MenuNestJs`) | Global de instancia + perfil | Distinto (no clonar) |
| Entorno (idioma, UI) | No | Preferencia usuario / empresa | Hueco P2 |
| Menús | `/menus` | Instancia | OK |
| Traducción | No | Instancia | Hueco P2 |
| Valores / filtros / ordenación | No | Por usuario o empresa | Hueco P2 |
| Paneles | `/configuracion/paneles` | Por empresa | Shell |
| Alertas | `/configuracion/alertas` | Por empresa | Shell |
| Seguridad | `/configuracion/seguridad` | Instancia (policies) + empresa | Shell |
| Límites y precisión | No | Por empresa | Hueco P1 |
| PDF | Solo diccionario formatos de papel | Por empresa | Hueco P1 |
| E-Mails / SMS | `/configuracion/emails` + `MailWorker` SMTP | Por empresa (remitente) / instancia (SMTP) | Shell + worker |
| **Diccionarios** | Condición pago, modo pago, formatos papel (por empresa); monedas y tipo entidad (globales) | Mixto | Parcial |
| **Tasas IVA / impuestos** | Tabla `impuestos` (global, sin `id_empresa`). Combo factura = catálogo + `0%` quemado. Sin CRUD. Cuentas IVA = mapeo contable, no tasas. | Debe ser **por empresa** | Hueco P0 |
| Otras configuraciones | No | Por empresa | Hueco P2 |
| Usuarios y grupos | `/usuario`, `/perfiles` | Usuario con empresa; perfiles por empresa | OK |
| Herramientas admin | No | Instancia GLOBAL | Hueco P2 |

Diccionarios actuales (`DiccionariosIndex`): condiciones de pago, modos de pago, monedas, tipo de entidad legal, formatos de papel. **Falta el diccionario de tasas de IVA**, que en Dolibarr vive aquí.

---

## Decisiones

1. **Hub** en `/configuracion` (clickable): tarjetas Empresa/Organización y Diccionarios primero; el resto como lista secundaria.
2. **Empresa/Organización** no es el listado admin. Es la ficha de la empresa del contexto:
   - `EMPRESA` → editar la propia (`/empresas/:id` o ruta dedicada `/configuracion/empresa`).
   - `GLOBAL` → selector + misma ficha. El listado `/empresas` queda como herramienta GLOBAL de alta/baja.
3. **IVA = diccionario por empresa.** Migrar `impuestos` a `id_empresa` + `UNIQUE(id_empresa, codigo)`. Seed al crear empresa (p. ej. IVA 15%, IVA 0% Ecuador). Quitar el `0%` quemado del combo de facturas.
4. **Paneles / Alertas / Emails / Seguridad** dejan de ser maquetas: persistir por empresa (o instancia donde aplique) vía InicioPython.
5. **Un dashboard por módulo principal**, no un único `/dashboard` compartido. En Dolibarr al entrar a Terceros, Productos, Financiera, etc. se ve el **área del módulo** (KPIs + cajas). Aquí hoy `/dashboard` es plantilla e-commerce y el ítem “Dashboard” de Terceros apunta a esa misma ruta. Patrón a seguir: **Área contabilidad** (`/contabilidad`).
6. **Módulos Dolibarr:** documentar “se cubre con menú/permisos”. No pantalla de activar módulos en P0–P1.
7. **Configuración → Paneles** asigna widgets a cada área (`inicio`, `terceros`, `productos`, `comercial`, `financiero`, `banco-cajas`, `contabilidad`). Solo se muestran widgets del módulo y de la empresa del contexto.

---

## Arquitectura

```
frontReact /configuracion/* y /{modulo}/dashboard
    → gateway-api (ctxHeaders: X-Company-Id, X-Scope-Acceso)
        GET  → Nest del dominio (GraphQL listados, empresa, impuestos, dashboards)
        POST/PUT → Python del dominio (CRUD)
```

Multiempresa: `useConfigEmpresaScope` + `ConfigEmpresaBar` en todas las pantallas de este hub. Gateway `ctxHeaders` fuerza empresa si el JWT es `EMPRESA`.

---

## Fases

### Fase 0 — Hub + IVA (prioridad de negocio)

Entregable usable en facturación.

| ID | Tarea |
|----|--------|
| `hub-config` | Vista `/configuracion`: tarjetas Empresa/Organización y Diccionarios; enlaces a Paneles, Alertas, Seguridad, E-Mails. Menú Inicio: Configuración clickable. |
| `empresa-contexto` | Ruta `/configuracion/empresa`: ficha de la empresa del contexto (reutilizar `EditarEmpresa`). GLOBAL con selector; EMPRESA sin combo ni listado de otras. |
| `sql-impuestos-empresa` | Migración: `impuestos.id_empresa`, código, activo, unique compuesto. Copiar tasas actuales a cada empresa activa. Seed al crear empresa. |
| `crud-impuestos` | InicioPython + gateway + GraphQL. Pantalla diccionario `/configuracion/diccionarios/impuestos`. |
| `factura-iva-catalogo` | `FacturaLineasEditor` solo tasas activas de la empresa. Sin `0%` hardcode salvo que exista en el diccionario. |

### Fase 1 — Documentos y precisión

| ID | Tarea |
|----|--------|
| `limites-precision` | Decimales moneda/cantidad/IVA por empresa. Usar en totales de factura y redondeo. |
| `pdf-empresa` | Plantilla PDF por empresa (logo ya está en `empresa`). No duplicar DocumentApi; solo parámetros (formato papel, pie, mostrar RUC). |

### Fase 2 — Persistencia de shells

| ID | Tarea |
|----|--------|
| `prefs-empresa` | Tabla `empresa_config` (JSONB o columnas) para paneles, umbrales de alertas, SMTP/remitente. |
| `paneles-save` | Guardar qué widgets están activos y su orden. |
| `alertas-save` | Umbrales; más adelante el dashboard los consume. |
| `emails-save` | Remitente/BCC por empresa. SMTP de instancia sigue en `MailWorker` / env. |
| `seguridad-save` | Timeout sesión, política contraseña: **instancia** (no por empresa), solo GLOBAL. |

### Fase 3 — Dashboards por módulo

Ver catálogo de widgets más abajo. No mezclar datos de otra empresa.

| ID | Tarea |
|----|--------|
| `dash-shell` | Layout `DashboardModulo` (selector empresa GLOBAL + grid de widgets). Componentes reutilizables en `frontReact/src/views/dashboards/`. |
| `dash-inicio` | Reemplazar `Comercio.tsx`. Ruta `/dashboard` (o `/inicio`). Widgets cruzados de todos los módulos. |
| `dash-terceros` | `/terceros/dashboard`. Menú Terceros “Dashboard” deja de apuntar a `/dashboard`. |
| `dash-productos` | `/items/dashboard`. Sustituye el mock de `ProductosEstadisticas` como área (las estadísticas detalladas pueden quedar como subpantalla). |
| `dash-comercial` | `/comercial/dashboard`. Solo widgets con datos reales; el resto oculto o “pendiente” (presupuestos/pedidos aún P1). |
| `dash-financiero` | `/financiero` o `/financiero/dashboard`. KPIs de facturas/cobros/pagos. |
| `dash-banco` | `/banco-cajas` o `/banco-cajas/dashboard`. Saldos y últimos movimientos. |
| `dash-contabilidad` | Mantener pasos 1–9 y A–E en `/contabilidad`; añadir widgets operativos debajo (últimos asientos, pendientes de transferir). |
| `dash-gql` | Query de resumen por dominio en el Nest de lectura (`dashboardTerceros`, `dashboardFinanciero`, …) con `id_empresa` obligatorio. |
| `dash-menu` | SQL menú: primer ítem de cada sección principal = Área/Dashboard de ese módulo. |
| `dashboard-paneles` | Honrar Configuración → Paneles (Fase 2): página destino + orden + activo. |

### Fase 4 — Diferido (P2)

Entorno, traducción, valores/filtros/ordenación, SMS, otras configuraciones, herramientas admin, flags tipo “módulo” por empresa.

---

---

## Dashboards por módulo (estilo Dolibarr)

En Dolibarr, al pulsar **Inicio, Terceros, Productos, Comercial, Financiera, Bancos \| Cajas, Contabilidad** no se cae en un listado: se abre el **área del módulo** (accesos rápidos + cajas/widgets). El listado es un ítem del menú lateral.

### Cómo está hoy en Genie

| Módulo (menú) | Al entrar hoy | Objetivo |
|---------------|---------------|----------|
| Inicio | `/dashboard` = plantilla e-commerce (Ganancias, Reviews, etc.) | Área Inicio con widgets de negocio |
| Terceros | Listados. Ítem **Dashboard** del menú apunta a `/dashboard` global | `/terceros/dashboard` propio |
| Productos / Ítems | `/items/productos` listado. Estadísticas = datos mock | `/items/dashboard` |
| Comercial | Menú existe; presupuestos/pedidos en `ModuloPendiente` | `/comercial/dashboard` (widgets solo si hay datos) |
| Financiero | Listados factura/cobro/pago. Estadísticas = pendiente | `/financiero/dashboard` |
| Banco y cajas | Catálogo bancos / cuentas / transferencias | `/banco-cajas/dashboard` |
| Contabilidad | `/contabilidad` = Área (pasos 1–9 y A–E) | Conservar guía + añadir KPIs operativos |
| Utilidades | Herramientas, no área de negocio | Sin dashboard |

**No** reutilizar `/dashboard` para todos. **No** romper listados actuales (`/terceros`, `/items/productos`, …). El área es una ruta nueva (excepto Inicio y Contabilidad, que ya usan la raíz del módulo).

### Convención de rutas y menú

| Área | Ruta | Ítem de menú (primero de la sección) |
|------|------|--------------------------------------|
| Inicio | `/dashboard` | Mi panel de control (ya existe como destino de login) |
| Terceros | `/terceros/dashboard` | Dashboard (cambiar ruta; hoy va a `/dashboard`) |
| Productos | `/items/dashboard` | Área productos |
| Comercial | `/comercial/dashboard` | Área comercial |
| Financiero | `/financiero/dashboard` | Área financiero |
| Banco y cajas | `/banco-cajas/dashboard` | Área bancos |
| Contabilidad | `/contabilidad` | Área contabilidad (ya existe) |

UI común: `ConfigEmpresaBar` + grid de widgets. GLOBAL sin empresa: no cargar cifras. Lectura solo GraphQL del Nest del dominio.

### Catálogo de widgets

Cada widget es un componente. Configuración → Paneles elige **página destino** (código del área) y **orden**. Si el módulo origen no tiene permiso de menú, no se muestra.

#### Inicio (`/dashboard`) — cajas cruzadas

Lo que Dolibarr pone en “Mi panel de control”; mezcla de módulos.

| Widget | Datos (filtrados por `id_empresa`) | Nest |
|--------|--------------------------------------|------|
| Facturas cliente no cobradas / vencidas | Recuento + importe, enlace al listado | FinancieroNestJs |
| Facturas proveedor no pagadas / vencidas | Idem | FinancieroNestJs |
| Últimas facturas cliente / proveedor | 5–10 filas | FinancieroNestJs |
| Últimos cobros / pagos | 5–10 filas | FinancieroNestJs |
| Últimos clientes / proveedores modificados | 5–10 filas | TerceroNestJs |
| Alertas de stock | Ítems bajo mínimo | ItemNestJs |
| Saldos de cuentas bancarias / caja | Saldo por cuenta activa | BancoCajaNestJs |
| Últimos asientos / asientos sin origen | 5–10 filas | ContabilidadNestJs |
| Alertas (umbrales de Fase 2) | Facturas/presupuestos según días | Según dominio |

Quitar por completo los widgets de plantilla (Earnings, Reviews, ProductSales).

#### Terceros (`/terceros/dashboard`)

| Widget | Contenido |
|--------|-----------|
| KPIs | N.º clientes, proveedores, prospectos, contactos (activos) |
| Últimos terceros modificados | Tabla con enlace a ficha |
| Accesos rápidos | Nuevo cliente, nuevo proveedor, nuevo tercero |
| Clientes / proveedores recientes | Los dados de alta últimos 30 días |

#### Productos (`/items/dashboard`)

| Widget | Contenido |
|--------|-----------|
| KPIs | N.º productos, servicios, con stock bajo |
| Alertas de stock | Listado ítem / almacén / cantidad vs mínimo |
| Últimos productos / servicios | Alta o modificación reciente |
| Accesos rápidos | Nuevo producto, nuevo servicio, stocks |
| Distribución tipo | Producto vs servicio (conteo) |

`ProductosEstadisticas` mock se reemplaza o pasa a leer las mismas queries.

#### Comercial (`/comercial/dashboard`)

Módulo aún delgado (presupuestos, pedidos, contratos en pendiente).

| Widget | Contenido | Si no hay dominio |
|--------|-----------|-------------------|
| KPIs presupuestos / pedidos abiertos | Conteos por estado | Ocultar o tarjeta “Módulo pendiente” |
| Últimos presupuestos / pedidos | Tabla | Idem |
| Accesos rápidos | Cuando existan las pantallas | Solo enlaces reales |

No inventar cifras. El área existe para no caer en 404 al pulsar Comercial.

#### Financiero (`/financiero/dashboard`)

Equivale al index de Facturación en Dolibarr.

| Widget | Contenido |
|--------|-----------|
| KPIs cliente | Borrador, validadas, vencidas, cobradas (cantidad + total) |
| KPIs proveedor | Borrador, pendientes de pago, vencidas |
| Cobros / pagos del mes | Importe y número |
| Últimas facturas | Cliente y proveedor |
| Accesos rápidos | Nueva factura cliente/proveedor, nuevo cobro, nuevo pago |

Las rutas `/financiero/facturas-*/estadisticas` (`ModuloPendiente`) pueden redirigir aquí o quedar como informes detallados en una fase posterior.

#### Banco y cajas (`/banco-cajas/dashboard`)

| Widget | Contenido |
|--------|-----------|
| Saldos | Una tarjeta o tabla por cuenta (banco/caja) |
| Últimos movimientos | Fecha, cuenta, importe, conciliación |
| Transferencias recientes | Estado |
| Accesos rápidos | Nueva cuenta, nuevo movimiento, nueva transferencia |

#### Contabilidad (`/contabilidad`)

No sustituir la guía Dolibarr (pasos 1–9 y A–E). Añadir debajo:

| Widget | Contenido |
|--------|-----------|
| Periodo / ejercicio activo | Nombre y fechas |
| Pendientes de transferir | Facturas cliente/proveedor sin asiento |
| Últimos asientos | Incluye OD / sin documento fuente |
| Accesos rápidos | Nuevo asiento, libro mayor, registro ventas |

### Backend (lectura)

Una query de resumen por Nest, siempre con `id_empresa` (vacío o ausente → vacío, nunca mix de empresas).

| Query (nombre orientativo) | Servicio |
|----------------------------|----------|
| `dashboardInicio` o composición en front de las demás | Front agrega; o BFF ligero en gateway más adelante |
| `dashboardTerceros(id_empresa)` | TerceroNestJs |
| `dashboardProductos(id_empresa)` | ItemNestJs |
| `dashboardFinanciero(id_empresa)` | FinancieroNestJs |
| `dashboardBanco(id_empresa)` | BancoCajaNestJs |
| `dashboardContabilidad(id_empresa)` | ContabilidadNestJs (además de `estadoAreaContabilidad`) |

Sin SQL ad-hoc en Python. Si hace falta agregación pesada, SP en `docs/sql/sp/` y Nest/Python solo invocan el SP; preferir TypeORM en Nest para estos conteos si las tablas ya están mapeadas.

### Fuera de estos dashboards (P2)

RRHH, Proyectos, Tickets, Agenda, Documentos, Utilidades: no son los módulos principales de la captura Dolibarr Inicio. Se agregan con el mismo patrón cuando el dominio exista.

---

## Fuera de alcance de este plan

- Impuestos India (IGST/CGST/SGST) del menú Financiero (P1 comercial, no es el diccionario de tasas).
- Cuentas contables de IVA (`/contabilidad/configuracion/cuentas-iva`): ya existe; enlazar desde el diccionario IVA (“esta tasa usa esta cuenta”) en una iteración posterior.
- Activar/desactivar módulos al estilo Dolibarr.

## Orden de implementación

1. Hub + ficha empresa del contexto.  
2. Diccionario IVA por empresa + combo facturas.  
3. Límites/precisión y PDF.  
4. Persistencia paneles/alertas/emails.  
5. Dashboards: Inicio + un área por módulo (Terceros, Productos, Financiero, Banco, Contabilidad; Comercial si hay datos).  
6. Entorno, traducción, etc. (Fase 4).

## Relación con planes previos

| Plan | Qué hacer |
|------|-----------|
| `PLAN_CONFIG_GLOBAL_DICCIONARIOS.md` | Marcado superseded. Diccionarios por empresa y menú Inicio ya existen. Lo que queda (IVA, hub, persistencia) vive aquí. |
| `PLAN_CONTABILIDAD_COMPLETO.md` | No bloquea Fase 0. El Área `/contabilidad` se conserva; este plan solo añade widgets operativos. |
| `.cursor/rules/multiempresa-scope.mdc` | Obligatorio en cada pantalla nueva de este plan. |

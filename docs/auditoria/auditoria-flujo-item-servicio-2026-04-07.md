# Auditoria Tecnica Flujo Creacion de Items (Servicio)

Fecha: 2026-04-07  
Alcance: Frontend React -> Gateway API -> ItemPython (Flask/SQLAlchemy) -> PostgreSQL  
Modalidad: Solo lectura, sin cambios funcionales.

## 1. Resumen ejecutivo

El error de "violacion de integridad" para alta de item tipo servicio se reproduce en la capa de base de datos durante el `INSERT` a `public.item`.

Causa principal detectada:
- La tabla `public.item` exige columnas `NOT NULL` que no se envian en un flujo minimo de servicio:
  - `id_estado_compra`
  - `id_tipo_control_caducidad`
  - `id_tipo_control_inventario`

Hallazgo adicional relevante:
- El formulario `NuevoServicio` actual en frontend no persiste en backend; solo hace `console.log`.

## 2. Traza tecnica completa

### Frontend
- Producto:
  - `frontReact/src/views/items/productos/NuevoProducto.tsx`
  - arma payload con `mapItemFormToCreateBody(...)`
  - llama `crearItemProducto(body)` en `frontReact/src/_apis_/item.js`
  - endpoint gateway: `POST /api/item`
- Servicio:
  - `frontReact/src/views/items/servicios/NuevoServicio.tsx`
  - no llama API de creacion (solo log local)

### Gateway
- Ruta: `gateway-api/src/routes/item.js` -> `fastify.post('/item', ...)`
- Servicio proxy: `gateway-api/src/services/itemPython.js`
  - reenvia body a `POST /api/item` en ItemPython
  - no transforma nombres de campos en creacion

### Backend ItemPython
- Endpoint: `ItemPython/api/item_routes.py`
  - `POST /api/item`
- Normalizacion/validacion: `ItemPython/services/item_service.py`
- Insercion: `ItemPython/repositories/item_repository.py`
  - `INSERT INTO public.item (...)`

### Base de datos
- Tabla principal: `public.item`
- Restricciones auditadas con `information_schema` y `pg_constraint`

## 3. Campos obligatorios reales actuales

## 3.1 NOT NULL en `public.item`

- `id_item` (uuid, default `gen_random_uuid()`)
- `id_empresa` (uuid)
- `producto_ref` (varchar)
- `estado` (boolean, default `true`)
- `created_at` (timestamp, default `now()`)
- `updated_at` (timestamp, default `now()`)
- `inventariable` (boolean, default `true`)
- `mandatory_periods` (boolean, default `false`)
- `id_estado_venta` (uuid)
- `id_estado_compra` (uuid)
- `id_tipo_control_caducidad` (uuid)
- `id_tipo_item` (uuid)
- `id_tipo_control_inventario` (uuid)
- `id_naturaleza_item` (uuid)

## 3.2 FKs relevantes

- `id_empresa -> empresa.id_empresa`
- `id_tipo_item -> tipo_item_catalogo.id_tipo_item`
- `id_estado_venta -> estado_venta_item.id_estado_venta`
- `id_estado_compra -> estado_compra_item.id_estado_compra`
- `id_tipo_control_inventario -> tipo_control_inventario_item.id_tipo_control_inventario`
- `id_tipo_control_caducidad -> tipo_control_caducidad_item.id_tipo_control_caducidad`
- `id_naturaleza_item -> naturaleza_item_catalogo.id_naturaleza_item`
- `impuesto_id -> impuestos.id`
- mas FKs opcionales de cuenta/unidades/almacen/pais/provincia.

## 3.3 Uniques y checks

- PK: `item_pkey(id_item)`
- UNIQUE: `uq_item_producto_ref(producto_ref)`
- UNIQUE: `uq_item_producto_empresa(id_empresa, producto_ref)`
- UNIQUE: `uq_item_codigo_barras(codigo_barras)`
- CHECK:
  - `precio_compra >= 0` (o null)
  - `stock_minimo_alerta >= 0` (o null)
  - `stock_deseado >= 0` (o null)
  - `stock_minimo_alerta <= stock_deseado` (si ambos existen)

## 4. Auditoria backend endpoint/modelo

Archivo: `ItemPython/services/item_service.py`

Obligatorio por codigo:
- `id_empresa` (UUID valido)
- `etiqueta` (o fallback desde `nombre`/`producto_ref`)

No obligatorios por codigo pero obligatorios por BD:
- `id_estado_compra`
- `id_tipo_control_caducidad`
- `id_tipo_control_inventario`
- `id_tipo_item`
- `id_naturaleza_item`
- `producto_ref` (por BD)

Mapeos detectados:
- `nombre -> etiqueta` (si `etiqueta` vacio)
- `codigo -> producto_ref`
- `largo -> longitud`
- `ancho -> anchura`
- `nota_privada -> nota_interna`
- `id_pais_origen -> id_pais`
- `id_provincia_origen -> id_provincia`
- alias cuentas:
  - `cuenta_venta -> id_cuenta_venta`
  - `cuenta_compra -> id_cuenta_compra`

Nota de tipos:
- `impuesto_id` se acepta como texto en backend, pero en BD es integer FK.

## 5. Auditoria gateway

Archivos:
- `gateway-api/src/routes/item.js`
- `gateway-api/src/services/itemPython.js`

Resultado:
- El gateway recibe y reenvia payload sin transformar nombres de creacion.
- El contexto de empresa puede resolverse por `X-Company-Id` segun scope.
- Endpoint destino correcto: `ItemPython /api/item`.

## 6. Auditoria frontend

Archivos:
- `frontReact/src/views/items/productos/NuevoProducto.tsx`
- `frontReact/src/views/items/servicios/NuevoServicio.tsx`
- `frontReact/src/views/items/utils/mapItemFormToCreateBody.ts`
- `frontReact/src/views/items/schemas/itemSchema.ts`
- `frontReact/src/views/items/secciones/SeccionItemGeneral.tsx`

Hallazgos:
- Front valida como requeridos solo:
  - `id_empresa`
  - `nombre`
  - `tipo_item`
- No valida obligatorios reales de BD (`id_estado_compra`, `id_tipo_control_*`, etc.).
- Para servicio, el formulario actual no persiste en servidor.
- En `SeccionItemGeneral`, algunos campos de catalogo se deshabilitan para servicio, pero BD los exige.

## 7. Reproduccion del error

Endpoint probado:
- `POST http://localhost:3002/api/item`

Payload base de servicio (minimo razonable) reproducido:
- `id_empresa`
- `producto_ref`
- `etiqueta`
- `estado`
- `inventariable=false`
- `precio_venta`
- `impuesto_id`
- `id_tipo_item=SERVICE`
- `id_estado_venta`
- `id_naturaleza_item`

Respuesta exacta:
- HTTP 409
- `null value in column "id_estado_compra" ... violates not-null constraint`

Secuencia comprobada:
1. Al agregar `id_estado_compra`, falla `id_tipo_control_caducidad`.
2. Al agregar `id_tipo_control_caducidad`, falla `id_tipo_control_inventario`.
3. Al agregar los tres, el alta responde `201` y crea item.

## 8. Campos obligatorios actuales por capa

Por base de datos:
- `producto_ref`, `id_tipo_item`, `id_estado_venta`, `id_estado_compra`, `id_naturaleza_item`, `id_tipo_control_inventario`, `id_tipo_control_caducidad`, mas campos tecnicos (`id_item`, fechas, estado, etc.).

Por backend:
- `id_empresa`, `etiqueta` (y UUID valido para campos presentes).

Por frontend:
- `id_empresa`, `nombre`, `tipo_item`.

Inconsistencia central:
- Frontend y backend no obligan varios campos que BD si obliga.

## 9. Analisis funcional

Para SERVICIO (criterio funcional):
- No deberia obligar inventario fisico (stock, peso, volumen, dimensiones).
- Si se exigen estados/controles, deben ser condicionales y coherentes con servicio.

Para PRODUCTO fisico:
- Puede requerir campos logisticos y controles de inventario/caducidad.

Diseno actualmente tensionado:
- `id_estado_compra`, `id_tipo_control_inventario`, `id_tipo_control_caducidad` son universales por BD, incluso para servicio.

## 10. Lista de hallazgos

1. Campo obligatorio no enviado: `id_estado_compra` (NotNullViolation).
2. Campo obligatorio no enviado: `id_tipo_control_caducidad` (NotNullViolation).
3. Campo obligatorio no enviado: `id_tipo_control_inventario` (NotNullViolation).
4. Desalineacion entre reglas frontend/backend y restricciones BD.
5. `NuevoServicio` no persiste actualmente (frontend-only).
6. Riesgo de tipo/mapeo en `impuesto_id` (string vs integer FK).
7. Riesgo de FK invalida en catalogos UUID (formato valido no garantiza existencia).

## 11. Plan de solucion propuesto (solo reporte)

Sin implementar cambios en esta auditoria.

Prioridad 1 (minima segura):
- Alinear validaciones frontend/backend con obligatorios reales de BD para evitar IntegrityError.

Prioridad 2 (correcta por tipo):
- Definir matriz de obligatoriedad por `tipo_item` (servicio vs producto) y aplicarla en todas las capas.

Prioridad 3 (ideal futura):
- Reglas dinamicas por negocio/tenant y contrato unico de validacion entre frontend-gateway-backend.


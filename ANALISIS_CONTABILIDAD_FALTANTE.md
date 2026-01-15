# Análisis: Funcionalidades Faltantes en Módulo de Contabilidad

## Resumen Ejecutivo

Este documento analiza las funcionalidades faltantes en el módulo de Contabilidad comparando:
1. Lo implementado actualmente
2. Lo definido en el schema SQL
3. Lo esperado según el menú
4. Funcionalidades de Dolibarr

---

## 1. ESTADO ACTUAL IMPLEMENTADO

### ✅ Implementado en ContabilidadNestJs (Solo Queries)
- **Cuenta Contable**: Queries básicas (findAll, findOne, findByTipo)
- **Asiento Contable**: Queries básicas (findAll, findOne, findByDateRange)
- **Balance General**: Entidad definida pero sin resolver/servicio

### ✅ Implementado en ContabilidadPython (Solo Mutations)
- **Cuenta Contable**: POST, PUT, DELETE
- **Asiento Contable**: POST, PUT, DELETE, aprobar
- **Movimiento Contable**: POST, PUT, DELETE (actualiza totales)
- **Balance General**: POST, PUT, DELETE, aprobar

---

## 2. TABLAS DEFINIDAS EN SCHEMA SQL (NO IMPLEMENTADAS)

### 🔴 Configuración
- `configuracion_contabilidad` - Configuración general
- `diario_contable` - Diarios contables (VENTAS, COMPRAS, BANCO, etc.)
- `modelo_plan_contable` - Modelos de planes contables
- `plan_contable` - Plan contable por empresa
- `periodo_contable` - Períodos contables (año/mes)
- `cuenta_contable_defecto` - Cuentas por defecto para operaciones
- `cuenta_bancaria` - Cuentas bancarias vinculadas
- `cuenta_iva` - Configuración de cuentas de IVA
- `cuenta_impuesto` - Configuración de cuentas de impuestos
- `cuenta_contable_producto` - Cuentas contables para productos
- `cierre_cuenta` - Cierre de cuentas por período
- `grupo_cuenta_personalizado` - Grupos personalizados de cuentas
- `cuenta_grupo_personalizado` - Relación cuenta-grupo

### 🔴 Operaciones Contables
- `libro_mayor` - Libro mayor por cuenta y período
- `saldo_cuenta` - Saldos de cuentas por período
- `documento_origen` - Documentos origen (facturas, pagos, etc.)
- `informe_contable` - Configuración de informes

### 🔴 Integración con Otros Módulos
- `factura` - Facturas (venta/compra)
- `factura_linea` - Líneas de factura
- `cotizacion` - Cotizaciones
- `cotizacion_linea` - Líneas de cotización
- `prefactura` - Prefacturas
- `prefactura_linea` - Líneas de prefactura
- `pago` - Pagos (cobros/pagos)
- `pago_factura` - Relación pago-factura
- `nota_credito` - Notas de crédito
- `nota_credito_linea` - Líneas de nota de crédito
- `retencion` - Retenciones (renta, IVA, etc.)

### 🔴 Bancos y Conciliación
- `conciliacion_bancaria` - Conciliación bancaria
- `movimiento_bancario` - Movimientos bancarios

### 🔴 Inventario
- `movimiento_inventario` - Movimientos de inventario con contabilidad

### 🔴 Contabilidad Analítica
- `centro_costo` - Centros de costo
- `movimiento_centro_costo` - Asignación de costos

### 🔴 Otros
- `tipo_cambio` - Tipos de cambio
- `cierre_contable` - Cierres contables (mensual/anual)
- `presupuesto` - Presupuestos
- `presupuesto_linea` - Líneas de presupuesto

---

## 3. FUNCIONALIDADES DEL MENÚ (NO IMPLEMENTADAS)

### 🔴 Configuración
1. **General** (`/contabilidad/configuracion/general`)
   - Configuración general de contabilidad
   - Formato de cuentas, separadores, etc.

2. **Diarios contables** (`/contabilidad/configuracion/diarios`)
   - CRUD de diarios contables
   - Tipos: VENTAS, COMPRAS, BANCO, EGRESOS, INGRESOS, CIERRE

3. **Modelos de planes contables** (`/contabilidad/configuracion/modelos-planes`)
   - CRUD de modelos de planes contables
   - Importar/exportar modelos

4. **Plan contable** (`/contabilidad/configuracion/plan-contable`)
   - CRUD de planes contables por empresa
   - Asignar modelo a empresa

5. **Plan de cuentas individuales** (`/contabilidad/configuracion/cuentas-individuales`)
   - Gestión de cuentas contables
   - Estructura jerárquica (cuentas padre/hijo)
   - Niveles de cuenta

6. **Período contable** (`/contabilidad/configuracion/periodo`)
   - CRUD de períodos contables
   - Abrir/cerrar períodos
   - Bloquear períodos

7. **Cuentas contables por defecto** (`/contabilidad/configuracion/cuentas-defecto`)
   - Configurar cuentas por defecto para operaciones
   - Tipos: VENTA, COMPRA, PAGO, COBRO, IVA_VENTA, IVA_COMPRA, etc.

8. **Cuentas Bancarias** (`/contabilidad/configuracion/cuentas-bancarias`)
   - CRUD de cuentas bancarias
   - Vincular con cuentas contables

9. **Cuentas de IVA** (`/contabilidad/configuracion/cuentas-iva`)
   - Configurar cuentas de IVA por porcentaje
   - VENTA_19, VENTA_5, COMPRA_19, COMPRA_5, RETENCION

10. **Cuentas de impuestos** (`/contabilidad/configuracion/cuentas-impuestos`)
    - Configurar cuentas de impuestos
    - RENTA, INDUSTRIA_COMERCIO, RETENCION, etc.

11. **Cuentas contables de productos** (`/contabilidad/configuracion/cuentas-productos`)
    - Configurar cuentas por tipo de producto
    - INVENTARIO, COSTO_VENTA, INGRESO_VENTA, DEVOLUCION

12. **Cerrar cuentas** (`/contabilidad/configuracion/cerrar-cuentas`)
    - Cerrar cuentas por período
    - Generar cierres contables

13. **Grupo personalizado de cuentas** (`/contabilidad/configuracion/grupos-personalizados`)
    - Crear grupos personalizados
    - Asignar cuentas a grupos

### 🔴 Transferencia en Contabilidad
1. **Contabilizar facturas a clientes** (`/contabilidad/transferencia/facturas-clientes`)
   - Listar facturas pendientes
   - Contabilizar facturas de venta
   - Generar asientos automáticos

2. **Contabilizar facturas de proveedores** (`/contabilidad/transferencia/facturas-proveedores`)
   - Listar facturas pendientes
   - Contabilizar facturas de compra
   - Generar asientos automáticos

3. **Registro en contabilidad**
   - **Ventas (Diario de ventas)** (`/contabilidad/transferencia/registro/ventas`)
   - **Compras (Diario de compras)** (`/contabilidad/transferencia/registro/compras`)
   - **Banco (Diario financiero)** (`/contabilidad/transferencia/registro/banco`)

4. **Exportar documentos de origen** (`/contabilidad/transferencia/exportar-documentos`)
   - Exportar documentos para contabilizar
   - Formatos: Excel, CSV, etc.

### 🔴 Contabilidad
1. **Libro Mayor** (`/contabilidad/libro-mayor`)
   - Visualizar libro mayor por cuenta
   - Filtrar por período
   - Exportar

2. **Diarios** (`/contabilidad/diarios`)
   - Listar diarios contables
   - Ver asientos por diario
   - Filtrar por fecha

3. **Saldo de la cuenta** (`/contabilidad/saldo-cuenta`)
   - Consultar saldos de cuentas
   - Filtrar por período
   - Ver movimientos

4. **Exportar contabilidad** (`/contabilidad/exportar`)
   - Exportar datos contables
   - Formatos: Excel, PDF, XML
   - Para declaraciones fiscales

5. **Cerrar** (`/contabilidad/cerrar`)
   - Cerrar período contable
   - Generar balances
   - Bloquear ediciones

6. **Informes** (`/contabilidad/informes`)
   - Balance General
   - Estado de Resultados
   - Flujo de Caja
   - Informes personalizados

---

## 4. FUNCIONALIDADES DE DOLIBARR (NO IMPLEMENTADAS)

### 🔴 Funcionalidades Core
1. **Contabilidad de partida doble**
   - ✅ Parcialmente implementado (asientos con debe/haber)
   - ❌ Falta validación de equilibrio automático

2. **Plan de cuentas personalizable**
   - ✅ Básico implementado (cuentas con jerarquía)
   - ❌ Falta importar/exportar planes contables
   - ❌ Falta modelos de planes por país

3. **Gestión de diarios**
   - ❌ No implementado
   - Falta CRUD de diarios
   - Falta asignar diarios a asientos

4. **Libro mayor y balances**
   - ❌ No implementado
   - Falta generación de libro mayor
   - Falta cálculo de saldos

5. **Automatización de declaraciones fiscales**
   - ❌ No implementado
   - Falta exportación para declaraciones
   - Falta formatos específicos por país

6. **Soporte multimoneda**
   - ❌ No implementado
   - Falta tabla tipo_cambio
   - Falta conversión automática

7. **Reconciliación bancaria**
   - ❌ No implementado
   - Falta conciliación bancaria
   - Falta importar extractos bancarios

### 🔴 Funcionalidades Avanzadas
1. **Contabilidad analítica**
   - ❌ No implementado
   - Falta centros de costo
   - Falta asignación de costos a movimientos

2. **Integración con facturación**
   - ❌ No implementado
   - Falta contabilización automática de facturas
   - Falta vinculación factura-asiento

3. **Integración con pagos**
   - ❌ No implementado
   - Falta contabilización automática de pagos
   - Falta vinculación pago-asiento

4. **Notas de crédito**
   - ❌ No implementado
   - Falta gestión de notas de crédito
   - Falta contabilización automática

5. **Retenciones**
   - ❌ No implementado
   - Falta gestión de retenciones
   - Falta contabilización automática

---

## 5. PRIORIZACIÓN DE FUNCIONALIDADES FALTANTES

### 🔴 CRÍTICO (Alta Prioridad)
1. **Diarios Contables**
   - CRUD completo
   - Asignar diarios a asientos
   - Resolver y servicio en NestJS
   - Rutas en Python

2. **Plan Contable y Cuentas**
   - Estructura jerárquica completa
   - Niveles de cuenta
   - Validación de códigos
   - Importar/exportar

3. **Períodos Contables**
   - CRUD completo
   - Abrir/cerrar períodos
   - Validar movimientos en períodos cerrados

4. **Libro Mayor**
   - Generación automática
   - Consultas por cuenta y período
   - Cálculo de saldos

5. **Saldo de Cuentas**
   - Cálculo automático
   - Consultas por período
   - Actualización en tiempo real

### 🟡 IMPORTANTE (Media Prioridad)
1. **Configuración General**
   - Configuración de contabilidad
   - Cuentas por defecto
   - Cuentas de IVA e impuestos

2. **Transferencia de Documentos**
   - Contabilización automática de facturas
   - Contabilización automática de pagos
   - Exportación de documentos

3. **Balance General y Estado de Resultados**
   - Generación automática
   - Configuración de informes
   - Exportación

4. **Cierre Contable**
   - Cerrar períodos
   - Generar balances de cierre
   - Bloquear ediciones

### 🟢 DESEABLE (Baja Prioridad)
1. **Contabilidad Analítica**
   - Centros de costo
   - Asignación de costos

2. **Multimoneda**
   - Tipos de cambio
   - Conversión automática

3. **Conciliación Bancaria**
   - Importar extractos
   - Conciliar movimientos

4. **Notas de Crédito y Retenciones**
   - Gestión completa
   - Contabilización automática

---

## 6. RECOMENDACIONES

### Fase 1: Fundamentos (2-3 semanas)
1. Implementar Diarios Contables
2. Completar Plan Contable (jerarquía, niveles)
3. Implementar Períodos Contables
4. Generar Libro Mayor
5. Calcular Saldos de Cuentas

### Fase 2: Configuración (1-2 semanas)
1. Configuración general
2. Cuentas por defecto
3. Cuentas de IVA e impuestos
4. Cuentas bancarias

### Fase 3: Integración (2-3 semanas)
1. Contabilización automática de facturas
2. Contabilización automática de pagos
3. Exportación de documentos
4. Cierre contable

### Fase 4: Avanzado (3-4 semanas)
1. Balance General y Estado de Resultados
2. Informes personalizados
3. Contabilidad analítica
4. Multimoneda
5. Conciliación bancaria

---

## 7. TABLAS QUE NECESITAN ENTIDADES Y SERVICIOS

### Backend (ContabilidadNestJs - Queries)
- `diario_contable`
- `modelo_plan_contable`
- `plan_contable`
- `periodo_contable`
- `cuenta_contable_defecto`
- `cuenta_bancaria`
- `cuenta_iva`
- `cuenta_impuesto`
- `libro_mayor`
- `saldo_cuenta`
- `documento_origen`
- `informe_contable`
- `cierre_contable`

### Backend (ContabilidadPython - Mutations)
- Todas las tablas anteriores (CRUD completo)
- Además de las ya implementadas

---

## 8. NOTAS IMPORTANTES

1. **Inconsistencia en IDs**: El schema SQL usa UUID pero las entidades actuales usan Integer. Necesita estandarización.

2. **Relación con Diarios**: Los asientos contables deben tener `id_diario_contable` pero actualmente no está en la entidad.

3. **Relación con Plan Contable**: Las cuentas contables deben pertenecer a un plan contable, pero actualmente no está implementado.

4. **Períodos Contables**: No hay validación de períodos en los asientos.

5. **Documentos Origen**: No hay trazabilidad de qué documento generó un asiento.

---

## CONCLUSIÓN

El módulo de Contabilidad tiene aproximadamente **30% de funcionalidades implementadas**. Faltan:
- **70% de funcionalidades básicas** (diarios, períodos, libro mayor, saldos)
- **100% de funcionalidades de configuración**
- **100% de funcionalidades de integración** (facturas, pagos)
- **100% de funcionalidades avanzadas** (analítica, multimoneda, conciliación)

**Prioridad inmediata**: Implementar Diarios, Plan Contable completo, Períodos y Libro Mayor.

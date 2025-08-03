# Integración Frontend React con InicioNestJS

Este documento explica cómo el frontend React ha sido actualizado para usar las consultas GraphQL de InicioNestJS.

## 🔧 Configuración Actualizada

### 1. Configuración de Apollo Client

El archivo `src/main.tsx` ha sido actualizado para conectar directamente a InicioNestJS:

```typescript
// Configuración para conectar directamente a InicioNestJS
const NESTJS_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3000';

// Configura el link HTTP para InicioNestJS
const httpLink = createHttpLink({
  uri: `${NESTJS_URL}/graphql`,
});
```

### 2. Variables de Entorno

Crear un archivo `.env` en el directorio `frontReact/`:

```env
# ===== CONFIGURACIÓN DE APIS =====
# InicioNestJS API URL (Vite usa prefijo VITE_)
VITE_GATEWAY_URL=http://localhost:3000

# ===== CONFIGURACIÓN DEL SERVIDOR =====
PORT=3001
```

## 📋 Componentes Actualizados

### 1. Lista de Sucursales (`Sucursales.tsx`) - **SOLUCIONADO CACHE**

**Funcionalidades:**
- ✅ Consulta GraphQL para obtener todas las sucursales
- ✅ Mutaciones para eliminar y cambiar estado
- ✅ Loading states y manejo de errores
- ✅ DataGrid con ReactTable
- ✅ Botón de actualizar datos
- ✅ **Recarga automática al regresar a la página**
- ✅ **Muestra nombre de empresa en lugar de ID**

**Solución para el problema de cache:**
```typescript
// Usar useLazyQuery con fetchPolicy cache-and-network
const [getSucursales, { loading: queryLoading }] = useLazyQuery(GET_SUCURSALES, {
  fetchPolicy: 'cache-and-network', // Siempre consultar red y caché
  errorPolicy: 'all',
});

// Recargar datos cuando regrese a la página
useEffect(() => {
  if (location.pathname === '/sucursales') {
    console.log('🔄 Regresando a la página de sucursales, recargando datos...');
    loadSucursales();
  }
}, [location.pathname]);
```

**Consultas utilizadas:**
```graphql
query {
  sucursales {
    id_sucursal
    nombre
    direccion
    telefono
    estado
    codigo_establecimiento
    created_at
    updated_at
    empresa {
      id_empresa
      nombre
      ruc
    }
  }
}
```

**Columnas del DataGrid:**
- ✅ **Empresa** - Nombre de la empresa (en lugar de ID)
- ✅ **Nombre** - Nombre de la sucursal
- ✅ **Dirección** - Dirección de la sucursal
- ✅ **Teléfono** - Teléfono de la sucursal
- ✅ **Código** - Código de establecimiento
- ✅ **Estado** - Estado activo/inactivo
- ✅ **Creado** - Fecha de creación
- ✅ **Acciones** - Botones de editar, cambiar estado, eliminar

### 2. Nueva Sucursal (`NuevaSucursal.tsx`) - **ACTUALIZADO**

**Funcionalidades:**
- ✅ **Selector de empresas** con combo dropdown
- ✅ Formulario con validaciones
- ✅ Mutación GraphQL para crear sucursal
- ✅ Validación de código de establecimiento (3 dígitos)
- ✅ Manejo de errores y éxito
- ✅ Solo muestra empresas activas
- ✅ **Sin refetchQueries** - confía en recarga manual

**Consultas utilizadas:**
```graphql
# Obtener empresas para el selector
query {
  empresas {
    id_empresa
    nombre
    ruc
    estado
  }
}

# Crear sucursal
mutation CrearSucursal(
  $id_empresa: ID!
  $nombre: String!
  $direccion: String
  $telefono: String
  $codigo_establecimiento: String
) {
  crearSucursal(
    id_empresa: $id_empresa
    nombre: $nombre
    direccion: $direccion
    telefono: $telefono
    codigo_establecimiento: $codigo_establecimiento
  ) {
    id_sucursal
    nombre
    direccion
    telefono
    estado
    codigo_establecimiento
  }
}
```

**Características del Selector de Empresas:**
- ✅ **Combo dropdown** con todas las empresas activas
- ✅ **Filtrado automático** - solo muestra empresas con `estado: true`
- ✅ **Información completa** - muestra nombre y RUC de la empresa
- ✅ **Validación** - campo requerido antes de crear sucursal
- ✅ **UX mejorada** - placeholder "Seleccione una empresa"

### 3. Editar Sucursal (`EditarSucursal.tsx`) - **ACTUALIZADO**

**Funcionalidades:**
- ✅ Consulta GraphQL para obtener sucursal específica
- ✅ Formulario pre-poblado con datos de la sucursal
- ✅ Mutación para actualizar sucursal
- ✅ **Información detallada de la empresa** relacionada
- ✅ Loading states y manejo de errores
- ✅ **Sin refetchQueries** - confía en recarga manual

**Consultas utilizadas:**
```graphql
# Obtener sucursal con información de empresa
query GetSucursal($id_sucursal: ID!) {
  sucursal(id_sucursal: $id_sucursal) {
    id_sucursal
    nombre
    direccion
    telefono
    estado
    codigo_establecimiento
    empresa {
      id_empresa
      nombre
      ruc
      estado
    }
  }
}

# Actualizar sucursal
mutation ActualizarSucursal(
  $id_sucursal: ID!
  $nombre: String
  $direccion: String
  $telefono: String
  $estado: Boolean
  $codigo_establecimiento: String
) {
  actualizarSucursal(
    id_sucursal: $id_sucursal
    nombre: $nombre
    direccion: $direccion
    telefono: $telefono
    estado: $estado
    codigo_establecimiento: $codigo_establecimiento
  ) {
    id_sucursal
    nombre
    direccion
    telefono
    estado
    codigo_establecimiento
  }
}
```

**Información de Empresa en Edición:**
- ✅ **Alert informativo** con datos de la empresa
- ✅ **Nombre y RUC** de la empresa
- ✅ **Estado de la empresa** con badge visual
- ✅ **Diseño mejorado** con iconos y layout

## 🚀 Cómo Ejecutar

### 1. Iniciar InicioNestJS

```bash
cd InicioNestJs
npm install
npm run start:dev
```

El servidor estará disponible en: `http://localhost:3000`

### 2. Iniciar Frontend React

```bash
cd frontReact
npm install
npm run dev
```

El frontend estará disponible en: `http://localhost:3001`

### 3. Verificar Conexión

- Abrir el navegador en `http://localhost:3001`
- Navegar a la sección de Sucursales
- Verificar que los datos se cargan desde InicioNestJS
- **Probar el selector de empresas** en "Nueva Sucursal"
- **Verificar que las nuevas sucursales aparecen** en el DataGrid
- **Verificar que se muestra el nombre de la empresa** en lugar del ID

## 📊 Características Implementadas

### ✅ Funcionalidades Completas

1. **Lista de Sucursales - SOLUCIONADO:**
   - DataGrid con ReactTable
   - Filtrado y ordenamiento
   - Acciones: Editar, Eliminar, Cambiar Estado
   - Loading states y manejo de errores
   - Contador de registros
   - **Recarga automática al regresar a la página**
   - **Muestra nombre de empresa en lugar de ID**

2. **Crear Sucursal - NUEVO:**
   - **Selector de empresas** con combo dropdown
   - Formulario con validaciones
   - Validación de código de establecimiento
   - Integración con GraphQL
   - Redirección automática
   - **Solo empresas activas** en el selector
   - **Sin problemas de cache**

3. **Editar Sucursal - MEJORADO:**
   - Carga automática de datos
   - Formulario pre-poblado
   - **Información detallada de empresa** relacionada
   - Validaciones en tiempo real
   - **Alert informativo** con datos de empresa
   - **Sin problemas de cache**

4. **Gestión de Estados:**
   - Activar/Desactivar sucursales
   - Eliminación con confirmación
   - Feedback visual de acciones

### 🔧 Mejoras Técnicas

1. **Apollo Client:**
   - Configuración optimizada
   - Manejo de errores robusto
   - **Cache controlado** con `fetchPolicy: 'cache-and-network'`
   - **Recarga manual** en lugar de `refetchQueries`

2. **TypeScript:**
   - Interfaces tipadas
   - Validación de tipos
   - Autocompletado mejorado

3. **UX/UI:**
   - Loading spinners
   - Mensajes de error claros
   - Confirmaciones de acciones
   - Feedback visual inmediato
   - **Selectores intuitivos**
   - **Información más legible** (nombre de empresa vs ID)

## 🎯 Casos de Uso

### Para DataGrid con Cache Controlado:
```typescript
// Usar useLazyQuery para control manual del cache
const [getSucursales, { loading }] = useLazyQuery(GET_SUCURSALES, {
  fetchPolicy: 'cache-and-network',
  errorPolicy: 'all',
});

// Recargar manualmente
const loadSucursales = async () => {
  const { data } = await getSucursales();
  setSucursales(data?.sucursales || []);
};
```

### Para Modificación:
```typescript
const { loading, error, data } = useQuery(GET_SUCURSAL, {
  variables: { id_sucursal: id }
});
```

### Para Crear con Selector de Empresas:
```typescript
// Obtener empresas para el selector
const { loading, error, data } = useQuery(GET_EMPRESAS);

// Filtrar solo empresas activas
const empresasActivas = data?.empresas?.filter(empresa => empresa.estado) || [];

// Crear sucursal sin refetchQueries
const [crearSucursal] = useMutation(CREAR_SUCURSAL);
```

## 🔍 Debugging

### GraphQL Playground
Acceder a: `http://localhost:3000/graphql`

### Console Logs
Los componentes incluyen logging detallado para debugging.

### Network Tab
Verificar las consultas GraphQL en las herramientas de desarrollador.

## 📝 Notas Importantes

1. **Puertos:**
   - InicioNestJS: `3000`
   - Frontend React: `3001`

2. **Variables de Entorno:**
   - Asegurar que `VITE_GATEWAY_URL` apunte a InicioNestJS

3. **Base de Datos:**
   - Verificar que InicioNestJS esté conectado a la base de datos
   - Asegurar que la tabla `sucursal` esté actualizada
   - **Verificar que existan empresas activas** para el selector

4. **CORS:**
   - InicioNestJS debe tener CORS configurado para permitir requests desde `localhost:3001`

5. **Selector de Empresas:**
   - Solo muestra empresas con `estado: true`
   - Muestra nombre y RUC de la empresa
   - Campo requerido antes de crear sucursal

6. **Solución de Cache:**
   - **Problema:** Apollo Client no actualizaba el cache después de crear/editar
   - **Solución:** Usar `useLazyQuery` con `fetchPolicy: 'cache-and-network'`
   - **Resultado:** Recarga automática al regresar a la página de sucursales

7. **DataGrid Mejorado:**
   - **Cambio:** Muestra nombre de empresa en lugar de ID
   - **Beneficio:** Información más legible y útil para el usuario
   - **Fallback:** "Sin empresa" si no hay empresa asociada

## 🚀 Próximos Pasos

1. ✅ **Integrar selector de empresas** en el formulario de nueva sucursal
2. ✅ **Solucionar problema de cache** de Apollo Client
3. ✅ **Mostrar nombre de empresa** en lugar de ID en DataGrid
4. **Agregar paginación** en la lista de sucursales
5. **Implementar búsqueda avanzada** con filtros
6. **Agregar exportación** de datos
7. **Implementar notificaciones** en tiempo real
8. **Agregar validación de códigos únicos** por empresa 
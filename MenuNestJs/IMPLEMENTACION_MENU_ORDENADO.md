# Implementación del Menú Lateral Ordenado

## 📋 Resumen

Se han creado los resolvers necesarios para implementar un menú lateral ordenado jerárquicamente en el servicio MenuNestJs. Esta implementación permite crear menús con estructura de árbol respetando el orden definido en la base de datos.

## 🎯 Nuevos Resolvers Implementados

### 1. `menuPrincipalOrdenado`
- **Query**: `menuPrincipalOrdenado(id_seccion: ID!): [MenuItemOrdenado!]!`
- **Función**: Obtiene los items principales (sin parent_id) de una sección ordenados por `orden ASC`
- **SQL equivalente**: 
  ```sql
  SELECT * FROM menu_item 
  WHERE id_seccion = ? AND parent_id IS NULL AND estado = true 
  ORDER BY orden ASC;
  ```

### 2. `submenusOrdenados`
- **Query**: `submenusOrdenados(parent_id: ID!): [MenuItemOrdenado!]!`
- **Función**: Obtiene los submenús de un item específico ordenados por `orden ASC`
- **SQL equivalente**:
  ```sql
  SELECT * FROM menu_item 
  WHERE parent_id = ? AND estado = true 
  ORDER BY orden ASC;
  ```

### 3. `menuLateralOrdenado`
- **Query**: `menuLateralOrdenado(id_seccion: ID!): MenuLateralOrdenado!`
- **Función**: Obtiene el menú lateral completo con estructura jerárquica ordenada
- **Combina**: Menú principal + submenús en una estructura de árbol

## 🗂️ Archivos Modificados

### 1. **Tipos GraphQL** (`src/types/graphql.types.ts`)
- ✅ `MenuItemOrdenado`: Estructura completa del item del menú
- ✅ `MenuLateralOrdenado`: Estructura del menú lateral ordenado

### 2. **Entidad MenuItem** (`src/entities/menu-item.entity.ts`)
- ✅ Agregado campo `parent_id` para soporte jerárquico

### 3. **Servicio de Autorización** (`src/services/autorizacion.service.ts`)
- ✅ `obtenerMenuPrincipalOrdenado()`: Obtiene items principales ordenados
- ✅ `obtenerSubmenusOrdenados()`: Obtiene submenús ordenados
- ✅ `obtenerMenuLateralOrdenado()`: Construye menú jerárquico completo

### 4. **Resolver de Autorización** (`src/resolvers/autorizacion.resolver.ts`)
- ✅ `menuPrincipalOrdenado`: Resolver para items principales
- ✅ `submenusOrdenados`: Resolver para submenús
- ✅ `menuLateralOrdenado`: Resolver para menú completo

## 🗄️ Migraciones de Base de Datos

### 1. **Agregar columna parent_id**
```sql
-- Ejecutar: migrations/add-parent-id-to-menu-item.sql
ALTER TABLE menu_item ADD COLUMN parent_id UUID NULL;
CREATE INDEX idx_menu_item_parent_id ON menu_item(parent_id);
```

### 2. **Datos de ejemplo**
```sql
-- Ejecutar: migrations/example-hierarchical-menu-data.sql
-- Crea estructura jerárquica de ejemplo para la sección de Administración
```

## 🚀 Cómo Usar

### 1. **Ejecutar migraciones**
```bash
# Conectar a la base de datos PostgreSQL
psql -h localhost -U tu_usuario -d tu_base_de_datos

# Ejecutar migración
\i migrations/add-parent-id-to-menu-item.sql

# Ejecutar datos de ejemplo (opcional)
\i migrations/example-hierarchical-menu-data.sql
```

### 2. **Reiniciar el servicio MenuNestJs**
```bash
cd MenuNestJs
npm run start:dev
```

### 3. **Probar las consultas GraphQL**

#### Obtener menú principal ordenado:
```graphql
query {
  menuPrincipalOrdenado(id_seccion: "29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1") {
    id_item
    etiqueta
    ruta
    icono
    orden
    parent_id
  }
}
```

#### Obtener submenús de un item:
```graphql
query {
  submenusOrdenados(parent_id: "4269c173-112e-4592-9bf7-3496a68fd84a") {
    id_item
    etiqueta
    ruta
    icono
    orden
  }
}
```

#### Obtener menú lateral completo:
```graphql
query {
  menuLateralOrdenado(id_seccion: "29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1") {
    id_seccion
    nombre
    orden
    icono
    items {
      id_item
      etiqueta
      ruta
      icono
      orden
      children {
        id_item
        etiqueta
        ruta
        icono
        orden
      }
    }
  }
}
```

## 🔧 Estructura de Datos

### Jerarquía del Menú:
```
Administración (Sección)
├── Empresa (Item Principal - orden: 1)
│   ├── Lista de Empresas (Submenú - orden: 1)
│   ├── Nueva Empresa (Submenú - orden: 2)
│   └── Configuración (Submenú - orden: 3)
├── Sucursal (Item Principal - orden: 2)
│   ├── Lista de Sucursales (Submenú - orden: 1)
│   ├── Nueva Sucursal (Submenú - orden: 2)
│   └── Mapa de Sucursales (Submenú - orden: 3)
└── ... (más items principales)
```

## 🎨 Frontend Integration

El frontend ya está configurado para usar estos resolvers:

1. **usePermissions hook** - Configurado para usar `menuClient`
2. **Sidebar component** - Renderiza estructura jerárquica
3. **Apollo Client** - Configurado para MenuNestJs (puerto 3003)

## 🐛 Debugging

### Logs del Backend:
- `🔍 DEBUG - obtenerMenuPrincipalOrdenado`
- `🔍 DEBUG - obtenerSubmenusOrdenados`
- `🔍 DEBUG - obtenerMenuLateralOrdenado`

### Logs del Frontend:
- `🔍 DEBUG - usePermissions - Cargando menú lateral ordenado`
- `🔍 DEBUG - Sidebar - menuLateralOrdenado`

## ⚠️ Notas Importantes

1. **Cache**: Las consultas tienen cache de 5 minutos para mejorar rendimiento
2. **Orden**: Los items se ordenan por la columna `orden` en orden ascendente
3. **Jerarquía**: Solo se soporta un nivel de submenús (padre → hijo)
4. **Estado**: Solo se muestran items con `estado = true`

## 🔄 Próximos Pasos

1. Ejecutar las migraciones en la base de datos
2. Reiniciar el servicio MenuNestJs
3. Probar las consultas GraphQL
4. Verificar que el frontend carga el menú ordenado correctamente

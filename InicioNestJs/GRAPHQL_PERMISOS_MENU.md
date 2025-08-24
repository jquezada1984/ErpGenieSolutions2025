# GraphQL - Permisos de Menú por Perfil

## Descripción
Este documento describe todas las consultas y mutaciones GraphQL disponibles para gestionar los permisos de menú por perfil en el sistema.

## Entidad
```sql
CREATE TABLE IF NOT EXISTS perfil_menu_permiso (
  id_perfil uuid NOT NULL REFERENCES perfil(id_perfil),
  id_item uuid NOT NULL REFERENCES menu_item(id_item),
  permitido boolean NOT NULL DEFAULT true,
  PRIMARY KEY (id_perfil, id_item)
);
```

## Consultas Disponibles

### 1. Obtener Todos los Permisos
```graphql
query {
  permisosMenu {
    id_perfil
    id_item
    permitido
    perfil {
      id_perfil
      nombre
      estado
    }
    menuItem {
      id_item
      etiqueta
      ruta
      icono
      estado
      seccion {
        nombre
        orden
      }
    }
  }
}
```

### 2. Obtener Lista Simplificada de Permisos
```graphql
query {
  permisosMenuLista {
    id_perfil
    id_item
    permitido
    nombrePerfil
    etiquetaMenuItem
    nombreSeccion
  }
}
```

### 3. Obtener Permiso Específico
```graphql
query {
  permisoMenu(id_perfil: "uuid-del-perfil", id_item: "uuid-del-item") {
    id_perfil
    id_item
    permitido
    perfil {
      nombre
    }
    menuItem {
      etiqueta
    }
  }
}
```

### 4. Obtener Permisos por Perfil
```graphql
query {
  permisosPorPerfil(id_perfil: "uuid-del-perfil") {
    id_perfil
    id_item
    permitido
    perfil {
      nombre
    }
    menuItem {
      etiqueta
      ruta
      seccion {
        nombre
        orden
      }
    }
  }
}
```

### 5. Obtener Permisos por Item de Menú
```graphql
query {
  permisosPorMenuItem(id_item: "uuid-del-item") {
    id_perfil
    id_item
    permitido
    perfil {
      nombre
      estado
    }
    menuItem {
      etiqueta
    }
  }
}
```

### 6. Resumen de Permisos por Perfil
```graphql
query {
  resumenPermisosPorPerfil(id_perfil: "uuid-del-perfil") {
    id_perfil
    nombrePerfil
    totalPermisos
    permisosActivos
    permisos {
      id_item
      permitido
      menuItem {
        etiqueta
        seccion {
          nombre
        }
      }
    }
  }
}
```

### 7. Resumen de Permisos por Item de Menú
```graphql
query {
  resumenPermisosPorMenuItem(id_item: "uuid-del-item") {
    id_item
    etiquetaMenuItem
    totalPerfiles
    perfilesConPermiso
    permisos {
      id_perfil
      permitido
      perfil {
        nombre
        estado
      }
    }
  }
}
```

### 8. Obtener Solo Permisos Activos
```graphql
query {
  permisosActivos {
    id_perfil
    id_item
    permitido
    perfil {
      nombre
      estado
    }
    menuItem {
      etiqueta
      ruta
      estado
    }
  }
}
```

## Mutaciones Disponibles

### 1. Crear Permiso Individual
```graphql
mutation {
  crearPermisoMenu(
    id_perfil: "uuid-del-perfil"
    id_item: "uuid-del-item"
    permitido: true
  ) {
    id_perfil
    id_item
    permitido
  }
}
```

### 2. Actualizar Permiso
```graphql
mutation {
  actualizarPermisoMenu(
    id_perfil: "uuid-del-perfil"
    id_item: "uuid-del-item"
    permitido: false
  ) {
    id_perfil
    id_item
    permitido
  }
}
```

### 3. Eliminar Permiso
```graphql
mutation {
  eliminarPermisoMenu(
    id_perfil: "uuid-del-perfil"
    id_item: "uuid-del-item"
  )
}
```

### 4. Crear Permisos Masivos
```graphql
mutation {
  crearPermisosMasivos(
    id_perfil: "uuid-del-perfil"
    ids_items: ["uuid-item-1", "uuid-item-2", "uuid-item-3"]
    permitido: true
  ) {
    id_perfil
    id_item
    permitido
  }
}
```

### 5. Cambiar Estado de Todos los Permisos de un Perfil
```graphql
mutation {
  cambiarEstadoPermisosPerfil(
    id_perfil: "uuid-del-perfil"
    permitido: false
  )
}
```

### 6. Cambiar Estado de Todos los Permisos de un Item
```graphql
mutation {
  cambiarEstadoPermisosMenuItem(
    id_item: "uuid-del-item"
    permitido: true
  )
}
```

## Casos de Uso Comunes

### 1. Asignar Permisos a un Nuevo Perfil
```graphql
# Primero crear el perfil
mutation {
  crearPerfil(
    id_empresa: "uuid-empresa"
    nombre: "Administrador"
    descripcion: "Perfil con acceso completo"
  ) {
    id_perfil
    nombre
  }
}

# Luego asignar permisos masivos
mutation {
  crearPermisosMasivos(
    id_perfil: "uuid-perfil-creado"
    ids_items: ["item-1", "item-2", "item-3"]
    permitido: true
  ) {
    id_perfil
    id_item
    permitido
  }
}
```

### 2. Verificar Permisos de un Usuario
```graphql
query {
  permisosPorPerfil(id_perfil: "uuid-del-usuario") {
    permitido
    menuItem {
      etiqueta
      ruta
      seccion {
        nombre
      }
    }
  }
}
```

### 3. Auditoría de Permisos
```graphql
query {
  permisosMenuLista {
    nombrePerfil
    etiquetaMenuItem
    nombreSeccion
    permitido
  }
}
```

### 4. Deshabilitar Acceso a un Módulo
```graphql
# Obtener todos los items de una sección
query {
  permisosPorMenuItem(id_item: "uuid-item-seccion") {
    id_perfil
    perfil {
      nombre
    }
  }
}

# Luego deshabilitar para todos los perfiles
mutation {
  cambiarEstadoPermisosMenuItem(
    id_item: "uuid-item-seccion"
    permitido: false
  )
}
```

## Estructura de Respuesta

### PerfilMenuPermisoDto
```typescript
{
  id_perfil: string
  id_item: string
  permitido: boolean
  perfil?: {
    id_perfil: string
    nombre: string
    estado: boolean
  }
  menuItem?: {
    id_item: string
    etiqueta: string
    ruta?: string
    icono?: string
    estado: boolean
  }
}
```

### PerfilMenuPermisoListDto
```typescript
{
  id_perfil: string
  id_item: string
  permitido: boolean
  nombrePerfil: string
  etiquetaMenuItem: string
  nombreSeccion?: string
}
```

## Notas Importantes

1. **Clave Primaria Compuesta**: La tabla usa `(id_perfil, id_item)` como clave primaria
2. **Relaciones**: Se mantienen relaciones con `perfil` y `menu_item`
3. **Estado por Defecto**: Los permisos se crean como `permitido: true` por defecto
4. **Validaciones**: Se verifica que no existan permisos duplicados
5. **Ordenamiento**: Los resultados se ordenan por perfil, sección y orden del item
6. **Filtros**: Se pueden filtrar por estado activo de perfiles e items

## Ejemplos de Integración Frontend

### React Hook con Apollo Client
```typescript
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_PERMISOS_POR_PERFIL = gql`
  query GetPermisosPorPerfil($id_perfil: ID!) {
    permisosPorPerfil(id_perfil: $id_perfil) {
      id_item
      permitido
      menuItem {
        etiqueta
        ruta
        seccion {
          nombre
        }
      }
    }
  }
`;

const CREAR_PERMISO = gql`
  mutation CrearPermiso($id_perfil: ID!, $id_item: ID!, $permitido: Boolean!) {
    crearPermisoMenu(
      id_perfil: $id_perfil
      id_item: $id_item
      permitido: $permitido
    ) {
      id_perfil
      id_item
      permitido
    }
  }
`;

// Uso en componente
function GestionarPermisos({ idPerfil }: { idPerfil: string }) {
  const { data, loading, error } = useQuery(GET_PERMISOS_POR_PERFIL, {
    variables: { id_perfil: idPerfil }
  });

  const [crearPermiso] = useMutation(CREAR_PERMISO);

  // ... resto del componente
}
```

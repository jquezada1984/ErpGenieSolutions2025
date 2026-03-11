# Consultas GraphQL para Sucursal

Este documento describe las consultas y mutaciones GraphQL disponibles para el manejo de sucursales en el sistema ERP.

## 📋 Consultas Disponibles

### 1. Obtener Todas las Sucursales (Para DataGrid)

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
  }
}
```

**Uso:** Para poblar un DataGrid con todas las sucursales del sistema.

### 2. Obtener Sucursal por ID (Para Modificación)

```graphql
query GetSucursal($id_sucursal: ID!) {
  sucursal(id_sucursal: $id_sucursal) {
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
    }
  }
}
```

**Uso:** Para obtener los detalles completos de una sucursal específica, incluyendo la relación con la empresa.

### 3. Obtener Sucursales por Empresa

```graphql
query GetSucursalesPorEmpresa($id_empresa: ID!) {
  sucursalesPorEmpresa(id_empresa: $id_empresa) {
    id_sucursal
    nombre
    direccion
    telefono
    estado
    codigo_establecimiento
    created_at
    updated_at
  }
}
```

**Uso:** Para filtrar sucursales por empresa específica.

## 🔧 Mutaciones Disponibles

### 1. Crear Sucursal

```graphql
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

**Variables de ejemplo:**
```json
{
  "id_empresa": "uuid-de-la-empresa",
  "nombre": "Sucursal Centro",
  "direccion": "Av. Principal 123",
  "telefono": "123456789",
  "codigo_establecimiento": "001"
}
```

### 2. Actualizar Sucursal

```graphql
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

### 3. Eliminar Sucursal

```graphql
mutation EliminarSucursal($id_sucursal: ID!) {
  eliminarSucursal(id_sucursal: $id_sucursal)
}
```

### 4. Cambiar Estado de Sucursal

```graphql
mutation CambiarEstadoSucursal($id_sucursal: ID!, $estado: Boolean!) {
  cambiarEstadoSucursal(id_sucursal: $id_sucursal, estado: $estado)
}
```

## 🎯 Casos de Uso Específicos

### Para DataGrid (Frontend React)

```typescript
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_SUCURSALES = gql`
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
    }
  }
`;

const SucursalesDataGrid = () => {
  const { loading, error, data } = useQuery(GET_SUCURSALES);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <DataGrid
      rows={data.sucursales}
      columns={[
        { field: 'nombre', headerName: 'Nombre', width: 200 },
        { field: 'direccion', headerName: 'Dirección', width: 300 },
        { field: 'telefono', headerName: 'Teléfono', width: 150 },
        { field: 'codigo_establecimiento', headerName: 'Código', width: 100 },
        { 
          field: 'estado', 
          headerName: 'Estado', 
          width: 100,
          renderCell: (params) => (
            <span style={{ color: params.value ? 'green' : 'red' }}>
              {params.value ? 'Activo' : 'Inactivo'}
            </span>
          )
        }
      ]}
    />
  );
};
```

### Para Formulario de Modificación

```typescript
import { useQuery, useMutation } from '@apollo/client';

const GET_SUCURSAL = gql`
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
      }
    }
  }
`;

const ACTUALIZAR_SUCURSAL = gql`
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
`;

const EditarSucursal = ({ idSucursal }) => {
  const { loading, error, data } = useQuery(GET_SUCURSAL, {
    variables: { id_sucursal: idSucursal }
  });
  
  const [actualizarSucursal] = useMutation(ACTUALIZAR_SUCURSAL, {
    refetchQueries: [{ query: GET_SUCURSALES }]
  });

  const handleSubmit = async (formData) => {
    try {
      await actualizarSucursal({
        variables: {
          id_sucursal: idSucursal,
          ...formData
        }
      });
      alert('Sucursal actualizada exitosamente');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input defaultValue={data.sucursal.nombre} name="nombre" />
      <input defaultValue={data.sucursal.direccion} name="direccion" />
      <input defaultValue={data.sucursal.telefono} name="telefono" />
      <input defaultValue={data.sucursal.codigo_establecimiento} name="codigo_establecimiento" />
      <button type="submit">Actualizar</button>
    </form>
  );
};
```

## 📊 Estructura de Datos

### SucursalListDto (Para DataGrid)
```typescript
{
  id_sucursal: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  estado: boolean;
  codigo_establecimiento: string;
  created_at: Date;
  updated_at: Date;
}
```

### Sucursal Completa (Para Modificación)
```typescript
{
  id_sucursal: string;
  id_empresa: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  estado: boolean;
  codigo_establecimiento: string;
  created_at: Date;
  updated_at: Date;
  empresa?: {
    id_empresa: string;
    nombre: string;
  };
}
```

## 🔍 Logging y Debugging

El resolver incluye logging detallado para debugging:

- `🔍 Query sucursales ejecutada` - Inicio de consulta
- `✅ X sucursales encontradas` - Resultado exitoso
- `❌ Error en query sucursales` - Error en consulta
- `🔧 Creando sucursal` - Inicio de creación
- `✅ Sucursal creada exitosamente` - Creación exitosa

## 🚀 Endpoints Disponibles

- **GraphQL Playground:** `http://localhost:3000/graphql`
- **Consultas:** `POST /graphql`
- **Introspection:** Habilitada para exploración automática

## 📝 Notas Importantes

1. **Código de Establecimiento:** Debe ser exactamente 3 dígitos (ej: "001", "002")
2. **Estado por Defecto:** Las nuevas sucursales se crean con `estado: true`
3. **Relaciones:** La consulta individual incluye la relación con la empresa
4. **Timestamps:** `created_at` y `updated_at` se manejan automáticamente
5. **Validaciones:** El backend valida el formato del código de establecimiento 
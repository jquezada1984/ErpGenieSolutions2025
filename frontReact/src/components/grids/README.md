# Sistema de Grids - Action Table Format

Este sistema proporciona un formato consistente para todas las tablas de datos en la aplicación.

## Archivos

- `BaseGrid.tsx` - Componente base reutilizable para todos los grids
- `_grids.scss` - Estilos generales para todos los grids
- `index.ts` - Exportaciones de componentes

## Uso del BaseGrid

```tsx
import { BaseGrid } from '../components/grids';

const MyGrid = () => {
  const columns = [
    { Header: 'Nombre', accessor: 'nombre' },
    { Header: 'Email', accessor: 'email' },
    { 
      Header: 'Estado', 
      accessor: 'estado',
      Cell: ({ value }) => (
        <Badge className={`status-badge ${value ? 'active' : 'inactive'}`}>
          {value ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    {
      Header: 'Acciones',
      accessor: 'actions',
      Cell: ({ original }) => (
        <div className="grid-action-buttons text-center">
          <Button size="sm" color="info" onClick={() => handleEdit(original)}>
            <i className="bi bi-pencil-fill"></i>
          </Button>
          <Button size="sm" color="danger" onClick={() => handleDelete(original.id)}>
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      )
    }
  ];

  return (
    <BaseGrid
      title="Mi Grid"
      data={myData}
      columns={columns}
      loading={loading}
      error={error}
      onErrorDismiss={() => setError(null)}
      onNewClick={() => navigate('/nuevo')}
      newButtonText="Nuevo Item"
      newButtonIcon="bi-plus-circle"
    />
  );
};
```

## Clases CSS Disponibles

### Contenedores
- `.grid-container` - Contenedor principal del grid
- `.grid-header` - Encabezado con título y acciones
- `.grid-actions` - Contenedor de botones de acción

### Botones
- `.grid-primary-button` - Botón principal (Nuevo, etc.)
- `.grid-action-buttons` - Contenedor de botones de acción en filas

### Estados
- `.status-badge.active` - Badge para estado activo
- `.status-badge.inactive` - Badge para estado inactivo
- `.status-badge.pending` - Badge para estado pendiente

### Estados de Carga
- `.grid-loading` - Estado de carga
- `.grid-empty` - Estado sin datos

## Convenciones

1. **Iconos**: Usar Bootstrap Icons (bi-*)
2. **Botones de acción**: Tamaño sm, con tooltips
3. **Badges de estado**: Usar las clases status-badge
4. **Paginación**: Habilitada por defecto
5. **Responsive**: Las tablas se adaptan automáticamente

## Ejemplo Completo

Ver `Empresas.tsx` para un ejemplo completo de implementación. 
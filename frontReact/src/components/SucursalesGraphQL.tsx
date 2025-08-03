import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Card, CardBody, CardTitle, Button, Alert, Container, Row, Col, Badge, Spinner } from 'reactstrap';

// Consultas GraphQL para Sucursal
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
      empresa {
        id_empresa
        nombre
        ruc
      }
    }
  }
`;

const GET_SUCURSAL = gql`
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
        ruc
        estado
      }
    }
  }
`;

const GET_SUCURSALES_POR_EMPRESA = gql`
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
      empresa {
        id_empresa
        nombre
        ruc
      }
    }
  }
`;

// Consulta GraphQL para obtener empresas
const GET_EMPRESAS = gql`
  query {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

// Mutaciones GraphQL para Sucursal
const CREAR_SUCURSAL = gql`
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

const ELIMINAR_SUCURSAL = gql`
  mutation EliminarSucursal($id_sucursal: ID!) {
    eliminarSucursal(id_sucursal: $id_sucursal)
  }
`;

const CAMBIAR_ESTADO_SUCURSAL = gql`
  mutation CambiarEstadoSucursal($id_sucursal: ID!, $estado: Boolean!) {
    cambiarEstadoSucursal(id_sucursal: $id_sucursal, estado: $estado)
  }
`;

const SucursalesGraphQL = () => {
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('');
  const [selectedSucursal, setSelectedSucursal] = useState<string>('');
  const [formData, setFormData] = useState({
    id_empresa: '',
    nombre: '',
    direccion: '',
    telefono: '',
    codigo_establecimiento: '001'
  });

  // Consultas
  const { loading: loadingSucursales, error: errorSucursales, data: sucursalesData } = useQuery(GET_SUCURSALES);
  const { loading: loadingSucursal, error: errorSucursal, data: sucursalData } = useQuery(GET_SUCURSAL, {
    variables: { id_sucursal: selectedSucursal },
    skip: !selectedSucursal
  });
  const { loading: loadingSucursalesEmpresa, error: errorSucursalesEmpresa, data: sucursalesEmpresaData } = useQuery(GET_SUCURSALES_POR_EMPRESA, {
    variables: { id_empresa: selectedEmpresa },
    skip: !selectedEmpresa
  });
  const { loading: loadingEmpresas, error: errorEmpresas, data: empresasData } = useQuery(GET_EMPRESAS);

  // Mutaciones
  const [crearSucursal, { loading: creatingSucursal }] = useMutation(CREAR_SUCURSAL, {
    refetchQueries: [{ query: GET_SUCURSALES }]
  });
  const [actualizarSucursal, { loading: updatingSucursal }] = useMutation(ACTUALIZAR_SUCURSAL, {
    refetchQueries: [{ query: GET_SUCURSALES }]
  });
  const [eliminarSucursal, { loading: deletingSucursal }] = useMutation(ELIMINAR_SUCURSAL, {
    refetchQueries: [{ query: GET_SUCURSALES }]
  });
  const [cambiarEstadoSucursal, { loading: changingEstado }] = useMutation(CAMBIAR_ESTADO_SUCURSAL, {
    refetchQueries: [{ query: GET_SUCURSALES }]
  });

  // Función para crear sucursal
  const handleCrearSucursal = async () => {
    if (!formData.id_empresa || !formData.nombre.trim()) {
      alert('Debe seleccionar una empresa y ingresar un nombre');
      return;
    }

    try {
      await crearSucursal({
        variables: {
          id_empresa: formData.id_empresa,
          nombre: formData.nombre.trim(),
          direccion: formData.direccion.trim() || null,
          telefono: formData.telefono.trim() || null,
          codigo_establecimiento: formData.codigo_establecimiento
        }
      });
      alert('Sucursal creada exitosamente');
      // Limpiar formulario
      setFormData({
        id_empresa: '',
        nombre: '',
        direccion: '',
        telefono: '',
        codigo_establecimiento: '001'
      });
    } catch (error) {
      console.error('Error creando sucursal:', error);
      alert('Error al crear sucursal');
    }
  };

  // Función para actualizar sucursal
  const handleActualizarSucursal = async () => {
    if (!selectedSucursal) return;
    
    try {
      await actualizarSucursal({
        variables: {
          id_sucursal: selectedSucursal,
          nombre: 'Sucursal Actualizada',
          direccion: 'Nueva dirección',
          telefono: '987654321'
        }
      });
      alert('Sucursal actualizada exitosamente');
    } catch (error) {
      console.error('Error actualizando sucursal:', error);
      alert('Error al actualizar sucursal');
    }
  };

  // Función para eliminar sucursal
  const handleEliminarSucursal = async () => {
    if (!selectedSucursal) return;
    
    if (window.confirm('¿Estás seguro de que quieres eliminar esta sucursal?')) {
      try {
        await eliminarSucursal({
          variables: { id_sucursal: selectedSucursal }
        });
        alert('Sucursal eliminada exitosamente');
        setSelectedSucursal('');
      } catch (error) {
        console.error('Error eliminando sucursal:', error);
        alert('Error al eliminar sucursal');
      }
    }
  };

  // Función para cambiar estado de sucursal
  const handleCambiarEstado = async (idSucursal: string, nuevoEstado: boolean) => {
    try {
      await cambiarEstadoSucursal({
        variables: {
          id_sucursal: idSucursal,
          estado: nuevoEstado
        }
      });
      alert(`Estado de sucursal cambiado a ${nuevoEstado ? 'activo' : 'inactivo'}`);
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error al cambiar estado');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loadingSucursales) return <p>Cargando sucursales...</p>;
  if (errorSucursales) return <p>Error: {errorSucursales.message}</p>;

  // Filtrar solo empresas activas
  const empresasActivas = empresasData?.empresas?.filter((empresa: any) => empresa.estado) || [];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Sucursales (GraphQL) - InicioNestJS</h2>
      
      {/* Sección de crear sucursal */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Crear Nueva Sucursal</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
          <div>
            <label>Empresa *</label>
            <select 
              value={formData.id_empresa} 
              onChange={handleInputChange}
              name="id_empresa"
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="">Seleccione empresa</option>
              {empresasActivas.map((empresa: any) => (
                <option key={empresa.id_empresa} value={empresa.id_empresa}>
                  {empresa.nombre} - {empresa.ruc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Nombre *</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={handleInputChange}
              name="nombre"
              placeholder="Nombre sucursal"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div>
            <label>Dirección</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={handleInputChange}
              name="direccion"
              placeholder="Dirección"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div>
            <label>Código</label>
            <input
              type="text"
              value={formData.codigo_establecimiento}
              onChange={handleInputChange}
              name="codigo_establecimiento"
              placeholder="001"
              maxLength={3}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <Button onClick={handleCrearSucursal} disabled={creatingSucursal || !formData.id_empresa || !formData.nombre.trim()}>
            {creatingSucursal ? 'Creando...' : 'Crear'}
          </Button>
        </div>
      </div>
      
      {/* Sección de acciones */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Acciones</h3>
        <Button onClick={handleActualizarSucursal} disabled={updatingSucursal || !selectedSucursal}>
          {updatingSucursal ? 'Actualizando...' : 'Actualizar Sucursal'}
        </Button>
        <Button onClick={handleEliminarSucursal} disabled={deletingSucursal || !selectedSucursal}>
          {deletingSucursal ? 'Eliminando...' : 'Eliminar Sucursal'}
        </Button>
      </div>

      {/* Lista de sucursales */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Lista de Sucursales ({sucursalesData?.sucursales?.length || 0})</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Empresa</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Nombre</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Dirección</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Teléfono</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Estado</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Código</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sucursalesData?.sucursales.map((sucursal: any) => (
              <tr key={sucursal.id_sucursal} 
                  style={{ backgroundColor: selectedSucursal === sucursal.id_sucursal ? '#f0f0f0' : 'white' }}
                  onClick={() => setSelectedSucursal(sucursal.id_sucursal)}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{sucursal.empresa?.nombre || 'Sin empresa'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{sucursal.nombre}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{sucursal.direccion || '-'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{sucursal.telefono || '-'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <span style={{ color: sucursal.estado ? 'green' : 'red' }}>
                    {sucursal.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{sucursal.codigo_establecimiento}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCambiarEstado(sucursal.id_sucursal, !sucursal.estado);
                    }}
                    disabled={changingEstado}
                  >
                    {sucursal.estado ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detalles de sucursal seleccionada */}
      {selectedSucursal && (
        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>Detalles de Sucursal</h3>
          {loadingSucursal ? (
            <p>Cargando detalles...</p>
          ) : errorSucursal ? (
            <p>Error: {errorSucursal.message}</p>
          ) : sucursalData?.sucursal ? (
            <div>
              <p><strong>ID:</strong> {sucursalData.sucursal.id_sucursal}</p>
              <p><strong>Nombre:</strong> {sucursalData.sucursal.nombre}</p>
              <p><strong>Dirección:</strong> {sucursalData.sucursal.direccion || 'No especificada'}</p>
              <p><strong>Teléfono:</strong> {sucursalData.sucursal.telefono || 'No especificado'}</p>
              <p><strong>Estado:</strong> {sucursalData.sucursal.estado ? 'Activo' : 'Inactivo'}</p>
              <p><strong>Código Establecimiento:</strong> {sucursalData.sucursal.codigo_establecimiento}</p>
              {sucursalData.sucursal.empresa && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                  <p><strong>Empresa:</strong> {sucursalData.sucursal.empresa.nombre}</p>
                  <p><strong>RUC:</strong> {sucursalData.sucursal.empresa.ruc}</p>
                  <p><strong>Estado Empresa:</strong> {sucursalData.sucursal.empresa.estado ? 'Activa' : 'Inactiva'}</p>
                </div>
              )}
              <p><strong>Creado:</strong> {new Date(sucursalData.sucursal.created_at).toLocaleString()}</p>
              <p><strong>Actualizado:</strong> {new Date(sucursalData.sucursal.updated_at).toLocaleString()}</p>
            </div>
          ) : (
            <p>No se encontró la sucursal</p>
          )}
        </div>
      )}

      {/* Filtro por empresa */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Filtrar por Empresa</h3>
        <select
          value={selectedEmpresa}
          onChange={(e) => setSelectedEmpresa(e.target.value)}
          style={{ marginRight: '10px', padding: '8px' }}
        >
          <option value="">Seleccione empresa</option>
          {empresasActivas.map((empresa: any) => (
            <option key={empresa.id_empresa} value={empresa.id_empresa}>
              {empresa.nombre} - {empresa.ruc}
            </option>
          ))}
        </select>
        {selectedEmpresa && (
          <div>
            <h4>Sucursales de la Empresa</h4>
            {loadingSucursalesEmpresa ? (
              <p>Cargando sucursales de empresa...</p>
            ) : errorSucursalesEmpresa ? (
              <p>Error: {errorSucursalesEmpresa.message}</p>
            ) : (
              <ul>
                {sucursalesEmpresaData?.sucursalesPorEmpresa.map((sucursal: any) => (
                  <li key={sucursal.id_sucursal}>
                    {sucursal.nombre} - {sucursal.codigo_establecimiento}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SucursalesGraphQL; 
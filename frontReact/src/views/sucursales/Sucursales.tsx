import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Alert, Container, Row, Col, Badge, Spinner } from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { useLazyQuery, useMutation, gql } from '@apollo/client';

// Consultas GraphQL
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

interface Sucursal {
  id_sucursal: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  estado: boolean;
  codigo_establecimiento: string;
  created_at: string;
  updated_at: string;
  empresa?: {
    id_empresa: string;
    nombre: string;
    ruc: string;
  };
}

const Sucursales: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // GraphQL hooks
  const [getSucursales, { loading: queryLoading }] = useLazyQuery(GET_SUCURSALES, {
    fetchPolicy: 'cache-and-network', // Siempre consultar red y caché
    errorPolicy: 'all',
  });

  // Mutaciones GraphQL
  const [eliminarSucursal] = useMutation(ELIMINAR_SUCURSAL);
  const [cambiarEstadoSucursal] = useMutation(CAMBIAR_ESTADO_SUCURSAL);

  useEffect(() => {
    loadSucursales();
  }, []);

  // Recargar datos cuando regrese a la página de sucursales
  useEffect(() => {
    if (location.pathname === '/sucursales') {
      console.log('🔄 Regresando a la página de sucursales, recargando datos...');
      loadSucursales();
    }
  }, [location.pathname]);

  const loadSucursales = async () => {
    try {
      console.log('🔄 Cargando sucursales...');
      setLoading(true);
      setError(null);
      
      const { data } = await getSucursales();
      console.log('📊 Datos recibidos:', data);
      
      if (data && data.sucursales) {
        setSucursales(data.sucursales);
        console.log(`✅ ${data.sucursales.length} sucursales cargadas`);
        console.log('📋 Sucursales:', data.sucursales);
      } else {
        console.log('⚠️ No se recibieron datos de sucursales');
        setSucursales([]);
      }
    } catch (error: any) {
      console.error('❌ Error cargando sucursales:', error);
      console.error('❌ Error completo:', JSON.stringify(error, null, 2));
      setSucursales([]);
      
      setError('Error al cargar las sucursales: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaSucursal = () => {
    navigate('/sucursales/nueva');
  };

  const handleEdit = (sucursal: Sucursal) => {
    navigate(`/sucursales/editar/${sucursal.id_sucursal}`);
  };

  const handleDelete = async (idSucursal: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta sucursal?')) {
      try {
        await eliminarSucursal({
          variables: { id_sucursal: idSucursal }
        });
        setSuccess('Sucursal eliminada exitosamente');
        setError(null);
        loadSucursales(); // Recargar datos después de eliminar
      } catch (error: any) {
        console.error('Error eliminando sucursal:', error);
        setError('Error al eliminar la sucursal: ' + (error.message || 'Error desconocido'));
        setSuccess(null);
      }
    }
  };

  const handleToggleEstado = async (sucursal: Sucursal) => {
    try {
      await cambiarEstadoSucursal({
        variables: {
          id_sucursal: sucursal.id_sucursal,
          estado: !sucursal.estado
        }
      });
      setSuccess(`Sucursal ${!sucursal.estado ? 'activada' : 'desactivada'} exitosamente`);
      setError(null);
      loadSucursales(); // Recargar datos después de cambiar estado
    } catch (error: any) {
      console.error('Error cambiando estado:', error);
      setError('Error al cambiar el estado de la sucursal: ' + (error.message || 'Error desconocido'));
      setSuccess(null);
    }
  };

  // Preparar datos para la tabla
  const tableData = sucursales.map((sucursal: Sucursal) => ({
    id_sucursal: sucursal.id_sucursal,
    nombre: sucursal.nombre,
    direccion: sucursal.direccion || '-',
    telefono: sucursal.telefono || '-',
    codigo_establecimiento: sucursal.codigo_establecimiento,
    empresa: sucursal.empresa?.nombre || 'Sin empresa',
    estado: (
      <Badge 
        color={sucursal.estado ? 'success' : 'danger'}
        className={`status-badge ${sucursal.estado ? 'active' : 'inactive'}`}
      >
        {sucursal.estado ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
    created_at: new Date(sucursal.created_at).toLocaleDateString('es-ES'),
    actions: (
      <div className="grid-action-buttons text-center">
        <Button
          onClick={() => handleEdit(sucursal)}
          color="info"
          size="sm"
          className="me-2"
          title="Editar"
        >
          <i className="bi bi-pencil-fill"></i>
        </Button>
        <Button
          onClick={() => handleToggleEstado(sucursal)}
          color={sucursal.estado ? 'warning' : 'success'}
          size="sm"
          className="me-2"
          title={sucursal.estado ? 'Desactivar' : 'Activar'}
        >
          <i className={`bi bi-${sucursal.estado ? 'pause' : 'play'}-fill`}></i>
        </Button>
        <Button
          onClick={() => handleDelete(sucursal.id_sucursal)}
          color="danger"
          size="sm"
          title="Eliminar"
        >
          <i className="bi bi-trash"></i>
        </Button>
      </div>
    ),
  }));

  const columns = [
    { Header: 'Empresa', accessor: 'empresa', filterable: true, width: 200 },
    { Header: 'Nombre', accessor: 'nombre', filterable: true },
    { Header: 'Dirección', accessor: 'direccion', filterable: true },
    { Header: 'Teléfono', accessor: 'telefono', filterable: true },
    { Header: 'Código', accessor: 'codigo_establecimiento', width: 80 },
    { Header: 'Estado', accessor: 'estado', filterable: true, width: 100 },
    { Header: 'Creado', accessor: 'created_at', width: 100 },
    { Header: 'Acciones', accessor: 'actions', sortable: false, filterable: false, width: 150 },
  ];

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="grid-header">
                <CardTitle tag="h4" className="grid-title">
                  Sucursales ({sucursales.length})
                </CardTitle>
                <div className="grid-actions">
                  <Button color="primary" className="grid-primary-button" onClick={handleNuevaSucursal}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Nueva Sucursal
                  </Button>
                  <Button color="secondary" className="ms-2" onClick={loadSucursales}>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Actualizar
                  </Button>
                </div>
              </div>

              {error && (
                <Alert color="danger" fade={false} isOpen={!!error} toggle={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert color="success" fade={false} isOpen={!!success} toggle={() => setSuccess(null)}>
                  {success}
                </Alert>
              )}

              <div className="grid-container">
                <ReactTable
                  data={tableData}
                  columns={columns}
                  defaultPageSize={10}
                  className="-striped -highlight"
                  loading={loading}
                  showPagination={true}
                  showPageSizeOptions={true}
                  pageSizeOptions={[5, 10, 20, 50]}
                  showPageJump={true}
                  collapseOnSortingChange={true}
                  collapseOnPageChange={true}
                  collapseOnDataChange={true}
                  noDataText="No hay sucursales disponibles"
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Sucursales; 
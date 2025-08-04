import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Alert, Container, Row, Col, Badge, Spinner } from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { useLazyQuery, gql } from '@apollo/client';
import { eliminarPerfil, cambiarEstadoPerfil } from '../../_apis_/perfil';

// Consultas GraphQL para InicioNestJS (solo lectura)
const GET_PERFILES = gql`
  query {
    perfiles {
      id_perfil
      nombre
      descripcion
      estado
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

interface Perfil {
  id_perfil: string;
  nombre: string;
  descripcion?: string;
  estado: boolean;
  created_at: string;
  updated_at: string;
  empresa?: {
    id_empresa: string;
    nombre: string;
    ruc: string;
  };
}

const Perfiles: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // GraphQL hooks para InicioNestJS (solo lectura)
  const [getPerfiles, { loading: queryLoading, data, refetch }] = useLazyQuery(GET_PERFILES, {
    fetchPolicy: 'cache-and-network', // Siempre consultar red y caché
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (location.pathname === '/perfiles') {
      refetch();
    }
  }, [location.pathname, refetch]);

  useEffect(() => {
    if (data) {
      setPerfiles(data.perfiles || []);
    }
  }, [data]);

  const handleNuevoPerfil = () => {
    navigate('/perfiles/nuevo');
  };

  const handleEdit = (perfil: Perfil) => {
    navigate(`/perfiles/editar/${perfil.id_perfil}`);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await eliminarPerfil(id);
      
      // Recargar datos después de eliminar
      refetch();
      setSuccess('Perfil eliminado exitosamente usando InicioPython');
    } catch (error: any) {
      setError('Error al eliminar el perfil: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEstado = async (id: string, nuevoEstado: boolean) => {
    try {
      setLoading(true);
      setError(null);
      
      await cambiarEstadoPerfil(id, nuevoEstado);
      
      // Recargar datos después de cambiar estado
      refetch();
      setSuccess(`Perfil ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente usando InicioPython`);
    } catch (error: any) {
      setError('Error al cambiar el estado del perfil: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  // Preparar datos para la tabla
  const tableData = perfiles.map((perfil: Perfil) => ({
    id_perfil: perfil.id_perfil,
    nombre: perfil.nombre,
    descripcion: perfil.descripcion || '-',
    empresa: perfil.empresa?.nombre || 'Sin empresa',
    estado: (
      <Badge 
        color={perfil.estado ? 'success' : 'danger'}
        className={`status-badge ${perfil.estado ? 'active' : 'inactive'}`}
      >
        {perfil.estado ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
    created_at: new Date(perfil.created_at).toLocaleDateString('es-ES'),
    actions: (
      <div className="grid-action-buttons text-center">
        <Button
          onClick={() => handleEdit(perfil)}
          color="info"
          size="sm"
          className="me-2"
          title="Editar"
        >
          <i className="bi bi-pencil-fill"></i>
        </Button>
        <Button
          onClick={() => handleToggleEstado(perfil.id_perfil, !perfil.estado)}
          color={perfil.estado ? 'warning' : 'success'}
          size="sm"
          className="me-2"
          title={perfil.estado ? 'Desactivar' : 'Activar'}
        >
          <i className={`bi bi-${perfil.estado ? 'pause' : 'play'}-fill`}></i>
        </Button>
        <Button
          onClick={() => handleDelete(perfil.id_perfil)}
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
    { Header: 'Descripción', accessor: 'descripcion', filterable: true },
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
                  Perfiles ({perfiles.length})
                </CardTitle>
                <div className="grid-actions">
                  <Button color="primary" className="grid-primary-button" onClick={handleNuevoPerfil}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Nuevo Perfil
                  </Button>
                  <Button color="secondary" className="ms-2" onClick={refetch}>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Actualizar
                  </Button>
                </div>
              </div>

                      {error && (
                        <Alert color="danger" fade={false} isOpen={!!error} toggle={() => setError(null)} timeout={0}>
                          {error}
                        </Alert>
                      )}

                      {success && (
                        <Alert color="success" fade={false} isOpen={!!success} toggle={() => setSuccess(null)} timeout={0}>
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
                  noDataText="No hay perfiles disponibles"
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Perfiles; 
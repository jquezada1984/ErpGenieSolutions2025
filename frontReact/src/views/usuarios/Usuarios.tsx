import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Alert, Container, Row, Col, Badge, Spinner } from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { useLazyQuery, gql } from '@apollo/client';
import { eliminarUsuario, cambiarEstadoUsuario } from '../../_apis_/usuario';

// Consultas GraphQL para InicioNestJS (solo lectura)
const GET_USUARIOS = gql`
  query {
    usuarios {
      id_usuario
      username
      nombre_completo
      email
      estado
      created_at
      updated_at
      empresa {
        id_empresa
        nombre
        ruc
      }
      perfil {
        id_perfil
        nombre
        descripcion
      }
    }
  }
`;

interface Usuario {
  id_usuario: string;
  username: string;
  nombre_completo?: string;
  email?: string;
  estado: boolean;
  created_at: string;
  updated_at?: string;
  empresa?: {
    id_empresa: string;
    nombre: string;
    ruc: string;
  };
  perfil?: {
    id_perfil: string;
    nombre: string;
    descripcion?: string;
  };
}

const Usuarios: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // GraphQL hooks para InicioNestJS (solo lectura)
  const [getUsuarios, { loading: queryLoading, data, refetch }] = useLazyQuery(GET_USUARIOS, {
    fetchPolicy: 'cache-and-network', // Siempre consultar red y caché
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (location.pathname === '/usuarios') {
      refetch();
    }
  }, [location.pathname, refetch]);

  useEffect(() => {
    if (data) {
      setUsuarios(data.usuarios || []);
    }
  }, [data]);

  // Actualizar loading cuando cambia queryLoading
  useEffect(() => {
    setLoading(queryLoading);
  }, [queryLoading]);

  const handleNuevoUsuario = () => {
    navigate('/usuarios/nuevo');
  };

  const handleEdit = (usuario: Usuario) => {
    navigate(`/usuarios/editar/${usuario.id_usuario}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      try {
        setLoading(true);
        setError(null);
        
        await eliminarUsuario(id);
        
        // Recargar datos después de eliminar
        refetch();
        setSuccess('Usuario eliminado exitosamente');
      } catch (error: any) {
        setError('Error al eliminar el usuario: ' + (error.message || 'Error desconocido'));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleEstado = async (id: string, nuevoEstado: boolean) => {
    try {
      setLoading(true);
      setError(null);
      
      await cambiarEstadoUsuario(id, nuevoEstado);
      
      // Recargar datos después de cambiar estado
      refetch();
      setSuccess(`Usuario ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`);
    } catch (error: any) {
      setError('Error al cambiar el estado del usuario: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  // Preparar datos para la tabla
  const tableData = usuarios.map(usuario => ({
    id_usuario: usuario.id_usuario,
    username: usuario.username,
    nombre_completo: usuario.nombre_completo || '-',
    email: usuario.email || '-',
    empresa: usuario.empresa?.nombre || 'Sin empresa',
    perfil: usuario.perfil?.nombre || 'Sin perfil',
    estado: (
      <Badge 
        color={usuario.estado ? 'success' : 'danger'}
        className={`status-badge ${usuario.estado ? 'active' : 'inactive'}`}
      >
        {usuario.estado ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
    created_at: new Date(usuario.created_at).toLocaleDateString('es-ES'),
    actions: (
      <div className="grid-action-buttons text-center">
        <Button
          onClick={() => handleEdit(usuario)}
          color="info"
          size="sm"
          className="me-2"
          title="Editar"
        >
          <i className="bi bi-pencil-fill"></i>
        </Button>
        <Button
          onClick={() => handleToggleEstado(usuario.id_usuario, !usuario.estado)}
          color={usuario.estado ? 'warning' : 'success'}
          size="sm"
          className="me-2"
          title={usuario.estado ? 'Desactivar' : 'Activar'}
        >
          <i className={`bi bi-${usuario.estado ? 'pause' : 'play'}-fill`}></i>
        </Button>
        <Button
          onClick={() => handleDelete(usuario.id_usuario)}
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
    { Header: 'Username', accessor: 'username', filterable: true, width: 120 },
    { Header: 'Nombre Completo', accessor: 'nombre_completo', filterable: true },
    { Header: 'Email', accessor: 'email', filterable: true, width: 200 },
    { Header: 'Empresa', accessor: 'empresa', filterable: true, width: 150 },
    { Header: 'Perfil', accessor: 'perfil', filterable: true, width: 150 },
    { Header: 'Estado', accessor: 'estado', filterable: true, width: 100 },
    { Header: 'Creado', accessor: 'created_at', filterable: false, width: 120 },
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
                  Usuarios ({usuarios.length})
                </CardTitle>
                <div className="grid-actions">
                  <Button color="primary" className="grid-primary-button" onClick={handleNuevoUsuario}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Nuevo Usuario
                  </Button>
                  <Button color="secondary" className="ms-2" onClick={refetch}>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Actualizar
                  </Button>
                </div>
              </div>

              {loading && (
                <div className="text-center mb-3">
                  <Spinner color="primary" size="sm" />
                  <span className="ms-2">Cargando usuarios...</span>
                </div>
              )}

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
                  showPagination={true}
                  showPageSizeOptions={true}
                  pageSizeOptions={[5, 10, 20, 50]}
                  showPageJump={true}
                  collapseOnSortingChange={true}
                  collapseOnPageChange={true}
                  collapseOnDataChange={true}
                  noDataText="No hay usuarios disponibles"
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Usuarios;




import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Alert, Container, Row, Col } from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLazyQuery, gql } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { eliminarSeccion } from '../../_apis_/menu';

// GraphQL queries
const GET_MENU_SECCIONES = gql`
  query GetMenuSecciones {
    secciones {
      id_seccion
      nombre
      orden
      icono
    }
  }
`;

interface MenuSeccion {
  id_seccion: string;
  nombre: string;
  orden: number;
  icono?: string;
}

const Menus: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [secciones, setSecciones] = useState<MenuSeccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // GraphQL hooks
  const [getSecciones, { loading: seccionesLoading, data: seccionesData, refetch: refetchSecciones }] = useLazyQuery(GET_MENU_SECCIONES, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (location.pathname === '/menus') {
      refetchSecciones();
    }
  }, [location.pathname, refetchSecciones]);

  useEffect(() => {
    if (seccionesData) {
      setSecciones(seccionesData.secciones || []);
    }
  }, [seccionesData]);

  useEffect(() => {
    if (seccionesLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [seccionesLoading]);

  const handleNuevaSeccion = () => {
    navigate('/menus/nuevo');
  };

  const handleEditSeccion = (seccion: MenuSeccion) => {
    navigate(`/menus/seccion/editar/${seccion.id_seccion}`);
  };

  const handleDeleteSeccion = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta sección?')) {
      try {
        await eliminarSeccion(id);
        setSuccess('Sección eliminada exitosamente');
        refetchSecciones();
      } catch (err: any) {
        setError(err.message || 'Error al eliminar la sección');
      }
    }
  };

  const seccionesTableData = secciones.map((seccion) => ({
    id_seccion: seccion.id_seccion,
    nombre: seccion.nombre,
    orden: seccion.orden,
    icono: seccion.icono ? (
      <div className="text-center">
        <i className={`${seccion.icono} me-2`}></i>
        <small className="text-muted">{seccion.icono}</small>
      </div>
    ) : (
      <div className="text-center text-muted">
        <small>Sin icono</small>
      </div>
    ),
    actions: (
      <div className="grid-action-buttons text-center">
        <Button
          onClick={() => handleEditSeccion(seccion)}
          color="info"
          size="sm"
          className="me-2"
          title="Editar"
        >
          <i className="bi bi-pencil-fill"></i>
        </Button>
        <Button
          onClick={() => handleDeleteSeccion(seccion.id_seccion)}
          color="danger"
          size="sm"
          title="Eliminar"
        >
          <i className="bi bi-trash"></i>
        </Button>
      </div>
    ),
  }));


  const seccionesColumns = [
    { Header: 'ID', accessor: 'id_seccion', width: 200 },
    { Header: 'Nombre', accessor: 'nombre', filterable: true },
    { Header: 'Orden', accessor: 'orden', width: 80 },
    { Header: 'Icono', accessor: 'icono', sortable: false, filterable: false, width: 150 },
    { Header: 'Acciones', accessor: 'actions', sortable: false, filterable: false, width: 120 },
  ];


  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="grid-header">
                <CardTitle tag="h4" className="grid-title">
                  Gestión de Menús
                </CardTitle>
              <div className="grid-actions">
                <Button color="primary" className="grid-primary-button" onClick={handleNuevaSeccion}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Nueva Sección
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
                {loading ? (
                  <div className="text-center p-4">
                    <i className="bi bi-hourglass-split fs-1"></i>
                    <p>Cargando secciones...</p>
                  </div>
                ) : (
                  <ReactTable
                    data={seccionesTableData}
                    columns={seccionesColumns}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    showPagination={true}
                    showPageSizeOptions={true}
                    pageSizeOptions={[5, 10, 20, 50]}
                    showPageJump={true}
                    collapseOnSortingChange={true}
                    collapseOnPageChange={true}
                    collapseOnDataChange={true}
                  />
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Menus; 
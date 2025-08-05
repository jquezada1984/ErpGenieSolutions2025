import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Alert, Container, Row, Col, Badge, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLazyQuery, gql } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { eliminarSeccion, eliminarItem } from '../../_apis_/menu';

// GraphQL queries
const GET_MENU_SECCIONES = gql`
  query GetMenuSecciones {
    secciones {
      id_seccion
      nombre
      orden
    }
  }
`;

const GET_MENU_ITEMS = gql`
  query GetMenuItems {
    items {
      id_item
      id_seccion
      parent_id
      etiqueta
      icono
      ruta
      es_clickable
      orden
      muestra_badge
      badge_text
      estado
      seccion {
        id_seccion
        nombre
        orden
      }
    }
  }
`;

interface MenuSeccion {
  id_seccion: string;
  nombre: string;
  orden: number;
}

interface MenuItem {
  id_item: string;
  id_seccion: string;
  parent_id?: string;
  etiqueta: string;
  icono?: string;
  ruta?: string;
  es_clickable: boolean;
  orden: number;
  muestra_badge: boolean;
  badge_text?: string;
  estado: boolean;
  seccion?: MenuSeccion;
  children?: MenuItem[];
}

const Menus: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('1');
  const [secciones, setSecciones] = useState<MenuSeccion[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // GraphQL hooks
  const [getSecciones, { loading: seccionesLoading, data: seccionesData, refetch: refetchSecciones }] = useLazyQuery(GET_MENU_SECCIONES, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const [getItems, { loading: itemsLoading, data: itemsData, refetch: refetchItems }] = useLazyQuery(GET_MENU_ITEMS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (location.pathname === '/menus') {
      refetchSecciones();
      refetchItems();
    }
  }, [location.pathname, refetchSecciones, refetchItems]);

  useEffect(() => {
    if (seccionesData) {
      setSecciones(seccionesData.secciones || []);
    }
  }, [seccionesData]);

  useEffect(() => {
    if (itemsData) {
      setItems(itemsData.items || []);
    }
  }, [itemsData]);

  useEffect(() => {
    if (seccionesLoading || itemsLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [seccionesLoading, itemsLoading]);

  const handleNuevaSeccion = () => {
    navigate('/menus/seccion/nueva');
  };

  const handleNuevoItem = () => {
    navigate('/menus/item/nuevo');
  };

  const handleEditSeccion = (seccion: MenuSeccion) => {
    navigate(`/menus/seccion/editar/${seccion.id_seccion}`);
  };

  const handleEditItem = (item: MenuItem) => {
    navigate(`/menus/item/editar/${item.id_item}`);
  };

  const handleDeleteSeccion = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta sección?')) {
      try {
        await eliminarSeccion(id);
        setSuccess('Sección eliminada exitosamente');
        refetchSecciones();
        refetchItems();
      } catch (err: any) {
        setError(err.message || 'Error al eliminar la sección');
      }
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este item?')) {
      try {
        await eliminarItem(id);
        setSuccess('Item eliminado exitosamente');
        refetchSecciones();
        refetchItems();
      } catch (err: any) {
        setError(err.message || 'Error al eliminar el item');
      }
    }
  };

  const seccionesTableData = secciones.map((seccion) => ({
    id_seccion: seccion.id_seccion,
    nombre: seccion.nombre,
    orden: seccion.orden,
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

  const itemsTableData = items.map((item) => ({
    id_item: item.id_item,
    etiqueta: item.etiqueta,
    seccion: item.seccion?.nombre || 'Sin sección',
    ruta: item.ruta || '-',
    icono: item.icono ? <i className={item.icono}></i> : '-',
    orden: item.orden,
    estado: (
      <Badge 
        color={item.estado ? 'success' : 'danger'}
        className={`status-badge ${item.estado ? 'active' : 'inactive'}`}
      >
        {item.estado ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
    actions: (
      <div className="grid-action-buttons text-center">
        <Button
          onClick={() => handleEditItem(item)}
          color="info"
          size="sm"
          className="me-2"
          title="Editar"
        >
          <i className="bi bi-pencil-fill"></i>
        </Button>
        <Button
          onClick={() => handleDeleteItem(item.id_item)}
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
    { Header: 'Acciones', accessor: 'actions', sortable: false, filterable: false, width: 120 },
  ];

  const itemsColumns = [
    { Header: 'ID', accessor: 'id_item', width: 200 },
    { Header: 'Etiqueta', accessor: 'etiqueta', filterable: true },
    { Header: 'Sección', accessor: 'seccion', filterable: true },
    { Header: 'Ruta', accessor: 'ruta', filterable: true },
    { Header: 'Icono', accessor: 'icono', filterable: false },
    { Header: 'Orden', accessor: 'orden', width: 80 },
    { Header: 'Estado', accessor: 'estado', filterable: true },
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
                  <Button color="success" className="me-2" onClick={handleNuevaSeccion}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Nueva Sección
                  </Button>
                  <Button color="primary" className="grid-primary-button" onClick={handleNuevoItem}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Nuevo Item
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

              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={activeTab === '1' ? 'active' : ''}
                    onClick={() => setActiveTab('1')}
                  >
                    <i className="bi bi-list-ul me-2"></i>
                    Secciones ({secciones.length})
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === '2' ? 'active' : ''}
                    onClick={() => setActiveTab('2')}
                  >
                    <i className="bi bi-menu-button-wide me-2"></i>
                    Items ({items.length})
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
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
                </TabPane>
                <TabPane tabId="2">
                  <div className="grid-container">
                    {loading ? (
                      <div className="text-center p-4">
                        <i className="bi bi-hourglass-split fs-1"></i>
                        <p>Cargando items...</p>
                      </div>
                    ) : (
                      <ReactTable
                        data={itemsTableData}
                        columns={itemsColumns}
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
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Menus; 
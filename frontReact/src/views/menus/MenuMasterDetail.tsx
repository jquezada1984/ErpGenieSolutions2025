import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Alert, Container, Row, Col, Badge, Accordion, AccordionItem, AccordionHeader, AccordionBody } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery, gql } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { eliminarSeccion, eliminarItem } from '../../_apis_/menu';
import './MenuMasterDetail.scss';

// GraphQL queries
const GET_MENU_COMPLETO = gql`
  query GetMenuCompleto {
    secciones {
      id_seccion
      nombre
      orden
      icono
      items {
        id_item
        etiqueta
        icono
        ruta
        es_clickable
        orden
        muestra_badge
        badge_text
        estado
        parent_id
        children {
          id_item
          etiqueta
          icono
          ruta
          es_clickable
          orden
          muestra_badge
          badge_text
          estado
        }
      }
    }
  }
`;

// Mutation para actualizar el orden de los items
const UPDATE_ITEM_ORDER = gql`
  mutation UpdateItemOrder($id_item: String!, $orden: Int!) {
    updateMenuItem(id_item: $id_item, orden: $orden) {
      success
      message
    }
  }
`;

interface MenuSeccion {
  id_seccion: string;
  nombre: string;
  orden: number;
  icono?: string;
  items?: MenuItem[];
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
  children?: MenuItem[];
}

const MenuMasterDetail: React.FC = () => {
  const navigate = useNavigate();
  const [secciones, setSecciones] = useState<MenuSeccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Estilos CSS inline para drag & drop
  const dragStyles = {
    draggableItem: {
      cursor: 'grab',
      transition: 'all 0.2s ease',
      borderRadius: '4px',
      padding: '8px',
      margin: '2px 0'
    },
    dragging: {
      cursor: 'grabbing',
      opacity: 0.5,
      transform: 'rotate(5deg)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    },
    dropZone: {
      border: '2px dashed #007bff',
      backgroundColor: 'rgba(0,123,255,0.1)',
      borderRadius: '4px',
      padding: '8px',
      margin: '2px 0'
    },
    dragHandle: {
      cursor: 'grab',
      color: '#6c757d',
      fontSize: '14px'
    }
  };

  // GraphQL hook
  const [getMenuCompleto, { loading: queryLoading }] = useLazyQuery(GET_MENU_COMPLETO, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data && data.secciones) {
        setSecciones(data.secciones);
      }
      setLoading(false);
    },
    onError: (error) => {
      setError('Error al cargar el menú: ' + error.message);
      setLoading(false);
    }
  });

  useEffect(() => {
    getMenuCompleto();
  }, [getMenuCompleto]);

  useEffect(() => {
    if (queryLoading) {
      setLoading(true);
    }
  }, [queryLoading]);

  const handleNuevaSeccion = () => {
    navigate('/menus/seccion/nueva');
  };

  const handleNuevoItem = (idSeccion: string) => {
    navigate(`/menus/item/nuevo?seccion=${idSeccion}`);
  };

  const handleEditSeccion = (seccion: MenuSeccion) => {
    navigate(`/menus/seccion/editar/${seccion.id_seccion}`);
  };

  const handleEditItem = (item: MenuItem) => {
    navigate(`/menus/item/editar/${item.id_item}`);
  };

  const handleDeleteSeccion = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta sección? Esto también eliminará todos sus items.')) {
      try {
        await eliminarSeccion(id);
        setSuccess('Sección eliminada exitosamente');
        getMenuCompleto(); // Recargar datos
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
        getMenuCompleto(); // Recargar datos
      } catch (err: any) {
        setError(err.message || 'Error al eliminar el item');
      }
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  // Función para obtener todos los items de una sección (incluyendo hijos)
  const getAllItems = (items: MenuItem[] = []): MenuItem[] => {
    const allItems: MenuItem[] = [];
    
    items.forEach(item => {
      allItems.push(item);
      if (item.children && item.children.length > 0) {
        allItems.push(...getAllItems(item.children));
      }
    });
    
    return allItems;
  };

  // Función para renderizar un item con su jerarquía
  const renderItemRow = (item: MenuItem, level: number = 0) => {
    const indentStyle = { marginLeft: `${level * 20}px` };
    const isChild = !!item.parent_id;
    
    return {
      id_item: item.id_item,
      etiqueta: (
        <div 
          style={{
            ...dragStyles.draggableItem,
            ...indentStyle
          }}
          className="d-flex align-items-center draggable-item"
          draggable={true}
          onDragStart={(e) => handleDragStart(e, item.id_item)}
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e, item.id_item)}
          onDragEnter={(e) => e.preventDefault()}
          onDragEnd={() => setDraggedItem(null)}
        >
          <i 
            className="bi bi-grip-vertical me-2 drag-handle" 
            style={dragStyles.dragHandle}
            title="Arrastra para reordenar"
          ></i>
          {isChild && <i className="bi bi-arrow-right-short me-1 text-muted"></i>}
          <span className="fw-medium">{item.etiqueta}</span>
          {isChild && <Badge color="secondary" className="ms-2">Sub-item</Badge>}
          <small className="text-muted ms-auto">Orden: {item.orden}</small>
        </div>
      ),
      ruta: item.ruta || '-',
      icono: item.icono ? <i className={item.icono}></i> : '-',
      jerarquia: isChild ? 'Sub-item' : 'Principal',
      estado: (
        <Badge 
          color={item.estado ? 'success' : 'danger'}
          className={`status-badge ${item.estado ? 'active' : 'inactive'}`}
        >
          {item.estado ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
      acciones: (
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
    };
  };

  // Funciones para drag & drop
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetItemId) {
      return;
    }

    try {
      // Aquí implementarías la lógica para actualizar el orden
      // Por ahora solo recargamos los datos
      setSuccess('Orden actualizado. Implementar lógica de reordenamiento.');
      getMenuCompleto();
    } catch (err: any) {
      setError('Error al actualizar el orden: ' + err.message);
    }
  };

  const getItemsData = (items: MenuItem[] = []) => {
    const allItems: any[] = [];
    
    // Procesar items principales primero
    const mainItems = items.filter(item => !item.parent_id);
    mainItems.forEach(item => {
      allItems.push(renderItemRow(item, 0));
      
      // Agregar items hijos si existen
      if (item.children && item.children.length > 0) {
        item.children.forEach(child => {
          allItems.push(renderItemRow(child, 1));
        });
      }
    });
    
    return allItems;
  };

  const itemsColumns = [
    { Header: 'ID', accessor: 'id_item', width: 200 },
    { Header: 'Etiqueta', accessor: 'etiqueta', filterable: true },
    { Header: 'Ruta', accessor: 'ruta', filterable: true },
    { Header: 'Icono', accessor: 'icono', filterable: false },
    { Header: 'Jerarquía', accessor: 'jerarquia', filterable: true, width: 100 },
    { Header: 'Estado', accessor: 'estado', filterable: true },
    { Header: 'Acciones', accessor: 'acciones', sortable: false, filterable: false, width: 120 },
  ];

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="grid-header">
                <CardTitle tag="h4" className="grid-title">
                  <i className="bi bi-list-ul me-2"></i>
                  Estructura de Menús (Cabecera-Detalle)
                </CardTitle>
                <div className="grid-actions">
                  <Button color="success" className="grid-primary-button" onClick={handleNuevaSeccion}>
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

              {loading ? (
                <div className="text-center p-4">
                  <i className="bi bi-hourglass-split fs-1"></i>
                  <p>Cargando estructura de menús...</p>
                </div>
              ) : (
                <div className="menu-structure">
                  {secciones.length === 0 ? (
                    <div className="text-center p-4">
                      <i className="bi bi-inbox fs-1 text-muted"></i>
                      <p className="text-muted">No hay secciones de menú creadas</p>
                      <Button color="primary" onClick={handleNuevaSeccion}>
                        <i className="bi bi-plus-circle me-2"></i>
                        Crear Primera Sección
                      </Button>
                    </div>
                  ) : (
                    <Accordion open={openAccordion || ''} toggle={toggleAccordion}>
                      {secciones.map((seccion) => (
                        <AccordionItem key={seccion.id_seccion}>
                          <AccordionHeader targetId={seccion.id_seccion}>
                            <div className="d-flex justify-content-between align-items-center w-100 me-3">
                              <div>
                                <strong>{seccion.nombre}</strong>
                                <Badge color="info" className="ms-2">
                                  {getAllItems(seccion.items).length} items
                                </Badge>
                                <Badge color="secondary" className="ms-1">
                                  Orden: {seccion.orden}
                                </Badge>
                              </div>
                              <div className="seccion-actions">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditSeccion(seccion);
                                  }}
                                  color="info"
                                  size="sm"
                                  className="me-2"
                                  title="Editar Sección"
                                >
                                  <i className="bi bi-pencil-fill"></i>
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNuevoItem(seccion.id_seccion);
                                  }}
                                  color="success"
                                  size="sm"
                                  className="me-2"
                                  title="Nuevo Item"
                                >
                                  <i className="bi bi-plus-circle"></i>
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSeccion(seccion.id_seccion);
                                  }}
                                  color="danger"
                                  size="sm"
                                  title="Eliminar Sección"
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </div>
                            </div>
                          </AccordionHeader>
                          <AccordionBody accordionId={seccion.id_seccion}>
                            <div className="seccion-details">
                              <div className="seccion-info mb-3">
                                <Row>
                                  <Col md={6}>
                                    <strong>ID:</strong> {seccion.id_seccion}
                                  </Col>
                                  <Col md={6}>
                                    <strong>Total Items:</strong> {getAllItems(seccion.items).length}
                                  </Col>
                                </Row>
                              </div>
                              
                              {seccion.items && seccion.items.length > 0 ? (
                                <div className="items-table">
                                  <h6 className="mb-3">
                                    <i className="bi bi-list-ul me-2"></i>
                                    Items de la Sección
                                    <small className="text-muted ms-2">
                                      (Arrastra y suelta para reordenar)
                                    </small>
                                  </h6>
                                  <ReactTable
                                    data={getItemsData(seccion.items)}
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
                                </div>
                              ) : (
                                <div className="text-center p-3 text-muted">
                                  <i className="bi bi-inbox fs-3"></i>
                                  <p>No hay items en esta sección</p>
                                  <Button 
                                    color="primary" 
                                    size="sm"
                                    onClick={() => handleNuevoItem(seccion.id_seccion)}
                                  >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Agregar Primer Item
                                  </Button>
                                </div>
                              )}
                            </div>
                          </AccordionBody>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MenuMasterDetail; 
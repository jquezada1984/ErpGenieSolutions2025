import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input, Alert, Row, Col, Badge } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { crearSeccion, actualizarSeccion, eliminarItem } from '../../_apis_/menu';
import IconSelector from '../../components/IconSelector';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

// Consulta GraphQL para obtener una sección
const GET_SECCION = gql`
  query GetSeccion($id_seccion: ID!) {
    seccion(id_seccion: $id_seccion) {
      id_seccion
      nombre
      orden
      icono
    }
  }
`;

// Consulta GraphQL para obtener items de una sección
const GET_ITEMS_SECCION = gql`
  query GetItemsSeccion($id_seccion: ID!) {
    itemsPorSeccion(id_seccion: $id_seccion) {
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
      created_at
      updated_at
    }
  }
`;

interface MenuItem {
  id_item: string;
  etiqueta: string;
  icono?: string;
  ruta?: string;
  es_clickable: boolean;
  orden: number;
  muestra_badge: boolean;
  badge_text?: string;
  estado: boolean;
  parent_id?: string;
  created_at: string;
  updated_at?: string;
}

const NuevaSeccion: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  
  
  const [formData, setFormData] = useState({
    nombre: '',
    orden: 0,
    icono: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);

  // Consulta GraphQL para obtener la sección cuando se está editando
  const { data: seccionData, loading: loadingData, error: queryError } = useQuery(GET_SECCION, {
    variables: { id_seccion: id },
    skip: !isEditing || !id,
    onError: (error) => {
      console.error('❌ Error en consulta GraphQL:', error);
      setError(error.message || 'Error al cargar la sección');
    }
  });

  // Actualizar el formulario cuando se reciban los datos de la sección
  useEffect(() => {
    if (seccionData?.seccion) {
      setFormData({
        nombre: seccionData.seccion.nombre || '',
        orden: seccionData.seccion.orden || 0,
        icono: seccionData.seccion.icono || ''
      });
    }
  }, [seccionData]);

  // Consulta GraphQL para obtener los items de la sección cuando se está editando
  const { data: itemsData, loading: itemsLoading, error: itemsError, refetch: refetchItems } = useQuery(GET_ITEMS_SECCION, {
    variables: { id_seccion: id },
    skip: !isEditing || !id,
    fetchPolicy: 'network-only', // Evitar cache para asegurar la consulta correcta
    onError: (error) => {
      console.error('❌ Error en consulta de items GraphQL:', error);
      setError(error.message || 'Error al cargar los items de la sección');
    }
  });

  // Actualizar items cuando se reciban los datos
  useEffect(() => {
    if (itemsData?.itemsPorSeccion) {
      setItems(itemsData.itemsPorSeccion);
    } else if (itemsData && !itemsData.itemsPorSeccion) {
      setItems([]);
    }
  }, [itemsData]);

  // Manejar errores de la consulta GraphQL
  useEffect(() => {
    if (queryError) {
      setError(queryError.message || 'Error al cargar la sección');
    }
  }, [queryError]);

  // Manejar errores de la consulta de items
  useEffect(() => {
    if (itemsError) {
      setError(itemsError.message || 'Error al cargar los items de la sección');
    }
  }, [itemsError]);

  // Recargar items cuando se regrese de editar un item
  useEffect(() => {
    if (isEditing && id) {
      refetchItems();
    }
  }, [isEditing, id, refetchItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleIconSelect = (iconName: string) => {
    setFormData(prev => ({
      ...prev,
      icono: iconName
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let response;
      if (isEditing && id) {
        response = await actualizarSeccion(id, formData);
      } else {
        response = await crearSeccion(formData);
      }
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/menus');
        }, 2000);
      } else {
        setError(response.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la sección`);
      }
    } catch (err: any) {
      setError(err.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la sección`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/menus');
  };

  const handleEditItem = (item: MenuItem) => {
    navigate(`/menus/item/editar/${item.id_item}`);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este item?')) {
      try {
        await eliminarItem(itemId);
        setSuccess('Item eliminado exitosamente');
        refetchItems(); // Recargar la lista de items
      } catch (err: any) {
        setError(err.message || 'Error al eliminar el item');
      }
    }
  };

  const handleNuevoItem = () => {
    if (id) {
      navigate(`/menus/item/nuevo?seccion=${id}`);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <CardTitle tag="h4" className="mb-0">
                  <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
                  {isEditing ? 'Editar Sección de Menú' : 'Nueva Sección de Menú'}
                </CardTitle>
                <Button color="secondary" onClick={handleCancel}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver
                </Button>
              </div>

              {error && (
                <Alert color="danger" fade={false} className="mb-3" timeout={0}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert color="success" fade={false} className="mb-3" timeout={0}>
                  <i className="bi bi-check-circle me-2"></i>
                  Sección {isEditing ? 'actualizada' : 'creada'} exitosamente. Redirigiendo...
                </Alert>
              )}

              {loadingData && (
                <Alert color="info" fade={false} className="mb-3" timeout={0}>
                  <i className="bi bi-hourglass-split me-2"></i>
                  Cargando información de la sección...
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="nombre" className="fw-bold">
                        Nombre de la Sección *
                      </Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        disabled={loadingData}
                        placeholder="Ingrese el nombre de la sección"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="orden" className="fw-bold">
                        Orden *
                      </Label>
                      <Input
                        id="orden"
                        name="orden"
                        type="number"
                        value={formData.orden}
                        onChange={handleInputChange}
                        required
                        min="0"
                        disabled={loadingData}
                        placeholder="0"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="icono" className="fw-bold">
                        Icono
                      </Label>
                      <div className="d-flex gap-2">
                        <Input
                          id="icono"
                          name="icono"
                          type="text"
                          value={formData.icono}
                          onChange={handleInputChange}
                          disabled={loadingData}
                          placeholder="Seleccione un icono"
                          readOnly
                        />
                        <Button
                          type="button"
                          color="outline-primary"
                          onClick={() => {
                            setShowIconSelector(true);
                          }}
                          disabled={loadingData}
                        >
                          <i className="bi bi-palette me-2"></i>
                          Seleccionar
                        </Button>
                        {formData.icono && (
                          <Button
                            type="button"
                            color="outline-danger"
                            onClick={() => setFormData(prev => ({ ...prev, icono: '' }))}
                            disabled={loadingData}
                          >
                            <i className="bi bi-x"></i>
                          </Button>
                        )}
                      </div>
                      {formData.icono && (
                        <div className="mt-2">
                          <small className="text-muted">Vista previa: </small>
                          <i className={`${formData.icono} me-2`}></i>
                          <small className="text-muted">{formData.icono}</small>
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button color="secondary" onClick={handleCancel} disabled={loading || loadingData}>
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
                  </Button>
                  <Button color="primary" type="submit" disabled={loading || loadingData}>
                    {loading ? (
                      <>
                        <i className="bi bi-hourglass-split me-2"></i>
                        {isEditing ? 'Actualizando...' : 'Guardando...'}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        {isEditing ? 'Actualizar Sección' : 'Guardar Sección'}
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Tabla de Items - Solo en modo edición */}
      {isEditing && (
        <div className="row mt-4">
          <div className="col-12">
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <CardTitle tag="h5" className="mb-0">
                    <i className="bi bi-list-ul me-2"></i>
                    Items de la Sección
                  </CardTitle>
                  <Button color="primary" onClick={handleNuevoItem}>
                    <i className="bi bi-plus-circle me-2"></i>
                    Nuevo Item
                  </Button>
                </div>

                {itemsLoading && (
                  <Alert color="info" fade={false} className="mb-3" timeout={0}>
                    <i className="bi bi-hourglass-split me-2"></i>
                    Cargando items de la sección...
                  </Alert>
                )}

                {items.length > 0 ? (
                  <ReactTable
                    data={items.map((item) => ({
                      id_item: item.id_item,
                      etiqueta: item.etiqueta,
                      icono: item.icono ? (
                        <div className="text-center">
                          <i className={`${item.icono} me-2`}></i>
                          <small className="text-muted">{item.icono}</small>
                        </div>
                      ) : (
                        <div className="text-center text-muted">
                          <small>Sin icono</small>
                        </div>
                      ),
                      ruta: item.ruta || '-',
                      orden: item.orden,
                      es_clickable: item.es_clickable ? (
                        <Badge color="success">Sí</Badge>
                      ) : (
                        <Badge color="secondary">No</Badge>
                      ),
                      muestra_badge: item.muestra_badge ? (
                        <Badge color="info">{item.badge_text || 'Sí'}</Badge>
                      ) : (
                        <Badge color="secondary">No</Badge>
                      ),
                      estado: item.estado ? (
                        <Badge color="success">Activo</Badge>
                      ) : (
                        <Badge color="danger">Inactivo</Badge>
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
                    }))}
                    columns={[
                      { Header: 'ID', accessor: 'id_item', width: 200 },
                      { Header: 'Etiqueta', accessor: 'etiqueta', filterable: true },
                      { Header: 'Icono', accessor: 'icono', sortable: false, filterable: false, width: 150 },
                      { Header: 'Ruta', accessor: 'ruta', filterable: true },
                      { Header: 'Orden', accessor: 'orden', width: 80 },
                      { Header: 'Clickable', accessor: 'es_clickable', sortable: false, filterable: false, width: 100 },
                      { Header: 'Badge', accessor: 'muestra_badge', sortable: false, filterable: false, width: 100 },
                      { Header: 'Estado', accessor: 'estado', sortable: false, filterable: false, width: 100 },
                      { Header: 'Acciones', accessor: 'acciones', sortable: false, filterable: false, width: 120 },
                    ]}
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
                ) : (
                  <div className="text-center p-4 text-muted">
                    <i className="bi bi-inbox fs-3"></i>
                    <p className="mt-2">No hay items en esta sección</p>
                    <Button color="primary" onClick={handleNuevoItem}>
                      <i className="bi bi-plus-circle me-2"></i>
                      Agregar Primer Item
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* Modal para seleccionar icono */}
      <IconSelector
        isOpen={showIconSelector}
        toggle={() => {
          setShowIconSelector(!showIconSelector);
        }}
        onSelect={handleIconSelect}
        currentValue={formData.icono}
      />
    </div>
  );
};

export default NuevaSeccion; 
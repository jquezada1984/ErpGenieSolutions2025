import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input, Alert, Row, Col } from 'reactstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery, gql } from '@apollo/client';
import { crearItem } from '../../_apis_/menu';

// GraphQL query para obtener secciones
const GET_MENU_SECCIONES = gql`
  query GetMenuSecciones {
    secciones {
      id_seccion
      nombre
      orden
    }
  }
`;

// GraphQL query para obtener items de una sección (para jerarquía padre-hijo)
const GET_ITEMS_SECCION = gql`
  query GetItemsSeccion($idSeccion: String!) {
    items(where: { id_seccion: $idSeccion }) {
      id_item
      etiqueta
      parent_id
      orden
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
  etiqueta: string;
  parent_id?: string;
  orden: number;
}

const NuevoItem: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const seccionIdFromUrl = searchParams.get('seccion');
  
  const [secciones, setSecciones] = useState<MenuSeccion[]>([]);
  const [itemsSeccion, setItemsSeccion] = useState<MenuItem[]>([]);
  const [formData, setFormData] = useState({
    id_seccion: seccionIdFromUrl || '',
    parent_id: '',
    etiqueta: '',
    icono: '',
    ruta: '',
    es_clickable: true,
    muestra_badge: false,
    badge_text: '',
    estado: true
  });
  const [loading, setLoading] = useState(false);
  const [loadingSecciones, setLoadingSecciones] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // GraphQL hook para obtener secciones
  const [getSecciones, { loading: seccionesLoading }] = useLazyQuery(GET_MENU_SECCIONES, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data && data.secciones) {
        setSecciones(data.secciones);
      }
      setLoadingSecciones(false);
    },
    onError: (error) => {
      setError('Error al cargar las secciones: ' + error.message);
      setLoadingSecciones(false);
    }
  });

  // GraphQL hook para obtener items de una sección
  const [getItemsSeccion] = useLazyQuery(GET_ITEMS_SECCION, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data && data.items) {
        setItemsSeccion(data.items);
      }
    },
    onError: (error) => {
      console.warn('Error al cargar items de la sección:', error.message);
    }
  });

  useEffect(() => {
    getSecciones();
  }, [getSecciones]);

  // Cuando cambia la sección, cargar los items para la jerarquía
  useEffect(() => {
    if (formData.id_seccion) {
      getItemsSeccion({ variables: { idSeccion: formData.id_seccion } });
      // Resetear parent_id cuando cambia la sección
      setFormData(prev => ({ ...prev, parent_id: '' }));
    }
  }, [formData.id_seccion, getItemsSeccion]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Calcular el orden automáticamente (último orden + 1)
      const maxOrden = itemsSeccion.length > 0 ? Math.max(...itemsSeccion.map(item => item.orden)) : 0;
      const nuevoOrden = maxOrden + 1;
      
      const itemData = {
        ...formData,
        orden: nuevoOrden
      };
      
      const response = await crearItem(itemData);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/menus');
        }, 2000);
      } else {
        setError(response.message || 'Error al crear el item');
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear el item');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/menus');
  };

  // Filtrar items que pueden ser padres (sin parent_id o que no sean hijos del item actual)
  const getItemsPadres = () => {
    return itemsSeccion.filter(item => !item.parent_id);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <CardTitle tag="h4" className="mb-0">
                  <i className="bi bi-plus-circle me-2"></i>
                  Nuevo Item de Menú
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
                  Item creado exitosamente. Redirigiendo...
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="id_seccion" className="fw-bold">
                        Sección *
                      </Label>
                      <Input
                        id="id_seccion"
                        name="id_seccion"
                        type="select"
                        value={formData.id_seccion}
                        onChange={handleSelectChange}
                        required
                        disabled={loadingSecciones}
                      >
                        <option value="">Seleccione una sección</option>
                        {secciones.map(seccion => (
                          <option key={seccion.id_seccion} value={seccion.id_seccion}>
                            {seccion.nombre}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="etiqueta" className="fw-bold">
                        Etiqueta *
                      </Label>
                      <Input
                        id="etiqueta"
                        name="etiqueta"
                        type="text"
                        value={formData.etiqueta}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese la etiqueta del item"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="ruta" className="fw-bold">
                        Ruta
                      </Label>
                      <Input
                        id="ruta"
                        name="ruta"
                        type="text"
                        value={formData.ruta}
                        onChange={handleInputChange}
                        placeholder="Ej: /dashboard"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="icono" className="fw-bold">
                        Icono
                      </Label>
                      <Input
                        id="icono"
                        name="icono"
                        type="text"
                        value={formData.icono}
                        onChange={handleInputChange}
                        placeholder="Ej: bi bi-house"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="parent_id" className="fw-bold">
                        Item Padre
                      </Label>
                      <Input
                        id="parent_id"
                        name="parent_id"
                        type="select"
                        value={formData.parent_id}
                        onChange={handleSelectChange}
                        disabled={!formData.id_seccion || itemsSeccion.length === 0}
                      >
                        <option value="">Sin padre (Item principal)</option>
                        {getItemsPadres().map(item => (
                          <option key={item.id_item} value={item.id_item}>
                            {item.etiqueta}
                          </option>
                        ))}
                      </Input>
                      <small className="form-text text-muted">
                        Seleccione un item padre si desea crear un sub-item
                      </small>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup check className="d-flex align-items-center h-100">
                      <Label check className="fw-bold ms-2">
                        <Input
                          type="checkbox"
                          name="es_clickable"
                          checked={formData.es_clickable}
                          onChange={handleInputChange}
                        />
                        <span className="ms-2">Es Clickable</span>
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup check className="d-flex align-items-center">
                      <Label check className="fw-bold ms-2">
                        <Input
                          type="checkbox"
                          name="estado"
                          checked={formData.estado}
                          onChange={handleInputChange}
                        />
                        <span className="ms-2">Activo</span>
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup check className="d-flex align-items-center">
                      <Label check className="fw-bold ms-2">
                        <Input
                          type="checkbox"
                          name="muestra_badge"
                          checked={formData.muestra_badge}
                          onChange={handleInputChange}
                        />
                        <span className="ms-2">Mostrar Badge</span>
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
                {formData.muestra_badge && (
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="badge_text" className="fw-bold">
                          Texto del Badge
                        </Label>
                        <Input
                          id="badge_text"
                          name="badge_text"
                          type="text"
                          value={formData.badge_text}
                          onChange={handleInputChange}
                          placeholder="Ej: Nuevo"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                )}
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button color="secondary" onClick={handleCancel} disabled={loading}>
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
                  </Button>
                  <Button color="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <i className="bi bi-hourglass-split me-2"></i>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Guardar Item
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NuevoItem; 
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input, Alert, Row, Col } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { actualizarItem } from '../../_apis_/menu';
import IconSelector from '../../components/IconSelector';

// Consulta GraphQL para obtener un item específico
const GET_ITEM = gql`
  query GetItem($id_item: ID!) {
    item(id_item: $id_item) {
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
      created_by
      created_at
      updated_by
      updated_at
    }
  }
`;

// GraphQL query para obtener secciones
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

// GraphQL query para obtener items de una sección (para jerarquía padre-hijo)
const GET_ITEMS_SECCION = gql`
  query GetItemsSeccion($id_seccion: ID!) {
    itemsPorSeccion(id_seccion: $id_seccion) {
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
  icono?: string;
}

interface MenuItem {
  id_item: string;
  etiqueta: string;
  parent_id?: string;
  orden: number;
}

const EditarItem: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [secciones, setSecciones] = useState<MenuSeccion[]>([]);
  const [itemsSeccion, setItemsSeccion] = useState<MenuItem[]>([]);
  const [formData, setFormData] = useState({
    id_seccion: '',
    parent_id: '',
    etiqueta: '',
    icono: '',
    ruta: '',
    es_clickable: true,
    orden: 0,
    muestra_badge: false,
    badge_text: '',
    estado: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showIconSelector, setShowIconSelector] = useState(false);

  // Consulta GraphQL para obtener el item cuando se está editando
  const { data: itemData, loading: loadingData, error: queryError } = useQuery(GET_ITEM, {
    variables: { id_item: id },
    skip: !id,
    onError: (error) => {
      console.error('❌ Error en consulta GraphQL:', error);
      setError(error.message || 'Error al cargar el item');
    }
  });

  // Actualizar el formulario cuando se reciban los datos
  useEffect(() => {
    if (itemData?.item) {
      setFormData({
        id_seccion: itemData.item.id_seccion || '',
        parent_id: itemData.item.parent_id || '',
        etiqueta: itemData.item.etiqueta || '',
        icono: itemData.item.icono || '',
        ruta: itemData.item.ruta || '',
        es_clickable: itemData.item.es_clickable !== undefined ? itemData.item.es_clickable : true,
        orden: itemData.item.orden || 0,
        muestra_badge: itemData.item.muestra_badge || false,
        badge_text: itemData.item.badge_text || '',
        estado: itemData.item.estado !== undefined ? itemData.item.estado : true
      });
    }
  }, [itemData]);

  // Consulta para obtener secciones
  const { data: seccionesData } = useQuery(GET_MENU_SECCIONES);

  // Actualizar secciones cuando se reciban los datos
  useEffect(() => {
    if (seccionesData?.secciones) {
      setSecciones(seccionesData.secciones);
    }
  }, [seccionesData]);

  // Consulta para obtener items de la sección (para jerarquía padre-hijo)
  const { data: itemsData } = useQuery(GET_ITEMS_SECCION, {
    variables: { id_seccion: formData.id_seccion },
    skip: !formData.id_seccion,
    fetchPolicy: 'network-only' // Evitar cache para asegurar la consulta correcta
  });

  // Actualizar items de la sección cuando se reciban los datos
  useEffect(() => {
    if (itemsData?.itemsPorSeccion) {
      setItemsSeccion(itemsData.itemsPorSeccion);
    }
  }, [itemsData]);

  // Manejar errores de la consulta GraphQL
  useEffect(() => {
    if (queryError) {
      setError(queryError.message || 'Error al cargar el item');
    }
  }, [queryError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
               type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIconSelect = (iconName: string) => {
    console.log('🎨 Icono seleccionado:', iconName);
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
      const response = await actualizarItem(id!, formData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/menus/estructura');
        }, 2000);
      } else {
        setError(response.message || 'Error al actualizar el item');
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el item');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/menus/estructura');
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <CardTitle tag="h4" className="mb-0">
                  <i className="bi bi-pencil-square me-2"></i>
                  Editar Item de Menú
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
                  Item actualizado exitosamente. Redirigiendo...
                </Alert>
              )}

              {loadingData && (
                <Alert color="info" fade={false} className="mb-3" timeout={0}>
                  <i className="bi bi-hourglass-split me-2"></i>
                  Cargando información del item...
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
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
                        disabled={loadingData}
                        placeholder="Ingrese la etiqueta del item"
                      />
                    </FormGroup>
                  </Col>
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
                        disabled={loadingData}
                        placeholder="Ej: /dashboard, /usuarios, etc."
                      />
                    </FormGroup>
                  </Col>
                </Row>

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
                        disabled={loadingData}
                      >
                        <option value="">Seleccione una sección</option>
                        {secciones.map((seccion) => (
                          <option key={seccion.id_seccion} value={seccion.id_seccion}>
                            {seccion.nombre}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
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
                        disabled={loadingData}
                      >
                        <option value="">Sin padre (Item principal)</option>
                        {itemsSeccion
                          .filter(item => item.id_item !== id) // Excluir el item actual
                          .map((item) => (
                            <option key={item.id_item} value={item.id_item}>
                              {item.etiqueta}
                            </option>
                          ))}
                      </Input>
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
                            console.log('🎨 Abriendo selector de iconos');
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

                <Row>
                  <Col md={3}>
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
                  <Col md={3}>
                    <FormGroup>
                      <Label for="es_clickable" className="fw-bold">
                        Es Clickable
                      </Label>
                      <div className="form-check">
                        <Input
                          id="es_clickable"
                          name="es_clickable"
                          type="checkbox"
                          checked={formData.es_clickable}
                          onChange={handleInputChange}
                          disabled={loadingData}
                        />
                        <Label for="es_clickable" className="form-check-label">
                          El item es clickeable
                        </Label>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for="muestra_badge" className="fw-bold">
                        Muestra Badge
                      </Label>
                      <div className="form-check">
                        <Input
                          id="muestra_badge"
                          name="muestra_badge"
                          type="checkbox"
                          checked={formData.muestra_badge}
                          onChange={handleInputChange}
                          disabled={loadingData}
                        />
                        <Label for="muestra_badge" className="form-check-label">
                          Mostrar badge
                        </Label>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for="estado" className="fw-bold">
                        Estado
                      </Label>
                      <div className="form-check">
                        <Input
                          id="estado"
                          name="estado"
                          type="checkbox"
                          checked={formData.estado}
                          onChange={handleInputChange}
                          disabled={loadingData}
                        />
                        <Label for="estado" className="form-check-label">
                          Activo
                        </Label>
                      </div>
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
                          disabled={loadingData}
                          placeholder="Ej: Nuevo, 5, etc."
                          maxLength={20}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                )}

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button color="secondary" onClick={handleCancel} disabled={loading || loadingData}>
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
                  </Button>
                  <Button color="primary" type="submit" disabled={loading || loadingData}>
                    {loading ? (
                      <>
                        <i className="bi bi-hourglass-split me-2"></i>
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Actualizar Item
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modal para seleccionar icono */}
      <IconSelector
        isOpen={showIconSelector}
        toggle={() => {
          console.log('🎨 Cerrando selector de iconos');
          setShowIconSelector(!showIconSelector);
        }}
        onSelect={handleIconSelect}
        currentValue={formData.icono}
      />
    </div>
  );
};

export default EditarItem;

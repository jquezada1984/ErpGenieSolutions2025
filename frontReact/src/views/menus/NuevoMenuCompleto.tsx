import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input, Alert, Row, Col, Badge, Collapse } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import { crearSeccion, crearItem } from '../../_apis_/menu';



const NuevoMenuCompleto: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showSeccionForm, setShowSeccionForm] = useState(true);

  // Formulario de sección (cabecera)
  const [seccionData, setSeccionData] = useState({
    nombre: '',
    orden: 0,
    icono: ''
  });

  // Formulario de item (detalle)
  const [itemData, setItemData] = useState({
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



  const handleSeccionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSeccionData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleItemInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setItemData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
               type === 'number' ? parseInt(value) || 0 : value
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let seccionId = itemData.id_seccion;

      // Crear nueva sección (obligatorio)
      if (!seccionData.nombre.trim()) {
        throw new Error('Debe ingresar el nombre de la sección');
      }

      const seccionResponse = await crearSeccion(seccionData);
      if (seccionResponse.success) {
        seccionId = seccionResponse.data.id_seccion;
        setSuccess('Sección creada exitosamente');
      } else {
        throw new Error(seccionResponse.message || 'Error al crear la sección');
      }

      // Crear el item
      const itemToCreate = {
        ...itemData,
        id_seccion: seccionId
      };

      const itemResponse = await crearItem(itemToCreate);
      if (itemResponse.success) {
        setSuccess('Menú creado exitosamente');
        setTimeout(() => {
          navigate('/menus');
        }, 2000);
      } else {
        throw new Error(itemResponse.message || 'Error al crear el item');
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear el menú');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/menus');
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
                  Nuevo Menú (Cabecera-Detalle)
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
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* CABECERA - SECCIÓN */}
                <Card className="mb-4">
                  <CardBody>
                                         <div className="mb-3">
                       <h5 className="mb-0">
                         <i className="bi bi-list-ul me-2"></i>
                         Cabecera - Sección
                       </h5>
                     </div>

                                                                <Row>
                         <Col md={4}>
                           <FormGroup>
                             <Label for="seccion-nombre" className="fw-bold">
                               Nombre de la Sección *
                             </Label>
                             <Input
                               id="seccion-nombre"
                               name="nombre"
                               type="text"
                               value={seccionData.nombre}
                               onChange={handleSeccionInputChange}
                               placeholder="Ingrese el nombre de la sección"
                               required
                             />
                           </FormGroup>
                         </Col>
                         <Col md={4}>
                           <FormGroup>
                             <Label for="seccion-orden" className="fw-bold">
                               Orden
                             </Label>
                             <Input
                               id="seccion-orden"
                               name="orden"
                               type="number"
                               value={seccionData.orden}
                               onChange={handleSeccionInputChange}
                               placeholder="0"
                               min="0"
                             />
                           </FormGroup>
                         </Col>
                         <Col md={4}>
                           <FormGroup>
                             <Label for="seccion-icono" className="fw-bold">
                               Icono
                             </Label>
                             <Input
                               id="seccion-icono"
                               name="icono"
                               type="text"
                               value={seccionData.icono}
                               onChange={handleSeccionInputChange}
                               placeholder="bi bi-list-ul"
                             />
                           </FormGroup>
                         </Col>
                       </Row>


                  </CardBody>
                </Card>

                {/* DETALLE - ITEM */}
                <Card>
                  <CardBody>
                    <h5 className="mb-3">
                      <i className="bi bi-menu-button-wide me-2"></i>
                      Detalle - Item
                    </h5>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="item-etiqueta" className="fw-bold">
                            Etiqueta del Item *
                          </Label>
                          <Input
                            id="item-etiqueta"
                            name="etiqueta"
                            type="text"
                            value={itemData.etiqueta}
                            onChange={handleItemInputChange}
                            placeholder="Ingrese la etiqueta del item"
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="item-ruta" className="fw-bold">
                            Ruta
                          </Label>
                          <Input
                            id="item-ruta"
                            name="ruta"
                            type="text"
                            value={itemData.ruta}
                            onChange={handleItemInputChange}
                            placeholder="/ruta-del-item"
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="item-icono" className="fw-bold">
                            Icono
                          </Label>
                          <Input
                            id="item-icono"
                            name="icono"
                            type="text"
                            value={itemData.icono}
                            onChange={handleItemInputChange}
                            placeholder="bi bi-house"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="item-orden" className="fw-bold">
                            Orden
                          </Label>
                          <Input
                            id="item-orden"
                            name="orden"
                            type="number"
                            value={itemData.orden}
                            onChange={handleItemInputChange}
                            placeholder="0"
                            min="0"
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <FormGroup check>
                          <Input
                            id="item-clickable"
                            name="es_clickable"
                            type="checkbox"
                            checked={itemData.es_clickable}
                            onChange={handleItemInputChange}
                          />
                          <Label check for="item-clickable" className="fw-bold">
                            Es Clickable
                          </Label>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup check>
                          <Input
                            id="item-badge"
                            name="muestra_badge"
                            type="checkbox"
                            checked={itemData.muestra_badge}
                            onChange={handleItemInputChange}
                          />
                          <Label check for="item-badge" className="fw-bold">
                            Mostrar Badge
                          </Label>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup check>
                          <Input
                            id="item-estado"
                            name="estado"
                            type="checkbox"
                            checked={itemData.estado}
                            onChange={handleItemInputChange}
                          />
                          <Label check for="item-estado" className="fw-bold">
                            Activo
                          </Label>
                        </FormGroup>
                      </Col>
                    </Row>

                    {itemData.muestra_badge && (
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="item-badge-text" className="fw-bold">
                              Texto del Badge
                            </Label>
                            <Input
                              id="item-badge-text"
                              name="badge_text"
                              type="text"
                              value={itemData.badge_text}
                              onChange={handleItemInputChange}
                              placeholder="Nuevo"
                              maxLength={20}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    )}
                  </CardBody>
                </Card>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button color="secondary" onClick={handleCancel}>
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
                  </Button>
                  <Button color="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <i className="bi bi-hourglass-split me-2"></i>
                        Creando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Crear Menú
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

export default NuevoMenuCompleto; 
import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input, Alert, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import IconSelector from '../../components/IconSelector';

import { crearSeccion, crearItem } from '../../_apis_/menu';



const NuevoMenuCompleto: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [currentIconField, setCurrentIconField] = useState<'seccion' | 'item'>('seccion');
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

  // Lista de items agregados (detalle)
  const [itemsList, setItemsList] = useState<typeof itemData[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);



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

  const handleAddItemToList = () => {
    try {
      if (!itemData.etiqueta.trim()) {
        setError('Debe ingresar la etiqueta del item');
        return;
      }
      const nextOrden = (itemsList.length || 0) + 1;
      const newItem = { ...itemData, orden: nextOrden };
      setItemsList(prev => [...prev, newItem]);
      // limpiar formulario de item
      setItemData({
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
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al agregar el item');
    }
  };

  const handleDeleteItemFromList = (index: number) => {
    setItemsList(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // Reasignar orden secuencial
      return updated.map((it, i) => ({ ...it, orden: i + 1 }));
    });
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
  };
  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    setItemsList(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(index, 0, moved);
      // Reasignar orden secuencial
      return updated.map((it, i) => ({ ...it, orden: i + 1 }));
    });
    setDragIndex(null);
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validaciones mínimas
      if (!seccionData.nombre.trim()) {
        throw new Error('Debe ingresar el nombre de la sección');
      }

      // Crear sección primero
      const seccionResponse = await crearSeccion(seccionData);
      if (!seccionResponse.success) {
        throw new Error(seccionResponse.message || 'Error al crear la sección');
      }
      const seccionId = seccionResponse.data.id_seccion;
      setSuccess('Sección creada exitosamente');

      // Crear items en orden según itemsList
      for (let i = 0; i < itemsList.length; i++) {
        const it = itemsList[i];
        const payload = {
          id_seccion: seccionId,
          parent_id: it.parent_id || undefined,
          etiqueta: it.etiqueta,
          icono: it.icono || undefined,
          ruta: it.ruta || undefined,
          es_clickable: it.es_clickable,
          orden: i + 1,
          muestra_badge: it.muestra_badge,
          badge_text: it.muestra_badge ? it.badge_text || undefined : undefined,
          estado: it.estado
        };
        const itemResponse = await crearItem(payload);
        if (!itemResponse.success) {
          throw new Error(itemResponse.message || 'Error al crear un item');
        }
      }

      setSuccess('Menú creado exitosamente');
      setTimeout(() => {
        navigate('/menus');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error al crear el menú');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/menus');
  };

  const handleIconSelect = (iconName: string) => {
    if (currentIconField === 'seccion') {
      setSeccionData(prev => ({ ...prev, icono: iconName }));
    } else {
      setItemData(prev => ({ ...prev, icono: iconName }));
    }
  };

  const openIconSelector = (field: 'seccion' | 'item') => {
    setCurrentIconField(field);
    setShowIconSelector(true);
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
                             <div className="d-flex">
                               <Input
                                 id="seccion-icono"
                                 name="icono"
                                 type="text"
                                 value={seccionData.icono}
                                 onChange={handleSeccionInputChange}
                                 placeholder="bi bi-list-ul"
                                 className="me-2"
                               />
                               <Button
                                 type="button"
                                 color="outline-primary"
                                 size="sm"
                                 onClick={() => openIconSelector('seccion')}
                                 style={{ minWidth: '40px' }}
                               >
                                 <i className="bi bi-palette"></i>
                               </Button>
                             </div>
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
                      Detalle - Items
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
                           <div className="d-flex">
                             <Input
                               id="item-icono"
                               name="icono"
                               type="text"
                               value={itemData.icono}
                               onChange={handleItemInputChange}
                               placeholder="bi bi-house"
                               className="me-2"
                             />
                             <Button
                               type="button"
                               color="outline-primary"
                               size="sm"
                               onClick={() => openIconSelector('item')}
                               style={{ minWidth: '40px' }}
                             >
                               <i className="bi bi-palette"></i>
                             </Button>
                           </div>
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

                    <div className="d-flex justify-content-end">
                      <Button type="button" color="success" onClick={handleAddItemToList}>
                        <i className="bi bi-plus-circle me-2"></i>
                        Agregar Item a la lista
                      </Button>
                    </div>

                    {/* Lista de items agregados con drag and drop para ordenar */}
                    <div className="mt-4">
                      <h6 className="mb-2">Items agregados ({itemsList.length})</h6>
                      <div className="table-responsive">
                        <table className="table table-striped align-middle">
                          <thead>
                            <tr>
                              <th style={{ width: 60 }}>#</th>
                              <th>Etiqueta</th>
                              <th>Ruta</th>
                              <th>Icono</th>
                              <th style={{ width: 120 }}>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {itemsList.length === 0 && (
                              <tr>
                                <td colSpan={5} className="text-center text-muted py-3">
                                  No hay items agregados aún
                                </td>
                              </tr>
                            )}
                            {itemsList.map((it, index) => (
                              <tr
                                key={`it-${index}`}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(index)}
                                style={{ cursor: 'grab' }}
                              >
                                <td>{it.orden || index + 1}</td>
                                <td>{it.etiqueta}</td>
                                <td>{it.ruta || '-'}</td>
                                <td>{it.icono ? <i className={it.icono}></i> : '-'}</td>
                                <td>
                                  <Button
                                    size="sm"
                                    color="outline-danger"
                                    onClick={() => handleDeleteItemFromList(index)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
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

       {/* Selector de Iconos */}
       <IconSelector
         isOpen={showIconSelector}
         toggle={() => setShowIconSelector(false)}
         onSelect={handleIconSelect}
         currentValue={currentIconField === 'seccion' ? seccionData.icono : itemData.icono}
       />
     </div>
   );
 };

export default NuevoMenuCompleto; 
import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input, Alert, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const NuevoMenu: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    ruta: '',
    icono: '',
    estado: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Aquí iría la llamada a la API para crear el menú
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          navigate('/menus');
        }, 2000);
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Error al crear el menú');
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
                  Nuevo Menú
                </CardTitle>
                <Button color="secondary" onClick={handleCancel}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver
                </Button>
              </div>

              {error && (
                <Alert color="danger" fade={false} className="mb-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert color="success" fade={false} className="mb-3">
                  <i className="bi bi-check-circle me-2"></i>
                  Menú creado exitosamente. Redirigiendo...
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="nombre" className="fw-bold">
                        Nombre del Menú *
                      </Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese el nombre del menú"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="ruta" className="fw-bold">
                        Ruta *
                      </Label>
                      <Input
                        id="ruta"
                        name="ruta"
                        type="text"
                        value={formData.ruta}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese la ruta (ej: /dashboard)"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="icono" className="fw-bold">
                        Icono (clase Bootstrap Icons)
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
                  <Col md={6}>
                    <FormGroup check className="d-flex align-items-center h-100">
                      <Label check className="fw-bold ms-2">
                        <Input
                          type="checkbox"
                          name="estado"
                          checked={formData.estado}
                          onChange={handleInputChange}
                        />
                        <span className="ms-2">Menú Activo</span>
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
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
                        Guardar Menú
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

export default NuevoMenu; 
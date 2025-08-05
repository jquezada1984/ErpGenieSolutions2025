import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input, Alert, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { crearSeccion } from '../../_apis_/menu';

const NuevaSeccion: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    orden: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await crearSeccion(formData);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/menus');
        }, 2000);
      } else {
        setError(response.message || 'Error al crear la sección');
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear la sección');
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
                  Nueva Sección de Menú
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
                  Sección creada exitosamente. Redirigiendo...
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
                        placeholder="0"
                      />
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
                        Guardar Sección
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

export default NuevaSeccion; 
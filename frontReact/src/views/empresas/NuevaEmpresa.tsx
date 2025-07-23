import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input, Alert, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { crearEmpresa } from '../../_apis_/empresa';
import ErrorAlert from '../../components/ErrorAlert';

interface Empresa {
  id_empresa: string;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: boolean;
}

const NuevaEmpresa: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    email: '',
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
      await crearEmpresa({
        nombre: formData.nombre,
        ruc: formData.ruc,
        direccion: formData.direccion,
        telefono: formData.telefono,
        email: formData.email,
        estado: formData.estado
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/empresas');
      }, 2000);
    } catch (err: any) {
      setLoading(false);
      setError(err);
    }
  };

  const handleCancel = () => {
    navigate('/empresas');
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
                  Nueva Empresa
                </CardTitle>
                <Button color="secondary" onClick={handleCancel}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver
                </Button>
              </div>

              {error && (
                <div className="mb-3">
                  <ErrorAlert 
                    error={error} 
                    onDismiss={() => setError(null)}
                  />
                </div>
              )}

              {success && (
                <Alert color="success" className="mb-3">
                  <i className="bi bi-check-circle me-2"></i>
                  Empresa creada exitosamente. Redirigiendo...
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="nombre" className="fw-bold">
                        Nombre de la Empresa *
                      </Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese el nombre de la empresa"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="ruc" className="fw-bold">
                        RUC *
                      </Label>
                      <Input
                        id="ruc"
                        name="ruc"
                        type="text"
                        value={formData.ruc}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese el RUC"
                        maxLength={11}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="direccion" className="fw-bold">
                        Dirección *
                      </Label>
                      <Input
                        id="direccion"
                        name="direccion"
                        type="text"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese la dirección"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="telefono" className="fw-bold">
                        Teléfono *
                      </Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese el teléfono"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="email" className="fw-bold">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese el email"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="checkbox"
                          name="estado"
                          checked={formData.estado}
                          onChange={handleInputChange}
                        />
                        <span className="ms-2">Empresa Activa</span>
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
                        Guardar Empresa
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

export default NuevaEmpresa; 
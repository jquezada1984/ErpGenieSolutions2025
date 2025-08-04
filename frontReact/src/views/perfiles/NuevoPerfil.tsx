import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input, Alert, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { crearPerfil } from '../../_apis_/perfil';

// Consulta GraphQL para obtener empresas (InicioNestJS)
const GET_EMPRESAS = gql`
  query {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

interface Empresa {
  id_empresa: string;
  nombre: string;
  ruc: string;
  estado: boolean;
}

const NuevoPerfil: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_empresa: '',
    nombre: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Consulta GraphQL para obtener empresas desde InicioNestJS
  const { loading: loadingEmpresas, error: errorEmpresas, data: empresasData } = useQuery(GET_EMPRESAS);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

    // Validar campos requeridos
    if (!formData.nombre.trim()) {
      setError('El nombre del perfil es requerido');
      setLoading(false);
      return;
    }

    if (!formData.id_empresa) {
      setError('Debe seleccionar una empresa');
      setLoading(false);
      return;
    }

    try {
      const result = await crearPerfil({
        id_empresa: formData.id_empresa,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || null
      });

      setSuccess(true);
      
      // Redirigir después de un breve delay para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate('/perfiles');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al crear el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/perfiles');
  };

  // Mostrar loading mientras cargan las empresas
  if (loadingEmpresas) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <Card>
              <CardBody className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando empresas desde InicioNestJS...</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si no se pueden cargar las empresas
  if (errorEmpresas) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <Card>
              <CardBody>
                <Alert color="danger" fade={false} timeout={0}>
                  <h4>Error al cargar empresas desde InicioNestJS</h4>
                  <p>{errorEmpresas.message}</p>
                  <Button color="primary" onClick={handleCancel}>
                    Volver a Perfiles
                  </Button>
                </Alert>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Filtrar solo empresas activas
  const empresasActivas = empresasData?.empresas?.filter((empresa: Empresa) => empresa.estado) || [];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <CardTitle tag="h4" className="mb-0">
                  <i className="bi bi-plus-circle me-2"></i>
                  Nuevo Perfil
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
                  Perfil creado exitosamente usando InicioPython. Redirigiendo...
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="id_empresa" className="fw-bold">
                        Empresa *
                      </Label>
                      <Input
                        id="id_empresa"
                        name="id_empresa"
                        type="select"
                        value={formData.id_empresa}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccione una empresa</option>
                        {empresasActivas.map((empresa: Empresa) => (
                          <option key={empresa.id_empresa} value={empresa.id_empresa}>
                            {empresa.nombre} - {empresa.ruc}
                          </option>
                        ))}
                      </Input>
                      <small className="text-muted">
                        Solo se muestran empresas activas (datos desde InicioNestJS)
                      </small>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="nombre" className="fw-bold">
                        Nombre del Perfil *
                      </Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese el nombre del perfil"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="descripcion" className="fw-bold">
                        Descripción
                      </Label>
                      <Input
                        id="descripcion"
                        name="descripcion"
                        type="textarea"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        placeholder="Ingrese la descripción del perfil"
                        rows={4}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button color="secondary" onClick={handleCancel} disabled={loading}>
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
                  </Button>
                  <Button color="primary" type="submit" disabled={loading || !formData.id_empresa}>
                    {loading ? (
                      <>
                        <i className="bi bi-hourglass-split me-2"></i>
                        Guardando con InicioPython...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Guardar Perfil
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

export default NuevoPerfil; 
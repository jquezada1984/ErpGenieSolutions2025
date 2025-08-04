import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input, Alert, Row, Col, Spinner, Badge } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { actualizarPerfil } from '../../_apis_/perfil';

// Consulta GraphQL para obtener perfil (InicioNestJS)
const GET_PERFIL = gql`
  query GetPerfil($id_perfil: ID!) {
    perfil(id_perfil: $id_perfil) {
      id_perfil
      nombre
      descripcion
      estado
      created_at
      updated_at
      empresa {
        id_empresa
        nombre
        ruc
        estado
      }
    }
  }
`;

const EditarPerfil: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Consulta GraphQL para obtener el perfil desde InicioNestJS
  const { loading: loadingPerfil, error: queryError, data } = useQuery(GET_PERFIL, {
    variables: { id_perfil: id },
    skip: !id
  });

  useEffect(() => {
    if (data?.perfil) {
      const perfil = data.perfil;
      setFormData({
        nombre: perfil.nombre,
        descripcion: perfil.descripcion || '',
        estado: perfil.estado
      });
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    // Validar campos requeridos
    if (!formData.nombre.trim()) {
      setError('El nombre del perfil es requerido');
      setLoading(false);
      return;
    }

    try {
      console.log('📝 Actualizando perfil usando InicioPython...');
      const result = await actualizarPerfil(id, {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || null,
        estado: formData.estado
      });

      console.log('✅ Perfil actualizado exitosamente con InicioPython:', result);
      setSuccess(true);
      
      // Redirigir después de un breve delay para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate('/perfiles');
      }, 2000);
    } catch (err: any) {
      console.error('Error actualizando perfil con InicioPython:', err);
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/perfiles');
  };

  // Mostrar loading mientras carga el perfil
  if (loadingPerfil) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <Card>
              <CardBody className="text-center">
                <Spinner color="primary" />
                <p className="mt-2">Cargando perfil desde InicioNestJS...</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si no se encuentra el perfil
  if (queryError || !data?.perfil) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <Card>
              <CardBody>
                <Alert color="danger" fade={false} timeout={0}>
                  <h4>Error al cargar el perfil desde InicioNestJS</h4>
                  <p>{queryError?.message || 'Perfil no encontrado'}</p>
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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <CardTitle tag="h4" className="mb-0">
                  <i className="bi bi-pencil-square me-2"></i>
                  Editar Perfil
                </CardTitle>
                <Button color="secondary" onClick={handleCancel}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver
                </Button>
              </div>

              {data.perfil.empresa && (
                <Alert color="info" fade={false} className="mb-3" timeout={0}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-building me-2"></i>
                    <div>
                      <strong>Empresa:</strong> {data.perfil.empresa.nombre}
                      <br />
                      <small className="text-muted">
                        RUC: {data.perfil.empresa.ruc} | 
                        Estado: <Badge color={data.perfil.empresa.estado ? 'success' : 'danger'}>
                          {data.perfil.empresa.estado ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </small>
                    </div>
                  </div>
                </Alert>
              )}

              {error && (
                <Alert color="danger" fade={false} className="mb-3" timeout={0}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert color="success" fade={false} className="mb-3" timeout={0}>
                  <i className="bi bi-check-circle me-2"></i>
                  Perfil actualizado exitosamente usando InicioPython. Redirigiendo...
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
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
                  <Col md={6}>
                    <FormGroup check className="d-flex align-items-center h-100">
                      <Label check className="fw-bold ms-2">
                        <Input
                          type="checkbox"
                          name="estado"
                          checked={formData.estado}
                          onChange={handleInputChange}
                        />
                        <span className="ms-2">Perfil Activo</span>
                      </Label>
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
                  <Button color="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <i className="bi bi-hourglass-split me-2"></i>
                        Guardando con InicioPython...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Guardar Cambios
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

export default EditarPerfil; 
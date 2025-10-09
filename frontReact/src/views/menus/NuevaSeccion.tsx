import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input, Alert, Row, Col } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { crearSeccion, actualizarSeccion } from '../../_apis_/menu';

// Consulta GraphQL para obtener una sección
const GET_SECCION = gql`
  query GetSeccion($id_seccion: ID!) {
    seccion(id_seccion: $id_seccion) {
      id_seccion
      nombre
      orden
    }
  }
`;

const NuevaSeccion: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    nombre: '',
    orden: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Consulta GraphQL para obtener la sección cuando se está editando
  const { data: seccionData, loading: loadingData, error: queryError } = useQuery(GET_SECCION, {
    variables: { id_seccion: id },
    skip: !isEditing || !id,
    onCompleted: (data) => {
      if (data?.seccion) {
        setFormData({
          nombre: data.seccion.nombre || '',
          orden: data.seccion.orden || 0
        });
      }
    },
    onError: (error) => {
      setError(error.message || 'Error al cargar la sección');
    }
  });

  // Manejar errores de la consulta GraphQL
  useEffect(() => {
    if (queryError) {
      setError(queryError.message || 'Error al cargar la sección');
    }
  }, [queryError]);

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
    </div>
  );
};

export default NuevaSeccion; 
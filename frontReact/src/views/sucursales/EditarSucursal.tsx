import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input, Alert, Row, Col, Spinner, Badge } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';

// Consulta GraphQL para obtener sucursal
const GET_SUCURSAL = gql`
  query GetSucursal($id_sucursal: ID!) {
    sucursal(id_sucursal: $id_sucursal) {
      id_sucursal
      nombre
      direccion
      telefono
      estado
      codigo_establecimiento
      empresa {
        id_empresa
        nombre
        ruc
        estado
      }
    }
  }
`;

// Mutación GraphQL para actualizar sucursal - sin refetchQueries
const ACTUALIZAR_SUCURSAL = gql`
  mutation ActualizarSucursal(
    $id_sucursal: ID!
    $nombre: String
    $direccion: String
    $telefono: String
    $estado: Boolean
    $codigo_establecimiento: String
  ) {
    actualizarSucursal(
      id_sucursal: $id_sucursal
      nombre: $nombre
      direccion: $direccion
      telefono: $telefono
      estado: $estado
      codigo_establecimiento: $codigo_establecimiento
    ) {
      id_sucursal
      nombre
      direccion
      telefono
      estado
      codigo_establecimiento
    }
  }
`;

const EditarSucursal: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    estado: true,
    codigo_establecimiento: '001'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Consulta GraphQL para obtener la sucursal
  const { loading: loadingSucursal, error: queryError, data } = useQuery(GET_SUCURSAL, {
    variables: { id_sucursal: id },
    skip: !id
  });

  // Mutación GraphQL para actualizar - sin refetchQueries
  const [actualizarSucursal] = useMutation(ACTUALIZAR_SUCURSAL);

  useEffect(() => {
    if (data?.sucursal) {
      const sucursal = data.sucursal;
      setFormData({
        nombre: sucursal.nombre,
        direccion: sucursal.direccion || '',
        telefono: sucursal.telefono || '',
        estado: sucursal.estado,
        codigo_establecimiento: sucursal.codigo_establecimiento
      });
    }
  }, [data]);

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

    // Validar campos requeridos
    if (!formData.nombre.trim()) {
      setError('El nombre de la sucursal es requerido');
      setLoading(false);
      return;
    }

    // Validar código de establecimiento
    if (!/^\d{3}$/.test(formData.codigo_establecimiento)) {
      setError('El código de establecimiento debe ser exactamente 3 dígitos');
      setLoading(false);
      return;
    }

    try {
      const result = await actualizarSucursal({
        variables: {
          id_sucursal: id,
          nombre: formData.nombre.trim(),
          direccion: formData.direccion.trim() || null,
          telefono: formData.telefono.trim() || null,
          estado: formData.estado,
          codigo_establecimiento: formData.codigo_establecimiento
        }
      });

      console.log('✅ Sucursal actualizada exitosamente:', result.data);
      setSuccess(true);
      
      // Redirigir después de un breve delay para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate('/sucursales');
      }, 2000);
    } catch (err: any) {
      console.error('Error actualizando sucursal:', err);
      setError(err.message || 'Error al actualizar la sucursal');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/sucursales');
  };

  // Mostrar loading mientras carga la sucursal
  if (loadingSucursal) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <Card>
              <CardBody className="text-center">
                <Spinner color="primary" />
                <p className="mt-2">Cargando sucursal...</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si no se encuentra la sucursal
  if (queryError || !data?.sucursal) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <Card>
              <CardBody>
                <Alert color="danger" fade={false}>
                  <h4>Error al cargar la sucursal</h4>
                  <p>{queryError?.message || 'Sucursal no encontrada'}</p>
                  <Button color="primary" onClick={handleCancel}>
                    Volver a Sucursales
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
                  Editar Sucursal
                </CardTitle>
                <Button color="secondary" onClick={handleCancel}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver
                </Button>
              </div>

              {data.sucursal.empresa && (
                <Alert color="info" fade={false} className="mb-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-building me-2"></i>
                    <div>
                      <strong>Empresa:</strong> {data.sucursal.empresa.nombre}
                      <br />
                      <small className="text-muted">
                        RUC: {data.sucursal.empresa.ruc} | 
                        Estado: <Badge color={data.sucursal.empresa.estado ? 'success' : 'danger'}>
                          {data.sucursal.empresa.estado ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </small>
                    </div>
                  </div>
                </Alert>
              )}

              {error && (
                <Alert color="danger" fade={false} className="mb-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert color="success" fade={false} className="mb-3">
                  <i className="bi bi-check-circle me-2"></i>
                  Sucursal actualizada exitosamente. Redirigiendo...
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="nombre" className="fw-bold">
                        Nombre de la Sucursal *
                      </Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese el nombre de la sucursal"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="codigo_establecimiento" className="fw-bold">
                        Código de Establecimiento *
                      </Label>
                      <Input
                        id="codigo_establecimiento"
                        name="codigo_establecimiento"
                        type="text"
                        value={formData.codigo_establecimiento}
                        onChange={handleInputChange}
                        required
                        maxLength={3}
                        pattern="[0-9]{3}"
                        placeholder="001"
                      />
                      <small className="text-muted">
                        Debe ser exactamente 3 dígitos (ej: 001, 002, 003)
                      </small>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="direccion" className="fw-bold">
                        Dirección
                      </Label>
                      <Input
                        id="direccion"
                        name="direccion"
                        type="text"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        placeholder="Ingrese la dirección"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="telefono" className="fw-bold">
                        Teléfono
                      </Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="Ingrese el teléfono"
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
                        <span className="ms-2">Sucursal Activa</span>
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

export default EditarSucursal; 
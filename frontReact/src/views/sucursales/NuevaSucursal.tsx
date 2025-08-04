import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input, Alert, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';

// Consulta GraphQL para obtener empresas
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

// Mutación GraphQL para crear sucursal
const CREAR_SUCURSAL = gql`
  mutation CrearSucursal(
    $id_empresa: ID!
    $nombre: String!
    $direccion: String
    $telefono: String
    $codigo_establecimiento: String
  ) {
    crearSucursal(
      id_empresa: $id_empresa
      nombre: $nombre
      direccion: $direccion
      telefono: $telefono
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

interface Empresa {
  id_empresa: string;
  nombre: string;
  ruc: string;
  estado: boolean;
}

const NuevaSucursal: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_empresa: '',
    nombre: '',
    direccion: '',
    telefono: '',
    codigo_establecimiento: '001'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Consulta GraphQL para obtener empresas
  const { loading: loadingEmpresas, error: errorEmpresas, data: empresasData } = useQuery(GET_EMPRESAS);

  // Mutación GraphQL - sin refetchQueries para confiar en la recarga manual
  const [crearSucursal] = useMutation(CREAR_SUCURSAL);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      setError('El nombre de la sucursal es requerido');
      setLoading(false);
      return;
    }

    if (!formData.id_empresa) {
      setError('Debe seleccionar una empresa');
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
      const result = await crearSucursal({
        variables: {
          id_empresa: formData.id_empresa,
          nombre: formData.nombre.trim(),
          direccion: formData.direccion.trim() || null,
          telefono: formData.telefono.trim() || null,
          codigo_establecimiento: formData.codigo_establecimiento
        }
      });

      setSuccess(true);
      
      // Redirigir después de un breve delay para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate('/sucursales');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al crear la sucursal');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/sucursales');
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
                <p className="mt-2">Cargando empresas...</p>
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
                  Nueva Sucursal
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
                  Sucursal creada exitosamente usando InicioPython. Redirigiendo...
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
                        Solo se muestran empresas activas
                      </small>
                    </FormGroup>
                  </Col>
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

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button color="secondary" onClick={handleCancel} disabled={loading}>
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
                  </Button>
                  <Button color="primary" type="submit" disabled={loading || !formData.id_empresa}>
                    {loading ? (
                      <>
                        <i className="bi bi-hourglass-split me-2"></i>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Guardar Sucursal
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

export default NuevaSucursal; 
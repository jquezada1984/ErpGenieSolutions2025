import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input, Alert, Row, Col } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_EMPRESA = gql`
  query GetEmpresa($id: Int!) {
    empresa(id: $id) {
      id_empresa
      nombre
      ruc
      direccion
      telefono
      email
      estado
    }
  }
`;

const UPDATE_EMPRESA = gql`
  mutation UpdateEmpresa($id: Int!, $input: UpdateEmpresaInput!) {
    updateEmpresa(id: $id, updateEmpresaInput: $input) {
      id_empresa
      nombre
      ruc
      direccion
      telefono
      email
      estado
    }
  }
`;

interface Empresa {
  id_empresa: number;
  nombre: string;
  ruc: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  estado: boolean;
}

const EditarEmpresa: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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

  const { data, loading: loadingEmpresa, error: errorEmpresa } = useQuery(GET_EMPRESA, {
    variables: { id: parseInt(id!) },
    onCompleted: (data) => {
      if (data.empresa) {
        setFormData({
          nombre: data.empresa.nombre,
          ruc: data.empresa.ruc,
          direccion: data.empresa.direccion || '',
          telefono: data.empresa.telefono || '',
          email: data.empresa.email || '',
          estado: data.empresa.estado
        });
      }
    }
  });

  const [updateEmpresa] = useMutation(UPDATE_EMPRESA, {
    onCompleted: (data) => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/empresas');
      }, 2000);
    },
    onError: (error) => {
      setLoading(false);
      setError(error.message);
    }
  });

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
      await updateEmpresa({
        variables: {
          id: parseInt(id!),
          input: {
            nombre: formData.nombre,
            ruc: formData.ruc,
            direccion: formData.direccion || null,
            telefono: formData.telefono || null,
            email: formData.email || null,
            estado: formData.estado
          }
        }
      });
    } catch (err) {
      // Error handled in onError callback
    }
  };

  const handleCancel = () => {
    navigate('/empresas');
  };

  if (loadingEmpresa) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <Card>
              <CardBody className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando datos de la empresa...</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (errorEmpresa) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <Card>
              <CardBody>
                <Alert color="danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Error al cargar la empresa: {errorEmpresa.message}
                </Alert>
                <Button color="secondary" onClick={handleCancel}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver
                </Button>
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
                  Editar Empresa
                </CardTitle>
                <Button color="secondary" onClick={handleCancel}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver
                </Button>
              </div>

              {error && (
                <Alert color="danger" className="mb-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert color="success" className="mb-3">
                  <i className="bi bi-check-circle me-2"></i>
                  Empresa actualizada exitosamente. Redirigiendo...
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
                      <Label for="email" className="fw-bold">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
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
                        Actualizar Empresa
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

export default EditarEmpresa; 
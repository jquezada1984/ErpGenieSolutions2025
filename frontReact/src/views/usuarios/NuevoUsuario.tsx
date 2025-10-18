import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input, Alert, Row, Col, Spinner } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { crearUsuario } from '../../_apis_/usuario';

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

// Consulta GraphQL para obtener perfiles (InicioNestJS)
const GET_PERFILES = gql`
  query {
    perfiles {
      id_perfil
      nombre
      descripcion
      estado
      empresa {
        id_empresa
        nombre
      }
    }
  }
`;

interface Empresa {
  id_empresa: string;
  nombre: string;
  ruc: string;
  estado: boolean;
}

interface Perfil {
  id_perfil: string;
  nombre: string;
  descripcion?: string;
  estado: boolean;
  empresa?: {
    id_empresa: string;
    nombre: string;
  };
}

const NuevoUsuario: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_empresa: '',
    id_perfil: '',
    username: '',
    password: '',
    confirmPassword: '',
    nombre_completo: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Consulta GraphQL para obtener empresas desde InicioNestJS
  const { loading: loadingEmpresas, error: errorEmpresas, data: empresasData } = useQuery(GET_EMPRESAS);

  // Consulta GraphQL para obtener perfiles desde InicioNestJS
  const { loading: loadingPerfiles, error: errorPerfiles, data: perfilesData } = useQuery(GET_PERFILES);

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
    if (!formData.username.trim()) {
      setError('El nombre de usuario es requerido');
      setLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setError('La contraseña es requerida');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (!formData.id_empresa) {
      setError('Debe seleccionar una empresa');
      setLoading(false);
      return;
    }

    if (!formData.id_perfil) {
      setError('Debe seleccionar un perfil');
      setLoading(false);
      return;
    }

    // Validar email si se proporciona
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('El formato del email no es válido');
      setLoading(false);
      return;
    }

    try {
      const result = await crearUsuario({
        id_empresa: formData.id_empresa,
        id_perfil: formData.id_perfil,
        username: formData.username.trim(),
        password: formData.password,
        nombre_completo: formData.nombre_completo.trim() || null,
        email: formData.email.trim() || null
      });

      setSuccess(true);
      
      // Redirigir después de un breve delay para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate('/usuarios');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/usuarios');
  };

  // Filtrar perfiles por empresa seleccionada
  const perfilesFiltrados = perfilesData?.perfiles?.filter((perfil: Perfil) => 
    !formData.id_empresa || perfil.empresa?.id_empresa === formData.id_empresa
  ) || [];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <CardTitle tag="h4" className="mb-0">
                  <i className="bi bi-person-plus me-2"></i>
                  Nuevo Usuario
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
                  Usuario creado exitosamente. Redirigiendo...
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="username" className="fw-bold">
                        Nombre de Usuario *
                      </Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese el nombre de usuario"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="nombre_completo" className="fw-bold">
                        Nombre Completo
                      </Label>
                      <Input
                        id="nombre_completo"
                        name="nombre_completo"
                        type="text"
                        value={formData.nombre_completo}
                        onChange={handleInputChange}
                        placeholder="Ingrese el nombre completo"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="password" className="fw-bold">
                        Contraseña *
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="Ingrese la contraseña"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="confirmPassword" className="fw-bold">
                        Confirmar Contraseña *
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        placeholder="Confirme la contraseña"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
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
                        placeholder="usuario@ejemplo.com"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="id_empresa" className="fw-bold">
                        Empresa *
                      </Label>
                      {loadingEmpresas ? (
                        <div className="d-flex align-items-center">
                          <Spinner size="sm" className="me-2" />
                          <span>Cargando empresas...</span>
                        </div>
                      ) : (
                        <Input
                          id="id_empresa"
                          name="id_empresa"
                          type="select"
                          value={formData.id_empresa}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                        >
                          <option value="">Seleccione una empresa</option>
                          {empresasData?.empresas?.map((empresa: Empresa) => (
                            <option key={empresa.id_empresa} value={empresa.id_empresa}>
                              {empresa.nombre} ({empresa.ruc})
                            </option>
                          ))}
                        </Input>
                      )}
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="id_perfil" className="fw-bold">
                        Perfil *
                      </Label>
                      {loadingPerfiles ? (
                        <div className="d-flex align-items-center">
                          <Spinner size="sm" className="me-2" />
                          <span>Cargando perfiles...</span>
                        </div>
                      ) : (
                        <Input
                          id="id_perfil"
                          name="id_perfil"
                          type="select"
                          value={formData.id_perfil}
                          onChange={handleInputChange}
                          required
                          disabled={loading || !formData.id_empresa}
                        >
                          <option value="">
                            {!formData.id_empresa ? 'Primero seleccione una empresa' : 'Seleccione un perfil'}
                          </option>
                          {perfilesFiltrados.map((perfil: Perfil) => (
                            <option key={perfil.id_perfil} value={perfil.id_perfil}>
                              {perfil.nombre}
                              {perfil.descripcion && ` - ${perfil.descripcion}`}
                            </option>
                          ))}
                        </Input>
                      )}
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
                        Creando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Crear Usuario
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

export default NuevoUsuario;







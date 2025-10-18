import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input, Alert, Row, Col, Spinner, Badge } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { actualizarUsuario, cambiarPasswordUsuario } from '../../_apis_/usuario';

// Consulta GraphQL para obtener usuario (InicioNestJS)
const GET_USUARIO = gql`
  query GetUsuario($id_usuario: ID!) {
    usuario(id_usuario: $id_usuario) {
      id_usuario
      username
      nombre_completo
      email
      estado
      created_at
      updated_at
      empresa {
        id_empresa
        nombre
        ruc
        estado
      }
      perfil {
        id_perfil
        nombre
        descripcion
        estado
      }
    }
  }
`;

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

const EditarUsuario: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    id_empresa: '',
    id_perfil: '',
    username: '',
    nombre_completo: '',
    email: '',
    estado: true
  });
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Consulta GraphQL para obtener el usuario desde InicioNestJS
  const { loading: loadingUsuario, error: queryError, data } = useQuery(GET_USUARIO, {
    variables: { id_usuario: id },
    skip: !id
  });

  // Consulta GraphQL para obtener empresas desde InicioNestJS
  const { loading: loadingEmpresas, error: errorEmpresas, data: empresasData } = useQuery(GET_EMPRESAS);

  // Consulta GraphQL para obtener perfiles desde InicioNestJS
  const { loading: loadingPerfiles, error: errorPerfiles, data: perfilesData } = useQuery(GET_PERFILES);

  useEffect(() => {
    if (data?.usuario) {
      const usuario = data.usuario;
      setFormData({
        id_empresa: usuario.empresa?.id_empresa || '',
        id_perfil: usuario.perfil?.id_perfil || '',
        username: usuario.username,
        nombre_completo: usuario.nombre_completo || '',
        email: usuario.email || '',
        estado: usuario.estado
      });
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
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
      const result = await actualizarUsuario(id, {
        id_empresa: formData.id_empresa,
        id_perfil: formData.id_perfil,
        username: formData.username.trim(),
        nombre_completo: formData.nombre_completo.trim() || null,
        email: formData.email.trim() || null,
        estado: formData.estado
      });

      setSuccess(true);
      
      // Redirigir después de un breve delay para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate('/usuarios');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);

    // Validar contraseñas
    if (!passwordData.password.trim()) {
      setPasswordError('La contraseña es requerida');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.password !== passwordData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      setPasswordLoading(false);
      return;
    }

    try {
      await cambiarPasswordUsuario(id, passwordData.password);
      setPasswordSuccess(true);
      setPasswordData({ password: '', confirmPassword: '' });
    } catch (err: any) {
      setPasswordError(err.message || 'Error al cambiar la contraseña');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/usuarios');
  };

  // Mostrar loading mientras carga el usuario
  if (loadingUsuario) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <Card>
              <CardBody className="text-center">
                <Spinner color="primary" />
                <p className="mt-2">Cargando usuario desde InicioNestJS...</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si no se encuentra el usuario
  if (queryError || !data?.usuario) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <Card>
              <CardBody>
                <Alert color="danger" fade={false} timeout={0}>
                  <h4>Error al cargar el usuario desde InicioNestJS</h4>
                  <p>{queryError?.message || 'Usuario no encontrado'}</p>
                  <Button color="primary" onClick={handleCancel}>
                    Volver a Usuarios
                  </Button>
                </Alert>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
                  <i className="bi bi-pencil-square me-2"></i>
                  Editar Usuario
                </CardTitle>
                <Button color="secondary" onClick={handleCancel}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver
                </Button>
              </div>

              {data.usuario.empresa && (
                <Alert color="info" fade={false} className="mb-3" timeout={0}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-building me-2"></i>
                    <div>
                      <strong>Empresa:</strong> {data.usuario.empresa.nombre}
                      <br />
                      <small className="text-muted">
                        RUC: {data.usuario.empresa.ruc} | 
                        Estado: <Badge color={data.usuario.empresa.estado ? 'success' : 'danger'}>
                          {data.usuario.empresa.estado ? 'Activa' : 'Inactiva'}
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
                  Usuario actualizado exitosamente. Redirigiendo...
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
                  <Col md={6}>
                    <FormGroup check className="d-flex align-items-center h-100">
                      <Label check className="fw-bold ms-2">
                        <Input
                          type="checkbox"
                          name="estado"
                          checked={formData.estado}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                        <span className="ms-2">Usuario Activo</span>
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

      {/* Sección para cambiar contraseña */}
      <div className="row mt-4">
        <div className="col-12">
          <Card>
            <CardBody>
              <CardTitle tag="h5" className="mb-4">
                <i className="bi bi-key me-2"></i>
                Cambiar Contraseña
              </CardTitle>

              {passwordError && (
                <Alert color="danger" fade={false} className="mb-3" timeout={0}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {passwordError}
                </Alert>
              )}

              {passwordSuccess && (
                <Alert color="success" fade={false} className="mb-3" timeout={0}>
                  <i className="bi bi-check-circle me-2"></i>
                  Contraseña cambiada exitosamente
                </Alert>
              )}

              <Form onSubmit={handlePasswordSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="password" className="fw-bold">
                        Nueva Contraseña *
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={passwordData.password}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Ingrese la nueva contraseña"
                        disabled={passwordLoading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="confirmPassword" className="fw-bold">
                        Confirmar Nueva Contraseña *
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Confirme la nueva contraseña"
                        disabled={passwordLoading}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button color="warning" type="submit" disabled={passwordLoading}>
                    {passwordLoading ? (
                      <>
                        <i className="bi bi-hourglass-split me-2"></i>
                        Cambiando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-key me-2"></i>
                        Cambiar Contraseña
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

export default EditarUsuario;







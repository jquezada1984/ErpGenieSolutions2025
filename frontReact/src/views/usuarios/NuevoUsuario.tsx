import React, { useState, useCallback } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Row,
  Col,
  Spinner,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import classnames from 'classnames';
import { crearUsuario } from '../../_apis_/usuario';

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

const GET_USUARIOS = gql`
  query {
    usuarios {
      id_usuario
      username
      nombre_completo
    }
  }
`;

const GET_PAISES = gql`
  query {
    paises {
      id_pais
      nombre
      codigo_iso
    }
  }
`;

const GET_PROVINCIAS_BY_PAIS = gql`
  query provinciasByPais($idPais: ID!) {
    provinciasByPais(idPais: $idPais) {
      id_provincia
      nombre
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
  empresa?: { id_empresa: string; nombre: string };
}

interface UsuarioItem {
  id_usuario: string;
  username: string;
  nombre_completo?: string;
}

interface Pais {
  id_pais: string;
  nombre: string;
  codigo_iso: string;
}

interface Provincia {
  id_provincia: string;
  nombre: string;
}

const TITULOS_CORTESIA = ['', 'Sr.', 'Sra.', 'Srta.', 'Dr.', 'Dra.'];

const SEXO_OPCIONES = [
  { value: '', label: '—' },
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'O', label: 'Otro' },
];

const IDIOMAS = ['', 'es', 'en', 'pt', 'fr'];

const initialForm = {
  id_empresa: '',
  id_perfil: '',
  username: '',
  password: '',
  confirmPassword: '',
  nombre_completo: '',
  email: '',
  titulo_cortesia: '',
  apellidos: '',
  nombre: '',
  administrador_sistema: false,
  sexo: '',
  es_empleado: false,
  id_supervisor: '',
  id_validador_gastos: '',
  id_validador_dias_libres: '',
  usuario_externo: false,
  fecha_validez_desde: '',
  fecha_validez_hasta: '',
  direccion: '',
  codigo_postal: '',
  poblacion: '',
  id_pais: '',
  id_provincia: '',
  telefono_trabajo: '',
  movil: '',
  fax: '',
  codigo_contable: '',
  color: '',
  etiquetas_categorias: '',
  idioma_default: '',
  firma: '',
  nota_publica: '',
  nota_privada: '',
  puesto_trabajo: '',
  tasa_hora: '',
  tasa_dia: '',
  salario: '',
  horas_semana: '',
  fecha_empleo_desde: '',
  fecha_empleo_hasta: '',
  fecha_nacimiento: '',
};

const NuevoUsuario: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { loading: loadingEmpresas, data: empresasData } = useQuery(GET_EMPRESAS);
  const { loading: loadingPerfiles, data: perfilesData } = useQuery(GET_PERFILES);
  const { loading: loadingUsuarios, data: usuariosData } = useQuery(GET_USUARIOS);
  const { loading: loadingPaises, data: paisesData } = useQuery(GET_PAISES);
  const { data: provinciasData } = useQuery(GET_PROVINCIAS_BY_PAIS, {
    variables: { idPais: formData.id_pais || null },
    skip: !formData.id_pais,
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      if (!formData.username.trim()) {
        setError('El nombre de usuario (login) es requerido');
        setLoading(false);
        return;
      }
      if (!formData.password) {
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
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('El formato del email no es válido');
        setLoading(false);
        return;
      }

      const payload: Record<string, unknown> = {
        id_empresa: formData.id_empresa,
        id_perfil: formData.id_perfil,
        username: formData.username.trim(),
        password: formData.password,
        nombre_completo:
          [formData.titulo_cortesia, formData.apellidos, formData.nombre]
            .filter(Boolean)
            .join(' ')
            .trim() ||
          formData.nombre_completo.trim() ||
          undefined,
        email: formData.email.trim() || undefined,
        titulo_cortesia: formData.titulo_cortesia || undefined,
        apellidos: formData.apellidos || undefined,
        nombre: formData.nombre || undefined,
        administrador_sistema: formData.administrador_sistema,
        sexo: formData.sexo || undefined,
        es_empleado: formData.es_empleado,
        usuario_externo: formData.usuario_externo,
        direccion: formData.direccion || undefined,
        codigo_postal: formData.codigo_postal || undefined,
        poblacion: formData.poblacion || undefined,
        telefono_trabajo: formData.telefono_trabajo || undefined,
        movil: formData.movil || undefined,
        fax: formData.fax || undefined,
        codigo_contable: formData.codigo_contable || undefined,
        color: formData.color || undefined,
        etiquetas_categorias: formData.etiquetas_categorias || undefined,
        idioma_default: formData.idioma_default || undefined,
        firma: formData.firma || undefined,
        nota_publica: formData.nota_publica || undefined,
        nota_privada: formData.nota_privada || undefined,
        puesto_trabajo: formData.puesto_trabajo || undefined,
        horas_semana: formData.horas_semana ? Number(formData.horas_semana) : undefined,
        fecha_nacimiento: formData.fecha_nacimiento || undefined,
      };
      if (formData.id_supervisor) payload.id_supervisor = formData.id_supervisor;
      if (formData.id_validador_gastos) payload.id_validador_gastos = formData.id_validador_gastos;
      if (formData.id_validador_dias_libres) payload.id_validador_dias_libres = formData.id_validador_dias_libres;
      if (formData.fecha_validez_desde) payload.fecha_validez_desde = formData.fecha_validez_desde;
      if (formData.fecha_validez_hasta) payload.fecha_validez_hasta = formData.fecha_validez_hasta;
      if (formData.id_pais) payload.id_pais = formData.id_pais;
      if (formData.id_provincia) payload.id_provincia = formData.id_provincia;
      if (formData.tasa_hora !== '') payload.tasa_hora = formData.tasa_hora;
      if (formData.tasa_dia !== '') payload.tasa_dia = formData.tasa_dia;
      if (formData.salario !== '') payload.salario = formData.salario;
      if (formData.fecha_empleo_desde) payload.fecha_empleo_desde = formData.fecha_empleo_desde;
      if (formData.fecha_empleo_hasta) payload.fecha_empleo_hasta = formData.fecha_empleo_hasta;

      try {
        await crearUsuario(payload as any);
        setSuccess(true);
        setTimeout(() => navigate('/usuario'), 2000);
      } catch (err: any) {
        setError(err.message || 'Error al crear el usuario');
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate]
  );

  const handleCancel = useCallback(() => navigate('/usuario'), [navigate]);

  const perfilesFiltrados =
    perfilesData?.perfiles?.filter(
      (p: Perfil) => !formData.id_empresa || p.empresa?.id_empresa === formData.id_empresa
    ) || [];
  const usuariosList: UsuarioItem[] = usuariosData?.usuarios || [];
  const paises: Pais[] = paisesData?.paises || [];
  const provincias: Provincia[] = provinciasData?.provinciasByPais || [];

  return (
    <div className="container-fluid">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle tag="h4" className="mb-0">
              <i className="bi bi-person-plus me-2"></i>
              Nuevo Usuario
            </CardTitle>
            <div>
              <Button color="secondary" outline className="me-2" onClick={handleCancel} disabled={loading}>
                Cancelar
              </Button>
              <Button color="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Creando...
                  </>
                ) : (
                  'Crear'
                )}
              </Button>
            </div>
          </div>

          <p className="text-muted small mb-4">
            Este formulario permite crear un usuario interno en su empresa/organización. Para crear un usuario externo
            (cliente, proveedor, etc.), utilice el botón «Crear usuario externo» de la tarjeta de contacto del
            tercero.
          </p>

          {error && (
            <Alert color="danger" fade={false} className="mb-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}
          {success && (
            <Alert color="success" fade={false} className="mb-3">
              <i className="bi bi-check-circle me-2"></i>
              Usuario creado exitosamente. Redirigiendo...
            </Alert>
          )}

          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '1' })}
                onClick={() => setActiveTab('1')}
              >
                Datos de usuario
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '2' })}
                onClick={() => setActiveTab('2')}
              >
                Contacto y ubicación
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '3' })}
                onClick={() => setActiveTab('3')}
              >
                Administrativo y notas
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '4' })}
                onClick={() => setActiveTab('4')}
              >
                Empleo y fechas
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab} className="mt-4">
            <TabPane tabId="1">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="titulo_cortesia">Título de cortesía</Label>
                      <Input
                        id="titulo_cortesia"
                        name="titulo_cortesia"
                        type="select"
                        value={formData.titulo_cortesia}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        {TITULOS_CORTESIA.map((t) => (
                          <option key={t || 'vacio'} value={t}>
                            {t || '—'}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="apellidos" className="fw-bold">Apellidos</Label>
                      <Input
                        id="apellidos"
                        name="apellidos"
                        type="text"
                        value={formData.apellidos}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={formData.nombre}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="username" className="fw-bold">Login *</Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="administrador_sistema">Administrador de sistema</Label>
                      <Input
                        id="administrador_sistema"
                        name="administrador_sistema"
                        type="select"
                        value={formData.administrador_sistema ? 'S' : 'N'}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, administrador_sistema: e.target.value === 'S' }))
                        }
                        disabled={loading}
                      >
                        <option value="N">No</option>
                        <option value="S">Sí</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="sexo">Sexo</Label>
                      <Input
                        id="sexo"
                        name="sexo"
                        type="select"
                        value={formData.sexo}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        {SEXO_OPCIONES.map((o) => (
                          <option key={o.value || 'v'} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="checkbox"
                          name="es_empleado"
                          checked={formData.es_empleado}
                          onChange={handleChange}
                          disabled={loading}
                        />
                        Empleado
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="id_supervisor">Supervisor</Label>
                      <Input
                        id="id_supervisor"
                        name="id_supervisor"
                        type="select"
                        value={formData.id_supervisor}
                        onChange={handleChange}
                        disabled={loading || loadingUsuarios}
                      >
                        <option value="">—</option>
                        {usuariosList.map((u) => (
                          <option key={u.id_usuario} value={u.id_usuario}>
                            {u.nombre_completo || u.username}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="id_validador_gastos">Forzar validador de informes de gastos</Label>
                      <Input
                        id="id_validador_gastos"
                        name="id_validador_gastos"
                        type="select"
                        value={formData.id_validador_gastos}
                        onChange={handleChange}
                        disabled={loading || loadingUsuarios}
                      >
                        <option value="">—</option>
                        {usuariosList.map((u) => (
                          <option key={u.id_usuario} value={u.id_usuario}>
                            {u.nombre_completo || u.username}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="id_validador_dias_libres">Forzar validador de solicitud de días libres</Label>
                      <Input
                        id="id_validador_dias_libres"
                        name="id_validador_dias_libres"
                        type="select"
                        value={formData.id_validador_dias_libres}
                        onChange={handleChange}
                        disabled={loading || loadingUsuarios}
                      >
                        <option value="">—</option>
                        {usuariosList.map((u) => (
                          <option key={u.id_usuario} value={u.id_usuario}>
                            {u.nombre_completo || u.username}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Usuario externo?</Label>
                      <Input plaintext value="Interno" readOnly disabled />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="fecha_validez_desde">Intervalo de validez de acceso (de)</Label>
                      <Input
                        id="fecha_validez_desde"
                        name="fecha_validez_desde"
                        type="date"
                        value={formData.fecha_validez_desde}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="fecha_validez_hasta">a</Label>
                      <Input
                        id="fecha_validez_hasta"
                        name="fecha_validez_hasta"
                        type="date"
                        value={formData.fecha_validez_hasta}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="password" className="fw-bold">Contraseña *</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="confirmPassword" className="fw-bold">Confirmar contraseña *</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="id_empresa" className="fw-bold">Empresa *</Label>
                      {loadingEmpresas ? (
                        <Spinner size="sm" />
                      ) : (
                        <Input
                          id="id_empresa"
                          name="id_empresa"
                          type="select"
                          value={formData.id_empresa}
                          onChange={(e) => {
                            handleChange(e);
                            setFormData((prev) => ({ ...prev, id_provincia: '' }));
                          }}
                          required
                          disabled={loading}
                        >
                          <option value="">Seleccione una empresa</option>
                          {empresasData?.empresas?.map((emp: Empresa) => (
                            <option key={emp.id_empresa} value={emp.id_empresa}>
                              {emp.nombre} ({emp.ruc})
                            </option>
                          ))}
                        </Input>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="id_perfil" className="fw-bold">Perfil *</Label>
                      {loadingPerfiles ? (
                        <Spinner size="sm" />
                      ) : (
                        <Input
                          id="id_perfil"
                          name="id_perfil"
                          type="select"
                          value={formData.id_perfil}
                          onChange={handleChange}
                          required
                          disabled={loading || !formData.id_empresa}
                        >
                          <option value="">
                            {!formData.id_empresa ? 'Primero seleccione una empresa' : 'Seleccione un perfil'}
                          </option>
                          {perfilesFiltrados.map((p: Perfil) => (
                            <option key={p.id_perfil} value={p.id_perfil}>
                              {p.nombre} {p.descripcion ? `- ${p.descripcion}` : ''}
                            </option>
                          ))}
                        </Input>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </TabPane>

            <TabPane tabId="2">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="direccion">Dirección</Label>
                      <Input
                        id="direccion"
                        name="direccion"
                        type="text"
                        value={formData.direccion}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="codigo_postal">Código postal</Label>
                      <Input
                        id="codigo_postal"
                        name="codigo_postal"
                        type="text"
                        value={formData.codigo_postal}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="poblacion">Población</Label>
                      <Input
                        id="poblacion"
                        name="poblacion"
                        type="text"
                        value={formData.poblacion}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="id_pais">País</Label>
                      <Input
                        id="id_pais"
                        name="id_pais"
                        type="select"
                        value={formData.id_pais}
                        onChange={(e) => {
                          handleChange(e);
                          setFormData((prev) => ({ ...prev, id_provincia: '' }));
                        }}
                        disabled={loading || loadingPaises}
                      >
                        <option value="">—</option>
                        {paises.map((p) => (
                          <option key={p.id_pais} value={p.id_pais}>
                            {p.nombre}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="id_provincia">Provincia</Label>
                      <Input
                        id="id_provincia"
                        name="id_provincia"
                        type="select"
                        value={formData.id_provincia}
                        onChange={handleChange}
                        disabled={loading || !formData.id_pais}
                      >
                        <option value="">—</option>
                        {provincias.map((pr) => (
                          <option key={pr.id_provincia} value={pr.id_provincia}>
                            {pr.nombre}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="telefono_trabajo">Teléf. trabajo</Label>
                      <Input
                        id="telefono_trabajo"
                        name="telefono_trabajo"
                        type="text"
                        value={formData.telefono_trabajo}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="movil">Móvil</Label>
                      <Input
                        id="movil"
                        name="movil"
                        type="text"
                        value={formData.movil}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="fax">Fax</Label>
                      <Input
                        id="fax"
                        name="fax"
                        type="text"
                        value={formData.fax}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="email">Correo</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </TabPane>

            <TabPane tabId="3">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="codigo_contable">Código contable</Label>
                      <Input
                        id="codigo_contable"
                        name="codigo_contable"
                        type="text"
                        value={formData.codigo_contable}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="color">Color</Label>
                      <Input
                        id="color"
                        name="color"
                        type="text"
                        value={formData.color}
                        onChange={handleChange}
                        placeholder="#hex o nombre"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="etiquetas_categorias">Etiquetas/Categorías</Label>
                      <Input
                        id="etiquetas_categorias"
                        name="etiquetas_categorias"
                        type="text"
                        value={formData.etiquetas_categorias}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="idioma_default">Idioma predeterminado</Label>
                      <Input
                        id="idioma_default"
                        name="idioma_default"
                        type="select"
                        value={formData.idioma_default}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        {IDIOMAS.map((id) => (
                          <option key={id || 'v'} value={id}>
                            {id || '—'}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label for="firma">Firma</Label>
                  <Input
                    id="firma"
                    name="firma"
                    type="textarea"
                    rows={4}
                    value={formData.firma}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="nota_publica">Nota (pública)</Label>
                  <Input
                    id="nota_publica"
                    name="nota_publica"
                    type="textarea"
                    rows={4}
                    value={formData.nota_publica}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="nota_privada">Nota (privada)</Label>
                  <Input
                    id="nota_privada"
                    name="nota_privada"
                    type="textarea"
                    rows={4}
                    value={formData.nota_privada}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </FormGroup>
              </Form>
            </TabPane>

            <TabPane tabId="4">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="puesto_trabajo">Puesto de trabajo</Label>
                      <Input
                        id="puesto_trabajo"
                        name="puesto_trabajo"
                        type="text"
                        value={formData.puesto_trabajo}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="tasa_hora">Tasa media por hora (€)</Label>
                      <Input
                        id="tasa_hora"
                        name="tasa_hora"
                        type="number"
                        step="0.01"
                        value={formData.tasa_hora}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="tasa_dia">Tasa media por día (€)</Label>
                      <Input
                        id="tasa_dia"
                        name="tasa_dia"
                        type="number"
                        step="0.01"
                        value={formData.tasa_dia}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="salario">Salario (€)</Label>
                      <Input
                        id="salario"
                        name="salario"
                        type="number"
                        step="0.01"
                        value={formData.salario}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="horas_semana">Horas trabajadas (por semana)</Label>
                      <Input
                        id="horas_semana"
                        name="horas_semana"
                        type="number"
                        step="0.01"
                        value={formData.horas_semana}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="fecha_empleo_desde">Fecha empleo (de)</Label>
                      <Input
                        id="fecha_empleo_desde"
                        name="fecha_empleo_desde"
                        type="date"
                        value={formData.fecha_empleo_desde}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="fecha_empleo_hasta">a</Label>
                      <Input
                        id="fecha_empleo_hasta"
                        name="fecha_empleo_hasta"
                        type="date"
                        value={formData.fecha_empleo_hasta}
                        onChange={handleChange}
                        placeholder="Ahora"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="fecha_nacimiento">Fecha de nacimiento</Label>
                      <Input
                        id="fecha_nacimiento"
                        name="fecha_nacimiento"
                        type="date"
                        value={formData.fecha_nacimiento}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </div>
  );
};

export default NuevoUsuario;

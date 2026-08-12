import React, { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
} from 'reactstrap';
import ConfigEmpresaBar from '../../components/ConfigEmpresaBar';
import { useConfigEmpresaScope } from '../../hooks/useConfigEmpresaScope';

const TABS = [
  { id: 'misc', label: 'Miscelánea' },
  { id: 'pass', label: 'Contraseñas' },
  { id: 'files', label: 'Archivos (Enviar archivo)' },
  { id: 'ext', label: 'Acceso externo/Internet' },
  { id: 'events', label: 'Eventos de seguridad' },
  { id: 'perms', label: 'Permisos por defecto' },
];

/**
 * Configuración de seguridad — UI estilo Dolibarr.
 * Persistencia real pendiente.
 */
const Seguridad = () => {
  const empresaScope = useConfigEmpresaScope();
  const [tab, setTab] = useState('misc');
  const [captcha, setCaptcha] = useState(false);
  const [derechosAvanzados, setDerechosAvanzados] = useState(false);
  const [timeoutSesion, setTimeoutSesion] = useState(1440);
  const [maxImagenes, setMaxImagenes] = useState(0);
  const [maxPostsIp, setMaxPostsIp] = useState(200);
  const [maxArchivos, setMaxArchivos] = useState(10);
  const [maxAuthFail, setMaxAuthFail] = useState(100);
  const [minPassword, setMinPassword] = useState(8);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const modificar = () => {
    setMensaje('Parámetros de seguridad actualizados en vista previa (persistencia pendiente).');
  };

  return (
    <Card className="shadow-sm">
      <CardBody>
        <CardTitle tag="h4" className="d-flex align-items-center gap-2 mb-2">
          <i className="bi bi-wrench" /> Configuración de la seguridad
        </CardTitle>
        <p className="text-muted">Aquí se definen los parámetros relacionados con la seguridad.</p>
        <ConfigEmpresaBar scope={empresaScope} />
        {!empresaScope.ready ? null : (
        <>
        {mensaje && (
          <Alert color="info" fade={false} timeout={0} className="py-2">
            {mensaje}
          </Alert>
        )}

        <Nav tabs className="mb-3">
          {TABS.map((t) => (
            <NavItem key={t.id}>
              <NavLink
                href="#"
                className={tab === t.id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setTab(t.id);
                }}
              >
                {t.label}
              </NavLink>
            </NavItem>
          ))}
        </Nav>

        <TabContent activeTab={tab}>
          <TabPane tabId="misc">
            <h6 className="bg-light p-2 mb-3">Parámetros</h6>
            <FormGroup check className="mb-2">
              <Input
                id="captcha"
                type="checkbox"
                checked={captcha}
                onChange={(e) => setCaptcha(e.target.checked)}
              />
              <Label check htmlFor="captcha">
                Usar código gráfico (CAPTCHA) en la página de inicio de sesión y algunas páginas
                públicas
              </Label>
            </FormGroup>
            <FormGroup check className="mb-4">
              <Input
                id="derechos"
                type="checkbox"
                checked={derechosAvanzados}
                onChange={(e) => setDerechosAvanzados(e.target.checked)}
              />
              <Label check htmlFor="derechos">
                Usar los derechos avanzados en los permisos de los módulos
              </Label>
            </FormGroup>

            <h6 className="bg-light p-2 mb-3">Parámetros con valores</h6>
            <Table bordered size="sm" className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Parámetros</th>
                  <th style={{ width: 220 }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Timeout de sesiones{' '}
                    <i className="bi bi-info-circle text-muted" title="Segundos de inactividad" />
                  </td>
                  <td>
                    <Input
                      type="number"
                      bsSize="sm"
                      value={timeoutSesion}
                      onChange={(e) => setTimeoutSesion(parseInt(e.target.value, 10) || 0)}
                    />
                    <span className="text-muted small ms-1">segundos</span>
                  </td>
                </tr>
                <tr>
                  <td>Número máximo de imágenes permitidas en un campo HTML...</td>
                  <td>
                    <Input
                      type="number"
                      bsSize="sm"
                      value={maxImagenes}
                      onChange={(e) => setMaxImagenes(parseInt(e.target.value, 10) || 0)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    Número máximo de publicaciones en páginas públicas con la misma dirección IP en
                    un mes
                  </td>
                  <td>
                    <Input
                      type="number"
                      bsSize="sm"
                      value={maxPostsIp}
                      onChange={(e) => setMaxPostsIp(parseInt(e.target.value, 10) || 0)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Número máximo de archivos unidos en un formulario</td>
                  <td>
                    <Input
                      type="number"
                      bsSize="sm"
                      value={maxArchivos}
                      onChange={(e) => setMaxArchivos(parseInt(e.target.value, 10) || 0)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Número máximo de autenticación fallida en 24 horas...</td>
                  <td>
                    <Input
                      type="number"
                      bsSize="sm"
                      value={maxAuthFail}
                      onChange={(e) => setMaxAuthFail(parseInt(e.target.value, 10) || 0)}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </TabPane>

          <TabPane tabId="pass">
            <h6 className="bg-light p-2 mb-3">Contraseñas</h6>
            <FormGroup>
              <Label>Longitud mínima de contraseña</Label>
              <Input
                type="number"
                style={{ maxWidth: 160 }}
                value={minPassword}
                onChange={(e) => setMinPassword(parseInt(e.target.value, 10) || 0)}
              />
            </FormGroup>
            <p className="text-muted small">Más reglas de complejidad se añadirán en una fase posterior.</p>
          </TabPane>

          <TabPane tabId="files">
            <Alert color="secondary" fade={false} timeout={0}>
              Parámetros de envío/subida de archivos: configuración pendiente de backend.
            </Alert>
          </TabPane>

          <TabPane tabId="ext">
            <Alert color="secondary" fade={false} timeout={0}>
              Acceso externo / Internet: configuración pendiente de backend.
            </Alert>
          </TabPane>

          <TabPane tabId="events">
            <Alert color="secondary" fade={false} timeout={0}>
              Eventos de seguridad: listado y retención pendientes de backend.
            </Alert>
          </TabPane>

          <TabPane tabId="perms">
            <Alert color="secondary" fade={false} timeout={0}>
              Permisos por defecto al crear perfiles: pendiente de backend.
            </Alert>
          </TabPane>
        </TabContent>

        <div className="text-center mt-3">
          <Button color="primary" onClick={modificar}>
            Modificar
          </Button>
        </div>
        </>
        )}
      </CardBody>
    </Card>
  );
};

export default Seguridad;

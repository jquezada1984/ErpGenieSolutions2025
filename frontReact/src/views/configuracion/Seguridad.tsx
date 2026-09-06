import React, { useCallback, useEffect, useState } from 'react';
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
  Spinner,
  TabContent,
  TabPane,
  Table,
} from 'reactstrap';
import useJwtPayload from '../../hooks/useJwtPayload';
import { isScopeGlobal } from '../../utils/scopeAcceso';
import {
  guardarSeguridadInstancia,
  obtenerSeguridadInstancia,
} from '../../_apis_/configEmpresa';

const TABS = [
  { id: 'misc', label: 'Miscelánea' },
  { id: 'pass', label: 'Contraseñas' },
  { id: 'files', label: 'Archivos (Enviar archivo)' },
  { id: 'ext', label: 'Acceso externo/Internet' },
  { id: 'events', label: 'Eventos de seguridad' },
  { id: 'perms', label: 'Permisos por defecto' },
];

/**
 * Seguridad de instancia (no por empresa). Solo GLOBAL puede guardar.
 */
const Seguridad = () => {
  const payload = useJwtPayload();
  const scopeGlobal = isScopeGlobal(payload);
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cfg = await obtenerSeguridadInstancia();
      const s = (cfg?.seguridad || {}) as Record<string, unknown>;
      setCaptcha(Boolean(s.captcha));
      setDerechosAvanzados(Boolean(s.derechos_avanzados));
      setTimeoutSesion(Number(s.timeout_sesion ?? 1440));
      setMaxImagenes(Number(s.max_imagenes ?? 0));
      setMaxPostsIp(Number(s.max_posts_ip ?? 200));
      setMaxArchivos(Number(s.max_archivos ?? 10));
      setMaxAuthFail(Number(s.max_auth_fail ?? 100));
      setMinPassword(Number(s.min_password ?? 8));
    } catch (e: any) {
      setError(e?.response?.data?.error || e.message || 'No se pudo cargar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const modificar = async () => {
    if (!scopeGlobal) {
      setError('Solo usuarios con alcance GLOBAL pueden modificar la seguridad de instancia.');
      return;
    }
    setSaving(true);
    setMensaje(null);
    setError(null);
    try {
      await guardarSeguridadInstancia({
        captcha,
        derechos_avanzados: derechosAvanzados,
        timeout_sesion: timeoutSesion,
        max_imagenes: maxImagenes,
        max_posts_ip: maxPostsIp,
        max_archivos: maxArchivos,
        max_auth_fail: maxAuthFail,
        min_password: minPassword,
      });
      setMensaje('Seguridad de instancia guardada.');
    } catch (e: any) {
      setError(e?.response?.data?.error || e.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardBody>
        <CardTitle tag="h4" className="d-flex align-items-center gap-2 mb-2">
          <i className="bi bi-wrench" /> Configuración de la seguridad
        </CardTitle>
        <p className="text-muted">
          Parámetros de instancia (no por empresa).{' '}
          {scopeGlobal
            ? 'Puede editar y guardar.'
            : 'Solo lectura: se requiere alcance GLOBAL para modificar.'}
        </p>
        {loading && (
          <div className="mb-2 text-muted">
            <Spinner size="sm" /> Cargando…
          </div>
        )}
        {error && (
          <Alert color="danger" fade={false} className="py-2">
            {error}
          </Alert>
        )}
        {mensaje && (
          <Alert color="success" fade={false} className="py-2">
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
                disabled={!scopeGlobal}
                onChange={(e) => setCaptcha(e.target.checked)}
              />
              <Label check htmlFor="captcha">
                Usar código gráfico (CAPTCHA) en la página de inicio de sesión
              </Label>
            </FormGroup>
            <FormGroup check className="mb-4">
              <Input
                id="derechos"
                type="checkbox"
                checked={derechosAvanzados}
                disabled={!scopeGlobal}
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
                  <td>Timeout de sesiones</td>
                  <td>
                    <Input
                      type="number"
                      bsSize="sm"
                      value={timeoutSesion}
                      disabled={!scopeGlobal}
                      onChange={(e) => setTimeoutSesion(parseInt(e.target.value, 10) || 0)}
                    />
                    <span className="text-muted small ms-1">segundos</span>
                  </td>
                </tr>
                <tr>
                  <td>Máximo de imágenes en un campo HTML</td>
                  <td>
                    <Input
                      type="number"
                      bsSize="sm"
                      value={maxImagenes}
                      disabled={!scopeGlobal}
                      onChange={(e) => setMaxImagenes(parseInt(e.target.value, 10) || 0)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Máximo de publicaciones públicas por IP / mes</td>
                  <td>
                    <Input
                      type="number"
                      bsSize="sm"
                      value={maxPostsIp}
                      disabled={!scopeGlobal}
                      onChange={(e) => setMaxPostsIp(parseInt(e.target.value, 10) || 0)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Máximo de archivos en un formulario</td>
                  <td>
                    <Input
                      type="number"
                      bsSize="sm"
                      value={maxArchivos}
                      disabled={!scopeGlobal}
                      onChange={(e) => setMaxArchivos(parseInt(e.target.value, 10) || 0)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Máximo de autenticaciones fallidas en 24 h</td>
                  <td>
                    <Input
                      type="number"
                      bsSize="sm"
                      value={maxAuthFail}
                      disabled={!scopeGlobal}
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
                disabled={!scopeGlobal}
                onChange={(e) => setMinPassword(parseInt(e.target.value, 10) || 0)}
              />
            </FormGroup>
          </TabPane>

          <TabPane tabId="files">
            <Alert color="secondary" fade={false}>
              Parámetros de envío/subida de archivos: pendiente.
            </Alert>
          </TabPane>
          <TabPane tabId="ext">
            <Alert color="secondary" fade={false}>
              Acceso externo / Internet: pendiente.
            </Alert>
          </TabPane>
          <TabPane tabId="events">
            <Alert color="secondary" fade={false}>
              Eventos de seguridad: pendiente.
            </Alert>
          </TabPane>
          <TabPane tabId="perms">
            <Alert color="secondary" fade={false}>
              Permisos por defecto: pendiente.
            </Alert>
          </TabPane>
        </TabContent>

        <div className="text-center mt-3">
          <Button
            color="primary"
            onClick={modificar}
            disabled={saving || !scopeGlobal}
            data-testid="seguridad-modificar"
          >
            {saving ? 'Guardando…' : 'Modificar'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default Seguridad;

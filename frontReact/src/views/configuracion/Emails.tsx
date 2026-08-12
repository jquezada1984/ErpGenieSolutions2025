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
  { id: 'out', label: 'E-mails salientes' },
  { id: 'from', label: 'Perfiles de remitentes de e-mails' },
  { id: 'tpl', label: 'Plantillas Email' },
  { id: 'in', label: 'E-mails entrantes' },
];

/**
 * Configuración de e-mails — UI estilo Dolibarr.
 * Persistencia real pendiente.
 */
const Emails = () => {
  const empresaScope = useConfigEmpresaScope();
  const [tab, setTab] = useState('out');
  const [metodoEnvio, setMetodoEnvio] = useState('php');
  const [deshabilitarEmails, setDeshabilitarEmails] = useState(false);
  const [redirigirPrueba, setRedirigirPrueba] = useState('');
  const [remitente, setRemitente] = useState('robot@ejemplo.com');
  const [bccCopy, setBccCopy] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const modificar = () => {
    setMensaje('Configuración de e-mails actualizada en vista previa (persistencia pendiente).');
  };

  const probarEnvio = () => {
    setMensaje('Prueba de envío simulada (SMTP/backend pendiente).');
  };

  return (
    <Card className="shadow-sm">
      <CardBody>
        <CardTitle tag="h4" className="d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-gear" /> Configuración e-mails
        </CardTitle>
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
          <TabPane tabId="out">
            <h6 className="bg-light p-2 mb-3">Parámetros</h6>
            <Table bordered size="sm" className="mb-4">
              <tbody>
                <tr>
                  <td style={{ width: '40%' }}>Método de envío</td>
                  <td>
                    <Input
                      type="select"
                      bsSize="sm"
                      value={metodoEnvio}
                      onChange={(e) => setMetodoEnvio(e.target.value)}
                    >
                      <option value="php">PHP mail function</option>
                      <option value="smtp">SMTP</option>
                      <option value="disabled">Deshabilitado</option>
                    </Input>
                  </td>
                </tr>
              </tbody>
            </Table>

            <h6 className="bg-light p-2 mb-3">Parámetros para el entorno de prueba</h6>
            <FormGroup check className="mb-2">
              <Input
                id="disableMail"
                type="checkbox"
                checked={deshabilitarEmails}
                onChange={(e) => setDeshabilitarEmails(e.target.checked)}
              />
              <Label check htmlFor="disableMail">
                Deshabilitar todos los envíos de e-mail
              </Label>
            </FormGroup>
            <FormGroup className="mb-4">
              <Label>Redirigir todos los e-mails a (prueba)</Label>
              <Input
                type="email"
                value={redirigirPrueba}
                placeholder="prueba@ejemplo.com"
                onChange={(e) => setRedirigirPrueba(e.target.value)}
              />
            </FormGroup>

            <h6 className="bg-light p-2 mb-3">Otras opciones</h6>
            <FormGroup>
              <Label>Correo electrónico del remitente</Label>
              <Input
                type="email"
                value={remitente}
                onChange={(e) => setRemitente(e.target.value)}
              />
            </FormGroup>
            <FormGroup check className="mb-3">
              <Input
                id="bccCopy"
                type="checkbox"
                checked={bccCopy}
                onChange={(e) => setBccCopy(e.target.checked)}
              />
              <Label check htmlFor="bccCopy">
                Enviar copia BCC al remitente
              </Label>
            </FormGroup>
          </TabPane>

          <TabPane tabId="from">
            <Alert color="secondary" fade={false} timeout={0}>
              Perfiles de remitentes: listado y CRUD pendientes de backend.
            </Alert>
          </TabPane>

          <TabPane tabId="tpl">
            <Alert color="secondary" fade={false} timeout={0}>
              Plantillas de e-mail: edición pendiente de backend.
            </Alert>
          </TabPane>

          <TabPane tabId="in">
            <Alert color="secondary" fade={false} timeout={0}>
              E-mails entrantes (IMAP/POP): configuración pendiente de backend.
            </Alert>
          </TabPane>
        </TabContent>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button color="primary" onClick={modificar}>
            Modificar
          </Button>
          <Button color="primary" outline onClick={probarEnvio}>
            Probar envío
          </Button>
        </div>
        </>
        )}
      </CardBody>
    </Card>
  );
};

export default Emails;

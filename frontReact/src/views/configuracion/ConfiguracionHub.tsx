import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from 'reactstrap';
import ConfigEmpresaBar from '../../components/ConfigEmpresaBar';
import { useConfigEmpresaScope } from '../../hooks/useConfigEmpresaScope';

const PRINCIPALES = [
  {
    titulo: 'Empresa / Organización',
    desc: 'Datos fiscales, contacto, moneda e identificación de la empresa del contexto.',
    to: '/configuracion/empresa',
    icon: 'bi bi-building',
  },
  {
    titulo: 'Diccionarios',
    desc: 'Condiciones y modos de pago, monedas, IVA, formatos de papel y más.',
    to: '/configuracion/diccionarios',
    icon: 'bi bi-book',
  },
] as const;

const SECUNDARIOS = [
  { titulo: 'Paneles', to: '/configuracion/paneles', icon: 'bi bi-grid-3x3-gap' },
  { titulo: 'Alertas', to: '/configuracion/alertas', icon: 'bi bi-exclamation-triangle' },
  { titulo: 'Seguridad', to: '/configuracion/seguridad', icon: 'bi bi-shield-lock' },
  { titulo: 'E-Mails', to: '/configuracion/emails', icon: 'bi bi-envelope' },
] as const;

const ConfiguracionHub: React.FC = () => {
  const empresaScope = useConfigEmpresaScope();

  return (
    <div className="py-3" data-testid="config-hub">
      <Card className="mb-3">
        <CardBody>
          <CardTitle tag="h4" className="mb-1">
            Configuración
          </CardTitle>
          <p className="text-muted mb-3">
            Parámetros de la empresa del contexto. El alcance GLOBAL permite elegir empresa;
            EMPRESA opera solo sobre la suya.
          </p>
          <ConfigEmpresaBar scope={empresaScope} />
        </CardBody>
      </Card>

      <Row className="g-3 mb-3">
        {PRINCIPALES.map((c) => (
          <Col md={6} key={c.to}>
            <Card className="h-100">
              <CardBody>
                <div className="d-flex align-items-start gap-3">
                  <i className={`${c.icon} fs-3 text-primary`} aria-hidden />
                  <div>
                    <CardTitle tag="h5" className="mb-1">
                      <Link to={c.to} className="text-decoration-none">
                        {c.titulo}
                      </Link>
                    </CardTitle>
                    <p className="text-muted small mb-2">{c.desc}</p>
                    <Link to={c.to} className="small">
                      Abrir →
                    </Link>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <Card>
        <CardBody>
          <CardTitle tag="h5">Más opciones</CardTitle>
          <ListGroup flush>
            {SECUNDARIOS.map((s) => (
              <ListGroupItem
                key={s.to}
                action
                tag={Link}
                to={s.to}
                className="d-flex align-items-center gap-2"
              >
                <i className={s.icon} aria-hidden />
                {s.titulo}
              </ListGroupItem>
            ))}
          </ListGroup>
        </CardBody>
      </Card>
    </div>
  );
};

export default ConfiguracionHub;

import React from 'react';
import { Alert, Card, CardBody, CardTitle, Col, Row, Spinner } from 'reactstrap';
import ConfigEmpresaBar from '../../components/ConfigEmpresaBar';
import { useConfigEmpresaScope } from '../../hooks/useConfigEmpresaScope';

type Props = {
  titulo: string;
  subtitulo?: string;
  children?: React.ReactNode;
  /** Si false, no exige empresa (p.ej. shells estáticos) */
  requireEmpresa?: boolean;
};

/**
 * Layout común de área/dashboard por módulo (estilo Dolibarr).
 */
const DashboardModulo: React.FC<Props> = ({
  titulo,
  subtitulo,
  children,
  requireEmpresa = true,
}) => {
  const empresaScope = useConfigEmpresaScope();

  return (
    <div className="py-3" data-testid="dashboard-modulo">
      <Card className="mb-3 shadow-sm">
        <CardBody>
          <CardTitle tag="h4" className="mb-1" data-testid="dashboard-titulo">
            {titulo}
          </CardTitle>
          {subtitulo && <p className="text-muted mb-3">{subtitulo}</p>}
          <ConfigEmpresaBar scope={empresaScope} />
        </CardBody>
      </Card>

      {requireEmpresa && !empresaScope.ready ? (
        <Alert color="info" fade={false}>
          Seleccione una empresa para ver el área del módulo.
        </Alert>
      ) : (
        children
      )}
    </div>
  );
};

export type KpiItem = { label: string; value: string | number; to?: string; tone?: 'default' | 'warning' | 'danger' };

export const DashboardKpis: React.FC<{ items: KpiItem[]; loading?: boolean }> = ({
  items,
  loading,
}) => {
  if (loading) {
    return (
      <div className="text-muted mb-3">
        <Spinner size="sm" /> Cargando indicadores…
      </div>
    );
  }
  return (
    <Row className="g-3 mb-3">
      {items.map((k) => (
        <Col key={k.label} xs={6} md={3}>
          <Card className="h-100 shadow-sm">
            <CardBody>
              <div className="text-muted small">{k.label}</div>
              <div
                className={`fs-4 fw-semibold ${
                  k.tone === 'danger' ? 'text-danger' : k.tone === 'warning' ? 'text-warning' : ''
                }`}
              >
                {k.to ? (
                  <a href={k.to} className="text-decoration-none">
                    {k.value}
                  </a>
                ) : (
                  k.value
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export const DashboardAtajos: React.FC<{ links: { label: string; to: string; icon?: string }[] }> = ({
  links,
}) => (
  <Card className="shadow-sm mb-3">
    <CardBody>
      <CardTitle tag="h5">Accesos rápidos</CardTitle>
      <div className="d-flex flex-wrap gap-2">
        {links.map((l) => (
          <a key={l.to} href={l.to} className="btn btn-outline-primary btn-sm">
            {l.icon && <i className={`${l.icon} me-1`} />}
            {l.label}
          </a>
        ))}
      </div>
    </CardBody>
  </Card>
);

export default DashboardModulo;

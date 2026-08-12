import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem } from 'reactstrap';
import ConfigEmpresaBar from '../../../../components/ConfigEmpresaBar';
import { useConfigEmpresaScope } from '../../../../hooks/useConfigEmpresaScope';

const SLUGS = [
  { titulo: 'Condiciones de pago', slug: 'condiciones-pago' },
  { titulo: 'Modos de pago', slug: 'modos-pago' },
  { titulo: 'Monedas', slug: 'monedas' },
  { titulo: 'Tipo de entidad legal para Terceros', slug: 'tipo-entidad-legal' },
  { titulo: 'Formatos de papel', slug: 'formatos-papel' },
] as const;

const DiccionariosIndex = () => {
  const { pathname } = useLocation();
  const empresaScope = useConfigEmpresaScope();
  const base = useMemo(
    () =>
      pathname.startsWith('/configuracion/')
        ? '/configuracion/diccionarios'
        : '/financiero/configuracion/diccionarios',
    [pathname],
  );

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">Diccionarios</CardTitle>
        <p className="text-muted">
          Datos de referencia por empresa. Las bajas se realizan desactivando el estado (no se
          eliminan registros). Condiciones de pago, modos de pago y formatos de papel son por
          empresa; monedas y tipo de entidad legal son catálogos globales.
        </p>
        <ConfigEmpresaBar scope={empresaScope} />
        {empresaScope.ready && (
          <ListGroup>
            {SLUGS.map((e) => {
              const ruta = `${base}/${e.slug}`;
              return (
                <ListGroupItem
                  key={ruta}
                  action
                  tag={Link}
                  to={ruta}
                  className="d-flex justify-content-between"
                >
                  {e.titulo}
                  <span className="text-muted small">Editar</span>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        )}
      </CardBody>
    </Card>
  );
};

export default DiccionariosIndex;

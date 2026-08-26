import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Card, CardBody, CardTitle } from 'reactstrap';
import ConfigEmpresaBar from '../../../../components/ConfigEmpresaBar';

/**
 * Diario OD (operaciones varias): no hay origen automático como ventas/compras/banco.
 * Se resuelve con asiento manual preseleccionando el diario OD.
 */
const RegistroOperacionesVarias: React.FC = () => (
  <Card>
    <CardBody>
      <ConfigEmpresaBar hideWhenEmpresa emptyMessage="Seleccione una empresa para ver la contabilidad." />
      <CardTitle tag="h4">Registro — Operaciones varias (OD)</CardTitle>
      <Alert color="info" className="mb-3">
        El diario general (OD) no se alimenta desde facturas ni banco. Use un{' '}
        <strong>asiento manual</strong> con partida doble (ajustes, provisiones, reclasificaciones).
      </Alert>
      <p className="text-muted">
        También puede crear asientos en otros diarios desde la misma pantalla eligiendo el diario
        correspondiente.
      </p>
      <Button color="primary" tag={Link} to="/contabilidad/asientos/nuevo?diario=OD">
        Nuevo asiento OD
      </Button>{' '}
      <Button color="secondary" outline tag={Link} to="/contabilidad/asientos">
        Ver asientos
      </Button>{' '}
      <Button color="link" tag={Link} to="/contabilidad/transferencia/registro/ventas">
        Volver a diarios de transferencia
      </Button>
    </CardBody>
  </Card>
);

export default RegistroOperacionesVarias;

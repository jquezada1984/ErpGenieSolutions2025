import React from 'react';
import { Alert } from 'reactstrap';
import DashboardModulo, { DashboardAtajos } from './DashboardModulo';

/** Comercial aún delgado: área sin inventar cifras. */
const DashboardComercial: React.FC = () => (
  <DashboardModulo
    titulo="Área Comercial"
    subtitulo="Presupuestos y pedidos (módulo en construcción)."
    requireEmpresa={false}
  >
    <Alert color="secondary" fade={false}>
      Presupuestos, pedidos y contratos aún no tienen dominio completo. Use los accesos cuando
      existan pantallas reales.
    </Alert>
    <DashboardAtajos
      links={[
        { label: 'Inicio', to: '/dashboard', icon: 'bi bi-house' },
        { label: 'Facturas cliente', to: '/financiero/facturas-clientes', icon: 'bi bi-receipt' },
        { label: 'Terceros', to: '/terceros', icon: 'bi bi-people' },
      ]}
    />
  </DashboardModulo>
);

export default DashboardComercial;

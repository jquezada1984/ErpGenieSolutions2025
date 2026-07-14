import React from 'react';
import FacturasHub from '../FacturasHub';
import { vincularAutomaticoClientes } from '../../../../_apis_/contabilidad';

const FacturasClientesHub: React.FC = () => (
  <FacturasHub
    tipo="CLIENTE"
    titulo="Transferencia — Facturas de clientes"
    basePath="/contabilidad/transferencia/facturas-clientes"
    vincularAuto={vincularAutomaticoClientes}
  />
);

export default FacturasClientesHub;

import React from 'react';
import FacturasHub from '../FacturasHub';
import { vincularAutomaticoProveedores } from '../../../../_apis_/contabilidad';

const FacturasProveedoresHub: React.FC = () => (
  <FacturasHub
    tipo="PROVEEDOR"
    titulo="Transferencia — Facturas de proveedores"
    basePath="/contabilidad/transferencia/facturas-proveedores"
    vincularAuto={vincularAutomaticoProveedores}
  />
);

export default FacturasProveedoresHub;

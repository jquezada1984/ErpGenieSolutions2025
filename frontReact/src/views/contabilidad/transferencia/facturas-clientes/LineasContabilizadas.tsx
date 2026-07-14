import React from 'react';
import LineasFacturaPage from '../LineasFacturaPage';
import { listarLineasFacturaClientes } from '../../../../_apis_/contabilidad';

const LineasContabilizadas: React.FC = () => (
  <LineasFacturaPage
    titulo="Líneas contabilizadas — Clientes"
    hubPath="/contabilidad/transferencia/facturas-clientes"
    vinculadas
    listarLineas={listarLineasFacturaClientes}
    modo="cambiar"
  />
);

export default LineasContabilizadas;

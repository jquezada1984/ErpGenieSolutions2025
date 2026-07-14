import React from 'react';
import LineasFacturaPage from '../LineasFacturaPage';
import { listarLineasFacturaClientes } from '../../../../_apis_/contabilidad';

const LineasAContabilizar: React.FC = () => (
  <LineasFacturaPage
    titulo="Líneas a contabilizar — Clientes"
    hubPath="/contabilidad/transferencia/facturas-clientes"
    vinculadas={false}
    listarLineas={listarLineasFacturaClientes}
    modo="vincular"
  />
);

export default LineasAContabilizar;

import React from 'react';
import LineasFacturaPage from '../LineasFacturaPage';
import { listarLineasFacturaProveedores } from '../../../../_apis_/contabilidad';

const LineasAContabilizar: React.FC = () => (
  <LineasFacturaPage
    titulo="Líneas a contabilizar — Proveedores"
    hubPath="/contabilidad/transferencia/facturas-proveedores"
    vinculadas={false}
    listarLineas={listarLineasFacturaProveedores}
    modo="vincular"
  />
);

export default LineasAContabilizar;

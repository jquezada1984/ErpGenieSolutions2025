import React from 'react';
import LineasFacturaPage from '../LineasFacturaPage';
import { listarLineasFacturaProveedores } from '../../../../_apis_/contabilidad';

const LineasContabilizadas: React.FC = () => (
  <LineasFacturaPage
    titulo="Líneas contabilizadas — Proveedores"
    hubPath="/contabilidad/transferencia/facturas-proveedores"
    vinculadas
    listarLineas={listarLineasFacturaProveedores}
    modo="cambiar"
  />
);

export default LineasContabilizadas;

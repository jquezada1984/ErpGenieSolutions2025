import React from 'react';
import ProcesarDiarioPage from './ProcesarDiarioPage';

const RegistroCompras: React.FC = () => (
  <ProcesarDiarioPage
    codigoDiario="AC"
    titulo="Compras"
    descripcion="Registro de facturas de proveedores vinculadas (facturas de anticipo incluidas)."
    origen="compras"
  />
);

export default RegistroCompras;

import React from 'react';
import ProcesarDiarioPage from './ProcesarDiarioPage';

const RegistroVentas: React.FC = () => (
  <ProcesarDiarioPage
    codigoDiario="VT"
    titulo="Ventas"
    descripcion="Registro de facturas de clientes vinculadas (facturas de anticipo incluidas)."
    origen="ventas"
  />
);

export default RegistroVentas;

import React from 'react';
import ProcesarDiarioPage from './ProcesarDiarioPage';

const RegistroBanco: React.FC = () => (
  <ProcesarDiarioPage
    codigoDiario="BQ"
    titulo="Banco"
    descripcion="Registro de movimientos bancarios conciliados en el diario financiero."
    origen="banco"
    mostrarFormaPago
  />
);

export default RegistroBanco;

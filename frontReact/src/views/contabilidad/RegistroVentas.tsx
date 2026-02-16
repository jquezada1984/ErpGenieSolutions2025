import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const RegistroVentas: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Ventas (Diario de ventas)"
      icon="bi bi-cart"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás gestionar el registro de ventas en contabilidad.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default RegistroVentas;

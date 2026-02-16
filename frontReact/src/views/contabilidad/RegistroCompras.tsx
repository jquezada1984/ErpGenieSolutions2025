import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const RegistroCompras: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Compras (Diario de compras)"
      icon="bi bi-bag"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás gestionar el registro de compras en contabilidad.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default RegistroCompras;

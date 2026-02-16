import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const CuentasBancarias: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Cuentas Bancarias"
      icon="bi bi-bank"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás gestionar las cuentas bancarias y vincularlas con cuentas contables.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default CuentasBancarias;

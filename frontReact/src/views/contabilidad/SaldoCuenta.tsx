import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const SaldoCuenta: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Saldo de la Cuenta"
      icon="bi bi-scale"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás consultar saldos de cuentas, filtrar por período y ver movimientos.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default SaldoCuenta;

import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const CuentasImpuestos: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Cuentas de Impuestos"
      icon="bi bi-receipt"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás configurar las cuentas de impuestos (RENTA, INDUSTRIA_COMERCIO, RETENCION, etc.).
      </Alert>
    </ContabilidadBasePage>
  );
};

export default CuentasImpuestos;

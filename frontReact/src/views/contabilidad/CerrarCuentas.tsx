import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const CerrarCuentas: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Cerrar Cuentas"
      icon="bi bi-lock"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás cerrar cuentas por período y generar cierres contables.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default CerrarCuentas;

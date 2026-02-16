import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const CuentasIndividuales: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Plan de Cuentas Individuales"
      icon="bi bi-list-ul"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás gestionar las cuentas contables con estructura jerárquica (cuentas padre/hijo).
      </Alert>
    </ContabilidadBasePage>
  );
};

export default CuentasIndividuales;

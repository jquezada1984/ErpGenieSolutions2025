import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const PeriodoContable: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Periodo Contable"
      icon="bi bi-calendar"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás abrir/cerrar períodos contables y bloquear períodos.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default PeriodoContable;

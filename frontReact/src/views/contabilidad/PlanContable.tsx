import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const PlanContable: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Plan Contable"
      icon="bi bi-diagram-2"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás gestionar los planes contables por empresa y asignar modelos.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default PlanContable;

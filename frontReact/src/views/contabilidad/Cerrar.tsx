import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const Cerrar: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Cerrar"
      icon="bi bi-lock-fill"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás cerrar períodos contables, generar balances y bloquear ediciones.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default Cerrar;

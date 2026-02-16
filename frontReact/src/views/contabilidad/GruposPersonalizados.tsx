import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const GruposPersonalizados: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Grupo Personalizado de Cuentas"
      icon="bi bi-diagram-3-fill"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás crear grupos personalizados de cuentas y asignar cuentas a grupos.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default GruposPersonalizados;

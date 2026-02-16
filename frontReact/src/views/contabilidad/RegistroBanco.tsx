import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const RegistroBanco: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Banco (Diario financiero)"
      icon="bi bi-bank2"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás gestionar el registro bancario en contabilidad.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default RegistroBanco;

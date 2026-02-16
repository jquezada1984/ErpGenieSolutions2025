import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const Diarios: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Diarios"
      icon="bi bi-journal-bookmark"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás listar diarios contables, ver asientos por diario y filtrar por fecha.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default Diarios;

import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const Informes: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Informes"
      icon="bi bi-graph-up"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás generar Balance General, Estado de Resultados, Flujo de Caja e informes personalizados.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default Informes;

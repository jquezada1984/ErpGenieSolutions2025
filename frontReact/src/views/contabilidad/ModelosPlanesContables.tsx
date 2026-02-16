import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const ModelosPlanesContables: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Modelos de Planes Contables"
      icon="bi bi-diagram-3"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás gestionar los modelos de planes contables e importar/exportar modelos.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default ModelosPlanesContables;

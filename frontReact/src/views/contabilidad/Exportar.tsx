import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const Exportar: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Exportar Contabilidad"
      icon="bi bi-file-earmark-arrow-down"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás exportar datos contables en formatos Excel, PDF, XML para declaraciones fiscales.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default Exportar;

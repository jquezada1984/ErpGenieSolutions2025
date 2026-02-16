import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const ExportarDocumentos: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Exportar Documentos de Origen"
      icon="bi bi-download"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás exportar documentos para contabilizar en formatos Excel, CSV, etc.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default ExportarDocumentos;

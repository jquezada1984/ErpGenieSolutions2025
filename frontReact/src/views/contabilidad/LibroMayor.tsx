import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const LibroMayor: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Libro Mayor"
      icon="bi bi-journal-text"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás visualizar el libro mayor por cuenta, filtrar por período y exportar.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default LibroMayor;

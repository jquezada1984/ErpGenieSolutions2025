import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const DiariosContables: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Diarios Contables"
      icon="bi bi-journal-bookmark"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás gestionar los diarios contables (VENTAS, COMPRAS, BANCO, EGRESOS, INGRESOS, CIERRE).
      </Alert>
    </ContabilidadBasePage>
  );
};

export default DiariosContables;

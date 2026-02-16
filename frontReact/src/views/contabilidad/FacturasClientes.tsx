import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const FacturasClientes: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Contabilizar Facturas a Clientes"
      icon="bi bi-file-earmark-text"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás listar facturas pendientes, contabilizar facturas de venta y generar asientos automáticos.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default FacturasClientes;

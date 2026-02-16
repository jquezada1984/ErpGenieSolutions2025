import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const FacturasProveedores: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Contabilizar Facturas de Proveedores"
      icon="bi bi-file-earmark-text-fill"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás listar facturas pendientes, contabilizar facturas de compra y generar asientos automáticos.
      </Alert>
    </ContabilidadBasePage>
  );
};

export default FacturasProveedores;

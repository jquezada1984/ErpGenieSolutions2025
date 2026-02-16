import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const CuentasDefecto: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Cuentas Contables por Defecto"
      icon="bi bi-gear-wide"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás configurar las cuentas por defecto para operaciones (VENTA, COMPRA, PAGO, COBRO, IVA_VENTA, IVA_COMPRA, etc.).
      </Alert>
    </ContabilidadBasePage>
  );
};

export default CuentasDefecto;

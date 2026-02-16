import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const CuentasIva: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Cuentas de IVA"
      icon="bi bi-percent"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás configurar las cuentas de IVA por porcentaje (VENTA_19, VENTA_5, COMPRA_19, COMPRA_5, RETENCION).
      </Alert>
    </ContabilidadBasePage>
  );
};

export default CuentasIva;

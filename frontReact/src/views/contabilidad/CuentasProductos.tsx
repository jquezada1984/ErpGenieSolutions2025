import React from 'react';
import ContabilidadBasePage from './ContabilidadBasePage';
import { Alert } from 'reactstrap';

const CuentasProductos: React.FC = () => {
  return (
    <ContabilidadBasePage
      title="Cuentas Contables de Productos"
      icon="bi bi-box"
    >
      <Alert color="info">
        <i className="bi bi-info-circle me-2"></i>
        Esta funcionalidad está en desarrollo. Aquí podrás configurar las cuentas contables por tipo de producto (INVENTARIO, COSTO_VENTA, INGRESO_VENTA, DEVOLUCION).
      </Alert>
    </ContabilidadBasePage>
  );
};

export default CuentasProductos;

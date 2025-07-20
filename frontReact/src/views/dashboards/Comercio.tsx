import React from 'react';
import { Row, Col } from 'reactstrap';
import Earnings from '../../components/dashboard/ecommerceDashboard/Earnings';
import Overview from '../../components/dashboard/ecommerceDashboard/Overview';
import ProductSales from '../../components/dashboard/ecommerceDashboard/ProductSales';
import ProductTable from '../../components/dashboard/ecommerceDashboard/ProductTable';
import OrderStats from '../../components/dashboard/ecommerceDashboard/OrderStats';
import Reviews from '../../components/dashboard/ecommerceDashboard/Reviews';

const Comercio: React.FC = () => {
  return (
    <>
      {/* Ganancias y Resumen */}
      <Row>
        <Col sm="12" lg="4">
          <Earnings />
        </Col>
        <Col sm="12" lg="8">
          <Overview />
        </Col>
      </Row>
      {/* Ventas de productos */}
      <ProductSales />
      {/* Tabla de productos y estadísticas de pedidos */}
      <Row>
        <Col sm="12" lg="8">
          <ProductTable />
        </Col>
        <Col sm="12" lg="4">
          <OrderStats />
        </Col>
      </Row>
      {/* Reseñas */}
      <Reviews />
    </>
  );
};

export default Comercio; 
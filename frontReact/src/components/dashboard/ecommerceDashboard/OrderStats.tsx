import React from 'react';
import { Row, Col } from 'reactstrap';
import SafeApexChart from '../SafeApexChart';
import { ApexOptions } from 'apexcharts';
import DashCard from '../dashboardCards/DashCard';
import OrderStatsData from './OrderStatsData';

const OrderStats: React.FC = () => {
  // Validar que los datos estén disponibles antes de renderizar
  const isValidData = (data: any[]) => {
    return Array.isArray(data) && data.length > 0 && data.every(val => typeof val === 'number' && !isNaN(val));
  };

  const optionsorder: ApexOptions = {
    chart: {
      id: 'donut-chart',
      fontFamily: '"Nunito", sans-serif',
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      padding: {
        left: 0,
        right: 0,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70px',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Ratio',
              color: '#99abb4',
            },
          },
        },
      },
    },
    stroke: {
      width: 0,
    },
    labels: ['Open Ratio', 'Un-Open Ratio', 'Clicked Ratio', 'Bounced Ratio'],
    legend: {
      show: false,
    },
    colors: ['rgb(64, 196, 255)', 'rgb(255, 130, 28)', 'rgb(126, 116, 251)', 'rgb(41, 97, 255)'],
    tooltip: {
      fillSeriesColor: false,
    },
  };
  const seriesorder = [45, 27, 15, 18].map(val => isNaN(val) ? 0 : val);
  
  // No renderizar el gráfico si los datos no son válidos
  if (!isValidData(seriesorder)) {
    return (
      <DashCard title="Order Stats" subtitle="Overview of orders">
        <div className="mt-5 text-center">
          <p>Datos no disponibles</p>
        </div>
      </DashCard>
    );
  }

  return (
    <DashCard title="Order Stats" subtitle="Overview of orders">
      <div className="mt-5">
        <SafeApexChart options={optionsorder} series={seriesorder} type="donut" height={245} />
      </div>
      <Row className="mt-4">
        <Col className="xs-4">
          <OrderStatsData iconColor="primary" title="5489" subtitle="Success" />
        </Col>
        <Col className="xs-4">
          <OrderStatsData iconColor="info" title="954" subtitle="Pending" />
        </Col>
        <Col className="xs-4">
          <OrderStatsData iconColor="danger" title="736" subtitle="Failed" />
        </Col>
      </Row>
    </DashCard>
  );
};

export default OrderStats; 
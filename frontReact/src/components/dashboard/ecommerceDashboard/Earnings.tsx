import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import { ApexOptions } from 'apexcharts';

const Earnings: React.FC = () => {
  const optionsearnings: ApexOptions = {
    chart: {
      id: 'basic-bar',
      fontFamily: '"Nunito", sans-serif',
      type: 'area',
      toolbar: {
        show: false,
      },
      sparkline: { enabled: true },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    colors: ['#4fc3f7'],
    xaxis: {
      labels: {
        show: false,
      },
    },
    yaxis: {
      // show: false, // Eliminado porque no existe en ApexOptions
    },
    markers: {
      size: 0,
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
      theme: 'dark',
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
  };
  const seriesearnings = [
    {
      name: 'Earnings',
      data: [5, 6, 3, 7, 9, 10, 14, 12, 11, 9, 8, 7, 10, 6, 12, 10, 8],
    },
  ];
  return (
    <Card>
      <CardBody className='p-4'>
        <CardTitle tag="h4">Earnings</CardTitle>
        <CardSubtitle className="text-muted">Total Earnings of the Month</CardSubtitle>
        <h2 className='mt-2'>$43,567.53</h2>
      </CardBody>
      <Chart
        options={optionsearnings}
        series={seriesearnings}
        type="area"
        height={56}
      />
    </Card>
  );
};

export default Earnings; 
import React from 'react';

interface OrderStatsDataProps {
  iconColor?: 'primary' | 'success' | 'info' | 'danger' | 'warning' | 'orange' | 'cyan' | 'default';
  title: React.ReactNode;
  subtitle: React.ReactNode;
}

const OrderStatsData: React.FC<OrderStatsDataProps> = ({ iconColor = 'default', title, subtitle }) => {
  return (
    <>
      <i className={`bi bi-record-fill text-${iconColor} fs-4`} />
      <h3 className="mb-0 font-medium">{title}</h3>
      <span className="text-muted">{subtitle}</span>
    </>
  );
};

export default OrderStatsData; 
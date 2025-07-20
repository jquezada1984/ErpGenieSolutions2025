import React from 'react';

interface OverviewDataProps {
  textColor?: 'primary' | 'success' | 'info' | 'danger' | 'warning' | 'orange' | 'cyan' | 'default';
  icon: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
}

const OverviewData: React.FC<OverviewDataProps> = ({ textColor = 'default', icon, title, subtitle }) => {
  return (
    <div className="d-flex align-items-center mt-3 mt-md-0">
      <div className={`circle-box lg-box d-inline-block bg-light-${textColor}`}>
        <i className={`bi bi-${icon} text-${textColor}`} />
      </div>
      <div className="ms-2">
        <span className="text-muted">{title}</span>
        <h4 className="font-medium mb-0">{subtitle}</h4>
      </div>
    </div>
  );
};

export default OverviewData; 
import React from 'react';
import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';

interface DashCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

const DashCard: React.FC<DashCardProps> = ({ children, title, subtitle, actions }) => {
  return (
    <Card>
      <CardBody className="p-4">
        <div className="d-flex">
          <div>
            <CardTitle tag="h4">{title}</CardTitle>
            <CardSubtitle className="text-muted">{subtitle}</CardSubtitle>
          </div>
          <div className="ms-auto">{actions}</div>
        </div>
        <div className="mt-3">{children}</div>
      </CardBody>
    </Card>
  );
};

export default DashCard; 
import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

interface BreadCrumbsProps {
  firstUrl?: string;
  secondUrl?: string;
  firstText?: string;
  secondText?: string;
}

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ firstUrl, secondUrl, firstText, secondText }) => {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <Link to="/">Inicio</Link>
      </BreadcrumbItem>
      {firstUrl && (
        <BreadcrumbItem>
          <Link to={firstUrl}>{firstText}</Link>
        </BreadcrumbItem>
      )}
      {secondUrl && (
        <BreadcrumbItem active>
          <Link to={secondUrl}>{secondText}</Link>
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  );
};

export default BreadCrumbs;

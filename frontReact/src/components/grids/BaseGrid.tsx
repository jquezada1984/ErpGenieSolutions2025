import React from 'react';
import { Card, CardBody, CardTitle, Button, Alert, Badge } from 'reactstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

interface Column {
  Header: string;
  accessor: string;
  Cell?: (props: any) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

interface BaseGridProps {
  title: string;
  data: any[];
  columns: Column[];
  loading?: boolean;
  error?: string | null;
  onErrorDismiss?: () => void;
  onNewClick?: () => void;
  newButtonText?: string;
  newButtonIcon?: string;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  showPagination?: boolean;
  showPageSizeOptions?: boolean;
  showPageJump?: boolean;
  className?: string;
}

const BaseGrid: React.FC<BaseGridProps> = ({
  title,
  data,
  columns,
  loading = false,
  error = null,
  onErrorDismiss,
  onNewClick,
  newButtonText = 'Nuevo',
  newButtonIcon = 'bi-plus-circle',
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  showPagination = true,
  showPageSizeOptions = true,
  showPageJump = true,
  className = ''
}) => {
  return (
    <Card className={className}>
      <CardBody>
        <div className="grid-header">
          <CardTitle tag="h4" className="grid-title">
            {title}
          </CardTitle>
          {onNewClick && (
            <div className="grid-actions">
              <Button 
                color="primary" 
                className="grid-primary-button" 
                onClick={onNewClick}
              >
                <i className={`bi ${newButtonIcon} me-2`}></i>
                {newButtonText}
              </Button>
            </div>
          )}
        </div>

        {error && (
          <Alert color="danger" isOpen={!!error} toggle={onErrorDismiss} timeout={0}>
            {error}
          </Alert>
        )}

        <div className="grid-container">
          {loading ? (
            <div className="grid-loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando datos...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="grid-empty">
              <i className="bi bi-inbox"></i>
              <p>No hay datos para mostrar</p>
            </div>
          ) : (
            <ReactTable
              data={data}
              columns={columns}
              defaultPageSize={defaultPageSize}
              className="-striped -highlight"
              loading={loading}
              showPagination={showPagination}
              showPageSizeOptions={showPageSizeOptions}
              pageSizeOptions={pageSizeOptions}
              showPageJump={showPageJump}
              collapseOnSortingChange={true}
              collapseOnPageChange={true}
              collapseOnDataChange={true}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default BaseGrid; 
import React, { ReactNode } from 'react';
import { Card, CardBody, CardTitle, Button, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

interface ContabilidadBasePageProps {
  title: string;
  icon?: string;
  children: ReactNode;
  error?: string | null;
  success?: boolean;
  successMessage?: string;
  loading?: boolean;
  showBackButton?: boolean;
  backPath?: string;
}

const ContabilidadBasePage: React.FC<ContabilidadBasePageProps> = ({
  title,
  icon = 'bi bi-gear',
  children,
  error,
  success,
  successMessage = 'Operación realizada exitosamente',
  loading = false,
  showBackButton = true,
  backPath = '/dashboard'
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(backPath);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <CardTitle tag="h4" className="mb-0">
                  <i className={`${icon} me-2`}></i>
                  {title}
                </CardTitle>
                {showBackButton && (
                  <Button color="secondary" onClick={handleBack} disabled={loading}>
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver
                  </Button>
                )}
              </div>

              {error && (
                <Alert color="danger" fade={false} className="mb-3" timeout={0}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert color="success" fade={false} className="mb-3" timeout={0}>
                  <i className="bi bi-check-circle me-2"></i>
                  {successMessage}
                </Alert>
              )}

              {loading && (
                <Alert color="info" fade={false} className="mb-3" timeout={0}>
                  <i className="bi bi-hourglass-split me-2"></i>
                  Cargando...
                </Alert>
              )}

              {children}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContabilidadBasePage;

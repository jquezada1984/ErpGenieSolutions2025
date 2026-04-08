import React from 'react';
import { Card, CardBody, CardTitle, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const Servicios: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <CardTitle className="mb-0">
            <i className="fas fa-concierge-bell text-primary me-2" />
            Servicios
          </CardTitle>
          <Button color="primary" onClick={() => navigate('/items/servicios/nuevo')}>
            <i className="fas fa-plus me-2" />
            Nuevo servicio
          </Button>
        </div>
        <p className="text-muted mb-0">
          Listado de servicios (módulo item). Conecte el backend cuando esté disponible para cargar datos.
        </p>
      </CardBody>
    </Card>
  );
};

export default Servicios;

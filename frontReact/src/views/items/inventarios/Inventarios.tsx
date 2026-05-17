import React from 'react';
import { Card, CardBody, CardTitle, Button, Container, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const Inventarios: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container fluid>
      <Card>
        <CardBody>
          <motion.div className="d-flex justify-content-between align-items-center mb-3">
            <CardTitle tag="h4" className="mb-0">
              Inventarios físicos
            </CardTitle>
            <Button color="primary" onClick={() => navigate('/items/inventarios/nuevo')}>
              Nuevo inventario
            </Button>
          </motion.div>
          <Alert color="info" className="mb-0">
            Listado de conteos de inventario. La integración con el backend estará disponible en una
            próxima versión.
          </Alert>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Inventarios;

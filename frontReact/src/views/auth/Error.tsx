import React from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <Container fluid className="h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col lg="6" md="8" sm="12">
            <Card>
              <CardBody className="text-center p-5">
                <h1 className="display-1 text-danger">403</h1>
                <h3 className="mb-4">Acceso Denegado</h3>
                <p className="text-muted mb-4">
                  No tienes permisos para acceder a esta página. 
                  Por favor, inicia sesión para continuar.
                </p>
                <Button 
                  color="primary" 
                  onClick={() => navigate('/auth/login')}
                  className="me-2"
                >
                  Ir al Login
                </Button>
                <Button 
                  color="secondary" 
                  onClick={() => navigate('/')}
                >
                  Ir al Inicio
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Error; 
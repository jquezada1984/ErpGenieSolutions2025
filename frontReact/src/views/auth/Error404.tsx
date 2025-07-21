import React from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <Container fluid className="h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col lg="6" md="8" sm="12">
            <Card>
              <CardBody className="text-center p-5">
                <h1 className="display-1 text-danger">404</h1>
                <h3 className="mb-4">Página no encontrada</h3>
                <p className="text-muted mb-4">
                  La página que buscas no existe o ha sido movida.
                </p>
                <Button 
                  color="primary" 
                  onClick={() => navigate('/')}
                  className="me-2"
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

export default Error404; 
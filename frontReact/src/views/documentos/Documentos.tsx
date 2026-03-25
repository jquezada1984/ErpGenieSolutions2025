import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';

const Documentos: React.FC = () => {
  return (
    <Container fluid>
      <BreadCrumbs firstText="Documentos" firstUrl="/documentos" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="grid-header">
                <CardTitle tag="h4" className="grid-title">
                  Documentos
                </CardTitle>
              </div>

              <Row>
                <Col md={3} className="mb-3 mb-md-0">
                  <Card>
                    <CardBody>
                      <h6 className="mb-0">Directorios</h6>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={9}>
                  <Card>
                    <CardBody>
                      <h6 className="mb-0">Listado de documentos</h6>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Documentos;

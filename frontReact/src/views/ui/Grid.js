import { Container, Col, Row, Card, CardBody, CardTitle } from "reactstrap";

const Grid = () => {
  return (
    <div>
      {/* --------------------------------------------------------------------------------*/}
      {/* Start Inner Div*/}
      {/* --------------------------------------------------------------------------------*/}
      {/* --------------------------------------------------------------------------------*/}
      {/* Row*/}
      {/* --------------------------------------------------------------------------------*/}
      <Card>
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          Grid Layout
        </CardTitle>
        <CardBody className="">
          <Container>
            <Row>
              <Col>
                <div className="bg-light p-2 border">.col</div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <div className="bg-light p-2 border">.col</div>
              </Col>
              <Col>
                <div className="bg-light p-2 border">.col</div>
              </Col>
              <Col>
                <div className="bg-light p-2 border">.col</div>
              </Col>
              <Col>
                <div className="bg-light p-2 border">.col</div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs="3">
                <div className="bg-light p-2 border">.col-3</div>
              </Col>
              <Col xs="auto">
                <div className="bg-light p-2 border">
                  .col-auto - variable width content
                </div>
              </Col>
              <Col xs="3">
                <div className="bg-light p-2 border">.col-3</div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs="6">
                <div className="bg-light p-2 border">.col-6</div>
              </Col>
              <Col xs="6">
                <div className="bg-light p-2 border">.col-6</div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs="6" sm="4">
                <div className="bg-light p-2 border">.col-6 .col-sm-4</div>
              </Col>
              <Col xs="6" sm="4">
                <div className="bg-light p-2 border">.col-6 .col-sm-4</div>
              </Col>
              <Col sm="4">
                <div className="bg-light p-2 border">.col-sm-4</div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col
                sm={{
                  offset: 1,
                  order: 2,
                  size: 6,
                }}
              >
                <div className="bg-light p-2 border">
                  .col-sm-6 .col-sm-order-2 .col-sm-offset-2
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col
                sm="12"
                md={{
                  offset: 2,
                  size: 8,
                }}
              >
                <div className="bg-light p-2 border">
                  .col-sm-12 .col-md-6 .col-md-offset-3
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col
                sm={{
                  offset: 1,
                  size: "auto",
                }}
              >
                <div className="bg-light p-2 border">
                  .col-sm .col-sm-offset-1
                </div>
              </Col>
              <Col
                sm={{
                  offset: 1,
                  size: "auto",
                }}
              >
                <div className="bg-light p-2 border">
                  .col-sm .col-sm-offset-1
                </div>
              </Col>
            </Row>
          </Container>
        </CardBody>
      </Card>
      {/* --------------------------------------------------------------------------------*/}
      {/* Row*/}
      {/* --------------------------------------------------------------------------------*/}

      <Card>
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          Layout Row Cols
        </CardTitle>
        <CardBody className="">
          <Container>
            <div>
              <h6>
                xs=“2“
              </h6>
              <Row xs="2">
                <Col className="bg-light border mb-2 p-2">
                  Column
                </Col>
                <Col className="bg-light border mb-2 p-2">
                  Column
                </Col>
                <Col className="bg-light border mb-2 p-2">
                  Column
                </Col>
                <Col className="bg-light border mb-2 p-2">
                  Column
                </Col>
              </Row>
            </div>

            <div className='mt-3'>
              <h6>
                xs=“3“
              </h6>
              <Row xs="3">
                <Col className="bg-light border mb-2 p-2">
                  Column
                </Col>
                <Col className="bg-light border mb-2 p-2">
                  Column
                </Col>
                <Col className="bg-light border mb-2 p-2">
                  Column
                </Col>
                <Col className="bg-light border mb-2 p-2">
                  Column
                </Col>
              </Row>
            </div>

            <div className='mt-3'>
              <h6>
                xs=“4“
              </h6>
              <Row xs="4">
                <Col className="bg-light border mb-2 p-2">
                  Column
                </Col>
                <Col className="bg-light border mb-2 p-2">
                  Column
                </Col>
                <Col className="bg-light border mb-2 p-2">
                  Column
                </Col>
                <Col className="bg-light border mb-2 p-2">
                  Column
                </Col>
              </Row>
            </div>

            <div className='mt-3'>
              <h6>
                xs=“1“ sm=“2“ md=“4“
              </h6>
              <Row
                md="4"
                sm="2"
                xs="1"
              >
                <Col className="bg-light border p-2">
                  Column
                </Col>
                <Col className="bg-light border p-2">
                  Column
                </Col>
                <Col className="bg-light border p-2">
                  Column
                </Col>
                <Col className="bg-light border p-2">
                  Column
                </Col>
              </Row>
            </div>
          </Container>
        </CardBody>
      </Card>

      <Card>
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          Container Responsive
        </CardTitle>
        <CardBody className="">
          <Container className="bg-light border mb-3 p-2">
            .container
          </Container>
          <Container
            className="bg-light border mb-3 p-2"
            fluid="sm"
          >
            .container-sm
          </Container>
          <Container
            className="bg-light border mb-3 p-2  "
            fluid="md"
          >
            .container-md
          </Container>
          <Container  
            className="bg-light border mb-3 p-2 "
            fluid="lg"
          >
            .container-lg
          </Container>
          <Container
            className="bg-light border mb-3 p-2 "
            fluid="xl"
          >
            .container-xl
          </Container>
          <Container
            className="bg-light border p-2"
            fluid
          >
            .container-fluid
          </Container>
        </CardBody>
      </Card>

      {/* --------------------------------------------------------------------------------*/}
      {/* End Inner Div*/}
      {/* --------------------------------------------------------------------------------*/}
    </div>
  );
};

export default Grid;

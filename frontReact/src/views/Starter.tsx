import React from 'react';
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import UsuariosGraphQL from '../components/UsuariosGraphQL';

const Starter = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Card>
            <CardBody>
              <CardTitle tag="h4">¡Bienvenido al ERP!</CardTitle>
              <CardText>
                Esta es la página de inicio de tu aplicación ERP. 
                El sistema está funcionando correctamente.
              </CardText>
              <Button color="primary">Comenzar</Button>
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Usuarios</CardTitle>
              <CardText>Gestión de usuarios del sistema</CardText>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Empresas</CardTitle>
              <CardText>Gestión de empresas y sucursales</CardText>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Reportes</CardTitle>
              <CardText>Generación de reportes y estadísticas</CardText>
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <UsuariosGraphQL />
        </div>
      </div>
    </div>
  );
};

export default Starter;

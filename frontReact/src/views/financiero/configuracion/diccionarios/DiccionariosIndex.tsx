import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem } from 'reactstrap';

const ENTRADAS = [
  { titulo: 'Condiciones de pago', ruta: '/financiero/configuracion/diccionarios/condiciones-pago' },
  { titulo: 'Modos de pago', ruta: '/financiero/configuracion/diccionarios/modos-pago' },
  { titulo: 'Monedas', ruta: '/financiero/configuracion/diccionarios/monedas' },
  {
    titulo: 'Tipo de entidad legal para Terceros',
    ruta: '/financiero/configuracion/diccionarios/tipo-entidad-legal',
  },
  { titulo: 'Formatos de papel', ruta: '/financiero/configuracion/diccionarios/formatos-papel' },
];

const DiccionariosIndex = () => (
  <Card>
    <CardBody>
      <CardTitle tag="h4">Diccionarios</CardTitle>
      <p className="text-muted">
        Datos de referencia del sistema. Las bajas se realizan desactivando el estado (no se eliminan
        registros).
      </p>
      <ListGroup>
        {ENTRADAS.map((e) => (
          <ListGroupItem key={e.ruta} action tag={Link} to={e.ruta} className="d-flex justify-content-between">
            {e.titulo}
            <span className="text-muted small">Editar</span>
          </ListGroupItem>
        ))}
      </ListGroup>
    </CardBody>
  </Card>
);

export default DiccionariosIndex;

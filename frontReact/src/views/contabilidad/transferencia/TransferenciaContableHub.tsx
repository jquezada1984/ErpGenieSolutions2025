import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem } from 'reactstrap';
import ConfigEmpresaBar from '../../../components/ConfigEmpresaBar';

const ACCIONES = [
  {
    titulo: 'Contabilizar facturas a clientes',
    to: '/contabilidad/transferencia/facturas-clientes',
  },
  {
    titulo: 'Contabilizar facturas de proveedores',
    to: '/contabilidad/transferencia/facturas-proveedores',
  },
  {
    titulo: 'Registro en contabilidad',
    to: '/contabilidad/transferencia/registro',
  },
  {
    titulo: 'Exportar documentos de origen',
    to: '/contabilidad/transferencia/exportar-documentos',
  },
] as const;

const TransferenciaContableHub: React.FC = () => (
  <Card>
    <CardBody>
      <ConfigEmpresaBar hideWhenEmpresa emptyMessage="Seleccione una empresa para ver la contabilidad." />
      <CardTitle tag="h4">Transferencia en contabilidad</CardTitle>
      <p className="text-muted">Vincule documentos de origen y genere los asientos por diario.</p>
      <ListGroup>
        {ACCIONES.map((a) => (
          <ListGroupItem
            key={a.to}
            action
            tag={Link}
            to={a.to}
            className="d-flex justify-content-between"
          >
            {a.titulo}
            <span className="text-muted small">Ir</span>
          </ListGroupItem>
        ))}
      </ListGroup>
    </CardBody>
  </Card>
);

export default TransferenciaContableHub;

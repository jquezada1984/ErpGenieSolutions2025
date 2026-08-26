import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem } from 'reactstrap';
import ConfigEmpresaBar from '../../../../components/ConfigEmpresaBar';

const DIARIOS = [
  {
    titulo: 'Ventas (diario VT)',
    detalle: 'Registrar facturas de clientes ya vinculadas.',
    to: '/contabilidad/transferencia/registro/ventas',
  },
  {
    titulo: 'Compras (diario AC)',
    detalle: 'Registrar facturas de proveedores ya vinculadas.',
    to: '/contabilidad/transferencia/registro/compras',
  },
  {
    titulo: 'Banco (diario BQ)',
    detalle: 'Registrar movimientos bancarios conciliados.',
    to: '/contabilidad/transferencia/registro/banco',
  },
  {
    titulo: 'Operaciones varias (diario OD)',
    detalle: 'Asientos manuales: ajustes, provisiones y reclasificaciones.',
    to: '/contabilidad/transferencia/registro/varios',
  },
] as const;

const RegistroContableHub: React.FC = () => (
  <Card>
    <CardBody>
      <ConfigEmpresaBar hideWhenEmpresa emptyMessage="Seleccione una empresa para ver la contabilidad." />
      <CardTitle tag="h4">Registro en contabilidad</CardTitle>
      <p className="text-muted">
        Elija el diario de origen. Las facturas y pagos validados se contabilizan también de forma
        asíncrona; aquí puede procesar o revisar el registro por tipo de documento.
      </p>
      <ListGroup>
        {DIARIOS.map((d) => (
          <ListGroupItem
            key={d.to}
            action
            tag={Link}
            to={d.to}
            className="d-flex justify-content-between align-items-start"
          >
            <span>
              <strong className="d-block">{d.titulo}</strong>
              <span className="text-muted small">{d.detalle}</span>
            </span>
            <span className="text-muted small ms-3">Abrir</span>
          </ListGroupItem>
        ))}
      </ListGroup>
    </CardBody>
  </Card>
);

export default RegistroContableHub;

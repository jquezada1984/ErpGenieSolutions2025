import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Input,
  Label,
  Spinner,
  Table,
} from 'reactstrap';
import { useConfigEmpresaScope } from '../../../hooks/useConfigEmpresaScope';
import ConfigEmpresaBar from '../../../components/ConfigEmpresaBar';

const GET_FACTURAS = gql`
  query FacturasClienteListado(
    $id_empresa: String!
    $page: Int
    $limit: Int
    $estado: String
    $busqueda: String
  ) {
    facturasCliente(
      id_empresa: $id_empresa
      page: $page
      limit: $limit
      estado: $estado
      busqueda: $busqueda
    ) {
      total
      page
      limit
      items {
        id_factura
        numero_factura
        fecha_factura
        estado
        total_factura
        monto_pendiente
        tercero_nombre
        tipo_factura
      }
    }
  }
`;

const colorEstado = (estado?: string | null) => {
  switch (estado) {
    case 'VALIDADA':
      return 'success';
    case 'BORRADOR':
      return 'secondary';
    case 'ANULADA':
      return 'danger';
    default:
      return 'info';
  }
};

const ListadoFacturasCliente: React.FC = () => {
  const { idEmpresa } = useConfigEmpresaScope();
  const [estado, setEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [busquedaAplicada, setBusquedaAplicada] = useState('');

  const { data, loading, error, refetch } = useQuery(GET_FACTURAS, {
    variables: {
      id_empresa: idEmpresa,
      page: 1,
      limit: 100,
      estado: estado || null,
      busqueda: busquedaAplicada || null,
    },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const page = data?.facturasCliente;
  const items = page?.items || [];

  return (
    <Card>
      <CardBody>
        <ConfigEmpresaBar hideWhenEmpresa emptyMessage="Seleccione una empresa." />
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <CardTitle tag="h4" className="mb-0">
            Facturas clientes ({page?.total ?? 0})
          </CardTitle>
          <div className="d-flex gap-2">
            <Button color="secondary" outline tag={Link} to="/financiero/facturas-clientes/pagos">
              Cobros
            </Button>
            <Button color="primary" tag={Link} to="/financiero/facturas-clientes/nueva">
              Nueva factura
            </Button>
          </div>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-md-3">
            <FormGroup>
              <Label>Estado</Label>
              <Input type="select" value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="">Todos</option>
                <option value="BORRADOR">Borrador</option>
                <option value="VALIDADA">Validada</option>
                <option value="ANULADA">Anulada</option>
              </Input>
            </FormGroup>
          </div>
          <div className="col-md-5">
            <FormGroup>
              <Label>Búsqueda</Label>
              <Input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Número o cliente"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setBusquedaAplicada(busqueda);
                }}
              />
            </FormGroup>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <Button color="secondary" className="mb-3" onClick={() => setBusquedaAplicada(busqueda)}>
              Buscar
            </Button>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <Button color="link" className="mb-3" onClick={() => refetch()}>
              Actualizar
            </Button>
          </div>
        </div>

        {error && <Alert color="danger">Error al cargar facturas</Alert>}
        {loading && <Spinner />}

        {!loading && (
          <Table responsive hover size="sm">
            <thead>
              <tr>
                <th>Número</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th className="text-end">Total</th>
                <th className="text-end">Pendiente</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted">
                    Sin facturas
                  </td>
                </tr>
              )}
              {items.map(
                (f: {
                  id_factura: string;
                  numero_factura?: string | null;
                  fecha_factura: string;
                  tercero_nombre?: string | null;
                  tipo_factura: string;
                  total_factura?: string | null;
                  monto_pendiente?: string | null;
                  estado?: string | null;
                }) => (
                  <tr key={f.id_factura}>
                    <td>{f.numero_factura || '—'}</td>
                    <td>{f.fecha_factura}</td>
                    <td>{f.tercero_nombre || '—'}</td>
                    <td>{f.tipo_factura}</td>
                    <td className="text-end">
                      {f.total_factura != null ? Number(f.total_factura).toFixed(2) : '—'}
                    </td>
                    <td className="text-end">
                      {f.monto_pendiente != null ? Number(f.monto_pendiente).toFixed(2) : '—'}
                    </td>
                    <td>
                      <Badge color={colorEstado(f.estado)}>{f.estado || '—'}</Badge>
                    </td>
                    <td>
                      <Link to={`/financiero/facturas-clientes/${f.id_factura}`}>Ver</Link>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default ListadoFacturasCliente;

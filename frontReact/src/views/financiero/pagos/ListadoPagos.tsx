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

export type ModoPago = 'cobro' | 'pago_proveedor';

const GET_COBROS = gql`
  query CobrosClienteListado(
    $id_empresa: String!
    $page: Int
    $limit: Int
    $estado: String
    $busqueda: String
  ) {
    cobrosCliente(
      id_empresa: $id_empresa
      page: $page
      limit: $limit
      estado: $estado
      busqueda: $busqueda
    ) {
      total
      items {
        id_pago
        numero_pago
        fecha_pago
        estado
        monto
        tercero_nombre
        tipo_pago
      }
    }
  }
`;

const GET_PAGOS_PROV = gql`
  query PagosProveedorListado(
    $id_empresa: String!
    $page: Int
    $limit: Int
    $estado: String
    $busqueda: String
  ) {
    pagosProveedor(
      id_empresa: $id_empresa
      page: $page
      limit: $limit
      estado: $estado
      busqueda: $busqueda
    ) {
      total
      items {
        id_pago
        numero_pago
        fecha_pago
        estado
        monto
        tercero_nombre
        tipo_pago
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

type Props = { modo: ModoPago };

const ListadoPagos: React.FC<Props> = ({ modo }) => {
  const { idEmpresa } = useConfigEmpresaScope();
  const [estado, setEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [busquedaAplicada, setBusquedaAplicada] = useState('');

  const esCobro = modo === 'cobro';
  const base = esCobro
    ? '/financiero/facturas-clientes/pagos'
    : '/financiero/facturas-proveedor/pagos';
  const titulo = esCobro ? 'Cobros de clientes' : 'Pagos a proveedores';
  const terceroLabel = esCobro ? 'Cliente' : 'Proveedor';

  const { data, loading, error, refetch } = useQuery(esCobro ? GET_COBROS : GET_PAGOS_PROV, {
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

  const page = esCobro ? data?.cobrosCliente : data?.pagosProveedor;
  const items = page?.items || [];

  return (
    <Card>
      <CardBody>
        <ConfigEmpresaBar hideWhenEmpresa emptyMessage="Seleccione una empresa." />
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <CardTitle tag="h4" className="mb-0">
            {titulo} ({page?.total ?? 0})
          </CardTitle>
          <Button color="primary" tag={Link} to={`${base}/nuevo`}>
            {esCobro ? 'Nuevo cobro' : 'Nuevo pago'}
          </Button>
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
                placeholder={`Número o ${terceroLabel.toLowerCase()}`}
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

        {error && <Alert color="danger">Error al cargar {esCobro ? 'cobros' : 'pagos'}</Alert>}
        {loading && <Spinner />}

        {!loading && (
          <Table responsive hover size="sm">
            <thead>
              <tr>
                <th>Número</th>
                <th>Fecha</th>
                <th>{terceroLabel}</th>
                <th className="text-end">Monto</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    Sin registros
                  </td>
                </tr>
              )}
              {items.map(
                (p: {
                  id_pago: string;
                  numero_pago?: string | null;
                  fecha_pago: string;
                  tercero_nombre?: string | null;
                  monto?: string | null;
                  estado?: string | null;
                }) => (
                  <tr key={p.id_pago}>
                    <td>{p.numero_pago || '—'}</td>
                    <td>{p.fecha_pago}</td>
                    <td>{p.tercero_nombre || '—'}</td>
                    <td className="text-end">
                      {p.monto != null ? Number(p.monto).toFixed(2) : '—'}
                    </td>
                    <td>
                      <Badge color={colorEstado(p.estado)}>{p.estado || '—'}</Badge>
                    </td>
                    <td>
                      <Link to={`${base}/${p.id_pago}`}>Ver</Link>
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

export default ListadoPagos;

import React, { useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Alert,
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Input,
  Label,
  Spinner,
  Table,
} from 'reactstrap';
import useJwtPayload from '../../hooks/useJwtPayload';

const PAGE_SIZE_OPTS = [20, 50, 100];

const GET_CUENTAS_INDIVIDUALES = gql`
  query GetCuentasIndividuales(
    $id_empresa: String!
    $tipo: String
    $busqueda: String
    $page: Int
    $limit: Int
  ) {
    cuentasIndividualesLibroAuxiliar(
      id_empresa: $id_empresa
      tipo: $tipo
      busqueda: $busqueda
      page: $page
      limit: $limit
    ) {
      items {
        codigo
        etiqueta
        tipo
        id_origen
      }
      total
      page
      limit
      totalPages
    }
  }
`;

const labelTipo = (tipo: string) => {
  if (tipo === 'CLIENTE') return 'Cliente';
  if (tipo === 'PROVEEDOR') return 'Proveedor';
  if (tipo === 'EMPLEADO') return 'Empleado';
  return tipo;
};

const CuentasIndividuales: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);

  const [tipo, setTipo] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [busquedaActiva, setBusquedaActiva] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data, loading, error } = useQuery(GET_CUENTAS_INDIVIDUALES, {
    variables: {
      id_empresa: idEmpresa,
      tipo: tipo || null,
      busqueda: busquedaActiva || null,
      page,
      limit,
    },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const resultado = data?.cuentasIndividualesLibroAuxiliar;
  const items = resultado?.items || [];
  const total = resultado?.total ?? 0;
  const totalPages = resultado?.totalPages ?? 1;

  const aplicarBusqueda = () => {
    setBusquedaActiva(busqueda.trim());
    setPage(1);
  };

  const limpiarBusqueda = () => {
    setBusqueda('');
    setBusquedaActiva('');
    setPage(1);
  };

  return (
    <div className="p-3">
      <h4 className="mb-3">
        Plan de cuentas individuales del libro auxiliar ({total})
      </h4>

      {!idEmpresa && (
        <Alert color="warning">No se detectó empresa en la sesión.</Alert>
      )}
      {error && <Alert color="danger">{error.message}</Alert>}

      <Alert color="info">
        Advertencia: no puede crear directamente una subcuenta. Debe crear un tercero o un
        usuario y asignarles un código de contabilidad para encontrarlos en esta lista.
      </Alert>

      <Card>
        <CardBody>
          <div className="d-flex flex-wrap gap-3 align-items-end mb-3">
            <FormGroup className="mb-0">
              <Label>Tipo</Label>
              <Input
                type="select"
                value={tipo}
                onChange={(e) => {
                  setTipo(e.target.value);
                  setPage(1);
                }}
                style={{ minWidth: 160 }}
              >
                <option value="">Todos</option>
                <option value="CLIENTE">Cliente</option>
                <option value="PROVEEDOR">Proveedor</option>
                <option value="EMPLEADO">Empleado</option>
              </Input>
            </FormGroup>
            <FormGroup className="mb-0 flex-grow-1" style={{ minWidth: 220 }}>
              <Label>Buscar</Label>
              <div className="d-flex gap-2">
                <Input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && aplicarBusqueda()}
                  placeholder="Código o etiqueta"
                />
                <button type="button" className="btn btn-outline-primary" onClick={aplicarBusqueda}>
                  <i className="bi bi-search" />
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={limpiarBusqueda}>
                  <i className="bi bi-x-lg" />
                </button>
              </div>
            </FormGroup>
            <FormGroup className="mb-0">
              <Label>Por página</Label>
              <Input
                type="select"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZE_OPTS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </Input>
            </FormGroup>
          </div>

          {loading ? (
            <div className="d-flex align-items-center gap-2">
              <Spinner size="sm" />
              <span>Cargando...</span>
            </div>
          ) : (
            <>
              <Table responsive bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Número de cuenta</th>
                    <th>Etiqueta</th>
                    <th>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center text-muted">
                        No se han encontrado registros
                      </td>
                    </tr>
                  ) : (
                    items.map((row: { codigo: string; etiqueta: string; tipo: string; id_origen: string }) => (
                      <tr key={`${row.tipo}-${row.id_origen}`}>
                        <td>{row.codigo}</td>
                        <td>{row.etiqueta}</td>
                        <td>{labelTipo(row.tipo)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">
                    Página {page} de {totalPages}
                  </span>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default CuentasIndividuales;

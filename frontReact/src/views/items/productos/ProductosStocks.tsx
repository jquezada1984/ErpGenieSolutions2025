import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { useConfigEmpresaScope } from '../../../hooks/useConfigEmpresaScope';
import ConfigEmpresaBar from '../../../components/ConfigEmpresaBar';

const STOCK_POR_EMPRESA = gql`
  query StockPorEmpresa(
    $id_empresa: ID
    $id_almacen: ID
    $referencia: String
    $etiqueta: String
  ) {
    stockPorEmpresa(
      id_empresa: $id_empresa
      id_almacen: $id_almacen
      referencia: $referencia
      etiqueta: $etiqueta
    ) {
      id_stock_producto_almacen
      id_item
      id_almacen
      producto_ref
      etiqueta
      almacen_nombre
      stock_fisico
      stock_reservado
      stock_virtual
      stock_disponible
      stock_alerta
      stock_deseado
      estado
    }
  }
`;

const ALMACENES = gql`
  query AlmacenesStocks($id_empresa: ID) {
    almacenesPorEmpresa(id_empresa: $id_empresa) {
      id_almacen
      nombre
    }
  }
`;

const ProductosStocks: React.FC = () => {
  const navigate = useNavigate();
  const scope = useConfigEmpresaScope();
  const { idEmpresa } = scope;
  const [rows, setRows] = useState<any[]>([]);
  const [almacenes, setAlmacenes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [idAlmacen, setIdAlmacen] = useState('');
  const [filtroReferencia, setFiltroReferencia] = useState('');
  const [filtroEtiqueta, setFiltroEtiqueta] = useState('');
  const [filtroStockInsuficiente, setFiltroStockInsuficiente] = useState(false);

  const [fetchStock, { loading }] = useLazyQuery(STOCK_POR_EMPRESA, {
    fetchPolicy: 'network-only',
  });
  const [fetchAlm] = useLazyQuery(ALMACENES, { fetchPolicy: 'network-only' });

  const load = useCallback(async () => {
    setError(null);
    if (!idEmpresa) {
      setRows([]);
      setAlmacenes([]);
      return;
    }
    try {
      const [a, s] = await Promise.all([
        fetchAlm({ variables: { id_empresa: idEmpresa } }),
        fetchStock({
          variables: {
            id_empresa: idEmpresa,
            id_almacen: idAlmacen || null,
            referencia: filtroReferencia || null,
            etiqueta: filtroEtiqueta || null,
          },
        }),
      ]);
      setAlmacenes(a.data?.almacenesPorEmpresa || []);
      setRows(s.data?.stockPorEmpresa || []);
    } catch (e: any) {
      setError(e.message || 'Error al cargar stocks');
    }
  }, [idEmpresa, idAlmacen, filtroReferencia, filtroEtiqueta, fetchAlm, fetchStock]);

  useEffect(() => {
    load();
  }, [load]);

  const tableData = useMemo(() => {
    return rows.filter((p) => {
      if (filtroStockInsuficiente) {
        const deseado = Number(p.stock_deseado ?? 0);
        const fisico = Number(p.stock_fisico ?? 0);
        if (deseado <= 0 || fisico >= deseado) return false;
      }
      return true;
    });
  }, [rows, filtroStockInsuficiente]);

  const columns = useMemo(
    () => [
      { Header: 'Ref.', accessor: 'producto_ref', width: 120 },
      { Header: 'Etiqueta', accessor: 'etiqueta' },
      { Header: 'Almacén', accessor: 'almacen_nombre', width: 140 },
      {
        Header: 'Físico',
        accessor: 'stock_fisico',
        width: 90,
        Cell: ({ value }: any) => Number(value ?? 0).toFixed(2),
      },
      {
        Header: 'Reservado',
        accessor: 'stock_reservado',
        width: 90,
        Cell: ({ value }: any) => Number(value ?? 0).toFixed(2),
      },
      {
        Header: 'Disponible',
        accessor: 'stock_disponible',
        width: 100,
        Cell: ({ value }: any) => Number(value ?? 0).toFixed(2),
      },
      {
        Header: 'Deseado',
        accessor: 'stock_deseado',
        width: 90,
        Cell: ({ value }: any) => (value == null ? '—' : Number(value).toFixed(2)),
      },
      {
        Header: 'Estado',
        accessor: 'estado',
        width: 90,
        Cell: ({ value }: any) => (
          <Badge color={value ? 'success' : 'secondary'}>{value ? 'Activo' : 'Inactivo'}</Badge>
        ),
      },
      {
        Header: '',
        id: 'acc',
        width: 90,
        Cell: ({ original }: any) =>
          original.id_item ? (
            <Button
              size="sm"
              color="link"
              onClick={() => navigate(`/items/productos/editar/${original.id_item}`)}
            >
              Ítem
            </Button>
          ) : null,
      },
    ],
    [navigate]
  );

  return (
    <Container fluid className="py-3">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <CardTitle tag="h4" className="mb-0">
              Stocks por almacén
            </CardTitle>
            <div>
              <Button
                color="secondary"
                outline
                className="me-2"
                onClick={() => navigate('/items/stock/movimientos')}
              >
                Kardex
              </Button>
              <Button color="secondary" outline onClick={load} disabled={!idEmpresa}>
                Actualizar
              </Button>
            </div>
          </div>
          <ConfigEmpresaBar
            scope={scope}
            hideWhenEmpresa
            emptyMessage="Seleccione una empresa para ver los stocks"
          />
          {error && <Alert color="danger">{error}</Alert>}
          {idEmpresa && (
            <>
              <Row className="mb-3">
                <Col md={3}>
                  <FormGroup>
                    <Label>Almacén</Label>
                    <Input
                      type="select"
                      value={idAlmacen}
                      onChange={(e) => setIdAlmacen(e.target.value)}
                    >
                      <option value="">Todos</option>
                      {almacenes.map((a) => (
                        <option key={a.id_almacen} value={a.id_almacen}>
                          {a.nombre}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Referencia</Label>
                    <Input
                      value={filtroReferencia}
                      onChange={(e) => setFiltroReferencia(e.target.value)}
                      placeholder="Buscar ref…"
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Etiqueta</Label>
                    <Input
                      value={filtroEtiqueta}
                      onChange={(e) => setFiltroEtiqueta(e.target.value)}
                      placeholder="Buscar etiqueta…"
                    />
                  </FormGroup>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <FormGroup check className="mb-3">
                    <Label check>
                      <Input
                        type="checkbox"
                        checked={filtroStockInsuficiente}
                        onChange={(e) => setFiltroStockInsuficiente(e.target.checked)}
                      />{' '}
                      Solo stock bajo deseado
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
              <ReactTable
                data={tableData}
                columns={columns}
                defaultPageSize={15}
                className="-striped -highlight"
                loading={loading}
                noDataText="Sin saldos de stock"
              />
            </>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default ProductosStocks;

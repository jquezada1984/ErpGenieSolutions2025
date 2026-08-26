import React, { useCallback, useMemo, useState } from 'react';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import {
  Alert,
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
  Spinner,
} from 'reactstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import useJwtPayload from '../../../hooks/useJwtPayload';
import SelectEmpresa from '../../../components/SelectEmpresa';
import SearchableSelect from '../../../components/SearchableSelect';

const GET_EMPRESAS = gql`
  query GetEmpresasStockPorFecha {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

const ALMACENES_LISTADO = gql`
  query AlmacenesListadoStockPorFecha($id_empresa: ID!) {
    almacenesListado(id_empresa: $id_empresa) {
      id_almacen
      almacen_ref
      nombre
      estado
    }
  }
`;

const ITEMS_LISTADO_PRODUCTO = gql`
  query GetItemsProductoStockPorFecha($id_empresa: ID, $codigo_tipo_item: String) {
    itemsListado(id_empresa: $id_empresa, codigo_tipo_item: $codigo_tipo_item) {
      id_item
      producto_ref
      etiqueta
      estado
    }
  }
`;

const STOCK_POR_FECHA = gql`
  query StockPorFecha(
    $id_empresa: ID!
    $fecha: String!
    $id_almacen: ID!
    $id_item: ID
  ) {
    stockPorFecha(
      id_empresa: $id_empresa
      fecha: $fecha
      id_almacen: $id_almacen
      id_item: $id_item
    ) {
      id_empresa
      id_item
      producto_ref
      etiqueta
      id_almacen
      almacen_ref
      almacen_nombre
      fecha
      stock_fisico
    }
  }
`;

type AlmacenCatalogoRow = {
  id_almacen: string;
  almacen_ref?: string | null;
  nombre?: string | null;
  estado?: boolean | null;
};

type ItemCatalogoRow = {
  id_item: string;
  producto_ref?: string | null;
  etiqueta?: string | null;
  estado?: boolean | null;
};

type StockPorFechaRow = {
  id_item: string;
  producto: string;
  descripcion: string;
  almacen: string;
  fecha: string;
  stock_fisico: number;
};

/**
 * Almacenes → Stock por fecha: saldo físico histórico (solo lectura).
 * Fuente: Gateway GraphQL → stockPorFecha → AlmacenNestJs.
 */
const StockPorFechaAlmacen: React.FC = () => {
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa || '';

  const [selectedIdEmpresa, setSelectedIdEmpresa] = useState('');
  const [fecha, setFecha] = useState('');
  const [idAlmacen, setIdAlmacen] = useState('');
  const [idItem, setIdItem] = useState('');
  const [rows, setRows] = useState<StockPorFechaRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consultado, setConsultado] = useState(false);

  const [getStockPorFecha] = useLazyQuery(STOCK_POR_FECHA, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  const { data: empresasData } = useQuery(GET_EMPRESAS, {
    skip: scope !== 'GLOBAL',
  });
  const empresas = empresasData?.empresas || [];
  const idEmpresaActiva =
    scope === 'GLOBAL' ? selectedIdEmpresa : idEmpresaUsuario;

  const {
    data: almacenesData,
    loading: loadingAlmacenes,
    error: errorAlmacenes,
  } = useQuery(ALMACENES_LISTADO, {
    variables: { id_empresa: idEmpresaActiva || null },
    skip: !idEmpresaActiva,
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });
  const almacenesCatalogo = (almacenesData?.almacenesListado ||
    []) as AlmacenCatalogoRow[];

  const {
    data: itemsData,
    loading: loadingItems,
    error: errorItems,
  } = useQuery(ITEMS_LISTADO_PRODUCTO, {
    variables: {
      id_empresa: idEmpresaActiva || null,
      codigo_tipo_item: 'PRODUCT',
    },
    skip: !idEmpresaActiva,
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  const opcionesProducto = useMemo(() => {
    const list = (itemsData?.itemsListado || []) as ItemCatalogoRow[];
    return list
      .filter((item) => item.estado !== false)
      .map((item) => {
        const referencia = String(item.producto_ref ?? '').trim();
        const etiqueta = String(item.etiqueta ?? '').trim();
        return {
          value: String(item.id_item),
          label:
            referencia && etiqueta
              ? `${referencia} - ${etiqueta}`
              : etiqueta || referencia || 'Sin etiqueta',
        };
      });
  }, [itemsData?.itemsListado]);

  const limpiarResultados = useCallback(() => {
    setRows([]);
    setConsultado(false);
    setError(null);
  }, []);

  const onConsultar = useCallback(async () => {
    if (!idEmpresaActiva) {
      setError('Debe seleccionar una empresa.');
      return;
    }
    if (!fecha.trim()) {
      setError('Debe indicar la fecha de consulta.');
      return;
    }
    if (!idAlmacen.trim()) {
      setError('Debe seleccionar un almacén.');
      return;
    }

    setLoading(true);
    setError(null);
    setConsultado(true);
    try {
      const res = await getStockPorFecha({
        variables: {
          id_empresa: idEmpresaActiva,
          fecha: fecha.trim(),
          id_almacen: idAlmacen,
          id_item: idItem.trim() ? idItem.trim() : null,
        },
      });

      if (res.error?.message) {
        setError(res.error.message);
      }

      const raw = (res.data?.stockPorFecha || []) as Array<{
        id_item: string;
        producto_ref?: string | null;
        etiqueta?: string | null;
        almacen_ref?: string | null;
        almacen_nombre?: string | null;
        fecha?: string | null;
        stock_fisico?: number | null;
      }>;

      setRows(
        raw.map((row) => {
          const refAlmacen = String(row.almacen_ref ?? '').trim();
          const nombreAlmacen = String(row.almacen_nombre ?? '').trim();
          return {
            id_item: String(row.id_item),
            producto: String(row.producto_ref ?? '').trim() || '—',
            descripcion: String(row.etiqueta ?? '').trim() || '—',
            almacen:
              refAlmacen && nombreAlmacen
                ? `${refAlmacen} - ${nombreAlmacen}`
                : nombreAlmacen || refAlmacen || '—',
            fecha: String(row.fecha ?? fecha).trim(),
            stock_fisico:
              typeof row.stock_fisico === 'number' && Number.isFinite(row.stock_fisico)
                ? row.stock_fisico
                : Number(row.stock_fisico) || 0,
          };
        }),
      );
    } catch (e: unknown) {
      setRows([]);
      setError(
        e instanceof Error ? e.message : 'Error al consultar stock por fecha',
      );
    } finally {
      setLoading(false);
    }
  }, [fecha, getStockPorFecha, idAlmacen, idEmpresaActiva, idItem]);

  const columns = [
    { Header: 'Producto', accessor: 'producto', minWidth: 120 },
    { Header: 'Descripción', accessor: 'descripcion', minWidth: 160 },
    { Header: 'Almacén', accessor: 'almacen', minWidth: 170 },
    { Header: 'Fecha', accessor: 'fecha', width: 120 },
    {
      Header: 'Stock físico',
      accessor: 'stock_fisico',
      className: 'text-end',
      width: 120,
      Cell: ({ value }: { value: number }) => String(value),
    },
  ];

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="grid-header">
                <div>
                  <CardTitle tag="h4" className="grid-title mb-1">
                    Stock por fecha
                  </CardTitle>
                  <p className="text-muted small mb-0">
                    Consulta el stock físico existente en un almacén a una fecha
                    determinada.
                  </p>
                </div>
              </div>

              {scope === 'GLOBAL' && (
                <FormGroup className="mb-3 mt-3">
                  <Label for="id_empresa_stock_por_fecha">Empresa</Label>
                  <SelectEmpresa
                    value={selectedIdEmpresa || null}
                    onChange={(value) => {
                      setSelectedIdEmpresa(value ?? '');
                      setIdAlmacen('');
                      setIdItem('');
                      limpiarResultados();
                    }}
                    empresas={empresas}
                    placeholder="Seleccione una empresa"
                  />
                </FormGroup>
              )}

              {scope === 'GLOBAL' && !selectedIdEmpresa && (
                <Alert color="info" className="mb-3">
                  Seleccione una empresa para consultar el stock por fecha.
                </Alert>
              )}

              {error && (
                <Alert
                  color="warning"
                  className="mb-3"
                  toggle={() => setError(null)}
                >
                  {error}
                </Alert>
              )}

              <Row className="mb-3">
                <Col md={3}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_fecha_stock_por_fecha" className="small">
                      Fecha
                    </Label>
                    <Input
                      id="filtro_fecha_stock_por_fecha"
                      type="date"
                      value={fecha}
                      onChange={(e) => {
                        setFecha(e.target.value);
                        limpiarResultados();
                      }}
                      disabled={!idEmpresaActiva}
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>

                <Col md={3}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_almacen_stock_por_fecha" className="small">
                      Almacén
                    </Label>
                    <Input
                      id="filtro_almacen_stock_por_fecha"
                      type="select"
                      value={idAlmacen}
                      onChange={(e) => {
                        setIdAlmacen(e.target.value);
                        limpiarResultados();
                      }}
                      disabled={
                        !idEmpresaActiva ||
                        loadingAlmacenes ||
                        !!errorAlmacenes
                      }
                      bsSize="sm"
                    >
                      {!idEmpresaActiva ? (
                        <option value="">Seleccione empresa</option>
                      ) : loadingAlmacenes ? (
                        <option value="">Cargando...</option>
                      ) : errorAlmacenes ? (
                        <option value="">No se pudo cargar almacenes</option>
                      ) : (
                        <>
                          <option value="">Seleccione almacén</option>
                          {almacenesCatalogo
                            .filter((almacen) => almacen.estado !== false)
                            .map((almacen) => {
                              const ref = String(almacen.almacen_ref ?? '').trim();
                              const nombre = String(almacen.nombre ?? '').trim();
                              const label =
                                ref && nombre
                                  ? `${ref} - ${nombre}`
                                  : nombre || ref || String(almacen.id_almacen);
                              return (
                                <option
                                  key={almacen.id_almacen}
                                  value={almacen.id_almacen}
                                >
                                  {label}
                                </option>
                              );
                            })}
                        </>
                      )}
                    </Input>
                  </FormGroup>
                </Col>

                <Col md={4}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_producto_stock_por_fecha" className="small">
                      Producto
                    </Label>
                    <SearchableSelect
                      value={idItem || null}
                      onChange={(value) => {
                        const next =
                          Array.isArray(value) ? value[0] ?? '' : value ?? '';
                        setIdItem(next);
                        limpiarResultados();
                      }}
                      options={opcionesProducto}
                      isLoading={loadingItems}
                      isDisabled={!idEmpresaActiva || loadingItems || !!errorItems}
                      placeholder={
                        !idEmpresaActiva
                          ? 'Seleccione empresa'
                          : errorItems
                            ? 'No se pudo cargar productos'
                            : 'Todos los productos'
                      }
                    />
                  </FormGroup>
                </Col>

                <Col md={2} className="d-flex align-items-end">
                  <Button
                    color="primary"
                    size="sm"
                    className="mb-2 mb-md-0 w-100"
                    onClick={() => void onConsultar()}
                    disabled={!idEmpresaActiva || loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-1" /> Consultando…
                      </>
                    ) : (
                      'Consultar'
                    )}
                  </Button>
                </Col>
              </Row>

              <p className="text-muted small mb-3">
                El stock físico corresponde al saldo reconstruido con los
                movimientos registrados hasta la fecha seleccionada.
              </p>

              {loading ? (
                <div className="text-center py-4">
                  <Spinner color="primary" />
                </div>
              ) : consultado && rows.length === 0 && !error ? (
                <Alert color="info" className="mb-0">
                  No se encontraron movimientos de stock hasta la fecha
                  seleccionada.
                </Alert>
              ) : rows.length > 0 ? (
                <ReactTable
                  data={rows}
                  columns={columns}
                  defaultPageSize={10}
                  className="-striped -highlight"
                  previousText="Anterior"
                  nextText="Siguiente"
                  loadingText="Cargando..."
                  noDataText="Sin datos"
                  pageText="Página"
                  ofText="de"
                  rowsText="filas"
                />
              ) : null}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StockPorFechaAlmacen;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
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
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { useNavigate } from 'react-router-dom';
import useJwtPayload from '../../../hooks/useJwtPayload';
import SelectEmpresa from '../../../components/SelectEmpresa';
import SearchableSelect from '../../../components/SearchableSelect';

const GET_EMPRESAS = gql`
  query GetEmpresasStockActualAlmacen {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

const ALMACENES_LISTADO = gql`
  query AlmacenesListadoStockActual($id_empresa: ID!) {
    almacenesListado(id_empresa: $id_empresa) {
      id_almacen
      almacen_ref
      nombre
      estado
    }
  }
`;

const ITEMS_LISTADO_PRODUCTO = gql`
  query GetItemsProductoStockActual($id_empresa: ID, $codigo_tipo_item: String) {
    itemsListado(id_empresa: $id_empresa, codigo_tipo_item: $codigo_tipo_item) {
      id_item
      producto_ref
      etiqueta
      estado
    }
  }
`;

const STOCK_ITEMS_ALMACEN_LISTADO = gql`
  query StockItemsAlmacenListado(
    $id_empresa: ID!
    $id_almacen: ID
    $id_item: ID
    $estado: Boolean
  ) {
    stockItemsAlmacenListado(
      id_empresa: $id_empresa
      id_almacen: $id_almacen
      id_item: $id_item
      estado: $estado
    ) {
      id_stock_producto_almacen
      id_empresa
      id_item
      producto_ref
      etiqueta
      id_almacen
      almacen_ref
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

type AlmacenCatalogoRow = {
  id_almacen: string;
  almacen_ref?: string | null;
  nombre?: string | null;
};

type ItemCatalogoRow = {
  id_item: string;
  producto_ref?: string | null;
  etiqueta?: string | null;
};

type StockActualRow = {
  id_stock_producto_almacen: string;
  producto: string;
  referencia: string;
  almacen: string;
  stock_fisico: number;
  stock_reservado: number;
  stock_virtual: number;
  stock_disponible: number;
  stock_alerta?: number | null;
  stock_deseado?: number | null;
  estado: boolean;
};

const displayValue = (value: number | null | undefined): string =>
  value == null ? '-' : String(value);

/**
 * Almacenes → Stock actual: saldo materializado, exclusivamente de lectura.
 * Fuente: Gateway GraphQL → stockItemsAlmacenListado.
 */
const StockActualAlmacen: React.FC = () => {
  const navigate = useNavigate();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa || '';

  const [selectedIdEmpresa, setSelectedIdEmpresa] = useState('');
  const [rows, setRows] = useState<StockActualRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idItem, setIdItem] = useState('');
  const [idAlmacen, setIdAlmacen] = useState('');
  const [fEstado, setFEstado] = useState('');

  const [getStock, { loading: queryLoading }] = useLazyQuery(
    STOCK_ITEMS_ALMACEN_LISTADO,
    {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  );
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
    return list.map((item) => {
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

  const loadStock = useCallback(async () => {
    if (!idEmpresaActiva) {
      setRows([]);
      setLoading(false);
      return;
    }

    let estado: boolean | null = null;
    if (fEstado === 'activo') estado = true;
    else if (fEstado === 'inactivo') estado = false;

    setLoading(true);
    setError(null);
    try {
      const res = await getStock({
        variables: {
          id_empresa: idEmpresaActiva,
          id_almacen: idAlmacen || null,
          id_item: idItem || null,
          estado,
        },
      });

      if (res.error?.message) {
        setError(res.error.message);
      }

      const raw = (res.data?.stockItemsAlmacenListado || []) as Array<{
        id_stock_producto_almacen: string;
        producto_ref?: string | null;
        etiqueta?: string | null;
        almacen_ref?: string | null;
        almacen_nombre?: string | null;
        stock_fisico: number;
        stock_reservado: number;
        stock_virtual: number;
        stock_disponible: number;
        stock_alerta?: number | null;
        stock_deseado?: number | null;
        estado: boolean;
      }>;

      setRows(
        raw.map((stock) => {
          const refAlmacen = String(stock.almacen_ref ?? '').trim();
          const nombreAlmacen = String(stock.almacen_nombre ?? '').trim();
          return {
            id_stock_producto_almacen: String(stock.id_stock_producto_almacen),
            producto: stock.etiqueta == null ? '-' : String(stock.etiqueta),
            referencia:
              stock.producto_ref == null ? '-' : String(stock.producto_ref),
            almacen:
              refAlmacen && nombreAlmacen
                ? `${refAlmacen} - ${nombreAlmacen}`
                : nombreAlmacen || refAlmacen || '-',
            stock_fisico: stock.stock_fisico,
            stock_reservado: stock.stock_reservado,
            stock_virtual: stock.stock_virtual,
            stock_disponible: stock.stock_disponible,
            stock_alerta: stock.stock_alerta,
            stock_deseado: stock.stock_deseado,
            estado: stock.estado,
          };
        }),
      );
    } catch (e: unknown) {
      setRows([]);
      setError(
        e instanceof Error ? e.message : 'Error al consultar el stock actual.',
      );
    } finally {
      setLoading(false);
    }
  }, [fEstado, getStock, idAlmacen, idEmpresaActiva, idItem]);

  useEffect(() => {
    if (scope === 'EMPRESA' && idEmpresaUsuario) {
      loadStock();
    } else if (scope === 'GLOBAL' && selectedIdEmpresa) {
      loadStock();
    } else if (scope === 'GLOBAL' && !selectedIdEmpresa) {
      setRows([]);
    }
  }, [
    scope,
    idEmpresaUsuario,
    selectedIdEmpresa,
    idItem,
    idAlmacen,
    fEstado,
    loadStock,
  ]);

  const limpiarFiltros = () => {
    setIdItem('');
    setIdAlmacen('');
    setFEstado('');
  };

  const columns = [
    { Header: 'Producto', accessor: 'producto', minWidth: 170 },
    { Header: 'Referencia', accessor: 'referencia', minWidth: 120 },
    { Header: 'Almacén', accessor: 'almacen', minWidth: 170 },
    {
      Header: 'Stock físico',
      accessor: 'stock_fisico',
      className: 'text-end',
      Cell: ({ value }: { value: number }) => displayValue(value),
    },
    {
      Header: 'Reservado',
      accessor: 'stock_reservado',
      className: 'text-end',
      Cell: ({ value }: { value: number }) => displayValue(value),
    },
    {
      Header: 'Virtual',
      accessor: 'stock_virtual',
      className: 'text-end',
      Cell: ({ value }: { value: number }) => displayValue(value),
    },
    {
      Header: 'Disponible',
      accessor: 'stock_disponible',
      className: 'text-end',
      Cell: ({ value }: { value: number }) => displayValue(value),
    },
    {
      Header: 'Stock alerta',
      accessor: 'stock_alerta',
      className: 'text-end',
      Cell: ({ value }: { value: number | null }) => displayValue(value),
    },
    {
      Header: 'Stock deseado',
      accessor: 'stock_deseado',
      className: 'text-end',
      Cell: ({ value }: { value: number | null }) => displayValue(value),
    },
    {
      Header: 'Estado',
      accessor: 'estado',
      width: 100,
      filterable: false,
      Cell: ({ value }: { value: boolean }) => (
        <Badge color={value ? 'success' : 'danger'}>
          {value ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ];

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="grid-header">
                <CardTitle tag="h4" className="grid-title">
                  Stock actual
                </CardTitle>
                <div>
                  <Button
                    color="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate('/items/almacenes/stock-inicial')}
                  >
                    Stock inicial
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate('/items/almacenes/stock-entrada')}
                  >
                    Entrada de stock
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate('/items/almacenes/stock-salida')}
                  >
                    Salida de stock
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate('/items/almacenes/stock-ajuste')}
                  >
                    Ajuste de stock
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => navigate('/items/almacenes/stock-transferencia')}
                  >
                    Transferir stock
                  </Button>
                </div>
              </div>

              {scope === 'GLOBAL' && (
                <FormGroup className="mb-3">
                  <Label for="id_empresa_stock_actual">Empresa</Label>
                  <SelectEmpresa
                    value={selectedIdEmpresa || null}
                    onChange={(value) => {
                      setSelectedIdEmpresa(value ?? '');
                      setIdItem('');
                      setIdAlmacen('');
                    }}
                    empresas={empresas}
                    placeholder="Seleccione una empresa para consultar el stock"
                  />
                </FormGroup>
              )}

              {scope === 'GLOBAL' && !selectedIdEmpresa && (
                <Alert color="info" className="mb-3">
                  Seleccione una empresa para consultar el stock.
                </Alert>
              )}

              {error && (
                <Alert color="warning" className="mb-3" toggle={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <Row className="mb-3">
                <Col md={3}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_producto_stock_actual" className="small">
                      Producto
                    </Label>
                    <SearchableSelect
                      value={idItem || null}
                      onChange={(value) => {
                        const next =
                          Array.isArray(value) ? value[0] ?? '' : value ?? '';
                        setIdItem(next);
                      }}
                      options={opcionesProducto}
                      isLoading={loadingItems}
                      isDisabled={!idEmpresaActiva || loadingItems || !!errorItems}
                      placeholder={
                        !idEmpresaActiva
                          ? 'Seleccione empresa'
                          : errorItems
                            ? 'No se pudo cargar productos'
                            : 'Todos'
                      }
                    />
                  </FormGroup>
                </Col>

                <Col md={3}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_almacen_stock_actual" className="small">
                      Almacén
                    </Label>
                    <Input
                      id="filtro_almacen_stock_actual"
                      type="select"
                      value={idAlmacen}
                      onChange={(e) => setIdAlmacen(e.target.value)}
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
                      ) : almacenesCatalogo.length === 0 ? (
                        <option value="">No hay almacenes</option>
                      ) : (
                        <>
                          <option value="">Todos</option>
                          {almacenesCatalogo.map((almacen) => {
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

                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_estado_stock_actual" className="small">
                      Estado
                    </Label>
                    <Input
                      id="filtro_estado_stock_actual"
                      type="select"
                      value={fEstado}
                      onChange={(e) => setFEstado(e.target.value)}
                      disabled={!idEmpresaActiva}
                      bsSize="sm"
                    >
                      <option value="">Todos</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </Input>
                  </FormGroup>
                </Col>

                <Col md={2} className="d-flex align-items-end">
                  <Button
                    color="secondary"
                    size="sm"
                    outline
                    onClick={limpiarFiltros}
                    disabled={!idEmpresaActiva}
                  >
                    Limpiar
                  </Button>
                </Col>
              </Row>

              <div className="grid-container">
                <ReactTable
                  data={rows}
                  columns={columns}
                  defaultPageSize={10}
                  className="-striped -highlight"
                  showPagination={true}
                  showPageSizeOptions={true}
                  pageSizeOptions={[5, 10, 20, 50]}
                  showPageJump={true}
                  collapseOnSortingChange={true}
                  collapseOnPageChange={true}
                  collapseOnDataChange={true}
                  loading={loading || queryLoading}
                  noDataText={
                    loading || queryLoading
                      ? 'Cargando…'
                      : 'No se encontraron registros de stock.'
                  }
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StockActualAlmacen;

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Container,
  Row,
  Col,
  Badge,
  Alert,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import useJwtPayload from '../../../hooks/useJwtPayload';
import SelectEmpresa from '../../../components/SelectEmpresa';
import { listarEstadosVentaItem, listarEstadosCompraItem } from '../../../_apis_/item';

const GET_EMPRESAS = gql`
  query GetEmpresas {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

const ITEMS_LISTADO = gql`
  query ItemsListado(
    $id_empresa: ID
    $producto_ref: String
    $etiqueta: String
    $codigo_barras: String
    $id_estado_venta: ID
    $id_estado_compra: ID
  ) {
    itemsListado(
      id_empresa: $id_empresa
      producto_ref: $producto_ref
      etiqueta: $etiqueta
      codigo_barras: $codigo_barras
      id_estado_venta: $id_estado_venta
      id_estado_compra: $id_estado_compra
    ) {
      id_item
      id_empresa
      producto_ref
      etiqueta
      codigo_barras
      precio_venta
      precio_compra
      stock_minimo_alerta
      stock_deseado
      estado
      empresa {
        id_empresa
        nombre
      }
      estadoVenta {
        id_estado_venta
        nombre
      }
      estadoCompra {
        id_estado_compra
        nombre
      }
    }
  }
`;

const ACTUALIZAR_ESTADO_ITEM = gql`
  mutation ActualizarEstadoItem($id_item: ID!, $estado: Boolean!) {
    actualizarEstadoItem(id_item: $id_item, estado: $estado)
  }
`;

interface ProductoListRow {
  id_item: string;
  id_empresa: string;
  producto_ref: string | null;
  etiqueta: string;
  codigo_barras: string | null;
  precio_venta: number | null;
  precio_compra: number | null;
  stock_minimo_alerta: number | null;
  stock_deseado: number | null;
  estado: boolean;
  empresa?: { id_empresa: string; nombre: string } | null;
  estadoVenta?: { id_estado_venta: string; nombre: string } | null;
  estadoCompra?: { id_estado_compra: string; nombre: string } | null;
}

const Productos: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa;

  const [productos, setProductos] = useState<ProductoListRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdEmpresa, setSelectedIdEmpresa] = useState<string>('');
  const [optsEstadoVenta, setOptsEstadoVenta] = useState<
    { id_estado_venta: string; nombre: string }[]
  >([]);
  const [optsEstadoCompra, setOptsEstadoCompra] = useState<
    { id_estado_compra: string; nombre: string }[]
  >([]);

  const [getItems, { loading: queryLoading }] = useLazyQuery(ITEMS_LISTADO, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  const [mutateEstado] = useMutation(ACTUALIZAR_ESTADO_ITEM, {
    errorPolicy: 'all',
  });

  const { data: empresasData } = useQuery(GET_EMPRESAS, { skip: scope !== 'GLOBAL' });
  const empresas = empresasData?.empresas || [];

  const [filtroReferencia, setFiltroReferencia] = useState('');
  const [filtroEtiqueta, setFiltroEtiqueta] = useState('');
  const [filtroCodigoBarras, setFiltroCodigoBarras] = useState('');
  const [filtroEstadoVenta, setFiltroEstadoVenta] = useState<string>('');
  const [filtroEstadoCompra, setFiltroEstadoCompra] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [v, c] = await Promise.all([listarEstadosVentaItem(), listarEstadosCompraItem()]);
      if (!cancelled) {
        setOptsEstadoVenta(Array.isArray(v) ? v : []);
        setOptsEstadoCompra(Array.isArray(c) ? c : []);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadProductos = useCallback(async () => {
    const idEmp = scope === 'GLOBAL' ? selectedIdEmpresa : idEmpresaUsuario;
    if (!idEmp) {
      setProductos([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getItems({
        variables: {
          id_empresa: idEmp,
          producto_ref: filtroReferencia.trim() || null,
          etiqueta: filtroEtiqueta.trim() || null,
          codigo_barras: filtroCodigoBarras.trim() || null,
          id_estado_venta: filtroEstadoVenta.trim() || null,
          id_estado_compra: filtroEstadoCompra.trim() || null,
        },
      });
      if (res.error?.message) {
        setError(res.error.message);
      }
      setProductos((res.data?.itemsListado as ProductoListRow[]) || []);
    } catch (e: any) {
      console.error('Error cargando productos:', e);
      setProductos([]);
      setError(e?.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, [
    scope,
    selectedIdEmpresa,
    idEmpresaUsuario,
    filtroReferencia,
    filtroEtiqueta,
    filtroCodigoBarras,
    filtroEstadoVenta,
    filtroEstadoCompra,
    getItems,
  ]);

  useEffect(() => {
    if (location.pathname !== '/items/productos') return;
    if (scope === 'EMPRESA' && idEmpresaUsuario) {
      loadProductos();
    } else if (scope === 'GLOBAL' && selectedIdEmpresa) {
      loadProductos();
    } else if (scope === 'GLOBAL' && !selectedIdEmpresa) {
      setProductos([]);
    }
  }, [location.pathname, scope, idEmpresaUsuario, selectedIdEmpresa, loadProductos]);

  const handleNuevoProducto = () => {
    navigate('/items/productos/nuevo');
  };

  const handleEditar = (id: string) => {
    navigate(`/items/productos/editar/${id}`);
  };

  const handleToggleEstadoProducto = async (row: ProductoListRow) => {
    try {
      setError(null);
      const { data, errors } = await mutateEstado({
        variables: { id_item: row.id_item, estado: !row.estado },
      });
      if (errors?.length) {
        setError(errors.map((e) => e.message).join(' | '));
        return;
      }
      if (data?.actualizarEstadoItem === false) {
        setError('No se pudo actualizar el estado del producto.');
        return;
      }
      await loadProductos();
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Error al actualizar el estado');
    }
  };

  const limpiarFiltros = () => {
    setFiltroReferencia('');
    setFiltroEtiqueta('');
    setFiltroCodigoBarras('');
    setFiltroEstadoVenta('');
    setFiltroEstadoCompra('');
  };

  const tableData = productos.map((p) => ({
    ...p,
    empresa_nombre: p.empresa?.nombre || '—',
    estado_venta_label: p.estadoVenta?.nombre || '—',
    estado_compra_label: p.estadoCompra?.nombre || '—',
  }));

  const columns = [
    {
      Header: 'Referencia',
      accessor: 'producto_ref',
      Cell: ({ value }: { value: string | null }) => value || '—',
      filterable: true,
    },
    {
      Header: 'Etiqueta',
      accessor: 'etiqueta',
      filterable: true,
    },
    {
      Header: 'Empresa',
      accessor: 'empresa_nombre',
      filterable: true,
    },
    {
      Header: 'Cód. barras',
      accessor: 'codigo_barras',
      Cell: ({ value }: { value: string | null }) => value || '—',
      filterable: true,
    },
    {
      Header: 'Precio venta',
      accessor: 'precio_venta',
      Cell: ({ value }: { value: number | null }) =>
        value != null && !Number.isNaN(value) && value > 0 ? value.toFixed(2) : '—',
      filterable: true,
    },
    {
      Header: 'Precio compra',
      accessor: 'precio_compra',
      Cell: ({ value }: { value: number | null }) =>
        value != null && !Number.isNaN(value) && value > 0 ? value.toFixed(2) : '—',
      filterable: true,
    },
    {
      Header: 'Stock límite para alertas',
      accessor: 'stock_minimo_alerta',
      Cell: ({ value }: { value: number | null }) =>
        value != null && !Number.isNaN(value) ? String(value) : '—',
      filterable: true,
    },
    {
      Header: 'Stock deseado',
      accessor: 'stock_deseado',
      Cell: ({ value }: { value: number | null }) =>
        value != null && !Number.isNaN(value) ? String(value) : '—',
      filterable: true,
    },
    {
      Header: 'Estado venta',
      accessor: 'estado_venta_label',
      Cell: ({ value }: { value: string }) => (
        <Badge color={value && value !== '—' ? 'success' : 'secondary'}>{value}</Badge>
      ),
      filterable: true,
    },
    {
      Header: 'Estado compra',
      accessor: 'estado_compra_label',
      Cell: ({ value }: { value: string }) => (
        <Badge color={value && value !== '—' ? 'success' : 'secondary'}>{value}</Badge>
      ),
      filterable: true,
    },
    {
      Header: 'Estado',
      accessor: 'estado',
      Cell: ({ value }: { value: boolean }) => (
        <Badge color={value ? 'success' : 'danger'}>{value ? 'Activo' : 'Inactivo'}</Badge>
      ),
      filterable: true,
    },
    {
      Header: 'Acciones',
      accessor: 'id_item',
      sortable: false,
      filterable: false,
      width: 120,
      Cell: ({ original }: { original: ProductoListRow & { empresa_nombre?: string } }) => {
        const activo = !!original.estado;
        return (
          <div className="d-flex align-items-center justify-content-center gap-1">
            <Button
              onClick={() => activo && handleEditar(original.id_item)}
              color={activo ? 'info' : 'secondary'}
              size="sm"
              className="me-1"
              title={activo ? 'Editar' : 'Producto inactivo: no se puede editar'}
              disabled={!activo}
            >
              <i className="bi bi-pencil-fill" />
            </Button>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={!!original.estado}
                onChange={() => handleToggleEstadoProducto(original)}
              />
            </div>
          </div>
        );
      },
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
                  Productos
                </CardTitle>
                <div className="grid-actions">
                  <Button
                    color="primary"
                    className="grid-primary-button"
                    onClick={handleNuevoProducto}
                  >
                    <i className="bi bi-plus-circle me-2" />
                    Nuevo producto
                  </Button>
                </div>
              </div>

              {scope === 'GLOBAL' && (
                <FormGroup className="mb-3">
                  <Label for="id_empresa_listado_productos">Empresa</Label>
                  <SelectEmpresa
                    value={selectedIdEmpresa || null}
                    onChange={(val) => {
                      setSelectedIdEmpresa(val ?? '');
                    }}
                    empresas={empresas}
                    placeholder="Seleccione una empresa para ver los productos"
                  />
                </FormGroup>
              )}

              {scope === 'GLOBAL' && !selectedIdEmpresa && (
                <Alert color="info" className="mb-3">
                  Seleccione una empresa para ver los productos
                </Alert>
              )}

              <Row className="mb-3">
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_referencia" className="small">
                      Referencia
                    </Label>
                    <Input
                      id="filtro_referencia"
                      type="text"
                      value={filtroReferencia}
                      onChange={(e) => setFiltroReferencia(e.target.value)}
                      placeholder="Referencia"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_etiqueta" className="small">
                      Etiqueta
                    </Label>
                    <Input
                      id="filtro_etiqueta"
                      type="text"
                      value={filtroEtiqueta}
                      onChange={(e) => setFiltroEtiqueta(e.target.value)}
                      placeholder="Etiqueta"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_codigo_barras" className="small">
                      Cód. barras
                    </Label>
                    <Input
                      id="filtro_codigo_barras"
                      type="text"
                      value={filtroCodigoBarras}
                      onChange={(e) => setFiltroCodigoBarras(e.target.value)}
                      placeholder="Código barras"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_estado_venta" className="small">
                      Estado venta
                    </Label>
                    <Input
                      id="filtro_estado_venta"
                      type="select"
                      value={filtroEstadoVenta}
                      onChange={(e) => setFiltroEstadoVenta(e.target.value)}
                      bsSize="sm"
                    >
                      <option value="">Todos</option>
                      {optsEstadoVenta.map((o) => (
                        <option key={o.id_estado_venta} value={o.id_estado_venta}>
                          {o.nombre}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_estado_compra" className="small">
                      Estado compra
                    </Label>
                    <Input
                      id="filtro_estado_compra"
                      type="select"
                      value={filtroEstadoCompra}
                      onChange={(e) => setFiltroEstadoCompra(e.target.value)}
                      bsSize="sm"
                    >
                      <option value="">Todos</option>
                      {optsEstadoCompra.map((o) => (
                        <option key={o.id_estado_compra} value={o.id_estado_compra}>
                          {o.nombre}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button color="secondary" size="sm" outline onClick={limpiarFiltros}>
                    Limpiar filtros
                  </Button>
                </Col>
              </Row>

              {error && (
                <Alert color="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <div className="grid-container">
                <ReactTable
                  data={tableData}
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
                  noDataText="No hay productos para mostrar"
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Productos;

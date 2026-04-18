import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Container,
  Row,
  Col,
  Alert,
  FormGroup,
  Label,
  Input,
  Badge,
} from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import SelectEmpresa from '../../../components/SelectEmpresa';
import useJwtPayload from '../../../hooks/useJwtPayload';
import { listarEstadosVentaItem, listarEstadosCompraItem } from '../../../_apis_/item';
import './Servicios.scss';

const GET_EMPRESAS = gql`
  query GetEmpresasServiciosListado {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

const ITEMS_LISTADO_SERVICIOS = gql`
  query ItemsListadoServicios(
    $id_empresa: ID
    $producto_ref: String
    $etiqueta: String
    $id_estado_venta: ID
    $id_estado_compra: ID
  ) {
    itemsListado(
      id_empresa: $id_empresa
      producto_ref: $producto_ref
      etiqueta: $etiqueta
      codigo_barras: null
      id_estado_venta: $id_estado_venta
      id_estado_compra: $id_estado_compra
      codigo_tipo_item: "SERVICE"
    ) {
      id_item
      id_empresa
      producto_ref
      etiqueta
      duration_value
      duracionUnidad {
        id_duration_unit
        nombre
      }
      estado
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
  mutation ActualizarEstadoItemServicio($id_item: ID!, $estado: Boolean!) {
    actualizarEstadoItem(id_item: $id_item, estado: $estado)
  }
`;

type ServicioListRow = {
  id_item: string;
  id_empresa: string;
  producto_ref: string | null;
  etiqueta: string;
  duration_value?: number | null;
  id_duration_unit?: string | null;
  duracion: string;
  estado_venta_label: string | null;
  estado_compra_label: string | null;
  estado: boolean;
};

function formatDuracionLabel(row: {
  duration_value?: number | null;
  duracionUnidad?: { nombre?: string | null } | null;
}): string {
  const v = row.duration_value;
  const u = row.duracionUnidad?.nombre?.trim();
  if (v != null && u) return `${v} ${u}`;
  if (v != null) return String(v);
  if (u) return u;
  return '';
}

const Servicios: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa;

  const [selectedIdEmpresa, setSelectedIdEmpresa] = useState<string>('');
  const [servicios, setServicios] = useState<ServicioListRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filtroReferencia, setFiltroReferencia] = useState('');
  const [filtroEtiqueta, setFiltroEtiqueta] = useState('');
  const [filtroDuracion, setFiltroDuracion] = useState('');
  const [filtroEstadoVenta, setFiltroEstadoVenta] = useState('');
  const [filtroEstadoCompra, setFiltroEstadoCompra] = useState('');

  const [optsEstadoVenta, setOptsEstadoVenta] = useState<
    { id_estado_venta: string; nombre: string }[]
  >([]);
  const [optsEstadoCompra, setOptsEstadoCompra] = useState<
    { id_estado_compra: string; nombre: string }[]
  >([]);

  const { data: empresasData } = useQuery(GET_EMPRESAS, { skip: scope !== 'GLOBAL' });
  const empresas = empresasData?.empresas || [];

  const [getItems, { loading: queryLoading }] = useLazyQuery(ITEMS_LISTADO_SERVICIOS, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  const [mutateEstado] = useMutation(ACTUALIZAR_ESTADO_ITEM, {
    errorPolicy: 'all',
  });

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

  const loadServicios = useCallback(async () => {
    const idEmp = scope === 'GLOBAL' ? selectedIdEmpresa : idEmpresaUsuario;
    if (!idEmp) {
      setServicios([]);
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
          id_estado_venta: filtroEstadoVenta.trim() || null,
          id_estado_compra: filtroEstadoCompra.trim() || null,
        },
      });
      if (res.error?.message) {
        setError(res.error.message);
      }
      const raw = (res.data?.itemsListado || []) as Array<{
        id_item: string;
        id_empresa: string;
        producto_ref: string | null;
        etiqueta: string;
        duration_value?: number | null;
        duracionUnidad?: { id_duration_unit?: string | null; nombre?: string | null } | null;
        estado: boolean;
        estadoVenta?: { nombre?: string | null } | null;
        estadoCompra?: { nombre?: string | null } | null;
      }>;
      setServicios(
        raw.map((i) => ({
          id_item: i.id_item,
          id_empresa: i.id_empresa,
          producto_ref: i.producto_ref,
          etiqueta: i.etiqueta,
          duration_value: i.duration_value ?? null,
          id_duration_unit: i.duracionUnidad?.id_duration_unit ?? null,
          duracion: formatDuracionLabel(i),
          estado_venta_label: i.estadoVenta?.nombre ?? null,
          estado_compra_label: i.estadoCompra?.nombre ?? null,
          estado: i.estado,
        })),
      );
    } catch (e: unknown) {
      console.error('Error cargando servicios:', e);
      setServicios([]);
      setError(e instanceof Error ? e.message : 'Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  }, [
    scope,
    selectedIdEmpresa,
    idEmpresaUsuario,
    filtroReferencia,
    filtroEtiqueta,
    filtroEstadoVenta,
    filtroEstadoCompra,
    getItems,
  ]);

  useEffect(() => {
    if (location.pathname !== '/items/servicios') return;
    if (scope === 'EMPRESA' && idEmpresaUsuario) {
      loadServicios();
    } else if (scope === 'GLOBAL' && selectedIdEmpresa) {
      loadServicios();
    } else if (scope === 'GLOBAL' && !selectedIdEmpresa) {
      setServicios([]);
    }
  }, [location.pathname, scope, idEmpresaUsuario, selectedIdEmpresa, loadServicios]);

  const idEmpresaActiva = scope === 'GLOBAL' ? selectedIdEmpresa : idEmpresaUsuario || '';
  const puedeMostrarTabla =
    scope === 'EMPRESA' ? Boolean(idEmpresaUsuario) : Boolean(selectedIdEmpresa);

  const tableData = useMemo(() => {
    if (!puedeMostrarTabla || !idEmpresaActiva) return [];
    let rows = servicios;
    const du = filtroDuracion.trim().toLowerCase();
    if (du) {
      rows = rows.filter((r) => String(r.duracion || '').toLowerCase().includes(du));
    }
    return rows;
  }, [servicios, idEmpresaActiva, puedeMostrarTabla, filtroDuracion]);

  const limpiarFiltros = useCallback(() => {
    setFiltroReferencia('');
    setFiltroEtiqueta('');
    setFiltroDuracion('');
    setFiltroEstadoVenta('');
    setFiltroEstadoCompra('');
  }, []);

  const handleEditar = useCallback(
    (row: ServicioListRow) => {
      navigate(`/items/servicios/editar/${row.id_item}`, {
        state: {
          prefill: {
            duration_value: row.duration_value ?? null,
            id_duration_unit: row.id_duration_unit ?? null,
          },
        },
      });
    },
    [navigate],
  );

  const handleToggleEstado = useCallback(
    async (row: ServicioListRow) => {
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
          setError('No se pudo actualizar el estado del servicio.');
          return;
        }
        await loadServicios();
      } catch (e: unknown) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'Error al actualizar el estado');
      }
    },
    [mutateEstado, loadServicios],
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Referencia del producto',
        accessor: 'producto_ref',
        Cell: ({ value }: { value: string | null }) => value || '—',
      },
      {
        Header: 'Etiqueta',
        accessor: 'etiqueta',
        Cell: ({ value }: { value: string | null }) => value || '—',
      },
      {
        Header: 'Duración',
        accessor: 'duracion',
        Cell: ({ value }: { value: string | null }) => value || '—',
      },
      {
        Header: 'Estado (Vender)',
        accessor: 'estado_venta_label',
        className: 'text-center',
        headerClassName: 'text-center',
        Cell: ({ value }: { value: string | null }) => (
          <div className="d-flex justify-content-center">
            <Badge color={value && value !== '—' ? 'success' : 'secondary'}>{value || '—'}</Badge>
          </div>
        ),
      },
      {
        Header: 'Estado (Compra)',
        accessor: 'estado_compra_label',
        className: 'text-center',
        headerClassName: 'text-center',
        Cell: ({ value }: { value: string | null }) => (
          <div className="d-flex justify-content-center">
            <Badge color={value && value !== '—' ? 'success' : 'secondary'}>{value || '—'}</Badge>
          </div>
        ),
      },
      {
        Header: 'Estado',
        accessor: 'estado',
        className: 'text-center',
        headerClassName: 'text-center',
        Cell: ({ value }: { value: boolean | undefined }) => (
          <div className="d-flex justify-content-center">
            {value === undefined ? (
              <span className="text-muted">—</span>
            ) : (
              <Badge color={value ? 'success' : 'danger'}>{value ? 'Activo' : 'Inactivo'}</Badge>
            )}
          </div>
        ),
      },
      {
        Header: 'Acciones',
        accessor: 'id_item',
        sortable: false,
        width: 120,
        className: 'text-center',
        headerClassName: 'text-center',
        Cell: ({ original }: { original: ServicioListRow }) => {
          const activo = original.estado !== false;
          return (
            <div className="d-flex align-items-center justify-content-center gap-1">
              <Button
                onClick={() => activo && handleEditar(original)}
                color={activo ? 'info' : 'secondary'}
                size="sm"
                className="me-1"
                title={activo ? 'Editar' : 'Servicio inactivo: no se puede editar'}
                disabled={!activo}
              >
                <i className="bi bi-pencil-fill" />
              </Button>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={!!original.estado}
                  onChange={() => handleToggleEstado(original)}
                  title="Activo / inactivo"
                />
              </div>
            </div>
          );
        },
      },
    ],
    [handleEditar, handleToggleEstado],
  );

  const busy = loading || queryLoading;

  return (
    <Container fluid className="listado-servicios">
      <Row>
        <Col>
          <Card>
            <CardBody className="pt-4 pb-4">
              <div className="grid-header mb-3">
                <CardTitle tag="h4" className="grid-title mb-0">
                  <i className="fas fa-concierge-bell text-primary me-2" />
                  Servicios
                </CardTitle>
                <div className="grid-actions">
                  <Button
                    color="primary"
                    className="grid-primary-button"
                    onClick={() => navigate('/items/servicios/nuevo')}
                  >
                    <i className="bi bi-plus-circle me-2" />
                    Nuevo servicio
                  </Button>
                </div>
              </div>

              {scope === 'GLOBAL' && (
                <FormGroup className="mb-3">
                  <Label for="id_empresa_listado_servicios">Empresa</Label>
                  <SelectEmpresa
                    value={selectedIdEmpresa || null}
                    onChange={(val) => setSelectedIdEmpresa(val ?? '')}
                    empresas={empresas}
                    placeholder="Seleccione una empresa para ver los servicios"
                  />
                </FormGroup>
              )}

              {scope === 'GLOBAL' && !selectedIdEmpresa && (
                <Alert color="info" className="mb-3">
                  Seleccione una empresa para ver los servicios
                </Alert>
              )}

              {error && (
                <Alert color="danger" className="mb-3" toggle={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <p className="grid-subtitle mb-0">Listado de servicios (módulo item).</p>

              <Row className="mb-3 filtros-servicios align-items-end flex-wrap g-2">
                <Col xs={12} sm={6} md="auto" className="flex-grow-1" style={{ minWidth: '8.5rem' }}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_ref_servicio" className="small">
                      Referencia del producto
                    </Label>
                    <Input
                      id="filtro_ref_servicio"
                      type="text"
                      value={filtroReferencia}
                      onChange={(e) => setFiltroReferencia(e.target.value)}
                      onBlur={() => loadServicios()}
                      placeholder="Referencia"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6} md="auto" className="flex-grow-1" style={{ minWidth: '8.5rem' }}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_etiqueta_servicio" className="small">
                      Etiqueta
                    </Label>
                    <Input
                      id="filtro_etiqueta_servicio"
                      type="text"
                      value={filtroEtiqueta}
                      onChange={(e) => setFiltroEtiqueta(e.target.value)}
                      onBlur={() => loadServicios()}
                      placeholder="Etiqueta"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6} md="auto" className="flex-grow-1" style={{ minWidth: '7rem' }}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_duracion_servicio" className="small">
                      Duración
                    </Label>
                    <Input
                      id="filtro_duracion_servicio"
                      type="text"
                      value={filtroDuracion}
                      onChange={(e) => setFiltroDuracion(e.target.value)}
                      placeholder="Duración"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6} md="auto" className="flex-grow-1" style={{ minWidth: '9rem' }}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_ev_servicio" className="small">
                      Estado (Vender)
                    </Label>
                    <Input
                      id="filtro_ev_servicio"
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
                <Col xs={12} sm={6} md="auto" className="flex-grow-1" style={{ minWidth: '9rem' }}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_ec_servicio" className="small">
                      Estado (Compra)
                    </Label>
                    <Input
                      id="filtro_ec_servicio"
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
                <Col xs={12} sm="auto" className="d-flex align-items-end">
                  <Button color="secondary" size="sm" outline className="text-nowrap" onClick={limpiarFiltros}>
                    <i className="fas fa-eraser me-1" />
                    Limpiar filtros
                  </Button>
                </Col>
              </Row>

              <div className="grid-container">
                <ReactTable
                  data={tableData}
                  columns={columns}
                  defaultPageSize={10}
                  className="-striped -highlight"
                  showPagination={tableData.length > 10}
                  showPageSizeOptions={tableData.length > 0}
                  pageSizeOptions={[5, 10, 20, 50]}
                  showPageJump={false}
                  minRows={0}
                  loading={busy}
                  noDataText={busy ? 'Cargando…' : 'No se encontró ningún registro'}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Servicios;

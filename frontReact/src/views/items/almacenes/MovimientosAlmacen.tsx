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
import useJwtPayload from '../../../hooks/useJwtPayload';
import SelectEmpresa from '../../../components/SelectEmpresa';
import SearchableSelect from '../../../components/SearchableSelect';

const GET_EMPRESAS = gql`
  query GetEmpresasMovimientosAlmacen {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

/** Misma firma GraphQL que Almacenes.tsx; fields mínimos para el selector. */
const ALMACENES_LISTADO = gql`
  query AlmacenesListadoMovimientos(
    $id_empresa: ID!
    $id_pais: ID
    $id_provincia: ID
    $poblacion: String
    $almacen_ref: String
    $nombre: String
    $estado: Boolean
  ) {
    almacenesListado(
      id_empresa: $id_empresa
      id_pais: $id_pais
      id_provincia: $id_provincia
      poblacion: $poblacion
      almacen_ref: $almacen_ref
      nombre: $nombre
      estado: $estado
    ) {
      id_almacen
      almacen_ref
      nombre
      estado
    }
  }
`;

/** Misma firma que NuevoInventario; fields mínimos para el selector. */
const ITEMS_LISTADO_PRODUCTO = gql`
  query GetItemsProductoMovimientos($id_empresa: ID, $codigo_tipo_item: String) {
    itemsListado(id_empresa: $id_empresa, codigo_tipo_item: $codigo_tipo_item) {
      id_item
      producto_ref
      etiqueta
      estado
    }
  }
`;

const MOVIMIENTOS_INVENTARIO_LISTADO = gql`
  query MovimientosInventarioListado(
    $id_empresa: ID!
    $fecha_desde: String
    $fecha_hasta: String
    $id_item: ID
    $id_almacen: ID
    $tipo_movimiento: String
    $referencia: String
    $estado: Boolean
  ) {
    movimientosInventarioListado(
      id_empresa: $id_empresa
      fecha_desde: $fecha_desde
      fecha_hasta: $fecha_hasta
      id_item: $id_item
      id_almacen: $id_almacen
      tipo_movimiento: $tipo_movimiento
      referencia: $referencia
      estado: $estado
    ) {
      id_movimiento_inventario
      id_empresa
      fecha_movimiento
      id_item
      producto_ref
      etiqueta
      id_almacen
      almacen_origen
      id_almacen_destino
      almacen_destino
      tipo_movimiento
      referencia
      concepto
      cantidad
      modulo_origen
      estado
    }
  }
`;

type MovimientoInventarioRow = {
  id_movimiento_inventario: string;
  id_empresa: string;
  fecha: string;
  producto: string;
  almacen_origen: string;
  almacen_destino: string;
  tipo_movimiento: string;
  referencia: string;
  concepto: string;
  cantidad: number;
  modulo_origen: string;
  estado: boolean | null;
};

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

/**
 * Almacenes → Movimientos: historial exclusivamente de lectura.
 * Fuente: Gateway GraphQL → movimientosInventarioListado.
 */
const MovimientosAlmacen: React.FC = () => {
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa || '';

  const [selectedIdEmpresa, setSelectedIdEmpresa] = useState('');
  const [rows, setRows] = useState<MovimientoInventarioRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fDesde, setFDesde] = useState('');
  const [fHasta, setFHasta] = useState('');
  const [idItem, setIdItem] = useState('');
  const [idAlmacen, setIdAlmacen] = useState('');
  const [fTipo, setFTipo] = useState('');
  const [fReferencia, setFReferencia] = useState('');
  const [fEstado, setFEstado] = useState('');

  const [getMovimientos, { loading: queryLoading }] = useLazyQuery(
    MOVIMIENTOS_INVENTARIO_LISTADO,
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
    variables: {
      id_empresa: idEmpresaActiva || null,
      id_pais: null,
      id_provincia: null,
      poblacion: null,
      almacen_ref: null,
      nombre: null,
      estado: null,
    },
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
    // Histórico: incluir activos e inactivos (no filtrar por estado).
    return list.map((it) => {
      const ref = String(it.producto_ref ?? '').trim();
      const etiqueta = String(it.etiqueta ?? '').trim();
      const label =
        ref && etiqueta
          ? `${ref} - ${etiqueta}`
          : etiqueta || ref || 'Sin etiqueta';
      return {
        value: String(it.id_item),
        label,
      };
    });
  }, [itemsData?.itemsListado]);

  const loadMovimientos = useCallback(async () => {
    if (!idEmpresaActiva) {
      setRows([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    let estadoVar: boolean | null = null;
    if (fEstado === 'activo') estadoVar = true;
    else if (fEstado === 'inactivo') estadoVar = false;

    try {
      const res = await getMovimientos({
        variables: {
          id_empresa: idEmpresaActiva,
          fecha_desde: fDesde || null,
          fecha_hasta: fHasta || null,
          id_item: idItem || null,
          id_almacen: idAlmacen || null,
          tipo_movimiento: fTipo.trim() || null,
          referencia: fReferencia.trim() || null,
          estado: estadoVar,
        },
      });
      if (res.error?.message) {
        setError(res.error.message);
      }

      const raw = (res.data?.movimientosInventarioListado || []) as Array<{
        id_movimiento_inventario: string;
        id_empresa: string;
        fecha_movimiento?: string | null;
        producto_ref?: string | null;
        etiqueta?: string | null;
        almacen_origen?: string | null;
        almacen_destino?: string | null;
        tipo_movimiento?: string | null;
        referencia?: string | null;
        concepto?: string | null;
        cantidad?: number | null;
        modulo_origen?: string | null;
        estado?: boolean | null;
      }>;
      setRows(
        raw.map((r) => {
          const productoRef = String(r.producto_ref ?? '').trim();
          const etiqueta = String(r.etiqueta ?? '').trim();
          return {
            id_movimiento_inventario: String(r.id_movimiento_inventario),
            id_empresa: String(r.id_empresa),
            fecha: r.fecha_movimiento ? String(r.fecha_movimiento) : '—',
            producto:
              productoRef && etiqueta
                ? `${productoRef} - ${etiqueta}`
                : productoRef || etiqueta || '—',
            almacen_origen: r.almacen_origen || '—',
            almacen_destino: r.almacen_destino || '—',
            tipo_movimiento: r.tipo_movimiento || '—',
            referencia: r.referencia || '—',
            concepto: r.concepto || '—',
            cantidad: r.cantidad == null ? 0 : Number(r.cantidad),
            modulo_origen: r.modulo_origen || '—',
            estado: r.estado ?? null,
          };
        }),
      );
    } catch (e: unknown) {
      setRows([]);
      setError(
        e instanceof Error ? e.message : 'Error al cargar movimientos de inventario',
      );
    } finally {
      setLoading(false);
    }
  }, [
    idEmpresaActiva,
    getMovimientos,
    fDesde,
    fHasta,
    idItem,
    idAlmacen,
    fTipo,
    fReferencia,
    fEstado,
  ]);

  useEffect(() => {
    if (scope === 'EMPRESA' && idEmpresaUsuario) {
      loadMovimientos();
    } else if (scope === 'GLOBAL' && selectedIdEmpresa) {
      loadMovimientos();
    } else if (scope === 'GLOBAL' && !selectedIdEmpresa) {
      setRows([]);
    }
  }, [
    scope,
    idEmpresaUsuario,
    selectedIdEmpresa,
    loadMovimientos,
  ]);

  const limpiarFiltros = () => {
    setFDesde('');
    setFHasta('');
    setIdItem('');
    setIdAlmacen('');
    setFTipo('');
    setFReferencia('');
    setFEstado('');
  };

  const columns = [
    {
      Header: 'Fecha',
      accessor: 'fecha',
      width: 110,
    },
    {
      Header: 'Producto',
      accessor: 'producto',
      minWidth: 180,
    },
    {
      Header: 'Almacén origen',
      accessor: 'almacen_origen',
      minWidth: 140,
    },
    {
      Header: 'Almacén destino',
      accessor: 'almacen_destino',
      minWidth: 140,
    },
    {
      Header: 'Tipo movimiento',
      accessor: 'tipo_movimiento',
      width: 130,
    },
    {
      Header: 'Referencia',
      accessor: 'referencia',
      width: 110,
    },
    {
      Header: 'Concepto',
      accessor: 'concepto',
      minWidth: 160,
    },
    {
      Header: 'Cantidad',
      accessor: 'cantidad',
      width: 90,
      className: 'text-end',
    },
    {
      Header: 'Módulo origen',
      accessor: 'modulo_origen',
      width: 120,
    },
    {
      Header: 'Estado',
      accessor: 'estado',
      width: 100,
      filterable: false,
      Cell: ({ value }: { value: boolean | null }) =>
        value === true ? (
          <Badge color="success">Activo</Badge>
        ) : value === false ? (
          <Badge color="danger">Inactivo</Badge>
        ) : (
          <Badge color="secondary">—</Badge>
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
                  Movimientos de almacén
                </CardTitle>
                {/* v1: solo historial — sin botones de escritura */}
              </div>

              {scope === 'GLOBAL' && (
                <FormGroup className="mb-3">
                  <Label for="id_empresa_movimientos">Empresa</Label>
                  <SelectEmpresa
                    value={selectedIdEmpresa || null}
                    onChange={(value) => {
                      setSelectedIdEmpresa(value ?? '');
                      setIdItem('');
                      setIdAlmacen('');
                    }}
                    empresas={empresas}
                    placeholder="Seleccione una empresa para ver los movimientos"
                  />
                </FormGroup>
              )}

              {scope === 'GLOBAL' && !selectedIdEmpresa && (
                <Alert color="info" className="mb-3">
                  Seleccione una empresa para ver los movimientos de inventario.
                </Alert>
              )}

              {error && (
                <Alert color="warning" className="mb-3" toggle={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <Row className="mb-3">
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_desde_mov" className="small">
                      Desde
                    </Label>
                    <Input
                      id="filtro_desde_mov"
                      type="date"
                      value={fDesde}
                      onChange={(e) => setFDesde(e.target.value)}
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_hasta_mov" className="small">
                      Hasta
                    </Label>
                    <Input
                      id="filtro_hasta_mov"
                      type="date"
                      value={fHasta}
                      onChange={(e) => setFHasta(e.target.value)}
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_producto_mov" className="small">
                      Producto
                    </Label>
                    <SearchableSelect
                      value={idItem || null}
                      onChange={(value) => {
                        const next = Array.isArray(value) ? value[0] ?? '' : value ?? '';
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
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_almacen_mov" className="small">
                      Almacén
                    </Label>
                    <Input
                      id="filtro_almacen_mov"
                      type="select"
                      value={idAlmacen}
                      onChange={(e) => setIdAlmacen(e.target.value)}
                      disabled={!idEmpresaActiva || loadingAlmacenes || !!errorAlmacenes}
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
                          {almacenesCatalogo.map((a) => {
                            const ref = String(a.almacen_ref ?? '').trim();
                            const nombre = String(a.nombre ?? '').trim();
                            const label =
                              ref && nombre
                                ? `${ref} - ${nombre}`
                                : nombre || ref || String(a.id_almacen);
                            return (
                              <option key={a.id_almacen} value={a.id_almacen}>
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
                    <Label for="filtro_tipo_mov" className="small">
                      Tipo movimiento
                    </Label>
                    <Input
                      id="filtro_tipo_mov"
                      type="text"
                      value={fTipo}
                      onChange={(e) => setFTipo(e.target.value)}
                      onBlur={loadMovimientos}
                      placeholder="Tipo movimiento"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_ref_mov" className="small">
                      Referencia
                    </Label>
                    <Input
                      id="filtro_ref_mov"
                      type="text"
                      value={fReferencia}
                      onChange={(e) => setFReferencia(e.target.value)}
                      onBlur={loadMovimientos}
                      placeholder="Referencia"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_estado_mov" className="small">
                      Estado
                    </Label>
                    <Input
                      id="filtro_estado_mov"
                      type="select"
                      value={fEstado}
                      onChange={(e) => setFEstado(e.target.value)}
                      bsSize="sm"
                    >
                      <option value="">Todos</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button color="secondary" size="sm" outline onClick={limpiarFiltros}>
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
                      : 'No se encontraron movimientos de inventario.'
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

export default MovimientosAlmacen;

import React, { useState, useMemo } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import useJwtPayload from '../../../hooks/useJwtPayload';
import SelectEmpresa from '../../../components/SelectEmpresa';

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

/** Fila del listado de stocks por lote/serie (frontend only). */
interface LoteSerieRow {
  id: string;
  id_empresa: string;
  referencia: string;
  etiqueta: string;
  almacen: string;
  lote_serie: string;
  fecha_limite_venta: string;
  fecha_caducidad: string;
  stock_fisico: number;
  estado_venta: number;
  estado_compra: number;
  estado: boolean;
}

/** Datos de ejemplo. Sustituir por API cuando esté disponible. */
const MOCK_LOTES_SERIE: LoteSerieRow[] = [
  {
    id: '1',
    id_empresa: 'empresa-1',
    referencia: 'REF-001',
    etiqueta: 'Producto ejemplo A',
    almacen: 'Almacén principal',
    lote_serie: 'LOTE-2025-001',
    fecha_limite_venta: '2025-06-30',
    fecha_caducidad: '2025-12-31',
    stock_fisico: 50,
    estado_venta: 1,
    estado_compra: 1,
    estado: true,
  },
  {
    id: '2',
    id_empresa: 'empresa-1',
    referencia: 'REF-002',
    etiqueta: 'Producto ejemplo B',
    almacen: 'Almacén principal',
    lote_serie: 'SERIE-XY-001',
    fecha_limite_venta: '',
    fecha_caducidad: '2026-01-15',
    stock_fisico: 20,
    estado_venta: 1,
    estado_compra: 0,
    estado: true,
  },
  {
    id: '3',
    id_empresa: 'empresa-1',
    referencia: 'REF-003',
    etiqueta: 'Producto ejemplo C',
    almacen: 'Secundario',
    lote_serie: 'LOTE-2024-099',
    fecha_limite_venta: '2025-03-01',
    fecha_caducidad: '2025-03-01',
    stock_fisico: 5,
    estado_venta: 0,
    estado_compra: 1,
    estado: false,
  },
];

const formatDate = (value: string) => (value ? value : '—');

const ProductosStocksLotes: React.FC = () => {
  const navigate = useNavigate();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa;

  const [filas, setFilas] = useState<LoteSerieRow[]>(MOCK_LOTES_SERIE);
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdEmpresa, setSelectedIdEmpresa] = useState<string>('');

  const { data: empresasData } = useQuery(GET_EMPRESAS, { skip: scope !== 'GLOBAL' });
  const empresas = empresasData?.empresas || [];

  const [filtroReferencia, setFiltroReferencia] = useState('');
  const [filtroEtiqueta, setFiltroEtiqueta] = useState('');
  const [filtroAlmacen, setFiltroAlmacen] = useState('');
  const [filtroLoteSerie, setFiltroLoteSerie] = useState('');
  const [filtroFechaLimiteDesde, setFiltroFechaLimiteDesde] = useState('');
  const [filtroFechaLimiteHasta, setFiltroFechaLimiteHasta] = useState('');
  const [filtroFechaCaducidadDesde, setFiltroFechaCaducidadDesde] = useState('');
  const [filtroFechaCaducidadHasta, setFiltroFechaCaducidadHasta] = useState('');
  const [filtroStockFisico, setFiltroStockFisico] = useState('');
  const [filtroSoloLoteSerie, setFiltroSoloLoteSerie] = useState(false);

  const tableData = useMemo(() => {
    return filas.filter((p) => {
      if (scope === 'GLOBAL' && !selectedIdEmpresa) return false;
      if (scope === 'GLOBAL' && selectedIdEmpresa && p.id_empresa !== selectedIdEmpresa) return false;
      if (scope === 'EMPRESA' && idEmpresaUsuario && p.id_empresa !== idEmpresaUsuario) return false;
      if (filtroReferencia && !p.referencia.toLowerCase().includes(filtroReferencia.toLowerCase())) return false;
      if (filtroEtiqueta && !p.etiqueta.toLowerCase().includes(filtroEtiqueta.toLowerCase())) return false;
      if (filtroAlmacen && !(p.almacen || '').toLowerCase().includes(filtroAlmacen.toLowerCase())) return false;
      if (filtroLoteSerie && !(p.lote_serie || '').toLowerCase().includes(filtroLoteSerie.toLowerCase())) return false;
      if (filtroFechaLimiteDesde && (p.fecha_limite_venta || '') < filtroFechaLimiteDesde) return false;
      if (filtroFechaLimiteHasta && (p.fecha_limite_venta || '') > filtroFechaLimiteHasta) return false;
      if (filtroFechaCaducidadDesde && (p.fecha_caducidad || '') < filtroFechaCaducidadDesde) return false;
      if (filtroFechaCaducidadHasta && (p.fecha_caducidad || '') > filtroFechaCaducidadHasta) return false;
      if (filtroStockFisico !== '') {
        const min = Number(filtroStockFisico);
        if (!Number.isFinite(min) || p.stock_fisico < min) return false;
      }
      if (filtroSoloLoteSerie && !(p.lote_serie || '').trim()) return false;
      return true;
    });
  }, [
    filas,
    scope,
    selectedIdEmpresa,
    idEmpresaUsuario,
    filtroReferencia,
    filtroEtiqueta,
    filtroAlmacen,
    filtroLoteSerie,
    filtroFechaLimiteDesde,
    filtroFechaLimiteHasta,
    filtroFechaCaducidadDesde,
    filtroFechaCaducidadHasta,
    filtroStockFisico,
    filtroSoloLoteSerie,
  ]);

  const handleEditar = (id: string) => {
    navigate(`/items/productos/editar/${id}`);
  };

  const handleVerGestionarLoteSerie = (id: string, loteSerie: string) => {
    // Estructura lista para futura integración (ej. modal o ruta de detalle lote/serie)
    console.log('Ver/gestionar lote-serie (frontend only):', id, loteSerie);
  };

  const handleToggleEstado = (row: LoteSerieRow) => {
    setFilas((prev) =>
      prev.map((p) => (p.id === row.id ? { ...p, estado: !p.estado } : p))
    );
  };

  const limpiarFiltros = () => {
    setFiltroReferencia('');
    setFiltroEtiqueta('');
    setFiltroAlmacen('');
    setFiltroLoteSerie('');
    setFiltroFechaLimiteDesde('');
    setFiltroFechaLimiteHasta('');
    setFiltroFechaCaducidadDesde('');
    setFiltroFechaCaducidadHasta('');
    setFiltroStockFisico('');
    setFiltroSoloLoteSerie(false);
  };

  const columns = [
    { Header: 'Referencia', accessor: 'referencia', filterable: true },
    { Header: 'Etiqueta', accessor: 'etiqueta', filterable: true },
    {
      Header: 'Almacén',
      accessor: 'almacen',
      Cell: ({ value }: { value: string }) => value || '—',
      filterable: true,
    },
    {
      Header: 'Lote/Serie',
      accessor: 'lote_serie',
      Cell: ({ value }: { value: string }) => value || '—',
      filterable: true,
    },
    {
      Header: 'Fecha límite venta',
      accessor: 'fecha_limite_venta',
      Cell: ({ value }: { value: string }) => formatDate(value),
      filterable: true,
    },
    {
      Header: 'Fecha caducidad',
      accessor: 'fecha_caducidad',
      Cell: ({ value }: { value: string }) => formatDate(value),
      filterable: true,
    },
    {
      Header: 'Stock físico',
      accessor: 'stock_fisico',
      Cell: ({ value }: { value: number }) => (value != null ? String(value) : '—'),
      filterable: true,
    },
    {
      Header: 'En venta',
      accessor: 'estado_venta',
      Cell: ({ value }: { value: number }) => (
        <Badge color={value === 1 ? 'success' : 'secondary'}>{value === 1 ? 'Sí' : 'No'}</Badge>
      ),
      filterable: true,
    },
    {
      Header: 'En compra',
      accessor: 'estado_compra',
      Cell: ({ value }: { value: number }) => (
        <Badge color={value === 1 ? 'success' : 'secondary'}>{value === 1 ? 'Sí' : 'No'}</Badge>
      ),
      filterable: true,
    },
    {
      Header: 'Acciones',
      accessor: 'id',
      sortable: false,
      filterable: false,
      width: 160,
      Cell: ({ original }: { original: LoteSerieRow }) => {
        const activo = !!original.estado;
        return (
          <div className="d-flex align-items-center justify-content-center gap-1">
            <Button
              onClick={() => activo && handleEditar(original.id)}
              color={activo ? 'info' : 'secondary'}
              size="sm"
              className="me-1"
              title={activo ? 'Editar producto' : 'Producto inactivo'}
              disabled={!activo}
            >
              <i className="bi bi-pencil-fill" />
            </Button>
            <Button
              onClick={() => activo && handleVerGestionarLoteSerie(original.id, original.lote_serie)}
              color={activo ? 'info' : 'secondary'}
              size="sm"
              className="me-1"
              title={activo ? 'Ver/gestionar lote-serie' : 'Producto inactivo'}
              disabled={!activo}
            >
              <i className="bi bi-layers" />
            </Button>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={!!original.estado}
                onChange={() => handleToggleEstado(original)}
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
                  Productos (Stocks por lotes/serie)
                </CardTitle>
              </div>

              {scope === 'GLOBAL' && (
                <FormGroup className="mb-3">
                  <Label for="id_empresa_stocks_lotes">
                    Empresa <span className="text-danger">*</span>
                  </Label>
                  <SelectEmpresa
                    value={selectedIdEmpresa || null}
                    onChange={(val) => setSelectedIdEmpresa(val ?? '')}
                    empresas={empresas}
                    placeholder="Seleccione una empresa para ver los lotes/series"
                  />
                </FormGroup>
              )}

              {scope === 'GLOBAL' && !selectedIdEmpresa && (
                <Alert color="info" className="mb-3">
                  Seleccione una empresa para ver los productos (stocks por lotes/serie)
                </Alert>
              )}

              {scope === 'EMPRESA' && !idEmpresaUsuario && (
                <Alert color="warning" className="mb-3">
                  No se ha detectado empresa en sesión
                </Alert>
              )}

              <p className="text-muted small mb-3">
                Datos de ejemplo. Conecte el backend cuando esté disponible.
              </p>

              <Row className="mb-3">
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_ref_lotes" className="small">Referencia</Label>
                    <Input
                      id="filtro_ref_lotes"
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
                    <Label for="filtro_etiqueta_lotes" className="small">Etiqueta</Label>
                    <Input
                      id="filtro_etiqueta_lotes"
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
                    <Label for="filtro_almacen" className="small">Almacén</Label>
                    <Input
                      id="filtro_almacen"
                      type="text"
                      value={filtroAlmacen}
                      onChange={(e) => setFiltroAlmacen(e.target.value)}
                      placeholder="Almacén"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_lote_serie" className="small">Lote/Serie</Label>
                    <Input
                      id="filtro_lote_serie"
                      type="text"
                      value={filtroLoteSerie}
                      onChange={(e) => setFiltroLoteSerie(e.target.value)}
                      placeholder="Lote o serie"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_fecha_limite_desde" className="small">F. límite venta desde</Label>
                    <Input
                      id="filtro_fecha_limite_desde"
                      type="date"
                      value={filtroFechaLimiteDesde}
                      onChange={(e) => setFiltroFechaLimiteDesde(e.target.value)}
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_fecha_limite_hasta" className="small">F. límite venta hasta</Label>
                    <Input
                      id="filtro_fecha_limite_hasta"
                      type="date"
                      value={filtroFechaLimiteHasta}
                      onChange={(e) => setFiltroFechaLimiteHasta(e.target.value)}
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_fecha_cad_desde" className="small">F. caducidad desde</Label>
                    <Input
                      id="filtro_fecha_cad_desde"
                      type="date"
                      value={filtroFechaCaducidadDesde}
                      onChange={(e) => setFiltroFechaCaducidadDesde(e.target.value)}
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_fecha_cad_hasta" className="small">F. caducidad hasta</Label>
                    <Input
                      id="filtro_fecha_cad_hasta"
                      type="date"
                      value={filtroFechaCaducidadHasta}
                      onChange={(e) => setFiltroFechaCaducidadHasta(e.target.value)}
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_stock_fisico" className="small">Stock físico (mín.)</Label>
                    <Input
                      id="filtro_stock_fisico"
                      type="number"
                      min={0}
                      value={filtroStockFisico}
                      onChange={(e) => setFiltroStockFisico(e.target.value)}
                      placeholder="Mín."
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <FormGroup check className="mb-2 mb-md-0">
                    <Input
                      id="filtro_solo_lote_serie"
                      type="checkbox"
                      checked={filtroSoloLoteSerie}
                      onChange={(e) => setFiltroSoloLoteSerie(e.target.checked)}
                    />
                    <Label for="filtro_solo_lote_serie" check className="small">
                      Solo con lote/serie
                    </Label>
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
                  loading={loading}
                  noDataText="No hay registros de lotes/series para mostrar"
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductosStocksLotes;

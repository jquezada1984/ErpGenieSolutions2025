import React, { useState, useMemo } from 'react';
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

/** Fila del listado de Lotes/Series (frontend only). */
interface LoteSerieRow {
  id: string;
  id_empresa: string;
  id_producto: string;
  producto: string;
  lote_serie: string;
  fecha_limite_venta: string;
  fecha_caducidad: string;
  estado: boolean;
}

/** Datos de ejemplo. Sustituir por API cuando esté disponible. */
const MOCK_LOTES: LoteSerieRow[] = [
  {
    id: '1',
    id_empresa: 'empresa-1',
    id_producto: '1',
    producto: 'REF-001 - Producto ejemplo A',
    lote_serie: 'LOTE-2025-001',
    fecha_limite_venta: '2025-06-30',
    fecha_caducidad: '2025-12-31',
    estado: true,
  },
  {
    id: '2',
    id_empresa: 'empresa-1',
    id_producto: '2',
    producto: 'REF-002 - Producto ejemplo B',
    lote_serie: 'SERIE-XY-001',
    fecha_limite_venta: '',
    fecha_caducidad: '2026-01-15',
    estado: true,
  },
  {
    id: '3',
    id_empresa: 'empresa-1',
    id_producto: '3',
    producto: 'REF-003 - Producto ejemplo C',
    lote_serie: 'LOTE-2024-099',
    fecha_limite_venta: '2025-03-01',
    fecha_caducidad: '2025-03-01',
    estado: false,
  },
];

const formatDate = (value: string) => (value ? value : '—');

const ProductosLotes: React.FC = () => {
  const navigate = useNavigate();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa;

  const [filas, setFilas] = useState<LoteSerieRow[]>(MOCK_LOTES);
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdEmpresa, setSelectedIdEmpresa] = useState<string>('');

  const { data: empresasData } = useQuery(GET_EMPRESAS, { skip: scope !== 'GLOBAL' });
  const empresas = empresasData?.empresas || [];

  const [filtroProducto, setFiltroProducto] = useState('');
  const [filtroLoteSerie, setFiltroLoteSerie] = useState('');
  const [filtroFechaLimiteDesde, setFiltroFechaLimiteDesde] = useState('');
  const [filtroFechaLimiteHasta, setFiltroFechaLimiteHasta] = useState('');
  const [filtroFechaCaducidadDesde, setFiltroFechaCaducidadDesde] = useState('');
  const [filtroFechaCaducidadHasta, setFiltroFechaCaducidadHasta] = useState('');

  const tableData = useMemo(() => {
    return filas.filter((p) => {
      if (scope === 'GLOBAL' && !selectedIdEmpresa) return false;
      if (scope === 'GLOBAL' && selectedIdEmpresa && p.id_empresa !== selectedIdEmpresa) return false;
      if (scope === 'EMPRESA' && idEmpresaUsuario && p.id_empresa !== idEmpresaUsuario) return false;
      if (filtroProducto && !(p.producto || '').toLowerCase().includes(filtroProducto.toLowerCase())) return false;
      if (filtroLoteSerie && !(p.lote_serie || '').toLowerCase().includes(filtroLoteSerie.toLowerCase())) return false;
      if (filtroFechaLimiteDesde && (p.fecha_limite_venta || '') < filtroFechaLimiteDesde) return false;
      if (filtroFechaLimiteHasta && (p.fecha_limite_venta || '') > filtroFechaLimiteHasta) return false;
      if (filtroFechaCaducidadDesde && (p.fecha_caducidad || '') < filtroFechaCaducidadDesde) return false;
      if (filtroFechaCaducidadHasta && (p.fecha_caducidad || '') > filtroFechaCaducidadHasta) return false;
      return true;
    });
  }, [
    filas,
    scope,
    selectedIdEmpresa,
    idEmpresaUsuario,
    filtroProducto,
    filtroLoteSerie,
    filtroFechaLimiteDesde,
    filtroFechaLimiteHasta,
    filtroFechaCaducidadDesde,
    filtroFechaCaducidadHasta,
  ]);

  const handleEditar = (idProducto: string) => {
    navigate(`/items/productos/editar/${idProducto}`);
  };

  const handleVerGestionarLoteSerie = (id: string, loteSerie: string) => {
    console.log('Ver/gestionar lote-serie (frontend only):', id, loteSerie);
  };

  const handleToggleEstado = (row: LoteSerieRow) => {
    setFilas((prev) =>
      prev.map((p) => (p.id === row.id ? { ...p, estado: !p.estado } : p))
    );
  };

  const limpiarFiltros = () => {
    setFiltroProducto('');
    setFiltroLoteSerie('');
    setFiltroFechaLimiteDesde('');
    setFiltroFechaLimiteHasta('');
    setFiltroFechaCaducidadDesde('');
    setFiltroFechaCaducidadHasta('');
  };

  const columns = [
    {
      Header: 'Producto',
      accessor: 'producto',
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
              onClick={() => activo && handleEditar(original.id_producto)}
              color={activo ? 'info' : 'secondary'}
              size="sm"
              className="me-1"
              title={activo ? 'Editar producto' : 'Registro inactivo'}
              disabled={!activo}
            >
              <i className="bi bi-pencil-fill" />
            </Button>
            <Button
              onClick={() => activo && handleVerGestionarLoteSerie(original.id, original.lote_serie)}
              color={activo ? 'info' : 'secondary'}
              size="sm"
              className="me-1"
              title={activo ? 'Ver/gestionar lote-serie' : 'Registro inactivo'}
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
                  Lotes/Series
                </CardTitle>
              </div>

              {scope === 'GLOBAL' && (
                <FormGroup className="mb-3">
                  <Label for="id_empresa_lotes">
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
                  Seleccione una empresa para ver los lotes/series
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
                <Col md={3}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_producto" className="small">Producto</Label>
                    <Input
                      id="filtro_producto"
                      type="text"
                      value={filtroProducto}
                      onChange={(e) => setFiltroProducto(e.target.value)}
                      placeholder="Producto"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
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
              </Row>
              <Row className="mb-3">
                <Col md={12}>
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
                  noDataText="No hay lotes/series para mostrar"
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductosLotes;

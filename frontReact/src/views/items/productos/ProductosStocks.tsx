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

/** Fila del listado de stocks (frontend only). estado = activo/inactivo; estado_venta/estado_compra = comerciales. */
interface ProductoStockRow {
  id: string;
  id_empresa: string;
  referencia: string;
  etiqueta: string;
  stock_limite: number;
  stock_deseado: number;
  stock_fisico: number;
  stock_virtual: number;
  estado_venta: number;
  estado_compra: number;
  estado: boolean;
}

/** Datos de ejemplo. Sustituir por API cuando esté disponible. */
const MOCK_STOCKS_INICIAL: ProductoStockRow[] = [
  {
    id: '1',
    id_empresa: 'empresa-1',
    referencia: 'REF-001',
    etiqueta: 'Producto ejemplo A',
    stock_limite: 10,
    stock_deseado: 100,
    stock_fisico: 95,
    stock_virtual: 95,
    estado_venta: 1,
    estado_compra: 1,
    estado: true,
  },
  {
    id: '2',
    id_empresa: 'empresa-1',
    referencia: 'REF-002',
    etiqueta: 'Producto ejemplo B',
    stock_limite: 5,
    stock_deseado: 50,
    stock_fisico: 48,
    stock_virtual: 48,
    estado_venta: 1,
    estado_compra: 0,
    estado: true,
  },
  {
    id: '3',
    id_empresa: 'empresa-1',
    referencia: 'REF-003',
    etiqueta: 'Producto ejemplo C',
    stock_limite: 2,
    stock_deseado: 20,
    stock_fisico: 1,
    stock_virtual: 1,
    estado_venta: 0,
    estado_compra: 1,
    estado: false,
  },
];

const ProductosStocks: React.FC = () => {
  const navigate = useNavigate();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa;

  const [productos, setProductos] = useState<ProductoStockRow[]>(MOCK_STOCKS_INICIAL);
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdEmpresa, setSelectedIdEmpresa] = useState<string>('');

  const { data: empresasData } = useQuery(GET_EMPRESAS, { skip: scope !== 'GLOBAL' });
  const empresas = empresasData?.empresas || [];

  const [filtroReferencia, setFiltroReferencia] = useState('');
  const [filtroEtiqueta, setFiltroEtiqueta] = useState('');
  const [filtroStockInsuficiente, setFiltroStockInsuficiente] = useState(false);

  const tableData = useMemo(() => {
    return productos.filter((p) => {
      if (scope === 'GLOBAL' && !selectedIdEmpresa) return false;
      if (scope === 'GLOBAL' && selectedIdEmpresa && p.id_empresa !== selectedIdEmpresa) return false;
      if (scope === 'EMPRESA' && idEmpresaUsuario && p.id_empresa !== idEmpresaUsuario) return false;
      if (filtroReferencia && !p.referencia.toLowerCase().includes(filtroReferencia.toLowerCase())) return false;
      if (filtroEtiqueta && !p.etiqueta.toLowerCase().includes(filtroEtiqueta.toLowerCase())) return false;
      if (filtroStockInsuficiente && p.stock_fisico >= p.stock_deseado) return false;
      return true;
    });
  }, [productos, scope, selectedIdEmpresa, idEmpresaUsuario, filtroReferencia, filtroEtiqueta, filtroStockInsuficiente]);

  const handleEditar = (id: string) => {
    navigate(`/items/productos/editar/${id}`);
  };

  const handleAjustarStock = (id: string) => {
    // Estructura lista para futura integración (ej. navegación a /items/productos/stocks/ajustar/:id)
    console.log('Ajustar stock (frontend only):', id);
  };

  const handleToggleEstado = (producto: ProductoStockRow) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === producto.id ? { ...p, estado: !p.estado } : p))
    );
  };

  const limpiarFiltros = () => {
    setFiltroReferencia('');
    setFiltroEtiqueta('');
    setFiltroStockInsuficiente(false);
  };

  const columns = [
    { Header: 'Referencia', accessor: 'referencia', filterable: true },
    { Header: 'Etiqueta', accessor: 'etiqueta', filterable: true },
    {
      Header: 'Stock límite',
      accessor: 'stock_limite',
      Cell: ({ value }: { value: number }) => (value != null ? String(value) : '—'),
      filterable: true,
    },
    {
      Header: 'Stock deseado',
      accessor: 'stock_deseado',
      Cell: ({ value }: { value: number }) => (value != null ? String(value) : '—'),
      filterable: true,
    },
    {
      Header: 'Stock físico',
      accessor: 'stock_fisico',
      Cell: ({ value }: { value: number }) => (value != null ? String(value) : '—'),
      filterable: true,
    },
    {
      Header: 'Stock virtual',
      accessor: 'stock_virtual',
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
      Cell: ({ original }: { original: ProductoStockRow }) => {
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
              onClick={() => activo && handleAjustarStock(original.id)}
              color={activo ? 'info' : 'secondary'}
              size="sm"
              className="me-1"
              title={activo ? 'Ajustar stock' : 'Producto inactivo'}
              disabled={!activo}
            >
              <i className="bi bi-box-seam" />
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
                  Productos (Stocks)
                </CardTitle>
              </div>

              {scope === 'GLOBAL' && (
                <FormGroup className="mb-3">
                  <Label for="id_empresa_stocks">
                    Empresa <span className="text-danger">*</span>
                  </Label>
                  <SelectEmpresa
                    value={selectedIdEmpresa || null}
                    onChange={(val) => setSelectedIdEmpresa(val ?? '')}
                    empresas={empresas}
                    placeholder="Seleccione una empresa para ver los productos y stocks"
                  />
                </FormGroup>
              )}

              {scope === 'GLOBAL' && !selectedIdEmpresa && (
                <Alert color="info" className="mb-3">
                  Seleccione una empresa para ver los productos y stocks
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
                    <Label for="filtro_ref_stocks" className="small">Referencia</Label>
                    <Input
                      id="filtro_ref_stocks"
                      type="text"
                      value={filtroReferencia}
                      onChange={(e) => setFiltroReferencia(e.target.value)}
                      placeholder="Referencia"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_etiqueta_stocks" className="small">Etiqueta</Label>
                    <Input
                      id="filtro_etiqueta_stocks"
                      type="text"
                      value={filtroEtiqueta}
                      onChange={(e) => setFiltroEtiqueta(e.target.value)}
                      placeholder="Etiqueta"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <FormGroup check className="mb-2 mb-md-0">
                    <Input
                      id="filtro_stock_insuficiente"
                      type="checkbox"
                      checked={filtroStockInsuficiente}
                      onChange={(e) => setFiltroStockInsuficiente(e.target.checked)}
                    />
                    <Label for="filtro_stock_insuficiente" check className="small">
                      Stock insuficiente
                    </Label>
                  </FormGroup>
                </Col>
                <Col md={3} className="d-flex align-items-end">
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

export default ProductosStocks;

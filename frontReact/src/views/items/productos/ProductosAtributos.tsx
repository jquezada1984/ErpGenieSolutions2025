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

/** Fila del listado de atributos de variantes (frontend only). */
interface AtributoVarianteRow {
  id: string;
  id_empresa: string;
  ref: string;
  etiqueta: string;
  num_valores_diferentes: number;
  num_productos: number;
  estado: boolean;
}

/** Datos de ejemplo. Sustituir por API cuando esté disponible. */
const MOCK_ATRIBUTOS: AtributoVarianteRow[] = [
  {
    id: '1',
    id_empresa: 'empresa-1',
    ref: 'ATR-COLOR',
    etiqueta: 'Color',
    num_valores_diferentes: 5,
    num_productos: 12,
    estado: true,
  },
  {
    id: '2',
    id_empresa: 'empresa-1',
    ref: 'ATR-TALLA',
    etiqueta: 'Talla',
    num_valores_diferentes: 8,
    num_productos: 20,
    estado: true,
  },
  {
    id: '3',
    id_empresa: 'empresa-1',
    ref: 'ATR-MATERIAL',
    etiqueta: 'Material',
    num_valores_diferentes: 3,
    num_productos: 5,
    estado: false,
  },
];

const ProductosAtributos: React.FC = () => {
  const navigate = useNavigate();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa;

  const [filas, setFilas] = useState<AtributoVarianteRow[]>(MOCK_ATRIBUTOS);
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdEmpresa, setSelectedIdEmpresa] = useState<string>('');

  const { data: empresasData } = useQuery(GET_EMPRESAS, { skip: scope !== 'GLOBAL' });
  const empresas = empresasData?.empresas || [];

  const [filtroRef, setFiltroRef] = useState('');
  const [filtroEtiqueta, setFiltroEtiqueta] = useState('');
  const [filtroNumValores, setFiltroNumValores] = useState('');
  const [filtroNumProductos, setFiltroNumProductos] = useState('');

  const tableData = useMemo(() => {
    return filas.filter((p) => {
      if (scope === 'GLOBAL' && !selectedIdEmpresa) return false;
      if (scope === 'GLOBAL' && selectedIdEmpresa && p.id_empresa !== selectedIdEmpresa) return false;
      if (scope === 'EMPRESA' && idEmpresaUsuario && p.id_empresa !== idEmpresaUsuario) return false;
      if (filtroRef && !(p.ref || '').toLowerCase().includes(filtroRef.toLowerCase())) return false;
      if (filtroEtiqueta && !(p.etiqueta || '').toLowerCase().includes(filtroEtiqueta.toLowerCase())) return false;
      if (filtroNumValores !== '') {
        const v = Number(filtroNumValores);
        if (!Number.isFinite(v) || p.num_valores_diferentes !== v) return false;
      }
      if (filtroNumProductos !== '') {
        const v = Number(filtroNumProductos);
        if (!Number.isFinite(v) || p.num_productos !== v) return false;
      }
      return true;
    });
  }, [filas, scope, selectedIdEmpresa, idEmpresaUsuario, filtroRef, filtroEtiqueta, filtroNumValores, filtroNumProductos]);

  const handleEditar = (id: string) => {
    // Ruta futura: ej. /items/productos/atributos/editar/:id
    console.log('Editar atributo (frontend only):', id);
  };

  const handleVerValores = (id: string, ref: string) => {
    console.log('Ver valores del atributo (frontend only):', id, ref);
  };

  const handleToggleEstado = (row: AtributoVarianteRow) => {
    setFilas((prev) =>
      prev.map((p) => (p.id === row.id ? { ...p, estado: !p.estado } : p))
    );
  };

  const limpiarFiltros = () => {
    setFiltroRef('');
    setFiltroEtiqueta('');
    setFiltroNumValores('');
    setFiltroNumProductos('');
  };

  const columns = [
    {
      Header: 'Ref',
      accessor: 'ref',
      Cell: ({ value }: { value: string }) => value || '—',
      filterable: true,
    },
    {
      Header: 'Etiqueta',
      accessor: 'etiqueta',
      Cell: ({ value }: { value: string }) => value || '—',
      filterable: true,
    },
    {
      Header: 'N° de valores diferentes',
      accessor: 'num_valores_diferentes',
      Cell: ({ value }: { value: number }) => (value != null ? String(value) : '—'),
      filterable: true,
    },
    {
      Header: 'N° de productos',
      accessor: 'num_productos',
      Cell: ({ value }: { value: number }) => (value != null ? String(value) : '—'),
      filterable: true,
    },
    {
      Header: 'Estado',
      accessor: 'estado',
      Cell: ({ value }: { value: boolean }) => (
        <Badge color={value ? 'success' : 'danger'}>
          {value ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
      filterable: true,
    },
    {
      Header: 'Acciones',
      accessor: 'id',
      sortable: false,
      filterable: false,
      width: 160,
      Cell: ({ original }: { original: AtributoVarianteRow }) => {
        const activo = !!original.estado;
        return (
          <div className="d-flex align-items-center justify-content-center gap-1">
            <Button
              onClick={() => activo && handleEditar(original.id)}
              color={activo ? 'info' : 'secondary'}
              size="sm"
              className="me-1"
              title={activo ? 'Editar atributo' : 'Registro inactivo'}
              disabled={!activo}
            >
              <i className="bi bi-pencil-fill" />
            </Button>
            <Button
              onClick={() => activo && handleVerValores(original.id, original.ref)}
              color={activo ? 'info' : 'secondary'}
              size="sm"
              className="me-1"
              title={activo ? 'Ver valores del atributo' : 'Registro inactivo'}
              disabled={!activo}
            >
              <i className="bi bi-list-ul" />
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
                  Atributos de variantes para productos
                </CardTitle>
              </div>

              {scope === 'GLOBAL' && (
                <FormGroup className="mb-3">
                  <Label for="id_empresa_atributos">
                    Empresa <span className="text-danger">*</span>
                  </Label>
                  <SelectEmpresa
                    value={selectedIdEmpresa || null}
                    onChange={(val) => setSelectedIdEmpresa(val ?? '')}
                    empresas={empresas}
                    placeholder="Seleccione una empresa para ver los atributos"
                  />
                </FormGroup>
              )}

              {scope === 'GLOBAL' && !selectedIdEmpresa && (
                <Alert color="info" className="mb-3">
                  Seleccione una empresa para ver los atributos de variantes
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
                    <Label for="filtro_ref" className="small">Ref</Label>
                    <Input
                      id="filtro_ref"
                      type="text"
                      value={filtroRef}
                      onChange={(e) => setFiltroRef(e.target.value)}
                      placeholder="Ref"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_etiqueta" className="small">Etiqueta</Label>
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
                    <Label for="filtro_num_valores" className="small">N° valores diferentes</Label>
                    <Input
                      id="filtro_num_valores"
                      type="number"
                      min={0}
                      value={filtroNumValores}
                      onChange={(e) => setFiltroNumValores(e.target.value)}
                      placeholder="N°"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_num_productos" className="small">N° de productos</Label>
                    <Input
                      id="filtro_num_productos"
                      type="number"
                      min={0}
                      value={filtroNumProductos}
                      onChange={(e) => setFiltroNumProductos(e.target.value)}
                      placeholder="N°"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button color="secondary" size="sm" outline onClick={limpiarFiltros}>
                    <i className="bi bi-x-circle me-1" />
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
                  noDataText="No se han encontrado registros"
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductosAtributos;

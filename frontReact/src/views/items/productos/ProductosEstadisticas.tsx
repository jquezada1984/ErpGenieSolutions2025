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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import classnames from 'classnames';
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

/** Fila de productos por popularidad (frontend only). */
interface PopularidadRow {
  ref: string;
  tipo: string;
  etiqueta: string;
  cant: number;
}

const MOCK_POPULARIDAD: PopularidadRow[] = [
  { ref: 'REF-001', tipo: 'Producto', etiqueta: 'Producto ejemplo A', cant: 150 },
  { ref: 'REF-002', tipo: 'Producto', etiqueta: 'Producto ejemplo B', cant: 98 },
  { ref: 'REF-003', tipo: 'Producto', etiqueta: 'Producto ejemplo C', cant: 45 },
];

const ProductosEstadisticas: React.FC = () => {
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa;

  const [activeTab, setActiveTab] = useState<'1' | '2'>('1');
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdEmpresa, setSelectedIdEmpresa] = useState<string>('');

  const { data: empresasData } = useQuery(GET_EMPRESAS, { skip: scope !== 'GLOBAL' });
  const empresas = empresasData?.empresas || [];

  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroAnio, setFiltroAnio] = useState('');
  const [filtroProducto, setFiltroProducto] = useState('');
  const [filtroPopularidad, setFiltroPopularidad] = useState('');

  const tableData = useMemo(() => {
    return MOCK_POPULARIDAD.filter((p) => {
      if (filtroPopularidad && !p.etiqueta.toLowerCase().includes(filtroPopularidad.toLowerCase()) && !p.ref.toLowerCase().includes(filtroPopularidad.toLowerCase())) return false;
      return true;
    });
  }, [filtroPopularidad]);

  const toggle = (tab: '1' | '2') => activeTab !== tab && setActiveTab(tab);

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="grid-header">
                <CardTitle tag="h4" className="grid-title">
                  Estadísticas
                </CardTitle>
              </div>

              {scope === 'GLOBAL' && (
                <FormGroup className="mb-3">
                  <Label for="id_empresa_estadisticas">
                    Empresa <span className="text-danger">*</span>
                  </Label>
                  <SelectEmpresa
                    value={selectedIdEmpresa || null}
                    onChange={(val) => setSelectedIdEmpresa(val ?? '')}
                    empresas={empresas}
                    placeholder="Seleccione una empresa"
                  />
                </FormGroup>
              )}

              {scope === 'GLOBAL' && !selectedIdEmpresa && (
                <Alert color="info" className="mb-3">
                  Seleccione una empresa para ver las estadísticas
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

              <Nav tabs className="nav-tabs-custom">
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '1' })}
                    onClick={() => toggle('1')}
                  >
                    <i className="fas fa-chart-line me-2" />
                    Gráfico
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '2' })}
                    onClick={() => toggle('2')}
                  >
                    <i className="fas fa-sort-amount-down me-2" />
                    Productos por popularidad
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab} className="mt-4">
                <TabPane tabId="1">
                  <Row className="mb-3">
                    <Col md={2}>
                      <FormGroup className="mb-2 mb-md-0">
                        <Label for="est_tipo" className="small">Tipo</Label>
                        <Input
                          id="est_tipo"
                          type="select"
                          value={filtroTipo}
                          onChange={(e) => setFiltroTipo(e.target.value)}
                          bsSize="sm"
                        >
                          <option value="">Todos</option>
                          <option value="producto">Producto</option>
                          <option value="servicio">Servicio</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup className="mb-2 mb-md-0">
                        <Label for="est_anio" className="small">Año</Label>
                        <Input
                          id="est_anio"
                          type="number"
                          value={filtroAnio}
                          onChange={(e) => setFiltroAnio(e.target.value)}
                          placeholder="Año"
                          bsSize="sm"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup className="mb-2 mb-md-0">
                        <Label for="est_producto" className="small">Producto/Servicio</Label>
                        <Input
                          id="est_producto"
                          type="text"
                          value={filtroProducto}
                          onChange={(e) => setFiltroProducto(e.target.value)}
                          placeholder="Ref o etiqueta"
                          bsSize="sm"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2} className="d-flex align-items-end">
                      <Button color="primary" size="sm">
                        <i className="bi bi-arrow-clockwise me-1" />
                        Aplicar filtros
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Card className="h-100">
                        <CardBody>
                          <CardTitle tag="h6">Número de unidades en presupuestos</CardTitle>
                          <div className="bg-light rounded p-4 text-center text-muted">
                            <small>Gráfico placeholder. Conecte el backend para datos reales.</small>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Card className="h-100">
                        <CardBody>
                          <CardTitle tag="h6">Número de unidades en pedidos</CardTitle>
                          <div className="bg-light rounded p-4 text-center text-muted">
                            <small>Gráfico placeholder. Conecte el backend para datos reales.</small>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Card className="h-100">
                        <CardBody>
                          <CardTitle tag="h6">Número de unidades en facturas</CardTitle>
                          <div className="bg-light rounded p-4 text-center text-muted">
                            <small>Gráfico placeholder. Conecte el backend para datos reales.</small>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Card className="h-100">
                        <CardBody>
                          <CardTitle tag="h6">Resumen por período</CardTitle>
                          <div className="bg-light rounded p-4 text-center text-muted">
                            <small>Gráfico placeholder. Conecte el backend para datos reales.</small>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row className="mb-3">
                    <Col md={4}>
                      <FormGroup className="mb-2 mb-md-0">
                        <Label for="filtro_popularidad" className="small">Producto / Ref.</Label>
                        <Input
                          id="filtro_popularidad"
                          type="text"
                          value={filtroPopularidad}
                          onChange={(e) => setFiltroPopularidad(e.target.value)}
                          placeholder="Ref o etiqueta"
                          bsSize="sm"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4} className="d-flex align-items-end">
                      <Button color="primary" size="sm">
                        <i className="bi bi-arrow-clockwise me-1" />
                        Refrescar
                      </Button>
                    </Col>
                  </Row>
                  <div className="grid-container">
                    <ReactTable
                      data={tableData}
                      columns={[
                        { Header: 'Ref.', accessor: 'ref', filterable: true },
                        { Header: 'Tipo', accessor: 'tipo', filterable: true },
                        { Header: 'Etiqueta', accessor: 'etiqueta', filterable: true },
                        {
                          Header: 'Cant.',
                          accessor: 'cant',
                          Cell: ({ value }: { value: number }) => (value != null ? String(value) : '—'),
                          filterable: true,
                        },
                      ]}
                      defaultPageSize={10}
                      className="-striped -highlight"
                      showPagination={true}
                      showPageSizeOptions={true}
                      pageSizeOptions={[5, 10, 20, 50]}
                      loading={loading}
                      noDataText="No se han encontrado registros"
                    />
                  </div>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductosEstadisticas;

import React, { useMemo, useState } from 'react';
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
  Spinner,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import SelectEmpresa from '../../components/SelectEmpresa';
import SearchableSelect from '../../components/SearchableSelect';
import useJwtPayload from '../../hooks/useJwtPayload';
import {
  GET_CATEGORIAS_GASTO,
  GET_EMPRESAS,
  GET_GASTOS,
  GET_TERCEROS_GASTO,
} from './gastosQueries';
import { ESTADO_GASTO_BADGE, formatFecha, formatMoney } from './utils/money';

const Gastos: React.FC = () => {
  const navigate = useNavigate();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const empresaToken = payload?.id_empresa || '';
  const isGlobal = scope === 'GLOBAL';

  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  const [estadoGasto, setEstadoGasto] = useState('');
  const [idCategoria, setIdCategoria] = useState<string | null>(null);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const idEmpresa = isGlobal ? empresaSeleccionada : empresaToken;
  const skip = isGlobal && !empresaSeleccionada;

  const companyCtx = {
    headers: { 'X-Company-Id': idEmpresa || '' },
  };

  const { data: empresasData } = useQuery(GET_EMPRESAS, { skip: !isGlobal });
  const empresas = empresasData?.empresas || [];

  const {
    data: gastosData,
    loading,
    error,
    refetch,
  } = useQuery(GET_GASTOS, {
    variables: {
      id_empresa: idEmpresa,
      estado_gasto: estadoGasto || null,
      fecha_desde: fechaDesde || null,
      fecha_hasta: fechaHasta || null,
      id_categoria_gasto: idCategoria || null,
    },
    skip,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    context: companyCtx,
  });

  const { data: catData } = useQuery(GET_CATEGORIAS_GASTO, {
    variables: { id_empresa: idEmpresa, solo_activos: false },
    skip,
    fetchPolicy: 'cache-and-network',
    context: companyCtx,
  });

  const { data: terData } = useQuery(GET_TERCEROS_GASTO, {
    variables: { id_empresa: idEmpresa || null },
    skip,
    fetchPolicy: 'cache-and-network',
    context: companyCtx,
  });

  const catMap = useMemo(() => {
    const m = new Map<string, string>();
    (catData?.categoriasGasto || []).forEach((c: any) => {
      m.set(c.id_categoria_gasto, `${c.codigo} — ${c.nombre}`);
    });
    return m;
  }, [catData]);

  const terMap = useMemo(() => {
    const m = new Map<string, string>();
    (terData?.terceros || []).forEach((t: any) => {
      m.set(t.id_tercero, t.nombre);
    });
    return m;
  }, [terData]);

  const catOptions = useMemo(
    () =>
      (catData?.categoriasGasto || []).map((c: any) => ({
        value: c.id_categoria_gasto,
        label: `${c.codigo} — ${c.nombre}`,
      })),
    [catData],
  );

  const rows = useMemo(() => {
    const list = gastosData?.gastos || [];
    const q = busqueda.trim().toLowerCase();
    return list
      .map((g: any) => ({
        ...g,
        categoria_label: catMap.get(g.id_categoria_gasto) || '-',
        tercero_label: g.id_tercero ? terMap.get(g.id_tercero) || '-' : '-',
      }))
      .filter((g: any) => {
        if (!q) return true;
        return (
          String(g.numero_gasto || '').toLowerCase().includes(q) ||
          String(g.concepto || '').toLowerCase().includes(q) ||
          String(g.tercero_label || '').toLowerCase().includes(q) ||
          String(g.categoria_label || '').toLowerCase().includes(q)
        );
      });
  }, [gastosData, catMap, terMap, busqueda]);

  const columns = [
    { Header: 'Número', accessor: 'numero_gasto', filterable: true },
    {
      Header: 'Fecha',
      accessor: 'fecha_gasto',
      Cell: ({ value }: any) => formatFecha(value),
      filterable: true,
    },
    { Header: 'Proveedor', accessor: 'tercero_label', filterable: true },
    { Header: 'Categoría', accessor: 'categoria_label', filterable: true },
    {
      Header: 'Concepto',
      accessor: 'concepto',
      filterable: true,
      Cell: ({ value }: any) => (
        <span title={value}>{String(value || '').slice(0, 40)}</span>
      ),
    },
    {
      Header: 'Subtotal',
      accessor: 'subtotal',
      Cell: ({ value }: any) => formatMoney(value),
    },
    {
      Header: 'Impuesto',
      accessor: 'impuesto',
      Cell: ({ value }: any) => formatMoney(value),
    },
    {
      Header: 'Total',
      accessor: 'total',
      Cell: ({ value }: any) => <strong>{formatMoney(value)}</strong>,
    },
    {
      Header: 'Estado',
      accessor: 'estado_gasto',
      Cell: ({ value }: any) => (
        <Badge color={ESTADO_GASTO_BADGE[value] || 'secondary'}>{value || '-'}</Badge>
      ),
    },
    {
      Header: 'Acciones',
      accessor: 'id_gasto',
      sortable: false,
      filterable: false,
      width: 100,
      Cell: ({ original }: any) => {
        const editable = original.estado_gasto === 'BORRADOR';
        return (
          <Button
            color={editable ? 'info' : 'secondary'}
            size="sm"
            disabled={!editable}
            title={editable ? 'Editar' : 'Solo BORRADOR es editable'}
            onClick={() => navigate(`/gastos/${original.id_gasto}/editar`)}
          >
            <i className="bi bi-pencil-fill" />
          </Button>
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
                  Gastos
                </CardTitle>
                <div className="grid-actions d-flex gap-2">
                  <Button
                    color="secondary"
                    outline
                    onClick={() => navigate('/gastos/categorias')}
                    disabled={skip}
                  >
                    Categorías
                  </Button>
                  <Button
                    color="primary"
                    className="grid-primary-button"
                    disabled={skip}
                    onClick={() => navigate('/gastos/nuevo')}
                  >
                    <i className="bi bi-plus-circle me-2" />
                    Nuevo gasto
                  </Button>
                </div>
              </div>

              {isGlobal && (
                <FormGroup className="mb-3" style={{ maxWidth: 420 }}>
                  <Label>Empresa</Label>
                  <SelectEmpresa
                    value={empresaSeleccionada || null}
                    onChange={(v) => {
                      setEmpresaSeleccionada(v || '');
                      setIdCategoria(null);
                    }}
                    empresas={empresas}
                    placeholder="Seleccione empresa…"
                  />
                </FormGroup>
              )}

              {skip && (
                <Alert color="info">Seleccione una empresa para listar gastos.</Alert>
              )}

              {!skip && (
                <Row className="mb-3 g-2">
                  <Col md={3}>
                    <Label>Buscar</Label>
                    <Input
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      placeholder="Número, concepto…"
                    />
                  </Col>
                  <Col md={2}>
                    <Label>Estado</Label>
                    <Input
                      type="select"
                      value={estadoGasto}
                      onChange={(e) => setEstadoGasto(e.target.value)}
                    >
                      <option value="">Todos</option>
                      <option value="BORRADOR">BORRADOR</option>
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="APROBADO">APROBADO</option>
                      <option value="RECHAZADO">RECHAZADO</option>
                      <option value="ANULADO">ANULADO</option>
                    </Input>
                  </Col>
                  <Col md={3}>
                    <Label>Categoría</Label>
                    <SearchableSelect
                      value={idCategoria}
                      onChange={(v) => setIdCategoria(v)}
                      options={catOptions}
                      placeholder="Todas"
                    />
                  </Col>
                  <Col md={2}>
                    <Label>Desde</Label>
                    <Input
                      type="date"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                    />
                  </Col>
                  <Col md={2}>
                    <Label>Hasta</Label>
                    <Input
                      type="date"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                    />
                  </Col>
                </Row>
              )}

              {error && (
                <Alert color="danger">
                  {error.message || 'Error al cargar gastos'}
                  <Button color="link" size="sm" onClick={() => refetch()}>
                    Reintentar
                  </Button>
                </Alert>
              )}

              {loading && !gastosData ? (
                <div className="text-center py-4">
                  <Spinner />
                </div>
              ) : (
                !skip && (
                  <ReactTable
                    data={rows}
                    columns={columns}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    noDataText="Sin gastos"
                  />
                )
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Gastos;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import useJwtPayload from '../../../hooks/useJwtPayload';
import SelectEmpresa from '../../../components/SelectEmpresa';

const GET_EMPRESAS = gql`
  query GetEmpresasInventarioListado {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

const INVENTARIOS_LISTADO = gql`
  query InventariosListado(
    $id_empresa: ID
    $inventario_ref: String
    $etiqueta: String
    $warehouse: String
    $product: String
    $estado_inventario: String
  ) {
    inventariosListado(
      id_empresa: $id_empresa
      inventario_ref: $inventario_ref
      etiqueta: $etiqueta
      warehouse: $warehouse
      product: $product
      estado_inventario: $estado_inventario
    ) {
      id_inventario
      inventario_ref
      etiqueta
      id_almacen
      almacen
      product
      estado_inventario
      estado
    }
  }
`;

const ACTUALIZAR_ESTADO_INVENTARIO = gql`
  mutation ActualizarEstadoInventario($id_inventario: ID!, $estado: Boolean!) {
    actualizarEstadoInventario(id_inventario: $id_inventario, estado: $estado)
  }
`;

type InventarioRow = {
  id_inventario: string;
  ref: string;
  label: string;
  warehouse: string;
  product: number;
  status: 'ABIERTO' | 'CERRADO' | 'BORRADOR' | string;
  estado: boolean;
};

const Inventarios: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa || '';

  const [selectedIdEmpresa, setSelectedIdEmpresa] = useState<string>('');
  const [rows, setRows] = useState<InventarioRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [fRef, setFRef] = useState('');
  const [fLabel, setFLabel] = useState('');
  const [fWarehouse, setFWarehouse] = useState('');
  const [fProduct, setFProduct] = useState('');
  const [fStatus, setFStatus] = useState('');

  const [getInventarios, { loading: queryLoading }] = useLazyQuery(INVENTARIOS_LISTADO, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });
  const [mutateEstadoInventario] = useMutation(ACTUALIZAR_ESTADO_INVENTARIO, {
    errorPolicy: 'all',
  });

  const { data: empresasData } = useQuery(GET_EMPRESAS, { skip: scope !== 'GLOBAL' });
  const empresas = empresasData?.empresas || [];

  const loadInventarios = useCallback(async () => {
    const idEmpresaActiva = scope === 'GLOBAL' ? selectedIdEmpresa : idEmpresaUsuario;
    if (!idEmpresaActiva) {
      setRows([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await getInventarios({
        variables: {
          id_empresa: idEmpresaActiva,
          inventario_ref: fRef.trim() || null,
          etiqueta: fLabel.trim() || null,
          warehouse: fWarehouse.trim() || null,
          product: fProduct.trim() || null,
          estado_inventario: fStatus.trim() || null,
        },
      });

      if (res.error?.message) {
        setError(res.error.message);
      }

      const raw = (res.data?.inventariosListado || []) as Array<{
        id_inventario: string;
        inventario_ref?: string | null;
        etiqueta?: string | null;
        almacen?: string | null;
        product?: number | null;
        estado_inventario?: string | null;
        estado?: boolean | null;
      }>;

      const mapped = raw.map((r) => ({
          id_inventario: r.id_inventario,
          ref: r.inventario_ref || '',
          label: r.etiqueta || '',
          warehouse: r.almacen || 'Sin almacén',
          product: Number(r.product ?? 0) || 0,
          status: r.estado_inventario || '—',
          estado: r.estado !== false,
        }));

      setRows(mapped);
    } catch (e: unknown) {
      setRows([]);
      setError(e instanceof Error ? e.message : 'Error al cargar inventarios');
    } finally {
      setLoading(false);
    }
  }, [
    scope,
    selectedIdEmpresa,
    idEmpresaUsuario,
    getInventarios,
    fRef,
    fLabel,
    fWarehouse,
    fProduct,
    fStatus,
  ]);

  useEffect(() => {
    if (location.pathname !== '/items/inventarios') return;
    if (scope === 'EMPRESA' && idEmpresaUsuario) {
      loadInventarios();
    } else if (scope === 'GLOBAL' && selectedIdEmpresa) {
      loadInventarios();
    } else if (scope === 'GLOBAL' && !selectedIdEmpresa) {
      setRows([]);
    }
  }, [location.pathname, scope, idEmpresaUsuario, selectedIdEmpresa, loadInventarios]);

  const puedeVerListado = scope === 'EMPRESA' ? Boolean(idEmpresaUsuario) : Boolean(selectedIdEmpresa);
  const filteredRows = useMemo(() => rows, [rows]);

  const limpiarFiltros = () => {
    setFRef('');
    setFLabel('');
    setFWarehouse('');
    setFProduct('');
    setFStatus('');
  };

  const handleEditar = (idInventario: string) => {
    navigate(`/items/inventarios/editar/${encodeURIComponent(idInventario)}`);
  };

  const handleToggleEstado = (row: InventarioRow) => {
    const estadoAnterior = !!row.estado;
    const estadoNuevo = !estadoAnterior;

    setRows((prev) =>
      prev.map((r) => (r.id_inventario === row.id_inventario ? { ...r, estado: estadoNuevo } : r)),
    );

    void (async () => {
      try {
        setError(null);
        setSuccess(null);
        const { data, errors } = await mutateEstadoInventario({
          variables: { id_inventario: row.id_inventario, estado: estadoNuevo },
        });
        if (errors?.length) {
          throw new Error(errors.map((e) => e.message).join(' | '));
        }
        if (data?.actualizarEstadoInventario === false) {
          throw new Error('No se pudo actualizar el estado del inventario.');
        }
        setSuccess('Estado de inventario actualizado correctamente.');
        await loadInventarios();
      } catch (e: unknown) {
        setRows((prev) =>
          prev.map((r) => (r.id_inventario === row.id_inventario ? { ...r, estado: estadoAnterior } : r)),
        );
        setError(e instanceof Error ? e.message : 'Error al actualizar el estado del inventario');
      }
    })();
  };

  const columns = [
    {
      Header: 'Referencia',
      accessor: 'ref',
      Cell: ({ value }: { value: string }) => value || '—',
      filterable: true,
    },
    {
      Header: 'Etiqueta',
      accessor: 'label',
      Cell: ({ value }: { value: string }) => value || '—',
      filterable: true,
    },
    {
      Header: 'Almacén',
      accessor: 'warehouse',
      Cell: ({ value }: { value: string }) => value || '—',
      filterable: true,
    },
    {
      Header: 'Producto',
      accessor: 'product',
      Cell: ({ value }: { value: number }) => (Number.isFinite(value) ? String(value) : '0'),
      filterable: true,
    },
    {
      Header: 'Estado',
      accessor: 'status',
      Cell: ({ value }: { value: string }) => (
        <Badge color={value === 'CERRADO' ? 'secondary' : value === 'BORRADOR' ? 'warning' : 'success'}>
          {value || '—'}
        </Badge>
      ),
      filterable: true,
    },
    {
      Header: 'Acciones',
      accessor: 'id_inventario',
      sortable: false,
      filterable: false,
      width: 130,
      Cell: ({ original }: { original: InventarioRow }) => (
        <div className="d-flex align-items-center justify-content-center gap-1">
          <Button
            onClick={() => original.estado && handleEditar(original.id_inventario)}
            color={original.estado ? 'info' : 'secondary'}
            size="sm"
            className="me-1"
            title={original.estado ? 'Editar' : 'Inventario inactivo: no se puede editar'}
            disabled={!original.estado}
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
                  Inventarios
                </CardTitle>
                <div className="grid-actions">
                  <Button color="primary" className="grid-primary-button" onClick={() => navigate('/items/inventarios/nuevo')}>
                    <i className="bi bi-plus-circle me-2" />
                    Nuevo inventario
                  </Button>
                </div>
              </div>

              {scope === 'GLOBAL' && (
                <FormGroup className="mb-3">
                  <Label for="id_empresa_listado_inventarios">Empresa</Label>
                  <SelectEmpresa
                    value={selectedIdEmpresa || null}
                    onChange={(val) => setSelectedIdEmpresa(val ?? '')}
                    empresas={empresas}
                    placeholder="Seleccione una empresa para ver los inventarios"
                  />
                </FormGroup>
              )}

              {scope === 'GLOBAL' && !selectedIdEmpresa && (
                <Alert color="info" className="mb-3">
                  Seleccione una empresa para ver los inventarios
                </Alert>
              )}

              {error && (
                <Alert color="warning" className="mb-3" toggle={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert color="success" className="mb-3" toggle={() => setSuccess(null)}>
                  {success}
                </Alert>
              )}

              <Row className="mb-3">
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_ref_inventario" className="small">Referencia</Label>
                    <Input
                      id="filtro_ref_inventario"
                      type="text"
                      value={fRef}
                      onChange={(e) => setFRef(e.target.value)}
                      onBlur={loadInventarios}
                      placeholder="Referencia"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_label_inventario" className="small">Etiqueta</Label>
                    <Input
                      id="filtro_label_inventario"
                      type="text"
                      value={fLabel}
                      onChange={(e) => setFLabel(e.target.value)}
                      onBlur={loadInventarios}
                      placeholder="Etiqueta"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_warehouse_inventario" className="small">Almacén</Label>
                    <Input
                      id="filtro_warehouse_inventario"
                      type="text"
                      value={fWarehouse}
                      onChange={(e) => setFWarehouse(e.target.value)}
                      onBlur={loadInventarios}
                      placeholder="Almacén"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_product_inventario" className="small">Producto</Label>
                    <Input
                      id="filtro_product_inventario"
                      type="text"
                      value={fProduct}
                      onChange={(e) => setFProduct(e.target.value)}
                      onBlur={loadInventarios}
                      placeholder="Cantidad"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_status_inventario" className="small">Estado</Label>
                    <Input
                      id="filtro_status_inventario"
                      type="select"
                      value={fStatus}
                      onChange={(e) => setFStatus(e.target.value)}
                      onBlur={loadInventarios}
                      bsSize="sm"
                    >
                      <option value="">Todos</option>
                      <option value="ABIERTO">ABIERTO</option>
                      <option value="BORRADOR">BORRADOR</option>
                      <option value="CERRADO">CERRADO</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button color="secondary" size="sm" outline onClick={limpiarFiltros}>
                    Limpiar filtros
                  </Button>
                </Col>
              </Row>

              {!puedeVerListado && scope === 'GLOBAL' && (
                <Alert color="info" className="mb-3">
                  Seleccione una empresa para cargar el listado.
                </Alert>
              )}

              <div className="grid-container">
                <ReactTable
                  data={filteredRows}
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
                  noDataText={loading || queryLoading ? 'Cargando…' : 'No se encontraron registros'}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Inventarios;

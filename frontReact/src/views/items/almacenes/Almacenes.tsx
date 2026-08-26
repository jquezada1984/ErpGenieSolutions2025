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
  query GetEmpresasAlmacenListado {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

const ALMACENES_LISTADO = gql`
  query AlmacenesListado(
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
      id_empresa
      almacen_ref
      nombre
      poblacion
      id_pais
      pais
      id_provincia
      provincia
      telefono
      estado
    }
  }
`;

const ACTUALIZAR_ESTADO_ALMACEN = gql`
  mutation ActualizarEstadoAlmacen($id_almacen: ID!, $estado: Boolean!, $id_empresa: ID!) {
    actualizarEstadoAlmacen(id_almacen: $id_almacen, estado: $estado, id_empresa: $id_empresa)
  }
`;

type AlmacenRow = {
  id_almacen: string;
  id_empresa: string;
  almacen_ref: string;
  nombre: string;
  poblacion: string;
  pais: string;
  provincia: string;
  telefono: string;
  estado: boolean;
};

/**
 * Listado de almacenes — datos reales vía Gateway → almacenesListado → AlmacenNestJs.
 */
const Almacenes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa || '';

  const [selectedIdEmpresa, setSelectedIdEmpresa] = useState<string>('');
  const [rows, setRows] = useState<AlmacenRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [fRef, setFRef] = useState('');
  const [fNombre, setFNombre] = useState('');
  const [fCiudad, setFCiudad] = useState('');
  const [fPais, setFPais] = useState('');
  const [fProvincia, setFProvincia] = useState('');
  const [fEstado, setFEstado] = useState('');

  const [getAlmacenes, { loading: queryLoading }] = useLazyQuery(ALMACENES_LISTADO, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });
  const [mutateEstadoAlmacen] = useMutation(ACTUALIZAR_ESTADO_ALMACEN, {
    errorPolicy: 'all',
  });

  const { data: empresasData } = useQuery(GET_EMPRESAS, { skip: scope !== 'GLOBAL' });
  const empresas = empresasData?.empresas || [];

  const idEmpresaActiva = scope === 'GLOBAL' ? selectedIdEmpresa : idEmpresaUsuario;

  const loadAlmacenes = useCallback(async () => {
    if (!idEmpresaActiva) {
      setRows([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let estadoVar: boolean | null = null;
      if (fEstado === 'activo') estadoVar = true;
      else if (fEstado === 'inactivo') estadoVar = false;

      const res = await getAlmacenes({
        variables: {
          id_empresa: idEmpresaActiva,
          // País/Provincia UI son texto (legacy): no enviar UUID inventados.
          // Mejora futura: SelectPais / SelectProvincia → id_pais / id_provincia.
          id_pais: null,
          id_provincia: null,
          poblacion: fCiudad.trim() || null,
          almacen_ref: fRef.trim() || null,
          nombre: fNombre.trim() || null,
          estado: estadoVar,
        },
      });

      if (res.error?.message) {
        setError(res.error.message);
      }

      const raw = (res.data?.almacenesListado || []) as Array<{
        id_almacen: string;
        id_empresa?: string | null;
        almacen_ref?: string | null;
        nombre?: string | null;
        poblacion?: string | null;
        pais?: string | null;
        provincia?: string | null;
        telefono?: string | null;
        estado?: boolean | null;
      }>;

      const mapped = raw.map((r) => ({
        id_almacen: String(r.id_almacen),
        id_empresa: String(r.id_empresa || idEmpresaActiva),
        almacen_ref: r.almacen_ref || '',
        nombre: r.nombre || '',
        poblacion: r.poblacion || '',
        pais: r.pais || '',
        provincia: r.provincia || '',
        telefono: r.telefono || '',
        estado: r.estado !== false,
      }));

      setRows(mapped);
    } catch (e: unknown) {
      setRows([]);
      setError(e instanceof Error ? e.message : 'Error al cargar almacenes');
    } finally {
      setLoading(false);
    }
  }, [
    idEmpresaActiva,
    getAlmacenes,
    fRef,
    fNombre,
    fCiudad,
    fEstado,
  ]);

  useEffect(() => {
    if (location.pathname !== '/items/almacenes') return;
    if (scope === 'EMPRESA' && idEmpresaUsuario) {
      loadAlmacenes();
    } else if (scope === 'GLOBAL' && selectedIdEmpresa) {
      loadAlmacenes();
    } else if (scope === 'GLOBAL' && !selectedIdEmpresa) {
      setRows([]);
    }
  }, [location.pathname, scope, idEmpresaUsuario, selectedIdEmpresa, loadAlmacenes]);

  /** País/Provincia: filtro local por nombre (texto) hasta tener selects UUID. */
  const filteredRows = useMemo(() => {
    const pais = fPais.trim().toLowerCase();
    const provincia = fProvincia.trim().toLowerCase();
    if (!pais && !provincia) return rows;
    return rows.filter((r) => {
      if (pais && !(r.pais || '').toLowerCase().includes(pais)) return false;
      if (provincia && !(r.provincia || '').toLowerCase().includes(provincia)) return false;
      return true;
    });
  }, [rows, fPais, fProvincia]);

  const limpiarFiltros = () => {
    setFRef('');
    setFNombre('');
    setFCiudad('');
    setFPais('');
    setFProvincia('');
    setFEstado('');
  };

  /** Toggle estado — patrón Inventarios (optimistic + rollback + refetch). */
  const handleToggleEstado = (row: AlmacenRow) => {
    if (!idEmpresaActiva) {
      setError('Debe seleccionar empresa');
      return;
    }
    const estadoAnterior = !!row.estado;
    const estadoNuevo = !estadoAnterior;

    setRows((prev) =>
      prev.map((r) => (r.id_almacen === row.id_almacen ? { ...r, estado: estadoNuevo } : r)),
    );

    void (async () => {
      try {
        setError(null);
        setSuccess(null);
        const { data, errors } = await mutateEstadoAlmacen({
          variables: {
            id_almacen: row.id_almacen,
            estado: estadoNuevo,
            id_empresa: idEmpresaActiva,
          },
        });
        if (errors?.length) {
          throw new Error(errors.map((e) => e.message).join(' | '));
        }
        if (data?.actualizarEstadoAlmacen === false) {
          throw new Error('No se pudo actualizar el estado del almacén.');
        }
        setSuccess('Estado de almacén actualizado correctamente.');
        await loadAlmacenes();
      } catch (e: unknown) {
        setRows((prev) =>
          prev.map((r) => (r.id_almacen === row.id_almacen ? { ...r, estado: estadoAnterior } : r)),
        );
        setError(e instanceof Error ? e.message : 'Error al actualizar el estado del almacén');
      }
    })();
  };

  const columns = [
    {
      Header: 'País',
      accessor: 'pais',
      Cell: ({ value }: { value: string }) => value || '—',
      filterable: false,
    },
    {
      Header: 'Provincia',
      accessor: 'provincia',
      Cell: ({ value }: { value: string }) => value || '—',
      filterable: false,
    },
    {
      Header: 'Ciudad / Población',
      accessor: 'poblacion',
      Cell: ({ value }: { value: string }) => value || '—',
      filterable: false,
    },
    {
      Header: 'Referencia',
      accessor: 'almacen_ref',
      Cell: ({ value }: { value: string }) => value || '—',
      filterable: false,
    },
    {
      Header: 'Nombre',
      accessor: 'nombre',
      Cell: ({ value }: { value: string }) => value || '—',
      filterable: false,
    },
    {
      Header: 'Teléfono',
      accessor: 'telefono',
      Cell: ({ value }: { value: string }) => value || '—',
      filterable: false,
    },
    {
      Header: 'Estado',
      accessor: 'estado',
      Cell: ({ value }: { value: boolean }) => (
        <Badge color={value ? 'success' : 'danger'}>{value ? 'Activo' : 'Inactivo'}</Badge>
      ),
      filterable: false,
      width: 100,
    },
    {
      Header: 'Acciones',
      accessor: 'id_almacen',
      sortable: false,
      filterable: false,
      width: 130,
      Cell: ({ original }: { original: AlmacenRow }) => (
        <div className="d-flex align-items-center justify-content-center gap-1">
          <Button
            color={original.estado ? 'info' : 'secondary'}
            size="sm"
            className="me-1"
            title={
              original.estado
                ? 'Editar almacén'
                : 'Almacén inactivo: no se puede editar'
            }
            disabled={!original.estado}
            onClick={() => {
              if (!original.estado) return;
              const idEmpresaNav =
                String(original.id_empresa || idEmpresaActiva || '').trim();
              navigate(
                `/items/almacenes/editar/${encodeURIComponent(original.id_almacen)}`,
                idEmpresaNav ? { state: { id_empresa: idEmpresaNav } } : undefined,
              );
            }}
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
                  Almacenes
                </CardTitle>
                <div className="grid-actions">
                  <Button
                    color="primary"
                    className="grid-primary-button"
                    onClick={() => navigate('/items/almacenes/nuevo')}
                  >
                    <i className="bi bi-plus-circle me-2" />
                    Nuevo almacén
                  </Button>
                </div>
              </div>

              {scope === 'GLOBAL' && (
                <FormGroup className="mb-3">
                  <Label for="id_empresa_listado_almacenes">Empresa</Label>
                  <SelectEmpresa
                    value={selectedIdEmpresa || null}
                    onChange={(val) => setSelectedIdEmpresa(val ?? '')}
                    empresas={empresas}
                    placeholder="Seleccione una empresa para ver los almacenes"
                  />
                </FormGroup>
              )}

              {scope === 'GLOBAL' && !selectedIdEmpresa && (
                <Alert color="info" className="mb-3">
                  Seleccione una empresa para ver los almacenes
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
                    <Label for="filtro_pais_almacen" className="small">
                      País
                    </Label>
                    <Input
                      id="filtro_pais_almacen"
                      type="text"
                      value={fPais}
                      onChange={(e) => setFPais(e.target.value)}
                      placeholder="País"
                      bsSize="sm"
                      title="Filtro local por nombre. Mejora futura: select UUID."
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_provincia_almacen" className="small">
                      Provincia
                    </Label>
                    <Input
                      id="filtro_provincia_almacen"
                      type="text"
                      value={fProvincia}
                      onChange={(e) => setFProvincia(e.target.value)}
                      placeholder="Provincia"
                      bsSize="sm"
                      title="Filtro local por nombre. Mejora futura: select UUID."
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_ciudad_almacen" className="small">
                      Ciudad
                    </Label>
                    <Input
                      id="filtro_ciudad_almacen"
                      type="text"
                      value={fCiudad}
                      onChange={(e) => setFCiudad(e.target.value)}
                      onBlur={loadAlmacenes}
                      placeholder="Ciudad"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_ref_almacen" className="small">
                      Referencia
                    </Label>
                    <Input
                      id="filtro_ref_almacen"
                      type="text"
                      value={fRef}
                      onChange={(e) => setFRef(e.target.value)}
                      onBlur={loadAlmacenes}
                      placeholder="Referencia"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_nombre_almacen" className="small">
                      Nombre
                    </Label>
                    <Input
                      id="filtro_nombre_almacen"
                      type="text"
                      value={fNombre}
                      onChange={(e) => setFNombre(e.target.value)}
                      onBlur={loadAlmacenes}
                      placeholder="Nombre"
                      bsSize="sm"
                    />
                  </FormGroup>
                </Col>
                <Col md={1}>
                  <FormGroup className="mb-2 mb-md-0">
                    <Label for="filtro_estado_almacen" className="small">
                      Estado
                    </Label>
                    <Input
                      id="filtro_estado_almacen"
                      type="select"
                      value={fEstado}
                      onChange={(e) => setFEstado(e.target.value)}
                      onBlur={loadAlmacenes}
                      bsSize="sm"
                    >
                      <option value="">Todos</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={1} className="d-flex align-items-end">
                  <Button
                    color="secondary"
                    size="sm"
                    outline
                    onClick={() => {
                      limpiarFiltros();
                    }}
                  >
                    Limpiar
                  </Button>
                </Col>
              </Row>

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
                  noDataText={
                    loading || queryLoading ? 'Cargando…' : 'No se encontraron registros'
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

export default Almacenes;

import React, { useCallback, useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
} from 'reactstrap';
import {
  actualizarCuentaContable,
  patchActivoCuentaContable,
} from '../../_apis_/contabilidad';

const PAGE_SIZE_OPTS = [
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
  { value: 100, label: '100 por página' },
  { value: 2000, label: 'Todos (completo)' },
];

const GET_MODELOS = gql`
  query GetModelosPlanesCuentas {
    modelosPlanesContables {
      id_modelo_plan_contable
      codigo
      nombre
      id_plan_plantilla
      pais {
        codigo_iso
      }
    }
  }
`;

const GET_CUENTAS = gql`
  query GetCuentasPorPlan($id_plan_contable: String!, $page: Int, $limit: Int, $busqueda: String) {
    cuentasContablesPorPlan(
      id_plan_contable: $id_plan_contable
      page: $page
      limit: $limit
      busqueda: $busqueda
    ) {
      items {
        id_cuenta_contable
        codigo
        nombre
        etiqueta_corta
        codigo_padre
        tipo_cuenta
        estado
      }
      total
      page
      limit
      totalPages
    }
  }
`;

const ListadoCuentasContables: React.FC = () => {
  const [idModelo, setIdModelo] = useState('');
  const [idPlan, setIdPlan] = useState('');
  const [planLabel, setPlanLabel] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2000);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaActiva, setBusquedaActiva] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<Record<string, unknown> | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [autoCargado, setAutoCargado] = useState(false);

  const { data: modelosData, loading: loadingModelos } = useQuery(GET_MODELOS);
  const modelos = modelosData?.modelosPlanesContables || [];

  const { data, loading, error, refetch } = useQuery(GET_CUENTAS, {
    variables: {
      id_plan_contable: idPlan,
      page,
      limit: pageSize,
      busqueda: busquedaActiva || undefined,
    },
    skip: !idPlan,
    fetchPolicy: 'network-only',
  });

  const paginado = data?.cuentasContablesPorPlan;
  const cuentas = paginado?.items || [];

  const aplicarModelo = useCallback((modeloId: string) => {
    const m = modelos.find(
      (x: { id_modelo_plan_contable: string }) => x.id_modelo_plan_contable === modeloId,
    );
    if (!m?.id_plan_plantilla) {
      setMensaje('El modelo seleccionado no tiene plan plantilla cargado. Ejecute la migración 08_seed.');
      return false;
    }
    setIdPlan(m.id_plan_plantilla);
    const iso = m.pais?.codigo_iso || '';
    setPlanLabel(`${m.codigo} - ${m.nombre} - (${iso})`);
    setPage(1);
    setMensaje(null);
    return true;
  }, [modelos]);

  useEffect(() => {
    if (modelos.length && !idModelo) {
      const ec = modelos.find((m: { codigo: string }) => m.codigo === 'EC-SUPERCIAS') || modelos[0];
      setIdModelo(ec.id_modelo_plan_contable);
    }
  }, [modelos, idModelo]);

  useEffect(() => {
    if (!autoCargado && idModelo && modelos.length) {
      aplicarModelo(idModelo);
      setAutoCargado(true);
    }
  }, [autoCargado, idModelo, modelos, aplicarModelo]);

  const handleCargar = () => {
    if (idModelo) aplicarModelo(idModelo);
  };

  const toggleActivo = async (id: string, activo: boolean) => {
    try {
      await patchActivoCuentaContable(id, !activo);
      await refetch();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error');
    }
  };

  const abrirEditar = (row: Record<string, unknown>) => {
    setEditRow(row);
    setEditNombre(String(row.nombre || ''));
    setModalOpen(true);
  };

  const guardarEditar = async () => {
    if (!editRow) return;
    setGuardando(true);
    try {
      await actualizarCuentaContable(String(editRow.id_cuenta_contable), { nombre: editNombre });
      setModalOpen(false);
      await refetch();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error');
    } finally {
      setGuardando(false);
    }
  };

  const mostrarPaginacion = paginado && paginado.totalPages > 1 && pageSize < 2000;

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">
          Listado de cuentas contables
          {paginado ? ` (${paginado.total})` : ''}
        </CardTitle>
        {mensaje && <Alert color="warning">{mensaje}</Alert>}
        {error && <Alert color="danger">Error al cargar cuentas</Alert>}

        <div className="row g-2 align-items-end mb-3">
          <FormGroup className="col-md-6">
            <Label>Plan contable</Label>
            <Input
              type="select"
              value={idModelo}
              onChange={(e) => setIdModelo(e.target.value)}
              disabled={loadingModelos}
            >
              {modelos.map((m: {
                id_modelo_plan_contable: string;
                codigo: string;
                nombre: string;
                pais?: { codigo_iso: string };
              }) => (
                <option key={m.id_modelo_plan_contable} value={m.id_modelo_plan_contable}>
                  {m.codigo} - {m.nombre} - ({m.pais?.codigo_iso || ''})
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup className="col-md-3">
            <Label>Registros</Label>
            <Input
              type="select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {PAGE_SIZE_OPTS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Input>
          </FormGroup>
          <div className="col-md-3">
            <Button color="primary" onClick={handleCargar} disabled={loadingModelos}>
              CAMBIAR Y CARGAR
            </Button>
          </div>
        </div>

        {planLabel && (
          <p className="text-muted small mb-2">Plan activo: {planLabel}</p>
        )}

        {idPlan && (
          <div className="row g-2 mb-3 align-items-end">
            <FormGroup className="col-md-6">
              <Input
                placeholder="Buscar por código o etiqueta..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setBusquedaActiva(busqueda);
                    setPage(1);
                  }
                }}
              />
            </FormGroup>
            <div className="col-md-2">
              <Button
                color="secondary"
                outline
                onClick={() => { setBusquedaActiva(busqueda); setPage(1); }}
              >
                Buscar
              </Button>
            </div>
            <div className="col-md-2">
              <Button
                color="light"
                onClick={() => { setBusqueda(''); setBusquedaActiva(''); setPage(1); }}
              >
                Limpiar
              </Button>
            </div>
          </div>
        )}

        {(loading || loadingModelos) && <Spinner />}
        {!loading && idPlan && (
          <>
            <Table responsive hover size="sm">
              <thead>
                <tr>
                  <th>Número de cuenta</th>
                  <th>Etiqueta</th>
                  <th>Etiqueta corta</th>
                  <th>Cuenta padre</th>
                  <th>Grupo de cuenta</th>
                  <th>Activado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cuentas.map((c: {
                  id_cuenta_contable: string;
                  codigo: string;
                  nombre: string;
                  etiqueta_corta: string | null;
                  codigo_padre: string | null;
                  tipo_cuenta: string;
                  estado: boolean;
                }) => (
                  <tr key={c.id_cuenta_contable}>
                    <td>{c.codigo}</td>
                    <td>{c.nombre}</td>
                    <td>{c.etiqueta_corta || ''}</td>
                    <td>{c.codigo_padre || ''}</td>
                    <td>{c.tipo_cuenta}</td>
                    <td>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={c.estado}
                          onChange={() => toggleActivo(c.id_cuenta_contable, c.estado)}
                        />
                      </div>
                    </td>
                    <td>
                      <Button size="sm" color="link" onClick={() => abrirEditar(c)}>Editar</Button>
                    </td>
                  </tr>
                ))}
                {cuentas.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
                      Sin cuentas para este plan
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {mostrarPaginacion && (
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  Página {paginado.page} de {paginado.totalPages} ({paginado.limit} por página)
                </span>
                <div>
                  <Button
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Anterior
                  </Button>{' '}
                  <Button
                    size="sm"
                    disabled={page >= paginado.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}

            {paginado && pageSize >= 2000 && (
              <p className="text-muted small mt-2 mb-0">
                Mostrando las {paginado.total} cuentas del plan completo.
              </p>
            )}
          </>
        )}
      </CardBody>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalHeader toggle={() => setModalOpen(false)}>Editar cuenta</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Etiqueta</Label>
            <Input value={editNombre} onChange={(e) => setEditNombre(e.target.value)} />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={guardarEditar} disabled={guardando}>Guardar</Button>
          <Button color="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
};

export default ListadoCuentasContables;

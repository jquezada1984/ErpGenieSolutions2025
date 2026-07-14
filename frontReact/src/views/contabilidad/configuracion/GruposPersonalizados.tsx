import React, { useMemo, useState } from 'react';
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
import useJwtPayload from '../../../hooks/useJwtPayload';
import {
  listarGruposCuentas,
  crearGrupoCuentas,
  actualizarGrupoCuentas,
  eliminarGrupoCuentas,
  asignarCuentasGrupo,
} from '../../../_apis_/contabilidad';

const GET_PLAN = gql`
  query PlanGrupos($id_empresa: String!) {
    planContableActivo(id_empresa: $id_empresa) {
      id_plan_contable
    }
    gruposCuentaPersonalizado(id_empresa: $id_empresa) {
      id_grupo_cuenta_personalizado
      nombre
      codigo
      etiqueta
      posicion
    }
  }
`;

const GET_CUENTAS = gql`
  query CuentasPlanGrupos($id_plan_contable: String!) {
    cuentasContablesPorPlan(id_plan_contable: $id_plan_contable, page: 1, limit: 5000) {
      items {
        id_cuenta_contable
        codigo
        nombre
      }
    }
  }
`;

type GrupoRow = {
  id_grupo_cuenta_personalizado: string;
  nombre: string;
  codigo: string | null;
  etiqueta: string | null;
  posicion: number | null;
  ids_cuentas_contables?: string[];
};

const GruposPersonalizados: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);
  const [grupos, setGrupos] = useState<GrupoRow[]>([]);
  const [loadingLista, setLoadingLista] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [modalGrupo, setModalGrupo] = useState(false);
  const [modalCuentas, setModalCuentas] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [grupoCuentasId, setGrupoCuentasId] = useState<string | null>(null);
  const [cuentasSel, setCuentasSel] = useState<string[]>([]);
  const [form, setForm] = useState({ nombre: '', codigo: '', etiqueta: '', posicion: '0' });

  const { data, loading, error, refetch } = useQuery(GET_PLAN, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const idPlan = data?.planContableActivo?.id_plan_contable || '';
  const { data: cuentasData } = useQuery(GET_CUENTAS, {
    variables: { id_plan_contable: idPlan },
    skip: !idPlan,
  });
  const cuentas = cuentasData?.cuentasContablesPorPlan?.items || [];

  const cargarGrupos = async () => {
    setLoadingLista(true);
    try {
      const rows = await listarGruposCuentas();
      setGrupos(Array.isArray(rows) ? rows : []);
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error al listar grupos');
    } finally {
      setLoadingLista(false);
    }
  };

  React.useEffect(() => {
    if (idEmpresa) cargarGrupos();
  }, [idEmpresa, data?.gruposCuentaPersonalizado]);

  const abrirNuevo = () => {
    setEditId(null);
    setForm({ nombre: '', codigo: '', etiqueta: '', posicion: '0' });
    setModalGrupo(true);
  };

  const abrirEditar = (g: GrupoRow) => {
    setEditId(g.id_grupo_cuenta_personalizado);
    setForm({
      nombre: g.nombre,
      codigo: g.codigo || '',
      etiqueta: g.etiqueta || '',
      posicion: String(g.posicion ?? 0),
    });
    setModalGrupo(true);
  };

  const guardarGrupo = async () => {
    setGuardando(true);
    setMensaje(null);
    try {
      const payload = {
        nombre: form.nombre,
        codigo: form.codigo || null,
        etiqueta: form.etiqueta || null,
        posicion: Number(form.posicion) || 0,
      };
      if (editId) {
        await actualizarGrupoCuentas(editId, payload);
      } else {
        await crearGrupoCuentas(payload);
      }
      setModalGrupo(false);
      await cargarGrupos();
      await refetch();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error');
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id: string) => {
    if (!window.confirm('¿Eliminar grupo?')) return;
    try {
      await eliminarGrupoCuentas(id);
      await cargarGrupos();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error');
    }
  };

  const abrirAsignar = (g: GrupoRow) => {
    setGrupoCuentasId(g.id_grupo_cuenta_personalizado);
    setCuentasSel(g.ids_cuentas_contables || []);
    setModalCuentas(true);
  };

  const guardarCuentas = async () => {
    if (!grupoCuentasId) return;
    setGuardando(true);
    try {
      await asignarCuentasGrupo(grupoCuentasId, cuentasSel);
      setModalCuentas(false);
      await cargarGrupos();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error');
    } finally {
      setGuardando(false);
    }
  };

  const toggleCuenta = (id: string) => {
    setCuentasSel((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const displayGrupos = grupos.length ? grupos : (data?.gruposCuentaPersonalizado || []);

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <CardTitle tag="h4" className="mb-0">Grupos de cuentas personalizados</CardTitle>
          <Button color="primary" onClick={abrirNuevo}>Nuevo grupo</Button>
        </div>
        {mensaje && <Alert color="warning">{mensaje}</Alert>}
        {error && <Alert color="danger">Error al cargar</Alert>}
        {(loading || loadingLista) && <Spinner />}

        {!loading && (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Etiqueta</th>
                <th>Posición</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {displayGrupos.map((g: GrupoRow) => (
                <tr key={g.id_grupo_cuenta_personalizado}>
                  <td>{g.codigo || '—'}</td>
                  <td>{g.nombre}</td>
                  <td>{g.etiqueta || '—'}</td>
                  <td>{g.posicion ?? 0}</td>
                  <td>
                    <Button size="sm" color="link" onClick={() => abrirEditar(g)}>Editar</Button>
                    <Button size="sm" color="link" onClick={() => abrirAsignar(g)}>Cuentas</Button>
                    <Button size="sm" color="link" className="text-danger" onClick={() => eliminar(g.id_grupo_cuenta_personalizado)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
              {displayGrupos.length === 0 && (
                <tr><td colSpan={5} className="text-center text-muted">Sin grupos</td></tr>
              )}
            </tbody>
          </Table>
        )}

        <Modal isOpen={modalGrupo} toggle={() => setModalGrupo(false)}>
          <ModalHeader toggle={() => setModalGrupo(false)}>
            {editId ? 'Editar grupo' : 'Nuevo grupo'}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Nombre</Label>
              <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </FormGroup>
            <FormGroup>
              <Label>Código</Label>
              <Input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Etiqueta</Label>
              <Input value={form.etiqueta} onChange={(e) => setForm({ ...form, etiqueta: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Posición</Label>
              <Input type="number" value={form.posicion} onChange={(e) => setForm({ ...form, posicion: e.target.value })} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" disabled={guardando} onClick={guardarGrupo}>Guardar</Button>
            <Button color="secondary" onClick={() => setModalGrupo(false)}>Cancelar</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalCuentas} toggle={() => setModalCuentas(false)} size="lg">
          <ModalHeader toggle={() => setModalCuentas(false)}>Asignar cuentas al grupo</ModalHeader>
          <ModalBody style={{ maxHeight: 400, overflowY: 'auto' }}>
            {cuentas.map((c: { id_cuenta_contable: string; codigo: string; nombre: string }) => (
              <FormGroup check key={c.id_cuenta_contable}>
                <Label check>
                  <Input
                    type="checkbox"
                    checked={cuentasSel.includes(c.id_cuenta_contable)}
                    onChange={() => toggleCuenta(c.id_cuenta_contable)}
                  />
                  {c.codigo} — {c.nombre}
                </Label>
              </FormGroup>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" disabled={guardando} onClick={guardarCuentas}>Guardar</Button>
            <Button color="secondary" onClick={() => setModalCuentas(false)}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default GruposPersonalizados;

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
  crearCuentaImpuesto,
  actualizarCuentaImpuesto,
  eliminarCuentaImpuesto,
} from '../../../_apis_/contabilidad';

const GET_DATA = gql`
  query CuentasImpuestoData($id_empresa: String!) {
    cuentasImpuesto(id_empresa: $id_empresa) {
      id_cuenta_impuesto
      tipo_impuesto
      porcentaje
      id_cuenta_contable
      cuenta_codigo
      cuenta_nombre
    }
    planContableActivo(id_empresa: $id_empresa) {
      id_plan_contable
    }
  }
`;

const GET_CUENTAS = gql`
  query CuentasPlanImpuesto($id_plan_contable: String!) {
    cuentasContablesPorPlan(id_plan_contable: $id_plan_contable, page: 1, limit: 5000) {
      items {
        id_cuenta_contable
        codigo
        nombre
      }
    }
  }
`;

const TIPOS_IMPUESTO = [
  { value: 'RETENCION_FUENTE', label: 'Retención en la fuente' },
  { value: 'RETENCION_IVA', label: 'Retención IVA' },
  { value: 'ICE', label: 'ICE' },
  { value: 'OTRO', label: 'Otro' },
];

const CuentasImpuestos: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ tipo_impuesto: 'RETENCION_FUENTE', porcentaje: '1', id_cuenta_contable: '' });

  const { data, loading, error, refetch } = useQuery(GET_DATA, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const idPlan = data?.planContableActivo?.id_plan_contable || '';
  const { data: cuentasData } = useQuery(GET_CUENTAS, {
    variables: { id_plan_contable: idPlan },
    skip: !idPlan,
  });

  const filas = data?.cuentasImpuesto || [];
  const cuentas = cuentasData?.cuentasContablesPorPlan?.items || [];

  const abrirNuevo = () => {
    setEditId(null);
    setForm({ tipo_impuesto: 'RETENCION_FUENTE', porcentaje: '1', id_cuenta_contable: '' });
    setModalOpen(true);
  };

  const abrirEditar = (row: {
    id_cuenta_impuesto: string;
    tipo_impuesto: string;
    porcentaje: number;
    id_cuenta_contable: string;
  }) => {
    setEditId(row.id_cuenta_impuesto);
    setForm({
      tipo_impuesto: row.tipo_impuesto,
      porcentaje: String(row.porcentaje),
      id_cuenta_contable: row.id_cuenta_contable,
    });
    setModalOpen(true);
  };

  const guardar = async () => {
    setGuardando(true);
    setMensaje(null);
    try {
      const payload = {
        tipo_impuesto: form.tipo_impuesto,
        porcentaje: Number(form.porcentaje),
        id_cuenta_contable: form.id_cuenta_contable,
      };
      if (editId) {
        await actualizarCuentaImpuesto(editId, payload);
      } else {
        await crearCuentaImpuesto(payload);
      }
      setModalOpen(false);
      await refetch();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error');
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id: string) => {
    if (!window.confirm('¿Eliminar este impuesto?')) return;
    try {
      await eliminarCuentaImpuesto(id);
      await refetch();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error');
    }
  };

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <CardTitle tag="h4" className="mb-0">Cuentas de impuestos</CardTitle>
          <Button color="primary" onClick={abrirNuevo}>Añadir</Button>
        </div>
        {mensaje && <Alert color="warning">{mensaje}</Alert>}
        {error && <Alert color="danger">Error al cargar</Alert>}
        {loading && <Spinner />}

        {!loading && (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Tipo impuesto</th>
                <th>%</th>
                <th>Cuenta contable</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((r: {
                id_cuenta_impuesto: string;
                tipo_impuesto: string;
                porcentaje: number;
                cuenta_codigo: string | null;
                cuenta_nombre: string | null;
              }) => (
                <tr key={r.id_cuenta_impuesto}>
                  <td>{TIPOS_IMPUESTO.find((t) => t.value === r.tipo_impuesto)?.label || r.tipo_impuesto}</td>
                  <td>{r.porcentaje}%</td>
                  <td>{r.cuenta_codigo ? `${r.cuenta_codigo} — ${r.cuenta_nombre}` : '—'}</td>
                  <td>
                    <Button size="sm" color="link" onClick={() => abrirEditar(r)}>Editar</Button>
                    <Button size="sm" color="link" className="text-danger" onClick={() => eliminar(r.id_cuenta_impuesto)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
              {filas.length === 0 && (
                <tr><td colSpan={4} className="text-center text-muted">Sin registros</td></tr>
              )}
            </tbody>
          </Table>
        )}

        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
          <ModalHeader toggle={() => setModalOpen(false)}>
            {editId ? 'Editar impuesto' : 'Nuevo impuesto'}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Tipo</Label>
              <Input type="select" value={form.tipo_impuesto} onChange={(e) => setForm({ ...form, tipo_impuesto: e.target.value })}>
                {TIPOS_IMPUESTO.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Porcentaje</Label>
              <Input type="number" step="0.01" value={form.porcentaje} onChange={(e) => setForm({ ...form, porcentaje: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Cuenta contable</Label>
              <Input type="select" value={form.id_cuenta_contable} onChange={(e) => setForm({ ...form, id_cuenta_contable: e.target.value })}>
                <option value="">— Seleccionar —</option>
                {cuentas.map((c: { id_cuenta_contable: string; codigo: string; nombre: string }) => (
                  <option key={c.id_cuenta_contable} value={c.id_cuenta_contable}>{c.codigo} — {c.nombre}</option>
                ))}
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" disabled={guardando} onClick={guardar}>Guardar</Button>
            <Button color="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default CuentasImpuestos;

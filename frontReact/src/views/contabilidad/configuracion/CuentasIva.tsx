import React, { useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Form,
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
  crearCuentaIva,
  actualizarCuentaIva,
  eliminarCuentaIva,
} from '../../../_apis_/contabilidad';

const GET_DATA = gql`
  query CuentasIvaData($id_empresa: String!) {
    cuentasIva(id_empresa: $id_empresa) {
      id_cuenta_iva
      tipo_iva
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
  query CuentasPlanIva($id_plan_contable: String!) {
    cuentasContablesPorPlan(id_plan_contable: $id_plan_contable, page: 1, limit: 5000) {
      items {
        id_cuenta_contable
        codigo
        nombre
      }
    }
  }
`;

const TIPOS_IVA = [
  { value: 'IVA_VENTA', label: 'IVA ventas' },
  { value: 'IVA_COMPRA', label: 'IVA compras' },
  { value: 'IVA_PAGO', label: 'IVA pago' },
];

const CuentasIva: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ tipo_iva: 'IVA_VENTA', porcentaje: '12', id_cuenta_contable: '' });

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

  const filas = data?.cuentasIva || [];
  const cuentas = cuentasData?.cuentasContablesPorPlan?.items || [];

  const abrirNuevo = () => {
    setEditId(null);
    setForm({ tipo_iva: 'IVA_VENTA', porcentaje: '12', id_cuenta_contable: '' });
    setModalOpen(true);
  };

  const abrirEditar = (row: {
    id_cuenta_iva: string;
    tipo_iva: string;
    porcentaje: number;
    id_cuenta_contable: string;
  }) => {
    setEditId(row.id_cuenta_iva);
    setForm({
      tipo_iva: row.tipo_iva,
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
        tipo_iva: form.tipo_iva,
        porcentaje: Number(form.porcentaje),
        id_cuenta_contable: form.id_cuenta_contable,
      };
      if (editId) {
        await actualizarCuentaIva(editId, payload);
      } else {
        await crearCuentaIva(payload);
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
    if (!window.confirm('¿Eliminar esta cuenta de IVA?')) return;
    try {
      await eliminarCuentaIva(id);
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
          <CardTitle tag="h4" className="mb-0">Cuentas de tasas de IVA</CardTitle>
          <Button color="primary" onClick={abrirNuevo}>Añadir</Button>
        </div>
        {mensaje && <Alert color="warning">{mensaje}</Alert>}
        {error && <Alert color="danger">Error al cargar</Alert>}
        {loading && <Spinner />}

        {!loading && (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>%</th>
                <th>Cuenta contable</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((r: {
                id_cuenta_iva: string;
                tipo_iva: string;
                porcentaje: number;
                cuenta_codigo: string | null;
                cuenta_nombre: string | null;
              }) => (
                <tr key={r.id_cuenta_iva}>
                  <td>{TIPOS_IVA.find((t) => t.value === r.tipo_iva)?.label || r.tipo_iva}</td>
                  <td>{r.porcentaje}%</td>
                  <td>{r.cuenta_codigo ? `${r.cuenta_codigo} — ${r.cuenta_nombre}` : '—'}</td>
                  <td>
                    <Button size="sm" color="link" onClick={() => abrirEditar(r)}>Editar</Button>
                    <Button size="sm" color="link" className="text-danger" onClick={() => eliminar(r.id_cuenta_iva)}>Eliminar</Button>
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
            {editId ? 'Editar cuenta IVA' : 'Nueva cuenta IVA'}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Tipo IVA</Label>
              <Input type="select" value={form.tipo_iva} onChange={(e) => setForm({ ...form, tipo_iva: e.target.value })}>
                {TIPOS_IVA.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
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

export default CuentasIva;

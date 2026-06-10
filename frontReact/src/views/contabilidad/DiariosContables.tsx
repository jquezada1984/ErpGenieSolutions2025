import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import useJwtPayload from '../../hooks/useJwtPayload';
import {
  crearDiarioContable,
  actualizarDiarioContable,
  patchActivoDiarioContable,
  eliminarDiarioContable,
  inicializarDiariosContablesDefecto,
} from '../../_apis_/contabilidad';
import { TIPOS_DIARIO, labelTipoDiario } from './constants/tiposDiario';

const GET_DIARIOS = gql`
  query GetDiariosContables($id_empresa: String!) {
    diariosContables(id_empresa: $id_empresa) {
      id_diario_contable
      codigo
      nombre
      tipo_diario
      tipo_diario_label
      estado
    }
  }
`;

const DiariosContables: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);

  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipoDiario, setTipoDiario] = useState('OPERACIONES_VARIAS');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<Record<string, unknown> | null>(null);
  const [editForm, setEditForm] = useState({ codigo: '', nombre: '', tipo_diario: 'OPERACIONES_VARIAS' });
  const [guardando, setGuardando] = useState(false);
  const inicializadoRef = useRef(false);

  const { data, loading, error, refetch } = useQuery(GET_DIARIOS, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const diarios = data?.diariosContables || [];

  useEffect(() => {
    if (!idEmpresa || loading || inicializadoRef.current) return;
    if (diarios.length > 0) {
      inicializadoRef.current = true;
      return;
    }
    inicializadoRef.current = true;
    inicializarDiariosContablesDefecto()
      .then(() => refetch())
      .catch((err: unknown) => {
        const ex = err as { response?: { data?: unknown }; message?: string };
        setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error al inicializar diarios');
      });
  }, [idEmpresa, loading, diarios.length, refetch]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    try {
      await crearDiarioContable({ codigo, nombre, tipo_diario: tipoDiario });
      setCodigo('');
      setNombre('');
      setTipoDiario('OPERACIONES_VARIAS');
      await refetch();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error');
    } finally {
      setGuardando(false);
    }
  };

  const toggleActivo = async (id: string, activo: boolean) => {
    try {
      await patchActivoDiarioContable(id, !activo);
      await refetch();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error');
    }
  };

  const abrirEditar = (row: Record<string, unknown>) => {
    setEditRow(row);
    setEditForm({
      codigo: String(row.codigo || ''),
      nombre: String(row.nombre || ''),
      tipo_diario: String(row.tipo_diario || 'OPERACIONES_VARIAS'),
    });
    setModalOpen(true);
  };

  const guardarEditar = async () => {
    if (!editRow) return;
    setGuardando(true);
    try {
      await actualizarDiarioContable(String(editRow.id_diario_contable), editForm);
      setModalOpen(false);
      await refetch();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!window.confirm('¿Eliminar diario?')) return;
    try {
      await eliminarDiarioContable(id);
      await refetch();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error');
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">Diccionarios — Diarios contables ({diarios.length})</CardTitle>
        {mensaje && <Alert color="warning">{mensaje}</Alert>}
        {error && <Alert color="danger">Error al cargar diarios</Alert>}

        <Form className="row g-2 align-items-end mb-4" onSubmit={handleAdd}>
          <FormGroup className="col-md-2">
            <Label>Código</Label>
            <Input value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
          </FormGroup>
          <FormGroup className="col-md-4">
            <Label>Etiqueta</Label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </FormGroup>
          <FormGroup className="col-md-4">
            <Label>Naturaleza del diario</Label>
            <Input type="select" value={tipoDiario} onChange={(e) => setTipoDiario(e.target.value)}>
              {TIPOS_DIARIO.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </Input>
          </FormGroup>
          <div className="col-md-2">
            <Button color="primary" type="submit" disabled={guardando}>AÑADIR</Button>
          </div>
        </Form>

        {loading && <Spinner />}
        {!loading && (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Código</th>
                <th>Etiqueta</th>
                <th>Naturaleza del diario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {diarios.map((d: {
                id_diario_contable: string;
                codigo: string;
                nombre: string;
                tipo_diario: string;
                estado: boolean;
              }) => (
                <tr key={d.id_diario_contable}>
                  <td>{d.codigo}</td>
                  <td>{d.nombre}</td>
                  <td>{labelTipoDiario(d.tipo_diario)}</td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={d.estado}
                        onChange={() => toggleActivo(d.id_diario_contable, d.estado)}
                      />
                    </div>
                  </td>
                  <td>
                    <Button size="sm" color="link" onClick={() => abrirEditar(d)}>Editar</Button>
                    <Button size="sm" color="link" className="text-danger" onClick={() => handleEliminar(d.id_diario_contable)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
          <ModalHeader toggle={() => setModalOpen(false)}>Editar diario</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Código</Label>
              <Input value={editForm.codigo} onChange={(e) => setEditForm({ ...editForm, codigo: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Etiqueta</Label>
              <Input value={editForm.nombre} onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Naturaleza</Label>
              <Input type="select" value={editForm.tipo_diario} onChange={(e) => setEditForm({ ...editForm, tipo_diario: e.target.value })}>
                {TIPOS_DIARIO.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={guardarEditar} disabled={guardando}>Guardar</Button>
            <Button color="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default DiariosContables;

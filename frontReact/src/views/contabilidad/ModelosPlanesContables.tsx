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
import {
  crearModeloPlanContable,
  actualizarModeloPlanContable,
  patchActivoModeloPlanContable,
  eliminarModeloPlanContable,
} from '../../_apis_/contabilidad';

const GET_PAISES = gql`
  query GetPaises {
    paises {
      id_pais
      nombre
      codigo_iso
    }
  }
`;

const GET_MODELOS = gql`
  query GetModelosPlanes($id_pais: String) {
    modelosPlanesContables(id_pais: $id_pais) {
      id_modelo_plan_contable
      codigo
      nombre
      estado
      id_pais
      pais {
        nombre
        codigo_iso
      }
    }
  }
`;

const ModelosPlanesContables: React.FC = () => {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [idPais, setIdPais] = useState('');
  const [filtroPais, setFiltroPais] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<Record<string, unknown> | null>(null);
  const [editForm, setEditForm] = useState({ codigo: '', nombre: '', id_pais: '' });

  const { data: paisesData } = useQuery(GET_PAISES);
  const paises = paisesData?.paises || [];

  const variables = useMemo(
    () => ({ id_pais: filtroPais || undefined }),
    [filtroPais],
  );

  const { data, loading, error, refetch } = useQuery(GET_MODELOS, {
    variables,
    fetchPolicy: 'network-only',
  });

  const modelos = data?.modelosPlanesContables || [];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    try {
      await crearModeloPlanContable({ codigo, nombre, id_pais: idPais });
      setCodigo('');
      setNombre('');
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
      await patchActivoModeloPlanContable(id, !activo);
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
      id_pais: String(row.id_pais || ''),
    });
    setModalOpen(true);
  };

  const guardarEditar = async () => {
    if (!editRow) return;
    setGuardando(true);
    try {
      await actualizarModeloPlanContable(String(editRow.id_modelo_plan_contable), editForm);
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
    if (!window.confirm('¿Eliminar modelo?')) return;
    try {
      await eliminarModeloPlanContable(id);
      await refetch();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error');
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">Modelos de planes contables</CardTitle>
        {mensaje && <Alert color="warning">{mensaje}</Alert>}
        {error && <Alert color="danger">Error al cargar modelos</Alert>}

        <Form className="row g-2 align-items-end mb-3" onSubmit={handleAdd}>
          <FormGroup className="col-md-3">
            <Label>Modelos de planes contables</Label>
            <Input value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
          </FormGroup>
          <FormGroup className="col-md-3">
            <Label>Etiqueta</Label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </FormGroup>
          <FormGroup className="col-md-3">
            <Label>País</Label>
            <Input type="select" value={idPais} onChange={(e) => setIdPais(e.target.value)} required>
              <option value="">Seleccione...</option>
              {paises.map((p: { id_pais: string; nombre: string; codigo_iso: string }) => (
                <option key={p.id_pais} value={p.id_pais}>
                  {p.nombre} ({p.codigo_iso})
                </option>
              ))}
            </Input>
          </FormGroup>
          <div className="col-md-3">
            <Button color="primary" type="submit" disabled={guardando}>AÑADIR</Button>
          </div>
        </Form>

        <div className="row g-2 mb-3 align-items-end">
          <FormGroup className="col-md-4">
            <Input
              type="select"
              value={filtroPais}
              onChange={(e) => setFiltroPais(e.target.value)}
            >
              <option value="">Todos los países</option>
              {paises.map((p: { id_pais: string; nombre: string; codigo_iso: string }) => (
                <option key={p.id_pais} value={p.id_pais}>
                  {p.nombre} ({p.codigo_iso})
                </option>
              ))}
            </Input>
          </FormGroup>
          <div className="col-md-2">
            <Button color="secondary" outline onClick={() => refetch()}>Buscar</Button>
          </div>
          <div className="col-md-2">
            <Button color="light" onClick={() => setFiltroPais('')}>Limpiar</Button>
          </div>
        </div>

        {loading && <Spinner />}
        {!loading && (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Modelos de planes contables</th>
                <th>Etiqueta</th>
                <th>País</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {modelos.map((m: {
                id_modelo_plan_contable: string;
                codigo: string;
                nombre: string;
                estado: boolean;
                pais?: { nombre: string; codigo_iso: string };
              }) => (
                <tr key={m.id_modelo_plan_contable}>
                  <td>{m.codigo}</td>
                  <td>{m.nombre}</td>
                  <td>
                    {m.pais ? `${m.pais.codigo_iso} - ${m.pais.nombre}` : '—'}
                  </td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={m.estado}
                        onChange={() => toggleActivo(m.id_modelo_plan_contable, m.estado)}
                      />
                    </div>
                  </td>
                  <td>
                    <Button size="sm" color="link" onClick={() => abrirEditar(m)}>Editar</Button>
                    <Button size="sm" color="link" className="text-danger" onClick={() => handleEliminar(m.id_modelo_plan_contable)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
          <ModalHeader toggle={() => setModalOpen(false)}>Editar modelo</ModalHeader>
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
              <Label>País</Label>
              <Input type="select" value={editForm.id_pais} onChange={(e) => setEditForm({ ...editForm, id_pais: e.target.value })}>
                {paises.map((p: { id_pais: string; nombre: string; codigo_iso: string }) => (
                  <option key={p.id_pais} value={p.id_pais}>
                    {p.nombre} ({p.codigo_iso})
                  </option>
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

export default ModelosPlanesContables;

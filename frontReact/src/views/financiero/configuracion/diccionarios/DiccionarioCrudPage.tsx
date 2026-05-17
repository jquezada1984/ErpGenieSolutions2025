import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Table,
} from 'reactstrap';
import {
  actualizarCatalogo,
  crearCatalogo,
  listarCatalogo,
  patchActivoCatalogo,
} from '../../../../_apis_/catalogos';

export type FieldConfig = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'select';
  options?: { value: string; label: string }[];
  required?: boolean;
  table?: boolean;
};

type Props = {
  titulo: string;
  recurso: string;
  idField: string;
  fields: FieldConfig[];
  emptyForm: Record<string, unknown>;
};

export const TIPO_USO_OPTS = [
  { value: 'cliente_proveedor', label: 'Tipo de pago: cliente y proveedor' },
  { value: 'solo_cliente', label: 'Tipo de pago: cliente' },
  { value: 'solo_proveedor', label: 'Tipo de pago - Proveedor' },
];

const DiccionarioCrudPage: React.FC<Props> = ({ titulo, recurso, idField, fields, emptyForm }) => {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(emptyForm);
  const [guardando, setGuardando] = useState(false);

  const tableFields = useMemo(() => fields.filter((f) => f.table !== false), [fields]);
  const modalFields = useMemo(() => fields.filter((f) => f.name !== 'activo'), [fields]);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarCatalogo(recurso);
      setRows(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } }; message?: string };
      setError(err.response?.data?.error || err.message || 'Error al cargar');
    } finally {
      setLoading(false);
    }
  }, [recurso]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const filtradas = useMemo(() => {
    const q = filtro.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      tableFields.some((f) => String(r[f.name] ?? '').toLowerCase().includes(q)),
    );
  }, [rows, filtro, tableFields]);

  const setField = (name: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const abrirNuevo = () => {
    setEditRow(null);
    setForm({ ...emptyForm });
    setModalOpen(true);
  };

  const abrirEditar = (row: Record<string, unknown>) => {
    setEditRow(row);
    const next: Record<string, unknown> = { ...emptyForm };
    fields.forEach((f) => {
      if (row[f.name] !== undefined && row[f.name] !== null) {
        next[f.name] = row[f.name];
      }
    });
    setForm(next);
    setModalOpen(true);
  };

  const guardar = async () => {
    setGuardando(true);
    setError(null);
    try {
      if (editRow?.[idField]) {
        await actualizarCatalogo(recurso, String(editRow[idField]), form);
      } else {
        await crearCatalogo(recurso, form);
      }
      setModalOpen(false);
      await cargar();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } }; message?: string };
      setError(err.response?.data?.error || err.message || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const toggleActivo = async (row: Record<string, unknown>) => {
    try {
      await patchActivoCatalogo(recurso, String(row[idField]), !row.activo);
      await cargar();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } }; message?: string };
      setError(err.response?.data?.error || err.message || 'Error al cambiar estado');
    }
  };

  const renderCell = (row: Record<string, unknown>, f: FieldConfig) => {
    if (f.name === 'activo') {
      return <Input type="switch" checked={!!row.activo} onChange={() => toggleActivo(row)} />;
    }
    if (f.name === 'tipo_uso') {
      return TIPO_USO_OPTS.find((o) => o.value === row.tipo_uso)?.label || String(row.tipo_uso ?? '');
    }
    return String(row[f.name] ?? '');
  };

  return (
    <Card>
      <CardBody>
        <div className="d-flex flex-wrap justify-content-between align-items-start mb-3 gap-2">
          <div>
            <CardTitle tag="h4" className="mb-1">
              Diccionarios — {titulo} ({filtradas.length})
            </CardTitle>
            <Link to="/financiero/configuracion/diccionarios">Volver al listado de diccionarios</Link>
          </div>
        </div>
        {error && <Alert color="danger">{error}</Alert>}
        <Row className="mb-3 g-2">
          <Col md={6}>
            <Input placeholder="Buscar..." value={filtro} onChange={(e) => setFiltro(e.target.value)} />
          </Col>
          <Col md={6} className="text-md-end">
            <Button color="primary" onClick={abrirNuevo}>
              + Nuevo
            </Button>
          </Col>
        </Row>
        {loading ? (
          <div className="text-center py-4">
            <Spinner />
          </div>
        ) : (
          <Table responsive hover bordered size="sm">
            <thead>
              <tr>
                {tableFields.map((f) => (
                  <th key={f.name}>{f.label}</th>
                ))}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((row) => (
                <tr
                  key={String(row[idField])}
                  className={row.activo === false ? 'table-secondary' : undefined}
                >
                  {tableFields.map((f) => (
                    <td key={f.name}>{renderCell(row, f)}</td>
                  ))}
                  <td>
                    <Button color="link" size="sm" className="p-0" onClick={() => abrirEditar(row)}>
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={tableFields.length + 1} className="text-center text-muted">
                    Sin registros
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
          <ModalHeader toggle={() => setModalOpen(false)}>
            {editRow ? 'Editar' : 'Nuevo'} — {titulo}
          </ModalHeader>
          <ModalBody>
            <Form>
              {modalFields.map((f) => (
                <FormGroup key={f.name}>
                  <Label>{f.label}</Label>
                  {f.type === 'select' ? (
                    <Input
                      type="select"
                      value={String(form[f.name] ?? '')}
                      onChange={(e) => setField(f.name, e.target.value)}
                    >
                      {(f.options || []).map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </Input>
                  ) : (
                    <Input
                      type={f.type === 'number' ? 'number' : 'text'}
                      value={String(form[f.name] ?? '')}
                      onChange={(e) =>
                        setField(
                          f.name,
                          f.type === 'number' ? Number(e.target.value) : e.target.value,
                        )
                      }
                      required={f.required}
                    />
                  )}
                </FormGroup>
              ))}
              {!editRow && (
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={form.activo !== false}
                      onChange={(e) => setField('activo', e.target.checked)}
                    />{' '}
                    Activo
                  </Label>
                </FormGroup>
              )}
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button color="primary" onClick={guardar} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </Button>
          </ModalFooter>
        </Modal>
      </CardBody>
    </Card>
  );
};

const motionDiv = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

export default DiccionarioCrudPage;

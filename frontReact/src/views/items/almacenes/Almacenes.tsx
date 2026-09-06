import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';
import { gql, useLazyQuery } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { useConfigEmpresaScope } from '../../../hooks/useConfigEmpresaScope';
import ConfigEmpresaBar from '../../../components/ConfigEmpresaBar';
import { crearAlmacen, actualizarAlmacen } from '../../../_apis_/stock';

const ALMACENES_POR_EMPRESA = gql`
  query AlmacenesPorEmpresa($id_empresa: ID) {
    almacenesPorEmpresa(id_empresa: $id_empresa, solo_activos: false) {
      id_almacen
      id_empresa
      almacen_ref
      nombre
      descripcion
      direccion
      poblacion
      telefono
      estado
    }
  }
`;

const emptyForm = {
  almacen_ref: '',
  nombre: '',
  descripcion: '',
  direccion: '',
  poblacion: '',
  telefono: '',
  estado: true,
};

const Almacenes: React.FC = () => {
  const scope = useConfigEmpresaScope();
  const { idEmpresa, scopeGlobal } = scope;
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const [fetchAlmacenes, { loading }] = useLazyQuery(ALMACENES_POR_EMPRESA, {
    fetchPolicy: 'network-only',
  });

  const load = useCallback(async () => {
    setError(null);
    if (!idEmpresa) {
      setRows([]);
      return;
    }
    try {
      const res = await fetchAlmacenes({ variables: { id_empresa: idEmpresa } });
      setRows(res.data?.almacenesPorEmpresa || []);
    } catch (e: any) {
      setError(e.message || 'Error al cargar almacenes');
    }
  }, [idEmpresa, fetchAlmacenes]);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditId(null);
    setForm({ ...emptyForm });
    setModal(true);
  };

  const openEdit = (row: any) => {
    setEditId(row.id_almacen);
    setForm({
      almacen_ref: row.almacen_ref || '',
      nombre: row.nombre || '',
      descripcion: row.descripcion || '',
      direccion: row.direccion || '',
      poblacion: row.poblacion || '',
      telefono: row.telefono || '',
      estado: row.estado !== false,
    });
    setModal(true);
  };

  const save = async () => {
    if (!idEmpresa) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const body = { ...form, id_empresa: idEmpresa };
      if (editId) {
        await actualizarAlmacen(editId, body);
        setSuccess('Almacén actualizado');
      } else {
        await crearAlmacen(body);
        setSuccess('Almacén creado');
      }
      setModal(false);
      await load();
    } catch (e: any) {
      setError(e.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(
    () => [
      { Header: 'Ref.', accessor: 'almacen_ref', width: 120 },
      { Header: 'Nombre', accessor: 'nombre' },
      { Header: 'Población', accessor: 'poblacion', width: 140 },
      { Header: 'Teléfono', accessor: 'telefono', width: 120 },
      {
        Header: 'Estado',
        accessor: 'estado',
        width: 90,
        Cell: ({ value }: any) => (value ? 'Activo' : 'Inactivo'),
      },
      {
        Header: '',
        id: 'acciones',
        width: 100,
        Cell: ({ original }: any) => (
          <Button size="sm" color="link" onClick={() => openEdit(original)}>
            Editar
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <Container fluid className="py-3">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <CardTitle tag="h4" className="mb-0">
              Almacenes
            </CardTitle>
            <Button color="primary" onClick={openNew} disabled={!idEmpresa}>
              Nuevo almacén
            </Button>
          </div>
          <ConfigEmpresaBar
            scope={scope}
            hideWhenEmpresa
            emptyMessage="Seleccione una empresa para ver los almacenes"
          />
          {error && <Alert color="danger">{error}</Alert>}
          {success && <Alert color="success">{success}</Alert>}
          {scopeGlobal && !idEmpresa ? null : (
            <ReactTable
              data={rows}
              columns={columns}
              defaultPageSize={10}
              className="-striped -highlight"
              loading={loading}
              noDataText="Sin almacenes"
            />
          )}
        </CardBody>
      </Card>

      <Modal isOpen={modal} toggle={() => setModal(false)}>
        <ModalHeader toggle={() => setModal(false)}>
          {editId ? 'Editar almacén' : 'Nuevo almacén'}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Referencia *</Label>
                <Input
                  value={form.almacen_ref}
                  onChange={(e) => setForm({ ...form, almacen_ref: e.target.value })}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Nombre *</Label>
                <Input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label>Descripción</Label>
                <Input
                  type="textarea"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label>Dirección</Label>
                <Input
                  value={form.direccion}
                  onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Población</Label>
                <Input
                  value={form.poblacion}
                  onChange={(e) => setForm({ ...form, poblacion: e.target.value })}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Teléfono</Label>
                <Input
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                />
              </FormGroup>
            </Col>
            {editId && (
              <Col md={6}>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={form.estado}
                      onChange={(e) => setForm({ ...form, estado: e.target.checked })}
                    />{' '}
                    Activo
                  </Label>
                </FormGroup>
              </Col>
            )}
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModal(false)}>
            Cancelar
          </Button>
          <Button color="primary" onClick={save} disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar'}
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Almacenes;

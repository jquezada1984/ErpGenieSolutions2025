import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Alert,
  Badge,
  Container,
  Row,
  Col,
  FormText,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { listarBancos, crearBanco, actualizarBanco } from '../../_apis_/bancoCaja';

interface BancoRow {
  id_banco: string;
  nombre: string;
  codigo?: string;
  swift?: string;
  web?: string;
  estado: boolean;
}

const Bancos: React.FC = () => {
  const navigate = useNavigate();
  const [bancos, setBancos] = useState<BancoRow[]>([]);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: '', codigo: '', swift: '', web: '' });
  const [err, setErr] = useState<string | null>(null);
  const [errNombre, setErrNombre] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    listarBancos(false)
      .then(setBancos)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditId(null);
    setForm({ nombre: '', codigo: '', swift: '', web: '' });
    setErrNombre(null);
    setErr(null);
    setModal(true);
  };

  const openEdit = (b: BancoRow) => {
    setEditId(b.id_banco);
    setForm({
      nombre: b.nombre || '',
      codigo: b.codigo || '',
      swift: b.swift || '',
      web: b.web || '',
    });
    setErrNombre(null);
    setErr(null);
    setModal(true);
  };

  const save = async () => {
    if (!form.nombre.trim()) {
      setErrNombre('El nombre es obligatorio');
      setErr('El nombre es obligatorio');
      return;
    }
    setErrNombre(null);
    try {
      if (editId) await actualizarBanco(editId, form);
      else await crearBanco(form);
      setModal(false);
      load();
    } catch (e: unknown) {
      const ax = e as { message?: string };
      setErr(ax.message || 'Error al guardar');
    }
  };

  const handleToggleEstado = async (banco: BancoRow) => {
    try {
      setErr(null);
      await actualizarBanco(banco.id_banco, { estado: !banco.estado });
      load();
    } catch (e: unknown) {
      const ax = e as { message?: string };
      setErr(ax.message || 'Error al actualizar el estado');
    }
  };

  const columns = [
    { Header: 'Nombre', accessor: 'nombre', filterable: true },
    { Header: 'Código', accessor: 'codigo', filterable: true },
    { Header: 'SWIFT', accessor: 'swift', filterable: true },
    {
      Header: 'Estado',
      accessor: 'estado',
      filterable: true,
      Cell: ({ value }: { value: boolean }) => (
        <Badge color={value ? 'success' : 'danger'}>
          {value ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      Header: 'Acciones',
      accessor: 'id_banco',
      sortable: false,
      filterable: false,
      width: 120,
      Cell: ({ original }: { original: BancoRow }) => {
        const activo = !!original.estado;
        return (
          <div className="d-flex align-items-center justify-content-center gap-1">
            <Button
              onClick={() => activo && openEdit(original)}
              color={activo ? 'info' : 'secondary'}
              size="sm"
              className="me-1"
              title={activo ? 'Editar' : 'Banco inactivo: no se puede editar'}
              disabled={!activo}
            >
              <i className="bi bi-pencil-fill" />
            </Button>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={!!original.estado}
                onChange={() => handleToggleEstado(original)}
              />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="grid-header">
                <CardTitle tag="h4" className="grid-title mb-0">
                  Catálogo de bancos
                </CardTitle>
                <div className="grid-actions">
                  <Button outline color="secondary" className="me-2" onClick={() => navigate('/banco-cajas/cuentas')}>
                    Volver a cuentas
                  </Button>
                  <Button color="primary" className="grid-primary-button" onClick={openNew}>
                    <i className="bi bi-plus-circle me-2" />
                    Nuevo banco
                  </Button>
                </div>
              </div>

              {err && <Alert color="danger" className="mb-3 mt-3">{err}</Alert>}

              <div className="grid-container mt-3">
                <ReactTable
                  data={bancos}
                  columns={columns}
                  defaultPageSize={10}
                  className="-striped -highlight"
                  loading={loading}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={modal} toggle={() => setModal(false)}>
        <ModalHeader toggle={() => setModal(false)}>
          {editId ? 'Editar banco' : 'Nuevo banco'}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Nombre *</Label>
            <Input
              value={form.nombre}
              onChange={(e) => {
                const v = e.target.value;
                setForm({ ...form, nombre: v });
                setErrNombre(!v.trim() ? 'El nombre es obligatorio' : null);
                if (v.trim()) setErr(null);
              }}
              invalid={!!errNombre}
            />
            {errNombre && <FormText color="danger">{errNombre}</FormText>}
          </FormGroup>
          <FormGroup>
            <Label>Código</Label>
            <Input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
          </FormGroup>
          <FormGroup>
            <Label>SWIFT</Label>
            <Input value={form.swift} onChange={(e) => setForm({ ...form, swift: e.target.value })} />
          </FormGroup>
          <FormGroup>
            <Label>Web</Label>
            <Input value={form.web} onChange={(e) => setForm({ ...form, web: e.target.value })} />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModal(false)}>
            Cancelar
          </Button>
          <Button color="primary" onClick={save}>
            Guardar
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Bancos;

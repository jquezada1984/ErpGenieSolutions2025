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
import { crearCambioMasivoStock, completarCambioMasivoStock } from '../../../_apis_/stock';

const LISTADO = gql`
  query CambiosMasivosStock($id_empresa: ID) {
    cambiosMasivosStock(id_empresa: $id_empresa) {
      id_cambio_masivo_stock
      referencia
      concepto
      almacen_nombre
      fecha_movimiento
      estado_operacion
    }
  }
`;

const ALMACENES = gql`
  query AlmacenesCm($id_empresa: ID) {
    almacenesPorEmpresa(id_empresa: $id_empresa) {
      id_almacen
      nombre
    }
  }
`;

const ITEMS = gql`
  query ItemsCm($id_empresa: ID) {
    itemsListado(id_empresa: $id_empresa, codigo_tipo_item: "PRODUCT") {
      id_item
      producto_ref
      etiqueta
    }
  }
`;

const CambioMasivoStock: React.FC = () => {
  const scope = useConfigEmpresaScope();
  const { idEmpresa } = scope;
  const [rows, setRows] = useState<any[]>([]);
  const [almacenes, setAlmacenes] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    referencia: '',
    concepto: '',
    id_almacen: '',
    fecha_movimiento: new Date().toISOString().slice(0, 10),
    id_item: '',
    tipo_ajuste: 'POSITIVO',
    cantidad: '1',
  });

  const [fetchList, { loading }] = useLazyQuery(LISTADO, { fetchPolicy: 'network-only' });
  const [fetchAlm] = useLazyQuery(ALMACENES, { fetchPolicy: 'network-only' });
  const [fetchItems] = useLazyQuery(ITEMS, { fetchPolicy: 'network-only' });

  const load = useCallback(async () => {
    setError(null);
    if (!idEmpresa) {
      setRows([]);
      return;
    }
    try {
      const [l, a, i] = await Promise.all([
        fetchList({ variables: { id_empresa: idEmpresa } }),
        fetchAlm({ variables: { id_empresa: idEmpresa } }),
        fetchItems({ variables: { id_empresa: idEmpresa } }),
      ]);
      setRows(l.data?.cambiosMasivosStock || []);
      setAlmacenes(a.data?.almacenesPorEmpresa || []);
      setItems(i.data?.itemsListado || []);
    } catch (e: any) {
      setError(e.message || 'Error al cargar');
    }
  }, [idEmpresa, fetchList, fetchAlm, fetchItems]);

  useEffect(() => {
    load();
  }, [load]);

  const completar = async (id: string) => {
    if (!idEmpresa) return;
    try {
      await completarCambioMasivoStock(id, { id_empresa: idEmpresa });
      setSuccess('Cambio masivo completado (AJUSTE_*)');
      await load();
    } catch (e: any) {
      setError(e.message || 'Error al completar');
    }
  };

  const crear = async () => {
    if (!idEmpresa) return;
    setSaving(true);
    setError(null);
    try {
      await crearCambioMasivoStock({
        id_empresa: idEmpresa,
        id_almacen: form.id_almacen,
        referencia: form.referencia,
        concepto: form.concepto,
        fecha_movimiento: form.fecha_movimiento,
        lineas: [
          {
            id_item: form.id_item,
            tipo_ajuste: form.tipo_ajuste,
            cantidad: Number(form.cantidad),
          },
        ],
      });
      setSuccess('Cambio masivo creado en BORRADOR');
      setModal(false);
      await load();
    } catch (e: any) {
      setError(e.message || 'Error al crear');
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(
    () => [
      { Header: 'Ref.', accessor: 'referencia', width: 160 },
      { Header: 'Almacén', accessor: 'almacen_nombre' },
      { Header: 'Fecha', accessor: 'fecha_movimiento', width: 120 },
      { Header: 'Estado', accessor: 'estado_operacion', width: 120 },
      { Header: 'Concepto', accessor: 'concepto' },
      {
        Header: '',
        id: 'acc',
        width: 120,
        Cell: ({ original }: any) =>
          original.estado_operacion === 'BORRADOR' ? (
            <Button
              size="sm"
              color="success"
              onClick={() => completar(original.id_cambio_masivo_stock)}
            >
              Completar
            </Button>
          ) : null,
      },
    ],
    [idEmpresa]
  );

  return (
    <Container fluid className="py-3">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <CardTitle tag="h4" className="mb-0">
              Cambio masivo de stock
            </CardTitle>
            <Button color="primary" disabled={!idEmpresa} onClick={() => setModal(true)}>
              Nuevo cambio masivo
            </Button>
          </div>
          <ConfigEmpresaBar scope={scope} hideWhenEmpresa emptyMessage="Seleccione una empresa" />
          {error && <Alert color="danger">{error}</Alert>}
          {success && <Alert color="success">{success}</Alert>}
          {idEmpresa && (
            <ReactTable
              data={rows}
              columns={columns}
              defaultPageSize={10}
              className="-striped -highlight"
              loading={loading}
              noDataText="Sin cambios masivos"
            />
          )}
        </CardBody>
      </Card>

      <Modal isOpen={modal} toggle={() => setModal(false)} size="lg">
        <ModalHeader toggle={() => setModal(false)}>Nuevo cambio masivo</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label>Referencia</Label>
                <Input
                  value={form.referencia}
                  onChange={(e) => setForm({ ...form, referencia: e.target.value })}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Almacén *</Label>
                <Input
                  type="select"
                  value={form.id_almacen}
                  onChange={(e) => setForm({ ...form, id_almacen: e.target.value })}
                >
                  <option value="">Seleccione…</option>
                  {almacenes.map((a) => (
                    <option key={a.id_almacen} value={a.id_almacen}>
                      {a.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={form.fecha_movimiento}
                  onChange={(e) => setForm({ ...form, fecha_movimiento: e.target.value })}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Ítem *</Label>
                <Input
                  type="select"
                  value={form.id_item}
                  onChange={(e) => setForm({ ...form, id_item: e.target.value })}
                >
                  <option value="">Seleccione…</option>
                  {items.map((it) => (
                    <option key={it.id_item} value={it.id_item}>
                      {it.producto_ref} — {it.etiqueta}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label>Tipo ajuste *</Label>
                <Input
                  type="select"
                  value={form.tipo_ajuste}
                  onChange={(e) => setForm({ ...form, tipo_ajuste: e.target.value })}
                >
                  <option value="POSITIVO">POSITIVO → AJUSTE_POSITIVO</option>
                  <option value="NEGATIVO">NEGATIVO → AJUSTE_NEGATIVO</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label>Cantidad *</Label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.cantidad}
                  onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label>Concepto</Label>
                <Input
                  value={form.concepto}
                  onChange={(e) => setForm({ ...form, concepto: e.target.value })}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModal(false)}>
            Cancelar
          </Button>
          <Button color="primary" onClick={crear} disabled={saving}>
            {saving ? 'Guardando…' : 'Crear borrador'}
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default CambioMasivoStock;

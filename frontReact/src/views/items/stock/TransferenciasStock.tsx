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
import {
  crearTransferenciaStock,
  completarTransferenciaStock,
} from '../../../_apis_/stock';

const LISTADO = gql`
  query TransferenciasStock($id_empresa: ID) {
    transferenciasStock(id_empresa: $id_empresa) {
      id_transferencia_stock
      transferencia_ref
      almacen_origen
      almacen_destino
      id_almacen_origen
      id_almacen_destino
      estado_transferencia
      fecha_transferencia
      observacion
    }
  }
`;

const ALMACENES = gql`
  query AlmacenesTrf($id_empresa: ID) {
    almacenesPorEmpresa(id_empresa: $id_empresa) {
      id_almacen
      nombre
    }
  }
`;

const ITEMS = gql`
  query ItemsTrf($id_empresa: ID) {
    itemsListado(id_empresa: $id_empresa, codigo_tipo_item: "PRODUCT") {
      id_item
      producto_ref
      etiqueta
    }
  }
`;

const TransferenciasStock: React.FC = () => {
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
    transferencia_ref: '',
    id_almacen_origen: '',
    id_almacen_destino: '',
    observacion: '',
    id_item: '',
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
      setRows(l.data?.transferenciasStock || []);
      setAlmacenes(a.data?.almacenesPorEmpresa || []);
      setItems(i.data?.itemsListado || []);
    } catch (e: any) {
      setError(e.message || 'Error al cargar transferencias');
    }
  }, [idEmpresa, fetchList, fetchAlm, fetchItems]);

  useEffect(() => {
    load();
  }, [load]);

  const completar = async (id: string) => {
    if (!idEmpresa) return;
    setError(null);
    setSuccess(null);
    try {
      await completarTransferenciaStock(id, { id_empresa: idEmpresa });
      setSuccess('Transferencia completada (TRF_SALIDA + TRF_ENTRADA)');
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
      await crearTransferenciaStock({
        id_empresa: idEmpresa,
        transferencia_ref: form.transferencia_ref,
        id_almacen_origen: form.id_almacen_origen,
        id_almacen_destino: form.id_almacen_destino,
        observacion: form.observacion,
        lineas: [{ id_item: form.id_item, cantidad: Number(form.cantidad) }],
      });
      setSuccess('Transferencia creada en BORRADOR');
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
      { Header: 'Ref.', accessor: 'transferencia_ref', width: 140 },
      { Header: 'Origen', accessor: 'almacen_origen' },
      { Header: 'Destino', accessor: 'almacen_destino' },
      { Header: 'Estado', accessor: 'estado_transferencia', width: 120 },
      {
        Header: 'Fecha',
        accessor: 'fecha_transferencia',
        width: 160,
        Cell: ({ value }: any) => (value ? String(value).slice(0, 16).replace('T', ' ') : ''),
      },
      {
        Header: '',
        id: 'acc',
        width: 120,
        Cell: ({ original }: any) =>
          original.estado_transferencia === 'BORRADOR' ? (
            <Button size="sm" color="success" onClick={() => completar(original.id_transferencia_stock)}>
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
              Transferencias de stock
            </CardTitle>
            <Button color="primary" disabled={!idEmpresa} onClick={() => setModal(true)}>
              Nueva transferencia
            </Button>
          </div>
          <ConfigEmpresaBar
            scope={scope}
            hideWhenEmpresa
            emptyMessage="Seleccione una empresa"
          />
          {error && <Alert color="danger">{error}</Alert>}
          {success && <Alert color="success">{success}</Alert>}
          {idEmpresa && (
            <ReactTable
              data={rows}
              columns={columns}
              defaultPageSize={10}
              className="-striped -highlight"
              loading={loading}
              noDataText="Sin transferencias"
            />
          )}
        </CardBody>
      </Card>

      <Modal isOpen={modal} toggle={() => setModal(false)} size="lg">
        <ModalHeader toggle={() => setModal(false)}>Nueva transferencia</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label>Referencia *</Label>
                <Input
                  value={form.transferencia_ref}
                  onChange={(e) => setForm({ ...form, transferencia_ref: e.target.value })}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Almacén origen *</Label>
                <Input
                  type="select"
                  value={form.id_almacen_origen}
                  onChange={(e) => setForm({ ...form, id_almacen_origen: e.target.value })}
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
                <Label>Almacén destino *</Label>
                <Input
                  type="select"
                  value={form.id_almacen_destino}
                  onChange={(e) => setForm({ ...form, id_almacen_destino: e.target.value })}
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
            <Col md={8}>
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
            <Col md={4}>
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
                <Label>Observación</Label>
                <Input
                  type="textarea"
                  value={form.observacion}
                  onChange={(e) => setForm({ ...form, observacion: e.target.value })}
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

export default TransferenciasStock;

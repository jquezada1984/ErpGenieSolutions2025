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
  Row,
} from 'reactstrap';
import { gql, useLazyQuery } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { useConfigEmpresaScope } from '../../../hooks/useConfigEmpresaScope';
import ConfigEmpresaBar from '../../../components/ConfigEmpresaBar';
import { upsertLoteSerie } from '../../../_apis_/stock';

const LOTES = gql`
  query LotesSerie($id_empresa: ID, $id_almacen: ID) {
    lotesSerie(id_empresa: $id_empresa, id_almacen: $id_almacen) {
      id_lote_serie
      id_item
      id_almacen
      producto_ref
      etiqueta
      almacen_nombre
      codigo_lote_serie
      cantidad_actual
      fecha_caducidad
      fecha_limite_venta
      observacion
      estado
    }
  }
`;

const ALMACENES = gql`
  query AlmacenesLotes($id_empresa: ID) {
    almacenesPorEmpresa(id_empresa: $id_empresa) {
      id_almacen
      nombre
    }
  }
`;

const ITEMS = gql`
  query ItemsLotes($id_empresa: ID) {
    itemsListado(id_empresa: $id_empresa, codigo_tipo_item: "PRODUCT") {
      id_item
      producto_ref
      etiqueta
    }
  }
`;

const ProductosStocksLotes: React.FC = () => {
  const scope = useConfigEmpresaScope();
  const { idEmpresa } = scope;
  const [rows, setRows] = useState<any[]>([]);
  const [almacenes, setAlmacenes] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [idAlmacen, setIdAlmacen] = useState('');
  const [form, setForm] = useState({
    id_item: '',
    id_almacen: '',
    codigo_lote_serie: '',
    cantidad_actual: '0',
    fecha_caducidad: '',
    fecha_limite_venta: '',
  });

  const [loadLotes, { loading }] = useLazyQuery(LOTES, { fetchPolicy: 'network-only' });
  const [loadAlm] = useLazyQuery(ALMACENES, { fetchPolicy: 'network-only' });
  const [loadItems] = useLazyQuery(ITEMS, { fetchPolicy: 'network-only' });

  const refresh = useCallback(async () => {
    if (!idEmpresa) return;
    setError(null);
    try {
      const [rL, rA, rI] = await Promise.all([
        loadLotes({ variables: { id_empresa: idEmpresa, id_almacen: idAlmacen || null } }),
        loadAlm({ variables: { id_empresa: idEmpresa } }),
        loadItems({ variables: { id_empresa: idEmpresa } }),
      ]);
      setRows(rL.data?.lotesSerie || []);
      setAlmacenes(rA.data?.almacenesPorEmpresa || []);
      setItems(rI.data?.itemsListado || []);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar lotes');
    }
  }, [idEmpresa, idAlmacen, loadLotes, loadAlm, loadItems]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const columns = useMemo(
    () => [
      { Header: 'Ref', accessor: 'producto_ref', width: 110 },
      { Header: 'Producto', accessor: 'etiqueta' },
      { Header: 'Almacén', accessor: 'almacen_nombre', width: 140 },
      { Header: 'Lote/Serie', accessor: 'codigo_lote_serie', width: 140 },
      { Header: 'Cant.', accessor: 'cantidad_actual', width: 80 },
      { Header: 'Caducidad', accessor: 'fecha_caducidad', width: 110 },
      { Header: 'Lím. venta', accessor: 'fecha_limite_venta', width: 110 },
    ],
    [],
  );

  const onSave = async () => {
    if (!idEmpresa || !form.id_item || !form.id_almacen || !form.codigo_lote_serie.trim()) {
      setError('Complete ítem, almacén y código de lote/serie');
      return;
    }
    setError(null);
    setMsg(null);
    try {
      await upsertLoteSerie({
        id_empresa: idEmpresa,
        id_item: form.id_item,
        id_almacen: form.id_almacen,
        codigo_lote_serie: form.codigo_lote_serie.trim(),
        cantidad_actual: Number(form.cantidad_actual) || 0,
        fecha_caducidad: form.fecha_caducidad || null,
        fecha_limite_venta: form.fecha_limite_venta || null,
      });
      setMsg('Lote/serie guardado');
      setForm((f) => ({ ...f, codigo_lote_serie: '', cantidad_actual: '0' }));
      await refresh();
    } catch (e: any) {
      setError(e?.message || 'Error al guardar lote');
    }
  };

  return (
    <Container fluid>
      <Card>
        <CardBody>
          <CardTitle tag="h4">Stocks por lote / serie</CardTitle>
          <ConfigEmpresaBar scope={scope} />
          {!scope.ready ? null : (
            <>
              {error && <Alert color="danger">{error}</Alert>}
              {msg && <Alert color="success">{msg}</Alert>}
              <Row className="mb-3">
                <Col md={4}>
                  <FormGroup>
                    <Label>Filtrar almacén</Label>
                    <Input type="select" value={idAlmacen} onChange={(e) => setIdAlmacen(e.target.value)}>
                      <option value="">Todos</option>
                      {almacenes.map((a) => (
                        <option key={a.id_almacen} value={a.id_almacen}>
                          {a.nombre}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button color="secondary" onClick={refresh} disabled={loading}>
                    Actualizar
                  </Button>
                </Col>
              </Row>

              <Card className="mb-3 border">
                <CardBody>
                  <h6>Nuevo / actualizar lote</h6>
                  <Row>
                    <Col md={3}>
                      <FormGroup>
                        <Label>Producto</Label>
                        <Input
                          type="select"
                          value={form.id_item}
                          onChange={(e) => setForm({ ...form, id_item: e.target.value })}
                        >
                          <option value="">Seleccionar</option>
                          {items.map((i) => (
                            <option key={i.id_item} value={i.id_item}>
                              {i.producto_ref} — {i.etiqueta}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label>Almacén</Label>
                        <Input
                          type="select"
                          value={form.id_almacen}
                          onChange={(e) => setForm({ ...form, id_almacen: e.target.value })}
                        >
                          <option value="">Seleccionar</option>
                          {almacenes.map((a) => (
                            <option key={a.id_almacen} value={a.id_almacen}>
                              {a.nombre}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>Código</Label>
                        <Input
                          value={form.codigo_lote_serie}
                          onChange={(e) => setForm({ ...form, codigo_lote_serie: e.target.value })}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2}>
                      <FormGroup>
                        <Label>Cantidad</Label>
                        <Input
                          type="number"
                          value={form.cantidad_actual}
                          onChange={(e) => setForm({ ...form, cantidad_actual: e.target.value })}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={2} className="d-flex align-items-end">
                      <Button color="primary" onClick={onSave}>
                        Guardar
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <ReactTable
                data={rows}
                columns={columns}
                defaultPageSize={10}
                className="-striped -highlight"
                loading={loading}
                noDataText="Sin lotes"
              />
            </>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default ProductosStocksLotes;

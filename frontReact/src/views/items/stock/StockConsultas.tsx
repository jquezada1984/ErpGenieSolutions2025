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
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';
import { gql, useLazyQuery } from '@apollo/client';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import classnames from 'classnames';
import { useConfigEmpresaScope } from '../../../hooks/useConfigEmpresaScope';
import ConfigEmpresaBar from '../../../components/ConfigEmpresaBar';

const ALMACENES = gql`
  query AlmacenesConsultas($id_empresa: ID) {
    almacenesPorEmpresa(id_empresa: $id_empresa) {
      id_almacen
      nombre
    }
  }
`;

const STOCK_FECHA = gql`
  query StockAFecha($id_empresa: ID!, $fecha: String!, $id_almacen: ID) {
    stockAFecha(id_empresa: $id_empresa, fecha: $fecha, id_almacen: $id_almacen) {
      producto_ref
      etiqueta
      almacen_nombre
      stock_a_fecha
    }
  }
`;

const REPOSICION = gql`
  query StockReposicion($id_empresa: ID!, $id_almacen: ID) {
    stockReposicion(id_empresa: $id_empresa, id_almacen: $id_almacen) {
      producto_ref
      etiqueta
      almacen_nombre
      stock_fisico
      umbral_alerta
      stock_deseado
      faltante
    }
  }
`;

const VALORACION = gql`
  query StockValoracionPmp($id_empresa: ID!, $id_almacen: ID) {
    stockValoracionPmp(id_empresa: $id_empresa, id_almacen: $id_almacen) {
      producto_ref
      etiqueta
      almacen_nombre
      stock_fisico
      pmp
      valor_total
    }
  }
`;

const StockConsultas: React.FC = () => {
  const scope = useConfigEmpresaScope();
  const { idEmpresa } = scope;
  const [tab, setTab] = useState('1');
  const [almacenes, setAlmacenes] = useState<any[]>([]);
  const [idAlmacen, setIdAlmacen] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [rowsFecha, setRowsFecha] = useState<any[]>([]);
  const [rowsRepo, setRowsRepo] = useState<any[]>([]);
  const [rowsVal, setRowsVal] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [loadAlm] = useLazyQuery(ALMACENES, { fetchPolicy: 'network-only' });
  const [loadFecha, { loading: loadingF }] = useLazyQuery(STOCK_FECHA, { fetchPolicy: 'network-only' });
  const [loadRepo, { loading: loadingR }] = useLazyQuery(REPOSICION, { fetchPolicy: 'network-only' });
  const [loadVal, { loading: loadingV }] = useLazyQuery(VALORACION, { fetchPolicy: 'network-only' });

  useEffect(() => {
    if (!idEmpresa) return;
    loadAlm({ variables: { id_empresa: idEmpresa } }).then((r) =>
      setAlmacenes(r.data?.almacenesPorEmpresa || []),
    );
  }, [idEmpresa, loadAlm]);

  const runFecha = useCallback(async () => {
    if (!idEmpresa || !fecha) return;
    setError(null);
    try {
      const r = await loadFecha({
        variables: { id_empresa: idEmpresa, fecha, id_almacen: idAlmacen || null },
      });
      setRowsFecha(r.data?.stockAFecha || []);
    } catch (e: any) {
      setError(e?.message || 'Error stock a fecha');
    }
  }, [idEmpresa, fecha, idAlmacen, loadFecha]);

  const runRepo = useCallback(async () => {
    if (!idEmpresa) return;
    setError(null);
    try {
      const r = await loadRepo({
        variables: { id_empresa: idEmpresa, id_almacen: idAlmacen || null },
      });
      setRowsRepo(r.data?.stockReposicion || []);
    } catch (e: any) {
      setError(e?.message || 'Error reposición');
    }
  }, [idEmpresa, idAlmacen, loadRepo]);

  const runVal = useCallback(async () => {
    if (!idEmpresa) return;
    setError(null);
    try {
      const r = await loadVal({
        variables: { id_empresa: idEmpresa, id_almacen: idAlmacen || null },
      });
      setRowsVal(r.data?.stockValoracionPmp || []);
    } catch (e: any) {
      setError(e?.message || 'Error valoración');
    }
  }, [idEmpresa, idAlmacen, loadVal]);

  const colsFecha = useMemo(
    () => [
      { Header: 'Ref', accessor: 'producto_ref', width: 110 },
      { Header: 'Producto', accessor: 'etiqueta' },
      { Header: 'Almacén', accessor: 'almacen_nombre', width: 140 },
      { Header: 'Stock a fecha', accessor: 'stock_a_fecha', width: 120 },
    ],
    [],
  );
  const colsRepo = useMemo(
    () => [
      { Header: 'Ref', accessor: 'producto_ref', width: 110 },
      { Header: 'Producto', accessor: 'etiqueta' },
      { Header: 'Almacén', accessor: 'almacen_nombre', width: 140 },
      { Header: 'Físico', accessor: 'stock_fisico', width: 90 },
      { Header: 'Alerta', accessor: 'umbral_alerta', width: 90 },
      { Header: 'Deseado', accessor: 'stock_deseado', width: 90 },
      { Header: 'Faltante', accessor: 'faltante', width: 90 },
    ],
    [],
  );
  const colsVal = useMemo(
    () => [
      { Header: 'Ref', accessor: 'producto_ref', width: 110 },
      { Header: 'Producto', accessor: 'etiqueta' },
      { Header: 'Almacén', accessor: 'almacen_nombre', width: 140 },
      { Header: 'Cant.', accessor: 'stock_fisico', width: 90 },
      { Header: 'PMP', accessor: 'pmp', width: 100 },
      { Header: 'Valor', accessor: 'valor_total', width: 110 },
    ],
    [],
  );

  return (
    <Container fluid>
      <Card>
        <CardBody>
          <CardTitle tag="h4">Consultas de stock</CardTitle>
          <ConfigEmpresaBar scope={scope} />
          {!scope.ready ? null : (
            <>
              {error && <Alert color="danger">{error}</Alert>}
              <Row className="mb-3">
                <Col md={4}>
                  <FormGroup>
                    <Label>Almacén (opcional)</Label>
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
              </Row>
              <Nav tabs>
                {[
                  { id: '1', label: 'Stock a fecha' },
                  { id: '2', label: 'Reposición' },
                  { id: '3', label: 'Valoración PMP' },
                ].map((t) => (
                  <NavItem key={t.id}>
                    <NavLink
                      className={classnames({ active: tab === t.id })}
                      onClick={() => setTab(t.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {t.label}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
              <TabContent activeTab={tab} className="pt-3">
                <TabPane tabId="1">
                  <Row className="mb-2">
                    <Col md={3}>
                      <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                    </Col>
                    <Col md={2}>
                      <Button color="primary" onClick={runFecha} disabled={loadingF}>
                        Consultar
                      </Button>
                    </Col>
                  </Row>
                  <ReactTable data={rowsFecha} columns={colsFecha} defaultPageSize={10} className="-striped -highlight" />
                </TabPane>
                <TabPane tabId="2">
                  <Button color="primary" className="mb-2" onClick={runRepo} disabled={loadingR}>
                    Sugerir reposición
                  </Button>
                  <ReactTable data={rowsRepo} columns={colsRepo} defaultPageSize={10} className="-striped -highlight" />
                </TabPane>
                <TabPane tabId="3">
                  <Button color="primary" className="mb-2" onClick={runVal} disabled={loadingV}>
                    Calcular valoración
                  </Button>
                  <ReactTable data={rowsVal} columns={colsVal} defaultPageSize={10} className="-striped -highlight" />
                </TabPane>
              </TabContent>
            </>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default StockConsultas;

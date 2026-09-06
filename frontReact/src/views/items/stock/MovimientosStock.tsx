import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
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

const MOVIMIENTOS = gql`
  query MovimientosInventario(
    $id_empresa: ID
    $id_almacen: ID
    $tipo_movimiento: String
    $fecha_desde: String
    $fecha_hasta: String
  ) {
    movimientosInventario(
      id_empresa: $id_empresa
      id_almacen: $id_almacen
      tipo_movimiento: $tipo_movimiento
      fecha_desde: $fecha_desde
      fecha_hasta: $fecha_hasta
    ) {
      id_movimiento_inventario
      producto_ref
      etiqueta
      tipo_movimiento
      cantidad
      costo_unitario
      costo_total
      fecha_movimiento
      referencia
      concepto
      almacen_nombre
      modulo_origen
      id_asiento_contable
    }
  }
`;

const ALMACENES = gql`
  query AlmacenesKardex($id_empresa: ID) {
    almacenesPorEmpresa(id_empresa: $id_empresa) {
      id_almacen
      nombre
    }
  }
`;

const TIPOS = [
  '',
  'INICIAL',
  'ENTRADA',
  'SALIDA',
  'AJUSTE_POSITIVO',
  'AJUSTE_NEGATIVO',
  'TRF_SALIDA',
  'TRF_ENTRADA',
];

const MovimientosStock: React.FC = () => {
  const scope = useConfigEmpresaScope();
  const { idEmpresa } = scope;
  const [rows, setRows] = useState<any[]>([]);
  const [almacenes, setAlmacenes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [idAlmacen, setIdAlmacen] = useState('');
  const [tipo, setTipo] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const [fetchMovs, { loading }] = useLazyQuery(MOVIMIENTOS, { fetchPolicy: 'network-only' });
  const [fetchAlm] = useLazyQuery(ALMACENES, { fetchPolicy: 'network-only' });

  const load = useCallback(async () => {
    setError(null);
    if (!idEmpresa) {
      setRows([]);
      setAlmacenes([]);
      return;
    }
    try {
      const [a, m] = await Promise.all([
        fetchAlm({ variables: { id_empresa: idEmpresa } }),
        fetchMovs({
          variables: {
            id_empresa: idEmpresa,
            id_almacen: idAlmacen || null,
            tipo_movimiento: tipo || null,
            fecha_desde: fechaDesde || null,
            fecha_hasta: fechaHasta || null,
          },
        }),
      ]);
      setAlmacenes(a.data?.almacenesPorEmpresa || []);
      setRows(m.data?.movimientosInventario || []);
    } catch (e: any) {
      setError(e.message || 'Error al cargar movimientos');
    }
  }, [idEmpresa, idAlmacen, tipo, fechaDesde, fechaHasta, fetchAlm, fetchMovs]);

  useEffect(() => {
    load();
  }, [load]);

  const columns = useMemo(
    () => [
      { Header: 'Fecha', accessor: 'fecha_movimiento', width: 110 },
      { Header: 'Tipo', accessor: 'tipo_movimiento', width: 140 },
      { Header: 'Ref. ítem', accessor: 'producto_ref', width: 110 },
      { Header: 'Ítem', accessor: 'etiqueta' },
      { Header: 'Almacén', accessor: 'almacen_nombre', width: 140 },
      {
        Header: 'Cant.',
        accessor: 'cantidad',
        width: 80,
        Cell: ({ value }: any) => Number(value ?? 0).toFixed(2),
      },
      { Header: 'Módulo', accessor: 'modulo_origen', width: 140 },
      { Header: 'Referencia', accessor: 'referencia', width: 140 },
      {
        Header: 'Asiento',
        accessor: 'id_asiento_contable',
        width: 100,
        Cell: ({ value }: any) => (value ? `${String(value).slice(0, 8)}…` : '—'),
      },
      {
        Header: 'Tipo',
        id: 'badge',
        width: 1,
        show: false,
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
              Movimientos (Kardex)
            </CardTitle>
            <Button color="secondary" outline onClick={load} disabled={!idEmpresa}>
              Actualizar
            </Button>
          </div>
          <ConfigEmpresaBar
            scope={scope}
            hideWhenEmpresa
            emptyMessage="Seleccione una empresa para ver el kardex"
          />
          {error && <Alert color="danger">{error}</Alert>}
          {idEmpresa && (
            <>
              <Row className="mb-3">
                <Col md={3}>
                  <FormGroup>
                    <Label>Almacén</Label>
                    <Input
                      type="select"
                      value={idAlmacen}
                      onChange={(e) => setIdAlmacen(e.target.value)}
                    >
                      <option value="">Todos</option>
                      {almacenes.map((a) => (
                        <option key={a.id_almacen} value={a.id_almacen}>
                          {a.nombre}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Tipo movimiento</Label>
                    <Input type="select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                      {TIPOS.map((t) => (
                        <option key={t || 'all'} value={t}>
                          {t || 'Todos'}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Desde</Label>
                    <Input
                      type="date"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Hasta</Label>
                    <Input
                      type="date"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <ReactTable
                data={rows}
                columns={columns}
                defaultPageSize={15}
                className="-striped -highlight"
                loading={loading}
                noDataText="Sin movimientos"
              />
              <div className="mt-2 text-muted small">
                Mostrando hasta 500 movimientos. Tipos:{' '}
                {TIPOS.filter(Boolean).map((t) => (
                  <Badge key={t} color="light" className="me-1 text-dark">
                    {t}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default MovimientosStock;

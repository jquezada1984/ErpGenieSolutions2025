import React, { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Alert, Card, CardBody, CardTitle, Col, Row, Table } from 'reactstrap';
import DashboardModulo, { DashboardAtajos, DashboardKpis } from './DashboardModulo';
import { useConfigEmpresaScope } from '../../hooks/useConfigEmpresaScope';

const Q_FACT = gql`
  query DashboardInicioFacturas($id_empresa: String!) {
    facturasCliente(id_empresa: $id_empresa, page: 1, limit: 20) {
      total
      items {
        id_factura
        numero_factura
        monto_pendiente
        fecha_emision
        estado
      }
    }
  }
`;

const Q_TERC = gql`
  query DashboardInicioTerceros($id_empresa: ID) {
    terceros(id_empresa: $id_empresa) {
      id_tercero
      nombre
      cliente
      proveedor
    }
  }
`;

const Q_STOCK = gql`
  query DashboardInicioStock($id_empresa: ID!) {
    stockReposicion(id_empresa: $id_empresa) {
      producto_ref
      etiqueta
      cantidad
      stock_minimo
    }
  }
`;

const DashboardInicio: React.FC = () => {
  const { idEmpresa, ready } = useConfigEmpresaScope();
  const fact = useQuery(Q_FACT, {
    variables: { id_empresa: idEmpresa },
    skip: !ready,
    fetchPolicy: 'network-only',
  });
  const terc = useQuery(Q_TERC, {
    variables: { id_empresa: idEmpresa },
    skip: !ready,
    fetchPolicy: 'network-only',
  });
  const stockQ = useQuery(Q_STOCK, {
    variables: { id_empresa: idEmpresa },
    skip: !ready,
    fetchPolicy: 'network-only',
  });

  const loading = fact.loading || terc.loading || stockQ.loading;
  const error = fact.error || terc.error || stockQ.error;
  const facturas = fact.data?.facturasCliente?.items || [];
  const pendientes = facturas.filter((f: any) => Number(f.monto_pendiente || 0) > 0);
  const terceros = terc.data?.terceros || [];
  const stock = stockQ.data?.stockReposicion || [];

  const kpis = useMemo(
    () => [
      {
        label: 'Facturas c/ pendiente',
        value: pendientes.length,
        to: '/financiero/facturas-clientes',
        tone: pendientes.length ? 'warning' : 'default',
      },
      { label: 'Facturas (total)', value: fact.data?.facturasCliente?.total ?? facturas.length },
      { label: 'Terceros', value: terceros.length, to: '/terceros' },
      {
        label: 'Stock bajo',
        value: stock.length,
        to: '/items/stock/consultas',
        tone: stock.length ? 'warning' : 'default',
      },
    ],
    [pendientes, fact.data, facturas, terceros, stock],
  );

  return (
    <DashboardModulo titulo="Mi panel de control" subtitulo="Resumen cruzado por empresa.">
      {error && (
        <Alert color="danger" fade={false}>
          {error.message}
        </Alert>
      )}
      <DashboardKpis items={kpis} loading={loading} />
      <DashboardAtajos
        links={[
          { label: 'Configuración', to: '/configuracion', icon: 'bi bi-gear' },
          { label: 'Nueva factura', to: '/financiero/facturas-clientes/nuevo', icon: 'bi bi-receipt' },
          { label: 'Nuevo tercero', to: '/terceros/nuevo', icon: 'bi bi-person-plus' },
          { label: 'Contabilidad', to: '/contabilidad', icon: 'bi bi-journal-text' },
        ]}
      />
      <Row className="g-3">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <CardBody>
              <CardTitle tag="h5">Facturas cliente recientes</CardTitle>
              <Table size="sm" hover responsive className="mb-0">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Estado</th>
                    <th className="text-end">Pendiente</th>
                  </tr>
                </thead>
                <tbody>
                  {facturas.slice(0, 8).map((f: any) => (
                    <tr key={f.id_factura}>
                      <td>{f.numero_factura || '—'}</td>
                      <td>{f.estado || '—'}</td>
                      <td className="text-end">{Number(f.monto_pendiente ?? 0).toFixed(2)}</td>
                    </tr>
                  ))}
                  {!loading && facturas.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-muted">
                        Sin datos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <CardBody>
              <CardTitle tag="h5">Alertas de stock</CardTitle>
              <Table size="sm" hover responsive className="mb-0">
                <thead>
                  <tr>
                    <th>Ítem</th>
                    <th className="text-end">Cant.</th>
                  </tr>
                </thead>
                <tbody>
                  {stock.slice(0, 8).map((r: any, i: number) => (
                    <tr key={`${r.producto_ref}-${i}`}>
                      <td>
                        {r.producto_ref} — {r.etiqueta}
                      </td>
                      <td className="text-end">{Number(r.cantidad ?? 0).toFixed(2)}</td>
                    </tr>
                  ))}
                  {!loading && stock.length === 0 && (
                    <tr>
                      <td colSpan={2} className="text-muted">
                        Sin alertas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </DashboardModulo>
  );
};

export default DashboardInicio;

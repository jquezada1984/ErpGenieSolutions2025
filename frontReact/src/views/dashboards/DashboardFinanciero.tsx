import React, { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Alert, Card, CardBody, CardTitle, Table } from 'reactstrap';
import DashboardModulo, { DashboardAtajos, DashboardKpis } from './DashboardModulo';
import { useConfigEmpresaScope } from '../../hooks/useConfigEmpresaScope';

const Q = gql`
  query DashboardFinanciero($id_empresa: String!) {
    facturasCliente(id_empresa: $id_empresa, page: 1, limit: 50) {
      total
      items {
        id_factura
        numero_factura
        estado
        total_factura
        monto_pendiente
        fecha_emision
      }
    }
    facturasProveedor(id_empresa: $id_empresa, page: 1, limit: 50) {
      total
      items {
        id_factura
        numero_factura
        estado
        total_factura
        monto_pendiente
        fecha_emision
      }
    }
  }
`;

const DashboardFinanciero: React.FC = () => {
  const { idEmpresa, ready } = useConfigEmpresaScope();
  const { data, loading, error } = useQuery(Q, {
    variables: { id_empresa: idEmpresa },
    skip: !ready,
    fetchPolicy: 'network-only',
  });

  const fc = data?.facturasCliente;
  const fp = data?.facturasProveedor;
  const kpis = useMemo(() => {
    const cli = fc?.items || [];
    const prov = fp?.items || [];
    const vencCli = cli.filter((f: any) => Number(f.monto_pendiente || 0) > 0).length;
    const vencProv = prov.filter((f: any) => Number(f.monto_pendiente || 0) > 0).length;
    return [
      { label: 'Facturas cliente', value: fc?.total ?? cli.length, to: '/financiero/facturas-clientes' },
      { label: 'Pend. cobro', value: vencCli, to: '/financiero/facturas-clientes', tone: vencCli ? 'warning' : 'default' },
      { label: 'Facturas proveedor', value: fp?.total ?? prov.length, to: '/financiero/facturas-proveedor' },
      { label: 'Pend. pago', value: vencProv, to: '/financiero/facturas-proveedor', tone: vencProv ? 'warning' : 'default' },
    ];
  }, [fc, fp]);

  const ultimas = useMemo(() => {
    const cli = (fc?.items || []).map((f: any) => ({ ...f, tipo: 'cliente' }));
    const prov = (fp?.items || []).map((f: any) => ({ ...f, tipo: 'proveedor' }));
    return [...cli, ...prov]
      .sort((a, b) => String(b.fecha_emision || '').localeCompare(String(a.fecha_emision || '')))
      .slice(0, 10);
  }, [fc, fp]);

  return (
    <DashboardModulo titulo="Área Financiero" subtitulo="Facturación, cobros y pagos.">
      {error && (
        <Alert color="danger" fade={false}>
          {error.message}
        </Alert>
      )}
      <DashboardKpis items={kpis} loading={loading} />
      <DashboardAtajos
        links={[
          { label: 'Nueva factura cliente', to: '/financiero/facturas-clientes/nuevo', icon: 'bi bi-receipt' },
          { label: 'Cobros', to: '/financiero/cobros', icon: 'bi bi-cash-coin' },
          { label: 'Pagos', to: '/financiero/pagos', icon: 'bi bi-credit-card' },
          { label: 'Facturas proveedor', to: '/financiero/facturas-proveedor', icon: 'bi bi-file-earmark' },
        ]}
      />
      <Card className="shadow-sm">
        <CardBody>
          <CardTitle tag="h5">Últimas facturas</CardTitle>
          <Table size="sm" hover responsive className="mb-0">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Número</th>
                <th>Estado</th>
                <th className="text-end">Total</th>
                <th className="text-end">Pendiente</th>
              </tr>
            </thead>
            <tbody>
              {ultimas.map((f: any) => (
                <tr key={`${f.tipo}-${f.id_factura}`}>
                  <td>{f.tipo}</td>
                  <td>{f.numero_factura || '—'}</td>
                  <td>{f.estado || '—'}</td>
                  <td className="text-end">{Number(f.total_factura ?? 0).toFixed(2)}</td>
                  <td className="text-end">{Number(f.monto_pendiente ?? 0).toFixed(2)}</td>
                </tr>
              ))}
              {!loading && ultimas.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-muted">
                    Sin facturas.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </DashboardModulo>
  );
};

export default DashboardFinanciero;

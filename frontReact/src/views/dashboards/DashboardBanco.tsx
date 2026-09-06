import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Alert, Card, CardBody, CardTitle, Table } from 'reactstrap';
import DashboardModulo, { DashboardAtajos, DashboardKpis } from './DashboardModulo';
import { useConfigEmpresaScope } from '../../hooks/useConfigEmpresaScope';

const Q = gql`
  query DashboardBanco($id_empresa: ID) {
    cuentasBancarias(id_empresa: $id_empresa) {
      id_cuenta_bancaria
      etiqueta_cuenta
      numero_cuenta
      saldo_actual
      estado
    }
  }
`;

const DashboardBanco: React.FC = () => {
  const { idEmpresa, ready } = useConfigEmpresaScope();
  const { data, loading, error } = useQuery(Q, {
    variables: { id_empresa: idEmpresa },
    skip: !ready,
    fetchPolicy: 'network-only',
  });

  const cuentas = data?.cuentasBancarias || [];
  const activas = cuentas.filter((c: any) => c.estado !== false);
  const saldo = activas.reduce((s: number, c: any) => s + Number(c.saldo_actual || 0), 0);

  return (
    <DashboardModulo titulo="Área Bancos | Cajas" subtitulo="Saldos y cuentas.">
      {error && (
        <Alert color="warning" fade={false}>
          {error.message}. Si la query no existe aún, use el listado de cuentas.
        </Alert>
      )}
      <DashboardKpis
        loading={loading}
        items={[
          { label: 'Cuentas', value: cuentas.length, to: '/banco-cajas/cuentas' },
          { label: 'Activas', value: activas.length },
          { label: 'Saldo total', value: saldo.toFixed(2) },
        ]}
      />
      <DashboardAtajos
        links={[
          { label: 'Cuentas', to: '/banco-cajas/cuentas', icon: 'bi bi-bank' },
          { label: 'Nueva cuenta', to: '/banco-cajas/cuentas/nuevo', icon: 'bi bi-plus' },
          { label: 'Transferencias', to: '/banco-cajas/transferencias', icon: 'bi bi-arrow-left-right' },
          { label: 'Bancos', to: '/banco-cajas/bancos', icon: 'bi bi-building' },
        ]}
      />
      <Card className="shadow-sm">
        <CardBody>
          <CardTitle tag="h5">Cuentas</CardTitle>
          <Table size="sm" hover responsive className="mb-0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th className="text-end">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {cuentas.slice(0, 12).map((c: any) => (
                <tr key={c.id_cuenta_bancaria}>
                  <td>
                    <a href={`/banco-cajas/cuentas/${c.id_cuenta_bancaria}/movimientos`}>
                      {c.etiqueta_cuenta || c.numero_cuenta || c.id_cuenta_bancaria}
                    </a>
                  </td>
                  <td className="text-end">{Number(c.saldo_actual ?? 0).toFixed(2)}</td>
                </tr>
              ))}
              {!loading && cuentas.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-muted">
                    Sin cuentas.
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

export default DashboardBanco;

import React, { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Alert, Card, CardBody, CardTitle, Table } from 'reactstrap';
import DashboardModulo, { DashboardAtajos, DashboardKpis } from './DashboardModulo';
import { useConfigEmpresaScope } from '../../hooks/useConfigEmpresaScope';

const Q = gql`
  query DashboardTerceros($id_empresa: ID) {
    terceros(id_empresa: $id_empresa) {
      id_tercero
      nombre
      cliente
      proveedor
      cliente_potencial
      estado
    }
  }
`;

const DashboardTerceros: React.FC = () => {
  const { idEmpresa, ready } = useConfigEmpresaScope();
  const { data, loading, error } = useQuery(Q, {
    variables: { id_empresa: idEmpresa },
    skip: !ready,
    fetchPolicy: 'network-only',
  });

  const rows = data?.terceros || [];
  const kpis = useMemo(() => {
    const clientes = rows.filter((t: any) => t.cliente).length;
    const proveedores = rows.filter((t: any) => t.proveedor).length;
    const prospectos = rows.filter((t: any) => t.cliente_potencial).length;
    return [
      { label: 'Total terceros', value: rows.length, to: '/terceros' },
      { label: 'Clientes', value: clientes, to: '/clientes' },
      { label: 'Proveedores', value: proveedores, to: '/proveedores' },
      { label: 'Prospectos', value: prospectos, to: '/clientes-potenciales' },
    ];
  }, [rows]);

  const recientes = useMemo(() => rows.slice(0, 8), [rows]);

  return (
    <DashboardModulo titulo="Área Terceros" subtitulo="Resumen de clientes, proveedores y prospectos.">
      {error && (
        <Alert color="danger" fade={false}>
          {error.message}
        </Alert>
      )}
      <DashboardKpis items={kpis} loading={loading} />
      <DashboardAtajos
        links={[
          { label: 'Nuevo tercero', to: '/terceros/nuevo', icon: 'bi bi-person-plus' },
          { label: 'Nuevo cliente', to: '/clientes/nuevo', icon: 'bi bi-person-check' },
          { label: 'Nuevo proveedor', to: '/proveedores/nuevo', icon: 'bi bi-truck' },
          { label: 'Listado', to: '/terceros', icon: 'bi bi-list' },
        ]}
      />
      <Card className="shadow-sm">
        <CardBody>
          <CardTitle tag="h5">Últimos modificados</CardTitle>
          <Table size="sm" hover responsive className="mb-0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {recientes.map((t: any) => (
                <tr key={t.id_tercero}>
                  <td>
                    <a href={`/terceros/editar/${t.id_tercero}`}>{t.nombre}</a>
                  </td>
                  <td className="small text-muted">
                    {[t.cliente && 'Cliente', t.proveedor && 'Proveedor', t.cliente_potencial && 'Prospecto']
                      .filter(Boolean)
                      .join(', ') || '—'}
                  </td>
                </tr>
              ))}
              {!loading && recientes.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-muted">
                    Sin terceros.
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

export default DashboardTerceros;

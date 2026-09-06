import React, { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Alert, Card, CardBody, CardTitle, Table } from 'reactstrap';
import DashboardModulo, { DashboardAtajos, DashboardKpis } from './DashboardModulo';
import { useConfigEmpresaScope } from '../../hooks/useConfigEmpresaScope';

const Q_ITEMS = gql`
  query DashboardProductosItems($id_empresa: ID) {
    itemsListado(id_empresa: $id_empresa) {
      id_item
      producto_ref
      etiqueta
      codigo_tipo_item
    }
  }
`;

const Q_STOCK = gql`
  query DashboardProductosStock($id_empresa: ID!) {
    stockReposicion(id_empresa: $id_empresa) {
      producto_ref
      etiqueta
      cantidad
      stock_minimo
    }
  }
`;

const DashboardProductos: React.FC = () => {
  const { idEmpresa, ready } = useConfigEmpresaScope();
  const itemsQ = useQuery(Q_ITEMS, {
    variables: { id_empresa: idEmpresa },
    skip: !ready,
    fetchPolicy: 'network-only',
  });
  const stockQ = useQuery(Q_STOCK, {
    variables: { id_empresa: idEmpresa },
    skip: !ready,
    fetchPolicy: 'network-only',
  });

  const loading = itemsQ.loading || stockQ.loading;
  const error = itemsQ.error || stockQ.error;
  const items = itemsQ.data?.itemsListado || [];
  const bajo = stockQ.data?.stockReposicion || [];

  const kpis = useMemo(() => {
    const prod = items.filter((i: any) => String(i.codigo_tipo_item || '').toUpperCase() === 'PRODUCT').length;
    const serv = items.filter((i: any) => String(i.codigo_tipo_item || '').toUpperCase() === 'SERVICE').length;
    return [
      { label: 'Ítems', value: items.length, to: '/items/productos' },
      { label: 'Productos', value: prod, to: '/items/productos' },
      { label: 'Servicios', value: serv, to: '/items/servicios' },
      {
        label: 'Stock bajo',
        value: bajo.length,
        to: '/items/stock/consultas',
        tone: bajo.length ? 'warning' : 'default',
      },
    ];
  }, [items, bajo]);

  return (
    <DashboardModulo titulo="Área Productos" subtitulo="Catálogo, stock y accesos rápidos.">
      {error && (
        <Alert color="danger" fade={false}>
          {error.message}
        </Alert>
      )}
      <DashboardKpis items={kpis} loading={loading} />
      <DashboardAtajos
        links={[
          { label: 'Nuevo producto', to: '/items/productos/nuevo', icon: 'bi bi-plus-circle' },
          { label: 'Nuevo servicio', to: '/items/servicios/nuevo', icon: 'bi bi-plus-circle' },
          { label: 'Saldos', to: '/items/productos/stocks', icon: 'bi bi-layers' },
          { label: 'Kardex', to: '/items/stock/movimientos', icon: 'bi bi-arrow-left-right' },
        ]}
      />
      <Card className="shadow-sm mb-3">
        <CardBody>
          <CardTitle tag="h5">Alertas de stock</CardTitle>
          <Table size="sm" hover responsive className="mb-0">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Ítem</th>
                <th className="text-end">Cant.</th>
                <th className="text-end">Mín.</th>
              </tr>
            </thead>
            <tbody>
              {(bajo as any[]).slice(0, 8).map((r, i) => (
                <tr key={`${r.producto_ref}-${i}`}>
                  <td>{r.producto_ref}</td>
                  <td>{r.etiqueta}</td>
                  <td className="text-end">{Number(r.cantidad ?? 0).toFixed(2)}</td>
                  <td className="text-end">{Number(r.stock_minimo ?? 0).toFixed(2)}</td>
                </tr>
              ))}
              {!loading && bajo.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-muted">
                    Sin alertas de reposición.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
      <Card className="shadow-sm">
        <CardBody>
          <CardTitle tag="h5">Ítems (muestra)</CardTitle>
          <Table size="sm" hover responsive className="mb-0">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Etiqueta</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 8).map((i: any) => (
                <tr key={i.id_item}>
                  <td>{i.producto_ref}</td>
                  <td>
                    <a href={`/items/productos/editar/${i.id_item}`}>{i.etiqueta}</a>
                  </td>
                  <td>{i.codigo_tipo_item || '—'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </DashboardModulo>
  );
};

export default DashboardProductos;

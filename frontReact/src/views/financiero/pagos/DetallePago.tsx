import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { Alert, Badge, Button, Card, CardBody, CardTitle, Spinner, Table } from 'reactstrap';
import { useConfigEmpresaScope } from '../../../hooks/useConfigEmpresaScope';
import ConfigEmpresaBar from '../../../components/ConfigEmpresaBar';
import {
  anularCobro,
  anularPagoProveedor,
  validarCobro,
  validarPagoProveedor,
  descargarPdfPago,
} from '../../../_apis_/financiero';
import type { ModoPago } from './ListadoPagos';

const GET_COBRO = gql`
  query CobroClienteDetalle($id_pago: String!, $id_empresa: String!) {
    cobroCliente(id_pago: $id_pago, id_empresa: $id_empresa) {
      id_pago
      numero_pago
      fecha_pago
      estado
      monto
      concepto
      tercero_nombre
      tipo_pago
      id_asiento_contable
      aplicaciones {
        id_pago_factura
        id_factura
        monto_aplicado
        numero_factura
      }
    }
  }
`;

const GET_PAGO_PROV = gql`
  query PagoProveedorDetalle($id_pago: String!, $id_empresa: String!) {
    pagoProveedor(id_pago: $id_pago, id_empresa: $id_empresa) {
      id_pago
      numero_pago
      fecha_pago
      estado
      monto
      concepto
      tercero_nombre
      tipo_pago
      id_asiento_contable
      aplicaciones {
        id_pago_factura
        id_factura
        monto_aplicado
        numero_factura
      }
    }
  }
`;

type Props = { modo: ModoPago };

const DetallePago: React.FC<Props> = ({ modo }) => {
  const { id } = useParams<{ id: string }>();
  const { idEmpresa } = useConfigEmpresaScope();
  const [accion, setAccion] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  const esCobro = modo === 'cobro';
  const base = esCobro
    ? '/financiero/facturas-clientes/pagos'
    : '/financiero/facturas-proveedor/pagos';
  const facturaBase = esCobro
    ? '/financiero/facturas-clientes'
    : '/financiero/facturas-proveedor';
  const tituloTipo = esCobro ? 'Cobro' : 'Pago proveedor';

  const { data, loading, error, refetch } = useQuery(esCobro ? GET_COBRO : GET_PAGO_PROV, {
    variables: { id_pago: id, id_empresa: idEmpresa },
    skip: !id || !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const p = esCobro ? data?.cobroCliente : data?.pagoProveedor;

  const ejecutar = async (tipo: 'validar' | 'anular') => {
    if (!id) return;
    if (tipo === 'anular' && !window.confirm(`¿Anular este ${tituloTipo.toLowerCase()}?`)) return;
    setAccion(true);
    setMensaje(null);
    setErrorAccion(null);
    try {
      if (tipo === 'validar') {
        if (esCobro) await validarCobro(id);
        else await validarPagoProveedor(id);
        setMensaje(
          `${tituloTipo} validado. Se registró el movimiento de banco y se encoló la contabilización (RabbitMQ).`,
        );
      } else if (esCobro) {
        await anularCobro(id);
        setMensaje(`${tituloTipo} anulado.`);
      } else {
        await anularPagoProveedor(id);
        setMensaje(`${tituloTipo} anulado.`);
      }
      await refetch();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      const d = ex.response?.data;
      setErrorAccion(typeof d === 'string' ? d : JSON.stringify(d) || ex.message || 'Error');
    } finally {
      setAccion(false);
    }
  };

  if (!idEmpresa) {
    return (
      <Card>
        <CardBody>
          <ConfigEmpresaBar hideWhenEmpresa emptyMessage="Seleccione una empresa." />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <ConfigEmpresaBar hideWhenEmpresa />
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <CardTitle tag="h4" className="mb-0">
            {tituloTipo} {p?.numero_pago || id}
          </CardTitle>
          <div className="d-flex gap-2">
            {p?.estado === 'BORRADOR' && (
              <Button color="success" disabled={accion} onClick={() => ejecutar('validar')}>
                Validar
              </Button>
            )}
            {p && (
              <Button
                color="info"
                outline
                disabled={accion}
                onClick={async () => {
                  if (!id) return;
                  setAccion(true);
                  try {
                    await descargarPdfPago(id);
                  } catch (err: unknown) {
                    const ex = err as { message?: string };
                    setErrorAccion(ex.message || 'Error PDF');
                  } finally {
                    setAccion(false);
                  }
                }}
              >
                PDF
              </Button>
            )}
            {p && p.estado !== 'ANULADA' && (
              <Button color="danger" outline disabled={accion} onClick={() => ejecutar('anular')}>
                Anular
              </Button>
            )}
            <Button color="secondary" outline tag={Link} to={base}>
              Listado
            </Button>
          </div>
        </div>

        {mensaje && <Alert color="success">{mensaje}</Alert>}
        {errorAccion && <Alert color="danger">{errorAccion}</Alert>}
        {error && <Alert color="danger">Error al cargar</Alert>}
        {loading && <Spinner />}

        {p && (
          <>
            <p>
              <Badge color={p.estado === 'VALIDADA' ? 'success' : p.estado === 'ANULADA' ? 'danger' : 'secondary'}>
                {p.estado}
              </Badge>{' '}
              {esCobro ? 'Cliente' : 'Proveedor'}: <strong>{p.tercero_nombre}</strong> · Fecha:{' '}
              {p.fecha_pago} · Monto: <strong>{Number(p.monto).toFixed(2)}</strong>
            </p>
            {p.concepto && <p className="text-muted">{p.concepto}</p>}
            <h6>Aplicado a facturas</h6>
            <Table responsive size="sm" bordered>
              <thead>
                <tr>
                  <th>Factura</th>
                  <th className="text-end">Monto aplicado</th>
                </tr>
              </thead>
              <tbody>
                {(p.aplicaciones || []).map(
                  (a: {
                    id_pago_factura: string;
                    id_factura: string;
                    numero_factura?: string | null;
                    monto_aplicado: string;
                  }) => (
                    <tr key={a.id_pago_factura}>
                      <td>
                        <Link to={`${facturaBase}/${a.id_factura}`}>
                          {a.numero_factura || a.id_factura}
                        </Link>
                      </td>
                      <td className="text-end">{Number(a.monto_aplicado).toFixed(2)}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </Table>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default DetallePago;

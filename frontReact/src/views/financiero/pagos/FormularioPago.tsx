import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import AsyncSelect from 'react-select/async';
import type { SingleValue, StylesConfig, GroupBase } from 'react-select';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
  Table,
} from 'reactstrap';
import { useConfigEmpresaScope } from '../../../hooks/useConfigEmpresaScope';
import ConfigEmpresaBar from '../../../components/ConfigEmpresaBar';
import { crearCobro, crearPagoProveedor } from '../../../_apis_/financiero';
import type { ModoPago } from './ListadoPagos';

type TerceroOpcion = { value: string; label: string };
type FacturaPendiente = {
  id_factura: string;
  numero_factura?: string | null;
  fecha_factura: string;
  total_factura?: string | null;
  monto_pendiente?: string | null;
};

const GET_CLIENTES_BUSQUEDA = gql`
  query ClientesBusquedaNuevoPago($id_empresa: ID!, $busqueda: String, $limite: Int) {
    clientesBusqueda(id_empresa: $id_empresa, busqueda: $busqueda, limite: $limite) {
      id_tercero
      nombre
      apodo
      codigo_cliente
      id_empresa
    }
  }
`;

const GET_PROVEEDORES_BUSQUEDA = gql`
  query ProveedoresBusquedaNuevoPago($id_empresa: ID!, $busqueda: String, $limite: Int) {
    proveedoresBusqueda(id_empresa: $id_empresa, busqueda: $busqueda, limite: $limite) {
      id_tercero
      nombre
      apodo
      codigo_proveedor
      id_empresa
    }
  }
`;

const GET_FACTURAS_CLIENTE = gql`
  query FacturasPendientesCobro($id_empresa: String!, $id_tercero: String, $solo_pendientes: Boolean) {
    facturasCliente(
      id_empresa: $id_empresa
      page: 1
      limit: 100
      id_tercero: $id_tercero
      solo_pendientes: $solo_pendientes
    ) {
      items {
        id_factura
        numero_factura
        fecha_factura
        total_factura
        monto_pendiente
      }
    }
  }
`;

const GET_FACTURAS_PROV = gql`
  query FacturasPendientesPagoProv(
    $id_empresa: String!
    $id_tercero: String
    $solo_pendientes: Boolean
  ) {
    facturasProveedor(
      id_empresa: $id_empresa
      page: 1
      limit: 100
      id_tercero: $id_tercero
      solo_pendientes: $solo_pendientes
    ) {
      items {
        id_factura
        numero_factura
        fecha_factura
        total_factura
        monto_pendiente
      }
    }
  }
`;

const GET_CATALOGOS = gql`
  query CatalogosNuevoPago {
    monedasFin {
      id_moneda
      codigo
      nombre
    }
  }
`;

const GET_CUENTAS = gql`
  query CuentasBancariasNuevoPago($id_empresa: ID) {
    cuentasBancarias(id_empresa: $id_empresa) {
      id_cuenta_bancaria
      etiqueta_cuenta
      numero_cuenta
    }
  }
`;

const etiquetaTercero = (row: {
  nombre: string;
  apodo?: string | null;
  codigo_cliente?: string | null;
  codigo_proveedor?: string | null;
}) => {
  const codigo = row.codigo_cliente
    ? `#${row.codigo_cliente}`
    : row.codigo_proveedor
      ? `#${row.codigo_proveedor}`
      : '';
  const nombreMostrar = row.apodo?.trim() || row.nombre;
  return `${codigo} ${nombreMostrar}`.trim() || row.nombre;
};

type Props = { modo: ModoPago };

const FormularioPago: React.FC<Props> = ({ modo }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const client = useApolloClient();
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scope = useConfigEmpresaScope();
  const { idEmpresa } = scope;

  const esCobro = modo === 'cobro';
  const base = esCobro
    ? '/financiero/facturas-clientes/pagos'
    : '/financiero/facturas-proveedor/pagos';
  const titulo = esCobro ? 'Nuevo cobro' : 'Nuevo pago a proveedor';
  const terceroLabel = esCobro ? 'Cliente' : 'Proveedor';

  const preIdTercero = params.get('id_tercero') || '';
  const preNombre = params.get('tercero_nombre') || '';
  const preIdFactura = params.get('id_factura') || '';
  const preNumero = params.get('numero_factura') || '';
  const preMonto = params.get('monto') || '';

  const [terceroOpcion, setTerceroOpcion] = useState<TerceroOpcion | null>(
    preIdTercero
      ? { value: preIdTercero, label: preNombre || preIdTercero }
      : null,
  );
  const [fechaPago, setFechaPago] = useState(() => new Date().toISOString().slice(0, 10));
  const [idCuentaBancaria, setIdCuentaBancaria] = useState('');
  const [idMoneda, setIdMoneda] = useState('');
  const [concepto, setConcepto] = useState('');
  const [montos, setMontos] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);

  const { data: catData } = useQuery(GET_CATALOGOS, {
    skip: !idEmpresa,
  });
  const { data: cuentasData } = useQuery(GET_CUENTAS, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
  });

  const idTercero = terceroOpcion?.value || '';
  const { data: facData, loading: loadingFac } = useQuery(
    esCobro ? GET_FACTURAS_CLIENTE : GET_FACTURAS_PROV,
    {
      variables: {
        id_empresa: idEmpresa,
        id_tercero: idTercero || null,
        solo_pendientes: true,
      },
      skip: !idEmpresa || !idTercero,
      fetchPolicy: 'network-only',
    },
  );

  const cuentas = cuentasData?.cuentasBancarias || [];
  const monedas = catData?.monedasFin || [];
  const facturas: FacturaPendiente[] = esCobro
    ? facData?.facturasCliente?.items || []
    : facData?.facturasProveedor?.items || [];

  useEffect(() => {
    if (!idMoneda && monedas.length) setIdMoneda(monedas[0].id_moneda);
  }, [monedas, idMoneda]);

  useEffect(() => {
    if (!idCuentaBancaria && cuentas.length) setIdCuentaBancaria(cuentas[0].id_cuenta_bancaria);
  }, [cuentas, idCuentaBancaria]);

  useEffect(() => {
    const next: Record<string, string> = {};
    facturas.forEach((f) => {
      const pend = Number(f.monto_pendiente || 0).toFixed(2);
      if (preIdFactura) {
        next[f.id_factura] = f.id_factura === preIdFactura ? preMonto || pend : '0';
      } else {
        next[f.id_factura] = pend;
      }
    });
    if (preIdFactura && !facturas.some((f) => f.id_factura === preIdFactura)) {
      next[preIdFactura] = preMonto || '0';
    }
    setMontos(next);
  }, [facturas, preIdFactura, preMonto]);

  const selectStyles = useMemo<StylesConfig<TerceroOpcion, false, GroupBase<TerceroOpcion>>>(
    () => ({
      container: (baseStyle) => ({ ...baseStyle, flex: '1 1 auto', minWidth: 0 }),
      control: (baseStyle, state) => ({
        ...baseStyle,
        minHeight: 38,
        borderRadius: '0.375rem',
        borderColor: state.isFocused ? '#86b7fe' : '#ced4da',
        boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(13,110,253,.25)' : 'none',
      }),
      menuPortal: (baseStyle) => ({ ...baseStyle, zIndex: 9999 }),
    }),
    [],
  );

  const loadTerceroOptions = useCallback(
    (inputValue: string): Promise<TerceroOpcion[]> =>
      new Promise((resolve) => {
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        if (!idEmpresa) {
          resolve([]);
          return;
        }
        const t = inputValue.trim();
        if (t.length < 2) {
          resolve([]);
          return;
        }
        searchTimerRef.current = setTimeout(async () => {
          try {
            const { data } = await client.query({
              query: esCobro ? GET_CLIENTES_BUSQUEDA : GET_PROVEEDORES_BUSQUEDA,
              variables: { id_empresa: idEmpresa, busqueda: t, limite: 50 },
              fetchPolicy: 'network-only',
              context: { headers: { 'X-Company-Id': idEmpresa } },
            });
            const rows = esCobro ? data?.clientesBusqueda : data?.proveedoresBusqueda;
            resolve(
              (rows || [])
                .filter((r: { id_empresa?: string | null }) => !r.id_empresa || r.id_empresa === idEmpresa)
                .map(
                (r: {
                  id_tercero: string;
                  nombre: string;
                  apodo?: string | null;
                  codigo_cliente?: string | null;
                  codigo_proveedor?: string | null;
                }) => ({
                  value: r.id_tercero,
                  label: etiquetaTercero(r),
                }),
              ),
            );
          } catch {
            resolve([]);
          }
        }, 320);
      }),
    [client, idEmpresa, esCobro],
  );

  const totalAplicado = Object.values(montos).reduce((acc, v) => acc + (Number(v) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    if (!idEmpresa) {
      setMensaje({ tipo: 'error', texto: 'Seleccione una empresa.' });
      return;
    }
    if (!idTercero) {
      setMensaje({ tipo: 'error', texto: `Seleccione un ${terceroLabel.toLowerCase()}.` });
      return;
    }
    if (!idCuentaBancaria) {
      setMensaje({ tipo: 'error', texto: 'Seleccione una cuenta bancaria.' });
      return;
    }
    if (!idMoneda) {
      setMensaje({ tipo: 'error', texto: 'Seleccione una moneda.' });
      return;
    }
    const aplicaciones = Object.entries(montos)
      .filter(([, m]) => Number(m) > 0)
      .map(([id_factura, monto_aplicado]) => ({
        id_factura,
        monto_aplicado: Number(monto_aplicado),
      }));
    if (!aplicaciones.length) {
      setMensaje({ tipo: 'error', texto: 'Aplique al menos una factura con monto mayor a 0.' });
      return;
    }

    const body = {
      id_empresa: idEmpresa,
      id_tercero: idTercero,
      id_cuenta_bancaria: idCuentaBancaria,
      id_moneda: idMoneda,
      fecha_pago: fechaPago,
      concepto: concepto || undefined,
      aplicaciones,
    };

    setGuardando(true);
    try {
      const data = esCobro
        ? ((await crearCobro(body)) as { id_pago?: string })
        : ((await crearPagoProveedor(body)) as { id_pago?: string });
      const idPago = data?.id_pago;
      if (idPago) navigate(`${base}/${idPago}`);
      else setMensaje({ tipo: 'ok', texto: 'Borrador creado.' });
    } catch (err: unknown) {
      const ex = err as { response?: { data?: { error?: unknown } }; message?: string };
      const texto =
        ex?.response?.data?.error ||
        (typeof ex?.response?.data === 'object' && JSON.stringify(ex.response.data)) ||
        ex?.message ||
        'Error al crear.';
      setMensaje({ tipo: 'error', texto: String(texto) });
    } finally {
      setGuardando(false);
    }
  };

  const filas: FacturaPendiente[] =
    facturas.length > 0
      ? facturas
      : preIdFactura
        ? [
            {
              id_factura: preIdFactura,
              numero_factura: preNumero,
              fecha_factura: '',
              monto_pendiente: preMonto,
            },
          ]
        : [];

  return (
    <div className="p-3">
      <Card className="shadow-sm">
        <CardBody>
          <CardTitle tag="h4" className="mb-4">
            {titulo}
          </CardTitle>
          <ConfigEmpresaBar
            scope={scope}
            hideWhenEmpresa
            emptyMessage="Seleccione una empresa."
          />
          {mensaje && (
            <Alert color={mensaje.tipo === 'ok' ? 'success' : 'danger'}>{mensaje.texto}</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3 align-items-center">
              <Col md={3}>
                <Label className="fw-semibold">{terceroLabel}</Label>
              </Col>
              <Col md={9}>
                <AsyncSelect<TerceroOpcion, false, GroupBase<TerceroOpcion>>
                  key={`${modo}-${idEmpresa || 'sin-empresa'}`}
                  instanceId={`nuevo-pago-${modo}`}
                  placeholder={`Buscar ${terceroLabel.toLowerCase()} (mínimo 2 caracteres)…`}
                  isClearable
                  cacheOptions={false}
                  defaultOptions={false}
                  value={terceroOpcion}
                  loadOptions={loadTerceroOptions}
                  onChange={(opt: SingleValue<TerceroOpcion>) => setTerceroOpcion(opt)}
                  styles={selectStyles}
                  menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                  menuPosition="fixed"
                  isDisabled={!idEmpresa}
                  noOptionsMessage={(p) =>
                    p.inputValue.trim().length >= 2 ? 'Sin resultados.' : 'Escriba al menos 2 caracteres.'
                  }
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <Label>Fecha</Label>
              </Col>
              <Col md={9}>
                <Input
                  type="date"
                  value={fechaPago}
                  onChange={(e) => setFechaPago(e.target.value)}
                  style={{ maxWidth: 220 }}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <Label>Cuenta bancaria</Label>
              </Col>
              <Col md={9}>
                <Input
                  type="select"
                  value={idCuentaBancaria}
                  onChange={(e) => setIdCuentaBancaria(e.target.value)}
                  disabled={!idEmpresa}
                >
                  <option value="">—</option>
                  {cuentas.map(
                    (c: {
                      id_cuenta_bancaria: string;
                      etiqueta_cuenta?: string;
                      numero_cuenta?: string;
                    }) => (
                      <option key={c.id_cuenta_bancaria} value={c.id_cuenta_bancaria}>
                        {c.etiqueta_cuenta || c.numero_cuenta || c.id_cuenta_bancaria}
                      </option>
                    ),
                  )}
                </Input>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <Label>Moneda</Label>
              </Col>
              <Col md={9}>
                <Input type="select" value={idMoneda} onChange={(e) => setIdMoneda(e.target.value)}>
                  <option value="">—</option>
                  {monedas.map((m: { id_moneda: string; codigo: string; nombre: string }) => (
                    <option key={m.id_moneda} value={m.id_moneda}>
                      {m.nombre} ({m.codigo})
                    </option>
                  ))}
                </Input>
              </Col>
            </Row>

            <FormGroup>
              <Label>Concepto</Label>
              <Input
                type="textarea"
                rows={2}
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
              />
            </FormGroup>

            <h5 className="mt-3">Facturas pendientes</h5>
            {!idTercero && (
              <Alert color="info">Seleccione un {terceroLabel.toLowerCase()} para ver facturas pendientes.</Alert>
            )}
            {idTercero && loadingFac && <Spinner size="sm" />}
            {idTercero && !loadingFac && filas.length === 0 && (
              <Alert color="warning">No hay facturas validadas con saldo pendiente.</Alert>
            )}
            {filas.length > 0 && (
              <Table size="sm" bordered responsive>
                <thead>
                  <tr>
                    <th>Factura</th>
                    <th>Fecha</th>
                    <th className="text-end">Pendiente</th>
                    <th style={{ width: 140 }} className="text-end">
                      Aplicar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map((f) => (
                    <tr key={f.id_factura}>
                      <td>{f.numero_factura || f.id_factura}</td>
                      <td>{f.fecha_factura || '—'}</td>
                      <td className="text-end">
                        {Number(f.monto_pendiente || 0).toFixed(2)}
                      </td>
                      <td>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={montos[f.id_factura] ?? ''}
                          onChange={(e) =>
                            setMontos((prev) => ({ ...prev, [f.id_factura]: e.target.value }))
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-end fw-bold">
                      Total
                    </td>
                    <td className="text-end fw-bold">{totalAplicado.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </Table>
            )}

            <div className="d-flex gap-2 justify-content-center mt-3">
              <Button color="primary" type="submit" disabled={guardando || !idEmpresa}>
                {guardando ? <Spinner size="sm" /> : 'CREAR BORRADOR'}
              </Button>
              <Button color="secondary" outline tag={Link} to={base} disabled={guardando}>
                LISTADO
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default FormularioPago;

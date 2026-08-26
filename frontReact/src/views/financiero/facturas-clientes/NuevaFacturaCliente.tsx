import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import AsyncSelect from 'react-select/async';
import type { SingleValue, StylesConfig, GroupBase } from 'react-select';
import { Link, useNavigate } from 'react-router-dom';
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
} from 'reactstrap';
import { useConfigEmpresaScope } from '../../../hooks/useConfigEmpresaScope';
import ConfigEmpresaBar from '../../../components/ConfigEmpresaBar';
import { crearFacturaCliente } from '../../../_apis_/financiero';
import FacturaLineasEditor, {
  toApiLineas,
  type LineaFacturaDraft,
} from '../lineas/FacturaLineasEditor';

type ClienteOpcion = { value: string; label: string };

const GET_CLIENTES_BUSQUEDA = gql`
  query ClientesBusquedaNuevaFactura($id_empresa: ID!, $busqueda: String, $limite: Int) {
    clientesBusqueda(id_empresa: $id_empresa, busqueda: $busqueda, limite: $limite) {
      id_tercero
      nombre
      apodo
      codigo_cliente
      id_empresa
    }
  }
`;

const GET_FINANCIERO_CATALOGOS = gql`
  query FinancieroCatalogosNuevaFactura($id_empresa: String) {
    condicionesPagoFin(id_empresa: $id_empresa) {
      id_condicion_pago
      etiqueta
      descripcion
    }
    formasPagoFin(id_empresa: $id_empresa) {
      id_forma_pago
      etiqueta
      descripcion
    }
    monedasFin {
      id_moneda
      codigo
      nombre
    }
  }
`;

/** Cuentas bancarias desde BancoCajaNestJs (no Financiero). */
const GET_CUENTAS_BANCARIAS = gql`
  query CuentasBancariasNuevaFactura($id_empresa: ID) {
    cuentasBancarias(id_empresa: $id_empresa) {
      id_cuenta_bancaria
      etiqueta_cuenta
      numero_cuenta
      iban
    }
  }
`;

const etiquetaCliente = (row: {
  nombre: string;
  apodo?: string | null;
  codigo_cliente?: string | null;
}) => {
  const codigo = row.codigo_cliente ? `#${row.codigo_cliente}` : '';
  const nombreMostrar = row.apodo?.trim() || row.nombre;
  return `${codigo} ${nombreMostrar}`.trim() || row.nombre;
};

const ORIGEN_OPCIONES = [
  { value: '', label: '(ninguno)' },
  { value: 'pedido', label: 'Pedido' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'prospecto', label: 'Prospecto / lead' },
  { value: 'manual', label: 'Manual' },
];

/**
 * Nueva factura cliente — cabecera borrador (estilo Dolibarr).
 * Ruta: /financiero/facturas-clientes/nueva
 */
const NuevaFacturaCliente = () => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevIdEmpresaRef = useRef<string | null>(null);

  const scope = useConfigEmpresaScope();
  const { idEmpresa } = scope;

  const { data: catData, loading: loadingCat, error: errorCat } = useQuery(GET_FINANCIERO_CATALOGOS, {
    variables: { id_empresa: idEmpresa || undefined },
    skip: !idEmpresa,
  });

  const {
    data: cuentasData,
    loading: loadingCuentas,
    error: errorCuentas,
  } = useQuery(GET_CUENTAS_BANCARIAS, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
  });

  const [clienteOpcion, setClienteOpcion] = useState<ClienteOpcion | null>(null);
  const [tipoFactura, setTipoFactura] = useState('estandar');
  const [fechaFactura, setFechaFactura] = useState(() => new Date().toISOString().slice(0, 10));
  const [idCondicionPago, setIdCondicionPago] = useState('');
  const [idFormaPago, setIdFormaPago] = useState('');
  const [idCuentaBancaria, setIdCuentaBancaria] = useState('');
  const [origen, setOrigen] = useState('');
  const [idProyecto, setIdProyecto] = useState('');
  const [categoriasTexto, setCategoriasTexto] = useState('');
  const [plantillaDocumento, setPlantillaDocumento] = useState('crabe');
  const [idMoneda, setIdMoneda] = useState('');
  const [notaPublica, setNotaPublica] = useState('');
  const [notaPrivada, setNotaPrivada] = useState('');

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const [lineas, setLineas] = useState<LineaFacturaDraft[]>([]);

  useEffect(() => {
    if (prevIdEmpresaRef.current === null) {
      prevIdEmpresaRef.current = idEmpresa;
      return;
    }
    if (prevIdEmpresaRef.current === idEmpresa) return;
    prevIdEmpresaRef.current = idEmpresa;
    setClienteOpcion(null);
    setIdCondicionPago('');
    setIdFormaPago('');
    setIdCuentaBancaria('');
  }, [idEmpresa]);

  const cuentas = cuentasData?.cuentasBancarias || [];
  const condiciones = catData?.condicionesPagoFin || [];
  const formas = catData?.formasPagoFin || [];
  const monedas = catData?.monedasFin || [];

  const loading = Boolean(idEmpresa) && (loadingCat || loadingCuentas);
  const errorGql = errorCat || errorCuentas;

  const selectStyles = useMemo<StylesConfig<ClienteOpcion, false, GroupBase<ClienteOpcion>>>(
    () => ({
      container: (base) => ({ ...base, flex: '1 1 auto', minWidth: 0 }),
      control: (base, state) => ({
        ...base,
        minHeight: 38,
        borderRadius: '0.375rem',
        borderColor: state.isFocused ? '#86b7fe' : '#ced4da',
        boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(13,110,253,.25)' : 'none',
      }),
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    }),
    [],
  );

  const loadClienteOptions = useCallback(
    (inputValue: string): Promise<ClienteOpcion[]> =>
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
            const { data } = await client.query<{
              clientesBusqueda: Array<{
                id_tercero: string;
                nombre: string;
                apodo?: string | null;
                codigo_cliente?: string | null;
                id_empresa?: string | null;
              }>;
            }>({
              query: GET_CLIENTES_BUSQUEDA,
              variables: {
                id_empresa: idEmpresa,
                busqueda: t,
                limite: 50,
              },
              fetchPolicy: 'network-only',
              context: { headers: { 'X-Company-Id': idEmpresa } },
            });

            resolve(
              (data?.clientesBusqueda || [])
                .filter((r) => !r.id_empresa || r.id_empresa === idEmpresa)
                .map((r) => ({
                  value: r.id_tercero,
                  label: etiquetaCliente(r),
                })),
            );
          } catch {
            resolve([]);
          }
        }, 320);
      }),
    [client, idEmpresa],
  );

  const labelCol = { md: 4, lg: 3 };
  const inputCol = { md: 8, lg: 9 };

  const handleAhora = () => {
    setFechaFactura(new Date().toISOString().slice(0, 10));
  };

  const handleCrearBorrador = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    if (!idEmpresa) {
      setMensaje({ tipo: 'error', texto: 'Seleccione una empresa para crear la factura.' });
      return;
    }
    if (!clienteOpcion?.value) {
      setMensaje({ tipo: 'error', texto: 'Seleccione un cliente (autocompletar).' });
      return;
    }

    const categorias = categoriasTexto
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const body: Record<string, unknown> = {
      id_tercero: clienteOpcion.value,
      tipo_factura: tipoFactura,
      fecha_factura: fechaFactura,
      plantilla_documento: plantillaDocumento || 'crabe',
      categorias,
    };
    if (idCondicionPago) body.id_condicion_pago = idCondicionPago;
    if (idFormaPago) body.id_forma_pago = idFormaPago;
    if (idCuentaBancaria) body.id_cuenta_bancaria = idCuentaBancaria;
    if (origen) body.origen = origen;
    if (idProyecto.trim()) body.id_proyecto = idProyecto.trim();
    if (idMoneda) body.id_moneda = idMoneda;
    if (notaPublica) body.nota_publica = notaPublica;
    if (notaPrivada) body.nota_privada = notaPrivada;

    const lineasPayload = toApiLineas(lineas);
    if (!lineasPayload.length) {
      setMensaje({ tipo: 'error', texto: 'Añada al menos una línea (AÑADIR) antes de crear el borrador.' });
      return;
    }
    body.lineas = lineasPayload;

    setGuardando(true);
    try {
      const data = (await crearFacturaCliente(body)) as { id_factura?: string };
      const idFactura = data?.id_factura;
      setMensaje({
        tipo: 'ok',
        texto: idFactura ? `Borrador creado.` : 'Borrador creado correctamente.',
      });
      if (idFactura) navigate(`/financiero/facturas-clientes/${idFactura}`);
    } catch (err: any) {
      const texto =
        err?.response?.data?.error ||
        (typeof err?.response?.data === 'object' && JSON.stringify(err.response.data)) ||
        err?.message ||
        'Error al crear borrador.';
      setMensaje({ tipo: 'error', texto: String(texto) });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="p-3">
      <Card className="shadow-sm">
        <CardBody>
          <CardTitle tag="h4" className="mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-file-earmark-text" /> Nueva factura cliente
          </CardTitle>

          <ConfigEmpresaBar
            scope={scope}
            hideWhenEmpresa
            emptyMessage="Seleccione una empresa para crear la factura."
          />

          {errorGql && (
            <Alert color="danger" fade={false} timeout={0}>
              Error cargando datos: {errorGql.message}
            </Alert>
          )}
          {mensaje && (
            <Alert color={mensaje.tipo === 'ok' ? 'success' : 'danger'} fade={false} timeout={0}>
              {mensaje.texto}
            </Alert>
          )}

          {loading && (
            <div className="text-center py-5">
              <Spinner color="primary" /> Cargando…
            </div>
          )}

          {!loading && (
            <Form onSubmit={handleCrearBorrador}>
              <Row className="mb-2">
                <Col {...labelCol}>
                  <Label className="fw-semibold text-primary">Ref.</Label>
                </Col>
                <Col {...inputCol}>
                  <div className="form-control-plaintext">Borrador</div>
                </Col>
              </Row>

              <Row className="mb-3 align-items-center">
                <Col {...labelCol}>
                  <Label className="fw-semibold text-primary">Cliente</Label>
                </Col>
                <Col {...inputCol} className="d-flex gap-2 align-items-center">
                  <AsyncSelect<ClienteOpcion, false, GroupBase<ClienteOpcion>>
                    key={idEmpresa || 'sin-empresa'}
                    instanceId="nueva-factura-cliente-tercero"
                    aria-label="Buscar cliente"
                    placeholder="Buscar cliente (mínimo 2 caracteres)…"
                    isClearable
                    cacheOptions={false}
                    defaultOptions={false}
                    value={clienteOpcion}
                    loadOptions={loadClienteOptions}
                    onChange={(opt: SingleValue<ClienteOpcion>) => setClienteOpcion(opt)}
                    styles={selectStyles}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                    menuPosition="fixed"
                    isDisabled={!idEmpresa}
                    loadingMessage={() => 'Buscando…'}
                    noOptionsMessage={(p) =>
                      idEmpresa
                        ? p.inputValue.trim().length >= 2
                          ? 'Sin resultados.'
                          : 'Escriba al menos 2 caracteres.'
                        : 'Sin empresa.'
                    }
                  />
                  <Button tag={Link} to="/clientes/nuevo" color="link" className="p-0" title="Nuevo cliente">
                    <i className="bi bi-plus-circle fs-4" />
                  </Button>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col {...labelCol}>
                  <Label className="fw-semibold text-primary">Tipo</Label>
                </Col>
                <Col {...inputCol}>
                  {[
                    { v: 'estandar', l: 'Factura estándar' },
                    { v: 'anticipo', l: 'Factura de anticipo' },
                    { v: 'rectificativa', l: 'Factura rectificativa' },
                    { v: 'abono', l: 'Abono' },
                    { v: 'plantilla', l: 'Plantilla de factura' },
                  ].map((opt) => (
                    <FormGroup check key={opt.v}>
                      <Label check>
                        <Input
                          type="radio"
                          name="tipoFactura"
                          checked={tipoFactura === opt.v}
                          onChange={() => setTipoFactura(opt.v)}
                        />{' '}
                        {opt.l}
                      </Label>
                    </FormGroup>
                  ))}
                </Col>
              </Row>

              <Row className="mb-3 align-items-center">
                <Col {...labelCol}>
                  <Label className="fw-semibold text-primary">Fecha facturación</Label>
                </Col>
                <Col {...inputCol} className="d-flex gap-2 align-items-center flex-wrap">
                  <Input
                    type="date"
                    value={fechaFactura}
                    onChange={(ev) => setFechaFactura(ev.target.value)}
                    style={{ maxWidth: 200 }}
                  />
                  <Button type="button" color="link" className="p-0" onClick={handleAhora}>
                    Ahora
                  </Button>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col {...labelCol}>
                  <Label className="fw-semibold text-primary">Condiciones de pago</Label>
                </Col>
                <Col {...inputCol}>
                  <Input type="select" value={idCondicionPago} onChange={(e) => setIdCondicionPago(e.target.value)} disabled={!idEmpresa}>
                    <option value="">—</option>
                    {condiciones.map((x: { id_condicion_pago: string; etiqueta?: string; descripcion?: string }) => (
                      <option key={x.id_condicion_pago} value={x.id_condicion_pago}>
                        {x.etiqueta || x.descripcion}
                      </option>
                    ))}
                  </Input>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col {...labelCol}>
                  <Label className="fw-semibold text-primary">Forma de pago</Label>
                </Col>
                <Col {...inputCol}>
                  <Input type="select" value={idFormaPago} onChange={(e) => setIdFormaPago(e.target.value)} disabled={!idEmpresa}>
                    <option value="">—</option>
                    {formas.map((x: { id_forma_pago: string; etiqueta?: string; descripcion?: string }) => (
                      <option key={x.id_forma_pago} value={x.id_forma_pago}>
                        {x.etiqueta || x.descripcion}
                      </option>
                    ))}
                  </Input>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col {...labelCol}>
                  <Label className="fw-semibold text-primary">Cuenta bancaria predeterminada</Label>
                </Col>
                <Col {...inputCol}>
                  <Input type="select" value={idCuentaBancaria} onChange={(e) => setIdCuentaBancaria(e.target.value)} disabled={!idEmpresa}>
                    <option value="">—</option>
                    {cuentas.map((c: { id_cuenta_bancaria: string; etiqueta_cuenta?: string; numero_cuenta?: string }) => (
                      <option key={c.id_cuenta_bancaria} value={c.id_cuenta_bancaria}>
                        {c.etiqueta_cuenta || c.numero_cuenta || c.id_cuenta_bancaria}
                      </option>
                    ))}
                  </Input>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col {...labelCol}>
                  <Label className="fw-semibold text-primary">Origen</Label>
                </Col>
                <Col {...inputCol}>
                  <Input type="select" value={origen} onChange={(e) => setOrigen(e.target.value)}>
                    {ORIGEN_OPCIONES.map((o) => (
                      <option key={o.value || 'none'} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Input>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col {...labelCol}>
                  <Label className="fw-semibold text-primary">Proyecto</Label>
                </Col>
                <Col {...inputCol} className="d-flex gap-2">
                  <Input
                    type="text"
                    placeholder="UUID de proyecto (opcional)"
                    value={idProyecto}
                    onChange={(e) => setIdProyecto(e.target.value)}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col {...labelCol}>
                  <Label className="fw-semibold text-primary">Etiquetas / categorías</Label>
                </Col>
                <Col {...inputCol}>
                  <Input
                    type="text"
                    placeholder="Separadas por coma"
                    value={categoriasTexto}
                    onChange={(e) => setCategoriasTexto(e.target.value)}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col {...labelCol}>
                  <Label className="fw-semibold text-primary">Plantilla documento</Label>
                </Col>
                <Col {...inputCol}>
                  <Input
                    type="text"
                    value={plantillaDocumento}
                    onChange={(e) => setPlantillaDocumento(e.target.value)}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col {...labelCol}>
                  <Label className="fw-semibold text-primary">Divisa</Label>
                </Col>
                <Col {...inputCol}>
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

              <Row className="mb-3">
                <Col {...labelCol}>
                  <Label className="fw-semibold text-primary">Nota (pública)</Label>
                </Col>
                <Col {...inputCol}>
                  <Input type="textarea" rows={3} value={notaPublica} onChange={(e) => setNotaPublica(e.target.value)} />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col {...labelCol}>
                  <Label className="fw-semibold text-primary">Nota (privada)</Label>
                </Col>
                <Col {...inputCol}>
                  <Input type="textarea" rows={3} value={notaPrivada} onChange={(e) => setNotaPrivada(e.target.value)} />
                </Col>
              </Row>

              <h5 className="mb-2">Líneas</h5>
              <div className="mb-4">
                <FacturaLineasEditor
                  idEmpresa={idEmpresa}
                  lineas={lineas}
                  onChange={setLineas}
                  editable
                />
              </div>

              <div className="text-center d-flex gap-3 justify-content-center flex-wrap">
                <Button color="primary" type="submit" disabled={guardando || !idEmpresa}>
                  {guardando ? <Spinner size="sm" /> : 'CREAR BORRADOR'}
                </Button>
                <Button type="button" color="secondary" outline tag={Link} to="/financiero/facturas-clientes/listado" disabled={guardando}>
                  LISTADO
                </Button>
              </div>
            </Form>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default NuevaFacturaCliente;

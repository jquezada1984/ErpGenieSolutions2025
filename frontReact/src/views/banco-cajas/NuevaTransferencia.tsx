import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Alert,
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  FormText,
} from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLazyQuery, useQuery, gql } from '@apollo/client';
import useJwtPayload from '../../hooks/useJwtPayload';
import SelectEmpresa from '../../components/SelectEmpresa';
import { crearTransferenciaBancaria } from '../../_apis_/bancoCaja';
import { TIPOS_CUENTA, TIPOS_PAGO_TRANSFERENCIA, type TipoPagoTransferencia } from './constants';

const GET_CUENTAS = gql`
  query GetCuentasTransferencia($id_empresa: ID) {
    cuentasBancarias(id_empresa: $id_empresa) {
      id_cuenta_bancaria
      id_empresa
      id_moneda
      referencia
      etiqueta_cuenta
      numero_cuenta
      tipo_cuenta
      saldo_actual
      estado
      banco { nombre }
    }
  }
`;

const GET_EMPRESAS = gql`
  query GetEmpresasNuevaTransferencia {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

interface CuentaOpt {
  id_cuenta_bancaria: string;
  id_moneda: string;
  referencia?: string;
  etiqueta_cuenta?: string;
  numero_cuenta: string;
  tipo_cuenta: string;
  saldo_actual: number;
  estado: boolean;
  banco?: { nombre?: string };
}

const today = () => new Date().toISOString().slice(0, 10);

const labelTipo = (v: string) => TIPOS_CUENTA.find((t) => t.value === v)?.label || v;

const labelCuenta = (c: CuentaOpt) => {
  const ref = c.referencia || c.etiqueta_cuenta || c.numero_cuenta;
  const banco = c.banco?.nombre ? ` — ${c.banco.nombre}` : '';
  return `${ref}${banco} (${labelTipo(c.tipo_cuenta)})`;
};

const NuevaTransferencia: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const payload = useJwtPayload();
  const scope = payload?.scope_acceso || 'EMPRESA';
  const idEmpresaUsuario = payload?.id_empresa || '';
  const idEmpresaState = (location.state as { id_empresa?: string })?.id_empresa;

  const [selectedIdEmpresa, setSelectedIdEmpresa] = useState<string>(idEmpresaState || '');
  const idEmpresa = scope === 'GLOBAL' ? selectedIdEmpresa : idEmpresaUsuario;

  const { data: empresasData } = useQuery(GET_EMPRESAS, { skip: scope !== 'GLOBAL' });
  const empresas = empresasData?.empresas || [];

  const [cuentas, setCuentas] = useState<CuentaOpt[]>([]);
  const [idOrigen, setIdOrigen] = useState('');
  const [idDestino, setIdDestino] = useState('');
  const [monto, setMonto] = useState('');
  const [fechaMovimiento, setFechaMovimiento] = useState(today());
  const [concepto, setConcepto] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [tipoPago, setTipoPago] = useState<TipoPagoTransferencia>('transferencia_bancaria');
  const [error, setError] = useState<string | null>(null);
  const [errEmpresa, setErrEmpresa] = useState<string | null>(null);
  const [errOrigen, setErrOrigen] = useState<string | null>(null);
  const [errDestino, setErrDestino] = useState<string | null>(null);
  const [errMonto, setErrMonto] = useState<string | null>(null);
  const [errConcepto, setErrConcepto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [loadCuentas] = useLazyQuery(GET_CUENTAS, {
    fetchPolicy: 'network-only',
    onCompleted: (d) => {
      const activas = (d?.cuentasBancarias || []).filter((c: CuentaOpt) => c.estado);
      setCuentas(activas);
    },
    onError: (e) => setError(e.message),
  });

  useEffect(() => {
    if (scope !== 'EMPRESA' || !idEmpresaUsuario) return;
    loadCuentas({ variables: { id_empresa: idEmpresaUsuario } });
  }, [scope, idEmpresaUsuario, loadCuentas]);

  useEffect(() => {
    if (scope !== 'GLOBAL' || !selectedIdEmpresa) return;
    loadCuentas({ variables: { id_empresa: selectedIdEmpresa } });
  }, [scope, selectedIdEmpresa, loadCuentas]);

  const handleEmpresaChange = (val: string | null) => {
    setSelectedIdEmpresa(val ?? '');
    setIdOrigen('');
    setIdDestino('');
    setCuentas([]);
    setErrEmpresa(null);
    setErrOrigen(null);
    setErrDestino(null);
  };

  const cuentasDeshabilitadas = scope === 'GLOBAL' && !selectedIdEmpresa;

  const cuentaOrigen = cuentas.find((c) => c.id_cuenta_bancaria === idOrigen);
  const cuentaDestino = cuentas.find((c) => c.id_cuenta_bancaria === idDestino);
  const involucraCaja =
    cuentaOrigen?.tipo_cuenta === 'caja_efectivo' ||
    cuentaDestino?.tipo_cuenta === 'caja_efectivo';
  const tipoPagoEfectivoForzado = involucraCaja;

  useEffect(() => {
    if (tipoPagoEfectivoForzado) {
      setTipoPago('efectivo');
    }
  }, [tipoPagoEfectivoForzado]);

  const cuentasDestino = useMemo(() => {
    if (!cuentaOrigen) return cuentas;
    return cuentas.filter(
      (c) =>
        c.id_cuenta_bancaria !== cuentaOrigen.id_cuenta_bancaria &&
        c.id_moneda === cuentaOrigen.id_moneda,
    );
  }, [cuentas, cuentaOrigen]);

  useEffect(() => {
    if (idDestino && cuentaOrigen) {
      const valida = cuentasDestino.some((c) => c.id_cuenta_bancaria === idDestino);
      if (!valida) setIdDestino('');
    }
  }, [idDestino, cuentaOrigen, cuentasDestino]);

  const save = async () => {
    let hasError = false;
    if (scope === 'GLOBAL' && !selectedIdEmpresa) {
      setErrEmpresa('Seleccione la empresa');
      hasError = true;
    } else setErrEmpresa(null);
    if (!idOrigen) {
      setErrOrigen('Seleccione la cuenta origen');
      hasError = true;
    } else setErrOrigen(null);
    if (!idDestino) {
      setErrDestino('Seleccione la cuenta destino');
      hasError = true;
    } else setErrDestino(null);
    const m = parseFloat(monto.replace(',', '.'));
    if (!monto.trim() || Number.isNaN(m) || m <= 0) {
      setErrMonto('Indique un monto mayor que cero');
      hasError = true;
    } else if (cuentaOrigen && m > Number(cuentaOrigen.saldo_actual || 0)) {
      setErrMonto('Saldo insuficiente en la cuenta origen');
      hasError = true;
    } else setErrMonto(null);
    if (!concepto.trim()) {
      setErrConcepto('Indique la descripción');
      hasError = true;
    } else setErrConcepto(null);
    if (hasError) {
      setError('Revise el formulario');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const body: Record<string, unknown> = {
        id_cuenta_origen: idOrigen,
        id_cuenta_destino: idDestino,
        monto: m,
        fecha_movimiento: fechaMovimiento,
        tipo_movimiento: tipoPagoEfectivoForzado ? 'efectivo' : tipoPago,
        concepto: concepto.trim(),
        numero_documento: numeroDocumento.trim() || undefined,
      };
      if (idEmpresa) body.id_empresa = idEmpresa;
      await crearTransferenciaBancaria(body);
      navigate('/banco-cajas/transferencias');
    } catch (err: unknown) {
      const ax = err as {
        response?: { data?: { error?: string; _schema?: string[]; monto?: string[]; concepto?: string[] } };
        message?: string;
      };
      const d = ax?.response?.data as Record<string, unknown> | undefined;
      const firstFieldMsg = d
        ? Object.values(d).flatMap((v) => (Array.isArray(v) ? v : []))[0]
        : null;
      setError(
        (Array.isArray(d?._schema) ? d._schema[0] : null) ||
          (typeof firstFieldMsg === 'string' ? firstFieldMsg : null) ||
          (typeof d?.error === 'string' ? d.error : null) ||
          ax?.message ||
          'Error al guardar',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col lg="10" xl="8">
          <Card>
            <CardBody>
              <CardTitle tag="h4">Transferencia interna</CardTitle>
              <p className="text-muted small mb-4">
                Utilice la transferencia interna para transferir de una cuenta a otra. Se escribirán
                dos registros: uno de débito en la cuenta de origen y uno de crédito en la cuenta de
                destino, con la misma cantidad, descripción y fecha.
              </p>

              {error && <Alert color="danger">{error}</Alert>}

              {scope === 'GLOBAL' && (
                <FormGroup className="mb-3">
                  <Label>Empresa *</Label>
                  <SelectEmpresa
                    value={selectedIdEmpresa || null}
                    onChange={handleEmpresaChange}
                    empresas={empresas}
                    placeholder="Seleccione la empresa que realizará la transferencia"
                    error={errEmpresa || undefined}
                  />
                  {errEmpresa && <FormText color="danger">{errEmpresa}</FormText>}
                </FormGroup>
              )}

              {scope === 'GLOBAL' && !selectedIdEmpresa && (
                <Alert color="info" className="mb-3">
                  Seleccione una empresa para ver sus cuentas bancarias
                </Alert>
              )}

              <Row className="g-3 align-items-end">
                <Col md="6" lg="4">
                  <FormGroup className="mb-0">
                    <Label>De *</Label>
                    <Input
                      type="select"
                      value={idOrigen}
                      invalid={!!errOrigen}
                      disabled={cuentasDeshabilitadas}
                      onChange={(e) => {
                        setIdOrigen(e.target.value);
                        setErrOrigen(null);
                      }}
                    >
                      <option value="">— Cuenta origen —</option>
                      {cuentas.map((c) => (
                        <option key={c.id_cuenta_bancaria} value={c.id_cuenta_bancaria}>
                          {labelCuenta(c)} — Saldo: {Number(c.saldo_actual || 0).toFixed(2)}
                        </option>
                      ))}
                    </Input>
                    {errOrigen && <FormText color="danger">{errOrigen}</FormText>}
                  </FormGroup>
                </Col>

                <Col md="6" lg="4">
                  <FormGroup className="mb-0">
                    <Label>Hacia *</Label>
                    <Input
                      type="select"
                      value={idDestino}
                      invalid={!!errDestino}
                      disabled={cuentasDeshabilitadas || !idOrigen}
                      onChange={(e) => {
                        setIdDestino(e.target.value);
                        setErrDestino(null);
                      }}
                    >
                      <option value="">— Cuenta destino —</option>
                      {cuentasDestino.map((c) => (
                        <option key={c.id_cuenta_bancaria} value={c.id_cuenta_bancaria}>
                          {labelCuenta(c)}
                        </option>
                      ))}
                    </Input>
                    {errDestino && <FormText color="danger">{errDestino}</FormText>}
                  </FormGroup>
                </Col>

                <Col md="6" lg="4">
                  <FormGroup className="mb-0">
                    <Label>Tipo</Label>
                    <Input
                      type="select"
                      value={tipoPagoEfectivoForzado ? 'efectivo' : tipoPago}
                      disabled={cuentasDeshabilitadas || tipoPagoEfectivoForzado}
                      onChange={(e) => setTipoPago(e.target.value as TipoPagoTransferencia)}
                    >
                      {TIPOS_PAGO_TRANSFERENCIA.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </Input>
                    {tipoPagoEfectivoForzado && (
                      <FormText color="muted">
                        Efectivo (cuenta caja involucrada)
                      </FormText>
                    )}
                  </FormGroup>
                </Col>

                <Col md="4" lg="3">
                  <FormGroup className="mb-0">
                    <Label>Fecha *</Label>
                    <Input
                      type="date"
                      value={fechaMovimiento}
                      disabled={cuentasDeshabilitadas}
                      onChange={(e) => setFechaMovimiento(e.target.value)}
                    />
                  </FormGroup>
                </Col>

                <Col md="8" lg="5">
                  <FormGroup className="mb-0">
                    <Label>Descripción *</Label>
                    <Input
                      value={concepto}
                      invalid={!!errConcepto}
                      disabled={cuentasDeshabilitadas}
                      onChange={(e) => {
                        setConcepto(e.target.value);
                        setErrConcepto(null);
                      }}
                    />
                    {errConcepto && <FormText color="danger">{errConcepto}</FormText>}
                  </FormGroup>
                </Col>

                <Col md="4" lg="2">
                  <FormGroup className="mb-0">
                    <Label>Importe *</Label>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={monto}
                      invalid={!!errMonto}
                      disabled={cuentasDeshabilitadas}
                      onChange={(e) => {
                        setMonto(e.target.value);
                        setErrMonto(null);
                      }}
                    />
                    {errMonto && <FormText color="danger">{errMonto}</FormText>}
                  </FormGroup>
                </Col>

                <Col md="6" lg="4">
                  <FormGroup className="mb-0">
                    <Label>Nº documento</Label>
                    <Input
                      value={numeroDocumento}
                      disabled={cuentasDeshabilitadas}
                      onChange={(e) => setNumeroDocumento(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>

              {cuentaOrigen && (
                <FormText color="muted" className="mt-2 d-block">
                  Saldo disponible en origen: {Number(cuentaOrigen.saldo_actual || 0).toFixed(2)}
                </FormText>
              )}

              <div className="d-flex gap-2 mt-4">
                <Button color="secondary" outline onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onClick={save}
                  disabled={saving || cuentasDeshabilitadas}
                >
                  {saving ? 'Guardando…' : 'Grabar'}
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NuevaTransferencia;

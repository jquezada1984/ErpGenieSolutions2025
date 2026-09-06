import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  Spinner,
} from 'reactstrap';
import ConfigEmpresaBar from '../../components/ConfigEmpresaBar';
import { useConfigEmpresaScope } from '../../hooks/useConfigEmpresaScope';
import { guardarAlertasConfig, obtenerEmpresaConfig } from '../../_apis_/configEmpresa';

const ALERTAS_ITEMS = [
  { id: 'presupuesto_no_cerrado', label: 'Presupuesto no cerrado', icon: 'bi-file-earmark-text' },
  { id: 'presupuesto_no_facturado', label: 'Presupuesto no facturado', icon: 'bi-receipt' },
  { id: 'factura_cliente_no_cobrada', label: 'Factura a cliente no cobrada', icon: 'bi-cash-coin' },
  { id: 'pedido_proveedor_no_procesado', label: 'Pedido a proveedor no procesado', icon: 'bi-truck' },
  { id: 'factura_proveedor_no_pagada', label: 'Factura de proveedor no pagada', icon: 'bi-credit-card' },
  { id: 'conciliacion_pendiente', label: 'Conciliación bancaria pendiente', icon: 'bi-bank' },
  { id: 'deposito_cheques', label: 'Depósito de cheques no realizado', icon: 'bi-wallet2' },
];

const defaultDias = () => Object.fromEntries(ALERTAS_ITEMS.map((a) => [a.id, 0]));

const Alertas = () => {
  const empresaScope = useConfigEmpresaScope();
  const [dias, setDias] = useState<Record<string, number>>(defaultDias);
  const [deshabilitarClima, setDeshabilitarClima] = useState(false);
  const [umbral1, setUmbral1] = useState(0);
  const [umbral2, setUmbral2] = useState(10);
  const [umbral3, setUmbral3] = useState(20);
  const [umbral4, setUmbral4] = useState(30);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const cargar = useCallback(async () => {
    if (!empresaScope.ready) return;
    setLoading(true);
    setError(null);
    try {
      const cfg = await obtenerEmpresaConfig();
      const a = (cfg?.alertas || {}) as Record<string, unknown>;
      const diasSaved = (a.dias || {}) as Record<string, number>;
      setDias({ ...defaultDias(), ...diasSaved });
      setDeshabilitarClima(Boolean(a.deshabilitar_clima));
      const u = (a.umbrales || {}) as Record<string, number>;
      setUmbral1(Number(u.u1 ?? 0));
      setUmbral2(Number(u.u2 ?? 10));
      setUmbral3(Number(u.u3 ?? 20));
      setUmbral4(Number(u.u4 ?? 30));
    } catch (e: any) {
      setError(e?.response?.data?.error || e.message || 'No se pudo cargar');
    } finally {
      setLoading(false);
    }
  }, [empresaScope.ready, empresaScope.idEmpresa]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const grabar = async () => {
    setSaving(true);
    setMensaje(null);
    setError(null);
    try {
      await guardarAlertasConfig({
        dias,
        deshabilitar_clima: deshabilitarClima,
        umbrales: { u1: umbral1, u2: umbral2, u3: umbral3, u4: umbral4 },
      });
      setMensaje('Alertas guardadas.');
    } catch (e: any) {
      setError(e?.response?.data?.error || e.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardBody>
        <CardTitle tag="h4" className="d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-wrench" /> Mostrando una alerta de advertencia para...
        </CardTitle>
        <ConfigEmpresaBar scope={empresaScope} />
        {!empresaScope.ready ? null : (
          <>
            <p className="text-muted">
              Retraso (días) antes del icono de advertencia. Se guarda por empresa.
            </p>
            {loading && (
              <div className="mb-2 text-muted">
                <Spinner size="sm" /> Cargando…
              </div>
            )}
            {error && (
              <Alert color="danger" fade={false} className="py-2">
                {error}
              </Alert>
            )}
            {mensaje && (
              <Alert color="success" fade={false} className="py-2">
                {mensaje}
              </Alert>
            )}

            <ListGroup className="mb-4">
              {ALERTAS_ITEMS.map((item) => (
                <ListGroupItem
                  key={item.id}
                  className="d-flex align-items-center justify-content-between gap-3"
                >
                  <span>
                    <i className={`bi ${item.icon} me-2 text-warning`} />
                    {item.label}
                  </span>
                  <div className="d-flex align-items-center gap-2" style={{ minWidth: 140 }}>
                    <Input
                      type="number"
                      bsSize="sm"
                      style={{ width: 80 }}
                      value={dias[item.id]}
                      onChange={(e) =>
                        setDias((prev) => ({
                          ...prev,
                          [item.id]: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                    />
                    <span className="text-muted small">días</span>
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>

            <h5 className="mb-3">Opción</h5>
            <FormGroup check className="mb-4">
              <Input
                id="deshabilitarClima"
                type="checkbox"
                checked={deshabilitarClima}
                onChange={(e) => setDeshabilitarClima(e.target.checked)}
              />
              <Label check htmlFor="deshabilitarClima">
                Deshabilitar la vista meteorológica
              </Label>
            </FormGroup>

            <h5 className="mb-3">Umbrales (modo estándar)</h5>
            <div className="d-flex flex-wrap gap-3 mb-4 align-items-end">
              {[
                { icon: '☀️', label: '≤', value: umbral1, set: setUmbral1 },
                { icon: '⛅', label: '≤', value: umbral2, set: setUmbral2 },
                { icon: '☁️', label: '≤', value: umbral3, set: setUmbral3 },
                { icon: '🌧️', label: '≤', value: umbral4, set: setUmbral4 },
              ].map((u, idx) => (
                <FormGroup key={idx} className="mb-0">
                  <Label className="d-block">
                    {u.icon} {u.label}
                  </Label>
                  <Input
                    type="number"
                    style={{ width: 90 }}
                    value={u.value}
                    onChange={(e) => u.set(parseInt(e.target.value, 10) || 0)}
                  />
                </FormGroup>
              ))}
            </div>

            <div className="text-end">
              <Button color="primary" onClick={grabar} disabled={saving}>
                {saving ? 'Guardando…' : 'Grabar'}
              </Button>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default Alertas;

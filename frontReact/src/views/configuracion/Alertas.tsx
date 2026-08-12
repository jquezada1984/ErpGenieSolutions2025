import React, { useState } from 'react';
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
} from 'reactstrap';
import ConfigEmpresaBar from '../../components/ConfigEmpresaBar';
import { useConfigEmpresaScope } from '../../hooks/useConfigEmpresaScope';

const ALERTAS_ITEMS = [
  { id: 'presupuesto_no_cerrado', label: 'Presupuesto no cerrado', icon: 'bi-file-earmark-text' },
  { id: 'presupuesto_no_facturado', label: 'Presupuesto no facturado', icon: 'bi-receipt' },
  { id: 'factura_cliente_no_cobrada', label: 'Factura a cliente no cobrada', icon: 'bi-cash-coin' },
  { id: 'pedido_proveedor_no_procesado', label: 'Pedido a proveedor no procesado', icon: 'bi-truck' },
  { id: 'factura_proveedor_no_pagada', label: 'Factura de proveedor no pagada', icon: 'bi-credit-card' },
  { id: 'conciliacion_pendiente', label: 'Conciliación bancaria pendiente', icon: 'bi-bank' },
  { id: 'deposito_cheques', label: 'Depósito de cheques no realizado', icon: 'bi-wallet2' },
];

/**
 * Configuración de alertas — UI estilo Dolibarr.
 * Persistencia real pendiente.
 */
const Alertas = () => {
  const empresaScope = useConfigEmpresaScope();
  const [dias, setDias] = useState<Record<string, number>>(
    Object.fromEntries(ALERTAS_ITEMS.map((a) => [a.id, 0])),
  );
  const [deshabilitarClima, setDeshabilitarClima] = useState(false);
  const [umbral1, setUmbral1] = useState(0);
  const [umbral2, setUmbral2] = useState(10);
  const [umbral3, setUmbral3] = useState(20);
  const [umbral4, setUmbral4] = useState(30);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const grabar = () => {
    setMensaje('Configuración de alertas guardada en vista previa (persistencia pendiente).');
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
          Esta pantalla permite configurar el retraso (en días) antes de que aparezca el icono de
          advertencia. Sólo se muestran elementos de módulos activos.
        </p>
        {mensaje && (
          <Alert color="info" fade={false} timeout={0} className="py-2">
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
                    setDias((prev) => ({ ...prev, [item.id]: parseInt(e.target.value, 10) || 0 }))
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
          <Button color="primary" onClick={grabar}>
            Grabar
          </Button>
        </div>
        </>
        )}
      </CardBody>
    </Card>
  );
};

export default Alertas;

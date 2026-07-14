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
} from 'reactstrap';
import { exportarDocumentosOrigen } from '../../../_apis_/contabilidad';
import { rangoAnioActual } from '../operativa/operativaUtils';

const TIPOS_DOC = [
  { key: 'facturas', label: 'Facturas (cliente)' },
  { key: 'facturas_proveedor', label: 'Facturas proveedor' },
  { key: 'donaciones', label: 'Donaciones (futuro)', disabled: true },
  { key: 'impuestos', label: 'Impuestos sociales o fiscales (futuro)', disabled: true },
  { key: 'salarios', label: 'Pagos de salarios (futuro)', disabled: true },
  { key: 'pago_varios', label: 'Pago varios (parcial)', disabled: true },
  { key: 'prestamo', label: 'Pago de préstamo (futuro)', disabled: true },
];

const ExportarDocumentosOrigen: React.FC = () => {
  const { desde: defDesde, hasta: defHasta } = rangoAnioActual();
  const [desde, setDesde] = useState(defDesde);
  const [hasta, setHasta] = useState(defHasta);
  const [tipos, setTipos] = useState<string[]>(['facturas', 'facturas_proveedor']);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false);

  const ahora = () => {
    const hoy = new Date().toISOString().slice(0, 10);
    setDesde(hoy);
    setHasta(hoy);
  };

  const toggleTipo = (key: string) => {
    setTipos((prev) => (prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]));
  };

  const buscar = async () => {
    setBuscando(true);
    setMensaje(null);
    try {
      const res = await exportarDocumentosOrigen({
        desde,
        hasta,
        tipos,
        'tipos[]': tipos,
      }) as { csv?: string; total_lineas?: number };
      if (res?.csv) {
        const blob = new Blob([res.csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `documentos-origen-${desde}-${hasta}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setMensaje(`Exportación generada: ${res.total_lineas ?? 0} líneas.`);
      } else {
        setMensaje('No se recibió contenido CSV.');
      }
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error al exportar');
    } finally {
      setBuscando(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">Exportar documentos de origen</CardTitle>
        <p className="text-muted">
          Exportación CSV con metadatos de facturas en el periodo seleccionado.
        </p>

        <div className="row g-2 mb-3">
          <div className="col-md-3">
            <FormGroup>
              <Label>Desde</Label>
              <Input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
            </FormGroup>
          </div>
          <div className="col-md-3">
            <FormGroup>
              <Label>Hasta</Label>
              <Input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
            </FormGroup>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <Button color="link" className="p-0 mb-3" onClick={ahora}>Ahora</Button>
          </div>
        </div>

        <FormGroup tag="fieldset" className="mb-3">
          <legend>Tipos de documento</legend>
          {TIPOS_DOC.map((t) => (
            <FormGroup check key={t.key}>
              <Label check>
                <Input
                  type="checkbox"
                  checked={tipos.includes(t.key)}
                  disabled={t.disabled}
                  onChange={() => toggleTipo(t.key)}
                />
                {t.label}
              </Label>
            </FormGroup>
          ))}
        </FormGroup>

        <Button color="primary" disabled={buscando || tipos.length === 0} onClick={buscar}>
          BUSCAR / EXPORTAR CSV
        </Button>

        {mensaje && <Alert color="info" className="mt-3 mb-0">{mensaje}</Alert>}
      </CardBody>
    </Card>
  );
};

export default ExportarDocumentosOrigen;

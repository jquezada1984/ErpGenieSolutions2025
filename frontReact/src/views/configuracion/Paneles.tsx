import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Input,
  Spinner,
  Table,
} from 'reactstrap';
import ConfigEmpresaBar from '../../components/ConfigEmpresaBar';
import { useConfigEmpresaScope } from '../../hooks/useConfigEmpresaScope';
import { guardarPanelesConfig, obtenerEmpresaConfig } from '../../_apis_/configEmpresa';

type PanelRow = {
  id: string;
  nombre: string;
  activo: boolean;
  pagina: string;
  posicion: number;
};

const PANELES_INICIALES: PanelRow[] = [
  { id: '1', nombre: 'Información login', activo: true, pagina: 'Inicio', posicion: 1 },
  { id: '2', nombre: 'Últimos proveedores modificados', activo: true, pagina: 'Inicio', posicion: 2 },
  { id: '3', nombre: 'Últimas facturas de proveedores', activo: true, pagina: 'Inicio', posicion: 3 },
  { id: '4', nombre: 'Últimos pedidos de compra', activo: true, pagina: 'Inicio', posicion: 4 },
  { id: '5', nombre: 'Últimos presupuestos', activo: true, pagina: 'Inicio', posicion: 5 },
  { id: '6', nombre: 'Alertas de stock para productos', activo: true, pagina: 'Inicio', posicion: 6 },
  { id: '7', nombre: 'Balance de cuentas abiertas', activo: true, pagina: 'Inicio', posicion: 7 },
  { id: '8', nombre: 'Cumpleaños de este mes (usuarios)', activo: true, pagina: 'Inicio', posicion: 8 },
  {
    id: '9',
    nombre: 'Facturas a clientes más antiguas pendientes de cobro',
    activo: true,
    pagina: 'Inicio',
    posicion: 9,
  },
  { id: '10', nombre: 'Facturas a clientes por mes', activo: true, pagina: 'Inicio', posicion: 10 },
  { id: '11', nombre: 'Últimos clientes modificados', activo: true, pagina: 'Inicio', posicion: 11 },
  { id: '12', nombre: 'Últimos contactos/direcciones', activo: true, pagina: 'Inicio', posicion: 12 },
  { id: '13', nombre: 'Distribución de productos/servicios', activo: true, pagina: 'Inicio', posicion: 13 },
  {
    id: '14',
    nombre: 'Último registro contable introducido manualmente o sin documento fuente',
    activo: false,
    pagina: 'Inicio',
    posicion: 14,
  },
  {
    id: '15',
    nombre: 'Cuenta contable operación con cuenta suspendida',
    activo: false,
    pagina: 'Inicio',
    posicion: 15,
  },
];

const PAGINAS = ['Inicio', 'Terceros', 'Productos', 'Financiero', 'BancoCajas', 'Contabilidad'];

function mergePaneles(saved: unknown): PanelRow[] {
  const byId = new Map<string, PanelRow>();
  PANELES_INICIALES.forEach((p) => byId.set(p.id, { ...p }));
  if (Array.isArray(saved)) {
    saved.forEach((raw) => {
      if (!raw || typeof raw !== 'object') return;
      const r = raw as Record<string, unknown>;
      const id = String(r.id || '');
      if (!id || !byId.has(id)) return;
      const base = byId.get(id)!;
      byId.set(id, {
        ...base,
        activo: Boolean(r.activo),
        pagina: String(r.pagina || base.pagina),
        posicion: Number(r.posicion ?? base.posicion) || 0,
      });
    });
  }
  return Array.from(byId.values());
}

const Paneles = () => {
  const empresaScope = useConfigEmpresaScope();
  const [rows, setRows] = useState<PanelRow[]>(PANELES_INICIALES);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const cargar = useCallback(async () => {
    if (!empresaScope.ready) return;
    setLoading(true);
    setError(null);
    try {
      const cfg = await obtenerEmpresaConfig();
      setRows(mergePaneles(cfg?.paneles));
      setDirty(false);
    } catch (e: any) {
      setError(e?.response?.data?.error || e.message || 'No se pudo cargar');
      setRows(PANELES_INICIALES);
    } finally {
      setLoading(false);
    }
  }, [empresaScope.ready, empresaScope.idEmpresa]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const ordenados = useMemo(
    () => [...rows].sort((a, b) => a.posicion - b.posicion),
    [rows],
  );

  const patch = (id: string, partial: Partial<PanelRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...partial } : r)));
    setDirty(true);
    setMensaje(null);
  };

  const guardar = async () => {
    setSaving(true);
    setError(null);
    setMensaje(null);
    try {
      await guardarPanelesConfig(rows);
      setDirty(false);
      setMensaje('Paneles guardados.');
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
          <i className="bi bi-grid-3x3-gap" /> Paneles
        </CardTitle>
        <ConfigEmpresaBar scope={empresaScope} />
        {!empresaScope.ready ? null : (
          <>
            <p className="text-muted">
              Active widgets por página de destino. La configuración se guarda por empresa.
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
            <div className="table-responsive">
              <Table bordered hover size="sm" className="align-middle mb-3">
                <thead className="table-light">
                  <tr>
                    <th>Panel</th>
                    <th style={{ width: 160 }}>Activable en</th>
                    <th style={{ width: 140 }}>Posición</th>
                    <th style={{ width: 120 }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenados.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <i className="bi bi-bar-chart-line me-2 text-primary" />
                        {row.nombre}
                      </td>
                      <td>
                        <Input
                          type="select"
                          bsSize="sm"
                          value={row.pagina}
                          onChange={(e) => patch(row.id, { pagina: e.target.value })}
                        >
                          {PAGINAS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </Input>
                      </td>
                      <td>
                        {row.activo ? (
                          <Input
                            type="number"
                            bsSize="sm"
                            value={row.posicion}
                            onChange={(e) =>
                              patch(row.id, { posicion: parseInt(e.target.value, 10) || 0 })
                            }
                          />
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        {row.activo ? (
                          <Button
                            color="link"
                            className="text-danger p-0"
                            onClick={() => patch(row.id, { activo: false })}
                          >
                            <i className="bi bi-trash" /> Desactivar
                          </Button>
                        ) : (
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() => patch(row.id, { activo: true })}
                          >
                            Activar
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="text-end">
              <Button color="primary" onClick={guardar} disabled={saving || !dirty}>
                {saving ? 'Guardando…' : 'Grabar'}
              </Button>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default Paneles;

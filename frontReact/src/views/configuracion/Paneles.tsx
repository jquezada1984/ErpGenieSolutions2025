import React, { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Input,
  Table,
} from 'reactstrap';
import ConfigEmpresaBar from '../../components/ConfigEmpresaBar';
import { useConfigEmpresaScope } from '../../hooks/useConfigEmpresaScope';

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

const PAGINAS = ['Inicio', 'Terceros', 'Financiero', 'Contabilidad'];

/**
 * Configuración de paneles (widgets) — UI estilo Dolibarr.
 * Persistencia real pendiente.
 */
const Paneles = () => {
  const empresaScope = useConfigEmpresaScope();
  const [rows, setRows] = useState<PanelRow[]>(PANELES_INICIALES);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const ordenados = useMemo(
    () => [...rows].sort((a, b) => a.posicion - b.posicion),
    [rows],
  );

  const activar = (id: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, activo: true, pagina: r.pagina || 'Inicio' } : r)),
    );
    setMensaje('Panel activado (vista previa; guardado pendiente).');
  };

  const desactivar = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, activo: false } : r)));
    setMensaje('Panel desactivado (vista previa; guardado pendiente).');
  };

  const setPagina = (id: string, pagina: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, pagina } : r)));
  };

  const setPosicion = (id: string, posicion: number) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, posicion: Number.isFinite(posicion) ? posicion : 0 } : r)),
    );
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
          Los paneles son componentes que muestran algunos datos que pueden añadirse para personalizar
          algunas páginas. Puede elegir entre mostrar o no el panel mediante la selección de la página
          de destino y haciendo clic en Activar, o haciendo clic en la papelera para desactivarlo. Sólo
          los elementos de módulos activados son mostrados.
        </p>
        {mensaje && (
          <Alert color="info" fade={false} timeout={0} className="py-2">
            {mensaje}
          </Alert>
        )}
        <div className="table-responsive">
          <Table bordered hover size="sm" className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Panel</th>
                <th style={{ width: 80 }}>Nota</th>
                <th style={{ width: 160 }}>Activable en</th>
                <th style={{ width: 140 }}>Posición por defecto</th>
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
                  <td className="text-center">
                    <i className="bi bi-info-circle text-muted" title="Información del panel" />
                  </td>
                  <td>
                    {row.activo ? (
                      <Input
                        type="select"
                        bsSize="sm"
                        value={row.pagina}
                        onChange={(e) => setPagina(row.id, e.target.value)}
                      >
                        {PAGINAS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </Input>
                    ) : (
                      <Input
                        type="select"
                        bsSize="sm"
                        value={row.pagina}
                        onChange={(e) => setPagina(row.id, e.target.value)}
                      >
                        {PAGINAS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </Input>
                    )}
                  </td>
                  <td>
                    {row.activo ? (
                      <Input
                        type="number"
                        bsSize="sm"
                        value={row.posicion}
                        onChange={(e) => setPosicion(row.id, parseInt(e.target.value, 10))}
                      />
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    {row.activo ? (
                      <Button color="link" className="text-danger p-0" onClick={() => desactivar(row.id)}>
                        <i className="bi bi-trash" /> Desactivar
                      </Button>
                    ) : (
                      <Button color="primary" size="sm" onClick={() => activar(row.id)}>
                        Activar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        </>
        )}
      </CardBody>
    </Card>
  );
};

export default Paneles;

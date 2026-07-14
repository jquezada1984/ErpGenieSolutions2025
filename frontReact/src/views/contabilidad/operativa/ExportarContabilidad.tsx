import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Input,
  Label,
  Spinner,
  Table,
} from 'reactstrap';
import useJwtPayload from '../../../hooks/useJwtPayload';
import { ejecutarExportacionContabilidad, listarMovimientosExportar } from '../../../_apis_/contabilidad';
import { formatMoneda, rangoAnioActual } from './operativaUtils';

type MovExport = {
  id_movimiento_contable: string;
  numero_asiento: string;
  codigo_diario: string;
  fecha_asiento: string;
  referencia: string | null;
  codigo_cuenta: string;
  concepto: string;
  debe: number;
  haber: number;
  fecha_exportacion: string | null;
};

const ExportarContabilidad: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);
  const { desde: defDesde, hasta: defHasta } = rangoAnioActual();

  const [fechaDesde, setFechaDesde] = useState(defDesde);
  const [fechaHasta, setFechaHasta] = useState(defHasta);
  const [incluirExportados, setIncluirExportados] = useState(false);
  const [filas, setFilas] = useState<MovExport[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!idEmpresa) return;
    setLoading(true);
    setMensaje(null);
    try {
      const rows = await listarMovimientosExportar({
        desde: fechaDesde,
        hasta: fechaHasta,
        incluir_exportados: incluirExportados,
      });
      setFilas(rows);
    } catch (e: unknown) {
      const err = e as { message?: string };
      setMensaje(err.message || 'Error al cargar');
    } finally {
      setLoading(false);
    }
  }, [idEmpresa, fechaDesde, fechaHasta, incluirExportados]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleExportar = async () => {
    setExportando(true);
    setMensaje(null);
    try {
      const res = await ejecutarExportacionContabilidad({
        desde: fechaDesde,
        hasta: fechaHasta,
      });
      if (res?.csv) {
        const blob = new Blob([res.csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contabilidad-export-${fechaDesde}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
      setMensaje(`Exportados ${res?.exportados ?? 0} movimientos`);
      await cargar();
    } catch (e: unknown) {
      const err = e as { message?: string };
      setMensaje(err.message || 'Error al exportar');
    } finally {
      setExportando(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <CardTitle tag="h4" className="mb-0">
            Exportar contabilidad ({filas.length})
          </CardTitle>
          <Button color="primary" size="sm" onClick={handleExportar} disabled={exportando || filas.length === 0}>
            {exportando ? 'Exportando...' : 'Exportar'}
          </Button>
        </div>

        <Alert color="info">
          La lista contiene entradas contables no exportadas (fecha de exportación vacía), salvo que active el
          interruptor inferior.
        </Alert>

        <div className="row g-2 mb-3">
          <div className="col-md-3">
            <FormGroup>
              <Label>Desde</Label>
              <Input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
            </FormGroup>
          </div>
          <div className="col-md-3">
            <FormGroup>
              <Label>Hasta</Label>
              <Input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
            </FormGroup>
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <FormGroup check className="mb-3">
              <Input
                type="checkbox"
                checked={incluirExportados}
                onChange={(e) => setIncluirExportados(e.target.checked)}
              />{' '}
              <Label check>Mostrar líneas ya exportadas</Label>
            </FormGroup>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <Button color="secondary" size="sm" className="mb-3" onClick={cargar}>
              Refrescar
            </Button>
          </div>
        </div>

        {mensaje && <Alert color="info">{mensaje}</Alert>}
        {loading && <Spinner />}

        {!loading && (
          <Table responsive hover size="sm">
            <thead>
              <tr>
                <th>Núm. transacción</th>
                <th>Diario</th>
                <th>Fecha</th>
                <th>Doc.</th>
                <th>Cuenta</th>
                <th>Etiqueta</th>
                <th className="text-end">Debe</th>
                <th className="text-end">Haber</th>
                <th>Fecha exportación</th>
              </tr>
            </thead>
            <tbody>
              {filas.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-muted">
                    No se han encontrado registros
                  </td>
                </tr>
              )}
              {filas.map((r) => (
                <tr key={r.id_movimiento_contable}>
                  <td>{r.numero_asiento}</td>
                  <td>{r.codigo_diario}</td>
                  <td>{String(r.fecha_asiento).slice(0, 10)}</td>
                  <td>{r.referencia || '—'}</td>
                  <td>{r.codigo_cuenta}</td>
                  <td>{r.concepto}</td>
                  <td className="text-end">{formatMoneda(Number(r.debe))}</td>
                  <td className="text-end">{formatMoneda(Number(r.haber))}</td>
                  <td>{r.fecha_exportacion ? String(r.fecha_exportacion).slice(0, 10) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default ExportarContabilidad;

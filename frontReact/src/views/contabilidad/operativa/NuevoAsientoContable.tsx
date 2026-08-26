import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
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
import { crearAsientoContable } from '../../_apis_/contabilidad';
import { useConfigEmpresaScope } from '../../hooks/useConfigEmpresaScope';
import ConfigEmpresaBar from '../../components/ConfigEmpresaBar';
import { formatMoneda } from './operativaUtils';

const GET_MAESTROS = gql`
  query MaestrosNuevoAsiento($id_empresa: String!) {
    diariosContables(id_empresa: $id_empresa) {
      id_diario_contable
      codigo
      nombre
    }
    planContableActivo(id_empresa: $id_empresa) {
      id_plan_contable
    }
  }
`;

const GET_CUENTAS = gql`
  query CuentasNuevoAsiento($id_plan_contable: String!) {
    cuentasContablesPorPlan(id_plan_contable: $id_plan_contable, page: 1, limit: 5000) {
      items {
        id_cuenta_contable
        codigo
        nombre
        permite_movimientos
      }
    }
  }
`;

type Linea = {
  key: string;
  id_cuenta_contable: string;
  concepto: string;
  debe: string;
  haber: string;
};

const lineaVacia = (): Linea => ({
  key: `${Date.now()}-${Math.random()}`,
  id_cuenta_contable: '',
  concepto: '',
  debe: '',
  haber: '',
});

const NuevoAsientoContable: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const diarioPref = (searchParams.get('diario') || 'OD').toUpperCase();
  const { idEmpresa } = useConfigEmpresaScope();

  const [fechaAsiento, setFechaAsiento] = useState(() => new Date().toISOString().slice(0, 10));
  const [idDiario, setIdDiario] = useState('');
  const [concepto, setConcepto] = useState('');
  const [referencia, setReferencia] = useState('');
  const [estado, setEstado] = useState<'APROBADO' | 'BORRADOR'>('APROBADO');
  const [lineas, setLineas] = useState<Linea[]>([lineaVacia(), lineaVacia()]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: maestros, loading: loadMaestros } = useQuery(GET_MAESTROS, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const diarios = maestros?.diariosContables || [];
  const idPlan = maestros?.planContableActivo?.id_plan_contable || '';

  useEffect(() => {
    if (!diarios.length || idDiario) return;
    const preferido =
      diarios.find((d: { codigo: string }) => d.codigo === diarioPref) ||
      diarios.find((d: { codigo: string }) => d.codigo === 'OD') ||
      diarios[0];
    if (preferido) setIdDiario(preferido.id_diario_contable);
  }, [diarios, diarioPref, idDiario]);

  const { data: cuentasData, loading: loadCuentas } = useQuery(GET_CUENTAS, {
    variables: { id_plan_contable: idPlan },
    skip: !idPlan,
    fetchPolicy: 'network-only',
  });

  const cuentas = (cuentasData?.cuentasContablesPorPlan?.items || []).filter(
    (c: { permite_movimientos?: boolean }) => c.permite_movimientos !== false,
  );

  const totales = useMemo(() => {
    let debe = 0;
    let haber = 0;
    for (const l of lineas) {
      debe += Number(l.debe || 0);
      haber += Number(l.haber || 0);
    }
    return { debe, haber, ok: Math.abs(debe - haber) < 0.005 && debe > 0 };
  }, [lineas]);

  const actualizarLinea = (key: string, patch: Partial<Linea>) => {
    setLineas((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idEmpresa) {
      setError('Seleccione una empresa');
      return;
    }
    if (!totales.ok) {
      setError('El asiento debe cuadrar (debe = haber) y ser mayor a cero');
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      await crearAsientoContable({
        id_diario_contable: idDiario,
        fecha_asiento: fechaAsiento,
        concepto,
        referencia: referencia || undefined,
        estado,
        movimientos: lineas.map((l, i) => ({
          id_cuenta_contable: l.id_cuenta_contable,
          concepto: l.concepto || concepto,
          debe: Number(l.debe || 0),
          haber: Number(l.haber || 0),
          orden: i + 1,
        })),
      });
      navigate('/contabilidad/asientos');
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      const d = ex.response?.data;
      setError(typeof d === 'string' ? d : JSON.stringify(d) || ex.message || 'Error al crear');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <ConfigEmpresaBar hideWhenEmpresa emptyMessage="Seleccione una empresa para ver la contabilidad." />
        <CardTitle tag="h4">Nuevo asiento contable</CardTitle>
        <p className="text-muted">
          Asiento manual (partida doble). Por defecto usa el diario OD (operaciones varias).
        </p>
        {error && <Alert color="danger">{error}</Alert>}
        {(loadMaestros || loadCuentas) && <Spinner className="mb-3" />}

        <form onSubmit={handleSubmit}>
          <div className="row g-2">
            <div className="col-md-3">
              <FormGroup>
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={fechaAsiento}
                  onChange={(e) => setFechaAsiento(e.target.value)}
                  required
                />
              </FormGroup>
            </div>
            <div className="col-md-5">
              <FormGroup>
                <Label>Diario</Label>
                <Input
                  type="select"
                  value={idDiario}
                  onChange={(e) => setIdDiario(e.target.value)}
                  required
                >
                  <option value="">Seleccione…</option>
                  {diarios.map((d: { id_diario_contable: string; codigo: string; nombre: string }) => (
                    <option key={d.id_diario_contable} value={d.id_diario_contable}>
                      {d.codigo} — {d.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </div>
            <div className="col-md-4">
              <FormGroup>
                <Label>Estado</Label>
                <Input
                  type="select"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as 'APROBADO' | 'BORRADOR')}
                >
                  <option value="APROBADO">Aprobado</option>
                  <option value="BORRADOR">Borrador</option>
                </Input>
              </FormGroup>
            </div>
          </div>

          <FormGroup>
            <Label>Concepto</Label>
            <Input value={concepto} onChange={(e) => setConcepto(e.target.value)} required />
          </FormGroup>
          <FormGroup>
            <Label>Referencia</Label>
            <Input value={referencia} onChange={(e) => setReferencia(e.target.value)} />
          </FormGroup>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>Líneas</strong>
            <Button type="button" color="secondary" size="sm" onClick={() => setLineas((p) => [...p, lineaVacia()])}>
              + Línea
            </Button>
          </div>

          <Table responsive size="sm" bordered>
            <thead>
              <tr>
                <th style={{ minWidth: 220 }}>Cuenta</th>
                <th>Concepto línea</th>
                <th className="text-end" style={{ width: 120 }}>
                  Debe
                </th>
                <th className="text-end" style={{ width: 120 }}>
                  Haber
                </th>
                <th style={{ width: 50 }} />
              </tr>
            </thead>
            <tbody>
              {lineas.map((l) => (
                <tr key={l.key}>
                  <td>
                    <Input
                      type="select"
                      value={l.id_cuenta_contable}
                      onChange={(e) => actualizarLinea(l.key, { id_cuenta_contable: e.target.value })}
                      required
                    >
                      <option value="">Cuenta…</option>
                      {cuentas.map(
                        (c: { id_cuenta_contable: string; codigo: string; nombre: string }) => (
                          <option key={c.id_cuenta_contable} value={c.id_cuenta_contable}>
                            {c.codigo} — {c.nombre}
                          </option>
                        ),
                      )}
                    </Input>
                  </td>
                  <td>
                    <Input
                      value={l.concepto}
                      onChange={(e) => actualizarLinea(l.key, { concepto: e.target.value })}
                      placeholder={concepto || 'Opcional'}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      className="text-end"
                      value={l.debe}
                      onChange={(e) =>
                        actualizarLinea(l.key, {
                          debe: e.target.value,
                          haber: e.target.value ? '' : l.haber,
                        })
                      }
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      className="text-end"
                      value={l.haber}
                      onChange={(e) =>
                        actualizarLinea(l.key, {
                          haber: e.target.value,
                          debe: e.target.value ? '' : l.debe,
                        })
                      }
                    />
                  </td>
                  <td>
                    <Button
                      type="button"
                      color="link"
                      size="sm"
                      disabled={lineas.length <= 2}
                      onClick={() => setLineas((p) => p.filter((x) => x.key !== l.key))}
                    >
                      ×
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="text-end fw-bold">
                  Totales {totales.ok ? '✓' : '⚠'}
                </td>
                <td className="text-end fw-bold">{formatMoneda(totales.debe)}</td>
                <td className="text-end fw-bold">{formatMoneda(totales.haber)}</td>
                <td />
              </tr>
            </tfoot>
          </Table>

          <Button color="primary" type="submit" disabled={guardando || !idEmpresa || !totales.ok}>
            {guardando ? 'Guardando…' : 'Guardar asiento'}
          </Button>{' '}
          <Link to="/contabilidad/asientos" className="btn btn-secondary">
            Cancelar
          </Link>
        </form>
      </CardBody>
    </Card>
  );
};

export default NuevoAsientoContable;

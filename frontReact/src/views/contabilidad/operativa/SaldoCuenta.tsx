import React, { useMemo, useState } from 'react';
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
import useJwtPayload from '../../../hooks/useJwtPayload';
import { formatMoneda, rangoAnioActual } from './operativaUtils';

const GET_SALDOS = gql`
  query SaldosPorCuenta(
    $id_empresa: String!
    $fecha_desde: String!
    $fecha_hasta: String!
    $id_diario: String
    $cuenta_desde: String
    $cuenta_hasta: String
    $subtotal_por_nivel: Boolean
  ) {
    saldosPorCuenta(
      id_empresa: $id_empresa
      fecha_desde: $fecha_desde
      fecha_hasta: $fecha_hasta
      id_diario: $id_diario
      cuenta_desde: $cuenta_desde
      cuenta_hasta: $cuenta_hasta
      subtotal_por_nivel: $subtotal_por_nivel
    ) {
      cuenta_id
      codigo
      nombre
      nivel
      total_debe
      total_haber
      saldo
    }
    diariosContables(id_empresa: $id_empresa) {
      id_diario_contable
      codigo
      nombre
    }
  }
`;

const SaldoCuenta: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);
  const { desde: defDesde, hasta: defHasta } = rangoAnioActual();

  const [fechaDesde, setFechaDesde] = useState(defDesde);
  const [fechaHasta, setFechaHasta] = useState(defHasta);
  const [idDiario, setIdDiario] = useState('');
  const [cuentaDesde, setCuentaDesde] = useState('');
  const [cuentaHasta, setCuentaHasta] = useState('');
  const [subtotalNivel, setSubtotalNivel] = useState(false);

  const { data, loading, error } = useQuery(GET_SALDOS, {
    variables: {
      id_empresa: idEmpresa,
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
      id_diario: idDiario || null,
      cuenta_desde: cuentaDesde || null,
      cuenta_hasta: cuentaHasta || null,
      subtotal_por_nivel: subtotalNivel,
    },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const filas = data?.saldosPorCuenta || [];
  const diarios = data?.diariosContables || [];

  const exportarCsv = () => {
    const header = 'cuenta;nombre;debe;haber;saldo\n';
    const body = filas
      .filter((r: { cuenta_id: string }) => !String(r.cuenta_id).startsWith('subtotal-'))
      .map(
        (r: { codigo: string; nombre: string; total_debe: number; total_haber: number; saldo: number }) =>
          `${r.codigo};${r.nombre};${r.total_debe};${r.total_haber};${r.saldo}`,
      )
      .join('\n');
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saldo-cuenta-${fechaDesde}-${fechaHasta}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <CardTitle tag="h4" className="mb-0">
            Saldo de la cuenta ({filas.length})
          </CardTitle>
          <Button color="primary" size="sm" onClick={exportarCsv} disabled={filas.length === 0}>
            EXPORTAR (CSV)
          </Button>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-md-2">
            <FormGroup>
              <Label>Fecha inicio</Label>
              <Input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
            </FormGroup>
          </div>
          <div className="col-md-2">
            <FormGroup>
              <Label>Fecha fin</Label>
              <Input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
            </FormGroup>
          </div>
          <div className="col-md-3">
            <FormGroup>
              <Label>Diarios</Label>
              <Input type="select" value={idDiario} onChange={(e) => setIdDiario(e.target.value)}>
                <option value="">Todos</option>
                {diarios.map((d: { id_diario_contable: string; codigo: string }) => (
                  <option key={d.id_diario_contable} value={d.id_diario_contable}>
                    {d.codigo}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </div>
          <div className="col-md-2">
            <FormGroup>
              <Label>Cuenta desde</Label>
              <Input value={cuentaDesde} onChange={(e) => setCuentaDesde(e.target.value)} placeholder="Código" />
            </FormGroup>
          </div>
          <div className="col-md-2">
            <FormGroup>
              <Label>Cuenta hasta</Label>
              <Input value={cuentaHasta} onChange={(e) => setCuentaHasta(e.target.value)} placeholder="Código" />
            </FormGroup>
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <FormGroup check className="mb-3">
              <Input
                type="checkbox"
                checked={subtotalNivel}
                onChange={(e) => setSubtotalNivel(e.target.checked)}
              />{' '}
              <Label check>Mostrar subtotal por nivel</Label>
            </FormGroup>
          </div>
        </div>

        {error && <Alert color="danger">Error al cargar saldos</Alert>}
        {loading && <Spinner />}

        {!loading && (
          <Table responsive hover size="sm">
            <thead>
              <tr>
                <th>Cuenta contable</th>
                <th className="text-end">Debe</th>
                <th className="text-end">Haber</th>
                <th className="text-end">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {filas.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted">
                    No se han encontrado registros
                  </td>
                </tr>
              )}
              {filas.map((r: {
                cuenta_id: string;
                codigo: string;
                nombre: string;
                total_debe: number;
                total_haber: number;
                saldo: number;
              }) => (
                <tr
                  key={r.cuenta_id}
                  className={String(r.cuenta_id).startsWith('subtotal-') ? 'table-secondary fw-bold' : ''}
                >
                  <td>
                    {r.codigo ? `${r.codigo} — ` : ''}
                    {r.nombre}
                  </td>
                  <td className="text-end">{formatMoneda(r.total_debe)}</td>
                  <td className="text-end">{formatMoneda(r.total_haber)}</td>
                  <td className="text-end">{formatMoneda(r.saldo)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default SaldoCuenta;

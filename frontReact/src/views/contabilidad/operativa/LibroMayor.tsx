import React, { useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Alert,
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

const GET_LIBRO_MAYOR = gql`
  query LibroMayorData(
    $id_empresa: String!
    $id_cuenta: String!
    $fecha_desde: String!
    $fecha_hasta: String!
  ) {
    libroMayor(
      id_empresa: $id_empresa
      id_cuenta: $id_cuenta
      fecha_desde: $fecha_desde
      fecha_hasta: $fecha_hasta
    ) {
      asiento_id
      numero
      codigo_diario
      fecha
      referencia
      concepto
      debe
      haber
      saldo_acum
    }
  }
`;

const LibroMayor: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);
  const { desde: defDesde, hasta: defHasta } = rangoAnioActual();

  const [idCuenta, setIdCuenta] = useState('');
  const [fechaDesde, setFechaDesde] = useState(defDesde);
  const [fechaHasta, setFechaHasta] = useState(defHasta);

  const GET_PLAN = gql`
    query CuentasPlanLibro($id_empresa: String!) {
      planContableActivo(id_empresa: $id_empresa) {
        id_plan_contable
      }
    }
  `;

  const { data: planData } = useQuery(GET_PLAN, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
  });

  const idPlan = planData?.planContableActivo?.id_plan_contable || '';

  const GET_CUENTAS_LIST = gql`
    query CuentasListLibro($id_plan_contable: String!) {
      cuentasContablesPorPlan(id_plan_contable: $id_plan_contable, page: 1, limit: 5000) {
        items {
          id_cuenta_contable
          codigo
          nombre
        }
      }
    }
  `;

  const { data: cuentasData } = useQuery(GET_CUENTAS_LIST, {
    variables: { id_plan_contable: idPlan },
    skip: !idPlan,
  });

  const cuentas = cuentasData?.cuentasContablesPorPlan?.items || [];

  const { data, loading, error } = useQuery(GET_LIBRO_MAYOR, {
    variables: {
      id_empresa: idEmpresa,
      id_cuenta: idCuenta,
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
    },
    skip: !idEmpresa || !idCuenta,
    fetchPolicy: 'network-only',
  });

  const filas = data?.libroMayor || [];

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">Libro Mayor</CardTitle>
        <p className="text-muted">Ver por cuenta contable (libro Mayor)</p>

        <div className="row g-2 mb-3">
          <div className="col-md-4">
            <FormGroup>
              <Label>Cuenta contable</Label>
              <Input type="select" value={idCuenta} onChange={(e) => setIdCuenta(e.target.value)}>
                <option value="">Seleccione cuenta...</option>
                {cuentas.map((c: { id_cuenta_contable: string; codigo: string; nombre: string }) => (
                  <option key={c.id_cuenta_contable} value={c.id_cuenta_contable}>
                    {c.codigo} — {c.nombre}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </div>
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
        </div>

        {error && <Alert color="danger">Error al cargar libro mayor</Alert>}
        {loading && <Spinner />}
        {!idCuenta && <Alert color="secondary">Seleccione una cuenta contable para ver movimientos.</Alert>}

        {!loading && idCuenta && (
          <Table responsive hover size="sm">
            <thead>
              <tr>
                <th>Núm. transacción</th>
                <th>Diario</th>
                <th>Fecha</th>
                <th>Doc. contabilidad</th>
                <th>Etiqueta</th>
                <th className="text-end">Debe</th>
                <th className="text-end">Haber</th>
                <th className="text-end">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {filas.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted">
                    No se han encontrado registros
                  </td>
                </tr>
              )}
              {filas.map((r: {
                asiento_id: string;
                numero: string;
                codigo_diario: string;
                fecha: string;
                referencia: string;
                concepto: string;
                debe: number;
                haber: number;
                saldo_acum: number;
              }) => (
                <tr key={`${r.asiento_id}-${r.fecha}-${r.numero}`}>
                  <td>{r.numero}</td>
                  <td>{r.codigo_diario}</td>
                  <td>{r.fecha}</td>
                  <td>{r.referencia || '—'}</td>
                  <td>{r.concepto}</td>
                  <td className="text-end">{formatMoneda(r.debe)}</td>
                  <td className="text-end">{formatMoneda(r.haber)}</td>
                  <td className="text-end">{formatMoneda(r.saldo_acum)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default LibroMayor;

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

const GET_DIARIOS = gql`
  query DiariosOperativa($id_empresa: String!) {
    diariosContables(id_empresa: $id_empresa) {
      id_diario_contable
      codigo
      nombre
    }
  }
`;

const GET_OPERACIONES = gql`
  query OperacionesDiarios(
    $id_empresa: String!
    $fecha_desde: String!
    $fecha_hasta: String!
    $id_diario: String
  ) {
    operacionesDiarios(
      id_empresa: $id_empresa
      fecha_desde: $fecha_desde
      fecha_hasta: $fecha_hasta
      id_diario: $id_diario
    ) {
      id_movimiento_contable
      numero_asiento
      codigo_diario
      fecha_asiento
      referencia
      codigo_cuenta
      subcuenta
      concepto
      debe
      haber
    }
  }
`;

const DiariosOperativa: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);
  const { desde: defDesde, hasta: defHasta } = rangoAnioActual();

  const [fechaDesde, setFechaDesde] = useState(defDesde);
  const [fechaHasta, setFechaHasta] = useState(defHasta);
  const [idDiario, setIdDiario] = useState('');

  const { data: diariosData } = useQuery(GET_DIARIOS, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
  });

  const { data, loading, error } = useQuery(GET_OPERACIONES, {
    variables: {
      id_empresa: idEmpresa,
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
      id_diario: idDiario || null,
    },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const diarios = diariosData?.diariosContables || [];
  const filas = data?.operacionesDiarios || [];

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">Diarios</CardTitle>
        <p className="text-muted">Operations — consulta de movimientos por diario</p>

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
          <div className="col-md-4">
            <FormGroup>
              <Label>Diario</Label>
              <Input type="select" value={idDiario} onChange={(e) => setIdDiario(e.target.value)}>
                <option value="">Todos</option>
                {diarios.map((d: { id_diario_contable: string; codigo: string; nombre: string }) => (
                  <option key={d.id_diario_contable} value={d.id_diario_contable}>
                    {d.codigo} — {d.nombre}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </div>
        </div>

        {error && <Alert color="danger">Error al cargar operaciones</Alert>}
        {loading && <Spinner />}

        {!loading && (
          <Table responsive hover size="sm">
            <thead>
              <tr>
                <th>Núm. transacción</th>
                <th>Diario</th>
                <th>Fecha</th>
                <th>Doc. contabilidad</th>
                <th>Cuenta</th>
                <th>Subcuenta</th>
                <th>Etiqueta</th>
                <th className="text-end">Debe</th>
                <th className="text-end">Haber</th>
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
              {filas.map((r: {
                id_movimiento_contable: string;
                numero_asiento: string;
                codigo_diario: string;
                fecha_asiento: string;
                referencia: string;
                codigo_cuenta: string;
                subcuenta: string;
                concepto: string;
                debe: number;
                haber: number;
              }) => (
                <tr key={r.id_movimiento_contable}>
                  <td>{r.numero_asiento}</td>
                  <td>{r.codigo_diario}</td>
                  <td>{r.fecha_asiento}</td>
                  <td>{r.referencia || '—'}</td>
                  <td>{r.codigo_cuenta}</td>
                  <td>{r.subcuenta || '—'}</td>
                  <td>{r.concepto}</td>
                  <td className="text-end">{formatMoneda(r.debe)}</td>
                  <td className="text-end">{formatMoneda(r.haber)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default DiariosOperativa;

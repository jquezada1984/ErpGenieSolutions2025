import React, { useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Alert,
  Card,
  CardBody,
  CardTitle,
  Collapse,
  FormGroup,
  Input,
  Label,
  Spinner,
  Table,
} from 'reactstrap';
import useJwtPayload from '../../../hooks/useJwtPayload';
import { formatMoneda, rangoAnioActual } from './operativaUtils';

const GET_ASIENTOS = gql`
  query AsientosContables(
    $id_empresa: String!
    $fecha_desde: String
    $fecha_hasta: String
    $id_diario: String
  ) {
    asientosContablesPorEmpresa(
      id_empresa: $id_empresa
      fecha_desde: $fecha_desde
      fecha_hasta: $fecha_hasta
      id_diario: $id_diario
    ) {
      id_asiento_contable
      numero_asiento
      fecha_asiento
      codigo_diario
      nombre_diario
      concepto
      referencia
      total_debe
      total_haber
      estado
      movimientos {
        id_movimiento_contable
        codigo_cuenta
        nombre_cuenta
        concepto
        debe
        haber
        orden
      }
    }
    diariosContables(id_empresa: $id_empresa) {
      id_diario_contable
      codigo
      nombre
    }
  }
`;

const AsientosContables: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);
  const { desde: defDesde, hasta: defHasta } = rangoAnioActual();

  const [fechaDesde, setFechaDesde] = useState(defDesde);
  const [fechaHasta, setFechaHasta] = useState(defHasta);
  const [idDiario, setIdDiario] = useState('');
  const [expandido, setExpandido] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GET_ASIENTOS, {
    variables: {
      id_empresa: idEmpresa,
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
      id_diario: idDiario || null,
    },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const asientos = data?.asientosContablesPorEmpresa || [];
  const diarios = data?.diariosContables || [];

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">Asientos Contables ({asientos.length})</CardTitle>

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

        {error && <Alert color="danger">Error al cargar asientos</Alert>}
        {loading && <Spinner />}

        {!loading && (
          <Table responsive hover size="sm">
            <thead>
              <tr>
                <th />
                <th>Número</th>
                <th>Fecha</th>
                <th>Diario</th>
                <th>Concepto</th>
                <th>Referencia</th>
                <th className="text-end">Debe</th>
                <th className="text-end">Haber</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {asientos.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-muted">
                    No se han encontrado registros
                  </td>
                </tr>
              )}
              {asientos.map((a: {
                id_asiento_contable: string;
                numero_asiento: string;
                fecha_asiento: string;
                codigo_diario: string;
                concepto: string;
                referencia: string;
                total_debe: number;
                total_haber: number;
                estado: string;
                movimientos: Array<{
                  id_movimiento_contable: string;
                  codigo_cuenta: string;
                  nombre_cuenta: string;
                  concepto: string;
                  debe: number;
                  haber: number;
                }>;
              }) => (
                <React.Fragment key={a.id_asiento_contable}>
                  <tr
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      setExpandido(expandido === a.id_asiento_contable ? null : a.id_asiento_contable)
                    }
                  >
                    <td>{expandido === a.id_asiento_contable ? '▼' : '▶'}</td>
                    <td>{a.numero_asiento}</td>
                    <td>{a.fecha_asiento}</td>
                    <td>{a.codigo_diario}</td>
                    <td>{a.concepto}</td>
                    <td>{a.referencia || '—'}</td>
                    <td className="text-end">{formatMoneda(a.total_debe)}</td>
                    <td className="text-end">{formatMoneda(a.total_haber)}</td>
                    <td>{a.estado}</td>
                  </tr>
                  <tr>
                    <td colSpan={9} className="p-0 border-0">
                      <Collapse isOpen={expandido === a.id_asiento_contable}>
                        <Table size="sm" className="mb-0 bg-light">
                          <thead>
                            <tr>
                              <th>Cuenta</th>
                              <th>Concepto</th>
                              <th className="text-end">Debe</th>
                              <th className="text-end">Haber</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(a.movimientos || []).map((m) => (
                              <tr key={m.id_movimiento_contable}>
                                <td>
                                  {m.codigo_cuenta} — {m.nombre_cuenta}
                                </td>
                                <td>{m.concepto}</td>
                                <td className="text-end">{formatMoneda(m.debe)}</td>
                                <td className="text-end">{formatMoneda(m.haber)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Collapse>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default AsientosContables;

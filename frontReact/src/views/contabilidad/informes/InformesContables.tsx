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
  Nav,
  NavItem,
  NavLink,
  Spinner,
  TabContent,
  TabPane,
  Table,
} from 'reactstrap';
import useJwtPayload from '../../../hooks/useJwtPayload';
import { formatMoneda, rangoAnioActual } from '../operativa/operativaUtils';

const GET_BALANCE = gql`
  query BalanceComprobacion($id_empresa: String!, $fecha_desde: String!, $fecha_hasta: String!) {
    balanceComprobacion(id_empresa: $id_empresa, fecha_desde: $fecha_desde, fecha_hasta: $fecha_hasta) {
      cuenta_id
      codigo
      nombre
      tipo
      naturaleza
      total_debe
      total_haber
      saldo
    }
  }
`;

const GET_RESULTADOS = gql`
  query EstadoResultados($id_empresa: String!, $fecha_desde: String!, $fecha_hasta: String!) {
    estadoResultados(id_empresa: $id_empresa, fecha_desde: $fecha_desde, fecha_hasta: $fecha_hasta) {
      tipo_cuenta
      total
      resultado
    }
  }
`;

const GET_BALANCE_GENERAL = gql`
  query BalanceGeneral($id_empresa: String!, $fecha_corte: String!) {
    balanceGeneralSaldos(id_empresa: $id_empresa, fecha_corte: $fecha_corte) {
      tipo_cuenta
      saldo
    }
  }
`;

const InformesContables: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);
  const { desde: defDesde, hasta: defHasta } = rangoAnioActual();

  const [tab, setTab] = useState('balance');
  const [fechaDesde, setFechaDesde] = useState(defDesde);
  const [fechaHasta, setFechaHasta] = useState(defHasta);
  const [fechaCorte, setFechaCorte] = useState(defHasta);

  const skipBalance = !idEmpresa || tab !== 'balance';
  const skipResultados = !idEmpresa || tab !== 'resultados';
  const skipGeneral = !idEmpresa || tab !== 'general';

  const qBalance = useQuery(GET_BALANCE, {
    variables: { id_empresa: idEmpresa, fecha_desde: fechaDesde, fecha_hasta: fechaHasta },
    skip: skipBalance,
    fetchPolicy: 'network-only',
  });

  const qResultados = useQuery(GET_RESULTADOS, {
    variables: { id_empresa: idEmpresa, fecha_desde: fechaDesde, fecha_hasta: fechaHasta },
    skip: skipResultados,
    fetchPolicy: 'network-only',
  });

  const qGeneral = useQuery(GET_BALANCE_GENERAL, {
    variables: { id_empresa: idEmpresa, fecha_corte: fechaCorte },
    skip: skipGeneral,
    fetchPolicy: 'network-only',
  });

  const filtrosPeriodo = (
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
    </div>
  );

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">Informes contables</CardTitle>

        <Nav tabs className="mb-3">
          <NavItem>
            <NavLink className={tab === 'balance' ? 'active' : ''} onClick={() => setTab('balance')} href="#">
              Balance de comprobación
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={tab === 'resultados' ? 'active' : ''} onClick={() => setTab('resultados')} href="#">
              Estado de resultados
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={tab === 'general' ? 'active' : ''} onClick={() => setTab('general')} href="#">
              Balance general
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={tab}>
          <TabPane tabId="balance">
            {filtrosPeriodo}
            {qBalance.loading && <Spinner />}
            {qBalance.error && <Alert color="danger">{qBalance.error.message}</Alert>}
            {!qBalance.loading && (
              <Table responsive hover size="sm">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Cuenta</th>
                    <th>Tipo</th>
                    <th className="text-end">Debe</th>
                    <th className="text-end">Haber</th>
                    <th className="text-end">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {(qBalance.data?.balanceComprobacion || []).map((r: {
                    cuenta_id: string;
                    codigo: string;
                    nombre: string;
                    tipo: string;
                    total_debe: number;
                    total_haber: number;
                    saldo: number;
                  }) => (
                    <tr key={r.cuenta_id}>
                      <td>{r.codigo}</td>
                      <td>{r.nombre}</td>
                      <td>{r.tipo}</td>
                      <td className="text-end">{formatMoneda(r.total_debe)}</td>
                      <td className="text-end">{formatMoneda(r.total_haber)}</td>
                      <td className="text-end">{formatMoneda(r.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </TabPane>

          <TabPane tabId="resultados">
            {filtrosPeriodo}
            {qResultados.loading && <Spinner />}
            {qResultados.error && <Alert color="danger">{qResultados.error.message}</Alert>}
            {!qResultados.loading && (
              <Table responsive hover size="sm">
                <thead>
                  <tr>
                    <th>Tipo cuenta</th>
                    <th className="text-end">Total</th>
                    <th className="text-end">Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {(qResultados.data?.estadoResultados || []).map((r: {
                    tipo_cuenta: string;
                    total: number;
                    resultado: number | null;
                  }, idx: number) => (
                    <tr key={`${r.tipo_cuenta}-${idx}`}>
                      <td>{r.tipo_cuenta}</td>
                      <td className="text-end">{formatMoneda(r.total)}</td>
                      <td className="text-end">
                        {r.resultado != null ? formatMoneda(r.resultado) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </TabPane>

          <TabPane tabId="general">
            <div className="row g-2 mb-3">
              <div className="col-md-3">
                <FormGroup>
                  <Label>Fecha de corte</Label>
                  <Input type="date" value={fechaCorte} onChange={(e) => setFechaCorte(e.target.value)} />
                </FormGroup>
              </div>
            </div>
            {qGeneral.loading && <Spinner />}
            {qGeneral.error && <Alert color="danger">{qGeneral.error.message}</Alert>}
            {!qGeneral.loading && (
              <Table responsive hover size="sm">
                <thead>
                  <tr>
                    <th>Tipo cuenta</th>
                    <th className="text-end">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {(qGeneral.data?.balanceGeneralSaldos || []).map((r: {
                    tipo_cuenta: string;
                    saldo: number;
                  }, idx: number) => (
                    <tr key={`${r.tipo_cuenta}-${idx}`}>
                      <td>{r.tipo_cuenta}</td>
                      <td className="text-end">{formatMoneda(r.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </TabPane>
        </TabContent>
      </CardBody>
    </Card>
  );
};

export default InformesContables;

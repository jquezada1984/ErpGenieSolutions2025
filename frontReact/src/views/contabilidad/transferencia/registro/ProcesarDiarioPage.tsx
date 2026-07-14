import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { ejecutarRegistroContable } from '../../../_apis_/contabilidad';
import { formatMoneda, rangoAnioActual } from '../../operativa/operativaUtils';

const GET_PREVIEW = gql`
  query LineasRegistro(
    $id_empresa: String!
    $origen: String!
    $fecha_desde: String!
    $fecha_hasta: String!
  ) {
    lineasRegistroContable(
      id_empresa: $id_empresa
      origen: $origen
      fecha_desde: $fecha_desde
      fecha_hasta: $fecha_hasta
    ) {
      fecha
      doc_ref
      cuenta_codigo
      subcuenta
      etiqueta
      forma_pago
      debe
      haber
    }
    estadoAreaContabilidad(id_empresa: $id_empresa) {
      paso4_periodo
      paso5_cuentas_defecto
    }
  }
`;

export type ProcesarDiarioProps = {
  codigoDiario: string;
  titulo: string;
  descripcion: string;
  origen: 'ventas' | 'compras' | 'banco';
  mostrarFormaPago?: boolean;
};

const ProcesarDiarioPage: React.FC<ProcesarDiarioProps> = ({
  codigoDiario,
  titulo,
  descripcion,
  origen,
  mostrarFormaPago = false,
}) => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);
  const { desde: defDesde, hasta: defHasta } = rangoAnioActual();

  const [fechaDesde, setFechaDesde] = useState(defDesde);
  const [fechaHasta, setFechaHasta] = useState(defHasta);
  const [estadoDiario, setEstadoDiario] = useState('pendiente');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [registrando, setRegistrando] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_PREVIEW, {
    variables: {
      id_empresa: idEmpresa,
      origen,
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
    },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const filas = data?.lineasRegistroContable || [];
  const estado = data?.estadoAreaContabilidad;
  const prereqOk = estado?.paso4_periodo && estado?.paso5_cuentas_defecto;
  const puedeRegistrar = prereqOk && filas.length > 0 && estadoDiario === 'pendiente';

  const registrar = async () => {
    setRegistrando(true);
    setMensaje(null);
    try {
      const res = await ejecutarRegistroContable(origen, { desde: fechaDesde, hasta: fechaHasta }) as {
        asientos_creados?: number;
      };
      setMensaje(`Registro completado: ${res?.asientos_creados ?? 0} asientos creados.`);
      await refetch();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error al registrar');
    } finally {
      setRegistrando(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">
          Generación de asientos contables — {codigoDiario} — {titulo}
        </CardTitle>
        <p className="text-muted">{descripcion}</p>

        {!prereqOk && (
          <Alert color="warning">
            <div>Complete los prerequisitos antes de registrar:</div>
            {!estado?.paso4_periodo && (
              <div>
                • <Link to="/contabilidad/configuracion/periodo">Defina un periodo contable abierto</Link>
              </div>
            )}
            {!estado?.paso5_cuentas_defecto && (
              <div>
                • <Link to="/contabilidad/configuracion/cuentas-defecto">Defina cuentas predeterminadas</Link>
              </div>
            )}
          </Alert>
        )}

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
              <Label>Estado de diario</Label>
              <Input type="select" value={estadoDiario} onChange={(e) => setEstadoDiario(e.target.value)}>
                <option value="pendiente">Aún no transferido a los diarios contables</option>
                <option value="transferido" disabled>Ya transferido (futuro)</option>
              </Input>
            </FormGroup>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <Button color="secondary" className="w-100" onClick={() => refetch()}>REFRESCAR</Button>
          </div>
        </div>

        <Button
          color="primary"
          className="mb-3"
          disabled={!puedeRegistrar || registrando}
          onClick={registrar}
        >
          REGISTRAR TRANSACCIONES EN CONTABILIDAD
        </Button>

        {mensaje && <Alert color="info">{mensaje}</Alert>}
        {error && <Alert color="danger">Error al cargar vista previa</Alert>}
        {loading && <Spinner />}

        {!loading && (
          <Table responsive hover size="sm">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Doc. contabilidad</th>
                <th>Cuenta</th>
                <th>Subcuenta</th>
                <th>Etiqueta operación</th>
                {mostrarFormaPago && <th>Forma de pago</th>}
                <th className="text-end">Debe</th>
                <th className="text-end">Haber</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f: {
                fecha: string;
                doc_ref: string;
                cuenta_codigo: string;
                subcuenta: string | null;
                etiqueta: string;
                forma_pago: string | null;
                debe: number;
                haber: number;
              }, idx: number) => (
                <tr key={`${f.doc_ref}-${idx}`}>
                  <td>{f.fecha}</td>
                  <td>{f.doc_ref}</td>
                  <td>{f.cuenta_codigo}</td>
                  <td>{f.subcuenta || '—'}</td>
                  <td>{f.etiqueta}</td>
                  {mostrarFormaPago && <td>{f.forma_pago || '—'}</td>}
                  <td className="text-end">{formatMoneda(f.debe)}</td>
                  <td className="text-end">{formatMoneda(f.haber)}</td>
                </tr>
              ))}
              {filas.length === 0 && (
                <tr>
                  <td colSpan={mostrarFormaPago ? 8 : 7} className="text-center text-muted">
                    No hay líneas pendientes en el periodo seleccionado
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default ProcesarDiarioPage;

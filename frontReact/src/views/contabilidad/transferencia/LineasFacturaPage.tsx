import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
import useJwtPayload from '../../../../hooks/useJwtPayload';
import {
  vincularLineasFactura,
  cambiarCuentaLineas,
} from '../../../../_apis_/contabilidad';
import { anioActual, formatImporte } from '../transferenciaUtils';

type LineaRow = {
  id_factura_linea: string;
  numero_factura: string;
  fecha_factura: string;
  ref_producto: string | null;
  descripcion: string | null;
  subtotal: number;
  tasa_iva: number | null;
  tercero_nombre: string;
  pais: string | null;
  codigo_cliente: string | null;
  codigo_proveedor: string | null;
  id_cuenta_sugerida: string | null;
  cuenta_codigo: string | null;
  cuenta_nombre: string | null;
};

type LineasPageProps = {
  titulo: string;
  hubPath: string;
  vinculadas: boolean;
  listarLineas: (anio: number, vinculadas: boolean) => Promise<LineaRow[]>;
  modo: 'vincular' | 'cambiar';
};

const GET_CUENTAS = gql`
  query CuentasLineasTransferencia($id_empresa: String!) {
    planContableActivo(id_empresa: $id_empresa) {
      id_plan_contable
    }
  }
`;

const GET_PLAN_ITEMS = gql`
  query CuentasPlanLineas($id_plan_contable: String!) {
    cuentasContablesPorPlan(id_plan_contable: $id_plan_contable, page: 1, limit: 5000) {
      items {
        id_cuenta_contable
        codigo
        nombre
      }
    }
  }
`;

const LineasFacturaPage: React.FC<LineasPageProps> = ({
  titulo,
  hubPath,
  vinculadas,
  listarLineas,
  modo,
}) => {
  const [searchParams] = useSearchParams();
  const anio = Number(searchParams.get('anio') || anioActual());
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);

  const [lineas, setLineas] = useState<LineaRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [seleccion, setSeleccion] = useState<string[]>([]);
  const [idCuenta, setIdCuenta] = useState('');
  const [procesando, setProcesando] = useState(false);

  const { data: planData } = useQuery(GET_CUENTAS, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
  });
  const idPlan = planData?.planContableActivo?.id_plan_contable || '';
  const { data: cuentasData } = useQuery(GET_PLAN_ITEMS, {
    variables: { id_plan_contable: idPlan },
    skip: !idPlan,
  });
  const cuentas = cuentasData?.cuentasContablesPorPlan?.items || [];

  const cargar = useCallback(async () => {
    setLoading(true);
    setMensaje(null);
    try {
      const rows = await listarLineas(anio, vinculadas);
      setLineas(rows);
      setSeleccion([]);
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error al cargar líneas');
    } finally {
      setLoading(false);
    }
  }, [anio, vinculadas, listarLineas]);

  useEffect(() => {
    if (idEmpresa) cargar();
  }, [idEmpresa, cargar]);

  const toggle = (id: string) => {
    setSeleccion((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    if (seleccion.length === lineas.length) setSeleccion([]);
    else setSeleccion(lineas.map((l) => l.id_factura_linea));
  };

  const confirmar = async () => {
    if (!seleccion.length || !idCuenta) {
      setMensaje('Seleccione líneas y una cuenta contable.');
      return;
    }
    setProcesando(true);
    setMensaje(null);
    try {
      if (modo === 'vincular') {
        await vincularLineasFactura(seleccion, idCuenta);
      } else {
        await cambiarCuentaLineas(seleccion, idCuenta);
      }
      setMensaje(modo === 'vincular' ? 'Líneas vinculadas correctamente.' : 'Cuenta actualizada.');
      await cargar();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error');
    } finally {
      setProcesando(false);
    }
  };

  const cif = (l: LineaRow) => l.codigo_cliente || l.codigo_proveedor || '—';

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <CardTitle tag="h4" className="mb-0">{titulo} ({anio})</CardTitle>
          <Link to={hubPath} className="btn btn-outline-secondary btn-sm">Volver al resumen</Link>
        </div>

        <div className="row g-2 align-items-end mb-3">
          <div className="col-md-5">
            <FormGroup className="mb-0">
              <Label>Cuenta del plan</Label>
              <Input type="select" value={idCuenta} onChange={(e) => setIdCuenta(e.target.value)}>
                <option value="">— Seleccionar —</option>
                {cuentas.map((c: { id_cuenta_contable: string; codigo: string; nombre: string }) => (
                  <option key={c.id_cuenta_contable} value={c.id_cuenta_contable}>
                    {c.codigo} — {c.nombre}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </div>
          <div className="col-md-3">
            <Button color="primary" disabled={procesando} onClick={confirmar}>
              {modo === 'vincular' ? 'CONFIRMAR' : 'CAMBIAR LA UNIÓN'}
            </Button>
          </div>
        </div>

        {mensaje && <Alert color="info">{mensaje}</Alert>}
        {loading && <Spinner />}

        {!loading && (
          <Table responsive hover size="sm">
            <thead>
              <tr>
                <th>
                  <Input type="checkbox" checked={seleccion.length === lineas.length && lineas.length > 0} onChange={toggleAll} />
                </th>
                <th>Id línea</th>
                <th>Factura</th>
                <th>Fecha</th>
                <th>Ref. producto</th>
                <th>Descripción</th>
                <th>Importe</th>
                <th>IVA %</th>
                <th>Tercero</th>
                <th>País</th>
                <th>CIF</th>
                <th>Cuenta</th>
              </tr>
            </thead>
            <tbody>
              {lineas.map((l) => (
                <tr key={l.id_factura_linea}>
                  <td>
                    <Input
                      type="checkbox"
                      checked={seleccion.includes(l.id_factura_linea)}
                      onChange={() => toggle(l.id_factura_linea)}
                    />
                  </td>
                  <td className="small">{l.id_factura_linea.slice(0, 8)}…</td>
                  <td>{l.numero_factura}</td>
                  <td>{String(l.fecha_factura).slice(0, 10)}</td>
                  <td>{l.ref_producto || '—'}</td>
                  <td>{l.descripcion || '—'}</td>
                  <td className="text-end">{formatImporte(Number(l.subtotal))}</td>
                  <td>{l.tasa_iva != null ? `${l.tasa_iva}%` : '—'}</td>
                  <td>{l.tercero_nombre}</td>
                  <td>{l.pais || '—'}</td>
                  <td>{cif(l)}</td>
                  <td>
                    {l.cuenta_codigo
                      ? `${l.cuenta_codigo} — ${l.cuenta_nombre}`
                      : l.id_cuenta_sugerida
                        ? '(sugerida)'
                        : '—'}
                  </td>
                </tr>
              ))}
              {lineas.length === 0 && (
                <tr><td colSpan={12} className="text-center text-muted">Sin líneas</td></tr>
              )}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default LineasFacturaPage;

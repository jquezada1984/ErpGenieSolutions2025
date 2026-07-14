import React, { useEffect, useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Input,
  Label,
  Spinner,
} from 'reactstrap';
import useJwtPayload from '../../../hooks/useJwtPayload';
import { actualizarConfiguracionContabilidad } from '../../../_apis_/contabilidad';

const GET_CONFIG = gql`
  query ConfigCierre($id_empresa: String!) {
    configuracionContabilidad(id_empresa: $id_empresa) {
      id_configuracion_contabilidad
      id_cuenta_resultado_ganancia
      id_cuenta_resultado_perdida
      id_diario_cierre
    }
    planContableActivo(id_empresa: $id_empresa) {
      id_plan_contable
    }
    diariosContables(id_empresa: $id_empresa) {
      id_diario_contable
      codigo
      nombre
    }
  }
`;

const GET_CUENTAS = gql`
  query CuentasPlanCierre($id_plan_contable: String!) {
    cuentasContablesPorPlan(id_plan_contable: $id_plan_contable, page: 1, limit: 5000) {
      items {
        id_cuenta_contable
        codigo
        nombre
      }
    }
  }
`;

const CerrarCuentas: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);
  const [form, setForm] = useState({
    id_cuenta_resultado_ganancia: '',
    id_cuenta_resultado_perdida: '',
    id_diario_cierre: '',
  });
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; text: string } | null>(null);
  const [guardando, setGuardando] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_CONFIG, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const idPlan = data?.planContableActivo?.id_plan_contable || '';
  const { data: cuentasData } = useQuery(GET_CUENTAS, {
    variables: { id_plan_contable: idPlan },
    skip: !idPlan,
  });

  const cuentas = cuentasData?.cuentasContablesPorPlan?.items || [];
  const diarios = data?.diariosContables || [];

  useEffect(() => {
    const cfg = data?.configuracionContabilidad;
    if (!cfg) return;
    setForm({
      id_cuenta_resultado_ganancia: cfg.id_cuenta_resultado_ganancia || '',
      id_cuenta_resultado_perdida: cfg.id_cuenta_resultado_perdida || '',
      id_diario_cierre: cfg.id_diario_cierre || '',
    });
  }, [data]);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);
    try {
      await actualizarConfiguracionContabilidad({
        id_cuenta_resultado_ganancia: form.id_cuenta_resultado_ganancia || null,
        id_cuenta_resultado_perdida: form.id_cuenta_resultado_perdida || null,
        id_diario_cierre: form.id_diario_cierre || null,
      });
      setMensaje({ tipo: 'ok', text: 'Configuración de cierre guardada.' });
      await refetch();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje({ tipo: 'error', text: JSON.stringify(ex.response?.data) || ex.message || 'Error' });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">Cuentas de cierre de ejercicio</CardTitle>
        <p className="text-muted">
          Defina las cuentas de resultado (ganancia/pérdida) y el diario para el asiento de cierre.
        </p>
        {error && <Alert color="danger">Error al cargar configuración</Alert>}
        {mensaje && <Alert color={mensaje.tipo === 'ok' ? 'success' : 'danger'}>{mensaje.text}</Alert>}
        {loading && <Spinner />}

        {!loading && (
          <Form onSubmit={guardar}>
            <FormGroup>
              <Label>Cuenta resultado ganancia</Label>
              <Input
                type="select"
                value={form.id_cuenta_resultado_ganancia}
                onChange={(e) => setForm({ ...form, id_cuenta_resultado_ganancia: e.target.value })}
              >
                <option value="">— Seleccionar —</option>
                {cuentas.map((c: { id_cuenta_contable: string; codigo: string; nombre: string }) => (
                  <option key={c.id_cuenta_contable} value={c.id_cuenta_contable}>
                    {c.codigo} — {c.nombre}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Cuenta resultado pérdida</Label>
              <Input
                type="select"
                value={form.id_cuenta_resultado_perdida}
                onChange={(e) => setForm({ ...form, id_cuenta_resultado_perdida: e.target.value })}
              >
                <option value="">— Seleccionar —</option>
                {cuentas.map((c: { id_cuenta_contable: string; codigo: string; nombre: string }) => (
                  <option key={c.id_cuenta_contable} value={c.id_cuenta_contable}>
                    {c.codigo} — {c.nombre}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Diario de cierre</Label>
              <Input
                type="select"
                value={form.id_diario_cierre}
                onChange={(e) => setForm({ ...form, id_diario_cierre: e.target.value })}
              >
                <option value="">— Seleccionar —</option>
                {diarios.map((d: { id_diario_contable: string; codigo: string; nombre: string }) => (
                  <option key={d.id_diario_contable} value={d.id_diario_contable}>
                    {d.codigo} — {d.nombre}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <Button color="primary" type="submit" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Grabar'}
            </Button>
          </Form>
        )}
      </CardBody>
    </Card>
  );
};

export default CerrarCuentas;

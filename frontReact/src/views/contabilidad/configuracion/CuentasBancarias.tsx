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
import { actualizarCuentaBancariaContable } from '../../../_apis_/contabilidad';

const GET_DATA = gql`
  query CuentasBancariasData($id_empresa: String!) {
    cuentasBancariasContabilidad(id_empresa: $id_empresa) {
      id_cuenta_bancaria
      numero_cuenta
      etiqueta_cuenta
      iban
      id_cuenta_contable
      id_diario_contable
      cuenta_codigo
      cuenta_nombre
      diario_codigo
    }
    diariosContables(id_empresa: $id_empresa) {
      id_diario_contable
      codigo
      nombre
    }
    planContableActivo(id_empresa: $id_empresa) {
      id_plan_contable
      nombre
    }
  }
`;

const GET_CUENTAS = gql`
  query CuentasPlanBancos($id_plan_contable: String!) {
    cuentasContablesPorPlan(id_plan_contable: $id_plan_contable, page: 1, limit: 5000) {
      items {
        id_cuenta_contable
        codigo
        nombre
      }
    }
  }
`;

const CuentasBancarias: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [guardando, setGuardando] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, { id_cuenta_contable: string; id_diario_contable: string }>>({});

  const { data, loading, error, refetch } = useQuery(GET_DATA, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const idPlan = data?.planContableActivo?.id_plan_contable || '';

  const { data: cuentasData, loading: loadingCuentas } = useQuery(GET_CUENTAS, {
    variables: { id_plan_contable: idPlan },
    skip: !idPlan,
  });

  const bancos = data?.cuentasBancariasContabilidad || [];
  const diarios = data?.diariosContables || [];
  const cuentas = cuentasData?.cuentasContablesPorPlan?.items || [];

  const getEdit = (id: string, row: { id_cuenta_contable?: string | null; id_diario_contable?: string | null }) =>
    edits[id] || {
      id_cuenta_contable: row.id_cuenta_contable || '',
      id_diario_contable: row.id_diario_contable || '',
    };

  const setEdit = (id: string, field: 'id_cuenta_contable' | 'id_diario_contable', value: string) => {
    const row = bancos.find((b: { id_cuenta_bancaria: string }) => b.id_cuenta_bancaria === id);
    const base = getEdit(id, row || {});
    setEdits((prev) => ({ ...prev, [id]: { ...base, [field]: value } }));
  };

  const guardar = async (id: string) => {
    const form = edits[id];
    if (!form) return;
    setGuardando(id);
    setMensaje(null);
    try {
      await actualizarCuentaBancariaContable(id, {
        id_cuenta_contable: form.id_cuenta_contable || null,
        id_diario_contable: form.id_diario_contable || null,
      });
      setMensaje('Cuenta bancaria actualizada.');
      await refetch();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje(JSON.stringify(ex.response?.data) || ex.message || 'Error al guardar');
    } finally {
      setGuardando(null);
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4">Cuentas bancarias contables</CardTitle>
        <p className="text-muted">Asigne cuenta del plan y diario contable a cada cuenta bancaria.</p>
        {mensaje && <Alert color="info">{mensaje}</Alert>}
        {error && <Alert color="danger">Error al cargar datos</Alert>}
        {!idPlan && !loading && <Alert color="warning">Configure un plan contable activo.</Alert>}

        {(loading || loadingCuentas) && <Spinner />}
        {!loading && (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Cuenta bancaria</th>
                <th>Nº cuenta / IBAN</th>
                <th>Cuenta contable</th>
                <th>Diario</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bancos.map((b: {
                id_cuenta_bancaria: string;
                etiqueta_cuenta: string | null;
                numero_cuenta: string | null;
                iban: string | null;
                id_cuenta_contable: string | null;
                id_diario_contable: string | null;
              }) => {
                const form = getEdit(b.id_cuenta_bancaria, b);
                return (
                  <tr key={b.id_cuenta_bancaria}>
                    <td>{b.etiqueta_cuenta || '—'}</td>
                    <td>{b.numero_cuenta || b.iban || '—'}</td>
                    <td>
                      <Input
                        type="select"
                        bsSize="sm"
                        value={form.id_cuenta_contable}
                        onChange={(e) => setEdit(b.id_cuenta_bancaria, 'id_cuenta_contable', e.target.value)}
                      >
                        <option value="">— Seleccionar —</option>
                        {cuentas.map((c: { id_cuenta_contable: string; codigo: string; nombre: string }) => (
                          <option key={c.id_cuenta_contable} value={c.id_cuenta_contable}>
                            {c.codigo} — {c.nombre}
                          </option>
                        ))}
                      </Input>
                    </td>
                    <td>
                      <Input
                        type="select"
                        bsSize="sm"
                        value={form.id_diario_contable}
                        onChange={(e) => setEdit(b.id_cuenta_bancaria, 'id_diario_contable', e.target.value)}
                      >
                        <option value="">— Seleccionar —</option>
                        {diarios.map((d: { id_diario_contable: string; codigo: string; nombre: string }) => (
                          <option key={d.id_diario_contable} value={d.id_diario_contable}>
                            {d.codigo} — {d.nombre}
                          </option>
                        ))}
                      </Input>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        color="primary"
                        disabled={guardando === b.id_cuenta_bancaria}
                        onClick={() => guardar(b.id_cuenta_bancaria)}
                      >
                        Guardar
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {bancos.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">No hay cuentas bancarias registradas</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default CuentasBancarias;

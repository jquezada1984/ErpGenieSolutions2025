import React, { useEffect, useMemo, useRef, useState } from 'react';
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
} from 'reactstrap';
import useJwtPayload from '../../../hooks/useJwtPayload';
import {
  guardarCuentasContablesDefecto,
  inicializarCuentasContablesDefecto,
} from '../../../_apis_/contabilidad';
import {
  CATALOGO_CUENTAS_DEFECTO,
  SECCIONES_CUENTA_DEFECTO,
} from '../constants/tiposCuentaDefecto';

const GET_PLAN_ACTIVO = gql`
  query GetPlanContableActivoProductos($id_empresa: String!) {
    planContableActivo(id_empresa: $id_empresa) {
      id_plan_contable
      nombre
    }
  }
`;

const GET_CUENTAS_DEFECTO = gql`
  query GetCuentasDefectoProductos($id_empresa: String!) {
    cuentasContablesDefecto(id_empresa: $id_empresa) {
      tipo_operacion
      seccion
      label
      id_cuenta_contable
      cuenta_codigo
      cuenta_nombre
    }
  }
`;

const GET_CUENTAS_PLAN = gql`
  query GetCuentasPlanProductos($id_plan_contable: String!) {
    cuentasContablesPorPlan(id_plan_contable: $id_plan_contable, page: 1, limit: 2000) {
      items {
        id_cuenta_contable
        codigo
        nombre
      }
    }
  }
`;

const ITEMS_PRODUCTO = CATALOGO_CUENTAS_DEFECTO.filter((c) => c.seccion === 'PRODUCTO');

const CuentasProductos: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);
  const [valores, setValores] = useState<Record<string, string>>({});
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; text: string } | null>(null);
  const [guardando, setGuardando] = useState(false);
  const inicializadoRef = useRef(false);

  const { data: planData, loading: loadingPlan } = useQuery(GET_PLAN_ACTIVO, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const idPlan = planData?.planContableActivo?.id_plan_contable || '';

  const { data: defectoData, loading: loadingDefecto, refetch } = useQuery(GET_CUENTAS_DEFECTO, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const { data: cuentasData, loading: loadingCuentas } = useQuery(GET_CUENTAS_PLAN, {
    variables: { id_plan_contable: idPlan },
    skip: !idPlan,
  });

  const itemsDefecto = defectoData?.cuentasContablesDefecto || [];
  const cuentasPlan = cuentasData?.cuentasContablesPorPlan?.items || [];

  useEffect(() => {
    if (!itemsDefecto.length) return;
    const map: Record<string, string> = {};
    itemsDefecto.forEach((row: { tipo_operacion: string; id_cuenta_contable: string | null }) => {
      if (row.id_cuenta_contable) map[row.tipo_operacion] = row.id_cuenta_contable;
    });
    setValores(map);
  }, [itemsDefecto]);

  useEffect(() => {
    if (!idEmpresa || loadingDefecto || inicializadoRef.current) return;
    const tieneProducto = itemsDefecto.some(
      (r: { tipo_operacion: string; id_cuenta_contable: string | null }) =>
        ITEMS_PRODUCTO.some((p) => p.tipo_operacion === r.tipo_operacion) && r.id_cuenta_contable,
    );
    if (tieneProducto) {
      inicializadoRef.current = true;
      return;
    }
    if (!idPlan) return;
    inicializadoRef.current = true;
    inicializarCuentasContablesDefecto()
      .then(() => refetch())
      .catch((err: unknown) => {
        const ex = err as { response?: { data?: unknown }; message?: string };
        setMensaje({ tipo: 'error', text: JSON.stringify(ex.response?.data) || ex.message || 'Error' });
      });
  }, [idEmpresa, loadingDefecto, itemsDefecto, idPlan, refetch]);

  const handleGuardar = async () => {
    setGuardando(true);
    setMensaje(null);
    try {
      const items = ITEMS_PRODUCTO.filter((c) => valores[c.tipo_operacion]).map((c) => ({
        tipo_operacion: c.tipo_operacion,
        id_cuenta_contable: valores[c.tipo_operacion],
      }));
      await guardarCuentasContablesDefecto(items);
      setMensaje({ tipo: 'ok', text: 'Cuentas de productos guardadas.' });
      await refetch();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje({ tipo: 'error', text: JSON.stringify(ex.response?.data) || ex.message || 'Error' });
    } finally {
      setGuardando(false);
    }
  };

  const loading = loadingPlan || loadingDefecto || loadingCuentas;

  return (
    <div className="p-3">
      <h4 className="mb-4">Cuentas contables de productos</h4>
      <p className="text-muted">{SECCIONES_CUENTA_DEFECTO.PRODUCTO}</p>
      {mensaje && <Alert color={mensaje.tipo === 'ok' ? 'success' : 'danger'}>{mensaje.text}</Alert>}
      {!idPlan && !loading && <Alert color="warning">Configure un plan contable activo.</Alert>}

      {loading ? (
        <Spinner size="sm" />
      ) : (
        <Card>
          <CardBody>
            <CardTitle tag="h6" className="text-muted border-bottom pb-2 mb-3">
              {SECCIONES_CUENTA_DEFECTO.PRODUCTO}
            </CardTitle>
            {ITEMS_PRODUCTO.map((item) => (
              <FormGroup key={item.tipo_operacion}>
                <Label>{item.label}</Label>
                <Input
                  type="select"
                  value={valores[item.tipo_operacion] || ''}
                  onChange={(e) =>
                    setValores((prev) => ({ ...prev, [item.tipo_operacion]: e.target.value }))
                  }
                  disabled={!idPlan}
                >
                  <option value="">— Seleccionar cuenta —</option>
                  {cuentasPlan.map((c: { id_cuenta_contable: string; codigo: string; nombre: string }) => (
                    <option key={c.id_cuenta_contable} value={c.id_cuenta_contable}>
                      {c.codigo} - {c.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            ))}
            <Button color="primary" disabled={guardando || !idPlan} onClick={handleGuardar}>
              {guardando ? 'Guardando...' : 'Grabar'}
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default CuentasProductos;

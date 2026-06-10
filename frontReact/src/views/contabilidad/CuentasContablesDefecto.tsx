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
import useJwtPayload from '../../hooks/useJwtPayload';
import {
  guardarCuentasContablesDefecto,
  inicializarCuentasContablesDefecto,
} from '../../_apis_/contabilidad';
import {
  CATALOGO_CUENTAS_DEFECTO,
  SECCIONES_CUENTA_DEFECTO,
} from './constants/tiposCuentaDefecto';

const GET_PLAN_ACTIVO = gql`
  query GetPlanContableActivo($id_empresa: String!) {
    planContableActivo(id_empresa: $id_empresa) {
      id_plan_contable
      nombre
    }
  }
`;

const GET_CUENTAS_DEFECTO = gql`
  query GetCuentasContablesDefecto($id_empresa: String!) {
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
  query GetCuentasPlanActivo($id_plan_contable: String!) {
    cuentasContablesPorPlan(id_plan_contable: $id_plan_contable, page: 1, limit: 2000) {
      items {
        id_cuenta_contable
        codigo
        nombre
      }
    }
  }
`;

type ValoresMap = Record<string, string>;

const CuentasContablesDefecto: React.FC = () => {
  const payloadJwt = useJwtPayload();
  const idEmpresa = useMemo(() => payloadJwt?.id_empresa || '', [payloadJwt]);

  const [valores, setValores] = useState<ValoresMap>({});
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; text: string } | null>(null);
  const [guardando, setGuardando] = useState(false);
  const inicializadoRef = useRef(false);

  const { data: planData, loading: loadingPlan } = useQuery(GET_PLAN_ACTIVO, {
    variables: { id_empresa: idEmpresa },
    skip: !idEmpresa,
    fetchPolicy: 'network-only',
  });

  const idPlan = planData?.planContableActivo?.id_plan_contable || '';

  const { data: defectoData, loading: loadingDefecto, refetch: refetchDefecto } = useQuery(
    GET_CUENTAS_DEFECTO,
    {
      variables: { id_empresa: idEmpresa },
      skip: !idEmpresa,
      fetchPolicy: 'network-only',
    },
  );

  const { data: cuentasData, loading: loadingCuentas } = useQuery(GET_CUENTAS_PLAN, {
    variables: { id_plan_contable: idPlan },
    skip: !idPlan,
    fetchPolicy: 'network-only',
  });

  const cuentasPlan = cuentasData?.cuentasContablesPorPlan?.items || [];
  const itemsDefecto = defectoData?.cuentasContablesDefecto || [];

  useEffect(() => {
    if (!itemsDefecto.length) return;
    const map: ValoresMap = {};
    itemsDefecto.forEach((row: { tipo_operacion: string; id_cuenta_contable: string | null }) => {
      if (row.id_cuenta_contable) map[row.tipo_operacion] = row.id_cuenta_contable;
    });
    setValores(map);
  }, [itemsDefecto]);

  useEffect(() => {
    if (!idEmpresa || loadingDefecto || inicializadoRef.current) return;
    const tieneValores = itemsDefecto.some(
      (r: { id_cuenta_contable: string | null }) => r.id_cuenta_contable,
    );
    if (tieneValores) {
      inicializadoRef.current = true;
      return;
    }
    if (!idPlan) return;
    inicializadoRef.current = true;
    inicializarCuentasContablesDefecto()
      .then(() => refetchDefecto())
      .catch((err: unknown) => {
        const ex = err as { response?: { data?: unknown }; message?: string };
        setMensaje({
          tipo: 'error',
          text: JSON.stringify(ex.response?.data) || ex.message || 'Error al inicializar',
        });
      });
  }, [idEmpresa, loadingDefecto, itemsDefecto, idPlan, refetchDefecto]);

  const secciones = useMemo(() => {
    const orden = ['TERCEROS_USUARIOS', 'PRODUCTO', 'SERVICIO', 'OTROS', 'ANTICIPOS'];
    return orden.map((key) => ({
      key,
      titulo: SECCIONES_CUENTA_DEFECTO[key],
      items: CATALOGO_CUENTAS_DEFECTO.filter((c) => c.seccion === key),
    }));
  }, []);

  const labelCuenta = (id: string) => {
    const c = cuentasPlan.find((x: { id_cuenta_contable: string }) => x.id_cuenta_contable === id);
    return c ? `${c.codigo} - ${c.nombre}` : '';
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setMensaje(null);
    try {
      const items = CATALOGO_CUENTAS_DEFECTO.filter((c) => valores[c.tipo_operacion]).map((c) => ({
        tipo_operacion: c.tipo_operacion,
        id_cuenta_contable: valores[c.tipo_operacion],
      }));
      await guardarCuentasContablesDefecto(items);
      setMensaje({ tipo: 'ok', text: 'Cuentas por defecto guardadas correctamente.' });
      await refetchDefecto();
    } catch (err: unknown) {
      const ex = err as { response?: { data?: unknown }; message?: string };
      setMensaje({
        tipo: 'error',
        text: JSON.stringify(ex.response?.data) || ex.message || 'Error al guardar',
      });
    } finally {
      setGuardando(false);
    }
  };

  const loading = loadingPlan || loadingDefecto || loadingCuentas;

  return (
    <div className="p-3">
      <h4 className="mb-4">Cuentas contables por defecto</h4>

      {!idEmpresa && <Alert color="warning">No se detectó empresa en la sesión.</Alert>}
      {!loadingPlan && !idPlan && (
        <Alert color="warning">
          La empresa no tiene un plan contable activo. Configure el plan antes de asignar cuentas por defecto.
        </Alert>
      )}
      {mensaje && <Alert color={mensaje.tipo === 'ok' ? 'success' : 'danger'}>{mensaje.text}</Alert>}

      {loading ? (
        <div className="d-flex align-items-center gap-2">
          <Spinner size="sm" />
          <span>Cargando...</span>
        </div>
      ) : (
        <>
          {planData?.planContableActivo?.nombre && (
            <p className="text-muted mb-3">
              Plan activo: <strong>{planData.planContableActivo.nombre}</strong>
            </p>
          )}

          {secciones.map((sec) => (
            <Card key={sec.key} className="mb-4">
              <CardBody>
                <CardTitle tag="h6" className="text-muted border-bottom pb-2 mb-3">
                  {sec.titulo}
                </CardTitle>
                {sec.items.map((item) => (
                  <FormGroup key={item.tipo_operacion}>
                    <Label>{item.label}</Label>
                    <Input
                      type="select"
                      value={valores[item.tipo_operacion] || ''}
                      onChange={(e) =>
                        setValores((prev) => ({
                          ...prev,
                          [item.tipo_operacion]: e.target.value,
                        }))
                      }
                      disabled={!idPlan || cuentasPlan.length === 0}
                    >
                      <option value="">— Seleccionar cuenta —</option>
                      {cuentasPlan.map((c: { id_cuenta_contable: string; codigo: string; nombre: string }) => (
                        <option key={c.id_cuenta_contable} value={c.id_cuenta_contable}>
                          {c.codigo} - {c.nombre}
                        </option>
                      ))}
                    </Input>
                    {valores[item.tipo_operacion] && !cuentasPlan.some(
                      (c: { id_cuenta_contable: string }) => c.id_cuenta_contable === valores[item.tipo_operacion],
                    ) && (
                      <small className="text-muted d-block">
                        Valor guardado: {labelCuenta(valores[item.tipo_operacion]) || valores[item.tipo_operacion]}
                      </small>
                    )}
                  </FormGroup>
                ))}
              </CardBody>
            </Card>
          ))}

          <Button color="primary" disabled={guardando || !idPlan} onClick={handleGuardar}>
            {guardando ? 'Guardando...' : 'Grabar'}
          </Button>
        </>
      )}
    </div>
  );
};

export default CuentasContablesDefecto;

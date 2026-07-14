import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { FieldErrors } from 'react-hook-form';
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Alert,
  Spinner,
  Form,
} from 'reactstrap';
import classnames from 'classnames';
import * as yup from 'yup';
import { useQuery, gql } from '@apollo/client';
import SeccionCuentaEmpresa from './secciones/SeccionCuentaEmpresa';
import SeccionCuentaGeneral from './secciones/SeccionCuentaGeneral';
import SeccionCuentaSaldos from './secciones/SeccionCuentaSaldos';
import SeccionCuentaDatosBancarios from './secciones/SeccionCuentaDatosBancarios';
import SeccionCuentaPropietario from './secciones/SeccionCuentaPropietario';
import { actualizarCuentaBancaria } from '../../_apis_/bancoCaja';
import {
  NuevaCuentaBancariaSchema,
  initialCuentaForm,
  type NuevaCuentaBancariaFormValues,
} from './schemas/NuevaCuentaBancariaSchema';
import {
  collectFormErrorMessages,
  getFirstErrorTab,
  yupErrorsToFieldErrors,
  type CuentaTabId,
} from './utils/cuentaFormValidation';

const GET_CUENTA = gql`
  query GetCuenta($id: ID!) {
    cuentaBancaria(id_cuenta_bancaria: $id) {
      id_cuenta_bancaria
      id_empresa
      referencia
      etiqueta_cuenta
      tipo_cuenta
      id_moneda
      estado_cuenta
      id_pais
      id_provincia
      direccion_banco
      web
      comentario
      saldo_inicial
      fecha_saldo_inicial
      saldo_minimo_autorizado
      saldo_minimo_deseado
      id_banco
      iban
      numero_cuenta
      id_tercero
      codigo_contable
      estado
    }
  }
`;

const EditarCuentaBancaria: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CuentaTabId>('1');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<NuevaCuentaBancariaFormValues>>({});
  const [showFieldErrors, setShowFieldErrors] = useState(false);

  const { data, loading: loadQ } = useQuery(GET_CUENTA, {
    variables: { id },
    skip: !id,
  });

  const { watch, setValue, getValues, reset } = useForm<NuevaCuentaBancariaFormValues>({
    defaultValues: initialCuentaForm,
  });

  useEffect(() => {
    const c = data?.cuentaBancaria;
    if (!c) return;
    reset({
      ...initialCuentaForm,
      id_empresa: c.id_empresa || '',
      referencia: c.referencia || '',
      etiqueta_cuenta: c.etiqueta_cuenta || '',
      tipo_cuenta: c.tipo_cuenta || 'corriente',
      id_moneda: c.id_moneda || '',
      estado_cuenta: c.estado_cuenta || 'abierta',
      id_pais: c.id_pais || '',
      id_provincia: c.id_provincia || '',
      direccion_banco: c.direccion_banco || '',
      web: c.web || '',
      comentario: c.comentario || '',
      saldo_inicial: Number(c.saldo_inicial) || 0,
      fecha_saldo_inicial: c.fecha_saldo_inicial ? String(c.fecha_saldo_inicial).slice(0, 10) : '',
      saldo_minimo_autorizado: Number(c.saldo_minimo_autorizado) || 0,
      saldo_minimo_deseado: Number(c.saldo_minimo_deseado) || 0,
      id_banco: c.id_banco || '',
      iban: c.iban || '',
      numero_cuenta: c.numero_cuenta || '',
      id_tercero: c.id_tercero || '',
      codigo_contable: c.codigo_contable || '',
      estado: c.estado ?? true,
    });
  }, [data, reset]);

  const formData = watch();

  const merge = useCallback(
    (patch: Record<string, unknown>) => {
      setErr(null);
      const merged = { ...getValues(), ...patch };
      (Object.keys(merged) as (keyof NuevaCuentaBancariaFormValues)[]).forEach((key) => {
        setValue(key, merged[key] as NuevaCuentaBancariaFormValues[typeof key], {
          shouldValidate: false,
          shouldDirty: true,
        });
      });
    },
    [getValues, setValue],
  );

  const showValidationErrors = useCallback((formErrors: FieldErrors<NuevaCuentaBancariaFormValues>) => {
    setFieldErrors(formErrors);
    setShowFieldErrors(true);
    const messages = collectFormErrorMessages(formErrors);
    setErr(messages.length > 0 ? messages.join(' | ') : 'Revisa los campos del formulario');
    const tab = getFirstErrorTab(formErrors);
    if (tab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const saveCuenta = useCallback(
    async (values: NuevaCuentaBancariaFormValues) => {
      if (!id) return;
      setLoading(true);
      setErr(null);
      try {
        const body: Record<string, unknown> = { ...values };
        Object.keys(body).forEach((k) => {
          if (body[k] === '' || body[k] === null) delete body[k];
        });
        await actualizarCuentaBancaria(id, body);
        navigate('/banco-cajas/cuentas');
      } catch (e: unknown) {
        const ax = e as { response?: { data?: { error?: string } }; message?: string };
        setErr(ax?.response?.data?.error || ax?.message || 'Error al actualizar');
      } finally {
        setLoading(false);
      }
    },
    [id, navigate],
  );

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErr(null);
      const values = getValues();
      try {
        const validated = await NuevaCuentaBancariaSchema.validate(values, {
          abortEarly: false,
          stripUnknown: false,
        });
        setShowFieldErrors(false);
        setFieldErrors({});
        await saveCuenta(validated as NuevaCuentaBancariaFormValues);
      } catch (validationErr: unknown) {
        if (validationErr instanceof yup.ValidationError) {
          showValidationErrors(yupErrorsToFieldErrors(validationErr));
          return;
        }
        const ax = validationErr as { message?: string };
        setErr(ax?.message || 'Error al validar el formulario');
      }
    },
    [getValues, saveCuenta, showValidationErrors],
  );

  if (loadQ) {
    return <p className="p-4 text-muted">Cargando cuenta…</p>;
  }

  const errorsToShow = showFieldErrors ? fieldErrors : undefined;

  return (
    <Card>
      <CardBody>
        <Form onSubmit={handleFormSubmit} noValidate>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle className="mb-0">Editar cuenta financiera</CardTitle>
            <Button type="submit" color="primary" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Guardar'}
            </Button>
          </div>
          {err && <Alert color="danger">{err}</Alert>}
          <SeccionCuentaEmpresa data={formData} onChange={merge} soloLectura errors={errorsToShow} />
          <Nav tabs>
            {(['1', '2', '3', '4'] as const).map((t, i) => (
              <NavItem key={t}>
                <NavLink
                  href="#"
                  className={classnames({ active: activeTab === t })}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(t);
                  }}
                >
                  {['General', 'Saldos', 'Banco', 'Propietario'][i]}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={activeTab} className="mt-4">
            <TabPane tabId="1">
              <SeccionCuentaGeneral data={formData} onChange={merge} errors={errorsToShow} />
            </TabPane>
            <TabPane tabId="2">
              <SeccionCuentaSaldos data={formData} onChange={merge} errors={errorsToShow} />
            </TabPane>
            <TabPane tabId="3">
              <SeccionCuentaDatosBancarios data={formData} onChange={merge} errors={errorsToShow} />
            </TabPane>
            <TabPane tabId="4">
              <SeccionCuentaPropietario data={formData} onChange={merge} />
            </TabPane>
          </TabContent>
        </Form>
      </CardBody>
    </Card>
  );
};

export default EditarCuentaBancaria;

import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import useJwtPayload from '../../hooks/useJwtPayload';
import SeccionCuentaEmpresa from './secciones/SeccionCuentaEmpresa';
import SeccionCuentaGeneral from './secciones/SeccionCuentaGeneral';
import SeccionCuentaSaldos from './secciones/SeccionCuentaSaldos';
import SeccionCuentaDatosBancarios from './secciones/SeccionCuentaDatosBancarios';
import SeccionCuentaPropietario from './secciones/SeccionCuentaPropietario';
import { crearCuentaBancaria } from '../../_apis_/bancoCaja';
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

const NuevoCuentaBancaria: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const payload = useJwtPayload();
  const idEmpresaFromList = (location.state as { id_empresa?: string } | null)?.id_empresa;
  const [activeTab, setActiveTab] = useState<CuentaTabId>('1');
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<NuevaCuentaBancariaFormValues>>({});
  const [showFieldErrors, setShowFieldErrors] = useState(false);

  const { watch, setValue, getValues } = useForm<NuevaCuentaBancariaFormValues>({
    defaultValues: initialCuentaForm,
  });

  const formData = watch();

  useEffect(() => {
    if (payload?.scope_acceso === 'GLOBAL') {
      if (idEmpresaFromList) {
        setValue('id_empresa', idEmpresaFromList, { shouldDirty: true });
      }
      return;
    }
    if (payload?.id_empresa) {
      setValue('id_empresa', payload.id_empresa, { shouldDirty: true });
    }
  }, [payload, idEmpresaFromList, setValue]);

  const toggle = (t: CuentaTabId) => setActiveTab(t);

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
      setLoading(true);
      setErr(null);
      try {
        const body: Record<string, unknown> = { ...values };
        Object.keys(body).forEach((k) => {
          if (body[k] === '' || body[k] === null) delete body[k];
        });
        await crearCuentaBancaria(body);
        setOk(true);
        setShowFieldErrors(false);
        setFieldErrors({});
        setTimeout(() => navigate('/banco-cajas/cuentas'), 1500);
      } catch (e: unknown) {
        const ax = e as { response?: { data?: { error?: string } }; message?: string };
        setErr(ax?.response?.data?.error || ax?.message || 'Error al crear la cuenta');
      } finally {
        setLoading(false);
      }
    },
    [navigate],
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

  const errorsToShow = showFieldErrors ? fieldErrors : undefined;

  return (
    <Card>
      <CardBody>
        <Form onSubmit={handleFormSubmit} noValidate>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle className="mb-0">
              <i className="fas fa-university text-primary me-2" />
              Nueva cuenta financiera
            </CardTitle>
            <div>
              <Button
                type="button"
                color="secondary"
                outline
                className="me-2"
                onClick={() => navigate('/banco-cajas/cuentas')}
              >
                Cancelar
              </Button>
              <Button type="submit" color="primary" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Guardando…
                  </>
                ) : (
                  'Crear cuenta'
                )}
              </Button>
            </div>
          </div>

          {ok && <Alert color="success">Cuenta creada correctamente.</Alert>}
          {err && <Alert color="danger">{err}</Alert>}

          <p className="text-muted mb-3">
            Complete la información de la cuenta y haga clic en <b>Crear cuenta</b>.
          </p>

          <SeccionCuentaEmpresa data={formData} onChange={merge} errors={errorsToShow} />

          <Nav tabs className="nav-tabs-custom">
            <NavItem>
              <NavLink
                href="#"
                className={classnames({ active: activeTab === '1' })}
                onClick={(e) => {
                  e.preventDefault();
                  toggle('1');
                }}
              >
                General
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#"
                className={classnames({ active: activeTab === '2' })}
                onClick={(e) => {
                  e.preventDefault();
                  toggle('2');
                }}
              >
                Saldos
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#"
                className={classnames({ active: activeTab === '3' })}
                onClick={(e) => {
                  e.preventDefault();
                  toggle('3');
                }}
              >
                Datos bancarios
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#"
                className={classnames({ active: activeTab === '4' })}
                onClick={(e) => {
                  e.preventDefault();
                  toggle('4');
                }}
              >
                Propietario
              </NavLink>
            </NavItem>
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

export default NuevoCuentaBancaria;

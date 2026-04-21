import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, CardBody, CardTitle, Button, Alert, Spinner, FormGroup, Label, Input, Row, Col, FormText } from 'reactstrap';

import SearchableSelect from '../../components/SearchableSelect';
import useJwtPayload from '../../hooks/useJwtPayload';
import { crearSocio, listarRolesSocio, listarTercerosDisponibles } from '../../_apis_/socio';
import '../terceros/ConfiguracionTercero.scss';

type SocioFormValues = {
  id_rol_socio: string;
  fecha_inicio: string;
  fecha_fin: string;
  terceros: string[];
};

const SocioFormSchema = yup
  .object({
    id_rol_socio: yup.string().required('El rol de socio es obligatorio'),
    fecha_inicio: yup.string().default(''),
    fecha_fin: yup.string().default(''),
    terceros: yup.array().of(yup.string().required()).min(1, 'Debe seleccionar al menos un tercero').required('Debe seleccionar al menos un tercero'),
  })
  .test('rango-fechas', 'La fecha fin debe ser mayor o igual a la fecha inicio', (value) => {
    if (!value) return true;
    if (!value.fecha_inicio || !value.fecha_fin) return true;
    return new Date(value.fecha_fin) >= new Date(value.fecha_inicio);
  });

const initialForm: SocioFormValues = {
  id_rol_socio: '',
  fecha_inicio: '',
  fecha_fin: '',
  terceros: [],
};

type Props = {
  idSocio?: string;
};

const SocioForm: React.FC<Props> = ({ idSocio }) => {
  const payload = useJwtPayload();
  const idEmpresa = payload?.id_empresa || '';
  const isEdit = !!idSocio;

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [rolOptions, setRolOptions] = useState<{ value: string; label: string }[]>([]);
  const [tercerosOptions, setTercerosOptions] = useState<{ value: string; label: string }[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingTerceros, setLoadingTerceros] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SocioFormValues>({
    resolver: yupResolver(SocioFormSchema),
    mode: 'onSubmit',
    defaultValues: initialForm,
  });

  const cargarRoles = useCallback(async () => {
    setLoadingRoles(true);
    try {
      const data = await listarRolesSocio();
      setRolOptions(
        (data || []).map((r: { id_rol_socio: string; nombre: string }) => ({
          value: r.id_rol_socio,
          label: r.nombre,
        }))
      );
    } catch (e: any) {
      setErr(e?.message || 'Error cargando roles de socio');
      setRolOptions([]);
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  const cargarTerceros = useCallback(async () => {
    if (!idEmpresa) {
      setTercerosOptions([]);
      return;
    }

    setLoadingTerceros(true);
    try {
      const data = await listarTercerosDisponibles({
        id_empresa: idEmpresa,
        id_socio: isEdit ? idSocio : null,
      });
      setTercerosOptions(
        (data || []).map((t: { id_tercero: string; nombre: string }) => ({
          value: t.id_tercero,
          label: t.nombre,
        }))
      );
    } catch (e: any) {
      setErr(e?.message || 'Error cargando terceros disponibles');
      setTercerosOptions([]);
    } finally {
      setLoadingTerceros(false);
    }
  }, [idEmpresa, isEdit, idSocio]);

  useEffect(() => {
    cargarRoles();
    cargarTerceros();
  }, [cargarRoles, cargarTerceros]);

  const onSubmitRHF = useCallback(async (values: SocioFormValues) => {
    setLoading(true);
    setErr(null);
    setOk(false);

    try {
      if (!idEmpresa) {
        setErr('Debe seleccionar una empresa');
        setLoading(false);
        return;
      }

      const cleanedData: Record<string, any> = { ...values };
      Object.keys(cleanedData).forEach((key) => {
        if (cleanedData[key] === '' || cleanedData[key] === null) {
          delete cleanedData[key];
        }
      });

      cleanedData.terceros = values.terceros || [];

      await crearSocio(cleanedData);
      setOk(true);
      reset(initialForm);
    } catch (e: any) {
      const errorMessage = e?.response?.data?.error || e?.message || 'Error al crear el socio';
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [idEmpresa, reset]);

  const onInvalid = useCallback((formErrors: any) => {
    const collectMessages = (obj: any): string[] => {
      if (!obj || typeof obj !== 'object') return [];
      if (obj.message && typeof obj.message === 'string') return [obj.message];
      return Object.values(obj).flatMap(collectMessages);
    };

    const messages = collectMessages(formErrors);
    setErr(messages.length > 0 ? messages.join(' | ') : 'Revisa los campos del formulario');
  }, []);

  return (
    <div className="configuracion-tercero">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle className="mb-0">
              <i className="fas fa-user-tie text-primary me-2" />
              Nuevo Socio
            </CardTitle>
            <div>
              <Button color="secondary" outline className="me-2" onClick={() => reset(initialForm)} disabled={loading}>
                Cancelar
              </Button>
              <Button color="primary" onClick={handleSubmit(onSubmitRHF, onInvalid)} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Guardando…
                  </>
                ) : (
                  'Crear Socio'
                )}
              </Button>
            </div>
          </div>

          {ok && <Alert color="success">Socio creado correctamente.</Alert>}
          {err && <Alert color="danger">{err}</Alert>}

          <p className="text-muted mb-3">
            Complete la información del socio y haga clic en <b>Crear Socio</b>.
          </p>

          <Card>
            <CardBody>
              <h5 className="mb-4">
                <i className="fas fa-id-card text-primary me-2" />
                Información general
              </h5>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="id_rol_socio">
                      Rol de socio <span className="text-danger">*</span>
                    </Label>
                    <Controller
                      name="id_rol_socio"
                      control={control}
                      render={({ field }) => (
                        <SearchableSelect
                          value={field.value}
                          onChange={(value) => field.onChange((value as string | null) ?? '')}
                          options={rolOptions}
                          isLoading={loadingRoles}
                          isDisabled={loadingRoles}
                          placeholder="Seleccionar rol"
                          error={errors.id_rol_socio?.message}
                        />
                      )}
                    />
                    {loadingRoles && <Spinner size="sm" className="mt-2" />}
                    {errors.id_rol_socio?.message && <FormText color="danger">{errors.id_rol_socio.message}</FormText>}
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="fecha_inicio">Fecha inicio</Label>
                    <Input id="fecha_inicio" type="date" {...register('fecha_inicio')} invalid={!!errors.fecha_inicio} />
                    {errors.fecha_inicio?.message && <FormText color="danger">{errors.fecha_inicio.message}</FormText>}
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="fecha_fin">Fecha fin</Label>
                    <Input id="fecha_fin" type="date" {...register('fecha_fin')} invalid={!!errors.fecha_fin} />
                    {errors.fecha_fin?.message && <FormText color="danger">{errors.fecha_fin.message}</FormText>}
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="terceros">
                      Terceros <span className="text-danger">*</span>
                    </Label>
                    <Controller
                      name="terceros"
                      control={control}
                      render={({ field }) => (
                        <SearchableSelect
                          value={field.value}
                          onChange={(value) => field.onChange(Array.isArray(value) ? value : [])}
                          options={tercerosOptions}
                          isLoading={loadingTerceros}
                          isDisabled={loadingTerceros || !idEmpresa}
                          placeholder={!idEmpresa ? 'Seleccione empresa primero' : 'Seleccionar terceros'}
                          error={errors.terceros?.message as string | undefined}
                          isMulti
                        />
                      )}
                    />
                    {errors.terceros?.message && <FormText color="danger">{String(errors.terceros.message)}</FormText>}
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </div>
  );
};

export default SocioForm;

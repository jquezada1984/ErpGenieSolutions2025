import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Card, CardBody, CardTitle, Button,
  Nav, NavItem, NavLink, TabContent, TabPane,
  Alert, Spinner, FormGroup, Label, Input
} from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import classnames from 'classnames';
import './ConfiguracionTercero.scss';

import SeccionTerceroGeneral from './secciones/SeccionTerceroGeneral';
import SeccionTerceroUbicacionContacto from './secciones/SeccionTerceroUbicacionContacto';
import SeccionTerceroComercialOrganizacion from './secciones/SeccionTerceroComercialOrganizacion';
import { actualizarTercero } from '../../_apis_/tercero';
import { NuevoTerceroSchema, type NuevoTerceroFormValues } from './schemas/NuevoTerceroSchema';

const initialForm: NuevoTerceroFormValues = {
  id_empresa: '',
  cliente_potencial: true,
  cliente: false,
  proveedor: false,
  nombre: '',
  apodo: '',
  codigo_cliente: '',
  codigo_proveedor: '',
  estado: true,
  sujeto_iva: true,
  id_tipo_tercero: '',
  id_tipo_entidad: '',
  direccion: '',
  poblacion: '',
  codigo_postal: '',
  id_pais: '',
  provincia: '',
  telefono: '',
  movil: '',
  fax: '',
  web: '',
  correo: '',
  logo: '',
  capital: 0,
  id_condicion_pago: '',
  id_forma_pago: '',
  id_profesional_1: '',
  id_profesional_2: '',
  cif_intra: '',
  sede_central: '',
  asignado_a: '',
};

const GET_TERCERO = gql`
  query GetTercero($id_tercero: String!) {
    tercero(id_tercero: $id_tercero) {
      id_tercero
      id_empresa
      empresa { id_empresa nombre }
      id_tipo_tercero
      tipo_tercero { id_tipo_tercero nombre }
      cliente_potencial
      cliente
      proveedor
      nombre
      apodo
      codigo_cliente
      codigo_proveedor
      estado
      sujeto_iva
      id_tipo_entidad
      direccion
      poblacion
      codigo_postal
      id_pais
      id_provincia
      telefono
      movil
      fax
      correo
      web
      id_profesional_1
      id_profesional_2
      cif_intra
      capital
      id_condicion_pago
      id_forma_pago
      sede_central
      asignado_a
    }
  }
`;

const EditarClientePotencial: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState<'1'|'2'|'3'>('1');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NuevoTerceroFormValues>({
    resolver: yupResolver(NuevoTerceroSchema),
    mode: 'onSubmit',
    defaultValues: initialForm,
  });

  const formData = watch();

  const { data, loading: loadingQuery, error: errorQuery } = useQuery(GET_TERCERO, {
    variables: { id_tercero: id ?? '' },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  const tercero = data?.tercero;
  const isClientePotencial = tercero && tercero.cliente_potencial === true;

  useEffect(() => {
    if (!tercero || !isClientePotencial) return;
    const t = tercero;
    reset({
      id_empresa: t.id_empresa ?? t.empresa?.id_empresa ?? '',
      cliente_potencial: true,
      cliente: false,
      proveedor: false,
      nombre: t.nombre ?? '',
      apodo: t.apodo ?? '',
      codigo_cliente: t.codigo_cliente ?? '',
      codigo_proveedor: t.codigo_proveedor ?? '',
      estado: !!t.estado,
      sujeto_iva: t.sujeto_iva !== false,
      id_tipo_tercero: t.id_tipo_tercero ?? t.tipo_tercero?.id_tipo_tercero ?? '',
      id_tipo_entidad: t.id_tipo_entidad ?? '',
      direccion: t.direccion ?? '',
      poblacion: t.poblacion ?? '',
      codigo_postal: t.codigo_postal ?? '',
      id_pais: t.id_pais ?? '',
      provincia: t.id_provincia ?? '',
      telefono: t.telefono ?? '',
      movil: t.movil ?? '',
      fax: t.fax ?? '',
      web: t.web ?? '',
      correo: t.correo ?? '',
      logo: '',
      capital: t.capital != null ? Number(t.capital) : 0,
      id_condicion_pago: t.id_condicion_pago ?? '',
      id_forma_pago: t.id_forma_pago ?? '',
      id_profesional_1: t.id_profesional_1 ?? '',
      id_profesional_2: t.id_profesional_2 ?? '',
      cif_intra: t.cif_intra ?? '',
      sede_central: t.sede_central ?? '',
      asignado_a: t.asignado_a ?? '',
    });
    setHasChanges(false);
  }, [tercero, isClientePotencial, reset]);

  const toggle = (t: '1'|'2'|'3') => activeTab !== t && setActiveTab(t);

  const onGeneral = useCallback((d: any) => {
    Object.entries(d).forEach(([key, value]) => {
      setValue(key as keyof NuevoTerceroFormValues, value);
    });
    setValue('cliente_potencial', true);
    setValue('cliente', false);
    setValue('proveedor', false);
    setHasChanges(true);
  }, [setValue]);

  const onUbicacion = useCallback((d: any) => {
    Object.entries(d).forEach(([key, value]) => {
      setValue(key as keyof NuevoTerceroFormValues, value);
    });
    setValue('cliente_potencial', true);
    setValue('cliente', false);
    setValue('proveedor', false);
    setHasChanges(true);
  }, [setValue]);

  const onComercial = useCallback((d: any) => {
    Object.entries(d).forEach(([key, value]) => {
      setValue(key as keyof NuevoTerceroFormValues, value);
    });
    setValue('cliente_potencial', true);
    setValue('cliente', false);
    setValue('proveedor', false);
    setHasChanges(true);
  }, [setValue]);

  const onSubmitRHF = useCallback(async (values: NuevoTerceroFormValues) => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      if (!values.id_empresa) {
        setError('Debe seleccionar una empresa');
        setLoading(false);
        return;
      }
      if (!values.nombre || !String(values.nombre).trim()) {
        setError('El nombre es obligatorio');
        setLoading(false);
        return;
      }

      const cleanedData = { ...values };
      delete (cleanedData as any).id_tercero;
      Object.keys(cleanedData).forEach((key) => {
        const v = cleanedData[key as keyof NuevoTerceroFormValues];
        if (v === '' || v === null || v === undefined) {
          delete (cleanedData as any)[key];
        }
      });
      cleanedData.id_empresa = values.id_empresa;

      cleanedData.cliente_potencial = true;
      cleanedData.cliente = false;
      cleanedData.proveedor = false;

      await actualizarTercero(id, cleanedData);
      setSuccess(true);
      setHasChanges(false);

      setTimeout(() => {
        setSuccess(false);
      }, 4000);
    } catch (e: any) {
      setError(e?.message || 'Error al actualizar el cliente potencial');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const onInvalid = useCallback((formErrors: any) => {
    const collectMessages = (obj: any): string[] => {
      if (!obj || typeof obj !== 'object') return [];
      if (obj.message && typeof obj.message === 'string') return [obj.message];
      return Object.values(obj).flatMap(collectMessages);
    };
    const messages = collectMessages(formErrors);
    setError(messages.length > 0 ? messages.join(' | ') : 'Revisa los campos del formulario');
  }, []);

  const handleCancel = () => {
    navigate('/clientes_potenciales');
  };

  return (
    <div className="configuracion-tercero">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle className="mb-0">
              <i className="fas fa-edit text-primary me-2" />
              Editar Cliente Potencial
            </CardTitle>
            <div>
              <Button color="secondary" outline className="me-2" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onClick={handleSubmit(onSubmitRHF, onInvalid)}
                disabled={loading || !hasChanges || loadingQuery || !isClientePotencial}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </div>

          {success && (
            <Alert color="success">
              Cliente potencial actualizado correctamente.
            </Alert>
          )}

          {error && (
            <Alert color="danger">{error}</Alert>
          )}

          {errorQuery && (
            <Alert color="danger">
              Error al cargar el cliente potencial: {errorQuery.message}
            </Alert>
          )}

          {tercero && !isClientePotencial && (
            <Alert color="warning">
              Este registro no es un cliente potencial. Solo se pueden editar terceros con rol Cliente potencial.
            </Alert>
          )}

          {loadingQuery && !tercero && (
            <div className="text-center py-4">
              <Spinner />
              <p className="mt-2 text-muted">Cargando cliente potencial...</p>
            </div>
          )}

          {!loadingQuery && !tercero && id && !errorQuery && (
            <Alert color="warning">Cliente potencial no encontrado.</Alert>
          )}

          {isClientePotencial && (
          <>
          <FormGroup className="mb-3">
            <div className="d-flex gap-4 flex-wrap">
              <Label check className="me-3">
                <Input type="checkbox" checked={false} disabled />
                Cliente
              </Label>
              <Label check className="me-3">
                <Input type="checkbox" checked={true} disabled />
                Cliente potencial
              </Label>
              <Label check className="me-3">
                <Input type="checkbox" checked={false} disabled />
                Proveedor
              </Label>
            </div>
          </FormGroup>

          <p className="text-muted mb-3">
            Modifique la información del cliente potencial y haga clic en <b>Guardar Cambios</b>.
          </p>

          <Nav tabs className="nav-tabs-custom">
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => toggle('1')}>
                <i className="fas fa-id-card me-2" />General
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => toggle('2')}>
                <i className="fas fa-map-marker-alt me-2" />Ubicación y contacto
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '3' })} onClick={() => toggle('3')}>
                <i className="fas fa-briefcase me-2" />Comercial / Organización
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab} className="mt-4">
            <TabPane tabId="1">
              <SeccionTerceroGeneral data={formData} onChange={onGeneral} isEdit />
            </TabPane>
            <TabPane tabId="2">
              <SeccionTerceroUbicacionContacto data={formData} onChange={onUbicacion} />
            </TabPane>
            <TabPane tabId="3">
              <SeccionTerceroComercialOrganizacion data={formData} onChange={onComercial} />
            </TabPane>
          </TabContent>
          </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default EditarClientePotencial;

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Card, CardBody, CardTitle, Button,
  Nav, NavItem, NavLink, TabContent, TabPane,
  Alert, Spinner
} from 'reactstrap';
import classnames from 'classnames';
import './ConfiguracionTercero.scss';

import SeccionTerceroGeneral from './secciones/SeccionTerceroGeneral';
import SeccionTerceroUbicacionContacto from './secciones/SeccionTerceroUbicacionContacto';
import SeccionTerceroComercialOrganizacion from './secciones/SeccionTerceroComercialOrganizacion';
import { crearTercero } from '../../_apis_/tercero';
import { NuevoTerceroSchema, type NuevoTerceroFormValues } from './schemas/NuevoTerceroSchema';

const initialForm: NuevoTerceroFormValues = {
  id_empresa: '',
  cliente_potencial: false,
  cliente: false,
  proveedor: false,
  nombre: '',
  apodo: '',
  codigo_cliente: '',
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

const NuevoTercero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'1'|'2'|'3'>('1');
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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

  const toggle = (t: '1'|'2'|'3') => activeTab !== t && setActiveTab(t);

  const onGeneral = useCallback((d: any) => {
    Object.entries(d).forEach(([key, value]) => {
      setValue(key as keyof NuevoTerceroFormValues, value);
    });
  }, [setValue]);

  const onUbicacion = useCallback((d: any) => {
    Object.entries(d).forEach(([key, value]) => {
      setValue(key as keyof NuevoTerceroFormValues, value);
    });
  }, [setValue]);

  const onComercial = useCallback((d: any) => {
    Object.entries(d).forEach(([key, value]) => {
      setValue(key as keyof NuevoTerceroFormValues, value);
    });
  }, [setValue]);

  const onSubmitRHF = useCallback(async (values: NuevoTerceroFormValues) => {
    setLoading(true);
    setErr(null);
    setOk(false);
    try {
      // Validar que id_empresa esté presente
      if (!values.id_empresa) {
        setErr('Debe seleccionar una empresa');
        setLoading(false);
        return;
      }

      // Validar que nombre esté presente
      if (!values.nombre || !values.nombre.trim()) {
        setErr('El nombre es obligatorio');
        setLoading(false);
        return;
      }

      // Limpiar campos vacíos (convertir strings vacíos a null/undefined)
      const cleanedData = { ...values };
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key as keyof NuevoTerceroFormValues] === '' || cleanedData[key as keyof NuevoTerceroFormValues] === null) {
          delete cleanedData[key as keyof NuevoTerceroFormValues];
        }
      });

      // Asegurar que id_empresa esté presente
      cleanedData.id_empresa = values.id_empresa;

      console.log('📤 Enviando tercero:', cleanedData);
      const resultado = await crearTercero(cleanedData);
      console.log('✅ Tercero creado:', resultado);
      setOk(true);

      // Limpiar formulario después de crear exitosamente
      setTimeout(() => {
        reset({
          ...initialForm,
          id_empresa: values.id_empresa,
        });
        setOk(false);
        setActiveTab('1');
      }, 2000);
    } catch (e: any) {
      console.error('❌ Error al crear tercero:', e);
      const errorMessage = e?.response?.data?.error || e?.message || 'Error al crear el tercero';
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

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
              Nuevo Tercero
            </CardTitle>
            <div>
              <Button color="secondary" outline className="me-2">Cancelar</Button>
              <Button color="primary" onClick={handleSubmit(onSubmitRHF, onInvalid)} disabled={loading}>
                {loading ? (<><Spinner size="sm" className="me-2" />Guardando…</>) : 'Crear Tercero'}
              </Button>
            </div>
          </div>

          {ok && <Alert color="success">Tercero creado correctamente.</Alert>}
          {err && <Alert color="danger">{err}</Alert>}

          <p className="text-muted mb-3">
            Complete la información del tercero y haga clic en <b>Crear Tercero</b>.
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
              <SeccionTerceroGeneral data={formData} onChange={onGeneral} />
            </TabPane>
            <TabPane tabId="2">
              <SeccionTerceroUbicacionContacto data={formData} onChange={onUbicacion} />
            </TabPane>
            <TabPane tabId="3">
              <SeccionTerceroComercialOrganizacion data={formData} onChange={onComercial} />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </div>
  );
};

export default NuevoTercero;

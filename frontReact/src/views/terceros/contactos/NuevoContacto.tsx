import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Card, CardBody, CardTitle, Button,
  Nav, NavItem, NavLink, TabContent, TabPane,
  Alert, Spinner
} from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import classnames from 'classnames';
import '../ConfiguracionTercero.scss';
import { crearContacto } from '../../../_apis_/contacto';
import { NuevoContactoSchema, type NuevoContactoFormValues } from './schemas/NuevoContactoSchema';

import SeccionContactoGeneral from './secciones/SeccionContactoGeneral';
import SeccionContactoDireccion from './secciones/SeccionContactoDireccion';
import SeccionContactoContacto from './secciones/SeccionContactoContacto';

const initialForm: NuevoContactoFormValues = {
  apellidos: '',
  nombre: '',
  titulo: '',
  puesto_trabajo: '',
  fecha_nacimiento: '',
  alerta_cumpleanos: false,
  visibilidad: '',
  direccion: '',
  codigo_postal: '',
  poblacion: '',
  id_provincia: '',
  id_pais: '',
  telefono_trabajo: '',
  telefono_particular: '',
  movil: '',
  fax: '',
  correo: '',
  estado: true,
};

const NuevoContacto: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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
  } = useForm<NuevoContactoFormValues>({
    resolver: yupResolver(NuevoContactoSchema),
    mode: 'onSubmit',
    defaultValues: initialForm,
  });

  const formData = watch();

  const toggle = (t: '1'|'2'|'3') => activeTab !== t && setActiveTab(t);

  const onGeneral = useCallback((d: any) => {
    Object.entries(d).forEach(([key, value]) => {
      setValue(key as keyof NuevoContactoFormValues, value);
    });
  }, [setValue]);

  const onDireccion = useCallback((d: any) => {
    Object.entries(d).forEach(([key, value]) => {
      setValue(key as keyof NuevoContactoFormValues, value);
    });
  }, [setValue]);

  const onContacto = useCallback((d: any) => {
    Object.entries(d).forEach(([key, value]) => {
      setValue(key as keyof NuevoContactoFormValues, value);
    });
  }, [setValue]);

  const onSubmitRHF = useCallback(async (values: NuevoContactoFormValues) => {
    if (!id) {
      setErr('Falta id del tercero');
      return;
    }
    setLoading(true);
    setErr(null);
    setOk(false);
    try {
      const payload = {
        id_tercero: id,
        apellidos_etiqueta: values.apellidos || '',
        nombre: values.nombre || '',
        titulo_cortesia: values.titulo || '',
        puesto_trabajo: values.puesto_trabajo || '',
        direccion: values.direccion || '',
        codigo_postal: values.codigo_postal || '',
        poblacion: values.poblacion || '',
        id_pais: values.id_pais || '',
        id_provincia: values.id_provincia || null,
        telefono_trabajo: values.telefono_trabajo || '',
        telefono_particular: values.telefono_particular || '',
        movil: values.movil || '',
        fax: values.fax || '',
        correo: values.correo || '',
        visibilidad: values.visibilidad || '',
        fecha_nacimiento: values.fecha_nacimiento || null,
        alerta_cumpleanos: !!values.alerta_cumpleanos,
        estado: !!values.estado,
      };
      Object.keys(payload).forEach((key) => {
        const v = payload[key];
        if (v === '' || v === null || v === undefined) {
          delete payload[key];
        }
      });
      await crearContacto(payload);
      setOk(true);
      setTimeout(() => {
        reset(initialForm);
        setOk(false);
        setActiveTab('1');
      }, 2000);
    } catch (e: any) {
      setErr(e?.message || 'Error al crear el contacto');
    } finally {
      setLoading(false);
    }
  }, [id, reset]);

  const onInvalid = useCallback((formErrors: any) => {
    const collectMessages = (obj: any): string[] => {
      if (!obj || typeof obj !== 'object') return [];
      if (obj.message && typeof obj.message === 'string') return [obj.message];
      return Object.values(obj).flatMap(collectMessages);
    };
    const messages = collectMessages(formErrors);
    setErr(messages.length > 0 ? messages.join(' | ') : 'Revisa los campos del formulario');
  }, []);

  const handleCancel = () => {
    navigate(`/terceros/${id}/contactos`);
  };

  return (
    <div className="configuracion-tercero">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle className="mb-0">
              <i className="fas fa-user-tie text-primary me-2" />
              Nuevo Contacto
            </CardTitle>
            <div>
              <Button color="secondary" outline className="me-2" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button color="primary" onClick={handleSubmit(onSubmitRHF, onInvalid)} disabled={loading}>
                {loading ? (<><Spinner size="sm" className="me-2" />Guardando…</>) : 'Crear Contacto'}
              </Button>
            </div>
          </div>

          {ok && <Alert color="success" fade={false} timeout={0}>Contacto creado correctamente.</Alert>}
          {err && <Alert color="danger" fade={false} timeout={0}>{err}</Alert>}

          <p className="text-muted mb-3">
            Complete la información del contacto y haga clic en <b>Crear Contacto</b>.
          </p>

          <Nav tabs className="nav-tabs-custom">
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => toggle('1')}>
                <i className="fas fa-id-card me-2" />General
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => toggle('2')}>
                <i className="fas fa-map-marker-alt me-2" />Dirección
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={classnames({ active: activeTab === '3' })} onClick={() => toggle('3')}>
                <i className="fas fa-phone me-2" />Contacto
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab} className="mt-4">
            <TabPane tabId="1">
              <SeccionContactoGeneral data={formData} onChange={onGeneral} />
            </TabPane>
            <TabPane tabId="2">
              <SeccionContactoDireccion data={formData} onChange={onDireccion} />
            </TabPane>
            <TabPane tabId="3">
              <SeccionContactoContacto data={formData} onChange={onContacto} />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </div>
  );
};

export default NuevoContacto;

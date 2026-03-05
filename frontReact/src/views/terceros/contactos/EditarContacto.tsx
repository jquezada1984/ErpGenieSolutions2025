import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Card, CardBody, CardTitle, Button,
  Nav, NavItem, NavLink, TabContent, TabPane,
  Alert, Spinner
} from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import classnames from 'classnames';
import '../ConfiguracionTercero.scss';

import SeccionContactoGeneral from './secciones/SeccionContactoGeneral';
import SeccionContactoDireccion from './secciones/SeccionContactoDireccion';
import SeccionContactoContacto from './secciones/SeccionContactoContacto';
import { actualizarContacto } from '../../../_apis_/contacto';
import { NuevoContactoSchema, type NuevoContactoFormValues } from './schemas/NuevoContactoSchema';

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
  provincia: '',
  id_pais: '',
  telefono_trabajo: '',
  telefono_particular: '',
  movil: '',
  fax: '',
  correo: '',
  estado: true,
};

const GET_CONTACTO = gql`
  query GetContacto($id_contacto: String!) {
    contacto(id_contacto: $id_contacto) {
      id_contacto
      id_tercero
      apellidos_etiqueta
      nombre
      titulo_cortesia
      puesto_trabajo
      direccion
      codigo_postal
      poblacion
      id_provincia
      id_pais
      telefono_trabajo
      telefono_particular
      movil
      fax
      correo
      visibilidad
      fecha_nacimiento
      alerta_cumpleanos
      estado
    }
  }
`;

const EditarContacto: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { contactoId } = useParams<{ contactoId: string }>();

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
  } = useForm<NuevoContactoFormValues>({
    resolver: yupResolver(NuevoContactoSchema),
    mode: 'onSubmit',
    defaultValues: initialForm,
  });

  const formData = watch();

  const { data, loading: loadingQuery, error: errorQuery } = useQuery(GET_CONTACTO, {
    variables: { id_contacto: contactoId ?? '' },
    skip: !contactoId,
    fetchPolicy: 'cache-and-network',
  });

  const contacto = data?.contacto;

  useEffect(() => {
    if (!contacto) return;
    const c = contacto;
    const fechaNac = c.fecha_nacimiento
      ? (typeof c.fecha_nacimiento === 'string'
          ? c.fecha_nacimiento.slice(0, 10)
          : (c.fecha_nacimiento as Date).toISOString?.().slice(0, 10) ?? '')
      : '';
    reset({
      apellidos: c.apellidos_etiqueta ?? '',
      nombre: c.nombre ?? '',
      titulo: c.titulo_cortesia ?? '',
      puesto_trabajo: c.puesto_trabajo ?? '',
      fecha_nacimiento: fechaNac,
      alerta_cumpleanos: !!c.alerta_cumpleanos,
      visibilidad: c.visibilidad ?? '',
      direccion: c.direccion ?? '',
      codigo_postal: c.codigo_postal ?? '',
      poblacion: c.poblacion ?? '',
      provincia: '',
      id_provincia: c.id_provincia ?? '',
      id_pais: c.id_pais ?? '',
      telefono_trabajo: c.telefono_trabajo ?? '',
      telefono_particular: c.telefono_particular ?? '',
      movil: c.movil ?? '',
      fax: c.fax ?? '',
      correo: c.correo ?? '',
      estado: !!c.estado,
    });
    setHasChanges(false);
  }, [contacto, reset]);

  const toggle = (t: '1'|'2'|'3') => activeTab !== t && setActiveTab(t);

  const onGeneral = useCallback((d: any) => {
    Object.entries(d).forEach(([key, value]) => {
      setValue(key as keyof NuevoContactoFormValues, value);
    });
    setHasChanges(true);
  }, [setValue]);

  const onDireccion = useCallback((d: any) => {
    Object.entries(d).forEach(([key, value]) => {
      setValue(key as keyof NuevoContactoFormValues, value);
    });
    setHasChanges(true);
  }, [setValue]);

  const onContacto = useCallback((d: any) => {
    Object.entries(d).forEach(([key, value]) => {
      setValue(key as keyof NuevoContactoFormValues, value);
    });
    setHasChanges(true);
  }, [setValue]);

  const onSubmitRHF = useCallback(async (values: NuevoContactoFormValues) => {
    if (!contactoId) return;
    setLoading(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        apellidos_etiqueta: values.apellidos || '',
        nombre: values.nombre || '',
        titulo_cortesia: values.titulo || '',
        puesto_trabajo: values.puesto_trabajo || '',
        direccion: values.direccion || '',
        codigo_postal: values.codigo_postal || '',
        poblacion: values.poblacion || '',
        id_pais: values.id_pais || '',
        provincia: values.provincia || '',
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
      await actualizarContacto(contactoId, payload);
      setSuccess(true);
      setHasChanges(false);
      setTimeout(() => setSuccess(false), 4000);
    } catch (e: any) {
      setError(e?.message || 'Error al actualizar el contacto');
    } finally {
      setLoading(false);
    }
  }, [contactoId]);

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
    navigate(`/terceros/${id}/contactos`);
  };

  return (
    <div className="configuracion-tercero">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle className="mb-0">
              <i className="fas fa-edit text-primary me-2" />
              Editar Contacto
            </CardTitle>
            <div>
              <Button color="secondary" outline className="me-2" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onClick={handleSubmit(onSubmitRHF, onInvalid)}
                disabled={loading || !hasChanges || loadingQuery || !contacto}
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
              Contacto actualizado correctamente.
            </Alert>
          )}

          {error && (
            <Alert color="danger">{error}</Alert>
          )}

          {errorQuery && (
            <Alert color="danger">
              Error al cargar el contacto: {errorQuery.message}
            </Alert>
          )}

          {loadingQuery && !contacto && (
            <div className="text-center py-4">
              <Spinner />
              <p className="mt-2 text-muted">Cargando contacto...</p>
            </div>
          )}

          {!loadingQuery && !contacto && contactoId && !errorQuery && (
            <Alert color="warning">Contacto no encontrado.</Alert>
          )}

          {contacto && (
            <>
              <p className="text-muted mb-3">
                Modifique la información del contacto y haga clic en <b>Guardar Cambios</b>.
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
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default EditarContacto;

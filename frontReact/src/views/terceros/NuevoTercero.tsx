import React, { useState, useCallback } from 'react';
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

const NuevoTercero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'1'|'2'|'3'>('1');
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>({
    id_empresa: '',                // pásalo desde contexto o prop si ya lo tienes
    cliente_potencial: false,
    cliente: false,
    proveedor: false,
    nombre: '',
    apodo: '',
    codigo_cliente: '',
    estado: true,
    sujeto_iva: true,
    id_tipo_tercero: '',
    tipo_entidad_comercial: '',
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
  });

  const toggle = (t: '1'|'2'|'3') => activeTab !== t && setActiveTab(t);

  const onGeneral = useCallback((d: any) => setFormData((p:any)=>({...p,...d})),[]);
  const onUbicacion = useCallback((d: any) => setFormData((p:any)=>({...p,...d})),[]);
  const onComercial = useCallback((d: any) => setFormData((p:any)=>({...p,...d})),[]);

  const submit = useCallback(async () => {
    setLoading(true); setErr(null); setOk(false);
    try {
      // Validar que id_empresa esté presente
      if (!formData.id_empresa) {
        setErr('Debe seleccionar una empresa');
        setLoading(false);
        return;
      }

      // Validar que nombre esté presente
      if (!formData.nombre || !formData.nombre.trim()) {
        setErr('El nombre es obligatorio');
        setLoading(false);
        return;
      }

      // Limpiar campos vacíos (convertir strings vacíos a null/undefined)
      const cleanedData = { ...formData };
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key] === '' || cleanedData[key] === null) {
          delete cleanedData[key];
        }
      });

      // Asegurar que id_empresa esté presente
      cleanedData.id_empresa = formData.id_empresa;

      console.log('📤 Enviando tercero:', cleanedData);
      const resultado = await crearTercero(cleanedData);
      console.log('✅ Tercero creado:', resultado);
      setOk(true);
      
      // Limpiar formulario después de crear exitosamente
      setTimeout(() => {
        setFormData({
          id_empresa: formData.id_empresa, // Mantener la empresa seleccionada
          cliente_potencial: false,
          cliente: false,
          proveedor: false,
          nombre: '',
          apodo: '',
          codigo_cliente: '',
          estado: true,
          sujeto_iva: true,
          id_tipo_tercero: '',
          tipo_entidad_comercial: '',
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
        });
        setOk(false);
        setActiveTab('1');
      }, 2000);
    } catch (e:any) {
      console.error('❌ Error al crear tercero:', e);
      const errorMessage = e?.response?.data?.error || e?.message || 'Error al crear el tercero';
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [formData]);

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
              <Button color="primary" onClick={submit} disabled={loading}>
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

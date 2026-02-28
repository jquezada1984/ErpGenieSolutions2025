import React, { useState, useCallback } from 'react';
import {
  Card, CardBody, CardTitle, Button,
  Nav, NavItem, NavLink, TabContent, TabPane,
  Alert, Spinner
} from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import classnames from 'classnames';
import '../ConfiguracionTercero.scss';
import { crearContacto } from '../../../_apis_/contacto';

import SeccionContactoGeneral from './secciones/SeccionContactoGeneral';
import SeccionContactoDireccion from './secciones/SeccionContactoDireccion';
import SeccionContactoContacto from './secciones/SeccionContactoContacto';

const NuevoContacto: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'1'|'2'|'3'>('1');
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>({
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
  });

  const toggle = (t: '1'|'2'|'3') => activeTab !== t && setActiveTab(t);

  const onGeneral = useCallback((d: any) => setFormData((p: any) => ({ ...p, ...d })), []);
  const onDireccion = useCallback((d: any) => setFormData((p: any) => ({ ...p, ...d })), []);
  const onContacto = useCallback((d: any) => setFormData((p: any) => ({ ...p, ...d })), []);

  const submit = useCallback(async () => {
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
        apellidos_etiqueta: formData.apellidos || '',
        nombre: formData.nombre || '',
        titulo_cortesia: formData.titulo || '',
        puesto_trabajo: formData.puesto_trabajo || '',
        direccion: formData.direccion || '',
        codigo_postal: formData.codigo_postal || '',
        poblacion: formData.poblacion || '',
        id_pais: formData.id_pais || '',
        provincia: formData.provincia || '',
        telefono_trabajo: formData.telefono_trabajo || '',
        telefono_particular: formData.telefono_particular || '',
        movil: formData.movil || '',
        fax: formData.fax || '',
        correo: formData.correo || '',
        visibilidad: formData.visibilidad || '',
        fecha_nacimiento: formData.fecha_nacimiento || null,
        alerta_cumpleanos: !!formData.alerta_cumpleanos,
        estado: !!formData.estado,
      };
      await crearContacto(payload);
      setOk(true);
      setTimeout(() => {
        setOk(false);
        setActiveTab('1');
        setFormData({
          apellidos: '', nombre: '', titulo: '', puesto_trabajo: '', fecha_nacimiento: '',
          alerta_cumpleanos: false, visibilidad: '', direccion: '', codigo_postal: '', poblacion: '', provincia: '', id_pais: '',
          telefono_trabajo: '', telefono_particular: '', movil: '', fax: '', correo: '', estado: true,
        });
      }, 2000);
    } catch (e: any) {
      setErr(e?.message || 'Error al crear el contacto');
    } finally {
      setLoading(false);
    }
  }, [formData, id]);

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
              <Button color="primary" onClick={submit} disabled={loading}>
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

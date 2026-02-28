import React, { useState, useCallback, useEffect } from 'react';
import {
  Card, CardBody, CardTitle, Button,
  Nav, NavItem, NavLink, TabContent, TabPane,
  Alert, Spinner, FormGroup, Label, Input,
  Row, Col, FormText
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import './ConfiguracionTercero.scss';
import { listarTiposTercero, crearTercero } from '../../_apis_/tercero';

import SeccionTerceroUbicacionContacto from './secciones/SeccionTerceroUbicacionContacto';
import SeccionTerceroComercialOrganizacion from './secciones/SeccionTerceroComercialOrganizacion';

const NuevoClientePotencial: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'1'|'2'|'3'>('1');
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [tiposTercero, setTiposTercero] = useState<any[]>([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [errNombre, setErrNombre] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>({
    id_empresa: '',
    cliente_potencial: true,
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

  const onGeneral = useCallback((d: any) => setFormData((p: any) => ({ ...p, ...d })), []);
  const onUbicacion = useCallback((d: any) => setFormData((p: any) => ({ ...p, ...d })), []);
  const onComercial = useCallback((d: any) => setFormData((p: any) => ({ ...p, ...d })), []);

  useEffect(() => {
    const cargarTipos = async () => {
      setLoadingTipos(true);
      try {
        const datos = await listarTiposTercero();
        setTiposTercero(datos || []);
      } catch (error) {
        console.error('Error al cargar tipos de tercero:', error);
        setTiposTercero([]);
      } finally {
        setLoadingTipos(false);
      }
    };
    cargarTipos();
  }, []);

  const chgGeneral = useCallback((e: any) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? e.target.checked : e.target.value;
    const u = { ...formData, [name]: value };
    setFormData(u);
    if (name === 'nombre') {
      setErrNombre(!String(value || '').trim() ? 'El nombre es obligatorio' : null);
    }
    onGeneral(u);
  }, [formData, onGeneral]);

  const submit = useCallback(async () => {
    setLoading(true);
    setErr(null);
    setOk(false);
    try {
      if (!formData.id_empresa) {
        setErr('Debe seleccionar una empresa');
        setLoading(false);
        return;
      }
      if (!formData.nombre || !String(formData.nombre).trim()) {
        setErr('El nombre es obligatorio');
        setLoading(false);
        return;
      }

      const cleanedData = { ...formData };
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key] === '' || cleanedData[key] === null) {
          delete cleanedData[key];
        }
      });
      cleanedData.id_empresa = formData.id_empresa;

      cleanedData.cliente_potencial = true;
      cleanedData.cliente = false;
      cleanedData.proveedor = false;

      await crearTercero(cleanedData);
      setOk(true);

      setTimeout(() => {
        setFormData({
          id_empresa: formData.id_empresa,
          cliente_potencial: true,
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
    } catch (e: any) {
      const errorMessage = e?.response?.data?.error || e?.message || 'Error al crear el cliente potencial';
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const handleCancel = () => {
    navigate('/clientes_potenciales');
  };

  return (
    <div className="configuracion-tercero">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle className="mb-0">
              <i className="fas fa-user-tie text-primary me-2" />
              Nuevo Cliente Potencial
            </CardTitle>
            <div>
              <Button color="secondary" outline className="me-2" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button color="primary" onClick={submit} disabled={loading}>
                {loading ? (<><Spinner size="sm" className="me-2" />Guardando…</>) : 'Crear Cliente Potencial'}
              </Button>
            </div>
          </div>

          {ok && <Alert color="success">Cliente potencial creado correctamente.</Alert>}
          {err && <Alert color="danger">{err}</Alert>}

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
            Complete la información del cliente potencial y haga clic en <b>Crear Cliente Potencial</b>.
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
              <Card>
                <CardBody>
                  <h5 className="mb-4"><i className="fas fa-id-card text-primary me-2" />Información general</h5>

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="nombre">Nombre del tercero <span className="text-danger">*</span></Label>
                        <Input id="nombre" name="nombre" value={formData.nombre || ''} onChange={chgGeneral} invalid={!!errNombre}/>
                        {errNombre && <FormText color="danger">{errNombre}</FormText>}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="apodo">Apodo (comercial, marca…)</Label>
                        <Input id="apodo" name="apodo" value={formData.apodo || ''} onChange={chgGeneral}/>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mt-2">
                    <Col md={4}>
                      <FormGroup>
                        <Label for="codigo_cliente">Código cliente</Label>
                        <Input id="codigo_cliente" name="codigo_cliente" value={formData.codigo_cliente || ''} onChange={chgGeneral}/>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup check className="mt-4">
                        <Input id="estado" name="estado" type="checkbox" checked={!!formData.estado} onChange={chgGeneral}/>
                        <Label for="estado" check>Activo</Label>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup check className="mt-4">
                        <Input id="sujeto_iva" name="sujeto_iva" type="checkbox" checked={!!formData.sujeto_iva} onChange={chgGeneral}/>
                        <Label for="sujeto_iva" check>Sujeto a IVA</Label>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="id_tipo_tercero">Tipo de tercero</Label>
                        <Input id="id_tipo_tercero" name="id_tipo_tercero" type="select" value={formData.id_tipo_tercero || ''} onChange={chgGeneral} disabled={loadingTipos}>
                          <option value="">{loadingTipos ? 'Cargando...' : 'Seleccionar'}</option>
                          {tiposTercero.map((tipo) => (
                            <option key={tipo.id_tipo_tercero} value={tipo.id_tipo_tercero}>
                              {tipo.nombre}
                            </option>
                          ))}
                        </Input>
                        {loadingTipos && <Spinner size="sm" className="mt-2" />}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="tipo_entidad_comercial">Tipo de entidad comercial</Label>
                        <Input id="tipo_entidad_comercial" name="tipo_entidad_comercial" type="select"
                          value={formData.tipo_entidad_comercial || ''} onChange={chgGeneral}>
                          <option value="">Seleccionar</option>
                          <option value="Natural">Natural</option>
                          <option value="Jurídica">Jurídica</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
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

export default NuevoClientePotencial;

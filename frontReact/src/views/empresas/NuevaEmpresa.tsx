import React, { useState, useCallback } from 'react';
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
  Spinner
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import { crearEmpresa } from '../../_apis_/empresa';
import ErrorAlert from '../../components/ErrorAlert';
import './ConfiguracionEmpresa.scss';

// Componentes de las secciones
import SeccionEmpresa from './secciones/SeccionEmpresa';
import SeccionRedesSociales from './secciones/SeccionRedesSociales';
import SeccionHorarioApertura from './secciones/SeccionHorarioApertura';
import SeccionContable from './secciones/SeccionContable';

const NuevaEmpresa: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    email: '',
    estado: true,
    id_moneda: '',
    id_pais: '',
    codigo_postal: '',
    poblacion: '',
    movil: '',
    fax: '',
    web: '',
    nota: '',
    sujeto_iva: true,
    id_provincia: '',
    fiscal_year_start_month: 1,
    fiscal_year_start_day: 1
  });

  const toggleTab = useCallback((tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  }, [activeTab]);

  const handleDataChange = useCallback((section: string, data: any) => {
    if (section === 'empresa') {
      setFormData(prev => ({ ...prev, ...data }));
    }
  }, []);

  const handleEmpresaChange = useCallback((data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const handleRedesSocialesChange = useCallback((data: any) => {
    // TODO: Implementar cuando se complete la sección
  }, []);

  const handleHorarioAperturaChange = useCallback((data: any) => {
    // TODO: Implementar cuando se complete la sección
  }, []);

  const handleContableChange = useCallback((data: any) => {
    // TODO: Implementar cuando se complete la sección
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await crearEmpresa(formData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/empresas');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Error al crear la empresa');
    } finally {
      setLoading(false);
    }
  }, [formData, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/empresas');
  }, [navigate]);

  return (
    <div className="configuracion-empresa">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle className="mb-0">
              <i className="fas fa-plus-circle text-primary me-2"></i>
              Nueva Empresa/Organización
            </CardTitle>
            <div>
              <Button 
                color="secondary" 
                outline 
                className="me-2"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button 
                color="primary" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Creando...
                  </>
                ) : (
                  'Crear Empresa'
                )}
              </Button>
            </div>
          </div>

          {error && <ErrorAlert error={error} />}
          
          {success && (
            <Alert color="success" className="mb-3">
              <i className="fas fa-check-circle me-2"></i>
              Empresa creada exitosamente. Redirigiendo...
            </Alert>
          )}

          <div className="instruction-text mb-4">
            <p className="text-muted">
              Complete la información de la nueva empresa/organización. Haga clic en el botón "Crear Empresa" 
              cuando haya terminado.
            </p>
          </div>

          <Nav tabs className="nav-tabs-custom">
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '1' })}
                onClick={() => toggleTab('1')}
              >
                <i className="fas fa-building me-2"></i>
                Empresa
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '2' })}
                onClick={() => toggleTab('2')}
              >
                <i className="fas fa-share-alt me-2"></i>
                Redes sociales
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '3' })}
                onClick={() => toggleTab('3')}
              >
                <i className="fas fa-clock me-2"></i>
                Horario de apertura
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '4' })}
                onClick={() => toggleTab('4')}
              >
                <i className="fas fa-calculator me-2"></i>
                Contable
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab} className="mt-4">
            <TabPane tabId="1">
              <SeccionEmpresa 
                data={formData} 
                onChange={handleEmpresaChange}
              />
            </TabPane>
            <TabPane tabId="2">
              <SeccionRedesSociales 
                data={[]} 
                onChange={handleRedesSocialesChange}
              />
            </TabPane>
            <TabPane tabId="3">
              <SeccionHorarioApertura 
                data={[]} 
                onChange={handleHorarioAperturaChange}
              />
            </TabPane>
            <TabPane tabId="4">
              <SeccionContable 
                data={undefined} 
                onChange={handleContableChange}
              />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </div>
  );
};

export default NuevaEmpresa; 
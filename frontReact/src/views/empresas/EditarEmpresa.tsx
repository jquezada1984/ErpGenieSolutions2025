import React, { useState, useEffect } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { actualizarEmpresa } from '../../_apis_/empresa';
import ErrorAlert from '../../components/ErrorAlert';
import classnames from 'classnames';
import './ConfiguracionEmpresa.scss';

// Componentes de las secciones
import SeccionEmpresa from './secciones/SeccionEmpresa';
import SeccionRedesSociales from './secciones/SeccionRedesSociales';
import SeccionHorarioApertura from './secciones/SeccionHorarioApertura';
import SeccionContable from './secciones/SeccionContable';

const GET_EMPRESA = gql`
  query GetEmpresa($id_empresa: ID!) {
    empresa(id_empresa: $id_empresa) {
      id_empresa
      nombre
      ruc
      direccion
      telefono
      email
      estado
      id_moneda
      id_pais
      codigo_postal
      poblacion
      movil
      fax
      web
      nota
      sujeto_iva
      id_provincia
      fiscal_year_start_month
      fiscal_year_start_day
    }
  }
`;

const EditarEmpresa: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
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

  const { data, loading: loadingEmpresa, error: errorEmpresa } = useQuery(GET_EMPRESA, {
    variables: { id_empresa: id! },
    onCompleted: (data) => {
      if (data.empresa) {
        setFormData({
          nombre: data.empresa.nombre,
          ruc: data.empresa.ruc,
          direccion: data.empresa.direccion || '',
          telefono: data.empresa.telefono || '',
          email: data.empresa.email || '',
          estado: data.empresa.estado,
          id_moneda: data.empresa.id_moneda || '',
          id_pais: data.empresa.id_pais || '',
          codigo_postal: data.empresa.codigo_postal || '',
          poblacion: data.empresa.poblacion || '',
          movil: data.empresa.movil || '',
          fax: data.empresa.fax || '',
          web: data.empresa.web || '',
          nota: data.empresa.nota || '',
          sujeto_iva: data.empresa.sujeto_iva,
          id_provincia: data.empresa.id_provincia || '',
          fiscal_year_start_month: data.empresa.fiscal_year_start_month || 1,
          fiscal_year_start_day: data.empresa.fiscal_year_start_day || 1
        });
      }
    }
  });

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const handleDataChange = (section: string, data: any) => {
    if (section === 'empresa') {
      setFormData(prev => ({ ...prev, ...data }));
      setHasChanges(true);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await actualizarEmpresa(id!, formData);
      setSuccess(true);
      setHasChanges(false);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/empresas');
  };

  if (loadingEmpresa) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner color="primary" />
      </div>
    );
  }

  if (errorEmpresa) {
    return <ErrorAlert error={errorEmpresa.message} />;
  }

  return (
    <div className="configuracion-empresa">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <CardTitle className="mb-0">
              <i className="fas fa-edit text-primary me-2"></i>
              Editar Empresa/Organización
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
                disabled={loading || !hasChanges}
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

          {error && <ErrorAlert error={error} />}
          
          {success && (
            <Alert color="success" className="mb-3">
              <i className="fas fa-check-circle me-2"></i>
              Empresa actualizada exitosamente
            </Alert>
          )}

          <div className="instruction-text mb-4">
            <p className="text-muted">
              Edite la información de la empresa/organización. Haga clic en el botón "Guardar Cambios" 
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
                onChange={(data: any) => handleDataChange('empresa', data)}
              />
            </TabPane>
            <TabPane tabId="2">
              <SeccionRedesSociales 
                data={[]} 
                onChange={(data: any) => handleDataChange('redes_sociales', data)}
              />
            </TabPane>
            <TabPane tabId="3">
              <SeccionHorarioApertura 
                data={[]} 
                onChange={(data: any) => handleDataChange('horarios_apertura', data)}
              />
            </TabPane>
            <TabPane tabId="4">
              <SeccionContable 
                data={undefined} 
                onChange={(data: any) => handleDataChange('identificacion', data)}
              />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditarEmpresa; 
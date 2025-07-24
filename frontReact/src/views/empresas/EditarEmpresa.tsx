import React, { useState, useEffect, useCallback } from 'react';
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
  const [dataKey, setDataKey] = useState(0); // Clave para forzar re-renderizado
  
  // Estado inicial más completo
  const [formData, setFormData] = useState({
    // Datos básicos de empresa
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
    fiscal_year_start_day: 1,
    
              // Datos de identificación
          identificacion: {
            administradores: '',
            delegado_datos: '',
            capital: undefined,
            id_tipo_entidad: undefined,
            objeto_empresa: '',
            cif_intra: '',
            id_profesional1: '',
            id_profesional2: '',
            id_profesional3: '',
            id_profesional4: '',
            id_profesional5: '',
            id_profesional6: '',
            id_profesional7: '',
            id_profesional8: '',
            id_profesional9: '',
            id_profesional10: ''
          },
    
    // Redes sociales
    redes_sociales: [],
    
    // Horarios de apertura
    horarios_apertura: []
  });

  const { data, loading: loadingEmpresa, error: errorEmpresa } = useQuery(GET_EMPRESA, {
    variables: { id_empresa: id! },
    onCompleted: (data) => {
      console.log('🎯 EditarEmpresa - Datos GraphQL recibidos:', data);
      if (data.empresa) {
        const empresa = data.empresa;
        console.log('🎯 EditarEmpresa - Empresa encontrada:', empresa);
        setFormData({
          // Datos básicos
          nombre: empresa.nombre || '',
          ruc: empresa.ruc || '',
          direccion: empresa.direccion || '',
          telefono: empresa.telefono || '',
          email: empresa.email || '',
          estado: empresa.estado ?? true,
          id_moneda: empresa.id_moneda || '',
          id_pais: empresa.id_pais || '',
          codigo_postal: empresa.codigo_postal || '',
          poblacion: empresa.poblacion || '',
          movil: empresa.movil || '',
          fax: empresa.fax || '',
          web: empresa.web || '',
          nota: empresa.nota || '',
          sujeto_iva: empresa.sujeto_iva ?? true,
          id_provincia: empresa.id_provincia || '',
          fiscal_year_start_month: empresa.fiscal_year_start_month || 1,
          fiscal_year_start_day: empresa.fiscal_year_start_day || 1,
          
          // Identificación
          identificacion: {
            administradores: '',
            delegado_datos: '',
            capital: undefined,
            id_tipo_entidad: undefined,
            objeto_empresa: '',
            cif_intra: '',
            id_profesional1: '',
            id_profesional2: '',
            id_profesional3: '',
            id_profesional4: '',
            id_profesional5: '',
            id_profesional6: '',
            id_profesional7: '',
            id_profesional8: '',
            id_profesional9: '',
            id_profesional10: ''
          },
          
          // Redes sociales
          redes_sociales: empresa.redes_sociales || [],
          
          // Horarios de apertura
          horarios_apertura: empresa.horarios_apertura || []
        });
        setDataKey(prev => prev + 1); // Incrementar clave para forzar re-renderizado
      }
    }
  });

  const toggleTab = useCallback((tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  }, [activeTab]);

  const handleDataChange = useCallback((section: string, data: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      switch (section) {
        case 'empresa':
          Object.assign(newData, data);
          break;
        case 'identificacion':
          newData.identificacion = { ...newData.identificacion, ...data };
          break;
        case 'redes_sociales':
          newData.redes_sociales = data;
          break;
        case 'horarios_apertura':
          newData.horarios_apertura = data;
          break;
        default:
          Object.assign(newData, data);
      }
      
      return newData;
    });
    setHasChanges(true);
  }, []);

  // Callbacks optimizados para cada sección
  const handleEmpresaChange = useCallback((data: any) => {
    handleDataChange('empresa', data);
  }, [handleDataChange]);

  const handleIdentificacionChange = useCallback((data: any) => {
    handleDataChange('identificacion', data);
  }, [handleDataChange]);

  const handleRedesSocialesChange = useCallback((data: any) => {
    handleDataChange('redes_sociales', data);
  }, [handleDataChange]);

  const handleHorariosAperturaChange = useCallback((data: any) => {
    handleDataChange('horarios_apertura', data);
  }, [handleDataChange]);

  const handleSubmit = useCallback(async () => {
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
  }, [id, formData]);

  const handleCancel = useCallback(() => {
    navigate('/empresas');
  }, [navigate]);



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
                onChange={handleEmpresaChange}
              />
            </TabPane>
            <TabPane tabId="2">
              <SeccionRedesSociales 
                data={formData.redes_sociales} 
                onChange={handleRedesSocialesChange}
              />
            </TabPane>
            <TabPane tabId="3">
              <SeccionHorarioApertura 
                data={formData.horarios_apertura} 
                onChange={handleHorariosAperturaChange}
              />
            </TabPane>
            <TabPane tabId="4">
              <SeccionContable 
                data={formData.identificacion} 
                onChange={handleIdentificacionChange}
              />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditarEmpresa; 
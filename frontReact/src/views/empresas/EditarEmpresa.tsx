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
      identificacion {
        administradores
        delegado_datos
        capital
        id_tipo_entidad
        objeto_empresa
        cif_intra
        id_profesional1
        id_profesional2
        id_profesional3
        id_profesional4
        id_profesional5
        id_profesional6
        id_profesional7
        id_profesional8
        id_profesional9
        id_profesional10
      }
      redes_sociales {
        id
        id_red_social
        identificador
        url
        es_principal
        red_social {
          id_red_social
          nombre
          icono
        }
      }
      horarios_apertura {
        id_horario
        dia
        valor
      }
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

  const { data, loading: loadingEmpresa, error: errorEmpresa, refetch } = useQuery(GET_EMPRESA, {
    variables: { id_empresa: id! }
  });

  // Efecto para manejar los datos cuando se cargan
  useEffect(() => {
    if (data?.empresa) {
      console.log('🎯 EditarEmpresa - Datos GraphQL recibidos:', data);
      const empresa = data.empresa;
      console.log('🎯 EditarEmpresa - Empresa encontrada:', empresa);
      
      // Logging específico para redes sociales
      if (empresa.redes_sociales) {
        console.log('🔗 Redes sociales recibidas:', empresa.redes_sociales);
        console.log('🔗 Número de redes sociales:', empresa.redes_sociales.length);
        empresa.redes_sociales.forEach((red: any, index: number) => {
          console.log(`🔗 Red ${index + 1}:`, red);
        });
      } else {
        console.log('🔗 No se recibieron redes sociales');
      }
      
      // Logging para horarios de apertura
      if (empresa.horarios_apertura) {
        console.log('🕐 Horarios de apertura recibidos:', empresa.horarios_apertura);
      } else {
        console.log('🕐 No se recibieron horarios de apertura');
      }
      
      // Logging específico para identificación
      if (empresa.identificacion) {
        console.log('📊 Identificación recibida:', empresa.identificacion);
        console.log('📊 Campos de identificación:', {
          administradores: empresa.identificacion.administradores,
          delegado_datos: empresa.identificacion.delegado_datos,
          capital: empresa.identificacion.capital,
          id_tipo_entidad: empresa.identificacion.id_tipo_entidad,
          objeto_empresa: empresa.identificacion.objeto_empresa,
          cif_intra: empresa.identificacion.cif_intra,
          id_profesional1: empresa.identificacion.id_profesional1,
          id_profesional2: empresa.identificacion.id_profesional2,
          id_profesional3: empresa.identificacion.id_profesional3,
          id_profesional4: empresa.identificacion.id_profesional4,
          id_profesional5: empresa.identificacion.id_profesional5,
          id_profesional6: empresa.identificacion.id_profesional6,
          id_profesional7: empresa.identificacion.id_profesional7,
          id_profesional8: empresa.identificacion.id_profesional8,
          id_profesional9: empresa.identificacion.id_profesional9,
          id_profesional10: empresa.identificacion.id_profesional10
        });
      } else {
        console.log('📊 No se recibió identificación');
      }
      
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
        identificacion: empresa.identificacion || {
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
  }, [data]);

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
    console.log('📊 EditarEmpresa - Recibiendo datos de identificación:', data);
    handleDataChange('identificacion', data);
  }, [handleDataChange]);

  const handleRedesSocialesChange = useCallback((data: any) => {
    console.log('🔗 EditarEmpresa - Recibiendo datos de redes sociales:', data);
    handleDataChange('redes_sociales', data);
  }, [handleDataChange]);

  const handleHorariosAperturaChange = useCallback((data: any) => {
    console.log('🕐 EditarEmpresa - Recibiendo datos de horarios de apertura:', data);
    handleDataChange('horarios_apertura', data);
  }, [handleDataChange]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    console.log('💾 EditarEmpresa - Enviando datos al backend:', formData);
    console.log('💾 EditarEmpresa - Datos de identificación:', formData.identificacion);
    
    try {
      await actualizarEmpresa(id!, formData);
      setSuccess(true);
      setHasChanges(false);
      
      // Refetch los datos después de guardar exitosamente
      console.log('🔄 Refetching datos después del guardado...');
      await refetch();
      console.log('✅ Datos refetchados exitosamente');
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la empresa');
    } finally {
      setLoading(false);
    }
  }, [id, formData, refetch]);

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
            <Alert color="success" className="mb-3" isOpen={success} toggle={() => setSuccess(false)} fade={false} timeout={0}>
              <i className="bi bi-check-circle me-2"></i>
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
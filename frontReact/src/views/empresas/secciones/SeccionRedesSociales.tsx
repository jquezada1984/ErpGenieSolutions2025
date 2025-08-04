import React, { useState, useEffect, useCallback } from 'react';
import { 
  Row, 
  Col, 
  FormGroup, 
  Label, 
  Input, 
  Table,
  Card,
  CardBody,
  Button
} from 'reactstrap';
import './SeccionRedesSociales.scss';

interface RedSocial {
  id: string;
  id_red_social: string;
  identificador?: string;
  url?: string;
  es_principal: boolean;
  red_social: {
    id_red_social: string;
    nombre: string;
    icono: string;
  };
}

interface SeccionRedesSocialesProps {
  data: RedSocial[];
  onChange: (data: RedSocial[]) => void;
}

const SeccionRedesSociales: React.FC<SeccionRedesSocialesProps> = ({ data, onChange }) => {
  const [redesSociales, setRedesSociales] = useState<RedSocial[]>(data || []);
  
  // Datos maestros de redes sociales (mock por ahora)
  const redesDisponibles = [
    { id_red_social: '1', nombre: 'Facebook', icono: '📘' },
    { id_red_social: '2', nombre: 'Instagram', icono: '📷' },
    { id_red_social: '3', nombre: 'LinkedIn', icono: '💼' },
    { id_red_social: '4', nombre: 'Skype', icono: '📞' },
    { id_red_social: '5', nombre: 'Snapchat', icono: '👻' },
    { id_red_social: '6', nombre: 'WhatsApp', icono: '💬' },
    { id_red_social: '7', nombre: 'Twitter', icono: '🐦' },
    { id_red_social: '8', nombre: 'YouTube', icono: '📺' }
  ];
  
  // Sincronizar el estado interno cuando cambien los datos externos
  useEffect(() => {
    if (data) {
      setRedesSociales(data || []);
    }
  }, [data]);

  const handleRedesSocialesChange = useCallback((newRedesSociales: any[]) => {
    setRedesSociales(newRedesSociales);
    onChange(newRedesSociales);
  }, [onChange]);

  // Notificar cambios al componente padre cuando cambie el estado interno
  useEffect(() => {
    onChange(redesSociales);
  }, [redesSociales, onChange]);

  const handleInputChange = (id: string, field: string, value: any) => {
    setRedesSociales(prev => 
      prev.map(red => 
        red.id === id 
          ? { ...red, [field]: value }
          : field === 'es_principal' && value === true
            ? { ...red, es_principal: false }
            : red
      )
    );
  };

  const addRedSocial = () => {
    const nuevaRed: RedSocial = {
      id: `temp_${Date.now()}`,
      id_red_social: '',
      identificador: '',
      url: '',
      es_principal: false,
      red_social: {
        id_red_social: '',
        nombre: '',
        icono: ''
      }
    };
    setRedesSociales(prev => [...prev, nuevaRed]);
  };

  const removeRedSocial = (id: string) => {
    setRedesSociales(prev => prev.filter(red => red.id !== id));
  };

  const getRedSocialInfo = (idRedSocial: string) => {
    return redesDisponibles.find(red => red.id_red_social === idRedSocial);
  };

  const handleRedSocialChange = (id: string, idRedSocial: string) => {
    const redInfo = getRedSocialInfo(idRedSocial);
    if (redInfo) {
      setRedesSociales(prev => 
        prev.map(red => 
          red.id === id 
            ? { 
                ...red, 
                id_red_social: idRedSocial,
                red_social: {
                  id_red_social: redInfo.id_red_social,
                  nombre: redInfo.nombre,
                  icono: redInfo.icono
                }
              }
            : red
        )
      );
    }
  };

  return (
    <div className="seccion-redes-sociales">
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">
              <i className="fas fa-share-alt text-primary me-2"></i>
              Redes Sociales
            </h5>
            <Button 
              color="primary" 
              size="sm"
              onClick={addRedSocial}
            >
              <i className="fas fa-plus me-1"></i>
              Agregar Red Social
            </Button>
          </div>

          <p className="text-muted mb-4">
            Edite la información de su empresa/organización. Haga clic en el botón "Grabar" 
            en la parte inferior de la página cuando haya terminado. Es posible que haya más 
            redes sociales disponibles habilitando el módulo 'Redes sociales'.
          </p>

          <Table responsive className="table-custom">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Redes sociales</th>
                <th style={{ width: '70%' }}>ID de red social</th>
                <th style={{ width: '50px' }}>Principal</th>
                <th style={{ width: '50px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {redesSociales.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">
                    <i className="fas fa-info-circle me-2"></i>
                    No hay redes sociales configuradas
                  </td>
                </tr>
              ) : (
                redesSociales.map((red, index) => (
                  <tr key={red.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="me-2" style={{ fontSize: '1.2em' }}>
                          {red.red_social?.icono || '📱'}
                        </span>
                        <span>{red.red_social?.nombre || 'Seleccionar red'}</span>
                      </div>
                    </td>
                    <td>
                      <Row>
                        <Col md={6}>
                          <FormGroup className="mb-2">
                            <Label for={`red-${red.id}`} size="sm">
                              Red Social
                            </Label>
                                                         <Input
                               id={`red-${red.id}`}
                               type="select"
                               bsSize="sm"
                               value={red.id_red_social}
                               onChange={(e) => handleRedSocialChange(red.id, e.target.value)}
                             >
                              <option value="">Seleccionar red social</option>
                              {redesDisponibles.map(redDisponible => (
                                <option key={redDisponible.id_red_social} value={redDisponible.id_red_social}>
                                  {redDisponible.icono} {redDisponible.nombre}
                                </option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup className="mb-2">
                            <Label for={`identificador-${red.id}`} size="sm">
                              Identificador/Usuario
                            </Label>
                                                         <Input
                               id={`identificador-${red.id}`}
                               type="text"
                               bsSize="sm"
                               placeholder="usuario o ID"
                               value={red.identificador || ''}
                               onChange={(e) => handleInputChange(red.id, 'identificador', e.target.value)}
                             />
                          </FormGroup>
                        </Col>
                      </Row>
                      <FormGroup className="mb-0">
                        <Label for={`url-${red.id}`} size="sm">
                          URL (opcional)
                        </Label>
                                                 <Input
                           id={`url-${red.id}`}
                           type="url"
                           bsSize="sm"
                           placeholder="https://..."
                           value={red.url || ''}
                           onChange={(e) => handleInputChange(red.id, 'url', e.target.value)}
                         />
                      </FormGroup>
                    </td>
                    <td className="text-center">
                      <FormGroup check className="mb-0">
                        <Input
                          type="radio"
                          name="es_principal"
                          checked={red.es_principal}
                          onChange={() => handleInputChange(red.id, 'es_principal', true)}
                        />
                      </FormGroup>
                    </td>
                    <td className="text-center">
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => removeRedSocial(red.id)}
                        title="Eliminar red social"
                        className="btn-icon"
                      >
                        <i className="fas fa-times"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {redesSociales.length > 0 && (
            <div className="mt-3">
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Seleccione una red social como principal marcando el radio button correspondiente.
              </small>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default SeccionRedesSociales; 
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Row, 
  Col, 
  FormGroup, 
  Label, 
  Input, 
  FormText,
  Card,
  CardBody,
  InputGroup,
  InputGroupText
} from 'reactstrap';

interface IdentificacionEmpresa {
  id_identificacion?: string;
  administradores?: string;
  delegado_datos?: string;
  capital?: number;
  id_tipo_entidad?: number;
  objeto_empresa?: string;
  cif_intra?: string;
  id_profesional1?: string;
  id_profesional2?: string;
  id_profesional3?: string;
  id_profesional4?: string;
  id_profesional5?: string;
  id_profesional6?: string;
  id_profesional7?: string;
  id_profesional8?: string;
  id_profesional9?: string;
  id_profesional10?: string;
}

interface SeccionContableProps {
  data?: IdentificacionEmpresa;
  onChange: (data: IdentificacionEmpresa) => void;
}

const SeccionContable: React.FC<SeccionContableProps> = ({ data, onChange }) => {
  const [formData, setFormData] = useState<IdentificacionEmpresa>(() => ({
    administradores: data?.administradores || '',
    delegado_datos: data?.delegado_datos || '',
    capital: data?.capital || undefined,
    id_tipo_entidad: data?.id_tipo_entidad || undefined,
    objeto_empresa: data?.objeto_empresa || '',
    cif_intra: data?.cif_intra || '',
    id_profesional1: data?.id_profesional1 || '',
    id_profesional2: data?.id_profesional2 || '',
    id_profesional3: data?.id_profesional3 || '',
    id_profesional4: data?.id_profesional4 || '',
    id_profesional5: data?.id_profesional5 || '',
    id_profesional6: data?.id_profesional6 || '',
    id_profesional7: data?.id_profesional7 || '',
    id_profesional8: data?.id_profesional8 || '',
    id_profesional9: data?.id_profesional9 || '',
    id_profesional10: data?.id_profesional10 || ''
  }));

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Datos maestros (mock por ahora)
  const tiposEntidad = [
    { id_tipo_entidad: 1, nombre: 'Sociedad Anónima' },
    { id_tipo_entidad: 2, nombre: 'Sociedad Limitada' },
    { id_tipo_entidad: 3, nombre: 'Autónomo' },
    { id_tipo_entidad: 4, nombre: 'Sociedad Cooperativa' },
    { id_tipo_entidad: 5, nombre: 'Asociación' },
    { id_tipo_entidad: 6, nombre: 'Fundación' },
    { id_tipo_entidad: 7, nombre: 'Sociedad Civil' },
    { id_tipo_entidad: 8, nombre: 'Comunidad de Bienes' }
  ];

  // Inicializar datos cuando estén disponibles
  useEffect(() => {
    console.log('📊 SeccionContable - Datos recibidos:', data);
    if (data) {
      const newFormData = {
        administradores: data.administradores || '',
        delegado_datos: data.delegado_datos || '',
        capital: data.capital || undefined,
        id_tipo_entidad: data.id_tipo_entidad || undefined,
        objeto_empresa: data.objeto_empresa || '',
        cif_intra: data.cif_intra || '',
        id_profesional1: data.id_profesional1 || '',
        id_profesional2: data.id_profesional2 || '',
        id_profesional3: data.id_profesional3 || '',
        id_profesional4: data.id_profesional4 || '',
        id_profesional5: data.id_profesional5 || '',
        id_profesional6: data.id_profesional6 || '',
        id_profesional7: data.id_profesional7 || '',
        id_profesional8: data.id_profesional8 || '',
        id_profesional9: data.id_profesional9 || '',
        id_profesional10: data.id_profesional10 || ''
      };
      console.log('📊 SeccionContable - FormData inicializado:', newFormData);
      setFormData(newFormData);
      setIsInitialized(true);
    }
  }, [data]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? (value === '' ? undefined : Number(value)) : value;
    
    const newFormData = {
      ...formData,
      [name]: newValue
    };
    
    setFormData(newFormData);

    // Validación en tiempo real
    validateField(name, newValue);
    
    // Notificar cambio al componente padre
    console.log('📊 SeccionContable - Notificando cambios al padre:', newFormData);
    onChange(newFormData);
  }, [formData, onChange]);

  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'capital':
        if (value !== undefined && value < 0) {
          newErrors.capital = 'El capital no puede ser negativo';
        } else {
          delete newErrors.capital;
        }
        break;
      
      case 'cif_intra':
        if (value && value.length > 64) {
          newErrors.cif_intra = 'El CIF Intra no puede exceder 64 caracteres';
        } else {
          delete newErrors.cif_intra;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  return (
    <div className="seccion-contable">
      <Card>
        <CardBody>
          <h5 className="mb-4">
            <i className="fas fa-calculator text-primary me-2"></i>
            Información Contable
          </h5>

          <p className="text-muted mb-4">
            Si tiene un contable/asesor externo, puede editar aquí su información.
          </p>

          <Row>
            <Col md={12}>
              <h6 className="mb-3">
                <i className="fas fa-building text-secondary me-2"></i>
                Identificación de la empresa/organización
              </h6>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="administradores">
                  Administrador(es) (CEO, director, presidente, etc.)
                </Label>
                <Input
                  id="administradores"
                  name="administradores"
                  type="text"
                  value={formData.administradores || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <FormGroup>
                <Label for="delegado_datos">
                  Delegado de Protección de Datos (DPD, contacto Privacidad de Datos o RGPD, ...)
                  <i className="fas fa-info-circle ms-1 text-muted"></i>
                </Label>
                <Input
                  id="delegado_datos"
                  name="delegado_datos"
                  type="text"
                  value={formData.delegado_datos || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="capital">Capital</Label>
                <Input
                  id="capital"
                  name="capital"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.capital || ''}
                  onChange={handleInputChange}
                  invalid={!!errors.capital}
                />
                {errors.capital && <FormText color="danger">{errors.capital}</FormText>}
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <FormGroup>
                <Label for="id_tipo_entidad">
                  Tipo de entidad comercial
                  <i className="fas fa-info-circle ms-1 text-muted"></i>
                </Label>
                <Input
                  id="id_tipo_entidad"
                  name="id_tipo_entidad"
                  type="select"
                  value={formData.id_tipo_entidad || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar tipo de entidad</option>
                  {tiposEntidad.map(tipo => (
                    <option key={tipo.id_tipo_entidad} value={tipo.id_tipo_entidad}>
                      {tipo.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="objeto_empresa">Objeto de la empresa</Label>
                <Input
                  id="objeto_empresa"
                  name="objeto_empresa"
                  type="textarea"
                  rows={3}
                  value={formData.objeto_empresa || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="cif_intra">CIF Intra.</Label>
                <Input
                  id="cif_intra"
                  name="cif_intra"
                  type="text"
                  value={formData.cif_intra || ''}
                  onChange={handleInputChange}
                  invalid={!!errors.cif_intra}
                />
                {errors.cif_intra && <FormText color="danger">{errors.cif_intra}</FormText>}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <h6 className="mb-3 mt-4">
                <i className="fas fa-user-tie text-secondary me-2"></i>
                Identificaciones Profesionales
              </h6>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="id_profesional1">ID profesional 1</Label>
                <Input
                  id="id_profesional1"
                  name="id_profesional1"
                  type="text"
                  value={formData.id_profesional1 || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            
            <Col md={4}>
              <FormGroup>
                <Label for="id_profesional2">ID profesional 2</Label>
                <Input
                  id="id_profesional2"
                  name="id_profesional2"
                  type="text"
                  value={formData.id_profesional2 || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            
            <Col md={4}>
              <FormGroup>
                <Label for="id_profesional3">ID profesional 3</Label>
                <Input
                  id="id_profesional3"
                  name="id_profesional3"
                  type="text"
                  value={formData.id_profesional3 || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="id_profesional4">ID profesional 4</Label>
                <Input
                  id="id_profesional4"
                  name="id_profesional4"
                  type="text"
                  value={formData.id_profesional4 || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            
            <Col md={4}>
              <FormGroup>
                <Label for="id_profesional5">ID profesional 5</Label>
                <Input
                  id="id_profesional5"
                  name="id_profesional5"
                  type="text"
                  value={formData.id_profesional5 || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            
            <Col md={4}>
              <FormGroup>
                <Label for="id_profesional6">ID profesional 6</Label>
                <Input
                  id="id_profesional6"
                  name="id_profesional6"
                  type="text"
                  value={formData.id_profesional6 || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="id_profesional7">Identificación profesional 7</Label>
                <Input
                  id="id_profesional7"
                  name="id_profesional7"
                  type="text"
                  value={formData.id_profesional7 || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            
            <Col md={4}>
              <FormGroup>
                <Label for="id_profesional8">Identificación profesional 8</Label>
                <Input
                  id="id_profesional8"
                  name="id_profesional8"
                  type="text"
                  value={formData.id_profesional8 || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            
            <Col md={4}>
              <FormGroup>
                <Label for="id_profesional9">Identificación profesional 9</Label>
                <Input
                  id="id_profesional9"
                  name="id_profesional9"
                  type="text"
                  value={formData.id_profesional9 || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="id_profesional10">Cédula Profesional 10</Label>
                <Input
                  id="id_profesional10"
                  name="id_profesional10"
                  type="text"
                  value={formData.id_profesional10 || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default SeccionContable; 
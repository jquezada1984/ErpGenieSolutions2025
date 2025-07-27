import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardBody, Row, Col, FormGroup, Label, Input, FormText } from 'reactstrap';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import CountrySelect from '../../../components/CountrySelect';

interface SeccionEmpresaProps {
  data: any;
  onChange: (data: any) => void;
}

const SeccionEmpresa: React.FC<SeccionEmpresaProps> = ({ data, onChange }) => {
  const [formData, setFormData] = useState(() => ({
    nombre: data?.nombre || '',
    ruc: data?.ruc || '',
    direccion: data?.direccion || '',
    telefono: data?.telefono || '',
    email: data?.email || '',
    id_moneda: data?.id_moneda || '',
    id_pais: data?.id_pais || '',
    codigo_postal: data?.codigo_postal || '',
    poblacion: data?.poblacion || '',
    movil: data?.movil || '',
    fax: data?.fax || '',
    web: data?.web || '',
    nota: data?.nota || '',
    sujeto_iva: data?.sujeto_iva ?? true,
    id_provincia: data?.id_provincia || '',
    fiscal_year_start_month: data?.fiscal_year_start_month || 1,
    fiscal_year_start_day: data?.fiscal_year_start_day || 1
  }));

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Queries para obtener datos maestros
  const GET_MONEDAS = gql`
    query GetMonedas {
      monedas {
        id_moneda
        codigo
        nombre
      }
    }
  `;

  const GET_PAISES = gql`
    query GetPaises {
      paises {
        id_pais
        nombre
        codigo_iso
        icono
      }
    }
  `;

  const GET_PROVINCIAS = gql`
    query GetProvincias {
      provincias {
        id_provincia
        nombre
        id_pais
      }
    }
  `;

  // Obtener datos maestros con manejo de errores
  const { data: monedasData, loading: loadingMonedas, error: errorMonedas } = useQuery(GET_MONEDAS);
  const { data: paisesData, loading: loadingPaises, error: errorPaises } = useQuery(GET_PAISES);
  const { data: provinciasData, loading: loadingProvincias, error: errorProvincias } = useQuery(GET_PROVINCIAS);

  const monedas = monedasData?.monedas || [];
  const paises = paisesData?.paises || [];
  const provincias = provinciasData?.provincias || [];

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    const newFormData = {
      ...formData,
      [name]: newValue
    };
    
    setFormData(newFormData);

    // Validación en tiempo real
    validateField(name, newValue);
    
    // Notificar cambio al componente padre
    onChange(newFormData);
  }, [formData, onChange]);

  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'nombre':
        if (!value.trim()) {
          newErrors.nombre = 'La razón social es obligatoria';
        } else if (value.length < 2) {
          newErrors.nombre = 'La razón social debe tener al menos 2 caracteres';
        } else {
          delete newErrors.nombre;
        }
        break;
      
      case 'ruc':
        if (!value.trim()) {
          newErrors.ruc = 'El RUC es obligatorio';
        } else if (!/^\d{11}$/.test(value)) {
          newErrors.ruc = 'El RUC debe tener 11 dígitos';
        } else {
          delete newErrors.ruc;
        }
        break;
      
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'El email no es válido';
        } else {
          delete newErrors.email;
        }
        break;
      
      case 'web':
        if (value && !/^https?:\/\/.+/.test(value)) {
          newErrors.web = 'La URL debe comenzar con http:// o https://';
        } else {
          delete newErrors.web;
        }
        break;
      
      case 'fiscal_year_start_month':
        if (value < 1 || value > 12) {
          newErrors.fiscal_year_start_month = 'El mes debe estar entre 1 y 12';
        } else {
          delete newErrors.fiscal_year_start_month;
        }
        break;
      
      case 'fiscal_year_start_day':
        if (value < 1 || value > 31) {
          newErrors.fiscal_year_start_day = 'El día debe estar entre 1 y 31';
        } else {
          delete newErrors.fiscal_year_start_day;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  // Actualizar datos cuando cambien los datos externos
  useEffect(() => {
    if (data) {
      const newFormData = {
        nombre: data.nombre || '',
        ruc: data.ruc || '',
        direccion: data.direccion || '',
        telefono: data.telefono || '',
        email: data.email || '',
        id_moneda: data.id_moneda || '',
        id_pais: data.id_pais || '',
        codigo_postal: data.codigo_postal || '',
        poblacion: data.poblacion || '',
        movil: data.movil || '',
        fax: data.fax || '',
        web: data.web || '',
        nota: data.nota || '',
        sujeto_iva: data.sujeto_iva ?? true,
        id_provincia: data.id_provincia || '',
        fiscal_year_start_month: data.fiscal_year_start_month || 1,
        fiscal_year_start_day: data.fiscal_year_start_day || 1
      };
      setFormData(newFormData);
    }
  }, [data]);

  const getProvinciasByPais = (idPais: string) => {
    return provincias.filter((p: any) => p.id_pais === idPais);
  };

  // Debug: Log del estado actual
  console.log('🏢 SeccionEmpresa - Estado actual:', { formData, paises: paises.length });

  // Mostrar errores de carga de datos maestros
  if (errorPaises) {
    console.error('Error cargando países:', errorPaises);
  }
  if (errorMonedas) {
    console.error('Error cargando monedas:', errorMonedas);
  }
  if (errorProvincias) {
    console.error('Error cargando provincias:', errorProvincias);
  }

  return (
    <div className="seccion-empresa">
      <Card>
        <CardBody>
          <h5 className="mb-4">
            <i className="fas fa-building text-primary me-2"></i>
            Información de la Empresa/Organización
          </h5>

          {/* Debug info */}
          {errorPaises && (
            <div className="alert alert-danger mb-3">
              <strong>Error cargando países:</strong> {errorPaises.message}
            </div>
          )}

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="nombre">
                  Razón social <span className="text-danger">*</span>
                </Label>
                <Input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  invalid={!!errors.nombre}
                />
                {errors.nombre && <FormText color="danger">{errors.nombre}</FormText>}
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <FormGroup>
                <Label for="ruc">
                  RUC <span className="text-danger">*</span>
                </Label>
                <Input
                  id="ruc"
                  name="ruc"
                  type="text"
                  value={formData.ruc}
                  onChange={handleInputChange}
                  invalid={!!errors.ruc}
                  maxLength={11}
                />
                {errors.ruc && <FormText color="danger">{errors.ruc}</FormText>}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="id_moneda">
                  <i className="fas fa-dollar-sign me-1"></i>
                  Divisa principal
                  <i className="fas fa-info-circle ms-1 text-muted" title="Moneda principal de la empresa"></i>
                </Label>
                <Input
                  id="id_moneda"
                  name="id_moneda"
                  type="select"
                  value={formData.id_moneda}
                  onChange={handleInputChange}
                  disabled={loadingMonedas}
                >
                  <option value="">
                    {loadingMonedas ? 'Cargando monedas...' : 'Seleccionar moneda'}
                  </option>
                  {monedas.map((moneda: any) => (
                    <option key={moneda.id_moneda} value={moneda.id_moneda}>
                      {moneda.nombre} ({moneda.codigo})
                    </option>
                  ))}
                </Input>
                {loadingMonedas && <small className="text-muted">Cargando monedas...</small>}
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <CountrySelect
                key={`country-select-${formData.id_pais}-${paises.length}`}
                id="id_pais"
                name="id_pais"
                value={formData.id_pais}
                onChange={handleInputChange}
                disabled={loadingPaises}
                loading={loadingPaises}
                countries={paises}
                label={
                  <>
                    <i className="fas fa-globe me-1"></i>
                    País
                    <i className="fas fa-info-circle ms-1 text-muted" title="País de la empresa"></i>
                  </>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  type="textarea"
                  rows={3}
                  value={formData.direccion}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="codigo_postal">Código postal</Label>
                <Input
                  id="codigo_postal"
                  name="codigo_postal"
                  type="text"
                  value={formData.codigo_postal}
                  onChange={handleInputChange}
                  maxLength={20}
                />
              </FormGroup>
            </Col>
            
            <Col md={4}>
              <FormGroup>
                <Label for="poblacion">Población</Label>
                <Input
                  id="poblacion"
                  name="poblacion"
                  type="text"
                  value={formData.poblacion}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            
            <Col md={4}>
              <FormGroup>
                <Label for="id_provincia">
                  <i className="fas fa-user me-1"></i>
                  Provincia
                  <i className="fas fa-info-circle ms-1 text-muted" title="Provincia/Estado"></i>
                </Label>
                <Input
                  id="id_provincia"
                  name="id_provincia"
                  type="select"
                  value={formData.id_provincia}
                  onChange={handleInputChange}
                  disabled={!formData.id_pais || loadingProvincias}
                >
                  <option value="">
                    {!formData.id_pais ? 'Seleccione un país primero' : 
                     loadingProvincias ? 'Cargando provincias...' : 'Seleccionar provincia'}
                  </option>
                  {getProvinciasByPais(formData.id_pais).map((provincia: any) => (
                    <option key={provincia.id_provincia} value={provincia.id_provincia}>
                      {provincia.nombre}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="telefono">
                  <i className="fas fa-phone me-1"></i>
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            
            <Col md={4}>
              <FormGroup>
                <Label for="movil">
                  <i className="fas fa-mobile-alt me-1"></i>
                  Móvil
                </Label>
                <Input
                  id="movil"
                  name="movil"
                  type="tel"
                  value={formData.movil}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            
            <Col md={4}>
              <FormGroup>
                <Label for="fax">
                  <i className="fas fa-fax me-1"></i>
                  Fax
                </Label>
                <Input
                  id="fax"
                  name="fax"
                  type="tel"
                  value={formData.fax}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="email">
                  <i className="fas fa-at me-1"></i>
                  Correo
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  invalid={!!errors.email}
                />
                {errors.email && <FormText color="danger">{errors.email}</FormText>}
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <FormGroup>
                <Label for="web">
                  <i className="fas fa-external-link-alt me-1"></i>
                  Web
                </Label>
                <Input
                  id="web"
                  name="web"
                  type="url"
                  value={formData.web}
                  onChange={handleInputChange}
                  invalid={!!errors.web}
                />
                {errors.web && <FormText color="danger">{errors.web}</FormText>}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="nota">Nota</Label>
                <Input
                  id="nota"
                  name="nota"
                  type="textarea"
                  rows={3}
                  value={formData.nota}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="fiscal_year_start_month">Mes de inicio de ejercicio</Label>
                <Input
                  id="fiscal_year_start_month"
                  name="fiscal_year_start_month"
                  type="select"
                  value={formData.fiscal_year_start_month}
                  onChange={handleInputChange}
                  invalid={!!errors.fiscal_year_start_month}
                >
                  <option value={1}>Enero</option>
                  <option value={2}>Febrero</option>
                  <option value={3}>Marzo</option>
                  <option value={4}>Abril</option>
                  <option value={5}>Mayo</option>
                  <option value={6}>Junio</option>
                  <option value={7}>Julio</option>
                  <option value={8}>Agosto</option>
                  <option value={9}>Septiembre</option>
                  <option value={10}>Octubre</option>
                  <option value={11}>Noviembre</option>
                  <option value={12}>Diciembre</option>
                </Input>
                {errors.fiscal_year_start_month && <FormText color="danger">{errors.fiscal_year_start_month}</FormText>}
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <FormGroup>
                <Label for="fiscal_year_start_day">Día de inicio de ejercicio</Label>
                <Input
                  id="fiscal_year_start_day"
                  name="fiscal_year_start_day"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.fiscal_year_start_day}
                  onChange={handleInputChange}
                  invalid={!!errors.fiscal_year_start_day}
                />
                {errors.fiscal_year_start_day && <FormText color="danger">{errors.fiscal_year_start_day}</FormText>}
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default SeccionEmpresa; 
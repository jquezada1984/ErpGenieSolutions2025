import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Form, FormGroup, Label, Input, Alert, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_GATEWAY_URL}/api`;

interface ConfiguracionContabilidad {
  id?: number;
  empresa_id: number;
  moneda_base_id: number;
  formato_cuenta: string;
  separador_cuenta: string;
  longitud_nivel: number;
  usar_centavos: boolean;
}

const ConfiguracionGeneral: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<ConfiguracionContabilidad>({
    empresa_id: 1, // TODO: Obtener de contexto o parámetros
    moneda_base_id: 1, // TODO: Obtener de contexto
    formato_cuenta: 'XXXX-XXXX-XXXX',
    separador_cuenta: '-',
    longitud_nivel: 4,
    usar_centavos: true
  });

  useEffect(() => {
    // Cargar configuración existente si existe
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);
      // TODO: Implementar GET para obtener configuración por empresa_id
      // const response = await axios.get(`${API_URL}/configuracion-contabilidad/empresa/${formData.empresa_id}`);
      // if (response.data) {
      //   setFormData(response.data);
      // }
    } catch (err: any) {
      // Si no existe, usar valores por defecto
      console.log('No hay configuración previa, usando valores por defecto');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
               type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (formData.id) {
        // Actualizar configuración existente
        const response = await axios.put(
          `${API_URL}/configuracion-contabilidad/${formData.id}`,
          formData
        );
        if (response.data) {
          setSuccess(true);
          setFormData(response.data);
        }
      } else {
        // Crear nueva configuración
        const response = await axios.post(
          `${API_URL}/configuracion-contabilidad`,
          formData
        );
        if (response.data) {
          setSuccess(true);
          setFormData(response.data);
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'Error al guardar la configuración';
      setError(errorMessage);
      console.error('Error al guardar configuración:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <CardTitle tag="h4" className="mb-0">
                  <i className="bi bi-sliders me-2"></i>
                  Configuración General de Contabilidad
                </CardTitle>
                <Button color="secondary" onClick={handleCancel}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver
                </Button>
              </div>

              {error && (
                <Alert color="danger" fade={false} className="mb-3" timeout={0}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert color="success" fade={false} className="mb-3" timeout={0}>
                  <i className="bi bi-check-circle me-2"></i>
                  Configuración guardada exitosamente
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="formato_cuenta" className="fw-bold">
                        Formato de Cuenta *
                      </Label>
                      <Input
                        id="formato_cuenta"
                        name="formato_cuenta"
                        type="text"
                        value={formData.formato_cuenta}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        placeholder="Ej: XXXX-XXXX-XXXX"
                        maxLength={20}
                      />
                      <small className="text-muted">
                        Define el formato de las cuentas contables (X = dígito)
                      </small>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="separador_cuenta" className="fw-bold">
                        Separador de Cuenta *
                      </Label>
                      <Input
                        id="separador_cuenta"
                        name="separador_cuenta"
                        type="text"
                        value={formData.separador_cuenta}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        placeholder="Ej: -"
                        maxLength={5}
                      />
                      <small className="text-muted">
                        Carácter usado para separar los niveles de cuenta
                      </small>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="longitud_nivel" className="fw-bold">
                        Longitud por Nivel *
                      </Label>
                      <Input
                        id="longitud_nivel"
                        name="longitud_nivel"
                        type="number"
                        value={formData.longitud_nivel}
                        onChange={handleInputChange}
                        required
                        min="1"
                        max="10"
                        disabled={loading}
                      />
                      <small className="text-muted">
                        Número de dígitos por cada nivel de cuenta
                      </small>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="usar_centavos" className="fw-bold">
                        Usar Centavos
                      </Label>
                      <div className="form-check mt-2">
                        <Input
                          id="usar_centavos"
                          name="usar_centavos"
                          type="checkbox"
                          checked={formData.usar_centavos}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                        <Label for="usar_centavos" className="form-check-label">
                          Habilitar el uso de centavos en los montos contables
                        </Label>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button color="secondary" onClick={handleCancel} disabled={loading}>
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
                  </Button>
                  <Button color="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <i className="bi bi-hourglass-split me-2"></i>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Guardar Configuración
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionGeneral;

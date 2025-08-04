import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Alert,
  Label,
  FormGroup,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Spinner,
} from 'reactstrap';
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import AuthLogo from '../../layouts/logo/AuthLogo';
import { AuthContext } from '../../components/jwt/JwtContext';
import useMounted from '../../components/authGurad/useMounted';
import ErrorAlert from '../../components/ErrorAlert';

interface LoginValues {
  email: string;
  password: string;
  submit?: string | null;
}

const Login = () => {
  const mounted = useMounted();
  const navigate = useNavigate();
  const { signInWithEmailAndPassword } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const initialValues: LoginValues = {
    email: '',
    password: '',
    submit: null,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Correo inválido').required('El correo es obligatorio'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('La contraseña es obligatoria'),
  });

  const handleSubmit = async (values: LoginValues, { setErrors, setStatus, setSubmitting }: FormikHelpers<LoginValues>) => {
    try {
      setIsLoading(true);
      setSuccessMessage(null);

      await signInWithEmailAndPassword(values.email, values.password);

      setStatus({ success: true });
      setSuccessMessage('¡Login exitoso! Redirigiendo...');
      setSubmitting(true);
      
      // Redirección inmediata sin verificación de mounted
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setStatus({ success: false });
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al iniciar sesión';
      if (err.message) {
        if (err.message.includes('Usuario no encontrado')) {
          errorMessage = 'Usuario no encontrado. Verifique su correo electrónico.';
        } else if (err.message.includes('Contraseña incorrecta')) {
          errorMessage = 'Contraseña incorrecta. Verifique sus credenciales.';
        } else if (err.message.includes('network')) {
          errorMessage = 'Error de conexión. Verifique su conexión a internet.';
        } else {
          errorMessage = err.message;
        }
      }
      
      // Solo mostrar en consola errores que no sean de autenticación esperados
      const isAuthError = err.message && (
        err.message.includes('Contraseña incorrecta') ||
        err.message.includes('Usuario no encontrado') ||
        err.message.includes('Credenciales inválidas')
      );
      
      if (!isAuthError) {
        console.error('❌ Error en login:', err);
      }
      
      setErrors({ submit: errorMessage });
      setSubmitting(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="loginBox">
      <img src="/src/assets/images/bg/login-bgleft.svg" className="position-absolute left bottom-0" alt="Fondo izquierdo" />
      <img src="/src/assets/images/bg/login-bg-right.svg" className="position-absolute end-0 top" alt="Fondo derecho" />
      <Container fluid className="h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col lg="12" className="loginContainer">
            <AuthLogo />
            <Card>
              <CardBody className="p-4 m-1">
                <h5 className="mb-0">Iniciar sesión</h5>
                
                {successMessage && (
                  <Alert color="success" className="mt-3" fade={false} timeout={0}>
                    <i className="bi bi-check-circle me-2"></i>
                    {successMessage}
                  </Alert>
                )}

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, handleSubmit, handleChange, isSubmitting, values }) => {
                    
                    return (
                      <Form onSubmit={handleSubmit}>
                        <FormGroup>
                          <Label htmlFor="email">Correo electrónico</Label>
                          <Field
                            name="email"
                            type="text"
                            value={values.email}
                            placeholder="usuario@correo.com"
                            onChange={handleChange}
                            className={`form-control${
                              errors.email && touched.email ? ' is-invalid' : ''
                            }`}
                            disabled={isLoading}
                            autoComplete="username"
                          />
                          <ErrorMessage name="email" component="div" className="invalid-feedback" />
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="password">Contraseña</Label>
                          <Field
                            name="password"
                            type="password"
                            placeholder="Tu contraseña"
                            value={values.password}
                            onChange={handleChange}
                            className={`form-control${
                              errors.password && touched.password ? ' is-invalid' : ''
                            }`}
                            disabled={isLoading}
                            autoComplete="current-password"
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="invalid-feedback"
                          />
                        </FormGroup>
                        <FormGroup className="form-check d-flex" inline>
                          <Label check>
                            <Input type="checkbox" disabled={isLoading} />
                            Recordarme
                          </Label>
                        </FormGroup>
                        {errors.submit ? (
                          <div className="mb-3">
                            <Alert color="danger" className="mt-3" fade={false} timeout={0}>
                              <i className="bi bi-exclamation-triangle me-2"></i>
                              {errors.submit}
                            </Alert>
                          </div>
                        ) : ''}

                        <FormGroup>
                          <Button
                            type="submit"
                            color="danger"
                            className="me-2"
                            disabled={isLoading || isSubmitting}
                          >
                            {isLoading ? (
                              <>
                                <Spinner size="sm" className="me-2" />
                                Iniciando sesión...
                              </>
                            ) : (
                              'Ingresar'
                            )}
                          </Button>
                        </FormGroup>
                      </Form>
                    );
                  }}
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;

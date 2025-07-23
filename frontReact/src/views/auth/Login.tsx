import React, { useContext } from 'react';
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
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={async (values, { setErrors, setStatus, setSubmitting }: FormikHelpers<LoginValues>) => {
                    try {
                      await signInWithEmailAndPassword(values.email, values.password);

                      if (mounted.current) {
                        setStatus({ success: true });
                        setSubmitting(true);
                        // Redirigir al dashboard después del login exitoso
                        navigate('/dashboard');
                      }
                    } catch (err: any) {
                      if (mounted.current) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                      }
                    }
                  }}
                >
                  {({ errors, touched, handleSubmit, handleChange, isSubmitting, values }) => (
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
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback"
                        />
                      </FormGroup>
                      <FormGroup className="form-check d-flex" inline>
                        <Label check>
                          <Input type="checkbox" />
                          Recordarme
                        </Label>
                      </FormGroup>
                      {errors.submit ? (
                        <div className="mb-3">
                          <ErrorAlert error={errors.submit} />
                        </div>
                      ) : ''}

                      <FormGroup>
                        <Button
                          type="submit"
                          color="danger"
                          className="me-2"
                          disabled={isSubmitting}
                        >
                          Ingresar
                        </Button>
                      </FormGroup>
                    </Form>
                  )}
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

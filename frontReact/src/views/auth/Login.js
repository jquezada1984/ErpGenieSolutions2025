import React from 'react';
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
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import AuthLogo from '../../layouts/logo/AuthLogo';
import LeftBg from '../../assets/images/bg/login-bgleft.svg';
import RightBg from '../../assets/images/bg/login-bg-right.svg';
import useAuth from '../../components/authGurad/useAuth';
import useMounted from '../../components/authGurad/useMounted';

const Login = () => {
  const mounted = useMounted();
  const { signInWithEmailAndPassword } = useAuth();

  const initialValues = {
    email: '',
    password: '',
    submit: null,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  return (
    <div className="loginBox">
      <img src={LeftBg} className="position-absolute left bottom-0" alt="Fondo izquierdo" />
      <img src={RightBg} className="position-absolute end-0 top" alt="Fondo derecho" />
      <Container fluid className="h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col lg="12" className="loginContainer">
            <AuthLogo />
            <Card>
              <CardBody className="p-4 m-1">
                <h5 className="mb-0">Firebase Login</h5>
                <small className="pb-4 d-block ">
                  Do not have an account?{' '}
                  <Link to="/auth/register" className="text-decoration-none">
                    Sign Up
                  </Link>
                </small>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                      await signInWithEmailAndPassword(values.email, values.password);

                      if (mounted.current) {
                        setStatus({ success: true });
                        setSubmitting(true);
                      }
                    } catch (err) {
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
                        <Label htmlFor="email">Email</Label>
                        <Field
                          name="email"
                          type="text"
                          value={values.email}
                          placeholder="demo@demo.com"
                          onChange={handleChange}
                          className={`form-control${
                            errors.email && touched.email ? ' is-invalid' : ''
                          }`}
                        />
                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <Field
                          name="password"
                          type="password"
                          placeholder="demo123"
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
                          Remember me
                        </Label>
                      </FormGroup>
                      {errors.submit ? <Alert color="danger">{errors.submit}</Alert> : ''}

                      <FormGroup>
                        <Button
                          type="submit"
                          color="danger"
                          className="me-2"
                          disabled={isSubmitting}
                        >
                          Login
                        </Button>
                      </FormGroup>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
            <Alert color="success">Email: demo@demo.com , PWD: demo123</Alert>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;

import React from 'react';
import { Button, Alert, Label, FormGroup, Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../layouts/logo/Logo';
import { ReactComponent as LeftBg } from '../../assets/images/bg/login-bgleft.svg';
import { ReactComponent as RightBg } from '../../assets/images/bg/login-bg-right.svg';
import useAuth from '../../components/authGurad/useAuth';
import useMounted from '../../components/authGurad/useMounted';

const Register = () => {
  const mounted = useMounted();
  const { createUserWithEmailAndPassword } = useAuth();
  const navigate = useNavigate();
  const initialValues = {
    UserName: '',
    email: '',
    password: '',
    policy: true,
    submit: null,
    acceptTerms: false,
  };

  const validationSchema = Yup.object().shape({
    UserName: Yup.string().required('UserName is required'),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),

    acceptTerms: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required'),
  });

  return (
    <div className="loginBox">
      <LeftBg className="position-absolute left bottom-0" />
      <RightBg className="position-absolute end-0 top" />
      <Container fluid className="h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col lg="12" className="loginContainer">
            <div className="p-4 d-flex justify-content-center">
              <Logo />
            </div>
            <Card>
              <CardBody className="p-4 m-1">
                <h5 className="mb-0">Register</h5>
                <small className="pb-4 d-block">
                  Already have an account?{' '}
                  <Link to="/auth/login" className="text-decoration-none">
                    Login
                  </Link>
                </small>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                      await createUserWithEmailAndPassword(values.email, values.password);
                      navigate('/auth/login');
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
                  {({ errors, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <Form onSubmit={handleSubmit}>
                      <FormGroup>
                        <Label htmlFor="firstName">User Name</Label>
                        <Field
                          name="UserName"
                          type="text"
                          className={`form-control ${
                            errors.UserName && touched.UserName ? ' is-invalid' : ''
                          }`}
                        />
                        <ErrorMessage
                          name="UserName"
                          component="div"
                          className="invalid-feedback"
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Field
                          name="email"
                          type="text"
                          value={values.email}
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

                      <FormGroup inline className="form-check">
                        <Field
                          type="checkbox"
                          name="acceptTerms"
                          id="acceptTerms"
                          className={`form-check-input ${
                            errors.acceptTerms && touched.acceptTerms ? ' is-invalid' : ''
                          }`}
                        />
                        <Label htmlFor="acceptTerms" className="form-check-label">
                          Accept Terms & Conditions
                        </Label>
                        <ErrorMessage
                          name="acceptTerms"
                          component="div"
                          className="invalid-feedback"
                        />
                      </FormGroup>
                      {errors.submit ? (
                        <Alert color="danger">
                          {errors.submit}
                          {errors.policy}
                        </Alert>
                      ) : (
                        ''
                      )}
                      <FormGroup>
                        <Button
                          type="submit"
                          color="primary"
                          className="me-2"
                          disabled={isSubmitting}
                        >
                          Register
                        </Button>
                        <Button type="reset" color="secondary">
                          Reset
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

export default Register;

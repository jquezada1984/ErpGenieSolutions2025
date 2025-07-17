import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from './useAuth';
import Login from '../../views/auth/Login';
import Error from '../../views/auth/Error';

const AuthGuard = (props) => {
  const { children } = props;
  const auth = useAuth();
  const location = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  // Para desarrollo, permitir acceso sin autenticación
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return <>{children}</>;
  }

  if (!auth.isAuthenticated && location.pathname === '/starter') {
    if (location.pathname !== requestedLocation) {
      setRequestedLocation(location.pathname);
      return <Error />;
    }

    return <Login />;
  }

  // This is done so that in case the route changes by any chance through other
  // means between the moment of request and the render we navigate to the initially
  // requested route.
  if (requestedLocation && location.pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default AuthGuard;

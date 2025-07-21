import useAuth from './useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const location = useLocation();

  // Eliminar excepción de desarrollo: siempre exigir autenticación
  if (!auth.isAuthenticated && location.pathname !== '/auth/login') {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default AuthGuard;

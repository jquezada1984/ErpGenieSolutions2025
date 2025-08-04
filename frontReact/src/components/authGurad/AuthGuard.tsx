import useAuth from './useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Loader from '../../layouts/loader/Loader';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const location = useLocation();

  // Mostrar loader mientras se inicializa la autenticación
  if (!auth.isInitialized) {
    return <Loader />;
  }

  // Redirigir al login si no está autenticado
  if (!auth.isAuthenticated && location.pathname !== '/auth/login') {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default AuthGuard;

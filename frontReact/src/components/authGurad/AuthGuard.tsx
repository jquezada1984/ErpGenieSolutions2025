import useAuth from './useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Loader from '../../layouts/loader/Loader';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const location = useLocation();

  console.log('🔒 AuthGuard - Estado:', {
    isAuthenticated: auth.isAuthenticated,
    isInitialized: auth.isInitialized,
    currentPath: location.pathname,
    user: auth.user?.email
  });

  // Mostrar loader mientras se inicializa la autenticación
  if (!auth.isInitialized) {
    console.log('⏳ AuthGuard: Mostrando loader...');
    return <Loader />;
  }

  // Redirigir al login si no está autenticado
  if (!auth.isAuthenticated && location.pathname !== '/auth/login') {
    console.log('🔒 AuthGuard: Usuario no autenticado, redirigiendo al login...');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  console.log('✅ AuthGuard: Usuario autenticado, permitiendo acceso a:', location.pathname);
  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default AuthGuard;

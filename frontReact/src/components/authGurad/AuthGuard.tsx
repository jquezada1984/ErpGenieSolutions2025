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

  // Verificar si hay token válido en localStorage como respaldo
  const hasValidToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decoded = JSON.parse(jsonPayload);
      const currentTime = Date.now() / 1000;
      const margin = 5 * 60; // 5 minutos de margen
      
      return decoded && decoded.exp && (decoded.exp > (currentTime + margin));
    } catch {
      return false;
    }
  };

  // Si no está autenticado pero hay un token válido, esperar un poco más
  if (!auth.isAuthenticated && hasValidToken() && location.pathname !== '/auth/login') {
    return <Loader />;
  }

  // Redirigir al login solo si realmente no está autenticado y no hay token válido
  if (!auth.isAuthenticated && !hasValidToken() && location.pathname !== '/auth/login') {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default AuthGuard;

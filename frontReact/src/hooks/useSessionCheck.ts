import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidToken } from '../components/jwt/Jwt';

export const useSessionCheck = (checkInterval = 60000) => { // Verificar cada minuto
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('accessToken');
      console.log('🔍 DEBUG - useSessionCheck - Verificando sesión:', { 
        hasToken: !!token, 
        tokenValid: token ? isValidToken(token) : false 
      });
      
      if (!token || !isValidToken(token)) {
        console.log('🔒 Sesión expirada, redirigiendo al login...');
        localStorage.removeItem('accessToken');
        navigate('/auth/login', { replace: true });
      } else {
        console.log('🔍 DEBUG - useSessionCheck - Sesión válida');
      }
    };

    // Verificar después de un pequeño delay para permitir que la autenticación se inicialice
    const initialCheck = setTimeout(() => {
      checkSession();
    }, 1000);

    // Configurar verificación periódica
    intervalRef.current = setInterval(checkSession, checkInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearTimeout(initialCheck);
    };
  }, [navigate, checkInterval]);

  return null;
}; 
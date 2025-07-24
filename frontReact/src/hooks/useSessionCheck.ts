import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidToken } from '../components/jwt/Jwt';

export const useSessionCheck = (checkInterval = 60000) => { // Verificar cada minuto
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('accessToken');
      
      if (!token || !isValidToken(token)) {
        console.log('🔒 Sesión expirada, redirigiendo al login...');
        localStorage.removeItem('accessToken');
        navigate('/auth/login', { replace: true });
      }
    };

    // Verificar inmediatamente
    checkSession();

    // Configurar verificación periódica
    intervalRef.current = setInterval(checkSession, checkInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [navigate, checkInterval]);

  return null;
}; 
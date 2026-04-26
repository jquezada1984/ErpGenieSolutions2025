import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export default function useJwtPayload() {
  const { pathname, key } = useLocation();
  return useMemo(() => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;

      const base64 = token.split('.')[1];
      const decoded = JSON.parse(atob(base64));

      return decoded;
    } catch {
      return null;
    }
  }, [pathname, key]);
}

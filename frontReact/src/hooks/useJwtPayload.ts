import { useMemo } from 'react';

export default function useJwtPayload() {
  const payload = useMemo(() => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;

      const base64 = token.split('.')[1];
      const decoded = JSON.parse(atob(base64));

      return decoded;
    } catch (e) {
      return null;
    }
  }, []);

  return payload;
}

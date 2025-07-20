/* eslint-disable react-hooks/rules-of-hooks */
import { useJwt } from 'react-jwt';
import axios from './axios';

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded = useJwt(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.decodedToken && (decoded.decodedToken as any).exp > currentTime;
};

const setSession = (accessToken: string) => {
  console.log('🔧 setSession llamado con token:', accessToken ? 'SÍ' : 'NO');
  
  if (accessToken) {
    console.log('💾 Guardando token en localStorage...');
    localStorage.setItem('accessToken', accessToken);
    console.log('🔑 Configurando header Authorization en axios...');
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    console.log('✅ Sesión configurada exitosamente');
  } else {
    console.log('🗑️ Eliminando token de localStorage...');
    localStorage.removeItem('accessToken');
    console.log('🔓 Eliminando header Authorization de axios...');
    delete axios.defaults.headers.common.Authorization;
    console.log('✅ Sesión eliminada exitosamente');
  }
};

export { isValidToken, setSession };

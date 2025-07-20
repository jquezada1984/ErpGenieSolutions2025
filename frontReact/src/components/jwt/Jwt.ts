/* eslint-disable react-hooks/rules-of-hooks */
import axios from './axios';

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  try {
    // Decodificar el token JWT manualmente
    const base64Url = accessToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);
    const currentTime = Date.now() / 1000;

    return decoded && decoded.exp > currentTime;
  } catch (error) {
    console.error('Error decodificando token:', error);
    return false;
  }
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

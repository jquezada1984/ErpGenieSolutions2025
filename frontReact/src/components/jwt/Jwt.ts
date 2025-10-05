/* eslint-disable react-hooks/rules-of-hooks */
import axios from './axios';

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    console.log('❌ Token vacío');
    return false;
  }

  try {
    // Verificar que el token tenga el formato correcto (3 partes separadas por puntos)
    const parts = accessToken.split('.');
    if (parts.length !== 3) {
      console.log('❌ Token con formato incorrecto');
      return false;
    }

    // Decodificar el token JWT manualmente
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);
    const currentTime = Date.now() / 1000;

    // Agregar margen de 5 minutos para evitar problemas de sincronización
    const margin = 5 * 60; // 5 minutos en segundos
    const isValid = decoded && decoded.exp && (decoded.exp > (currentTime + margin));
    
    console.log('🔍 DEBUG - Jwt - Validación de token:', {
      exp: decoded.exp,
      currentTime,
      margin,
      isValid
    });

    return isValid;
  } catch (error) {
    console.error('❌ Error decodificando token:', error);
    return false;
  }
};

const setSession = (accessToken: string) => {
 
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;   
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

export { isValidToken, setSession };

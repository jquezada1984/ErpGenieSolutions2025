import axios from 'axios';

// Crear instancia de axios
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000,
});

// Interceptor de respuesta para manejar errores de autenticación
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('🔒 Error 401 detectado, redirigiendo al login...');
      
      // Limpiar token expirado
      localStorage.removeItem('accessToken');
      delete instance.defaults.headers.common.Authorization;
      
      // Redirigir al login
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default instance;

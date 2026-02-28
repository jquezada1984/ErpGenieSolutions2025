import axios from 'axios';

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002';

const apiClient = axios.create({
  baseURL: GATEWAY_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.id_empresa) config.headers['X-Company-Id'] = payload.id_empresa;
        if (payload.sub || payload.id) config.headers['X-User-Id'] = payload.sub || payload.id;
      } catch (e) {
        console.warn('No se pudo extraer headers del token:', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error) {
      const err = new Error(error.response.data.error);
      err.status = error.response.status;
      err.data = error.response.data;
      throw err;
    }
    throw error;
  }
);

export const crearContacto = async (payload) => {
  const response = await apiClient.post('/api/contactos', payload);
  return response.data;
};

export const listarContactosByTercero = async (id_tercero) => {
  const response = await apiClient.get(`/api/contactos/tercero/${id_tercero}`);
  return response.data || [];
};

export const obtenerContacto = async (id_contacto) => {
  const response = await apiClient.get(`/api/contactos/${id_contacto}`);
  return response.data;
};

export const actualizarContacto = async (id_contacto, payload) => {
  const response = await apiClient.put(`/api/contactos/${id_contacto}`, payload);
  return response.data;
};

export const toggleContactoEstado = async (id_contacto) => {
  const response = await apiClient.patch(`/api/contactos/${id_contacto}/estado`);
  return response.data;
};

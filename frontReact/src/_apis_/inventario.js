/**
 * API del módulo Inventario vía Gateway (REST).
 * Escritura cabecera inventario → Gateway → InventarioPython.
 * Mismo cliente Axios e interceptores que _apis_/item.js para comportamiento idéntico.
 */
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
    const data = error.response?.data;
    const msg =
      (typeof data?.error === 'string' && data.error) ||
      (typeof data?.message === 'string' && data.message) ||
      error.message ||
      'Error en la petición';
    const err = new Error(msg);
    if (error.response) {
      err.status = error.response.status;
      err.data = data;
    }
    return Promise.reject(err);
  }
);

export const crearInventario = async (body) => {
  const response = await apiClient.post('/api/inventario', body);
  return response.data;
};

export const actualizarInventario = async (id_inventario, body) => {
  const id = encodeURIComponent(String(id_inventario || '').trim());
  const response = await apiClient.put(`/api/inventario/${id}`, body);
  return response.data;
};

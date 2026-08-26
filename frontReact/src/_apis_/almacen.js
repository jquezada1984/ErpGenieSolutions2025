/**
 * API del módulo Almacén vía Gateway (REST).
 * Escritura almacén → Gateway → AlmacenPython.
 * Mismo cliente Axios e interceptores que _apis_/inventario.js.
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

export const crearAlmacen = async (body) => {
  const response = await apiClient.post('/api/almacen', body);
  return response.data;
};

export const actualizarAlmacen = async (id_almacen, body) => {
  const id = encodeURIComponent(String(id_almacen || '').trim());
  const response = await apiClient.put(`/api/almacen/${id}`, body);
  return response.data;
};

export const crearStockInicial = async (body) => {
  const response = await apiClient.post('/api/almacen/stock-inicial', body);
  return {
    status: response.status,
    data: response.data,
  };
};

export const crearEntradaStock = async (body) => {
  const response = await apiClient.post('/api/almacen/stock-entrada', body);
  return {
    status: response.status,
    data: response.data,
  };
};

export const crearSalidaStock = async (body) => {
  const response = await apiClient.post('/api/almacen/stock-salida', body);
  return {
    status: response.status,
    data: response.data,
  };
};

export const crearAjusteStock = async (body) => {
  const response = await apiClient.post('/api/almacen/stock-ajuste', body);
  return {
    status: response.status,
    data: response.data,
  };
};

export const crearTransferenciaStock = async (body) => {
  const response = await apiClient.post('/api/almacen/stock-transferencia', body);
  return {
    status: response.status,
    data: response.data,
  };
};

export const crearCambioMasivoStock = async (body) => {
  const response = await apiClient.post('/api/almacen/stock-cambio-masivo', body);
  return {
    status: response.status,
    data: response.data,
  };
};

/**
 * API escritura Stock / Almacenes / Kardex vía Gateway → InventarioPython.
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
    // Permitir override de empresa (GLOBAL) desde el body
    if (config.data?.id_empresa) {
      config.headers['X-Company-Id'] = config.data.id_empresa;
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
      (typeof data?.detail === 'string' && data.detail) ||
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

export const actualizarAlmacen = async (id, body) => {
  const response = await apiClient.put(`/api/almacen/${encodeURIComponent(id)}`, body);
  return response.data;
};

export const crearMovimientoStock = async (body) => {
  const response = await apiClient.post('/api/stock/movimiento', body);
  return response.data;
};

export const upsertSaldoStock = async (body) => {
  const response = await apiClient.post('/api/stock/saldo', body);
  return response.data;
};

export const crearTransferenciaStock = async (body) => {
  const response = await apiClient.post('/api/stock/transferencia', body);
  return response.data;
};

export const completarTransferenciaStock = async (id, body = {}) => {
  const response = await apiClient.post(
    `/api/stock/transferencia/${encodeURIComponent(id)}/completar`,
    body
  );
  return response.data;
};

export const crearCambioMasivoStock = async (body) => {
  const response = await apiClient.post('/api/stock/cambio-masivo', body);
  return response.data;
};

export const completarCambioMasivoStock = async (id, body = {}) => {
  const response = await apiClient.post(
    `/api/stock/cambio-masivo/${encodeURIComponent(id)}/completar`,
    body
  );
  return response.data;
};

export const cerrarInventarioFisico = async (id, body = {}) => {
  const response = await apiClient.post(
    `/api/inventario/${encodeURIComponent(id)}/cerrar`,
    body
  );
  return response.data;
};

export const upsertLoteSerie = async (body) => {
  const response = await apiClient.post('/api/stock/lote', body);
  return response.data;
};

export const consultarStockAFecha = async (body) => {
  const response = await apiClient.post('/api/stock/a-fecha', body);
  return response.data;
};

export const consultarReposicion = async (body = {}) => {
  const response = await apiClient.post('/api/stock/reposicion', body);
  return response.data;
};

export const consultarValoracionPmp = async (body = {}) => {
  const response = await apiClient.post('/api/stock/valoracion-pmp', body);
  return response.data;
};

import axios from 'axios';

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002';

const apiClient = axios.create({
  baseURL: GATEWAY_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const body =
        config.data && typeof config.data === 'object' && !(config.data instanceof FormData)
          ? config.data
          : null;
      if (!config.headers['X-Company-Id'] && !config.headers['x-company-id']) {
        if (body?.id_empresa) {
          config.headers['X-Company-Id'] = body.id_empresa;
        } else if (payload.id_empresa) {
          config.headers['X-Company-Id'] = payload.id_empresa;
        }
      }
      if (payload.sub || payload.id) {
        config.headers['X-User-Id'] = payload.sub || payload.id;
      }
    } catch {
      /* ignore */
    }
  }
  return config;
});

function companyHeaders(idEmpresa) {
  return idEmpresa ? { 'X-Company-Id': idEmpresa } : {};
}

export const crearCategoriaGasto = (body, idEmpresa) =>
  apiClient
    .post('/api/categoria-gasto', body, { headers: companyHeaders(idEmpresa) })
    .then((r) => r.data);

export const actualizarCategoriaGasto = (id, body, idEmpresa) =>
  apiClient
    .put(`/api/categoria-gasto/${id}`, body, { headers: companyHeaders(idEmpresa) })
    .then((r) => r.data);

export const cambiarEstadoCategoriaGasto = (id, idEmpresa) =>
  apiClient
    .patch(`/api/categoria-gasto/${id}/estado`, {}, { headers: companyHeaders(idEmpresa) })
    .then((r) => r.data);

export const crearGasto = (body, idEmpresa) =>
  apiClient.post('/api/gasto', body, { headers: companyHeaders(idEmpresa) }).then((r) => r.data);

export const actualizarGasto = (id, body, idEmpresa) =>
  apiClient.put(`/api/gasto/${id}`, body, { headers: companyHeaders(idEmpresa) }).then((r) => r.data);

export function extractApiError(err) {
  const d = err?.response?.data;
  if (!d) return err?.message || 'Error de red';
  if (typeof d.error === 'string') return d.error;
  if (d.errors) {
    if (typeof d.errors === 'string') return d.errors;
    try {
      return Object.values(d.errors).flat().join(' | ');
    } catch {
      return 'Error de validación';
    }
  }
  if (typeof d.message === 'string') return d.message;
  return 'Error en la operación';
}

import axios from 'axios';

const GATEWAY_URL = (import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002').replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: `${GATEWAY_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.id_empresa) config.headers['X-Company-Id'] = payload.id_empresa;
      if (payload.sub || payload.id) config.headers['X-User-Id'] = payload.sub || payload.id;
    } catch {
      /* ignore */
    }
  }
  return config;
});

const unwrap = (res) => {
  const body = res.data;
  if (body && typeof body === 'object' && 'data' in body) return body.data;
  return body;
};

export const crearPeriodoContable = async (payload) =>
  unwrap(await apiClient.post('/periodos-contables', payload));

export const cerrarPeriodoContable = async (id) =>
  unwrap(await apiClient.patch(`/periodos-contables/${id}/cerrar`));

export const inicializarDiariosContablesDefecto = async () =>
  unwrap(await apiClient.post('/diarios-contables/inicializar-defecto'));

export const crearDiarioContable = async (payload) =>
  unwrap(await apiClient.post('/diarios-contables', payload));

export const actualizarDiarioContable = async (id, payload) =>
  unwrap(await apiClient.put(`/diarios-contables/${id}`, payload));

export const patchActivoDiarioContable = async (id, activo) =>
  unwrap(await apiClient.patch(`/diarios-contables/${id}/activo`, { activo }));

export const eliminarDiarioContable = async (id) =>
  unwrap(await apiClient.delete(`/diarios-contables/${id}`));

export const crearModeloPlanContable = async (payload) =>
  unwrap(await apiClient.post('/modelos-planes-contables', payload));

export const actualizarModeloPlanContable = async (id, payload) =>
  unwrap(await apiClient.put(`/modelos-planes-contables/${id}`, payload));

export const patchActivoModeloPlanContable = async (id, activo) =>
  unwrap(await apiClient.patch(`/modelos-planes-contables/${id}/activo`, { activo }));

export const eliminarModeloPlanContable = async (id) =>
  unwrap(await apiClient.delete(`/modelos-planes-contables/${id}`));

export const crearCuentaContable = async (payload) =>
  unwrap(await apiClient.post('/cuentas-contables', payload));

export const actualizarCuentaContable = async (id, payload) =>
  unwrap(await apiClient.put(`/cuentas-contables/${id}`, payload));

export const patchActivoCuentaContable = async (id, activo) =>
  unwrap(await apiClient.patch(`/cuentas-contables/${id}/activo`, { activo }));

export const eliminarCuentaContable = async (id) =>
  unwrap(await apiClient.delete(`/cuentas-contables/${id}`));

export const inicializarCuentasContablesDefecto = async () =>
  unwrap(await apiClient.post('/cuentas-contables-defecto/inicializar'));

export const guardarCuentasContablesDefecto = async (items) =>
  unwrap(await apiClient.put('/cuentas-contables-defecto', { items }));

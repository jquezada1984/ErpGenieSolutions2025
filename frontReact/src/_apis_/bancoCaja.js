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

      if (body?.id_empresa) {

        config.headers['X-Company-Id'] = body.id_empresa;

      } else if (payload.id_empresa) {

        config.headers['X-Company-Id'] = payload.id_empresa;

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



export const listarBancos = (soloActivos = true) =>

  apiClient.get('/api/banco', { params: { soloActivos } }).then((r) => r.data);

export const crearBanco = (body) => apiClient.post('/api/banco', body).then((r) => r.data);

export const actualizarBanco = (id, body) => apiClient.put(`/api/banco/${id}`, body).then((r) => r.data);

export const eliminarBanco = (id) => apiClient.delete(`/api/banco/${id}`).then((r) => r.data);



export const crearCuentaBancaria = (body) =>

  apiClient.post('/api/cuenta-bancaria', body).then((r) => r.data);

export const actualizarCuentaBancaria = (id, body) =>

  apiClient.put(`/api/cuenta-bancaria/${id}`, body).then((r) => r.data);

export const eliminarCuentaBancaria = (id) =>

  apiClient.delete(`/api/cuenta-bancaria/${id}`).then((r) => r.data);



export const crearMovimientoBancario = (body) =>

  apiClient.post('/api/movimiento-bancario', body).then((r) => r.data);

export const actualizarMovimientoBancario = (id, body) =>

  apiClient.put(`/api/movimiento-bancario/${id}`, body).then((r) => r.data);

export const eliminarMovimientoBancario = (id) =>

  apiClient.delete(`/api/movimiento-bancario/${id}`).then((r) => r.data);



export const crearTransferenciaBancaria = (body) =>

  apiClient.post('/api/transferencia-bancaria', body).then((r) => r.data);

export const eliminarTransferenciaBancaria = (id) =>

  apiClient.delete(`/api/transferencia-bancaria/${id}`).then((r) => r.data);


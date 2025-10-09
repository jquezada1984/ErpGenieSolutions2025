import axios from 'axios';

// URL base del Gateway Fastify
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002';

// Configurar axios para el Gateway
const gatewayClient = axios.create({
  baseURL: GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
gatewayClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Error en Gateway:', error.response?.data || error.message);
    throw error;
  }
);

// ===== ENDPOINTS UNIFICADOS A TRAVÉS DEL GATEWAY =====

// CONSULTAS (GraphQL a través del Gateway)
export const getEmpresas = async () => {
  try {
    const response = await gatewayClient.get('/empresas');
    return response.data.data || [];
  } catch (error) {
    console.error('❌ Error al obtener empresas:', error);
    throw error;
  }
};

export const getEmpresa = async (id) => {
  try {
    const response = await gatewayClient.get(`/empresas/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al obtener empresa:', error);
    throw error;
  }
};

// MUTACIONES (Python a través del Gateway)
export const crearEmpresa = async (empresaData) => {
  try {
    const response = await gatewayClient.post('/empresas', empresaData);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al crear empresa:', error);
    throw error;
  }
};

export const actualizarEmpresa = async (id, empresaData) => {
  try {
    const response = await gatewayClient.put(`/empresas/${id}`, empresaData);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al actualizar empresa:', error);
    throw error;
  }
};

export const eliminarEmpresa = async (id) => {
  try {
    const response = await gatewayClient.delete(`/empresas/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al eliminar empresa:', error);
    throw error;
  }
};

// ===== ENDPOINTS DE MONITOREO =====

export const checkGatewayHealth = async () => {
  try {
    const response = await gatewayClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('❌ Gateway no saludable:', error);
    throw error;
  }
};

export const getGatewayStatus = async () => {
  try {
    const response = await gatewayClient.get('/status');
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener estado del Gateway:', error);
    throw error;
  }
}; 
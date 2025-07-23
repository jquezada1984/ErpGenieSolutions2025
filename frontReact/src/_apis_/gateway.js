import axios from 'axios';

// URL base del Gateway Fastify
const GATEWAY_URL = 'http://localhost:3000/gateway';

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
    console.log('📋 Obteniendo empresas (Gateway)...');
    const response = await gatewayClient.get('/empresas');
    console.log('✅ Empresas obtenidas:', response.data);
    return response.data.data || [];
  } catch (error) {
    console.error('❌ Error al obtener empresas:', error);
    throw error;
  }
};

export const getEmpresa = async (id) => {
  try {
    console.log(`📋 Obteniendo empresa ${id} (Gateway)...`);
    const response = await gatewayClient.get(`/empresas/${id}`);
    console.log('✅ Empresa obtenida:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al obtener empresa:', error);
    throw error;
  }
};

// MUTACIONES (Python a través del Gateway)
export const crearEmpresa = async (empresaData) => {
  try {
    console.log('📝 Creando empresa (Gateway):', empresaData);
    const response = await gatewayClient.post('/empresas', empresaData);
    console.log('✅ Empresa creada exitosamente:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al crear empresa:', error);
    throw error;
  }
};

export const actualizarEmpresa = async (id, empresaData) => {
  try {
    console.log(`📝 Actualizando empresa ${id} (Gateway):`, empresaData);
    const response = await gatewayClient.put(`/empresas/${id}`, empresaData);
    console.log('✅ Empresa actualizada exitosamente:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al actualizar empresa:', error);
    throw error;
  }
};

export const eliminarEmpresa = async (id) => {
  try {
    console.log(`🗑️ Eliminando empresa ${id} (Gateway)...`);
    const response = await gatewayClient.delete(`/empresas/${id}`);
    console.log('✅ Empresa eliminada exitosamente:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('❌ Error al eliminar empresa:', error);
    throw error;
  }
};

// ===== ENDPOINTS DE MONITOREO =====

export const checkGatewayHealth = async () => {
  try {
    console.log('🏥 Verificando salud del Gateway...');
    const response = await gatewayClient.get('/health');
    console.log('✅ Gateway saludable:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Gateway no saludable:', error);
    throw error;
  }
};

export const getGatewayStatus = async () => {
  try {
    console.log('📊 Obteniendo estado del Gateway...');
    const response = await gatewayClient.get('/status');
    console.log('✅ Estado del Gateway:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener estado del Gateway:', error);
    throw error;
  }
}; 
import axios from 'axios';

// URL base del Gateway API
const API_URL = `${import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002'}/api`;

// Configurar axios para el Gateway API
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Error en Gateway API:', error.response?.data || error.message);
    
    // Extraer el mensaje de error específico de la respuesta
    if (error.response?.data?.error) {
      const customError = new Error(error.response.data.error);
      customError.status = error.response.status;
      customError.data = error.response.data;
      throw customError;
    }
    
    throw error;
  }
);

// CREAR PERFIL (Gateway -> InicioPython)
export const crearPerfil = async (perfil) => {
  try {
    console.log('📝 Creando perfil (Gateway -> Python):', perfil);
    const response = await apiClient.post('/perfiles', perfil);
    console.log('✅ Perfil creado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear perfil:', error);
    throw error;
  }
};

// ACTUALIZAR PERFIL (Gateway -> InicioPython)
export const actualizarPerfil = async (id, perfil) => {
  try {
    console.log('📝 Actualizando perfil (Gateway -> Python):', id, perfil);
    const response = await apiClient.put(`/perfiles/${id}`, perfil);
    console.log('✅ Perfil actualizado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);
    throw error;
  }
};

// ELIMINAR PERFIL (Gateway -> InicioPython)
export const eliminarPerfil = async (id) => {
  try {
    console.log('🗑️ Eliminando perfil (Gateway -> Python):', id);
    const response = await apiClient.delete(`/perfiles/${id}`);
    console.log('✅ Perfil eliminado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar perfil:', error);
    throw error;
  }
};

// CAMBIAR ESTADO PERFIL (Gateway -> InicioPython)
export const cambiarEstadoPerfil = async (id, estado) => {
  try {
    console.log('🔄 Cambiando estado de perfil (Gateway -> Python):', id, estado);
    const response = await apiClient.put(`/perfiles/${id}/estado`, { estado });
    console.log('✅ Estado de perfil cambiado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al cambiar estado de perfil:', error);
    throw error;
  }
};

// OBTENER PERFILES POR EMPRESA (Gateway -> InicioPython)
export const getPerfilesPorEmpresa = async (empresaId) => {
  try {
    console.log('📊 Obteniendo perfiles por empresa (Gateway -> Python):', empresaId);
    const response = await apiClient.get(`/empresas/${empresaId}/perfiles`);
    console.log('✅ Perfiles por empresa obtenidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener perfiles por empresa:', error);
    throw error;
  }
}; 
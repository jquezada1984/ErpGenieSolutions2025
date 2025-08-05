import axios from 'axios';

// URL base del Gateway API
const API_URL = `${import.meta.env.VITE_GATEWAY_URL}/api`;

// Configurar axios para el microservicio Python
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
    console.error('❌ Error en API Python:', error.response?.data || error.message);
    
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

// SOLO MUTACIONES (Gateway API) - Las consultas van por GraphQL a InicioNestJS

// Secciones de menú
export const crearSeccion = async (seccion) => {
  try {
    console.log('📝 Creando sección (Gateway):', seccion);
    const response = await apiClient.post('/menu-secciones', seccion);
    console.log('✅ Sección creada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear sección:', error);
    throw error;
  }
};

export const actualizarSeccion = async (id, seccion) => {
  try {
    console.log('📝 Actualizando sección (Gateway):', id, seccion);
    const response = await apiClient.put(`/menu-secciones/${id}`, seccion);
    console.log('✅ Sección actualizada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar sección:', error);
    throw error;
  }
};

export const eliminarSeccion = async (id) => {
  try {
    console.log('🗑️ Eliminando sección (Gateway):', id);
    const response = await apiClient.delete(`/menu-secciones/${id}`);
    console.log('✅ Sección eliminada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar sección:', error);
    throw error;
  }
};

// Items de menú
export const crearItem = async (item) => {
  try {
    console.log('📝 Creando item (Gateway):', item);
    const response = await apiClient.post('/menu-items', item);
    console.log('✅ Item creado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear item:', error);
    throw error;
  }
};

export const actualizarItem = async (id, item) => {
  try {
    console.log('📝 Actualizando item (Gateway):', id, item);
    const response = await apiClient.put(`/menu-items/${id}`, item);
    console.log('✅ Item actualizado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar item:', error);
    throw error;
  }
};

export const eliminarItem = async (id) => {
  try {
    console.log('🗑️ Eliminando item (Gateway):', id);
    const response = await apiClient.delete(`/menu-items/${id}`);
    console.log('✅ Item eliminado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar item:', error);
    throw error;
  }
}; 
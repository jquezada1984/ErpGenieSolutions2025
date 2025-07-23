import axios from 'axios';

// URL base del Gateway API
const API_URL = `${import.meta.env.VITE_GATEWAY_URL}/api/empresas`;

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

// SOLO MUTACIONES (Gateway API)
export const crearEmpresa = async (empresa) => {
  try {
    console.log('📝 Creando empresa (Gateway):', empresa);
    const response = await apiClient.post('/', empresa);
    console.log('✅ Empresa creada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear empresa:', error);
    throw error;
  }
};

export const actualizarEmpresa = async (id, empresa) => {
  try {
    console.log('📝 Actualizando empresa (Gateway):', id, empresa);
    const response = await apiClient.put(`/${id}`, empresa);
    console.log('✅ Empresa actualizada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar empresa:', error);
    throw error;
  }
};

// "Eliminar" empresa: solo cambia el estado a false (Gateway API)
export const eliminarEmpresa = async (id) => {
  try {
    console.log('🗑️ Eliminando empresa (Gateway):', id);
    const response = await apiClient.put(`/${id}`, { estado: false });
    console.log('✅ Empresa eliminada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar empresa:', error);
    throw error;
  }
}; 
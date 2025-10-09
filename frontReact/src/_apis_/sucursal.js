import axios from 'axios';

// URL base del Gateway API
const API_URL = `${import.meta.env.VITE_GATEWAY_URL}/api/sucursales`;

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
export const crearSucursal = async (sucursal) => {
  try {
    const response = await apiClient.post('/', sucursal);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear sucursal:', error);
    throw error;
  }
};

export const actualizarSucursal = async (id, sucursal) => {
  try {
    const response = await apiClient.put(`/${id}`, sucursal);
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar sucursal:', error);
    throw error;
  }
};

// "Eliminar" sucursal: solo cambia el estado a false (Gateway API)
export const eliminarSucursal = async (id) => {
  try {
    const response = await apiClient.put(`/${id}`, { estado: false });
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar sucursal:', error);
    throw error;
  }
};

// Cambiar estado de sucursal
export const cambiarEstadoSucursal = async (id, estado) => {
  try {
    const response = await apiClient.put(`/${id}/estado`, { estado });
    return response.data;
  } catch (error) {
    console.error('❌ Error al cambiar estado de sucursal:', error);
    throw error;
  }
}; 
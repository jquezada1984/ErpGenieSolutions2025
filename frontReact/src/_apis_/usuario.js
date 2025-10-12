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
    console.error('❌ Error en API Usuario:', error.response?.data || error.message);
    
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

// Usuarios
export const crearUsuario = async (usuario) => {
  try {
    const response = await apiClient.post('/usuarios', usuario);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    throw error;
  }
};

export const obtenerUsuario = async (id) => {
  try {
    const response = await apiClient.get(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener usuario:', error);
    throw error;
  }
};

export const actualizarUsuario = async (id, usuario) => {
  try {
    const response = await apiClient.put(`/usuarios/${id}`, usuario);
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    throw error;
  }
};

export const eliminarUsuario = async (id) => {
  try {
    const response = await apiClient.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    throw error;
  }
};

export const cambiarEstadoUsuario = async (id, estado) => {
  try {
    const response = await apiClient.put(`/usuarios/${id}/estado`, { estado });
    return response.data;
  } catch (error) {
    console.error('❌ Error al cambiar estado del usuario:', error);
    throw error;
  }
};

export const cambiarPasswordUsuario = async (id, password) => {
  try {
    const response = await apiClient.put(`/usuarios/${id}/password`, { password });
    return response.data;
  } catch (error) {
    console.error('❌ Error al cambiar password del usuario:', error);
    throw error;
  }
};




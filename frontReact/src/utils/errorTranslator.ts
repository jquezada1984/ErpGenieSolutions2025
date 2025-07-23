// Traductor de errores del inglés al español
export const translateError = (error: string): string => {
  const errorMap: { [key: string]: string } = {
    // Errores de validación
    'body/ruc must match pattern "^\\d{11}$"': 'El RUC debe tener exactamente 11 dígitos',
    'body/ruc must match pattern "^\d{11}$"': 'El RUC debe tener exactamente 11 dígitos',
    'body/email must match format "email"': 'El formato del email no es válido',
    'body/nombre must NOT have fewer than 1 characters': 'El nombre es obligatorio',
    'body/nombre must NOT have more than 100 characters': 'El nombre no puede tener más de 100 caracteres',
    'body/direccion must NOT have fewer than 1 characters': 'La dirección es obligatoria',
    'body/direccion must NOT have more than 200 characters': 'La dirección no puede tener más de 200 caracteres',
    'body/telefono must NOT have fewer than 1 characters': 'El teléfono es obligatorio',
    'body/telefono must NOT have more than 20 characters': 'El teléfono no puede tener más de 20 caracteres',
    
    // Errores de red
    'Network Error': 'Error de conexión. Verifique su conexión a internet',
    'Failed to fetch': 'Error de conexión al servidor',
    'ERR_CONNECTION_REFUSED': 'No se puede conectar al servidor',
    'ERR_NETWORK': 'Error de red',
    'timeout': 'La solicitud tardó demasiado tiempo',
    
    // Errores HTTP
    '400': 'Solicitud incorrecta',
    '401': 'No autorizado. Inicie sesión nuevamente',
    '403': 'Acceso denegado',
    '404': 'Recurso no encontrado',
    '500': 'Error interno del servidor',
    '502': 'Error del servidor gateway',
    '503': 'Servicio no disponible',
    
    // Errores de autenticación
    'Invalid credentials': 'Credenciales inválidas',
    'User not found': 'Usuario no encontrado',
    'Password is incorrect': 'Contraseña incorrecta',
    'Token expired': 'Sesión expirada. Inicie sesión nuevamente',
    'Invalid token': 'Token inválido',
    
    // Errores de base de datos
    'duplicate key': 'Ya existe un registro con estos datos',
    'foreign key constraint': 'No se puede eliminar porque está siendo usado',
    'not null constraint': 'Campo obligatorio no puede estar vacío',
    'Ya existe una empresa con este RUC': 'Ya existe una empresa con este RUC',
    'Ya existe una empresa con este email': 'Ya existe una empresa con este email',
    'Error de duplicidad en los datos': 'Error de duplicidad en los datos',
    
    // Errores específicos del sistema
    'Error al actualizar la empresa': 'Error al actualizar la empresa',
    'Error al crear la empresa': 'Error al crear la empresa',
    'Error al eliminar la empresa': 'Error al eliminar la empresa',
    'Error al cargar las empresas': 'Error al cargar las empresas',
    'Error al cargar la empresa': 'Error al cargar la empresa',
    
    // Errores GraphQL
    'GraphQL error': 'Error en la consulta de datos',
    'ApolloError': 'Error en la comunicación con el servidor',
    
    // Errores genéricos
    'Something went wrong': 'Algo salió mal',
    'Unknown error': 'Error desconocido',
    'Internal server error': 'Error interno del servidor'
  };

  // Buscar coincidencias exactas
  if (errorMap[error]) {
    return errorMap[error];
  }

  // Buscar coincidencias parciales
  for (const [key, value] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Si no se encuentra traducción, devolver el error original
  return error;
};

// Función para extraer el mensaje de error de diferentes tipos de errores
export const extractErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return translateError(error);
  }

  if (error?.message) {
    return translateError(error.message);
  }

  if (error?.response?.data?.error) {
    return translateError(error.response.data.error);
  }

  if (error?.response?.data?.message) {
    return translateError(error.response.data.message);
  }

  if (error?.graphQLErrors && error.graphQLErrors.length > 0) {
    return translateError(error.graphQLErrors[0].message);
  }

  if (error?.networkError?.message) {
    return translateError(error.networkError.message);
  }

  return translateError('Error desconocido');
};

// Función para obtener el tipo de error (para mostrar iconos diferentes)
export const getErrorType = (error: any): 'validation' | 'network' | 'auth' | 'server' | 'unknown' => {
  const errorMessage = extractErrorMessage(error).toLowerCase();
  
  if (errorMessage.includes('ruc') || errorMessage.includes('email') || errorMessage.includes('nombre') || 
      errorMessage.includes('direccion') || errorMessage.includes('telefono') || errorMessage.includes('obligatorio')) {
    return 'validation';
  }
  
  if (errorMessage.includes('conexión') || errorMessage.includes('red') || errorMessage.includes('timeout')) {
    return 'network';
  }
  
  if (errorMessage.includes('autorizado') || errorMessage.includes('credenciales') || errorMessage.includes('sesión')) {
    return 'auth';
  }
  
  if (errorMessage.includes('servidor') || errorMessage.includes('interno')) {
    return 'server';
  }
  
  return 'unknown';
};

// Función para obtener el icono del error
export const getErrorIcon = (errorType: 'validation' | 'network' | 'auth' | 'server' | 'unknown'): string => {
  const icons = {
    validation: 'bi-exclamation-triangle',
    network: 'bi-wifi-off',
    auth: 'bi-shield-exclamation',
    server: 'bi-server',
    unknown: 'bi-question-circle'
  };
  
  return icons[errorType];
}; 
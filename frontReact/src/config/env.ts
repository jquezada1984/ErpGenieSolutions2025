// Configuración de entorno para el frontend
export const env = {
  // URL del gateway (único punto de entrada)
  GATEWAY_URL: 'http://localhost:3002',
  
  // URL del gateway para GraphQL
  GATEWAY_GRAPHQL_URL: 'http://localhost:3002/graphql',
  
  // Configuración de la aplicación
  APP_TITLE: 'ERP System',
  NODE_ENV: 'development'
};

// Función para obtener la URL del gateway GraphQL
export const getGatewayGraphQLUrl = () => {
  const url = env.GATEWAY_GRAPHQL_URL;
  return url;
};

// Función para obtener la URL del gateway
export const getGatewayUrl = () => {
  const url = env.GATEWAY_URL;
  return url;
};


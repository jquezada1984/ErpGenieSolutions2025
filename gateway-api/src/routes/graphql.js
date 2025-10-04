const axios = require('axios');

// Función para determinar el servicio objetivo basado en la consulta
const getTargetService = (query, config) => {
  // Primero verificar si es una mutación de autenticación (debe ir a InicioNestJs)
  if (query && (
    query.includes('mutation') && (
      query.includes('login') ||
      query.includes('register') ||
      query.includes('refreshToken') ||
      query.includes('validateToken')
    )
  )) {
    console.log('🔄 Redirigiendo mutación de autenticación a InicioNestJs');
    return config.nestjsService;
  }
  
  // Luego verificar si es una consulta específica de menús y permisos
  if (query && (
    query.includes('menu') || 
    query.includes('permiso') || 
    query.includes('seccion') ||
    query.includes('autorizacion') ||
    query.includes('opcionesMenuSuperior') ||
    query.includes('permisosPorPerfil') ||
    query.includes('permisosPorModulo') ||
    query.includes('menuLateralPorPerfil')
  )) {
    console.log('🔄 Redirigiendo consulta de menú a MenuNestJs');
    return config.menuService;
  } else {
    console.log('🔄 Redirigiendo consulta a InicioNestJs');
    return config.nestjsService;
  }
};

// Función para ejecutar consultas GraphQL
async function executeGraphQLQuery(query, variables, operationName, context, config) {
  try {
    // Determinar servicio objetivo
    const targetUrl = getTargetService(query, config);
    const target = `${targetUrl}/graphql`;
    
    console.log('🟣 Ejecutando consulta GraphQL:', operationName || 'anonymous');
    console.log('🔄 Target service:', target);
    
    const response = await axios.post(target, {
      query,
      variables,
      operationName
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': context.request.headers.authorization || '',
      },
      timeout: parseInt(process.env.GRAPHQL_SERVICE_TIMEOUT || '10000')
    });

    console.log('✅ Consulta GraphQL ejecutada exitosamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error ejecutando consulta GraphQL:', error.response?.data || error.message);
    throw error;
  }
}

async function routes(fastify, options) {
  // Endpoint GraphQL
  fastify.post('/graphql', async (request, reply) => {
    try {
      const { query, variables, operationName } = request.body;
      
      if (!query) {
        return reply.status(400).send({
          success: false,
          error: 'Query GraphQL requerida',
          timestamp: new Date().toISOString()
        });
      }

      // Obtener configuración del gateway
      const config = {
        nestjsService: process.env.NESTJS_SERVICE_URL,
        menuService: process.env.MENU_SERVICE_URL
      };

      const result = await executeGraphQLQuery(query, variables, operationName, { request }, config);
      
      return reply.send(result);
    } catch (error) {
      fastify.log.error('Error en endpoint GraphQL:', error);
      
      return reply.status(500).send({
        success: false,
        error: error.response?.data?.errors?.[0]?.message || error.message || 'Error interno del servidor',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Endpoint para obtener el schema (opcional, para herramientas como GraphQL Playground)
  fastify.get('/graphql', async (request, reply) => {
    try {
      return reply.send({
        success: true,
        message: 'GraphQL Gateway endpoint',
        service: 'NestJS GraphQL',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      fastify.log.error('Error en endpoint GraphQL GET:', error);
      return reply.status(500).send({
        success: false,
        error: 'Error en endpoint GraphQL',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Endpoint para verificar conectividad con NestJS GraphQL
  fastify.get('/graphql/health', async (request, reply) => {
    try {
      const response = await axios.get(NESTJS_GRAPHQL_URL.replace('/graphql', '/health'), {
        timeout: 3000
      });
      
      return reply.send({
        success: true,
        service: 'NestJS GraphQL',
        status: 'connected',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return reply.status(503).send({
        success: false,
        service: 'NestJS GraphQL',
        status: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });
}

module.exports = routes; 
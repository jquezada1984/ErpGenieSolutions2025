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
  
  // Verificar si es una MUTATION de permisos (debe ir a InicioNestJs)
  if (query && query.includes('mutation') && (
    query.includes('crearPermisoMenu') ||
    query.includes('actualizarPermisoMenu') ||
    query.includes('eliminarPermisoMenu') ||
    query.includes('crearPermisosMasivos') ||
    query.includes('cambiarEstadoPermisosPerfil') ||
    query.includes('cambiarEstadoPermisosMenuItem')
  )) {
    console.log('🔄 Redirigiendo mutación de permisos a InicioNestJs');
    return config.nestjsService;
  }
  
  // Luego verificar si es una consulta específica de menús y permisos (solo queries, no mutations)
  if (query && !query.includes('mutation') && (
    query.includes('menu') || 
    query.includes('permiso') || 
    query.includes('autorizacion') ||
    query.includes('opcionesMenuSuperior') ||
    query.includes('permisosPorPerfil') ||
    query.includes('permisosPorModulo') ||
    query.includes('menuLateralPorPerfil') ||
    query.includes('perfilConPermisos')
  )) {
    console.log('🔄 Redirigiendo consulta de menú a MenuNestJs');
    return config.menuService;
  }
  
  // Verificar si es una consulta de contabilidad
  if (query && (
    query.includes('cuentaContable') ||
    query.includes('asientoContable') ||
    query.includes('movimientoContable') ||
    query.includes('balanceGeneral') ||
    query.includes('diarioContable') ||
    query.includes('periodoContable') ||
    query.includes('libroMayor') ||
    query.includes('saldoCuenta') ||
    query.includes('configuracionContabilidad') ||
    query.includes('planContable') ||
    query.includes('modeloPlanContable') ||
    query.includes('cuentaContableDefecto') ||
    query.includes('cuentaIva') ||
    query.includes('cuentaImpuesto') ||
    query.includes('cuentaBancaria')
  )) {
    console.log('🔄 Redirigiendo consulta de contabilidad a ContabilidadNestJs');
    return config.contabilidadService;
  }
  
  // Por defecto, redirigir a InicioNestJs
  console.log('🔄 Redirigiendo consulta a InicioNestJs');
  return config.nestjsService;
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
        menuService: process.env.MENU_SERVICE_URL,
        contabilidadService: process.env.CONTABILIDAD_NESTJS_SERVICE_URL
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

  // Endpoint para verificar conectividad con servicios GraphQL
  fastify.get('/graphql/health', async (request, reply) => {
    try {
      const config = {
        nestjsService: process.env.NESTJS_SERVICE_URL,
        menuService: process.env.MENU_SERVICE_URL,
        contabilidadService: process.env.CONTABILIDAD_NESTJS_SERVICE_URL
      };
      
      const healthChecks = {};
      
      // Verificar InicioNestJs
      try {
        const response = await axios.get(`${config.nestjsService}/health`, { timeout: 3000 });
        healthChecks.inicioNestJs = { status: 'connected', data: response.data };
      } catch (error) {
        healthChecks.inicioNestJs = { status: 'disconnected', error: error.message };
      }
      
      // Verificar MenuNestJs
      try {
        const response = await axios.get(`${config.menuService}/health`, { timeout: 3000 });
        healthChecks.menuNestJs = { status: 'connected', data: response.data };
      } catch (error) {
        healthChecks.menuNestJs = { status: 'disconnected', error: error.message };
      }
      
      // Verificar ContabilidadNestJs
      try {
        const response = await axios.get(`${config.contabilidadService}/health`, { timeout: 3000 });
        healthChecks.contabilidadNestJs = { status: 'connected', data: response.data };
      } catch (error) {
        healthChecks.contabilidadNestJs = { status: 'disconnected', error: error.message };
      }
      
      return reply.send({
        success: true,
        services: healthChecks,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return reply.status(503).send({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });
}

module.exports = routes; 
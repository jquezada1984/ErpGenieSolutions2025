// Cargar variables de entorno
require('dotenv').config();

const fastify = require('fastify')({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  },
  trustProxy: true
});

// Configuración (puerto 3002 para coincidir con el frontend y Docker)
const config = {
  port: process.env.GATEWAY_PORT || 3002,
  pythonService: process.env.PYTHON_SERVICE_URL,
  nestjsService: process.env.NESTJS_SERVICE_URL,
  menuService: process.env.MENU_SERVICE_URL, // Agregar servicio de menú
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['*'],
    credentials: true
  }
};

// Debug: Imprimir variables de entorno
console.log('🔍 DEBUG - Variables de entorno:');
console.log('process.env.PYTHON_SERVICE_URL:', process.env.PYTHON_SERVICE_URL);
console.log('process.env.NESTJS_SERVICE_URL:', process.env.NESTJS_SERVICE_URL);
console.log('process.env.MENU_SERVICE_URL:', process.env.MENU_SERVICE_URL); // Agregar
console.log('process.env.GATEWAY_PORT:', process.env.GATEWAY_PORT);
console.log('process.env.CORS_ORIGIN:', process.env.CORS_ORIGIN);
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('---');

// Validar variables de entorno requeridas
if (!config.pythonService) {
  console.error('❌ ERROR: PYTHON_SERVICE_URL no está configurado en las variables de entorno');
  console.error('Valor actual:', process.env.PYTHON_SERVICE_URL);
  process.exit(1);
}

if (!config.nestjsService) {
  console.error('❌ ERROR: NESTJS_SERVICE_URL no está configurado en las variables de entorno');
  console.error('Valor actual:', process.env.NESTJS_SERVICE_URL);
  process.exit(1);
}

if (!config.menuService) {
  console.error('❌ ERROR: MENU_SERVICE_URL no está configurado en las variables de entorno');
  console.error('Valor actual:', process.env.MENU_SERVICE_URL);
  process.exit(1);
}

// Registrar plugins
fastify.register(require('@fastify/cors'), config.cors);
fastify.register(require('@fastify/helmet'));
fastify.register(require('@fastify/multipart'));

// Registrar rutas
fastify.register(require('./routes/empresas'), { prefix: '/api' });
fastify.register(require('./routes/perfil'), { prefix: '/api' });
fastify.register(require('./routes/sucursal'), { prefix: '/api' });
fastify.register(require('./routes/tercero'), { prefix: '/api' });
fastify.register(require('./routes/contacto'), { prefix: '/api' });
fastify.register(require('./routes/menu'), { prefix: '/api' });
fastify.register(require('./routes/usuarios'), { prefix: '/api' });
fastify.register(require('./routes/health'), { prefix: '/api' });
fastify.register(require('./routes/graphql'), { prefix: '' });
fastify.register(require('./routes/media'), { prefix: '/api' });

// Serializador personalizado para respuestas consistentes
fastify.setSerializerCompiler(({ schema, method, url, httpStatus }) => {
  return function (data) {
    // Si ya es una respuesta estructurada, devolverla tal como está
    if (data && typeof data === 'object' && data.hasOwnProperty('success')) {
      return JSON.stringify(data);
    }
    // Si no, envolverla en el formato estándar
    return JSON.stringify({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    });
  };
});

// Hook para manejo de errores
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  reply.status(error.statusCode || 500).send({
    success: false,
    error: error.message || 'Error interno del servidor',
    timestamp: new Date().toISOString()
  });
});

// Hook para logging de requests
fastify.addHook('onRequest', (request, reply, done) => {
  fastify.log.info({
    method: request.method,
    url: request.url,
    ip: request.ip,
    userAgent: request.headers['user-agent']
  });
  done();
});

// Hook para logging de responses
fastify.addHook('onResponse', (request, reply, done) => {
  fastify.log.info({
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    responseTime: reply.getResponseTime()
  });
  done();
});

// Iniciar servidor
const start = async () => {
  try {
    await fastify.listen({ 
      port: config.port, 
      host: '0.0.0.0' 
    });
    
    console.log('🚀 API Gateway ejecutándose en: http://localhost:' + config.port);
    console.log('📊 Configuración:');
    console.log(`   - Puerto: ${config.port}`);
    console.log(`   - Python Service: ${config.pythonService}`);
    console.log(`   - NestJS Service: ${config.nestjsService}`);
    console.log('==================================================');
    console.log('📡 Endpoints disponibles:');
    console.log(`   - GET  /api/empresas`);
    console.log(`   - GET  /api/empresas/:id`);
    console.log(`   - POST /api/empresas`);
    console.log(`   - PUT  /api/empresas/:id`);
    console.log(`   - DELETE /api/empresas/:id`);
    console.log(`   - GET  /api/perfiles`);
    console.log(`   - GET  /api/perfiles/:id`);
    console.log(`   - POST /api/perfiles`);
    console.log(`   - PUT  /api/perfiles/:id`);
    console.log(`   - DELETE /api/perfiles/:id`);
    console.log(`   - PUT  /api/perfiles/:id/estado`);
    console.log(`   - GET  /api/empresas/:empresaId/perfiles`);
    console.log(`   - POST /api/sucursales`);
    console.log(`   - PUT  /api/sucursales/:id`);
    console.log(`   - DELETE /api/sucursales/:id`);
    console.log(`   - PATCH /api/sucursales/:id/estado`);
    console.log(`   - POST /api/menu-secciones`);
    console.log(`   - PUT  /api/menu-secciones/:id`);
    console.log(`   - DELETE /api/menu-secciones/:id`);
    console.log(`   - POST /api/menu-items`);
    console.log(`   - PUT  /api/menu-items/:id`);
    console.log(`   - DELETE /api/menu-items/:id`);
    console.log(`   - GET  /api/health`);
    console.log(`   - GET  /api/status`);
    console.log('==================================================');
    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 
const { pythonService } = require('../services');

function decodeJwtPayload(authHeader) {
  if (!authHeader || typeof authHeader !== 'string') return null;
  const raw = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader;
  const parts = raw.split('.');
  if (parts.length < 2) return null;
  try {
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch {
    try {
      const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const pad = '='.repeat((4 - (b64.length % 4)) % 4);
      return JSON.parse(Buffer.from(b64 + pad, 'base64').toString('utf8'));
    } catch {
      return null;
    }
  }
}

function isCallerScopeGlobal(authHeader) {
  const p = decodeJwtPayload(authHeader);
  return String(p?.scope_acceso ?? 'EMPRESA').trim().toUpperCase() === 'GLOBAL';
}

function stripScopeIfNotGlobal(body, authHeader) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return body;
  if (isCallerScopeGlobal(authHeader)) return body;
  const { scope_acceso, ...rest } = body;
  return rest;
}

async function routes(fastify) {
  // POST /api/usuarios - Crear usuario (InicioPython)
  fastify.post('/usuarios', {
    schema: {
      description: 'Crear nuevo usuario',
      tags: ['Usuarios'],
      body: {
        type: 'object',
        properties: {
          id_empresa: { type: 'string' },
          id_perfil: { type: 'string' },
          username: { type: 'string' },
          password: { type: 'string' },
          nombre_completo: { type: 'string' },
          email: { type: 'string' }
        },
        required: ['id_empresa', 'id_perfil', 'username', 'password']
      },
      response: { 201: { type: 'object' } }
    }
  }, async (request, reply) => {
    try {
      const auth =
        request.headers.authorization ||
        request.headers.Authorization ||
        request.raw?.headers?.authorization;
      const usuarioData = stripScopeIfNotGlobal(request.body, auth);
      if (!auth) {
        fastify.log.warn('POST /usuarios sin Authorization; InicioPython exige JWT');
      }
      fastify.log.info('POST /usuarios - Creando usuario en Python');
      const response = await pythonService.createUsuario(usuarioData, auth);
      reply.status(201);
      return response;
    } catch (error) {
      fastify.log.error('Error creando usuario:', error);
      const msg = error.message || 'Error al crear usuario';
      const code = error.statusCode || error.response?.status || 500;
      return reply.status(code >= 400 && code < 600 ? code : 500).send({ success: false, error: msg });
    }
  });

  // PUT /api/usuarios/:id - Actualizar usuario (InicioPython)
  fastify.put('/usuarios/:id', {
    schema: {
      description: 'Actualizar usuario',
      tags: ['Usuarios'],
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      },
      body: { type: 'object' },
      response: { 200: { type: 'object' } }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const auth =
        request.headers.authorization ||
        request.headers.Authorization ||
        request.raw?.headers?.authorization;
      const usuarioData = stripScopeIfNotGlobal(request.body, auth);
      if (!auth) {
        fastify.log.warn(`PUT /usuarios/${id} sin Authorization; InicioPython exige JWT`);
      }
      fastify.log.info(`PUT /usuarios/${id} - Actualizando usuario en Python`);
      const response = await pythonService.updateUsuario(id, usuarioData, auth);
      return response;
    } catch (error) {
      fastify.log.error('Error actualizando usuario:', error);
      const msg = error.message || 'Error al actualizar usuario';
      const code = error.statusCode || error.response?.status || 500;
      return reply.status(code >= 400 && code < 600 ? code : 500).send({ success: false, error: msg });
    }
  });
}

module.exports = routes;

const { pythonService } = require('../services');

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
      const usuarioData = request.body;
      fastify.log.info('POST /usuarios - Creando usuario en Python');
      const response = await pythonService.createUsuario(usuarioData);
      reply.status(201);
      return response;
    } catch (error) {
      fastify.log.error('Error creando usuario:', error);
      const msg = error.message || 'Error al crear usuario';
      return reply.status(500).send({ success: false, error: msg });
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
      const usuarioData = request.body;
      fastify.log.info(`PUT /usuarios/${id} - Actualizando usuario en Python`);
      const response = await pythonService.updateUsuario(id, usuarioData);
      return response;
    } catch (error) {
      fastify.log.error('Error actualizando usuario:', error);
      const msg = error.message || 'Error al actualizar usuario';
      return reply.status(500).send({ success: false, error: msg });
    }
  });
}

module.exports = routes;

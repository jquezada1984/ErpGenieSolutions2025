const { 
  menuSeccionSchema, 
  menuSeccionUpdateSchema, 
  menuItemSchema, 
  menuItemUpdateSchema 
} = require('../schemas/menu');
const { pythonService } = require('../services');

// ===== SECCIONES DE MENÚ =====

// Crear sección de menú
async function crearSeccion(request, reply) {
  try {
    console.log('📝 Gateway: Creando sección de menú:', request.body);
    
    const response = await pythonService.post('/api/menu-secciones', request.body);
    
    console.log('✅ Gateway: Sección creada exitosamente');
    reply.status(201).send(response.data);
  } catch (error) {
    console.error('❌ Gateway: Error al crear sección:', error.response?.data || error.message);
    reply.status(error.response?.status || 500).send(error.response?.data || { 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
}

// Actualizar sección de menú
async function actualizarSeccion(request, reply) {
  try {
    const { id } = request.params;
    console.log('📝 Gateway: Actualizando sección de menú:', id, request.body);
    
    const response = await pythonService.put(`/api/menu-secciones/${id}`, request.body);
    
    console.log('✅ Gateway: Sección actualizada exitosamente');
    reply.send(response.data);
  } catch (error) {
    console.error('❌ Gateway: Error al actualizar sección:', error.response?.data || error.message);
    reply.status(error.response?.status || 500).send(error.response?.data || { 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
}

// Eliminar sección de menú
async function eliminarSeccion(request, reply) {
  try {
    const { id } = request.params;
    console.log('🗑️ Gateway: Eliminando sección de menú:', id);
    
    const response = await pythonService.delete(`/api/menu-secciones/${id}`);
    
    console.log('✅ Gateway: Sección eliminada exitosamente');
    reply.send(response.data);
  } catch (error) {
    console.error('❌ Gateway: Error al eliminar sección:', error.response?.data || error.message);
    reply.status(error.response?.status || 500).send(error.response?.data || { 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
}

// ===== ITEMS DE MENÚ =====

// Crear item de menú
async function crearItem(request, reply) {
  try {
    console.log('📝 Gateway: Creando item de menú:', request.body);
    
    const response = await pythonService.post('/api/menu-items', request.body);
    
    console.log('✅ Gateway: Item creado exitosamente');
    reply.status(201).send(response.data);
  } catch (error) {
    console.error('❌ Gateway: Error al crear item:', error.response?.data || error.message);
    reply.status(error.response?.status || 500).send(error.response?.data || { 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
}

// Actualizar item de menú
async function actualizarItem(request, reply) {
  try {
    const { id } = request.params;
    console.log('📝 Gateway: Actualizando item de menú:', id, request.body);
    
    const response = await pythonService.put(`/api/menu-items/${id}`, request.body);
    
    console.log('✅ Gateway: Item actualizado exitosamente');
    reply.send(response.data);
  } catch (error) {
    console.error('❌ Gateway: Error al actualizar item:', error.response?.data || error.message);
    reply.status(error.response?.status || 500).send(error.response?.data || { 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
}

// Eliminar item de menú
async function eliminarItem(request, reply) {
  try {
    const { id } = request.params;
    console.log('🗑️ Gateway: Eliminando item de menú:', id);
    
    const response = await pythonService.delete(`/api/menu-items/${id}`);
    
    console.log('✅ Gateway: Item eliminado exitosamente');
    reply.send(response.data);
  } catch (error) {
    console.error('❌ Gateway: Error al eliminar item:', error.response?.data || error.message);
    reply.status(error.response?.status || 500).send(error.response?.data || { 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
}

module.exports = async function (fastify, opts) {
  // ===== SECCIONES DE MENÚ =====
  
  // Crear sección de menú
  fastify.post('/menu-secciones', {
    schema: {
      body: menuSeccionSchema
    }
  }, crearSeccion);

  // Actualizar sección de menú
  fastify.put('/menu-secciones/:id', {
    schema: {
      body: menuSeccionUpdateSchema
    }
  }, actualizarSeccion);

  // Eliminar sección de menú
  fastify.delete('/menu-secciones/:id', eliminarSeccion);

  // ===== ITEMS DE MENÚ =====

  // Crear item de menú
  fastify.post('/menu-items', {
    schema: {
      body: menuItemSchema
    }
  }, crearItem);

  // Actualizar item de menú
  fastify.put('/menu-items/:id', {
    schema: {
      body: menuItemUpdateSchema
    }
  }, actualizarItem);

  // Eliminar item de menú
  fastify.delete('/menu-items/:id', eliminarItem);
}; 
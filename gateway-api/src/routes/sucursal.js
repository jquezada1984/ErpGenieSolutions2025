const { sucursalSchema, sucursalUpdateSchema } = require('../schemas/sucursal');
const { pythonService } = require('../services');

// Crear sucursal
async function crearSucursal(request, reply) {
  try {
    console.log('📝 Gateway: Creando sucursal:', request.body);
    
    const response = await pythonService.post('/api/sucursales', request.body);
    
    console.log('✅ Gateway: Sucursal creada exitosamente');
    reply.status(201).send(response.data);
  } catch (error) {
    console.error('❌ Gateway: Error al crear sucursal:', error.response?.data || error.message);
    reply.status(error.response?.status || 500).send(error.response?.data || { 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
}

// Actualizar sucursal
async function actualizarSucursal(request, reply) {
  try {
    const { id } = request.params;
    console.log('📝 Gateway: Actualizando sucursal:', id, request.body);
    
    const response = await pythonService.put(`/api/sucursales/${id}`, request.body);
    
    console.log('✅ Gateway: Sucursal actualizada exitosamente');
    reply.send(response.data);
  } catch (error) {
    console.error('❌ Gateway: Error al actualizar sucursal:', error.response?.data || error.message);
    reply.status(error.response?.status || 500).send(error.response?.data || { 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
}

// Eliminar sucursal
async function eliminarSucursal(request, reply) {
  try {
    const { id } = request.params;
    console.log('🗑️ Gateway: Eliminando sucursal:', id);
    
    const response = await pythonService.delete(`/api/sucursales/${id}`);
    
    console.log('✅ Gateway: Sucursal eliminada exitosamente');
    reply.send(response.data);
  } catch (error) {
    console.error('❌ Gateway: Error al eliminar sucursal:', error.response?.data || error.message);
    reply.status(error.response?.status || 500).send(error.response?.data || { 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
}

// Cambiar estado de sucursal
async function cambiarEstadoSucursal(request, reply) {
  try {
    const { id } = request.params;
    const { estado } = request.body;
    console.log('🔄 Gateway: Cambiando estado de sucursal:', id, estado);
    
    const response = await pythonService.patch(`/api/sucursales/${id}/estado`, { estado });
    
    console.log('✅ Gateway: Estado de sucursal cambiado exitosamente');
    reply.send(response.data);
  } catch (error) {
    console.error('❌ Gateway: Error al cambiar estado de sucursal:', error.response?.data || error.message);
    reply.status(error.response?.status || 500).send(error.response?.data || { 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
}

module.exports = async function (fastify, opts) {
  // Crear sucursal
  fastify.post('/sucursales', {
    schema: {
      body: sucursalSchema
    }
  }, crearSucursal);

  // Actualizar sucursal
  fastify.put('/sucursales/:id', {
    schema: {
      body: sucursalUpdateSchema
    }
  }, actualizarSucursal);

  // Eliminar sucursal
  fastify.delete('/sucursales/:id', eliminarSucursal);

  // Cambiar estado de sucursal
  fastify.patch('/sucursales/:id/estado', cambiarEstadoSucursal);
}; 
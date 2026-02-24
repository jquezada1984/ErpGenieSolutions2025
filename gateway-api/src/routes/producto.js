const productoPython = require("../services/productoPython");
const productoNestJs = require("../services/productoNestJs");

async function routes(fastify) {
  // POST /api/producto  -> ProductoPython
  fastify.post("/producto", async (request, reply) => {
    try {
      const data = await productoPython.crearProducto(request.body, request);
      return reply.code(201).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: "Error en ProductoPython" };
      return reply.code(status).send(payload);
    }
  });

  // PATCH /api/producto/:id  -> ProductoPython
  fastify.patch("/producto/:id", async (request, reply) => {
    try {
      // Obtener id_empresa: header > query > body
      let idEmpresa = request.headers["x-empresa-id"] || 
                      request.headers["X-Empresa-Id"] || 
                      request.query?.id_empresa ||
                      request.body?.id_empresa;
      
      // Si no viene id_empresa, retornar error (el front debe enviarlo)
      if (!idEmpresa) {
        return reply.code(400).send({ 
          success: false, 
          error: "id_empresa es obligatorio (envíelo en header x-empresa-id o query ?id_empresa=)" 
        });
      }
      
      // Inyectar en headers y query para ProductoPython
      if (!request.headers["x-empresa-id"]) {
        request.headers["x-empresa-id"] = idEmpresa;
      }
      if (!request.query) request.query = {};
      if (!request.query.id_empresa) {
        request.query.id_empresa = idEmpresa;
      }
      
      const data = await productoPython.actualizarProducto(request.params.id, request.body, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: "Error en ProductoPython" };
      return reply.code(status).send(payload);
    }
  });

  // DELETE /api/producto/:id  -> ProductoPython
  fastify.delete("/producto/:id", async (request, reply) => {
    try {
      const data = await productoPython.eliminarProducto(request.params.id, request);
      return reply.code(200).send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const payload = err.response?.data || { success: false, error: "Error en ProductoPython" };
      return reply.code(status).send(payload);
    }
  });
}

module.exports = routes;

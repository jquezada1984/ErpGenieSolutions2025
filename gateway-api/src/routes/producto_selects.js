/**
 * Rutas de lectura para selects (catálogos) del formulario producto.
 * Llama a ProductoNestJs vía GraphQL. No modifica POST /api/producto.
 */
module.exports = async function (fastify) {
  const NEST_GQL = process.env.PRODUCTO_NESTJS_URL;

  fastify.get("/productos/selects/paises", async (request, reply) => {
    const query = `
      query {
        paises {
          id_pais
          nombre
          codigo_iso
        }
      }
    `;
    try {
      const response = await fastify.httpClient.post(NEST_GQL, { query });
      const data = response.data;
      if (data?.errors?.length) {
        return reply.code(500).send({ success: false, error: data.errors[0].message });
      }
      return reply.send({ success: true, data: data.data.paises || [] });
    } catch (error) {
      const msg =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        error.message ||
        "Error consultando paises";
      return reply.code(500).send({ success: false, error: msg });
    }
  });

  fastify.get("/productos/selects/provincias", async (request, reply) => {
    const id_pais = request.query?.id_pais;
    if (!id_pais) {
      return reply.code(400).send({ success: false, error: "id_pais es requerido" });
    }
    const query = `
      query Provincias($id_pais: ID!) {
        provincias(id_pais: $id_pais) {
          id_provincia
          nombre
        }
      }
    `;
    const variables = { id_pais };
    try {
      const response = await fastify.httpClient.post(NEST_GQL, { query, variables });
      const data = response.data;
      if (data?.errors?.length) {
        return reply.code(500).send({ success: false, error: data.errors[0].message });
      }
      return reply.send({ success: true, data: data.data.provincias || [] });
    } catch (error) {
      const msg =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        error.message ||
        "Error consultando provincias";
      return reply.code(500).send({ success: false, error: msg });
    }
  });

  fastify.get("/productos/selects/impuestos", async (request, reply) => {
    const query = `
      query {
        impuestos {
          id
          nombre
          tasa
        }
      }
    `;
    try {
      const response = await fastify.httpClient.post(NEST_GQL, { query });
      const data = response.data;
      if (data?.errors?.length) {
        return reply.code(500).send({ success: false, error: data.errors[0].message });
      }
      return reply.send({ success: true, data: data.data.impuestos || [] });
    } catch (error) {
      const msg =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        error.message ||
        "Error consultando impuestos";
      return reply.code(500).send({ success: false, error: msg });
    }
  });
};

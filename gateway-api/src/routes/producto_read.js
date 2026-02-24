module.exports = async function (fastify, opts) {
  //const NEST_GQL = `${process.env.NESTJS_SERVICE_URL}/graphql`;
  const NEST_GQL = process.env.PRODUCTO_NESTJS_URL;

  fastify.get("/productos", async (request, reply) => {
    const { id_empresa, page = 1, limit = 20, search } = request.query;

    if (!id_empresa) {
      return reply.code(400).send({ success: false, error: "id_empresa es requerido" });
    }

    const query = `
      query Productos($filter: ProductoFilterInput!) {
        productos(filter: $filter) {
          total
          page
          limit
          items {
            id_producto
            producto_ref
            etiqueta
            estado_venta
            estado_compra
            estado
            precio_venta
            impuesto_id
            id_empresa
            updated_at
          }
        }
      }
    `;

    const variables = {
      filter: {
        id_empresa,
        page: Number(page),
        limit: Number(limit),
        search: search ? String(search) : null,
      },
    };

    try {
      const response = await fastify.httpClient.post(NEST_GQL, { query, variables });
      const data = response.data; // ✅ axios

      if (data?.errors?.length) {
        return reply.code(500).send({ success: false, error: data.errors[0].message });
      }

      return reply.send({ success: true, data: data.data.productos });
    } catch (error) {
      const msg =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        error.message ||
        "Error consultando ProductoNest";

      return reply.code(500).send({ success: false, error: msg });
    }
  });

  fastify.get("/productos/:id_producto", async (request, reply) => {
    const { id_producto } = request.params;
    const { id_empresa } = request.query;

    if (!id_empresa) {
      return reply.code(400).send({ success: false, error: "id_empresa es requerido" });
    }

    const query = `
      query ProductoById($id_producto: ID!, $id_empresa: ID!) {
        productoById(id_producto: $id_producto, id_empresa: $id_empresa) {
          id_producto
          producto_ref
          etiqueta
          estado_venta
          estado_compra
          descripcion
          url_publica
          naturaleza
          peso
          longitud
          anchura
          altura
          unidad_longitud
          superficie
          unidad_superficie
          volumen
          unidad_volumen
          nomenclatura_aduanera
          pais_origen
          provincia_origen
          nota_interna
          precio_venta
          precio_minimo
          impuesto_id
          contabilidad_venta
          contabilidad_exportacion
          contabilidad_compra
          contabilidad_importacion
          id_empresa
          created_at
          updated_at
        }
      }
    `;

    const variables = {
      id_producto,
      id_empresa,
    };

    try {
      const response = await fastify.httpClient.post(NEST_GQL, { query, variables });
      const data = response.data;

      if (data?.errors?.length) {
        return reply.code(500).send({ success: false, error: data.errors[0].message });
      }

      return reply.send({ success: true, data: data.data.productoById });
    } catch (error) {
      const msg =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        error.message ||
        "Error consultando producto por ID";

      return reply.code(500).send({ success: false, error: msg });
    }
  });
};

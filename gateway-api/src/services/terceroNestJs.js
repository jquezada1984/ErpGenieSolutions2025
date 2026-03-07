// src/services/terceroNestJs.js
const axios = require('axios');

// URL del servicio TerceroNestJs (GraphQL)
const BASE_URL = process.env.TERCERO_NEST_GQL_URL || 'http://tercero-nestjs-service:3001';
const TIMEOUT = parseInt(process.env.TERCERO_NEST_TIMEOUT || '10000', 10);

const http = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

function ctxHeaders(req) {
  return {
    'Content-Type': 'application/json',
    'X-Company-Id': req.headers['x-company-id'] || req.headers['X-Company-Id'] || '',
    'X-User-Id': req.headers['x-user-id'] || req.headers['X-User-Id'] || '',
    Authorization: req.headers.authorization || '',
  };
}

async function gqlRequest(query, variables, req) {
  try {
    console.log('🔍 GraphQL Request a:', BASE_URL + '/graphql');
    console.log('📝 Query:', query);
    const res = await http.post(
      '/graphql',
      { query, variables },
      { headers: ctxHeaders(req) }
    );
    if (res.data.errors?.length) {
      console.error('❌ GraphQL Errors:', res.data.errors);
      const msg = res.data.errors.map((e) => e.message).join(' | ');
      const err = new Error(msg);
      err.response = { status: 400, data: res.data };
      throw err;
    }
    console.log('✅ GraphQL Response:', res.data.data);
    return res.data.data;
  } catch (error) {
    console.error('❌ Error en gqlRequest:', error.message);
    if (error.response) {
      console.error('❌ Response data:', error.response.data);
    }
    throw error;
  }
}

// --------------------
// LECTURA TERCEROS
// --------------------
async function listarTerceros(req) {
  const query = `
    query {
      terceros {
        id_tercero
        nombre
        apodo
        cliente
        proveedor
        cliente_potencial
        estado
        codigo_cliente
        codigo_proveedor
        empresa {
          id_empresa
          nombre
        }
        tipo_tercero {
          id_tipo_tercero
          nombre
        }
        asignado_a
      }
    }
  `;
  try {
    const data = await gqlRequest(query, {}, req);
    return data.terceros || [];
  } catch (error) {
    console.error('❌ Error en listarTerceros GraphQL:', error);
    throw error;
  }
}

async function listarClientes(req) {
  const query = `
    query {
      clientes {
        id_tercero
        nombre
        apodo
        cliente
        proveedor
        cliente_potencial
        estado
        codigo_cliente
        codigo_proveedor
        empresa { id_empresa nombre }
        tipo_tercero { id_tipo_tercero nombre }
        asignado_a
      }
    }
  `;
  try {
    const data = await gqlRequest(query, {}, req);
    return data.clientes || [];
  } catch (error) {
    console.error('❌ Error en listarClientes GraphQL:', error);
    throw error;
  }
}

async function obtenerTercero(id_tercero, req) {
  const query = `
    query ($id_tercero: String!) {
      tercero(id_tercero: $id_tercero) {
        id_tercero
        nombre
        apodo
        cliente
        proveedor
        cliente_potencial
        estado
        codigo_cliente
        codigo_proveedor
        direccion
        poblacion
        codigo_postal
        provincia
        telefono
        movil
        fax
        correo
        web
        sujeto_iva
        capital
        id_pais
        id_tipo_tercero
        id_condicion_pago
        id_forma_pago
      }
    }
  `;
  const data = await gqlRequest(query, { id_tercero }, req);
  return data.tercero;
}

// --------------------
// SELECTS / CATÁLOGOS
// (ajusta nombres si tu schema difiere)
// --------------------
async function listarTiposTercero(req) {
  const query = `
    query {
      tiposTercero {
        id_tipo_tercero
        nombre
      }
    }
  `;
  try {
    const data = await gqlRequest(query, {}, req);
    return data.tiposTercero || [];
  } catch (error) {
    console.error('❌ Error en listarTiposTercero GraphQL:', error);
    throw error;
  }
}

async function listarCondicionesPago(req) {
  const query = `
    query {
      condicionesPago {
        id_condicion_pago
        descripcion
      }
    }
  `;
  try {
    const data = await gqlRequest(query, {}, req);
    return data.condicionesPago || [];
  } catch (error) {
    console.error('❌ Error en listarCondicionesPago GraphQL:', error);
    throw error;
  }
}

async function listarFormasPago(req) {
  const query = `
    query {
      formasPago {
        id_forma_pago
        descripcion
      }
    }
  `;
  try {
    const data = await gqlRequest(query, {}, req);
    return data.formasPago || [];
  } catch (error) {
    console.error('❌ Error en listarFormasPago GraphQL:', error);
    throw error;
  }
}

async function listarIncoterms(req) {
  const query = `
    query {
      incoterms {
        id_incoterm
        codigo
        descripcion
      }
    }
  `;
  try {
    const data = await gqlRequest(query, {}, req);
    return data.incoterms || [];
  } catch (error) {
    console.error('❌ Error en listarIncoterms GraphQL:', error);
    throw error;
  }
}

async function listarPaises(req) {
  const query = `
    query {
      paises {
        id_pais
        nombre
        codigo_iso
        icono
      }
    }
  `;
  try {
    const data = await gqlRequest(query, {}, req);
    console.log('✅ Países obtenidos desde GraphQL:', data);
    return data.paises || [];
  } catch (error) {
    console.error('❌ Error en listarPaises GraphQL:', error);
    throw error;
  }
}

async function listarEmpresas(req) {
  const query = `
    query {
      empresas {
        id_empresa
        nombre
        ruc
        estado
      }
    }
  `;
  try {
    const data = await gqlRequest(query, {}, req);
    console.log('✅ Empresas obtenidas desde GraphQL:', data);
    return data.empresas || [];
  } catch (error) {
    console.error('❌ Error en listarEmpresas GraphQL:', error);
    throw error;
  }
}

module.exports = {
  listarTerceros,
  listarClientes,
  obtenerTercero,
  listarTiposTercero,
  listarCondicionesPago,
  listarFormasPago,
  listarIncoterms,
  listarPaises,
  listarEmpresas,
};

const axios = require('axios');

const BASE_URL = process.env.BANCO_CAJA_NEST_GQL_URL || 'http://banco-caja-nestjs-service:3016';
const TIMEOUT = parseInt(process.env.BANCO_CAJA_NEST_TIMEOUT || '10000', 10);

const http = axios.create({ baseURL: BASE_URL, timeout: TIMEOUT });

function ctxHeaders(req) {
  return {
    'Content-Type': 'application/json',
    'X-Company-Id': req.headers['x-company-id'] || req.headers['X-Company-Id'] || '',
    'X-User-Id': req.headers['x-user-id'] || req.headers['X-User-Id'] || '',
    Authorization: req.headers.authorization || '',
  };
}

async function gqlRequest(query, variables, req) {
  const res = await http.post('/graphql', { query, variables }, { headers: ctxHeaders(req) });
  if (res.data.errors?.length) {
    const msg = res.data.errors.map((e) => e.message).join(' | ');
    const err = new Error(msg);
    err.response = { status: 400, data: res.data };
    throw err;
  }
  return res.data.data;
}

async function listarBancos(req, soloActivos = true) {
  const query = `
    query($soloActivos: Boolean) {
      bancos(soloActivos: $soloActivos) {
        id_banco
        nombre
        codigo
        swift
        web
        estado
      }
    }
  `;
  const data = await gqlRequest(query, { soloActivos }, req);
  return data.bancos || [];
}

async function obtenerBanco(id_banco, req) {
  const query = `
    query($id_banco: ID!) {
      banco(id_banco: $id_banco) {
        id_banco
        nombre
        codigo
        swift
        web
        estado
      }
    }
  `;
  const data = await gqlRequest(query, { id_banco }, req);
  return data.banco;
}

async function listarCuentasBancarias(req, id_empresa) {
  const query = `
    query($id_empresa: ID) {
      cuentasBancarias(id_empresa: $id_empresa) {
        id_cuenta_bancaria
        id_empresa
        id_banco
        numero_cuenta
        tipo_cuenta
        id_moneda
        saldo_inicial
        saldo_actual
        estado
        referencia
        etiqueta_cuenta
        estado_cuenta
        id_tercero
        iban
        bic_swift
        banco {
          id_banco
          nombre
          swift
        }
      }
    }
  `;
  const data = await gqlRequest(query, { id_empresa: id_empresa || null }, req);
  return data.cuentasBancarias || [];
}

async function obtenerCuentaBancaria(id_cuenta_bancaria, req) {
  const query = `
    query($id: ID!) {
      cuentaBancaria(id_cuenta_bancaria: $id) {
        id_cuenta_bancaria
        id_empresa
        id_banco
        numero_cuenta
        tipo_cuenta
        id_moneda
        id_cuenta_contable
        saldo_inicial
        saldo_actual
        estado
        referencia
        etiqueta_cuenta
        estado_cuenta
        id_tercero
        id_pais
        id_provincia
        direccion_banco
        web
        comentario
        comentario_html
        fecha_saldo_inicial
        saldo_minimo_autorizado
        saldo_minimo_deseado
        iban
        bic_swift
        codigo_contable
        banco {
          id_banco
          nombre
          swift
        }
      }
    }
  `;
  const data = await gqlRequest(query, { id: id_cuenta_bancaria }, req);
  return data.cuentaBancaria;
}

async function listarMovimientosBancarios(req, id_cuenta_bancaria, id_empresa) {
  const query = `
    query($id_cuenta_bancaria: ID!, $id_empresa: ID, $soloActivos: Boolean) {
      movimientosBancarios(id_cuenta_bancaria: $id_cuenta_bancaria, id_empresa: $id_empresa, soloActivos: $soloActivos) {
        id_movimiento_bancario
        id_cuenta_bancaria
        id_empresa
        fecha_movimiento
        numero_documento
        concepto
        tipo_movimiento
        monto
        saldo_anterior
        saldo_nuevo
        id_transferencia_bancaria
        id_movimiento_reversado
        conciliado
        created_at
      }
    }
  `;
  const data = await gqlRequest(
    query,
    { id_cuenta_bancaria, id_empresa: id_empresa || null, soloActivos: false },
    req,
  );
  return data.movimientosBancarios || [];
}

async function obtenerMovimientoBancario(id_movimiento_bancario, req) {
  const query = `
    query($id: ID!) {
      movimientoBancario(id_movimiento_bancario: $id) {
        id_movimiento_bancario
        id_cuenta_bancaria
        id_empresa
        fecha_movimiento
        numero_documento
        concepto
        tipo_movimiento
        monto
        id_transferencia_bancaria
        id_movimiento_reversado
        conciliado
      }
    }
  `;
  const data = await gqlRequest(query, { id: id_movimiento_bancario }, req);
  return data.movimientoBancario;
}

async function listarTransferenciasBancarias(req, id_empresa) {
  const query = `
    query($id_empresa: ID, $soloActivos: Boolean) {
      transferenciasBancarias(id_empresa: $id_empresa, soloActivos: $soloActivos) {
        id_transferencia_bancaria
        id_empresa
        id_cuenta_origen
        id_cuenta_destino
        monto
        fecha_movimiento
        numero_documento
        concepto
        tipo_movimiento
        estado
        created_at
        cuentaOrigen {
          id_cuenta_bancaria
          referencia
          etiqueta_cuenta
          numero_cuenta
          banco { nombre }
        }
        cuentaDestino {
          id_cuenta_bancaria
          referencia
          etiqueta_cuenta
          numero_cuenta
          banco { nombre }
        }
      }
    }
  `;
  const data = await gqlRequest(
    query,
    { id_empresa: id_empresa || null, soloActivos: false },
    req,
  );
  return data.transferenciasBancarias || [];
}

async function obtenerTransferenciaBancaria(id_transferencia_bancaria, req) {
  const query = `
    query($id: ID!) {
      transferenciaBancaria(id_transferencia_bancaria: $id) {
        id_transferencia_bancaria
        id_empresa
        id_cuenta_origen
        id_cuenta_destino
        monto
        fecha_movimiento
        numero_documento
        concepto
        tipo_movimiento
        estado
        cuentaOrigen {
          id_cuenta_bancaria
          referencia
          etiqueta_cuenta
          numero_cuenta
          banco { nombre }
        }
        cuentaDestino {
          id_cuenta_bancaria
          referencia
          etiqueta_cuenta
          numero_cuenta
          banco { nombre }
        }
      }
    }
  `;
  const data = await gqlRequest(query, { id: id_transferencia_bancaria }, req);
  return data.transferenciaBancaria;
}

module.exports = {
  listarBancos,
  obtenerBanco,
  listarCuentasBancarias,
  obtenerCuentaBancaria,
  listarMovimientosBancarios,
  obtenerMovimientoBancario,
  listarTransferenciasBancarias,
  obtenerTransferenciaBancaria,
};

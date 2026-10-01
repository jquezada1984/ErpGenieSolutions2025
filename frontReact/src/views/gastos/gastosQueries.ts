import { gql } from '@apollo/client';

export const GET_EMPRESAS = gql`
  query GetEmpresasGasto {
    empresas {
      id_empresa
      nombre
      ruc
      estado
    }
  }
`;

export const GET_CATEGORIAS_GASTO = gql`
  query GetCategoriasGasto($id_empresa: ID!, $solo_activos: Boolean) {
    categoriasGasto(id_empresa: $id_empresa, solo_activos: $solo_activos) {
      id_categoria_gasto
      id_empresa
      codigo
      nombre
      descripcion
      estado
      created_at
      updated_at
    }
  }
`;

export const GET_GASTOS = gql`
  query GetGastos(
    $id_empresa: ID!
    $estado_gasto: String
    $fecha_desde: String
    $fecha_hasta: String
    $id_categoria_gasto: ID
    $id_tercero: ID
  ) {
    gastos(
      id_empresa: $id_empresa
      estado_gasto: $estado_gasto
      fecha_desde: $fecha_desde
      fecha_hasta: $fecha_hasta
      id_categoria_gasto: $id_categoria_gasto
      id_tercero: $id_tercero
    ) {
      id_gasto
      id_empresa
      numero_gasto
      id_tercero
      id_categoria_gasto
      tipo_documento
      numero_documento
      fecha_gasto
      fecha_vencimiento
      concepto
      subtotal
      descuento
      impuesto
      total
      estado_gasto
      estado
      created_at
      updated_at
    }
  }
`;

export const GET_GASTO = gql`
  query GetGasto($id_gasto: ID!, $id_empresa: ID!) {
    gasto(id_gasto: $id_gasto, id_empresa: $id_empresa) {
      id_gasto
      id_empresa
      numero_gasto
      id_tercero
      id_categoria_gasto
      tipo_documento
      numero_documento
      fecha_gasto
      fecha_vencimiento
      concepto
      observacion
      subtotal
      descuento
      impuesto
      total
      estado_gasto
      estado
      created_at
      updated_at
      categoria {
        id_categoria_gasto
        codigo
        nombre
        estado
      }
      detalles {
        id_gasto_detalle
        id_gasto
        id_item
        impuesto_id
        descripcion
        cantidad
        precio_unitario
        descuento
        subtotal
        valor_impuesto
        total
        orden
        estado
      }
    }
  }
`;

export const GET_TERCEROS_GASTO = gql`
  query GetTercerosGasto($id_empresa: ID) {
    terceros(id_empresa: $id_empresa) {
      id_tercero
      nombre
      estado
      proveedor
    }
  }
`;

export const GET_ITEMS_GASTO = gql`
  query GetItemsGasto($id_empresa: ID) {
    itemsListado(id_empresa: $id_empresa) {
      id_item
      etiqueta
      producto_ref
      estado
      precio_compra
      precio_venta
    }
  }
`;

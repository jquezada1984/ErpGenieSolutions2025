export type TipoComportamientoCodigo =
  | 'SIMPLE'
  | 'INVENTARIABLE'
  | 'PERECIBLE'
  | 'COMBO'
  | 'INSUMO'
  | 'UNKNOWN';

export type TipoComportamientoUiRules = {
  general: {
    inventarioRelevante: boolean;
    caducidadRelevante: boolean;
  };
  inventario: {
    mostrarCamposFisicosAvanzados: boolean;
  };
  precios: {
    resaltarPrecioVenta: boolean;
    resaltarImpuesto: boolean;
    resaltarPrecioCompra: boolean;
  };
  contabilidad: {
    mostrarCuentaVenta: boolean;
    mostrarCuentaCompra: boolean;
    mostrarCuentasEspeciales: boolean;
  };
};

const DEFAULT_RULES: TipoComportamientoUiRules = {
  general: {
    inventarioRelevante: false,
    caducidadRelevante: false,
  },
  inventario: {
    mostrarCamposFisicosAvanzados: true,
  },
  precios: {
    resaltarPrecioVenta: false,
    resaltarImpuesto: false,
    resaltarPrecioCompra: false,
  },
  contabilidad: {
    mostrarCuentaVenta: true,
    mostrarCuentaCompra: true,
    mostrarCuentasEspeciales: true,
  },
};

const RULES_BY_CODE: Record<TipoComportamientoCodigo, TipoComportamientoUiRules> = {
  SIMPLE: {
    general: { inventarioRelevante: false, caducidadRelevante: false },
    inventario: { mostrarCamposFisicosAvanzados: false },
    precios: { resaltarPrecioVenta: true, resaltarImpuesto: true, resaltarPrecioCompra: false },
    contabilidad: { mostrarCuentaVenta: true, mostrarCuentaCompra: true, mostrarCuentasEspeciales: false },
  },
  INVENTARIABLE: {
    general: { inventarioRelevante: true, caducidadRelevante: false },
    inventario: { mostrarCamposFisicosAvanzados: true },
    precios: { resaltarPrecioVenta: true, resaltarImpuesto: true, resaltarPrecioCompra: false },
    contabilidad: { mostrarCuentaVenta: true, mostrarCuentaCompra: true, mostrarCuentasEspeciales: true },
  },
  PERECIBLE: {
    general: { inventarioRelevante: true, caducidadRelevante: true },
    inventario: { mostrarCamposFisicosAvanzados: true },
    precios: { resaltarPrecioVenta: true, resaltarImpuesto: true, resaltarPrecioCompra: false },
    contabilidad: { mostrarCuentaVenta: true, mostrarCuentaCompra: true, mostrarCuentasEspeciales: true },
  },
  COMBO: {
    general: { inventarioRelevante: false, caducidadRelevante: false },
    inventario: { mostrarCamposFisicosAvanzados: false },
    precios: { resaltarPrecioVenta: true, resaltarImpuesto: true, resaltarPrecioCompra: false },
    contabilidad: { mostrarCuentaVenta: true, mostrarCuentaCompra: true, mostrarCuentasEspeciales: false },
  },
  INSUMO: {
    general: { inventarioRelevante: true, caducidadRelevante: false },
    inventario: { mostrarCamposFisicosAvanzados: false },
    precios: { resaltarPrecioVenta: false, resaltarImpuesto: false, resaltarPrecioCompra: true },
    contabilidad: { mostrarCuentaVenta: true, mostrarCuentaCompra: true, mostrarCuentasEspeciales: true },
  },
  UNKNOWN: DEFAULT_RULES,
};

function normalizeCode(code: string | null | undefined): TipoComportamientoCodigo {
  const up = String(code ?? '')
    .trim()
    .toUpperCase();
  if (up === 'SIMPLE' || up === 'INVENTARIABLE' || up === 'PERECIBLE' || up === 'COMBO' || up === 'INSUMO') {
    return up;
  }
  return 'UNKNOWN';
}

export function getTipoComportamientoUiRules(codigo: string | null | undefined): TipoComportamientoUiRules {
  return RULES_BY_CODE[normalizeCode(codigo)];
}


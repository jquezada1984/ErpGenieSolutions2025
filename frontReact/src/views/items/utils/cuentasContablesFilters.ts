import type { SearchableSelectOption } from '../../../components/SearchableSelect';

/** Fila mínima del catálogo `cuentasContables` (InicioNestJs vía gateway). */
export type CuentaContableCatalogItem = {
  id_cuenta_contable: string;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  tipo_cuenta: string;
  permite_movimientos: boolean;
  estado: boolean;
};

export type ContabilidadCuentaField =
  | 'cuenta_venta'
  | 'cuenta_venta_intracomunitaria'
  | 'cuenta_venta_exportacion'
  | 'cuenta_compra'
  | 'cuenta_compra_intracomunitaria'
  | 'cuenta_compra_importacion';

function haystack(c: CuentaContableCatalogItem): string {
  return `${c.codigo} ${c.nombre} ${c.descripcion ?? ''} ${c.tipo_cuenta}`.toLowerCase();
}

function tipoUpper(c: CuentaContableCatalogItem): string {
  return (c.tipo_cuenta || '').toUpperCase();
}

/** Solo cuentas útiles en combos operativos (mismo criterio que backend suele usar para movimientos). */
export function catalogoBaseSeleccionable(items: CuentaContableCatalogItem[]): CuentaContableCatalogItem[] {
  return items.filter((c) => c.estado !== false && c.permite_movimientos === true);
}

export function toSelectOptions(items: CuentaContableCatalogItem[]): SearchableSelectOption[] {
  return items.map((c) => ({
    value: c.id_cuenta_contable,
    label: `${c.codigo} - ${c.nombre}`.trim(),
  }));
}

/**
 * Filtros heurísticos por campo (texto en español + tipo_cuenta del plan).
 * Si el subconjunto queda vacío → fallback al catálogo seleccionable completo (no romper UX).
 *
 * Limitación: sin metadato explícito “uso producto”, la clasificación es aproximada;
 * revisar datos reales del plan contable si hace falta afinar.
 */
export function filterCuentasParaCampo(
  field: ContabilidadCuentaField,
  all: CuentaContableCatalogItem[]
): CuentaContableCatalogItem[] {
  const base = catalogoBaseSeleccionable(all);
  if (base.length === 0) return all;

  const pick = (pred: (c: CuentaContableCatalogItem) => boolean): CuentaContableCatalogItem[] => {
    const s = base.filter(pred);
    return s.length > 0 ? s : base;
  };

  switch (field) {
    case 'cuenta_venta':
      return pick((c) => {
        const h = haystack(c);
        const t = tipoUpper(c);
        const texto = `${c.nombre} ${c.descripcion ?? ''}`.toLowerCase();
        if (h.includes('export') || h.includes('intracomunit') || h.includes('import')) return false;
        if (t === 'INGRESO') return true;
        return texto.includes('venta');
      });

    case 'cuenta_venta_intracomunitaria':
      return pick((c) => {
        const h = haystack(c);
        const t = tipoUpper(c);
        if (!h.includes('intracomunit')) return false;
        return t === 'INGRESO' || h.includes('venta');
      });

    case 'cuenta_venta_exportacion':
      return pick((c) => {
        const h = haystack(c);
        const t = tipoUpper(c);
        if (!h.includes('export')) return false;
        return t === 'INGRESO' || h.includes('venta');
      });

    case 'cuenta_compra':
      return pick((c) => {
        const h = haystack(c);
        const t = tipoUpper(c);
        const texto = `${c.nombre} ${c.descripcion ?? ''}`.toLowerCase();
        if (h.includes('intracomunit') || h.includes('import') || h.includes('export')) return false;
        if (t === 'GASTO' || t === 'COSTO') return true;
        return texto.includes('compra');
      });

    case 'cuenta_compra_intracomunitaria':
      return pick((c) => {
        const h = haystack(c);
        const t = tipoUpper(c);
        if (!h.includes('intracomunit')) return false;
        return t === 'GASTO' || t === 'COSTO' || h.includes('compra');
      });

    case 'cuenta_compra_importacion':
      return pick((c) => {
        const h = haystack(c);
        const t = tipoUpper(c);
        if (!h.includes('import')) return false;
        return t === 'GASTO' || t === 'COSTO' || h.includes('compra');
      });

    default:
      return base;
  }
}

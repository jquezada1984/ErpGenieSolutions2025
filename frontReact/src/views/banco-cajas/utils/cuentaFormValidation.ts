import * as yup from 'yup';
import type { FieldErrors } from 'react-hook-form';
import type { NuevaCuentaBancariaFormValues } from '../schemas/NuevaCuentaBancariaSchema';

export type CuentaTabId = '1' | '2' | '3' | '4';

const TAB_BY_FIELD: Partial<Record<keyof NuevaCuentaBancariaFormValues, CuentaTabId>> = {
  id_empresa: '1',
  tipo_cuenta: '1',
  id_moneda: '1',
  saldo_inicial: '2',
  saldo_minimo_autorizado: '2',
  saldo_minimo_deseado: '2',
  id_banco: '3',
  numero_cuenta: '3',
  iban: '3',
};

export function collectFormErrorMessages(obj: unknown): string[] {
  if (!obj || typeof obj !== 'object') return [];
  const record = obj as Record<string, unknown>;
  if (typeof record.message === 'string') return [record.message];
  return Object.values(record).flatMap(collectFormErrorMessages);
}

export function getFirstErrorTab(
  formErrors: FieldErrors<NuevaCuentaBancariaFormValues>,
): CuentaTabId | null {
  for (const key of Object.keys(formErrors) as (keyof NuevaCuentaBancariaFormValues)[]) {
    if (TAB_BY_FIELD[key]) return TAB_BY_FIELD[key]!;
  }
  return Object.keys(formErrors).length > 0 ? '1' : null;
}

export function fieldErrorMessage(
  errors: FieldErrors<NuevaCuentaBancariaFormValues> | undefined,
  field: keyof NuevaCuentaBancariaFormValues,
): string | undefined {
  const msg = errors?.[field]?.message;
  return typeof msg === 'string' ? msg : undefined;
}

/** Convierte errores Yup a formato react-hook-form (validación manual al enviar). */
export function yupErrorsToFieldErrors(
  error: yup.ValidationError,
): FieldErrors<NuevaCuentaBancariaFormValues> {
  const out: FieldErrors<NuevaCuentaBancariaFormValues> = {};
  if (error.inner.length > 0) {
    error.inner.forEach((item) => {
      if (!item.path) return;
      const path = item.path as keyof NuevaCuentaBancariaFormValues;
      if (!out[path]) {
        out[path] = { type: 'manual', message: item.message };
      }
    });
    return out;
  }
  if (error.path) {
    const path = error.path as keyof NuevaCuentaBancariaFormValues;
    out[path] = { type: 'manual', message: error.message };
  }
  return out;
}

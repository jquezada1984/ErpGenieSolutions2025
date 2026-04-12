/** Payload JWT decodificado (claims estándar + id_empresa, scope_acceso, etc.). */
export function isScopeGlobal(payload: { scope_acceso?: string } | null | undefined): boolean {
  return String(payload?.scope_acceso ?? 'EMPRESA')
    .trim()
    .toUpperCase() === 'GLOBAL';
}

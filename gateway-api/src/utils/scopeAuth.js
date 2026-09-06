/**
 * Helpers de alcance JWT para rutas de usuarios (strip scope si caller no es GLOBAL).
 */

function decodeJwtPayload(authHeader) {
  if (!authHeader || typeof authHeader !== 'string') return null;
  const raw = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader;
  const parts = raw.split('.');
  if (parts.length < 2) return null;
  try {
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch {
    try {
      const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const pad = '='.repeat((4 - (b64.length % 4)) % 4);
      return JSON.parse(Buffer.from(b64 + pad, 'base64').toString('utf8'));
    } catch {
      return null;
    }
  }
}

function isCallerScopeGlobal(authHeader) {
  const p = decodeJwtPayload(authHeader);
  return String(p?.scope_acceso ?? 'EMPRESA').trim().toUpperCase() === 'GLOBAL';
}

function stripScopeIfNotGlobal(body, authHeader) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return body;
  if (isCallerScopeGlobal(authHeader)) return body;
  const { scope_acceso, ...rest } = body;
  return rest;
}

module.exports = {
  decodeJwtPayload,
  isCallerScopeGlobal,
  stripScopeIfNotGlobal,
};

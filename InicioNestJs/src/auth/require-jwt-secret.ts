import { createHash } from 'crypto';

/**
 * JWT firmado por Nest; debe coincidir con JWT_SECRET / JWT_SECRET_KEY en servicios que validan el mismo token.
 * Sin valor por defecto en código: obliga a configurar el entorno.
 */

let _fingerprintLogged = false;
function normalizeJwtSecret(raw: string | undefined): string {
  if (raw == null) return '';
  let s = raw.replace(/^\uFEFF/, '').trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

/** Detecta si alguien pegó un JWT por error en lugar de una clave HMAC. */
function looksLikeJwtPayloadSymmetricKey(s: string): boolean {
  const parts = s.split('.');
  return parts.length === 3 && parts.every((p) => p.length > 0 && !p.includes(' '));
}

export function requireJwtSecret(): string {
  const s = normalizeJwtSecret(process.env.JWT_SECRET);
  if (!s) {
    throw new Error(
      'JWT_SECRET no está definido. Añádalo al .env (cadena aleatoria larga, p. ej. openssl rand -base64 48).',
    );
  }
  if (looksLikeJwtPayloadSymmetricKey(s)) {
    console.warn(
      '[auth] JWT_SECRET tiene forma de token JWT (tres segmentos con puntos). Suele ser un error: JWT_SECRET debe ser una clave secreta independiente, no el accessToken. Use openssl rand -base64 48. Tras cambiarlo, reinicie Nest y vuelva a iniciar sesión.',
    );
  }
  if (process.env.NODE_ENV !== 'production' && !_fingerprintLogged) {
    _fingerprintLogged = true;
    const fp = createHash('sha256').update(s, 'utf8').digest('hex').slice(0, 12);
    console.log(
      `[auth] Huella JWT_SECRET (dev, sha256·12 hex): ${fp} — debe coincidir con el log de InicioPython al arrancar.`,
    );
  }
  return s;
}

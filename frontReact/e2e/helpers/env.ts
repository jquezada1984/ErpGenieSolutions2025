import fs from 'node:fs';
import path from 'node:path';

/** Carga `.env.e2e` desde la raíz de frontReact (no pisa variables ya definidas). */
export function loadE2eEnv(): void {
  const envPath = path.resolve(process.cwd(), '.env.e2e');
  if (!fs.existsSync(envPath)) return;
  for (const raw of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadE2eEnv();

export function e2eBaseUrl(): string {
  return (process.env.E2E_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

/** Credenciales de usuario QA (nunca hardcodear). */
export function e2eCredentialsReady(): boolean {
  return Boolean(process.env.E2E_USER_EMAIL?.trim() && process.env.E2E_USER_PASSWORD?.trim());
}

export function e2eEmail(): string {
  return process.env.E2E_USER_EMAIL!.trim();
}

export function e2ePassword(): string {
  return process.env.E2E_USER_PASSWORD!.trim();
}

/** GLOBAL | EMPRESA — afecta asserts de combo empresa / seguridad. */
export function e2eScope(): 'GLOBAL' | 'EMPRESA' {
  const s = (process.env.E2E_SCOPE || 'GLOBAL').trim().toUpperCase();
  return s === 'EMPRESA' ? 'EMPRESA' : 'GLOBAL';
}

/**
 * Si `1`, ejecuta pasos de escritura (Grabar paneles/alertas, etc.).
 * Por defecto solo navegación happy-path (más estable en CI compartido).
 */
export function e2eMutateEnabled(): boolean {
  return process.env.E2E_MUTATE === '1' || process.env.E2E_MUTATE === 'true';
}

export const SKIP_NO_CREDS =
  'E2E omitido: defina E2E_USER_EMAIL y E2E_USER_PASSWORD (ver .env.e2e.example). Stack local o URL remota en E2E_BASE_URL.';

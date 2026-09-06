import { defineConfig, devices } from '@playwright/test';
import { loadE2eEnv, e2eBaseUrl } from './e2e/helpers/env';

loadE2eEnv();

/**
 * E2E Playwright (Sprint S3).
 * Sin credenciales E2E_* los specs se marcan skip (CI verde sin stack Docker).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: e2eBaseUrl(),
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    locale: 'es-ES',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // No arranca Vite aquí: hace falta front (+ gateway/API) ya levantados, o E2E_BASE_URL remoto.
});

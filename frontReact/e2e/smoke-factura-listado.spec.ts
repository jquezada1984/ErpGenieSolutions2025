import { test, expect } from '@playwright/test';
import { loginAsE2eUser, ensureEmpresaSeleccionada } from './helpers/auth';
import { e2eCredentialsReady, SKIP_NO_CREDS } from './helpers/env';

/**
 * Flujo factura ligero: listado (sin crear/validar — evita flaky de datos).
 * Tag @smoke para CI opcional.
 */
test.describe('Smoke factura @smoke', () => {
  test.skip(!e2eCredentialsReady(), SKIP_NO_CREDS);

  test('abre listado de facturas cliente', async ({ page }) => {
    await loginAsE2eUser(page);
    await ensureEmpresaSeleccionada(page);

    await page.goto('/financiero/facturas-clientes/listado');
    // Título típico del listado o contenedor de página autenticada
    await expect(page.locator('h4, h5, [data-testid="dashboard-titulo"]').first()).toBeVisible({
      timeout: 30_000,
    });
    await expect(page).not.toHaveURL(/\/auth\/login/);
  });
});

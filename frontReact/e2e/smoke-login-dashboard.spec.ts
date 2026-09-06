import { test, expect } from '@playwright/test';
import { loginAsE2eUser, ensureEmpresaSeleccionada } from './helpers/auth';
import { e2eCredentialsReady, SKIP_NO_CREDS } from './helpers/env';

test.describe('Smoke @smoke', () => {
  test.skip(!e2eCredentialsReady(), SKIP_NO_CREDS);

  test('login → dashboard', async ({ page }) => {
    await loginAsE2eUser(page);
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('dashboard-modulo')).toBeVisible();
    await ensureEmpresaSeleccionada(page);
  });
});

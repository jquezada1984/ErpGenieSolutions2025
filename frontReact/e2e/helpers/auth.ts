import { expect, type Page } from '@playwright/test';
import { e2eEmail, e2ePassword } from './env';

/** Login por formulario y espera redirección al dashboard. */
export async function loginAsE2eUser(page: Page): Promise<void> {
  await page.goto('/auth/login');
  await expect(page.getByRole('heading', { name: /iniciar sesión/i })).toBeVisible();

  const email = page.getByTestId('login-email').or(page.getByLabel(/correo electrónico/i));
  const password = page.getByTestId('login-password').or(page.getByLabel(/^contraseña$/i));
  const submit = page.getByTestId('login-submit').or(page.getByRole('button', { name: /ingresar/i }));

  await email.fill(e2eEmail());
  await password.fill(e2ePassword());
  await submit.click();

  await page.waitForURL(/\/dashboard/, { timeout: 30_000 });
  await expect(page.getByTestId('dashboard-titulo')).toContainText(/panel de control/i, {
    timeout: 30_000,
  });
}

/** Si GLOBAL sin empresa elegida, elige la primera opción del SelectEmpresa (react-select). */
export async function ensureEmpresaSeleccionada(page: Page): Promise<void> {
  const globalBar = page.getByTestId('config-empresa-bar-global');
  if ((await globalBar.count()) === 0) return;

  const placeholder = globalBar.getByText(/seleccione empresa/i);
  if ((await placeholder.count()) === 0) return;

  const control = globalBar.locator('.react-select__control, [class*="control"]').first();
  if ((await control.count()) === 0) {
    // Fallback: clic en el contenedor del select
    await globalBar.locator('input').first().click({ force: true });
  } else {
    await control.click();
  }

  const option = page.locator('[id*="react-select"][id*="-option-0], .react-select__option').first();
  await option.waitFor({ state: 'visible', timeout: 10_000 });
  await option.click();
}

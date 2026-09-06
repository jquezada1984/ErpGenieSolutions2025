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
  await globalBar.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => null);
  if ((await globalBar.count()) === 0) return;

  const avisoContinuar = page.getByText(/seleccione una empresa para continuar/i);
  await globalBar.locator('input').first().waitFor({ state: 'attached', timeout: 10_000 });

  const needsEmpresa = await avisoContinuar
    .first()
    .waitFor({ state: 'visible', timeout: 5_000 })
    .then(() => true)
    .catch(() => false);

  if (!needsEmpresa) {
    const ph = globalBar.getByText(/seleccione empresa/i);
    if ((await ph.count()) === 0) return;
  }

  // Abrir menú (portal de react-select en body)
  await globalBar.locator('input').first().click({ force: true });
  const option = page.getByText(/\d+\s*-\s*.+/).first();
  await option.waitFor({ state: 'visible', timeout: 10_000 });
  await option.click();

  await expect(avisoContinuar.first()).toBeHidden({ timeout: 15_000 });
}

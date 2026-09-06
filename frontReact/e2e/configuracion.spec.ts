import { test, expect } from '@playwright/test';
import { loginAsE2eUser, ensureEmpresaSeleccionada } from './helpers/auth';
import {
  e2eCredentialsReady,
  e2eMutateEnabled,
  e2eScope,
  SKIP_NO_CREDS,
} from './helpers/env';

/**
 * E2E Configuración (prioridad S3): hub, empresa, IVA, paneles, alertas, emails, seguridad.
 * Happy-path de navegación siempre; escrituras solo si E2E_MUTATE=1.
 */
test.describe('Configuración @config', () => {
  test.skip(!e2eCredentialsReady(), SKIP_NO_CREDS);

  test.beforeEach(async ({ page }) => {
    await loginAsE2eUser(page);
  });

  test('hub /configuracion respeta scope EMPRESA|GLOBAL', async ({ page }) => {
    await page.goto('/configuracion');
    await expect(page.getByTestId('config-hub')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Configuración' })).toBeVisible();

    const scope = e2eScope();
    if (scope === 'EMPRESA') {
      await expect(page.getByTestId('config-empresa-bar-empresa')).toBeVisible();
      await expect(page.getByTestId('config-empresa-bar-global')).toHaveCount(0);
    } else {
      await expect(page.getByTestId('config-empresa-bar-global')).toBeVisible();
      await ensureEmpresaSeleccionada(page);
    }

    await expect(page.getByRole('link', { name: /empresa \/ organización/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /^diccionarios$/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Paneles' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Alertas' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Seguridad' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'E-Mails' })).toBeVisible();
  });

  test('empresa del contexto abre ficha o pide selección', async ({ page }) => {
    await page.goto('/configuracion/empresa');
    await ensureEmpresaSeleccionada(page);

    // Redirige a /empresas/editar/:id o muestra aviso GLOBAL sin empresa
    const ficha = page.waitForURL(/\/empresas\/editar\//, { timeout: 15_000 }).then(() => 'ficha');
    const aviso = page
      .getByText(/seleccione una empresa/i)
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => 'aviso');
    const titulo = page
      .getByRole('heading', { name: /empresa \/ organización/i })
      .waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => 'titulo');
    const resultado = await Promise.race([ficha, aviso, titulo]);
    expect(['ficha', 'aviso', 'titulo']).toContain(resultado);
  });

  test('diccionarios → impuestos / IVA visible', async ({ page }) => {
    await page.goto('/configuracion/diccionarios');
    await ensureEmpresaSeleccionada(page);
    await expect(page.getByRole('heading', { name: 'Diccionarios' })).toBeVisible();
    // ListGroupItem+Link: el nombre accesible incluye "Editar"
    await page.getByRole('link', { name: /impuestos/i }).click();
    await expect(page).toHaveURL(/\/configuracion\/diccionarios\/impuestos/);
    await expect(page.getByRole('heading', { name: /Diccionarios — Impuestos \/ IVA/i })).toBeVisible({
      timeout: 20_000,
    });
  });

  test('paneles carga y muestra Grabar', async ({ page }) => {
    await page.goto('/configuracion/paneles');
    await ensureEmpresaSeleccionada(page);
    await expect(page.getByRole('heading', { name: 'Paneles' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Grabar' })).toBeVisible();

    if (e2eMutateEnabled()) {
      const desactivar = page.getByRole('button', { name: /desactivar/i }).first();
      if (await desactivar.isVisible().catch(() => false)) {
        await desactivar.click();
      } else {
        await page.getByRole('button', { name: 'Activar' }).first().click();
      }
      await page.getByRole('button', { name: 'Grabar' }).click();
      await expect(page.getByText(/paneles guardados/i)).toBeVisible({ timeout: 15_000 });
      await page.reload();
      await ensureEmpresaSeleccionada(page);
      await expect(page.getByRole('heading', { name: 'Paneles' })).toBeVisible();
    }
  });

  test('alertas carga y muestra Grabar', async ({ page }) => {
    await page.goto('/configuracion/alertas');
    await ensureEmpresaSeleccionada(page);
    await expect(page.getByText(/mostrando una alerta/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Grabar' })).toBeVisible();

    if (e2eMutateEnabled()) {
      const input = page.locator('input[type="number"]').first();
      const current = await input.inputValue();
      const next = String((Number(current) || 0) + 1);
      await input.fill(next);
      await page.getByRole('button', { name: 'Grabar' }).click();
      await expect(page.getByText(/alertas guardadas/i)).toBeVisible({ timeout: 15_000 });
      await page.reload();
      await ensureEmpresaSeleccionada(page);
      await expect(input).toHaveValue(next);
    }
  });

  test('emails carga y muestra Modificar', async ({ page }) => {
    await page.goto('/configuracion/emails');
    await ensureEmpresaSeleccionada(page);
    await expect(page.getByRole('heading', { name: /configuración e-mails/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Modificar' })).toBeVisible();

    if (e2eMutateEnabled()) {
      const remitente = page.getByLabel(/remitente|e-mail|correo/i).first();
      if (await remitente.isVisible().catch(() => false)) {
        await remitente.fill(`e2e-${Date.now()}@example.test`);
      }
      await page.getByRole('button', { name: 'Modificar' }).click();
      await expect(page.getByText(/e-mails guardada/i)).toBeVisible({ timeout: 15_000 });
    }
  });

  test('seguridad: GLOBAL puede guardar; EMPRESA botón deshabilitado', async ({ page }) => {
    await page.goto('/configuracion/seguridad');
    await expect(page.getByRole('heading', { name: /configuración de la seguridad/i })).toBeVisible();

    const btn = page.getByTestId('seguridad-modificar');
    await expect(btn).toBeVisible();

    if (e2eScope() === 'EMPRESA') {
      await expect(btn).toBeDisabled();
      await expect(page.getByText(/solo lectura|alcance GLOBAL/i)).toBeVisible();
    } else {
      await expect(btn).toBeEnabled();
      if (e2eMutateEnabled()) {
        await btn.click();
        await expect(page.getByText(/seguridad de instancia guardada/i)).toBeVisible({
          timeout: 15_000,
        });
      }
    }
  });
});

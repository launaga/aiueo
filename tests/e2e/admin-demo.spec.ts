import { expect, test } from '@playwright/test';

test.describe('isolated admin demo', () => {
  test.skip(process.env.ADMIN_DEMO_MODE !== 'true', 'Run with explicit ADMIN_DEMO_MODE and an environment-only session secret.');

  test('protects routes and demonstrates Viewer read-only access', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login$/);
    await page.getByRole('button', { name: /Masuk sebagai Viewer/ }).click();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByText('Mode Viewer')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Buat konten' })).toBeDisabled();
    await page.goto('/admin/content/events');
    await expect(page.getByRole('button', { name: /Konten baru/ })).toHaveCount(0);
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/\/admin\?denied=1$/);
    await page.getByRole('banner').getByRole('button', { name: 'Keluar' }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test('demonstrates Super Admin navigation and sandboxed controls', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByRole('button', { name: /Masuk sebagai Super Admin/ }).click();
    await expect(page.locator('.sidebar-head .role-chip')).toHaveText('super admin');
    await page.getByRole('link', { name: /Users/ }).click();
    await expect(page.getByRole('heading', { name: 'User management' })).toBeVisible();
    await expect(page.getByText(/Simulasi aman/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Kirim undangan' })).toBeDisabled();
    await page.goto('/admin/content/events');
    await expect(page.getByRole('button', { name: /Konten baru/ })).toBeEnabled();
  });

  test('keeps every admin surface usable at the narrowest supported viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/admin/login');
    await expect(page.getByRole('button', { name: /Masuk sebagai Super Admin/ })).toBeVisible();
    await page.getByRole('button', { name: /Masuk sebagai Super Admin/ }).click();
    const routes = ['/admin','/admin/account','/admin/content/events','/admin/media','/admin/leads','/admin/users','/admin/preview/events/seed-event-1'];
    for (const route of routes) {
      await page.goto(route);
      const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
      expect(dimensions.scroll, `${route} scroll width`).toBeLessThanOrEqual(dimensions.client);
    }
    await page.goto('/admin/content/events');
    await page.getByRole('button', { name: /Konten baru/ }).click();
    await expect(page.getByRole('heading', { name: /ID & EN berdampingan/ })).toBeVisible();
    const editorDimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(editorDimensions.scroll).toBeLessThanOrEqual(editorDimensions.client);
  });
});

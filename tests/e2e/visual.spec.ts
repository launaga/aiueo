import { mkdir } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const visualDir = 'test-results/visual';

test.describe('manual visual evidence', () => {
  test.skip(process.env.CAPTURE_VISUALS !== 'true', 'Enable only when capturing review artifacts.');

  test.beforeAll(async () => {
    await mkdir(visualDir, { recursive: true });
  });

  test('captures public packages at desktop and mobile widths', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/id/packages');
    await expect(page.getByRole('heading', { name: 'Pangalengan' })).toBeVisible();
    await page.screenshot({ path: `${visualDir}/packages-desktop.png`, fullPage: true });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await page.screenshot({ path: `${visualDir}/packages-mobile.png`, fullPage: true });
  });

  test('captures internal costing at desktop and mobile widths', async ({ page }) => {
    test.skip(process.env.ADMIN_DEMO_MODE !== 'true', 'Requires the isolated admin demo.');
    await page.goto('/admin/login');
    await page.getByRole('button', { name: /Masuk sebagai Super Admin/ }).click();
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto('/admin/costing');
    await expect(page.getByRole('heading', { name: 'Quote & Costing' })).toBeVisible();

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({ path: `${visualDir}/costing-desktop.png`, fullPage: true });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await page.screenshot({ path: `${visualDir}/costing-mobile.png`, fullPage: true });
  });
});

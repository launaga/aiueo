import { expect, test } from '@playwright/test';

const routes = ['/id','/id/about','/id/services','/id/packages','/id/events','/id/news','/id/gallery','/id/contact','/id/privacy','/id/terms'];
const viewports = [
  { name:'iphone-se', width:320, height:568 },
  { name:'iphone-13-mini', width:375, height:812 },
  { name:'iphone-13', width:390, height:844 },
  { name:'pixel-wide', width:430, height:932 },
];

for (const viewport of viewports) {
  test.describe(`${viewport.name} responsive public pages`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });
    for (const route of routes) {
      test(`${route} has no horizontal document overflow`, async ({ page }) => {
        await page.goto(route);
        const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
        expect(dimensions.scroll, `${route} scroll width`).toBeLessThanOrEqual(dimensions.client);
      });
    }
  });
}

test('mobile navigation and circular icon geometry remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/id');
  const menu = page.getByRole('button', { name: 'Menu' });
  await expect(menu).toHaveCSS('min-height', '44px');
  await menu.click();
  const contactIcon = page.locator('.nav-contact span');
  const box = await contactIcon.boundingBox();
  expect(box).not.toBeNull();
  expect(Math.abs((box?.width ?? 0) - (box?.height ?? 0))).toBeLessThanOrEqual(1);
});

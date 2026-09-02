import { expect, test } from '@playwright/test';

test('all rendered public internal links resolve', async ({ page, request, baseURL }) => {
  const entryRoutes = ['/id','/id/about','/id/services','/id/packages','/id/events','/id/news','/id/gallery','/id/contact','/id/privacy','/id/terms','/en','/en/about','/en/services','/en/packages','/en/events','/en/news','/en/gallery','/en/contact','/en/privacy','/en/terms'];
  const internal = new Set<string>();
  for (const route of entryRoutes) {
    await page.goto(route);
    const links = await page.locator('a[href]').evaluateAll((nodes) => nodes.map((node) => (node as HTMLAnchorElement).href));
    for (const href of links) {
      const url = new URL(href);
      if (baseURL && url.origin === new URL(baseURL).origin) internal.add(`${url.pathname}${url.search}`);
    }
  }
  for (const href of internal) {
    const response = await request.get(href);
    expect(response.status(), `${href} should resolve`).toBeLessThan(400);
  }
});

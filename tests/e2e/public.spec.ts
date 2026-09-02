import { expect, test } from '@playwright/test';

test('uses browser language and persists explicit bilingual choice',async({browser})=>{
  const context=await browser.newContext({locale:'id-ID',extraHTTPHeaders:{'Accept-Language':'id-ID,id;q=0.9'}});
  const page=await context.newPage(); await page.goto('/');
  await expect(page).toHaveURL(/\/id$/); await expect(page.locator('html')).toHaveAttribute('lang','id');
  await expect(page.getByRole('heading',{level:1})).toContainText('Hidup penuh momen');
  const english=page.getByRole('button',{name:'EN',exact:true});
  if(!await english.isVisible()) await page.getByRole('button',{name:'Menu'}).click();
  await english.click(); await expect(page).toHaveURL(/\/en$/); await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.getByRole('heading',{level:1})).toContainText('Life is an event'); await page.goto('/'); await expect(page).toHaveURL(/\/en$/);
  await context.close();
});

test('services and legacy URLs resolve without broken links',async({page})=>{await page.goto('/id/services');await expect(page.locator('.content-card')).toHaveCount(8);const links=await page.locator('a[href]').evaluateAll(nodes=>nodes.map(node=>(node as HTMLAnchorElement).href).filter(href=>href.startsWith(location.origin)));for(const href of [...new Set(links)].slice(0,20)){const response=await page.request.get(href);expect(response.status(),href).toBeLessThan(400)}const legacy=await page.request.get('/team-building.html',{maxRedirects:0});expect([307,308]).toContain(legacy.status())});

test('SEO declares canonical and language alternatives',async({page})=>{await page.goto('/en/news/your-kick-off-needs-a-story');await expect(page).toHaveTitle(/AIUEO/);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',/\/en\/news\/your-kick-off-needs-a-story$/);await expect(page.locator('link[hreflang="id-ID"]')).toHaveCount(1);await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1)});

test('contact form validates and preview mode responds',async({page})=>{await page.goto('/id/contact');await page.getByLabel('Nama').fill('A');await page.getByLabel('Email').fill('invalid');await page.getByLabel('Ceritakan kebutuhan acara').fill('pendek');await page.getByRole('button',{name:/Kirim brief/}).click();expect(await page.getByLabel('Nama').evaluate((el:HTMLInputElement)=>el.validity.valid)).toBe(false);await page.getByLabel('Nama').fill('Test User');await page.getByLabel('Email').fill('test@example.com');await page.getByLabel('Ceritakan kebutuhan acara').fill('Membutuhkan acara untuk 100 peserta.');await page.getByRole('button',{name:/Kirim brief/}).click();await expect(page.getByRole('status')).toContainText('Mode preview')});

test('admin has no public registration and reports its configured mode safely',async({page})=>{await page.goto('/admin/login');await expect(page.getByRole('heading',{name:'Masuk ke dashboard'})).toBeVisible();await expect(page.getByText('Tidak ada registrasi publik')).toBeVisible();if(process.env.ADMIN_DEMO_MODE==='true'){await expect(page.getByRole('button',{name:/Masuk sebagai Viewer/})).toBeEnabled()}else{await expect(page.getByRole('button',{name:/Masuk/})).toBeDisabled()}});

test('mobile menu is keyboard and touch accessible',async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto('/id');const menu=page.getByRole('button',{name:'Menu'});await expect(menu).toHaveAttribute('aria-expanded','false');await menu.click();await expect(menu).toHaveAttribute('aria-expanded','true');await expect(page.getByRole('navigation').getByRole('link',{name:'Layanan'})).toBeVisible()});

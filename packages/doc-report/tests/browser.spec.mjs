// The report as a reader meets it: a single file opened from disk, with
// JavaScript off and the network gone, in both languages, at three widths,
// in both themes, and on paper.
import { test, expect } from '@playwright/test';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderSample } from './fixtures/sample.mjs';

test.use({ javaScriptEnabled: false, offline: true });

const dir = mkdtempSync(join(tmpdir(), 'doc-report-browser-'));
const pages = [];
for (const language of ['en', 'ja']) for (const empty of [false, true]) {
  const file = join(dir, `${language}-${empty ? 'empty' : 'report'}.html`);
  writeFileSync(file, renderSample({ language, empty }));
  pages.push({ language, empty, file, url: pathToFileURL(file).href });
}

async function open(page, url) {
  const foreign = [];
  const errors = [];
  page.on('request', (r) => { if (!r.url().startsWith('file:')) foreign.push(r.url()); });
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(url);
  return { foreign, errors };
}

for (const p of pages) {
  test(`${p.language} ${p.empty ? 'empty' : 'report'}: opens offline from file:// without JavaScript, network or errors`, async ({ page }) => {
    const { foreign, errors } = await open(page, p.url);
    expect(foreign).toEqual([]);
    expect(errors).toEqual([]);
    await expect(page.locator('html')).toHaveAttribute('lang', p.language);
    await expect(page.locator('article.sheet')).toBeVisible();
    await expect(page.locator('script')).toHaveCount(0);
    await expect(page.locator('link')).toHaveCount(0);
    const styles = await page.locator('style').count();
    expect(styles).toBe(1);
    if (!p.empty) {
      await expect(page.locator('.hero .claim')).toHaveCount(2);
      await expect(page.locator('section.sec')).toHaveCount(7);
      const figureLabel = await page.locator('figure.plate-table > figcaption').evaluate((el) => getComputedStyle(el, '::before').content);
      expect(figureLabel).toContain(p.language === 'ja' ? '表' : 'Table');
    } else {
      await expect(page.locator('.empty')).toBeVisible();
    }
  });

  test(`${p.language} ${p.empty ? 'empty' : 'report'}: no horizontal overflow at wide, medium and narrow widths`, async ({ page }) => {
    await open(page, p.url);
    for (const width of [1440, 768, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      const m = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        clipped: [...document.querySelectorAll('.claim, .lead, .stand, h1, .caveat, .flow-name, td')].filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => el.className || el.tagName),
      }));
      expect(m.overflow, `${width}px: page width`).toBe(false);
      expect(m.clipped, `${width}px: clipped text`).toEqual([]);
    }
  });
}

test('dark and light themes render different backgrounds and readable ink', async ({ page }) => {
  await open(page, pages[0].url);
  const light = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.emulateMedia({ colorScheme: 'dark' });
  const dark = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(dark).not.toBe(light);
  const ink = await page.locator('.lead').first().evaluate((el) => getComputedStyle(el).color);
  expect(ink).not.toBe(dark);
});

test('print media keeps the whole page and drops nothing a reader needs', async ({ page }) => {
  await open(page, pages[0].url);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('article.sheet')).toBeVisible();
  await expect(page.locator('#sec-evidence')).toBeVisible();
  await expect(page.locator('#sec-provenance')).toBeVisible();
  const m = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth + 1, scheme: getComputedStyle(document.documentElement).colorScheme }));
  expect(m.overflow).toBe(false);
  expect(m.scheme).toBe('light');
});

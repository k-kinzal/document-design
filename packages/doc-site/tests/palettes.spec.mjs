import { test, expect } from '@playwright/test';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { releaseTag } from '../src/site.mjs';

test('palette cards, header, copied setup and downloads stay in sync across languages', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/start/');
  await expect(page.locator('[data-dd-palette-choice]')).toHaveCount(32);
  await expect(page.locator('.palette-sample')).toHaveCount(64);
  // A choice must expose the colors that coexist on a real page, including
  // warning and success. Accent-only previews concealed clashing state inks.
  for (const tone of ['blue', 'violet', 'teal', 'ok', 'warn', 'danger']) {
    await expect(page.locator(`.palette-sample .tone-${tone}`)).toHaveCount(64);
  }
  await page.locator('[data-dd-palette-choice="linen-teal"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-dd-palette', 'linen-teal');
  await expect(page.locator('[data-dd-palette-choice="linen-teal"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-dd-palette-select]')).toHaveValue('linen-teal');
  await expect(page.locator('#palette-css')).toContainText(`${releaseTag}/palettes/linen-teal.css`);
  await page.locator('[data-dd-copy="#palette-css"]').click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('/palettes/linen-teal.css');
  await page.locator('.topbar [data-dd-theme-toggle]').click();
  await page.locator('.topbar [data-dd-theme-toggle]').click();
  await page.getByRole('link', { name: '日本語', exact: true }).click();
  await expect(page.locator('[data-dd-palette-select]')).toHaveValue('linen-teal');
  await expect(page.locator('[data-dd-palette-choice="linen-teal"]')).toContainText('選択中');
  await page.locator('[data-dd-palette-select]').selectOption('sage-plum');
  const download = page.locator('a[data-dd-palette-url]:not([data-dd-palette-suffix])');
  const href = await download.evaluate(el => el.href);
  expect(href).toContain(`4174/${releaseTag}/palettes/sage-plum.css`);
  expect((await page.request.get(href)).ok()).toBe(true);
  await expect(page.locator('#starter')).toContainText('/palettes/sage-plum.css');
  const exampleURL = await page.locator('a[data-dd-palette-suffix]:not([download])').evaluate(el => el.href);
  expect(exampleURL).toContain('/ja/examples/report-sage-plum.html');
  const example = await page.request.get(exampleURL);
  expect(example.ok()).toBe(true);
  expect(await example.text()).toContain('--dd-accent');
  await expect(page.locator('#palette-css')).toContainText('/palettes/sage-plum.css');
  await page.goto('/');
  await expect(page.locator('[data-dd-palette-select]')).toHaveValue('sage-plum');
  await expect(page.locator('html')).toHaveAttribute('data-dd-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-dd-palette', 'sage-plum');
});

test('palette switching tolerates unavailable storage and supports keyboard input', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage unavailable'); } });
  });
  await page.goto('/start/');
  const button = page.locator('[data-dd-palette-choice="mist-violet"]');
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-dd-palette', 'mist-violet');
  await page.locator('[data-dd-palette-select]').selectOption('linen-cyan');
  await expect(page.locator('html')).toHaveAttribute('data-dd-palette', 'linen-cyan');
  await expect(button).toHaveAttribute('aria-pressed', 'false');
});

test('invalid saved palettes fall back to the original and every card fits a phone', async ({ page }, info) => {
  await page.addInitScript(() => localStorage.setItem('dd-palette', '../../invalid'));
  for (const lang of ['', 'ja/']) {
    await page.goto(`/${lang}start/`);
    await expect(page.locator('html')).toHaveAttribute('data-dd-palette', 'paper-blue');
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const overflow = await page.locator('.palette-pair, .palette-sample').evaluateAll(elements => elements.filter(el => el.scrollWidth > el.clientWidth + 1).length);
      expect(overflow, `${lang} at ${width}px`).toBe(0);
    }
    await page.locator('#palette-cards').scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath(`palettes-${lang ? 'ja' : 'en'}-mobile.png`) });
  }
});

test('palette downloads remain usable from disk without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(new URL('../dist/ja/start/index.html', import.meta.url).href);
  await expect(page.locator('.palette-sample')).toHaveCount(64);
  await expect(page.locator('[data-dd-palette-select]')).toBeHidden();
  const link = page.locator('a[download="linen-teal.css"]');
  const css = readFileSync(new URL(await link.evaluate(el => el.href)), 'utf8');
  // The generated complete example must render before release and without a
  // network, not silently fall back to a remotely published default palette.
  await context.route('https://**', route => route.abort());
  await page.goto(new URL('../dist/ja/examples/report-linen-teal.html', import.meta.url).href);
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(253, 252, 249)');
  await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(0);
  const folder = mkdtempSync(join(tmpdir(), 'doc-palette-'));
  try {
    writeFileSync(join(folder, 'palette.css'), css);
    writeFileSync(join(folder, 'document-design.css'), readFileSync(new URL(`../dist/${releaseTag}/document-design.css`, import.meta.url)));
    writeFileSync(join(folder, 'report.html'), '<!doctype html><html lang="en"><head><link rel="stylesheet" href="document-design.css"><link rel="stylesheet" href="palette.css"></head><body><article class="sheet"><h1>Offline report</h1><a href="#">An accent link</a></article></body></html>');
    await page.goto(pathToFileURL(join(folder, 'report.html')).href);
    for (const [mode, color] of [['light', 'rgb(4, 121, 116)'], ['dark', 'rgb(92, 193, 187)']]) {
      await page.emulateMedia({ colorScheme: mode });
      await expect(page.locator('a')).toHaveCSS('color', color);
    }
  } finally {
    await context.close();
    rmSync(folder, { recursive: true, force: true });
  }
});

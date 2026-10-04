import { test, expect } from '@playwright/test';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { palettes } from '../src/palettes.mjs';

const css = readFileSync(new URL('../dist/document-design.css', import.meta.url), 'utf8');
const bundle = readFileSync(new URL('../dist/document-design.palettes.css', import.meta.url), 'utf8');
const specimen = `<span id="accent" class="chip tone-accent">Accent</span><span id="danger" class="chip tone-danger">? Unresolved</span>`;

async function colors(page, selector = 'body') {
  return page.locator(selector).evaluate(el => {
    const sample = el.querySelector('#accent');
    const style = getComputedStyle(el), accent = getComputedStyle(sample), danger = getComputedStyle(el.querySelector('#danger'));
    return { bg: style.backgroundColor, fg: style.color, accent: accent.color, tint: accent.backgroundColor, danger: danger.color, dangerTint: danger.backgroundColor, scheme: style.colorScheme, mix: style.getPropertyValue('--dd-tint-mix').trim() };
  });
}

// Resolve the built CSS in the browser, including light-dark(), aliases and
// color-mix(). A canvas converts the resulting CSS colors to sRGB for WCAG.
async function contrastFailures(page) {
  return page.evaluate(() => {
    const probe = document.createElement('span');
    document.body.append(probe);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    function luminance(token) {
      probe.style.color = `var(--dd-${token})`;
      ctx.fillStyle = getComputedStyle(probe).color;
      ctx.fillRect(0, 0, 1, 1);
      const rgb = Array.from(ctx.getImageData(0, 0, 1, 1).data).slice(0, 3).map(v => {
        const c = v / 255;
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
    }
    const surfaces = ['bg', 'surface', 'sunken', 'raised', 'hover'];
    const hues = ['blue', 'violet', 'amber', 'teal', 'pink', 'indigo', 'slate', 'green', 'red', 'yellow', 'accent'];
    const failures = [];
    function check(text, surface) {
      const a = luminance(text), b = luminance(surface);
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      if (ratio < 4.5) failures.push({ text, surface, ratio });
    }
    for (const text of ['ink', 'sub', 'dim', ...hues]) for (const surface of surfaces) check(text, surface);
    for (const hue of hues) check(hue, hue + '-tint');
    probe.remove();
    return failures;
  });
}

for (const mode of ['light', 'dark']) {
  test(`all 32 built overlays match the attribute bundle in ${mode}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: mode });
    const distinct = new Set();
    let danger;
    for (const palette of palettes) {
      const overlay = readFileSync(new URL(`../dist/palettes/${palette.id}.min.css`, import.meta.url), 'utf8');
      await page.setContent(`<html><head><style>${css}\n${overlay}</style></head><body>${specimen}</body></html>`);
      const standalone = await colors(page);
      expect(standalone.mix).toBe(mode === 'light' ? '6%' : '12%');
      expect(await contrastFailures(page), palette.id).toEqual([]);
      distinct.add(standalone.bg + standalone.accent);
      danger ??= standalone.danger;
      expect(standalone.danger, palette.id).toBe(danger);
      await page.setContent(`<html data-dd-palette="${palette.id}"><head><style>${css}\n${bundle}</style></head><body>${specimen}</body></html>`);
      expect(await colors(page), palette.id).toEqual(standalone);
    }
    expect(distinct.size).toBe(32);
  });
}

test('nested palettes rebind roles, tints and neutral color boundaries', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.setContent(`<style>${css}\n${bundle}</style><main data-dd-palette="linen-teal">${specimen}
    <section data-dd-palette="mist-plum" data-dd-theme="light">${specimen}</section>
    <section data-dd-color="monochrome"><div data-dd-palette="sage-indigo">${specimen}</div></section>
  </main>`);
  expect((await colors(page, 'main')).mix).toBe('12%');
  expect((await colors(page, '[data-dd-theme="light"]')).mix).toBe('6%');
  expect((await colors(page, '[data-dd-palette="sage-indigo"]')).mix).toBe('12%');
  for (const mode of ['grayscale', 'monochrome']) {
    await page.setContent(`<html data-dd-color="${mode}" data-dd-palette="linen-plum"><style>${css}\n${bundle}</style><body>${specimen}</body></html>`);
    const neutral = await colors(page);
    expect(neutral.accent).toBe(neutral.fg);
    const overlay = readFileSync(new URL('../dist/palettes/linen-plum.css', import.meta.url), 'utf8');
    await page.evaluate(content => { const style = document.createElement('style'); style.textContent = content; document.head.append(style); }, overlay);
    expect(await colors(page)).toEqual(neutral);
  }
});

test('paired samples print in light mode and consumer overrides still win', async ({ page }) => {
  await page.setContent(`<html data-dd-palette="linen-teal" data-dd-theme="dark"><style>${css}\n${bundle}</style><body>${specimen}<section data-dd-palette="mist-plum" data-dd-theme="dark">${specimen}</section></body></html>`);
  await page.emulateMedia({ media: 'print' });
  expect((await colors(page)).scheme).toBe('light');
  expect((await colors(page, 'section')).scheme).toBe('light');
  await page.evaluate(() => { const style = document.createElement('style'); style.textContent = ':root { --dd-accent: #123456; }'; document.head.append(style); });
  expect((await colors(page)).accent).toBe('rgb(18, 52, 86)');
});

test('built overlays work with uncompiled source CSS in development', async ({ page }) => {
  const folder = mkdtempSync(join(tmpdir(), 'doc-palette-source-'));
  try {
    const source = new URL('../src/index.css', import.meta.url).href;
    const variations = new URL('../dist/document-design.palettes.css', import.meta.url).href;
    writeFileSync(join(folder, 'index.html'), `<!doctype html><html><head><link rel="stylesheet" href="${source}"><link rel="stylesheet" href="${variations}"></head><body>${specimen}</body></html>`);
    await page.goto(pathToFileURL(join(folder, 'index.html')).href);
    for (const mode of ['light', 'dark']) {
      await page.emulateMedia({ colorScheme: mode });
      for (const palette of palettes) {
        await page.evaluate(id => document.documentElement.setAttribute('data-dd-palette', id), palette.id);
        expect((await colors(page)).bg, `${palette.id} / ${mode}`).not.toBe('rgba(0, 0, 0, 0)');
        expect(await contrastFailures(page), `${palette.id} / ${mode}`).toEqual([]);
      }
    }
  } finally { rmSync(folder, { recursive: true, force: true }); }
});

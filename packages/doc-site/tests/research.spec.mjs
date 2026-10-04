// Exercise the public composition as a standalone, script-free document.
// The same static markup is rendered by the Storybook example.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { researchPaper } from '../../doc-ui/stories/research-paper.mjs';

const css = readFileSync(new URL('../../doc-ui/dist/document-design.css', import.meta.url), 'utf8');
const flat = text => text.normalize('NFKC').replace(/\s+/g, '').replace(/[‘’ʼ]/g, "'");

async function mount(page, { lang = 'en', color = 'grayscale', theme = 'light' } = {}) {
  await page.setContent(`<!doctype html><html lang="${lang}" data-dd-theme="${theme}"><head><meta charset="utf-8"><title>Research paper</title><style>${css}</style></head><body>${researchPaper({ lang, color })}</body></html>`);
}

for (const lang of ['en', 'ja']) {
  test(`research paper retains readable math and marks at narrow widths: ${lang}`, async ({ page }) => {
    await mount(page, { lang });
    for (const width of [1100, 768, 375, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const metrics = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        bodySize: getComputedStyle(document.querySelector('.prose')).fontSize,
        drawScale: document.querySelector('.draw').getBoundingClientRect().width / 576,
        math: [...document.querySelectorAll('.eq-body')].map(el => {
          const math = el.querySelector('math');
          const number = el.nextElementSibling;
          return { height: math.getBoundingClientRect().height, size: getComputedStyle(math).fontSize,
            numberRight: number.getBoundingClientRect().right, scrollable: el.scrollWidth > el.clientWidth,
            focusable: el.tabIndex === 0 };
        }),
        links: [...document.querySelectorAll('a[href^="#"]')].every(a => document.getElementById(a.hash.slice(1))),
        proseFeatures: getComputedStyle(document.querySelector('.prose p')).fontFeatureSettings,
        fractionSize: getComputedStyle(document.querySelector('mtable mfrac > :first-child')).fontSize,
        dash: getComputedStyle(document.querySelector('.plot-line-alt')).strokeDasharray,
        markerFill: getComputedStyle(document.querySelector('.plot-point-alt')).fill,
        background: getComputedStyle(document.querySelector('.sheet-paper')).backgroundColor,
      }));
      expect(metrics.overflow).toBeLessThanOrEqual(1);
      expect(metrics.bodySize).toBe('16px');
      expect(metrics.drawScale).toBe(1);
      expect(metrics.links).toBe(true);
      expect(metrics.proseFeatures).toBe('normal');
      expect(metrics.fractionSize).toBe('16px');
      expect(metrics.dash).not.toBe('none');
      expect(metrics.markerFill).toBe(metrics.background);
      for (const math of metrics.math) {
        expect(math.height).toBeGreaterThan(15);
        expect(math.size).toBe('16px');
        expect(math.numberRight).toBeLessThanOrEqual(width);
        expect(math.focusable).toBe(true);
      }
      if (width === 320) expect(metrics.math.some(m => m.scrollable)).toBe(true);
    }
  });
}

for (const color of ['grayscale', 'monochrome']) for (const theme of ['light', 'dark']) {
  test(`${color} resolves text, surfaces and SVG to neutral inks in ${theme}`, async ({ page }) => {
    await mount(page, { color, theme });
    const values = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const rgb = value => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = value; ctx.fillRect(0, 0, 1, 1); return [...ctx.getImageData(0, 0, 1, 1).data]; };
      return [...document.querySelectorAll('.sheet-paper, .sheet-paper *')].flatMap(el => {
        const style = getComputedStyle(el);
        return ['color', 'backgroundColor', 'borderTopColor', ...(el instanceof SVGElement ? ['fill', 'stroke'] : [])]
          .filter(key => !['none', 'transparent'].includes(style[key])).map(key => ({ key, rgb: rgb(style[key]) }));
      }).filter(({ rgb }) => rgb[3] > 0);
    });
    for (const { key, rgb } of values) {
      expect(Math.max(...rgb.slice(0, 3)) - Math.min(...rgb.slice(0, 3)), key).toBeLessThanOrEqual(1);
      if (color === 'monochrome') expect([0, 255], key).toContain(rgb[0]);
    }
    const bg = await page.locator('.sheet-paper').evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).toBe(theme === 'light' ? 'rgb(255, 255, 255)' : color === 'grayscale' ? 'rgb(32, 32, 32)' : 'rgb(0, 0, 0)');
    await page.emulateMedia({ media: 'print' });
    expect(await page.locator('.sheet-paper').evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(255, 255, 255)');
  });
}

for (const lang of ['en', 'ja']) test(`research paper paginates with complete equations, figure and sources: ${lang}`, async ({ page }, info) => {
  await mount(page, { lang, theme: 'dark' });
  const paragraphs = await page.locator('.prose > p').allTextContents();
  const introductions = await page.locator('p:has(+ .equation)').allTextContents();
  const pdf = await page.pdf({ path: info.outputPath(`research-${lang}.pdf`), preferCSSPageSize: true, printBackground: false });
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const loading = getDocument({ data: new Uint8Array(pdf), useSystemFonts: true });
  const doc = await loading.promise;
  const pages = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const sheet = await doc.getPage(n);
    expect(Math.round(sheet.view[2])).toBe(595);
    expect(Math.round(sheet.view[3])).toBe(842);
    const { items } = await sheet.getTextContent();
    const text = flat(items.map(i => i.str).join(''));
    expect(text).toContain(`${n}/${doc.numPages}`);
    pages.push(text);
  }
  expect(pages.length).toBeGreaterThan(2);
  const all = pages.join('');
  // Japanese PDF cmaps can return compatibility radicals; use short segments
  // and require most of each paragraph, rather than accepting just its title.
  for (const p of paragraphs) {
    const normalized = flat(p);
    const parts = normalized.match(/.{1,8}/gu);
    expect(parts.filter(part => all.includes(part)).length / parts.length, p.slice(0, 50)).toBeGreaterThan(0.85);
  }
  for (const number of [1, 2, 3, 4]) expect(pages.some(text => text.includes(`(${number})`))).toBe(true);
  introductions.forEach((text, i) => {
    const normalized = flat(text);
    expect(pages.some(p => p.includes(normalized.slice(0, 15)) && p.includes(normalized.slice(-15)) && p.includes(`(${i + 1})`)), 'equation stays with its complete introduction').toBe(true);
  });
  expect(pages.some(text => text.includes('0.469') && text.includes('0.360') && text.includes('0.811'))).toBe(true);
  expect(all).toContain('https://web.mit.edu/6.976/www/handout/shannon.pdf');
  expect(pages.at(-1)).toContain('Shannon');
  const figureLabel = lang === 'ja' ? '図1' : 'Figure1.';
  expect(pages.some(text => text.includes(figureLabel) && text.includes('H[bit],V[1]'))).toBe(true);
  await loading.destroy();
});

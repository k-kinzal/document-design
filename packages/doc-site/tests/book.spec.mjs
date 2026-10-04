// The Storybook book, exercised as portable HTML without reading-time scripts.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { book, bookImages } from '../../doc-ui/stories/book.mjs';

const css = readFileSync(new URL('../../doc-ui/dist/document-design.css', import.meta.url), 'utf8');
const images = Object.fromEntries(Object.entries(bookImages).map(([key, url]) => [key, `data:image/png;base64,${readFileSync(new URL(url)).toString('base64')}`]));
const flat = text => text.normalize('NFKC').replace(/\s+/g, '').replace(/[‘’ʼ]/g, "'");

async function mount(page, { lang = 'en', mode = 'mixed', theme = 'light', paper = 'a4' } = {}) {
  await page.setContent(`<!doctype html><html lang="${lang}" data-dd-theme="${theme}"><head><meta charset="utf-8"><title>Book</title><style>${css}</style></head><body>${book({ lang, mode, images }).replace('data-dd-paper="a4"', `data-dd-paper="${paper}"`)}</body></html>`);
  await page.locator('img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
}

for (const lang of ['en', 'ja']) test(`book keeps readable text, media and references at narrow widths: ${lang}`, async ({ page }) => {
  await mount(page, { lang });
  for (const width of [1100, 768, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      size: getComputedStyle(document.querySelector('.prose')).fontSize,
      features: getComputedStyle(document.querySelector('.prose p')).fontFeatureSettings,
      links: [...document.querySelectorAll('a[href^="#"]')].every(a => document.getElementById(a.hash.slice(1))),
      images: [...document.images].every(img => img.complete && img.naturalWidth === 1152 && img.getBoundingClientRect().right <= innerWidth),
      scale: document.querySelector('.draw').getBoundingClientRect().width / 576,
      eqs: [...document.querySelectorAll('.equation')].every(el => el.getBoundingClientRect().right <= innerWidth && getComputedStyle(el.querySelector('math')).fontSize === '16px'),
    }));
    expect(metrics).toMatchObject({ size: '16px', features: 'normal', links: true, images: true, scale: 1, eqs: true });
    expect(metrics.overflow).toBeLessThanOrEqual(1);
  }
});

for (const theme of ['light', 'dark']) test(`book page colours reset inside a monochrome parent: ${theme}`, async ({ page }) => {
  await mount(page, { theme });
  const colors = await page.locator('.book-page').evaluateAll(els => els.map(el => {
    const style = getComputedStyle(el);
    return { mode: el.dataset.ddColor, link: style.getPropertyValue('--dd-link').trim(), filter: el.querySelector('img') ? getComputedStyle(el.querySelector('img')).filter : null,
      background: style.backgroundColor, container: style.containerType };
  }));
  expect(colors.map(c => c.mode)).toEqual(['color', 'monochrome', 'monochrome', 'color', 'grayscale', 'monochrome', 'monochrome']);
  expect(colors[0].link).not.toBe(colors[1].link);
  expect(colors[3].link).toBe(colors[0].link);
  expect(colors[0].filter).toBe('none');
  expect(colors[4].filter).toBe('grayscale(1)');
  expect(colors[5].filter).toBe('grayscale(1)');
  expect(colors.every(c => c.container === 'normal'), 'page boundaries must not reset figure counter scopes').toBe(true);
  await page.emulateMedia({ media: 'print' });
  expect(await page.locator('.book-page[data-dd-color="monochrome"]').first().evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(255, 255, 255)');
});

for (const lang of ['en', 'ja']) for (const paper of ['a4', 'letter']) test(`book paginates its divisions and preserves content: ${lang}, ${paper}`, async ({ page }, info) => {
  await mount(page, { lang, paper, theme: 'dark' });
  const expected = await page.locator('.book-page').evaluateAll(els => els.map(el => ({
    title: el.querySelector('h1, h2').textContent,
    mode: el.dataset.ddColor,
    paragraphs: [...el.querySelectorAll('.prose p')].map(p => p.textContent),
  })));
  const pdf = await page.pdf({ path: info.outputPath(`book-${lang}-${paper}.pdf`), preferCSSPageSize: true, printBackground: false });
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const loading = getDocument({ data: new Uint8Array(pdf), useSystemFonts: true });
  const doc = await loading.promise;
  const pages = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const sheet = await doc.getPage(n);
    expect(Math.round(sheet.view[2])).toBe(paper === 'a4' ? 595 : 612);
    expect(Math.round(sheet.view[3])).toBe(paper === 'a4' ? 842 : 792);
    const { items } = await sheet.getTextContent();
    const content = items.filter(i => i.str.trim());
    const footer = content.find(i => flat(i.str) === `${n}/${doc.numPages}`);
    expect(footer, `folio ${n}`).toBeTruthy();
    if (n % 2) expect(footer.transform[4]).toBeGreaterThan(sheet.view[2] / 2);
    else expect(footer.transform[4]).toBeLessThan(sheet.view[2] / 2);
    // Inspect the rendered PDF, including raster plates: a neutral CSS token
    // alone does not prove that image pixels lost their colour on paper.
    const viewport = sheet.getViewport({ scale: 0.5 });
    const canvas = doc.canvasFactory.create(viewport.width, viewport.height);
    await sheet.render({ canvasContext: canvas.context, viewport }).promise;
    const pixels = canvas.context.getImageData(0, 0, canvas.canvas.width, canvas.canvas.height).data;
    let chromatic = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      const rgb = pixels.subarray(i, i + 3);
      if (Math.max(...rgb) - Math.min(...rgb) > 8) chromatic++;
    }
    doc.canvasFactory.destroy(canvas);
    pages.push({ text: flat(content.map(i => i.str).join('')), items: content.filter(i => i !== footer), chromatic });
  }
  expect(pages.length).toBeGreaterThanOrEqual(expected.length);
  expect(pages.every(p => p.items.length > 2), 'no blank or footer-only pages').toBe(true);
  const all = pages.map(p => p.text).join('');
  let previous = -1;
  const starts = [];
  for (const division of expected) {
    const title = flat(division.title);
    // Ignore TOC mentions: the actual heading begins near the top of a page.
    const index = pages.findIndex((p, i) => i > previous && flat(p.items.filter(item => item.transform[5] > (paper === 'a4' ? 680 : 630)).map(item => item.str).join('')).includes(title));
    expect(index, `division starts on a new sheet: ${title}`).toBeGreaterThan(previous);
    previous = index;
    starts.push({ index, mode: division.mode });
    for (const text of division.paragraphs) {
      const parts = flat(text).match(/.{1,8}/gu);
      expect(parts.filter(part => all.includes(part)).length / parts.length, text.slice(0, 60)).toBeGreaterThan(0.85);
    }
  }
  for (const [i, start] of starts.entries()) {
    for (const sheet of pages.slice(start.index, starts[i + 1]?.index ?? pages.length)) {
      if (start.mode === 'color') expect(sheet.chromatic, 'the colour plate retains chroma in PDF').toBeGreaterThan(100);
      else expect(sheet.chromatic, 'neutral pages have no coloured text, marks or pixels').toBe(0);
    }
  }
  for (let n = 1; n <= 4; n++) expect(all).toContain(lang === 'ja' ? `図${n}` : `Figure${n}.`);
  for (let n = 1; n <= 3; n++) expect(all).toContain(`(${n})`);
  expect(all).toContain('0.469');
  expect(all).toContain('https://web.mit.edu/6.976/www/handout/shannon.pdf');
  expect(pages.at(-1).text).toContain('doc-ui');
  await loading.destroy();
});

test('a long authored page continues without clipping or mixing the following colour division', async ({ page }) => {
  await mount(page);
  await page.locator('.book-page').nth(2).locator('.prose').evaluate(el => {
    const sample = el.querySelector('p').textContent;
    for (let n = 0; n < 24; n++) { const p = document.createElement('p'); p.textContent = `Continuation ${n + 1}. ${sample}`; el.append(p); }
  });
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const loading = getDocument({ data: new Uint8Array(await page.pdf({ preferCSSPageSize: true })), useSystemFonts: true });
  const doc = await loading.promise;
  const pages = [];
  for (let n = 1; n <= doc.numPages; n++) pages.push(flat((await (await doc.getPage(n)).getTextContent()).items.map(i => i.str).join('')));
  for (let n = 1; n <= 24; n++) expect(pages.join('')).toContain(`Continuation${n}.`);
  const last = pages.findIndex(text => text.includes('Continuation24.'));
  expect(last).toBeGreaterThan(4);
  expect(pages[last + 1]).toContain('Afieldofprobabilities');
  expect(pages[last + 1]).not.toContain('Continuation');
  await loading.destroy();
});

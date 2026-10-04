import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { bookDocument, compileBook } from '../stories/book-proof.mjs';
import { bookGeometry, bookPageCSS, bookVariables } from '../src/book.mjs';

const css = readFileSync(new URL('../dist/document-design.css', import.meta.url), 'utf8');
// A Japanese font's PDF reverse cmap maps 黒 to the compatibility radical 黑.
const flat = text => text.normalize('NFKC').replace(/黑/g, '黒').replace(/\s+/g, '').replace(/[‘’ʼ]/g, "'");
const pt = mm => mm * 72 / 25.4;

for (const lang of ['en', 'ja']) test(`book manuscript reflows without shrinking text or drawings: ${lang}`, async ({ page }) => {
  await page.setContent(bookDocument(css, { lang }));
  for (const width of [1100, 768, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      size: getComputedStyle(document.querySelector('.prose')).fontSize,
      leading: parseFloat(getComputedStyle(document.querySelector('.prose')).lineHeight),
      features: getComputedStyle(document.querySelector('.prose p')).fontFeatureSettings,
      links: [...document.querySelectorAll('a[href^="#"]')].every(a => document.getElementById(a.hash.slice(1))),
      scale: document.querySelector('.draw').getBoundingClientRect().width / Number(document.querySelector('.draw').getAttribute('viewBox').split(' ')[2]),
      images: [...document.images].every(img => img.complete && img.naturalWidth === 1152 && img.getBoundingClientRect().right <= innerWidth),
      eqs: [...document.querySelectorAll('.equation')].every(el => el.getBoundingClientRect().right <= innerWidth && getComputedStyle(el.querySelector('math')).fontSize === '16px'),
    }));
    expect(metrics).toMatchObject({ size: '16px', features: 'normal', links: true, scale: 1, images: true, eqs: true });
    expect(metrics.leading).toBeCloseTo(7 * 96 / 25.4, 2);
    expect(metrics.overflow).toBeLessThanOrEqual(1);
  }
});

for (const theme of ['light', 'dark']) test(`book page colours reset inside a monochrome parent: ${theme}`, async ({ page }) => {
  await page.setContent(bookDocument(css).replace('data-dd-theme="light"', `data-dd-theme="${theme}"`));
  const colors = await page.locator('.book-page').evaluateAll(els => els.map(el => {
    const style = getComputedStyle(el);
    return { mode: el.dataset.ddColor, link: style.getPropertyValue('--dd-link').trim(),
      filter: el.querySelector('img') ? getComputedStyle(el.querySelector('img')).filter : null,
      container: style.containerType };
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

for (const [lang, format] of [['en', 'a5'], ['ja', 'a5'], ['en', 'a4'], ['ja', 'b6-jis'], ['en', 'letter']]) {
  test(`book trim, type area, furniture and recto starts survive pagination: ${lang}, ${format}`, async ({ page }, info) => {
    test.setTimeout(60000);
    const result = await compileBook(page, css, { lang, format });
    await info.attach('book.pdf', { body: result.pdf, contentType: 'application/pdf' });
    const { geometry: g, title, contents, chapters } = result.settings;
    const paragraphs = await page.locator('.prose p').allTextContents();
    const loading = getDocument({ data: new Uint8Array(result.pdf), useSystemFonts: true });
    const doc = await loading.promise;
    const allText = [], bodyText = [];
    const blankPages = [];
    for (let n = 1; n <= doc.numPages; n++) {
      const sheet = await doc.getPage(n);
      const [,, width, height] = sheet.view;
      expect(width).toBeCloseTo(pt(g.width), 0);
      expect(height).toBeCloseTo(pt(g.height), 0);
      const content = (await sheet.getTextContent()).items.filter(item => item.str.trim());
      const text = flat(content.map(item => item.str).join(''));
      allText.push(text);
      if (!content.length) {
        blankPages.push(n);
        expect(n % 2, 'only a verso may be intentionally blank').toBe(0);
        expect(Object.values(result.folios), 'a blank is followed by a chapter opening').toContain(n + 1);
        continue;
      }
      const top = pt(g.head), bottom = height - pt(g.foot);
      const head = content.filter(item => height - item.transform[5] < top);
      const foot = content.filter(item => height - item.transform[5] > bottom);
      const body = content.filter(item => !head.includes(item) && !foot.includes(item));
      bodyText.push(flat(body.map(item => item.str).join('')));
      if (n === 1) {
        expect(head, 'title page has no running head').toHaveLength(0);
        expect(foot, 'title page has no visible folio').toHaveLength(0);
      } else {
        const chapter = Object.entries(result.folios).filter(([, start]) => start <= n).at(-1)?.[0];
        const running = n % 2 ? chapter ? chapters[Number(chapter) - 1] : contents : title;
        expect(flat(head.map(item => item.str).join('')), 'running head comes from the current chapter or book').toBe(flat(running));
        expect(flat(foot.map(item => item.str).join('')), 'outer folio counts physical pages').toBe(String(n));
        const folio = foot[0];
        if (n % 2) expect(Math.abs(folio.transform[4] + folio.width - (width - pt(g.fore)))).toBeLessThan(1);
        else expect(Math.abs(folio.transform[4] - pt(g.fore))).toBeLessThan(1);
        expect(Math.max(...head.map(item => height - item.transform[5]))).toBeLessThan(top - pt(g.headGap) + 1);
        expect(height - folio.transform[5] - folio.height).toBeGreaterThan(bottom + pt(g.folioGap) - 2);
      }
      const left = pt(n % 2 ? g.gutter : g.fore), right = width - pt(n % 2 ? g.fore : g.gutter);
      for (const item of body) {
        // With palt, a Japanese heading's PDF glyph origin includes an empty
        // side bearing outside the visible ink (measured at 1.19 pt in JIS B6).
        const bearing = item.height >= 16 ? 2 : 1;
        expect(item.transform[4], `inside the left type edge: ${item.str}`).toBeGreaterThanOrEqual(left - bearing);
        expect(item.transform[4] + item.width, `inside the right type edge: ${item.str}`).toBeLessThanOrEqual(right + 1);
        expect(height - item.transform[5], `inside the foot edge: ${item.str}`).toBeLessThanOrEqual(bottom + 1);
      }
      const chapter = Number(Object.entries(result.folios).filter(([, start]) => start <= n).at(-1)?.[0] ?? 0);
      const colored = n === 1 || chapter === 2;
      const viewport = sheet.getViewport({ scale: 0.5 });
      const canvas = doc.canvasFactory.create(viewport.width, viewport.height);
      await sheet.render({ canvasContext: canvas.context, viewport }).promise;
      const pixels = canvas.context.getImageData(0, 0, canvas.canvas.width, canvas.canvas.height).data;
      let chromatic = 0;
      for (let i = 0; i < pixels.length; i += 4) if (Math.max(...pixels.subarray(i, i + 3)) - Math.min(...pixels.subarray(i, i + 3)) > 8) chromatic++;
      doc.canvasFactory.destroy(canvas);
      if (!colored) expect(chromatic, 'neutral text, drawings and raster plates have no chroma').toBe(0);
      if (n === 1) expect(chromatic, 'the title plate retains colour').toBeGreaterThan(100);
    }
    expect(blankPages.length).toBe(result.blankBefore.length);
    for (const [chapter, folio] of Object.entries(result.folios)) {
      expect(folio % 2, `chapter ${chapter} starts on a recto`).toBe(1);
      expect(allText[folio - 1]).toContain(flat(chapters[Number(chapter) - 1]));
      expect(await page.locator('.book-toc li').nth(Number(chapter) - 1).locator('span').textContent()).toBe(String(folio));
    }
    const all = bodyText.join('');
    for (const text of paragraphs) {
      const parts = flat(text).match(/.{1,8}/gu);
      expect(parts.filter(part => all.includes(part)).length / parts.length, text.slice(0, 50)).toBeGreaterThan(0.85);
    }
    for (let n = 1; n <= 4; n++) expect(all).toContain(lang === 'ja' ? `図${n}` : `Figure${n}.`);
    for (let n = 1; n <= 3; n++) expect(all).toContain(`(${n})`);
    expect(all).toContain('0.469');
    expect(all).toContain('https://web.mit.edu/6.976/www/handout/shannon.pdf');
    expect(allText.at(-1)).toContain('doc-ui');
    await loading.destroy();
  });
}

test('custom geometry applies to every continuation page without clipping the long manuscript', async ({ page }) => {
  const g = bookGeometry('a5', { head: 22, foot: 30, gutter: 27, fore: 13, leading: 6.5 });
  const paragraphs = Array.from({ length: 40 }, (_, i) => `<p>Paragraph ${i + 1}. A long chapter continues through the same type area. The running head and outer folio belong in its margins, away from the body text.</p>`).join('');
  await page.setContent(`<!doctype html><html><head><style>${css}${bookPageCSS('custom-chapter', { geometry: g, title: 'Book title', chapter: 'Long chapter' })}</style></head><body><article class="sheet sheet-paper sheet-book" data-dd-book="a5" style="${bookVariables(g)}"><section class="book-page" style="--dd-book-page: custom-chapter"><div class="prose">${paragraphs}</div></section></article></body></html>`);
  const loading = getDocument({ data: new Uint8Array(await page.pdf({ preferCSSPageSize: true })), useSystemFonts: true });
  const doc = await loading.promise;
  expect(doc.numPages).toBeGreaterThan(4);
  let all = '';
  for (let n = 1; n <= doc.numPages; n++) {
    const sheet = await doc.getPage(n);
    const items = (await sheet.getTextContent()).items.filter(i => i.str.trim());
    const text = flat(items.map(i => i.str).join(''));
    all += text;
    expect(text).toContain(n % 2 ? 'Longchapter' : 'Booktitle');
    const body = items.filter(i => sheet.view[3] - i.transform[5] >= pt(g.head) && sheet.view[3] - i.transform[5] <= sheet.view[3] - pt(g.foot));
    expect(Math.min(...body.map(i => i.transform[4]))).toBeGreaterThanOrEqual(pt(n % 2 ? g.gutter : g.fore) - 1);
    expect(Math.max(...body.map(i => i.transform[4] + i.width))).toBeLessThanOrEqual(sheet.view[2] - pt(n % 2 ? g.fore : g.gutter) + 1);
  }
  for (let n = 1; n <= 40; n++) expect(all).toContain(`Paragraph${n}.`);
  await loading.destroy();
});

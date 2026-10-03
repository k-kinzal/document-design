// The paper and product page, paginated for real.
//
// The report tests check placement under print media, but print media is
// not pagination: `break-after: avoid-page` does nothing until a page ends,
// and the one way to know a heading was left alone at the foot of a page is
// to make the pages and look. So the long example is printed to PDF with the
// browser's own engine and the PDF is read back: page count, page numbers,
// every heading with something under it, every entry and every source
// present, and the last paragraph on the last page.
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { locales, localePath } from '../src/i18n.mjs';
import { paperExpectations } from '../src/paper.mjs';
import { cssURL } from '../src/site.mjs';

const stylesheet = fileURLToPath(import.meta.resolve('@k-kinzal/doc-ui'));

// Chromium's text layer splits Japanese into runs; letter-spaced labels come
// back with a space between every letter, and a typographic apostrophe as a
// modifier letter. Compare shapes, not bytes.
const flat = (s) => s.normalize('NFKC').replace(/[‘’ʼ]/g, "'").replace(/\s+/g, '');

// The font's reverse cmap also hands back a few ideographs as radical code
// points — 西 as ⻄, 長 as ⻑ — which no normalisation folds. A passage is
// present when nearly all of its six-character pieces are, in order; a
// passage cut by the page loses half of them. Returns the span found.
function locate(text, needle) {
  const direct = text.indexOf(needle);
  if (direct >= 0) return [direct, direct + needle.length];
  const pieces = [];
  for (let i = 0; i < needle.length; i += 6) pieces.push(needle.slice(i, i + 6));
  const hits = pieces.map((p) => text.indexOf(p)).filter((at, i, all) => at >= 0 && (i === 0 || at >= all[i - 1]));
  if (hits.length < pieces.length * 0.8) return null;
  return [hits[0], hits.at(-1) + 6];
}

async function pages(pdf) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({ data: new Uint8Array(pdf), useSystemFonts: true }).promise;
  const out = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const { width, height } = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    // Lines: text items grouped by baseline, top to bottom, with y measured from the top.
    const lines = new Map();
    for (const item of content.items) {
      if (!item.str.trim()) continue;
      const y = Math.round(height - item.transform[5]);
      lines.set(y, (lines.get(y) ?? '') + item.str);
    }
    const items = content.items.filter(item => item.str?.trim()).map(item => ({
      text: flat(item.str), top: height - item.transform[5] - item.height,
      bottom: height - item.transform[5],
    }));
    out.push({ width, height, items, lines: [...lines].sort((a, b) => a[0] - b[0]).map(([y, text]) => ({ y, text: flat(text) })) });
  }
  return out;
}

for (const lang of locales) test(`the long paper paginates without losing headings, entries or sources: ${lang}`, async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'PDF generation is Chromium only');
  // The example pins the released stylesheet; serve the build under test in its place.
  await page.route(cssURL, (route) => route.fulfill({ path: stylesheet, contentType: 'text/css' }));
  await page.goto('/' + localePath('examples/paper.html', lang));
  expect(await page.evaluate(() => document.documentElement.dataset.ddPaper)).toBe('a4');
  const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: false });
  const sheets = await pages(pdf);
  const expected = paperExpectations(lang);

  // A4, and more than one of them.
  expect(sheets.length).toBeGreaterThanOrEqual(4);
  for (const sheet of sheets) {
    expect(Math.round(sheet.width)).toBe(595);
    expect(Math.round(sheet.height)).toBe(842);
  }

  // Every page carries its number in the bottom margin.
  sheets.forEach((sheet, i) => {
    const footer = sheet.lines.at(-1);
    expect(footer.text, `page ${i + 1} footer`).toBe(flat(`${i + 1} / ${sheets.length}`));
    expect(footer.y).toBeGreaterThan(sheet.height - 60);
  });

  const text = sheets.map((s) => s.lines.map((l) => l.text).join('')).join('');
  for (const entry of expected.entries) expect(locate(text, flat(entry)), `entry present: ${entry.slice(0, 40)}`).toBeTruthy();
  for (const source of expected.sources) expect(locate(text, flat(source)), `source present: ${source}`).toBeTruthy();
  for (const url of expected.urls) expect(text, url).toContain(flat(url));
  expect(locate(sheets.at(-1).lines.map((l) => l.text).join(''), flat(expected.last)), 'last paragraph on the last page').toBeTruthy();

  // No heading ends on the last line of content on its page: what it
  // introduces follows it before the footer. A balanced lead wraps, so the
  // heading is located in the page's text and mapped back to its last line.
  for (const heading of expected.headings) {
    const needle = flat(heading);
    let hit = null;
    for (const [i, sheet] of sheets.entries()) {
      const content = sheet.lines.slice(0, -1);
      const span = locate(content.map((l) => l.text).join(''), needle);
      if (!span) continue;
      let offset = 0, last = 0;
      for (const [j, line] of content.entries()) { offset += line.text.length; if (offset >= span[1]) { last = j; break; } }
      hit = { page: i + 1, below: content.length - 1 - last };
      break;
    }
    expect(hit, `heading present: ${heading}`).toBeTruthy();
    expect(hit.below, `heading not alone at the foot of page ${hit.page}: ${heading}`).toBeGreaterThan(0);
  }

  // Citations resolve to the numbered entries in the sources list.
  const dangling = await page.evaluate(() => [...document.querySelectorAll('.cite')].filter((a) => !document.querySelector(a.getAttribute('href'))).map((a) => a.getAttribute('href')));
  expect(dangling).toEqual([]);
});

for (const lang of locales) for (const format of ['A4', 'Letter']) {
  test(`the product page keeps its figure, headings and footer together: ${lang}, ${format}`, async ({ page, browserName }, info) => {
    test.skip(browserName !== 'chromium', 'PDF generation is Chromium only');
    await page.goto('/' + localePath('', lang));
    const expected = await page.evaluate(() => {
      const texts = selector => [...document.querySelectorAll(selector)].map(el => el.textContent.trim());
      return {
        figure: texts('#reading-paths :is(h3, .flow-name, .flow-detail, figcaption p)'),
        headings: texts('main :is(h2, h3, summary)'),
        paragraphs: texts('main p:not(.eyebrow, .label)'),
        rows: texts('#components tbody tr'),
        lastNote: document.querySelector('#building .sidenote').textContent.trim(),
      };
    });
    const sheets = await pages(await page.pdf({ path: info.outputPath('product.pdf'), format, printBackground: false }));
    const texts = sheets.map(sheet => sheet.lines.map(line => line.text).join(''));

    // The complete opening figure fits with its introduction, instead of
    // leaving more than half of the first sheet empty.
    for (const passage of expected.figure) {
      expect.soft(locate(texts[0], flat(passage)), `figure on the opening page: ${passage}`).toBeTruthy();
    }
    for (const passage of expected.paragraphs) {
      expect.soft(locate(texts.join(''), flat(passage)), `paragraph present: ${passage}`).toBeTruthy();
    }
    for (const row of expected.rows) {
      expect.soft(sheets.some(sheet => locate(sheet.items.map(item => item.text).join(''), flat(row))), `component group stays on one page: ${row}`).toBe(true);
    }

    for (const heading of expected.headings) {
      const index = texts.findIndex(text => locate(text, flat(heading)));
      expect.soft(index, `heading present: ${heading}`).toBeGreaterThanOrEqual(0);
      if (index < 0) continue;
      const span = locate(texts[index], flat(heading));
      const lines = sheets[index].lines;
      expect.soft(span[1], `heading has content below it: ${heading}`).toBeLessThanOrEqual(texts[index].length - lines.at(-1).text.length);
    }
    for (const sheet of sheets) {
      expect.soft(sheet.lines.at(-1).text, 'code header stays with the source').not.toBe('HTML');
    }

    // The last note must precede the footer on the same sheet. Continuous
    // print-media coordinates missed the grid's overlap after pagination.
    const last = sheets.at(-1);
    expect.soft(locate(texts.at(-1), flat(expected.lastNote)), 'no page containing only the footer').toBeTruthy();
    const footer = last.items.find(item => item.text === 'doc-ui');
    expect(footer, 'footer present').toBeTruthy();
    expect.soft(footer.top, 'footer clears every line of content').toBeGreaterThan(Math.max(...last.items.filter(item => item !== footer).map(item => item.bottom)) + 8);
  });
}

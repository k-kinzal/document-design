import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { researchPaper } from '../stories/research-paper.mjs';

const css = readFileSync(new URL('../dist/document-design.css', import.meta.url), 'utf8');
// Japanese PDF reverse cmaps can use compatibility radicals.
const flat = text => text.normalize('NFKC').replace(/黑/g, '黒').replace(/\s+/g, '').replace(/[‘’ʼ]/g, "'");
const markup = (lang, paper = 'a4') => `<!doctype html><html lang="${lang}" data-dd-theme="dark"><meta charset="utf-8"><style>${css}</style>${researchPaper({ lang, columns: true }).replace('data-dd-paper="a4"', `data-dd-paper="${paper}"`)}</html>`;

for (const lang of ['en', 'ja']) {
  test(`research columns respond to their container without shrinking type: ${lang}`, async ({ page }) => {
    await page.setContent(markup(lang));
    for (const width of [1100, 768, 375, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      const m = await page.evaluate(() => {
        const flow = document.querySelector('.paper-columns');
        const frame = flow.getBoundingClientRect();
        const intro = flow.querySelector('p').getBoundingClientRect();
        const figure = document.querySelector('.plate-full').getBoundingClientRect();
        return {
          pageOverflow: document.documentElement.scrollWidth - innerWidth,
          columnWidth: intro.width, flowWidth: frame.width, figureWidth: figure.width,
          text: getComputedStyle(flow.querySelector('p')).fontSize,
          features: getComputedStyle(flow.querySelector('p')).fontFeatureSettings,
          equations: [...document.querySelectorAll('.eq-body')].map(el => ({
            overflow: el.scrollWidth - el.clientWidth,
            size: getComputedStyle(el.querySelector('math')).fontSize,
            right: el.parentElement.getBoundingClientRect().right,
          })),
          tableOverflow: document.querySelector('.table-wrap').scrollWidth - document.querySelector('.table-wrap').clientWidth,
          scale: document.querySelector('.draw').getBoundingClientRect().width / 576,
          links: [...document.querySelectorAll('a[href^="#"]')].every(a => document.getElementById(a.hash.slice(1))),
        };
      });
      expect(m.pageOverflow).toBeLessThanOrEqual(1);
      expect(m.text).toBe('16px');
      expect(m.features).toBe('normal');
      expect(m.figureWidth).toBeCloseTo(m.flowWidth, 1);
      expect(m.columnWidth).toBeCloseTo(width >= 768 ? (m.flowWidth - 28) / 2 : m.flowWidth, 1);
      expect(m.scale).toBe(1);
      expect(m.links).toBe(true);
      expect(m.tableOverflow).toBeLessThanOrEqual(1);
      for (const equation of m.equations) {
        expect(equation.size).toBe('16px');
        expect(equation.right).toBeLessThanOrEqual(width);
        if (width >= 375) expect(equation.overflow).toBeLessThanOrEqual(1);
      }
    }
    // A wide viewport can still contain a narrow paper.
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator('.sheet').evaluate(el => { el.style.maxWidth = '440px'; });
    expect(await page.locator('.paper-columns').first().evaluate(el =>
      el.querySelector('p').getBoundingClientRect().width === el.getBoundingClientRect().width)).toBe(true);
  });

  for (const paper of ['a4', 'letter']) test(`research columns paginate in reading order: ${lang}, ${paper}`, async ({ page }, info) => {
    // Printing from a narrow screen must use the paper's available width.
    await page.setViewportSize({ width: 375, height: 900 });
    await page.setContent(markup(lang, paper));
    const paragraphs = await page.locator('.paper-columns p:not(:has(math))').allTextContents();
    const flows = await page.locator('.paper-columns').evaluateAll(els => els.map(el =>
      [...el.querySelectorAll('p:not(:has(math))')].map(p => p.textContent)));
    const headings = await page.locator('.paper-columns h2').allTextContents();
    const caption = await page.locator('.plate-full > figcaption').textContent();
    const following = await page.locator('.plate-full + .paper-columns p').first().textContent();
    const table = await page.locator('.plate-table tbody').textContent();
    const pdfPath = info.outputPath('research-columns.pdf');
    const pdf = await page.pdf({ path: pdfPath, preferCSSPageSize: true, printBackground: true });
    await info.attach('research-columns.pdf', { path: pdfPath, contentType: 'application/pdf' });
    const loading = getDocument({ data: new Uint8Array(pdf), useSystemFonts: true });
    const doc = await loading.promise;
    const pages = [];
    const left = paper === 'a4' ? 16 * 72 / 25.4 : 0.65 * 72;
    const expectedWidth = paper === 'a4' ? 210 * 72 / 25.4 : 612;
    const expectedHeight = paper === 'a4' ? 297 * 72 / 25.4 : 792;
    const rightColumn = expectedWidth / 2 + 28 * 0.75 / 2;
    expect(doc.numPages).toBeGreaterThan(2);
    for (let n = 1; n <= doc.numPages; n++) {
      const sheet = await doc.getPage(n);
      expect(sheet.view[2]).toBeCloseTo(expectedWidth, 0);
      expect(sheet.view[3]).toBeCloseTo(expectedHeight, 0);
      const items = (await sheet.getTextContent()).items.filter(item => item.str.trim());
      expect(items.some(item => flat(item.str) === `${n}/${doc.numPages}`)).toBe(true);
      const body = items.filter(item => flat(item.str) !== `${n}/${doc.numPages}`);
      for (const item of body) {
        expect(item.transform[4], item.str).toBeGreaterThanOrEqual(left - 1.5);
        expect(item.transform[4] + item.width, item.str).toBeLessThanOrEqual(expectedWidth - left + 1);
      }
      pages.push({ items: body, text: flat(body.map(item => item.str).join('')) });
    }

    // Locate a prose fragment in PDF extraction order, retaining its visual
    // coordinates to detect a row-wise or page-wise column ordering error.
    function locate(fragment) {
      const needle = flat(fragment);
      for (const [n, p] of pages.entries()) {
        const offset = p.text.indexOf(needle);
        if (offset < 0) continue;
        let at = 0;
        for (const [i, item] of p.items.entries()) {
          at += flat(item.str).length;
          if (at > offset) return { page: n, index: i, x: item.transform[4], y: item.transform[5], item };
        }
      }
      throw new Error(`Missing PDF text: ${fragment}`);
    }
    const starts = paragraphs.map(p => locate(flat(p).slice(0, 24)));
    expect(starts.some(p => Math.abs(p.x - left) < 2)).toBe(true);
    expect(starts.some(p => Math.abs(p.x - rightColumn) < 2)).toBe(true);
    for (let i = 1; i < starts.length; i++) {
      const a = starts[i - 1], b = starts[i];
      expect(b.page).toBeGreaterThanOrEqual(a.page);
      if (a.page === b.page) expect(b.index).toBeGreaterThan(a.index);
    }
    for (const flow of flows) {
      const positions = flow.map(p => locate(flat(p).slice(0, 24)));
      for (let i = 1; i < positions.length; i++) {
        const a = positions[i - 1], b = positions[i];
        if (a.page !== b.page) continue;
        const columnA = a.x >= rightColumn - 2 ? 1 : 0;
        const columnB = b.x >= rightColumn - 2 ? 1 : 0;
        expect(columnB, 'read down each column before moving right').toBeGreaterThanOrEqual(columnA);
        if (columnA === columnB) expect(b.y).toBeLessThan(a.y);
      }
    }
    const text = pages.map(p => p.text).join('');
    for (const p of paragraphs) {
      const normalized = flat(p);
      const chunks = normalized.match(/.{1,12}/gu).filter(chunk => chunk.length >= 8);
      // Source-list numbers and inline citations may interrupt extraction.
      expect(chunks.filter(chunk => text.includes(chunk)).length / chunks.length, p).toBeGreaterThan(0.9);
    }
    for (const heading of headings) {
      const h = locate(heading);
      const next = pages[h.page].items.slice(h.index + 1).find(item =>
        item.height < h.item.height && item.transform[5] < h.y && Math.abs(item.transform[4] - h.x) < 20);
      expect(next, `text follows heading in its column: ${heading}`).toBeTruthy();
    }
    for (let n = 1; n <= 4; n++) {
      const matches = pages.flatMap(p => p.items.filter(item => item.str === `(${n})` && item.height > 10));
      // Japanese captions also mention equation numbers at the caption size.
      expect(matches).toHaveLength(1);
      expect(matches[0].transform[4]).toBeGreaterThan(left + 200);
    }
    const cap = locate(flat(caption).slice(0, 24));
    const after = locate(flat(following).slice(0, 24));
    expect(after.page, 'text resumes on the same page below the full-width figure').toBe(cap.page);
    expect(after.y).toBeLessThan(cap.y);
    expect(pages.some(p => p.text.includes(flat(table))), 'all table rows stay together and retain their values').toBe(true);
    expect(text).toContain(flat('https://web.mit.edu/6.976/www/handout/shannon.pdf'));
    await loading.destroy();
  });
}

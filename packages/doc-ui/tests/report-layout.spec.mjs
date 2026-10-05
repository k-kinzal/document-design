import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const css = readFileSync(new URL('../dist/document-design.min.css', import.meta.url), 'utf8');
const exactShare = `${35 / 844 * 100}%`;
const section = `<section class="sec"><h2 class="label">01 / Evidence</h2><div class="field"><p class="note">35 of 844 WordPress statements are fully resolved.</p></div></section>`;
const opening = `<h1>Keep unresolved statements visible</h1><div class="hero"><div class="was"><span class="cap">Resolved statements</span><span class="fig">35/844</span><span class="unit">WordPress SQL catalog</span></div><div class="now"><span class="cap">Resolved share</span><span class="fig">${exactShare}</span><span class="unit">Unrounded calculation</span></div></div>`;
const document = markup => `<!doctype html><html lang="en"><meta charset="utf-8"><style>${css}</style><body>${markup}</body></html>`;

for (const lang of ['en', 'ja']) for (const wrapper of ['', 'sheet-body', 'plain']) test(`inset report preserves reading order and long values: ${lang}, ${wrapper || 'direct'}`, async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const width of [1128, 768, 360, 200]) {
    const body = lang === 'en' ? opening + section : (opening + section).replace('Keep unresolved statements visible', '未解決の文を残す').replace('35 of 844 WordPress statements are fully resolved.', 'WordPressの844件の文のうち、完全に解決できたのは35件です。');
    await page.setContent(document(`<div class="doc doc-inset" style="width:${width}px"><article class="sheet sheet-inset" lang="${lang}">${wrapper ? `<div class="${wrapper}">${body}</div>` : body}</article></div>`));
    const m = await page.evaluate(() => {
      const box = e => { const r = e.getBoundingClientRect(); return { x:r.x, y:r.y, right:r.right, bottom:r.bottom, width:r.width }; };
      const sheet = document.querySelector('.sheet'), hero = document.querySelector('.hero');
      return {
        titleSize: parseFloat(getComputedStyle(document.querySelector('h1')).fontSize),
        labelSize: parseFloat(getComputedStyle(document.querySelector('.label')).fontSize),
        sheet: box(sheet), sheetScroll:sheet.scrollWidth,
        section:box(document.querySelector('.sec')), label:box(document.querySelector('.label')), field:box(document.querySelector('.field')),
        hero:box(hero), sides:[...hero.children].map(box),
        figures:[...document.querySelectorAll('.fig')].map(e=>({ ...box(e), fontSize:parseFloat(getComputedStyle(e).fontSize), overflowX:getComputedStyle(e).overflowX, scroll:e.scrollWidth, client:e.clientWidth, text:e.textContent })),
      };
    });
    expect(m.titleSize).toBeLessThanOrEqual(39);
    expect(m.labelSize).toBe(13);
    expect(m.sheetScroll, `${width}px: no frame overflow`).toBeLessThanOrEqual(m.sheet.width + 1);
    expect(m.label.bottom <= m.field.y + 1 || m.label.right <= m.field.x + 1).toBe(true);
    for (let i = 0; i < m.figures.length; i++) {
      const f = m.figures[i], side = m.sides[i];
      expect(f.right).toBeLessThanOrEqual(side.right + 1);
      expect(f.fontSize).toBeGreaterThanOrEqual(20);
      if (f.scroll > f.client + 1) expect(f.overflowX).toBe('auto');
    }
    expect(m.figures[1].text).toBe(exactShare);
    if (width <= 768) expect(m.sides[1].y).toBeGreaterThanOrEqual(m.sides[0].bottom);
  }
});

test('a narrow sheet sizes its title to its container on a wide screen', async ({ page }) => {
  await page.setViewportSize({ width:1440, height:1000 });
  await page.setContent(document(`<div style="width:360px"><article class="sheet">${opening}${section}</article></div>`));
  const title = await page.locator('h1').evaluate(e=>parseFloat(getComputedStyle(e).fontSize));
  expect(title).toBeLessThanOrEqual(39);
  const figures = await page.locator('.fig').evaluateAll(es=>es.map(e=>parseFloat(getComputedStyle(e).fontSize)));
  expect(figures[1]).toBeLessThan(title);
  expect(figures[0]).toBeLessThan(figures[1]);
});

test('comparison switches at the nearest container, with a stacked standalone fallback', async ({ page }) => {
  await page.setViewportSize({ width:1440, height:1000 });
  const compare = '<div class="compare"><div><h3>Statements</h3><p>844 statements</p></div><div><h3>Findings</h3><p>978 findings</p></div></div>';
  for (const width of [735, 736]) {
    await page.setContent(document(`<div class="field" style="width:${width}px">${compare}</div>`));
    const [a,b] = await page.locator('.compare > *').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().toJSON()));
    if (width === 736) { expect(b.y).toBe(a.y); expect(b.x).toBeGreaterThan(a.x); }
    else expect(b.y).toBeGreaterThanOrEqual(a.bottom);
  }
  await page.setContent(document(compare));
  const [a,b] = await page.locator('.compare > *').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().toJSON()));
  expect(b.y).toBeGreaterThanOrEqual(a.bottom);
});

for (const inset of [false, true]) test(`a printed long figure retains its exact value: ${inset ? 'inset' : 'sheet'}`, async ({ page }, info) => {
  await page.setContent(document(`<article class="sheet${inset ? ' sheet-inset' : ''}" data-dd-paper="a4">${opening}${section}</article>`));
  const pdf = await page.pdf({ preferCSSPageSize: true });
  await info.attach('long-figure.pdf', { body: pdf, contentType: 'application/pdf' });
  const loading = getDocument({ data: new Uint8Array(pdf), useSystemFonts: true });
  const doc = await loading.promise;
  const text = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const p = await doc.getPage(n);
    const items = (await p.getTextContent()).items.filter(i => i.str.trim());
    for (const item of items) {
      expect(item.transform[4], item.str).toBeGreaterThanOrEqual(0);
      expect(item.transform[4] + item.width, item.str).toBeLessThanOrEqual(p.view[2]);
    }
    text.push(items.map(i=>i.str).join(''));
  }
  expect(text.join('').replace(/\s/g, '')).toContain(exactShare);
  await loading.destroy();
});

import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const cli = fileURLToPath(new URL('../dist/cli.mjs', import.meta.url));
const fixture = lang => fileURLToPath(new URL(`./fixtures/markdown${lang === 'ja' ? '.ja' : ''}.md`, import.meta.url));

for (const layout of ['doc', 'report', 'paper', 'book']) {
  for (const lang of ['en', 'ja']) {
    for (const width of [390, 1440]) {
      test(`${layout}, ${lang}, ${width}px: file URL, no JavaScript, offline`, async ({ page }, info) => {
        const path = info.outputPath('document.html');
        execFileSync(process.execPath, [cli, fixture(lang), '--layout', layout, '--lang', lang, '--theme', 'dark', '-o', path]);
        await page.setViewportSize({ width, height: 1000 });
        await page.context().setOffline(true);
        const requests = [];
        page.on('request', request => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
        await page.goto(pathToFileURL(path).href);
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('table')).toBeVisible();
        await expect(page.locator('pre')).toBeVisible();
        const size = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          prose: [...document.querySelectorAll('.prose p')].map(p => parseFloat(getComputedStyle(p).fontSize)),
          theme: getComputedStyle(document.documentElement).colorScheme,
          lang: document.documentElement.lang,
          lineBreak: getComputedStyle(document.querySelector('p')).lineBreak,
        }));
        expect(size.overflow).toBeLessThanOrEqual(1);
        expect(Math.min(...size.prose)).toBeGreaterThanOrEqual(16);
        expect(size.theme).toBe('dark');
        expect(size.lang).toBe(lang);
        expect(size.lineBreak).toBe('strict');
        expect(requests).toEqual([]);
        if (layout === 'paper') {
          const gap = await page.evaluate(() => document.querySelector('.prose > :first-child').getBoundingClientRect().top - document.querySelector('.paper-head').getBoundingClientRect().bottom);
          expect(gap).toBe(28);
        }
        await expect(page.locator('input[type=checkbox]')).toHaveCount(2);
        const link = page.locator('.prose a[href^="#"]').first();
        await link.click();
        const target = decodeURIComponent(new URL(page.url()).hash.slice(1));
        expect(await page.locator('h2').evaluateAll((headings, id) => headings.some(h => h.id === id), target)).toBe(true);
        await page.emulateMedia({ media: 'print' });
        expect(await page.locator('html').evaluate(el => getComputedStyle(el).colorScheme)).toBe('light');
      });
    }
  }
}

test('paper and book options survive actual A4/Letter pagination', async ({ page }, info) => {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  // PDF fonts may split a word around a ligature into separate text runs.
  const flat = text => text.normalize('NFKC').replace(/\s+/g, '');
  for (const [layout, paper, width, height] of [['paper', 'a4', 595, 842], ['book', 'letter', 612, 792]]) {
    const paragraph = 'Readers need to distinguish observed findings from unresolved references. The catalog keeps the evidence and its limits together.\n\n';
    const source = '# Catalog evidence\n\nOpening context.\n\n## First chapter\n\n' + paragraph.repeat(45) + '## Final chapter\n\nThe final observation remains visible.\n';
    const input = info.outputPath(`${layout}.md`);
    const output = info.outputPath(`${layout}.html`);
    writeFileSync(input, source);
    execFileSync(process.execPath, [cli, input, '-o', output, '--layout', layout, '--paper', paper, '--color', 'monochrome']);
    await page.goto(pathToFileURL(output).href);
    const pdf = await page.pdf({ path: info.outputPath(`${layout}.pdf`), preferCSSPageSize: true });
    const loading = getDocument({ data: new Uint8Array(pdf), useSystemFonts: true });
    const doc = await loading.promise;
    expect(doc.numPages).toBeGreaterThanOrEqual(3);
    const texts = [];
    for (let n = 1; n <= doc.numPages; n++) {
      const sheet = await doc.getPage(n);
      const box = sheet.getViewport({ scale: 1 });
      expect(Math.round(box.width)).toBe(width);
      expect(Math.round(box.height)).toBe(height);
      const { items } = await sheet.getTextContent();
      const text = flat(items.map(item => item.str).join(''));
      expect(text).toContain(flat(`${n} / ${doc.numPages}`));
      texts.push(text);
    }
    expect(texts.at(-1)).toContain(flat('The final observation remains visible.'));
    expect(texts.join('').match(/Readersneedtodistinguish/g)).toHaveLength(45);
    if (layout === 'book') {
      expect(texts[0]).toContain(flat('Catalog evidence'));
      expect(texts[0]).not.toContain(flat('First chapter'));
      expect(texts[1]).toContain(flat('First chapter'));
      expect(texts.at(-1)).toContain(flat('Final chapter'));
      expect(texts.at(-1)).not.toContain(flat('Readers need to distinguish'));
    }
    await loading.destroy();
  }
});

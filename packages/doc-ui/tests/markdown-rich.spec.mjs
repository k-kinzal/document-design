import { test, expect } from '@playwright/test';
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderMarkdown } from '../src/cli/render.mjs';

const cli = fileURLToPath(new URL('../dist/cli.mjs', import.meta.url));
const source = readFileSync(new URL('./fixtures/markdown-rich.md', import.meta.url), 'utf8');
const css = readFileSync(new URL('../dist/document-design.min.css', import.meta.url), 'utf8');

for (const theme of ['auto', 'light', 'dark']) {
  test(`rich Markdown: ${theme}, offline with scripts disabled, mobile and print`, async ({ page }, info) => {
    const path = info.outputPath('rich.html');
    execFileSync(process.execPath, [cli, '-', '-o', path, '--layout', 'paper', '--paper', 'a4', '--theme', theme], { input: source });
    const requests = [];
    page.on('request', request => { if (!/^(file|data):/.test(request.url())) requests.push(request.url()); });
    await page.context().setOffline(true);
    await page.goto(pathToFileURL(path).href);
    await expect(page.locator('script, link')).toHaveCount(0);
    await expect(page.locator('.tok-kw').first()).toHaveCSS('font-weight', '600');
    await expect(page.locator('math')).toHaveCount(2);
    await expect(page.locator('.callout')).toHaveCSS('font-size', '16px');
    await expect(page.locator('.diagram')).toHaveCount(2);
    for (const colorScheme of ['light', 'dark']) {
      await page.emulateMedia({ media: 'screen', colorScheme });
      const shown = theme === 'auto' ? colorScheme : theme;
      const hidden = shown === 'light' ? 'dark' : 'light';
      await expect(page.locator(`.diagram-${shown}`).first()).toBeVisible();
      await expect(page.locator(`.diagram-${hidden}`).first()).toBeHidden();
    }
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const measurement = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        figures: [...document.querySelectorAll('.diagram img')].filter(img => getComputedStyle(img).display !== 'none')
          .map(img => ({ natural: img.naturalWidth, width: img.getBoundingClientRect().width, complete: img.complete })),
      }));
      expect(measurement.overflow).toBeLessThanOrEqual(1);
      for (const figure of measurement.figures) {
        expect(figure.complete).toBe(true);
        expect(figure.natural).toBeGreaterThan(0);
        expect(Math.abs(figure.width - figure.natural)).toBeLessThan(1);
      }
      await page.screenshot({ path: info.outputPath(`${theme}-${width}.png`), fullPage: true });
    }
    await page.locator('[role=doc-noteref]').click();
    await expect(page.locator('#dd-fn-1')).toBeInViewport();
    await page.locator('[role=doc-backlink]').click();
    await expect(page.locator('[role=doc-noteref]')).toBeInViewport();
    await page.locator('summary').first().click();
    await expect(page.locator('.language-mermaid').first()).toBeVisible();
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.diagram-light').first()).toBeVisible();
    await expect(page.locator('.diagram-dark').first()).toBeHidden();
    const pdf = await page.pdf({ path: info.outputPath('rich.pdf'), preferCSSPageSize: true });
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const loading = getDocument({ data: new Uint8Array(pdf), useSystemFonts: true });
    const document = await loading.promise;
    let printed = '';
    for (let n = 1; n <= document.numPages; n++) {
      const sheet = await document.getPage(n);
      expect(Math.round(sheet.getViewport({ scale: 1 }).width)).toBe(595);
      printed += (await sheet.getTextContent()).items.map(item => item.str).join(' ');
    }
    // PDF fonts can split ligatures into separate text runs on Linux.
    const flat = value => value.normalize('NFKC').replace(/\s+/g, '');
    expect(flat(printed)).toContain(flat('Generate once, read offline'));
    expect(flat(printed)).toContain(flat('WordPress SQL catalog'));
    await loading.destroy();
    expect(requests).toEqual([]);
  });
}

test('common Mermaid families, Japanese labels and untrusted directives generate inert SVG images', async ({ page }) => {
  const diagrams = [
    'flowchart LR\naccTitle: 日本語の図\nA[入力] --> B[出力]\nclick A "javascript:alert(1)"',
    'classDiagram\nDocument <|-- Report\nDocument : +title',
    'stateDiagram-v2\n[*] --> Draft\nDraft --> Published',
    'erDiagram\nDOCUMENT ||--o{ SECTION : contains',
    'pie title Document genres\n"Documents" : 1\n"Reports" : 1',
    'gantt\ntitle Generation steps\ndateFormat YYYY-MM-DD\nParse :a, 2026-11-06, 1d',
    '%%{init: {"securityLevel": "loose", "htmlLabels": true, "themeCSS": "@import url(https://example.com/evil.css)"}}%%\nflowchart TD\nA["<img src=x onerror=alert(1)>"] --> B[End]',
  ];
  const html = await renderMarkdown(diagrams.map(diagram => `\`\`\`mermaid\n${diagram}\n\`\`\``).join('\n\n'), {
    css, lang: 'ja', color: 'monochrome', launchOptions: process.env.CI ? {} : { channel: 'chrome' },
  });
  await page.setContent(html);
  await expect(page.locator('.diagram')).toHaveCount(diagrams.length);
  await expect(page.locator('script, iframe, object, embed, link')).toHaveCount(0);
  await expect(page.locator('figcaption').first()).toHaveText('日本語の図');
  await expect(page.locator('summary').first()).toHaveText('図のソース');
  for (const src of await page.locator('.diagram img').evaluateAll(images => images.map(image => image.src))) {
    expect(src).toMatch(/^data:image\/svg\+xml;base64,/);
    const svg = Buffer.from(src.split(',')[1], 'base64').toString('utf8');
    expect(svg).not.toMatch(/<(?:script|foreignObject|image)\b|\son\w+=|(?:xlink:)?href=|@import|evil\.css/);
  }
});

test('an invalid Mermaid block fails with its line number and no partial HTML', () => {
  const result = spawnSync(process.execPath, [cli, '-'], { input: '# Invalid\n\n```mermaid\nthis is not a diagram\n```', encoding: 'utf8' });
  expect(result.status).toBe(1);
  expect(result.stdout).toBe('');
  expect(result.stderr).toContain('Mermaid block at line 3');
});

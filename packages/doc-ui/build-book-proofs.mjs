import { chromium } from '@playwright/test';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { compileBook } from './stories/book-proof.mjs';

const output = new URL('./.generated/book-proofs/', import.meta.url);
const css = readFileSync(new URL('./dist/document-design.css', import.meta.url), 'utf8');
const editions = [
  { lang: 'en', format: 'a5', mode: 'mixed' },
  { lang: 'ja', format: 'a5', mode: 'mixed' },
  { lang: 'en', format: 'a5', mode: 'grayscale' },
  { lang: 'en', format: 'a5', mode: 'monochrome' },
  { lang: 'en', format: 'a4', mode: 'mixed' },
  { lang: 'ja', format: 'b6-jis', mode: 'mixed' },
];
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: process.env.CI ? undefined : 'chrome' });
try {
  const page = await browser.newPage({ javaScriptEnabled: false });
  for (const options of editions) {
    const id = `${options.lang}-${options.format}-${options.mode}`;
    const directory = new URL(`${id}/`, output);
    mkdirSync(directory, { recursive: true });
    const result = await compileBook(page, css, options);
    writeFileSync(new URL('book.html', directory), result.html);
    writeFileSync(new URL('book.pdf', directory), result.pdf);
    const loading = getDocument({ data: new Uint8Array(result.pdf), useSystemFonts: true });
    const doc = await loading.promise;
    for (const leaf of result.pages) {
      const sheet = await doc.getPage(leaf.number);
      const viewport = sheet.getViewport({ scale: 2 });
      const canvas = doc.canvasFactory.create(viewport.width, viewport.height);
      await sheet.render({ canvasContext: canvas.context, viewport }).promise;
      writeFileSync(new URL(`page-${leaf.number}.png`, directory), canvas.canvas.toBuffer('image/png'));
      doc.canvasFactory.destroy(canvas);
    }
    await loading.destroy();
    writeFileSync(new URL('index.json', directory), JSON.stringify({
      ...options, geometry: result.settings.geometry, title: result.settings.title,
      folios: result.folios, pages: result.pages.map(({ text, ...leaf }) => leaf),
    }, null, 2) + '\n');
    console.log(`book proof: ${id}, ${result.pages.length} pages, ${result.passes} pagination passes`);
  }
} finally { await browser.close(); }

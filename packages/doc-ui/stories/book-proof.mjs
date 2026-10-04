// Build-time pagination for the specimen. Chromium supplies line breaking and
// page fragments; a second pass supplies recto blanks and actual TOC folios.
import { readFileSync } from 'node:fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { book, bookImages, bookSettings } from './book.mjs';

const flat = text => text.normalize('NFKC').replace(/\s+/g, '');
const escape = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const images = Object.fromEntries(Object.entries(bookImages).map(([key, url]) => [key, `data:image/png;base64,${readFileSync(new URL(url)).toString('base64')}`]));

export function bookDocument(css, options = {}) {
  const settings = bookSettings(options);
  return `<!doctype html><html lang="${options.lang ?? 'en'}" data-dd-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(settings.title)}</title><style>${css}\n${settings.css}</style></head><body>${book({ ...options, images })}</body></html>`;
}

export async function compileBook(page, css, options = {}) {
  const settings = bookSettings(options);
  let blankBefore = [], folios = {};
  for (let pass = 0; pass < 8; pass++) {
    const html = bookDocument(css, { ...options, blankBefore, folios });
    await page.setContent(html);
    await page.locator('img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
    await page.evaluate(() => document.fonts.ready);
    const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: false, displayHeaderFooter: false });
    const loading = getDocument({ data: new Uint8Array(pdf), useSystemFonts: true });
    const doc = await loading.promise;
    const pages = [], starts = {};
    for (let n = 1; n <= doc.numPages; n++) {
      const sheet = await doc.getPage(n);
      const { items } = await sheet.getTextContent();
      const height = sheet.view[3];
      const headings = flat(items.filter(item => item.height >= 16 && height - item.transform[5] > settings.geometry.head * 72 / 25.4)
        .map(item => item.str).join(''));
      settings.chapters.forEach((title, i) => { if (headings.includes(flat(title))) starts[i + 1] = n; });
      pages.push({ number: n, width: sheet.view[2], height, blank: !items.some(item => item.str.trim()), text: items.map(item => item.str).join(' ') });
    }
    await loading.destroy();
    if (Object.keys(starts).length !== settings.chapters.length) throw new Error('Could not locate every chapter in the paginated book.');
    const nextBlanks = [];
    for (let n = 1; n <= settings.chapters.length; n++) {
      const withoutBlanks = starts[n] - blankBefore.filter(chapter => chapter <= n).length;
      if ((withoutBlanks + nextBlanks.length) % 2 === 0) nextBlanks.push(n);
    }
    if (JSON.stringify(nextBlanks) === JSON.stringify(blankBefore) && JSON.stringify(starts) === JSON.stringify(folios)) {
      return { html, pdf, pages, folios, blankBefore, settings, passes: pass + 1 };
    }
    blankBefore = nextBlanks;
    folios = starts;
  }
  throw new Error('Book pagination did not converge; check the table of contents and chapter breaks.');
}

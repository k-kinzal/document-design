import { html } from './helpers.js';
import { bookPreview } from './book-preview.mjs';

export default {
  title: 'Examples/Book',
  parameters: {
    docs: { description: { component: 'A format-led book proof, generated from doc-ui HTML with native MathML, an SVG plot, tables and raster plates. A5 is 148 × 210 mm; its type area is 110 × 168 mm, with a 20 mm gutter, 18 mm fore-edge, 18 mm head and 24 mm foot. These margins are editorial choices, not requirements of the paper standard. Even pages have the book title at the outer head; odd pages have the current chapter title. Folios sit outside the type area. Chapters start on rectos; intentionally blank versos carry no furniture. The generation pass prints the actual HTML, inserts necessary blanks, resolves TOC folios and renders these proof images. Open PDF for selectable text, or download HTML for script-free offline reading and printing. Rebuild proofs after changing content, fonts, geometry or CSS. bookGeometry(), bookVariables() and bookPageCSS() from @k-kinzal/doc-ui/book are optional helpers that emit ordinary CSS. Neutral pages desaturate images; genuinely bitonal images need bitonal source artwork.' } },
  },
};

function proof({ lang = 'en', format = 'a5', mode = 'mixed', guides = false } = {}) {
  return {
    loaders: [async () => {
      const response = await fetch(`./book-proofs/${lang}-${format}-${mode}/index.json`);
      if (!response.ok) throw new Error('Book proofs are missing. Run npm run build:book-proofs.');
      return { proof: await response.json() };
    }],
    render: (_args, { loaded }) => html`${bookPreview(loaded.proof, { guides })}`,
  };
}

export const MixedPages = { name: 'A5 · Mixed pages', ...proof() };
export const Japanese = { name: 'Japanese · A5', ...proof({ lang: 'ja' }) };
export const PageAnatomy = { name: 'Page anatomy · A5', ...proof({ guides: true }) };
export const A4 = { name: 'A4 · Mixed pages', ...proof({ format: 'a4' }) };
export const JapaneseB6 = { name: 'Japanese · JIS B6', ...proof({ lang: 'ja', format: 'b6-jis' }) };
export const Grayscale = { name: 'A5 · Grayscale', ...proof({ mode: 'grayscale' }) };
export const Monochrome = { name: 'A5 · Monochrome', ...proof({ mode: 'monochrome' }) };

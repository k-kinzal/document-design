import { html } from './helpers.js';
import { book } from './book.mjs';

export default {
  title: 'Examples/Book',
  parameters: {
    docs: { description: { component: 'An illustrated mathematical book with a cover, linked contents, chapters, native MathML, a calculated SVG plot, a data table, local raster plates and a colophon. Compose .sheet.sheet-paper.sheet-book with .book-page divisions. Each division starts on a new printed page and can continue across several sheets without clipping. Screen divisions are not a pagination preview. data-dd-color="color", "grayscale" or "monochrome" on each division selects its inks, including an explicit return to colour inside a monochrome book. Book images follow the nearest mode: neutral modes desaturate photographs; true two-ink artwork must be supplied as a bitonal image, as in the appendix. CSS does not select a printer ink channel or guarantee CMYK output. A4/Letter output uses mirrored binding margins and outer folios in browsers supporting page margin boxes. Print the standalone Canvas, not the Storybook navigation. No reading-time scripts, external fonts or image requests are needed.' } },
  },
};

export const MixedPages = { name: 'Mixed pages', render: () => html`${book()}` };
export const Grayscale = { render: () => html`${book({ mode: 'grayscale' })}` };
export const Monochrome = { render: () => html`${book({ mode: 'monochrome' })}` };
export const Japanese = {
  parameters: { docs: { description: { story: 'The complete Japanese edition, marked lang="ja", with natural prose spacing, strict line breaking, Japanese captions and the same calculated figures. Colours change at the same authored page boundaries.' } } },
  render: () => html`${book({ lang: 'ja' })}`,
};

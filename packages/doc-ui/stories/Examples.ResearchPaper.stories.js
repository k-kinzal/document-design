import { html } from './helpers.js';
import { researchPaper } from './research-paper.mjs';

export default {
  title: 'Examples/Research paper',
  parameters: {
    docs: { description: { component: 'A continuous research paper with an abstract, native inline and display MathML, numbered equations, a calculated SVG plot, a table and a cited primary source. The content is an expository specimen: values are evaluated from the stated functions, not invented measurements. Compose .sheet.sheet-paper with .prose, .equation, .plate and .sources. data-dd-color="grayscale" or "monochrome" selects neutral inks; it follows the light/dark toolbar and prints light. Existing report sheets retain their layout. The generator emits static HTML: reading and printing require no JavaScript, external fonts or network.' } },
  },
};

export const Grayscale = { render: () => html`${researchPaper()}` };
export const Monochrome = { render: () => html`${researchPaper({ color: 'monochrome' })}` };
export const Colour = { render: () => html`${researchPaper({ color: 'color' })}` };
export const Japanese = {
  parameters: { docs: { description: { story: 'Japanese text with lang="ja", natural prose spacing, Japanese figure/table labels and the same equations and calculated data.' } } },
  render: () => html`${researchPaper({ lang: 'ja' })}`,
};

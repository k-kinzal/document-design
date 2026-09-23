import { html, drawDefs } from './helpers.js';
import { marks, marksPreview } from './graph-examples.js';

export default {
  title: 'Components/Drawing',
  parameters: {
    docs: {
      description: {
        component:
          "The marks a drawing is made of, and the size it is placed at.\n\n" +
          "**Geometry is the generator's; paint is the system's.** The " +
          "generator ran the layout and knows the coordinates — those stay in " +
          "the SVG, along with `text-anchor` and `dominant-baseline`, because " +
          "a CSS declaration beats an SVG presentation attribute " +
          "unconditionally. What a mark *is*, and therefore how it is " +
          "painted, is the system's: a hand-painted mark does not follow the " +
          "tone, does not follow the theme, does not survive a forced palette " +
          "and is not the tint the components beside it use.\n\n" +
          "`.draw-box-*` names an **area**, not a `<rect>` — a circle that is " +
          "a hole takes the same role.\n\n" +
          "**Absence is dashed, always, and toned to say which kind:** warn " +
          "by default for “as far as we got”, `tone-neutral` for a hole, " +
          "`tone-danger` for a measurement that does not exist. The dash is " +
          "the claim and the hue is only the kind, so a reader who cannot see " +
          "the hue still gets the first half.\n\n" +
          "**A drawing never scales.** Set `--dd-draw-width` to the viewBox " +
          "width and it renders at 1:1; the wrapper scrolls when the column " +
          "cannot hold it. An SVG with a viewBox and no width scales its text " +
          "with everything else, and an authored 14 becomes whatever the " +
          "column happened to be.\n\n" +
          "`.draw-arrow` sets `marker-end` against one `<marker>` defined " +
          "once per document (`.draw-defs`). A marker reference that resolves " +
          "to nothing is not an error in SVG — the line simply ends — so the " +
          "block belongs in the page shell, not in each figure.",
      },
    },
  },
};

export const Marks = {
  render: () => html`<article class="sheet sheet-inset" lang="en">${drawDefs}${marks}</article>`,
};

export const InDocument = {
  render: () => html`<div class="doc doc-inset" lang="en"><main class="content">${drawDefs}${marks}</main></div>`,
};

export const Narrow = {
  render: () => html`<div class="doc doc-inset" lang="en" style="max-width:320px"><main class="content">${drawDefs}${marks}</main></div>`,
};

export const Compact = {
  render: () => html`<div class="doc doc-inset" lang="en"><main class="content">${drawDefs}${marksPreview}</main></div>`,
};

import { html, drawDefs } from './helpers.js';
import { callouts, calloutsPreview } from './graph-examples.js';

export default {
  title: 'Components/Annotate',
  parameters: {
    docs: {
      description: {
        component:
          "Point at a part of a figure and say what it is.\n\n" +
          "A plate already gives a figure a caption, a number, a source and a " +
          "name the text can point at — all of which address the figure as a " +
          "whole. A callout addresses a *part* of it. Without one, the only " +
          "way to explain a mark is to put the sentence inside the picture, " +
          "which turns a diagram into an image of words: it stops reflowing, " +
          "stops printing at the reader's size, and stops being searchable.\n\n" +
          "Three parts. `.mark` is the token, and is the same disc in the " +
          "drawing (`<g class=\"mark\"><circle/><text>1</text></g>`, placed " +
          "once with a `transform`) and in HTML (`<span class=\"mark\">1</span>`). " +
          "`.leader` is the line from the token to what it names — no " +
          "arrowhead, because a leader names a place and does not point a " +
          "direction. `.legend-key` is the numbered list underneath, which " +
          "supplies its own numbers from a counter so the two sequences " +
          "cannot drift.\n\n" +
          "Numbers go in the drawing, sentences go in the key. A drawing has " +
          "room for `709` and not for the clause that explains it.\n\n" +
          "`.mark-open` is a callout on something that is **not there**, " +
          "dashed like every other absence in the system, and toned: warn for " +
          "\"as far as we got\", `tone-danger` for a measurement that does not " +
          "exist, `tone-neutral` for a hole. Running text keeps pointing with " +
          "`.ref` and `.ref ref-mark`; those point *at* a figure, a mark " +
          "labels one.",
      },
    },
  },
};

export const Callouts = {
  render: () => html`<article class="sheet sheet-inset" lang="en">${drawDefs}${callouts}</article>`,
};

export const InDocument = {
  render: () => html`<div class="doc doc-inset" lang="en"><main class="content">${drawDefs}${callouts}</main></div>`,
};

export const Narrow = {
  render: () => html`<div class="doc doc-inset" lang="en" style="max-width:320px"><main class="content">${drawDefs}${callouts}</main></div>`,
};

export const Compact = {
  render: () => html`<div class="doc doc-inset" lang="en"><main class="content">${drawDefs}
    <p class="note">An index specimen. The marks stay 22px: a callout that shrinks with its drawing is a callout nobody reads.</p>
    ${calloutsPreview}</main></div>`,
};

/** A key whose marks the generator owns, and the tones an open mark takes. */
export const Marks = {
  render: () => html`<div class="doc doc-inset" lang="en"><main class="content">
    <p>Inline in a sentence a figure's parts are named with <span class="mark">1</span>,
       <span class="mark tone-blue">2</span> and <span class="mark mark-open">3</span> —
       the same disc the drawing carries, so the reader matches them without being told to.</p>
    <ol class="legend legend-key">
      <li><span class="legend-name">Counted</span> — the number comes from the list, so it cannot drift from the order the items are written in.</li>
      <li class="mark-open"><span class="legend-name">As far as we got</span> — dashed and amber by default.</li>
      <li class="mark-open tone-danger"><span class="legend-name">Never measured</span> — the tone says which kind of absence.</li>
      <li class="mark-open tone-neutral"><span class="legend-name">A hole</span> — nothing is known here.</li>
      <li><span class="mark tone-blue">B</span><span>An explicit mark. The counter stands aside, exactly as <code>.plate-unnumbered</code> does for figure numbers: a generator that owns one of the two numbers has to own both.</span></li>
    </ol>
  </main></div>`,
};

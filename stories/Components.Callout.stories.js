import { html } from "./helpers.js";

export default {
  title: "Components/Callout",
  parameters: {
    docs: {
      description: {
        component:
          "A paragraph that steps out of the flow to say something the " +
          "surrounding text depends on.\n\n" +
          "Distinct from `.notice`, which is about the **page** — \"this listing " +
          "is filtered\". A callout is about **the text it sits in**, so it " +
          "lives inside prose and takes prose's measure.",
      },
    },
  },
};

export const Tones = {
  render: () => html`
    <article class="prose" style="padding:24px">
      <div class="callout">
        <p>Untoned: an aside the reader can take or leave.</p>
      </div>
      <div class="callout tone-warn">
        <p class="callout-title">Not a total</p>
        <p>The count is a lower bound. A cycle stopped the search, so the call may
           issue more statements than are listed here.</p>
      </div>
      <div class="callout tone-danger">
        <p class="callout-title">This cannot be resolved</p>
        <p>The values were followed to runtime input. No amount of further analysis
           will fix the statement text.</p>
      </div>
      <div class="callout tone-ok">
        <p class="callout-title">Safe to change</p>
        <p>Nothing outside this layer depends on it.</p>
      </div>
    </article>`,
};

/**
 * The margin variant. Genuinely an aside, so it goes beside the column rather
 * than interrupting it — and folds back into the flow when the viewport has no
 * room beside the text. Widen the preview past 1100px to see it move out.
 */
export const MarginNote = {
  render: () => html`
    <article class="prose" style="padding:24px;margin-left:auto;margin-right:17rem">
      <h3>Resolution</h3>
      <div class="callout callout-margin tone-warn">
        <p>Only <code>external-input</code> is terminal. The rest can improve as the
           analyzer learns more.</p>
      </div>
      <p>A statement is resolved when its text is fully determined by the source.
         Anything else records how far the search got before it stopped, so a
         reader can tell an answer from an approximation.</p>
      <p>The four unresolved states are ordered by how much is still unknown, and
         the catalog's coverage bar draws them in that order.</p>
    </article>`,
};

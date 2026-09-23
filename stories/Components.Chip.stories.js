import { html, specimen, HUES } from "./helpers.js";

export default {
  title: "Components/Chip",
  parameters: {
    docs: {
      description: {
        component:
          "A word that classifies the thing next to it. Colour comes from a " +
          "tone class, never from a chip variant, so the set of chips does not " +
          "grow when a project adds a kind.",
      },
    },
  },
};

/** Untoned, a chip is neutral — the right default for a label whose colour
 *  would otherwise be one more thing for the reader to learn. */
export const Default = {
  render: () => html`<span class="chip">deprecated</span>`,
};

export const Sizes = {
  render: () => html`
    <div class="sb-row">
      <span class="chip chip-sm tone-blue">chip-sm</span>
      <span class="chip tone-blue">chip</span>
      <span class="chip chip-lg tone-blue">chip-lg</span>
    </div>`,
};

/** Ghost carries a literal rather than a classification — a version, a
 *  parameter, a raw identifier — so it is set in mono and outlined. */
export const Ghost = {
  render: () => html`
    <div class="sb-row">
      <span class="chip chip-ghost">^8.2</span>
      <span class="chip chip-ghost">readonly</span>
      <a class="chip chip-ghost" href="#">WP_Query</a>
      <span class="chip chip-ghost chip-square">int|null</span>
    </div>`,
};

export const Tones = {
  render: () => html`
    <div class="sb-row">
      ${HUES.map((h) => `<span class="chip tone-${h}">${h}</span>`).join("")}
    </div>`,
};

/** In place: a chip is almost always attached to something, and its size is
 *  chosen so it does not shift the baseline of what it labels. */
export const InContext = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      ${specimen(
        "on a heading",
        `<h1><code>WP_Query</code><span class="chip tone-blue">class</span><span class="chip chip-sm tone-warn">deprecated</span></h1>`
      )}
      ${specimen(
        "in a table cell",
        `<div class="table-wrap"><table>
           <thead><tr><th>Rule</th><th class="tight">Severity</th><th class="num">Statements</th></tr></thead>
           <tbody>
             <tr><td><a class="mono" href="#">dynamic-sql</a></td><td class="tight"><span class="chip tone-warn">medium</span></td><td class="num">709</td></tr>
             <tr><td><a class="mono" href="#">unresolved-sql</a></td><td class="tight"><span class="chip tone-neutral">low</span></td><td class="num">25</td></tr>
           </tbody>
         </table></div>`
      )}
      ${specimen(
        "leading a row",
        `<ul class="rows"><li class="row"><a class="row-main" href="#">
           <span class="chip tone-blue">SELECT</span>
           <span class="row-body">SELECT * FROM {$}posts WHERE post_status = 'publish' ORDER BY post_date DESC</span>
         </a></li></ul>`
      )}
    </main></div></div>`,
};

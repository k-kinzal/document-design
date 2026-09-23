import { html } from "./helpers.js";

export default {
  title: "Components/Meter",
  parameters: {
    docs: {
      description: {
        component:
          "How a whole divides, at a glance, with the parts reachable. The bar " +
          "is the shape of the answer and the legend is the answer; neither " +
          "works alone.",
      },
    },
  },
};

export const Coverage = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <h2>How far the analysis got</h2>
      <div class="meter">
        <a class="meter-part tone-ok" style="--dd-part:4%" href="#" title="resolved: 35"></a>
        <a class="meter-part is-open" style="--dd-part:84%" href="#" title="incomplete-model: 709"></a>
        <a class="meter-part is-open" style="--dd-part:11%" href="#" title="incomplete: 95"></a>
        <a class="meter-part tone-neutral" style="--dd-part:1%" href="#" title="not-analyzed: 5"></a>
      </div>
      <ul class="legend">
        <li><a class="chip tone-ok" href="#">resolved</a><span class="legend-count">35</span>
            <span class="legend-note">The statement text is fully determined.</span></li>
        <li><a class="chip tone-danger" href="#">external-input</a><span class="legend-count">0</span>
            <span class="legend-note">The values were followed to runtime input, so the text cannot be fixed.</span></li>
        <li><a class="chip chip-ghost" href="#">incomplete-model</a><span class="legend-count">709</span>
            <span class="legend-note">A dependency the analyzer does not model was reached.</span></li>
        <li><a class="chip chip-ghost" href="#">incomplete</a><span class="legend-count">95</span>
            <span class="legend-note">A cycle or an analysis budget stopped the search before it closed.</span></li>
        <li><a class="chip tone-neutral" href="#">not-analyzed</a><span class="legend-count">5</span>
            <span class="legend-note">The call was found but never examined.</span></li>
      </ul>
    </main></div></div>`,
};

/**
 * A part that is one item out of nine hundred still has to be clickable, and
 * is exactly the category a reader is surprised by — so every segment keeps a
 * minimum width rather than rounding to nothing.
 */
export const TinySegments = {
  render: () => html`
    <div class="meter">
      <span class="meter-part tone-ok" style="--dd-part:99.6%"></span>
      <span class="meter-part tone-danger" style="--dd-part:0.4%" title="1 of 250"></span>
    </div>`,
};

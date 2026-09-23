import { html } from "./helpers.js";

export default {
  title: "Foundations/Surface",
  parameters: {
    docs: {
      description: {
        component:
          "Five surfaces, two borders, one shadow. A catalog stacks them — a " +
          "search panel over a card over the page — so adjacent greys have to " +
          "stay separable in both themes, which is why there are five named " +
          "steps and not a lightness function.",
      },
    },
  },
};

/**
 * Depth is carried by surface colour, not by shadow. There is exactly one
 * shadow token and it is only for things that genuinely float above the page
 * and can be dismissed — a search panel, an open sidebar on a phone. A card
 * does not float; it is part of the page, and giving it a shadow makes a
 * listing of twelve cards look like twelve dialogs.
 */
export const Surfaces = {
  render: () => html`
    <div style="display:grid;gap:14px;max-width:560px">
      ${[
        ["bg", "the page itself"],
        ["surface", "part of the page: a card, a code block, the sidebar"],
        ["sunken", "a well below the page: inline code, a terminal"],
        ["raised", "above the page, with --dd-shadow: a popover"],
        ["hover", "the row under the pointer"],
      ]
        .map(
          ([t, use]) => `
        <div style="display:flex;align-items:center;gap:16px;padding:16px;border-radius:6px;background:var(--dd-${t});border:1px solid var(--dd-border)${t === "raised" ? ";box-shadow:var(--dd-shadow)" : ""}">
          <code style="min-width:130px">--dd-${t}</code>
          <span class="muted" style="font-size:12px">${use}</span>
        </div>`
        )
        .join("")}
    </div>`,
};

/** Two weights. A hair separates things that belong to each other; a rule is
 *  part of a drawing and is meant to be seen. */
export const Borders = {
  render: () => html`
    <div style="display:grid;gap:20px;max-width:560px">
      <div>
        <p class="sb-label">--dd-hair — a seam between rows, cards, sections</p>
        <div style="border-top:1px solid var(--dd-border);height:28px"></div>
      </div>
      <div>
        <p class="sb-label">--dd-rule — a line with a job: a figure's axis, a card's top edge</p>
        <div style="border-top:2px solid var(--dd-border-strong);height:28px"></div>
      </div>
      <div>
        <p class="sb-label">dashed — something provisional, absent or not supported</p>
        <div style="border-top:1px dashed var(--dd-warn);height:28px"></div>
      </div>
    </div>`,
};

/** Four radii. A pill for a chip, because a chip is a word; a small radius
 *  against code, because a rounded box next to monospace reads as a button. */
export const Shape = {
  render: () => html`
    <div class="sb-row" style="gap:20px">
      ${[
        ["radius-sm", "against code, a marker"],
        ["radius", "a card, an input, a code block"],
        ["radius-lg", "a report's stat tile"],
        ["radius-pill", "a chip"],
      ]
        .map(
          ([t, use]) => `
        <div style="text-align:center">
          <div style="width:96px;height:64px;background:var(--dd-surface);border:1px solid var(--dd-border-strong);border-radius:var(--dd-${t})"></div>
          <code style="font-size:11px;display:block;margin-top:8px">--dd-${t}</code>
          <div class="count" style="max-width:96px;line-height:1.4">${use}</div>
        </div>`
        )
        .join("")}
    </div>`,
};

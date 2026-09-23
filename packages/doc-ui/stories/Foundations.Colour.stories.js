import { html, HUES, STATES, contrast, measured } from "./helpers.js";

export default {
  title: "Foundations/Colour",
  parameters: {
    docs: {
      description: {
        component:
          "Ten hues, each spoken for. Identity says what a thing **is**; state " +
          "says how it is **going**. Mixing the two is how a catalog ends up " +
          "looking like an alarm panel.\n\n" +
          "Declared in two layers: the palette names the hues, the roles say " +
          "what each is for. Nothing outside the palette declares a raw colour.",
      },
    },
  },
};

const NEUTRALS = [
  ["bg", "the page"],
  ["surface", "a card, a code block, the sidebar"],
  ["sunken", "a well: inline code, a terminal"],
  ["raised", "above the page: a popover, a search panel"],
  ["hover", "the row under the pointer"],
  ["hair", "a border between things"],
  ["rule", "a border that is part of the drawing"],
  ["dim", "a count, a path, a timestamp"],
  ["sub", "prose that supports the main text"],
  ["ink", "what you came to read"],
];

const IDENTITY_USE = {
  blue: "the accent — SELECT, a class, a link",
  violet: "UPDATE, an interface, a keyword",
  amber: "a trait, a variable, a placeholder",
  teal: "INSERT, an enum, a string literal",
  pink: "DELETE, a free function",
  indigo: "schema changes, a deptrac layer",
  slate: "a namespace, anything unclassified",
};

const STATE_USE = {
  ok: "resolved, covered, passed",
  warn: "needs attention, a gap the analysis knows about",
  danger: "cannot be determined, failed — and nothing else",
  neutral: "no news, not applicable",
};

function swatch(token, note) {
  return `
    <div style="display:grid;grid-template-columns:48px 1fr;gap:12px;align-items:center">
      <div style="height:48px;border-radius:6px;background:var(--dd-${token});border:1px solid var(--dd-border)"></div>
      <div>
        <div style="font-family:var(--dd-font-mono);font-size:12px">--dd-${token}</div>
        <div style="font-size:11px;color:var(--dd-fg-subtle);line-height:1.5">${note}</div>
      </div>
    </div>`;
}

/**
 * The neutrals carry the page: what it is made of and what is written on it.
 * Five surfaces, because a catalog stacks them — a popover over a card over the
 * page — and two adjacent greys have to be separable in both themes.
 */
export const Neutrals = {
  render: () => html`
    <div class="sb-grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">
      ${NEUTRALS.map(([t, note]) => swatch(t, note)).join("")}
    </div>`,
};

/**
 * Identity hues carry no judgement. Blue, violet, amber and slate are the
 * report sheet's own values; teal, pink and indigo were added for the catalog,
 * which has more kinds than a one-accent report has accents.
 */
export const Identity = {
  render: () => html`
    <div class="sb-grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">
      ${HUES.map(
        (h) => `
        <div>
          ${swatch(h, IDENTITY_USE[h])}
          <div class="sb-row" style="margin-top:10px">
            <span class="chip tone-${h}">chip</span>
            <span class="chip chip-ghost tone-${h}">ghost</span>
            <code class="mono" style="color:var(--dd-${h});background:none;border:none">text</code>
          </div>
        </div>`
      ).join("")}
    </div>`,
};

/**
 * Three state hues, and red is the scarce one. It never appears in syntax
 * highlighting, never marks a kind, never means "remove". The one red on a
 * page always means *something here needs looking at* — which is only true
 * because nothing else is allowed to use it.
 */
export const State = {
  render: () => html`
    <div class="sb-grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">
      ${STATES.map(
        (s) => `
        <div>
          ${swatch(s, STATE_USE[s])}
          <div class="sb-row" style="margin-top:10px">
            <span class="chip tone-${s}">${s}</span>
            <span class="meter" style="margin:0;width:70px;display:inline-flex;vertical-align:middle">
              <span class="meter-part tone-${s}" style="--dd-part:100%"></span>
            </span>
          </div>
        </div>`
      ).join("")}
    </div>`,
};

/**
 * Tints are derived, not written out: each hue mixed into the page background
 * in oklab. The stylesheets this replaces carried twenty hand-picked tint
 * hexes two themes deep — twenty chances for a hue to drift away from its own
 * wash. The mix leans heavier in dark, where the hues are light and a pale
 * wash would read as a block of colour.
 */
export const Tints = {
  render: () => html`
    <div class="sb-grid" style="grid-template-columns:repeat(auto-fill,minmax(190px,1fr))">
      ${[...HUES, "green", "yellow", "red"]
        .map(
          (h) => `
        <div style="border:1px solid var(--dd-border);border-radius:6px;overflow:hidden">
          <div style="height:38px;background:var(--dd-${h})"></div>
          <div style="height:44px;background:var(--dd-${h}-tint);display:flex;align-items:center;justify-content:center;color:var(--dd-${h});font-weight:600;font-size:12px">
            ${h}
          </div>
        </div>`
        )
        .join("")}
    </div>`,
};

/**
 * Measured in the browser, from the colours it actually resolved — not from
 * the hex values in the source. The tints are a `color-mix` and the theme is a
 * `light-dark`, so a number taken from the source would be a guess.
 *
 * Both columns are held to **4.5:1**. A chip is 12px at weight 600, which is
 * normal text: WCAG's large-text exception starts at 18.66px bold. Holding the
 * tint column to 3:1 — as this table and the CI check both once did — passed
 * nine pairs that were failing.
 *
 * Switch the theme in the toolbar and the table re-measures. `npm run
 * check:contrast` asserts 150 pairs in CI, including every hue on all five
 * surfaces.
 */
export const Measured = {
  render: () =>
    measured(() => {
      const rows = [];
      for (const h of [...HUES, "green", "yellow", "red"]) {
        rows.push([
          h,
          contrast(`var(--dd-${h})`, `var(--dd-${h}-tint)`),
          contrast(`var(--dd-${h})`, `var(--dd-bg)`),
        ]);
      }
      const body = rows
        .map(([h, onTint, onBg]) => {
          const mark = (v, t) =>
            `<td class="num" style="color:var(--dd-${v >= t ? "green" : "red"})">${v.toFixed(2)}</td>`;
          return `<tr>
            <td class="tight"><span class="chip tone-${h}">${h}</span></td>
            ${mark(onTint, 4.5)}
            ${mark(onBg, 4.5)}
          </tr>`;
        })
        .join("");
      return `
        <div class="table-wrap" style="max-width:520px">
          <table>
            <thead><tr>
              <th>hue</th>
              <th class="num">on its tint <span class="count">AA 4.5</span></th>
              <th class="num">on the page <span class="count">AA 4.5</span></th>
            </tr></thead>
            <tbody>${body}</tbody>
          </table>
        </div>`;
    }),
};

import { html, HUES, STATES } from "./helpers.js";

export default {
  title: "Foundations/Colour",
  parameters: {
    docs: {
      description: {
        component:
          "Two layers. The palette names the hues; the roles say what each one " +
          "is for. Nothing outside the palette declares a raw colour, so a hue " +
          "is defined once and every role that shares it does so on purpose.",
      },
    },
  },
};

const NEUTRALS = ["bg", "surface", "sunken", "raised", "hover", "hair", "rule", "dim", "sub", "ink"];

function swatch(token, note) {
  return `
    <div style="display:grid;grid-template-columns:44px 1fr;gap:12px;align-items:center">
      <div style="height:44px;border-radius:6px;background:var(--dd-${token});border:1px solid var(--dd-border)"></div>
      <div>
        <div style="font-family:var(--dd-font-mono);font-size:12px">--dd-${token}</div>
        <div style="font-size:11px;color:var(--dd-fg-subtle)">${note}</div>
      </div>
    </div>`;
}

/**
 * The neutrals carry the page: what it is made of and what is written on it.
 * They are the report sheet's own values, which is what the three consuming
 * projects have in common before anything is coloured.
 */
export const Neutrals = {
  render: () => html`
    <div class="sb-grid" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr))">
      ${NEUTRALS.map((t) => swatch(t, "")).join("")}
    </div>`,
};

/**
 * Identity hues say what a thing **is** — a SELECT, a trait, a layer. They
 * carry no judgement, so a page full of them is not a page full of warnings.
 * Blue, violet, amber and slate come from the report sheet; teal, pink and
 * indigo were added for the catalog genre, which has more kinds than the
 * report has accents.
 */
export const Identity = {
  render: () => html`
    <div class="sb-grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">
      ${HUES.map(
        (h) => `
        <div>
          ${swatch(h, `tone-${h}`)}
          <div class="sb-row" style="margin-top:8px">
            <span class="chip tone-${h}">chip</span>
            <span class="chip chip-sm tone-${h}">sm</span>
            <span class="chip chip-ghost tone-${h}">ghost</span>
          </div>
        </div>`
      ).join("")}
    </div>`,
};

/**
 * State hues say how a thing is **going**. Green, gold and red only — and red
 * is never reused for syntax highlighting, so the one red on a page always
 * means something wants looking at.
 */
export const State = {
  render: () => html`
    <div class="sb-grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">
      ${STATES.map(
        (s) => `
        <div>
          ${swatch(s, `tone-${s}`)}
          <div class="sb-row" style="margin-top:8px">
            <span class="chip tone-${s}">${s}</span>
          </div>
        </div>`
      ).join("")}
    </div>`,
};

/**
 * Tints are derived, not written out: each is its hue mixed into the page
 * background in oklab. The stylesheets this replaces carried twenty hand-picked
 * tint hexes two themes deep, which is twenty chances for a hue to drift away
 * from its own wash. The mix leans heavier in dark, where the hues are light
 * and a pale wash would read as a block of colour.
 */
export const Tints = {
  render: () => html`
    <div class="sb-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">
      ${[...HUES, "green", "yellow", "red"]
        .map(
          (h) => `
        <div style="border:1px solid var(--dd-border);border-radius:6px;overflow:hidden">
          <div style="height:40px;background:var(--dd-${h})"></div>
          <div style="height:40px;background:var(--dd-${h}-tint);display:flex;align-items:center;justify-content:center;color:var(--dd-${h});font-weight:600;font-size:12px">
            ${h}
          </div>
        </div>`
        )
        .join("")}
    </div>`,
};

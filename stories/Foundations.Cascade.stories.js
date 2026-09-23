import { html } from "./helpers.js";

export default {
  title: "Foundations/Cascade",
  parameters: {
    docs: {
      description: {
        component:
          "How this system decides who wins — and why that lets the class names " +
          "stay plain. This is a foundation, not a build detail: it is the " +
          "reason `.chip` is called `.chip`.",
      },
    },
  },
};

/**
 * Six sublayers, in this order. Later beats earlier, regardless of selector
 * shape — which is why `.prose h2` (component) overrides `.doc h2` (layout)
 * without either one having to know the other exists.
 *
 * ```css
 * @layer dd.reset, dd.tokens, dd.base, dd.layout,
 *        dd.component, dd.utility, dd.print;
 * ```
 */
export const Layers = {
  render: () => html`
    <div class="definitions" style="max-width:720px">
      ${[
        ["dd.reset", "box-sizing, margins, the focus ring, reduced motion"],
        ["dd.tokens", "the palette, the roles, the scales, the theme switch"],
        ["dd.base", "type, the tone modifiers, the skip link"],
        ["dd.layout", "the two genres and the arrangements they share"],
        ["dd.component", "everything with a name: chip, table, prose, diff…"],
        ["dd.utility", "single-purpose overrides"],
        ["dd.print", "last, so it beats anything a component says"],
      ]
        .map(([n, what]) => `<div><dt><code>${n}</code></dt><dd>${what}</dd></div>`)
        .join("")}
    </div>`,
};

/**
 * Anything you write outside a layer beats everything in one, however
 * specific the layered selector is. That is the whole override story: no
 * `!important`, no specificity ladder, and no defensive prefix on the class
 * names to stay out of your way.
 *
 * The chip below is restyled by a plain one-line rule that would lose to
 * `.doc .card h2` under ordinary specificity.
 */
export const Overriding = {
  render: () => html`
    <div>
      <style>
        /* unlayered — beats everything in @layer dd */
        .sb-override .chip { border-radius: 3px; font-weight: 400; letter-spacing: .04em; }
      </style>
      <p class="sb-label">as shipped</p>
      <div class="sb-row" style="margin-bottom:24px">
        <span class="chip tone-blue">SELECT</span>
        <span class="chip tone-teal">INSERT</span>
      </div>
      <p class="sb-label">with one unlayered rule</p>
      <div class="sb-row sb-override">
        <span class="chip tone-blue">SELECT</span>
        <span class="chip tone-teal">INSERT</span>
      </div>
    </div>`,
};

/**
 * To sit *between* two of the library's layers rather than above all of them,
 * re-declare the order first. The names are stable and part of the contract.
 *
 * ```css
 * @layer dd.tokens, dd.base, mine, dd.component;
 *
 * @layer mine {
 *   .chip { … }   ·  loses to dd.component, beats dd.base
 * }
 * ```
 */
export const Inserting = { render: () => html`<div class="muted">See the description.</div>` };

/**
 * Custom properties are the exception, and the reason they carry `--dd-`.
 *
 * A custom property inherits through the whole document. Neither `@layer` nor
 * `@scope` contains one, so `--bg` declared here and `--bg` declared by you
 * would be the same property, and whichever won the cascade would decide for
 * both. They are also the theming API, and an API wants a name that stays out
 * of the way.
 *
 * Retheming is therefore a `:root` rule, not an override:
 *
 * ```css
 * :root { --dd-accent: var(--dd-teal); }
 * ```
 */
export const Retheming = {
  render: () => html`
    <div>
      <style>.sb-teal { --dd-accent: var(--dd-teal); --dd-link: var(--dd-teal); }</style>
      <p class="sb-label">default</p>
      <div style="margin-bottom:24px">
        <div class="meter" style="max-width:320px"><span class="meter-part tone-accent" style="--dd-part:64%"></span></div>
        <a href="#">a link, and the accent</a>
      </div>
      <p class="sb-label">:root { --dd-accent: var(--dd-teal) }</p>
      <div class="sb-teal">
        <div class="meter" style="max-width:320px"><span class="meter-part tone-accent" style="--dd-part:64%"></span></div>
        <a href="#">a link, and the accent</a>
      </div>
    </div>`,
};

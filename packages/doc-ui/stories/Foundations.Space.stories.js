import { html } from "./helpers.js";

export default {
  title: "Foundations/Space",
  parameters: {
    docs: {
      description: {
        component:
          "Two scales, because there are two reading speeds. A catalog is " +
          "scanned and wants density; a report is read straight through and " +
          "wants air. One scale cannot do both without costing one of them the " +
          "thing that makes it work.",
      },
    },
  },
};

const STEPS = [
  ["sp-1", 2, "hairline nudge: a chip's optical baseline"],
  ["sp-2", 4, "between two chips"],
  ["sp-3", 8, "inside a control, between a label and its value"],
  ["sp-4", 12, "a table cell, a card's inner padding"],
  ["sp-5", 18, "between paragraphs, between cards"],
  ["sp-6", 28, "the content gutter; between sections"],
  ["sp-7", 40, "above a heading that starts a new band"],
  ["sp-8", 64, "the foot of a page"],
];

/** The catalog's steps. Small, and there are many of them, because the
 *  distances here separate a row from its metadata rather than a title from a
 *  paragraph. */
export const CatalogScale = {
  render: () => html`
    <div>
      ${STEPS.map(
        ([name, px, use]) => `
        <div style="display:flex;gap:16px;align-items:center;padding:6px 0;border-bottom:1px solid var(--dd-border)">
          <code style="min-width:100px">--dd-${name}</code>
          <span class="count" style="min-width:42px;text-align:right">${px}px</span>
          <span style="height:14px;width:${px}px;background:var(--dd-accent);border-radius:2px;flex:none"></span>
          <span class="muted" style="font-size:12px">${use}</span>
        </div>`
      ).join("")}
    </div>`,
};

/**
 * The report's baseline. One unit is 28px and **every block gap is a multiple
 * of it** — that is the whole rhythm. A section is 3 baselines from the one
 * above; a lead is 1.5 from its figure; a caveat is 1 from the text it
 * corrects.
 *
 * The reason to keep to multiples is that a report is a single vertical
 * argument. Once two gaps are 28px and 34px, the reader cannot tell whether
 * the 34 means something.
 */
export const ReportRhythm = {
  render: () => html`
    <div>
      ${[
        [0.5, "inside a hero block: cap to figure"],
        [1, "after a heading; a caveat from its text"],
        [1.5, "a lead from the figure it introduces"],
        [2, "the foot of the hero"],
        [3, "between sections"],
        [4, "the top of the sheet"],
      ]
        .map(
          ([n, use]) => `
        <div style="display:flex;gap:16px;align-items:center;padding:6px 0;border-bottom:1px solid var(--dd-border)">
          <code style="min-width:150px">--dd-base * ${n}</code>
          <span class="count" style="min-width:48px;text-align:right">${28 * n}px</span>
          <span style="height:14px;width:${28 * n}px;background:var(--dd-accent);border-radius:2px;flex:none"></span>
          <span class="muted" style="font-size:12px">${use}</span>
        </div>`
        )
        .join("")}
    </div>`,
};

/** The same content, at both densities. This is the whole argument for having
 *  two scales rather than one. */
export const Density = {
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:32px">
      <div>
        <p class="sb-label">Catalog — scanned</p>
        <div class="doc" style="min-height:0;border:1px solid var(--dd-border);border-radius:6px">
          <div class="main"><main class="content" style="padding:18px">
            <h2 style="margin-top:0">Findings<span class="count">978</span></h2>
            <ul class="peek">
              <li><a href="#">dynamic-sql</a><span class="peek-figures">709</span></li>
              <li><a href="#">analysis-incomplete</a><span class="peek-figures">239</span></li>
              <li><a href="#">unresolved-sql</a><span class="peek-figures">25</span></li>
              <li><a href="#">call-not-analyzed</a><span class="peek-figures">5</span></li>
            </ul>
          </main></div>
        </div>
      </div>
      <div>
        <p class="sb-label">Report — read</p>
        <div style="border:1px solid var(--dd-border);border-radius:6px;overflow:hidden">
          <article class="sheet" style="padding:28px">
            <p class="eyebrow">findings</p>
            <p class="lead" style="margin-bottom:14px">709 のうち 1 件だけが本当の穴。</p>
            <p class="note">残りは解析が届かなかった箇所で、実装の問題ではない。</p>
          </article>
        </div>
      </div>
    </div>`,
};

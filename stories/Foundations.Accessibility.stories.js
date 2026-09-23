import { html } from "./helpers.js";

export default {
  title: "Foundations/Accessibility",
  parameters: {
    docs: {
      description: {
        component:
          "Most of what matters here is not an add-on: it is the same rule as " +
          "\"these pages get printed\". A mark that survives a monochrome " +
          "printer survives colour blindness, and a page that works with the " +
          "behaviour layer removed works with a screen reader.",
      },
    },
  },
};

/**
 * **Every mark says it twice.** Colour is never the only carrier — there is
 * always a character, a weight, a dash pattern or a border doing the same job.
 */
export const RedundantEncoding = {
  render: () => html`
    <div class="sb-grid" style="gap:24px;max-width:680px">
      <div>
        <p class="sb-label">diff — a character, not just a tint</p>
        <pre class="code diff" style="margin:0"><span class="dl dl-add">+ public function build(): Statement</span>
<span class="dl dl-del">- public function build(): string</span>
<span class="dl dl-mod">~ @throws QueryException</span></pre>
      </div>
      <div>
        <p class="sb-label">facets — an outline, not just more opacity</p>
        <div class="sb-row">
          <button class="chip facet tone-blue is-on">SELECT<span class="facet-count">639</span></button>
          <button class="chip facet tone-teal">INSERT<span class="facet-count">35</span></button>
        </div>
      </div>
      <div>
        <p class="sb-label">graph — a dash pattern, not just a hue</p>
        <div class="graph-legend">
          <span><svg viewBox="0 0 28 8"><path class="edge" d="M1 4H27"/></svg> allowed</span>
          <span><svg viewBox="0 0 28 8"><path class="edge edge-dev" d="M1 4H27"/></svg> dev only</span>
          <span><svg viewBox="0 0 28 8"><path class="edge edge-bad" d="M1 4H27"/></svg> violation</span>
        </div>
      </div>
      <div>
        <p class="sb-label">absence — dashed, not merely pale</p>
        <div class="sb-row">
          <span class="hole">…unresolved</span>
          <span class="hole tone-danger">…external</span>
        </div>
      </div>
    </div>`,
};

/** One focus ring, on `:focus-visible` only — so a mouse click leaves nothing
 *  behind but a Tab key always shows where it went. Declared in `:where()`, so
 *  it carries no specificity and a component can restate it without a fight.
 *
 *  Tab through the controls below. */
export const Focus = {
  render: () => html`
    <div class="sb-row" style="gap:12px">
      <a href="#">a link</a>
      <button class="btn">a button</button>
      <input class="field-input" placeholder="an input">
      <span class="chip tone-blue" tabindex="0">a focusable chip</span>
    </div>`,
};

/**
 * The skip link. A catalog page puts a sidebar of a hundred links before its
 * content — for anyone tabbing through, or hearing the page read, that is a
 * hundred items between arriving and reading, on every page of the catalog.
 *
 * Press Tab with the frame below focused.
 */
export const SkipLink = {
  render: () => html`
    <div class="doc" style="min-height:0;border:1px solid var(--dd-border);position:relative">
      <a class="skip" href="#sk-content">Skip to content</a>
      <nav class="sidebar" style="height:180px;position:static">
        <div class="sb-block">
          <p class="sb-title">Browse</p>
          <ul class="sb-list">
            <li><a href="#">Overview</a></li>
            <li><a href="#">Statements</a><span class="sb-count">844</span></li>
            <li><a href="#">Tables</a><span class="sb-count">12</span></li>
          </ul>
        </div>
      </nav>
      <div class="main">
        <main class="content" id="sk-content" tabindex="-1" style="padding:18px">
          <h2 style="margin-top:0">Content</h2>
          <p class="muted">The skip link lands here.</p>
        </main>
      </div>
    </div>`,
};

/**
 * Tables carry their sort state in `aria-sort`, tabs implement the tab pattern
 * with arrow keys, facets are `aria-pressed` buttons, and the disclosure and
 * tree components are built on native `<details>` — which is keyboard
 * reachable and screen-reader announced without anyone writing a handler.
 */
export const Semantics = {
  render: () => html`
    <div class="defs" style="max-width:720px">
      <div><dt><code>aria-sort</code></dt><dd>set on the sorted column header by the behaviour layer</dd></div>
      <div><dt><code>aria-pressed</code></dt><dd>on every facet, reflecting whether it is narrowing the listing</dd></div>
      <div><dt><code>role="tab"</code> + arrows</dt><dd>only the selected tab is in the tab order</dd></div>
      <div><dt><code>&lt;details&gt;</code></dt><dd>disclosure and tree — no JavaScript, no ARIA to get wrong</dd></div>
      <div><dt><code>.sr-only</code></dt><dd>for a label the layout has no room for</dd></div>
      <div><dt><code>title</code> + <code>.hint</code></dt><dd>always an addition; anything the reader must have is on the page,
        because a tooltip cannot be reached by touch, find-in-page or print</dd></div>
    </div>`,
};

/** The system animates a disclosure triangle and a tooltip. Both stop under
 *  `prefers-reduced-motion`, along with smooth scrolling. */
export const Motion = {
  render: () => html`
    <details class="disclosure disclosure-boxed" style="max-width:420px">
      <summary>The only animation in the system<span class="count">1</span></summary>
      <div class="disclosure-body muted">A 120ms rotation, and a 100ms fade on tooltips.</div>
    </details>`,
};

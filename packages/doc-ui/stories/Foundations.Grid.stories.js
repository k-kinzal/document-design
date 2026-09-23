import { html } from "./helpers.js";

export default {
  title: "Foundations/Grid",
  parameters: {
    docs: {
      description: {
        component:
          "Two frames, because there are two genres. The catalog frame is a " +
          "fixed rail and a fluid column; the report sheet is twelve columns " +
          "with a 24px gutter.",
      },
    },
  },
};

/**
 * The catalog frame. A 260px rail that does not move, and a column that takes
 * the rest up to 1180px.
 *
 * The rail is fixed rather than proportional because it stats names — a
 * namespace, a file path — and a column that changes width changes where every
 * name clips, which makes the same sidebar look different on every screen.
 */
export const CatalogFrame = {
  render: () => html`
    <div class="doc" style="min-height:0;border:1px solid var(--dd-border)">
      <nav class="sidebar" style="height:auto;position:static;display:flex;align-items:center;justify-content:center">
        <code style="font-size:11px">260px · --dd-sidebar-width</code>
      </nav>
      <div class="main">
        <header class="topbar" style="position:static;justify-content:center">
          <code style="font-size:11px">--dd-topbar-height 46px · sticky</code>
        </header>
        <main class="content" style="padding:28px;background:var(--dd-surface)">
          <code style="font-size:11px">.content — fluid to --dd-content-max 1180px, gutter --dd-sp-6</code>
        </main>
      </div>
    </div>`,
};

/**
 * The report sheet. Twelve columns, 24px gutter, 1128px maximum.
 *
 * A section's name sits in columns 1–2 and its content in 4–12, so the eye
 * finds the names down the left edge without them crowding the text. Column 3
 * is deliberately empty: it is the gap that makes the left edge read as a
 * margin rather than as a first column.
 */
export const SheetGrid = {
  render: () => html`
    <article class="sheet" style="padding-top:28px;padding-bottom:28px;position:relative">
      <div style="grid-column:1/-1;display:grid;grid-template-columns:subgrid;margin-bottom:24px">
        ${Array.from({ length: 12 }, (_, i) =>
          `<div style="grid-column:${i + 1};background:var(--dd-blue-tint);border:1px solid var(--dd-blue);border-radius:3px;height:120px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;font-size:10px;color:var(--dd-blue);font-family:var(--dd-font-mono)">${i + 1}</div>`
        ).join("")}
      </div>
      <section class="sec" style="margin-top:0">
        <div class="label">01<br>label</div>
        <div class="field">
          <p class="lead" style="margin-bottom:8px">The field starts at column 4.</p>
          <p class="note">The label occupies 1–2. Column 3 is the gap that turns the
             left edge into a margin instead of a first column.</p>
        </div>
      </section>
    </article>`,
};

/**
 * Children use `grid-template-columns: subgrid` rather than a grid of their
 * own. That is what keeps a row of three figures in the middle of a section
 * on the same column lines as the paragraph above it — a nested grid would
 * divide the field into thirds, which are not the sheet's thirds.
 */
export const Subgrid = {
  render: () => html`
    <article class="sheet" style="padding-top:28px;padding-bottom:28px">
      <section class="sec" style="margin-top:0">
        <div class="label">02<br>subgrid</div>
        <div class="field">
          <p class="lead">The three below sit on the sheet's columns, not on their own.</p>
        </div>
        <div class="figures">
          <figure><h3>4 – 6</h3><p>First of the row.</p></figure>
          <figure><h3>7 – 9</h3><p>Second.</p></figure>
          <figure><h3>10 – 12</h3><p>Third. A fourth would start the next row.</p></figure>
        </div>
      </section>
    </article>`,
};

/** Both frames fold at the same two points. Under 900px the rail leaves the
 *  flow; under 720px the sheet collapses to one column. */
export const Breakpoints = {
  render: () => html`
    <div class="definitions" style="max-width:640px">
      <div><dt><code>900px</code></dt><dd>The sidebar leaves the flow and opens over the page.
        It stays in the DOM in its reading order, so a screen reader and a keyboard
        still reach it in the same place. Facets stop being sticky.</dd></div>
      <div><dt><code>720px</code></dt><dd>The sheet drops to a single column; the hero's
        arrow is removed rather than stacked, because an arrow pointing down the page
        says something different from one pointing across it.</dd></div>
    </div>`,
};

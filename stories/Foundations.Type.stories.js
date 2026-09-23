import { html, specimen } from "./helpers.js";

export default {
  title: "Foundations/Type",
  parameters: {
    docs: {
      description: {
        component:
          "Three registers and two scales. System fonts throughout: a generated " +
          "document should render before it has fetched anything, and a webfont " +
          "is a network request a page opened from disk will never complete.",
      },
    },
  },
};

/** The catalog scale. Five steps, all small, because the sizes here separate a
 *  row from its metadata rather than a title from a paragraph. */
export const CatalogScale = {
  render: () => html`
    <div>
      ${[
        ["xs", "a count, a path, a facet's number"],
        ["sm", "a table header, a caption, code"],
        ["md", "a table cell, a card's hint, a sidebar entry"],
        ["lg", "the catalog's body text"],
        ["xl", "rarely — a figure that is not a report's figure"],
      ]
        .map(
          ([s, use]) => `
        <div style="display:flex;gap:16px;align-items:baseline;padding:8px 0;border-bottom:1px solid var(--dd-border)">
          <code style="min-width:130px">--dd-text-${s}</code>
          <span style="font-size:var(--dd-text-${s});flex:1">仕様が出典に触れていなかった · Statements 844</span>
          <span class="count" style="max-width:220px;text-align:right">${use}</span>
        </div>`
        )
        .join("")}
    </div>`,
};

/**
 * The report scale: a major third (1.25) from a 16px base. The top of it is
 * for the one figure a report leads with — using step 8 or 9 twice on a page
 * means neither use was the point.
 */
export const ReportScale = {
  render: () => html`
    <div>
      ${[
        [1, "a caveat, a figure's caption"],
        [2, "the report's body text"],
        [3, "a stand-first, a card's heading"],
        [4, "a lead: the sentence a section argues"],
        [5, "—"],
        [6, "a claim, where words replace a number"],
        [7, "a stat tile's figure"],
        [8, "the title"],
        [9, "the one number the page is about"],
      ]
        .map(
          ([s, use]) => `
        <div style="display:flex;gap:16px;align-items:baseline;padding:6px 0;border-bottom:1px solid var(--dd-border)">
          <code style="min-width:110px">--dd-type-${s}</code>
          <span style="font-size:var(--dd-type-${s});line-height:1.1;letter-spacing:-0.02em;flex:1">挙動がある単位</span>
          <span class="count" style="max-width:200px;text-align:right">${use}</span>
        </div>`
        )
        .join("")}
    </div>`,
};

/**
 * Three registers, and which one a line is in carries meaning.
 *
 * **Sans** is prose — what a person wrote. **Mono** is a name the machine
 * knows: an identifier, a path, a statement. **Tabular** is a number meant to
 * be compared down a column.
 *
 * Mixing them up is how a catalog becomes unreadable: a file path set in
 * proportional type cannot be scanned for the segment that differs from the
 * row above it.
 */
export const Registers = {
  render: () => html`
    <div class="sb-grid" style="gap:20px;max-width:680px">
      ${specimen("sans — prose", `<p style="margin:0">A dependency the analyzer does not model was reached, so the call may issue more than is listed.</p>`)}
      ${specimen("mono — a name the machine knows", `<p class="mono" style="margin:0">wp-includes/class-wp-comment-query.php:412 · WP_Comment_Query::get_comments</p>`)}
      ${specimen("tabular — numbers to be compared", `<div class="table-wrap" style="max-width:260px"><table class="plain"><tr><td>dynamic-sql</td><td class="num">709</td></tr><tr><td>incomplete</td><td class="num">239</td></tr><tr><td>unresolved</td><td class="num">25</td></tr></table></div>`)}
      ${specimen("proportional — a number that is the point", `<span style="font-size:var(--dd-type-7);font-weight:700;letter-spacing:-.04em;color:var(--dd-accent);font-variant-numeric:proportional-nums">96.67</span>`)}
    </div>`,
};

/**
 * Japanese setting. `palt` closes the gaps around latin set inside Japanese,
 * which otherwise reads as holes in the line; `line-break: strict` keeps small
 * kana and closing brackets off the start of a line.
 *
 * `overflow-wrap: anywhere` is the one thing that stops a long identifier — a
 * namespace, a table name, a URL — from pushing a sidebar or a table cell
 * wider than the viewport.
 */
export const JapaneseSetting = {
  render: () => html`
    <div style="max-width:40ch">
      ${specimen(
        "as shipped — palt on, strict line breaking",
        `<p style="font-feature-settings:'palt' 1;line-break:strict;margin:0">出典 29/30 のうち SYMBOL-009 と RULE-007 は Behat のシナリオへ結んだ。</p>`
      )}
      ${specimen(
        "without palt — note the gaps around the latin",
        `<p style="font-feature-settings:normal;margin:0">出典 29/30 のうち SYMBOL-009 と RULE-007 は Behat のシナリオへ結んだ。</p>`
      )}
    </div>`,
};

/** Prose is held at 72ch. A README set to the full width of a catalog's
 *  content column runs to about 140 characters a line, at which point the eye
 *  loses its place returning to the left edge. */
export const Measure = {
  render: () => html`
    <div>
      <p class="sb-label">.prose — 72ch</p>
      <div class="prose" style="border-left:2px solid var(--dd-accent);padding-left:16px">
        <p>A PHPStan extension that detects anti-patterns commonly introduced by AI
           code generation, plus output formatters optimized for both AI agents and
           humans. The reporter groups errors by file and by identifier, and
           deduplicates once an identifier passes a threshold.</p>
      </div>
      <p class="sb-label" style="margin-top:24px">the same text, unconstrained</p>
      <div class="prose prose-wide" style="border-left:2px solid var(--dd-danger);padding-left:16px">
        <p>A PHPStan extension that detects anti-patterns commonly introduced by AI
           code generation, plus output formatters optimized for both AI agents and
           humans. The reporter groups errors by file and by identifier, and
           deduplicates once an identifier passes a threshold.</p>
      </div>
    </div>`,
};

/** Inline registers and the muted scale. */
export const Inline = {
  render: () => html`
    <div style="max-width:70ch">
      <p>A statement issued from <code>wpdb::query</code> is recorded against
         <code>{$}posts</code>, and the call site is shown as
         <span class="mono">wp-includes/post.php:1240</span>.</p>
      <p class="muted">Muted — context the reader can skip.</p>
      <p class="subtle">Subtle — a count, a timestamp, a path.</p>
      <p class="none">Nothing recorded</p>
      <p>Press <kbd>/</kbd> to search.</p>
    </div>`,
};

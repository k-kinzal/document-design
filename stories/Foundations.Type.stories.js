import { html, specimen } from "./helpers.js";

export default {
  title: "Foundations/Type",
  parameters: {
    docs: {
      description: {
        component:
          "Two scales, on purpose. A catalog is read by scanning and a report " +
          "is read straight through; one scale cannot serve both without " +
          "costing the catalog its density or the report its air.",
      },
    },
  },
};

/**
 * The catalog scale. Small steps, because the sizes here separate a row from
 * its metadata rather than a title from a paragraph.
 */
export const CatalogScale = {
  render: () => html`
    <div>
      ${["xs", "sm", "md", "lg", "xl"]
        .map(
          (s) => `
        <div style="display:flex;gap:16px;align-items:baseline;padding:6px 0;border-bottom:1px solid var(--dd-border)">
          <code style="min-width:130px">--dd-text-${s}</code>
          <span style="font-size:var(--dd-text-${s})">仕様が出典に触れていなかった Statements 844</span>
        </div>`
        )
        .join("")}
    </div>`,
};

/**
 * The report scale: a major third from a 16px base. The top of it is only for
 * the one figure a report leads with; using step 8 twice on a page means
 * neither use was the point.
 */
export const ReportScale = {
  render: () => html`
    <div>
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9]
        .map(
          (s) => `
        <div style="display:flex;gap:16px;align-items:baseline;padding:6px 0;border-bottom:1px solid var(--dd-border)">
          <code style="min-width:120px">--dd-type-${s}</code>
          <span style="font-size:var(--dd-type-${s});line-height:1.1;letter-spacing:-0.02em">挙動がある単位</span>
        </div>`
        )
        .join("")}
    </div>`,
};

/**
 * Japanese setting. `palt` closes the gaps around latin set inside Japanese,
 * which otherwise reads as holes in the line; strict line breaking keeps small
 * kana and closing brackets off the start of a line.
 */
export const JapaneseSetting = {
  render: () => html`
    <div style="max-width:40ch">
      ${specimen(
        "font-feature-settings: 'palt' 1 (as shipped)",
        `<p style="font-feature-settings:'palt' 1;line-break:strict;margin:0">
           出典 29/30 のうち SYMBOL-009 と RULE-007 は Behat のシナリオへ結んだ。
         </p>`
      )}
      ${specimen(
        "without palt — note the gaps around the latin",
        `<p style="font-feature-settings:normal;margin:0">
           出典 29/30 のうち SYMBOL-009 と RULE-007 は Behat のシナリオへ結んだ。
         </p>`
      )}
    </div>`,
};

/** Inline code, `.mono`, and the muted registers. */
export const Inline = {
  render: () => html`
    <div style="max-width:70ch">
      <p>A statement issued from <code>wpdb::query</code> is recorded against
         <code>{$}posts</code>, and the call site is shown as
         <span class="mono">wp-includes/post.php:1240</span>.</p>
      <p class="muted">Muted: context the reader can skip.</p>
      <p class="subtle">Subtle: a count, a timestamp, a path.</p>
      <p class="none">Nothing recorded</p>
      <p>Press <kbd>/</kbd> to search.</p>
    </div>`,
};

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
 * Japanese setting — the part that is a decision rather than a default.
 *
 * `palt` closes the loose gaps the font leaves around latin set inside
 * Japanese. That is right for something **looked at** — a title, a lead, a
 * label — where those gaps read as holes punched in a short line.
 *
 * It is wrong for something **read through**. Closing the gaps also flattens
 * the density difference between kanji and kana, and that alternation of dark
 * and light is what the eye follows down a paragraph. Tightened, Japanese
 * prose becomes evener and harder to keep your place in.
 *
 * So it is applied by role, not globally: headings, leads, figures and labels
 * get `palt` and `font-kerning: normal`; prose, cells and listings are left as
 * the font designed them (ベタ組). It used to sit on `<body>`, which meant
 * every line on every page was set the display way.
 *
 * `line-break: strict` applies everywhere — keeping small kana and closing
 * brackets off the start of a line is correctness, not taste.
 */
export const JapaneseSetting = {
  render: () => html`
    <div class="sb-grid" style="gap:28px;max-width:46ch">
      ${specimen(
        "heading \u2014 palt on, as shipped",
        `<p style="font-size:25px;font-weight:600;line-height:1.45;margin:0;font-feature-settings:'palt' 1;font-kerning:normal;letter-spacing:-0.025em">出典 29/30 · ゲート 96 / 93 / 100 は Behat へ</p>`
      )}
      ${specimen(
        "the same heading without palt \u2014 holes around the latin",
        `<p style="font-size:25px;font-weight:600;line-height:1.45;margin:0;font-feature-settings:normal;letter-spacing:-0.025em">出典 29/30 · ゲート 96 / 93 / 100 は Behat へ</p>`
      )}
      ${specimen(
        "prose \u2014 no palt, as shipped (ベタ組)",
        `<p style="margin:0;font-feature-settings:normal;line-break:strict">未カバーの9単位を調べたところ、8つは仕様が出典に触れていない箇所だった。残る1つは導入文で、挙動がない。これは空のまま残す。水増しはしない。</p>`
      )}
      ${specimen(
        "the same prose with palt \u2014 evener, and harder to hold your place in",
        `<p style="margin:0;font-feature-settings:'palt' 1;line-break:strict">未カバーの9単位を調べたところ、8つは仕様が出典に触れていない箇所だった。残る1つは導入文で、挙動がない。これは空のまま残す。水増しはしない。</p>`
      )}
    </div>`,
};

/**
 * Tracking is optical, not arithmetic. The same letter-spacing is too loose on
 * a 76px figure and too tight on a 12px tracked label, because the space
 * between letters is judged relative to their size. Large type wants it taken
 * away; small capitals want it given back.
 *
 * Six bands, so a component inherits the adjustment instead of deriving it
 * again by eye — which is how this became eight unrelated negative values and
 * four positive ones.
 */
export const Tracking = {
  render: () => html`
    <div>
      ${[
        ["display", "-0.04em", "45px and up \u2014 a figure, a report title", 49, 700, false],
        ["large", "-0.025em", "25\u201344px \u2014 a lead, a claim", 31, 600, false],
        ["head", "-0.01em", "16\u201324px \u2014 a heading, a stand-first", 20, 650, false],
        ["body", "0", "14\u201316px \u2014 prose; Japanese wants no more", 16, 400, false],
        ["label", "0.06em", "small uppercase \u2014 a rail label", 12, 700, true],
        ["eyebrow", "0.16em", "the most tracked \u2014 an eyebrow, a cap", 13, 600, true],
      ]
        .map(
          ([name, value, use, size, weight, caps]) => `
        <div style="display:flex;gap:16px;align-items:baseline;padding:10px 0;border-bottom:1px solid var(--dd-border)">
          <code style="min-width:170px">--dd-track-${name}</code>
          <span class="count" style="min-width:64px">${value}</span>
          <span style="flex:1;font-size:${size}px;font-weight:${weight};letter-spacing:var(--dd-track-${name});${caps ? "text-transform:uppercase;" : ""}">挙動がある単位 Behat</span>
          <span class="count" style="max-width:210px;text-align:right">${use}</span>
        </div>`
        )
        .join("")}
    </div>`,
};

/** The measure, counted in characters — which is the unit the limit is in. */
export const Measure = {
  render: () => html`
    <div>
      <p class="sb-label">--dd-measure — 36ric = 36 和文字 = 77 latin</p>
      <div class="prose" lang="ja" style="border-left:2px solid var(--dd-accent);padding-left:16px">
        <p>出典 29 単位のうち 9 が空だった。到達点は 96.67 であり、100 は非対応への
           付け替えで作らない。行が長すぎるのは、行末から次の行頭へ目が戻れなくなる
           からで、その限界は px ではなく文字数で数える。</p>
      </div>

      <p class="sb-label" style="margin-top:24px">the same rule, latin</p>
      <div class="prose" style="border-left:2px solid var(--dd-accent);padding-left:16px">
        <p>A PHPStan extension that detects anti-patterns commonly introduced by AI
           code generation, plus output formatters optimized for both AI agents and
           humans. The reporter groups errors by file and by identifier, and
           deduplicates once an identifier passes a threshold.</p>
      </div>

      <p class="sb-label" style="margin-top:24px">unconstrained — 45 和文字 / 99 latin at the old 72ch, and worse in a wide column</p>
      <div class="prose prose-wide" style="border-left:2px solid var(--dd-danger);padding-left:16px">
        <p>A PHPStan extension that detects anti-patterns commonly introduced by AI
           code generation, plus output formatters optimized for both AI agents and
           humans. The reporter groups errors by file and by identifier, and
           deduplicates once an identifier passes a threshold.</p>
      </div>

      <p class="sb-label" style="margin-top:24px">the three widths</p>
      <div class="prose">
        <p>Running text stops at the measure. What is looked at rather than swept may leave it.</p>
        <figure class="plate plate-unnumbered"><div style="height:8px;background:var(--dd-accent-tint);border:1px solid var(--dd-accent)"></div>
          <figcaption>--dd-measure · 36ric · a paragraph</figcaption></figure>
        <figure class="plate plate-unnumbered plate-wide"><div style="height:8px;background:var(--dd-accent-tint);border:1px solid var(--dd-accent)"></div>
          <figcaption>--dd-measure-wide · 48ric · a drawing, a wide table, a code block</figcaption></figure>
        <figure class="plate plate-unnumbered plate-full"><div style="height:8px;background:var(--dd-accent-tint);border:1px solid var(--dd-accent)"></div>
          <figcaption>.plate-full · the whole column</figcaption></figure>
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

import { html, drawDefs } from './helpers.js';

export default {
  title: "Layouts/Report sheet",
  parameters: {
    docs: {
      description: {
        component:
          "One page, read straight through, that says what changed and what it " +
          "cost. Twelve columns, 24px gutter, and a 28px baseline that every " +
          "block gap is a multiple of. A section's name sits in columns 1–2 and " +
          "its content in 4–12, so the eye finds the names down the left edge " +
          "without them crowding the text.",
      },
    },
  },
};

/** The masthead and the one figure the page leads with. */
export const Masthead = {
  render: () => html`
    ${drawDefs}
    <article class="sheet" lang="en">
      <p class="eyebrow">Change rationale · bison-parser source coverage</p>
      <h1>Link the units<br>with behaviour</h1>
      <p class="stand">The gaps were in the links between specifications and sources. The implementation was present. The introduction remains uncovered.</p>
      <div class="hero">
        <div class="was">
          <span class="cap">BEFORE</span>
          <span class="fig">68.97</span>
          <span class="unit">Sources 20/29 · Gates 68 / 57 / 80</span>
        </div>
        <div class="mid">
          <svg class="draw" style="--dd-draw-width:56px" viewBox="0 0 56 16" aria-hidden="true">
            <path class="draw-line draw-arrow tone-accent" d="M2 8H54"/>
          </svg>
        </div>
        <div class="now">
          <span class="cap">AFTER</span>
          <span class="fig">96.67</span>
          <span class="unit">Sources 29/30 · Gates 96 / 93 / 100 · Honest ceiling</span>
        </div>
      </div>
    </article>`,
};

/**
 * Most changes have no number worth showing. Forced into one anyway, a page
 * leads with a count nobody asked about and spends its largest type saying the
 * least interesting true thing about the work. `.claim` takes the same slot
 * and carries a phrase instead — in ink, because the accent belongs to the mark.
 */
export const ClaimInsteadOfFigure = {
  render: () => html`
    ${drawDefs}
    <article class="sheet" lang="en">
      <p class="eyebrow">Change rationale · Parser structure</p>
      <h1>Read in<br>one place</h1>
      <div class="hero">
        <div class="was">
          <span class="cap">BEFORE</span>
          <span class="claim">Read separately<br>in 3 places</span>
        </div>
        <div class="mid">
          <svg class="draw" style="--dd-draw-width:56px" viewBox="0 0 56 16" aria-hidden="true">
            <path class="draw-line draw-arrow tone-accent" d="M2 8H54"/>
          </svg>
        </div>
        <div class="now">
          <span class="cap">AFTER</span>
          <span class="claim">Only the reader<br>reads the input</span>
          <span class="unit">Callers: 12 → 1</span>
        </div>
      </div>
    </article>`,
};

/** A section: its name on the left, its content on the right, and a caveat at
 *  the end for something the reader would be wrong to assume still stats. */
export const Section = {
  render: () => html`
    <article class="sheet" lang="en">
      <section class="sec">
        <div class="label">02<br>Concept</div>
        <div class="field">
          <p class="lead">Count units with an interpretation. Unsupported units belong to the generated runtime.</p>
          <p class="note">Count supported units and explicitly justified unsupported units. Keep empty units visible;
            do not relabel them as unsupported.</p>
        </div>
        <div class="figures">
          <figure><h3>Counted units</h3><p>Units with an interpretation: verified support plus justified exclusions.</p></figure>
          <figure><h3>Keep gaps visible</h3><p>The introduction stays empty. Do not hide it behind an unsupported label.</p></figure>
          <figure><h3>Runtime exclusions</h3><p><code>BISON-RUNTIME-001–003</code> stay unchanged, outside the reader.</p></figure>
        </div>
        <p class="caveat">Link the three terminal forms, definitions, spellings, nonterminals, two example fragments, and ordinary actions to existing Behat scenarios.</p>
      </section>
    </article>`,
};

/** Direct section content keeps the same reading column as a field wrapper. */
export const DirectSectionContent = {
  render: () => html`
    <article class="sheet" lang="en">
      <section class="sec">
        <div class="rail"><h2 class="label">01 / Evidence</h2><p class="sidenote">WordPress SQL catalog. Findings can overlap within a statement.</p></div>
        <div class="field"><p class="lead">Keep the unresolved findings visible.</p></div>
        <div class="figures">
          <figure><h3>Statements</h3><p>The catalog contains 844 statements.</p></figure>
          <figure><h3>Findings</h3><p>The analysis reports 978 findings.</p></figure>
          <figure><h3>Dynamic SQL</h3><p>709 findings involve dynamic SQL.</p></figure>
          <figure><h3>Limits</h3><p>The count does not establish that every possible runtime query has been resolved.</p></figure>
        </div>
        <p class="note">Only 35 of 844 statements are fully resolved. This paragraph is a direct child of the section and follows the figures in the reading column.</p>
        <div class="compare">
          <div><h3>Count statements</h3><p class="note">A statement is one catalog entry.</p></div>
          <div><h3>Count findings</h3><p class="note">Several findings may describe the same entry.</p></div>
        </div>
      </section>
    </article>`,
};

/** Japanese regression specimen for text placed directly after a figure row. */
export const JapaneseDirectSectionContent = {
  render: () => html`
    <article class="sheet" lang="ja">
      <section class="sec">
        <h2 class="label">01 / 検証</h2>
        <div class="field"><p class="lead">未解決の指摘を隠さずに残す。</p></div>
        <div class="figures">
          <figure><h3>文</h3><p>WordPressのカタログには844件の文がある。</p></figure>
          <figure><h3>指摘</h3><p>解析では978件の指摘が報告されている。</p></figure>
          <figure><h3>動的SQL</h3><p>709件の指摘は動的SQLに関係する。</p></figure>
          <figure><h3>限界</h3><p>件数だけでは、実行時のすべてのSQLを解決したことにはならない。</p></figure>
        </div>
        <p class="note">完全に解決できたのは844件のうち35件。解析の範囲と残る限界も本文に記録する。</p>
        <div class="compare">
          <div><h3>文を数える</h3><p class="note">ひとつの文がカタログのひとつの項目になる。</p></div>
          <div><h3>指摘を数える</h3><p class="note">同じ文に複数の指摘が付くことがある。</p></div>
        </div>
      </section>
    </article>`,
};

/** Figures that are a number. Two to a row, and any number of them. */
export const Holds = {
  render: () => html`
    <article class="sheet" lang="en">
      <section class="sec">
        <div class="label">04<br>Checks</div>
        <div class="field"><p class="lead">Local checks passed. The working directory remains clean.</p></div>
        <div class="stats">
          <div class="stat"><b class="stat-fig">16/16</b><span class="stat-label">Diff coverage of changed units.</span></div>
          <div class="stat"><b class="stat-fig">6</b><span class="stat-label">Files changed. No parser source changes.</span></div>
          <div class="stat tone-warn"><b class="stat-fig">393</b><span class="stat-label">Pull request. Adding a tone colours the number.</span></div>
          <div class="stat"><b class="stat-fig">0</b><span class="stat-label">Working-directory changes.</span></div>
        </div>
      </section>
    </article>`,
};

/** Japanese masthead, using the same measurements as the English default. */
export const JapaneseMasthead = {
  render: () => html`
    ${drawDefs}
    <article class="sheet" lang="ja">
      <p class="eyebrow">変更意図 · bison-parser 出典カバレッジ</p>
      <h1>挙動がある<br>単位だけ結ぶ</h1>
      <p class="stand">未カバーは実装漏れではなかった。仕様が出典に触れていなかった。導入文は空のまま。</p>
      <div class="hero">
        <div class="was">
          <span class="cap">BEFORE</span>
          <span class="fig">68.97</span>
          <span class="unit">出典 20/29 · ゲート 68 / 57 / 80</span>
        </div>
        <div class="mid">
          <svg class="draw" style="--dd-draw-width:56px" viewBox="0 0 56 16" aria-hidden="true">
            <path class="draw-line draw-arrow tone-accent" d="M2 8H54"/>
          </svg>
        </div>
        <div class="now">
          <span class="cap">AFTER</span>
          <span class="fig">96.67</span>
          <span class="unit">出典 29/30 · ゲート 96 / 93 / 100 · 正直な上限</span>
        </div>
      </div>
    </article>`,
};

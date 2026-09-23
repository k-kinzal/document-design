import { html } from "./helpers.js";

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
          <svg viewBox="0 0 56 16" aria-hidden="true">
            <path d="M2 8H42" fill="none" stroke="var(--dd-rule)" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M36 2L54 8L36 14" fill="none" stroke="var(--dd-accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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

/**
 * Most changes have no number worth showing. Forced into one anyway, a page
 * leads with a count nobody asked about and spends its largest type saying the
 * least interesting true thing about the work. `.claim` takes the same slot
 * and carries a phrase instead — in ink, because the accent belongs to the mark.
 */
export const ClaimInsteadOfFigure = {
  render: () => html`
    <article class="sheet" lang="ja">
      <p class="eyebrow">変更意図 · パーサ層の整理</p>
      <h1>読む場所を<br>ひとつにする</h1>
      <div class="hero">
        <div class="was">
          <span class="cap">BEFORE</span>
          <span class="claim">3 か所で<br>別々に読む</span>
        </div>
        <div class="mid">
          <svg viewBox="0 0 56 16" aria-hidden="true">
            <path d="M2 8H42" fill="none" stroke="var(--dd-rule)" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M36 2L54 8L36 14" fill="none" stroke="var(--dd-accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="now">
          <span class="cap">AFTER</span>
          <span class="claim">読むのは<br>リーダーだけ</span>
          <span class="unit">呼び出し側は 12 → 1</span>
        </div>
      </div>
    </article>`,
};

/** A section: its name on the left, its content on the right, and a caveat at
 *  the end for something the reader would be wrong to assume still stats. */
export const Section = {
  render: () => html`
    <article class="sheet" lang="ja">
      <section class="sec">
        <div class="label">02<br>概念</div>
        <div class="field">
          <p class="lead">計上は解釈があること。非対応は生成系だけ。</p>
          <p class="note">対応と理由付き非対応を足して計上する。空の単位は見えるままにして、
            斜線の非対応にはしない。</p>
        </div>
        <div class="figures">
          <figure><h3>計上</h3><p>解釈がある単位。検証済みと、理由付き非対応を足す。</p></figure>
          <figure><h3>未カバーは見える</h3><p>導入文は空。非対応ラベルで消さない。</p></figure>
          <figure><h3>非対応は生成系</h3><p><code>BISON-RUNTIME-001–003</code> は据え置き。リーダーの外。</p></figure>
        </div>
        <p class="caveat">終端の3書き方・定義・綴り・非終端、例文2断片、通常アクションは既存 Behat へ。</p>
      </section>
    </article>`,
};

/** Figures that are a number. Two to a row, and any number of them. */
export const Holds = {
  render: () => html`
    <article class="sheet" lang="ja">
      <section class="sec">
        <div class="label">04<br>検証</div>
        <div class="field"><p class="lead">ローカルは通った。作業ディレクトリは空のまま。</p></div>
        <div class="stats">
          <div class="stat"><b class="stat-fig">16/16</b><span class="stat-label">変更 unit の差分カバレッジ。</span></div>
          <div class="stat"><b class="stat-fig">6</b><span class="stat-label">ファイル。パーサ src は無し。</span></div>
          <div class="stat tone-warn"><b class="stat-fig">393</b><span class="stat-label">PR。トーンを足すと数字がその色になる。</span></div>
          <div class="stat"><b class="stat-fig">0</b><span class="stat-label">作業ディレクトリの差分。</span></div>
        </div>
      </section>
    </article>`,
};

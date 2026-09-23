import { html } from "./helpers.js";

export default {
  title: "Components/Quote",
  parameters: {
    docs: {
      description: {
        component:
          "Someone else's words, or the page's own, lifted out. The pull " +
          "variant is quiet about being a quote — no marks, no italics — " +
          "because it is usually the page quoting itself.",
      },
    },
  },
};

export const Blockquote = {
  render: () => html`
    <article class="prose" style="padding:24px">
      <blockquote class="quote">
        <p>Layers without an arrow are dependency-free by rule.</p>
        <cite class="quote-source">deptrac.yaml</cite>
      </blockquote>
      <blockquote class="quote tone-warn">
        <p>The gate is set to 96 and no higher. The remaining unit has no behaviour
           to test.</p>
        <cite class="quote-source">README, on why coverage stops short of 100</cite>
      </blockquote>
    </article>`,
};

/** In a report: one line of the argument set large, so a reader skimming the
 *  page still collects the point. */
export const Pull = {
  render: () => html`
    <article class="sheet">
      <section class="sec" style="margin-top:0">
        <div class="label">02<br>概念</div>
        <div class="field">
          <p class="note">未カバーの9単位を調べたところ、8つは仕様が出典に触れていない箇所だった。</p>
          <blockquote class="quote pull">
            <p>未カバーは実装漏れではなかった。仕様が出典に触れていなかった。</p>
          </blockquote>
          <p class="note">残る1つは導入文で、挙動がない。これは空のまま残す。</p>
        </div>
      </section>
    </article>`,
};

import { html } from "./helpers.js";

export default {
  title: "Components/Prose",
  parameters: {
    docs: {
      description: {
        component:
          "Rendered markdown — a README, a design note, a skill description. " +
          "The one place in the system where headings are a reading hierarchy " +
          "rather than labels on bands of rows, so it restates them. It sits in " +
          "the component layer, which is after layout, so `.prose h2` wins over " +
          "`.doc h2` without either knowing about the other.",
      },
    },
  },
};

export const Readme = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="symbol-head">
        <h1><span class="chip tone-slate">document</span>php-ai-toolkit</h1>
        <div class="symbol-meta"><span class="source-link">README.md</span></div>
      </div>
      <article class="prose">
        <h2>php-ai-toolkit</h2>
        <p>
          <a href="#"><span class="md-target" title="https://img.shields.io/badge/docs-php--ai--toolkit-0969da">docs</span></a>
          <a href="#"><span class="md-target" title="https://github.com/.../ci.yml/badge.svg">CI</span></a>
          <a href="#"><span class="md-target" title="https://img.shields.io/badge/license-MIT-blue">License</span></a>
        </p>
        <p>A PHPStan extension that detects anti-patterns commonly introduced by AI
           code generation, plus output formatters optimized for both AI agents and
           humans.</p>

        <h3>Requirements</h3>
        <ul>
          <li>PHP <code>^8.0</code></li>
          <li>PHPStan <code>^1.12 || ^2.0</code></li>
          <li>PHPUnit <code>^9.6</code> and later
            <ul><li>The reporter supports 9.6 and 10+ through separate adapters.</li></ul>
          </li>
        </ul>

        <h3>Installation</h3>
        <pre><code>composer require --dev k-kinzal/php-ai-toolkit</code></pre>

        <blockquote>
          <p>The extension is opt-in per rule. Nothing is enabled by installing it.</p>
        </blockquote>

        <h3>What it reports</h3>
        <table>
          <thead><tr><th>Rule</th><th>What it catches</th></tr></thead>
          <tbody>
            <tr><td><code>ai.unusedParameter</code></td><td>A parameter the body never reads.</td></tr>
            <tr><td><code>ai.emptyCatch</code></td><td>A catch block that swallows.</td></tr>
          </tbody>
        </table>

        <hr>
        <p>MIT.</p>
      </article>
    </main></div></div>`,
};

/** A README written as a checklist, which markdown renders as list items with
 *  checkboxes. */
export const Checklist = {
  render: () => html`
    <article class="prose" style="padding:24px">
      <h3>Before releasing</h3>
      <ul>
        <li><input type="checkbox" checked disabled> Contrast check passes</li>
        <li><input type="checkbox" checked disabled> Both themes reviewed</li>
        <li><input type="checkbox" disabled> Printed a report to PDF</li>
      </ul>
    </article>`,
};

/** Static output shapes used by the Markdown CLI. No renderer runs here. */
export const GeneratedExtensions = {
  parameters: { docs: { description: { story: "The Markdown CLI renders alerts, code, definitions, footnotes and TeX before writing HTML. Math uses native MathML; the only stylesheet is doc-ui." } } },
  render: () => html`
    <article class="prose">
      <h2>Catalog evidence</h2>
      <aside class="callout tone-violet">
        <p class="callout-title">Important</p>
        <p>Only 35 of 844 statements were resolved.<a class="cite" role="doc-noteref" id="example-ref" href="#example-note">1</a></p>
      </aside>
      <dl><dt>Coverage</dt><dd>The share of statements whose references could be resolved.</dd></dl>
      <pre><code class="language-sql"><span class="tok-kw">SELECT</span> post_title <span class="tok-kw">FROM</span> wp_posts;</code></pre>
      <div class="equation"><div class="eq-body" role="region" tabindex="0" aria-label="Equation">
        <math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mfrac><mn>35</mn><mn>844</mn></mfrac><mo>×</mo><mn>100</mn><mo>%</mo></mrow></math>
      </div></div>
      <section role="doc-endnotes" aria-label="Footnotes"><ol class="sources">
        <li id="example-note">WordPress SQL catalog: 844 statements, 978 findings. <a role="doc-backlink" href="#example-ref" aria-label="Back to reference 1">↩</a></li>
      </ol></section>
    </article>`,
};

export const JapaneseGeneratedExtensions = {
  parameters: { docs: { description: { story: "Japanese alert and footnote labels, with the document language explicitly marked." } } },
  render: () => html`
    <article class="prose" lang="ja">
      <h2>カタログの調査範囲</h2>
      <aside class="callout tone-violet"><p class="callout-title">重要</p>
        <p>参照先を解決できたのは844文中35文です。<a class="cite" role="doc-noteref" id="example-ref-ja" href="#example-note-ja">1</a></p>
      </aside>
      <div class="equation"><div class="eq-body" role="region" tabindex="0" aria-label="数式">
        <math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mfrac><mn>35</mn><mn>844</mn></mfrac><mo>×</mo><mn>100</mn><mo>%</mo></mrow></math>
      </div></div>
      <section role="doc-endnotes" aria-label="脚注"><ol class="sources">
        <li id="example-note-ja">WordPress SQLカタログ：844文、978件の検出結果。<a role="doc-backlink" href="#example-ref-ja" aria-label="本文へ戻る">↩</a></li>
      </ol></section>
    </article>`,
};

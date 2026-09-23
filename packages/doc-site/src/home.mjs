import { masthead, footer, code, stylesheet } from './site.mjs';
import { components, groups } from './components.mjs';

const markup = `<article class="sheet">
  <h1>A clear reading order.</h1>
  <p class="stand">The main idea comes first.</p>
  <section class="sec">
    <h2 class="label">THE EVIDENCE</h2>
    <div class="field">The detail follows.</div>
  </section>
</article>`;

// A diagram of this product's two reading modes, using public doc-ui markup.
export const readingPaths = `<figure class="plate plate-full plate-side plate-unnumbered" id="reading-paths">
  <div class="plate-body compare">
    <section id="path-reference" aria-labelledby="reference-title">
      <h3 class="compare-title" id="reference-title"><span class="ref ref-mark tone-blue">A</span> Documentation</h3>
      <ol class="flow tone-blue">
        <li><span class="flow-mark" aria-hidden="true">01</span><strong class="flow-name">Index</strong><span class="flow-detail">Find a name</span></li>
        <li><span class="flow-mark" aria-hidden="true">02</span><strong class="flow-name">Entry</strong><span class="flow-detail">Compare its fields</span></li>
        <li><span class="flow-mark" aria-hidden="true">03</span><strong class="flow-name">Detail</strong><span class="flow-detail">Inspect the source</span></li>
      </ol>
    </section>
    <section id="path-paper" aria-labelledby="paper-title">
      <h3 class="compare-title" id="paper-title"><span class="ref ref-mark tone-teal">B</span> Paper</h3>
      <ol class="flow tone-teal">
        <li><span class="flow-mark" aria-hidden="true">01</span><strong class="flow-name">Question</strong><span class="flow-detail">Orient the reader</span></li>
        <li><span class="flow-mark" aria-hidden="true">02</span><strong class="flow-name">Evidence</strong><span class="flow-detail">Connect the facts</span></li>
        <li><span class="flow-mark" aria-hidden="true">03</span><strong class="flow-name">Meaning</strong><span class="flow-detail">Explain the result</span></li>
      </ol>
    </section>
  </div>
  <figcaption>
    <p class="plate-summary"><span class="plate-label">Figure 1.</span>Two reading paths, two scales. A reference keeps comparable details close together. A paper gives an idea, its evidence, and its qualifications room to unfold.</p>
    <p class="sidenote">The arrows show reading order. These are paths through information, not required page templates.</p>
  </figcaption>
</figure>`;

export function home(lang = 'en') {
  return `<div class="sheet sheet-wide">${masthead('./', '', lang)}
<main class="sheet-body" id="main">
  <header class="cover">
    <div><p class="eyebrow">CSS FOR DOCUMENTATION &amp; REPORTS</p><h1 class="cover-title">Information,<br>made clear.</h1></div>
    <div class="cover-copy">
      <p>doc-ui brings typography, diagrams, tables, and code into one design system for information-heavy pages.</p>
      <p>Keep a reference easy to scan. Give a report a clear reading order.</p>
      <div class="actions"><a class="btn btn-primary btn-lg" href="./components/">Explore components <span aria-hidden="true">→</span></a><a href="./start/">Get started</a></div>
    </div>
  </header>
  <nav aria-label="On this page"><ul class="ribbon"><li><a href="#layouts">01 <b>Reading order</b></a></li><li><a href="#language">02 <b>Visual language</b></a></li><li><a href="#components">03 <b>Components</b></a></li><li><a href="#building">04 <b>Start building</b></a></li></ul></nav>

  <section class="section" id="layouts" aria-labelledby="layouts-title">
    <p class="eyebrow">01 / READING ORDER</p>
    <h2 class="section-title" id="layouts-title">Scan a reference. Read a report.</h2>
    ${readingPaths}
    <div class="compare">
      <div class="prose"><h3><a class="ref ref-mark tone-blue" href="#path-reference">A</a> Keep the detail close.</h3><p>A reference is read across: names, types, values. Compact spacing and aligned rows let readers compare entries without losing their place.</p><p><a href="./components/">Browse the component reference →</a></p></div>
      <div class="prose"><h3><a class="ref ref-mark tone-teal" href="#path-paper">B</a> Give the idea a sequence.</h3><p>A paper is read through: a point, the evidence, its meaning. A separate type and spacing scale brings the main idea forward and keeps notes beside what they explain.</p><p><a href="./components/report/">Use the report layout →</a></p></div>
    </div>
  </section>

  <section class="sec" id="language" aria-labelledby="language-title">
    <aside class="label"><h2 id="language-title">02 / VISUAL LANGUAGE</h2><p class="sidenote">In <a class="ref" href="#reading-paths">Figure 1</a>, letters, color, and aligned stages carry the same meaning in the diagram and the text.</p></aside>
    <div class="field">
      <h3 class="lead">The relationships are the design.</h3>
      <div class="prose">
      <p>A heading sets the question. A diagram makes a relationship visible. Its caption explains what to take from it. The spacing between them is part of the explanation.</p>
      <h4>Type follows the reading task.</h4>
      <p>Names and values stay readable in a dense reference. Density comes from the gaps, not smaller letters. In a paper, a larger scale separates the main idea from the supporting detail.</p>
      <h4>Meaning travels with the mark.</h4>
      <p><a class="ref ref-mark tone-blue" href="#path-reference">A</a> always identifies the reference path; <a class="ref ref-mark tone-teal" href="#path-paper">B</a> identifies the paper. The letters keep that relationship intact in monochrome. States and missing information have their own vocabulary, separate from category colors.</p>
      </div>
      <div class="actions"><a href="./components/composition/">Figures &amp; annotations →</a><a href="./components/chip/">Labels &amp; states →</a></div>
    </div>
  </section>

  <section class="section" id="components" aria-labelledby="components-title">
    <div class="section-head"><p class="eyebrow">03 / COMPONENTS</p><div><h2 class="section-title" id="components-title">From a sentence to a whole document.</h2><p class="note">${components.length} components and layouts share the same type, spacing, and color system. Each guide includes live examples, highlighted HTML, and usage notes.</p></div></div>
    <div class="table-wrap"><table>
      <caption class="sr-only">The doc-ui library, grouped by the information it helps you present</caption>
      <thead><tr><th scope="col">To compose</th><th scope="col">Start with</th></tr></thead>
      <tbody>${groups.map((group,i)=>`<tr><th scope="row"><a href="./components/#group-${i}">${group}</a></th><td><ul class="link-list">${components.filter(c=>c.group===group).map(c=>`<li><a href="./components/${c.slug}/">${c.name}</a></li>`).join('')}</ul></td></tr>`).join('')}</tbody>
    </table></div>
    <div class="actions"><a href="./components/">See every component in use →</a></div>
  </section>

  <section class="sec" id="building" aria-labelledby="building-title">
    <div class="label"><h2 id="building-title">04 / START BUILDING</h2><p class="sidenote">Choose a reading mode, then compose the parts your content needs.</p><div class="actions"><a href="./start/">Get started →</a></div></div>
    <div class="field">
      <h3 class="lead">Put your content on the page.</h3>
      <p class="note">Load the stylesheet in your document’s head, then use the layout classes in your HTML or templates. This page uses <code>.sheet</code>; the component reference uses <code>.doc</code>.</p>
      ${code(markup, 'home-markup')}
      <details class="disclosure"><summary>Stylesheet URL</summary><div class="disclosure-body">${code(stylesheet,'home-stylesheet')}</div></details>
      <div class="disclosure-group">
        <details class="disclosure"><summary>Can I change the visual style?</summary><div class="disclosure-body prose"><p>Override the <code>--dd-</code> tokens for type, spacing, and color. The stylesheet uses cascade layers, so your CSS can override component styles.</p><p>Light and dark themes share the same components. <a href="./start/#theming">See theming instructions →</a></p></div></details>
        <details class="disclosure"><summary>Which interactions are included?</summary><div class="disclosure-body prose"><p>The optional script adds search, sorting, filters, tabs, copy controls, and theme switching. The underlying document remains readable without it.</p><p><a href="./components/search/">Search</a> · <a href="./components/facets/">Filters</a> · <a href="./components/tabs/">Tabs</a></p></div></details>
        <details class="disclosure"><summary>Where does doc-ui fit?</summary><div class="disclosure-body prose"><p>Use it for document and report pages where text, structured data, and code are the content. Its base styles are designed to own the document. When integrating with an existing application, use a separate document or check the effect of those styles on the surrounding UI.</p><p>The setup guide covers browser support, print output, and keeping an offline copy.</p></div></details>
      </div>
    </div>
  </section>
</main>
${footer()}</div>`;
}

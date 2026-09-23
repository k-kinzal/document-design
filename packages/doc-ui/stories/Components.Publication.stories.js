import { html } from './helpers.js';

export default {
  title: 'Components/Publication',
  parameters: { docs: { description: { component: 'Reusable publication furniture: a report cover, navigation, section headings and live specimens. These opt-in components are used by doc-site; all colours follow the shared tokens.' } } },
};

export const Cover = {
  render: () => html`<article class="sheet sheet-wide">
    <header class="masthead"><a class="brand" href="#">Project</a><nav aria-label="Example navigation"><a href="#content">Overview</a><a href="#specimen">Examples</a></nav></header>
    <section class="cover" id="content"><div><p class="eyebrow">ANALYSIS REPORT</p><h1 class="cover-title">Information,<br><em>made clear.</em></h1></div><div class="cover-copy"><p>Dense enough to scan. Clear enough to understand. A stylesheet for the information you generate.</p><div class="actions"><a class="btn btn-primary btn-lg" href="#specimen">Read the report →</a></div></div></section>
    <ul class="ribbon"><li><b>960 statements</b> resolved</li><li><b>40 statements</b> still open</li></ul>
    <section class="section" id="specimen"><div class="section-head"><p class="eyebrow">01 / EVIDENCE</p><div><h2 class="section-title">The result and its limits.</h2><p class="note">Every figure answers a question.</p></div></div><figure class="specimen"><div class="specimen-bar">PREVIEW / Resolution</div><div class="specimen-body"><span class="chip tone-ok">✓ resolved</span> 960 of 1,000 statements</div><figcaption class="specimen-caption">40 statements remain unresolved.</figcaption></figure></section>
  </article>`,
};

export const NestedGenres = {
  render: () => html`<article class="sheet sheet-wide"><div class="specimens">
    <figure class="specimen"><div class="specimen-bar">CATALOG</div><div class="specimen-body doc doc-inset"><h2>Statements</h2><ul class="rows"><li class="row"><span class="row-body">SELECT id, title FROM posts</span></li><li class="row"><span class="row-body">SELECT name FROM users</span></li></ul></div><figcaption class="specimen-caption">Dense, scannable rows.</figcaption></figure>
    <figure class="specimen"><div class="specimen-bar">REPORT</div><div class="sheet sheet-inset"><h2>Resolution</h2><b class="fig">96%</b><p class="note">960 of 1,000 statements resolved.</p><p class="caveat">40 statements remain unresolved.</p></div><figcaption class="specimen-caption">One figure, with its caveat.</figcaption></figure>
  </div></article>`,
};

export const IntermediateWidth = {
  parameters: { docs: { description: { story: 'A cover in a 900px frame stacks before wrapped supporting copy can displace the headline.' } } },
  render: () => {
    const page = Cover.render();
    page.style.maxWidth = '900px';
    return page;
  },
};

export const JapaneseCover = {
  parameters: { docs: { description: { story: 'Japanese display tracking is slightly more open than Latin tracking; body text keeps its natural metrics.' } } },
  render: () => html`<article class="sheet sheet-wide" lang="ja"><header class="cover">
    <div><p class="eyebrow">ドキュメントとレポートのための CSS</p><h1 class="cover-title">情報を、<br>見やすく。</h1></div>
    <div class="cover-copy"><p>リファレンスは探しやすく。レポートには明快な読む順序を。</p></div>
  </header></article>`,
};

export const SectionRhythm = {
  parameters: { docs: { description: { story: 'Section headings share one type role. A heading attaches closely to prose, with a larger gap before a figure; caption and body start on the same grid line.' } } },
  render: () => html`<article class="sheet sheet-wide">
    <section class="section"><div class="section-head"><p class="eyebrow">01 / EVIDENCE</p><h2 class="section-title">A figure and its explanation.</h2></div>
      <figure class="plate plate-full plate-side plate-unnumbered"><div class="plate-body"><p>35 of 844 statements fully resolved.</p></div>
        <figcaption><p class="plate-summary">The complete SQL text could be determined for 35 statements.</p><p class="sidenote">WordPress SQL catalog snapshot.</p></figcaption>
      </figure>
    </section>
    <section class="sec"><p class="label">02 / CONTEXT</p><div class="field"><h2 class="section-title">The qualification stays visible.</h2><div class="prose"><p>The other 809 statements include dependencies, analysis limits, and unexamined calls.</p></div></div></section>
  </article>`,
};

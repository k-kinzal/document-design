import { html } from './helpers.js';

export default {
  title: 'Components/Composition',
  parameters: { docs: { description: { component: 'Compose a figure, its caption, and the note that qualifies it. The figure can be wider than its prose; annotations follow the caption in a narrow container. All content stays in semantic HTML.' } } },
};

const figure = (name = 'Paper') => `<figure class="plate plate-full plate-side plate-unnumbered">
  <div class="plate-body">
    <h3 class="compare-title"><span class="ref ref-mark tone-teal">B</span> ${name}</h3>
    <ol class="flow tone-teal">
      <li><span class="flow-mark" aria-hidden="true">01</span><strong class="flow-name">Question</strong><span class="flow-detail">Orient the reader</span></li>
      <li><span class="flow-mark" aria-hidden="true">02</span><strong class="flow-name">Evidence</strong><span class="flow-detail">Connect the facts</span></li>
      <li><span class="flow-mark" aria-hidden="true">03</span><strong class="flow-name">Meaning</strong><span class="flow-detail">Explain the result</span></li>
    </ol>
  </div>
  <figcaption>
    <p class="plate-summary"><span class="plate-label">Figure 1.</span>A paper gives a point, its evidence, and its meaning a clear reading order.</p>
    <p class="sidenote">Arrows show reading order. They do not imply a causal relationship.</p>
  </figcaption>
</figure>`;

export const ReadingPath = {
  render: () => html`<article class="sheet sheet-wide"><section class="section"><p class="eyebrow">READING ORDER</p><h1 class="section-title">Give the idea a sequence.</h1>${figure()}</section></article>`,
};

export const NarrowColumn = {
  render: () => html`<div class="split"><div>${figure('A paper with a longer descriptive title')}</div><article class="prose"><h2>A note stays with its figure.</h2><p>The same figure sits in a narrower column. Its labels remain readable, and the annotation follows the caption.</p><p lang="ja">本文・図・注釈の関係を保ちながら、狭い表示領域へ配置を変えます。図中の文字を縮小して収めません。</p></article></div>`,
};

export const Comparison = {
  render: () => html`<article class="sheet sheet-wide"><section class="section"><h1 class="section-title">Two reading tasks.</h1><div class="compare"><section><h2 class="compare-title"><span class="ref ref-mark tone-blue">A</span> Reference</h2><p>Find a name. Compare its fields. Inspect the source.</p></section><section><h2 class="compare-title"><span class="ref ref-mark tone-teal">B</span> Paper</h2><p>Read the question. Connect the evidence. Understand the result.</p></section></div></section></article>`,
};


export const NumberedCaption = {
  render: () => html`<article class="sheet sheet-wide"><section class="section"><h1 class="section-title">An automatically numbered figure.</h1>${figure().replace(' plate-unnumbered', '').replace('<span class="plate-label">Figure 1.</span>', '')}</section></article>`,
};

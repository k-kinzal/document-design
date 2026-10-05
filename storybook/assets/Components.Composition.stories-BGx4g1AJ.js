import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./iframe-C_aFEijI.js";var r,i,a,o,s,c,l,u,d;function f(){return(f=e((()=>{n(),r={title:`Components/Composition`,parameters:{docs:{description:{component:`Compose a figure, its caption, and the note that qualifies it. The figure can be wider than its prose; annotations follow the caption in a narrow container. All content stays in semantic HTML.`}}}},i=(e=`Report`)=>`<figure class="plate plate-full plate-side plate-unnumbered">
  <div class="plate-body">
    <h3 class="compare-title"><span class="ref ref-mark tone-teal">B</span> ${e}</h3>
    <ol class="flow tone-teal">
      <li><span class="flow-mark" aria-hidden="true">01</span><strong class="flow-name">Question</strong><span class="flow-detail">Orient the reader</span></li>
      <li><span class="flow-mark" aria-hidden="true">02</span><strong class="flow-name">Evidence</strong><span class="flow-detail">Connect the facts</span></li>
      <li><span class="flow-mark" aria-hidden="true">03</span><strong class="flow-name">Meaning</strong><span class="flow-detail">Explain the result</span></li>
    </ol>
  </div>
  <figcaption>
    <p class="plate-summary"><span class="plate-label">Figure 1.</span>A report gives a point, its evidence, and its meaning a clear reading order.</p>
    <p class="sidenote">Arrows show reading order. They do not imply a causal relationship.</p>
  </figcaption>
</figure>`,a={render:()=>t`<article class="sheet sheet-wide"><section class="section"><p class="eyebrow">READING ORDER</p><h1 class="section-title">Give the idea a sequence.</h1>${i()}</section></article>`},o={render:()=>t`<div class="split"><div>${i(`A report with a longer descriptive title`)}</div><article class="prose"><h2>A note stays with its figure.</h2><p>The same figure sits in a narrower column. Its labels remain readable, and the annotation follows the caption.</p><p>The layout adapts to a narrow container while preserving the relationship between prose, figures, and notes. Drawing labels keep their size.</p></article></div>`},s={parameters:{docs:{description:{story:`At a narrow container width, ordinals and arrows occupy their own column. Names and explanations stay beside that column at the normal reading size.`}}},render:()=>t`<div style="max-width:320px;container-type:inline-size">${i()}</div>`},c={parameters:{docs:{description:{story:`The same narrow reading path with Japanese labels, explicitly marked with lang="ja".`}}},render:()=>t`<div lang="ja" style="max-width:320px;container-type:inline-size"><figure class="plate plate-full plate-side">
    <div class="plate-body"><ol class="flow tone-teal">
      <li><span class="flow-mark" aria-hidden="true">01</span><strong class="flow-name">問い</strong><span class="flow-detail">全体をつかむ</span></li>
      <li><span class="flow-mark" aria-hidden="true">02</span><strong class="flow-name">根拠</strong><span class="flow-detail">事実をつなぐ</span></li>
      <li><span class="flow-mark" aria-hidden="true">03</span><strong class="flow-name">意味</strong><span class="flow-detail">結果を読み解く</span></li>
    </ol></div><figcaption><p class="plate-summary">問い、根拠、意味を順に読む。</p><p class="sidenote">矢印は読む順序を示します。</p></figcaption>
  </figure></div>`},l={parameters:{docs:{description:{story:`Two equal columns at a nearest size-container width of 46rem or more (736px at the default root size). The sheet supplies that container here; use .field for a report content column. Below the threshold, or without a size container, the comparison stacks.`}}},render:()=>t`<article class="sheet sheet-wide"><section class="section"><h1 class="section-title">Two reading tasks.</h1><div class="compare"><section><h2 class="compare-title"><span class="ref ref-mark tone-blue">A</span> Reference</h2><p>Find a name. Compare its fields. Inspect the source.</p></section><section><h2 class="compare-title"><span class="ref ref-mark tone-teal">B</span> Report</h2><p>Read the question. Connect the evidence. Understand the result.</p></section></div></section></article>`},u={render:()=>t`<article class="sheet sheet-wide"><section class="section"><h1 class="section-title">An automatically numbered figure.</h1>${i().replace(` plate-unnumbered`,``).replace(`<span class="plate-label">Figure 1.</span>`,``)}</section></article>`},d=[`ReadingPath`,`NarrowColumn`,`MobileReadingPath`,`JapaneseReadingPath`,`Comparison`,`NumberedCaption`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:'{\n  render: () => html`<article class="sheet sheet-wide"><section class="section"><p class="eyebrow">READING ORDER</p><h1 class="section-title">Give the idea a sequence.</h1>${figure()}</section></article>`\n}',...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div class="split"><div>\${figure('A report with a longer descriptive title')}</div><article class="prose"><h2>A note stays with its figure.</h2><p>The same figure sits in a narrower column. Its labels remain readable, and the annotation follows the caption.</p><p>The layout adapts to a narrow container while preserving the relationship between prose, figures, and notes. Drawing labels keep their size.</p></article></div>\`
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'At a narrow container width, ordinals and arrows occupy their own column. Names and explanations stay beside that column at the normal reading size.'
      }
    }
  },
  render: () => html\`<div style="max-width:320px;container-type:inline-size">\${figure()}</div>\`
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'The same narrow reading path with Japanese labels, explicitly marked with lang="ja".'
      }
    }
  },
  render: () => html\`<div lang="ja" style="max-width:320px;container-type:inline-size"><figure class="plate plate-full plate-side">
    <div class="plate-body"><ol class="flow tone-teal">
      <li><span class="flow-mark" aria-hidden="true">01</span><strong class="flow-name">問い</strong><span class="flow-detail">全体をつかむ</span></li>
      <li><span class="flow-mark" aria-hidden="true">02</span><strong class="flow-name">根拠</strong><span class="flow-detail">事実をつなぐ</span></li>
      <li><span class="flow-mark" aria-hidden="true">03</span><strong class="flow-name">意味</strong><span class="flow-detail">結果を読み解く</span></li>
    </ol></div><figcaption><p class="plate-summary">問い、根拠、意味を順に読む。</p><p class="sidenote">矢印は読む順序を示します。</p></figcaption>
  </figure></div>\`
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Two equal columns at a nearest size-container width of 46rem or more (736px at the default root size). The sheet supplies that container here; use .field for a report content column. Below the threshold, or without a size container, the comparison stacks.'
      }
    }
  },
  render: () => html\`<article class="sheet sheet-wide"><section class="section"><h1 class="section-title">Two reading tasks.</h1><div class="compare"><section><h2 class="compare-title"><span class="ref ref-mark tone-blue">A</span> Reference</h2><p>Find a name. Compare its fields. Inspect the source.</p></section><section><h2 class="compare-title"><span class="ref ref-mark tone-teal">B</span> Report</h2><p>Read the question. Connect the evidence. Understand the result.</p></section></div></section></article>\`
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => html\`<article class="sheet sheet-wide"><section class="section"><h1 class="section-title">An automatically numbered figure.</h1>\${figure().replace(' plate-unnumbered', '').replace('<span class="plate-label">Figure 1.</span>', '')}</section></article>\`
}`,...u.parameters?.docs?.source}}}})))()}f();export{l as Comparison,c as JapaneseReadingPath,s as MobileReadingPath,o as NarrowColumn,u as NumberedCaption,a as ReadingPath,d as __namedExportsOrder,r as default};
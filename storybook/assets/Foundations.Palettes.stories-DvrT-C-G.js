import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{d as t,o as n,s as r,u as i}from"./iframe-C_aFEijI.js";function a(e=!1){return n`<div class="doc doc-inset" lang="${e?`ja`:`en`}"><div class="cards">${t.map(t=>`<article class="card">
    <h3>${t.name}</h3><div class="palette-pair">${[`light`,`dark`].map(n=>`<div class="palette-sample" data-dd-palette="${t.id}" data-dd-theme="${n}">
      <span class="cap">${e?n===`light`?`ライト`:`ダーク`:n}</span>
      <div class="stat tone-accent"><b class="stat-fig">978</b><span class="stat-label">${e?`検出事項`:`findings`}</span></div>
      <div class="chips" aria-label="${e?`分類`:`Kinds`}"><span class="chip chip-sm tone-blue">SELECT</span><span class="chip chip-sm tone-violet">INSERT</span><span class="chip chip-sm tone-teal">UPDATE</span></div>
      <div class="chips" aria-label="${e?`状態`:`States`}"><span class="chip chip-sm tone-ok">✓ ${e?`解決済み`:`Resolved`}</span><span class="chip chip-sm tone-warn">! ${e?`一部解決`:`Partial`}</span><span class="chip chip-sm tone-danger">? ${e?`未解決`:`Unresolved`}</span></div>
    </div>`).join(``)}</div>
  </article>`).join(``)}</div></div>`}var o,s,c,l,u;function d(){return(d=e((()=>{r(),i(),o={title:`Foundations/Palettes`,parameters:{docs:{description:{component:`32 paper and accent combinations. Each includes light and dark. Load one palettes/<id>.css after the base CSS, or load document-design.palettes.css and set data-dd-palette. Identity and state colors keep their meaning; red remains reserved for missing or unresolved information. The toolbar applies a palette to any story.`}}}},s={render:()=>a()},c={parameters:{docs:{description:{story:`The same WordPress finding count with explicitly marked Japanese labels.`}}},render:()=>a(!0)},l={parameters:{docs:{description:{story:`Review each complete ink set together: accent, all seven identity hues, all three states, and a warning surface. Paper / Blue is the original palette. The other sets coordinate lightness and chroma without changing what a hue means.`}}},render:()=>n`<div class="doc doc-inset"><div class="cards">${t.filter(e=>e.family===`paper`).map(e=>`<article class="card">
    <h3>${e.name}</h3><div class="palette-pair">${[`light`,`dark`].map(t=>`<div class="palette-sample" data-dd-palette="${e.id}" data-dd-theme="${t}">
      <span class="cap">${t}</span>
      <div class="stat tone-accent"><b class="stat-fig">978</b><span class="stat-label">WordPress findings</span></div>
      <div class="chips" aria-label="Identity inks">${[`blue`,`violet`,`amber`,`teal`,`pink`,`indigo`,`slate`].map(e=>`<span class="chip chip-sm tone-${e}">${e}</span>`).join(``)}</div>
      <div class="chips" aria-label="States"><span class="chip chip-sm tone-ok">✓ Resolved</span><span class="chip chip-sm tone-warn">! Partial</span><span class="chip chip-sm tone-danger">? Unresolved</span></div>
      <div><p class="caveat">Only 35 of 844 statements are fully resolved.</p></div>
      <a href="#">View findings →</a>
    </div>`).join(``)}</div>
  </article>`).join(``)}</div></div>`},u=[`Pairs`,`JapanesePairs`,`InkRoles`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => pairs()
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'The same WordPress finding count with explicitly marked Japanese labels.'
      }
    }
  },
  render: () => pairs(true)
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Review each complete ink set together: accent, all seven identity hues, all three states, and a warning surface. Paper / Blue is the original palette. The other sets coordinate lightness and chroma without changing what a hue means.'
      }
    }
  },
  render: () => html\`<div class="doc doc-inset"><div class="cards">\${palettes.filter(p => p.family === 'paper').map(p => \`<article class="card">
    <h3>\${p.name}</h3><div class="palette-pair">\${['light', 'dark'].map(mode => \`<div class="palette-sample" data-dd-palette="\${p.id}" data-dd-theme="\${mode}">
      <span class="cap">\${mode}</span>
      <div class="stat tone-accent"><b class="stat-fig">978</b><span class="stat-label">WordPress findings</span></div>
      <div class="chips" aria-label="Identity inks">\${['blue', 'violet', 'amber', 'teal', 'pink', 'indigo', 'slate'].map(hue => \`<span class="chip chip-sm tone-\${hue}">\${hue}</span>\`).join('')}</div>
      <div class="chips" aria-label="States"><span class="chip chip-sm tone-ok">✓ Resolved</span><span class="chip chip-sm tone-warn">! Partial</span><span class="chip chip-sm tone-danger">? Unresolved</span></div>
      <div><p class="caveat">Only 35 of 844 statements are fully resolved.</p></div>
      <a href="#">View findings →</a>
    </div>\`).join('')}</div>
  </article>\`).join('')}</div></div>\`
}`,...l.parameters?.docs?.source}}}})))()}d();export{l as InkRoles,c as JapanesePairs,s as Pairs,u as __namedExportsOrder,o as default};
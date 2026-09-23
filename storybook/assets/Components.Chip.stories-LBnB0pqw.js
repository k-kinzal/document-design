import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{l as t,n,o as r,s as i}from"./iframe-fR7HCL7S.js";var a,o,s,c,l,u,d;function f(){return(f=e((()=>{i(),a={title:`Components/Chip`,parameters:{docs:{description:{component:`A word that classifies the thing next to it. Colour comes from a tone class, never from a chip variant, so the set of chips does not grow when a project adds a kind.`}}}},o={render:()=>r`<span class="chip">deprecated</span>`},s={render:()=>r`
    <div class="sb-row">
      <span class="chip chip-sm tone-blue">chip-sm</span>
      <span class="chip tone-blue">chip</span>
      <span class="chip chip-lg tone-blue">chip-lg</span>
    </div>`},c={render:()=>r`
    <div class="sb-row">
      <span class="chip chip-ghost">^8.2</span>
      <span class="chip chip-ghost">readonly</span>
      <a class="chip chip-ghost" href="#">WP_Query</a>
      <span class="chip chip-ghost chip-square">int|null</span>
    </div>`},l={render:()=>r`
    <div class="sb-row">
      ${n.map(e=>`<span class="chip tone-${e}">${e}</span>`).join(``)}
    </div>`},u={render:()=>r`
    <div class="doc"><div class="main"><main class="content">
      ${t(`on a heading`,`<h1><code>WP_Query</code><span class="chip tone-blue">class</span><span class="chip chip-sm tone-warn">deprecated</span></h1>`)}
      ${t(`in a table cell`,`<div class="table-wrap"><table>
           <thead><tr><th>Rule</th><th class="tight">Severity</th><th class="num">Statements</th></tr></thead>
           <tbody>
             <tr><td><a class="mono" href="#">dynamic-sql</a></td><td class="tight"><span class="chip tone-warn">medium</span></td><td class="num">709</td></tr>
             <tr><td><a class="mono" href="#">unresolved-sql</a></td><td class="tight"><span class="chip tone-neutral">low</span></td><td class="num">25</td></tr>
           </tbody>
         </table></div>`)}
      ${t(`leading a row`,`<ul class="rows"><li class="row"><a class="row-main" href="#">
           <span class="chip tone-blue">SELECT</span>
           <span class="row-body">SELECT * FROM {$}posts WHERE post_status = 'publish' ORDER BY post_date DESC</span>
         </a></li></ul>`)}
    </main></div></div>`},d=[`Default`,`Sizes`,`Ghost`,`Tones`,`InContext`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => html\`<span class="chip">deprecated</span>\`
}`,...o.parameters?.docs?.source},description:{story:`Untoned, a chip is neutral — the right default for a label whose colour
 would otherwise be one more thing for the reader to learn.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="sb-row">
      <span class="chip chip-sm tone-blue">chip-sm</span>
      <span class="chip tone-blue">chip</span>
      <span class="chip chip-lg tone-blue">chip-lg</span>
    </div>\`
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="sb-row">
      <span class="chip chip-ghost">^8.2</span>
      <span class="chip chip-ghost">readonly</span>
      <a class="chip chip-ghost" href="#">WP_Query</a>
      <span class="chip chip-ghost chip-square">int|null</span>
    </div>\`
}`,...c.parameters?.docs?.source},description:{story:`Ghost carries a literal rather than a classification — a version, a
 parameter, a raw identifier — so it is set in mono and outlined.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:'{\n  render: () => html`\n    <div class="sb-row">\n      ${HUES.map(h => `<span class="chip tone-${h}">${h}</span>`).join("")}\n    </div>`\n}',...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      \${specimen("on a heading", \`<h1><code>WP_Query</code><span class="chip tone-blue">class</span><span class="chip chip-sm tone-warn">deprecated</span></h1>\`)}
      \${specimen("in a table cell", \`<div class="table-wrap"><table>
           <thead><tr><th>Rule</th><th class="tight">Severity</th><th class="num">Statements</th></tr></thead>
           <tbody>
             <tr><td><a class="mono" href="#">dynamic-sql</a></td><td class="tight"><span class="chip tone-warn">medium</span></td><td class="num">709</td></tr>
             <tr><td><a class="mono" href="#">unresolved-sql</a></td><td class="tight"><span class="chip tone-neutral">low</span></td><td class="num">25</td></tr>
           </tbody>
         </table></div>\`)}
      \${specimen("leading a row", \`<ul class="rows"><li class="row"><a class="row-main" href="#">
           <span class="chip tone-blue">SELECT</span>
           <span class="row-body">SELECT * FROM {$}posts WHERE post_status = 'publish' ORDER BY post_date DESC</span>
         </a></li></ul>\`)}
    </main></div></div>\`
}`,...u.parameters?.docs?.source},description:{story:`In place: a chip is almost always attached to something, and its size is
 chosen so it does not shift the baseline of what it labels.`,...u.parameters?.docs?.description}}}})))()}f();export{o as Default,c as Ghost,u as InContext,s as Sizes,l as Tones,d as __namedExportsOrder,a as default};
import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{l as t,o as n,s as r}from"./iframe-fR7HCL7S.js";var i,a,o,s,c,l;function u(){return(u=e((()=>{r(),i={title:`Components/Control`,parameters:{docs:{description:{component:`There are few controls on purpose: a document is read, not operated. Each one here exists because all figures consuming projects had written it for themselves.`}}}},a={render:()=>n`
    <div class="doc"><div class="main"><main class="content">
      <div class="sb-row">
        <button class="btn">Copy</button>
        <button class="btn btn-quiet" data-dd-theme-toggle>◐</button>
        <button class="btn is-done">Copied</button>
        <button class="btn" disabled>Unavailable</button>
      </div>
    </main></div></div>`},o={render:()=>n`
    <div class="doc"><div class="main"><main class="content">
      ${t(`input-search`,`<input type="search" class="input input-search" placeholder="Find a statement… ( / )">`)}
      ${t(`input-block`,`<input type="search" class="input input-block" placeholder="Filter rows…">`)}
    </main></div></div>`},s={render:()=>n`
    <div class="doc"><div class="main"><main class="content">
      <div class="sb-row">
        <button class="btn" data-dd-theme-toggle>◐ Cycle theme</button>
        <span class="muted">auto → light → dark → auto</span>
      </div>
      <p class="muted" style="margin-top:12px">
        The <strong>Document</strong> control in the toolbar above drives the same
        setting, through the same stored key — so the two agree rather than fight.
        Either one moves the whole preview.
      </p>
    </main></div></div>`},c={render:()=>n`
    <div class="doc doc-inset" lang="ja"><main class="content">
      <div class="code-block">
        <div class="code-head"><span>HTML</span><button class="btn" data-dd-copy="#ja-source" aria-live="polite">コピー</button></div>
        <pre class="code" id="ja-source"><code>&lt;p&gt;情報を見やすくする。&lt;/p&gt;</code></pre>
      </div>
      <button class="btn" data-dd-theme-toggle aria-label="配色を切り替える">◐</button>
      <p>コピー完了とテーマのラベルは、最も近いlang属性に従います。</p>
    </main></div>`},l=[`Buttons`,`Inputs`,`ThemeToggle`,`JapaneseFeedback`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <div class="sb-row">
        <button class="btn">Copy</button>
        <button class="btn btn-quiet" data-dd-theme-toggle>◐</button>
        <button class="btn is-done">Copied</button>
        <button class="btn" disabled>Unavailable</button>
      </div>
    </main></div></div>\`
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:'{\n  render: () => html`\n    <div class="doc"><div class="main"><main class="content">\n      ${specimen("input-search", `<input type="search" class="input input-search" placeholder="Find a statement… ( / )">`)}\n      ${specimen("input-block", `<input type="search" class="input input-block" placeholder="Filter rows…">`)}\n    </main></div></div>`\n}',...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <div class="sb-row">
        <button class="btn" data-dd-theme-toggle>◐ Cycle theme</button>
        <span class="muted">auto → light → dark → auto</span>
      </div>
      <p class="muted" style="margin-top:12px">
        The <strong>Document</strong> control in the toolbar above drives the same
        setting, through the same stored key — so the two agree rather than fight.
        Either one moves the whole preview.
      </p>
    </main></div></div>\`
}`,...s.parameters?.docs?.source},description:{story:`The theme toggle cycles through figures states, not two. "Auto" is a real
answer — it means the document follows the reader's system — and a toggle
that only flips light and dark takes that away the first time they touch it,
with no way back.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc doc-inset" lang="ja"><main class="content">
      <div class="code-block">
        <div class="code-head"><span>HTML</span><button class="btn" data-dd-copy="#ja-source" aria-live="polite">コピー</button></div>
        <pre class="code" id="ja-source"><code>&lt;p&gt;情報を見やすくする。&lt;/p&gt;</code></pre>
      </div>
      <button class="btn" data-dd-theme-toggle aria-label="配色を切り替える">◐</button>
      <p>コピー完了とテーマのラベルは、最も近いlang属性に従います。</p>
    </main></div>\`
}`,...c.parameters?.docs?.source}}}})))()}u();export{a as Buttons,o as Inputs,c as JapaneseFeedback,s as ThemeToggle,l as __namedExportsOrder,i as default};
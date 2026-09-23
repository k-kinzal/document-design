import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./iframe-fR7HCL7S.js";var r,i,a,o,s,c;function l(){return(l=e((()=>{n(),r={title:`Components/Diff`,parameters:{docs:{description:{component:`What changed between two versions of a generated document.

Diff marks take **state hues only** — green adds, red removes, gold changes. Identity hues stay with the symbols they belong to, so a changed class is never read as a different kind of class.

Every mark carries a character as well as a tint: a diff distinguished only by background is unreadable to a reader who cannot separate the two tints, and to anyone at all once printed.`}}}},i={render:()=>t`
    <div class="doc"><div class="main">
      <div class="banner tone-warn">
        <span class="banner-label">Diff</span>
        <span class="banner-body">
          <span class="diff-range"><code>v1.4.0</code><span class="diff-arrow">→</span><code>main</code></span>
        </span>
        <a class="banner-action" href="#">Show the full reference</a>
      </div>
      <main class="content">
        <div class="diff-counts">
          <span class="chip tone-ok">+12 added</span>
          <span class="chip tone-danger">−3 removed</span>
          <span class="chip tone-warn">7 changed</span>
          <span class="chip">520 unchanged</span>
        </div>
      </main>
    </div></div>`},a={render:()=>t`
    <div class="doc"><div class="main"><main class="content">
      <pre class="code diff"><span class="dl diff-line-del">- public function build(): <span class="diff-run-del">string</span></span>
<span class="dl diff-line-add">+ public function build(): <span class="diff-run-add">Statement</span></span>
<span class="dl diff-line-mod">~ @throws <span class="diff-run-mod">QueryException</span></span>
  public function where(string $column, mixed $value): static</pre>
    </main></div></div>`},o={render:()=>t`
    <div class="doc"><div class="main"><main class="content">
      <h2>Symbols<span class="count">22 changed</span></h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Symbol</th><th class="tight">Kind</th><th class="num">Members</th></tr></thead>
          <tbody>
            <tr><td class="is-added"><a class="mono" href="#">Statement</a></td>
                <td class="tight"><span class="chip chip-sm tone-blue">class</span></td><td class="num">8</td></tr>
            <tr><td class="is-modified"><a class="mono" href="#">QueryBuilder</a></td>
                <td class="tight"><span class="chip chip-sm tone-violet">interface</span></td><td class="num">3</td></tr>
            <tr><td class="is-removed"><span class="mono">RawQuery</span></td>
                <td class="tight"><span class="chip chip-sm tone-blue">class</span></td><td class="num">—</td></tr>
            <tr><td><a class="mono" href="#">Resolution</a></td>
                <td class="tight"><span class="chip chip-sm tone-teal">enum</span></td><td class="num">5</td></tr>
          </tbody>
        </table>
      </div>
      <p class="muted">The unchanged row carries no mark at all — most rows are
        unchanged, and marking them would make the changed ones harder to find.</p>
    </main></div></div>`},s={render:()=>t`
    <div class="doc"><div class="main"><main class="content">
      <h2>Symbols</h2>
      <p class="diff-empty">No symbol in this package changed between v1.4.0 and main.</p>
    </main></div></div>`},c=[`Summary`,`Lines`,`InAListing`,`NoChange`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main">
      <div class="banner tone-warn">
        <span class="banner-label">Diff</span>
        <span class="banner-body">
          <span class="diff-range"><code>v1.4.0</code><span class="diff-arrow">→</span><code>main</code></span>
        </span>
        <a class="banner-action" href="#">Show the full reference</a>
      </div>
      <main class="content">
        <div class="diff-counts">
          <span class="chip tone-ok">+12 added</span>
          <span class="chip tone-danger">−3 removed</span>
          <span class="chip tone-warn">7 changed</span>
          <span class="chip">520 unchanged</span>
        </div>
      </main>
    </div></div>\`
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <pre class="code diff"><span class="dl diff-line-del">- public function build(): <span class="diff-run-del">string</span></span>
<span class="dl diff-line-add">+ public function build(): <span class="diff-run-add">Statement</span></span>
<span class="dl diff-line-mod">~ @throws <span class="diff-run-mod">QueryException</span></span>
  public function where(string $column, mixed $value): static</pre>
    </main></div></div>\`
}`,...a.parameters?.docs?.source},description:{story:`A changed signature. The line mark says what happened; the run mark inside
 it says where.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <h2>Symbols<span class="count">22 changed</span></h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Symbol</th><th class="tight">Kind</th><th class="num">Members</th></tr></thead>
          <tbody>
            <tr><td class="is-added"><a class="mono" href="#">Statement</a></td>
                <td class="tight"><span class="chip chip-sm tone-blue">class</span></td><td class="num">8</td></tr>
            <tr><td class="is-modified"><a class="mono" href="#">QueryBuilder</a></td>
                <td class="tight"><span class="chip chip-sm tone-violet">interface</span></td><td class="num">3</td></tr>
            <tr><td class="is-removed"><span class="mono">RawQuery</span></td>
                <td class="tight"><span class="chip chip-sm tone-blue">class</span></td><td class="num">—</td></tr>
            <tr><td><a class="mono" href="#">Resolution</a></td>
                <td class="tight"><span class="chip chip-sm tone-teal">enum</span></td><td class="num">5</td></tr>
          </tbody>
        </table>
      </div>
      <p class="muted">The unchanged row carries no mark at all — most rows are
        unchanged, and marking them would make the changed ones harder to find.</p>
    </main></div></div>\`
}`,...o.parameters?.docs?.source},description:{story:`A changed entry in a listing. The status sits in the gutter rather than
tinting the whole row: a listing where every row is washed green or red
stops being a listing and becomes a diff, and the reader still needs to read
the rows.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <h2>Symbols</h2>
      <p class="diff-empty">No symbol in this package changed between v1.4.0 and main.</p>
    </main></div></div>\`
}`,...s.parameters?.docs?.source},description:{story:`Nothing changed, said plainly.`,...s.parameters?.docs?.description}}}})))()}l();export{o as InAListing,a as Lines,s as NoChange,i as Summary,c as __namedExportsOrder,r as default};
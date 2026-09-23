import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./iframe-fR7HCL7S.js";var r,i,a,o,s,c;function l(){return(l=e((()=>{n(),r={title:`Components/Table`},i=[[`dynamic-sql`,`warn`,`medium`,709,`A value is spliced into the statement text instead of being bound.`],[`analysis-incomplete`,`neutral`,`low`,239,`A cycle or an analysis budget stopped the search before it closed.`],[`unresolved-sql`,`neutral`,`low`,25,`The statement text could not be reconstructed at all.`],[`call-not-analyzed`,`neutral`,`low`,5,`A call that carries a statement was found but never examined.`]].map(([e,t,n,r,i])=>`
  <tr>
    <td class="tight"><a class="mono" href="#">${e}</a></td>
    <td class="tight"><span class="chip tone-${t}">${n}</span></td>
    <td class="num">${r}</td>
    <td>${i}</td>
  </tr>`).join(``),a={render:()=>t`
    <div class="doc"><div class="main"><main class="content">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Rule</th><th class="tight">Severity</th><th class="num">Statements</th><th>What it reports</th></tr></thead>
          <tbody>${i}</tbody>
        </table>
      </div>
    </main></div></div>`},o={render:()=>t`
    <div class="doc"><div class="main"><main class="content">
      <input type="search" class="input input-block" placeholder="Filter rules…" data-dd-filter="#rules">
      <div class="table-wrap">
        <table class="sortable" data-dd-sortable>
          <thead><tr>
            <th data-dd-sort>Rule</th>
            <th class="tight" data-dd-sort>Severity</th>
            <th class="num" data-dd-sort>Statements</th>
            <th>What it reports</th>
          </tr></thead>
          <tbody id="rules">${i}</tbody>
        </table>
      </div>
    </main></div></div>`},s={render:()=>t`
    <div class="doc"><div class="main"><main class="content">
      <div class="table-wrap">
        <table class="plain">
          <tr><td><a href="#">k-kinzal/php-ai-toolkit</a></td><td class="num">542</td><td class="item-summary">PHPStan rules, PHPUnit reporters, config templates</td></tr>
          <tr><td><a href="#">k-kinzal/ztd-query</a></td><td class="num">318</td><td class="item-summary">Static SQL extraction for PHP</td></tr>
        </table>
      </div>
    </main></div></div>`},c=[`Default`,`Sortable`,`Plain`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Rule</th><th class="tight">Severity</th><th class="num">Statements</th><th>What it reports</th></tr></thead>
          <tbody>\${body}</tbody>
        </table>
      </div>
    </main></div></div>\`
}`,...a.parameters?.docs?.source},description:{story:`Numbers line up on the right in tabular figures, so they can be compared
 down the column rather than read one at a time.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <input type="search" class="input input-block" placeholder="Filter rules…" data-dd-filter="#rules">
      <div class="table-wrap">
        <table class="sortable" data-dd-sortable>
          <thead><tr>
            <th data-dd-sort>Rule</th>
            <th class="tight" data-dd-sort>Severity</th>
            <th class="num" data-dd-sort>Statements</th>
            <th>What it reports</th>
          </tr></thead>
          <tbody id="rules">\${body}</tbody>
        </table>
      </div>
    </main></div></div>\`
}`,...o.parameters?.docs?.source},description:{story:`Click or press Enter on a header. Numeric columns sort numerically, so "9"
 sorts under "10" rather than after it.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <div class="table-wrap">
        <table class="plain">
          <tr><td><a href="#">k-kinzal/php-ai-toolkit</a></td><td class="num">542</td><td class="item-summary">PHPStan rules, PHPUnit reporters, config templates</td></tr>
          <tr><td><a href="#">k-kinzal/ztd-query</a></td><td class="num">318</td><td class="item-summary">Static SQL extraction for PHP</td></tr>
        </table>
      </div>
    </main></div></div>\`
}`,...s.parameters?.docs?.source},description:{story:"`.plain` for a table that is a layout rather than a comparison.",...s.parameters?.docs?.description}}}})))()}l();export{a as Default,s as Plain,o as Sortable,c as __namedExportsOrder,r as default};
import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./iframe-fR7HCL7S.js";var r,i,a,o,s,c,l;function u(){return(u=e((()=>{n(),r={title:`Components/Listing`},i=[[`blue`,`SELECT`,`SELECT * FROM {$}posts WHERE post_status = 'publish' AND post_type = %s ORDER BY post_date DESC`,`wp-includes/post.php:1240`,`get_posts`],[`violet`,`UPDATE`,`UPDATE {$}options SET option_value = %s WHERE option_name = %s`,`wp-includes/option.php:412`,`update_option`],[`indigo`,`ALTER`,`ALTER TABLE {$}posts ADD INDEX post_name (post_name(191))`,`wp-admin/includes/upgrade.php:2104`,`pre_schema_upgrade`]],a={render:()=>t`
    <div class="doc"><div class="main"><main class="content">
      <ul class="rows">
        ${i.map(([e,t,n,r,i])=>`
          <li class="row">
            <a class="row-main" href="#">
              <span class="chip tone-${e}">${t}</span>
              <span class="row-body">${n}</span>
            </a>
            <div class="row-meta">
              <a href="#">${r}</a>
              <a href="#">${i}</a>
              <span class="chip chip-sm tone-warn">dynamic-sql</span>
            </div>
          </li>`).join(``)}
      </ul>
    </main></div></div>`},o={render:()=>t`
    <div class="content" style="max-width:420px">
      <ol class="peek">
        <li><a href="#">wp-admin/includes/upgrade.php</a><span class="peek-figures">162 statements</span></li>
        <li><a href="#">wp-admin/includes/deprecated.php</a><span class="peek-figures">57 statements</span></li>
        <li><a href="#">wp-includes/class-wp-comment-query-builder.php</a><span class="peek-figures">49 statements</span></li>
      </ol>
    </div>`},s={render:()=>t`
    <div class="doc"><div class="main"><main class="content">
      <div class="table-wrap">
        <table class="items">
          <tbody>
            <tr>
              <td class="item-name"><a href="#">WP_Query</a><br><span class="item-ns">wp-includes</span></td>
              <td><span class="chip chip-sm tone-blue">class</span></td>
              <td class="item-summary">The main query class: turns query vars into a SQL statement and stats the result.</td>
            </tr>
            <tr>
              <td class="item-name"><a href="#">QueryBuilder</a><br><span class="item-ns">Ztd\\Query</span></td>
              <td><span class="chip chip-sm tone-violet">interface</span></td>
              <td class="item-summary">Builds a statement from a set of conditions.</td>
            </tr>
            <tr>
              <td class="item-name"><a href="#">Resolution</a><br><span class="item-ns">Ztd\\Query</span></td>
              <td><span class="chip chip-sm tone-teal">enum</span></td>
              <td class="item-summary">How far the analysis got on one statement.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main></div></div>`},c={render:()=>t`
    <div class="doc"><div class="main"><main class="content">
      <ul class="finding-list">
        <li><span class="chip tone-warn">medium</span><a class="mono" href="#">dynamic-sql</a>
            <span class="muted">A value is spliced into the statement text instead of being bound.</span></li>
        <li><span class="chip tone-neutral">low</span><a class="mono" href="#">analysis-incomplete</a>
            <span class="muted">A cycle or an analysis budget stopped the search before it closed.</span></li>
      </ul>
    </main></div></div>`},l=[`Rows`,`Peek`,`Items`,`Findings`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <ul class="rows">
        \${STATEMENTS.map(([tone, kind, sql, site, fn]) => \`
          <li class="row">
            <a class="row-main" href="#">
              <span class="chip tone-\${tone}">\${kind}</span>
              <span class="row-body">\${sql}</span>
            </a>
            <div class="row-meta">
              <a href="#">\${site}</a>
              <a href="#">\${fn}</a>
              <span class="chip chip-sm tone-warn">dynamic-sql</span>
            </div>
          </li>\`).join("")}
      </ul>
    </main></div></div>\`
}`,...a.parameters?.docs?.source},description:{story:`Bodies are clamped to three lines. A generated statement can be two hundred
lines long; a listing of them is for choosing which one to open, and a row
that fills a screen stops the listing from being a listing.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="content" style="max-width:420px">
      <ol class="peek">
        <li><a href="#">wp-admin/includes/upgrade.php</a><span class="peek-figures">162 statements</span></li>
        <li><a href="#">wp-admin/includes/deprecated.php</a><span class="peek-figures">57 statements</span></li>
        <li><a href="#">wp-includes/class-wp-comment-query-builder.php</a><span class="peek-figures">49 statements</span></li>
      </ol>
    </div>\`
}`,...o.parameters?.docs?.source},description:{story:`\`.peek\` is the first few of something, inside a card or an aside. The name
 clips; the figures never wrap, because a count on its own line no longer
 belongs to the row it describes.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <div class="table-wrap">
        <table class="items">
          <tbody>
            <tr>
              <td class="item-name"><a href="#">WP_Query</a><br><span class="item-ns">wp-includes</span></td>
              <td><span class="chip chip-sm tone-blue">class</span></td>
              <td class="item-summary">The main query class: turns query vars into a SQL statement and stats the result.</td>
            </tr>
            <tr>
              <td class="item-name"><a href="#">QueryBuilder</a><br><span class="item-ns">Ztd\\\\Query</span></td>
              <td><span class="chip chip-sm tone-violet">interface</span></td>
              <td class="item-summary">Builds a statement from a set of conditions.</td>
            </tr>
            <tr>
              <td class="item-name"><a href="#">Resolution</a><br><span class="item-ns">Ztd\\\\Query</span></td>
              <td><span class="chip chip-sm tone-teal">enum</span></td>
              <td class="item-summary">How far the analysis got on one statement.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main></div></div>\`
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <ul class="finding-list">
        <li><span class="chip tone-warn">medium</span><a class="mono" href="#">dynamic-sql</a>
            <span class="muted">A value is spliced into the statement text instead of being bound.</span></li>
        <li><span class="chip tone-neutral">low</span><a class="mono" href="#">analysis-incomplete</a>
            <span class="muted">A cycle or an analysis budget stopped the search before it closed.</span></li>
      </ul>
    </main></div></div>\`
}`,...c.parameters?.docs?.source}}}})))()}u();export{c as Findings,s as Items,o as Peek,a as Rows,l as __namedExportsOrder,r as default};
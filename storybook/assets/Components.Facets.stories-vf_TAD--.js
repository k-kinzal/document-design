import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./iframe-fR7HCL7S.js";var r,i,a,o;function s(){return(s=e((()=>{n(),r={title:`Components/Facets`,parameters:{docs:{description:{component:`Narrowing a long listing without leaving the page. Every facet carries its count: a filter that turns out to match nothing is a dead end the reader has to back out of, and a count on the control means they never take it. Within a group facets are an OR; across groups they are an AND.`}}}},i=[[`select`,`ok`,`blue`,`SELECT`,`SELECT * FROM {$}posts WHERE ID = %d`],[`select`,`open`,`blue`,`SELECT`,`SELECT option_value FROM {$}options WHERE option_name = %s`],[`update`,`open`,`violet`,`UPDATE`,`UPDATE {$}posts SET post_status = %s WHERE ID = %d`],[`insert`,`ok`,`teal`,`INSERT`,`INSERT INTO {$}postmeta (post_id, meta_key) VALUES (%d, %s)`],[`delete`,`open`,`pink`,`DELETE`,`DELETE FROM {$}postmeta WHERE post_id = %d`]],a={render:()=>t`
    <div class="doc"><div class="main"><main class="content">
      <div class="facets" data-dd-facets="#listing">
        <input type="search" class="input" placeholder="Find a statement…" data-dd-facet-search>
        <div class="facet-group">
          ${[[`select`,`SELECT`,639,`blue`],[`update`,`UPDATE`,44,`violet`],[`insert`,`INSERT`,35,`teal`],[`delete`,`DELETE`,28,`pink`]].map(([e,t,n,r])=>`<button class="chip facet tone-${r}" data-dd-facet="kind:${e}">${t}<span class="facet-count">${n}</span></button>`).join(``)}
        </div>
        <div class="facet-group">
          <button class="chip facet tone-ok" data-dd-facet="resolution:ok">resolved<span class="facet-count">35</span></button>
          <button class="chip facet tone-neutral" data-dd-facet="resolution:open">incomplete<span class="facet-count">809</span></button>
        </div>
        <button class="btn" data-dd-facet-clear>Clear</button>
        <span class="facet-shown"></span>
      </div>
      <ul class="rows" id="listing">
        ${i.map(([e,t,n,r,i])=>`
          <li class="row" data-dd-kind="${e}" data-dd-resolution="${t}">
            <a class="row-main" href="#">
              <span class="chip tone-${n}">${r}</span>
              <span class="row-body">${i}</span>
            </a>
          </li>`).join(``)}
      </ul>
    </main></div></div>`},o=[`Faceted`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <div class="facets" data-dd-facets="#listing">
        <input type="search" class="input" placeholder="Find a statement…" data-dd-facet-search>
        <div class="facet-group">
          \${[["select", "SELECT", 639, "blue"], ["update", "UPDATE", 44, "violet"], ["insert", "INSERT", 35, "teal"], ["delete", "DELETE", 28, "pink"]].map(([v, label, n, tone]) => \`<button class="chip facet tone-\${tone}" data-dd-facet="kind:\${v}">\${label}<span class="facet-count">\${n}</span></button>\`).join("")}
        </div>
        <div class="facet-group">
          <button class="chip facet tone-ok" data-dd-facet="resolution:ok">resolved<span class="facet-count">35</span></button>
          <button class="chip facet tone-neutral" data-dd-facet="resolution:open">incomplete<span class="facet-count">809</span></button>
        </div>
        <button class="btn" data-dd-facet-clear>Clear</button>
        <span class="facet-shown"></span>
      </div>
      <ul class="rows" id="listing">
        \${ROWS.map(([kind, res, tone, label, sql]) => \`
          <li class="row" data-dd-kind="\${kind}" data-dd-resolution="\${res}">
            <a class="row-main" href="#">
              <span class="chip tone-\${tone}">\${label}</span>
              <span class="row-body">\${sql}</span>
            </a>
          </li>\`).join("")}
      </ul>
    </main></div></div>\`
}`,...a.parameters?.docs?.source}}}})))()}s();export{a as Faceted,o as __namedExportsOrder,r as default};
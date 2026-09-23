import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./iframe-fR7HCL7S.js";var r,i,a,o,s;function c(){return(c=e((()=>{n(),r={title:`Components/Empty`,parameters:{docs:{description:{component:`Nothing here, and **why**, and the way out.

A generated page that says only "No results" leaves the reader unable to tell whether they filtered everything away or the analysis found nothing — and those two call for opposite next moves.`}}}},i={render:()=>t`
    <div class="doc"><div class="main"><main class="content">
      <div class="facets">
        <div class="facet-group">
          <button class="chip facet tone-pink is-on" aria-pressed="true">DELETE<span class="facet-count">28</span></button>
          <button class="chip facet tone-ok is-on" aria-pressed="true">resolved<span class="facet-count">35</span></button>
        </div>
        <span class="facet-shown">0 / 844</span>
      </div>
      <div class="empty">
        <p class="empty-title">No statement matches</p>
        <p class="empty-note">No DELETE in this source was fully resolved — every one of
           the 28 splices a value the analyzer could not follow.</p>
        <button class="btn">Clear the resolution filter</button>
      </div>
    </main></div></div>`},a={render:()=>t`
    <div class="doc"><div class="main"><main class="content">
      <h1>Findings<span class="count">0</span></h1>
      <div class="empty">
        <p class="empty-title">Nothing was flagged</p>
        <p class="empty-note">All 844 statements resolved cleanly and none tripped a rule.
           This is the analysis finding nothing, not a filter hiding it.</p>
      </div>
    </main></div></div>`},o={render:()=>t`
    <div class="doc"><div class="main"><main class="content">
      <h2>Write operations<span class="count">0</span></h2>
      <p class="empty-inline">No statement in this file writes to a table.</p>
      <h2>Read operations<span class="count">3</span></h2>
      <ul class="peek">
        <li><a href="#">{$}posts</a><span class="peek-figures">3 · 3 read · 0 write</span></li>
      </ul>
    </main></div></div>`},s=[`Filtered`,`NothingFound`,`Inline`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <div class="facets">
        <div class="facet-group">
          <button class="chip facet tone-pink is-on" aria-pressed="true">DELETE<span class="facet-count">28</span></button>
          <button class="chip facet tone-ok is-on" aria-pressed="true">resolved<span class="facet-count">35</span></button>
        </div>
        <span class="facet-shown">0 / 844</span>
      </div>
      <div class="empty">
        <p class="empty-title">No statement matches</p>
        <p class="empty-note">No DELETE in this source was fully resolved — every one of
           the 28 splices a value the analyzer could not follow.</p>
        <button class="btn">Clear the resolution filter</button>
      </div>
    </main></div></div>\`
}`,...i.parameters?.docs?.source},description:{story:`Filtered to nothing: the reason is the filters, and the way out is to clear
 them.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <h1>Findings<span class="count">0</span></h1>
      <div class="empty">
        <p class="empty-title">Nothing was flagged</p>
        <p class="empty-note">All 844 statements resolved cleanly and none tripped a rule.
           This is the analysis finding nothing, not a filter hiding it.</p>
      </div>
    </main></div></div>\`
}`,...a.parameters?.docs?.source},description:{story:`Genuinely nothing: a different message, because it calls for a different
 next move.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <h2>Write operations<span class="count">0</span></h2>
      <p class="empty-inline">No statement in this file writes to a table.</p>
      <h2>Read operations<span class="count">3</span></h2>
      <ul class="peek">
        <li><a href="#">{$}posts</a><span class="peek-figures">3 · 3 read · 0 write</span></li>
      </ul>
    </main></div></div>\`
}`,...o.parameters?.docs?.source},description:{story:`Inline, for an empty section inside a page that is otherwise full.`,...o.parameters?.docs?.description}}}})))()}c();export{i as Filtered,o as Inline,a as NothingFound,s as __namedExportsOrder,r as default};
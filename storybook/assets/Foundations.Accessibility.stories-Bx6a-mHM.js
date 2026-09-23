import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./iframe-fR7HCL7S.js";var r,i,a,o,s,c,l;function u(){return(u=e((()=>{n(),r={title:`Foundations/Accessibility`,parameters:{docs:{description:{component:`Most of what matters here is not an add-on: it is the same rule as "these pages get printed". A mark that survives a monochrome printer survives colour blindness, and a page that works with the behaviour layer removed works with a screen reader.`}}}},i={render:()=>t`
    <div class="sb-grid" style="gap:24px;max-width:680px">
      <div>
        <p class="sb-label">diff — a character, not just a tint</p>
        <pre class="code diff" style="margin:0"><span class="dl diff-line-add">+ public function build(): Statement</span>
<span class="dl diff-line-del">- public function build(): string</span>
<span class="dl diff-line-mod">~ @throws QueryException</span></pre>
      </div>
      <div>
        <p class="sb-label">facets — an outline, not just more opacity</p>
        <div class="sb-row">
          <button class="chip facet tone-blue is-on">SELECT<span class="facet-count">639</span></button>
          <button class="chip facet tone-teal">INSERT<span class="facet-count">35</span></button>
        </div>
      </div>
      <div>
        <p class="sb-label">graph — a dash pattern, not just a hue</p>
        <div class="graph-legend">
          <span><svg viewBox="0 0 28 8"><path class="edge" d="M1 4H27"/></svg> allowed</span>
          <span><svg viewBox="0 0 28 8"><path class="edge edge-dev" d="M1 4H27"/></svg> dev only</span>
          <span><svg viewBox="0 0 28 8"><path class="edge edge-bad" d="M1 4H27"/></svg> violation</span>
        </div>
      </div>
      <div>
        <p class="sb-label">absence — dashed, not merely pale</p>
        <div class="sb-row">
          <span class="hole">…unresolved</span>
          <span class="hole tone-danger">…external</span>
        </div>
      </div>
    </div>`},a={render:()=>t`
    <div class="sb-row" style="gap:12px">
      <a href="#">a link</a>
      <button class="btn">a button</button>
      <input class="input" placeholder="an input">
      <span class="chip tone-blue" tabindex="0">a focusable chip</span>
    </div>`},o={render:()=>t`
    <div class="doc" style="min-height:0;border:1px solid var(--dd-border);position:relative">
      <a class="skip" href="#sk-content">Skip to content</a>
      <nav class="sidebar" style="height:180px;position:static">
        <div class="sidebar-section">
          <p class="sidebar-title">Browse</p>
          <ul class="sidebar-list">
            <li><a href="#">Overview</a></li>
            <li><a href="#">Statements</a><span class="sidebar-count">844</span></li>
            <li><a href="#">Tables</a><span class="sidebar-count">12</span></li>
          </ul>
        </div>
      </nav>
      <div class="main">
        <main class="content" id="sk-content" tabindex="-1" style="padding:18px">
          <h2 style="margin-top:0">Content</h2>
          <p class="muted">The skip link lands here.</p>
        </main>
      </div>
    </div>`},s={render:()=>t`
    <div class="definitions" style="max-width:720px">
      <div><dt><code>aria-sort</code></dt><dd>set on the sorted column header by the behaviour layer</dd></div>
      <div><dt><code>aria-pressed</code></dt><dd>on every facet, reflecting whether it is narrowing the listing</dd></div>
      <div><dt><code>role="tab"</code> + arrows</dt><dd>only the selected tab is in the tab order</dd></div>
      <div><dt><code>&lt;details&gt;</code></dt><dd>disclosure and tree — no JavaScript, no ARIA to get wrong</dd></div>
      <div><dt><code>.sr-only</code></dt><dd>for a label the layout has no room for</dd></div>
      <div><dt><code>title</code> + <code>.hint</code></dt><dd>always an addition; anything the reader must have is on the page,
        because a tooltip cannot be reached by touch, find-in-page or print</dd></div>
    </div>`},c={render:()=>t`
    <details class="disclosure disclosure-boxed" style="max-width:420px">
      <summary>The only animation in the system<span class="count">1</span></summary>
      <div class="disclosure-body muted">A 120ms rotation, and a 100ms fade on tooltips.</div>
    </details>`},l=[`RedundantEncoding`,`Focus`,`SkipLink`,`Semantics`,`Motion`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="sb-grid" style="gap:24px;max-width:680px">
      <div>
        <p class="sb-label">diff — a character, not just a tint</p>
        <pre class="code diff" style="margin:0"><span class="dl diff-line-add">+ public function build(): Statement</span>
<span class="dl diff-line-del">- public function build(): string</span>
<span class="dl diff-line-mod">~ @throws QueryException</span></pre>
      </div>
      <div>
        <p class="sb-label">facets — an outline, not just more opacity</p>
        <div class="sb-row">
          <button class="chip facet tone-blue is-on">SELECT<span class="facet-count">639</span></button>
          <button class="chip facet tone-teal">INSERT<span class="facet-count">35</span></button>
        </div>
      </div>
      <div>
        <p class="sb-label">graph — a dash pattern, not just a hue</p>
        <div class="graph-legend">
          <span><svg viewBox="0 0 28 8"><path class="edge" d="M1 4H27"/></svg> allowed</span>
          <span><svg viewBox="0 0 28 8"><path class="edge edge-dev" d="M1 4H27"/></svg> dev only</span>
          <span><svg viewBox="0 0 28 8"><path class="edge edge-bad" d="M1 4H27"/></svg> violation</span>
        </div>
      </div>
      <div>
        <p class="sb-label">absence — dashed, not merely pale</p>
        <div class="sb-row">
          <span class="hole">…unresolved</span>
          <span class="hole tone-danger">…external</span>
        </div>
      </div>
    </div>\`
}`,...i.parameters?.docs?.source},description:{story:`**Every mark says it twice.** Colour is never the only carrier — there is
always a character, a weight, a dash pattern or a border doing the same job.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="sb-row" style="gap:12px">
      <a href="#">a link</a>
      <button class="btn">a button</button>
      <input class="input" placeholder="an input">
      <span class="chip tone-blue" tabindex="0">a focusable chip</span>
    </div>\`
}`,...a.parameters?.docs?.source},description:{story:`One focus ring, on \`:focus-visible\` only — so a mouse click leaves nothing
 behind but a Tab key always shows where it went. Declared in \`:where()\`, so
 it carries no specificity and a component can restate it without a fight.

 Tab through the controls below.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc" style="min-height:0;border:1px solid var(--dd-border);position:relative">
      <a class="skip" href="#sk-content">Skip to content</a>
      <nav class="sidebar" style="height:180px;position:static">
        <div class="sidebar-section">
          <p class="sidebar-title">Browse</p>
          <ul class="sidebar-list">
            <li><a href="#">Overview</a></li>
            <li><a href="#">Statements</a><span class="sidebar-count">844</span></li>
            <li><a href="#">Tables</a><span class="sidebar-count">12</span></li>
          </ul>
        </div>
      </nav>
      <div class="main">
        <main class="content" id="sk-content" tabindex="-1" style="padding:18px">
          <h2 style="margin-top:0">Content</h2>
          <p class="muted">The skip link lands here.</p>
        </main>
      </div>
    </div>\`
}`,...o.parameters?.docs?.source},description:{story:`The skip link. A catalog page puts a sidebar of a hundred links before its
content — for anyone tabbing through, or hearing the page read, that is a
hundred items between arriving and reading, on every page of the catalog.

Press Tab with the frame below focused.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="definitions" style="max-width:720px">
      <div><dt><code>aria-sort</code></dt><dd>set on the sorted column header by the behaviour layer</dd></div>
      <div><dt><code>aria-pressed</code></dt><dd>on every facet, reflecting whether it is narrowing the listing</dd></div>
      <div><dt><code>role="tab"</code> + arrows</dt><dd>only the selected tab is in the tab order</dd></div>
      <div><dt><code>&lt;details&gt;</code></dt><dd>disclosure and tree — no JavaScript, no ARIA to get wrong</dd></div>
      <div><dt><code>.sr-only</code></dt><dd>for a label the layout has no room for</dd></div>
      <div><dt><code>title</code> + <code>.hint</code></dt><dd>always an addition; anything the reader must have is on the page,
        because a tooltip cannot be reached by touch, find-in-page or print</dd></div>
    </div>\`
}`,...s.parameters?.docs?.source},description:{story:"Tables carry their sort state in `aria-sort`, tabs implement the tab pattern\nwith arrow keys, facets are `aria-pressed` buttons, and the disclosure and\ntree components are built on native `<details>` — which is keyboard\nreachable and screen-reader announced without anyone writing a handler.",...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <details class="disclosure disclosure-boxed" style="max-width:420px">
      <summary>The only animation in the system<span class="count">1</span></summary>
      <div class="disclosure-body muted">A 120ms rotation, and a 100ms fade on tooltips.</div>
    </details>\`
}`,...c.parameters?.docs?.source},description:{story:"The system animates a disclosure triangle and a tooltip. Both stop under\n `prefers-reduced-motion`, along with smooth scrolling.",...c.parameters?.docs?.description}}}})))()}u();export{a as Focus,c as Motion,i as RedundantEncoding,s as Semantics,o as SkipLink,l as __namedExportsOrder,r as default};
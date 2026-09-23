import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./iframe-fR7HCL7S.js";var r,i,a,o;function s(){return(s=e((()=>{n(),r={title:`Components/Tabs`,parameters:{docs:{description:{component:`One subject, several views of it.

**Only for views of the same thing.** Content a reader might want to find without knowing it is there belongs in a disclosure or on the page, because an inactive tab panel is invisible to the browser's find-in-page and to anyone who arrived from a search engine.

**The markup ships no \`hidden\`.** Every panel is visible and carries its own heading; the script hides the inactive ones on start. Turn JavaScript off and this is three headed sections — which is also what prints, since the tab strip that labelled them is not printed.

Arrow keys move between tabs, and only the selected tab is in the tab order, so Tab leaves the strip rather than walking every view.`}}}},i={render:()=>t`
    <div class="doc"><div class="main"><main class="content" style="max-width:720px">
      <h2>The statement</h2>
      <div class="tabs" data-dd-tabs>
        <div class="tablist" role="tablist">
          <button class="tab" role="tab" aria-selected="true" aria-controls="tp-1">Resolved</button>
          <button class="tab" role="tab" aria-selected="false" aria-controls="tp-2">As written</button>
          <button class="tab" role="tab" aria-selected="false" aria-controls="tp-3">Findings<span class="count">2</span></button>
        </div>

        <section class="tabpanel" id="tp-1" role="tabpanel" tabindex="0">
          <h3 class="tabpanel-title">Resolved</h3>
          <pre class="code"><span class="tok-kw">SELECT</span> * <span class="tok-kw">FROM</span> <span class="tok-id">{$}posts</span>
<span class="tok-kw">WHERE</span> <span class="tok-id">post_status</span> = <span class="tok-ph">%s</span> <span class="tok-kw">AND</span> <span class="tok-id">ID</span> <span class="tok-kw">IN</span> (<span class="hole" data-dd-hint="A dependency the analyzer does not model was reached." tabindex="0">…unresolved</span>)</pre>
        </section>

        <section class="tabpanel" id="tp-2" role="tabpanel" tabindex="0">
          <h3 class="tabpanel-title">As written</h3>
          <pre class="code">"SELECT * FROM {$wpdb-&gt;posts} WHERE post_status = %s AND ID IN (" . $ids . ")"</pre>
        </section>

        <section class="tabpanel" id="tp-3" role="tabpanel" tabindex="0">
          <h3 class="tabpanel-title">Findings</h3>
          <ul class="finding-list">
            <li><span class="chip tone-warn">medium</span><a class="mono" href="#">dynamic-sql</a>
                <span class="muted">$ids is spliced rather than bound.</span></li>
            <li><span class="chip tone-neutral">low</span><a class="mono" href="#">analysis-incomplete</a>
                <span class="muted">The search stopped at a budget.</span></li>
          </ul>
        </section>
      </div>
    </main></div></div>`},a={render:()=>t`
    <div class="doc"><div class="main"><main class="content" style="max-width:720px">
      <h2>The statement</h2>
      <div class="tabs">
        <div class="tablist" role="tablist">
          <button class="tab" role="tab" aria-selected="true">Resolved</button>
          <button class="tab" role="tab" aria-selected="false">As written</button>
        </div>
        <section class="tabpanel" role="tabpanel">
          <h3 class="tabpanel-title">Resolved</h3>
          <pre class="code">SELECT * FROM {$}posts WHERE post_status = %s</pre>
        </section>
        <section class="tabpanel" role="tabpanel">
          <h3 class="tabpanel-title">As written</h3>
          <pre class="code">"SELECT * FROM {$wpdb-&gt;posts} WHERE post_status = %s"</pre>
        </section>
      </div>
    </main></div></div>`},o=[`Views`,`WithoutScript`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content" style="max-width:720px">
      <h2>The statement</h2>
      <div class="tabs" data-dd-tabs>
        <div class="tablist" role="tablist">
          <button class="tab" role="tab" aria-selected="true" aria-controls="tp-1">Resolved</button>
          <button class="tab" role="tab" aria-selected="false" aria-controls="tp-2">As written</button>
          <button class="tab" role="tab" aria-selected="false" aria-controls="tp-3">Findings<span class="count">2</span></button>
        </div>

        <section class="tabpanel" id="tp-1" role="tabpanel" tabindex="0">
          <h3 class="tabpanel-title">Resolved</h3>
          <pre class="code"><span class="tok-kw">SELECT</span> * <span class="tok-kw">FROM</span> <span class="tok-id">{$}posts</span>
<span class="tok-kw">WHERE</span> <span class="tok-id">post_status</span> = <span class="tok-ph">%s</span> <span class="tok-kw">AND</span> <span class="tok-id">ID</span> <span class="tok-kw">IN</span> (<span class="hole" data-dd-hint="A dependency the analyzer does not model was reached." tabindex="0">…unresolved</span>)</pre>
        </section>

        <section class="tabpanel" id="tp-2" role="tabpanel" tabindex="0">
          <h3 class="tabpanel-title">As written</h3>
          <pre class="code">"SELECT * FROM {$wpdb-&gt;posts} WHERE post_status = %s AND ID IN (" . $ids . ")"</pre>
        </section>

        <section class="tabpanel" id="tp-3" role="tabpanel" tabindex="0">
          <h3 class="tabpanel-title">Findings</h3>
          <ul class="finding-list">
            <li><span class="chip tone-warn">medium</span><a class="mono" href="#">dynamic-sql</a>
                <span class="muted">$ids is spliced rather than bound.</span></li>
            <li><span class="chip tone-neutral">low</span><a class="mono" href="#">analysis-incomplete</a>
                <span class="muted">The search stopped at a budget.</span></li>
          </ul>
        </section>
      </div>
    </main></div></div>\`
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content" style="max-width:720px">
      <h2>The statement</h2>
      <div class="tabs">
        <div class="tablist" role="tablist">
          <button class="tab" role="tab" aria-selected="true">Resolved</button>
          <button class="tab" role="tab" aria-selected="false">As written</button>
        </div>
        <section class="tabpanel" role="tabpanel">
          <h3 class="tabpanel-title">Resolved</h3>
          <pre class="code">SELECT * FROM {$}posts WHERE post_status = %s</pre>
        </section>
        <section class="tabpanel" role="tabpanel">
          <h3 class="tabpanel-title">As written</h3>
          <pre class="code">"SELECT * FROM {$wpdb-&gt;posts} WHERE post_status = %s"</pre>
        </section>
      </div>
    </main></div></div>\`
}`,...a.parameters?.docs?.source},description:{story:`The same markup with the behaviour layer absent: three headed sections, all
readable, nothing lost. This is what an archived copy without its script
looks like, and what the printer receives.`,...a.parameters?.docs?.description}}}})))()}s();export{i as Views,a as WithoutScript,o as __namedExportsOrder,r as default};
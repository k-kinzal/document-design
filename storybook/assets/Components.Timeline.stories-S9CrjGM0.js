import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./iframe-fR7HCL7S.js";var r,i,a;function o(){return(o=e((()=>{n(),r={title:`Components/Timeline`,parameters:{docs:{description:{component:`What happened, in order. For a run: the steps it took, which one failed, how long each took. The spine is drawn on the list rather than per item, so a list of two does not grow a line with nothing to join.`}}}},i={render:()=>t`
    <div class="doc"><div class="main"><main class="content" style="max-width:640px">
      <h2>What the run did</h2>
      <ol class="timeline">
        <li class="timeline-item tone-ok">
          <span class="timeline-time">14:02:11</span>
          <p class="timeline-title">Parsed the source</p>
          <p class="timeline-description">77 files, 542 symbols, 4.2s</p>
        </li>
        <li class="timeline-item tone-ok">
          <span class="timeline-time">14:02:15</span>
          <p class="timeline-title">Read the coverage report</p>
          <p class="timeline-description">16 of 16 changed units covered</p>
        </li>
        <li class="timeline-item tone-warn">
          <span class="timeline-time">14:02:18</span>
          <p class="timeline-title">Gate raised to 96</p>
          <p class="timeline-description">One unit has no behaviour to test and is left uncovered on purpose.</p>
        </li>
        <li class="timeline-item tone-danger">
          <span class="timeline-time">14:03:40</span>
          <p class="timeline-title">git fetch refused</p>
          <div class="terminal">
            <p class="terminal-command">git fetch origin main</p>
            <pre class="terminal-output terminal-error">fatal: could not read Username for 'https://github.com'</pre>
          </div>
          <p class="timeline-description">Fell back to the GitHub git data API.</p>
        </li>
        <li class="timeline-item is-open">
          <span class="timeline-time">14:04:02</span>
          <p class="timeline-title">CI pending</p>
          <p class="timeline-description">Not confirmed in this run — an outline mark, so the reader can
             see where the run actually got to.</p>
        </li>
      </ol>
    </main></div></div>`},a=[`Run`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content" style="max-width:640px">
      <h2>What the run did</h2>
      <ol class="timeline">
        <li class="timeline-item tone-ok">
          <span class="timeline-time">14:02:11</span>
          <p class="timeline-title">Parsed the source</p>
          <p class="timeline-description">77 files, 542 symbols, 4.2s</p>
        </li>
        <li class="timeline-item tone-ok">
          <span class="timeline-time">14:02:15</span>
          <p class="timeline-title">Read the coverage report</p>
          <p class="timeline-description">16 of 16 changed units covered</p>
        </li>
        <li class="timeline-item tone-warn">
          <span class="timeline-time">14:02:18</span>
          <p class="timeline-title">Gate raised to 96</p>
          <p class="timeline-description">One unit has no behaviour to test and is left uncovered on purpose.</p>
        </li>
        <li class="timeline-item tone-danger">
          <span class="timeline-time">14:03:40</span>
          <p class="timeline-title">git fetch refused</p>
          <div class="terminal">
            <p class="terminal-command">git fetch origin main</p>
            <pre class="terminal-output terminal-error">fatal: could not read Username for 'https://github.com'</pre>
          </div>
          <p class="timeline-description">Fell back to the GitHub git data API.</p>
        </li>
        <li class="timeline-item is-open">
          <span class="timeline-time">14:04:02</span>
          <p class="timeline-title">CI pending</p>
          <p class="timeline-description">Not confirmed in this run — an outline mark, so the reader can
             see where the run actually got to.</p>
        </li>
      </ol>
    </main></div></div>\`
}`,...i.parameters?.docs?.source}}}})))()}o();export{i as Run,a as __namedExportsOrder,r as default};
import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./iframe-fR7HCL7S.js";var r,i,a,o,s;function c(){return(c=e((()=>{n(),r={title:`Components/Terminal`,parameters:{docs:{description:{component:"A command and what it printed. The prompt mark is generated rather than written into the text, so copying the command copies the command and not a `$` the shell will refuse."}}}},i={render:()=>t`
    <div class="doc"><div class="main"><main class="content">
      <div class="terminal">
        <p class="terminal-command">composer docgen -- --diff v1.4.0</p>
        <pre class="terminal-output">Parsing 77 files…
Analyzed 542 symbols in 4.2s
Wrote build/docs (318 pages)</pre>
        <p class="terminal-exit tone-ok">exit 0</p>
      </div>
    </main></div></div>`},a={render:()=>t`
    <div class="doc"><div class="main"><main class="content">
      <div class="terminal">
        <p class="terminal-command">vendor/bin/phpstan analyse --level 9</p>
        <pre class="terminal-output terminal-error">src/Query/QueryBuilder.php:88
  Method compile() should return string but returns string|null.</pre>
        <p class="terminal-exit tone-danger">exit 1</p>
      </div>
    </main></div></div>`},o={render:()=>t`
    <div class="doc"><div class="main"><main class="content">
      <div class="terminal">
        <p class="terminal-command">npm run check:contrast</p>
        <pre class="terminal-output">All 58 pairs meet their target.</pre>
        <p class="terminal-command">npm run build</p>
        <pre class="terminal-output">document-design.css    69.8 kB → min 48.9 kB</pre>
      </div>
    </main></div></div>`},s=[`Session`,`Failure`,`Multiple`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <div class="terminal">
        <p class="terminal-command">composer docgen -- --diff v1.4.0</p>
        <pre class="terminal-output">Parsing 77 files…
Analyzed 542 symbols in 4.2s
Wrote build/docs (318 pages)</pre>
        <p class="terminal-exit tone-ok">exit 0</p>
      </div>
    </main></div></div>\`
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <div class="terminal">
        <p class="terminal-command">vendor/bin/phpstan analyse --level 9</p>
        <pre class="terminal-output terminal-error">src/Query/QueryBuilder.php:88
  Method compile() should return string but returns string|null.</pre>
        <p class="terminal-exit tone-danger">exit 1</p>
      </div>
    </main></div></div>\`
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <div class="terminal">
        <p class="terminal-command">npm run check:contrast</p>
        <pre class="terminal-output">All 58 pairs meet their target.</pre>
        <p class="terminal-command">npm run build</p>
        <pre class="terminal-output">document-design.css    69.8 kB → min 48.9 kB</pre>
      </div>
    </main></div></div>\`
}`,...o.parameters?.docs?.source}}}})))()}c();export{a as Failure,o as Multiple,i as Session,s as __namedExportsOrder,r as default};
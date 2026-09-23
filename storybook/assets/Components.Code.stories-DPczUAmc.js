import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{l as t,o as n,s as r}from"./iframe-fR7HCL7S.js";var i,a,o,s,c,l,u,d;function f(){return(f=e((()=>{r(),i={title:`Components/Code`,parameters:{docs:{description:{component:`Wrapped rather than scrolled by default: a generated statement is often one very long line, and a reader who has to scroll sideways to find the end of a WHERE clause will not do it.`}}}},a=`<span class="tok-kw">SELECT</span> <span class="tok-id">p</span>.* <span class="tok-kw">FROM</span> <span class="tok-id">{$}posts</span> <span class="tok-id">p</span>
<span class="tok-kw">WHERE</span> <span class="tok-id">p</span>.<span class="tok-id">post_status</span> = <span class="tok-str">'publish'</span>
  <span class="tok-kw">AND</span> <span class="tok-id">p</span>.<span class="tok-id">post_type</span> = <span class="tok-ph">%s</span>
<span class="tok-kw">ORDER BY</span> <span class="tok-id">p</span>.<span class="tok-id">post_date</span> <span class="tok-kw">DESC</span> <span class="tok-kw">LIMIT</span> <span class="tok-num">10</span>`,o={render:()=>n`
    <div class="doc"><div class="main"><main class="content">
      <div class="code-block">
        <pre class="code">${a}</pre>
        <button class="btn copy" data-dd-copy>Copy</button>
      </div>
    </main></div></div>`},s={render:()=>n`
    <div class="doc"><div class="main"><main class="content">
      <div class="code-block">
        <pre class="code code-lead">${a}</pre>
        <button class="btn copy" data-dd-copy>Copy</button>
      </div>
    </main></div></div>`},c={render:()=>n`
    <div class="doc"><div class="main"><main class="content">
      <pre class="code"><span class="tok-kw">SELECT</span> * <span class="tok-kw">FROM</span> <span class="tok-id">{$}posts</span> <span class="tok-kw">WHERE</span> <span class="tok-id">ID</span> <span class="tok-kw">IN</span> (<span class="hole" title="A dependency the analyzer does not model was reached.">…unresolved</span>)
  <span class="tok-kw">AND</span> <span class="tok-id">post_author</span> = <span class="hole tone-danger" title="Followed to runtime input; the text cannot be fixed.">…external</span>
  <span class="tok-kw">AND</span> <span class="tok-id">post_type</span> = <span class="hole tone-neutral" title="The call was found but never examined.">…not analyzed</span></pre>
      <div class="sb-row" style="margin-top:12px">
        <span class="hole">warn — a gap the analysis knows about</span>
        <span class="hole tone-danger">danger — it cannot be closed</span>
        <span class="hole tone-neutral">neutral — nobody looked</span>
      </div>
    </main></div></div>`},l={render:()=>n`
    <div class="doc"><div class="main"><main class="content">
      ${t(`pre.code — wrapped (default)`,`<pre class="code">${a}</pre>`)}
      ${t(`pre.code-scroll — where line structure is the point`,`<pre class="code code-scroll">${a}</pre>`)}
      ${t(`with line numbers`,`<pre class="code code-scroll"><span class="code-line"><span class="ln">1238</span>  public function query( $query ) {</span>
<span class="code-line is-target"><span class="ln">1240</span>      $this->result = $this->dbh->query( $query );</span>
<span class="code-line"><span class="ln">1241</span>  }</span></pre>`)}
      ${t(`details.as-written — the raw form, if wanted`,`<details class="as-written"><summary>As written in source</summary>
           <pre class="code">"SELECT * FROM {$wpdb->posts} WHERE post_status = %s"</pre>
         </details>`)}
    </main></div></div>`},u={render:()=>n`
    <div class="doc"><div class="main"><main class="content">
      <pre class="code"><span class="tok-kw">.tok-kw</span>  keyword
<span class="tok-str">.tok-str</span> string
<span class="tok-num">.tok-num</span> number
<span class="tok-com">.tok-com</span> comment
<span class="tok-var">.tok-var</span> variable
<span class="tok-ph">.tok-ph</span>  placeholder
<span class="tok-id">.tok-id</span>  identifier</pre>
    </main></div></div>`},d=[`Block`,`Lead`,`Holes`,`Variants`,`SyntaxTokens`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <div class="code-block">
        <pre class="code">\${SQL}</pre>
        <button class="btn copy" data-dd-copy>Copy</button>
      </div>
    </main></div></div>\`
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <div class="code-block">
        <pre class="code code-lead">\${SQL}</pre>
        <button class="btn copy" data-dd-copy>Copy</button>
      </div>
    </main></div></div>\`
}`,...s.parameters?.docs?.source},description:{story:`The statement as the subject of the page rather than as an example.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <pre class="code"><span class="tok-kw">SELECT</span> * <span class="tok-kw">FROM</span> <span class="tok-id">{$}posts</span> <span class="tok-kw">WHERE</span> <span class="tok-id">ID</span> <span class="tok-kw">IN</span> (<span class="hole" title="A dependency the analyzer does not model was reached.">…unresolved</span>)
  <span class="tok-kw">AND</span> <span class="tok-id">post_author</span> = <span class="hole tone-danger" title="Followed to runtime input; the text cannot be fixed.">…external</span>
  <span class="tok-kw">AND</span> <span class="tok-id">post_type</span> = <span class="hole tone-neutral" title="The call was found but never examined.">…not analyzed</span></pre>
      <div class="sb-row" style="margin-top:12px">
        <span class="hole">warn — a gap the analysis knows about</span>
        <span class="hole tone-danger">danger — it cannot be closed</span>
        <span class="hole tone-neutral">neutral — nobody looked</span>
      </div>
    </main></div></div>\`
}`,...c.parameters?.docs?.source},description:{story:`A hole is a claim about the analysis, not about the code, so it is marked
rather than merely written — and carries a title saying where it came from.
Tone picks which kind of gap it is.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:'{\n  render: () => html`\n    <div class="doc"><div class="main"><main class="content">\n      ${specimen("pre.code — wrapped (default)", `<pre class="code">${SQL}</pre>`)}\n      ${specimen("pre.code-scroll — where line structure is the point", `<pre class="code code-scroll">${SQL}</pre>`)}\n      ${specimen("with line numbers", `<pre class="code code-scroll"><span class="code-line"><span class="ln">1238</span>  public function query( $query ) {</span>\n<span class="code-line is-target"><span class="ln">1240</span>      $this->result = $this->dbh->query( $query );</span>\n<span class="code-line"><span class="ln">1241</span>  }</span></pre>`)}\n      ${specimen("details.as-written — the raw form, if wanted", `<details class="as-written"><summary>As written in source</summary>\n           <pre class="code">"SELECT * FROM {$wpdb->posts} WHERE post_status = %s"</pre>\n         </details>`)}\n    </main></div></div>`\n}',...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <pre class="code"><span class="tok-kw">.tok-kw</span>  keyword
<span class="tok-str">.tok-str</span> string
<span class="tok-num">.tok-num</span> number
<span class="tok-com">.tok-com</span> comment
<span class="tok-var">.tok-var</span> variable
<span class="tok-ph">.tok-ph</span>  placeholder
<span class="tok-id">.tok-id</span>  identifier</pre>
    </main></div></div>\`
}`,...u.parameters?.docs?.source},description:{story:`Syntax reuses identity hues at text weight only, and never red — so the one
 red on a page always means something wants looking at.`,...u.parameters?.docs?.description}}}})))()}f();export{o as Block,c as Holes,s as Lead,u as SyntaxTokens,l as Variants,d as __namedExportsOrder,i as default};
import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./iframe-C_aFEijI.js";var r,i,a,o,s,c,l;function u(){return(u=e((()=>{n(),r={title:`Components/Sources`,parameters:{docs:{description:{component:'What a document was written from, and the numbers in the running text that point at it. `.cite` is a bracketed number at the size of a count, with no underline, so a sentence with three sources does not become three links. `.sources` numbers itself with the list-item counter, so `start` and `value` still work and CSS never disagrees with the HTML. On paper each entry spells out its address on a line of its own; `data-dd-print-urls="sources"` on the root then keeps the running text to its citation numbers.'}}}},i=`
  <ol class="sources">
    <li id="src-1"><a href="https://zenn.dev/kinzal/books/aa109c0c428089">Typesafe State in Rust (preview)</a><span class="source-meta">Zenn Books · 2022.03.08 · An eight-chapter public book on states and transitions as types</span></li>
    <li id="src-2"><a href="https://github.com/async-graphql/async-graphql/pull/1018">async-graphql / PR #1018</a><span class="source-meta">GitHub PR · 2022.08.18 · Fixes request data lost in resolvers</span></li>
    <li id="src-3"><a href="https://github.com/async-graphql/async-graphql/pull/1049">async-graphql / PR #1049</a><span class="source-meta">GitHub PR · 2022.09.06 · Primitive type support for CursorType</span></li>
    <li id="src-4"><a href="https://github.com/k-kinzal/testcontainers-php">testcontainers-php</a><span class="source-meta">GitHub · 2024.11 · PHP 5.6–8.5 support as stated in the README at the time of checking</span></li>
    <li id="src-5"><a href="https://github.com/k-kinzal/document-design">document-design / doc-ui</a><span class="source-meta">GitHub · 2026 · This paper uses the stylesheet distributed by document-design</span></li>
  </ol>`,a={render:()=>t`
    <div class="doc"><div class="main"><main class="content" style="max-width:640px">
      <div class="prose">
        <p>Published an eight-chapter book on expressing states and transitions as
          Rust types.<a class="cite" href="#src-1">1</a> Two fixes to async-graphql went
          upstream and were merged in August and September.<a class="cite" href="#src-2">2</a><a class="cite" href="#src-3">3</a>
          Later work returned to PHP and to the form of the documents themselves.<a class="cite" href="#src-4">4</a><a class="cite" href="#src-5">5</a></p>
      </div>
      <h2>Sources</h2>
      ${i}
    </main></div></div>`},o={render:()=>t`
    <article class="sheet" lang="en">
      <section class="sec">
        <div class="rail"><h2 class="label">06<br>2022</h2></div>
        <div class="field">
          <p class="lead">Toward systems teams can change themselves and find hard to break.</p>
          <p class="note">Published an eight-chapter book on expressing states and transitions as
            Rust types.<a class="cite" href="#src-1">1</a> Two fixes to async-graphql went
            upstream and were merged in August and September.<a class="cite" href="#src-2">2</a><a class="cite" href="#src-3">3</a>
            Later work returned to PHP and to the form of the documents themselves.<a class="cite" href="#src-4">4</a><a class="cite" href="#src-5">5</a></p>
        </div>
      </section>
      <section class="sec">
        <div class="rail"><h2 class="label">03<br>Sources</h2><p class="sidenote">5 sources</p></div>
        <div class="field">
          <p class="lead">Follow the public record.</p>
          ${i}
        </div>
      </section>
    </article>`},s={render:()=>t`
    <div class="doc"><div class="main"><main class="content" style="max-width:640px">
      <ol class="sources" start="6">
        <li id="src-6"><a href="https://github.com/k-kinzal/ztd-query-php">ztd-query-php</a><span class="source-meta">GitHub · 2026.01 · A PHP implementation of Zero Table Dependency and an SQL verification base</span></li>
        <li id="src-7"><a href="https://github.com/k-kinzal/php-ai-toolkit">php-ai-toolkit</a><span class="source-meta">GitHub · 2026.03 · Tools for static analysis, test output and documentation</span></li>
      </ol>
    </main></div></div>`},c={render:()=>t`
    <article class="sheet" lang="ja">
      <section class="sec">
        <div class="rail"><h2 class="label">03<br>出典</h2><p class="sidenote">3件の資料</p></div>
        <div class="field">
          <p class="lead">公開資料をたどる。</p>
          <p class="note">本文の番号から出典へ、各タイトルから原資料へ移動できる。<a class="cite" href="#ja-src-1">1</a><a class="cite" href="#ja-src-2">2</a></p>
          <ol class="sources">
            <li id="ja-src-1"><a href="https://zenn.dev/kinzal/articles/3295f5d16b9ceb">AIを使ってBower/GruntJS時代の個人サイトをモダナイズした</a><span class="source-meta">Zenn · 2025.12.06 · 画面比較・部品化・検証を伴う移行の実践</span></li>
            <li id="ja-src-2"><a href="https://zenn.dev/kinzal/articles/2ca5dcfc55f057">AIのためのタスク管理アプリケーションを作ったら気持ちよかった</a><span class="source-meta">Zenn · 2026.08.22 · 自分用アプリの開発記録。アプリ自体は非公開</span></li>
            <li id="ja-src-3"><a href="https://github.com/k-kinzal/testcontainers-php/commit/81a03391d680ea8136d1990f6adedc94bbf3584e">testcontainers-php / コンテナ再利用</a><span class="source-meta">GitHub commit · 2025.12.20 · コンテナ再利用モードの追加</span></li>
          </ol>
        </div>
      </section>
    </article>`},l=[`Cited`,`InAReport`,`Continued`,`Japanese`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content" style="max-width:640px">
      <div class="prose">
        <p>Published an eight-chapter book on expressing states and transitions as
          Rust types.<a class="cite" href="#src-1">1</a> Two fixes to async-graphql went
          upstream and were merged in August and September.<a class="cite" href="#src-2">2</a><a class="cite" href="#src-3">3</a>
          Later work returned to PHP and to the form of the documents themselves.<a class="cite" href="#src-4">4</a><a class="cite" href="#src-5">5</a></p>
      </div>
      <h2>Sources</h2>
      \${sources}
    </main></div></div>\`
}`,...a.parameters?.docs?.source},description:{story:`In a catalog page: the list at the catalog's size, cited from prose.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <article class="sheet" lang="en">
      <section class="sec">
        <div class="rail"><h2 class="label">06<br>2022</h2></div>
        <div class="field">
          <p class="lead">Toward systems teams can change themselves and find hard to break.</p>
          <p class="note">Published an eight-chapter book on expressing states and transitions as
            Rust types.<a class="cite" href="#src-1">1</a> Two fixes to async-graphql went
            upstream and were merged in August and September.<a class="cite" href="#src-2">2</a><a class="cite" href="#src-3">3</a>
            Later work returned to PHP and to the form of the documents themselves.<a class="cite" href="#src-4">4</a><a class="cite" href="#src-5">5</a></p>
        </div>
      </section>
      <section class="sec">
        <div class="rail"><h2 class="label">03<br>Sources</h2><p class="sidenote">5 sources</p></div>
        <div class="field">
          <p class="lead">Follow the public record.</p>
          \${sources}
        </div>
      </section>
    </article>\`
}`,...o.parameters?.docs?.source},description:{story:`In a report: the list at the report's reading size, in its own section.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content" style="max-width:640px">
      <ol class="sources" start="6">
        <li id="src-6"><a href="https://github.com/k-kinzal/ztd-query-php">ztd-query-php</a><span class="source-meta">GitHub · 2026.01 · A PHP implementation of Zero Table Dependency and an SQL verification base</span></li>
        <li id="src-7"><a href="https://github.com/k-kinzal/php-ai-toolkit">php-ai-toolkit</a><span class="source-meta">GitHub · 2026.03 · Tools for static analysis, test output and documentation</span></li>
      </ol>
    </main></div></div>\`
}`,...s.parameters?.docs?.source},description:{story:"A list that continues from an earlier one. The number is the list's:\n`start` moves it, and a `.cite` written as 7 lands on the entry shown as [7].",...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <article class="sheet" lang="ja">
      <section class="sec">
        <div class="rail"><h2 class="label">03<br>出典</h2><p class="sidenote">3件の資料</p></div>
        <div class="field">
          <p class="lead">公開資料をたどる。</p>
          <p class="note">本文の番号から出典へ、各タイトルから原資料へ移動できる。<a class="cite" href="#ja-src-1">1</a><a class="cite" href="#ja-src-2">2</a></p>
          <ol class="sources">
            <li id="ja-src-1"><a href="https://zenn.dev/kinzal/articles/3295f5d16b9ceb">AIを使ってBower/GruntJS時代の個人サイトをモダナイズした</a><span class="source-meta">Zenn · 2025.12.06 · 画面比較・部品化・検証を伴う移行の実践</span></li>
            <li id="ja-src-2"><a href="https://zenn.dev/kinzal/articles/2ca5dcfc55f057">AIのためのタスク管理アプリケーションを作ったら気持ちよかった</a><span class="source-meta">Zenn · 2026.08.22 · 自分用アプリの開発記録。アプリ自体は非公開</span></li>
            <li id="ja-src-3"><a href="https://github.com/k-kinzal/testcontainers-php/commit/81a03391d680ea8136d1990f6adedc94bbf3584e">testcontainers-php / コンテナ再利用</a><span class="source-meta">GitHub commit · 2025.12.20 · コンテナ再利用モードの追加</span></li>
          </ol>
        </div>
      </section>
    </article>\`
}`,...c.parameters?.docs?.source},description:{story:`Japanese: long titles wrap at the body's own rule; nothing is told to break.`,...c.parameters?.docs?.description}}}})))()}u();export{a as Cited,s as Continued,o as InAReport,c as Japanese,l as __namedExportsOrder,r as default};
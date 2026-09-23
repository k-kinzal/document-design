import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./iframe-fR7HCL7S.js";function r({id:e,name:t,params:n,returns:r,summary:i,cov:s,covTone:c,covTitle:l,line:u,usage:d}){return`
  <div class="member" id="${e}">
    <div class="member-head">
      <pre class="member-sig"><code>${a.key(`public`)} ${a.key(`function`)} ${a.name(t)}(${n}): ${r}</code></pre>
      <div class="member-meta">
        <span class="chip chip-sm ${c}" title="${l}">${s}</span>
        <a class="source-link" href="#">source</a>
        <a class="anchor" href="#${e}">§</a>
      </div>
    </div>
    <div class="member-body">
      <p class="lede">${i}</p>
      <div class="member-block">
        <h4>Parameters</h4>
        <div class="table-wrap">
          <table class="param-table plain">
            <tr>
              <td><code class="t-var">$errors</code></td>
              <td><code>${o}</code></td>
              <td>file-specific errors</td>
            </tr>
            ${t===`shouldDeduplicate`?`<tr><td><code class="t-var">$threshold</code></td><td><code>${a.key(`int`)}</code></td><td>minimum identifier count</td></tr>`:``}
          </table>
        </div>
      </div>
      <div class="member-block">
        <h4>Returns</h4>
        <div class="type-row"><code>${r}</code></div>
      </div>
      <details class="usage-details">
        <summary>Called by <span class="count">${d.length}</span></summary>
        <ul class="usage-list">
          ${d.map(e=>`<li><a href="#"><code>${e}</code></a><span class="usage-kind">calls</span></li>`).join(``)}
        </ul>
      </details>
    </div>
  </div>`}var i,a,o,s,c,l;function u(){return(u=e((()=>{n(),i={title:`Examples/API reference`,parameters:{docs:{description:{component:"php-ai-toolkit's DocGen output, rebuilt on this stylesheet. Same page, same content: the class `ErrorGrouping`, its figures methods, their signatures, coverage and callers. The markup differs — kinds come from tone classes instead of a per-project `.k-*` set, and the frame is `.doc` rather than a class on `<body>`."}}}},a={key:e=>`<span class="t-key">${e}</span>`,ext:(e,t)=>`<span class="t-ext" title="${t}">${e}</span>`,var:e=>`<span class="t-var">${e}</span>`,name:e=>`<span class="signature-name">${e}</span>`},o=`${a.key(`list`)}&lt;${a.ext(`Error`,`PHPStan\\Analyser\\Error`)}&gt;`,s=`${a.key(`array`)}&lt;${a.key(`string`)}, ${o}&gt;`,c={render:()=>t`
    <div class="doc">
      <nav class="sidebar">
        <div class="sidebar-header"><a class="sidebar-site" href="#">k-kinzal/php-ai-toolkit</a></div>
        <nav class="sidebar-section">
          <p class="sidebar-title">Packages</p>
          <ul class="sidebar-list">
            <li class="is-active"><a href="#">k-kinzal/php-ai-toolkit</a><span class="sidebar-count">542</span></li>
          </ul>
        </nav>
        <nav class="sidebar-section">
          <p class="sidebar-title">Layers</p>
          <ul class="sidebar-list">
            <li><a href="#">DocGen</a></li>
            <li class="is-active"><a href="#">PhpStanErrorFormatter</a></li>
            <li><a href="#">PhpStanRule</a></li>
            <li><a href="#">Doctest</a></li>
            <li><a href="#">LocGuard</a></li>
            <li><a href="#">TreeGuard</a></li>
            <li><a href="#">ScopeGuard</a></li>
            <li><a href="#">Installer</a></li>
            <li><a href="#">Shared</a></li>
          </ul>
        </nav>
        <nav class="sidebar-section">
          <p class="sidebar-title">On this page</p>
          <ul class="sidebar-list sidebar-context">
            <li><a href="#methods">Methods</a></li>
            <li data-dd-level="3"><a href="#method.byFile">byFile</a></li>
            <li data-dd-level="3"><a href="#method.byIdentifier">byIdentifier</a></li>
            <li data-dd-level="3"><a href="#method.shouldDeduplicate">shouldDeduplicate</a></li>
          </ul>
        </nav>
      </nav>

      <div class="main">
        <header class="topbar">
          <button class="btn btn-quiet nav-toggle" data-dd-nav-toggle title="Toggle navigation">☰</button>
          <nav class="breadcrumbs">
            <a href="#">k-kinzal/php-ai-toolkit</a><span class="breadcrumb-sep">/</span>
            <a href="#">PhpAiToolkit\\PhpStan\\ErrorFormatter</a><span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-current">ErrorGrouping</span>
          </nav>
          <div class="topbar-tools">
            <input type="search" class="input input-search" placeholder="Search… ( / )" data-dd-search autocomplete="off" spellcheck="false">
            <a class="source-link" href="#">github.com</a>
            <button class="btn btn-quiet" data-dd-theme-toggle title="Toggle theme">◐</button>
          </div>
        </header>
        <div class="search-results" data-dd-search-results hidden></div>

        <main class="content">
          <div class="symbol-head">
            <h1><span class="chip tone-blue">class</span>ErrorGrouping</h1>
            <div class="symbol-meta">
              <a class="chip chip-ghost tone-indigo" href="#" title="deptrac layer">PhpStanErrorFormatter</a>
              <a class="source-link" href="#">src/PhpStan/ErrorFormatter/ErrorGrouping.php:12</a>
            </div>
          </div>

          <pre class="signature"><code>${a.key(`final`)} ${a.key(`class`)} ${a.name(`ErrorGrouping`)}</code></pre>

          <p class="lede">Groups PHPStan errors for renderer-specific layouts.</p>

          <section>
            <h2 id="methods">Methods<a class="anchor" href="#methods">§</a></h2>
            <p class="section-description">Public methods, with the coverage the test suite reports for each and the tests that reach it.</p>

            ${r({id:`method.byFile`,name:`byFile`,params:`${o} ${a.var(`$errors`)}`,returns:s,summary:`Groups file-specific errors by file path.`,cov:`100% · 6/6`,covTone:`cov-high`,covTitle:`Line coverage: 6 of 6 executable lines executed by the test suite`,usage:[`AiRulesHumanErrorFormatter::formatErrors`,`ErrorGroupingTest::testByFileGroupsByPath`,`HumanErrorPrinter::print`]})}

            ${r({id:`method.byIdentifier`,name:`byIdentifier`,params:`${o} ${a.var(`$errors`)}`,returns:s,summary:`Groups file-specific errors by identifier.`,cov:`100% · 7/7`,covTone:`cov-high`,covTitle:`Line coverage: 7 of 7 executable lines executed by the test suite`,usage:[`AiRulesAiErrorFormatter::formatErrors`,`ErrorGroupingTest::testByIdentifierGroupsByIdentifier`]})}

            ${r({id:`method.shouldDeduplicate`,name:`shouldDeduplicate`,params:`${o} ${a.var(`$errors`)}, ${a.key(`int`)} ${a.var(`$threshold`)}`,returns:a.key(`bool`),summary:`Checks whether any identifier count reaches the deduplication threshold.`,cov:`75% · 3/4`,covTone:`cov-mid`,covTitle:`Line coverage: 3 of 4 executable lines executed by the test suite`,usage:[`AiRulesAiErrorFormatter::formatErrors`,`ErrorGroupingTest::testThreshold`]})}
          </section>
        </main>

        <footer class="doc-footer">
          Generated by <a href="#">php-ai-toolkit</a> docgen
        </footer>
      </div>
    </div>`},l=[`ClassPage`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc">
      <nav class="sidebar">
        <div class="sidebar-header"><a class="sidebar-site" href="#">k-kinzal/php-ai-toolkit</a></div>
        <nav class="sidebar-section">
          <p class="sidebar-title">Packages</p>
          <ul class="sidebar-list">
            <li class="is-active"><a href="#">k-kinzal/php-ai-toolkit</a><span class="sidebar-count">542</span></li>
          </ul>
        </nav>
        <nav class="sidebar-section">
          <p class="sidebar-title">Layers</p>
          <ul class="sidebar-list">
            <li><a href="#">DocGen</a></li>
            <li class="is-active"><a href="#">PhpStanErrorFormatter</a></li>
            <li><a href="#">PhpStanRule</a></li>
            <li><a href="#">Doctest</a></li>
            <li><a href="#">LocGuard</a></li>
            <li><a href="#">TreeGuard</a></li>
            <li><a href="#">ScopeGuard</a></li>
            <li><a href="#">Installer</a></li>
            <li><a href="#">Shared</a></li>
          </ul>
        </nav>
        <nav class="sidebar-section">
          <p class="sidebar-title">On this page</p>
          <ul class="sidebar-list sidebar-context">
            <li><a href="#methods">Methods</a></li>
            <li data-dd-level="3"><a href="#method.byFile">byFile</a></li>
            <li data-dd-level="3"><a href="#method.byIdentifier">byIdentifier</a></li>
            <li data-dd-level="3"><a href="#method.shouldDeduplicate">shouldDeduplicate</a></li>
          </ul>
        </nav>
      </nav>

      <div class="main">
        <header class="topbar">
          <button class="btn btn-quiet nav-toggle" data-dd-nav-toggle title="Toggle navigation">☰</button>
          <nav class="breadcrumbs">
            <a href="#">k-kinzal/php-ai-toolkit</a><span class="breadcrumb-sep">/</span>
            <a href="#">PhpAiToolkit\\\\PhpStan\\\\ErrorFormatter</a><span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-current">ErrorGrouping</span>
          </nav>
          <div class="topbar-tools">
            <input type="search" class="input input-search" placeholder="Search… ( / )" data-dd-search autocomplete="off" spellcheck="false">
            <a class="source-link" href="#">github.com</a>
            <button class="btn btn-quiet" data-dd-theme-toggle title="Toggle theme">◐</button>
          </div>
        </header>
        <div class="search-results" data-dd-search-results hidden></div>

        <main class="content">
          <div class="symbol-head">
            <h1><span class="chip tone-blue">class</span>ErrorGrouping</h1>
            <div class="symbol-meta">
              <a class="chip chip-ghost tone-indigo" href="#" title="deptrac layer">PhpStanErrorFormatter</a>
              <a class="source-link" href="#">src/PhpStan/ErrorFormatter/ErrorGrouping.php:12</a>
            </div>
          </div>

          <pre class="signature"><code>\${T.key("final")} \${T.key("class")} \${T.name("ErrorGrouping")}</code></pre>

          <p class="lede">Groups PHPStan errors for renderer-specific layouts.</p>

          <section>
            <h2 id="methods">Methods<a class="anchor" href="#methods">§</a></h2>
            <p class="section-description">Public methods, with the coverage the test suite reports for each and the tests that reach it.</p>

            \${method({
    id: "method.byFile",
    name: "byFile",
    params: \`\${listError} \${T.var("$errors")}\`,
    returns: arrayOf,
    summary: "Groups file-specific errors by file path.",
    cov: "100% · 6/6",
    covTone: "cov-high",
    covTitle: "Line coverage: 6 of 6 executable lines executed by the test suite",
    usage: ["AiRulesHumanErrorFormatter::formatErrors", "ErrorGroupingTest::testByFileGroupsByPath", "HumanErrorPrinter::print"]
  })}

            \${method({
    id: "method.byIdentifier",
    name: "byIdentifier",
    params: \`\${listError} \${T.var("$errors")}\`,
    returns: arrayOf,
    summary: "Groups file-specific errors by identifier.",
    cov: "100% · 7/7",
    covTone: "cov-high",
    covTitle: "Line coverage: 7 of 7 executable lines executed by the test suite",
    usage: ["AiRulesAiErrorFormatter::formatErrors", "ErrorGroupingTest::testByIdentifierGroupsByIdentifier"]
  })}

            \${method({
    id: "method.shouldDeduplicate",
    name: "shouldDeduplicate",
    params: \`\${listError} \${T.var("$errors")}, \${T.key("int")} \${T.var("$threshold")}\`,
    returns: T.key("bool"),
    summary: "Checks whether any identifier count reaches the deduplication threshold.",
    cov: "75% · 3/4",
    covTone: "cov-mid",
    covTitle: "Line coverage: 3 of 4 executable lines executed by the test suite",
    usage: ["AiRulesAiErrorFormatter::formatErrors", "ErrorGroupingTest::testThreshold"]
  })}
          </section>
        </main>

        <footer class="doc-footer">
          Generated by <a href="#">php-ai-toolkit</a> docgen
        </footer>
      </div>
    </div>\`
}`,...c.parameters?.docs?.source}}}})))()}u();export{c as ClassPage,l as __namedExportsOrder,i as default};
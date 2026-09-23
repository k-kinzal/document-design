import { html } from "./helpers.js";

export default {
  title: "Examples/API reference",
  parameters: {
    docs: {
      description: {
        component:
          "php-ai-toolkit's DocGen output, rebuilt on this stylesheet. Same " +
          "page, same content: the class `ErrorGrouping`, its three methods, " +
          "their signatures, coverage and callers. The markup differs — kinds " +
          "come from tone classes instead of a per-project `.k-*` set, and the " +
          "frame is `.doc` rather than a class on `<body>`.",
      },
    },
  },
};

const T = {
  key: (s) => `<span class="t-key">${s}</span>`,
  ext: (s, full) => `<span class="t-ext" title="${full}">${s}</span>`,
  var: (s) => `<span class="t-var">${s}</span>`,
  name: (s) => `<span class="sig-name">${s}</span>`,
};

const listError = `${T.key("list")}&lt;${T.ext("Error", "PHPStan\\Analyser\\Error")}&gt;`;
const arrayOf = `${T.key("array")}&lt;${T.key("string")}, ${listError}&gt;`;

function method({ id, name, params, returns, summary, cov, covTone, covTitle, line, usage }) {
  return `
  <div class="member" id="${id}">
    <div class="member-head">
      <pre class="member-sig"><code>${T.key("public")} ${T.key("function")} ${T.name(name)}(${params}): ${returns}</code></pre>
      <div class="member-meta">
        <span class="chip chip-sm ${covTone}" title="${covTitle}">${cov}</span>
        <a class="src-link" href="#">source</a>
        <a class="anchor" href="#${id}">§</a>
      </div>
    </div>
    <div class="member-body">
      <p class="lede">${summary}</p>
      <div class="member-block">
        <h4>Parameters</h4>
        <div class="table-wrap">
          <table class="param-table plain">
            <tr>
              <td><code class="t-var">$errors</code></td>
              <td><code>${listError}</code></td>
              <td>file-specific errors</td>
            </tr>
            ${
              name === "shouldDeduplicate"
                ? `<tr><td><code class="t-var">$threshold</code></td><td><code>${T.key("int")}</code></td><td>minimum identifier count</td></tr>`
                : ""
            }
          </table>
        </div>
      </div>
      <div class="member-block">
        <h4>Returns</h4>
        <div class="type-row"><code>${returns}</code></div>
      </div>
      <details class="usage-details">
        <summary>Called by <span class="count">${usage.length}</span></summary>
        <ul class="usage-list">
          ${usage
            .map(
              (u) =>
                `<li><a href="#"><code>${u}</code></a><span class="usage-kind">calls</span></li>`
            )
            .join("")}
        </ul>
      </details>
    </div>
  </div>`;
}

export const ClassPage = {
  render: () => html`
    <div class="doc">
      <nav class="sidebar">
        <div class="sb-head"><a class="sb-site" href="#">k-kinzal/php-ai-toolkit</a></div>
        <nav class="sb-block">
          <p class="sb-title">Packages</p>
          <ul class="sb-list">
            <li class="is-active"><a href="#">k-kinzal/php-ai-toolkit</a><span class="sb-count">542</span></li>
          </ul>
        </nav>
        <nav class="sb-block">
          <p class="sb-title">Layers</p>
          <ul class="sb-list">
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
        <nav class="sb-block">
          <p class="sb-title">On this page</p>
          <ul class="sb-list sb-context">
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
          <nav class="crumbs">
            <a href="#">k-kinzal/php-ai-toolkit</a><span class="crumb-sep">/</span>
            <a href="#">PhpAiToolkit\\PhpStan\\ErrorFormatter</a><span class="crumb-sep">/</span>
            <span class="crumb-current">ErrorGrouping</span>
          </nav>
          <div class="topbar-tools">
            <input type="search" class="field-input field-search" placeholder="Search… ( / )" data-dd-search autocomplete="off" spellcheck="false">
            <a class="src-link" href="#">github.com</a>
            <button class="btn btn-quiet" data-dd-theme-toggle title="Toggle theme">◐</button>
          </div>
        </header>
        <div class="search-results" data-dd-search-results hidden></div>

        <main class="content">
          <div class="symbol-head">
            <h1><span class="chip tone-blue">class</span>ErrorGrouping</h1>
            <div class="symbol-meta">
              <a class="chip chip-ghost tone-indigo" href="#" title="deptrac layer">PhpStanErrorFormatter</a>
              <a class="src-link" href="#">src/PhpStan/ErrorFormatter/ErrorGrouping.php:12</a>
            </div>
          </div>

          <pre class="signature"><code>${T.key("final")} ${T.key("class")} ${T.name("ErrorGrouping")}</code></pre>

          <p class="lede">Groups PHPStan errors for renderer-specific layouts.</p>

          <section>
            <h2 id="methods">Methods<a class="anchor" href="#methods">§</a></h2>
            <p class="section-note">Public methods, with the coverage the test suite reports for each and the tests that reach it.</p>

            ${method({
              id: "method.byFile",
              name: "byFile",
              params: `${listError} ${T.var("$errors")}`,
              returns: arrayOf,
              summary: "Groups file-specific errors by file path.",
              cov: "100%",
              covTone: "cov-high",
              covTitle: "6 of 6 executable lines executed by the test suite",
              usage: [
                "AiRulesHumanErrorFormatter::formatErrors",
                "ErrorGroupingTest::testByFileGroupsByPath",
                "HumanErrorPrinter::print",
              ],
            })}

            ${method({
              id: "method.byIdentifier",
              name: "byIdentifier",
              params: `${listError} ${T.var("$errors")}`,
              returns: arrayOf,
              summary: "Groups file-specific errors by identifier.",
              cov: "100%",
              covTone: "cov-high",
              covTitle: "7 of 7 executable lines executed by the test suite",
              usage: [
                "AiRulesAiErrorFormatter::formatErrors",
                "ErrorGroupingTest::testByIdentifierGroupsByIdentifier",
              ],
            })}

            ${method({
              id: "method.shouldDeduplicate",
              name: "shouldDeduplicate",
              params: `${listError} ${T.var("$errors")}, ${T.key("int")} ${T.var("$threshold")}`,
              returns: T.key("bool"),
              summary: "Checks whether any identifier count reaches the deduplication threshold.",
              cov: "75%",
              covTone: "cov-mid",
              covTitle: "3 of 4 executable lines executed by the test suite",
              usage: ["AiRulesAiErrorFormatter::formatErrors", "ErrorGroupingTest::testThreshold"],
            })}
          </section>
        </main>

        <footer class="doc-footer">
          Generated by <a href="#">php-ai-toolkit</a> docgen
        </footer>
      </div>
    </div>`,
};

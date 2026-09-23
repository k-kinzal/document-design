import { html } from "./helpers.js";

export default {
  title: "Foundations/Robustness",
  parameters: {
    docs: {
      description: {
        component:
          "Every specimen on this page is the **longest real thing** its " +
          "generator actually produced — not an invented worst case.\n\n" +
          "A design system that is only tested against content its author " +
          "chose is tested against the easy case. The failure it hides is the " +
          "one that shows up on the third page of a real catalog: a signature " +
          "that scrolls off the screen, a filename that eats the rail, a " +
          "figure that no longer fits its column. Curated specimens make a " +
          "system look finished; real extremes tell you whether it is.",
      },
    },
  },
};

/* --- measured from the actual generated output, 2026-09 --- */
const REAL = {
  // php-ai-toolkit: the longest member signature in 600 pages — 819 characters
  signature:
    "public function applyValueOption( array{packages: ?list&lt;string&gt;, vendor: ?list&lt;string&gt;, " +
    "vendorDev: ?list&lt;string&gt;, exclude: ?list&lt;string&gt;, output: ?string, title: ?string, " +
    "deptrac: ?string, coverage: ?string, cacheDir: ?string, baseUrl: ?string, diff: ?string, " +
    "diffBase: ?string, jobs: ?int, verbose: ?bool } $options, string $name, string $value ): " +
    "array{packages: ?list&lt;string&gt;, vendor: ?list&lt;string&gt;, vendorDev: ?list&lt;string&gt;, " +
    "exclude: ?list&lt;string&gt;, output: ?string, title: ?string, deptrac: ?string, coverage: ?string, " +
    "cacheDir: ?string, baseUrl: ?string, diff: ?string, diffBase: ?string, jobs: ?int, verbose: ?bool }",
  // ztd-query-php: the longest statement in 844 — 420 characters over 13 lines
  sql:
    "DELETE FROM {$}postmeta\n\t\t\tWHERE meta_key LIKE %s\n\t\t\tOR meta_key LIKE %s\n" +
    "\t\t\tOR meta_key LIKE %s\n\t\t\tOR meta_key LIKE %s\n\t\t\tOR meta_key LIKE %s\n" +
    "\t\t\tOR meta_key LIKE %s\n\t\t\tOR meta_key LIKE %s\n\t\t\tOR meta_key LIKE %s\n" +
    "\t\t\tOR meta_key LIKE %s\n\t\t\tOR meta_key LIKE %s\n\t\t\tOR meta_key LIKE %s",
  // the longest page this generator emits — 70 characters
  filename: "wp-includes-rest-api-endpoints-class-wp-rest-users-controller-php",
  // the longest symbol-meta line — 94 characters
  symbolMeta:
    "PhpStanRule · src/PhpStan/Rule/NoBrokenCodeExpectation/NoBrokenCodeExpectationErrorBuilder.php:15",
  summary:
    "Forbids catching Throwable, Exception, and the LogicException and Error families outside a configured boundary layer.",
  // the real caveat from a QuuuAI run report
  caveat:
    "CI は作成時点で pending。このランでは成功未確認。空 blob アップロードは JSON 本文を付けて再送した。" +
    "throwaway の autoload パス誤りは成果物ではない。ローカル worktree は PR #380 相当の古い基点のままなので、" +
    "続けるなら fetch 後にリモートへ合わせる。",
};

/** An 819-character signature. It is one line and must not be reflowed — the
 *  indentation of a shape type is what makes it legible — so the question is
 *  whether the page scrolls or the signature does. */
export const LongestSignature = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="symbol-head">
        <h1><span class="chip tone-blue">class</span>DocGenConfig</h1>
        <p class="symbol-meta">${REAL.symbolMeta}</p>
      </div>
      <pre class="signature"><code>${REAL.signature}</code></pre>
      <p class="muted">819 characters, the longest in 600 generated pages.</p>
    </main></div></div>`,
};

/** A 420-character statement over 13 lines, in a listing that clamps to three.
 *  The clamp is the design; what matters is that the row still reads as a row. */
export const LongestStatement = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <ul class="rows">
        <li class="row">
          <a class="row-main" href="#">
            <span class="chip tone-pink">DELETE</span>
            <span class="row-body">${REAL.sql}</span>
          </a>
          <p class="row-meta"><a href="#">wp-includes/meta.php:1284</a>
             <a href="#">delete_metadata_by_mid</a>
             <span class="chip chip-sm tone-warn">dynamic-sql</span></p>
        </li>
        <li class="row">
          <a class="row-main" href="#">
            <span class="chip tone-blue">SELECT</span>
            <span class="row-body">SELECT * FROM {$}posts WHERE ID = %d</span>
          </a>
          <p class="row-meta"><a href="#">wp-includes/post.php:1240</a><a href="#">get_post</a></p>
        </li>
      </ul>
    </main></div></div>`,
};

/** A 70-character generated filename in a 260px rail, and a 94-character
 *  symbol path in a breadcrumb. Both clip; the question is what survives. */
export const LongestNames = {
  render: () => html`
    <div class="doc">
      <nav class="sidebar">
        <div class="sidebar-section">
          <p class="sidebar-title">Files</p>
          <ul class="sidebar-list">
            <li class="is-active"><a href="#">${REAL.filename}</a><span class="sidebar-count">31</span></li>
            <li><a href="#">wp-admin-includes-class-wp-privacy-requests-table-php</a><span class="sidebar-count">12</span></li>
            <li><a href="#">wp-includes-post.php</a><span class="sidebar-count">49</span></li>
          </ul>
        </div>
        <div class="sidebar-section">
          <p class="sidebar-title">Files — split</p>
          <ul class="sidebar-list">
            <li class="is-active"><a href="#">
              <span class="sidebar-name">class-wp-rest-users-controller.php</span>
              <span class="sidebar-path">wp-includes/rest-api/endpoints</span>
            </a><span class="sidebar-count">31</span></li>
            <li><a href="#">
              <span class="sidebar-name">class-wp-privacy-requests-table.php</span>
              <span class="sidebar-path">wp-admin/includes</span>
            </a><span class="sidebar-count">12</span></li>
            <li><a href="#">
              <span class="sidebar-name">post.php</span>
              <span class="sidebar-path">wp-includes</span>
            </a><span class="sidebar-count">49</span></li>
          </ul>
        </div>
      </nav>
      <div class="main">
        <header class="topbar">
          <nav class="breadcrumbs">
            <a href="#">k-kinzal/php-ai-toolkit</a><span class="breadcrumb-sep">/</span>
            <a href="#">PhpAiToolkit\\PhpStan\\Rule\\NoBrokenCodeExpectation</a><span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-current">NoBrokenCodeExpectationErrorBuilder</span>
          </nav>
        </header>
        <main class="content">
          <div class="table-wrap">
            <table class="items">
              <tbody>
                <tr>
                  <td class="item-name"><a href="#">NoBrokenCodeExpectationErrorBuilder</a><br>
                      <span class="item-ns">PhpAiToolkit\\PhpStan\\Rule\\NoBrokenCodeExpectation</span></td>
                  <td><span class="chip chip-sm tone-blue">class</span></td>
                  <td class="item-summary">${REAL.summary}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>`,
};

/** A real 150-character Japanese caveat, and a lead that is longer than the
 *  sample the design was drawn with. */
export const LongJapanese = {
  render: () => html`
    <article class="sheet" lang="ja">
      <section class="sec" style="margin-top:0">
        <div class="label">04<br>検証</div>
        <div class="field">
          <p class="lead">ローカルは通った。作業ディレクトリは空のまま。ただし CI は未確認で、リモートの基点も古い。</p>
          <p class="note">変更 unit の差分カバレッジは 16/16、lint 23 件、Behat 307 がローカルで通過した。
             パーサ src は無変更で、baseline・ゲート・README・定義2件・feature 1件の計6ファイル。</p>
        </div>
        <p class="caveat">${REAL.caveat}</p>
      </section>
    </article>`,
};

/** Nothing, one, and a number with more digits than the column was drawn for. */
export const EdgesOfCount = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <h2>Nothing matched</h2>
      <div class="empty">
        <p class="empty-title">No statement matches</p>
        <p class="empty-note">No DELETE in this source was fully resolved.</p>
      </div>

      <h2>A single row</h2>
      <ul class="rows">
        <li class="row"><a class="row-main" href="#">
          <span class="chip tone-blue">SHOW</span><span class="row-body">SHOW TABLES</span>
        </a></li>
      </ul>

      <h2>Figures the column was not drawn for</h2>
      <div class="stats">
        <div class="stat"><b class="stat-fig">1,284,097</b><span class="stat-label">rows examined</span></div>
        <div class="stat tone-warn"><b class="stat-fig">0</b><span class="stat-label">resolved</span></div>
        <div class="stat"><b class="stat-fig">99.97%</b><span class="stat-label">of a very long label that keeps going</span></div>
      </div>
    </main></div></div>`,
};

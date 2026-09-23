import { html } from "./helpers.js";

export default {
  title: "Examples/SQL catalog",
  parameters: {
    docs: {
      description: {
        component:
          "ztd-query-php's catalog overview for WordPress, rebuilt on this " +
          "stylesheet. Same figures: 844 statements, 12 tables, 240 functions, " +
          "77 files, 978 findings. The `.k-select` family is gone — kinds are " +
          "tone classes now, and the coverage bar is `.meter` rather than a " +
          "second `.stack` that meant something else in the other project.",
      },
    },
  },
};

const KINDS = [
  ["SELECT", "blue", 639], ["ALTER", "indigo", 63], ["UPDATE", "violet", 44],
  ["INSERT", "teal", 35], ["DELETE", "pink", 28], ["UNKNOWN", "slate", 20],
  ["DROP", "indigo", 9], ["OTHER", "slate", 3], ["CREATE", "indigo", 2], ["SHOW", "slate", 1],
];

const TABLES = [
  ["{$}cache_data", "13 · 4 read · 8 write"], ["{$}items", "7 · 4 read · 2 write"],
  ["{$}posts", "3 · 3 read · 0 write"], ["information_schema.TABLES", "2 · 2 read · 0 write"],
  ["{$}linkcategories", "2 · 1 read · 0 write"], ["{$}categories", "1 · 0 read · 0 write"],
];

const CLASSES = [
  ["WP_User_Search", "36 statements"], ["wpdb", "28 statements"], ["WP_Query", "23 statements"],
  ["SimplePie\\Cache\\MySQL", "21 statements"], ["WP_Term_Query", "20 statements"],
  ["WP_Comment_Query", "18 statements"],
];

const FILES = [
  ["wp-admin/includes/upgrade.php", "162 statements"], ["wp-admin/includes/deprecated.php", "57 statements"],
  ["wp-includes/post.php", "49 statements"], ["wp-includes/general-template.php", "39 statements"],
  ["wp-includes/taxonomy.php", "39 statements"], ["wp-includes/meta.php", "31 statements"],
];

const RULES = [
  ["dynamic-sql", "warn", "medium", 709, "A value is spliced into the statement text instead of being bound."],
  ["analysis-incomplete", "neutral", "low", 239, "A cycle or an analysis budget stopped the search before it closed."],
  ["unresolved-sql", "neutral", "low", 25, "The statement text could not be reconstructed at all."],
  ["call-not-analyzed", "neutral", "low", 5, "A call that carries a statement was found but never examined."],
];

const HOTSPOTS = [
  ["WP_User_Search::query", "wp-admin/includes/deprecated.php · 36 medium"],
  ["wp_get_archives", "wp-includes/general-template.php · 34 medium"],
  ["pre_schema_upgrade", "wp-admin/includes/upgrade.php · 25 medium"],
  ["drop_index", "wp-admin/includes/upgrade.php · 21 medium"],
  ["post_exists", "wp-admin/includes/post.php · 20 medium"],
  ["export_wp", "wp-admin/includes/export.php · 19 medium"],
];

const RESOLUTIONS = [
  ["resolved", "tone-ok", 35, "The statement text is fully determined.", "tone-ok"],
  ["external-input", "tone-danger", 0, "The values were followed to runtime input, so the text cannot be fixed.", "tone-danger"],
  ["incomplete-model", "chip-ghost", 709, "A dependency the analyzer does not model was reached.", "is-open"],
  ["incomplete", "chip-ghost", 95, "A cycle or an analysis budget stopped the search before it closed.", "is-open|--dd-hatch:45deg"],
  ["not-analyzed", "tone-neutral", 5, "The call was found but never examined, so nothing was read from it.", "tone-neutral"],
];

const peek = (rows) =>
  rows.map(([name, fig]) => `<li><a href="#">${name}</a><span class="peek-figures">${fig}</span></li>`).join("");

export const Overview = {
  render: () => html`
    <div class="doc">
      <nav class="sidebar">
        <div class="sidebar-section">
          <p class="sidebar-title">Browse</p>
          <ul class="sidebar-list">
            <li class="is-active"><a href="#">Overview</a></li>
            <li><a href="#">Statements</a><span class="sidebar-count">844</span></li>
            <li><a href="#">Tables</a><span class="sidebar-count">12</span></li>
            <li><a href="#">Namespaces</a><span class="sidebar-count">2</span></li>
            <li><a href="#">Files</a><span class="sidebar-count">77</span></li>
            <li><a href="#">Findings</a><span class="sidebar-count">978</span></li>
          </ul>
        </div>
        <div class="sidebar-section">
          <p class="sidebar-title">On this page</p>
          <ul class="sidebar-list sidebar-context">
            <li><a href="#attention" title="Needs attention">Needs attention</a></li>
            <li><a href="#coverage" title="How far the analysis got">How far the analysis got</a></li>
          </ul>
        </div>
      </nav>

      <div class="main">
        <header class="topbar">
          <button class="btn btn-quiet nav-toggle" data-dd-nav-toggle title="Toggle navigation">☰</button>
          <nav class="breadcrumbs"><span class="breadcrumb-current">Overview</span></nav>
          <div class="topbar-tools">
            <input type="search" class="input input-search" placeholder="Find a statement… ( / )"
                   title="Search by SQL text, table, function or file" data-dd-search autocomplete="off" spellcheck="false">
            <button class="btn btn-quiet" data-dd-theme-toggle title="Toggle theme">◐</button>
          </div>
        </header>
        <div class="search-results" data-dd-search-results hidden></div>

        <main class="content">
          <h1>Overview</h1>
          <p class="lede">Every statement this source can issue, read back from the calls that receive it.
            Start from the table, class or file you are working on, or from what the analysis flagged.</p>
          <p class="page-counts">
            <a href="#">844 statements</a><span class="page-counts-sep">·</span>
            <a href="#">12 tables</a><span class="page-counts-sep">·</span>
            <a href="#">240 functions</a><span class="page-counts-sep">·</span>
            <a href="#">77 files</a>
          </p>

          <div class="cards">
            <section class="card">
              <h2><a href="#">Tables</a><span class="count">12</span></h2>
              <p class="card-description">Which statements read, write or alter a table, and where each is issued.
                Start here before changing a schema.</p>
              <ol class="peek">${peek(TABLES)}</ol>
              <p class="card-more"><a href="#">All 12 tables</a></p>
            </section>

            <section class="card">
              <h2><a href="#">Namespaces</a><span class="count">2</span></h2>
              <p class="card-description">The statements each class and function issues, method by method.
                Start here before refactoring code that talks to the database.</p>
              <ol class="peek">${peek(CLASSES)}</ol>
              <p class="card-more"><a href="#">All 2 namespaces</a></p>
            </section>

            <section class="card">
              <h2><a href="#">Files</a><span class="count">77</span></h2>
              <p class="card-description">The statements written in each file, function by function.</p>
              <ol class="peek">${peek(FILES)}</ol>
              <p class="card-more"><a href="#">All 77 files</a></p>
            </section>

            <section class="card">
              <h2><a href="#">Statements</a><span class="count">844</span></h2>
              <p class="card-description">Every statement, to narrow down by what it does, how far the analysis got
                and what was reported.</p>
              <ol class="peek peek-chips">
                ${KINDS.map(
                  ([label, tone, n]) =>
                    `<li><a class="chip tone-${tone}" href="#">${label}</a><span class="peek-figures">${n}</span></li>`
                ).join("")}
              </ol>
              <p class="card-more"><a href="#">All 844 statements</a></p>
            </section>
          </div>

          <h2 id="attention">Needs attention<span class="count">978 findings</span><a class="anchor" href="#attention">§</a></h2>
          <div class="split">
            <div class="table-wrap">
              <table>
                <thead><tr><th>Rule</th><th class="tight">Severity</th><th class="num">Statements</th><th>What it reports</th></tr></thead>
                <tbody>
                  ${RULES.map(
                    ([rule, tone, sev, n, what]) => `
                    <tr>
                      <td class="tight"><a class="mono" href="#">${rule}</a></td>
                      <td class="tight"><span class="chip tone-${tone}">${sev}</span></td>
                      <td class="num">${n}</td>
                      <td>${what}</td>
                    </tr>`
                  ).join("")}
                </tbody>
              </table>
            </div>
            <section class="aside">
              <h3>Functions issuing flagged statements</h3>
              <ol class="peek">
                ${HOTSPOTS.map(
                  ([fn, where]) =>
                    `<li><a class="mono" href="#">${fn}</a><span class="peek-figures">${where}</span></li>`
                ).join("")}
              </ol>
              <p class="card-more"><a href="#">Every flagged function</a></p>
            </section>
          </div>

          <h2 id="coverage">How far the analysis got<a class="anchor" href="#coverage">§</a></h2>
          <p class="caveat"><a href="#">812 of the 844 statements</a> are lower bounds. A dependency, a
            cycle or an analysis budget stopped the search, so a call may issue more than is listed here
            and the totals below are floors, not counts.</p>
          <div class="meter">
            <a class="meter-part tone-ok" style="--dd-part:4%" href="#" title="resolved: The statement text is fully determined."></a>
            <a class="meter-part is-open" style="--dd-part:84%" href="#" title="incomplete-model: A dependency the analyzer does not model was reached."></a>
            <a class="meter-part is-open" style="--dd-part:11%;--dd-hatch:45deg" href="#" title="incomplete: A cycle or an analysis budget stopped the search before it closed."></a>
            <a class="meter-part tone-neutral" style="--dd-part:1%" href="#" title="not-analyzed: The call was found but never examined."></a>
          </div>
          <ul class="legend">
            ${RESOLUTIONS.map(
              ([name, cls, n, note, mark]) => `
              <li>
                <span class="meter-legend-swatch ${mark.split("|")[0]}"${mark.includes("|") ? ` style="${mark.split("|")[1]}"` : ""}></span>
                <a class="chip ${cls}" href="#" title="${note}">${name}</a>
                <span class="meter-legend-count">${n}</span>
                <span class="meter-legend-description">${note}</span>
              </li>`
            ).join("")}
          </ul>
        </main>
      </div>
    </div>`,
};

/** The listing the overview leads to, with its facets live. */
export const Statements = {
  render: () => html`
    <div class="doc">
      <nav class="sidebar">
        <div class="sidebar-section">
          <p class="sidebar-title">Browse</p>
          <ul class="sidebar-list">
            <li><a href="#">Overview</a></li>
            <li class="is-active"><a href="#">Statements</a><span class="sidebar-count">844</span></li>
            <li><a href="#">Tables</a><span class="sidebar-count">12</span></li>
            <li><a href="#">Namespaces</a><span class="sidebar-count">2</span></li>
            <li><a href="#">Files</a><span class="sidebar-count">77</span></li>
            <li><a href="#">Findings</a><span class="sidebar-count">978</span></li>
          </ul>
        </div>
      </nav>
      <div class="main">
        <header class="topbar">
          <button class="btn btn-quiet nav-toggle" data-dd-nav-toggle>☰</button>
          <nav class="breadcrumbs"><a href="#">Overview</a><span class="breadcrumb-sep">/</span><span class="breadcrumb-current">Statements</span></nav>
          <div class="topbar-tools">
            <input type="search" class="input input-search" placeholder="Find a statement… ( / )" data-dd-search>
            <button class="btn btn-quiet" data-dd-theme-toggle>◐</button>
          </div>
        </header>
        <main class="content">
          <h1>Statements<span class="count">844</span></h1>
          <p class="listing-range">This page holds <b>6</b> of <b>844</b> statements. The facet counts are
            for all 844; filtering and search act on the 6 rendered here.</p>
          <div class="facets" data-dd-facets="#stmts">
            <input type="search" class="input" placeholder="Filter…" data-dd-facet-search>
            <div class="facet-group">
              ${KINDS.slice(0, 5)
                .map(
                  ([label, tone, n]) =>
                    `<button class="chip facet tone-${tone}" data-dd-facet="kind:${label.toLowerCase()}">${label}<span class="facet-count">${n}</span></button>`
                )
                .join("")}
            </div>
            <div class="facet-group">
              <button class="chip facet tone-ok" data-dd-facet="resolution:resolved">resolved<span class="facet-count">35</span></button>
              <button class="chip facet tone-neutral" data-dd-facet="resolution:open">lower bound<span class="facet-count">812</span></button>
            </div>
            <button class="btn" data-dd-facet-clear>Clear</button>
            <span class="facet-shown"></span>
          </div>
          <ul class="rows" id="stmts">
            ${[
              ["select", "resolved", "blue", "SELECT", "SELECT * FROM {$}posts WHERE post_status = 'publish' AND post_type = %s ORDER BY post_date DESC LIMIT 10", "wp-includes/post.php:1240", "get_posts"],
              ["select", "open", "blue", "SELECT", "SELECT option_value FROM {$}options WHERE option_name = %s LIMIT 1", "wp-includes/option.php:168", "get_option"],
              ["update", "open", "violet", "UPDATE", "UPDATE {$}options SET option_value = %s WHERE option_name = %s", "wp-includes/option.php:412", "update_option"],
              ["insert", "resolved", "teal", "INSERT", "INSERT INTO {$}postmeta (post_id, meta_key, meta_value) VALUES (%d, %s, %s)", "wp-includes/meta.php:96", "add_metadata"],
              ["alter", "open", "indigo", "ALTER", "ALTER TABLE {$}posts ADD INDEX post_name (post_name(191))", "wp-admin/includes/upgrade.php:2104", "pre_schema_upgrade"],
              ["delete", "open", "pink", "DELETE", "DELETE FROM {$}postmeta WHERE post_id = %d AND meta_key = %s", "wp-includes/meta.php:412", "delete_metadata"],
            ]
              .map(
                ([kind, res, tone, label, sql, site, fn]) => `
              <li class="row" data-dd-kind="${kind}" data-dd-resolution="${res}">
                <a class="row-main" href="#">
                  <span class="chip tone-${tone}">${label}</span>
                  <span class="row-body">${sql}</span>
                </a>
                <div class="row-meta">
                  <a href="#">${site}</a>
                  <a href="#">${fn}</a>
                  ${res === "open" ? '<span class="chip chip-sm tone-warn">dynamic-sql</span>' : ""}
                </div>
              </li>`
              )
              .join("")}
          </ul>
        </main>
      </div>
    </div>`,
};

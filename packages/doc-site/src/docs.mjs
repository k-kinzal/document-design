import { components, groups } from './components.mjs';
import { site, escape, code, stylesheet, cssURL, jsURL } from './site.mjs';

const stories = new Map(Object.entries({
  "foundations-cascade": "foundations-cascade--layers",
  "components-tooltip": "components-tooltip--hints",
  "foundations-grid": "foundations-grid--catalog-frame",
  "components-graph": "components-graph--layers",
  "components-bar-chart": "components-bar-chart--callers",
  "components-comparison-plot": "components-comparison-plot--coverage",
  "components-line-plot": "components-line-plot--cumulative",
  "components-histogram": "components-histogram--callers",
  "components-flow-graph": "components-flow-graph--reading-mode",
  "examples-sql-catalog": "examples-sql-catalog--overview",
  "components-tree": "components-tree--namespaces",
  "components-notice": "components-notice--tones",
  "components-facets": "components-facets--faceted",
  "components-meter": "components-meter--coverage",
  "components-disclosure": "components-disclosure--group",
  "components-file-tree": "components-file-tree--layout",
  "foundations-type": "foundations-type--catalog-scale",
  "components-prose": "components-prose--readme",
  "foundations-surface": "foundations-surface--surfaces",
  "foundations-tone": "foundations-tone--orthogonal",
  "components-empty": "components-empty--filtered",
  "components-listing": "components-listing--rows",
  "layouts-doc-shell": "layouts-doc-shell--frame",
  "components-quote": "components-quote--blockquote",
  "components-definitions": "components-definitions--glossary",
  "components-terminal": "components-terminal--session",
  "components-table": "components-table--default",
  "components-control": "components-control--buttons",
  "components-keys": "components-keys--shortcuts",
  "components-diff": "components-diff--summary",
  "examples-run-report": "examples-run-report--report",
  "components-code": "components-code--block",
  "foundations-space": "foundations-space--catalog-scale",
  "components-card": "components-card--routes",
  "components-tabs": "components-tabs--views",
  "foundations-accessibility": "foundations-accessibility--redundant-encoding",
  "components-timeline": "components-timeline--run",
  "components-symbol": "components-symbol--head",
  "components-callout": "components-callout--tones",
  "foundations-colour": "foundations-colour--neutrals",
  "examples-api-reference": "examples-api-reference--class-page",
  "components-stat": "components-stat--row",
  "components-pagination": "components-pagination--prev-next",
  "layouts-report-sheet": "layouts-report-sheet--masthead",
  "components-banner": "components-banner--modes",
  "components-chip": "components-chip--default",
  "components-publication": "components-publication--cover",
  "components-composition": "components-composition--reading-path"
}));
function sidebar(base, active) {
  const link = (href, name, current) => `<li${current ? ' class="is-active"' : ''}><a href="${href}"${current ? ' aria-current="page"' : ''}>${name}</a></li>`;
  return `<nav class="sidebar" id="navigation" aria-label="Documentation navigation"><div class="sidebar-header"><a class="brand" href="${base}">doc-ui</a></div><div class="sidebar-section"><p class="sidebar-title">GET STARTED</p><ul class="sidebar-list">${link(`${base}start/`, 'Get started', active === 'start')}${link(`${base}components/`, 'Components', active === 'index')}</ul></div>${groups.map(group => `<div class="sidebar-section"><p class="sidebar-title">${group}</p><ul class="sidebar-list">${components.filter(c => c.group === group).map(c => link(`${base}components/${c.slug}/`, c.name, active === c.slug)).join('')}</ul></div>`).join('')}<div class="sidebar-section"><ul class="sidebar-list"><li><a href="${base}storybook/">Storybook ↗</a></li><li><a href="${site.repository}">GitHub ↗</a></li></ul></div></nav>`;
}
function shell({ base, title, active, content }) {
  const showSearch = active !== 'search'; // one global search input per page
  return `<div class="doc doc-quiet">${sidebar(base, active)}<div class="main">
  <header class="topbar"><button class="btn nav-toggle" data-dd-nav-toggle aria-label="Open navigation" aria-controls="navigation" aria-expanded="false">☰ Menu</button><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${base}">doc-ui</a><span class="breadcrumb-sep">/</span>${active !== 'start' && active !== 'index' ? `<a href="${base}components/">Components</a><span class="breadcrumb-sep">/</span>` : ''}<span class="breadcrumb-current">${escape(title)}</span></nav><div class="topbar-tools">${showSearch ? `<input type="search" class="input input-search" placeholder="Search /" aria-label="Search components" data-dd-search data-dd-enhance hidden autocomplete="off">` : ''}<button class="btn" data-dd-theme-toggle data-dd-enhance hidden aria-label="Switch color theme">◐</button></div></header>
  ${showSearch ? '<div class="search-results" data-dd-search-results hidden></div>' : ''}
  <main class="content" id="main">${content}</main>
  <footer class="doc-footer">Built with <a href="${base}">doc-ui</a> · by <a href="https://github.com/k-kinzal">k-kinzal</a> · MIT License <a href="${site.repository}">GitHub ↗</a></footer></div></div>`;
}
function thumbnail(component) {
  // The preview is inert and decorative; the adjacent name describes it.
  // Remove IDs and behavior hooks so specimens cannot operate the real page.
  return (component.preview || component.examples[0].html)
    .replace(/\s(?:id|data-dd-[\w-]+|aria-controls|aria-labelledby)=(?:"[^"]*"|'[^']*')/g, '')
    .replace(/\sdata-dd-[\w-]+(?=[\s>])/g, '')
    .replace(/\shref="[^"]*"/g, '')
    .replace(/\shidden(?=[\s>])/g, '');
}
function indexPage() {
  const sections = groups.map((group, i) => `<section class="group" id="group-${i}"><h2>${group}<span class="count">${components.filter(c => c.group === group).length} components</span></h2><div class="cards" id="cards-${i}">${components.filter(c => c.group === group).map(c => `<article class="card"><div class="card-preview doc doc-inset" inert aria-hidden="true">${thumbnail(c)}</div><h3><a class="card-link" href="./${c.slug}/">${c.name}</a></h3><p class="card-description">${escape(c.description)}</p></article>`).join('')}</div></section>`).join('');
  return { path: 'components/', title: 'Components', description: `Explore ${components.length} doc-ui components and layouts by purpose. See live previews, copy the HTML, and learn when to use each one.`, search: true, body: shell({ base: '../', title: 'Components', active: 'index', content: `<h1>Components</h1><p class="lede">${components.length} components and layouts.</p><nav class="index-nav" aria-label="Jump to a category">${groups.map((g,i) => `<a href="#group-${i}">${g}</a>`).join('')}</nav>${sections}` }) };
}
function componentPage(c, index) {
  const story = c.story && stories.get(c.story.split('--')[0]);
  const examples = c.examples.map((example, i) => `<section aria-labelledby="example-${i}"><h2 id="example-${i}">${escape(example.title)}</h2>${example.sourceOnly ? '' : `<figure class="specimen"><figcaption class="specimen-bar">Preview</figcaption><div class="specimen-body${c.slug === 'report' ? '' : ' doc doc-inset'}">${example.html}</div></figure>`}${code(example.html, `source-${i}`, example.language || 'HTML')}</section>`).join('');
  const previous = components[index - 1], next = components[index + 1];
  const content = `<p class="eyebrow">${c.group} / ${c.label}</p><h1>${c.name}</h1><p class="lede">${escape(c.description)}</p>
  ${examples}
  <section><h2>Classes & attributes</h2><div class="table-wrap"><table><thead><tr><th scope="col">Class / attribute</th><th scope="col">Purpose</th></tr></thead><tbody>${c.api.map(([key,value]) => `<tr><td><code>${escape(key)}</code></td><td>${escape(value)}</td></tr>`).join('')}</tbody></table></div></section>
  <section><h2>Usage notes</h2><div class="callout"><p>${escape(c.note)}</p></div><p class="note">Examples follow your system color scheme. Use ◐ in the header to try automatic, light, and dark themes.</p></section>
  <div class="actions">${story ? `<a class="btn" href="../../storybook/?path=/story/${story}">Explore variations in Storybook ↗</a>` : ''}<a href="../">All components →</a></div>
  <nav class="pager" aria-label="Adjacent components">${previous ? `<a class="pager-prev" href="../${previous.slug}/"><span class="pager-dir">Previous component</span><span class="pager-name">${previous.name} — ${previous.label}</span></a>` : ''}${next ? `<a class="pager-next" href="../${next.slug}/"><span class="pager-dir">Next component</span><span class="pager-name">${next.name} — ${next.label}</span></a>` : ''}</nav>`;
  return { path: `components/${c.slug}/`, title: `${c.name} — ${c.label}`, description: `${escape(c.description)} Live examples, copyable HTML, classes, and usage guidance for the doc-ui ${c.name} component.`, search: true, body: shell({ base: '../../', title: c.name, active: c.slug, content }) };
}
function startPage() {
  const starter = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Information, made clear.</title>
  ${stylesheet.replaceAll('\n','\n  ')}
</head>
<body>
  <article class="sheet">
    <p class="eyebrow">DOC-UI</p>
    <h1>Information, made clear.</h1>
    <p class="stand">Keep the detail. Give it a reading order.</p>
    <section class="sec">
      <h2 class="label">THE IDEA</h2>
      <div class="field">
        <p class="lead">Dense enough to scan. Clear enough to understand.</p>
        <p class="note">Space brings the conclusion forward.
          Alignment keeps the details in order.</p>
      </div>
    </section>
  </article>
</body>
</html>`;
  return { path: 'start/', title: 'Get started', description: 'Set up doc-ui, choose a document or report layout, and build your first page. Includes a complete HTML example, theming, offline use, and optional behaviors.', search:true, body: shell({ base:'../', title:'Get started', active:'start', content:`<h1>Use doc-ui</h1><p class="lede">Add the stylesheet, choose a layout, and start with a complete HTML document.</p>
<section><h2>1. Load the stylesheet</h2><p>Add this link to your document’s <code>&lt;head&gt;</code>. Use the versioned <code>/v1/</code> URL for documents you publish or archive.</p>${code(stylesheet,'setup-css')}</section>
<section><h2>2. Choose a reading mode</h2><div class="cards"><article class="card"><h3>To find something: .doc</h3><p class="card-description">API references, catalogs, and search results. A dense layout that stays easy to scan.</p><p class="card-more"><a href="../components/document/">Build a document →</a></p></article><article class="card"><h3>To understand something: .sheet</h3><p class="card-description">Reports, research, and reviews. A layout that puts the conclusion and its evidence in view.</p><p class="card-more"><a href="../components/report/">Build a report →</a></p></article></div></section>
<section><h2>3. Make a complete page</h2><p>Save this as <code>report.html</code> and open it in your browser.</p>${code(starter,'starter')}<div class="actions"><a class="btn" href="../examples/report.html" download="report.html">Download the example ↓</a><a href="../examples/report.html">Open the example ↗</a></div></section>
<section><h2>Keep an offline copy</h2><div class="prose"><p><a href="../v1/document-design.css" download="document-design.css">Save the stylesheet</a> next to your HTML file, then use a relative path.</p></div>${code('<link rel="stylesheet" href="./document-design.css">','offline')}<p>Keep the files together to open the document over <code>file://</code>. The stylesheet does not depend on web fonts or image services.</p></section>
<section><h2>Add the interactions you need</h2><p>Search, sorting, copy controls, and theme switching are optional. Load the classic script, then add the documented data attributes to each component.</p>${code(`<script src="${jsURL}" defer></script>`,'setup-js')}<p>For offline use, <a href="../v1/document-design.js" download="document-design.js">save the script</a> and reference it with a relative path.</p><div class="notice">Add <code>data-dd-enhance hidden</code> to a control that should appear only after the script has initialized. Keep the underlying content readable without JavaScript.</div></section>
<section><h2 id="theming">Theme the document</h2><div class="prose"><p>The default follows the reader’s system color scheme. To fix a theme, set <code>data-dd-theme="light"</code> or <code>"dark"</code> on the HTML element. Override <code>--dd-</code> custom properties to change the design tokens.</p></div>${code(':root {\n  --dd-accent: var(--dd-teal);\n  --dd-link: var(--dd-teal);\n}','theme','CSS')}<p>Identity hues: blue, violet, amber, teal, pink, indigo, slate. State hues: ok, warn, danger. See <a href="../components/chip/">Chip</a> for the difference.</p></section>
<section><h2>Preserve meaning in every format</h2><div class="prose"><ul><li>Use semantic headings, visible input labels, and descriptive link names.</li><li>Pair color with text, symbols, or borders.</li><li>Print styles hide navigation and controls, expand truncated rows, and reveal inactive tab panels.</li><li>Supported browsers expand closed details with CSS; the optional script also opens them before printing.</li><li>Check print preview before distributing a generated report.</li></ul></div></section>
<section><h2>Browser support & versions</h2><p>Designed for current Chrome, Edge, Firefox, and Safari. The CSS uses <code>light-dark()</code>, <code>color-mix()</code>, cascade layers, container queries, and subgrid.</p><p>Use <code>/latest/</code> to try development changes. Use <code>/v1/</code> for published and archived documents. Breaking changes belong in a new major version.</p><p>This stylesheet owns its document. When embedding it into an existing application, use a separate document or check the effect of its base styles on your surrounding UI.</p></section>
<div class="actions"><a class="btn btn-primary btn-lg" href="../components/">Explore ${components.length} components →</a><a href="${site.repository}">Source code ↗</a></div>` }), starter };
}
export function docs() { return [startPage(), indexPage(), ...components.map(componentPage)]; }

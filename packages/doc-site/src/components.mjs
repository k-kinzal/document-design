import { catalog } from './catalog.mjs';
import { charts } from './charts.mjs';
const resolved = catalog.resolution[0].count;
const unresolved = catalog.total - resolved;
const resolvedPercent = resolved / catalog.total * 100;

/* Literal HTML examples, shared by the index and component documentation. */
export const groups = ["Layouts","Lists & data","Figures & graphs","Reading","Code & changes","Navigation","Status & feedback"];
export const components = [
  {
    slug: "document",
    previewHeight: "auto",
    preview: `<div class="doc doc-inset"><h2>Layout reference</h2><dl class="definitions">
      <div><dt><code>.doc</code></dt><dd>Find and compare entries.</dd></div>
      <div><dt><code>.sheet</code></dt><dd>Follow a point and its evidence.</dd></div>
    </dl></div>`,
    name: "Document",
    label: "Catalog layout",
    group: "Layouts",
    description: "A compact document layout for finding one item among hundreds.",
    api: [[".doc","The catalog frame and its type scale. Wrap the document in this class."],[".main / .content","The main column and its responsive content container."],[".doc-inset","An embedded frame without the viewport-height minimum."],[".doc-quiet","A quieter sidebar surface that gives live previews greater prominence."],[".lede / .page-counts","A sentence explaining the page, followed by labeled counts."]],
    note: "Use h1 for a standalone page title. This embedded example uses h2 to fit the surrounding document. A sidebar is optional.",
    story: "layouts-doc-shell--overview",
    examples: [
      { title: "Basic usage", html: String.raw`<div class="doc doc-inset">
  <div class="main">
    <div class="content">
      <h2>Layout reference</h2>
      <p class="lede">Choose by reading task.</p>
      <dl class="definitions">
        <div><dt><code>.doc</code></dt><dd>Find and compare entries.</dd></div>
        <div><dt><code>.sheet</code></dt><dd>Follow a point and its evidence.</dd></div>
      </dl>
    </div>
  </div>
</div>` }
    ],
  },
  {
    slug: "report",
    previewHeight: "auto",
    preview: `<article class="sheet sheet-inset"><p class="eyebrow">READING ORDER</p>
      <h2>Give the idea a sequence.</h2><p class="stand">A point, its evidence, its meaning.</p></article>`,
    name: "Report",
    label: "Report layout",
    group: "Layouts",
    description: "A spacious report layout that puts the conclusion, evidence, and limits in view.",
    api: [[".sheet","A twelve-column grid with the report type and spacing scales."],[".sec / .label / .field","A section, its left label, and its content. Place sec directly inside sheet, or its sheet-body wrapper. Direct paragraphs, comparisons, and tables also use the reading column."],[".fig / .claim / .unit","A prominent number, a claim instead of a number, and its meaning."],[".hero > .figures","A lead made of words: three figures in the hero’s slot, for a profile, a project, or a theme with no before and after."],[".caveat","The qualifications a reader needs to interpret the result."],[".sheet-inset / .sheet-wide","A single-column inset, or a wider cover layout."],["data-dd-paper=\"a4\"","On the root element: the printed sheet size, its margins, and page numbers. Also letter."]],
    note: "The product homepage uses this layout. Use h1 in a standalone sheet; this embedded example uses h2. A report can lead with a statement instead of a number, or with three short answers instead of a comparison.",
    story: "layouts-report-sheet--direct-section-content",
    examples: [
      { title: "Basic usage", html: String.raw`<article class="sheet sheet-inset">
  <p class="eyebrow">READING ORDER</p>
  <h2>Give the idea a sequence.</h2>
  <p class="stand">A point, its evidence, its meaning.</p>
  <p class="note">Separate type and spacing scales bring the main idea forward, with room for the detail that supports it.</p>
</article>` },
      { title: "Direct section content", html: String.raw`<article class="sheet sheet-inset">
  <section class="sec">
    <h3 class="label">01 / EVIDENCE</h3>
    <div class="field"><p class="lead">Keep the unresolved findings visible.</p></div>
    <p class="note">Only 35 of 844 WordPress statements are fully resolved. State the limits alongside the result.</p>
    <div class="compare">
      <div><h4>Statements</h4><p class="note">The catalog contains 844 statements.</p></div>
      <div><h4>Findings</h4><p class="note">The analysis reports 978 findings. Several may describe the same statement.</p></div>
    </div>
  </section>
</article>` },
      { title: "A lead made of words", html: String.raw`<article class="sheet sheet-inset">
  <p class="eyebrow">WHO IS k_kinzal?</p>
  <h2>k_kinzal</h2>
  <p class="stand">Turns complex technology into usable tools and knowledge that carries.</p>
  <div class="hero">
    <div class="figures">
      <figure><h3>Builds usable tools</h3><p>Documentation generation, deployment, PHP test environments, AI development.</p></figure>
      <figure><h3>Changes things safely</h3><p>Platform migration, design through types, automated tests and quality verification.</p></figure>
      <figure><h3>Passes knowledge on</h3><p>Articles on Qiita and Zenn, conference talks, Rust and Solana course material.</p></figure>
    </div>
  </div>
</article>` }
    ],
  },
  {
    slug: "publication",
    previewHeight: "auto",
    name: "Publication",
    label: "Covers & specimens",
    group: "Layouts",
    description: "Reusable covers, navigation, section headings, and frames for live examples.",
    api: [[".cover / .cover-title / .cover-copy","The cover headline and supporting text. Stacks when the container narrows."],[".masthead / .brand / .colophon","Publication header, typographic wordmark, and footer."],[".section / .section-head / .section-title","Section separator and heading."],[".specimen / .specimen-bar / .specimen-body / .specimen-caption","A live example, its label, content, and caption."],[".principles / .principle / .ribbon","Ruled arrangements for principles and short facts."],[".index-nav / .link-list","An unboxed category index, or a wrapping list of plain links."]],
    note: "These are public doc-ui components, used by doc-site itself. Reuse the same markup in a guide, report, or product page.",
    story: "components-publication--cover",
    examples: [
      { title: "Basic usage", html: String.raw`<section class="cover">
  <div><p class="eyebrow">DOC-UI / PUBLICATION</p>
    <h2 class="cover-title">Information, made clear.</h2></div>
  <div class="cover-copy"><p>A design system for documentation and reports.</p>
    <div class="actions"><a class="btn btn-primary btn-lg" href="../../start/">Get started →</a></div></div>
</section>` },
      { title: "A labeled example", html: String.raw`<figure class="specimen">
  <div class="specimen-bar">EXAMPLE / Status</div>
  <div class="specimen-body"><span class="chip tone-ok">✓ Analysis complete</span></div>
  <figcaption class="specimen-caption">State is expressed in both color and words.</figcaption>
</figure>` },
      { title: "Section headings", html: String.raw`<section class="section">
  <div class="section-head">
    <p class="eyebrow">01 / READING ORDER</p>
    <div><h2 class="section-title">Scan a reference. Read a report.</h2>
      <p class="note">A point, its evidence, its meaning.</p></div>
  </div>
</section>` },
    ],
  },
  {
    slug: "composition",
    previewHeight: "auto",
    name: "Composition",
    label: "Figures & annotations",
    group: "Layouts",
    description: "Keep a figure, its caption, and the notes that explain it in one reading order.",
    api: [[".plate / .plate-wide / .plate-full","A numbered semantic figure at text, wide, or full column width."],[".plate-unnumbered","Use an explicit figure number when the generator also writes cross-references."],[".plate-side / .plate-summary / .sidenote","A caption with an adjacent note; the note follows the caption in narrow columns."],[".plate-body / .plate-label / .plate-source","The ruled figure body, an explicit number, and source or conditions."],[".compare / .compare-title / .compare-draw","Two comparable groups side by side when their container has room. .compare-draw keeps each side at the width its drawing was made at and wraps instead."],[".flow / .flow-mark / .flow-name / .flow-detail","A three-stage sequence: ordinal, name, then explanation. Arrows indicate reading order."],[".ref / .ref-mark","A reference to a figure: .ref carries its number, .ref ref-mark a letter-and-colour identity shared by a passage and its panel."],[".sheet-body","Preserves a sheet’s column grid through a semantic main or article wrapper."]],
    note: "Keep captions and notes in the HTML. A letter or label must carry the same meaning wherever it appears. Use ordered lists for sequences; the arrows here mean reading order, not causality. A plate can also contain a table or SVG. Use the draw classes for SVG text and marks, and a draw-wrap when the diagram must scroll without shrinking labels.",
    story: "components-composition--reading-path",
    examples: [
      { title: "A figure and its explanation", html: String.raw`<figure class="plate plate-full plate-side plate-unnumbered">
  <div class="plate-body">
    <h3 class="compare-title"><span class="ref ref-mark tone-teal">B</span> Paper</h3>
    <ol class="flow tone-teal">
      <li><span class="flow-mark" aria-hidden="true">01</span><strong class="flow-name">Question</strong><span class="flow-detail">Orient the reader</span></li>
      <li><span class="flow-mark" aria-hidden="true">02</span><strong class="flow-name">Evidence</strong><span class="flow-detail">Connect the facts</span></li>
      <li><span class="flow-mark" aria-hidden="true">03</span><strong class="flow-name">Meaning</strong><span class="flow-detail">Explain the result</span></li>
    </ol>
  </div>
  <figcaption>
    <p class="plate-summary"><span class="plate-label">Figure 1.</span>A paper gives a point, its evidence, and its meaning a clear reading order.</p>
    <p class="sidenote">Arrows show a reading sequence, not a causal relationship.</p>
  </figcaption>
</figure>` },
      { title: "A semantic page wrapper", sourceOnly: true, html: String.raw`<div class="sheet sheet-wide">
  <header class="masthead">Publication name</header>
  <main class="sheet-body">
    <header class="cover"><div><h1 class="cover-title">The main idea.</h1></div></header>
    <section class="sec">
      <h2 class="label">CONTEXT</h2>
      <div class="field">The explanation follows.</div>
    </section>
  </main>
  <footer class="colophon">Sources and credits</footer>
</div>` }
    ],
  },
  {
    slug: "table",
    name: "Table",
    label: "Comparable rows",
    group: "Lists & data",
    description: "Align values in columns so a reader can compare items without remembering them.",
    api: [[".table-wrap","Contains wide tables in a horizontally scrollable region."],[".num / .tight","Right-aligned numbers, or a column sized to its content."],["data-dd-sortable","Enables sorting when the optional behavior script is present."],["th[data-dd-sort=\"number\"]","Numeric sorting. Use text for text columns."],["data-dd-value","An explicit sorting value, independent of the displayed cell."]],
    note: "Give the table a caption or a nearby heading. Mark column headers with scope. With the optional script, activate a heading by click, Enter, or Space to sort.",
    story: "components-table--sortable-table",
    examples: [
      { title: "Basic usage", html: String.raw`<div class="table-wrap">
  <table class="sortable" data-dd-sortable>
    <caption class="sr-only">WordPress catalog: three tables and their statement counts</caption>
    <thead><tr><th scope="col" data-dd-sort="text">Table</th><th scope="col" class="num" data-dd-sort="number">Statements</th></tr></thead>
    <tbody><tr><td class="mono">{$}cache_data</td><td class="num">13</td></tr>
      <tr><td class="mono">{$}items</td><td class="num">7</td></tr>
      <tr><td class="mono">{$}posts</td><td class="num">3</td></tr></tbody>
  </table>
</div>` }
    ],
  },
  {
    slug: "listing",
    name: "Listing",
    label: "Scannable lists",
    group: "Lists & data",
    description: "Keep short and long entries in the same rhythm so the right item is easy to find.",
    api: [[".rows / .row","The list and each entry."],[".row-main / .row-body / .row-meta","The link, a preview of up to three lines, and source metadata."],[".peek / .peek-figures","A short list of names and figures, useful inside a card."],["data-dd-defer","Optionally defer rendering in very long, uniform lists."]],
    note: "A preview is limited to three lines. Link to the complete content. Printed rows expand to their full text.",
    story: "components-listing--statements",
    examples: [
      { title: "Basic usage", html: String.raw`<ul class="rows">
  <li class="row">
    <a class="row-main" href="../code/">
      <span class="chip tone-blue">SELECT</span>
      <span class="row-body">SELECT id, title FROM posts WHERE status = 'published'</span>
    </a>
    <p class="row-meta">src/PostRepository.php:42 <span>2 columns</span></p>
  </li>
  <li class="row">
    <a class="row-main" href="../code/">
      <span class="chip tone-violet">INSERT</span>
      <span class="row-body">INSERT INTO events (name) VALUES (:name)</span>
    </a>
    <p class="row-meta">src/EventRepository.php:18 <span>1 parameter</span></p>
  </li>
</ul>` }
    ],
  },
  {
    slug: "chip",
    name: "Chip",
    label: "Classification labels",
    group: "Lists & data",
    description: "A compact label that names a kind or state. Meaning and appearance are specified separately.",
    api: [[".chip","The standard classification label."],[".chip-sm / .chip-lg","Reduced spacing, or a larger label. Small never means unreadable text."],[".chip-ghost","An outline for a version or a literal identifier."],[".tone-blue / .tone-violet / .tone-teal","Identity hues. Also available: amber, pink, indigo, and slate."],[".tone-ok / .tone-warn / .tone-danger","State hues for success, caution, and a problem."]],
    note: "Never use red to identify a kind. Write the meaning in the label so it survives when color disappears.",
    story: "components-chip--identity-hues",
    examples: [
      { title: "Basic usage", html: String.raw`<div class="chips">
  <span class="chip tone-blue">SELECT</span>
  <span class="chip tone-violet">INSERT</span>
  <span class="chip tone-teal">UPDATE</span>
  <span class="chip chip-ghost">v1.0.0</span>
</div>` },
      { title: "Showing state", html: String.raw`<div class="chips">
  <span class="chip tone-ok">✓ Resolved</span>
  <span class="chip tone-warn">Partial</span>
  <span class="chip tone-danger">! Unresolved</span>
</div>` }
    ],
  },
  {
    slug: "card",
    previewHeight: "auto",
    preview: `<section class="card"><h3>Table</h3>
      <p class="card-description">Which statements read from or write to each table.</p>
      <p class="card-more"><a href="../table/">Explore 12 tables →</a></p></section>`,
    name: "Card",
    label: "Ways into content",
    group: "Lists & data",
    description: "Show where a route leads and what a reader can learn there.",
    api: [[".cards / .card","A list and its entries, arranged in one or two columns according to the container."],[".card-preview","A bounded live preview. Use inert and aria-hidden when the card title provides the accessible description."],["--dd-preview-height","Defaults to 224px. Use auto for a selected preview that needs to keep all text and controls visible; retain normal type sizes."],[".card-link","Stretches the title link across a preview card; its preview must not contain interactive controls."],[".card-description","What this destination can tell the reader."],[".card-more","A detail link aligned at the bottom."],[".aside","A supporting region with a quiet background."]],
    note: "A rule separates routes without turning every item into a box. Give comparable routes comparable descriptions.",
    story: "components-card--overview",
    examples: [
      { title: "Basic usage", html: String.raw`<div class="cards">
  <section class="card"><h3>Table</h3>
    <p class="card-description">Which statements read from or write to each table.</p>
    <p class="card-more"><a href="../table/">Explore 12 tables →</a></p></section>
  <section class="card"><h3>Symbols</h3>
    <p class="card-description">Classes and functions, their signatures and callers.</p>
    <p class="card-more"><a href="../symbol/">Explore API references →</a></p></section>
</div>` },
      { title: "A visual preview", html: String.raw`<article class="card">
  <div class="card-preview doc doc-inset" style="--dd-preview-height: auto" inert aria-hidden="true">
    <div class="chips">
      <span class="chip tone-blue">SELECT</span>
      <span class="chip tone-violet">INSERT</span>
      <span class="chip tone-teal">UPDATE</span>
    </div>
  </div>
  <h3><a class="card-link" href="../chip/">Chip</a></h3>
  <p class="card-description">Labels for kinds and states.</p>
</article>` }
    ],
  },
  {
    slug: "meter",
    previewHeight: "auto",
    name: "Meter",
    label: "Parts of a whole",
    group: "Figures & graphs",
    description: "Show proportions faithfully, including the part that remains unresolved.",
    api: [[".meter / .meter-lg","The standard bar, or a taller version."],[".meter-part","Set the percentage with --dd-part. Parts should total 100%."],[".is-open","Hatching distinguishes an unresolved part."],[".legend","The name, count, and explanation of every part."]],
    note: "The legend must contain all the information. Do not enlarge small categories to make them clickable. Print hides the bar and retains the legend.",
    story: "components-meter--resolution",
    examples: [
      { title: "Basic usage", html: String.raw`<div class="meter meter-lg" aria-hidden="true">
  <span class="meter-part tone-ok" style="--dd-part:${resolvedPercent.toFixed(2)}%"></span>
  <span class="meter-part is-open" style="--dd-part:${(100-resolvedPercent).toFixed(2)}%"></span>
</div>
<ul class="legend">
  <li><span class="chip tone-ok">Resolved</span><span class="meter-legend-count">${resolved} statements</span><span class="meter-legend-description">Fully determined SQL</span></li>
  <li><span class="chip chip-ghost">Unresolved</span><span class="meter-legend-count">${unresolved} statements</span><span class="meter-legend-description">Dependencies, analysis limits, or unexamined calls</span></li>
</ul>` }
    ],
  },
  {
    slug: "facts",
    previewHeight: "auto",
    name: "Facts",
    label: "Labeled attributes",
    group: "Lists & data",
    description: "A definition list for short answers about one thing: a version, scope, or source.",
    api: [[".facts","A definition list of attributes."],["dt / dd","Wrap each label and value in one div."]],
    note: "Give figures units. Use Definitions for longer explanations of vocabulary.",
    story: "components-definitions--glossary",
    examples: [
      { title: "Basic usage", html: String.raw`<dl class="facts">
  <div><dt>Dataset</dt><dd>WordPress SQL catalog</dd></div>
  <div><dt>Source files</dt><dd>77 files</dd></div>
  <div><dt>Analysis scope</dt><dd>Discovered database calls in WordPress</dd></div>
</dl>` }
    ],
  },
  {
    slug: "prose",
    previewHeight: "auto",
    preview: `<div class="prose"><h3>Make information clear</h3>
      <p>Different ways of reading call for different densities. <strong>Finding a single entry</strong> in a catalog and understanding a report deserve different layouts.</p></div>`,
    name: "Prose",
    label: "Reading text",
    group: "Reading",
    description: "Readable typography for paragraphs, headings, lists, and quotations.",
    api: [[".prose","A reading container for semantic HTML."],[".prose-wide","Removes the normal reading-width limit."],["code / kbd / blockquote","Inline code, key names, and quotations use standard HTML elements."]],
    note: "Choose heading levels by the structure of the document, not by the size you want.",
    story: "components-prose--article",
    examples: [
      { title: "Basic usage", html: String.raw`<div class="prose">
  <h3>Make information clear</h3>
  <p>Different ways of reading call for different densities. <strong>Finding a single entry</strong> in a catalog and understanding a report deserve different layouts.</p>
  <ul><li>Take density from spacing.</li><li>Give numbers meaning.</li><li>Show what remains unknown.</li></ul>
</div>` }
    ],
  },
  {
    slug: "callout",
    name: "Callout",
    label: "Supporting context",
    group: "Reading",
    description: "A note in the reading flow for a prerequisite, caveat, or important qualification.",
    api: [[".callout","The note container."],[".callout-title / p","A short heading and explanation."],[".tone-warn / .tone-danger / .tone-ok","State hues chosen for the meaning of the content."]],
    note: "Keep important context close to the claim it qualifies. Making everything a warning makes the important warnings harder to find.",
    story: "components-callout--tones",
    examples: [
      { title: "Basic usage", html: String.raw`<aside class="callout tone-warn">
  <p class="callout-title">Analysis scope</p>
  <p>Dynamically assembled SQL may be only partially resolved.</p>
</aside>` }
    ],
  },
  {
    slug: "quote",
    name: "Quote",
    label: "Words with a source",
    group: "Reading",
    description: "Keep a quotation and its source together, distinct from the surrounding argument.",
    api: [[".quote","The style for a blockquote."],[".quote-source","The source, in a footer or cite element."]],
    note: "Name the author or document. The source is part of the information.",
    story: "components-quote--with-source",
    examples: [
      { title: "Basic usage", html: String.raw`<blockquote class="quote">
  <p>Make information clear.</p>
  <footer class="quote-source">The doc-ui design principles</footer>
</blockquote>` }
    ],
  },
  {
    slug: "definitions",
    name: "Definitions",
    label: "Shared vocabulary",
    group: "Reading",
    description: "Define the terms used throughout a catalog so its labels have a shared meaning.",
    api: [[".definitions","A definition list with terms and explanations side by side."],[".definitions-stacked","Stacks each term above its definition."],["dt / dd","Wrap each term and its definition in one div."]],
    note: "Do not assume the reader already knows vocabulary invented by your product.",
    story: "components-definitions--glossary",
    examples: [
      { title: "Basic usage", html: String.raw`<dl class="definitions">
  <div><dt><span class="chip tone-ok">resolved</span></dt><dd>The complete statement is determined from the source.</dd></div>
  <div><dt>lower bound</dt><dd>There may be more items than the number shown here.</dd></div>
</dl>` }
    ],
  },
  {
    slug: "sources",
    previewHeight: "auto",
    preview: `<ol class="sources">
      <li><a href="#">Typesafe State in Rust (preview)</a><span class="source-meta">Zenn Books · 2022.03.08</span></li>
      <li><a href="#">async-graphql / PR #1018</a><span class="source-meta">GitHub PR · 2022.08.18</span></li>
    </ol>`,
    name: "Sources",
    label: "Citations & references",
    group: "Reading",
    description: "Point at a source from the text with a number, and list the sources where the reader can find them.",
    api: [[".cite","A bracketed number in the running text that links to a source. Write the same number the list shows."],[".sources","An ordered list of sources, numbered by the list itself. start and value attributes are respected."],[".source-meta","Where and when: the venue, the date, and a short description under the title."],["--dd-sources-gutter","Width of the number column. Default 3.25em; widen it for a list past a hundred entries."],["data-dd-print-urls=\"sources\"","On the root element: print addresses only in the sources list, not after every link in the text. none prints no addresses."]],
    note: "Give each entry an id and link the title to the original. Titles keep the language they were published in; mark it with lang. On paper, each entry spells out its address on a line of its own, so the running text can keep to citation numbers.",
    story: "components-sources--cited",
    examples: [
      { title: "Basic usage", html: String.raw`<p class="note">Published an eight-chapter book on expressing states and transitions as Rust types, and took two fixes to async-graphql upstream.<a class="cite" href="#src-1">1</a><a class="cite" href="#src-2">2</a><a class="cite" href="#src-3">3</a></p>
<ol class="sources">
  <li id="src-1"><a href="https://zenn.dev/kinzal/books/aa109c0c428089">Typesafe State in Rust (preview)</a><span class="source-meta">Zenn Books · 2022.03.08 · An eight-chapter public book on states and transitions as types</span></li>
  <li id="src-2"><a href="https://github.com/async-graphql/async-graphql/pull/1018">async-graphql / PR #1018</a><span class="source-meta">GitHub PR · 2022.08.18 · Fixes request data lost in resolvers</span></li>
  <li id="src-3"><a href="https://github.com/async-graphql/async-graphql/pull/1049">async-graphql / PR #1049</a><span class="source-meta">GitHub PR · 2022.09.06 · Primitive type support for CursorType</span></li>
</ol>` },
      { title: "Printing the addresses once", sourceOnly: true, html: String.raw`<html lang="en" data-dd-paper="a4" data-dd-print-urls="sources">` }
    ],
  },
  {
    slug: "code",
    name: "Code",
    label: "Source excerpts",
    group: "Code & changes",
    description: "Present SQL, signatures, and source excerpts clearly, including gaps in what is known.",
    api: [["pre.code / .code-block","The code itself and an optional wrapper for copy controls."],[".tok-kw / .tok-str / .tok-num / .tok-com","Keywords, strings, numbers, and comments."],[".tok-var / .tok-id","Variables and identifiers."],[".code-scroll / .code-lead","Preserve line structure, or emphasize a lead statement."],[".hole","A dashed mark for a part that could not be resolved."]],
    note: "Escape &, <, and > before generating HTML. Red is never a syntax color. Use code-scroll only when wrapping would misrepresent the structure.",
    story: "components-code--statement",
    examples: [
      { title: "Basic usage", html: String.raw`<pre class="code"><code><span class="tok-kw">SELECT</span> id, title
<span class="tok-kw">FROM</span> posts
<span class="tok-kw">WHERE</span> status = <span class="tok-str">'published'</span></code></pre>` },
      { title: "Representing an unresolved part", html: String.raw`<pre class="code"><code><span class="tok-kw">SELECT</span> * <span class="tok-kw">FROM</span> <span class="hole tone-danger" title="The table name is determined at runtime">[unresolved: table]</span></code></pre>` }
    ],
  },
  {
    slug: "symbol",
    previewHeight: "auto",
    name: "Symbol",
    label: "API references",
    group: "Code & changes",
    description: "Present declarations, parameters, return types, and members of an API.",
    api: [[".symbol-head / .symbol-meta","The symbol heading and source location."],[".member / .member-head / .member-body","An individual member and its explanation."],[".signature / .signature-name / .signature-param","The signature, its name, and parameters."],[".t-name / .t-key / .t-lit / .t-gen / .t-alias","Type names, keywords, literals, generics, and aliases."],[".private-surface","A member that is not part of the public API, visible with less emphasis."]],
    note: "Visibility is not a judgment. Public does not mean success, and private does not mean danger.",
    story: "components-symbol--members",
    examples: [
      { title: "Basic usage", html: String.raw`<section class="member">
  <div class="member-head"><h3><code>find()</code><span class="chip chip-ghost">public</span></h3><span class="member-meta">src/Repository.php:24</span></div>
  <div class="member-body">
    <pre class="signature"><span class="t-key">public function</span> <span class="signature-name">find</span>(<span class="t-name">int</span> <span class="signature-param">$id</span>): <span class="t-name">Post</span>|<span class="t-key">null</span></pre>
    <p>Returns the post with the given ID, or null when it does not exist.</p>
  </div>
</section>` }
    ],
  },
  {
    slug: "diff",
    name: "Diff",
    label: "What changed",
    group: "Code & changes",
    description: "Show additions, removals, and modifications through both color and explicit marks.",
    api: [[".diff / .dl","A diff block and an individual line."],[".diff-line-add / .diff-line-del / .diff-line-mod","Added, removed, and modified lines."],[".diff-run-add / .diff-run-del / .diff-run-mod","The changed run within a line."],[".is-added / .is-removed / .is-modified","Change marks for cells in a listing."]],
    note: "Write +, −, and ~ in the HTML as well. The change remains meaningful after it is copied or printed.",
    story: "components-diff--lines",
    examples: [
      { title: "Basic usage", html: String.raw`<pre class="code diff"><span class="dl diff-line-del">- public function build(): string</span>
<span class="dl diff-line-add">+ public function build(): Statement</span>
<span class="dl diff-line-mod">~ @throws QueryException</span></pre>` }
    ],
  },
  {
    slug: "terminal",
    name: "Terminal",
    label: "Commands & output",
    group: "Code & changes",
    description: "Keep a command and its output together, with a prompt that stays out of copied text.",
    api: [[".terminal","The command session."],[".terminal-command","The prompt is drawn by CSS."],[".terminal-output / .terminal-error","Normal output and error output."],[".terminal-exit","The exit code, with an explanation of the outcome."]],
    note: "Do not put a $ prompt in the command text. It should not be copied into the shell.",
    story: "components-terminal--session",
    examples: [
      { title: "Basic usage", html: String.raw`<div class="terminal">
  <p class="terminal-command">npm run check</p>
  <pre class="terminal-output">All 150 pairs meet their target.</pre>
  <p class="terminal-exit tone-ok">exit 0 — checks passed</p>
</div>` }
    ],
  },
  {
    slug: "filetree",
    name: "File tree",
    label: "File structure",
    group: "Code & changes",
    description: "Show where files and directories live as a hierarchy, rather than a collection of paths.",
    api: [[".filetree","A file hierarchy made of nested lists."],[".filetree-directory / .filetree-file / .filetree-meta","Directory entries, file entries, and supplementary metadata."],[".is-current","The file currently being discussed."]],
    note: "Use nested lists instead of drawing branches with text characters. Names remain selectable and searchable.",
    story: "components-file-tree--project",
    examples: [
      { title: "Basic usage", html: String.raw`<ul class="filetree">
  <li class="filetree-directory is-open"><span>src/</span><ul>
    <li class="filetree-file"><span>index.css</span><span class="filetree-meta">entry point</span></li>
    <li class="filetree-directory is-open"><span>components/</span><ul><li class="filetree-file"><span>chip.css</span></li><li class="filetree-file"><span>table.css</span></li></ul></li>
  </ul></li>
</ul>` }
    ],
  },
  {
    slug: "tree",
    name: "Tree",
    label: "Hierarchical navigation",
    group: "Navigation",
    description: "Navigate namespaces and categories in an expandable hierarchy.",
    api: [[".tree","The root list."],["details / summary","Native, JavaScript-free disclosure."],[".tree-count","A labeled count of descendants."]],
    note: "Keep the hierarchy shallow and give entries real destinations. Closed branches expand for printing in supported browsers.",
    story: "components-tree--namespaces",
    examples: [
      { title: "Basic usage", html: String.raw`<ul class="tree">
  <li><details open><summary><span>Components</span><span class="tree-count">2 items</span></summary>
    <ul><li><a href="../chip/">Chip</a></li><li><a href="../table/">Table</a></li></ul>
  </details></li>
</ul>` }
    ],
  },
  {
    slug: "graph",
    name: "Graph",
    label: "Dependencies",
    group: "Figures & graphs",
    description: "Styles for generated SVG diagrams that show which things depend on which.",
    api: [[".graph-wrap / .graph","The scrolling region and the SVG."],[".node / .node-toned / .node-outside","Plain nodes, identity-toned nodes, and nodes outside the scope."],[".edge / .edge-dev / .edge-weak / .edge-bad","Normal, development-only, suggested, and invalid dependencies."]],
    note: "Use Graph for dependencies, Flow graph for branching processes, Bar chart for quantities, Comparison plot for paired observations, Line plot for ordered measurements, Histogram for distributions, and Meter for parts of a whole. The generator computes coordinates. Draw edges before nodes. Explain the relationships in aria-label and nearby text.",
    story: "components-graph--layers",
    examples: [
      { title: "Basic usage", html: String.raw`<div class="graph-wrap">
  <svg class="graph" style="--dd-draw-width:400px" viewBox="0 0 400 140" role="img" aria-label="doc-site depends on doc-ui">
    <path class="edge" d="M200 42 C200 62,200 72,200 88"/>
    <circle class="edge-tip" cx="200" cy="90" r="2.6"/>
    <rect class="node" x="130" y="8" width="140" height="34" rx="7"/>
    <text x="200" y="25">doc-site</text>
    <rect class="node node-toned tone-blue" x="130" y="92" width="140" height="34" rx="7"/>
    <text x="200" y="109">doc-ui</text>
  </svg>
</div>` }
    ],
  },
  ...charts,
  {
    slug: "control",
    previewHeight: "auto",
    preview: `<div class="actions"><a class="btn btn-primary" href="../../start/">Quick start →</a>
      <a class="btn" href="../">Back to the list</a></div>
      <label>Filter by name <input class="input" type="search" placeholder="e.g. Chip"></label>`,
    name: "Control",
    label: "Buttons & inputs",
    group: "Navigation",
    description: "Quiet, consistent controls for the few actions a document needs.",
    api: [[".btn / .btn-quiet","Standard or quiet buttons. Use links for navigation."],[".btn-primary / .btn-lg","The primary action, or a control with more generous spacing."],[".input / .input-block","A standard input, or a full-width input."],["data-dd-theme-toggle","Cycles through automatic, light, and dark themes."],["data-dd-enhance hidden","Shows a control only after the optional script has initialized."]],
    note: "Give inputs labels and icon-only buttons accessible names. Preserve the keyboard focus ring.",
    story: "components-control--buttons",
    examples: [
      { title: "Basic usage", html: String.raw`<div class="actions">
  <a class="btn btn-primary btn-lg" href="../../start/">Quick start →</a>
  <a class="btn btn-lg" href="../">Back to the list</a>
  <button class="btn btn-quiet" data-dd-theme-toggle data-dd-enhance hidden>◐</button>
</div>
<label>Filter by name <input class="input" type="search" data-dd-filter="#control-items" placeholder="e.g. Chip"></label>
<ul class="rows" id="control-items"><li class="row">Chip</li><li class="row">Table</li></ul>` }
    ],
  },
  {
    slug: "facets",
    previewHeight: "auto",
    name: "Facets",
    label: "Narrow the list",
    group: "Navigation",
    description: "Combine kinds and states to filter a large listing without leaving the page.",
    api: [["data-dd-facets","A selector for the list to filter. Requires the optional script."],["data-dd-facet=\"kind:select\"","A condition and value, matched by data-dd-kind=\"select\" on the row."],["data-dd-facet-search / data-dd-facet-clear","A text search field, or a button that clears conditions."],["data-dd-empty","A selector for the no-results message."],["data-dd-facet-url=\"off\"","Disables saving conditions in the URL, useful for embedded examples."]],
    note: "Values within one group are ORed; different groups are ANDed. Display counts and selected states. Without JavaScript, every row remains readable.",
    story: "components-facets--faceted",
    examples: [
      { title: "Basic usage", html: String.raw`<div class="facets" data-dd-facets="#facet-items" data-dd-facet-url="off" data-dd-empty="#facet-empty" data-dd-enhance hidden>
  <div class="facet-group">
    <button class="chip facet tone-blue" data-dd-facet="kind:select">SELECT <span class="facet-count">2</span></button>
    <button class="chip facet tone-violet" data-dd-facet="kind:insert">INSERT <span class="facet-count">1</span></button>
  </div>
  <button class="btn" data-dd-facet-clear>Clear</button>
  <span class="facet-shown" aria-live="polite"></span>
</div>
<ul class="rows" id="facet-items">
  <li class="row" data-dd-kind="select">SELECT id FROM posts</li>
  <li class="row" data-dd-kind="select">SELECT name FROM users</li>
  <li class="row" data-dd-kind="insert">INSERT INTO events (name) VALUES (:name)</li>
</ul>
<p class="empty" id="facet-empty" hidden>No matching items.</p>` }
    ],
  },
  {
    slug: "search",
    name: "Search",
    label: "Find a document",
    group: "Navigation",
    description: "Jump to the right item without losing your place in the current document.",
    api: [["data-dd-search","The search input. Use one per page."],[".search-results / data-dd-search-results","The results container, initially hidden."],["window.ddSearchIndex","An array of objects with name, href, where, and body fields."],["window.ddSearch(query)","An optional custom provider returning an array."]],
    note: "Generate the index alongside the HTML. Keep a linked directory available for readers who do not use search.",
    story: null,
    examples: [
      { title: "Basic usage", html: String.raw`<label>Search components
  <input type="search" class="input" data-dd-search placeholder="e.g. Chip / table / code" aria-label="Search components" autocomplete="off" data-dd-enhance hidden>
</label>
<div class="search-results" data-dd-search-results hidden></div>
<p class="note">Search the components on this site. <kbd>/</kbd>  to focus the search field.</p>` },
      { title: "Provide a search index", language: "JavaScript", sourceOnly: true, html: String.raw`window.ddSearchIndex = [
  { name: "Chip", href: "../chip/", where: "Lists & data", body: "Classification labels" },
  { name: "Table", href: "../table/", where: "Lists & data", body: "Comparable rows" }
];` }
    ],
  },
  {
    slug: "sidebar",
    name: "Sidebar",
    label: "Where you are",
    group: "Navigation",
    description: "Keep the current location and the rest of the document within reach.",
    api: [[".sidebar","A scrollable navigation region placed directly inside doc."],[".sidebar-section / .sidebar-title / .sidebar-list","A group, its heading, and its links."],[".is-active / aria-current=\"page\"","Mark the current page with both a bar and an accessible state."],[".sidebar-context / data-dd-toc","A page-level table of contents; the optional script tracks its active heading."]],
    note: "This example shows the sidebar contents. For a full page, put sidebar on the nav element inside doc and add a mobile toggle in Topbar.",
    story: "layouts-doc-shell--overview",
    examples: [
      { title: "Basic usage", html: String.raw`<nav aria-label="Example navigation">
  <div class="sidebar-section"><p class="sidebar-title">Lists & data</p>
    <ul class="sidebar-list"><li class="is-active"><a href="../sidebar/" aria-current="page">Sidebar</a></li>
      <li><a href="../table/">Table</a></li><li><a href="../chip/">Chip</a></li></ul>
  </div>
</nav>` }
    ],
  },
  {
    slug: "topbar",
    name: "Topbar",
    label: "Context & actions",
    group: "Navigation",
    description: "Bring breadcrumbs, theme controls, and the mobile navigation toggle into one document header.",
    api: [[".topbar","The sticky document header."],[".breadcrumbs / .breadcrumb-sep / .breadcrumb-current","Breadcrumb links, separators, and current location."],[".topbar-tools","A row of page actions."],[".nav-toggle / data-dd-nav-toggle","Toggles the mobile sidebar. Place it inside doc."]],
    note: "Give separate breadcrumb navigations distinct aria-label values when a page contains more than one.",
    story: "layouts-doc-shell--overview",
    examples: [
      { title: "Basic usage", html: String.raw`<header class="topbar">
  <nav class="breadcrumbs" aria-label="Example breadcrumbs">
    <a href="../">Components</a><span class="breadcrumb-sep">/</span><span class="breadcrumb-current">Topbar</span>
  </nav>
  <div class="topbar-tools"><button class="btn" data-dd-theme-toggle data-dd-enhance hidden aria-label="Switch theme">◐</button></div>
</header>` }
    ],
  },
  {
    slug: "tabs",
    name: "Tabs",
    label: "Views of one thing",
    group: "Navigation",
    description: "Switch between different views of one subject. Without JavaScript, all content stays visible.",
    api: [["data-dd-tabs","The tab group."],[".tablist / .tab","The tab strip and individual buttons."],[".tabpanel / .tabpanel-title","The content and its heading for print or JavaScript-free reading."],["aria-controls / aria-labelledby","Connect each button and panel using unique IDs."]],
    note: "Do not add hidden to inactive panels in the initial HTML. Arrow keys, Home, and End navigate the tabs. All panels appear in print.",
    story: "components-tabs--basic",
    examples: [
      { title: "Basic usage", html: String.raw`<div class="tabs" data-dd-tabs>
  <div class="tablist" role="tablist" aria-label="Sample output format">
    <button class="tab" role="tab" id="sample-html-tab" aria-controls="sample-html" aria-selected="true">HTML</button>
    <button class="tab" role="tab" id="sample-css-tab" aria-controls="sample-css" aria-selected="false">CSS</button>
  </div>
  <section class="tabpanel" role="tabpanel" id="sample-html" aria-labelledby="sample-html-tab"><h3 class="tabpanel-title">HTML</h3><p>Add classes to semantic HTML.</p></section>
  <section class="tabpanel" role="tabpanel" id="sample-css" aria-labelledby="sample-css-tab"><h3 class="tabpanel-title">CSS</h3><p>Load the stylesheet in your document.</p></section>
</div>` }
    ],
  },
  {
    slug: "disclosure",
    name: "Disclosure",
    label: "Details on demand",
    group: "Navigation",
    description: "Keep secondary details available, with a clear indication of what is inside.",
    api: [[".disclosure","The native details element."],[".disclosure-body","Spacing for the expanded content."],[".disclosure-boxed","A boxed variant for a self-contained item."],[".disclosure-group","A group of disclosures with aligned edges."]],
    note: "Describe the contents in summary. Do not hide the essential conclusion inside a disclosure. It works without JavaScript.",
    story: "components-disclosure--basic",
    examples: [
      { title: "Basic usage", html: String.raw`<details class="disclosure">
  <summary>Why analysis stopped <span class="count">2 reasons</span></summary>
  <div class="disclosure-body"><ul><li>The statement depends on runtime input.</li><li>An external library definition is unavailable.</li></ul></div>
</details>` }
    ],
  },
  {
    slug: "pagination",
    name: "Pagination",
    label: "What comes next",
    group: "Navigation",
    description: "Name the next destination before the reader needs to click it.",
    api: [[".pager / .pager-prev / .pager-next","Previous and next destinations."],[".pager-dir / .pager-name","The direction and the destination name."],[".pages / .is-current / .pages-gap","Numbered pagination, the current page, and an omitted range."]],
    note: "Say where the link goes, not only “Next”. Give the current page aria-current=\"page\".",
    story: "components-pagination--prev-next",
    examples: [
      { title: "Basic usage", html: String.raw`<nav class="pager" aria-label="Related components">
  <a class="pager-prev" href="../tree/"><span class="pager-dir">Previous</span><span class="pager-name">Tree — Navigate a hierarchy</span></a>
  <a class="pager-next" href="../tabs/"><span class="pager-dir">Next</span><span class="pager-name">Tabs — Switch between views</span></a>
</nav>` }
    ],
  },
  {
    slug: "keys",
    name: "Keys",
    label: "Keyboard shortcuts",
    group: "Navigation",
    description: "Match the available keys to what they do on this page.",
    api: [[".keys","A definition list of keys and actions."],["kbd","The actual key name."],[".key-hint","A short hint beside an input."]],
    note: "This component only displays instructions. Document shortcuts that actually work on the page.",
    story: "components-keys--shortcuts",
    examples: [
      { title: "Basic usage", html: String.raw`<dl class="keys">
  <div><dt><kbd>/</kbd></dt><dd>Focus search</dd></div>
  <div><dt><kbd>↑</kbd><kbd>↓</kbd></dt><dd>Move through results</dd></div>
  <div><dt><kbd>Enter</kbd></dt><dd>Open the selected result</dd></div>
  <div><dt><kbd>Esc</kbd></dt><dd>Close search results</dd></div>
</dl>` }
    ],
  },
  {
    slug: "notice",
    name: "Notice",
    label: "Page-level context",
    group: "Status & feedback",
    description: "Explain a limitation or condition that affects how the entire page should be read.",
    api: [[".notice","A neutral page-level note by default."],[".tone-warn","A result that needs careful interpretation."],[".tone-danger","An unresolved result or a significant problem."],[".tone-ok","A successful or completed state."]],
    note: "Static information does not need role=\"alert\". Put the qualification close to the figure or list it affects.",
    story: "components-notice--tones",
    examples: [
      { title: "Basic usage", html: String.raw`<div class="notice tone-warn">
  <strong>These counts are lower bounds.</strong>
  Dependency tracing stopped early. More calls may exist than the analysis could determine.
</div>` }
    ],
  },
  {
    slug: "banner",
    name: "Banner",
    label: "Document status",
    group: "Status & feedback",
    description: "A page-wide notice for an archived version, comparison view, or other document state.",
    api: [[".banner","A band describing the whole document."],[".banner-label / .banner-body / .banner-action","The status label, explanation, and next action."]],
    note: "Use Notice or Callout for local context. Always name the state in words.",
    story: "components-banner--version",
    examples: [
      { title: "Basic usage", html: String.raw`<div class="banner tone-warn">
  <span class="banner-label">Archived</span>
  <span class="banner-body">This is an archived v1.0 document.</span>
  <a class="banner-action" href="../../">View the product →</a>
</div>` }
    ],
  },
  {
    slug: "empty",
    previewHeight: "auto",
    name: "Empty",
    label: "Nothing here, and why",
    group: "Status & feedback",
    description: "Distinguish no results, unmatched filters, and information that could not be determined.",
    api: [[".empty","A region with no results."],[".empty-title / .empty-note","What is missing, why, and what to do next."]],
    note: "Zero and unknown are different. Do not display unknown results as a count of zero.",
    story: "components-empty--no-results",
    examples: [
      { title: "Basic usage", html: String.raw`<div class="empty">
  <p class="empty-title">No statements match.</p>
  <p class="empty-note">Remove a filter or try a different keyword.</p>
  <a class="btn" href="../">Back to components</a>
</div>` }
    ],
  },
  {
    slug: "stat",
    name: "Stat",
    label: "Numbers with meaning",
    group: "Status & feedback",
    description: "A figure that answers a question, with a label and any qualification it needs.",
    api: [[".stats / .stat","A group of figures and an individual statistic."],[".stat-fig / .stat-label / .stat-note","The value, what it measures, and a note."],[".is-bound","Prefixes the value with ≥ to mark a lower bound."],[".stat-delta / .stat-up / .stat-down","The change from a previous result. Explain whether the direction is good."]],
    note: "Numbers do not wrap. Give a figure enough width instead of making it too small to read.",
    story: "components-stat--catalog",
    examples: [
      { title: "Basic usage", html: String.raw`<div class="stats">
  <div class="stat"><b class="stat-fig">844</b><span class="stat-label">statements</span><span class="stat-note">SQL statements analyzed</span></div>
  <div class="stat tone-warn"><b class="stat-fig is-bound">978</b><span class="stat-label">findings</span><span class="stat-note">A lower bound on findings reached</span></div>
</div>` }
    ],
  },
  {
    slug: "timeline",
    previewHeight: "auto",
    preview: `<ol class="timeline">
      <li class="timeline-item tone-ok"><p class="timeline-title">844 statements found</p></li>
      <li class="timeline-item tone-ok"><p class="timeline-title">35 statements fully resolved</p></li>
      <li class="timeline-item is-open"><p class="timeline-title">809 statements not fully resolved</p></li>
    </ol>`,
    name: "Timeline",
    label: "What happened",
    group: "Status & feedback",
    description: "Show the order of events, their outcomes, and how far a run actually got.",
    api: [[".timeline / .timeline-item","An ordered list and its events."],[".timeline-time / .timeline-title / .timeline-description","When it happened, what happened, and supporting context. A description may hold several paragraphs."],[".is-open","An outlined mark for an unfinished or unconfirmed step."],[".sheet .timeline","Inside a report, entries take the report’s reading size and a baseline between them."]],
    note: "Do not mark an unconfirmed step complete. Write the outcome in the title as well as encoding it in color. In a report, a chronology reads at the same size as the notes around it; in a catalog, a run’s steps stay compact.",
    story: "components-timeline--run",
    examples: [
      { title: "Basic usage", html: String.raw`<ol class="timeline">
  <li class="timeline-item tone-ok"><span class="timeline-time">Discovery</span><p class="timeline-title">844 statements found</p><p class="timeline-description">Database calls across 77 files in the WordPress catalog.</p></li>
  <li class="timeline-item tone-ok"><span class="timeline-time">Resolution</span><p class="timeline-title">35 statements fully resolved</p><p class="timeline-description">The complete SQL text could be determined.</p></li>
  <li class="timeline-item is-open"><span class="timeline-time">Open results</span><p class="timeline-title">809 statements not fully resolved</p><p class="timeline-description">Dependency models and analysis limits leave this catalog incomplete.</p></li>
</ol>` },
      { title: "A chronology in a report", html: String.raw`<article class="sheet sheet-inset">
  <section class="sec">
    <h3 class="label">02 / 2014</h3>
    <div class="field">
      <p class="lead">Build, write and talk about the inconveniences close at hand.</p>
      <ol class="timeline">
        <li class="timeline-item"><span class="timeline-time">2014.05–06</span><p class="timeline-title">Reporting build results to Ukagaka</p><p class="timeline-description">Built grunt-sstp, which sends Grunt successes, warnings and failures to a desktop mascot. Published on Qiita on 6 May, followed on 1 June by an explanation of driving it from Scala’s SBT.<a class="cite" href="#src-1">1</a><a class="cite" href="#src-2">2</a></p></li>
        <li class="timeline-item tone-accent"><span class="timeline-time">2014.10.11 · First talk</span><p class="timeline-title">A new form of notification with PHP and Ukagaka</p><p class="timeline-description">A lightning talk at PHP Conference Japan 2014. The notification tools published since spring led to a talk at a technical conference.<a class="cite" href="#src-3">3</a></p></li>
      </ol>
    </div>
  </section>
  <section class="sec">
    <h3 class="label">12 / SOURCES</h3>
    <div class="field">
      <ol class="sources">
        <li id="src-1"><a href="https://github.com/k-kinzal/grunt-sstp">grunt-sstp</a><span class="source-meta">GitHub · 2014.05 · A Grunt plugin that reports build results to a desktop mascot</span></li>
        <li id="src-2"><a href="https://github.com/k-kinzal/grunt-dgeni">grunt-dgeni</a><span class="source-meta">GitHub · 2014.09 · A plugin that adds documentation generation to a Grunt build</span></li>
        <li id="src-3"><a href="https://www.slideshare.net/slideshow/php-40139017/40139017">PHP + Ukagaka: a new form of notification</a><span class="source-meta">Slides · 2014.10.11 · Lightning talk at PHP Conference Japan 2014</span></li>
      </ol>
    </div>
  </section>
</article>` }
    ],
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    label: "A little more context",
    group: "Status & feedback",
    description: "A CSS hint for the longer explanation behind an abbreviation or short label.",
    api: [[".hint","The text that carries a hint."],["data-dd-hint","The supplementary explanation."],["tabindex=\"0\"","Makes the hint reachable by keyboard."],[".tooltip-end","Anchors the tooltip to the right when it is near an edge."]],
    note: "Never put essential information only in a tooltip. Keep the meaning in the body for touch users and readers who do not hover.",
    story: "components-tooltip--hints",
    examples: [
      { title: "Basic usage", html: String.raw`<p>A <span class="hint" tabindex="0" data-dd-hint="Analysis stopped early. The actual count may be greater.">lower bound</span> describes what was determined, not a guaranteed total.</p>` }
    ],
  }
];

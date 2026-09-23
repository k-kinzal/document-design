# doc-site

The English product and documentation site for doc-ui, with Japanese translations.
The homepage is a paper; the
component index and usage guides are the documentation. A visual index leads to 43
component and layout guides, each with a rendered example, highlighted HTML,
classes and usage notes.

Every layout and component comes from `@k-kinzal/doc-ui`. This package has no
stylesheet of its own. Reusable gaps discovered here belong in doc-ui, with a
Storybook example and usage documentation.

## Develop

Install the workspace dependencies once with `npm install` at the repository
root. Then run these commands from this package:

```sh
npm run dev       # Vite+ at http://127.0.0.1:5173; opens the homepage
npm run build     # static HTML and assets in dist/
npm run preview   # preview dist/ at http://127.0.0.1:4173
npm run check     # links, metadata, language, highlighting and assets
npm test          # browser, accessibility, responsive and interaction checks
```

The local browser tests use installed Google Chrome. CI installs Playwright
Chromium. `DOC_SITE_NO_OPEN=1 npm run dev` starts the server without opening a tab.
The root `npm run dev` is a shortcut to this package's dev command.

Vite+ watches the generator's source modules and reloads the generated pages.
The development server reads doc-ui's public source exports for CSS hot updates.
Production resolves the installed dependency's built entry; build doc-ui after
editing it before producing a release. Workspace installation runs its prepare
script, and the root build/test shortcuts build dependencies in order.

## Source

- `src/home.mjs`: the product page, composed as a report sheet.
- `src/components.mjs`: component records, examples and reference text.
- `src/charts.mjs` and `src/graph-examples.mjs`: graph selection, public plot APIs
  and fixed-data HTML specimens for the Figures & graphs category.
- `src/docs.mjs`: the visual index, quick start and individual guides.
- `src/site.mjs`: document shell, canonical URL and social metadata.
- `src/i18n.mjs` and `src/locales/`: build-time translation and message catalogs.
- `src/highlight.mjs`: build-time Shiki parsing into doc-ui's `.tok-*` classes.
- `scripts/generate.mjs`: HTML, search data, sitemap, robots and 404 output.
- `public/assets/`: social card and typographic icons.

Vite+ builds 92 pages (46 per language) plus a bilingual 404 document. No client framework or highlighting
runtime is shipped. Classic doc-ui JavaScript provides search, copying, sorting,
filters, tabs, navigation and theme controls. Content remains available without
JavaScript. Relative asset URLs and explicit index filenames let the built
site be opened over `file://` as well as under a GitHub Pages project path.

## Publish

This package owns `/`, `/start/`, `/components/`, and `/components/<name>/`,
plus their Japanese counterparts under `/ja/`.
The repository's `scripts/pages.mjs` combines its `dist/` with doc-ui's Storybook
and versioned artifacts; `npm run build:pages` prepares that full site.
The existing Pages workflow checks and tests the packages before publishing.

The canonical origin is configured in `src/site.mjs`. Change it there if the
repository or domain changes. Each guide has its own title, description,
canonical, Open Graph text and structured data. The homepage adds the social
preview image. `sitemap.xml` enumerates the public routes; submit its URL to
Search Console when publishing. A project-path `robots.txt` is included, but
crawler rules are controlled by the host's domain-root robots file.

## Languages and typography

English is the source language and uses the default URLs. Japanese uses `/ja/`, `/ja/start/`, and
`/ja/components/…`. The header links to the same page in the other language;
navigation, search results and downloadable examples stay in the chosen language.
Storybook, CSS and JavaScript distributions are shared at the repository root.
Both languages have their own canonical URLs, `hreflang` links, metadata and
sitemap entries. No browser-language redirect or client translation runtime is used.

The HTML root declares `lang="en"` or `lang="ja"`. This activates doc-ui's
Japanese heading breaks and figure labels. The shared typography continues to
apply proportional metrics to headings and short labels while keeping body text
at its natural spacing. Compare the homepages, Prose, Report and figure guides
using the language link; the start guide explains the language attribute.

`src/locales/ja.json` maps English messages to authored Japanese. Messages with
inline markup keep the whole sentence together so Japanese can reorder links or
code. The build parses HTML source ranges, translates prose and accessible labels,
and highlights translated example HTML again. It preserves indentation, API names,
SQL, SVG geometry and the fixture values. `shared.json` lists intentional literals,
including public component names and identifiers. `npm run check` rejects missing
translations and verifies that every copyable example matches its translated
source. Add translations with new English content, and reserve shared literals for
content that actually has the same meaning in both languages.

## Editorial direction and example data

The site is the demonstration. Its cover uses the paper layout; the component
index and guides use the document layout. Do not add separate mock documents,
embedded sample applications, or a user's project history to explain the design.

The cover is a product page as well as a paper. It must explain what doc-ui is,
which reading tasks it supports, what the component library contains, and how to
start using it. Keep those answers concrete and organized; reducing noise must
not remove the information a visitor needs to evaluate the product.

The page's reading-path figure, caption and margin note demonstrate the composition
rules. Letter references connect the diagram to the prose; comparison uses aligned
columns, the library uses an inventory, and setup uses a short source excerpt. Put complete API details in the
guides. Avoid project history, unrelated use cases, and distribution conditions
presented as product differentiation.

`src/catalog.mjs` records a fixed excerpt from the WordPress SQL catalog supplied
with the project. It is not a benchmark or a claim about current WordPress.
The snapshot contains 844 statements: 35 resolved, 709 with incomplete models,
95 stopped by analysis limits or cycles, and 5 not analyzed. The table excerpt
contains the six callers of `{$}cache_data`, totaling 13 statements. The SQL
example is `MySQL::touch` at `wp-includes/SimplePie/src/Cache/MySQL.php:317`.

Source files and SHA-256 digests, for identifying the supplied snapshot:

- `wordpress-sql-catalog/index.html`: `2348db595ce2e016269e295f6f21333438382a3f052531f3e1a9ad5166fab647`
- `wordpress-sql-catalog/tables/cache-data.html`: `94bfe1007d0e5641dc6a36a64e742ca58d1039cf3ad568b8f58f79036813b9d1`

The catalog fixtures are stored in this package; builds do not read an
external checkout or a sibling package's private data. Components that need
numeric data share this fixed snapshot. Layout guides and the quick start use
the content of this site itself.

The graph examples also retain the catalog’s 13 source positions in `MySQL.php`:
90, 120, 135, 142, 146, 156, 204, 208, 216, 240, 297, 317, 335. The step plot
accumulates static call sites along this source-line axis; it is not a time
series. The histogram groups the six callers into inclusive two-statement bins
(1–2, 3–4, 5–6, 7–8), yielding 5, 0, 0, 1 callers. The zero/unknown example uses
the catalog’s zero fully traced runtime-input statements and explicitly states
that runtime execution counts were not measured.

The comparison and missing-interval examples use the supplied bison-parser 3.8.2
task report dated 2026-02-11: source coverage 20/29 → 29/30, or 68.97% → 96.67%.
The difference is 27.70 percentage points, with a changed denominator. No
intermediate measurements are asserted. Source file `rpt_2f13da82c39248859bc8.html`
has SHA-256 `f2db0e1382ad378649fc32354d7f83103997dba6d8fd23fdb7a926be93b40444`.
These excerpts are documentation examples, not current project claims.

`npm run social` renders the sharing image from the product page’s actual reading-path
figure, with its caption and annotation, using Playwright. Rebuild doc-ui first after changing its styles. This keeps the social
preview tied to the actual product instead of maintaining an illustrated mockup.

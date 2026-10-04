# document-design

Shared CSS for generated documentation, catalogs and reports.

The project and its default Storybook examples use English. Japanese output is
also supported and optimized for Japanese typography. Use `lang="ja"` on Japanese
content; named Japanese stories cover typesetting, figure labels, localized
controls, and a complete report while keeping their documentation in English.

Factored out of figures generators that had each grown their own stylesheet:
[php-ai-toolkit](https://github.com/k-kinzal/php-ai-toolkit)'s API reference,
[ztd-query-php](https://github.com/k-kinzal/ztd-query-php)'s SQL catalog, and
QuuuAI's run reports. They had converged on the same ideas and drifted on the
details; this is the shared part, maintained once.

```html
<link rel="stylesheet"
      href="https://k-kinzal.github.io/document-design/v1/document-design.css">
```

**[Component list and examples →](https://k-kinzal.github.io/document-design/components/)**

## Palette variations

Choose from 32 light/dark pairs: four papers (`paper`, `linen`, `mist`, `sage`)
and eight accents (`blue`, `cyan`, `teal`, `indigo`, `violet`, `plum`, `citron`,
`slate`). `paper-blue` preserves the original default. The build writes each
pair to `dist/palettes/<paper>-<accent>.css` and `.min.css`.

Load one palette after the base stylesheet. Save both files with your HTML
for offline use; no JavaScript or theme attribute is required:

```html
<link rel="stylesheet" href="./document-design.css">
<link rel="stylesheet" href="./palettes/linen-teal.css">
```

The pair follows the system preference. `data-dd-theme="light"` or `"dark"`
selects a mode. Paper and accent vary; category and state hues remain stable,
with red reserved for missing or unresolved information. All text, accent,
identity and state colors clear 4.5:1 against five surfaces and their tints.

For a gallery or switchable document, load `document-design.palettes.css`
after the base instead, and set `data-dd-palette="linen-teal"` on the root or
an embedded specimen. `.palette-pair` holds two `.palette-sample` elements,
with explicit `data-dd-theme="light"` and `"dark"`. Use normal text roles
inside; do not scale down the specimen. Grayscale/monochrome override a palette
on the same element, while an explicit nested palette restores color.

The optional classic script handles a `select[data-dd-palette-select]` whose
option values are palette IDs, or buttons with `data-dd-palette-choice="id"`
and `aria-pressed`. Add `data-dd-enhance hidden` to the controls. Preferences
persist only on pages with palette controls; a standalone fixed document
keeps its authored palette. The default storage key is `dd-palette`; override
it with `data-dd-palette-key` on the root. Palette selection and light/dark
selection are independent. `palettes.json` lists the IDs and names for generators.
The package exports `@k-kinzal/doc-ui/palettes` (JSON), `./palettes.css`, and
`./palettes/<id>.css`.

## Markdown CLI

The `doc-ui` command turns a Markdown file or stdin into a complete HTML
document. It embeds the matching doc-ui CSS, including its license, so the
styles need no JavaScript or network. Node.js 22 or newer is required to run
the converter; reading the HTML only requires a browser.

Run from a repository checkout after `npm install`:

```sh
npx --no-install @k-kinzal/doc-ui README.md -o README.html
npx --no-install @k-kinzal/doc-ui report.md --layout paper --lang ja --paper a4 -o report.html
cat book.md | npx --no-install @k-kinzal/doc-ui --layout book --color monochrome > book.html
```

After the maintainer publishes the package to npm, the registry invocation is
`npx @k-kinzal/doc-ui input.md -o output.html`. Until then, a packed archive
works outside the checkout too; packing does not publish or create a release:

```sh
npm pack --workspace @k-kinzal/doc-ui
npx --package ./k-kinzal-doc-ui-1.1.0.tgz doc-ui input.md -o output.html
```

The archive bundles the parser, CSS and third-party notices. It installs no
runtime dependencies and needs no build tools at the destination. Pin a full
package version or retain the archive when reproducible output matters.

| Option | Default | Meaning |
| --- | --- | --- |
| `-o`, `--output <file>` | stdout | Write HTML; create missing parent directories. `-` also selects stdout. |
| `--layout doc` | `doc` | Document frame with normal Markdown heading hierarchy and readable prose. |
| `--layout report` | | Large opening title, with top-level H2 headings becoming numbered report sections. |
| `--layout paper` | | Continuous single-column paper with a title header and reading typography. |
| `--layout book` | | Opening cover/introduction, then one chapter per top-level H2. Each chapter begins on a new printed page; long chapters continue naturally. |
| `--theme auto\|light\|dark` | `auto` | Follow the reader's preference or select a theme. Print always uses light. |
| `--color color\|grayscale\|monochrome` | `color` | Use the existing doc-ui colour modes. These describe appearance, not printer ink channels. |
| `--lang <tag>` | `en` | Set the document language; use `ja` for Japanese typography and labels. |
| `--paper auto\|a4\|letter` | `auto` | Let the printer choose, or set paper size and page numbering. This creates printable HTML, not a PDF file. |
| `--print-urls inline\|sources\|none` | `inline` | Print URLs beside links, only in authored `.sources` lists, or omit them. |
| `--title <text>` | first H1 / filename | Set the browser title. The visible Markdown stays as authored. Stdin without H1 uses “Document”. |
| `--html` | off | Render raw HTML from trusted Markdown, including doc-ui components. Raw HTML is not sanitized. |
| `-h`, `--help`; `-v`, `--version` | | Show usage or the package version. |

Omit the input or use `-` to read stdin. Use `--` before a filename beginning
with `-`. Invalid options and I/O failures exit nonzero and report to stderr;
stdout contains only HTML. The output must differ from the source file.

CommonMark blocks, tables, strikethrough, automatic links and task lists are
supported. Tables scroll within a keyboard-focusable wrapper. Fenced code is
escaped and retains its language class; it is not syntax-highlighted. Headings
receive readable, unique IDs for links. Only top-level H2s divide reports and
books; headings inside lists, quotes and code do not split their containers.
A leading H1 becomes the report title or paper/book header; a missing title
is not invented. YAML front matter, math and diagram extensions are not
interpreted. With `--html`, authored HTML can use the existing components.

Images remain references and are not downloaded or embedded. Keep local images
with the document; remote images still need a network. With `-o`, relative
Markdown image and link URLs are rebased from the input directory to the output
directory (stdin starts from the working directory). For stdout, URLs are kept
as authored: place redirected output beside the input, or use `-o` to rebase it.
Raw HTML URLs remain as authored even with `-o`.

## What you get

- **Two page genres.** `.doc` for a catalog you navigate; `.sheet` for a report
  you read straight through. They measure differently on purpose.
- **Components and layouts**, from chips and tables to rendered markdown, diffs,
  dependency graphs, trees, timelines and terminal output.
- **One tone system.** `.tone-blue`, `.tone-warn` — colour is orthogonal to
  components, so a component added later gets every tone for free.
- **Light and dark**, written once with `light-dark()`, following the reader's
  system unless told otherwise.
- **Printable.** A report is the kind of thing that gets attached to a ticket
  as a PDF, so print is a supported output rather than an afterthought.
- **No build step, no JavaScript required.** One `<link>`.

## What the design is

The subject is *documents a program wrote* — an API reference with 542 symbols,
a catalog with 844 statements, a report nobody has read yet. Eight principles
follow from that, and **Foundations → Principles** in Storybook sets them out.
The one the rest bends around:

> **Say what is not known.** An analyzer that cannot resolve a statement has
> learned something, and the page has to be able to say it. If the design can
> only render success, the generator will round up — a lower bound gets printed
> as a total — and the document becomes confidently wrong.

That is why absence is a first-class mark (`.hole`, `.meter-part.is-open`,
`.empty`, `.caveat`), and why the hue budget reserves red for it.

## Design decisions

**Custom properties are prefixed; class names are not.** A custom property
inherits through the whole document, and neither `@layer` nor `@scope` contains
one — so `--bg` here and `--bg` in a consumer are the same property. They are
also the theming API, and an API wants a stable name. Class names have no such
problem: these stylesheets own the document they are loaded into, and the
cascade question is answered structurally instead.

**Everything is in `@layer dd`.** Layers rank below unlayered CSS regardless of
specificity, so a consumer overrides anything by writing an ordinary rule — no
`!important`, no specificity ladder, and no defensive prefix on class names to
stay out of anyone's way.

**`@scope` is not used as the foundation.** It reached Baseline in January 2026,
and an unsupported at-rule is dropped whole — which for an archived report
means a completely unstyled page rather than a degraded one. It also only
isolates selectors, not inherited values, and its real strength is proximity
resolution for recursively nested components, which this has none of.

**Tints are derived, not written out.** Each is its hue mixed into the page
background in oklab. The stylesheets this replaces carried twenty hand-picked
tint hexes two themes deep; `npm run check:contrast` now proves the claim that
each hue is accessible on its own wash, in both themes.

## Development

This package lives in a workspace. Install once at the repository root, then
run scripts from either place.

```sh
npm install                              # at the repository root

# in packages/doc-ui
npm run storybook        # design and browse components at :6006
npm run build            # dist/document-design.css + .min.css + .js
npm run check            # every hue against every surface, both themes

# at the repository root
npm run build            # every package that has one
npm run check            # DESIGN.md against the tokens, then every package
npm run build:pages      # what gh-pages serves, from every package
```

`build:pages` is a repository-level script: the published site is assembled
from this package and from doc-site together, so it does not belong to either.

## Layout of the source

```
src/
  index.css          entry: declares the layer order, imports everything
  tokens.css         entry: tokens only, for a page with its own layout
  tokens/            palette (raw hues) → role (what they mean) → scale
  base/              reset, text, tone modifiers, skip link, print
  layout/            doc (catalog frame), report (sheet), arrange (shared)
  components/        grouped by what they are for:
                       reading    prose, callout, quote, deflist, sources
                       code       code, diff, terminal, filetree
                       structure  tree, graph, disclosure, tabs, pagination
                       data       table, listing, meter, plot, stat, facts, symbol
                       status     chip, notice, banner, empty, timeline
                       frame      sidebar, topbar, control, search, facets
                       aids       keys, tooltip, card
                       publication covers, section headings, live specimens
  js/                the optional behaviour layer
```

## Versioning

`/v1/` is the stable URL and is not changed in a way that restyles a page
already written — the consumers here are generated documents that get archived.
A breaking change goes to `/v2/`. `/v1.0/` follows compatible patches in its minor
series. Full paths such as `/v1.0.0/` never change and are the preferred links
for archived documents. Each published main commit also has an immutable path
using its full 40-character SHA; `/latest/` tracks the tip of `main`.

Stable Git tags must match this package's version. The product site and
Storybook follow the highest published stable version, with the site's CSS and
JavaScript pinned to that release.

## Publication and preview components

`doc-site` is a consumer of the same public CSS. It uses `.masthead`, `.brand`,
`.cover`, `.section`, `.specimen` and `.colophon` for publication structure.
`.doc-inset` and `.sheet-inset` embed the two reading modes in a live specimen;
`.sheet-wide` gives a publication cover more room.

A visual catalog uses `.card-preview` inside `.card`, followed by a heading
link with `.card-link`. Give a decorative preview `inert aria-hidden="true"`,
omit duplicate IDs and behavior hooks, and keep its title and description
outside the preview. The link covers the whole card. The preview stays at the
normal readable type size and leads to a complete example.

Syntax colors are provided by `.tok-kw`, `.tok-str`, `.tok-num`, `.tok-com`,
`.tok-var` and `.tok-id`. A generator supplies the highlighted spans; the
library keeps their colors consistent in light, dark and print themes.
`.code-head` places a language label and copy button above a code block.

Use `data-dd-enhance hidden` on controls that only make sense with JavaScript.
The behavior script reveals them after initialization. Leave the content itself
visible so an unenhanced or archived document stays readable.

Declare `lang="ja"` or `lang="en"` on the document root (or a nested example).
The behavior script follows the nearest language for copy confirmation, theme
labels and empty search results. Other languages use the English fallback.
Authors still supply the initial button text, input labels and search data.
`Components/Control/Japanese feedback` demonstrates this behavior.

Topbar wraps controls onto a second row when their text and the current location
cannot fit together. Language links can use ordinary `.btn.btn-quiet` anchors
with `lang` and `hreflang`; they work without JavaScript. See
`Components/Topbar/Languages` for a narrow Japanese example.


## Figures and composition

Use a semantic `figure.plate` for a drawing, table, or HTML diagram, followed by
its `figcaption`. `.plate-wide` and `.plate-full` let the figure exceed the prose
measure. Captions are numbered automatically; when a generator writes reference
numbers, use `.plate-unnumbered` and write the same explicit number in both places.

`.plate-side` extends this figure with a two-part caption: `.plate-summary` for
its interpretation and `.margin-note` for a qualification. Put the summary first
in the HTML; the note sits in the left margin on wide columns and follows the
summary on narrow ones. `.plate-body` groups the visual between rules.

`.compare` aligns two related groups when their container has room. `.flow` is
an ordered list of three stages, with `.flow-mark`, `.flow-name`, and
`.flow-detail` for the ordinal, name, and explanation. Its arrows express sequence;
use a different diagram for causality or an arbitrary number of stages.
`.ref-mark` adds a letter-and-color reference that stays meaningful in monochrome.

Use `.sheet-body` on a semantic `main` or `article` inside a `.sheet` to preserve
the parent grid through that wrapper. `.doc-quiet` lowers the sidebar's surface
contrast while retaining readable text. `.index-nav` offers an unboxed category
index, and `.link-list` groups plain links without making them look like controls.
See `Components/Composition` in Storybook and the product site's Composition guide.

## Choose a graph by the question

| Reader’s question | Pattern | Public marks |
| --- | --- | --- |
| How does one whole divide? | Meter | `.meter`, `.meter-part`, `.legend` |
| Which category has more? | Bar chart | `.bars`, `.bar-row`, `.bar-track`, `.bar-fill`, `.bar-value` |
| What changed between two observations? | Comparison plot (dumbbell) | `.plot-span`, `.plot-before`, `.plot-point` |
| How does a measure change across time or position? | Line / step plot | `.plot-line`, `.plot-point`, `.plot-missing` |
| Where do numeric observations concentrate? | Histogram | `.plot-bin`, `.plot-zero` |
| What depends on what? | Graph | `.node`, `.edge` |
| Which branch leads to which outcome? | Flow graph | `.node-action`, `.node-decision`, `.node-terminal`, `.edge-flow`, `.edge-arrow`, `.edge-label` |

All patterns belong inside a `.plate`, with a question, units, caption and source.
Bars are HTML lists: use the **same maximum for every row**, then set
`--dd-bar` to `value / maximum * 100%`. Zero has zero width. An unknown value has
no fill: use `.bar-track.is-missing` and write “Not measured” in `.bar-value`.

Other plots compose `.draw` and its text roles with the marks in `plot.css`.
The generator owns coordinates, scales and binning; doc-ui owns type and marks.
Set `--dd-draw-width` to the SVG viewBox width in pixels (the standard wide
figure is 768px). `.draw-wrap` scrolls instead of shrinking labels; give a
scrolling wrapper `tabindex="0"`, `role="region"` and an accessible name.
Set `text-anchor` in SVG attributes, not CSS. Include a complete accessible
description and exact observations in the caption or a companion table.

Keep bars and histogram counts on a zero baseline. Paired observations need
both denominators; percent changes and percentage-point differences are not
interchangeable. Use steps for discrete accumulation and separate line paths
around missing observations. A second series can use `.plot-line-alt` and
`.plot-point-alt` for dashes and hollow points, plus direct labels. Histograms
need sample size, bin boundaries and equal widths when showing counts. Empty
bins are zeros; an unmeasured population belongs in `.empty`.

Use `Components/Bar chart`, `Comparison plot`, `Line plot`, `Histogram` and
`Flow graph` in Storybook for catalog, report and narrow examples. The product
site’s **Figures & graphs** category provides copyable HTML and usage guidance.
Data provenance is recorded in [graph-examples.md](stories/graph-examples.md).

Flow graphs use one node module throughout a figure. The full pattern uses
224 × 64px bounds for actions, decisions and outcomes, with 48px between rows;
the compact index uses 96 × 40px and shorter labels. Both retain the shared
drawing text size and a 1.5px outline. Center titles with `.draw-strong` and
explicit SVG alignment attributes; put supporting notes outside the boxes.
If the text needs more room, enlarge the shared module. Route lines clear of
branch labels rather than outlining text in a guessed background color.

## Typeset a book

`Examples/Book` in Storybook shows actual paginated spreads in A5, A4 and
JIS B6, including English and explicitly named Japanese editions. The books
contain native MathML, calculated SVG graphs, tables, local images and a
colophon. **Page anatomy** marks the type area and the four margins. Open the
selectable PDF or download the self-contained, script-free HTML from the proof.

Start with the trim size, then choose the type area. The A5 example is
148 × 210 mm with an 18 mm head, 24 mm foot, 20 mm gutter and 18 mm fore-edge,
leaving 110 × 168 mm for content. The paper standard specifies the trim;
these margins are editable design choices. Body text is 12 pt with 7 mm
leading. Gutter and fore-edge margins mirror on even and odd pages for left
binding. Book and chapter titles repeat in the outer head margins; plain
folios sit at the outer foot edges.

The optional `@k-kinzal/doc-ui/book` module generates ordinary CSS. Run it when
authoring the document, include its CSS after doc-ui, and save the resulting
HTML. Nothing needs to run in the reader's browser:

```js
import { bookGeometry, bookVariables, bookPageCSS } from '@k-kinzal/doc-ui/book';

const geometry = bookGeometry('a5', { gutter: 22, fore: 16 });
const pageCSS = bookPageCSS('chapter-one', {
  geometry, title: 'Book title', chapter: 'First chapter',
});
const manuscript = `
<article class="sheet sheet-paper sheet-book" lang="en" data-dd-book="a5"
         style="${bookVariables(geometry)}" data-dd-color="monochrome"
         data-dd-print-urls="sources">
  <section class="book-page" style="--dd-book-page: chapter-one">
    <header class="paper-head"><h2>First chapter</h2></header>
    <div class="prose"><p>Chapter text.</p></div>
  </section>
</article>`;
// Include pageCSS in a <style> and manuscript in <body>.
```

Formats are `a5`, `a4`, `b6-jis` (128 × 182 mm, not ISO B6) and `letter`.
Override `width`, `height`, `head`, `foot`, `gutter`, `fore`, `leading`,
`headGap` or `folioGap` in millimetres. The last two set the distance between
the type area and its running head or folio. Generate a uniquely named page
rule for each chapter; use `furniture: false` for a title page or blank leaf.
The output is regular named `@page` rules and `--dd-book-*` properties that
can also be written by a PHP, Rust or shell generator. `data-dd-book` opts into
the book composition; its geometry comes from those properties and page rules.
The simpler `data-dd-paper="a4"` / `"letter"` composition remains supported,
including the Markdown CLI's `--layout book`.

Each `.book-page` begins a new printed page and may continue across as many
pages as its text requires, with the same geometry, running head and colour
mode. There are no fixed-height manuscript boxes to clip text. Japanese
content needs `lang="ja"`. Size SVG drawings for the chosen type area; do not
scale their text to fit a smaller format.

The Storybook build paginates the specimen in Chromium, reads the PDF back,
inserts blank versos where needed, and resolves the contents' actual folios.
This pass is necessary because Chromium does not enforce recto starts with
`break-before: right`. Rebuild with `npm run build:book-proofs` after changing
content, fonts, geometry or CSS; both Storybook commands do this automatically.
The proof pairs even pages on the left and odd pages on the right at the trim
size, with local horizontal scrolling on narrow screens. The HTML reading
view reflows instead. Print that HTML with CSS page size and browser headers
disabled, or use the generated PDF to preserve the checked pagination.
Named page margin boxes require a supporting print engine; PDF tests use
Chromium. Reprinting with different fonts can change chapter starts and folios.

`data-dd-color="color"` restores the standard palette inside a neutral book.
`grayscale` selects neutral inks; `monochrome` selects black and white inks.
Book images follow the nearest colour boundary: neutral modes desaturate them,
while text and SVG remain vector content. For genuinely bitonal artwork,
supply a black-and-white source image; desaturation alone retains gray tones.
These modes describe appearance, not printer ink channels or CMYK separation.
The example's original raster plates can be regenerated with
`npm run build:book-art --workspace @k-kinzal/doc-ui`.

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
                       reading    prose, callout, quote, deflist
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
JavaScript pinned to that release. See [Development and releases](../../docs/DEVELOPMENT.md) for the release procedure.

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

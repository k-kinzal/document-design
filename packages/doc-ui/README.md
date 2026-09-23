# document-design

Shared CSS for generated documentation, catalogs and reports.

Factored out of figures generators that had each grown their own stylesheet:
[php-ai-toolkit](https://github.com/k-kinzal/php-ai-toolkit)'s API reference,
[ztd-query-php](https://github.com/k-kinzal/ztd-query-php)'s SQL catalog, and
QuuuAI's run reports. They had converged on the same ideas and drifted on the
details; this is the shared part, maintained once.

```html
<link rel="stylesheet"
      href="https://k-kinzal.github.io/document-design/v1/document-design.css">
```

**[Component list and examples →](https://k-kinzal.github.io/document-design/)**

## What you get

- **Two page genres.** `.doc` for a catalog you navigate; `.sheet` for a report
  you read straight through. They measure differently on purpose.
- **29 components**, from chips and tables to rendered markdown, diffs,
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

```sh
npm install
npm run storybook        # design and browse components at :6006
npm run build            # dist/document-design.css + .min.css + .js
npm run check:contrast   # every hue against every surface, both themes
npm run build:pages      # what gh-pages serves
```

## Layout of the source

```
src/
  index.css          entry: declares the layer order, imports everything
  tokens.css         entry: tokens only, for a page with its own layout
  tokens/            palette (raw hues) → role (what they mean) → scale
  base/              reset, text, tone modifiers, skip link, print
  layout/            doc (catalog frame), report (sheet), arrange (shared)
  components/        29 of them, grouped by what they are for:
                       reading    prose, callout, quote, deflist
                       code       code, diff, terminal, filetree
                       structure  tree, graph, disclosure, tabs, pagination
                       data       table, listing, meter, stat, facts, symbol
                       status     chip, notice, banner, empty, timeline
                       frame      sidebar, topbar, control, search, facets
                       aids       keys, tooltip, card
  js/                the optional behaviour layer
```

## Versioning

`/v1/` is the stable URL and is not changed in a way that restyles a page
already written — the consumers here are generated documents that get archived.
A breaking change goes to `/v2/`. `/latest/` tracks `main`.

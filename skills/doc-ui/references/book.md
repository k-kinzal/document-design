# Books

Use `.sheet.sheet-paper.sheet-book`. Each `.book-page` is an authored division
(cover, contents, chapter), not a fixed-height printed page. Long chapters flow
onto continuation pages. A simple manuscript can use `data-dd-paper="a4"` or
`"letter"`, including output from the Markdown CLI.

For a specified trim size and running heads, use the optional generation-time
helpers from `@k-kinzal/doc-ui/book`:

```js
import { bookGeometry, bookVariables, bookPageCSS } from '@k-kinzal/doc-ui/book';

const geometry = bookGeometry('a5');
const pageCSS = bookPageCSS('chapter-one', {
  geometry, title: 'Reading uncertainty', chapter: 'Probability',
});
const manuscript = `
<article class="sheet sheet-paper sheet-book" lang="en" data-dd-book="a5"
         style="${bookVariables(geometry)}" data-dd-color="monochrome"
         data-dd-print-urls="sources">
  <section class="book-page" style="--dd-book-page: chapter-one">
    <header class="paper-head"><h1>Probability</h1></header>
    <div class="prose"><p>A probability describes the likelihood of an outcome.</p></div>
  </section>
</article>`;
// Include pageCSS in a style element after doc-ui and manuscript in body.
```

- Formats are `a5`, `a4`, `b6-jis` (128 × 182 mm), and `letter`. Set geometry
  before drawing figures. Optional millimetre overrides are `width`, `height`,
  `head`, `foot`, `gutter`, `fore`, `leading`, `headGap`, and `folioGap`.
- `data-dd-book` alone does not supply geometry. Include both the generated
  `--dd-book-*` properties and the named `@page` rules. The helpers run while
  authoring; the saved HTML does not need them or browser JavaScript.
- Give each chapter a unique page name and matching `--dd-book-page`. Use
  `furniture: false` for a title page or blank leaf. The helper mirrors binding
  margins and puts heads and folios at the outer edges for left binding.
- Use `.book-cover` for the title division and `.book-toc` for contents links.
  Use one book H1 and H2 chapter headings in a complete manuscript. Resolve
  contents page numbers from actual pagination; do not confuse chapter numbers
  with page numbers.
- Keep prose in `.prose`; reuse paper, equation, citation, and figure components.
  Fit drawings to the type area without scaling their text down. Keep images
  local or embedded. `grayscale` desaturates images; true bitonal artwork needs
  a black-and-white source, not only a grayscale filter.

Generate and inspect a PDF with CSS page size and browser headers/footers
disabled. Check trim, mirrored margins, running heads, folios, continuation
pages, and final text. If recto starts are required, paginate and insert blank
versos as necessary: Chromium does not reliably enforce `break-before: right`.
Repeat pagination after changing fonts, content, or geometry.

The repository's book proof workflow demonstrates PDF-derived contents and
blank-page insertion; `npm run build:book-proofs --workspace @k-kinzal/doc-ui`
rebuilds those specimens. Consumer manuscripts need their own pagination pass.
Source examples: `packages/doc-ui/stories/book.mjs`,
`packages/doc-ui/src/book.mjs`, and `packages/doc-ui/build-book-proofs.mjs`.
